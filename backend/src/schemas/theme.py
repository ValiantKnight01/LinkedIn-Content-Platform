from pydantic import BaseModel, Field
from typing import Optional

class ThemeBase(BaseModel):
    title: str = Field(..., max_length=200)
    description: Optional[str] = None
    month: int = Field(..., ge=1, le=12)
    year: int = Field(..., ge=2000)
    category: Optional[str] = Field(None, max_length=100)

class ThemeCreate(ThemeBase):
    pass

class ThemeUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = None
    month: Optional[int] = Field(None, ge=1, le=12)
    year: Optional[int] = Field(None, ge=2000)
    category: Optional[str] = Field(None, max_length=100)

class ThemeResponse(ThemeBase):
    id: str

    class Config:
        from_attributes = True
