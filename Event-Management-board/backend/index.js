import express from "express";
import cors from "cors";
import { readFile, writeFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const app = express();
const port = process.env.PORT || 4000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataFile = join(__dirname, "events.json");

app.use(cors());
app.use(express.json());

async function readEvents() {
  try {
    const raw = await readFile(dataFile, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

async function writeEvents(events) {
  await writeFile(dataFile, JSON.stringify(events, null, 2));
}

app.get("/api/events", async (req, res) => {
  const events = await readEvents();
  res.json(events);
});

app.post("/api/events", async (req, res) => {
  const { title, date, location, description, category } = req.body;
  if (!title || !date || !location || !description) {
    return res.status(400).json({ error: "Missing fields in request body." });
  }

  const newEvent = {
    id: Date.now().toString(),
    title: title.trim(),
    date,
    location: location.trim(),
    description: description.trim(),
    category: category || "Other",
  };

  const events = await readEvents();
  const next = [newEvent, ...events];
  await writeEvents(next);

  res.status(201).json(newEvent);
});

app.delete("/api/events", async (req, res) => {
  await writeEvents([]);
  res.status(204).send();
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend running at http://localhost:${port}`);
});
