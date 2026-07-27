import { useState, useEffect, useRef } from "react";
import "./Chat.css";
import InputBox from "./InputBox";
import client from "../gemini";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FiCopy, FiCheck } from "react-icons/fi";
function Chat({ chats, setChats, currentChat }) {
  const [message, setMessage] = useState("");
  function copyCode(code) {
    navigator.clipboard.writeText(code);
  }

  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copied, setCopied] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedText, setEditedText] = useState("");
  const bottomRef = useRef(null);
  const messages = chats[currentChat]?.messages || [];
  const [image, setImage] = useState(null);
  function copyMessage(text, index) {
    navigator.clipboard.writeText(text);

    setCopiedIndex(index);

    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  }
  async function imageToBase64(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result);

      reader.readAsDataURL(file);
    });
  }
  async function sendMessage() {
    if (loading) return;

    const userMessage = message || "📷 Image";

    setChats((prevChats) => {
      const updatedChats = [...prevChats];

      const current = updatedChats[currentChat];

      updatedChats[currentChat] = {
        ...current,
        title:
          current.title === "New Chat"
            ? userMessage.length > 30
              ? userMessage.slice(0, 30) + "..."
              : userMessage
            : current.title,
        messages: [
          ...current.messages,
          {
            sender: "user",
            text: userMessage,
          },
        ],
      };

      return updatedChats;
    });
    setMessage("");
    setImage(null);
    setLoading(true);

    try {
      const currentMessages = [
        ...messages,
        {
          sender: "user",
          text: userMessage,
        },
      ];

      const conversation = currentMessages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      }));
      if (image) {
        const base64 = await imageToBase64(image);

        conversation.push({
          role: "user",
          content: [
            {
              type: "text",
              text: message,
            },
            {
              type: "image_url",
              image_url: {
                url: base64,
              },
            },
          ],
        });
      } else {
      }
      conversation.push({
        role: "user",
        content: userMessage,
      });
      const stream = await client.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: conversation,
        stream: true,
      });
      let fullReply = "";

      // Create empty bot message
      setChats((prev) => {
        const updated = [...prev];

        const current = updated[currentChat];

        updated[currentChat] = {
          ...current,
          messages: [
            ...current.messages,
            {
              sender: "bot",
              text: "",
            },
          ],
        };

        return updated;
      });

      for await (const chunk of stream) {
        const text = chunk.choices?.[0]?.delta?.content || "";

        if (!text) continue;

        fullReply += text;

        setChats((prev) => {
          const updated = [...prev];

          const current = updated[currentChat];

          const msgs = [...current.messages];

          msgs[msgs.length - 1] = {
            ...msgs[msgs.length - 1],
            text: fullReply,
          };

          updated[currentChat] = {
            ...current,
            messages: msgs,
          };

          return updated;
        });
      }
    } catch (error) {
      console.error(error);

      let errorMessage = "Something went wrong.";

      if (error.status === 429) {
        errorMessage =
          "Groq API quota exceeded. Please wait a few minutes or use a new API key.";
      } else if (error.status === 401) {
        errorMessage = "Invalid API Key.";
      } else if (error.status === 404) {
        errorMessage = "Model not found.";
      } else if (error.code === "ENOTFOUND") {
        errorMessage = "Network error. Please check your internet connection.";
      }

      setChats((prevChats) => {
        const updatedChats = prevChats.map((chat) => ({
          ...chat,
          messages: [...chat.messages],
        }));

        const current = updatedChats[currentChat];

        updatedChats[currentChat] = {
          ...current,
          messages: [
            ...current.messages,
            {
              sender: "bot",
              text: errorMessage,
            },
          ],
        };

        return updatedChats;
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);
  return (
    <section className="chat">
      {/* Welcome */}
      {messages.length === 1 && (
        <div className="welcome">
          <div className="bot-logo">🤖</div>

          <h1>Welcome to Nova AI</h1>

          <p>
            Your intelligent AI assistant. Ask questions, generate code, learn
            something new, or solve problems.
          </p>

          <div className="suggestions">
            <div className="card">
              💻
              <h3>Generate Code</h3>
              <p>React, HTML, CSS, JavaScript</p>
            </div>

            <div className="card">
              📄
              <h3>Summarize</h3>
              <p>Documents & Articles</p>
            </div>

            <div className="card">
              🌐
              <h3>Translate</h3>
              <p>Multiple Languages</p>
            </div>

            <div className="card">
              💡
              <h3>Ideas</h3>
              <p>Brainstorm Anything</p>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      {messages.length > 1 && (
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.sender === "bot" && <div className="avatar">🤖</div>}

              <div className="bubble-container">
                <div className="bubble">
                  {editingIndex === index ? (
                    <>
                      <textarea
                        className="edit-input"
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                      />

                      <div className="edit-actions">
                        <button
                          onClick={() => {
                            setChats((prev) =>
                              prev.map((chat, i) => {
                                if (i !== currentChat) return chat;

                                const msgs = [...chat.messages];
                                msgs[index] = {
                                  ...msgs[index],
                                  text: editedText,
                                };

                                return {
                                  ...chat,
                                  messages: msgs,
                                };
                              }),
                            );
                            setEditingIndex(null);
                          }}
                        >
                          Save
                        </button>

                        <button onClick={() => setEditingIndex(null)}>
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({ inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || "");
                          const code = String(children).replace(/\n$/, "");

                          if (!inline && match) {
                            return (
                              <div style={{ position: "relative" }}>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(code);
                                    setCopied(code);

                                    setTimeout(() => {
                                      setCopied("");
                                    }, 2000);
                                  }}
                                  style={{
                                    position: "absolute",
                                    right: "10px",
                                    top: "10px",
                                    padding: "6px 10px",
                                    borderRadius: "6px",
                                    border: "none",
                                    cursor: "pointer",
                                    background: "#333",
                                    color: "#fff",
                                    fontSize: "12px",
                                  }}
                                >
                                  {copied === code ? "Copied!" : "Copy"}
                                </button>

                                <SyntaxHighlighter
                                  language={match[1]}
                                  style={oneDark}
                                  PreTag="div"
                                  {...props}
                                >
                                  {code}
                                </SyntaxHighlighter>
                              </div>
                            );
                          }

                          return (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  )}
                </div>

                {msg.sender === "bot" && (
                  <button
                    className="copy-btn"
                    onClick={() => copyMessage(msg.text, index)}
                  >
                    {copiedIndex === index ? <FiCheck /> : <FiCopy />}
                  </button>
                )}
              </div>

              {msg.sender === "user" && (
                <>
                  <button
                    className="edit-btn"
                    onClick={() => {
                      setEditingIndex(index);
                      setEditedText(msg.text);
                    }}
                  >
                    ✏️
                  </button>

                  <div className="avatar">👤</div>
                </>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {loading && (
            <div className="message bot">
              <div className="avatar">🤖</div>

              <div className="bubble">Typing...</div>
            </div>
          )}

          <div ref={bottomRef}></div>
        </div>
      )}

      <InputBox
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
        image={image}
        setImage={setImage}
      />
    </section>
  );
}

export default Chat;
