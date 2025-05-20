//most recent
import React, { useEffect, useState } from "react";
import Header from '../header';
import { getFromLocalStorage } from '../utils/services';
import StudentRequestForm from '../components/StudentRequestForm';
import './Welcome.css';

const Student = () => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const data = getFromLocalStorage('projectFS');
        setUserData(data);
    }, []);

    return (
        <div className="welcome">
            <div className="welcome-page-container">
                <Header />
                <div className="welcome-header-box">
                    {userData && (
                        <>
                            <h2>ברוך הבא לאזור האישי שלך {userData.user.username}</h2>
                        </>
                    )}
                </div>

                {/* מציגים את הטופס כולל הכפתור שכבר יש בו */}
                <div style={{ marginTop: '30px' }}>
                    <StudentRequestForm />
                </div>
            </div>
        </div>
    );
};

export default Student;
