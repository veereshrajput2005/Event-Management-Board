# Event Management Board 🎉

A full-stack event management application with AI-powered features using Google Gemini. Built with React, Node.js/Express, MongoDB, and enhanced with Generative AI capabilities.

## ✨ Features

- **Create & Manage Events** - Add, edit, and delete events with detailed information
- **Event Categories** - Organize events by Tech, Sports, Music, and Art
- **User Authentication** - Simple login and registration system (in-app)
- **🤖 AI-Powered Features:**
  - **Smart Description Generator** - Generate event descriptions with AI
  - **Event Chatbot** - Ask questions about events and get AI-powered responses
  - **Event Recommendations** - Get personalized event recommendations

## 📋 Project Structure

```
Event-Management-board/
├── backend/              # Node.js + Express + MongoDB
│   ├── index.js
│   ├── package.json
│   ├── .env              # Environment variables (AI API key)
│   └── .env.example      # Example env file
├── frontend/             # React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── AIChat.jsx        # ✨ AI Chatbot component
│   │   │   ├── Navbar.jsx
│   │   │   ├── EventCard.jsx
│   │   │   └── ErrorBoundary.jsx
│   │   ├── pages/
│   │   │   ├── AddEvent.jsx      # ✨ AI description generator
│   │   │   ├── Events.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── App.jsx
│   │   └── App.css
│   └── package.json
├── package.json          # Root package.json
└── README.md
```

## 🚀 Getting Started

### 1. **Get Google Gemini API Key**

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key" → Create new API key in existing project
3. Copy your API key

### 2. **Setup Backend**

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=4000
MONGODB_URI=mongodb://localhost:27017/eventdb
```

**Note:** Make sure MongoDB is running locally or update `MONGODB_URI` with your MongoDB connection string.

### 3. **Setup Frontend**

```bash
cd frontend
npm install
```

### 4. **Run Locally**

From the root directory:

```bash
# Run both frontend and backend
npm run dev

# Or run individually:
# Terminal 1 - Backend
cd backend && npm start

# Terminal 2 - Frontend
cd frontend && npm run dev
```

The app will be available at `http://localhost:5173` (or your Vite dev server port)

## 🤖 Using AI Features

### Generate Event Description
1. Go to "Add Event" page
2. Fill in **Event Name** and **Location**
3. Click **✨ Generate with AI** button
4. AI will create a compelling event description
5. Edit if needed and submit

### Event Chatbot
1. Click the **💬** button in the bottom-right corner
2. Ask questions like:
   - "What events are happening on [date]?"
   - "Show me Tech events"
   - "What time is the [event name]?"
3. The AI chatbot will answer based on available events

## 🌐 Deploying to Netlify

### Backend Deployment (Using Vercel or Railway instead)

> **Note:** Netlify is designed for frontend apps. For backend, use Vercel, Railway, or Render.

For this project, we'll deploy the backend separately and the frontend to Netlify.

### Option 1: Deploy Backend to Vercel (Recommended)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Create `backend/vercel.json`:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "index.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "index.js"
       }
     ],
     "env": {
       "GEMINI_API_KEY": "@gemini_api_key",
       "MONGODB_URI": "@mongodb_uri"
     }
   }
   ```

3. Deploy:
   ```bash
   cd backend
   vercel
   # Follow prompts and add environment variables in Vercel dashboard
   ```

4. Get your backend URL from Vercel

### Frontend Deployment (Netlify)

1. **Prepare frontend** - Update API URL in `frontend/src/App.jsx`:
   ```javascript
   const API_URL = "https://your-vercel-backend.vercel.app/api/events";
   ```

2. **Build**:
   ```bash
   cd frontend
   npm run build
   ```

3. **Deploy to Netlify**:

   **Option A: Using Netlify CLI**
   ```bash
   npm install -g netlify-cli
   
   cd frontend
   netlify deploy --prod --dir=dist
   ```

   **Option B: Using GitHub (Recommended)**
   1. Push code to GitHub
   2. Go to [netlify.com](https://netlify.com) and connect your GitHub repo
   3. Set build command: `npm run build`
   4. Set publish directory: `dist`
   5. Add environment variable if needed

### Environment Variables for Netlify

In Netlify dashboard:
- Go to **Build & deploy** → **Environment**
- No frontend-specific vars needed (backend API is in code)

## 🔧 API Endpoints

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event
- `DELETE /api/events` - Delete all events

### AI Features
- `POST /api/ai/generate-description` - Generate event description
  ```json
  {
    "title": "Coding Workshop",
    "date": "2024-05-15",
    "location": "Library",
    "category": "Tech"
  }
  ```

- `POST /api/ai/chat` - Chat with event assistant
  ```json
  {
    "message": "What events are available?",
    "events": [...]
  }
  ```

- `POST /api/ai/recommend-events` - Get recommendations
  ```json
  {
    "interests": ["Tech", "Music"],
    "allEvents": [...]
  }
  ```

## 📱 Technologies Used

### Frontend
- React 18
- Vite
- React Icons
- CSS (no dependencies)

### Backend
- Node.js + Express
- MongoDB with Mongoose
- Google Generative AI SDK
- CORS

### Deployment
- Netlify (Frontend)
- Vercel/Railway (Backend)
- MongoDB Atlas (Database - optional)

## 🎓 Learning Outcomes (Week 4-6)

✅ **Week 4** - Full stack implementation
- Frontend: All pages completed with proper styling
- Backend: User auth + CRUD operations with MongoDB  
- End-to-end: Fully running application

✅ **Week 5** - AI Integration
- Integrated Google Gemini API
- AI description generator
- Event chatbot assistant

✅ **Week 6** - Deployment
- Deployed frontend to Netlify
- Deployed backend to Vercel/Railway
- MongoDB integrated and working
- AI service fully functional

## 🤝 Contributing

1. Parse code into feature branches
2. Implement features
3. Test locally
4. Push and create pull requests
5. Merge to main/master

## 📝 Notes

- **Gemini API Rate Limiting**: Free tier has rate limits. Monitor usage.
- **MongoDB**: Use MongoDB Atlas for cloud database or keep local instance running
- **CORS**: Configured for localhost development, update for production domains
- **Authentication**: Current implementation uses in-memory storage. Use JWT/sessions in production

## 📚 Resources

- [Google Gemini API](https://ai.google.dev)
- [Netlify Docs](https://docs.netlify.com)
- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Express.js](https://expressjs.com)
- [React](https://react.dev)
- [Vite](https://vitejs.dev)

---

**Happy Coding! 🚀**

