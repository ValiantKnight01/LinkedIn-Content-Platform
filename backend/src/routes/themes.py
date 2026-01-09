from fastapi import APIRouter, HTTPException, status
from typing import List
from ..models.theme import Theme
from ..models.post import Post
from ..schemas.theme import ThemeCreate, ThemeUpdate, ThemeResponse
from ..agents.topic_researcher import research_theme, plan_curriculum
from mongoengine.errors import NotUniqueError, ValidationError, DoesNotExist
from bson import ObjectId

router = APIRouter(prefix="/themes", tags=["Themes"])

def format_theme(theme: Theme) -> dict:
    """Helper to convert MongoEngine document to dict for Pydantic."""
    data = theme.to_mongo().to_dict()
    data["id"] = str(data.pop("_id"))
    return data

def format_post(post: Post) -> dict:
    data = post.to_mongo().to_dict()
    data["id"] = str(data.pop("_id"))
    # Ensure theme is converted to string and removed from data
    if "theme" in data:
        data["theme_id"] = str(data.pop("theme"))
    if "created_at" in data:
        data["created_at"] = data["created_at"].isoformat()
    return data

@router.post("/{id}/plan", response_model=List[dict], status_code=status.HTTP_201_CREATED)
async def plan_theme_curriculum(id: str):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid ID format")

    theme = Theme.objects(id=id).first()
    if not theme:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Theme not found")

    # Clear existing posts for this theme to avoid mess during planning
    # (Optional, but often preferred for "Regenerate Plan")
    Post.objects(theme=theme).delete()

    try:
        # Call Agent
        generated_data = await plan_curriculum(theme.title, theme.month, theme.year)
        
        saved_posts = []
        for item in generated_data:
            post = Post(
                title=item['title'],
                type=item['type'],
                day=item['day'],
                learning_objective=item['learning_objective'],
                difficulty=item['difficulty'],
                search_queries=item['search_queries'],
                theme=theme,
                status='planned'
            )
            post.save()
            saved_posts.append(format_post(post))
            
        return saved_posts
        
    except Exception as e:
        print(f"Curriculum planning failed: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Planning agent failed: {str(e)}")

@router.post("/", response_model=ThemeResponse, status_code=status.HTTP_201_CREATED)
async def create_theme(theme_in: ThemeCreate):
    try:
        theme = Theme(**theme_in.model_dump())
        theme.save()
        return format_theme(theme)
    except NotUniqueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Theme already exists for {theme_in.month}/{theme_in.year}"
        )
    except ValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get("/", response_model=List[ThemeResponse])
async def list_themes():
    themes = Theme.objects.all()
    return [format_theme(t) for t in themes]

@router.get("/{year}/{month}", response_model=ThemeResponse)
async def get_theme_by_date(year: int, month: int):
    theme = Theme.objects(year=year, month=month).first()
    if not theme:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No theme found for {month}/{year}"
        )
    return format_theme(theme)

@router.patch("/{id}", response_model=ThemeResponse)
async def update_theme(id: str, theme_in: ThemeUpdate):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid ID format")
        
    theme = Theme.objects(id=id).first()
    if not theme:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Theme not found")
    
    update_data = theme_in.model_dump(exclude_unset=True)
    if not update_data:
         return format_theme(theme)

    try:
        # Use reload to ensure we return the latest data from DB
        theme.update(**update_data)
        theme.reload()
        return format_theme(theme)
    except NotUniqueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Update failed: A theme already exists for that month/year."
        )
    except ValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_theme(id: str):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid ID format")
        
    theme = Theme.objects(id=id).first()
    if not theme:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Theme not found")
    theme.delete()
    return None