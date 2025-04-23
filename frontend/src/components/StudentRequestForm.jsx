// src/components/StudentRequestForm.jsx
import React, { useEffect, useState } from 'react';
import './StudentRequestForm.css';

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

  const fetchData = async () => {
    try {
      const topicRes = await fetch('http://localhost:3000/api/topics');
      const topicData = await topicRes.json();
      setTopics(topicData);

      const courseRes = await fetch('http://localhost:3000/api/courses');
      const courseData = await courseRes.json();
      setCourses(courseData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fileNames = Array.from(files).map(f => f.name);

    const data = {
      student: "123456",
      staff: "654321",
      requestType: topic,
      courseName: course,
      description,
      documents: fileNames,
      department: "הנדסת תוכנה",
      status: "ממתין",
      submissionDate: new Date(),
      staffComments: []
    };

    try {
      const res = await fetch('http://localhost:3000/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        setSuccess(true);
        setTopic('');
        setCourse('');
        setDescription('');
        setFiles([]);
        setRequiredDocs('');
      } else {
        alert("שגיאה בשליחה לשרת");
      }
    } catch (err) {
      alert("שגיאה בשליחה לשרת: " + err.message);
    }
  };

  const handleStart = () => {
    setShowForm(true);
    fetchData();
  };

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
            setRequiredDocs(requiredDocsMap[val] || '');
          }} required>
            <option disabled value="">בחר נושא...</option>
            {topics.map((t, i) => (
              <option key={i} value={t.name}>{t.name}</option>
            ))}
          </select>

          <label>בחר קורס:</label>
          <select value={course} onChange={(e) => setCourse(e.target.value)} required>
            <option disabled value="">בחר קורס...</option>
            {courses.map((c, i) => (
              <option key={i} value={c.name}>{c.name}</option>
            ))}
          </select>

          <label>תוכן הבקשה:</label>
          <textarea rows="5" value={description} onChange={(e) => setDescription(e.target.value)} required />

          <label>צרף מסמכים:</label>
          <input type="file" multiple onChange={(e) => setFiles(e.target.files)} />
          {requiredDocs && <p className="highlight"> יש לצרף: {requiredDocs}</p>}

          <button className="submit-button" type="submit">שלח בקשה</button>
          {success && <p className="success"> הבקשה נשלחה בהצלחה!</p>}
        </form>
      )}
    </div>
  );
}

export default StudentRequestForm;
