import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';  // Import bcrypt for password comparison
import './Login.css'; // Custom CSS file for styling
import logo from '../images/white_logo.jpg'; // Path to the logo image


const Login = ({ onLogin }) => {  // Accept onLogin prop from App.js
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // Check for verification token in the URL
    useEffect(() => {
        const checkForVerificationToken = async () => {
            const url = new URL(window.location.href);
            const access_token = url.searchParams.get('access_token');

            if (access_token) {
                const { error } = await supabase.auth.verifyOtp({
                    token: access_token,
                    type: 'email',
                });

                if (error) {
                    alert('Email verification failed: ' + error.message);
                } else {
                    alert('Email verified successfully!');
                    navigate('/ibmathvisualizer');  // Redirect to home or dashboard after verification
                }
            }
        };

        checkForVerificationToken();
    }, [navigate]);

    // Custom login function using bcrypt password verification
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            // Fetch the student's hashed password from the 'students' table based on email
            const { data, error } = await supabase
                .from('students')
                .select('password')  // Select the password column
                .eq('email', email)
                .single();  // Get a single result (unique user)

            if (error) {
                alert('Invalid login credentials.');
                return;
            }

            // Verify the entered password against the hashed password from the database
            const passwordMatch = await bcrypt.compare(password, data.password);

            if (passwordMatch) {
                alert('Login successful!');
                onLogin();  // Call onLogin to change the app state to logged in
                navigate('/ibmathvisualizer/logged-home'); // Redirect to the logged-in home page
            } else {
                alert('Invalid login credentials.');
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
                    <input
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
