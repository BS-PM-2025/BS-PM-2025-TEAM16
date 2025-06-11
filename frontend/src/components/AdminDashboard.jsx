import React from "react";
import { Link } from "react-router-dom";
import { FaUserPlus, FaEdit, FaUsers, FaInfoCircle, FaTrashAlt, FaEnvelope, FaIdCard } from "react-icons/fa";
import Header from "../header";
import { getFromLocalStorage } from "../utils/services";
import "./Welcome.css";

const AdminDashboard = () => {
  const userData = getFromLocalStorage("projectFS");

  const adminActions = [
    { label: "הוספת משתמש", icon: <FaUserPlus />, to: "/admin/add-user" },
    { label: "עריכת תפקיד", icon: <FaEdit />, to: "/admin/edit-role" },
    { label: "רשימת משתמשים", icon: <FaUsers />, to: "/admin/user-list" },
    { label: "פרטי סטודנט", icon: <FaInfoCircle />, to: "/admin/student-details" },
    { label: "מחיקת משתמש", icon: <FaTrashAlt />, to: "/admin/delete-user" },
    { label: "שליחת הודעת מערכת", icon: <FaEnvelope />, to: "/admin/send-message" }
  ];

  return (
    <div className="welcome">
      <div className="welcome-page-container">
        <Header />
        <div className="welcome-header-box">
          <h2>ברוך הבא לאזור האישי שלך {userData?.user?.username}</h2>
        </div>

        <div className="admin-dashboard">
          {adminActions.map(({ label, icon, to }) => (
            <Link key={to} to={to} className="admin-action-card">
              <div className="icon">{icon}</div>
              <div className="label">{label}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
