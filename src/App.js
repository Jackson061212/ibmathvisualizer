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
                <Route path="/ibmathvisualizer" element={<Home />} />
                {/*<Route path="/login" element={<Login />} />*/}
                <Route path="/ibmathvisualizer/role-selection" element={<RoleSelection />} />
                <Route path="/ibmathvisualizer/signup-student" element={<SignupStudent />} />
                <Route path="/ibmathvisualizer/signup-teacher" element={<SignupTeacher />} />
                <Route path="/ibmathvisualizer/logged-home" element={<LoggedHome />} />
            </Routes>

        </BrowserRouter>
    );
}

export default App;