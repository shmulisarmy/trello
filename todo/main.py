from collections import UserList, defaultdict
import json


from fastapi import FastAPI, Request, Response, HTTPException, Form, Cookie, Depends
from fastapi.websockets import WebSocket
from fastapi.responses import JSONResponse, RedirectResponse, HTMLResponse
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel


from pydantic import BaseModel
import sqlite3
from dataclasses import dataclass
from typing import List
from pygame import Cursor
import uvicorn



from query_builder import QueryBuilder, Select, Insert_into, Update, Delete, createFrom

from routes.users import users_route 
from routes.auth import auth_router


database_name = "trello.db"


app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(users_route)
app.include_router(auth_router)


templates = Jinja2Templates(directory="templates")


global_session = {"name": "jondo"}


board_page_subscribers = {

}



move_protocol_data = {
    "type": "move_element_protocol",
    "element_id": "task-2",
    "target_id": "list-2"
}

@app.websocket("/ws")
async def ws(websocket: WebSocket):
    await websocket.accept()
    print(f'accepted connection: {websocket}')
    
    while True:
        received_json = json.loads(await websocket.receive_text())
        print(f'received {received_json} from {websocket}')
        if received_json["type"] == "subscribe_to_board_page":
            is_in_board = Select("id").From("users_board_relation").where("users_id = ?", Select("id").From("users_board_relation").where("user_id = ?"))
        

def db_connect():
    return sqlite3.connect(database_name, timeout=1000000)


@app.get("/delete-todo/{id}")
async def get_todos(id: int, request: Request):
    print(f'{id = }')
    Delete(todos.__name__).where(["id = ?"], id)(db_connect())
    
    return "deleted"








@app.get("/dash_board")
def dash_board(request: Request):
    print(f'{global_session['name'] = }')
    
    if not global_session['name']:
        return RedirectResponse("/login", 302)
    
    return templates.TemplateResponse("dash_board.html", {
        "request": request,
        "boards": Select("board.*").From("board inner").join(
            "relation_users_board", on=f"relation_users_board.users_id = ({Select(
                "id").From("users").where(["users.name = ?"]).string})  ", args=[global_session['name']]
                ).where(["relation_users_board.board_id = board.id"], ).display()(sqlite3.connect("trello.db"))
        })


@app.post("/login")
def login_action(request:Request, response: Response, username: str = Form(...), password: str = Form(...)):
    db_res = Select("name").From("users").where(["name = ?", "password = ?"], username, password)(sqlite3.connect("trello.db"))

    print(f'{db_res = }')
    

    if not db_res["rows"]:
        return {"status": "wrong username or password"} 


    print("response", response.__dict__)

    response.set_cookie(
        key="name", 
        value=db_res['rows'][0][0], 
        httponly=True,  
        secure=True,    
        samesite="Strict"  
    )

    print("response", response.__dict__)
    
    return {"message": "HTTP-only cookie has been set!"}

    return RedirectResponse(url="/dash_board", status_code=302)











@app.get("/board/{id}", response_class=HTMLResponse)
def get_board(id: int, request: Request):
    connection = sqlite3.connect("trello.db")


    raw_tasks = Select("tasks.*").From("tasks").where(["board_id = ?"], id)(connection)
    tasks_by_list = defaultdict(list)
    for task in raw_tasks['rows']:
        tasks_by_list[task[raw_tasks['colls'].index("list_id")]].append(task)

    return templates.TemplateResponse("board.html", {"request": request,
    "board": Select("board.*").From("board").join(
            "relation_users_board", on=f"relation_users_board.users_id = ({Select(
                "id").From("users").where(["users.name = ?"]).string})  ", args=[global_session['name']]
                ).where(["relation_users_board.board_id = board.id", "board.id = ?"], id).display()(connection, "one"),
    "lists": Select("list.*").From("list").join("board", on="board.id = list.board_id").where(["board.id = ?"], id)(connection),
    "tasks_by_list": tasks_by_list,
    "task_cols": raw_tasks['colls']
    })
        


class MoveTaskRequest(BaseModel):
    list_id: int
    task_id: int
    


@app.patch("/move_task", response_class=JSONResponse)
def move_task(request: MoveTaskRequest):
    for i in range(1000): print(f"{request = }")


    rowcount = Update("tasks").set(list_id = request.list_id).where(["id = ?"], request.task_id).display()(sqlite3.connect("trello.db"))

    print(f"{rowcount = }")

    if rowcount == 1:
        return {
            "type": "move_element_protocol",
            "element_id":  f"task-{request.task_id}",
            "target_id":  f"list-{request.list_id}-container",
        }
    
    return {"type": "none"}
    


class tasks(BaseModel):
    name: str
    description: str
    list_id: int
    board_id: int

@app.post("/tasks")
def create_task(request: tasks):
    print(f'{request = }')
    

@app.get("/add_task")
def add_task_page(request: Request, list_id: int):
    return templates.TemplateResponse("add_task.html", {"request": request, "list_id": list_id})


@app.post("/add_task")
async def add_task(request: tasks):
    for i in range(1000): print(f'{request = }')


    user_id: tuple[int|None] = Select("id").From("users").where(["name = ?"], global_session['name'])(sqlite3.connect("trello.db"), fetch_amount='one')
    
    if not user_id:
        return "method not allowed"

    was_created: bool = createFrom(request).join("users_board_relation", on="users_id = ? and board_id = ?", args=[user_id, ]).where([""])(sqlite3.connect("trello.db"))
    if not was_created:
        return templates.TemplateResponse("add_task.html", {"request": request})

    return templates.TemplateResponse("task.html", {"request": request, "created_task": request})


@app.delete("/task/{task_id}", response_class=HTMLResponse)
def delete_task(task_id: int):
    if Delete("tasks").where(["id = ?"], task_id)(sqlite3.connect("trello.db")):
        return ""

    return "<h1>could not delete</h1>"


@app.get("/protected_route", response_class=HTMLResponse)
def protected_route(token: str = Cookie(default=None)):
    print(f'{token = }')
    

    return "this is a protected route"


if __name__ == "__main__":
    import os
    os.system(f"open http://127.0.0.1:8000")
    uvicorn.run("main:app", reload=True)