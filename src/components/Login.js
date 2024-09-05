import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';  // Import bcrypt for password comparison

const Login = () => {
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
                    navigate('/');  // Redirect to home or dashboard after verification
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
                // Redirect or proceed to the next step (e.g., navigate to a dashboard)
                navigate('/dashboard');
            } else {
                alert('Invalid login credentials.');
            }
        } catch (err) {
            console.error('Error during login:', err);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            <Link to="/role-selection">Do not have an account? Signup</Link>
        </div>
    );
};

export default Login;
