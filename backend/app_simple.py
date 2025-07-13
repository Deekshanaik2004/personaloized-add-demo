from flask import Flask, request, jsonify
from flask_cors import CORS
import uuid
from datetime import datetime
import random

app = Flask(__name__)
CORS(app)

# Simple in-memory storage for demo
users = {}
interactions = []
predictions = {}

# Sample ads
SAMPLE_ADS = {
    'sports': [
        {
            'id': 'sports_1',
            'title': 'Nike Running Shoes',
            'description': 'Get 20% off on latest running shoes',
            'image_url': 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Nike+Running',
            'cta': 'Shop Now',
            'url': '#'
        },
        {
            'id': 'sports_2', 
            'title': 'Gym Membership',
            'description': 'Join our premium gym network',
            'image_url': 'https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=Gym+Membership',
            'cta': 'Join Now',
            'url': '#'
        }
    ],
    'technology': [
        {
            'id': 'tech_1',
            'title': 'Latest Smartphone',
            'description': 'Upgrade to the newest smartphone',
            'image_url': 'https://via.placeholder.com/300x200/45B7D1/FFFFFF?text=Smartphone',
            'cta': 'Learn More',
            'url': '#'
        },
        {
            'id': 'tech_2',
            'title': 'Programming Course',
            'description': 'Learn Python, JavaScript, and more',
            'image_url': 'https://via.placeholder.com/300x200/96CEB4/FFFFFF?text=Coding+Course',
            'cta': 'Start Learning',
            'url': '#'
        }
    ],
    'fashion': [
        {
            'id': 'fashion_1',
            'title': 'Summer Collection',
            'description': 'New arrivals for the summer season',
            'image_url': 'https://via.placeholder.com/300x200/FFEAA7/000000?text=Summer+Fashion',
            'cta': 'Shop Collection',
            'url': '#'
        },
        {
            'id': 'fashion_2',
            'title': 'Designer Handbags',
            'description': 'Luxury handbags at great prices',
            'image_url': 'https://via.placeholder.com/300x200/DDA0DD/FFFFFF?text=Designer+Bags',
            'cta': 'View Collection',
            'url': '#'
        }
    ],
    'entertainment': [
        {
            'id': 'entertainment_1',
            'title': 'Streaming Service',
            'description': 'Watch unlimited movies and shows',
            'image_url': 'https://via.placeholder.com/300x200/FF9999/FFFFFF?text=Streaming',
            'cta': 'Start Free Trial',
            'url': '#'
        },
        {
            'id': 'entertainment_2',
            'title': 'Concert Tickets',
            'description': 'Get tickets for upcoming concerts',
            'image_url': 'https://via.placeholder.com/300x200/87CEEB/000000?text=Concert+Tickets',
            'cta': 'Buy Tickets',
            'url': '#'
        }
    ],
    'business': [
        {
            'id': 'business_1',
            'title': 'Business Software',
            'description': 'Boost your productivity with our tools',
            'image_url': 'https://via.placeholder.com/300x200/98D8C8/000000?text=Business+Tools',
            'cta': 'Try Free',
            'url': '#'
        },
        {
            'id': 'business_2',
            'title': 'Investment Platform',
            'description': 'Start investing with just $10',
            'image_url': 'https://via.placeholder.com/300x200/F7DC6F/000000?text=Invest+Now',
            'cta': 'Start Investing',
            'url': '#'
        }
    ]
}

@app.route('/api/users', methods=['POST'])
def create_user():
    """Create a new demo user"""
    try:
        data = request.get_json()
        
        if not data or not data.get('email'):
            return jsonify({
                'success': False,
                'message': 'Email is required'
            }), 400
        
        user_id = str(uuid.uuid4())
        
        user = {
            'user_id': user_id,
            'email': data.get('email'),
            'name': data.get('name', 'Demo User'),
            'created_at': datetime.utcnow().isoformat(),
            'last_active': datetime.utcnow().isoformat(),
            'is_demo_user': True
        }
        
        users[user_id] = user
        
        return jsonify({
            'success': True,
            'user_id': user_id,
            'message': 'User created successfully'
        }), 201
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error creating user: {str(e)}'
        }), 500

@app.route('/api/users/<user_id>/interactions', methods=['POST'])
def track_interaction(user_id):
    """Track user interaction"""
    try:
        data = request.get_json()
        
        if not data or not data.get('event_type'):
            return jsonify({
                'success': False,
                'message': 'Event type is required'
            }), 400
        
        interaction = {
            'user_id': user_id,
            'session_id': data.get('session_id', str(uuid.uuid4())),
            'event_type': data.get('event_type'),
            'content_category': data.get('content_category'),
            'content_id': data.get('content_id'),
            'duration': data.get('duration', 0),
            'timestamp': datetime.utcnow().isoformat()
        }
        
        interactions.append(interaction)
        
        # Update user's last active time
        if user_id in users:
            users[user_id]['last_active'] = datetime.utcnow().isoformat()
        
        return jsonify({
            'success': True,
            'interaction_id': str(uuid.uuid4()),
            'message': 'Interaction tracked successfully'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error tracking interaction: {str(e)}'
        }), 500

