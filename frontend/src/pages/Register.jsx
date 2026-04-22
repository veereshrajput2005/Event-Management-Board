import { useState } from "react";

export default function Register({ onRegister, users, onNavigate }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!fullName.trim() || !email.trim() || !password) {
      setError("Please complete every field.");
      return;
    }

    if (users.some((user) => user.email.toLowerCase() === email.trim().toLowerCase())) {
      setError("That email is already registered.");
      return;
    }

    const newUser = {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      password,
      role,
    };

    setError("");
    onRegister(newUser);
  };

  return (
    <section className="page page--auth">
      <h1 className="page__title">Register</h1>
      <p className="page__lead">Create a new account</p>
      <form className="form" onSubmit={handleSubmit}>
        <label className="form__label">
          Full Name
          <input
            type="text"
            className="form__input"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
            required
          />
        </label>

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

        <label className="form__label">
          Account Type
          <select
            className="form__input"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
        </label>

        {error && <p className="form__error">{error}</p>}

        <button type="submit" className="primary-button">
          Register
        </button>
      </form>

      <div className="auth__footer">
        <p>Already have an account?</p>
        <button
          type="button"
          className="secondary-button"
          onClick={() => onNavigate("login")}
        >
          Login
        </button>
      </div>
    </section>
  );
}
