"""
CRUD Service
Main service for Create, Read, Update, Delete operations on RDF triple store
"""

import requests
from typing import Dict, List, Optional, Any
from services.sparql_builder import SPARQLBuilder
from models import User, Diet, Nutrient, Food
import os


class CRUDService:
    """Service class for CRUD operations"""
    
    def __init__(self, fuseki_url: str = None):
        """Initialize CRUD service with Fuseki endpoint"""
        self.fuseki_url = fuseki_url or os.getenv('FUSEKI_URL', 'http://localhost:3030/nutrition/sparql')
        self.update_url = fuseki_url or os.getenv('FUSEKI_UPDATE_URL', 'http://localhost:3030/nutrition/update')
        self.builder = SPARQLBuilder()
    
    def _execute_query(self, query: str) -> Dict:
        """Execute SPARQL SELECT query"""
        try:
            response = requests.post(
                self.fuseki_url,
                data={'query': query},
                headers={'Accept': 'application/sparql-results+json'},
                timeout=10
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            raise Exception(f"Failed to execute SPARQL query: {str(e)}")
    
    def _execute_update(self, query: str) -> bool:
        """Execute SPARQL INSERT/DELETE/UPDATE query"""
        try:
            response = requests.post(
                self.update_url,
                data={'update': query},
                headers={'Content-Type': 'application/x-www-form-urlencoded'},
                timeout=10
            )
            response.raise_for_status()
            return True
        except requests.exceptions.RequestException as e:
            raise Exception(f"Failed to execute SPARQL update: {str(e)}")
    
    def _parse_entity_details(self, results: Dict, entity_id: str) -> Dict:
        """Parse SPARQL results into entity dictionary"""
        if not results.get('results', {}).get('bindings'):
            return None
        
        # Extract ID from URI (after the # symbol)
        clean_id = entity_id.split('#')[-1] if '#' in entity_id else entity_id.split('/')[-1]
        entity = {'id': clean_id}
        arrays = {}  # Track array properties
        
        # Property mapping from French ontology to API
        property_mapping = {
            # User properties
            'aNom': 'name',
            'aAge': 'age',
            'aPoids': 'weight',
            'aTaille': 'height',
            'sexe': 'gender',
            'aEmail': 'email',
            # Food properties
            'nomAliment': 'name',
            'aCalories': 'calories',
            'aProtéines': 'proteins',
            'aLipides': 'fats',
            'aGlucides': 'carbohydrates',
            # Nutrient properties
            'nomNutriment': 'name',
            # Meal properties
            'typeRepas': 'type',
            'aDate': 'date'
        }
        
        for binding in results['results']['bindings']:
            prop = binding['property']['value'].split('#')[-1]
            value = binding['value']['value']
            
            # Map French properties to English API names
            if prop in property_mapping:
                mapped_prop = property_mapping[prop]
                # Handle numeric properties
                if mapped_prop in ['age', 'weight', 'height', 'calories', 'proteins', 'fats', 'carbohydrates']:
                    try:
                        entity[mapped_prop] = float(value)
                    except:
                        entity[mapped_prop] = value
                else:
                    entity[mapped_prop] = value
                continue
            
            # Handle different property types
            if prop in ['hasAllergy', 'hasPreference', 'hasRestriction', 'hasBenefit', 'hasSource', 'hasAllergen']:
                # Array properties
                array_name = prop.replace('has', '').lower()
                if array_name == 'allergen':
                    array_name = 'allergens'
                elif array_name == 'restriction':
                    array_name = 'restrictions'
                elif array_name == 'benefit':
                    array_name = 'benefits'
                elif array_name == 'source':
                    array_name = 'sources'
                elif array_name == 'preference':
                    array_name = 'preferences'
                elif array_name == 'allergy':
                    array_name = 'allergies'
                
                if array_name not in arrays:
                    arrays[array_name] = []
                arrays[array_name].append(value)
            
            elif prop == 'hasNutrient':
                # Handle nutrient references
                if 'nutrients' not in arrays:
                    arrays['nutrients'] = []
                arrays['nutrients'].append(value.split('/')[-1])
            
            elif prop in ['age', 'calories', 'proteins', 'carbohydrates', 'fats', 'fiber', 'dailyValue']:
                # Numeric properties
                try:
                    entity[self._camel_to_snake(prop)] = float(value)
                except:
                    entity[self._camel_to_snake(prop)] = value
            
            elif prop not in ['type']:
                # String properties
                entity[self._camel_to_snake(prop)] = value
        
        # Add arrays to entity
        entity.update(arrays)
        
        return entity
    
    @staticmethod
    def _camel_to_snake(name: str) -> str:
        """Convert camelCase to snake_case"""
        import re
        s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
        return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()
    
    @staticmethod
    def _snake_to_camel(name: str) -> str:
        """Convert snake_case to camelCase"""
        components = name.split('_')
        return components[0] + ''.join(x.title() for x in components[1:])
    
    # ============ CREATE ============
    
    def create_user(self, data: Dict[str, Any]) -> Dict:
        """Create a new user"""
        user_id = self.builder.generate_id('User')
        query = self.builder.build_insert_user(user_id, data)
        
        if self._execute_update(query):
            return self.get_user(user_id)
        raise Exception("Failed to create user")
    
    def create_diet(self, data: Dict[str, Any]) -> Dict:
        """Create a new diet"""
        diet_id = self.builder.generate_id('Diet')
        query = self.builder.build_insert_diet(diet_id, data)
        
        if self._execute_update(query):
            return self.get_diet(diet_id)
        raise Exception("Failed to create diet")
    
    def create_nutrient(self, data: Dict[str, Any]) -> Dict:
        """Create a new nutrient"""
        nutrient_id = self.builder.generate_id('Nutrient')
        query = self.builder.build_insert_nutrient(nutrient_id, data)
        
        if self._execute_update(query):
            return self.get_nutrient(nutrient_id)
        raise Exception("Failed to create nutrient")
    
    def create_food(self, data: Dict[str, Any]) -> Dict:
        """Create a new food"""
        food_id = self.builder.generate_id('Food')
        query = self.builder.build_insert_food(food_id, data)
        
        if self._execute_update(query):
            return self.get_food(food_id)
        raise Exception("Failed to create food")
    
    # ============ READ ============
    
    def get_user(self, user_id: str) -> Optional[Dict]:
        """Get user by ID"""
        query = self.builder.build_select_by_id(user_id)
        results = self._execute_query(query)
        return self._parse_entity_details(results, user_id)
    
    def get_diet(self, diet_id: str) -> Optional[Dict]:
        """Get diet by ID"""
        query = self.builder.build_select_by_id(diet_id)
        results = self._execute_query(query)
        return self._parse_entity_details(results, diet_id)
    
    def get_nutrient(self, nutrient_id: str) -> Optional[Dict]:
        """Get nutrient by ID"""
        query = self.builder.build_select_by_id(nutrient_id)
        results = self._execute_query(query)
        return self._parse_entity_details(results, nutrient_id)
    
    def get_food(self, food_id: str) -> Optional[Dict]:
        """Get food by ID"""
        query = self.builder.build_select_by_id(food_id)
        results = self._execute_query(query)
        return self._parse_entity_details(results, food_id)
    
    def list_users(self, limit: int = 100, offset: int = 0, search: str = None) -> List[Dict]:
        """List all users with pagination"""
        if search:
            query = self.builder.build_search('Utilisateur', search, limit)
        else:
            query = self.builder.build_select_all('Utilisateur', limit, offset)
        
        results = self._execute_query(query)
        return self._parse_list_results(results)
    
    def list_diets(self, limit: int = 100, offset: int = 0, search: str = None) -> List[Dict]:
        """List all diets with pagination"""
        if search:
            query = self.builder.build_search('Repas', search, limit)
        else:
            query = self.builder.build_select_all('Repas', limit, offset)
        
        results = self._execute_query(query)
        return self._parse_list_results(results)
    
    def list_nutrients(self, limit: int = 100, offset: int = 0, search: str = None) -> List[Dict]:
        """List all nutrients with pagination"""
        if search:
            query = self.builder.build_search('Nutriment', search, limit)
        else:
            query = self.builder.build_select_all('Nutriment', limit, offset)
        
        results = self._execute_query(query)
        return self._parse_list_results(results)
    
    def list_foods(self, limit: int = 100, offset: int = 0, search: str = None) -> List[Dict]:
        """List all foods with pagination"""
        if search:
            query = self.builder.build_search('Aliment', search, limit)
        else:
            query = self.builder.build_select_all('Aliment', limit, offset)
        
        results = self._execute_query(query)
        return self._parse_list_results(results)
    
    def _parse_list_results(self, results: Dict) -> List[Dict]:
        """Parse list query results"""
        entities = []
        bindings = results.get('results', {}).get('bindings', [])
        
        for binding in bindings:
            # Extract ID from URI (after the # symbol)
            id_uri = binding['id']['value']
            entity_id = id_uri.split('#')[-1] if '#' in id_uri else id_uri.split('/')[-1]
            
            entity = {
                'id': entity_id
            }
            
            # Add all available fields from the binding
            if 'name' in binding:
                entity['name'] = binding['name'].get('value', '')
            
            # User fields
            if 'age' in binding:
                try:
                    entity['age'] = int(binding['age'].get('value', 0))
                except:
                    entity['age'] = binding['age'].get('value', '')
            if 'weight' in binding:
                try:
                    entity['weight'] = float(binding['weight'].get('value', 0))
                except:
                    entity['weight'] = binding['weight'].get('value', '')
            if 'height' in binding:
                try:
                    entity['height'] = float(binding['height'].get('value', 0))
                except:
                    entity['height'] = binding['height'].get('value', '')
            if 'gender' in binding:
                entity['gender'] = binding['gender'].get('value', '')
            
            # Food fields
            if 'calories' in binding:
                try:
                    entity['calories'] = int(binding['calories'].get('value', 0))
                except:
                    entity['calories'] = binding['calories'].get('value', '')
            if 'proteins' in binding:
                try:
                    entity['proteins'] = float(binding['proteins'].get('value', 0))
                except:
                    entity['proteins'] = binding['proteins'].get('value', '')
            if 'lipids' in binding:
                try:
                    entity['fats'] = float(binding['lipids'].get('value', 0))
                except:
                    entity['fats'] = binding['lipids'].get('value', '')
            if 'carbs' in binding:
                try:
                    entity['carbohydrates'] = float(binding['carbs'].get('value', 0))
                except:
                    entity['carbohydrates'] = binding['carbs'].get('value', '')
            
            # Meal fields
            if 'type' in binding:
                entity['type'] = binding['type'].get('value', '')
            if 'date' in binding:
                entity['date'] = binding['date'].get('value', '')
            
            # Timestamps
            if 'createdAt' in binding:
                entity['created_at'] = binding['createdAt'].get('value', '')
            if 'updatedAt' in binding:
                entity['updated_at'] = binding['updatedAt'].get('value', '')

        
            entities.append(entity)
        
        return entities
    
    # ============ UPDATE ============
    
    def update_user(self, user_id: str, data: Dict[str, Any]) -> Dict:
        """Update user"""
        # Get current data
        current = self.get_user(user_id)
        if not current:
            raise Exception(f"User {user_id} not found")
        
        # Merge with new data
        updated_data = {**current, **data}
        
        query = self.builder.build_update(user_id, updated_data, 'User')
        
        if self._execute_update(query):
            return self.get_user(user_id)
        raise Exception("Failed to update user")
    
    def update_diet(self, diet_id: str, data: Dict[str, Any]) -> Dict:
        """Update diet"""
        current = self.get_diet(diet_id)
        if not current:
            raise Exception(f"Diet {diet_id} not found")
        
        updated_data = {**current, **data}
        query = self.builder.build_update(diet_id, updated_data, 'Diet')
        
        if self._execute_update(query):
            return self.get_diet(diet_id)
        raise Exception("Failed to update diet")
    
    def update_nutrient(self, nutrient_id: str, data: Dict[str, Any]) -> Dict:
        """Update nutrient"""
        current = self.get_nutrient(nutrient_id)
        if not current:
            raise Exception(f"Nutrient {nutrient_id} not found")
        
        updated_data = {**current, **data}
        query = self.builder.build_update(nutrient_id, updated_data, 'Nutrient')
        
        if self._execute_update(query):
            return self.get_nutrient(nutrient_id)
        raise Exception("Failed to update nutrient")
    
    def update_food(self, food_id: str, data: Dict[str, Any]) -> Dict:
        """Update food"""
        current = self.get_food(food_id)
        if not current:
            raise Exception(f"Food {food_id} not found")
        
        updated_data = {**current, **data}
        query = self.builder.build_update(food_id, updated_data, 'Food')
        
        if self._execute_update(query):
            return self.get_food(food_id)
        raise Exception("Failed to update food")
    
    # ============ DELETE ============
    
    def delete_user(self, user_id: str) -> bool:
        """Delete user"""
        query = self.builder.build_delete(user_id)
        return self._execute_update(query)
    
    def delete_diet(self, diet_id: str) -> bool:
        """Delete diet"""
        query = self.builder.build_delete(diet_id)
        return self._execute_update(query)
    
    def delete_nutrient(self, nutrient_id: str) -> bool:
        """Delete nutrient"""
        query = self.builder.build_delete(nutrient_id)
        return self._execute_update(query)
    
    def delete_food(self, food_id: str) -> bool:
        """Delete food"""
        query = self.builder.build_delete(food_id)
        return self._execute_update(query)
    
    # ============ COUNT ============
    
    def count_users(self) -> int:
        """Count total users"""
        query = self.builder.build_count('Utilisateur')
        results = self._execute_query(query)
        bindings = results.get('results', {}).get('bindings', [])
        if bindings:
            return int(bindings[0]['count']['value'])
        return 0
    
    def count_diets(self) -> int:
        """Count total diets"""
        query = self.builder.build_count('Repas')
        results = self._execute_query(query)
        bindings = results.get('results', {}).get('bindings', [])
        if bindings:
            return int(bindings[0]['count']['value'])
        return 0
    
    def count_nutrients(self) -> int:
        """Count total nutrients"""
        query = self.builder.build_count('Nutriment')
        results = self._execute_query(query)
        bindings = results.get('results', {}).get('bindings', [])
        if bindings:
            return int(bindings[0]['count']['value'])
        return 0
    
    def count_foods(self) -> int:
        """Count total foods"""
        query = self.builder.build_count('Aliment')
        results = self._execute_query(query)
        bindings = results.get('results', {}).get('bindings', [])
        if bindings:
            return int(bindings[0]['count']['value'])
        return 0
