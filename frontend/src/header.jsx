import { useNavigate } from "react-router-dom";
import { logout, getFromLocalStorage } from "./utils/services";
import "./header.css";

const Header = () => {
  const navigate = useNavigate();
  const userData = getFromLocalStorage("projectFS");

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

      <button className="logout-button" onClick={handleLogout}>
        התנתקות
      </button>
    </header>
  );
};

export default Header;
