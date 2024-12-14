import React, { useState } from "react";
import { supabase } from '../../supabaseClient';
import "./TeacherLoggedHome_CreateNewTask.css";

const TeacherLoggedHome_CreateNewTask = ({ isOpen, onClose, teacherId }) => {
    const [taskName, setTaskName] = useState('');
    const [questions, setQuestions] = useState([
        { questionNumber: 1, totalMarks: '', tags: [] },
    ]); // Initial question

    const availableTags = ['Differentiation', 'Optimization', 'Integration Techniques', 'Vectors', 'Complex Numbers', 'Combinations and Permutations', 'Bivariate Statistics', 'Proof', 'Discrete Probability', 'Continuous Probability'];
    // ! handleTagSelection is made with the help of ChatGPT
    const handleTagSelection = (questionIndex, tag) => {
        setQuestions((prevQuestions) => {
            return prevQuestions.map((question, index) => {
                if (index === questionIndex) {
                    const updatedTags = question.tags.includes(tag)  // 'is the tag added already?'
                        ? question.tags.filter((t) => t !== tag) // remove the tag if it's already selected
                        : [...question.tags, tag]; // add the tag if it's not selected

                    return { ...question, tags: updatedTags };  // add 'tags' to 'questions' as a new column
                }
                return question;
            });
        });
    };

    // handle any deletion or addition of problems
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
            .filter((question, i) => i !== index) // filters out that question
            .map((question, i) => ({
                ...question,
                questionNumber: i + 1, // re-assign each question's Q number
            }));
        setQuestions(newQuestions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // validate inputs
        if (!taskName) {
            alert("Task Name is required.");
            return;
        }
        if (questions.some((q) => !q.totalMarks || q.tags.length === 0)) {
            // .some() --> IF AT LEAST ONE QUESTION DOES NOT HAVE COMPLETE INFORMATION, ALERt
            alert("Each question must have total marks and at least one tag.");
            return;
        }

        // calc total marks for the task
        // Accumulate the TOTAL MARKS of a task (over all questions)
        let totalMarks = 0;
        for (let i = 0; i < questions.length; i++) {
            let marks = questions[i].totalMarks ? parseFloat(questions[i].totalMarks) : 0;
            totalMarks += marks;
        }

        try {
            const { data, error } = await supabase
                .from('tasks')
                .insert({
                    teacher_id: teacherId, // store the teacher's ID
                    task_name: taskName,
                    total_marks: totalMarks, // save the calculated total marks
                    questions: questions.map((q) => ({   // update question naming
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
                setTaskName(''); // reset task name
                setQuestions([{ questionNumber: 1, totalMarks: '', tags: [] }]);
                onClose();
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
                    {/*.map() loop through the entire question array and make the html*/}
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
