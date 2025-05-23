import React, { useEffect, useState } from "react";
import Header from "../header";
import { getFromLocalStorage } from "../utils/services";
import StudentRequestForm from "../components/StudentRequestForm";
import "./Welcome.css";
import StudentStatus from "./StudentStatus";
import StudentRequestsTable from "./StudentRequestsTable";

const Student = () => {
  const [userData, setUserData] = useState(null);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const data = getFromLocalStorage("projectFS");
    setUserData(data);

    if (data?.user?.username) {
      const url = `http://localhost:3006/api/student/requests?studentUsername=${data.user.username}`;
      fetch(url)
        .then((res) => res.json())
        .then((data) => setRequests(data))
        .catch((err) => console.error("Error loading requests", err));
    }
  }, []);

  return (
    <div className="welcome">
      <div className="welcome-page-container">
        <Header />
        <div className="welcome-header-box">
          {userData && (
            <>
              <h2>ברוך הבא לאזור האישי שלך {userData.user.username}</h2>
            </>
          )}
        </div>

        {/* מציגים את הטופס כולל הכפתור שכבר יש בו */}
        <div style={{ marginTop: "30px" }}>
          <StudentRequestForm />
        </div>
        <div style={{ marginTop: "30px" }}>
          <StudentStatus requests={requests} />
        </div>

        <div style={{ marginTop: "40px" }}>
          <StudentRequestsTable requests={requests} />
        </div>
      </div>
    </div>
  );
};

export default Student;
