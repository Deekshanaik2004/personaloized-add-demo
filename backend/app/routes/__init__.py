from flask import Blueprint

api_bp = Blueprint('api', __name__)

from . import user_routes, ad_routes, ml_routes, analytics_routes 