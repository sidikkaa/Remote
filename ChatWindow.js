import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { database } from "../firebase";
import { ref, onValue, push } from "firebase/database";

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const auth = getAuth();

  useEffect(() => {
    // Fetch chat messages in real-time
    const messagesRef = ref(database, "messages");
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const messagesList = data
        ? Object.values(data).sort((a, b) => a.timestamp - b.timestamp)
        : [];
      setMessages(messagesList);
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messagesRef = ref(database, "messages");
    const user = auth.currentUser;

    // Push a new message
    await push(messagesRef, {
      content: newMessage,
      sender: user.email,
      timestamp: Date.now(),
    });

    setNewMessage("");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", minHeight: "100vh" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#2575fc",
          padding: "10px 20px",
          color: "#fff",
        }}
      >
        <h2>Chat</h2>
      </header>
      <div style={{ marginTop: "20px" }}>
        {/* Chat Messages */}
        <div
          style={{
            maxHeight: "400px",
            overflowY: "scroll",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            backgroundColor: "#f9f9f9",
          }}
        >
          {messages.map((msg, index) => (
            <p key={index}>
              <strong>{msg.sender}:</strong> {msg.content}
            </p>
          ))}
        </div>
        {/* Message Input */}
        <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              backgroundColor: "#2575fc",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
