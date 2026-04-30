import React, { useMemo, useState } from "react";
import EventCard from "../components/EventCard";

const CATEGORIES = ["All", "Tech", "Music", "Sports", "Art"];

export default function Events({
  events,
  userRole,
  currentUser,
  onClear,
  onAdd,
  onEdit,
  onDelete,
  successMessage,
  onRefreshEvents,
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    let base = events;
    if (category && category !== "All") {
      base = base.filter((event) => event.category === category);
    }

    if (!q) return base;

    return base.filter((event) => {
      return (
        event.title.toLowerCase().includes(q) ||
        event.location.toLowerCase().includes(q)
      );
    });
  }, [events, search, category]);

  const handleClear = () => {
    const ok = window.confirm(
      "Are you sure you want to delete all events? This cannot be undone."
    );
    if (ok) onClear();
  };

  const isAdmin = userRole === "Admin";

  return (
    <section className="page page--events">
      <h1 className="page__title">Upcoming Events</h1>

      <div className="events__toolbar">
        <p className="page__lead">
          Scroll through the list of events happening soon.
        </p>

        <div className="events__actions">
          <div className="events__categories">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={
                  "category-button " +
                  (category === cat ? "category-button--active" : "")
                }
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="events__search">
            <input
              value={search}
              placeholder="Search events..."
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <span className="search-hint">Search by name or location</span>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="toast toast--success">{successMessage}</div>
      )}

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state__title">
            {search ? "No matching events found." : "No events available."}
          </p>
          <p className="empty-state__text">
            {search
              ? "Try another search term or clear the search to see all events."
              : isAdmin
              ? "Add a new event to get started."
              : "Ask an admin to add events for you."}
          </p>

          {search ? (
            <button
              type="button"
              className="secondary-button"
              onClick={() => setSearch("")}
            >
              Clear Search
            </button>
          ) : (
            isAdmin && (
              <button type="button" className="primary-button" onClick={onAdd}>
                Add Event
              </button>
            )
          )}
        </div>
      ) : (
        <div className="events-grid">
          {filtered.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isAdmin={isAdmin}
              currentUser={currentUser}
              onEdit={onEdit}
              onDelete={onDelete}
              onRegister={onRefreshEvents}
            />
          ))}
        </div>
      )}

      {isAdmin ? (
        <button type="button" className="secondary-button" onClick={handleClear}>
          Clear all events
        </button>
      ) : (
        <p className="page__lead" style={{ marginTop: "1rem" }}>
          Users can browse events only. Admins can manage them.
        </p>
      )}
    </section>
  );
}
