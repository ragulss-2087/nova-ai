import "./Header.css";
import { FiSearch } from "react-icons/fi";
import { FiDownload } from "react-icons/fi";

function Header({ toggleTheme, exportChat, theme }) {
  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-btn">☰</button>

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

      <div className="header-right">
        <button className="icon" title="Search">
          🔍
        </button>

        <button className="icon" title="Toggle Theme" onClick={toggleTheme}>
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        <button className="icon" title="Settings">
          ⚙️
        </button>

        <button className="icon" title="Export Chat" onClick={exportChat}>
          <FiDownload />
        </button>

        <button className="icon" title="Profile">
          👤
        </button>
      </div>
    </header>
  );
}

export default Header;
