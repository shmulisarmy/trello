from fastapi import APIRouter


get_route_name = lambda full_file_name: full_file_name.split(".")[-1]

users_route = APIRouter(prefix=f"/{get_route_name(__name__)}")


@users_route.get("/{id}")
def get_user(id: int):
    return f"user {id}"
