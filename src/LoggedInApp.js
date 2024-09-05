import { Link, useNavigate } from "react-router-dom";
import './LoggedOutApp.css';  // Importing custom CSS for styling

const LoggedInApp = ({ handleLogout }) => {
    const navigate = useNavigate();  // Initialize useNavigate

    const handleLogoutAndNavigate = () => {
        handleLogout();               // Update login state in App.js
        navigate("/");                // Redirect to home page (Home.js)
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/logged-home" className="nav-button">Home</Link>
                <Link to="/tasks" className="nav-button">Tasks</Link>
                <Link to="/statistics" className="nav-button">Statistics</Link>
            </div>
            <div className="navbar-right">
                <button onClick={handleLogoutAndNavigate} className="nav-button">Logout</button> {/* Handle logout and navigation */}
            </div>
        </nav>
    );
};

export default LoggedInApp;
