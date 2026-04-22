import React, { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../config/api";
import RegistrationsModal from "./RegistrationsModal";

const categoryMeta = {
  Tech: { icon: "💻", color: "#60A5FA" },
  Music: { icon: "🎵", color: "#F97316" },
  Sports: { icon: "⚽", color: "#34D399" },
  Art: { icon: "🎨", color: "#A855F7" },
};

function formatDate(raw) {
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  const isTomorrow =
    date.getFullYear() === tomorrow.getFullYear() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getDate() === tomorrow.getDate();

  if (isToday) return "🔥 Today";
  if (isTomorrow) return "🔥 Tomorrow";

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export default function EventCard({ event, isAdmin, currentUser, onEdit, onDelete, onRegister }) {
  const { title, date, location, description, category, registrationCount = 0 } = event;
  const meta = categoryMeta[category] || { icon: "📌", color: "#6B7280" };
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showRegistrations, setShowRegistrations] = useState(false);

  // Check if current user is registered
  useEffect(() => {
    if (currentUser && !isAdmin) {
      checkRegistrationStatus();
    }
  }, [currentUser, event.id, isAdmin]);

  const checkRegistrationStatus = async () => {
    try {
      const response = await fetch(
        `${API_ENDPOINTS.GET_EVENTS().replace('/api/events', '')}/api/events/${event.id}/registered/${currentUser.fullName}`
      );
      const data = await response.json();
      setIsRegistered(data.isRegistered);
    } catch (err) {
      console.error("Error checking registration status:", err);
    }
  };

  const handleRegisterClick = async () => {
    if (!currentUser) return;

    setIsLoading(true);
    try {
      const endpoint = isRegistered
        ? `${API_ENDPOINTS.GET_EVENTS().replace('/api/events', '')}/api/events/${event.id}/register`
        : `${API_ENDPOINTS.GET_EVENTS().replace('/api/events', '')}/api/events/${event.id}/register`;

      const method = isRegistered ? "DELETE" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.fullName,
          userName: currentUser.fullName,
        }),
      });

      if (!response.ok) throw new Error("Registration failed");

      setIsRegistered(!isRegistered);
      if (onRegister) onRegister();
    } catch (err) {
      console.error("Registration error:", err);
      alert("Failed to update registration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <article className="event-card">
        <div className="event-card__header">
          <div className="event-card__title-wrapper">
            <span
              className="event-card__category"
              style={{ backgroundColor: meta.color }}
            >
              {meta.icon} {category || "Other"}
            </span>
            <h3 className="event-card__title">{title}</h3>
          </div>
          <span className="event-card__date">{formatDate(date)}</span>
        </div>
        <div className="event-card__details">
          <div className="event-card__location">📍 {location}</div>
          <p className="event-card__description">{description}</p>
        </div>

        {/* Registration Count - Visible to Everyone */}
        <div className="event-card__registration-info">
          <span className="event-card__registration-badge">
            👥 {registrationCount} {registrationCount === 1 ? "person" : "people"} registered
          </span>
        </div>

        <div className="event-card__actions">
          {isAdmin ? (
            <>
              <button
                type="button"
                className="event-card__button"
                onClick={() => onEdit(event)}
              >
                Edit
              </button>
              <button
                type="button"
                className="event-card__button"
                onClick={() => setShowRegistrations(true)}
              >
                View Registrations ({registrationCount})
              </button>
              <button
                type="button"
                className="event-card__button event-card__button--danger"
                onClick={() => onDelete(event.id)}
              >
                Delete
              </button>
            </>
          ) : currentUser ? (
            <button
              type="button"
              className={`event-card__button ${
                isRegistered ? "event-card__button--registered" : ""
              }`}
              onClick={handleRegisterClick}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : isRegistered ? "✓ Registered" : "Register"}
            </button>
          ) : (
            <button
              type="button"
              className="event-card__button event-card__button--disabled"
              disabled
            >
              Login to Register
            </button>
          )}
        </div>
      </article>

      {/* Registrations Modal */}
      <RegistrationsModal
        eventId={event.id}
        eventTitle={title}
        isOpen={showRegistrations}
        onClose={() => setShowRegistrations(false)}
      />
    </>
  );
}
