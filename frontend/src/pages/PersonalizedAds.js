import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { adAPI, userAPI } from '../services/api';
import { Target, TrendingUp, Eye, MousePointer, Clock } from 'lucide-react';

const PersonalizedAds = () => {
  const { user } = useUser();
  const [ads, setAds] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPersonalizedAds();
  }, [user]);

  const loadPersonalizedAds = async () => {
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      // Get user's interest prediction
      const predictionResponse = await userAPI.predictInterests(user.user_id);
      
      if (predictionResponse.data.success) {
        setPrediction(predictionResponse.data.prediction);
      }

      // Get personalized ads
      const adsResponse = await adAPI.getPersonalizedAds(user.user_id, 6);
      
      if (adsResponse.data.success) {
        setAds(adsResponse.data.ads);
      } else {
        setError('Failed to load personalized ads');
      }
    } catch (error) {
      setError('Error loading personalized ads');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInterestColor = (interest) => {
    const colors = {
      sports: 'bg-red-100 text-red-800',
      technology: 'bg-blue-100 text-blue-800',
      fashion: 'bg-pink-100 text-pink-800',
      entertainment: 'bg-purple-100 text-purple-800',
      business: 'bg-green-100 text-green-800',
      health: 'bg-emerald-100 text-emerald-800',
      travel: 'bg-yellow-100 text-yellow-800',
      food: 'bg-orange-100 text-orange-800'
    };
    return colors[interest] || colors.technology;
  };

  const formatConfidence = (confidence) => {
    return Math.round(confidence * 100);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing your behavior and generating personalized ads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Personalized Ads</h1>
          <p className="text-gray-600">
            Ads tailored to your interests based on your browsing behavior
          </p>
        </div>
        
        <button
          onClick={loadPersonalizedAds}
          className="btn-secondary flex items-center space-x-2"
        >
          <Target className="w-4 h-4" />
          <span>Refresh Ads</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Interest Prediction */}
      {prediction && (
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Your Interest Prediction</h2>
              <p className="text-gray-600">Based on your browsing behavior</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Primary Interest</h3>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getInterestColor(prediction.primary_interest)}`}>
                  {prediction.primary_interest}
                </span>
                <span className="text-sm text-gray-600">
                  {formatConfidence(prediction.confidence)}% confidence
                </span>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-3">Interest Scores</h3>
              <div className="space-y-2">
                {Object.entries(prediction.interest_scores)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5)
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
                        <span className="text-xs text-gray-500">{formatConfidence(score)}%</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Personalized Ads Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Recommended Ads</h2>
        
        {ads.length === 0 ? (
          <div className="text-center py-12">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No personalized ads available yet.</p>
            <p className="text-sm text-gray-500">Try browsing more content to generate recommendations.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ads.map((ad, index) => (
              <div key={ad.id} className="ad-card group">
                <div className="aspect-video bg-gray-200 relative overflow-hidden">
                  <img
                    src={ad.image_url}
                    alt={ad.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                      Ad
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{ad.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{ad.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <button className="btn-primary text-sm">
                      {ad.cta}
                    </button>
                    
                    <div className="text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>Personalized</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Recommendation reason:</span>
                      <span className="text-primary-600 font-medium">
                        {ad.recommendation_reason}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                      <span>Confidence:</span>
                      <span className="font-medium">
                        {Math.round(ad.confidence_score * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* How Personalization Works */}
      <div className="card bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <h3 className="font-semibold text-gray-900 mb-4">How Personalization Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <MousePointer className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Track Behavior</h4>
            <p className="text-sm text-gray-600">
              Monitor clicks, time spent, and content preferences
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">ML Analysis</h4>
            <p className="text-sm text-gray-600">
              Machine learning algorithms analyze patterns and predict interests
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Targeted Ads</h4>
            <p className="text-sm text-gray-600">
              Display relevant ads based on predicted interests
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedAds; 