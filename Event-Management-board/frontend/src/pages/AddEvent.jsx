import { useEffect, useState } from "react";

const categories = ["Tech", "Sports", "Music", "Art"];

// Small form component. No fancy form library.
export default function AddEvent({ onAdd, error, onError }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (saved) {
      const timer = window.setTimeout(() => setSaved(false), 2500);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [saved]);

  const isValid = () => {
    return (
      title.trim() &&
      date &&
      location.trim() &&
      description.trim() &&
      category
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isValid()) {
      onError?.("Please fill in all fields.");
      return;
    }

    const newEvent = {
      id: Date.now().toString(),
      title: title.trim(),
      date,
      location: location.trim(),
      description: description.trim(),
      category,
    };

    onAdd(newEvent);
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
      <h1 className="page__title">Add a New Event</h1>
      <p className="page__lead">
        Tell others about your community event. Fill in the details below and
        submit.
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
        {saved && <p className="form__success">Event added successfully!</p>}

        <button type="submit" className="primary-button" disabled={!isValid()}>
          Submit Event
        </button>
      </form>
    </section>
  );
}
