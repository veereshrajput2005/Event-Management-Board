import { useState, useEffect, useRef } from "react";
import { API_ENDPOINTS } from "../config/api";

export default function AIChat({ events = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: "bot", text: "Hi! I'm your event assistant. Ask me about the available events!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { type: "user", text: input }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.AI_CHAT(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, events }),
      });

      if (!response.ok) throw new Error("Failed to get response");
      const data = await response.json();

      setMessages((prev) => [...prev, { type: "bot", text: data.response }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "Sorry, I couldn't process that. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="ai-chat-button"
        title="Event Assistant"
      >
        💬
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="ai-chat-window">
          <div className="ai-chat-header">
            <h3>Event Assistant 🤖</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="ai-chat-close"
            >
              ✕
            </button>
          </div>

          <div className="ai-chat-messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`ai-chat-message ai-chat-message--${msg.type}`}
              >
                {msg.type === "bot" && <span className="ai-chat-avatar">🤖</span>}
                <p>{msg.text}</p>
              </div>
            ))}
            {loading && (
              <div className="ai-chat-message ai-chat-message--bot">
                <span className="ai-chat-avatar">🤖</span>
                <p>Thinking...</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="ai-chat-form">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about events..."
              className="ai-chat-input"
              disabled={loading}
            />
            <button
              type="submit"
              className="ai-chat-send"
              disabled={loading || !input.trim()}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
