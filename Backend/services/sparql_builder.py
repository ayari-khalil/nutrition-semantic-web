"""
SPARQL Query Builder
Helper functions to construct SPARQL queries for CRUD operations
"""

from typing import Dict, List, Optional, Any
from datetime import datetime
import uuid


class SPARQLBuilder:
    """Builder class for constructing SPARQL queries"""
    
    NAMESPACE = "http://www.semanticweb.org/gigabytei5/ontologies/2025/9/untitled-ontology-5#"
    
    @staticmethod
    def generate_id(entity_type: str) -> str:
        """Generate a unique ID for an entity"""
        return f"{entity_type}_{uuid.uuid4().hex[:8]}"
    
    @staticmethod
    def get_current_timestamp() -> str:
        """Get current timestamp in ISO format"""
        return datetime.utcnow().isoformat() + "Z"
    
    @staticmethod
    def escape_string(value: str) -> str:
        """Escape special characters in SPARQL strings"""
        if value is None:
            return ""
        return value.replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n')
    
    @classmethod
    def build_insert_user(cls, user_id: str, data: Dict[str, Any]) -> str:
        """Build INSERT query for User (Utilisateur)"""
        # Clean entity_id - remove namespace if present
        clean_id = user_id.split('#')[-1] if '#' in user_id else user_id.split('/')[-1]
        
        query = f"""PREFIX : <{cls.NAMESPACE}>

INSERT DATA {{
    :{clean_id} a :Utilisateur"""
        
        # Required and optional properties
        if data.get('name'):
            query += f' ;\n        :aNom "{cls.escape_string(data["name"])}"'
        
        if data.get('email'):
            query += f' ;\n        :aEmail "{cls.escape_string(data["email"])}"'
        
        if data.get('age'):
            query += f' ;\n        :aAge {data["age"]}'
        
        if data.get('weight'):
            query += f' ;\n        :aPoids {data["weight"]}'
        
        if data.get('height'):
            query += f' ;\n        :aTaille {data["height"]}'
        
        if data.get('gender'):
            query += f' ;\n        :sexe "{cls.escape_string(data["gender"])}"'
        
        # Close the main entity
        query += ' .\n'
        
        # Handle allergies as separate entities
        if data.get('allergies'):
            for allergy in data['allergies']:
                allergy_id = cls.generate_id("Allergie")
                query += f'    :{allergy_id} a :Allergie ;\n'
                query += f'        :aNom "{cls.escape_string(allergy)}" .\n'
                query += f'    :{clean_id} :aAllergie :{allergy_id} .\n'
        
        # Handle preferences as separate entities
        if data.get('preferences'):
            for pref in data['preferences']:
                pref_id = cls.generate_id("Preference")
                query += f'    :{pref_id} a :Préférence ;\n'
                query += f'        :aNom "{cls.escape_string(pref)}" .\n'
                query += f'    :{clean_id} :aPréférence :{pref_id} .\n'
        
        query += '}\n'
        return query
    
    @classmethod
    def build_insert_diet(cls, diet_id: str, data: Dict[str, Any]) -> str:
        """Build INSERT query for Diet (Repas)"""
        # Clean entity_id - remove namespace if present
        clean_id = diet_id.split('#')[-1] if '#' in diet_id else diet_id.split('/')[-1]
        
        query = f"""PREFIX : <{cls.NAMESPACE}>

INSERT DATA {{
    :{clean_id} a :Repas"""
        
        # Meal properties matching your ontology
        if data.get('name'):
            query += f' ;\n        :aNom "{cls.escape_string(data["name"])}"'
        
        if data.get('type'):
            query += f' ;\n        :typeRepas "{cls.escape_string(data["type"])}"'
        
        if data.get('date'):
            query += f' ;\n        :aDate "{cls.escape_string(data["date"])}"^^xsd:dateTime'
        
        # Close the main entity
        query += ' .\n'
        
        # Handle foods relationship if provided
        if data.get('foods'):
            for food in data['foods']:
                # Link to existing food
                query += f'    :{clean_id} :contient :{food} .\n'
        
        query += '}\n'
        return query
    
    @classmethod
    def build_insert_nutrient(cls, nutrient_id: str, data: Dict[str, Any]) -> str:
        """Build INSERT query for Nutrient (Nutriment)"""
        # Clean entity_id - remove namespace if present
        clean_id = nutrient_id.split('#')[-1] if '#' in nutrient_id else nutrient_id.split('/')[-1]
        
        query = f"""PREFIX : <{cls.NAMESPACE}>

INSERT DATA {{
    :{clean_id} a :Nutriment"""
        
        # Nutrient properties matching your ontology
        if data.get('name'):
            query += f' ;\n        :nomNutriment "{cls.escape_string(data["name"])}"'
        
        # Close the entity
        query += ' .\n}\n'
        return query
    
    @classmethod
    def build_insert_food(cls, food_id: str, data: Dict[str, Any]) -> str:
        """Build INSERT query for Food (Aliment)"""
        # Clean entity_id - remove namespace if present
        clean_id = food_id.split('#')[-1] if '#' in food_id else food_id.split('/')[-1]
        
        query = f"""PREFIX : <{cls.NAMESPACE}>

INSERT DATA {{
    :{clean_id} a :Aliment"""
        
        # Food properties matching your ontology
        if data.get('name'):
            query += f' ;\n        :nomAliment "{cls.escape_string(data["name"])}"'
        
        if data.get('calories') is not None:
            query += f' ;\n        :aCalories {int(data["calories"])}'
        
        if data.get('proteins') is not None:
            query += f' ;\n        :aProtéines {float(data["proteins"])}'
        
        if data.get('fats') is not None:
            query += f' ;\n        :aLipides {float(data["fats"])}'
        
        if data.get('carbohydrates') is not None:
            query += f' ;\n        :aGlucides {float(data["carbohydrates"])}'
        
        # Close the main entity
        query += ' .\n'
        
        # Handle nutrients relationship if provided
        if data.get('nutrients'):
            for nutrient in data['nutrients']:
                # Link to existing nutrient
                query += f'    :{clean_id} :aNutriment :{nutrient} .\n'
        
        query += '}\n'
        return query
        if data.get('description'):
            query += f'        :description "{cls.escape_string(data["description"])}" ;\n'
        
        if data.get('nutrients'):
            for nutrient in data['nutrients']:
                query += f'        :hasNutrient :{nutrient} ;\n'
        
        if data.get('allergens'):
            for allergen in data['allergens']:
                query += f'        :hasAllergen "{cls.escape_string(allergen)}" ;\n'
        
        query = query.rstrip(' ;\n') + ' .\n}\n'
        return query
    
    @classmethod
    def build_select_all(cls, entity_type: str, limit: int = 100, offset: int = 0) -> str:
        """Build SELECT query to fetch all entities of a type"""
        
        # Special handling for Utilisateur (User) with all properties
        if entity_type == "Utilisateur":
            query = f"""PREFIX : <{cls.NAMESPACE}>

SELECT DISTINCT ?id 
    (COALESCE(?nomProperty, STRAFTER(STR(?id), "#")) AS ?name)
    ?age ?weight ?height ?gender
WHERE {{
    ?id a :Utilisateur .
    OPTIONAL {{ ?id :aNom ?nomProperty }}
    OPTIONAL {{ ?id :aAge ?age }}
    OPTIONAL {{ ?id :aPoids ?weight }}
    OPTIONAL {{ ?id :aTaille ?height }}
    OPTIONAL {{ ?id :sexe ?gender }}
}}
ORDER BY ?name
LIMIT {limit}
OFFSET {offset}
"""
        elif entity_type == "Aliment":
            # Foods with nutritional properties
            query = f"""PREFIX : <{cls.NAMESPACE}>

SELECT DISTINCT ?id 
    (COALESCE(?nomProperty, STRAFTER(STR(?id), "#")) AS ?name)
    ?calories ?proteins ?lipids ?carbs
WHERE {{
    ?id a :Aliment .
    OPTIONAL {{ ?id :nomAliment ?nomProperty }}
    OPTIONAL {{ ?id :aCalories ?calories }}
    OPTIONAL {{ ?id :aProtéines ?proteins }}
    OPTIONAL {{ ?id :aLipides ?lipids }}
    OPTIONAL {{ ?id :aGlucides ?carbs }}
}}
ORDER BY ?name
LIMIT {limit}
OFFSET {offset}
"""
        elif entity_type == "Nutriment":
            # Nutrients
            query = f"""PREFIX : <{cls.NAMESPACE}>

SELECT DISTINCT ?id 
    (COALESCE(?nomProperty, STRAFTER(STR(?id), "#")) AS ?name)
WHERE {{
    ?id a :Nutriment .
    OPTIONAL {{ ?id :nomNutriment ?nomProperty }}
}}
ORDER BY ?name
LIMIT {limit}
OFFSET {offset}
"""
        elif entity_type == "Repas":
            # Meals
            query = f"""PREFIX : <{cls.NAMESPACE}>

SELECT DISTINCT ?id 
    (COALESCE(?nomProperty, STRAFTER(STR(?id), "#")) AS ?name)
    ?type ?date
WHERE {{
    ?id a :Repas .
    OPTIONAL {{ ?id :aNom ?nomProperty }}
    OPTIONAL {{ ?id :typeRepas ?type }}
    OPTIONAL {{ ?id :aDate ?date }}
}}
ORDER BY ?name
LIMIT {limit}
OFFSET {offset}
"""
        else:
            # Generic query for other entities
            query = f"""PREFIX : <{cls.NAMESPACE}>

SELECT ?id (COALESCE(?nomProperty, STRAFTER(STR(?id), "#")) AS ?name)
WHERE {{
    ?id a :{entity_type} .
    OPTIONAL {{ ?id :aNom ?nomProperty }}
}}
ORDER BY ?name
LIMIT {limit}
OFFSET {offset}
"""
        return query
    
    @classmethod
    def build_select_by_id(cls, entity_id: str) -> str:
        """Build SELECT query to fetch entity by ID"""
        query = f"""
        PREFIX : <{cls.NAMESPACE}>
        
        SELECT ?property ?value
        WHERE {{
            :{entity_id} ?property ?value .
        }}
        """
        return query
    
    @classmethod
    def build_delete(cls, entity_id: str) -> str:
        """Build DELETE query to remove an entity and all its triples"""
        # Handle both cases: "moetaz" and "User_123abc"
        # Clean entity_id - remove namespace if present
        clean_id = entity_id.split('#')[-1] if '#' in entity_id else entity_id.split('/')[-1]
        
        query = f"""PREFIX : <{cls.NAMESPACE}>

DELETE {{
    :{clean_id} ?p ?o .
}}
WHERE {{
    :{clean_id} ?p ?o .
}}
"""
        return query
    
    @classmethod
    def build_update(cls, entity_id: str, data: Dict[str, Any], entity_type: str) -> str:
        """Build UPDATE query (DELETE + INSERT)"""
        # Clean entity_id
        clean_id = entity_id.split('#')[-1] if '#' in entity_id else entity_id.split('/')[-1]
        
        # Map entity type to ontology class
        class_mapping = {
            'User': 'Utilisateur',
            'Food': 'Aliment',
            'Nutrient': 'Nutriment',
            'Diet': 'Repas'
        }
        
        ontology_class = class_mapping.get(entity_type, entity_type)
        
        # Build combined DELETE + INSERT query with single PREFIX
        query = f"""PREFIX : <{cls.NAMESPACE}>

DELETE {{
    :{clean_id} ?p ?o .
}}
WHERE {{
    :{clean_id} ?p ?o .
}};

INSERT DATA {{
    :{clean_id} a :{ontology_class}"""
        
        # Add properties based on entity type
        if entity_type == 'User':
            if data.get('name'):
                query += f' ;\n        :aNom "{cls.escape_string(data["name"])}"'
            if data.get('email'):
                query += f' ;\n        :aEmail "{cls.escape_string(data["email"])}"'
            if data.get('age'):
                query += f' ;\n        :aAge {data["age"]}'
            if data.get('weight'):
                query += f' ;\n        :aPoids {data["weight"]}'
            if data.get('height'):
                query += f' ;\n        :aTaille {data["height"]}'
            if data.get('gender'):
                query += f' ;\n        :sexe "{cls.escape_string(data["gender"])}"'
        
        elif entity_type == 'Food':
            if data.get('name'):
                query += f' ;\n        :nomAliment "{cls.escape_string(data["name"])}"'
            if data.get('calories') is not None:
                query += f' ;\n        :aCalories {int(data["calories"])}'
            if data.get('proteins') is not None:
                query += f' ;\n        :aProtéines {float(data["proteins"])}'
            if data.get('fats') is not None:
                query += f' ;\n        :aLipides {float(data["fats"])}'
            if data.get('carbohydrates') is not None:
                query += f' ;\n        :aGlucides {float(data["carbohydrates"])}'
        
        elif entity_type == 'Nutrient':
            if data.get('name'):
                query += f' ;\n        :nomNutriment "{cls.escape_string(data["name"])}"'
        
        elif entity_type == 'Diet':
            if data.get('name'):
                query += f' ;\n        :aNom "{cls.escape_string(data["name"])}"'
            if data.get('type'):
                query += f' ;\n        :typeRepas "{cls.escape_string(data["type"])}"'
            if data.get('date'):
                query += f' ;\n        :aDate "{cls.escape_string(data["date"])}"^^xsd:dateTime'
        
        query += ' .\n}\n'
        return query
    
    @classmethod
    def build_count(cls, entity_type: str) -> str:
        """Build COUNT query"""
        query = f"""
        PREFIX : <{cls.NAMESPACE}>
        
        SELECT (COUNT(?id) as ?count)
        WHERE {{
            ?id a :{entity_type} .
        }}
        """
        return query
    
    @classmethod
    def build_search(cls, entity_type: str, search_term: str, limit: int = 50) -> str:
        """Build SEARCH query by name"""
        
        if entity_type == "Utilisateur":
            # Special handling for User search with all properties
            query = f"""PREFIX : <{cls.NAMESPACE}>

SELECT DISTINCT ?id 
    (COALESCE(?nomProperty, STRAFTER(STR(?id), "#")) AS ?name)
    ?age ?weight ?height ?gender
WHERE {{
    ?id a :Utilisateur .
    OPTIONAL {{ ?id :aNom ?nomProperty }}
    OPTIONAL {{ ?id :aAge ?age }}
    OPTIONAL {{ ?id :aPoids ?weight }}
    OPTIONAL {{ ?id :aTaille ?height }}
    OPTIONAL {{ ?id :sexe ?gender }}
    
    BIND(COALESCE(?nomProperty, STRAFTER(STR(?id), "#")) AS ?searchName)
    FILTER(CONTAINS(LCASE(?searchName), LCASE("{cls.escape_string(search_term)}")))
}}
ORDER BY ?name
LIMIT {limit}
"""
        else:
            # Generic search for other entities
            query = f"""PREFIX : <{cls.NAMESPACE}>

SELECT ?id (COALESCE(?nomProperty, STRAFTER(STR(?id), "#")) AS ?name)
WHERE {{
    ?id a :{entity_type} .
    OPTIONAL {{ ?id :aNom ?nomProperty }}
    
    BIND(COALESCE(?nomProperty, STRAFTER(STR(?id), "#")) AS ?searchName)
    FILTER(CONTAINS(LCASE(?searchName), LCASE("{cls.escape_string(search_term)}")))
}}
ORDER BY ?name
LIMIT {limit}
"""
        return query
