import React, { useState } from "react";
import axios from "axios";
import "./Staff.css";

const CreateTemplate = () => {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !text) {
      return setMessage("יש למלא את כל השדות הנדרשים");
    }
    try {
      await axios.post("http://localhost:3006/api/answer-templates", {
        name,
        text,
      });
      setSuccess("התבנית נשמרה בהצלחה");
      setName("");
      setText("");
    } catch (error) {
      console.error("Error saving template", error);
      setSuccess("שגיאה בשמירת התבנית");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-template">
      <label htmlFor="template-name">שם התבנית:</label>
      <input
        id="template-name"
        className="staff-form-input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <label htmlFor="template-text">תוכן התשובה:</label>
      <textarea
        id="template-text"
        className="staff-form-input"
        rows="4"
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
      />

      <button className="approve-button" type="submit">
        שמור תבנית
      </button>

      {success && <p>{success}</p>}
      {message && <p style={{ color: "red" }}>{message}</p>}
    </form>
  );
};

export default CreateTemplate;
