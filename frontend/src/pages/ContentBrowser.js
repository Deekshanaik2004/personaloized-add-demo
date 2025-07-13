import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { contentCategories, apiUtils, eventTypes, userAPI } from '../services/api';
import { Eye, Clock, MousePointer, TrendingUp } from 'lucide-react';

const ContentBrowser = () => {
  const { user } = useUser();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [interactionStats, setInteractionStats] = useState({
    totalClicks: 0,
    totalTime: 0,
    totalViews: 0
  });
  const [loading, setLoading] = useState(false);

  // Track page view when component mounts
  useEffect(() => {
    if (user) {
      apiUtils.trackPageView(user.user_id, 'content_browser', 'main_page');
    }
  }, [user]);

  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);
    setLoading(true);

    try {
      // Track the click
      await apiUtils.trackClick(user.user_id, category.id, category.id);
      
      // Update interaction stats
      setInteractionStats(prev => ({
        ...prev,
        totalClicks: prev.totalClicks + 1
      }));

      // Simulate time spent on content
      setTimeout(() => {
        const timeSpent = Math.floor(Math.random() * 120) + 30; // 30-150 seconds
        apiUtils.trackTimeSpent(user.user_id, category.id, category.id, timeSpent);
        
        setInteractionStats(prev => ({
          ...prev,
          totalTime: prev.totalTime + timeSpent,
          totalViews: prev.totalViews + 1
        }));
        
        setLoading(false);
      }, 2000);

    } catch (error) {
      console.error('Error tracking interaction:', error);
      setLoading(false);
    }
  };

  const getCategoryColor = (color) => {
    const colors = {
      red: 'bg-red-100 text-red-800 border-red-200',
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      pink: 'bg-pink-100 text-pink-800 border-pink-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      orange: 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Browser</h1>
          <p className="text-gray-600">
            Browse different content categories and watch how your behavior influences personalized ads
          </p>
        </div>
        
        {/* Interaction Stats */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MousePointer className="w-4 h-4" />
            <span>{interactionStats.totalClicks} clicks</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{Math.round(interactionStats.totalTime / 60)}m spent</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Eye className="w-4 h-4" />
            <span>{interactionStats.totalViews} views</span>
          </div>
        </div>
      </div>

      {/* Content Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contentCategories.map((category) => (
          <div
            key={category.id}
            className={`content-card cursor-pointer transition-all duration-200 hover:scale-105 ${
              selectedCategory?.id === category.id ? 'ring-2 ring-primary-500' : ''
            }`}
            onClick={() => handleCategoryClick(category)}
          >
            <div className="flex items-start space-x-3">
              <div className="text-3xl">{category.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                
                <div className="space-y-2">
                  {category.sampleContent.slice(0, 2).map((content, index) => (
                    <div
                      key={index}
                      className="text-xs text-gray-500 bg-gray-50 rounded px-2 py-1"
                    >
                      {content}
                    </div>
                  ))}
                </div>
                
                <div className="mt-3">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(category.color)}`}>
                    {category.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Category Details */}
      {selectedCategory && (
        <div className="card animate-fade-in">
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-2xl">{selectedCategory.icon}</div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{selectedCategory.name}</h2>
              <p className="text-gray-600">{selectedCategory.description}</p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Analyzing your interest in {selectedCategory.name}...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedCategory.sampleContent.map((content, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <h4 className="font-medium text-gray-900 mb-1">Sample Content {index + 1}</h4>
                    <p className="text-sm text-gray-600">{content}</p>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Behavior Tracking Active</span>
                </div>
                <p className="text-sm text-blue-700">
                  Your interaction with {selectedCategory.name} content is being tracked and will influence 
                  your personalized ad recommendations. Try clicking on different categories to see how 
                  your preferences change!
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="card bg-gradient-to-r from-primary-50 to-purple-50 border-primary-200">
        <h3 className="font-semibold text-gray-900 mb-3">How it works:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start space-x-2">
            <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-primary-600">1</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Browse Content</p>
              <p className="text-gray-600">Click on different content categories to simulate browsing behavior</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-primary-600">2</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">ML Analysis</p>
              <p className="text-gray-600">Our machine learning model analyzes your behavior patterns</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-primary-600">3</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Personalized Ads</p>
              <p className="text-gray-600">View ads tailored to your predicted interests</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentBrowser; 