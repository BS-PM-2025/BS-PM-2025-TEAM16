import React, { useState } from "react";
import "./StudentStatus.css";

const StudentStatus = ({ requests }) => {
  const [selectedRequest, setSelectedRequest] = useState(null);

  const lastApproved = [...requests]
    .filter((r) => r.status === "אושר")
    .sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate))[0];

  const lastRejected = [...requests]
    .filter((r) => r.status === "נדחה")
    .sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate))[0];

  const lastPending = [...requests]
    .filter((r) => r.status === "ממתין")
    .sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate))[0];

  return (
    <div className="status-box-row">
      {lastApproved && (
        <div
          className="status-card"
          onClick={() => setSelectedRequest(lastApproved)}
          style={{ cursor: "pointer" }}
        >
          <div className="status-indicator green"></div>
          <p className="request-topic">{lastApproved.requestType?.name}</p>
          <p className="status-label">אושר</p>
        </div>
      )}
      {lastPending && (
        <div
          className="status-card"
          onClick={() => setSelectedRequest(lastPending)}
          style={{ cursor: "pointer" }}
        >
          <div className="status-indicator orange"></div>
          <p className="request-topic">{lastPending.requestType?.name}</p>
          <p className="status-label">ממתין</p>
        </div>
      )}
      {lastRejected && (
        <div
          className="status-card"
          onClick={() => setSelectedRequest(lastRejected)}
          style={{ cursor: "pointer" }}
        >
          <div className="status-indicator red"></div>
          <p className="request-topic">{lastRejected.requestType?.name}</p>
          <p className="status-label">נדחה</p>
        </div>
      )}

      {selectedRequest && (
        <div className="request-details-box">
          <h2>פרטי הבקשה</h2>
          <p>
            <strong>קורס:</strong> {selectedRequest.course?.name}
          </p>
          <p>
            <strong>נושא:</strong> {selectedRequest.requestType?.name}
          </p>
          <p>
            <strong>תיאור הבקשה:</strong> {selectedRequest.description || "—"}
          </p>
          <p>
            <strong>הערת סגל:</strong>{" "}
            {selectedRequest.staffComments?.length > 0
              ? selectedRequest.staffComments[
                  selectedRequest.staffComments.length - 1
                ].comment
              : "אין הערות"}
          </p>

          <p>
            <strong>סטטוס:</strong> {selectedRequest.status}
          </p>
          <p>
            <strong>תאריך הגשה:</strong>{" "}
            {new Date(selectedRequest.submissionDate).toLocaleDateString()}
          </p>

          <div style={{ marginTop: "1em" }}>
            <button
              className="close-button"
              onClick={() => setSelectedRequest(null)}
            >
              סגור
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default StudentStatus;
