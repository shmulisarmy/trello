from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from flask.typing import ResponseClass


auth_router = APIRouter(prefix="/auth")
templates = Jinja2Templates("templates")


@auth_router.get("/login", response_class=HTMLResponse)
def login_page(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})
