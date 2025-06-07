import React, { useEffect, useState } from "react";
import "./ChatBotBox.css";

export default function ChatBotBox() {
  const [questions, setQuestions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [answer, setAnswer] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3006/api/chatbot/questions")
      .then((res) => res.json())
      .then(setQuestions)
      .catch((err) => console.error("Error fetching questions", err));
  }, []);

  const ask = (question) => {
    setSelected(question);
    fetch("http://localhost:3006/api/chatbot/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    })
      .then((res) => res.json())
      .then((data) => setAnswer(data.answer))
      .catch((err) => console.error("Error fetching answer", err));
  };

  return (
    <>
      <button className="chatbot-open-button" onClick={() => setOpen(!open)}>
        <img src="/chatboticon.png" alt="ChatBot" className="chatbot-icon" />
      </button>
      {open && (
        <div className="chatbot-box">
          <div className="chatbot-header">
            <span>בחר שאלה</span>
            <button onClick={() => setOpen(false)}>X</button>
          </div>

          {!selected && (
            <ul className="chatbot-question-list">
              {questions.map((q, i) => (
                <li key={i}>
                  <button onClick={() => ask(q.question)}>{q.question}</button>
                </li>
              ))}
            </ul>
          )}

          {selected && (
            <div className="messages-container">
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  direction: "rtl",
                }}
              >
                <div className="user question">{selected}</div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  direction: "rtl",
                }}
              >
                <div className="chatbot answer">{answer}</div>
              </div>
              <button
                onClick={() => {
                  setSelected(null);
                  setAnswer("");
                }}
              >
                שאלה נוספת
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
