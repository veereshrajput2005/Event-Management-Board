import React from "react";
import { FaCalendarAlt } from "react-icons/fa";

export default function Navbar({ activePage, onNavigate, currentUser, onLogout }) {
  const pages = [
    { id: "home", label: "Home" },
    { id: "events", label: "Events" },
  ];

  if (currentUser?.role === "Admin") {
    pages.push({ id: "add", label: "Add Event" });
  }

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
            className={activePage === page.id ? "nav-btn active" : "nav-btn"}
            onClick={() => onNavigate(page.id)}
          >
            {page.label}
          </button>
        ))}
      </nav>

      <div className="navbar__actions">
        {currentUser ? (
          <>
            <span className="navbar__user">
              {currentUser.fullName} ({currentUser.role})
            </span>
            <button type="button" className="secondary-button" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button type="button" className="nav-btn" onClick={() => onNavigate("login")}>
              Login
            </button>
            <button type="button" className="nav-btn" onClick={() => onNavigate("register")}>
              Register
            </button>
          </>
        )}
      </div>
    </header>
  );
}
