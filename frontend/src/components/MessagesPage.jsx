import React, { useEffect, useState } from "react";
import { getFromLocalStorage } from "../utils/services";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const userData = getFromLocalStorage("projectFS");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3006/api/requests/messages/${userData.user._id}`
        );
        setMessages(response.data);
      } catch (error) {
        console.error("שגיאה בעת טעינת ההודעות:", error);
      }
    };

    if (userData?.user?._id) {
      fetchMessages();
    }
  }, []);

  return (
    <div style={{ direction: "rtl", padding: "2rem" }}>
      <h2>הודעות מאנשי סגל</h2>

      <button
        onClick={() => navigate(-1)}
        style={{
          backgroundColor: "#2196f3",
          color: "white",
          padding: "10px 16px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          marginBottom: "1.5rem",
        }}
      >
         חזור
      </button>

      {messages.length === 0 ? (
        <p>אין הודעות.</p>
      ) : (
        <ul>
          {messages.map((msg, index) => (
            <li
              key={index}
              style={{
                marginBottom: "1rem",
                background: "#f3f3f3",
                padding: "1rem",
                borderRadius: "10px",
              }}
            >
              <strong>הודעה:</strong> {msg.message || "— ללא תוכן —"}
              <br />
              <strong>נשלח על ידי:</strong>{" "}
              {msg.sender?.firstname || ""} {msg.sender?.lastname || ""}
              <br />
              <small>{new Date(msg.date).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MessagesPage;
