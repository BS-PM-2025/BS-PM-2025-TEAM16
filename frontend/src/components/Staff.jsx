import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Header from "../header";
import { getFromLocalStorage } from "../utils/services";
import "./Staff.css";
import StaffRequestsTable from "./StaffRequestsTable";
import StaffRequestDetailsBox from "./StaffRequestDetailsBox";
import StaffRequestFilters from "./StaffRequestFilters";
import StaffTemplateBox from "./StaffTemplateBox";
import StaffChart from "./StaffChart";
import NotificationBox from "./NotificationBox";
import StaffStudentSearchBox from "./StaffStudentSearchBox";

export const ID_PLACEHOLDER = "הקלד ת.ז של סטודנט";

const Staff = () => {
  const [position, setPosition] = useState(null);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [studentIdFilter, setStudentIdFilter] = useState("");
  const [staffList, setStaffList] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [commentText, setCommentText] = useState("");
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [showTemplateBox, setShowTemplateBox] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [staleRequests, setStaleRequests] = useState([]);
  const [message, setMessage] = useState("");
  const [messageToSend, setMessageToSend] = useState("");



  const requestDetailsRef = useRef(null);

  useEffect(() => {
    const data = getFromLocalStorage("projectFS");
    setPosition(data?.user?.position);
  
    if (data?.user?.username) {
      let url = "";
  
      if (studentIdFilter) {
        url = `http://localhost:3006/api/staff/requests/by-student-id?studentId=${studentIdFilter}`;
      } else if (statusFilter) {
        url = `http://localhost:3006/api/staff/requests/by-status-and-staff?staffUsername=${data.user.username}&status=${statusFilter}`;
      } else {
        url = `http://localhost:3006/api/staff/requests?staffUsername=${data.user.username}`;
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
  
      
        axios
        .get(`http://localhost:3006/users/staff-by-department?department=${data.user.department}`)
        .then((res) => {
          const others = res.data.filter((user) => user._id !== data.user._id);
          setStaffList(others);
        })
        .catch((err) => console.error("שגיאה בטעינת אנשי הסגל:", err));
      
    
        axios
          .get("http://localhost:3006/api/answer-templates")
          .then((res) => {
            setTemplates(res.data);
          })
          .catch((err) => console.error("Error loading templates", err));
    
        axios
          .get(`http://localhost:3006/api/staff/requests/stale?staffUsername=${data.user.username}`)
          .then((res) => setStaleRequests(res.data))
          .catch((err) => console.error("Error fetching stale requests", err));
      } else {
        setIsLoading(false);
      }
  }, [statusFilter, studentIdFilter]);
  

  useEffect(() => {
    if (selectedRequest && requestDetailsRef.current) {
      requestDetailsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [selectedRequest]);

  const getTempAnswer = () => {
    if (selectedTemplate && commentText)
      return `${selectedTemplate} - ${commentText}`;
    if (selectedTemplate) return selectedTemplate;
    return commentText;
  };

  const handleApprove = (id) => {
    axios
      .put(`http://localhost:3006/api/staff/requests/approve/${id}`, {
        comment: getTempAnswer(),
      })
      .then(() => {
        alert("הבקשה אושרה");
        setRequests((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status: "אושר" } : r))
        );
        setSelectedRequest(null);
        setCommentText("");
        setSelectedTemplate("");
      })
      .catch(() => alert("שגיאה באישור הבקשה"));
  };

  const handleReject = (id) => {
    axios
      .put(`http://localhost:3006/api/staff/requests/reject/${id}`, {
        comment: getTempAnswer(),
      })
      .then(() => {
        alert("הבקשה נדחתה");
        setRequests((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status: "נדחה" } : r))
        );
        setSelectedRequest(null);
        setCommentText("");
        setSelectedTemplate("");
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

  const handleAppealDecision = async (decision) => {
    try {
      await axios.put(
        `http://localhost:3006/api/staff/requests/${selectedRequest._id}/appeal-decision`,
        {
          status: decision,
          appealStatus: decision,
        }
      );
      alert(`ערעור ${decision === "אושר" ? "אושר" : "נדחה"}`);
      setRequests((prev) =>
        prev.map((r) =>
          r._id === selectedRequest._id
            ? { ...r, status: decision, appealStatus: decision }
            : r
        )
      );
      setSelectedRequest(null);
    } catch (error) {
      console.error("שגיאה בטיפול בערעור:", error);
      alert("שגיאה בטיפול בערעור");
    }
  };
  const handleSendMessage = () => {
    if (!selectedRequest || !selectedRequest.student || !selectedRequest.student._id) {
      alert("אין אפשרות לשלוח הודעה – נתוני סטודנט חסרים");
      return;
    }
  
    const data = getFromLocalStorage("projectFS");
    const staffId = data?.user?._id;
  
    axios
      .post(`http://localhost:3006/api/staff/requests/${selectedRequest._id}/send-message`, {
        senderId: staffId,
        message: message, 
      })
      .then(() => {
        alert("ההודעה נשלחה בהצלחה");
        setMessage(""); 
      })
      .catch((err) => {
        console.error("שגיאה בשליחת ההודעה:", err);
        alert("שגיאה בשליחת ההודעה");
      });
  };
  
  

  const numPending = requests.filter((r) => r.status === "ממתין").length;
  const numApproved = requests.filter((r) => r.status === "אושר").length;
  const numRejected = requests.filter((r) => r.status === "נדחה").length;
  const pieData = [
    { name: "ממתין", value: numPending },
    { name: "אושר", value: numApproved },
    { name: "נדחה", value: numRejected },
  ];

  return (
    <div className="staff" dir="rtl">
      <div className="staff-page-container">
        <Header />
        <NotificationBox showButton={true} />
        <div className="requests-box">
          <h3>בקשות סטודנטים לטיפולך:</h3>

          {/* תזכורת על בקשות לא מטופלות */}
          {staleRequests.length > 0 && (
            <div
              style={{
                backgroundColor: "#fff3cd",
                color: "#856404",
                border: "1px solid #ffeeba",
                padding: "1em",
                borderRadius: "8px",
                marginBottom: "1em",
              }}
            >
              <strong>לתשומת ליבך:</strong> יש {staleRequests.length} בקשות שממתינות לטיפול מעל 3 ימים.
            </div>
          )}

          <button
            className="chart-button"
            onClick={() => setShowChart((prev) => !prev)}
          >
            {showChart ? "הסתר גרף" : "הצג גרף"}
          </button>

          {showChart && <StaffChart pieData={pieData} />}

          {statusFilter === "" ? (
            <div className="status-count-wrapper">
              <div className="status-count-box pending">
                בקשות ממתינות: {numPending}
              </div>
              <div className="status-count-box approved">
                בקשות שאושרו: {numApproved}
              </div>
              <div className="status-count-box rejected">
                בקשות שנדחו: {numRejected}
              </div>
            </div>
          ) : (
            <div
              className={`status-count-box ${
                statusFilter === "ממתין"
                  ? "pending"
                  : statusFilter === "אושר"
                  ? "approved"
                  : "rejected"
              }`}
            >
              {statusFilter === "ממתין"
                ? `בקשות ממתינות: ${numPending}`
                : statusFilter === "אושר"
                ? `בקשות שאושרו: ${numApproved}`
                : `בקשות שנדחו: ${numRejected}`}
            </div>
          )}

          <StaffRequestFilters
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            studentIdFilter={studentIdFilter}
            setStudentIdFilter={setStudentIdFilter}
          />

          {isLoading ? (
            <p>...טוען בקשות</p>
          ) : (
            <StaffRequestsTable
              requests={requests}
              setSelectedRequest={setSelectedRequest}
              position={position}
            />
          )}
        </div>

          {selectedRequest && (
    <div ref={requestDetailsRef}>
      <StaffRequestDetailsBox
        selectedRequest={selectedRequest}
        selectedTemplate={selectedTemplate}
        templates={templates}
        commentText={commentText}
        setSelectedTemplate={setSelectedTemplate}
        setCommentText={setCommentText}
        selectedStaffId={selectedStaffId}
        setSelectedStaffId={setSelectedStaffId}
        staffList={staffList}
        handleTransfer={handleTransfer}
        handleApprove={handleApprove}
        handleReject={handleReject}
        setSelectedRequest={setSelectedRequest}
      />

      {/* ערעור */}
      {selectedRequest.appealStatus === "בטיפול" && (
        <div
          style={{
            marginTop: "2em",
            background: "#eef4fc",
            padding: "1.5em",
            borderRadius: "12px",
            direction: "rtl",
            textAlign: "right",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
          }}
        >
          <h3 style={{ marginBottom: "0.5em", color: "#1a237e" }}>
            ערעור הסטודנט:
          </h3>
          <p
            style={{
              background: "#f9f9f9",
              padding: "1em",
              borderRadius: "8px",
              fontSize: "15px",
              border: "1px solid #ddd",
            }}
          >
            {selectedRequest.appeal}
          </p>

          <div style={{ marginTop: "1em", display: "flex", gap: "0.5em" }}>
            <button
              onClick={() => handleAppealDecision("אושר")}
              style={{
                backgroundColor: "#4caf50",
                color: "white",
                border: "none",
                padding: "10px 16px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              אשר את הערעור
            </button>
            <button
              onClick={() => handleAppealDecision("נדחה")}
              style={{
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                padding: "10px 16px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              דחה את הערעור
            </button>
          </div>
        </div>
      )}

      {/* שליחת הודעה לסטודנט */}
      <div
        style={{
          marginTop: "2em",
          background: "#fff8e1",
          padding: "1.5em",
          borderRadius: "12px",
          direction: "rtl",
          textAlign: "right",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ marginBottom: "0.5em", color: "#bf360c" }}>
          שליחת הודעה לסטודנט
        </h3>
        <textarea
          placeholder="כתוב את ההודעה שלך לסטודנט..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{
            width: "100%",
            minHeight: "70px",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginBottom: "1em",
            fontSize: "15px",
          }}
        />
        <button
          onClick={handleSendMessage}
          style={{
            backgroundColor: "#ff9800",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          שלח הודעה
        </button>
      </div>
    </div>
  )}


        <StaffTemplateBox
          showTemplateBox={showTemplateBox}
          setShowTemplateBox={setShowTemplateBox}
        />

        <StaffStudentSearchBox /> 
      </div>
    </div>
    
  );
};

export default Staff;
