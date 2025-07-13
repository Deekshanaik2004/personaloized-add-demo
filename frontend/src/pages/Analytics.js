import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { userAPI } from '../services/api';
import { BarChart3, TrendingUp, Clock, MousePointer, Eye, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Analytics = () => {
  const { user } = useUser();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAnalytics();
  }, [user]);

  const loadAnalytics = async () => {
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      const response = await userAPI.getUserAnalytics(user.user_id);
      
      if (response.data.success) {
        setAnalytics(response.data.analytics);
      } else {
        setError('Failed to load analytics');
      }
    } catch (error) {
      setError('Error loading analytics');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      sports_news: '#ef4444',
      tech_news: '#3b82f6',
      fashion_trends: '#ec4899',
      movie_reviews: '#8b5cf6',
      business_insights: '#10b981',
      health_tips: '#059669',
      travel_guides: '#eab308',
      food_recipes: '#f97316'
    };
    return colors[category] || '#6b7280';
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No analytics data available yet.</p>
          <p className="text-sm text-gray-500">Start browsing content to generate analytics.</p>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const categoryData = Object.entries(analytics.category_breakdown || {}).map(([category, count]) => ({
    name: category.replace('_', ' '),
    value: count,
    color: getCategoryColor(category)
  }));

  const eventData = Object.entries(analytics.event_type_breakdown || {}).map(([event, count]) => ({
    name: event.replace('_', ' '),
    value: count
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Analytics</h1>
          <p className="text-gray-600">
            Insights into your browsing behavior and interaction patterns
          </p>
        </div>
        
        <button
          onClick={loadAnalytics}
          className="btn-secondary flex items-center space-x-2"
        >
          <BarChart3 className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <MousePointer className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Interactions</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.interaction_stats?.total_interactions || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Sessions</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.interaction_stats?.unique_sessions || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Eye className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg. Interactions/Session</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(analytics.interaction_stats?.avg_interactions_per_session || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Activity className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Primary Interest</p>
              <p className="text-lg font-bold text-gray-900 capitalize">
                {analytics.prediction?.primary_interest || 'None'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Category Distribution</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No category data available
            </div>
          )}
        </div>

        {/* Event Type Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Interaction Types</h3>
          {eventData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={eventData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No event data available
            </div>
          )}
        </div>
      </div>

      {/* Prediction Details */}
      {analytics.prediction && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Interest Prediction Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Primary Interest</h4>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800`}>
                  {analytics.prediction.primary_interest}
                </span>
                <span className="text-sm text-gray-600">
                  {Math.round(analytics.prediction.confidence * 100)}% confidence
                </span>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Interest Scores</h4>
              <div className="space-y-2">
                {Object.entries(analytics.prediction.interest_scores || {})
                  .sort(([,a], [,b]) => b - a)
                  .map(([interest, score]) => (
                    <div key={interest} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 capitalize">{interest}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-600 h-2 rounded-full" 
                            style={{ width: `${score * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">{Math.round(score * 100)}%</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Info */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Name</p>
            <p className="font-medium text-gray-900">{analytics.user_info?.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-medium text-gray-900">{analytics.user_info?.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Last Active</p>
            <p className="font-medium text-gray-900">
              {analytics.user_info?.last_active ? 
                new Date(analytics.user_info.last_active).toLocaleDateString() : 
                'Unknown'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="card bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <h3 className="font-semibold text-gray-900 mb-4">Behavioral Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Most Active Categories</h4>
            <div className="space-y-2">
              {Object.entries(analytics.category_breakdown || {})
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3)
                .map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">
                      {category.replace('_', ' ')}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{count} interactions</span>
                  </div>
                ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Interaction Patterns</h4>
            <div className="space-y-2">
              {Object.entries(analytics.event_type_breakdown || {})
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3)
                .map(([event, count]) => (
                  <div key={event} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">
                      {event.replace('_', ' ')}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{count} times</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 