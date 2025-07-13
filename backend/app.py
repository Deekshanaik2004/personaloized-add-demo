from app import create_app

app = create_app()

if __name__ == '__main__':
    print("🚀 Starting Personalized Ads Demo Backend...")
    print("📊 ML Model: Training on startup...")
    
    # Train the ML model on startup
    with app.app_context():
        from app.services.user_service import UserService
        user_service = UserService(app.mongo)
        
        # Check if model exists, if not train it
        model_info = user_service.get_model_info()
        if model_info['status'] == 'not_trained':
            print("🤖 Training ML model...")
            result = user_service.train_ml_model()
            if result['success']:
                print(f"✅ Model trained successfully! Accuracy: {result['accuracy']:.3f}")
            else:
                print(f"❌ Model training failed: {result['message']}")
        else:
            print(f"✅ Model already trained: {model_info['model_type']}")
    
    print("🌐 Starting Flask server on http://localhost:5000")
    print("📚 API Documentation available at http://localhost:5000/api")
    app.run(debug=True, host='0.0.0.0', port=5000) 