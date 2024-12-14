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

    //fetch the details of whatever task.id is given
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

    // +value is a quick way to convert value into a number if it can be converted
    // + is a Unary operator: https://stackoverflow.com/questions/59820643/when-to-use-or-number-with-string-numbers
    const handleScoreChange = (index, value) => {
        if (!isNaN(value) && Number.isInteger(+value)) {  // IS a num OR CAN be converted into a num
            setScores({ ...scores, [index]: value });
        }
    };

    // check all values before submitting form
    const handleSubmit = async () => {
        setErrorMessage('');

        let totalMarksScored = 0;
        let totalMaxMarks = 0;

        for (let i = 0; i < questions.length; i++) {
            const score = scores[i];
            const fullMark = questions[i].total_marks;

            if (score === undefined || score === '') {
                setErrorMessage(`Please enter a score for Question ${i + 1}.`);
                return;
            }
            // if val entered cant be converted into number
            if (!Number.isInteger(+score)) {
                setErrorMessage(`Score for Question ${i + 1} must be an integer.`);
                return;
            }
            // if num entered greater than full marks for that question (invalid)
            if (+score > fullMark) {
                setErrorMessage(`Score for Question ${i + 1} cannot exceed ${fullMark}.`);
                return;
            }
            totalMarksScored += +score;
        }

        // Calculate percentage accuracy
        const percentageAccuracy = (totalMarksScored / task.total_marks) * 100;
        console.log(totalMarksScored, percentageAccuracy)

        // .map creates new submission structure with individual objects with the callback func
        const submission = questions.map((question, index) => ({
            question_id: question.id,
            score: +scores[index],
        }));

        // insert new 'tasks_completion' record upon submission
        console.log('submitting...')
        const { error } = await supabase
            .from('task_completions') // Replace with your actual table name
            .insert({
                task_id: task.id,
                student_id: userId,
                scores: submission,
                total_marks_scored: totalMarksScored,
                total_marks: task.total_marks,
                percentage_accuracy: percentageAccuracy,
            });

        if (error) {
            console.error('Error submitting scores:', error);
            setErrorMessage('Failed to submit scores. Please try again.');
        } else {
            console.log('SUCCESSFUL SUBMISSION');
            setSubmissionData(submission); // set data for visualization
            setShowResultsPopup(true); // Open the visual feedback popup

            onTaskComplete();
        }
    };

    const closeResultsPopup = () => {
        setShowResultsPopup(false);
        onClose(task.id); // pass the completed task ID to the parent component
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
