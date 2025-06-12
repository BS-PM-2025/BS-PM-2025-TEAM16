import React, { useEffect, useState } from "react";
import axios from "axios";
import { BaseUser, Staff, Student } from "../models/user";
import "./UserList.css";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState([]);
  const [filterDepartment, setFilterDepartment] = useState([]);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [selectedUserIndex, setSelectedUserIndex] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3006/users/all-users")
      .then((res) => {
        const mapped = res.data.map((user) => {
          if (user.role === "student") return new Student(user);
          if (user.role === "staff") return new Staff(user);
          return new BaseUser(user);
        });
        setUsers(mapped);
        setFilteredUsers(mapped);
      })
      .catch((err) => console.error("שגיאה בטעינת המשתמשים", err));
  }, []);

  useEffect(() => {
    let result = [...users];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (u) =>
          u.firstname?.toLowerCase().includes(term) ||
          u.lastname?.toLowerCase().includes(term) ||
          u.id?.toLowerCase().includes(term)
      );
    }

    if (filterRole.length > 0) {
      result = result.filter((u) => filterRole.includes(u.role));
    }

    if (filterDepartment.length > 0) {
      result = result.filter((u) => filterDepartment.includes(u.department));
    }

    setFilteredUsers(result);
  }, [searchTerm, filterRole, filterDepartment, users]);

  const resetFilters = () => {
    setSearchTerm("");
    setFilterRole([]);
    setFilterDepartment([]);
  };

  const uniqueRoles = [...new Set(users.map((u) => u.role))];
  const uniqueDepartments = [...new Set(users.map((u) => u.department))];

  return (
    <div className="form-container">
      <h2>רשימת משתמשים</h2>

      <div className="filter-row">
        <input
          type="text"
          placeholder="חיפוש לפי שם / משפחה / ת״ז"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="reset-btn" onClick={resetFilters}>
          איפוס
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ת"ז</th>
            <th>שם פרטי</th>
            <th>שם משפחה</th>
            <th>
              תפקיד
              <div className="dropdown-container">
                <span
                  className="filter-icon"
                  onClick={() => setShowRoleDropdown((prev) => !prev)}
                >
                  ▼
                </span>
                {showRoleDropdown && (
                  <div className="dropdown">
                    {uniqueRoles.map((r) => (
                      <label key={r}>
                        <input
                          type="checkbox"
                          checked={filterRole.includes(r)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilterRole([...filterRole, r]);
                            } else {
                              setFilterRole(filterRole.filter((item) => item !== r));
                            }
                          }}
                        />
                        {r}
                      </label>
                    ))}
                    <button onClick={() => setFilterRole([])}>איפוס</button>
                  </div>
                )}
              </div>
            </th>
            <th>
              מחלקה
              <div className="dropdown-container">
                <span
                  className="filter-icon"
                  onClick={() => setShowDepartmentDropdown((prev) => !prev)}
                >
                  ▼
                </span>
                {showDepartmentDropdown && (
                  <div className="dropdown">
                    {uniqueDepartments.map((d) => (
                      <label key={d}>
                        <input
                          type="checkbox"
                          checked={filterDepartment.includes(d)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilterDepartment([...filterDepartment, d]);
                            } else {
                              setFilterDepartment(filterDepartment.filter((item) => item !== d));
                            }
                          }}
                        />
                        {d}
                      </label>
                    ))}
                    <button onClick={() => setFilterDepartment([])}>איפוס</button>
                  </div>
                )}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u, i) => (
            <React.Fragment key={i}>
              <tr
                className={`hoverable-row ${selectedUserIndex === i ? "selected" : ""}`}
                onClick={() => setSelectedUserIndex(i === selectedUserIndex ? null : i)}
              >
                <td>{u.id}</td>
                <td>{u.firstname}</td>
                <td>{u.lastname}</td>
                <td>{u.role}</td>
                <td>{u.department}</td>
              </tr>
              {selectedUserIndex === i && (
                <tr className="user-details-row">
                  <td colSpan="5">
                    <div className="user-details-card">
                      <p><strong>שם:</strong> {u.firstname}</p>
                      <p><strong>שם משתמש:</strong> {u.username}</p>
                      <p><strong>שם משפחה:</strong> {u.lastname}</p>
                      <p><strong>תפקיד:</strong> {u.role}</p>
                      <p><strong>מחלקה:</strong> {u.department}</p>
                      <p><strong>אימייל:</strong> {u.email}</p>
                      {u.employeeId && <p><strong>מספר עובד:</strong> {u.employeeId}</p>}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
