import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import './TeacherTasks.css'; // Ensure the CSS file is imported

const TeacherTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortType, setSortType] = useState('time'); // Default sorting by time

    useEffect(() => {
        const fetchTasks = async () => {
            const { data, error } = await supabase
                .from('tasks')
                .select('*');

            if (error) {
                console.error('Error fetching tasks:', error);
            } else {
                // Fetch teacher names for each task
                const tasksWithTeacherNames = await Promise.all(
                    data.map(async (task) => {
                        if (task.teacher_id) {
                            const { data: teacherData, error: teacherError } = await supabase
                                .from('teachers')
                                .select('name')
                                .eq('id', task.teacher_id)
                                .single();

                            if (teacherError) {
                                console.error('Error fetching teacher:', teacherError);
                                return { ...task, teacher_name: 'Unknown' }; // Default to 'Unknown' if an error occurs
                            }

                            return { ...task, teacher_name: teacherData?.name || 'Unknown' };
                        }
                        return { ...task, teacher_name: 'Unknown' }; // Default to 'Unknown' if no teacher_id
                    })
                );

                setTasks(tasksWithTeacherNames);
            }
            setLoading(false);
        };

        fetchTasks();
    }, []);

    // Sort tasks based on the selected sortType
    const sortedTasks = () => {
        if (sortType === 'time') {
            return tasks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } else if (sortType === 'questions') {
            return tasks.sort((a, b) => b.questions.length - a.questions.length);
        } else if (sortType === 'name') {
            return tasks.sort((a, b) => a.task_name.localeCompare(b.task_name));
        }
        return tasks;
    };

    const handleSortChange = (type) => {
        setSortType(type);
    };

    return (
        <div className="teacher-tasks-container">
            {/* Sorting buttons */}
            <div className="sorting-buttons">
                <button
                    className={sortType === 'time' ? 'active' : ''}
                    onClick={() => handleSortChange('time')}
                >
                    Newest
                </button>
                <button
                    className={sortType === 'questions' ? 'active' : ''}
                    onClick={() => handleSortChange('questions')}
                >
                    Sort by Questions
                </button>
                <button
                    className={sortType === 'name' ? 'active' : ''}
                    onClick={() => handleSortChange('name')}
                >
                    Sort by Name
                </button>
            </div>

            {loading ? (
                <p>Loading tasks...</p>
            ) : (
                <div className="tasks-grid">
                    {sortedTasks().map((task) => (
                        <div key={task.id} className="task-card">
                            <h3>{task.task_name}</h3>
                            <p>Teacher: {task.teacher_name}</p>
                            <p>Number of Questions: {task.questions.length}</p>
                            <p>Total Marks: {task.total_marks}</p>
                            <p>Created At: {new Date(task.created_at).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TeacherTasks;
