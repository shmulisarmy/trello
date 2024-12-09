from ast import arg
from dataclasses import dataclass, fields, asdict, is_dataclass
from pydantic import BaseModel


from pickle import TRUE
import sqlite3



print("helo me")
print("yo prove")




class QueryBuilder:
    connection = None
    def display(self):
        print(f"query: {self.string} \nargs: {self.args}")
        return self


    def where(self, conditions, *args):
        """this is a function"""
        
        self.string += " where " + " and ".join(conditions)
        self.args.extend(args)
        return self


# QueryBuilder.connection = sqlite3.connect("todos.db")
def func():
    print("this is a function")


    
class Update(QueryBuilder):
    def __init__(self, table_name):
        self.string = f"update {table_name}"
        self.args = []

    def set(self, **kwargs):
        self.string += f" set {", ".join(f'{key} = ?' for key in kwargs)}"
        self.args.extend(kwargs.values())
        return self
    
    def __call__(self, connection: sqlite3.Connection):
        QueryBuilder.connection = connection

        if not QueryBuilder.connection:
            raise("you did not provide a connection to 'QueryBuilder.connection'")
        cursor: sqlite3.Cursor = QueryBuilder.connection.cursor()
        print(f"executing {self.string} with args: {self.args}")
        cursor.execute(self.string, self.args)
        connection.commit()
        connection.close()
        return cursor.rowcount






class Insert_into(QueryBuilder):
    def __init__(self, tableName, **kwargs):
        self.string = f"insert into {tableName}({", ".join(key for key in kwargs)}) values ({", ".join("?" for _ in kwargs)})"
        self.args = list(kwargs.values())


    def __call__(self, connection: sqlite3.Connection):
        print(f"in executer, {self.string = } {self.args = }")

        cursor: sqlite3.Cursor = connection.cursor()
        cursor.execute(self.string, self.args)

        connection.commit()
        connection.close()
        return cursor.rowcount

        

class Select(QueryBuilder):
    def __init__(self, *args):
        args = list(args)
        self.return_type = "tuple"
        
        class_was_passed_in: bool = len(args) == 1 and str(type(args[0])) in ("<class 'type'>", "<class 'function'>")
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

    def order_by(self, arg):
        self.string += f"order by {arg}"

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



    def __call__(self, connection, fetch_amount="many"):
        QueryBuilder.connection = connection
        if not QueryBuilder.connection:
            raise("you did not provide a connection to 'QueryBuilder.connection'")

        cursor = QueryBuilder.connection.cursor()
        cursor.execute(self.string, self.args)
        fields = [i[0] for i in cursor.description]

        if fetch_amount == "one":
            row = cursor.fetchone()
            return {key: row[i] for i, key in enumerate(fields)}

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
        return bool(cursor.rowcount)










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
        






def createFrom(class_instance) -> Insert_into:
    # Check if the instance is a dataclass
    if is_dataclass(class_instance):
        data = asdict(class_instance)
    # Check if the instance is a Pydantic BaseModel
    elif isinstance(class_instance, BaseModel):
        data = class_instance.dict()
    else:
        raise TypeError("Unsupported type. Only dataclass or Pydantic BaseModel are supported.")
    
    # Remove the "id" field if it exists
    data.pop("id", None)
    
    # Use the class name and data to create the Insert_into statement
    return Insert_into(class_instance.__class__.__name__, **data)
