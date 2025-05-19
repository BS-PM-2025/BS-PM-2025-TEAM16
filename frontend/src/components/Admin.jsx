import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import Header from '../header';
import { getFromLocalStorage } from "../utils/services"
import './Welcome.css';

const Admin = () => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const data = getFromLocalStorage('projectFS');
        setUserData(data);
    }, []);

    return (
        <div className="welcome">
        <div className="welcome-page-container">
            <Header />
            <div className="welcome-header-box">
                {userData && (
                    <>
                        <h2> ברוך הבא לאזור האישי שלך {userData.user.username}</h2>
                       
                    </>
                )}
            </div>
            <div className="admin-links">
        <h3>פעולות ניהוליות:</h3>
        <ul>
          <li><Link to="/admin/add-user">הוספת משתמש</Link></li>
          <li><Link to="/admin/edit-role">עריכת תפקיד</Link></li>
          <li><Link to="/admin/user-list">רשימת משתמשים</Link></li>
          <li><Link to="/admin/student-details">פרטי סטודנט</Link></li>
          
        </ul>
      </div>
        </div>
        </div>
    );
};
export default Admin;
