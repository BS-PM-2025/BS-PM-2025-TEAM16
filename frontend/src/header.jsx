import { useNavigate } from "react-router-dom";
import { logout, getFromLocalStorage } from "./utils/services";
import "./header.css";
import { useEffect, useState } from "react";
import axios from "axios";

const Header = () => {
  const navigate = useNavigate();
  const userData = getFromLocalStorage("projectFS");
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchMessages = async () => {
      if (userData?.user?.role === "student") {
        try {
          const res = await axios.get(
            `http://localhost:3006/api/requests/messages/${userData.user._id}`
          );
          
          const allMessages = res.data;
          const unread = allMessages.filter((msg) => !msg.read).length;
          setUnreadCount(unread);
        } catch (err) {
          console.error("שגיאה בטעינת ההודעות:", err);
        }
      }
    };

    fetchMessages();
  }, [userData?.user?._id, userData?.user?.role]);

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    return navigate("/");
  };

  return (
    <header className="header">
      <div className="header-logo-container">
        <img src="/studiTrack.png" alt="logo" className="header-logo" />
      </div>

      {userData?.user?.firstname && userData?.user?.lastname && (
        <div className="welcome-message">
          ברוך הבא לאזור האישי שלך {userData.user.firstname}{" "}
          {userData.user.lastname}
        </div>
      )}

      {userData?.user?.role === "student" && (
        <button
          className="messages-button"
          onClick={() => navigate("/messages")}
        >
          הודעות {unreadCount > 0 && <span>({unreadCount})</span>}
        </button>
      )}

      <button className="logout-button" onClick={handleLogout}>
        התנתקות
      </button>
    </header>
  );
};

export default Header;
