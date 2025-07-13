import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os
from datetime import datetime

class UserInterestClassifier:
    """Machine Learning model for classifying user interests based on behavior"""

    def __init__(self, model_path='./ml_models/user_classifier.pkl'):
        self.model_path = model_path
        self.model = None
        self.scaler = StandardScaler()

        # Categories use 'tech' instead of 'technology' to match feature_names
        self.categories = [
            'sports', 'tech', 'fashion', 'entertainment',
            'business', 'health', 'travel', 'food'
        ]

        self.feature_names = []
        for category in self.categories:
            self.feature_names.append(f'{category}_clicks')
            self.feature_names.append(f'{category}_time')

        self.feature_names += [
            'total_sessions', 'avg_session_duration', 'total_interactions'
        ]

        self.load_model()

    def generate_synthetic_data(self, n_samples=1000):
        """Generate synthetic training data for the ML model"""
        np.random.seed(42)

        data = []
        for _ in range(n_samples):
            user_data = {}

            for category in self.categories:
                user_data[f'{category}_clicks'] = np.random.randint(0, 21)
                user_data[f'{category}_time'] = np.random.randint(0, 300)

            user_data['total_sessions'] = np.random.randint(1, 50)
            user_data['avg_session_duration'] = np.random.randint(60, 1800)
            user_data['total_interactions'] = np.random.randint(10, 200)

            category_scores = [
                user_data[f'{cat}_clicks'] * 2 + user_data[f'{cat}_time'] / 10
                for cat in self.categories
            ]

            category_scores = np.array(category_scores) + np.random.normal(0, 5, len(category_scores))
            primary_interest = self.categories[np.argmax(category_scores)]

            user_data['primary_interest'] = primary_interest
            data.append(user_data)

        return pd.DataFrame(data)

    def train_model(self, data=None):
        """Train the machine learning model"""
        if data is None:
            data = self.generate_synthetic_data()

        print("Data Columns in train_model:", data.columns.tolist())  # Debugging check

        X = data[self.feature_names]
        y = data['primary_interest']

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)

        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X_train_scaled, y_train)

        self.model = model

        self.save_model()

        y_pred = self.model.predict(X_test_scaled)
        score = accuracy_score(y_test, y_pred)

        print(f"✅ Best model accuracy: {score:.3f}")
        print("\nClassification Report:")
        print(classification_report(y_test, y_pred, target_names=self.categories))

        return score

    def save_model(self):
        """Save the trained model to disk"""
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)

        model_data = {
            'model': self.model,
            'scaler': self.scaler,
            'categories': self.categories,
            'feature_names': self.feature_names,
            'trained_at': datetime.now().isoformat()
        }

        joblib.dump(model_data, self.model_path)
        print(f"Model saved to {self.model_path}")

    def load_model(self):
        """Load a trained model from disk"""
        try:
            if os.path.exists(self.model_path):
                model_data = joblib.load(self.model_path)
                self.model = model_data['model']
                self.scaler = model_data['scaler']
                self.categories = model_data['categories']
                self.feature_names = model_data['feature_names']
                print(f"Model loaded from {self.model_path}")
                return True
        except Exception as e:
            print(f"Error loading model: {e}")

        return False

    def get_model_info(self):
        if self.model is None:
            return {'status': 'not_trained'}
        return {
            'status': 'trained',
            'model_type': type(self.model).__name__,
            'categories': self.categories,
            'feature_names': self.feature_names,
            'model_path': self.model_path
        }
