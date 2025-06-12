import React, { useState } from "react";
import axios from "axios";
import "./StudentStatus.css";

const StudentStatus = ({ requests }) => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [appealText, setAppealText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const validRequests = Array.isArray(requests) ? requests : [];

  const filteredRequests = validRequests.filter((r) => {
    const matchesStatus = statusFilter ? r.status === statusFilter : true;
    const matchesCourse = courseFilter ? r.course?.name === courseFilter : true;
    const matchesDate = dateFilter
      ? new Date(r.submissionDate).toISOString().slice(0, 10) === dateFilter
      : true;
    return matchesStatus && matchesCourse && matchesDate;
  });

  const handleAppealSubmit = async () => {
    try {
      await axios.put(`http://localhost:3006/api/staff/requests/${selectedRequest._id}/appeal`, {
        appeal: appealText,
      });
      alert("הערעור נשלח");
      setSelectedRequest({
        ...selectedRequest,
        appeal: appealText,
        appealStatus: "בטיפול",
      });
    } catch (error) {
      console.error("שגיאה בשליחת ערעור:", error);
      alert("שליחת הערעור נכשלה");
    }
  };

  return (
    <div className="student-status-container" style={{ direction: "rtl", padding: "2rem" }}>
      {/* סינון */}
      <div
        className="filter-bar"
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          flexWrap: "wrap",
          marginBottom: "2rem",
        }}
      >
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={filterStyle}
        >
          <option value="">כל הסטטוסים</option>
          <option value="ממתין">ממתין</option>
          <option value="אושר">אושר</option>
          <option value="נדחה">נדחה</option>
        </select>

        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          style={filterStyle}
        >
          <option value="">כל הקורסים</option>
          {[...new Set(validRequests.map((r) => r.course?.name))].map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          style={filterStyle}
        />
      </div>

      {/* כרטיסי בקשות */}
      <div className="status-box-row">
        {filteredRequests.map((req) => (
          <div
            key={req._id}
            className="status-card"
            onClick={() => setSelectedRequest(req)}
            style={{ cursor: "pointer" }}
          >
            <div
              className={`status-indicator ${
                req.status === "אושר"
                  ? "green"
                  : req.status === "ממתין"
                  ? "orange"
                  : "red"
              }`}
            ></div>
            <p className="request-topic">{req.requestType?.name}</p>
            <p className="status-label">{req.status}</p>
          </div>
        ))}
      </div>

      {/* פרטי בקשה */}
      {selectedRequest && (
        <div
          className="request-details-box"
          style={{
            direction: "rtl",
            textAlign: "right",
            padding: "1.5em",
          }}
        >
          <h2 style={{ marginBottom: "1em" }}>פרטי הבקשה</h2>

          <p><strong>קורס:</strong> {selectedRequest.course?.name}</p>
          <p><strong>נושא:</strong> {selectedRequest.requestType?.name}</p>
          <p><strong>תיאור הבקשה:</strong> {selectedRequest.description || "—"}</p>
          <p><strong>הערת סגל:</strong>{" "}
            {selectedRequest.staffComments?.length > 0
              ? selectedRequest.staffComments[selectedRequest.staffComments.length - 1]?.comment
              : "אין הערות"}
          </p>
          <p><strong>סטטוס:</strong> {selectedRequest.status}</p>
          <p><strong>תאריך הגשה:</strong>{" "}
            {new Date(selectedRequest.submissionDate).toLocaleDateString()}
          </p>

          {/* טופס ערעור */}
          {selectedRequest.status === "נדחה" && selectedRequest.appealStatus === "לא נשלח" && (
            <div
              style={{
                marginTop: "2em",
                background: "#f9f9f9",
                padding: "1.5em",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
              }}
            >
              <h4 style={{ marginBottom: "0.5em", fontSize: "18px" }}>
                ערעור על ההחלטה:
              </h4>
              <textarea
                placeholder="כתוב את הערעור שלך כאן..."
                value={appealText}
                onChange={(e) => setAppealText(e.target.value)}
                style={{
                  width: "100%",
                  minHeight: "100px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  padding: "0.75em",
                  fontSize: "14px",
                  direction: "rtl",
                  resize: "vertical",
                  boxSizing: "border-box",
                }}
              />
              <button
                onClick={handleAppealSubmit}
                style={{
                  marginTop: "1em",
                  padding: "10px 24px",
                  backgroundColor: "#ff9800",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                שלח ערעור
              </button>
            </div>
          )}

          <div style={{ marginTop: "1.5em" }}>
            <button className="close-button" onClick={() => setSelectedRequest(null)}>
              סגור
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const filterStyle = {
  padding: "0.5rem",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "14px",
  minWidth: "160px",
};

export default StudentStatus;
