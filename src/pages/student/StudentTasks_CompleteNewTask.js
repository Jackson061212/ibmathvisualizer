import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import StudentTasks_VisualFeedback from './StudentTasks_VisualFeedback';
import './StudentTasks_CompleteNewTask.css';

const StudentTasks_CompleteNewTask = ({ task, onClose, userId, onTaskComplete}) => {
    const [questions, setQuestions] = useState([]);
    const [scores, setScores] = useState({});
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [showResultsPopup, setShowResultsPopup] = useState(false);
    const [submissionData, setSubmissionData] = useState([]);

    useEffect(() => {
        const fetchQuestions = async () => {
            const { data, error } = await supabase
                .from('tasks')
                .select('questions')
                .eq('id', task.id)
                .single();

            if (error) {
                console.error('Error fetching questions:', error);
            } else {
                setQuestions(task.questions);
            }
            setLoading(false);
        };

        fetchQuestions();
    }, [task.id]);

    const handleScoreChange = (index, value) => {
        if (value === '' || (!isNaN(value) && Number.isInteger(+value))) {
            setScores({ ...scores, [index]: value });
        }
    };

    const handleSubmit = async () => {
        setErrorMessage('');

        for (let i = 0; i < questions.length; i++) {
            const score = scores[i];
            const fullMark = questions[i].total_marks;

            if (score === undefined || score === '') {
                setErrorMessage(`Please enter a score for Question ${i + 1}.`);
                return;
            }

            if (!Number.isInteger(+score)) {
                setErrorMessage(`Score for Question ${i + 1} must be an integer.`);
                return;
            }

            if (+score > fullMark) {
                setErrorMessage(`Score for Question ${i + 1} cannot exceed ${fullMark}.`);
                return;
            }
        }

        const submission = questions.map((question, index) => ({
            question_id: question.id,
            score: +scores[index],
        }));

        console.log('submitting...')
        const { error } = await supabase
            .from('task_completions') // Replace with your actual table name
            .insert({
                task_id: task.id,
                student_id: userId,
                scores: submission,
            });

        if (error) {
            console.error('Error submitting scores:', error);
            setErrorMessage('Failed to submit scores. Please try again.');
        } else {
            console.log('SUCCESSFUL SUBMISSION');
            setSubmissionData(submission); // Set data for visualization
            setShowResultsPopup(true); // Open the visual feedback popup

            onTaskComplete()
        }
    };

    const closeResultsPopup = () => {
        setShowResultsPopup(false);
        onClose(task.id); // Pass the completed task ID to the parent component
    };
    console.log("TEST1", submissionData, task.id)

    return (
        <div>
            {showResultsPopup ? (
                <StudentTasks_VisualFeedback
                    data={submissionData}
                    taskId={task.id}
                    onClose={closeResultsPopup}
                />
            ) : (
                <div className="popup-container">
                    <div className="popup">
                        <h2>{task.task_name}</h2>
                        <p>
                            <small>Created At: {new Date(task.created_at).toLocaleString()}</small>
                        </p>
                        <p>
                            <small>Number of Questions: {task.questions.length}</small>
                        </p>
                        <p>
                            <small>Total Marks: {task.total_marks}</small>
                        </p>

                        {loading ? (
                            <p>Loading questions...</p>
                        ) : (
                            <div className="questions-list">
                                {questions.map((question, index) => (
                                    <div key={index} className="question-box">
                                        <h3>Question {index + 1}</h3>
                                        <div className="tags-container">
                                            {question.tags.map((tag, tagIndex) => (
                                                <span key={tagIndex} className="tag">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <p>{question.content}</p>
                                        <div className="score-input-container">
                                            <label>
                                                Score:
                                                <div className="score-wrapper">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max={question.total_marks}
                                                        value={scores[index] || ''}
                                                        onChange={(e) =>
                                                            handleScoreChange(index, e.target.value)
                                                        }
                                                        className="score-input"
                                                    />
                                                    <span className="total-marks">
                                                        {' '}
                                                        / {question.total_marks}
                                                    </span>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {errorMessage && <p className="error-message">{errorMessage}</p>}

                        <div className="buttons-container">
                            <button onClick={handleSubmit} className="submit-button">
                                Submit
                            </button>
                            <button onClick={() => onClose()} className="close-button">
                                X
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentTasks_CompleteNewTask;
