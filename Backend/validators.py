"""
Pydantic Validators for Data Validation
Ensures data integrity before saving to triple store
"""

from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional, List
from datetime import datetime


class UserSchema(BaseModel):
    """Validation schema for User"""
    name: str = Field(..., min_length=2, max_length=100, description="User's full name")
    email: EmailStr = Field(..., description="User's email address")
    age: Optional[int] = Field(None, ge=1, le=150, description="User's age")
    gender: Optional[str] = Field(None, pattern="^(Male|Female|Other)$", description="User's gender")
    diet_type: Optional[str] = Field(None, description="Dietary preference (Végétarien, Végan, etc.)")
    allergies: Optional[List[str]] = Field(default_factory=list, description="List of allergies")
    preferences: Optional[List[str]] = Field(default_factory=list, description="Food preferences")

    @field_validator('name')
    @classmethod
    def validate_name(cls, v):
        if not v or v.strip() == "":
            raise ValueError('Name cannot be empty')
        return v.strip()

    @field_validator('diet_type')
    @classmethod
    def validate_diet_type(cls, v):
        if v is not None:
            allowed_diets = ['Végétarien', 'Végan', 'Carnivore', 'Pescatarien', 'Méditerranéen', 'Keto', 'Paleo', 'Autre']
            if v not in allowed_diets:
                raise ValueError(f'Diet type must be one of: {", ".join(allowed_diets)}')
        return v

    class Config:
        json_schema_extra = {
            "example": {
                "name": "John Doe",
                "email": "john.doe@example.com",
                "age": 30,
                "gender": "Male",
                "diet_type": "Végétarien",
                "allergies": ["Gluten", "Lactose"],
                "preferences": ["Bio", "Local"]
            }
        }


class UserUpdateSchema(BaseModel):
    """Validation schema for User update (all fields optional)"""
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    email: Optional[EmailStr] = None
    age: Optional[int] = Field(None, ge=1, le=150)
    gender: Optional[str] = Field(None, pattern="^(Male|Female|Other)$")
    diet_type: Optional[str] = None
    allergies: Optional[List[str]] = None
    preferences: Optional[List[str]] = None


class DietSchema(BaseModel):
    """Validation schema for Diet (Repas) - matches ontology"""
    name: Optional[str] = Field(None, min_length=2, max_length=100, description="Meal name (optional)")
    type: str = Field(..., description="Meal type (typeRepas)")
    date: str = Field(..., description="Meal date (ISO format)")
    foods: Optional[List[str]] = Field(default_factory=list, description="List of food IDs")

    @field_validator('type')
    @classmethod
    def validate_type(cls, v):
        allowed_types = ['PetitDéjeuner', 'Déjeuner', 'Dîner', 'Collation']
        if v not in allowed_types:
            raise ValueError(f'Type must be one of: {", ".join(allowed_types)}')
        return v

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Mon petit déjeuner",
                "type": "PetitDéjeuner",
                "date": "2025-10-26T08:00:00",
                "foods": ["Pomme", "Quinoa"]
            }
        }


class DietUpdateSchema(BaseModel):
    """Validation schema for Diet (Repas) update - matches ontology"""
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    type: Optional[str] = None
    date: Optional[str] = None
    foods: Optional[List[str]] = None

    @field_validator('type')
    @classmethod
    def validate_type(cls, v):
        if v is not None:
            allowed_types = ['PetitDéjeuner', 'Déjeuner', 'Dîner', 'Collation']
            if v not in allowed_types:
                raise ValueError(f'Type must be one of: {", ".join(allowed_types)}')
        return v


class NutrientSchema(BaseModel):
    """Validation schema for Nutrient - matches ontology (only nomNutriment)"""
    name: str = Field(..., min_length=2, max_length=100, description="Nutrient name")

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Vitamine C"
            }
        }


class NutrientUpdateSchema(BaseModel):
    """Validation schema for Nutrient update - matches ontology (only nomNutriment)"""
    name: Optional[str] = Field(None, min_length=2, max_length=100)


class FoodSchema(BaseModel):
    """Validation schema for Food"""
    name: str = Field(..., min_length=2, max_length=100, description="Food name")
    category: str = Field(..., description="Food category")
    calories: Optional[float] = Field(None, ge=0, description="Calories per 100g")
    proteins: Optional[float] = Field(None, ge=0, description="Proteins in grams")
    carbohydrates: Optional[float] = Field(None, ge=0, description="Carbohydrates in grams")
    fats: Optional[float] = Field(None, ge=0, description="Fats in grams")
    fiber: Optional[float] = Field(None, ge=0, description="Fiber in grams")
    description: Optional[str] = Field(None, max_length=500)
    nutrients: Optional[List[str]] = Field(default_factory=list)
    allergens: Optional[List[str]] = Field(default_factory=list)

    @field_validator('category')
    @classmethod
    def validate_category(cls, v):
        allowed_categories = ['Fruit', 'Légume', 'Viande', 'Poisson', 'Produit laitier', 'Céréale', 'Légumineuse', 'Noix', 'Autre']
        if v not in allowed_categories:
            raise ValueError(f'Category must be one of: {", ".join(allowed_categories)}')
        return v

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Banane",
                "category": "Fruit",
                "calories": 89.0,
                "proteins": 1.1,
                "carbohydrates": 22.8,
                "fats": 0.3,
                "fiber": 2.6,
                "description": "Fruit tropical riche en potassium",
                "nutrients": ["potassium", "vitamin_b6", "vitamin_c"],
                "allergens": []
            }
        }


class FoodUpdateSchema(BaseModel):
    """Validation schema for Food update"""
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    category: Optional[str] = None
    calories: Optional[float] = Field(None, ge=0)
    proteins: Optional[float] = Field(None, ge=0)
    carbohydrates: Optional[float] = Field(None, ge=0)
    fats: Optional[float] = Field(None, ge=0)
    fiber: Optional[float] = Field(None, ge=0)
    description: Optional[str] = Field(None, max_length=500)
    nutrients: Optional[List[str]] = None
    allergens: Optional[List[str]] = None
