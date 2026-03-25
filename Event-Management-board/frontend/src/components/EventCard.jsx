import React from "react";

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

export default function EventCard({ event }) {
  const { title, date, location, description, category } = event;
  const meta = categoryMeta[category] || { icon: "📌", color: "#6B7280" };

  return (
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
    </article>
  );
}
