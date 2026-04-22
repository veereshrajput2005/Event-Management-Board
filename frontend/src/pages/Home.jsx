import React from "react";

export default function Home({ onViewEvents }) {
  return (
    <section className="page page--home">
      <h1 className="page__title">Welcome to the Event Management Board</h1>
      <p className="page__lead">
        Find local events happening nearby or add one yourself. It&apos;s easy and
        fun.
      </p>
      <button className="primary-button" onClick={onViewEvents}>
        View Events
      </button>
    </section>
  );
}
