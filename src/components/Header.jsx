import "./Header.css";
import { FiSearch } from "react-icons/fi";
import { FiDownload } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";

function Header({
  toggleTheme,
  exportChat,
  theme,
  sidebarOpen,
  setSidebarOpen,
}) {
  const [showMenu, setShowMenu] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    }

    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, []);
  return (
    <header className="header">
      <div className="header-left">
        <button
          className="menu-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>

        <div className="logo">
          <div className="logo-circle">🤖</div>

          <div>
            <h2>Nova AI</h2>

            <p>
              <span className="online"></span>
              Online • AI Assistant
            </p>
          </div>
        </div>
      </div>

      <div className="header-right" ref={menuRef}>
        {/* Desktop Icons */}

        <div className="desktop-icons">
          <button className="icon">🔍</button>

          <button className="icon" onClick={toggleTheme}>
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          <button className="icon">⚙️</button>

          <button className="icon" onClick={exportChat}>
            <FiDownload />
          </button>

          <button className="icon">👤</button>
        </div>

        {/* Mobile Menu */}

        <div className="mobile-menu">
          <button className="icon" onClick={() => setShowMenu(!showMenu)}>
            ⋮
          </button>

          {showMenu && (
            <div className="dropdown">
              <button>🔍 Search</button>

              <button onClick={toggleTheme}>
                {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
              </button>

              <button>⚙️ Settings</button>

              <button onClick={exportChat}>📥 Export Chat</button>

              <button>👤 Profile</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
