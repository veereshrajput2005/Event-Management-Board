import React from "react";
import { FaCalendarAlt } from "react-icons/fa";

export default function Navbar({ activePage, onNavigate }) {
  const pages = [
    { id: "home", label: "Home" },
    { id: "events", label: "Events" },
    { id: "add", label: "Add Event" },
  ];

  return (
    <header className="navbar">
      <div className="logo">
        <FaCalendarAlt className="icon" />
        <span>
          Event <span className="highlight">Management</span> Board
        </span>
      </div>

      <nav className="navbar__nav">
        {pages.map((page) => (
          <button
            key={page.id}
            className={
              activePage === page.id ? "nav-btn active" : "nav-btn"
            }
            onClick={() => onNavigate(page.id)}
          >
            {page.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
