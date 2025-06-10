import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../utils/resources";
import "./Login.css";

function ForgotPassword() {
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!username || !newPassword) {
      setError("נא למלא את כל השדות");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/reset-password`, {
        username,
        newPassword,
      });

      if (response.data.success) {
        setMessage("הסיסמה אופסה בהצלחה! ניתן להתחבר עם הסיסמה החדשה.");
      } else {
        setError(response.data.message || "שגיאה בעת איפוס הסיסמה");
      }
    } catch (err) {
      console.error(err);
      setError("שגיאה בשרת, נסה שוב מאוחר יותר");
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-box">
        <h2>שחזור סיסמה</h2>
        <form onSubmit={handleReset}>
          <label>
            שם משתמש
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>

          <label>
            סיסמה חדשה
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </label>

          {message && <div className="success">{message}</div>}
          {error && <div className="error">{error}</div>}
          <button type="submit">אפס סיסמה</button>
        </form>

        {/* כפתור חזרה להתחברות */}
        {message && (
          <button
          onClick={() => navigate("/")}
          className="return-login-button"
        >
          חזרה להתחברות
        </button>
        
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
