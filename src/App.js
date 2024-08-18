import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./components/Login";
import RoleSelection from "./components/RoleSelection";
import SignupStudent from "./components/SignupStudent";
import SignupTeacher from "./components/SignupTeacher";
import Home from "./pages/Home";

function App() {
    return (
        <BrowserRouter>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/login">Login</Link>
            </nav>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/role-selection" element={<RoleSelection />} />
                <Route path="/signup-student" element={<SignupStudent />} />
                <Route path="/signup-teacher" element={<SignupTeacher />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
