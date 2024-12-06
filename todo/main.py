from collections import UserList
from fastapi import FastAPI, Request, Response, HTTPException, Form
from fastapi.responses import RedirectResponse

from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from flask import redirect, request
from pydantic import BaseModel
import sqlite3
from dataclasses import dataclass
from typing import List
import uvicorn



from query_builder import QueryBuilder, Select, Insert_into, Update, Delete, createFrom


database_name = "trello.db"


app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")


templates = Jinja2Templates(directory="templates")


global_session = {"name": None}


class TodoCreate(BaseModel):
    name: str
    description: str

@dataclass
class todos:
    id: int
    name: str
    description: str


@app.get("/")
async def root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/todos")
async def get_todos(request: Request):
    
    todos_data = Select(todos)(db_connect())  
    return templates.TemplateResponse("index.html", {"request": request, "todos": todos_data})

def db_connect():
    return sqlite3.connect(database_name, timeout=1000000)


@app.get("/delete-todo/{id}")
async def get_todos(id: int, request: Request):
    print(f'{id = }')
    Delete(todos.__name__).where(["id = ?"], id)(db_connect())
    
    return "deleted"


@app.post("/todo", response_class=HTMLResponse)
async def create_todo(todo: TodoCreate):
    name = todo.name
    description = todo.description

    return f"""
        <div class="todo">
            <h1>{name}</h1>
            <p>{description}</p>
        </div>
"""

    print(f'{name = }')
    print(f'{description = }')

    createFrom(todos(None, name, description)).display()
    createFrom(todos(None, name, description))(sqlite3.connect(database_name, timeout=1000000))

    return f"""
        <div class="todo">
            <h1>{name}</h1>
            <p>{description}</p>
        </div>
    """
    




@app.get("/login")
def login_page(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})


@app.get("/dash_board")
def dash_board():
    import time
    time.sleep(1)
    print(f'{global_session['name'] = }')
    
    if not global_session['name']:
        return RedirectResponse("/login", 302)
    
    return {
        "boards": Select("board.*").From("board").join(
            "relation_users_board", on=f"users_id = ({Select(
                "id").From("users").where(["name = ?"]).string})  ", args=[global_session['name']]).display()(sqlite3.connect("trello.db"))
        }


@app.post("/login")
def login_action(request:Request, username: str = Form(...), password: str = Form(...)):
    db_res = Select("name").From("users").where(["name = ?", "password = ?"], username, password)(sqlite3.connect("trello.db"))

    print(f'{db_res = }')
    

    if not db_res["rows"]:
        return {"status": "failure"}

    global_session["name"] = db_res['rows'][0][0]
    return RedirectResponse(url="/dash_board", status_code=302)




    






if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)