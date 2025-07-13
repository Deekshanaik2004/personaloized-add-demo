from flask import Blueprint, request, jsonify, current_app
from datetime import datetime, timedelta

# Define the Blueprint here
from app.routes import api_bp


@api_bp.route('/analytics/overview', methods=['GET'])
def get_system_overview():
    """Get system-wide analytics overview"""
    try:
        db = current_app.mongo

        total_users = db.users.count_documents({})
        total_interactions = db.interactions.count_documents({})
        total_predictions = db.predictions.count_documents({})

        week_ago = datetime.utcnow() - timedelta(days=7)
        recent_users = db.users.count_documents({'created_at': {'$gte': week_ago}})
        recent_interactions = db.interactions.count_documents({'timestamp': {'$gte': week_ago}})

        interest_pipeline = [
            {'$group': {'_id': '$primary_interest', 'count': {'$sum': 1}}},
            {'$sort': {'count': -1}}
        ]
        interest_distribution = list(db.predictions.aggregate(interest_pipeline))

        daily_interactions = db.interactions.aggregate([
            {
                '$group': {
                    '_id': {'date': {'$dateToString': {'format': '%Y-%m-%d', 'date': '$timestamp'}}},
                    'count': {'$sum': 1}
                }
            },
            {'$sort': {'_id.date': -1}},
            {'$limit': 7}
        ])

        overview = {
            'total_users': total_users,
            'total_interactions': total_interactions,
            'total_predictions': total_predictions,
            'recent_users': recent_users,
            'recent_interactions': recent_interactions,
            'interest_distribution': interest_distribution,
            'daily_interactions': list(daily_interactions)
        }

        return jsonify({'success': True, 'overview': overview})

    except Exception as e:
        return jsonify({'success': False, 'message': f'Error retrieving analytics: {str(e)}'}), 500


@api_bp.route('/analytics/interests', methods=['GET'])
def get_interest_analytics():
    """Get detailed interest analytics"""
    try:
        db = current_app.mongo

        interest_pipeline = [
            {'$group': {'_id': '$primary_interest', 'count': {'$sum': 1}}},
            {'$sort': {'count': -1}}
        ]
        interest_distribution = list(db.predictions.aggregate(interest_pipeline))

        confidence_pipeline = [
            {'$group': {
                '_id': '$primary_interest',
                'avg_confidence': {'$avg': '$confidence'},
                'count': {'$sum': 1}
            }},
            {'$sort': {'avg_confidence': -1}}
        ]
        confidence_by_interest = list(db.predictions.aggregate(confidence_pipeline))

        day_ago = datetime.utcnow() - timedelta(days=1)
        recent_predictions = list(db.predictions.find({'timestamp': {'$gte': day_ago}}).sort('timestamp', -1).limit(10))

        for pred in recent_predictions:
            pred['_id'] = str(pred['_id'])

        analytics = {
            'interest_distribution': interest_distribution,
            'confidence_by_interest': confidence_by_interest,
            'recent_predictions': recent_predictions
        }

        return jsonify({'success': True, 'analytics': analytics})

    except Exception as e:
        return jsonify({'success': False, 'message': f'Error retrieving interest analytics: {str(e)}'}), 500


@api_bp.route('/analytics/interactions', methods=['GET'])
def get_interaction_analytics():
    """Get interaction analytics"""
    try:
        db = current_app.mongo

        event_pipeline = [
            {'$group': {'_id': '$event_type', 'count': {'$sum': 1}}},
            {'$sort': {'count': -1}}
        ]
        event_distribution = list(db.interactions.aggregate(event_pipeline))

        category_pipeline = [
            {'$group': {'_id': '$content_category', 'count': {'$sum': 1}}},
            {'$sort': {'count': -1}}
        ]
        category_distribution = list(db.interactions.aggregate(category_pipeline))

        hourly_pipeline = [
            {
                '$group': {
                    '_id': {'$hour': '$timestamp'},
                    'count': {'$sum': 1}
                }
            },
            {'$sort': {'_id': 1}}
        ]
        hourly_pattern = list(db.interactions.aggregate(hourly_pipeline))

        recent_interactions = list(db.interactions.find().sort('timestamp', -1).limit(20))

        for interaction in recent_interactions:
            interaction['_id'] = str(interaction['_id'])

        analytics = {
            'event_distribution': event_distribution,
            'category_distribution': category_distribution,
            'hourly_pattern': hourly_pattern,
            'recent_interactions': recent_interactions
        }

        return jsonify({'success': True, 'analytics': analytics})

    except Exception as e:
        return jsonify({'success': False, 'message': f'Error retrieving interaction analytics: {str(e)}'}), 500
