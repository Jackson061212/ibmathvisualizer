import { useState } from 'react';
import { supabase } from '../supabaseClient';

const SignupStudent = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [group, setGroup] = useState('DP1 AA HL'); // default group
    const [subjectTeacher, setSubjectTeacher] = useState('Mr. Vega'); // default subject teacher

    const handleSignup = async (e) => {
        e.preventDefault();
        const { error } = await supabase.auth.signUp(
            { email, password },
            {
                data: { role: 'student', name, group, subject_teacher: subjectTeacher },
            }
        );
        if (error) {
            alert(error.message);
        } else {
            alert('Check your email for verification.');
        }
    };

    return (
        <div>
            <h1>Student Signup</h1>
            <form onSubmit={handleSignup}>
                <input
                    type="text"
                    placeholder="English Name"
                    onChange={(e) => setName(e.target.value)}
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
                        <option value="DP1 AA HL">DP1 AA HL</option>
                        <option value="DP1 AI HL">DP1 AI HL</option>
                        <option value="DP1 AI SL">DP1 AI SL</option>
                        <option value="DP2 AA HL">DP2 AA HL</option>
                        <option value="DP2 AI HL">DP2 AI HL</option>
                        <option value="DP2 AI SL">DP2 AI SL</option>
                    </select>
                </label>
                <label>
                    Subject Teacher:
                    <select value={subjectTeacher} onChange={(e) => setSubjectTeacher(e.target.value)}>
                        <option value="Mr. Vega">Mr. Vega</option>
                        <option value="Mr. Orozco">Mr. Orozco</option>
                        <option value="Mr. Stephen">Mr. Stephen</option>
                    </select>
                </label>
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default SignupStudent;
