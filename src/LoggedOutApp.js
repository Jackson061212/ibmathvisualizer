import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./components/Login";
import Home from "./pages/Home";
import './LoggedOutApp.css';  // Importing custom CSS for styling

const LoggedOutApp = ({ onLogin }) => {
    return (
        <>
            <nav className="navbar">
                <div className="navbar-left">
                    <Link to="/ibmathvisualizer" className="nav-button">Home</Link> {/* Styled as a button */}
                </div>
                <div className="navbar-right">
                    <Link to="/ibmathvisualizer/login" className="nav-button">Login/Register</Link> {/* Styled as a button */}
                </div>
            </nav>

            <Routes>
                {/* Pass onLogin to the Login component */}
                <Route path="/ibmathvisualizer/login" element={<Login onLogin={onLogin} />} />
            </Routes>
        </>
    );
};

export default LoggedOutApp;
