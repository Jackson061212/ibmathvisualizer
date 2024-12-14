import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import '../teacher/TeacherStatistics.css';

const StudentStatistics = ({ studentId }) => {
    console.log("STATISTICS", studentId.userId);
    const [submissions, setSubmissions] = useState([]);

    useEffect(() => {
        const fetchSubmissions = async () => {
            // fetch task completions correlated with THIS Student ID
            const { data, error } = await supabase
                .from('task_completions')
                // tasks(task_name) uses the Foreign Key 'task_id' in 'task_completions'
                .select('task_id, student_id, scores, tasks(task_name), total_marks_scored, total_marks, percentage_accuracy')
                .eq('student_id', studentId.userId);

            if (error) {
                console.error('Error fetching submissions:', error);
            } else {
                setSubmissions(data);
                console.log('SUBMISSION', data);
            }
        };
        fetchSubmissions();
    }, [studentId]);

    return (
        <div className="student-statistics-container">
            <div className="table-responsive">
                <h2>Submission Records</h2>
                <table className="student-table">
                    <thead>
                    <tr>
                        <th className="index-cell">#</th>
                        <th>Task Name</th>
                        <th>Student ID</th>
                        <th>Score</th>
                        <th>Total Marks</th>
                        <th>Accuracy</th>
                    </tr>
                    </thead>
                    <tbody>
                    {submissions.map((submission, index) => (
                        <tr key={submission.task_id}>
                            <td className="index-cell">{index + 1}</td>
                            <td>{submission.tasks?.task_name || 'N/A'}</td> {/* Fetch task name */}
                            <td>{submission.student_id}</td>
                            {/*<td>{submission.scores}</td>*/}
                            <td>{submission.total_marks_scored || 'N/A'}</td>
                            <td>{submission.total_marks || 'N/A'}</td>
                            {/* to 2 decimal IF it is NOT Null. otherwise might error*/}
                            <td>{submission.percentage_accuracy ? submission.percentage_accuracy.toFixed(2) : 'N/A'}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentStatistics;
