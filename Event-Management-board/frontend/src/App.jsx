import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import AIChat from "./components/AIChat";
import Home from "./pages/Home";
import Events from "./pages/Events";
import AddEvent from "./pages/AddEvent";
import Login from "./pages/Login";
import Register from "./pages/Register";
import initialEvents from "./data/events";
import { API_ENDPOINTS } from "./config/api";

const API_URL = API_ENDPOINTS.GET_EVENTS();
const EVENTS_KEY = "event-board-events";
const USERS_KEY = "event-board-users";
const AUTH_KEY = "event-board-current-user";

const loadFromStorage = (key, fallback) => {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (err) {
    console.warn(`Failed reading ${key} from localStorage`, err);
    return fallback;
  }
};

const saveToStorage = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Failed saving ${key} to localStorage`, err);
  }
};

export default function App() {
  const [page, setPage] = useState("home");
  const [events, setEvents] = useState(() => loadFromStorage(EVENTS_KEY, initialEvents));
  const [users, setUsers] = useState(() => loadFromStorage(USERS_KEY, []));
  const [currentUser, setCurrentUser] = useState(() => loadFromStorage(AUTH_KEY, null));
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [useLocalOnly, setUseLocalOnly] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

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
    saveToStorage(EVENTS_KEY, events);
  }, [events]);

  useEffect(() => {
    saveToStorage(USERS_KEY, users);
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      saveToStorage(AUTH_KEY, currentUser);
    } else {
      window.localStorage.removeItem(AUTH_KEY);
    }
  }, [currentUser]);

  useEffect(() => {
    if (!successMessage) return;
    const timer = window.setTimeout(() => setSuccessMessage(""), 3000);
    return () => window.clearTimeout(timer);
  }, [successMessage]);

  const isAdmin = currentUser?.role === "Admin";

  const handleAddEvent = async (newEvent) => {
    if (!isAdmin) {
      setFormError("Only admins can add events.");
      return;
    }

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

  const handleSaveEvent = (updatedEvent) => {
    if (!isAdmin) return;

    setEvents((prev) =>
      prev.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
    );
    setSuccessMessage("Event updated successfully!");
    setEditingEvent(null);
    setPage("events");
  };

  const handleDeleteEvent = (eventId) => {
    if (!isAdmin) return;

    setEvents((prev) => prev.filter((event) => event.id !== eventId));
    setSuccessMessage("Event deleted successfully!");
  };

  const handleClear = async () => {
    if (!isAdmin) {
      setFormError("Only admins can delete all events.");
      return;
    }

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

  const handleLogin = (user) => {
    setCurrentUser(user);
    setSuccessMessage(`Welcome back, ${user.fullName}!`);
    setPage("events");
  };

  const handleRegister = (newUser) => {
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    setSuccessMessage("Account created successfully!");
    setPage("events");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setPage("home");
    setFormError("");
    setSuccessMessage("");
    setEditingEvent(null);
  };

  const handleNavigate = (newPage) => {
    setPage(newPage);
    setFormError("");
    setSuccessMessage("");

    if (newPage !== "add") {
      setEditingEvent(null);
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setPage("add");
  };

  const renderPage = () => {
    if (page === "login") {
      return <Login onLogin={handleLogin} users={users} onNavigate={setPage} />;
    }

    if (page === "register") {
      return <Register onRegister={handleRegister} users={users} onNavigate={setPage} />;
    }

    if (page === "events") {
      return (
        <Events
          events={events}
          userRole={currentUser?.role}
          currentUser={currentUser}
          onClear={handleClear}
          onAdd={() => setPage("add")}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
          onRefreshEvents={() => {
            // Refresh events from server
            const load = async () => {
              try {
                const res = await fetch(API_URL);
                if (!res.ok) throw new Error("Backend fetch failed");
                const data = await res.json();
                setEvents(data);
                setSuccessMessage("Events updated!");
              } catch (err) {
                console.warn("Failed to refresh events", err);
              }
            };
            load();
          }}
          successMessage={successMessage}
        />
      );
    }

    if (page === "add") {
      return isAdmin ? (
        <AddEvent
          initialEvent={editingEvent}
          onAdd={handleAddEvent}
          onSave={handleSaveEvent}
          error={formError}
          onError={setFormError}
        />
      ) : (
        <section className="page page--auth">
          <h1 className="page__title">Access denied</h1>
          <p className="page__lead">Only admin users can add or edit events.</p>
          <button type="button" className="primary-button" onClick={() => setPage("events")}>View Events</button>
        </section>
      );
    }

    return <Home onViewEvents={() => setPage("events")} />;
  };

  return (
    <div className="app">
      <Navbar
        activePage={page}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      <main className="app__main">{renderPage()}</main>
      <AIChat events={events} />
      <footer className="app__footer">Event Management Board</footer>
    </div>
  );
}
