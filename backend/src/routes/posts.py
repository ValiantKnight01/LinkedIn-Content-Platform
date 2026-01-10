from fastapi import APIRouter, HTTPException, status, Query
from typing import List, Optional
from datetime import datetime
from ..models.post import Post
from ..models.theme import Theme
from ..agents.topic_researcher import research_single_topic
from mongoengine.errors import DoesNotExist, ValidationError
from bson import ObjectId

router = APIRouter(prefix="/posts", tags=["Posts"])

def format_post(post: Post) -> dict:
    data = post.to_mongo().to_dict()
    data["id"] = str(data.pop("_id"))
    if "theme" in data:
        data["theme_id"] = str(data.pop("theme"))
    if "created_at" in data:
        data["created_at"] = data["created_at"].isoformat()
    return data

@router.get("/", response_model=List[dict])
async def list_posts(month: Optional[int] = Query(None), year: Optional[int] = Query(None)):
    """List posts, optionally filtered by month and year via their Theme."""
    if month and year:
        theme = Theme.objects(month=month, year=year).first()
        if not theme:
            return []
        posts = Post.objects(theme=theme)
    else:
        posts = Post.objects.all()

    formatted_posts = []
    for p in posts:
        fp = format_post(p)
        # Construct a 'date' field for the frontend calendar if we have the theme context
        # Or if we fetched it, we can look up the theme. 
        # Since we fetched by theme above, we know the year/month.
        # If listed all, we might need to fetch theme for each (inefficient) or rely on what we have.
        
        # Optimization: If we fetched by theme, use that theme's year/month
        current_theme = p.theme 
        # Note: mongoengine ReferenceField dereferences automatically if accessed, 
        # but 'p.theme' in the loop might trigger a query per post if not careful.
        # However, for the calendar view, we usually fetch by month/year.
        
        if current_theme:
            # Create ISO date string: YYYY-MM-DD
            try:
                # Handle cases where day might be missing (legacy/proposed posts)
                day = p.day if p.day else 1
                date_obj = datetime(current_theme.year, current_theme.month, day)
                fp['date'] = date_obj.isoformat()
            except ValueError:
                fp['date'] = None # Invalid date
        
        formatted_posts.append(fp)
        
    return formatted_posts

@router.post("/{id}/research", response_model=dict, status_code=status.HTTP_200_OK)
async def research_post(id: str):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid ID format")

    post = Post.objects(id=id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")

    if not post.search_queries:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Post does not have search queries. Please (re)plan the theme first."
        )

    try:
        # Call Agent
        research_data = await research_single_topic(
            title=post.title,
            learning_objective=post.learning_objective or "",
            search_queries=post.search_queries,
            difficulty=post.difficulty or "Beginner",
            day=post.day or 1
        )
        
        # Update Post
        post.update(
            set__sources=research_data.get('sources', []),
            set__hook=research_data.get('hook', ""),
            set__sections=research_data.get('sections', []),
            set__key_takeaways=research_data.get('key_takeaways', []),
            set__call_to_action=research_data.get('call_to_action', ""),
            set__hashtags=research_data.get('hashtags', []),
            set__status='researched'
        )
        
        post.reload()
        return format_post(post)
        
    except Exception as e:
        print(f"Deep research failed: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Research agent failed: {str(e)}")

@router.get("/{id}", response_model=dict)
async def get_post(id: str):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid ID format")
    
    post = Post.objects(id=id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    
    return format_post(post)