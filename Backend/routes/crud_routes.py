"""
CRUD Routes
RESTful API endpoints for CRUD operations
"""

from flask import Blueprint, request, jsonify
from pydantic import ValidationError
from validators import (
    UserSchema, UserUpdateSchema,
    DietSchema, DietUpdateSchema,
    NutrientSchema, NutrientUpdateSchema,
    FoodSchema, FoodUpdateSchema
)
from services.crud_service import CRUDService

# Create Blueprint
crud_bp = Blueprint('crud', __name__, url_prefix='/api')

# Initialize CRUD service
crud_service = CRUDService()


# ============ USERS ROUTES ============

@crud_bp.route('/users', methods=['POST'])
def create_user():
    """Create a new user"""
    try:
        # Validate input
        data = UserSchema(**request.json)
        
        # Create user
        user = crud_service.create_user(data.model_dump())
        
        return jsonify({
            'success': True,
            'message': 'User created successfully',
            'data': user
        }), 201
    
    except ValidationError as e:
        print(f"Validation error: {e.errors()}")
        # Convert Pydantic errors to JSON-serializable format
        errors = []
        for error in e.errors():
            errors.append({
                'field': '.'.join(str(loc) for loc in error['loc']),
                'message': error['msg'],
                'type': error['type']
            })
        return jsonify({
            'success': False,
            'error': 'Validation error',
            'details': errors
        }), 400
    
    except Exception as e:
        print(f"Error creating user: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@crud_bp.route('/users', methods=['GET'])
def list_users():
    """List all users with pagination and search"""
    try:
        limit = int(request.args.get('limit', 100))
        offset = int(request.args.get('offset', 0))
        search = request.args.get('search', None)
        
        users = crud_service.list_users(limit=limit, offset=offset, search=search)
        total = crud_service.count_users()
        
        return jsonify({
            'success': True,
            'data': users,
            'pagination': {
                'total': total,
                'limit': limit,
                'offset': offset,
                'count': len(users)
            }
        }), 200
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@crud_bp.route('/users/<user_id>', methods=['GET'])
def get_user(user_id):
    """Get user by ID"""
    try:
        user = crud_service.get_user(user_id)
        
        if not user:
            return jsonify({
                'success': False,
                'error': 'User not found'
            }), 404
        
        return jsonify({
            'success': True,
            'data': user
        }), 200
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@crud_bp.route('/users/<user_id>', methods=['PUT'])
def update_user(user_id):
    """Update user by ID"""
    try:
        # Validate input
        data = UserUpdateSchema(**request.json)
        
        # Only include non-None fields
        update_data = {k: v for k, v in data.model_dump().items() if v is not None}
        
        if not update_data:
            return jsonify({
                'success': False,
                'error': 'No data provided for update'
            }), 400
        
        # Update user
        user = crud_service.update_user(user_id, update_data)
        
        return jsonify({
            'success': True,
            'message': 'User updated successfully',
            'data': user
        }), 200
    
    except ValidationError as e:
        return jsonify({
            'success': False,
            'error': 'Validation error',
            'details': e.errors()
        }), 400
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@crud_bp.route('/users/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    """Delete user by ID"""
    try:
        # Check if user exists
        user = crud_service.get_user(user_id)
        if not user:
            return jsonify({
                'success': False,
                'error': 'User not found'
            }), 404
        
        # Delete user
        crud_service.delete_user(user_id)
        
        return jsonify({
            'success': True,
            'message': 'User deleted successfully'
        }), 200
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# ============ DIETS ROUTES ============

@crud_bp.route('/diets', methods=['POST'])
def create_diet():
    """Create a new diet"""
    try:
        data = DietSchema(**request.json)
        diet = crud_service.create_diet(data.model_dump())
        
        return jsonify({
            'success': True,
            'message': 'Diet created successfully',
            'data': diet
        }), 201
    
    except ValidationError as e:
        return jsonify({
            'success': False,
            'error': 'Validation error',
            'details': e.errors()
        }), 400
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@crud_bp.route('/diets', methods=['GET'])
def list_diets():
    """List all diets"""
    try:
        limit = int(request.args.get('limit', 100))
        offset = int(request.args.get('offset', 0))
        search = request.args.get('search', None)
        
        diets = crud_service.list_diets(limit=limit, offset=offset, search=search)
        total = crud_service.count_diets()
        
        return jsonify({
            'success': True,
            'data': diets,
            'pagination': {
                'total': total,
                'limit': limit,
                'offset': offset,
                'count': len(diets)
            }
        }), 200
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@crud_bp.route('/diets/<diet_id>', methods=['GET'])
def get_diet(diet_id):
    """Get diet by ID"""
    try:
        diet = crud_service.get_diet(diet_id)
        
        if not diet:
            return jsonify({
                'success': False,
                'error': 'Diet not found'
            }), 404
        
        return jsonify({
            'success': True,
            'data': diet
        }), 200
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@crud_bp.route('/diets/<diet_id>', methods=['PUT'])
def update_diet(diet_id):
    """Update diet by ID"""
    try:
        data = DietUpdateSchema(**request.json)
        update_data = {k: v for k, v in data.model_dump().items() if v is not None}
        
        if not update_data:
            return jsonify({
                'success': False,
                'error': 'No data provided for update'
            }), 400
        
        diet = crud_service.update_diet(diet_id, update_data)
        
        return jsonify({
            'success': True,
            'message': 'Diet updated successfully',
            'data': diet
        }), 200
    
    except ValidationError as e:
        return jsonify({
            'success': False,
            'error': 'Validation error',
            'details': e.errors()
        }), 400
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@crud_bp.route('/diets/<diet_id>', methods=['DELETE'])
def delete_diet(diet_id):
    """Delete diet by ID"""
    try:
        diet = crud_service.get_diet(diet_id)
        if not diet:
            return jsonify({
                'success': False,
                'error': 'Diet not found'
            }), 404
        
        crud_service.delete_diet(diet_id)
        
        return jsonify({
            'success': True,
            'message': 'Diet deleted successfully'
        }), 200
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# ============ NUTRIENTS ROUTES ============

@crud_bp.route('/nutrients', methods=['POST'])
def create_nutrient():
    """Create a new nutrient"""
    try:
        data = NutrientSchema(**request.json)
        nutrient = crud_service.create_nutrient(data.model_dump())
        
        return jsonify({
            'success': True,
            'message': 'Nutrient created successfully',
            'data': nutrient
        }), 201
    
    except ValidationError as e:
        return jsonify({
            'success': False,
            'error': 'Validation error',
            'details': e.errors()
        }), 400
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@crud_bp.route('/nutrients', methods=['GET'])
def list_nutrients():
    """List all nutrients"""
    try:
        limit = int(request.args.get('limit', 100))
        offset = int(request.args.get('offset', 0))
        search = request.args.get('search', None)
        
        nutrients = crud_service.list_nutrients(limit=limit, offset=offset, search=search)
        total = crud_service.count_nutrients()
        
        return jsonify({
            'success': True,
            'data': nutrients,
            'pagination': {
                'total': total,
                'limit': limit,
                'offset': offset,
                'count': len(nutrients)
            }
        }), 200
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@crud_bp.route('/nutrients/<nutrient_id>', methods=['GET'])
def get_nutrient(nutrient_id):
    """Get nutrient by ID"""
    try:
        nutrient = crud_service.get_nutrient(nutrient_id)
        
        if not nutrient:
            return jsonify({
                'success': False,
                'error': 'Nutrient not found'
            }), 404
        
        return jsonify({
            'success': True,
            'data': nutrient
        }), 200
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@crud_bp.route('/nutrients/<nutrient_id>', methods=['PUT'])
def update_nutrient(nutrient_id):
    """Update nutrient by ID"""
    try:
        data = NutrientUpdateSchema(**request.json)
        update_data = {k: v for k, v in data.model_dump().items() if v is not None}
        
        if not update_data:
            return jsonify({
                'success': False,
                'error': 'No data provided for update'
            }), 400
        
        nutrient = crud_service.update_nutrient(nutrient_id, update_data)
        
        return jsonify({
            'success': True,
            'message': 'Nutrient updated successfully',
            'data': nutrient
        }), 200
    
    except ValidationError as e:
        return jsonify({
            'success': False,
            'error': 'Validation error',
            'details': e.errors()
        }), 400
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@crud_bp.route('/nutrients/<nutrient_id>', methods=['DELETE'])
def delete_nutrient(nutrient_id):
    """Delete nutrient by ID"""
    try:
        nutrient = crud_service.get_nutrient(nutrient_id)
        if not nutrient:
            return jsonify({
                'success': False,
                'error': 'Nutrient not found'
            }), 404
        
        crud_service.delete_nutrient(nutrient_id)
        
        return jsonify({
            'success': True,
            'message': 'Nutrient deleted successfully'
        }), 200
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# ============ FOODS ROUTES ============

@crud_bp.route('/foods', methods=['POST'])
def create_food():
    """Create a new food"""
    try:
        data = FoodSchema(**request.json)
        food = crud_service.create_food(data.model_dump())
        
        return jsonify({
            'success': True,
            'message': 'Food created successfully',
            'data': food
        }), 201
    
    except ValidationError as e:
        return jsonify({
            'success': False,
            'error': 'Validation error',
            'details': e.errors()
        }), 400
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@crud_bp.route('/foods', methods=['GET'])
def list_foods():
    """List all foods"""
    try:
        limit = int(request.args.get('limit', 100))
        offset = int(request.args.get('offset', 0))
        search = request.args.get('search', None)
        
        foods = crud_service.list_foods(limit=limit, offset=offset, search=search)
        total = crud_service.count_foods()
        
        return jsonify({
            'success': True,
            'data': foods,
            'pagination': {
                'total': total,
                'limit': limit,
                'offset': offset,
                'count': len(foods)
            }
        }), 200
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@crud_bp.route('/foods/<food_id>', methods=['GET'])
def get_food(food_id):
    """Get food by ID"""
    try:
        food = crud_service.get_food(food_id)
        
        if not food:
            return jsonify({
                'success': False,
                'error': 'Food not found'
            }), 404
        
        return jsonify({
            'success': True,
            'data': food
        }), 200
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@crud_bp.route('/foods/<food_id>', methods=['PUT'])
def update_food(food_id):
    """Update food by ID"""
    try:
        data = FoodUpdateSchema(**request.json)
        update_data = {k: v for k, v in data.model_dump().items() if v is not None}
        
        if not update_data:
            return jsonify({
                'success': False,
                'error': 'No data provided for update'
            }), 400
        
        food = crud_service.update_food(food_id, update_data)
        
        return jsonify({
            'success': True,
            'message': 'Food updated successfully',
            'data': food
        }), 200
    
    except ValidationError as e:
        return jsonify({
            'success': False,
            'error': 'Validation error',
            'details': e.errors()
        }), 400
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@crud_bp.route('/foods/<food_id>', methods=['DELETE'])
def delete_food(food_id):
    """Delete food by ID"""
    try:
        food = crud_service.get_food(food_id)
        if not food:
            return jsonify({
                'success': False,
                'error': 'Food not found'
            }), 404
        
        crud_service.delete_food(food_id)
        
        return jsonify({
            'success': True,
            'message': 'Food deleted successfully'
        }), 200
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# ============ STATS ROUTE ============

@crud_bp.route('/stats', methods=['GET'])
def get_stats():
    """Get database statistics"""
    try:
        stats = {
            'users': crud_service.count_users(),
            'diets': crud_service.count_diets(),
            'nutrients': crud_service.count_nutrients(),
            'foods': crud_service.count_foods()
        }
        
        return jsonify({
            'success': True,
            'data': stats
        }), 200
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
