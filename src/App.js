import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import TeacherLoggedInApp from "./TeacherLoggedInApp";
import StudentLoggedInApp from "./StudentLoggedInApp";
import LoggedOutApp from "./LoggedOutApp";
import Home from "./pages/Home";
import Login from "./components/Login";
import RoleSelection from "./components/RoleSelection";
import SignupStudent from "./components/SignupStudent";
import SignupTeacher from "./components/SignupTeacher";
import StudentLoggedHome from "./pages/student/StudentLoggedHome";
import TeacherLoggedHome from "./pages/teacher/TeacherLoggedHome";
import TeacherTasks from "./pages/teacher/TeacherTasks";
import StudentTasks from "./pages/student/StudentTasks";
import TeacherStatistics from "./pages/teacher/TeacherStatistics"
import StudentStatistics from "./pages/student/StudentStatistics"

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null); // hold user role ('teacher' or 'student')
    const [userId, setUserId] = useState(null); // hold user id

    // Simulate login process
    const handleLogin = (role, id) => {
        console.log('handle login', role, id)
        setIsLoggedIn(true);
        setUserRole(role);                  // set login user role to variable
        console.log('setId', role, id)
        setUserId(id);

    };
    useEffect(() => {
        console.log('userId updated:', userId);
    }, [userId]);

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserRole(null); // Clear user role on logout
        setUserId(null); // Clear user ID on logout
    };

    useEffect(() => {
        // ex: check if user is already logged in and fetch the user info (could be from localStorage, session, or API)
        const userData = localStorage.getItem("userData");
        console.log('localStroage', userData)
        if (userData) {
            const parsedData = JSON.parse(userData);
            setIsLoggedIn(true);
            setUserRole(parsedData.role);
            setUserId(parsedData.id);
        }
    }, []);         // dependency means useEffect called whenever dependency changes
                            // no dep mean only called once when program runs
    console.log('App.js', userId)

    return (
        <BrowserRouter>
            <>
                {/*Menu Bar Rendering (based on application status, not url)*/}
                {/*Is prioritized over url path rendering (appears on top ALWAYS)*/}
                {isLoggedIn ? (
                    // Conditionally render based on the user role
                    // html component can use the variables in js component
                    userRole === 'students' ? (
                        <StudentLoggedInApp handleLogout={handleLogout} userId={userId} /> // Render Student interface
                    ) : (
                        <TeacherLoggedInApp handleLogout={handleLogout} userId={userId} /> // Render Teacher interface
                    )
                ) : (
                    <LoggedOutApp onLogin={handleLogin} />
                )}
            </>

            {/*ALL ROUTES for IB Math Visualizer, url path rendering*/}
            <Routes>
                <Route path="/ibmathvisualizer" element={<Home />} />
                <Route path="/ibmathvisualizer/role-selection" element={<RoleSelection />} />
                <Route path="/ibmathvisualizer/signup-student" element={<SignupStudent />} />
                <Route path="/ibmathvisualizer/signup-teacher" element={<SignupTeacher />} />
                <Route path="/ibmathvisualizer/student-logged-home" element={<StudentLoggedHome userId={userId} />} />
                <Route path="/ibmathvisualizer/teacher-logged-home" element={<TeacherLoggedHome userId={userId} />} />
                <Route path="/ibmathvisualizer/teacher-tasks" element={<TeacherTasks userId={userId} />} />
                <Route path="/ibmathvisualizer/student-tasks" element={<StudentTasks userId={userId} />} />
                <Route path="/ibmathvisualizer/teacher-statistics" element={<TeacherStatistics />} />
                <Route path="/ibmathvisualizer/student-statistics" element={<StudentStatistics studentId={{userId}}/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
