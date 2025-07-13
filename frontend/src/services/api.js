import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// User API endpoints
export const userAPI = {
  // Create a new user
  createUser: (userData) => api.post('/users', userData),
  
  // Get user information
  getUser: (userId) => api.get(`/users/${userId}`),
  
  // Track user interaction
  trackInteraction: (userId, interactionData) => 
    api.post(`/users/${userId}/interactions`, interactionData),
  
  // Get user interactions
  getUserInteractions: (userId, limit = 100) => 
    api.get(`/users/${userId}/interactions?limit=${limit}`),
  
  // Predict user interests
  predictInterests: (userId) => api.post(`/users/${userId}/predict`),
  
  // Get user analytics
  getUserAnalytics: (userId) => api.get(`/users/${userId}/analytics`),
};

// Ad API endpoints
export const adAPI = {
  // Get personalized ads for user
  getPersonalizedAds: (userId, limit = 3) => 
    api.get(`/users/${userId}/ads?limit=${limit}`),
  
  // Get all ad categories
  getAdCategories: () => api.get('/ads/categories'),
  
  // Get ads by category
  getAdsByCategory: (category) => api.get(`/ads/categories/${category}`),
  
  // Get random ads
  getRandomAds: (limit = 3) => api.get(`/ads/random?limit=${limit}`),
};

// ML API endpoints
export const mlAPI = {
  // Train the ML model
  trainModel: () => api.post('/ml/train'),
  
  // Get model information
  getModelInfo: () => api.get('/ml/info'),
  
  // Predict user interests
  predictUserInterests: (userId) => api.post(`/ml/predict/${userId}`),
};

// Analytics API endpoints
export const analyticsAPI = {
  // Get system overview
  getSystemOverview: () => api.get('/analytics/overview'),
  
  // Get interest analytics
  getInterestAnalytics: () => api.get('/analytics/interests'),
  
  // Get interaction analytics
  getInteractionAnalytics: () => api.get('/analytics/interactions'),
};

// Content categories for demo
export const contentCategories = [
  {
    id: 'sports_news',
    name: 'Sports News',
    description: 'Latest sports updates and analysis',
    icon: '🏈',
    color: 'red',
    sampleContent: [
      'Championship Finals: Team A vs Team B',
      'Player Transfer Rumors Heat Up',
      'Olympic Games Preparation Update',
      'Fantasy League Tips and Strategies'
    ]
  },
  {
    id: 'tech_news',
    name: 'Technology News',
    description: 'Latest tech innovations and trends',
    icon: '💻',
    color: 'blue',
    sampleContent: [
      'New AI Breakthrough in Machine Learning',
      'Latest Smartphone Release Comparison',
      'Cybersecurity Threats and Solutions',
      'Programming Language Trends 2024'
    ]
  },
  {
    id: 'fashion_trends',
    name: 'Fashion Trends',
    description: 'Latest fashion and style updates',
    icon: '👗',
    color: 'pink',
    sampleContent: [
      'Spring Fashion Collection Preview',
      'Celebrity Style Inspiration',
      'Sustainable Fashion Movement',
      'Accessories Trends for 2024'
    ]
  },
  {
    id: 'movie_reviews',
    name: 'Movie Reviews',
    description: 'Latest movie reviews and recommendations',
    icon: '🎬',
    color: 'purple',
    sampleContent: [
      'Blockbuster Movie Review: Action Packed',
      'Indie Film Spotlight: Hidden Gems',
      'Oscar Nominees Analysis',
      'Streaming Service Recommendations'
    ]
  },
  {
    id: 'business_insights',
    name: 'Business Insights',
    description: 'Business news and market analysis',
    icon: '📈',
    color: 'green',
    sampleContent: [
      'Market Trends and Investment Tips',
      'Startup Success Stories',
      'Economic Outlook for 2024',
      'Entrepreneurship Guide'
    ]
  },
  {
    id: 'health_tips',
    name: 'Health Tips',
    description: 'Health and wellness advice',
    icon: '🏥',
    color: 'emerald',
    sampleContent: [
      'Nutrition Tips for Better Health',
      'Workout Routines for Beginners',
      'Mental Health Awareness',
      'Sleep Optimization Strategies'
    ]
  },
  {
    id: 'travel_guides',
    name: 'Travel Guides',
    description: 'Travel tips and destination guides',
    icon: '✈️',
    color: 'yellow',
    sampleContent: [
      'Top Travel Destinations 2024',
      'Budget Travel Tips and Tricks',
      'Cultural Experience Guides',
      'Travel Photography Tips'
    ]
  },
  {
    id: 'food_recipes',
    name: 'Food Recipes',
    description: 'Delicious recipes and cooking tips',
    icon: '🍳',
    color: 'orange',
    sampleContent: [
      'Quick 30-Minute Dinner Recipes',
      'Healthy Breakfast Ideas',
      'International Cuisine Guide',
      'Baking Tips and Techniques'
    ]
  }
];

// Event types for tracking
export const eventTypes = {
  PAGE_VIEW: 'page_view',
  CLICK: 'click',
  SCROLL: 'scroll',
  TIME_SPENT: 'time_spent',
  LIKE: 'like',
  SHARE: 'share',
  COMMENT: 'comment'
};

// Utility functions
export const apiUtils = {
  // Generate a random session ID
  generateSessionId: () => {
    return 'session_' + Math.random().toString(36).substr(2, 9);
  },
  
  // Track page view
  trackPageView: async (userId, contentCategory, contentId, duration = 0) => {
    try {
      await userAPI.trackInteraction(userId, {
        event_type: eventTypes.PAGE_VIEW,
        content_category: contentCategory,
        content_id: contentId,
        duration: duration,
        session_id: apiUtils.generateSessionId()
      });
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  },
  
  // Track click
  trackClick: async (userId, contentCategory, contentId) => {
    try {
      await userAPI.trackInteraction(userId, {
        event_type: eventTypes.CLICK,
        content_category: contentCategory,
        content_id: contentId,
        session_id: apiUtils.generateSessionId()
      });
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  },
  
  // Track time spent
  trackTimeSpent: async (userId, contentCategory, contentId, duration) => {
    try {
      await userAPI.trackInteraction(userId, {
        event_type: eventTypes.TIME_SPENT,
        content_category: contentCategory,
        content_id: contentId,
        duration: duration,
        session_id: apiUtils.generateSessionId()
      });
    } catch (error) {
      console.error('Error tracking time spent:', error);
    }
  }
};

export default api; 