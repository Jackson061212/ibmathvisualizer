import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import './LoggedOutApp.css';

// useState - react hook to create functions and variables
// useNavigate - react Router hook to navigate to different routes in the app

const StudentLoggedInApp = ({ handleLogout }) => {
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);

    const handleLogoutAndNavigate = () => {
        handleLogout();
        navigate("/ibmathvisualizer");  // redirect to home page
    };
    // show popup
    const showLogoutPopup = () => {
        setShowPopup(true);
    };
    // hide popup
    const hideLogoutPopup = () => {
        setShowPopup(false);
    };

    return (
        <>
            <nav className="navbar">
                {/*<h3>STUDENTS</h3>*/}
                <div className="navbar-left">
                    <Link to="/ibmathvisualizer/student-logged-home" className="nav-button">Home</Link>
                    <Link to="/ibmathvisualizer/student-tasks" className="nav-button">Tasks</Link>
                    <Link to="/ibmathvisualizer/statistics" className="nav-button">Statistics</Link>
                </div>
                <div className="navbar-right">
                    <button onClick={showLogoutPopup} className="nav-button">Logout</button>  {/* show confirmation popup */}
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

export default StudentLoggedInApp;
