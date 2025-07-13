import uuid
from datetime import datetime
from bson import ObjectId
from app.models.ml_model import UserInterestClassifier
from config import Config


class UserService:
    """Service class for user management and interaction tracking"""

    def __init__(self, mongo_db):
        self.db = mongo_db
        self.ml_classifier = UserInterestClassifier()

    def create_user(self, user_data):
        user_id = str(uuid.uuid4())
        user = {
            'user_id': user_id,
            'email': user_data.get('email'),
            'name': user_data.get('name', 'Demo User'),
            'created_at': datetime.utcnow(),
            'last_active': datetime.utcnow(),
            'preferences': {},
            'is_demo_user': True
        }
        result = self.db.users.insert_one(user)
        return {'success': True, 'user_id': user_id, 'message': 'User created successfully'} if result.inserted_id else {'success': False, 'message': 'Failed to create user'}

    def get_user(self, user_id):
        user = self.db.users.find_one({'user_id': user_id})
        if user:
            user['_id'] = str(user['_id'])
        return user

    def track_interaction(self, user_id, interaction_data):
        category = interaction_data.get('content_category', '').lower()
        if category == 'technology':
            category = 'tech'

        interaction = {
            'user_id': user_id,
            'session_id': interaction_data.get('session_id', str(uuid.uuid4())),
            'event_type': interaction_data.get('event_type'),
            'content_category': category,
            'content_id': interaction_data.get('content_id'),
            'duration': interaction_data.get('duration', 0),
            'timestamp': datetime.utcnow(),
            'metadata': interaction_data.get('metadata', {})
        }
        result = self.db.interactions.insert_one(interaction)
        if result.inserted_id:
            self.db.users.update_one({'user_id': user_id}, {'$set': {'last_active': datetime.utcnow()}})
            return {'success': True, 'interaction_id': str(result.inserted_id), 'message': 'Interaction tracked successfully'}
        return {'success': False, 'message': 'Failed to track interaction'}

    def get_user_interactions(self, user_id, limit=100):
        interactions = list(self.db.interactions.find({'user_id': user_id}).sort('timestamp', -1).limit(limit))
        for interaction in interactions:
            interaction['_id'] = str(interaction['_id'])
        return interactions

    def predict_user_interests(self, user_id):
        interactions = self.get_user_interactions(user_id, limit=500)
        if not interactions:
            return {'success': False, 'message': 'No interaction data available for prediction'}
        try:
            prediction = self.ml_classifier.predict_user_interests(interactions)
            prediction_record = {
                'user_id': user_id,
                'primary_interest': prediction['primary_interest'],
                'interest_scores': prediction['interest_scores'],
                'confidence': prediction['confidence'],
                'features_used': prediction['features_used'],
                'timestamp': datetime.utcnow(),
                'model_version': Config.ML_MODEL_VERSION
            }
            self.db.predictions.update_one({'user_id': user_id}, {'$set': prediction_record}, upsert=True)
            return {'success': True, 'prediction': prediction, 'message': 'Interest prediction completed'}
        except Exception as e:
            return {'success': False, 'message': f'Prediction failed: {str(e)}'}

    def get_recommended_ads(self, user_id, limit=3):
        prediction = self.db.predictions.find_one({'user_id': user_id})
        if not prediction:
            prediction_result = self.predict_user_interests(user_id)
            if not prediction_result['success']:
                return self.get_random_ads(limit)
            prediction = prediction_result['prediction']

        primary_interest = prediction.get('primary_interest', 'sports')
        interest_scores = prediction.get('interest_scores', {})
        ads = Config.AD_CATEGORIES.get(primary_interest, [])

        if len(ads) < limit:
            sorted_interests = sorted(interest_scores.items(), key=lambda x: x[1], reverse=True)
            for interest, score in sorted_interests[1:]:
                if len(ads) >= limit:
                    break
                interest_ads = Config.AD_CATEGORIES.get(interest, [])
                ads.extend(interest_ads[:limit - len(ads)])

        ads = ads[:limit]
        for ad in ads:
            ad['recommendation_reason'] = f'Based on your interest in {primary_interest}'
            ad['confidence_score'] = prediction.get('confidence', 0)

        return ads

    def get_random_ads(self, limit=3):
        import random
        all_ads = []
        for category, ads in Config.AD_CATEGORIES.items():
            all_ads.extend(ads)
        selected_ads = random.sample(all_ads, min(limit, len(all_ads)))
        for ad in selected_ads:
            ad['recommendation_reason'] = 'Random recommendation'
            ad['confidence_score'] = 0.0
        return selected_ads

    def get_user_analytics(self, user_id):
        user = self.get_user(user_id)
        if not user:
            return None

        interactions = self.get_user_interactions(user_id, limit=1000)
        total_interactions = len(interactions)
        unique_sessions = len(set(i.get('session_id') for i in interactions))

        category_counts = {}
        event_type_counts = {}
        for interaction in interactions:
            category = interaction.get('content_category', 'unknown')
            if category == 'technology':
                category = 'tech'
            event_type = interaction.get('event_type', 'unknown')
            category_counts[category] = category_counts.get(category, 0) + 1
            event_type_counts[event_type] = event_type_counts.get(event_type, 0) + 1

        prediction = self.db.predictions.find_one({'user_id': user_id})
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
                'avg_interactions_per_session': total_interactions / unique_sessions if unique_sessions else 0
            },
            'category_breakdown': category_counts,
            'event_type_breakdown': event_type_counts,
            'prediction': prediction
        }
        return analytics

    def train_ml_model(self):
        try:
            accuracy = self.ml_classifier.train_model()
            return {'success': True, 'accuracy': accuracy, 'message': 'Model trained successfully'}
        except Exception as e:
            return {'success': False, 'message': f'Model training failed: {str(e)}'}

    def get_model_info(self):
        return self.ml_classifier.get_model_info()
