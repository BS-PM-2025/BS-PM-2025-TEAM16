import React, { useEffect, useState } from "react";
import "./StudentRequestForm.css";
import RequestSentModal from "./RequestSentModal";

const API_BASE = "http://localhost:3006";

const requiredDocsMap = {
  "בקשה למועד מיוחד": "אישור מחלה / אישור מילואים",
  "דחיית הגשת עבודה": "אישור מחלה / אישור מילואים",
  "בקשה למטלה חלופית חרבות הברזל": "אישור מילואים",
  "הגשת אישורי מילואים": "אישור מילואים",
  "שקלול עבודות בית בציון הסופי": "אישור מילואים",
};

function StudentRequestForm() {
  const [showForm, setShowForm] = useState(false);
  const [topics, setTopics] = useState([]);
  const [courses, setCourses] = useState([]);
  const [topic, setTopic] = useState("");
  const [course, setCourse] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [requiredDocs, setRequiredDocs] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [estimatedDate, setEstimatedDate] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

 useEffect(() => {
  const fetchData = async () => {
    try {
      const topicRes = await fetch(`${API_BASE}/api/topics`);
      const topicData = await topicRes.json();
      setTopics(topicData);

      const stored = localStorage.getItem("projectFS");
      if (!stored) return alert("לא נמצא משתמש מחובר");

      const parsed = JSON.parse(stored);
      const department = parsed?.user?.department;
      if (!department) return alert("לא נמצאה מחלקת סטודנט");

      const courseRes = await fetch(`${API_BASE}/api/courses?department=${encodeURIComponent(department)}`);
      const courseData = await courseRes.json();
      setCourses(courseData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  fetchData();
}, []);


  const handleStart = () => setShowForm(true);

  const handleConfirmationSubmit = async () => {
    const stored = localStorage.getItem("projectFS");
    if (!stored) return alert("לא נמצא משתמש מחובר");

    const parsed = JSON.parse(stored);
    const studentId = parsed?.user?._id;
    if (!studentId) return alert("לא נמצא מזהה סטודנט");

    const submissionDate = new Date();
    const formData = new FormData();
    formData.append("student", studentId);
    formData.append("requestType", topic);
    formData.append("course", course);
    formData.append("description", description);
    formData.append("department", "הנדסת תוכנה");
    formData.append("status", "ממתין");
    formData.append("submissionDate", submissionDate.toISOString());

    for (let i = 0; i < files.length; i++) {
      formData.append("documents", files[i]);
    }

    try {
      const res = await fetch(`${API_BASE}/api/requests`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setTopic("");
        setCourse("");
        setDescription("");
        setFiles([]);
        setRequiredDocs("");

        const estimate = new Date(submissionDate);
        let added = 0;
        while (added < 3) {
          estimate.setDate(estimate.getDate() + 1);
          if (estimate.getDay() !== 5 && estimate.getDay() !== 6) added++;
        }

        setEstimatedDate(estimate);
        setShowModal(true);
        setShowConfirmation(false);
      } else {
        const errMsg = await res.text();
        alert("שגיאה בשליחה לשרת:\n" + errMsg);
        setShowConfirmation(false);
      }
    } catch (err) {
      alert("שגיאה בשליחה לשרת: " + err.message);
      setShowConfirmation(false);
    }
  };

  return (
    <div className="container">
      {!showForm && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button className="start-button" onClick={handleStart}>
            יצירת בקשת סטודנט
          </button>
        </div>
      )}

      {showForm && (
        <form onSubmit={(e) => e.preventDefault()} className="student-form">
          <h2 className="form-title">יצירת בקשת סטודנט</h2>

          <label htmlFor="topic" className="form-label">בחר נושא בקשה:</label>
          <select
            id="topic"
            name="topic"
            className="form-input"
            value={topic}
            onChange={(e) => {
              const val = e.target.value;
              setTopic(val);
              const selected = topics.find((t) => t._id === val);
              setRequiredDocs(requiredDocsMap[selected?.name] || "");
            }}
            required
          >
            <option disabled value="">בחר נושא...</option>
            {topics.map((t) => (
              <option key={t._id} value={t._id}>{t.name}</option>
            ))}
          </select>

          <label htmlFor="course" className="form-label">בחר קורס:</label>
          <select
            id="course"
            name="course"
            className="form-input"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            required
          >
            <option disabled value="">בחר קורס...</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>

          <label htmlFor="description" className="form-label">תוכן הבקשה:</label>
          <textarea
            id="description"
            name="description"
            className="form-input"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <label htmlFor="documents" className="form-label">צרף מסמכים:</label>
          <input
            id="documents"
            name="documents"
            className="form-input"
            type="file"
            multiple
            onChange={(e) => setFiles(e.target.files)}
          />
          {requiredDocs && (
            <p className="required-docs">יש לצרף: {requiredDocs}</p>
          )}

          <div className="buttons">
            <button
              type="button"
              className="submit-btn"
              onClick={() => setShowConfirmation(true)}
            >
              שלח בקשה
            </button>
            <button
              className="submit-btn"
              type="button"
              onClick={() => setShowForm(false)}
            >
              חזור
            </button>
          </div>
        </form>
      )}

      {showModal && (
        <RequestSentModal
          expectedDate={estimatedDate}
          onClose={() => {
            setShowModal(false);
            setShowForm(false);
          }}
        />
      )}

      {showConfirmation && (
        <div className="modal">
          <div className="modal-content">
            <p>את/ה בטוח?</p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <button
                style={{
                  backgroundColor: "#800080",
                  color: "white",
                  padding: "0.5rem 1.5rem",
                  borderRadius: "10px",
                }}
                onClick={handleConfirmationSubmit}
              >
                אישור
              </button>
              <button
                style={{
                  border: "2px solid #800080",
                  color: "#800080",
                  padding: "0.5rem 1.5rem",
                  borderRadius: "10px",
                  backgroundColor: "white",
                }}
                onClick={() => setShowConfirmation(false)}
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentRequestForm;
