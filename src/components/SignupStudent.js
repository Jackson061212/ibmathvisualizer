import { useState } from 'react';
import { supabase } from '../supabaseClient';
import bcrypt from 'bcryptjs';  // bcryptjs for hashing passwords
import { student_code } from '../passcodes';
import { Link, useNavigate } from "react-router-dom";  // import student code
import './SignupStudent.css';
import logo from '../images/white_logo.jpg';

const SignupStudent = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [englishName, setEnglishName] = useState('');
    const [lastName, setLastName] = useState('');
    const [group, setGroup] = useState('DP1 AA HL');  // Default group
    const [subjectTeacher, setSubjectTeacher] = useState('Mr. Vega');  // default subject teacher
    const [enteredStudentCode, setEnteredStudentCode] = useState('');  // student code input
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        // check if the entered student code matches the predefined code
        if (enteredStudentCode !== student_code) {
            alert('Invalid student code. Please try again.');
            return;
        }
        // double check password
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

        // if already exist in either, email is taken. need to change email
        if (studentData || teacherData) {
            alert('This email is already registered as a student or teacher.');
            return;
        }


        try {
            // hash the password before saving it
            // Learned from: https://blog.logrocket.com/password-hashing-node-js-bcrypt/
            const hashedPassword = await bcrypt.hash(password, 10);

            // insert the student into the 'students' table w/ hashed password
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
                navigate('/ibmathvisualizer/login');
            }
        } catch (err) {
            console.error('Error hashing password:', err);
        }
    };

    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={handleSignup}>
                {/* WHENEVER presses Signup for Signup-form, handleSignup is called */}
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
                <Link to="/ibmathvisualizer/login" className="login-link">Already have an account? Login</Link>
            </form>
        </div>
    );
};

export default SignupStudent;
