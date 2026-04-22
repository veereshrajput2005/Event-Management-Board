import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../config/api";

export default function RegistrationsModal({ eventId, eventTitle, isOpen, onClose }) {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && eventId) {
      fetchRegistrations();
    }
  }, [isOpen, eventId]);

  const fetchRegistrations = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `${API_ENDPOINTS.GET_EVENTS().replace('/api/events', '')}/api/events/${eventId}/registrations`
      );
      if (!response.ok) throw new Error("Failed to fetch registrations");
      const data = await response.json();
      setRegistrations(data.registrations);
    } catch (err) {
      console.error("Error fetching registrations:", err);
      setError("Failed to load registrations");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="registrations-modal-overlay" onClick={onClose}>
      <div className="registrations-modal" onClick={(e) => e.stopPropagation()}>
        <div className="registrations-modal__header">
          <h2 className="registrations-modal__title">
            Event Registrations: {eventTitle}
          </h2>
          <button
            className="registrations-modal__close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="registrations-modal__content">
          {loading ? (
            <p className="registrations-modal__loading">Loading registrations...</p>
          ) : error ? (
            <p className="registrations-modal__error">{error}</p>
          ) : registrations.length === 0 ? (
            <p className="registrations-modal__empty">No registrations yet</p>
          ) : (
            <>
              <div className="registrations-modal__stats">
                <p className="registrations-modal__count">
                  Total Registrations: <strong>{registrations.length}</strong>
                </p>
              </div>

              <div className="registrations-modal__list">
                <table className="registrations-table">
                  <thead>
                    <tr>
                      <th>Attendee Name</th>
                      <th>Registered On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map((reg, index) => (
                      <tr key={index}>
                        <td className="registrations-table__name">
                          👤 {reg.userName}
                        </td>
                        <td className="registrations-table__date">
                          {new Date(reg.registeredAt).toLocaleDateString()} at{" "}
                          {new Date(reg.registeredAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        <div className="registrations-modal__footer">
          <button
            type="button"
            className="registrations-modal__button"
            onClick={onClose}
          >
            Close
          </button>
          {registrations.length > 0 && (
            <button
              type="button"
              className="registrations-modal__button registrations-modal__button--primary"
              onClick={() => {
                // Export to CSV
                const csv = [
                  ["Attendee Name", "Registered On"],
                  ...registrations.map((reg) => [
                    reg.userName,
                    new Date(reg.registeredAt).toLocaleString(),
                  ]),
                ]
                  .map((row) => row.map((cell) => `"${cell}"`).join(","))
                  .join("\n");

                const blob = new Blob([csv], { type: "text/csv" });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${eventTitle}-registrations.csv`;
                a.click();
                window.URL.revokeObjectURL(url);
              }}
            >
              📥 Export as CSV
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
