import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';  // Import bcrypt for hashing
import {teacher_code} from '../passcodes.js'

const TeacherRegistration = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [teacherCode, setTeacherCode] = useState(''); // Assuming you have a teacher code system
    const navigate = useNavigate();

    // Predefined teacher code (you can store this in a secure file or env variable)
    const validTeacherCode = 'your_predefined_teacher_code';  // Define your teacher code here

    const handleTeacherRegistration = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        if (teacherCode !== teacher_code) {
            alert('Invalid teacher code.');
            return;
        }

        try {
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with bcrypt

            // Insert teacher data into the 'teachers' table with hashed password
            const { data, error } = await supabase
                .from('teachers')
                .insert([
                    {
                        email: email,
                        password: hashedPassword,  // Store the hashed password
                        // Add other teacher details as needed
                    },
                ]);

            if (error) {
                alert('Registration failed: ' + error.message);
                return;
            }

            alert('Registration successful! You can now log in.');
            navigate('/ibmathvisualizer/login');  // Redirect to login page after successful registration
        } catch (err) {
            console.error('Error during registration:', err);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div>
            <h1>Teacher Registration</h1>
            <form onSubmit={handleTeacherRegistration}>
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
                <button type="submit">Register</button>
            </form>
            <Link to="/ibmathvisualizer/login">Already have an account? Login</Link>
        </div>
    );
};

export default TeacherRegistration;
