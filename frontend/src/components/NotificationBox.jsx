import React, { useState } from "react";
import "./NotificationBox.css";

const NotificationBox = () => {
  const [notifications, setNotifications] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3006/api/messages/all");
      const data = await res.json();

      if (Array.isArray(data)) {
        const sorted = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setNotifications(sorted);
      } else {
        console.error("Data is not an array", data);
      }
    } catch (err) {
      console.error("Error loading notifications", err);
    }
    setLoading(false);
  };

  const handleClick = () => {
    if (!visible) {
      fetchNotifications();
    }
    setVisible(!visible);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString("he-IL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="notification-container">
      <button className="notif-toggle-btn" onClick={handleClick}>
        {visible ? "סגור הודעות מערכת" : "הצג הודעות מערכת"}
      </button>

      {visible && (
        <div className="notif-list">
          <h2 className="notif-title">הודעות מערכת</h2>
          {loading ? (
            <p>טוען...</p>
          ) : notifications.length === 0 ? (
            <p>אין הודעות להצגה</p>
          ) : (
            notifications.map((notif, index) => (
              <div className="notif-card" key={index}>
                <div className="notif-header">
                  <strong>{notif.title || "ללא כותרת"}</strong>
                  <span className="notif-time">{formatDate(notif.createdAt)}</span>
                </div>
                <div className="notif-content">
                  {notif.summary || notif.message || "—"}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBox;
