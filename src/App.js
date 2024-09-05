import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import LoggedInApp from "./LoggedInApp"; // For logged-in users
import LoggedOutApp from "./LoggedOutApp"; // For logged-out users
import Home from "./pages/Home";
import Login from "./components/Login";
import RoleSelection from "./components/RoleSelection";
import SignupStudent from "./components/SignupStudent";
import SignupTeacher from "./components/SignupTeacher";
import LoggedHome from "./pages/LoggedHome";


function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = () => setIsLoggedIn(true);
    const handleLogout = () => setIsLoggedIn(false);

    return (
        <BrowserRouter>
            <>
                {isLoggedIn ? (
                    <LoggedInApp handleLogout={handleLogout} />
                ) : (
                    <>
                        <LoggedOutApp onLogin={handleLogin} />
                    </>
                )}
            </>

            <Routes>
                <Route path="/" element={<Home />} />
                {/*<Route path="/login" element={<Login />} />*/}
                <Route path="/role-selection" element={<RoleSelection />} />
                <Route path="/signup-student" element={<SignupStudent />} />
                <Route path="/signup-teacher" element={<SignupTeacher />} />
                <Route path="/logged-home" element={<LoggedHome />} />
            </Routes>

        </BrowserRouter>
    );
}

export default App;