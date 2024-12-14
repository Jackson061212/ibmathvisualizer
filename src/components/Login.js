import { useState, useEffect } from 'react';  // define variable and functions
import { supabase } from '../supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';  // import bcrypt for password comparison
import './Login.css'; // link to css
import logo from '../images/white_logo.jpg'; // path to logo image

const Login = ({ onLogin }) => {  // onLogin function App.js-->LoggedOutApp.js-->Login.js
    const [email, setEmail] = useState('');   // way of defining varaibles in js
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // CODE BY SUPABASE DOCUMENTATION: check for verification token in the URL
    // IN CASE OF USING EMAIL-AUTH, use this code
    // useEffect(() => {
    //     const checkForVerificationToken = async () => {
    //         const url = new URL(window.location.href);
    //         const access_token = url.searchParams.get('access_token');
    //
    //         if (access_token) {
    //             const { error } = await supabase.auth.verifyOtp({
    //                 token: access_token,
    //                 type: 'email',
    //             });
    //
    //             if (error) {
    //                 alert('Email verification failed: ' + error.message);
    //             } else {
    //                 alert('Email verified successfully!');
    //                 navigate('/ibmathvisualizer');  // redirect to home or dashboard after verification
    //             }
    //         }
    //     };
    //
    //     checkForVerificationToken();
    // }, [navigate]);

    // CUSTOM LOGIN SYSTEM: if user in 'students' table in supabase, login as student
    //                      if user in 'teachers' table in supabase, login as teacheer
    const handleLogin = async (e) => {
        // Default submission behavior (clicking submit button) is REFRESH ENTIRE PAGE
        // But I want no page-reloads (that will logout user) so preventDefault()
        e.preventDefault();

        try {
            let userData = null;
            let table = null;

            // check if the email exists in the 'students' table
            // TYPICAL 'SELECT' METHOD PROVIDED BY SUPABASE API
            const { data: studentData, error: studentError } = await supabase
                .from('students')
                .select('*')
                .eq('email', email)
                .single();   // in case multiple (which shouldnrt happen)

            if (studentData) {
                userData = studentData;
                table = 'students';
            } else if (studentError) {
                // if no student was found, check the 'teachers' table
                const { data: teacherData, error: teacherError } = await supabase
                    .from('teachers')
                    .select('*')
                    .eq('email', email)
                    .single();

                if (teacherData) {
                    userData = teacherData;
                    table = 'teachers';
                } else if (teacherError) {
                    // if no match in either table
                    alert('Invalid login credentials.');
                    return;
                }
            }
            console.log('USERDATA ', userData, table)

            // verify the password against the hashed password from the database
            // Bcrypt was recommended by ChatGPT
            // Learned bcrypt.compare from: https://dev.to/mbugua70/how-to-use-bcrypt-for-password-hashing-in-nodejs-1l7e
            if (userData) {
                const passwordMatch = await bcrypt.compare(password, userData.password);

                if (passwordMatch) {
                    alert('Login successful!');
                    const userId = userData.id; // get user id
                    // console.log('HELLOOOOOOO ', userId)
                    onLogin(table, userId); // pass role & id ('student' or 'teacher')
                    // console.log('login onlogin', userId)

                    if (table === 'students') {
                        navigate('/ibmathvisualizer/student-logged-home');  // redirect to logged-in home for students
                    } else {
                        navigate('/ibmathvisualizer/teacher-logged-home');  // for teachers
                    }
                } else {
                    alert('Invalid login credentials.');
                }
            }
        } catch (err) {
            console.error('Error during login:', err);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <img src={logo} alt="IB Math Visualizer Logo" className="logo" />
                <h2>Login</h2>
                <div className="form-group">
                    <input       // input field, onChange() dynamically updates email variable
                        type="email"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="login-btn">Login</button>
                <Link to="/ibmathvisualizer/role-selection" className="signup-link">Do not have an account? Signup</Link>
            </form>
        </div>
    );
};

export default Login;
