"""
Data Models for Nutrition Semantic Web
Defines Python classes representing RDF entities in the triple store
"""

from dataclasses import dataclass
from typing import Optional, List
from datetime import datetime


@dataclass
class User:
    """User model representing a person with dietary preferences"""
    id: Optional[str] = None
    name: str = ""
    email: str = ""
    age: Optional[int] = None
    gender: Optional[str] = None
    diet_type: Optional[str] = None  # Végétarien, Végan, etc.
    allergies: Optional[List[str]] = None
    preferences: Optional[List[str]] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'age': self.age,
            'gender': self.gender,
            'diet_type': self.diet_type,
            'allergies': self.allergies or [],
            'preferences': self.preferences or [],
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }


@dataclass
class Diet:
    """Diet model representing a dietary regimen"""
    id: Optional[str] = None
    name: str = ""
    description: str = ""
    type: str = ""  # Végétarien, Végan, Méditerranéen, etc.
    restrictions: Optional[List[str]] = None
    benefits: Optional[List[str]] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'type': self.type,
            'restrictions': self.restrictions or [],
            'benefits': self.benefits or [],
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }


@dataclass
class Nutrient:
    """Nutrient model representing a nutritional component"""
    id: Optional[str] = None
    name: str = ""
    type: str = ""  # Vitamine, Minéral, Protéine, etc.
    unit: str = ""  # mg, g, μg, etc.
    daily_value: Optional[float] = None
    description: Optional[str] = None
    benefits: Optional[List[str]] = None
    sources: Optional[List[str]] = None  # Food sources
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'type': self.type,
            'unit': self.unit,
            'daily_value': self.daily_value,
            'description': self.description,
            'benefits': self.benefits or [],
            'sources': self.sources or [],
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }


@dataclass
class Food:
    """Food model representing a food item"""
    id: Optional[str] = None
    name: str = ""
    category: str = ""  # Fruit, Légume, Viande, etc.
    calories: Optional[float] = None
    proteins: Optional[float] = None
    carbohydrates: Optional[float] = None
    fats: Optional[float] = None
    fiber: Optional[float] = None
    description: Optional[str] = None
    nutrients: Optional[List[str]] = None  # List of nutrient IDs
    allergens: Optional[List[str]] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'calories': self.calories,
            'proteins': self.proteins,
            'carbohydrates': self.carbohydrates,
            'fats': self.fats,
            'fiber': self.fiber,
            'description': self.description,
            'nutrients': self.nutrients or [],
            'allergens': self.allergens or [],
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
