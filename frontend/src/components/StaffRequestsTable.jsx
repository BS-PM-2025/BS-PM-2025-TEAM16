import React from "react";

const StaffRequestsTable = ({ requests, setSelectedRequest, position }) => {
  return (
    <table border="1" className="requests-table">
      <thead>
        <tr>
          <th>שם הסטודנט</th>
          <th>ת.ז</th>
          <th>נושא הבקשה</th>
          <th>קורס</th>
          {position === "secretary" && <th>מרצה אחראי</th>}
          <th>סטטוס</th>
          <th>הערת סגל</th>
          <th>תאריך הגשה</th>
        </tr>
      </thead>
      <tbody>
        {requests.length === 0 ? (
          <tr>
            <td colSpan={position === "secretary" ? "8" : "7"}>
              לא קיימות בקשות
            </td>
          </tr>
        ) : (
          requests.map((req) =>
            req.student && req.staff ? (
              <tr
                key={req._id}
                onClick={() => setSelectedRequest(req)}
                style={{ cursor: "pointer" }}
              >
                <td>
                  {req.student.firstname} {req.student.lastname}
                </td>
                <td>{req.student.id}</td>
                <td>{req.requestType?.name || "—"}</td>
                <td>{req.course?.name || "—"}</td>
                {position === "secretary" && (
                  <td>
                    {req.staff?.firstname} {req.staff?.lastname}
                  </td>
                )}
                <td className={req.status}>{req.status}</td>
                <td>
                  {req.staffComments.length > 0
                    ? req.staffComments[req.staffComments.length - 1].comment
                    : "-"}
                </td>
                <td>{new Date(req.submissionDate).toLocaleDateString()}</td>
              </tr>
            ) : null
          )
        )}
      </tbody>
    </table>
  );
};
export default StaffRequestsTable;
