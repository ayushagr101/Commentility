# 🎬 Commentility

**AI-Powered YouTube Comment Analysis Platform**

Commentility is a full-stack web application that leverages artificial intelligence to analyze YouTube video comments, providing sentiment analysis, AI-generated summaries, and visual insights to help content creators understand their audience better.

![Commentility Banner](https://img.shields.io/badge/YouTube-Comment%20Analyzer-blue?style=for-the-badge&logo=youtube)

---

## ✨ Features

### 🎯 Core Functionality
- **YouTube Comment Extraction**: Fetch comments from any YouTube video using the YouTube Data API
- **Sentiment Analysis**: Analyze comments for positive, negative, and neutral sentiments
- **AI-Powered Summaries**: Generate intelligent summaries using Groq's LLM (Llama 3.3)
- **Visual Analytics**: 
  - Sentiment distribution charts
  - Word cloud generation
  - Top comments highlighting
- **Analysis History**: Save and retrieve past analyses
- **User Authentication**: Secure login and signup with JWT-based authentication

### 🎨 User Interface
- Modern, responsive design with a Stranger Things-inspired theme
- Bluish-green color palette with professional aesthetics
- Real-time analysis progress indicators
- Interactive sidebar with analysis history
- Smooth animations and transitions

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Framer Motion** - Animations
- **Lucide React** - Icon library
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications
- **Tailwind CSS** - Utility-first CSS framework

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (via Mongoose)
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Groq AI** - LLM for comment summarization
- **Google APIs** - YouTube Data API v3
- **Cloudinary** - Image storage for visualizations

### Additional Tools
- **Python** - For sentiment analysis scripts
- **Chart.js/Matplotlib** - Data visualization
- **WordCloud** - Word cloud generation

---

## 📋 Prerequisites

Before running this project, ensure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance)
- **Python 3.x** (for sentiment analysis)
- **API Keys**:
  - YouTube Data API v3 key
  - Groq API key
  - Cloudinary credentials

---

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/ayushagr101/Commentility.git
cd Commentility
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:5173
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d
YOUTUBE_API_KEY=your_youtube_api_key
GROQ_API_KEY=your_groq_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 3. Frontend Setup
```bash
cd ../frontend/front
npm install
```

### 4. Python Dependencies (for sentiment analysis)
```bash
pip install textblob matplotlib wordcloud pillow
```

---

## 🎮 Usage

### Start the Backend Server
```bash
cd backend
npm run dev
```
The backend will run on `http://localhost:8000`

### Start the Frontend Development Server
```bash
cd frontend/front
npm run dev
```
The frontend will run on `http://localhost:5173`

### Using the Application

1. **Sign Up / Log In**: Create an account or log in to access the dashboard
2. **Enter YouTube URL**: Paste a YouTube video URL in the input field
3. **Analyze**: Click the "Analyze" button to start the analysis
4. **View Results**: 
   - Sentiment distribution chart
   - AI-generated summary
   - Word cloud
   - Top comments
   - Net sentiment score
5. **Access History**: View past analyses from the sidebar

---

## 📁 Project Structure

```
Commentility/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── models/           # MongoDB schemas
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Auth & error handling
│   │   ├── services/         # External services (Groq, YouTube)
│   │   ├── utils/            # Helper functions
│   │   └── index.js          # Entry point
│   └── package.json
├── frontend/
│   └── front/
│       ├── src/
│       │   ├── components/   # React components
│       │   └── App.jsx       # Main app component
│       ├── pages/            # Page components
│       │   ├── HomePage.jsx
│       │   └── LoginSignup.jsx
│       └── package.json
├── check/                    # Sentiment analysis scripts
│   └── sentiment.js
└── README.md
```

---

## 🔑 API Endpoints

### Authentication
- `POST /api/v1/users/register` - Register a new user
- `POST /api/v1/users/login` - Login user
- `POST /api/v1/users/logout` - Logout user
- `GET /api/v1/users/current-user` - Get current user

### Comment Analysis
- `POST /api/v1/users/analyze-comments` - Analyze YouTube video comments
- `GET /api/v1/users/history` - Get user's analysis history
- `GET /api/v1/users/history/:id` - Get specific analysis by ID

### Health Check
- `GET /health` - Server health status

---

## 🧪 Features in Detail

### Sentiment Analysis
The application uses TextBlob for sentiment analysis, categorizing comments into:
- **Positive**: Sentiment polarity > 0.1
- **Negative**: Sentiment polarity < -0.1
- **Neutral**: Sentiment polarity between -0.1 and 0.1

### AI Summary Generation
Powered by Groq's Llama 3.3 model, the AI generates:
- Overall sentiment overview
- Key themes and topics
- Notable patterns in viewer feedback
- Actionable insights for content creators

### Visualization
- **Sentiment Chart**: Pie chart showing distribution of sentiments
- **Word Cloud**: Visual representation of most frequent words
- Both visualizations are generated server-side and stored in Cloudinary

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👨‍💻 Author

**OnlyBasics** (Harshvardhan Singh Chauhan, Ayush Agarwal and Harsh Choudahry)

---

## 🙏 Acknowledgments

- YouTube Data API for comment extraction
- Groq AI for intelligent summarization
- Cloudinary for image hosting
- The open-source community for amazing tools and libraries

---

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Made with ❤️ for content creators**


