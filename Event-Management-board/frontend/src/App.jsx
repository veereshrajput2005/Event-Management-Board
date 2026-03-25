import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Events from "./pages/Events";
import AddEvent from "./pages/AddEvent";
import initialEvents from "./data/events";

const API_URL = "http://localhost:4000/api/events";

// Small app to show events and add new ones.
export default function App() {
  const [page, setPage] = useState("home");
  const [events, setEvents] = useState(() => {
    try {
      const stored = window.localStorage.getItem("event-board-events");
      return stored ? JSON.parse(stored) : initialEvents;
    } catch (err) {
      console.warn("Could not load saved events", err);
      return initialEvents;
    }
  });
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [useLocalOnly, setUseLocalOnly] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Backend fetch failed");
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.warn("Backend not available, falling back to local data", err);
        setUseLocalOnly(true);
      }
    };

    load();
  }, []);

  useEffect(() => {
    window.localStorage.setItem("event-board-events", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    if (!successMessage) return;
    const timer = window.setTimeout(() => setSuccessMessage(""), 3000);
    return () => window.clearTimeout(timer);
  }, [successMessage]);

  const handleAddEvent = async (newEvent) => {
    if (!useLocalOnly) {
      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newEvent),
        });
        if (!res.ok) throw new Error("Backend save failed");
        const saved = await res.json();
        setEvents((prev) => [saved, ...prev]);
        setSuccessMessage("Event added successfully!");
        setPage("events");
        return;
      } catch (err) {
        console.warn("Backend error, falling back to local storage", err);
        setUseLocalOnly(true);
      }
    }

    setEvents((prev) => [newEvent, ...prev]);
    setSuccessMessage("Event added successfully!");
    setPage("events");
  };

  const handleClear = async () => {
    if (!useLocalOnly) {
      try {
        const res = await fetch(API_URL, { method: "DELETE" });
        if (!res.ok) throw new Error("Backend delete failed");
        setEvents([]);
        return;
      } catch (err) {
        console.warn("Backend delete failed, using local clear", err);
        setUseLocalOnly(true);
      }
    }

    setEvents([]);
  };

  const handleNavigate = (newPage) => {
    setPage(newPage);
    setFormError("");
    setSuccessMessage("");
  };

  const renderPage = () => {
    if (page === "events") {
      return (
        <Events
          events={events}
          onClear={handleClear}
          onAdd={() => setPage("add")}
          successMessage={successMessage}
        />
      );
    }
    if (page === "add") {
      return <AddEvent onAdd={handleAddEvent} error={formError} onError={setFormError} />;
    }

    return <Home onViewEvents={() => setPage("events")} />;
  };

  return (
    <div className="app">
      <Navbar activePage={page} onNavigate={handleNavigate} />
      <main className="app__main">{renderPage()}</main>
      <footer className="app__footer">Event Management Board</footer>
    </div>
  );
}
