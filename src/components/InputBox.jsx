import "./InputBox.css";
import { FiMic } from "react-icons/fi";
import EmojiPicker from "emoji-picker-react";
import { useState } from "react";
function InputBox({ message, setMessage, sendMessage, image, setImage }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;
  function startListening() {
    if (!recognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    recognition.start();

    recognition.onresult = (event) => {
      const speech = event.results[0][0].transcript;
      setMessage(speech);
    };
  }
  function onEmojiClick(emojiData) {
    setMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  }
  return (
    <>
      <input
        type="file"
        id="imageUpload"
        hidden
        accept="image/*"
        onChange={(e) => {
          if (e.target.files[0]) {
            setImage(e.target.files[0]);
          }
        }}
      />
      {showEmojiPicker && (
        <div className="emoji-picker">
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
      )}
      <div className="input-container">
        <button
          className="tool-btn"
          onClick={() => document.getElementById("imageUpload").click()}
        >
          📎
        </button>

        <input
          type="text"
          placeholder="Message Nova AI..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />

        <button
          className="tool-btn"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          😊
        </button>
        <button
          className="tool-btn"
          onClick={startListening}
          title="Voice Input"
        >
          <FiMic />
        </button>

        <button
          className="send-btn"
          onClick={sendMessage}
          disabled={!message.trim() && !image}
        >
          ➤
        </button>
      </div>

      {image && <div className="selected-image">📷 {image.name}</div>}
    </>
  );
}
export default InputBox;
