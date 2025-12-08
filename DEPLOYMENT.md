# Quick Start - Render Deployment

## 🚀 Deploy in 3 Steps

### 1. Prepare MongoDB
- Create free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Get connection string
- Whitelist all IPs (0.0.0.0/0)

### 2. Deploy Backend
1. Go to [Render](https://render.com)
2. New → Web Service
3. Connect GitHub repo
4. Settings:
   - Root Directory: `backend`
   - Build: `npm install`
   - Start: `npm start`
5. Add environment variables (see `.env.example`)
6. Deploy!

### 3. Deploy Frontend
1. New → Static Site
2. Settings:
   - Root Directory: `frontend/front`
   - Build: `npm install && npm run build`
   - Publish: `dist`
3. Add `VITE_API_URL` env var
4. Deploy!

### 4. Update CORS
- Update backend `CORS_ORIGIN` with frontend URL
- Save & redeploy

## 📚 Full Guide
See [RENDER_DEPLOYMENT_GUIDE.md](C:\Users\ayush\.gemini\antigravity\brain\c477e36a-41b8-474b-86c5-20b9b0e083fc\RENDER_DEPLOYMENT_GUIDE.md) for detailed instructions.

## 🔑 Required API Keys
- YouTube Data API v3
- Groq API
- Cloudinary

## ⚡ Free Tier
Both services run free on Render!
