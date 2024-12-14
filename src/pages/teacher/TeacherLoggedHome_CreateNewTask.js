import React, { useState } from "react";
import { supabase } from '../../supabaseClient'; // Import Supabase client
import "./TeacherLoggedHome_CreateNewTask.css"; // Add the provided styles to this CSS file

const TeacherLoggedHome_CreateNewTask = ({ isOpen, onClose, teacherId }) => { // Pass teacherId as a prop
    const [taskName, setTaskName] = useState('');
    const [questions, setQuestions] = useState([
        { questionNumber: 1, totalMarks: '', tags: [] },
    ]); // Initial question

    const availableTags = ['Differentiation', 'Optimization', 'Integration Techniques', 'Vectors', 'Complex Numbers', 'Combinations and Permutations', 'Bivariate Statistics', 'Proof', 'Discrete Probability', 'Continuous Probability'];
    const handleTagSelection = (questionIndex, tag) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((q, i) =>
                i === questionIndex
                    ? {
                        ...q,
                        tags: q.tags.includes(tag)
                            ? q.tags.filter((t) => t !== tag) // Remove if already selected
                            : [...q.tags, tag], // Add new tag
                    }
                    : q
            )
        );
    };

    const handleQuestionChange = (index, fieldName, value) => {
        const newQuestions = [...questions];
        newQuestions[index][fieldName] = value;
        setQuestions(newQuestions);
    };

    const addQuestion = () => {
        setQuestions([
            ...questions,
            { questionNumber: questions.length + 1, totalMarks: '', tags: [] },
        ]);
    };

    const removeQuestion = (index) => {
        const newQuestions = questions
            .filter((_, i) => i !== index)
            .map((question, i) => ({
                ...question,
                questionNumber: i + 1, // Update question numbers
            }));
        setQuestions(newQuestions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate inputs
        if (!taskName) {
            alert("Task Name is required.");
            return;
        }
        if (questions.some((q) => !q.totalMarks || q.tags.length === 0)) {
            alert("Each question must have total marks and at least one tag.");
            return;
        }

        // Calculate total marks for the task
        const totalMarks = questions.reduce((sum, q) => sum + parseFloat(q.totalMarks || 0), 0);

        try {
            // Create the task object
            const { data, error } = await supabase
                .from('tasks')
                .insert({
                    teacher_id: teacherId, // Store the teacher's ID
                    task_name: taskName,
                    total_marks: totalMarks, // Save the calculated total marks
                    questions: questions.map((q) => ({
                        question_number: q.questionNumber,
                        total_marks: q.totalMarks,
                        tags: q.tags,
                    })),
                });

            if (error) {
                console.error("Error creating task:", error.message);
                alert("Failed to create task. Please try again.");
            } else {
                alert("Task created successfully!");
                setTaskName(''); // Reset task name
                setQuestions([{ questionNumber: 1, totalMarks: '', tags: [] }]);
                onClose(); // Close the popup after submission
            }
        } catch (error) {
            console.error("Unexpected error:", error);
            alert("An unexpected error occurred. Please try again.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="popup-container">
            <div className="popup">
                <button className="close-button" onClick={onClose}>
                    X
                </button>
                <h2>Create a New Task</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>
                            Task Name:
                            <input
                                type="text"
                                placeholder="Give this task a name"
                                value={taskName}
                                onChange={(e) => setTaskName(e.target.value)}
                                required
                            />
                        </label>
                    </div>

                    <h3>Questions</h3>
                    {questions.map((question, index) => (
                        <div key={index} className="question-box">
                            <h4>Question {question.questionNumber}</h4>
                            <label>
                                Total Marks:
                                <input
                                    type="number"
                                    value={question.totalMarks}
                                    onChange={(e) =>
                                        handleQuestionChange(index, "totalMarks", e.target.value)
                                    }
                                    required
                                />
                            </label>
                            <div className="tag-selector">
                                <label>Tags:</label>
                                <div className="dropdown">
                                    <button
                                        type="button"
                                        className="dropdown-button"
                                    >
                                        Select Tags
                                    </button>
                                    <div className="dropdown-content">
                                        {availableTags.map((tag) => (
                                            <div
                                                key={tag}
                                                className={`dropdown-item ${
                                                    question.tags.includes(tag)
                                                        ? "selected"
                                                        : ""
                                                }`}
                                                onClick={() => handleTagSelection(index, tag)}
                                            >
                                                {tag}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="selected-tags">
                                    {question.tags.map((tag) => (
                                        <span key={tag} className="tag">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeQuestion(index)}
                            >
                                Delete Question
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={addQuestion}>
                        Add a Question
                    </button>
                    <button type="submit">Create Task</button>
                </form>
            </div>
        </div>
    );
};

export default TeacherLoggedHome_CreateNewTask;
