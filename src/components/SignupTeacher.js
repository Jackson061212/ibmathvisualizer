import { useState } from 'react';
import { supabase } from '../supabaseClient';

const SignupTeacher = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();
        const { error } = await supabase.auth.signUp({ email: `${name}@pending.com`, password }, {
            data: { role: 'teacher', status: 'pending', name }
        });
        if (error) {
            alert(error.message);
        } else {
            alert('Your request is pending manual verification.');
        }
    };

    return (
        <div>
            <h1>Teacher Signup</h1>
            <form onSubmit={handleSignup}>
                <input type="text" placeholder="Full Name" onChange={(e) => setName(e.target.value)} />
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default SignupTeacher;
