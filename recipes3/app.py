from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles
import uvircorn



app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")


from fastapi.middleware.cors import CORSMiddleware


@app.get("/")
def root(): return "hello"