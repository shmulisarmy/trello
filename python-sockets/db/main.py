from __future__ import print_function
import asyncio
from dataclasses import field
from os import environ
from socketserver import StreamRequestHandler
import stat
from typing import List, Optional

from fastapi.responses import JSONResponse
from pydantic import BaseModel
from pydantic.dataclasses import dataclass

from dotenv import load_dotenv
from typing import Dict, Any, Optional

from .util import recursive_same_except_for
from .cache import db_cache


# from .util import recursive_json_display
load_dotenv()
import psycopg2

@dataclass
class Person:
    name: str
    age: int
    image: str
    gender: str
    is_descendant: bool
    removed: bool
    id: int
    children: Optional[List["Person"]] = field(default_factory=list)
    spouse: Optional["Person"] = None

class Globals:
    people: Person




# Globals.people = Person(name="zaidy", age=30, image="", gender="male", is_descendant=True, removed=False, id=1, spouse=None, children=[
#     Person(name="yossi", age=57, image="", gender="male", is_descendant=True, removed=False, id=2, spouse=None, children=[
#         Person(name="shmuli", age=21, image="", gender="male", is_descendant=True, removed=False, id=3, children=[], spouse=None)
#     ])
# ])


from fastapi import APIRouter
db_router = APIRouter()


connection = psycopg2.connect(environ.get("DATABASE_URL"))
def get_cursor():
        """Get a new cursor, ensuring the connection is active."""
        conn = get_connection()
        return conn.cursor()


def get_connection():
    global connection
    """Ensure the database connection is active, and return it."""
    if connection is None or connection.closed:
        connection = psycopg2.connect(environ.get("DATABASE_URL"))
    return connection


def db_get_or_set(query: str, values: tuple):
    if (query, values) in db_cache:
        return db_cache[(query, values)]
    else:
        cursor = get_cursor()
        cursor.execute(query, values)
        result = cursor.fetchall()
        db_cache[(query, values)] = result
        return result

class nameSpace_DB:
    
    @staticmethod
    @db_router.get("/get_family/{parent_id}")
    def get_family(parent_id: int) -> dict:
        cursor = get_cursor()
        cursor.execute("SELECT get_family(%s)", (parent_id,))

        res = cursor.fetchone()[0]

        print(f'get_family: {res = }')
        print(f'get_family: {isinstance(res, dict) = }')
        
        return res

    class namespace_Person:
        @staticmethod
        async def create(
            name: str,
            age: int,
            image: bytes,
            gender: str,
            is_descendant: bool,
            removed: bool,
            spouse_id: Optional[int] = None,
            parent_id: Optional[int] = None,
        ) -> int:
            """
            See db_schema.json for the database table schema
            """
            cursor = get_cursor()
            cursor.execute("""
            INSERT INTO person (name, age, image, gender, is_descendant, removed, spouse_id, parent_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
            """, (name, age, image, gender, is_descendant, removed, spouse_id, parent_id))
            person_id = cursor.fetchone()[0]
            nameSpace_DB.connection.commit()
            return person_id
        @db_router.get("/all")
        async def get_people_from_db():
            """
            this is a fastapi route that returns all people from the db
            """
            return db_get_or_set("SELECT * FROM person", ())

        @staticmethod
        @db_router.post("/person_from_json_tree")
        async def process_person(data: Dict[str, Any], parent_id: Optional[int] = None) -> int:
            # image_data = base64.b64decode(data["image"]) if data.get("image") else None
            image_data = data.get("image")
            person_id = await nameSpace_DB.namespace_Person.create(
                name=data["name"],
                age=data["age"],
                image=image_data,
                gender=data.get("gender"),
                is_descendant=data.get("is_descendant"),
                removed=data.get("removed"),
                spouse_id=None,
                parent_id=parent_id,
            )
            
            if data.get("spouse"):
                spouse_id = await nameSpace_DB.namespace_Person.process_person(data["spouse"])
                cursor = get_cursor()
                cursor.execute("UPDATE person SET spouse_id = %s WHERE id = %s", (spouse_id, person_id))
                nameSpace_DB.connection.commit()
            
            if data.get("children"):
                for child in data["children"]:
                    await nameSpace_DB.namespace_Person.process_person(child, parent_id=person_id)
            
            return person_id
            
        @staticmethod
        @db_router.post("/create_person")
        async def create_person_endpoint(person_data: Dict[str, Any]):
            try:
                await nameSpace_DB.namespace_Person.process_person(person_data)
                return {"message": "Person and related data inserted successfully"}
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))


        @staticmethod
        @db_router.delete("/delete_person/{person_id}", response_class=JSONResponse)
        async def delete_person_endpoint(person_id: int):
           cursor = get_cursor()
           cursor.execute("update person set removed = true WHERE id = %s", (person_id,))
           nameSpace_DB.connection.commit()
           return {"message": "Person deleted successfully"}













async def test_process_person_and_get_family():
    """
    func type: integration test, adds records to the db
    could also fail because the 'example_person_json' data is not up to date with db schema found in 'db_schema.json'"""
    example_person_json = {
            "name": "zaidy",
            "age": 70,
            "image": "alice.jpg",
            "gender": "Female",
            "is_descendant": False,
            "removed": False,
            "spouse": {
                "name": "bubby",
                "age": 70,
                "image": "bob.jpg",
                "gender": "Male",
                "is_descendant": False,
                "removed": False
            },
            "children": [
                {
                "name": "daddy",
                "age": 57,
                "image": "charlie.jpg",
                "gender": "Male",
                "is_descendant": True,
                "removed": False,
                "spouse": {
                    "name": "mom",
                    "age": 51,
                    "image": "diana.jpg",
                    "gender": "Male",
                    "is_descendant": True,
                    "removed": False
                },
                "children": [
                    {
                    "name": "shmuli",
                    "age": 21,
                    "image": "eve.jpg",
                    "gender": "Male",
                    "is_descendant": True,
                    "removed": False,
                    "spouse": None,
                    "children": None
                    }
                ]
                }
            ]
            }
    top_of_tree_id: int = await nameSpace_DB.namespace_Person.process_person(example_person_json)
    # top_of_tree_id: int = 26
    assert recursive_same_except_for( nameSpace_DB.get_family(top_of_tree_id) , example_person_json , ['parent_id', 'id', 'spouse_id'])




# asyncio.run(test_process_person_and_get_family())