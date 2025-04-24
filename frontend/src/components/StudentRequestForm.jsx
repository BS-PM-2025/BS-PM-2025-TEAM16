//most recent
import React, { useEffect, useState } from 'react';
import './StudentRequestForm.css';

const API_BASE = "http://localhost:3006";

const requiredDocsMap = {
  "בקשה למועד מיוחד": "אישור מחלה / אישור מילואים",
  "דחיית הגשת עבודה": "אישור מחלה / אישור מילואים",
  "בקשה למטלה חלופית חרבות הברזל": "אישור מילואים",
  "הגשת אישורי מילואים": "אישור מילואים",
  "שקלול עבודות בית בציון הסופי": "אישור מילואים"
};

function StudentRequestForm() {
  const [showForm, setShowForm] = useState(false);
  const [topics, setTopics] = useState([]);
  const [courses, setCourses] = useState([]);
  const [topic, setTopic] = useState('');
  const [course, setCourse] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [requiredDocs, setRequiredDocs] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const topicRes = await fetch(`${API_BASE}/api/topics`);
        const topicData = await topicRes.json();
        setTopics(topicData);

        const courseRes = await fetch(`${API_BASE}/api/courses`);
        const courseData = await courseRes.json();
        setCourses(courseData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const stored = localStorage.getItem("projectFS");
    if (!stored) return alert("לא נמצא משתמש מחובר");

    const parsed = JSON.parse(stored);
    const studentId = parsed?.user?._id;
    if (!studentId) return alert("לא נמצא מזהה סטודנט");

    const formData = new FormData();
    formData.append('student', studentId);
    formData.append('staff', "67f3aee34bd129058942df9c"); // ID קבוע
    formData.append('requestType', topic);
    formData.append('course', course);
    formData.append('description', description);
    formData.append('department', "הנדסת תוכנה");
    formData.append('status', "ממתין");
    formData.append('submissionDate', new Date().toISOString());

    for (let i = 0; i < files.length; i++) {
      formData.append('documents', files[i]);
    }

    try {
      const res = await fetch(`${API_BASE}/api/requests`, {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        setSuccess(true);
        setTopic('');
        setCourse('');
        setDescription('');
        setFiles([]);
        setRequiredDocs('');
      } else {
        const errMsg = await res.text();
        alert("שגיאה בשליחה לשרת:\n" + errMsg);
      }
    } catch (err) {
      alert("שגיאה בשליחה לשרת: " + err.message);
    }
  };

  const handleStart = () => setShowForm(true);

  return (
    <div className="container">
      {!showForm && (
        <button className="start-button" onClick={handleStart}>יצירת בקשת סטודנט</button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="form-box">
          <h2>יצירת בקשת סטודנט</h2>

          <label>בחר נושא בקשה:</label>
          <select value={topic} onChange={(e) => {
            const val = e.target.value;
            setTopic(val);
            const selected = topics.find(t => t._id === val);
            setRequiredDocs(requiredDocsMap[selected?.name] || '');
          }} required>
            <option disabled value="">בחר נושא...</option>
            {topics.map((t) => (
              <option key={t._id} value={t._id}>{t.name}</option>
            ))}
          </select>

          <label>בחר קורס:</label>
          <select value={course} onChange={(e) => setCourse(e.target.value)} required>
            <option disabled value="">בחר קורס...</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>

          <label>תוכן הבקשה:</label>
          <textarea rows="5" value={description} onChange={(e) => setDescription(e.target.value)} required />

          <label>צרף מסמכים:</label>
          <input
            type="file"
            name="documents" 
            multiple
            onChange={(e) => setFiles(e.target.files)}
          />

          {files.length > 0 && (
            <ul>
              {Array.from(files).map((file, i) => (
                <li key={i}>{file.name}</li>
              ))}
            </ul>
          )}

          {requiredDocs && <p className="highlight">יש לצרף: {requiredDocs}</p>}

          <button className="submit-button" type="submit">שלח בקשה</button>
          {success && <p className="success">הבקשה נשלחה בהצלחה!</p>}
        </form>
      )}
    </div>
  );
}

export default StudentRequestForm;
