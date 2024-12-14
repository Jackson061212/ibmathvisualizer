import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./components/Login";
import Home from "./pages/Home";
import './LoggedOutApp.css';

const LoggedOutApp = ({ onLogin }) => {   /* accept handleLogin as onLogin from App.js */
    return (
        <>
            <nav className="navbar">
                <div className="navbar-left">  {/* left align */}
                    <Link to="/ibmathvisualizer" className="nav-button">Home</Link>
                </div>
                <div className="navbar-right">
                    <Link to="/ibmathvisualizer/login" className="nav-button">Login/Register</Link>
                </div>
            </nav>

            <Routes>
                {/* pass onLogin to the Login component */}
                <Route path="/ibmathvisualizer/login" element={<Login onLogin={onLogin} />} />
            </Routes>
        </>
    );
};
export default LoggedOutApp;
