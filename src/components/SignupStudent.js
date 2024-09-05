import { useState } from 'react';
import { supabase } from '../supabaseClient';
import bcrypt from 'bcryptjs';  // Import bcryptjs for hashing passwords
import { student_code } from '../passcodes';  // Import the student code

const SignupStudent = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [englishName, setEnglishName] = useState('');
    const [lastName, setLastName] = useState('');
    const [group, setGroup] = useState('DP1 AA HL');  // Default group
    const [subjectTeacher, setSubjectTeacher] = useState('Mr. Vega');  // Default subject teacher
    const [enteredStudentCode, setEnteredStudentCode] = useState('');  // Student code input

    const handleSignup = async (e) => {
        e.preventDefault();

        // Check if the entered student code matches the predefined code
        if (enteredStudentCode !== student_code) {
            alert('Invalid student code. Please try again.');
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
                // You can redirect the user to the login page or a dashboard after registration
            }
        } catch (err) {
            console.error('Error hashing password:', err);
        }
    };

    return (
        <div>
            <h1>Student Signup</h1>
            <form onSubmit={handleSignup}>
                <input
                    type="text"
                    placeholder="Student Code"
                    onChange={(e) => setEnteredStudentCode(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="English Name"
                    onChange={(e) => setEnglishName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Last Name (Pinyin)"
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
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
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default SignupStudent;
