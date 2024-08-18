import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link, useNavigate } from 'react-router-dom';

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

    const handleLogin = async (e) => {
        e.preventDefault();
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            alert(error.message);
        } else {
            alert('Login successful!');
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Login</button>
            </form>
            <Link to="/role-selection">Do not have an account? Signup</Link>
        </div>
    );
};

export default Login;
