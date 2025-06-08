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
export const ID_PLACEHOLDER = "הקלד ת.ז של סטודנט";

const Staff = () => {
  const [userData, setUserData] = useState(null);
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

  const requestDetailsRef = useRef(null);

  useEffect(() => {
    const data = getFromLocalStorage("projectFS");
    setUserData(data);

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
          console.log(res.data);
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

      axios
        .get("http://localhost:3006/api/answer-templates")
        .then((res) => {
          console.log("Templates received:", res.data);
          setTemplates(res.data);
        })
        .catch((err) => console.error("Error loading templates", err));
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
        setSelectedRequest((prev) =>
          prev ? { ...prev, status: "אושר" } : prev
        );
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
        setSelectedRequest((prev) =>
          prev ? { ...prev, status: "נדחה" } : prev
        );
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
        <div className="requests-box">
          <h3>בקשות סטודנטים לטיפולך:</h3>
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
          </div>
        )}
        <StaffTemplateBox
          showTemplateBox={showTemplateBox}
          setShowTemplateBox={setShowTemplateBox}
        />
      </div>
    </div>
  );
};

export default Staff;
