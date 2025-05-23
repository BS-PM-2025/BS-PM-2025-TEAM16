import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../header";
import { getFromLocalStorage } from "../utils/services";
import "./Welcome.css";
export const ID_PLACEHOLDER = "הקלד ת.ז של סטודנט";

const Staff = () => {
  const [userData, setUserData] = useState(null);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ממתין");
  const [studentIdFilter, setStudentIdFilter] = useState("");
  const [staffList, setStaffList] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    const data = getFromLocalStorage("projectFS");
    setUserData(data);

    if (data?.user?.username) {
      let url = `http://localhost:3006/api/staff/requests/by-status-and-staff?staffUsername=${data.user.username}&status=${statusFilter}`;
      if (studentIdFilter) {
        url = `http://localhost:3006/api/staff/requests/by-student-id?studentId=${studentIdFilter}`;
      }

      axios
        .get(url, { headers: { "user-role": "Staff" } })
        .then((res) => {
          setRequests(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Error loading staff requests:", err);
          setIsLoading(false);
        });

      axios.get("http://localhost:3006/users/all-users").then((res) => {
        const staffOnly = res.data.filter((user) => user.role === "Staff");
        setStaffList(staffOnly);
      });
    } else {
      setIsLoading(false);
    }
  }, [statusFilter, studentIdFilter]);

  const handleApprove = (id) => {
    axios
      .put(`http://localhost:3006/api/staff/requests/approve/${id}`, {
        comment: commentText,
      })
      .then(() => {
        alert("הבקשה אושרה");
        setRequests((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status: "אושר" } : r))
        );
        setSelectedRequest((prev) =>
          prev ? { ...prev, status: "אושר" } : prev
        );
        setCommentText("");
      })
      .catch(() => alert("שגיאה באישור הבקשה"));
  };

  const handleReject = (id) => {
    axios
      .put(`http://localhost:3006/api/staff/requests/reject/${id}`, {
        comment: commentText,
      })
      .then(() => {
        alert("הבקשה נדחתה");
        setRequests((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status: "נדחה" } : r))
        );
        setSelectedRequest((prev) =>
          prev ? { ...prev, status: "נדחה" } : prev
        );
        setCommentText("");
      })
      .catch(() => alert("שגיאה בדחיית הבקשה"));
  };

  const handleTransfer = () => {
    if (!selectedRequest || !selectedStaffId) return;
    axios
      .put(
        `http://localhost:3006/api/staff/requests/transfer/${selectedRequest._id}`,
        { newStaffId: selectedStaffId }
      )
      .then(() => {
        alert("הבקשה הועברה בהצלחה");
        setRequests((prev) =>
          prev.filter((r) => r._id !== selectedRequest._id)
        );
        setSelectedRequest(null);
      })
      .catch(() => alert("שגיאה בהעברת הבקשה"));
  };

  return (
    <div className="welcome" dir="rtl">
      <div className="welcome-page-container">
        <Header />

        {userData && (
          <div className="welcome-header-box">
            <h2>ברוך הבא לאזור האישי שלך {userData.user.username}</h2>
          </div>
        )}

        <div className="requests-box">
          <h3>בקשות סטודנטים לטיפולך:</h3>

          <div className="status-container">
            <label htmlFor="status-select" className="status-label">
              סינון לפי סטטוס:
            </label>
            <select
              id="status-select"
              className="status-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              disabled={studentIdFilter !== ""}
            >
              <option value="ממתין">ממתין</option>
              <option value="אושר">אושר</option>
              <option value="נדחה">נדחה</option>
            </select>

            <label htmlFor="student-id-input" className="status-label">
              הזן תעודת זהות לסינון:
            </label>
            <input
              id="student-id-input"
              type="text"
              placeholder={ID_PLACEHOLDER}
              className="id-input"
              value={studentIdFilter}
              onChange={(e) => setStudentIdFilter(e.target.value)}
            />
          </div>

          {isLoading ? (
            <p>...טוען בקשות</p>
          ) : (
            <table border="1" className="requests-table">
              <thead>
                <tr>
                  <th>שם הסטודנט</th>
                  <th>ת.ז</th>
                  <th>נושא הבקשה</th>
                  <th>קורס</th>
                  <th>סטטוס</th>
                  <th>הערת סגל</th>
                  <th>תאריך הגשה</th>
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan="6">לא קיימות בקשות בסטטוס {statusFilter}</td>
                  </tr>
                ) : (
                  requests.map((req) =>
                    req.student && req.staff ? (
                      <tr
                        key={req._id}
                        onClick={() => setSelectedRequest(req)}
                        style={{ cursor: "pointer" }}
                      >
                        <td>
                          {req.student.firstname} {req.student.lastname}
                        </td>
                        <td>{req.student.id}</td>
                        <td>{req.requestType?.name || "—"}</td>
                        <td>{req.course?.name || "—"}</td>
                        <td>{req.status}</td>
                        <td>
                          {req.staffComments.length > 0
                            ? req.staffComments[req.staffComments.length - 1]
                                .comment
                            : "-"}
                        </td>
                        <td>
                          {new Date(req.submissionDate).toLocaleDateString()}
                        </td>
                      </tr>
                    ) : null
                  )
                )}
              </tbody>
            </table>
          )}
        </div>

        {selectedRequest && (
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
                <strong>הוספת הערה לפני אישור/דחייה:</strong>
              </label>
              <textarea
                className="form-input"
                rows="3"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="כתוב כאן את ההערה שלך"
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
                  className="form-input"
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
                onClick={() => setSelectedRequest(null)}
              >
                סגור
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

};

export default Staff;
