import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../config/api";

const categories = ["Tech", "Sports", "Music", "Art"];

// Small form component. No fancy form library.
export default function AddEvent({ initialEvent, onAdd, onSave, error, onError }) {
  const [title, setTitle] = useState(initialEvent?.title || "");
  const [date, setDate] = useState(initialEvent?.date || "");
  const [location, setLocation] = useState(initialEvent?.location || "");
  const [description, setDescription] = useState(initialEvent?.description || "");
  const [category, setCategory] = useState(initialEvent?.category || categories[0]);
  const [saved, setSaved] = useState(false);
  const [generatingDescription, setGeneratingDescription] = useState(false);

  useEffect(() => {
    if (initialEvent) {
      setTitle(initialEvent.title);
      setDate(initialEvent.date);
      setLocation(initialEvent.location);
      setDescription(initialEvent.description);
      setCategory(initialEvent.category || categories[0]);
    }
  }, [initialEvent]);

  useEffect(() => {
    if (saved) {
      const timer = window.setTimeout(() => setSaved(false), 2500);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [saved]);

  const isEditing = Boolean(initialEvent?.id);

  const isValid = () => {
    return (
      title.trim() &&
      date &&
      location.trim() &&
      description.trim() &&
      category
    );
  };

  const generateDescription = async () => {
    if (!title.trim() || !location.trim()) {
      onError?.("Please enter event title and location first.");
      return;
    }

    setGeneratingDescription(true);
    try {
      const response = await fetch(API_ENDPOINTS.GENERATE_DESCRIPTION(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, date, location, category }),
      });

      if (!response.ok) throw new Error("Failed to generate description");
      const data = await response.json();
      setDescription(data.description);
      onError?.("");
    } catch (err) {
      console.error("Description generation error:", err);
      onError?.("Failed to generate description. Check your API key.");
    } finally {
      setGeneratingDescription(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isValid()) {
      onError?.("Please fill in all fields.");
      return;
    }

    const savedEvent = {
      id: isEditing ? initialEvent.id : Date.now().toString(),
      title: title.trim(),
      date,
      location: location.trim(),
      description: description.trim(),
      category,
    };

    if (isEditing) {
      onSave?.(savedEvent);
    } else {
      onAdd(savedEvent);
    }

    onError?.("");
    setSaved(true);

    setTitle("");
    setDate("");
    setLocation("");
    setDescription("");
    setCategory(categories[0]);
  };

  return (
    <section className="page page--add">
      <h1 className="page__title">
        {isEditing ? "Edit Event" : "Add a New Event"}
      </h1>
      <p className="page__lead">
        {isEditing
          ? "Update the details for this event."
          : "Tell others about your community event. Fill in the details below and submit."}
      </p>
      <form className="form" onSubmit={handleSubmit}>
        <label className="form__label">
          Event Name
          <input
            type="text"
            className="form__input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Coding Workshop"
          />
        </label>

        <label className="form__label">
          Date
          <input
            type="date"
            className="form__input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <label className="form__label">
          Location
          <input
            type="text"
            className="form__input"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Local Library"
          />
        </label>

        <label className="form__label">
          Description
          <textarea
            className="form__input form__input--textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A short description of the event."
          />
        </label>

        <div className="form__ai-button-container">
          <button
            type="button"
            onClick={generateDescription}
            disabled={generatingDescription || !title.trim() || !location.trim()}
            className="ai-generate-button"
          >
            {generatingDescription ? "🤖 Generating..." : "✨ Generate with AI"}
          </button>
        </div>

        <label className="form__label">
          Category
          <select
            className="form__input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>

        {error && <p className="form__error">{error}</p>}
        {saved && <p className="form__success">Event saved successfully!</p>}

        <button type="submit" className="primary-button" disabled={!isValid()}>
          {isEditing ? "Save Event" : "Submit Event"}
        </button>
      </form>
    </section>
  );
}
