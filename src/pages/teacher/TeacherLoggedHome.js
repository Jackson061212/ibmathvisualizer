import React, { useState } from "react";
import TeacherLoggedHome_CreateNewTask from "./TeacherLoggedHome_CreateNewTask"; // Import the new component
import './TeacherLoggedHome.css';

const TeacherLoggedHome = ({ userId }) => {
    const [isPopupOpen, setPopupOpen] = useState(false);

    const openPopup = () => {
        setPopupOpen(true);
    };

    const closePopup = () => {
        setPopupOpen(false);
    };

    return (
        <div>
            <h1>Welcome Back!</h1>
            <p>This is the logged-in homepage for TEACHERS</p>
            <button onClick={openPopup}>Create Task</button>

            {/* Pass userId directly to the CreateNewTask component */}
            <TeacherLoggedHome_CreateNewTask
                isOpen={isPopupOpen}
                onClose={closePopup}
                teacherId={userId}
            />
        </div>
    );
}

export default TeacherLoggedHome;
