import { useState } from "react";

export default function Login({ onLogin, users, onNavigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const user = users.find(
      (candidate) =>
        candidate.email.toLowerCase() === email.trim().toLowerCase() &&
        candidate.password === password
    );

    if (!user) {
      setError("Invalid email or password.");
      return;
    }

    setError("");
    onLogin(user);
  };

  return (
    <section className="page page--auth">
      <h1 className="page__title">Login</h1>
      <p className="page__lead">Sign in to your account</p>
      <form className="form" onSubmit={handleSubmit}>
        <label className="form__label">
          Email
          <input
            type="email"
            className="form__input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
          />
        </label>

        <label className="form__label">
          Password
          <input
            type="password"
            className="form__input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </label>

        {error && <p className="form__error">{error}</p>}

        <button type="submit" className="primary-button">
          Login
        </button>
      </form>

      <div className="auth__footer">
        <p>Don't have an account?</p>
        <button
          type="button"
          className="secondary-button"
          onClick={() => onNavigate("register")}
        >
          Register
        </button>
      </div>
    </section>
  );
}
