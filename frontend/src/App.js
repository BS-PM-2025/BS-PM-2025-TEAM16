import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import Student from "./components/Student";
import Staff from "./components/Staff";
import Admin from "./components/Admin";
import ProtectedRoute from "./components/ProtectedRoute";
import AddUser from "./components/AddUser";
import EditUserRole from "./components/EditUserRole";
import UserList from "./components/UserList";
import StudentDetails from "./components/StudentDetails";
import DepartmentRequests from "./components/DepartmentRequests";
import MessagesPage from "./components/MessagesPage";
import DeleteUser from "./components/DeleteUser";
import SendNotification from "./components/SendNotification";



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRole="student">
              <Student />
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff"
          element={
            <ProtectedRoute allowedRole="staff">
              <Staff />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <Admin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/add-user"
          element={
            <ProtectedRoute allowedRole="admin">
              <AddUser />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/edit-role"
          element={
            <ProtectedRoute allowedRole="admin">
              <EditUserRole />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/user-list"
          element={
            <ProtectedRoute allowedRole="admin">
              <UserList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/delete-user"
          element={
            <ProtectedRoute allowedRole="admin">
              <DeleteUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/send-message"
          element={
            <ProtectedRoute allowedRole="admin">
              <SendNotification />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/student-details"
          element={
            <ProtectedRoute allowedRole="admin">
              <StudentDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff/department-requests"
          element={
            <ProtectedRoute allowedRole="Staff">
              <DepartmentRequests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/messages"
          element={
            <ProtectedRoute allowedRole="student">
              <MessagesPage />
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
};

export default App;
