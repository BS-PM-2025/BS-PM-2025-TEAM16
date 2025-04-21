import React, { useEffect, useState } from "react";
import Header from '../header';
import { getFromLocalStorage } from "../utils/services"
import './Welcome.css';

const Admin = () => {
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
                        <h2> ברוך הבא לאזור האישי שלך {userData.user.username}</h2>
                       
                    </>
                )}
            </div>
        </div>
        </div>
    );
};
export default Admin;
