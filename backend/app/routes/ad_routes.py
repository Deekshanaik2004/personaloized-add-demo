from flask import request, jsonify, current_app
from app.routes import api_bp
from app.services.user_service import UserService

@api_bp.route('/users/<user_id>/ads', methods=['GET'])
def get_personalized_ads(user_id):
    """Get personalized ads for user"""
    try:
        limit = request.args.get('limit', 3, type=int)
        
        user_service = UserService(current_app.mongo)
        ads = user_service.get_recommended_ads(user_id, limit)
        
        return jsonify({
            'success': True,
            'ads': ads,
            'count': len(ads),
            'user_id': user_id
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error retrieving ads: {str(e)}'
        }), 500

@api_bp.route('/ads/categories', methods=['GET'])
def get_ad_categories():
    """Get all available ad categories"""
    try:
        from config import Config
        
        categories = list(Config.AD_CATEGORIES.keys())
        
        return jsonify({
            'success': True,
            'categories': categories,
            'count': len(categories)
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error retrieving categories: {str(e)}'
        }), 500

@api_bp.route('/ads/categories/<category>', methods=['GET'])
def get_ads_by_category(category):
    """Get ads by specific category"""
    try:
        from config import Config
        
        ads = Config.AD_CATEGORIES.get(category, [])
        
        return jsonify({
            'success': True,
            'category': category,
            'ads': ads,
            'count': len(ads)
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error retrieving ads for category: {str(e)}'
        }), 500

@api_bp.route('/ads/random', methods=['GET'])
def get_random_ads():
    """Get random ads"""
    try:
        limit = request.args.get('limit', 3, type=int)
        
        user_service = UserService(current_app.mongo)
        ads = user_service.get_random_ads(limit)
        
        return jsonify({
            'success': True,
            'ads': ads,
            'count': len(ads)
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error retrieving random ads: {str(e)}'
        }), 500 