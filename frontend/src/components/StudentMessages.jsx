import React, { useEffect, useState } from "react";
import axios from "axios";
import { getFromLocalStorage } from "../utils/services";
import "./StudentMessages.css";

const StudentMessages = () => {
  const [messages, setMessages] = useState([]);
  const userData = getFromLocalStorage("projectFS");

  useEffect(() => {
    axios
      .get(`http://localhost:3006/api/requests?studentUsername=${userData.user.username}`)
      .then((res) => {
        const allMessages = res.data.flatMap((request) =>
          request.messages.map((msg) => ({
            text: msg.message,
            date: msg.date,
            course: request.course?.name,
            type: request.requestType?.name,
          }))
        );
        setMessages(allMessages);
      })
      .catch((err) => console.error("Error fetching messages", err));
  }, []);

  return (
    <div className="student-messages" dir="rtl" style={{ padding: "2em" }}>
      <h2>הודעות שהתקבלו</h2>
      {messages.length === 0 ? (
        <p>לא התקבלו הודעות.</p>
      ) : (
        messages.map((msg, idx) => (
          <div key={idx} style={{
            marginBottom: "1em",
            background: "#f1f1f1",
            padding: "1em",
            borderRadius: "10px"
          }}>
            <div><strong>קורס:</strong> {msg.course}</div>
            <div><strong>נושא הבקשה:</strong> {msg.type}</div>
            <div><strong>תוכן ההודעה:</strong> {msg.text}</div>
            <div style={{ fontSize: "0.85em", color: "#555" }}>
              {new Date(msg.date).toLocaleString("he-IL")}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default StudentMessages;
