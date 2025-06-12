import React, { useState } from "react";
import "./SendNotification.css";

const SendNotification = () => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");

  const handleSend = async () => {
    if (!title.trim() || !summary.trim()) {
      return alert("נא למלא גם כותרת וגם תוכן ההודעה");
    }

    try {
      const res = await fetch("http://localhost:3006/api/messages/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, summary }),
      });

      if (res.ok) {
        alert("ההודעה נשלחה בהצלחה");
        setTitle("");
        setSummary("");
      } else {
        alert("שגיאה בשליחת ההודעה");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("שגיאה בשרת");
    }
  };

  return (
    <div className="send-message-container">
      <h2>שליחת הודעת מערכת</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="כותרת ההודעה"
        className="notification-input"
      />
      <textarea
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        placeholder="תוכן ההודעה..."
        rows={5}
        className="notification-textarea"
      />
      <button onClick={handleSend}>שלח הודעה</button>
    </div>
  );
};

export default SendNotification;
