import "./Sidebar.css";

function Sidebar({
  chats,
  currentChat,
  setCurrentChat,
  createNewChat,
  deleteChat,
  search,
  setSearch,
  sidebarOpen,
  setSidebarOpen,
}) {
  return (
    <aside className={`sidebar ${sidebarOpen ? "show" : ""}`}>
      <button
        className="new-chat"
        onClick={() => {
          createNewChat();
          setSidebarOpen(false);
        }}
      >
        + New Chat
      </button>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search chats..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <h4 className="title">Recent Chats</h4>

      <div className="chat-list">
        {chats.map((chat, index) => {
          const match = chat.title.toLowerCase().includes(search.toLowerCase());
          if (!match) return null;

          return (
            <div
              key={chat.id}
              className={`chat-item ${currentChat === index ? "active" : ""}`}
            >
              <span
                onClick={() => {
                  setCurrentChat(index);
                  setSidebarOpen(false);
                }}
              >
                💬 {chat.title}
              </span>

              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(index);
                }}
              >
                🗑️
              </button>
            </div>
          );
        })}
      </div>

      {chats.every(
        (chat) => !chat.title.toLowerCase().includes(search.toLowerCase()),
      ) && <p className="no-results">No chats found</p>}

      <div className="profile">
        <div className="avatar">R</div>

        <div>
          <h3>Ragul</h3>
          <p>Free Plan</p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
