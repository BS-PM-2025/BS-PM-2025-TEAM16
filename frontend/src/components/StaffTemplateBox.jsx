import React, { useEffect, useRef } from "react";
import CreateTemplate from "./CreateTemplate";

const StaffTemplateBox = ({ showTemplateBox, setShowTemplateBox }) => {
  const boxTemplateRef = useRef(null);
  useEffect(() => {
    if (showTemplateBox && boxTemplateRef.current) {
      boxTemplateRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [showTemplateBox]);
  return (
    <div className="templates-box" ref={boxTemplateRef}>
      <h3
        className="templates-title"
        style={{ cursor: "pointer" }}
        onClick={() => setShowTemplateBox((prev) => !prev)}
      >
        {showTemplateBox ? (
          <>
            <button className="reject-button">-</button>{" "}
            {"סגור תיבת הוספת תבנית"}
          </>
        ) : (
          <>
            <button className="approve-button">+</button>{" "}
            {"הוספת תבנית תשובה חדשה"}
          </>
        )}
      </h3>

      {showTemplateBox && (
        <div className="template-form-wrapper">
          <CreateTemplate />
        </div>
      )}
    </div>
  );
};

export default StaffTemplateBox;
