import React from "react";

const StaffRequestDetailsBox = ({
  selectedRequest,
  selectedTemplate,
  templates,
  commentText,
  setSelectedTemplate,
  setCommentText,
  selectedStaffId,
  setSelectedStaffId,
  staffList,
  handleTransfer,
  handleApprove,
  handleReject,
  setSelectedRequest,
}) => {
  if (!selectedRequest) return null;

  return (
    <div className="request-details-box">
      <h2>פרטי הבקשה</h2>
      <p>
        <strong>שם הסטודנט:</strong> {selectedRequest.student.firstname}{" "}
        {selectedRequest.student.lastname}
      </p>
      <p>
        <strong>קורס:</strong> {selectedRequest.course?.name}
      </p>
      <p>
        <strong>נושא:</strong> {selectedRequest.requestType?.name}
      </p>
      <p>
        <strong>תיאור הבקשה:</strong> {selectedRequest.description}
      </p>
      <p>
        <strong>סטטוס:</strong> {selectedRequest.status}
      </p>
      <p>
        <strong>תאריך הגשה:</strong>{" "}
        {new Date(selectedRequest.submissionDate).toLocaleDateString()}
      </p>

      <div style={{ marginTop: "1em" }}>
        <label className="form-label">
          <strong>בחירת תשובה מהירה:</strong>
        </label>
        <select
          className="staff-form-input"
          value={selectedTemplate}
          onChange={(e) => setSelectedTemplate(e.target.value)}
        >
          <option value="">ללא תגובה</option>
          {templates.map((template, idx) => (
            <option key={idx} value={template.text}>
              {template.text}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: "1em" }}>
        <label className="form-label">
          <strong>הוספת תשובה כתובה</strong>
        </label>
        <textarea
          className="staff-form-input"
          rows="3"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="כתוב כאן את התשובה שלך"
        />
      </div>

      <div style={{ marginTop: "1em" }}>
        <label className="form-label">
          <strong>העבר בקשה לאיש סגל אחר:</strong>
        </label>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginTop: "5px",
          }}
        >
          <select
            className="staff-form-input"
            value={selectedStaffId}
            onChange={(e) => setSelectedStaffId(e.target.value)}
          >
            <option value="">בחר איש סגל</option>
            {staffList.map((staff) => (
              <option key={staff._id} value={staff._id}>
                {staff.firstname} {staff.lastname}
              </option>
            ))}
          </select>
          <button className="transfer-button" onClick={handleTransfer}>
            העבר בקשה
          </button>
        </div>
      </div>

      <div style={{ marginTop: "1.5em", display: "flex", gap: "10px" }}>
        <button
          className="approve-button"
          onClick={() => handleApprove(selectedRequest._id)}
        >
          אישור
        </button>
        <button
          className="reject-button"
          onClick={() => handleReject(selectedRequest._id)}
        >
          דחה
        </button>
        <button
          className="close-button"
          onClick={() => {
            setSelectedRequest(null);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          סגור
        </button>
      </div>
    </div>
  );
};

export default StaffRequestDetailsBox;
