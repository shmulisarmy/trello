from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import psycopg2
import psycopg2.extras
import os, uvicorn
from dotenv import load_dotenv
from fastapi.staticfiles import StaticFiles


load_dotenv()

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")


from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


mock_user_id = 1

# DATABASE_CONFIG: str = os.environ.get("DATABASE_CONFIG")
DATABASE_CONFIG: str = "postgresql://neondb_owner:IQp4d1ZwzbVm@ep-falling-bird-a8mn4yxu.eastus2.azure.neon.tech/neondb?sslmode=require"
class User(BaseModel):
    id: int
    name: str
    email: str | None
    password: str | None
    available_ingredients: dict | None
class Recipe(BaseModel):
    id: int
    name: str
    image_url: str
    ingredients: dict
    message: str
    time_to_make: int
    is_liked: int
    creator_id: int
    creator_name: str
    

conn = psycopg2.connect(DATABASE_CONFIG)

def get_connection():
    global conn
    try:
        conn.poll()
    except psycopg2.InterfaceError:
        conn = psycopg2.connect(DATABASE_CONFIG)
    finally:
        return conn.cursor()



@app.get("/users", response_model=list[User])
def get_users():
    """
    Endpoint to fetch all users.
    """
    with get_connection() as cursor:
        try:
            cursor.execute("SELECT id, name, email, password, available_ingredients FROM users")
            users = cursor.fetchall()
            return users
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
        finally:
            cursor.close()

@app.get("/users/{user_id}", response_model=User)
def get_user(user_id: int):
    """
    Endpoint to fetch a specific user by ID.
    """
    with get_connection() as cursor:
        try:
            cursor.execute(
                "SELECT id, name, email, password, available_ingredients FROM users WHERE id = %s", 
                (user_id,)
            )
            user = cursor.fetchone()
            if not user:
                raise HTTPException(status_code=404, detail="User not found")
            return user
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
        finally:
            cursor.close()


def get_rows(cursor):
    rv = [{k: row[i] for i, k in enumerate(cursor.description)}for row in cursor.fetchall()]
    print(f'{rv = }')
    
    return rv

@app.get("/recipes", response_model=list[Recipe])
def get_recipes():
    """
    Endpoint to fetch all recipes.
    """
    
    with get_connection() as cursor:
        try:
            cursor.execute("""
                SELECT users.id as creator_id, users.name as creator_name, recipes_recipe.id, recipes_recipe.name, image_url, ingredients, message, time_to_make, recipes_recipe.created_by,
                case 
                    when likes.user_id is not null then true else false
                end as is_liked
                FROM recipes_recipe join users on users.id = recipes_recipe.created_by
                    left join likes on likes.user_id = %s and likes.recipe_id = recipes_recipe.id""", (mock_user_id,))
            print(f"{[i[0] for i in cursor.description] = }")
            rv = [{keys[0]: row[i] for i, keys in enumerate(cursor.description)}for row in cursor.fetchall()]
            print(f'{rv = }')
            return rv
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
@app.get("/recipes/{recipe_id}", response_model=Recipe)
def get_recipe(recipe_id: int):
    """
    Endpoint to fetch a specific recipe by ID.
    """
    with get_connection() as cursor:
        try:
            cursor.execute(
                """
                SELECT id, name, image_url, ingredients, message, time_to_make 
                FROM recipes_recipe 
                WHERE id = %s
                """, 
                (recipe_id,)
            )
            recipe = cursor.fetchone()
            if not recipe:
                raise HTTPException(status_code=404, detail="Recipe not found")
            return recipe
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
        finally:
            cursor.close()


if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)