from fastapi import APIRouter, HTTPException, status
from ..models.post import Post
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
            difficulty=post.difficulty or "Beginner"
        )
        
        # Update Post
        post.update(
            set__sources=research_data.get('sources', []),
            set__summary=research_data.get('summary', ""),
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