from flask import request, jsonify, current_app
from app.routes import api_bp
from app.services.user_service import UserService

@api_bp.route('/ml/train', methods=['POST'])
def train_model():
    """Train the ML model"""
    try:
        user_service = UserService(current_app.mongo)
        result = user_service.train_ml_model()
        
        if result['success']:
            return jsonify(result)
        else:
            return jsonify(result), 400
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error training model: {str(e)}'
        }), 500

@api_bp.route('/ml/info', methods=['GET'])
def get_model_info():
    """Get information about the ML model"""
    try:
        user_service = UserService(current_app.mongo)
        info = user_service.get_model_info()
        
        return jsonify({
            'success': True,
            'model_info': info
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error retrieving model info: {str(e)}'
        }), 500

@api_bp.route('/ml/predict/<user_id>', methods=['POST'])
def predict_user_interests(user_id):
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