import { useEffect, useState } from 'react';
import supabase from './supabaseClient';

const PendingTeachers = () => {
    const [pendingTeachers, setPendingTeachers] = useState([]);

    useEffect(() => {
        const fetchPendingTeachers = async () => {
            let { data, error } = await supabase
                .from('teachers')
                .select('*')
                .eq('is_approved', false);
            if (!error) {
                setPendingTeachers(data);
            }
        };
        fetchPendingTeachers();
    }, []);

    const approveTeacher = async (id) => {
        let { error } = await supabase
            .from('teachers')
            .update({ is_approved: true })
            .eq('id', id);
        if (!error) {
            setPendingTeachers(pendingTeachers.filter(teacher => teacher.id !== id));
        }
    };

    return (
        <div>
            <h2>Pending Teachers</h2>
            {pendingTeachers.map(teacher => (
                <div key={teacher.id}>
                    <p>{teacher.full_name}</p>
                    <button onClick={() => approveTeacher(teacher.id)}>Approve</button>
                </div>
            ))}
        </div>
    );
}

export default PendingTeachers;
