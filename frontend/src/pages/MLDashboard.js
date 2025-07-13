import React, { useState, useEffect } from 'react';
import { mlAPI } from '../services/api';
import { Brain, Cpu, TrendingUp, Activity, Zap, Target } from 'lucide-react';

const MLDashboard = () => {
  const [modelInfo, setModelInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [training, setTraining] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadModelInfo();
  }, []);

  const loadModelInfo = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await mlAPI.getModelInfo();
      
      if (response.data.success) {
        setModelInfo(response.data.model_info);
      } else {
        setError('Failed to load model information');
      }
    } catch (error) {
      setError('Error loading model information');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTrainModel = async () => {
    setTraining(true);
    setError('');

    try {
      const response = await mlAPI.trainModel();
      
      if (response.data.success) {
        // Reload model info after training
        await loadModelInfo();
        alert(`Model trained successfully! Accuracy: ${(response.data.accuracy * 100).toFixed(1)}%`);
      } else {
        setError(response.data.message || 'Failed to train model');
      }
    } catch (error) {
      setError('Error training model');
      console.error('Error:', error);
    } finally {
      setTraining(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ML model information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Machine Learning Dashboard</h1>
          <p className="text-gray-600">
            Monitor and manage the ML model that powers personalized ad recommendations
          </p>
        </div>
        
        <button
          onClick={handleTrainModel}
          disabled={training}
          className="btn-primary flex items-center space-x-2"
        >
          {training ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Training...</span>
            </>
          ) : (
            <>
              <Brain className="w-4 h-4" />
              <span>Train Model</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Model Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Cpu className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Model Status</p>
              <p className="text-lg font-bold text-gray-900">
                {modelInfo?.status === 'trained' ? 'Active' : 'Not Trained'}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Activity className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Model Type</p>
              <p className="text-lg font-bold text-gray-900">
                {modelInfo?.model_type || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Categories</p>
              <p className="text-lg font-bold text-gray-900">
                {modelInfo?.categories?.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Model Details */}
      {modelInfo?.status === 'trained' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Model Information */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Model Type</p>
                <p className="font-medium text-gray-900">{modelInfo.model_type}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Model Path</p>
                <p className="font-medium text-gray-900 text-sm">{modelInfo.model_path}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Features Used</p>
                <p className="font-medium text-gray-900">{modelInfo.feature_names?.length || 0} features</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Target Categories</p>
                <p className="font-medium text-gray-900">{modelInfo.categories?.length || 0} categories</p>
              </div>
            </div>
          </div>

          {/* Feature List */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Features Used</h3>
            <div className="space-y-2">
              {modelInfo.feature_names?.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="text-center py-8">
            <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Model Not Trained</h3>
            <p className="text-gray-600 mb-4">
              The machine learning model needs to be trained before it can make predictions.
            </p>
            <button
              onClick={handleTrainModel}
              disabled={training}
              className="btn-primary"
            >
              {training ? 'Training...' : 'Train Model Now'}
            </button>
          </div>
        </div>
      )}

      {/* Interest Categories */}
      {modelInfo?.categories && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Interest Categories</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {modelInfo.categories.map((category, index) => (
              <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-2">
                  {getCategoryIcon(category)}
                </div>
                <p className="text-sm font-medium text-gray-900 capitalize">{category}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* How ML Works */}
      <div className="card bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <h3 className="font-semibold text-gray-900 mb-4">How Machine Learning Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Data Collection</h4>
            <p className="text-sm text-gray-600">
              Track user interactions, clicks, time spent, and content preferences
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Feature Engineering</h4>
            <p className="text-sm text-gray-600">
              Extract meaningful features from raw interaction data
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Model Training</h4>
            <p className="text-sm text-gray-600">
              Train classification models on historical user behavior data
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6 text-orange-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Prediction</h4>
            <p className="text-sm text-gray-600">
              Predict user interests and recommend relevant ads
            </p>
          </div>
        </div>
      </div>

      {/* Technical Details */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Algorithms Used</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Random Forest Classifier</li>
              <li>• Logistic Regression</li>
              <li>• k-Nearest Neighbors (k-NN)</li>
              <li>• Best performing model is automatically selected</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Features Extracted</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Click frequency per category</li>
              <li>• Time spent on different content types</li>
              <li>• Session duration and frequency</li>
              <li>• Total interaction patterns</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const getCategoryIcon = (category) => {
  const icons = {
    sports: '🏈',
    technology: '💻',
    fashion: '👗',
    entertainment: '🎬',
    business: '📈',
    health: '🏥',
    travel: '✈️',
    food: '🍳'
  };
  return icons[category] || '📊';
};

export default MLDashboard; 