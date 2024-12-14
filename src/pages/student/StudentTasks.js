import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import '../teacher/TeacherTasks.css';
import StudentTask_CompleteNewTask from './StudentTasks_CompleteNewTask';
import StudentTasks_VisualFeedback from './StudentTasks_VisualFeedback';

const StudentTasks = ({ userId }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortType, setSortType] = useState('time'); // Default sorting by time
    const [selectedTask, setSelectedTask] = useState(null); // State for selected task for popup
    const [completedTasks, setCompletedTasks] = useState([]); // Store completed task IDs
    const [showResultsPopup, setShowResultsPopup] = useState(false);
    const [submissionData, setSubmissionData] = useState([]);
    const [selectedTaskVisual, setSelectedVisual] = useState(null); // selected completed task to open visual

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                // GET all tasks
                const { data: tasks, error: tasksError } = await supabase.from('tasks').select('*');
                if (tasksError) throw new Error(`Error fetching tasks: ${tasksError.message}`);

                // USING 'teacher_id' from 'tasks' table to GET CORRESPONDING
                // 'teacher_name' from 'teachers' table
                const tasksWithTeacherNames = await Promise.all(
                    tasks.map(async (task) => {
                        const { data: teacherData, error: teacherError } = await supabase
                            .from('teachers')
                            .select('name')
                            .eq('id', task.teacher_id)
                            .single();

                        if (teacherError) {
                            throw new Error(`Error fetching teacher for task ${task.id}: ${teacherError.message}`);
                        }
                        // creating a shalow copy of 'task' while ADDING 'teacher_name'
                        // '...' is the SPREAD OPERATOR. expand all object of 'tasks' and operate on each individually
                        return { ...task, teacher_name: teacherData.name };
                    })
                );

                // Update state with tasks
                setTasks(tasksWithTeacherNames);
            } catch (error) {
                console.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        // GET ALL Completed Tasks & add to 'completedTasks' to differentiate appearance
        const fetchCompletedTasks = async () => {
            const { data, error } = await supabase
                .from('task_completions')
                .select('task_id')
                .eq('student_id', userId);

            if (error) {
                console.error('Error fetching completions:', error);
            } else {
                setCompletedTasks(data.map((item) => item.task_id)); // Store completed task IDs
            }
        };

        fetchTasks();
        fetchCompletedTasks();
    }, [userId]);

    const sortTasks = (tasksToSort) => {
        if (sortType === 'time') {
            // .sort() receieves a COMPARISON FUNCTION (a, b) =>
            // MOST RECENT tasks come first
            // From: https://stackoverflow.com/questions/55539108/how-to-sort-array-of-objects-based-on-descending-order-of-date-in-reactjs
            return tasksToSort.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } else if (sortType === 'questions') {
            // tasks with LEAST questions come first
            return tasksToSort.sort((a, b) => b.questions.length - a.questions.length);
        } else if (sortType === 'name') {
            // ALPHABETICAL ORDER
            return tasksToSort.sort((a, b) => a.task_name.localeCompare(b.task_name));
        } else {
            return tasksToSort;
        }
    };

    // SORT UNCOMPLETED TASKS
    const uncompletedTasks = sortTasks(
        tasks
            // list of ALL tasks minus COMPLETED tasks
            .filter((task) => !completedTasks.includes(task.id))
            // shallow copy & add 'completed' to tasks
            .map((task) => ({ ...task, completed: false }))
    );

    // SORT COMPLETED TASKS
    const completedTasksSorted = sortTasks(
        tasks
            // only completed tasks
            .filter((task) => completedTasks.includes(task.id))
            .map((task) => ({ ...task, completed: true }))
    );

    // '...' SPREAD operator expand each object, concatenate into one list
    // UNCOMPLETED TASKS are ALWAYS in front of COMPLETED TASKS
    const sortedTasks = [...uncompletedTasks, ...completedTasksSorted];

    const handleTaskClick = (task) => {
        if (!task.completed) {
            setSelectedTask(task); // set clicked task for the popup
        } else {
            setSelectedVisual(task)
            const fetchData = async () => {
                const { data, error } = await supabase
                    .from('task_completions')
                    .select('scores')
                    .eq('task_id', task.id)
                    .eq('student_id', userId)

                if (error) {
                    console.error('Error fetching results:', error);
                    console.log('hey')
                } else {
                    setSubmissionData(data);
                    setShowResultsPopup(true); // open the results popup
                    console.log(data)
                }
            };
            fetchData();
            console.log('TEST2', selectedTaskVisual.id)
        }
    };

    const closeResultsPopup = () => {
        setShowResultsPopup(false);
        setSubmissionData(null); // clear submission data
    };

    const closePopup = () => {
        setSelectedTask(null); // close the task popup
    };
    //TODO
    return (
        <div className="teacher-tasks-container">
            <div className="sorting-buttons">
                {/*if active, then activate*/}
                <button className={sortType === 'time' ? 'active' : ''} onClick={() => setSortType('time')}>Newest</button>
                <button className={sortType === 'questions' ? 'active' : ''} onClick={() => setSortType('questions')}>Sort by Questions</button>
                <button className={sortType === 'name' ? 'active' : ''} onClick={() => setSortType('name')}>Sort by Name</button>
            </div>

            {loading ? (
                <p>Loading tasks...</p>
            ) : (
                <div className="tasks-grid">
                    {sortedTasks.map((task) => (
                        <div
                            key={task.id}
                            className={`task-card ${task.completed ? 'completed' : ''}`}
                            onClick={() => handleTaskClick(task)}
                        >
                            {!task.completed && <div className="notification-circle" />}
                            <h3>{task.task_name}</h3>
                            <p>Teacher: {task.teacher_name}</p>
                            <p>Number of Questions: {task.questions.length}</p>
                            <p>Total Marks: {task.total_marks}</p>
                            <p>Created At: {new Date(task.created_at).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* popup for incomplete tasks */}
            {selectedTask && (
                <StudentTask_CompleteNewTask task={selectedTask} onClose={closePopup} userId={userId}
                                             onTaskComplete={() => {
                                                 // Add the task to the completed list after submission
                                                 setCompletedTasks((prevCompletedTasks) => [
                                                     ...prevCompletedTasks,
                                                     selectedTask.id,
                                                 ]);
                                             }}/>
            )}

            {/* results Popup for completed tasks */}
            {showResultsPopup && (
                <StudentTasks_VisualFeedback
                    data={submissionData}
                    taskId={selectedTaskVisual.id}
                    onClose={closeResultsPopup}
                />
            )}
        </div>
    );
};

export default StudentTasks;
