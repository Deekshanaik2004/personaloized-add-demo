# Personalized Ads Demo System

A demonstration system that shows how personalized advertisements work using machine learning to track user behavior and display tailored ads.

## 🎯 Overview

This demo system simulates a real-world personalized advertising platform where:
- Users interact with content (clicks, views, time spent)
- Machine learning models analyze user behavior patterns
- Personalized ads are displayed based on predicted interests
- All interactions are tracked and stored for continuous learning

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │  Flask Backend  │    │   MongoDB DB    │
│                 │    │                 │    │                 │
│ • User Interface│◄──►│ • API Endpoints │◄──►│ • User Data     │
│ • Ad Display    │    │ • ML Processing │    │ • Interactions  │
│ • Interaction   │    │ • Data Analysis │    │ • Predictions   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Features

### Frontend (React)
- Interactive content browsing interface
- Real-time ad display based on user behavior
- User interaction tracking (clicks, time spent, scroll behavior)
- Visual dashboard showing user interests and ad performance

### Backend (Flask)
- RESTful API endpoints for data collection
- Machine learning model integration
- User behavior analysis and interest classification
- Real-time ad recommendation engine

### Machine Learning
- **Algorithm**: Logistic Regression, Decision Trees, k-NN
- **Input**: User click history, time spent, interaction patterns
- **Output**: Interest categories (Sports, Tech, Fashion, etc.)
- **Tools**: Scikit-learn, TensorFlow

### Database (MongoDB)
- User profiles and interaction history
- Ad inventory and performance metrics
- ML model predictions and accuracy tracking

## 📁 Project Structure

```
personalized-add-demo/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   └── package.json
├── backend/                 # Flask application
│   ├── app/
│   │   ├── models/         # ML models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utilities
│   ├── requirements.txt
│   └── config.py
├── ml_models/              # Trained ML models
├── data/                   # Sample data and datasets
└── docs/                   # Documentation
```

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Python Flask, RESTful APIs
- **Machine Learning**: Scikit-learn, TensorFlow, Pandas, NumPy
- **Database**: MongoDB
- **Deployment**: Docker (optional)

## 🎮 Demo Flow

1. **User Registration**: Create a demo user profile
2. **Content Browsing**: Browse through different content categories
3. **Behavior Tracking**: System tracks clicks, time spent, interactions
4. **ML Analysis**: Backend processes behavior data through ML models
5. **Interest Classification**: User gets classified into interest categories
6. **Personalized Ads**: Relevant ads are displayed based on predictions
7. **Performance Tracking**: Ad performance and user engagement metrics

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- MongoDB
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd personalized-add-demo
   ```

2. **Setup Backend**
   ```bash
   cd backend
   pip install -r requirements.txt
   python app.py
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Setup Database**
   - Install and start MongoDB
   - The app will automatically create necessary collections

## 📊 ML Model Details

### Features Used
- Click frequency per category
- Time spent on different content types
- Interaction patterns (likes, shares, comments)
- Session duration and frequency
- Device and browser information

### Interest Categories
- **Sports**: Football, Basketball, Tennis, etc.
- **Technology**: Programming, AI, Gadgets, etc.
- **Fashion**: Clothing, Accessories, Beauty, etc.
- **Entertainment**: Movies, Music, Gaming, etc.
- **Business**: Finance, Entrepreneurship, etc.

### Model Performance
- Accuracy: ~85-90%
- Training data: Synthetic user behavior data
- Retraining: Weekly with new interaction data

## 🔧 Configuration

### Environment Variables
```bash
# Backend
FLASK_ENV=development
MONGODB_URI=mongodb://localhost:27017/personalized_ads
ML_MODEL_PATH=./ml_models/user_classifier.pkl

# Frontend
REACT_APP_API_URL=http://localhost:5000/api
```

## 📈 Analytics Dashboard

The system includes a comprehensive analytics dashboard showing:
- User engagement metrics
- Ad performance by category
- ML model accuracy over time
- Revenue and conversion rates
- User behavior insights

## 🔒 Privacy & Ethics

This is a **demo system** for educational purposes. In a real-world scenario:
- Implement proper data privacy controls
- Follow GDPR and other privacy regulations
- Use anonymized data for ML training
- Provide clear opt-out mechanisms
- Regular privacy audits and compliance checks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is for educational purposes. Please ensure compliance with local laws and regulations when implementing similar systems.

## 🆘 Support

For questions or issues:
- Check the documentation in `/docs`
- Review the code comments
- Open an issue on GitHub

---

**Note**: This is a demonstration system. Real-world personalized advertising systems require additional security, privacy, and compliance measures. 