import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';
import { teacher_code } from '../passcodes';
import './SignupTeacher.css';
import logo from "../images/white_logo.jpg";

const SignupTeacher = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [teacherCode, setTeacherCode] = useState('');
    const navigate = useNavigate();

    // SAME LOGIC AS SignupStudent
    const handleTeacherRegistration = async (e) => {
        e.preventDefault();

        if (teacherCode !== teacher_code) {
            alert('Invalid teacher code. Please try again.');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        // check if the email exists in either 'students' or 'teachers' tables
        const { data: studentData, error: studentError } = await supabase
            .from('students')
            .select('email')
            .eq('email', email)
            .single();

        const { data: teacherData, error: teacherError } = await supabase
            .from('teachers')
            .select('email')
            .eq('email', email)
            .single();

        if (studentData || teacherData) {
            alert('This email is already registered as a student or teacher.');
            return;
        }

        try {
            // SAME AS SIGNUP STUDENT
            // Learned from: https://blog.logrocket.com/password-hashing-node-js-bcrypt/
            const hashedPassword = await bcrypt.hash(password, 10); // hash the password

            const { data, error } = await supabase
                .from('teachers')
                .insert([
                    {
                        email: email,
                        password: hashedPassword,
                        name: name
                    },
                ]);

            if (error) {
                alert('Registration failed: ' + error.message);
                return;
            }

            alert('Registration successful! You can now log in.');
            navigate('/ibmathvisualizer/login');  // redirect to login page after successful registration
        } catch (err) {
            console.error('Error during registration:', err);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={handleTeacherRegistration}>
                {/*TODO in consistent naming handleTeacherRegistration and handleSignup*/}
                <img src={logo} alt="IB Math Visualizer Logo" className="logo" />
                <h2>Teacher Registration</h2>
                <input
                    type="email"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Teacher's Name"
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Teacher Code"
                    onChange={(e) => setTeacherCode(e.target.value)}
                    required
                />
                <button type="submit" className="signup-btn">Register</button>
            </form>
            <Link to="/ibmathvisualizer/login" className="login-link">Already have an account? Login</Link>
        </div>
    );
};

export default SignupTeacher;
