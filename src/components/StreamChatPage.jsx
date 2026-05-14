import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function StreamChatPage() {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hello! Ask me anything about Python or web development.",
    },
  ]);

  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [currentChunk, setCurrentChunk] = useState("");

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, currentChunk]);

  const sendMessage = async () => {
    const text = input.trim();

    if (!text || streaming) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", text },
    ]);

    setInput("");
    setStreaming(true);
    setCurrentChunk("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/ai/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: text,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      if (!response.body) {
        throw new Error("Streaming not supported");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let accumulated = "";
      let done = false;

      while (!done) {
        const result = await reader.read();

        done = result.done;

        if (done) break;

        const chunk = decoder.decode(result.value, {
          stream: true,
        });

        const lines = chunk.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;

          const raw = line.slice(6).trim();

          if (raw === "[DONE]") {
            done = true;
            break;
          }

          try {
            const parsed = JSON.parse(raw);

            if (parsed.error) {
              throw new Error(parsed.error);
            }

            if (parsed.chunk) {
              accumulated += parsed.chunk;
              setCurrentChunk(accumulated);
            }
          } catch (err) {
            console.error("Failed to parse chunk:", err);
          }
        }
      }

      if (accumulated.trim()) {
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            text: accumulated,
          },
        ]);
      }

      setCurrentChunk("");

    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: `Error: ${err.message}`,
        },
      ]);
    } finally {
      setStreaming(false);
    }
  };

  const resetChat = async () => {
    try {
      await fetch(`${API_URL}/ai/chat/reset`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch (err) {
      console.error("Reset failed:", err);
    }

    setMessages([
      {
        role: "ai",
        text: "Conversation reset. What would you like to know?",
      },
    ]);

    setCurrentChunk("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2 className="chat-title">AI Assistant</h2>

        <button
          className="chat-reset-btn"
          onClick={resetChat}
          disabled={streaming}
        >
          Reset
        </button>
      </div>

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-bubble chat-bubble--${msg.role}`}
          >
            <span className="chat-role">
              {msg.role === "user" ? "You" : "AI"}
            </span>

            {msg.role === "user" ? (
              <p className="chat-text">{msg.text}</p>
            ) : (
              <div className="chat-text chat-markdown">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.text}
                </ReactMarkdown>
              </div>
            )}
          </div>
        ))}

        {streaming && (
          <div className="chat-bubble chat-bubble--ai">
            <span className="chat-role">AI</span>

            <div className="chat-text chat-markdown">
              {currentChunk ? (
                <>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {currentChunk}
                  </ReactMarkdown>

                  <span className="chat-cursor">▋</span>
                </>
              ) : (
                <span className="chat-thinking">
                  Thinking...
                </span>
              )}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="chat-input-row">
        <textarea
          className="chat-input"
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything... (Enter to send)"
          disabled={streaming}
        />

        <button
          className="sma-btn chat-send-btn"
          onClick={sendMessage}
          disabled={streaming || !input.trim()}
        >
          {streaming ? "Streaming..." : "Send"}
        </button>
      </div>
    </div>
  );
}