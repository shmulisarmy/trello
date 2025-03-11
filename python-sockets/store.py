import asyncio
from fastapi import WebSocket


from typing import Literal

from stuff import broadcast_json


Visibility = Literal["public", "private"]


StoreType = Literal["Store", "Password_based_Store"]


class Store:
    instances: dict[str, StoreType] = {}
    def __init__(self, name: str = "", viability: Visibility = "public", data: dict = {}):
        self.data = data
        self.viability: Visibility = viability
        self.clients = []
        self.name: str = name
        Store.instances[self.name] = self

        # asyncio.create_task(self.broadcast_join())

    async def broadcast_join(self):
        print(f"broadcasting join to {self.viability} store {self.name}")
        await asyncio.sleep(1)
        print("slept in " + self.name, self.viability, "store")
        if self.viability == "public":
            await broadcast_json({"type": "store-join", "store-name": self.name})
        return f"ok from {self.name} {self.viability} store"

    async def on_client_join(self, client: WebSocket):
        if self.viability == "public":
            raise Exception("this store gets broadcast to everyone and does not need clients to be added")
        if self.viability == "private":
            self.clients.append(client)
            await client.send_json({"type": "store-join", "store-name": self.name})

    async def on_client_leave(self, client: WebSocket):
        if self.viability == "private":
            self.clients.remove(client)
            await client.send_json({"type": "store-leave", "store-name": self.name})

    async def set(self, key, value):
        self.data[key] = value
        if self.viability == "public":
            await broadcast_json({"type": "store-set", "store-name": self.name, "key": key, "value": value})
        else:
            for client in self.clients:
                client: WebSocket
                await client.send_json({"type": "store-set", "store-name": self.name, "key": key, "value": value})

    def get(self, key):
        return self.data.get(key, None)

    async def remove(self, key):
        del self.data[key]
        if self.viability == "public":
            await broadcast_json({"type": "store-remove-key", "store-name": self.name, "key": key})
        else:
            for client in self.clients:
                client: WebSocket
                await client.send_json({"type": "store-remove-key", "store-name": self.name, "key": key})


    @classmethod
    async def join_into_all_public_stores(cls, websocket: WebSocket):
        coroutines = []
        for store in cls.instances.values():
            print(f"joining store {store.name}")
            print(store.data)
            print(store.viability)
            if store.viability == "public":
                coroutines.append(websocket.send_json({"type": "store-join", "store-name": store.name, "data": store.data}))
        for coroutine in coroutines:
            await coroutine
        



class Password_based_Store(Store):
    def __init__(self, name: str = "", viability: Visibility = "public", data: dict = {}, password: str = ""):
        super().__init__(name, viability, data)
        self.per_field_passwords: dict = {}


    async def change_password(self, key, password, newPassword):
        if password != self.password:
            return
        self.per_field_passwords[key] = newPassword

    async def create_new_field_with_password(self, key, password):
        if key in self.per_field_passwords:
            return
        self.per_field_passwords[key] = password
        await super().set(key, password, None)

    async def set(self, key, password, value):
        if self.per_field_passwords.get(key, None) and password != self.per_field_passwords.get(key, None):
            return
        await super().set(key, value)
