// components/Composer.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { push, ref, set } from "firebase/database";
import { database } from "../firebase";
import "../styles/Composer.css";

const DB_MESSAGES_KEY = "messages";


export default function Composer({ loggedInUser }) {
  const [input, setInput] = useState("");

  const navigate = useNavigate();

  const writeData = () => {
    if (input.trim() === "") return; // Prevent empty messages

    if (!loggedInUser) {
      alert("You must be signed in to post.");
      return;
    }

    const messageListRef = ref(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);

    const messageData = {
      text: input,
      timestamp: new Date().toISOString(),
      author: {
        uid: loggedInUser.uid,
        email: loggedInUser.email,
        displayName:
          loggedInUser.displayName || loggedInUser.email.split("@")[0],
      },
    };
    set(newMessageRef, messageData).then(() => {
      setInput("");
      navigate("/");
    });
  };

  return (
    <div className="composer-container">
      <h2 className="composer-title">Create New Post</h2>
      <div className="input-group">
        <input
          type="text"
          placeholder="Enter your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="message-input"
        />
        <button onClick={writeData} className="send-button">
          Send
        </button>
      </div>
    </div>
  );
}