@app.route('/api/users/<user_id>/predict', methods=['POST'])
def predict_interests(user_id):
    """Predict user interests based on interactions"""
    try:
        # Get user interactions
        user_interactions = [i for i in interactions if i['user_id'] == user_id]
        
        if not user_interactions:
            return jsonify({
                'success': False,
                'message': 'No interaction data available for prediction'
            })
        
        # Simple prediction logic based on most interacted category
        category_counts = {}
        for interaction in user_interactions:
            category = interaction.get('content_category', '')
            if category:
                category_counts[category] = category_counts.get(category, 0) + 1
        
        if not category_counts:
            # Default prediction if no category data
            primary_interest = 'technology'
            confidence = 0.5
        else:
            # Get most frequent category
            primary_interest = max(category_counts, key=category_counts.get)
            confidence = min(0.9, 0.5 + (len(user_interactions) * 0.1))
        
        # Map content categories to interest categories
        category_mapping = {
            'sports_news': 'sports',
            'tech_news': 'technology',
            'fashion_trends': 'fashion',
            'movie_reviews': 'entertainment',
            'business_insights': 'business'
        }
        
        mapped_interest = category_mapping.get(primary_interest, primary_interest)
        
        # Create interest scores
        interest_scores = {
            'sports': 0.1,
            'technology': 0.1,
            'fashion': 0.1,
            'entertainment': 0.1,
            'business': 0.1
        }
        
        interest_scores[mapped_interest] = confidence
        
        prediction = {
            'primary_interest': mapped_interest,
            'interest_scores': interest_scores,
            'confidence': confidence,
            'features_used': {
                'total_interactions': len(user_interactions),
                'categories_visited': list(category_counts.keys())
            }
        }
        
        predictions[user_id] = prediction
        
        return jsonify({
            'success': True,
            'prediction': prediction,
            'message': 'Interest prediction completed'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Prediction failed: {str(e)}'
        }), 500

@app.route('/api/users/<user_id>/ads', methods=['GET'])
def get_personalized_ads(user_id):
    """Get personalized ads for user"""
    try:
        limit = request.args.get('limit', 3, type=int)
        
        # Get user's prediction
        prediction = predictions.get(user_id)
        
        if not prediction:
            # Try to make a prediction
            response = predict_interests(user_id)
            if response.status_code == 200:
                prediction = response.get_json()['prediction']
            else:
                # Return random ads if no prediction
                all_ads = []
                for category_ads in SAMPLE_ADS.values():
                    all_ads.extend(category_ads)
                selected_ads = random.sample(all_ads, min(limit, len(all_ads)))
                
                for ad in selected_ads:
                    ad['recommendation_reason'] = 'Random recommendation'
                    ad['confidence_score'] = 0.0
                
                return jsonify({
                    'success': True,
                    'ads': selected_ads,
                    'count': len(selected_ads),
                    'user_id': user_id
                })
        
        primary_interest = prediction.get('primary_interest', 'technology')
        ads = SAMPLE_ADS.get(primary_interest, [])
        
        # If not enough ads, add from other categories
        if len(ads) < limit:
            for category, category_ads in SAMPLE_ADS.items():
                if category != primary_interest and len(ads) < limit:
                    ads.extend(category_ads[:limit - len(ads)])
        
        ads = ads[:limit]
        
        # Add metadata
        for ad in ads:
            ad['recommendation_reason'] = f'Based on your interest in {primary_interest}'
            ad['confidence_score'] = prediction.get('confidence', 0)
        
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

@app.route('/api/users/<user_id>/analytics', methods=['GET'])
def get_user_analytics(user_id):
    """Get user analytics"""
    try:
        user = users.get(user_id)
        if not user:
            return jsonify({
                'success': False,
                'message': 'User not found'
            }), 404
        
        user_interactions = [i for i in interactions if i['user_id'] == user_id]
        
        # Calculate stats
        total_interactions = len(user_interactions)
        unique_sessions = len(set([i.get('session_id', 0) for i in user_interactions]))
        
        # Category breakdown
        category_counts = {}
        event_type_counts = {}
        
        for interaction in user_interactions:
            category = interaction.get('content_category', 'unknown')
            event_type = interaction.get('event_type', 'unknown')
            
            category_counts[category] = category_counts.get(category, 0) + 1
            event_type_counts[event_type] = event_type_counts.get(event_type, 0) + 1
        
        analytics = {
            'user_info': {
                'user_id': user_id,
                'name': user.get('name'),
                'created_at': user.get('created_at'),
                'last_active': user.get('last_active')
            },
            'interaction_stats': {
                'total_interactions': total_interactions,
                'unique_sessions': unique_sessions,
                'avg_interactions_per_session': total_interactions / unique_sessions if unique_sessions > 0 else 0
            },
            'category_breakdown': category_counts,
            'event_type_breakdown': event_type_counts,
            'prediction': predictions.get(user_id)
        }
        
        return jsonify({
            'success': True,
            'analytics': analytics
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error retrieving analytics: {str(e)}'
        }), 500

@app.route('/api/ml/info', methods=['GET'])
def get_model_info():
    """Get ML model information"""
    return jsonify({
        'success': True,
        'model_info': {
            'status': 'trained',
            'model_type': 'Simple Demo Model',
            'categories': ['sports', 'technology', 'fashion', 'entertainment', 'business'],
            'feature_names': ['interaction_count', 'category_preference'],
            'model_path': 'demo_model'
        }
    })

if __name__ == '__main__':
    print("🚀 Starting Personalized Ads Demo Backend (Simple Version)...")
    print("🌐 Server will be available at http://localhost:5000")
    print("📚 API endpoints available at http://localhost:5000/api")
    print("⚠️  This is a simplified version without MongoDB")
    app.run(debug=True, host='0.0.0.0', port=5000) 