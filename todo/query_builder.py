from dataclasses import dataclass, fields, asdict


import sqlite3





class QueryBuilder:
    connection = None
    def display(self):
        print(f"query: {self.string} \nargs: {self.args}")
        return self


    def where(self, conditions, *args):
        self.string += " where " + " and ".join(conditions)
        self.args.extend(args)
        return self


# QueryBuilder.connection = sqlite3.connect("todos.db")


    
class Update(QueryBuilder):
    def __init__(self, table_name):
        self.string = f"update {table_name}"
        self.args = []

    def set(self, **kwargs):
        self.string += f" set {", ".join(f'{key} = ?' for key in kwargs)}"
        self.args.extend(kwargs.values())
        return self
    
    def __call__(self, connection):
        QueryBuilder.connection = connection

        if not QueryBuilder.connection:
            raise("you did not provide a connection to 'QueryBuilder.connection'")
        cursor = QueryBuilder.connection.cursor()
        print(f"executing {self.string} with args: {self.args}")
        cursor.execute(self.string, self.args)
        fields = [i[0] for i in cursor.description]
        for row in cursor.fetchall():
            for i, col in enumerate(row):
                print(f"{fields[i]}: {col}", end="  ")
            print()

        connection.close()
        
        return {"rows": cursor.fetchall(), "colls": fields}




class Insert_into(QueryBuilder):
    def __init__(self, tableName, **kwargs):
        self.string = f"insert into {tableName}({", ".join(key for key in kwargs)}) values ({", ".join("?" for _ in kwargs)})"
        self.args = list(kwargs.values())


    def __call__(self, connection: sqlite3.Connection):
        print(f"in executer, {self.string = } {self.args = }")

        cursor: sqlite3.Cursor = connection.cursor()
        cursor.execute(self.string, tuple(arg for arg in self.args))

        connection.commit()
        connection.close()
        if cursor.rowcount:
            return True
        return False

        

class Select(QueryBuilder):
    def __init__(self, *args):
        args = list(args)
        self.return_type = "tuple"
        class_was_passed_in: bool = len(args) == 1 and str(type(args[0])) == "<class 'type'>"
        if class_was_passed_in:
            passed_in_class = args[0]
            self.return_type = passed_in_class

            field_names = ", ".join(field.name for field in fields(passed_in_class))
            self.string = f"select {field_names} from {passed_in_class.__name__}"
        elif len(args) > 0:
            print(f'{str(type(args[0])) = }')
            
            self.string = f"select {", ".join(args) if args else "*"}"
        else: 
            self.string = "select * "
        self.args = []

    def join(self, tableName, on=None, args=[]):
        self.string += f" join {tableName} {f"on {on}" if on else ""}"
        self.args.extend(args)
        return self

    def From(self, tableName):
        self.string += f" from {tableName}"
        return self
    
    def to_type(self, rows):
        restult = []
        for row in rows:
            restult.append(self.return_type(*row))
        return restult



    def __call__(self, connection):
        
        QueryBuilder.connection = connection
        if not QueryBuilder.connection:
            raise("you did not provide a connection to 'QueryBuilder.connection'")

        cursor = QueryBuilder.connection.cursor()
        cursor.execute(self.string, self.args)
        fields = [i[0] for i in cursor.description]
        rows = cursor.fetchall()
        if self.return_type != "tuple":
            return self.to_type(rows)
        return {"rows": rows, "colls": fields}







class Delete(QueryBuilder):
    def __init__(self, table_name):
        self.string = f"delete from {table_name}"
        self.args = []


    def __call__(self, connection: sqlite3.Connection):
        print(f"in executer, {self.string = } {self.args = }")

        cursor: sqlite3.Cursor = connection.cursor()
        cursor.execute(self.string, tuple(arg for arg in self.args))

        connection.commit()
        connection.close()
        if cursor.rowcount:
            return True
        return False










# @dataclass
# class users:
#     id: int
#     name: str
#     email: int

#     def say_hi(self):
#         print(f"hi my name is {self.name}")


#     def web_component(self, slot="") -> str:
#         fields_as_attributes = (f'{field}="{value}"' for field, value in asdict(self).items())
#         return f"""<users-instance {" ".join(fields_as_attributes)}>{slot}</users-instance>"""
        






def createFrom(class_instance):
    dict = asdict(class_instance)
    del dict["id"]
    return Insert_into(class_instance.__class__.__name__, **dict)
