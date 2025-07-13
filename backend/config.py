import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Configuration class for the Flask application"""
    
    # Flask Configuration
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    DEBUG = os.environ.get('FLASK_ENV') == 'development'
    
    # MongoDB Configuration
    MONGODB_URI = os.environ.get('MONGODB_URI') or 'mongodb://localhost:27017/personalized_ads'
    MONGODB_DB = 'personalized_ads'
    
    # Machine Learning Configuration
    ML_MODEL_PATH = os.environ.get('ML_MODEL_PATH') or './ml_models/user_classifier.pkl'
    ML_MODEL_VERSION = '1.0.0'
    
    # Interest Categories for Classification
    INTEREST_CATEGORIES = [
        'sports',
        'technology', 
        'fashion',
        'entertainment',
        'business',
        'health',
        'travel',
        'food'
    ]
    
    # Ad Categories with sample ads
    AD_CATEGORIES = {
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
    
    # User Behavior Tracking Configuration
    TRACKING_EVENTS = [
        'page_view',
        'click',
        'scroll',
        'time_spent',
        'like',
        'share',
        'comment'
    ]
    
    # Content Categories for User Interaction
    CONTENT_CATEGORIES = [
        'sports_news',
        'tech_news', 
        'fashion_trends',
        'movie_reviews',
        'business_insights',
        'health_tips',
        'travel_guides',
        'food_recipes'
    ] 