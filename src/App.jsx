import "./App.css";
import { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }
  const [chats, setChats] = useState([
    {
      id: 1,
      title: "New Chat",
      messages: [
        {
          sender: "bot",
          text: "Hello 👋 How can I help you today?",
        },
      ],
    },
  ]);
  const [currentChat, setCurrentChat] = useState(0);
  const [search, setSearch] = useState("");
  function createNewChat() {
    const newChat = {
      id: Date.now(),
      title: "New Chat",
      messages: [
        {
          sender: "bot",
          text: "Hello 👋 How can I help you today?",
        },
      ],
    };

    setChats((prev) => {
      setCurrentChat(prev.length);
      return [...prev, newChat];
    });
  }
  function deleteChat(index) {
    setChats((prev) => {
      const updated = prev.filter((_, i) => i !== index);

      return updated.length > 0
        ? updated
        : [
            {
              id: Date.now(),
              title: "New Chat",
              messages: [
                {
                  sender: "bot",
                  text: "Hello 👋 How can I help you today?",
                },
              ],
            },
          ];
    });

    setCurrentChat((prev) => {
      if (index < prev) return prev - 1;
      if (index === prev) return Math.max(0, prev - 1);
      return prev;
    });
  }
  function exportChat() {
    const current = chats[currentChat];

    let content = "";

    current.messages.forEach((msg) => {
      content += `${msg.sender.toUpperCase()}\n`;
      content += `${msg.text}\n\n`;
    });

    const blob = new Blob([content], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = `${current.title}.txt`;

    link.click();

    URL.revokeObjectURL(url);
  }
  return (
    <div className={`app ${theme}`}>
      <Header
        toggleTheme={toggleTheme}
        exportChat={exportChat}
        theme={theme}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      {sidebarOpen && (
        <div className="overlay" onClick={() => setSidebarOpen(false)} />
      )}
      <div className="main">
        <Sidebar
          chats={chats}
          currentChat={currentChat}
          setCurrentChat={setCurrentChat}
          createNewChat={createNewChat}
          deleteChat={deleteChat}
          search={search}
          setSearch={setSearch}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <Chat
          chats={chats}
          setChats={setChats}
          currentChat={currentChat}
          theme={theme}
        />
      </div>
    </div>
  );
}

export default App;
