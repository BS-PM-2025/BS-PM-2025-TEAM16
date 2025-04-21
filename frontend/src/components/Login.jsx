import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import { API_URL } from "../utils/resources";
import { saveToLocalStorage, getFromLocalStorage } from "../utils/services";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

 
  useEffect(() => {
    const storedUser = getFromLocalStorage("projectFS");
    if (storedUser?.user?.role) {
      const role = storedUser.user.role.toLowerCase();
      navigate(`/${role}`);
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username) {
      setUsernameError("שדה שם המשתמש הוא שדה חובה");
      return;
    } else {
      setUsernameError("");
    }

    if (!password) {
      setPasswordError("שדה סיסמה הוא שדה חובה");
      return;
    } else {
      setPasswordError("");
    }

    try {
      const response = await axios.post(`${API_URL}/login`, {
        username,
        password,
      });

      if (response.data.success) {
        const user = response.data.user;
        saveToLocalStorage("projectFS", { user });

        const role = user.role.toLowerCase();
        navigate(`/${role}`);
      } else {
        setError(response.data.message); 
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("פרטי ההתחברות שגויים. אנא נסה שוב");
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-box">
        <h2>התחברות</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>
              שם משתמש
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {usernameError && <div className="error">{usernameError}</div>}
            </label>
          </div>

          <div>
            <label>
             סיסמה
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordError && <div className="error">{passwordError}</div>}
            </label>
            <div className="show-password">
            <label htmlFor="showPassword">הצג סיסמה</label>
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
            </div>
          </div>

          {error && <div className="error">{error}</div>}
          <button type="submit">התחבר</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
