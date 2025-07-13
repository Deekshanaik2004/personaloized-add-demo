from flask import request, jsonify, current_app
from app.routes import api_bp
from app.services.user_service import UserService
import uuid

@api_bp.route('/users', methods=['POST'])
def create_user():
    """Create a new demo user"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data or not data.get('email'):
            return jsonify({
                'success': False,
                'message': 'Email is required'
            }), 400
        
        # Initialize user service
        user_service = UserService(current_app.mongo)
        
        # Create user
        result = user_service.create_user(data)
        
        if result['success']:
            return jsonify(result), 201
        else:
            return jsonify(result), 400
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error creating user: {str(e)}'
        }), 500

@api_bp.route('/users/<user_id>', methods=['GET'])
def get_user(user_id):
    """Get user information"""
    try:
        user_service = UserService(current_app.mongo)
        user = user_service.get_user(user_id)
        
        if user:
            return jsonify({
                'success': True,
                'user': user
            })
        else:
            return jsonify({
                'success': False,
                'message': 'User not found'
            }), 404
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error retrieving user: {str(e)}'
        }), 500

@api_bp.route('/users/<user_id>/interactions', methods=['POST'])
def track_interaction(user_id):
    """Track user interaction for ML analysis"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data or not data.get('event_type'):
            return jsonify({
                'success': False,
                'message': 'Event type is required'
            }), 400
        
        # Generate session ID if not provided
        if not data.get('session_id'):
            data['session_id'] = str(uuid.uuid4())
        
        user_service = UserService(current_app.mongo)
        result = user_service.track_interaction(user_id, data)
        
        if result['success']:
            return jsonify(result)
        else:
            return jsonify(result), 400
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error tracking interaction: {str(e)}'
        }), 500

@api_bp.route('/users/<user_id>/interactions', methods=['GET'])
def get_user_interactions(user_id):
    """Get user's interaction history"""
    try:
        limit = request.args.get('limit', 100, type=int)
        
        user_service = UserService(current_app.mongo)
        interactions = user_service.get_user_interactions(user_id, limit)
        
        return jsonify({
            'success': True,
            'interactions': interactions,
            'count': len(interactions)
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error retrieving interactions: {str(e)}'
        }), 500

@api_bp.route('/users/<user_id>/predict', methods=['POST'])
def predict_interests(user_id):
    """Predict user interests using ML model"""
    try:
        user_service = UserService(current_app.mongo)
        result = user_service.predict_user_interests(user_id)
        
        if result['success']:
            return jsonify(result)
        else:
            return jsonify(result), 400
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error predicting interests: {str(e)}'
        }), 500

@api_bp.route('/users/<user_id>/analytics', methods=['GET'])
def get_user_analytics(user_id):
    """Get comprehensive user analytics"""
    try:
        user_service = UserService(current_app.mongo)
        analytics = user_service.get_user_analytics(user_id)
        
        if analytics:
            return jsonify({
                'success': True,
                'analytics': analytics
            })
        else:
            return jsonify({
                'success': False,
                'message': 'User not found'
            }), 404
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error retrieving analytics: {str(e)}'
        }), 500 