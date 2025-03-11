import asyncio

from dataclasses import asdict
from pydoc import cli
from re import sub
from fastapi import FastAPI, WebSocket, Request
import uvicorn
from fastapi.templating import Jinja2Templates
import json
from stuff import broadcast_json, messages, clients

from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse



from db.main import Globals, Person, nameSpace_DB, db_router
from store import Store, Password_based_Store



people = Store("people")

app = FastAPI()

app.include_router(db_router, prefix="/db")
templates = Jinja2Templates(directory="templates")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



def on_delete_person(person_id: int, all_ansecctor_ids: list[int]):
    for ansecctor in all_ansecctor_ids:
        for subscribed_client in family_view_subscriptions[ansecctor]:
            subscribed_client: WebSocket
            subscribed_client.send_json({
                "type": 'person-removed',
                'person-id': person_id,
            })
    



names = {}


family_view_subscriptions = {

}

  

async def handle_incoming_json(websocket: WebSocket, message: dict):
    print(f"received {message} from {websocket}")

    match message["type"]:
        case "message":
            await broadcast_json(message)
        case "store-set":
            store = Store.instances[message["store-name"]]
            if isinstance(store, Password_based_Store):
                store: Password_based_Store
                await store.set(message["key"], message["password"], message["value"])
            elif isinstance(store, Store):
                store: Store
                await store.set(message["key"], message["value"])
        case "store-remove-key":
            await Store.instances[message["store-name"]].remove(message["key"])
        case "signup":
            username_store: Password_based_Store = Store.instances["usernames"]
            await username_store.set(message["username"], message["password"], )
        case "family-subscribe":
            family_view_subscriptions[websocket] = message['family-head-id']
        case _:
            raise Exception(f"unknown message type {message['type']}")



@app.get("/broad_cast_to__family_view_subscriptions", response_class=JSONResponse)
def broad_cast_to__family_view_subscriptions():
      for websocket in family_view_subscriptions:
        websocket: WebSocket
        print(websocket)
        websocket.send_json({'hello': 'world'})






@app.get("/api/people", response_class=JSONResponse)
def get_people():
    return JSONResponse(people)


@app.post("/api/people", response_class=JSONResponse)
def set_main_person(person: Person):
    print(f'{person = }')
    people.append(person)
    with open("people.json", "w") as f:
        json.dump(people, f)
    return JSONResponse({"status": "ok"})






@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    names[websocket] = f"user-{len(names)+1}"
    await websocket.send_json({"type": "func", "args": [names[websocket]], "func": "set_my_user_id"})
    clients.append(websocket)
    await Store.join_into_all_public_stores(websocket)
    asyncio.gather(*[websocket.send_json(message) for message in messages])

    
    try:
        while True:
            data = await websocket.receive_text()
            await handle_incoming_json(websocket, json.loads(data))
    except Exception as e:
        print(e)
    finally:
        print(f"client {websocket} disconnected")
        clients.remove(websocket)

from pydantic.dataclasses import dataclass

@dataclass
class User:
    username: str
    password: str

@app.post("/fake/signup")
async def fake_signup(user: User, otheruser: User):
    print(user, otheruser)
    return {"status": "ok"}

@app.on_event("startup")
async def startup():
    print("Starting up...")
    usernames_store = Password_based_Store("usernames", data={"admin": "admin"})
    res = await asyncio.gather(usernames_store.broadcast_join())
    print(res)


route_name_indexes = 1
def r(func, passed_in_name = None):
    if passed_in_name:
        app.add_api_route(f"/{passed_in_name}", func, methods=["GET"], response_class=JSONResponse)
        return
    global route_name_indexes
    app.add_api_route(f"/r{route_name_indexes}", func, methods=["GET"], response_class=JSONResponse)
    route_name_indexes+=1

r(lambda i = 9980 + 8 if 3 < 2 else 0: print('hey there', i), "hey")
def d(var_name: str):
    def func():
        print(globals()[var_name])
        return globals()[var_name]
    app.add_api_route(f"/{var_name}", func, methods=["GET"], response_class=JSONResponse)


d("family_view_subscriptions")
numbers = [1, 2, 3, 4, 5, [1, 4, 9, 16, 25]]
d("numbers")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)