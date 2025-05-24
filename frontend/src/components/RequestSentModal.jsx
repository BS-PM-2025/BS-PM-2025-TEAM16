import React from "react";

const RequestSentModal = ({ expectedDate, onClose }) => {
  const formattedDate = expectedDate?.toLocaleDateString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>בקשתך נשלחה בהצלחה!</h2>
        {formattedDate && (
          <p>צפי למענה עד {formattedDate}</p>
        )}
        <button className="modal-close" onClick={onClose}>
          סגור
        </button>
      </div>
    </div>
  );
};

export default RequestSentModal;