from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient
from config import Config
from app.routes import api_bp

def create_app(config_class=Config):
    """Application factory pattern for Flask"""
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Enable CORS for frontend communication
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Initialize MongoDB connection
    client = MongoClient(app.config['MONGODB_URI'])
    app.mongo = client[app.config['MONGODB_DB']]

    # Register blueprints
    app.register_blueprint(api_bp, url_prefix='/api')

    # Create indexes for better performance
    with app.app_context():
        # User collection indexes
        app.mongo.users.create_index('user_id', unique=True)
        app.mongo.users.create_index('email', unique=True)

        # Interactions collection indexes
        app.mongo.interactions.create_index('user_id')
        app.mongo.interactions.create_index('timestamp')
        app.mongo.interactions.create_index([('user_id', 1), ('timestamp', -1)])

        # Predictions collection indexes
        app.mongo.predictions.create_index('user_id', unique=True)
        app.mongo.predictions.create_index('timestamp')

        # Ads collection indexes
        app.mongo.ads.create_index('ad_id', unique=True)
        app.mongo.ads.create_index('category')

    return app
