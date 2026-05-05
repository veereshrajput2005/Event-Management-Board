import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Log API key status
if (!process.env.GEMINI_API_KEY) {
  console.warn('⚠️  GEMINI_API_KEY is not set in environment variables!');
} else {
  console.log('✓ GEMINI_API_KEY is configured');
}

// Try to use the latest model, fallback to stable version if not available
let model;
try {
  model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
  console.log('✓ Using Gemini 2.0 Flash-Lite model');
} catch (err) {
  console.log('Gemini 2.0 Flash-Lite not available, using Gemini 1.5 Flash');
  model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
}

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eventdb';
mongoose.connect(mongoURI)
.then(() => console.log('✓ Connected to MongoDB'))
.catch(err => console.error('✗ MongoDB connection error:', err.message));

// Define Event schema
const eventSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  date: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, default: 'Other' },
  registrations: [
    {
      userId: { type: String, required: true },
      userName: { type: String, required: true },
      registeredAt: { type: Date, default: Date.now },
    },
  ],
  registrationCount: { type: Number, default: 0 },
});

const Event = mongoose.model('Event', eventSchema);

app.use(cors());
app.use(express.json());

app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

app.post("/api/events", async (req, res) => {
  const { title, date, location, description, category } = req.body;
  if (!title || !date || !location || !description) {
    return res.status(400).json({ error: "Missing fields in request body." });
  }

  const newEvent = new Event({
    id: Date.now().toString(),
    title: title.trim(),
    date,
    location: location.trim(),
    description: description.trim(),
    category: category || "Other",
  });

  try {
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save event' });
  }
});

app.delete("/api/events", async (req, res) => {
  try {
    await Event.deleteMany({});
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete events' });
  }
});

// Event Registration Endpoints
// Register a user for an event
app.post("/api/events/:eventId/register", async (req, res) => {
  try {
    const { eventId } = req.params;
    const { userId, userName } = req.body;

    if (!userId || !userName) {
      return res.status(400).json({ error: "userId and userName are required" });
    }

    const event = await Event.findOne({ id: eventId });
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Check if user already registered
    const isAlreadyRegistered = event.registrations.some(
      (reg) => reg.userId === userId
    );

    if (isAlreadyRegistered) {
      return res.status(400).json({ error: "User already registered for this event" });
    }

    // Add registration
    event.registrations.push({
      userId,
      userName,
      registeredAt: new Date(),
    });

    event.registrationCount = event.registrations.length;
    await event.save();

    res.status(201).json({
      message: "Successfully registered for event",
      registrationCount: event.registrationCount,
      event,
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Failed to register for event" });
  }
});

// Unregister a user from an event
app.delete("/api/events/:eventId/register", async (req, res) => {
  try {
    const { eventId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const event = await Event.findOne({ id: eventId });
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Remove registration
    event.registrations = event.registrations.filter(
      (reg) => reg.userId !== userId
    );

    event.registrationCount = event.registrations.length;
    await event.save();

    res.json({
      message: "Successfully unregistered from event",
      registrationCount: event.registrationCount,
    });
  } catch (err) {
    console.error("Unregister error:", err);
    res.status(500).json({ error: "Failed to unregister from event" });
  }
});

// Get all registrations for an event
app.get("/api/events/:eventId/registrations", async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findOne({ id: eventId });
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json({
      eventId: event.id,
      eventTitle: event.title,
      totalRegistrations: event.registrationCount,
      registrations: event.registrations,
    });
  } catch (err) {
    console.error("Fetch registrations error:", err);
    res.status(500).json({ error: "Failed to fetch registrations" });
  }
});

// Check if user is registered for an event
app.get("/api/events/:eventId/registered/:userId", async (req, res) => {
  try {
    const { eventId, userId } = req.params;

    const event = await Event.findOne({ id: eventId });
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const isRegistered = event.registrations.some(
      (reg) => reg.userId === userId
    );

    res.json({
      isRegistered,
      registrationCount: event.registrationCount,
    });
  } catch (err) {
    console.error("Check registration error:", err);
    res.status(500).json({ error: "Failed to check registration status" });
  }
});

// AI Endpoints - Generate Event Description using Gemini
app.post("/api/ai/generate-description", async (req, res) => {
  try {
    const { title, date, location, category } = req.body;
    
    if (!title || !location) {
      return res.status(400).json({ error: "Title and location are required" });
    }

    const prompt = `Generate a compelling and detailed event description for:
Title: ${title}
Date: ${date || 'Not specified'}
Location: ${location}
Category: ${category || 'General'}

Write a professional and engaging 2-3 sentence description that would attract attendees. Be specific about what to expect.`;

    console.log('Generating description for:', title);
    const result = await model.generateContent(prompt);
    const description = result.response.text();
    
    console.log('Description generated successfully');
    res.json({ description });
  } catch (err) {
    console.error('AI generation error details:', err.message);
    console.error('Full error:', err);
    res.status(500).json({ error: `Failed to generate description: ${err.message}` });
  }
});

// AI Chatbot - Answer questions about events
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, events } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const eventsList = events && events.length > 0 
      ? events.map(e => `- ${e.title} on ${e.date} at ${e.location}`).join('\n')
      : 'No events currently available. You can add events to see recommendations.';

    const prompt = `You are a helpful event assistant. Answer questions about these upcoming events:
${eventsList}

User question: ${message}

Provide a helpful, concise response. If there are no events yet, suggest creating some. Be friendly and encouraging.`;

    console.log('Processing chat message:', message);
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    console.log('Chat response generated successfully');
    res.json({ response });
  } catch (err) {
    console.error('Chat error details:', err.message);
    console.error('Full error:', err);
    res.status(500).json({ error: `Failed to process chat message: ${err.message}` });
  }
});

// AI - Get Event Recommendations
app.post("/api/ai/recommend-events", async (req, res) => {
  try {
    const { interests, allEvents } = req.body;
    
    if (!interests || !allEvents) {
      return res.status(400).json({ error: "Interests and events are required" });
    }

    const eventsList = allEvents.map(e => `${e.title} (${e.category}): ${e.description.substring(0, 100)}...`).join('\n');

    const prompt = `Based on these user interests: ${interests.join(', ')}

From these available events:
${eventsList}

Recommend the top 2-3 events that best match the user's interests. Explain why each event would be a good match.`;

    const result = await model.generateContent(prompt);
    const recommendations = result.response.text();
    
    res.json({ recommendations });
  } catch (err) {
    console.error('Recommendation error:', err);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Backend running at http://0.0.0.0:${port}`);
});
