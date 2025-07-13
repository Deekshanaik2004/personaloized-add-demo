# 🚀 Quick Start Guide

Get the Personalized Ads Demo running in minutes!

## Prerequisites

- **Python 3.8+** - [Download here](https://www.python.org/downloads/)
- **Node.js 16+** - [Download here](https://nodejs.org/)
- **MongoDB** - [Download here](https://www.mongodb.com/try/download/community)

## ⚡ Quick Setup

### 1. Install Dependencies

**Backend (Python):**
```bash
cd backend
pip install -r requirements.txt
```

**Frontend (Node.js):**
```bash
cd frontend
npm install
```

### 2. Start MongoDB

**Windows:**
```bash
# Start MongoDB service
net start MongoDB
```

**macOS/Linux:**
```bash
# Start MongoDB service
sudo systemctl start mongod
# or
brew services start mongodb-community
```

### 3. Start the Application

**Option A: Use the provided scripts**

**Windows:**
```bash
start.bat
```

**macOS/Linux:**
```bash
chmod +x start.sh
./start.sh
```

**Option B: Manual start**

**Terminal 1 - Backend:**
```bash
cd backend
python app.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### 4. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

## 🎯 Demo Flow

1. **Create Account** - Register with your name and email
2. **Browse Content** - Click on different content categories
3. **Watch Tracking** - See your behavior being tracked in real-time
4. **View Predictions** - Check your personalized interest predictions
5. **See Ads** - View ads tailored to your interests
6. **Explore Analytics** - Dive into your behavior analytics

## 🔧 Troubleshooting

### Common Issues

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check if MongoDB is installed correctly
- Verify the connection string in `backend/config.py`

**Python Dependencies Error:**
```bash
cd backend
pip install --upgrade pip
pip install -r requirements.txt
```

**Node.js Dependencies Error:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Port Already in Use:**
- Backend: Change port in `backend/app.py` (line with `app.run`)
- Frontend: React will automatically suggest an alternative port

### Getting Help

1. Check the console output for error messages
2. Ensure all prerequisites are installed
3. Verify MongoDB is running
4. Check if ports 3000 and 5000 are available

## 📊 What You'll See

### Content Browser
- 8 different content categories (Sports, Tech, Fashion, etc.)
- Real-time behavior tracking
- Interactive content cards

### Personalized Ads
- ML-powered interest predictions
- Tailored ad recommendations
- Confidence scores and reasoning

### Analytics Dashboard
- User behavior insights
- Interaction patterns
- Visual charts and graphs

### ML Dashboard
- Model information and status
- Training capabilities
- Technical details

## 🎮 Interactive Features

- **Click Tracking** - Every click is recorded and analyzed
- **Time Spent** - Duration on content affects predictions
- **Category Preferences** - Your browsing patterns shape recommendations
- **Real-time Updates** - See changes as you interact

## 🔒 Privacy Note

This is a **demo system** for educational purposes. All data is stored locally and can be cleared by restarting the application.

---

**Ready to explore?** Start the application and begin your personalized ads journey! 🎉 