import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import './LoggedOutApp.css';

const TeacherLoggedInApp = ({ handleLogout }) => {
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);

    // handle actual logout after confirmation
    const handleLogoutAndNavigate = () => {
        handleLogout();               // update login state in App.js
        navigate("/ibmathvisualizer");
    };
    const showLogoutPopup = () => {
        setShowPopup(true);
    };
    const hideLogoutPopup = () => {
        setShowPopup(false);
    };

    return (
        <>
            <nav className="navbar">
                {/*<h3>TEACHERS</h3>*/}
                <div className="navbar-left">
                    <Link to="/ibmathvisualizer/teacher-logged-home" className="nav-button">Home</Link>
                    <Link to="/ibmathvisualizer/teacher-tasks" className="nav-button">Tasks</Link>
                    <Link to="/ibmathvisualizer/teacher-statistics" className="nav-button">Statistics</Link>
                </div>
                <div className="navbar-right">
                    <button onClick={showLogoutPopup} className="nav-button">Logout</button>
                </div>
            </nav>

            {/* popup for logout confirmation */}
            {showPopup && (
                <div className="popup-container">
                    <div className="popup">
                        <h2>Are you sure you want to logout?</h2>
                        <div className="popup-actions">
                            <button className="popup-logout-button" onClick={handleLogoutAndNavigate}>
                                Logout
                            </button>
                            <button className="popup-cancel-button" onClick={hideLogoutPopup}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TeacherLoggedInApp;
