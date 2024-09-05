import { useState } from 'react';
import { supabase } from '../supabaseClient';
import bcrypt from 'bcryptjs';  // Import bcryptjs for hashing passwords
import { student_code } from '../passcodes';
import { Link, useNavigate } from "react-router-dom";  // Import the student code
import './SignupStudent.css'; // Add custom CSS file for styling
import logo from '../images/white_logo.jpg'; // Path to the logo image

const SignupStudent = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [englishName, setEnglishName] = useState('');
    const [lastName, setLastName] = useState('');
    const [group, setGroup] = useState('DP1 AA HL');  // Default group
    const [subjectTeacher, setSubjectTeacher] = useState('Mr. Vega');  // Default subject teacher
    const [enteredStudentCode, setEnteredStudentCode] = useState('');  // Student code input
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        // Check if the entered student code matches the predefined code
        if (enteredStudentCode !== student_code) {
            alert('Invalid student code. Please try again.');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        try {
            // Hash the password before saving it
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert the student into the 'students' table with the hashed password
            const { data, error } = await supabase
                .from('students')
                .insert([
                    {
                        email,
                        password: hashedPassword,
                        group,
                        subject_teacher: subjectTeacher,
                        english_name: englishName,
                        last_name: lastName,
                    },
                ]);

            if (error) {
                alert(error.message);
            } else {
                alert('Registration successful.');
                navigate('/login');
            }
        } catch (err) {
            console.error('Error hashing password:', err);
        }
    };

    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={handleSignup}>
                <img src={logo} alt="IB Math Visualizer Logo" className="logo" />
                <h2>Student Signup</h2>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Student Code"
                        onChange={(e) => setEnteredStudentCode(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="English Name"
                        onChange={(e) => setEnglishName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Last Name (Pinyin)"
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </div>
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
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <label>
                    Choose Group:
                    <select value={group} onChange={(e) => setGroup(e.target.value)}>
                        <option value="Pre-IB">Pre-IB</option>
                        <option value="DP1 AA HL">DP1 AA HL</option>
                        <option value="DP1 AI HL">DP1 AI HL</option>
                        <option value="DP1 AI SL">DP1 AI SL</option>
                        <option value="DP2 AA HL">DP2 AA HL</option>
                        <option value="DP2 AI HL">DP2 AI HL</option>
                        <option value="DP2 AI SL">DP2 AI SL</option>
                    </select>
                </label>
                <label>
                    Choose Subject Teacher:
                    <select value={subjectTeacher} onChange={(e) => setSubjectTeacher(e.target.value)}>
                        <option value="Mr. Stephen">Mr. Stephen</option>
                        <option value="Mr. Vega">Mr. Vega</option>
                        <option value="Mr. Orozco">Mr. Orozco</option>
                    </select>
                </label>
                <button type="submit" className="signup-btn">Sign Up</button>
                <Link to="/login" className="login-link">Already have an account? Login</Link>
            </form>
        </div>
    );
};

export default SignupStudent;
