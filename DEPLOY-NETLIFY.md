# 🚀 Netlify + Vercel Deployment Guide

Your Event Management Board is ready to deploy! Follow these steps to go live.

---

## **STEP 1: Prepare Your Code for Git**

### 1.1 Open Terminal and Navigate to Project
```bash
cd "c:\full stack project\event management board\Event-Management-board"
```

### 1.2 Initialize Git Repository (if not already done)
```bash
git init
git add .
git commit -m "Event Management Board with AI and Registrations - Ready for deployment"
```

### 1.3 Create GitHub Repository
1. Go to **[github.com/new](https://github.com/new)**
2. Create a repository named: `event-management-board`
3. Don't initialize with README (we have one)
4. Click **Create Repository**

### 1.4 Push Code to GitHub
```bash
# Add remote (copy the URL from your GitHub repo)
git remote add origin https://github.com/YOUR_USERNAME/event-management-board.git

# Push code
git branch -M main
git push -u origin main
```

---

## **STEP 2: Deploy Backend to Vercel** (Required for Netlify frontend)

### 2.1 Install Vercel CLI
```bash
npm install -g vercel
```

### 2.2 Deploy Backend
```bash
# Navigate to backend folder
cd backend

# Deploy
vercel
```

**Follow the prompts:**
- Link to GitHub project (optional but recommended)
- Accept defaults
- Once deployed, Vercel will give you a URL like: `https://your-project.vercel.app`

### 2.3 Add Environment Variables to Vercel
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings → Environment Variables**
4. Add these variables:
   ```
   GEMINI_API_KEY = (your API key from makersuite.google.com)
   MONGODB_URI = (your MongoDB connection string)
   PORT = 4000
   ```
5. Click **Deploy** to redeploy with variables

### 2.4 Copy Your Backend URL
```
Example: https://event-management-board-backend.vercel.app
```

---

## **STEP 3: Deploy Frontend to Netlify**

### 3.1 Update API Configuration
Before deploying, update your frontend to use the Vercel backend URL:

**Edit: `frontend/.env`**
```env
VITE_API_URL=https://your-backend-url.vercel.app
```

Replace `your-backend-url` with your actual Vercel URL from Step 2.4

### 3.2 Rebuild Frontend
```bash
cd frontend
npm run build
```

### 3.3 Deploy to Netlify (Method A: Using CLI)
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

### 3.4 Deploy to Netlify (Method B: Using GitHub - Recommended)

1. **Go to [netlify.com](https://netlify.com)**
2. **Click "New site from Git"**
3. **Select GitHub** and authorize
4. **Find and select** `event-management-board` repository
5. **Configure build settings:**
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. **Click "Deploy site"**
7. Netlify will automatically deploy on every push to main!

### 3.5 Add Environment Variables to Netlify
1. In Netlify dashboard, go to **Site settings → Build & deploy → Environment**
2. **Add environment variable:**
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-url.vercel.app` (from Step 2.4)
3. **Redeploy** from Netlify

---

## **STEP 4: Verify Deployment**

### 4.1 Test Frontend
- Open your Netlify site URL (Netlify will give you one like `https://your-site.netlify.app`)
- Register/Login
- Try adding an event
- Test the **✨ AI Generator** button
- Test the **💬 Chatbot**
- Register for an event
- Check admin registration counts

### 4.2 Test Backend Connection
- Open browser console (F12)
- Register for an event
- Check if there are any CORS errors
- Verify data appears in MongoDB

### 4.3 Common Issues & Fixes

**Issue: "Cannot reach backend"**
- ✅ Verify `VITE_API_URL` is set correctly in Netlify
- ✅ Check Vercel backend is running (go to vercel.com/dashboard)
- ✅ Ensure backend URL doesn't have trailing slash

**Issue: "MongoDB connection error"**
- ✅ Add your server IP to MongoDB Atlas whitelist (use `0.0.0.0/0` for now)
- ✅ Verify connection string in Vercel environment variables

**Issue: "Gemini API not working"**
- ✅ Check `GEMINI_API_KEY` is set in Vercel
- ✅ Verify API key is valid at [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
- ✅ Check API usage quota

---

## **STEP 5: Set Up Custom Domain (Optional)**

### 5.1 Netlify Custom Domain
1. In Netlify dashboard, go to **Site settings → Domain management**
2. Click **Add custom domain**
3. Enter your domain (e.g., `events.yoursite.com`)
4. Follow DNS instructions

### 5.2 Vercel Custom Domain
1. In Vercel dashboard, go to your project
2. Click **Settings → Domains**
3. Add your custom domain
4. Follow DNS instructions

---

## **STEP 6: Set Up Continuous Deployment**

Both Netlify and Vercel automatically redeploy when you push to GitHub!

### To Update Your Live App:
```bash
# Make changes locally
git add .
git commit -m "Description of changes"
git push origin main

# Wait for automatic deployment
# Netlify: 30-60 seconds
# Vercel: 1-2 minutes
```

---

## **FINAL CHECKLIST**

- [ ] Code pushed to GitHub
- [ ] Backend deployed to Vercel with environment variables
- [ ] Vercel backend URL copied
- [ ] Frontend `.env` updated with backend URL
- [ ] Frontend rebuilt: `npm run build`
- [ ] Frontend deployed to Netlify with environment variables
- [ ] All tests pass on live site
- [ ] Chatbot working
- [ ] AI generator working
- [ ] Event registration working
- [ ] Admin can see registration counts
- [ ] Admin can view detailed registrations
- [ ] Can export registrations as CSV

---

## **Your Live Website URLs**

After deployment, you'll have:

```
Frontend (Netlify):  https://your-site.netlify.app
Backend (Vercel):    https://your-project.vercel.app
GitHub:              https://github.com/YOUR_USERNAME/event-management-board
```

---

## **Need Help?**

| Service | Documentation | Support |
|---------|---|---|
| Netlify | [docs.netlify.com](https://docs.netlify.com) | [netlify.com/support](https://netlify.com/support) |
| Vercel | [vercel.com/docs](https://vercel.com/docs) | [vercel.com/support](https://vercel.com/support) |
| MongoDB | [docs.mongodb.com](https://docs.mongodb.com) | [MongoDB Community](https://community.mongodb.com) |
| GitHub | [docs.github.com](https://docs.github.com) | [GitHub Support](https://support.github.com) |

---

**Your project is now ready to share with the world! 🎉**

Go live now and showcase your full-stack AI-powered Event Management Board!
