import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // For now we just store the error; in a real app we'd send to monitoring
    console.error("ErrorBoundary caught an error:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 32, lineHeight: 1.5 }}>
          <h1 style={{ color: "#b91c1c" }}>Something went wrong</h1>
          <pre style={{ whiteSpace: "pre-wrap", background: "#f8fafc", padding: 16, borderRadius: 8, overflowX: "auto" }}>
            {this.state.error.toString()}
          </pre>
          <p>Please check the browser console for more details.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
