# 🚀 Complete Deployment Guide

This guide will help you deploy the Event Management Board with AI features to production.

## Prerequisites

- Git repository (GitHub, GitLab, or Bitbucket)
- Google Gemini API key from [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
- MongoDB (local or MongoDB Atlas cloud database)
- Accounts on Vercel/Railway (backend) and Netlify (frontend)

## Step 1: Prepare Your Code for Deployment

### 1.1 Update MongoDB Connection
In `backend/index.js`, ensure your MongoDB connection string is correct:

```javascript
// For local development (already set):
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eventdb')

// For MongoDB Atlas (cloud):
// Use: mongodb+srv://username:password@cluster.mongodb.net/eventdb?retryWrites=true&w=majority
```

### 1.2 Update CORS for Production
Update `backend/index.js` to allow your Netlify frontend domain:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',          // Development
    'http://localhost:3000',          // Fallback dev
    'https://your-netlify-site.netlify.app'  // Production
  ]
}));
```

### 1.3 Test locally first
```bash
# Terminal 1 - Start backend
cd backend
npm start

# Terminal 2 - Start frontend
cd frontend
npm run dev

# Test AI features in the app
```

## Step 2: Deploy Backend (Vercel or Railway)

### Option A: Deploy to Vercel (Easiest for Node.js)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy Backend:**
   ```bash
   cd backend
   vercel
   ```

3. **Follow the prompts:**
   - Create Vercel account if needed
   - Link to GitHub project (optional)
   - Accept default settings

4. **Add Environment Variables in Vercel Dashboard:**
   - Go to [vercel.com](https://vercel.com) → Your Project
   - Settings → Environment Variables
   - Add:
     - `GEMINI_API_KEY` = your_api_key_here
     - `MONGODB_URI` = your_mongodb_connection_string
     - `PORT` = 4000

5. **Get your backend URL:**
   ```
   https://your-project.vercel.app
   ```

### Option B: Deploy to Railway

1. **Go to [railway.app](https://railway.app)**
   - Sign up with GitHub
   - New Project → GitHub Repo → Select backend folder
   - Add environment variables (GEMINI_API_KEY, MONGODB_URI)
   - Deploy

2. **Get your backend URL from Railway dashboard**

## Step 3: Deploy Frontend (Netlify)

### Via Git (Recommended)

1. **Push code to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment with AI features"
   git push origin main
   ```

2. **Go to [netlify.com](https://netlify.com)**
   - Click "New site from Git"
   - Select your GitHub repository
   - Choose branch (main/master)

3. **Configure Build Settings:**
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`

4. **Add Environment Variables:**
   - In Netlify settings → "Build & deploy" → "Environment"
   - Add variable:
     - Key: `VITE_API_URL`
     - Value: `https://your-backend.vercel.app` (your Vercel backend URL)

5. **Deploy:**
   - Netlify will automatically build and deploy
   - Your site will be at `https://your-site.netlify.app`

### Via Netlify CLI (Alternative)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
cd frontend
npm run build
netlify deploy --prod --dir=dist
```

## Step 4: Test Production Deployment

1. **Visit your Netlify site:** `https://your-site.netlify.app`

2. **Test AI Features:**
   - Add an event and use "✨ Generate with AI" button
   - Click the 💬 chatbot and ask questions
   - Check browser console for any errors

3. **If errors occur:**
   - Check Netlify build logs
   - Verify Vercel backend environment variables
   - Ensure MongoDB is accessible from Vercel/Railway (IP whitelisting on MongoDB Atlas)
   - Check CORS settings in backend

## Step 5: MongoDB Atlas Setup (Optional but Recommended)

If using cloud MongoDB instead of local:

1. **Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)**
2. **Create free cluster**
3. **Create database user** with password
4. **Get connection string:** `mongodb+srv://user:pass@cluster.mongodb.net/eventdb?retryWrites=true&w=majority`
5. **Allow IP access:**
   - Add `0.0.0.0/0` to allow Vercel/Railway (not recommended for production)
   - Or add specific IP addresses
6. **Update `MONGODB_URI` in Vercel/Railway environment variables**

## Troubleshooting

### "Cannot reach backend" error
- ✓ Verify backend URL in Netlify environment variables
- ✓ Check CORS settings in backend/index.js
- ✓ Ensure backend is running on Vercel/Railway
- ✓ Check MongoDB connection string

### "AI Generation Failed"
- ✓ Verify `GEMINI_API_KEY` is set in Vercel
- ✓ Check API key is valid and has quota remaining
- ✓ Check for typos in environment variable

### "MongoDB Connection Error"
- ✓ Test connection string locally first
- ✓ For MongoDB Atlas: Check IP whitelist
- ✓ Ensure connection string has correct username/password

### Build fails on Netlify
- ✓ Check Netlify build logs (usually shows specific error)
- ✓ Ensure `frontend` is not in `.gitignore`
- ✓ Make sure base directory is set to `frontend`

## Deployment Checklist

- [ ] Google Gemini API key obtained
- [ ] Backend tested locally with AI features
- [ ] Frontend tested locally with backend
- [ ] `.env` files created with all required variables
- [ ] Backend deployed to Vercel/Railway with env vars set
- [ ] Backend URL copied
- [ ] CORS updated in backend for production domain
- [ ] Frontend env variable `VITE_API_URL` set on Netlify
- [ ] Frontend built and deployed on Netlify
- [ ] Production site tested for functionality
- [ ] MongoDB accessible from deployed backend
- [ ] AI features working in production

## Monitoring & Maintenance

### Check Deployment Status
- Netlify: Build logs at [app.netlify.com](https://app.netlify.com)
- Vercel: Logs at [vercel.com/dashboard](https://vercel.com/dashboard)
- MongoDB: Usage metrics at MongoDB Atlas dashboard

### Scale as needed
- Netlify: Auto-scales (free tier sufficient for small projects)
- Vercel: Auto-scales (free tier sufficient for small projects)
- MongoDB: Can upgrade cluster size if needed

---

**Your app is now live! 🎉**

For issues, check the respective platform's documentation or community forums.
