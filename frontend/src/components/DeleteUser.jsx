import React, { useState } from "react";
import axios from "axios";
import "./Form.css";

const DeleteUser = () => {
  const [idNumber, setIdNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3006/api/users/by-id/${idNumber}`);
      alert("המשתמש נמחק בהצלחה");
      setIdNumber("");
      setFirstName("");
      setLastName("");
      setShowConfirm(false);
    } catch (error) {
      alert("שגיאה במחיקת המשתמש");
    }
  };

  return (
    <div className="form-container">
      <h2>מחיקת משתמש</h2>
      <input
        type="text"
        placeholder="תעודת זהות"
        value={idNumber}
        onChange={(e) => setIdNumber(e.target.value)}
      />
      <input
        type="text"
        placeholder="שם פרטי"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <input
        type="text"
        placeholder="שם משפחה"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <button
        className="submit-button"
        onClick={() => setShowConfirm(true)}
        disabled={!idNumber}
      >
        מחק
      </button>

      {showConfirm && (
        <div className="modal">
          <div className="modal-content">
            <p>האם את/ה בטוח/ה שברצונך למחוק את {firstName} {lastName}?</p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <button className="approve-button" onClick={handleDelete}>כן</button>
              <button className="reject-button" onClick={() => setShowConfirm(false)}>לא</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteUser;
