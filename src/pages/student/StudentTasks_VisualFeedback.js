import React, { useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import './StudentTasks_CompleteNewTask.css';
import { supabase } from '../../supabaseClient'; // Assuming you have a supabase client set up

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StudentTasks_VisualFeedback = ({ data, taskId, onClose }) => {
    console.log("VisualFeedback data: ", data)
    const chartRef = useRef(null); // Reference to the chart

    // Prepare data for the Bar chart
    const chartData = {
        labels: data.map((item) => `Q${item.question_number}`),
        datasets: [
            {
                label: 'Scores',
                data: data.map((item) => item.score),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Student Task Performance',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    // Function to handle saving the chart image
    const saveChartImage = async () => {
        const chart = chartRef.current; // Access the chart instance directly
        const imageBase64 = chart.toBase64Image(); // Convert chart to a base64-encoded image
        console.log(chart, taskId)
        try {
            // Update the 'task_completions' table with the visual feedback image
            const { data, error } = await supabase
                .from('task_completions')
                .update({ visual_feedback: imageBase64 })
                .eq('task_id', taskId);

            if (error) {
                console.error('Error updating task completion:', error);
            } else {
                console.log('Task completion updated successfully');
            }
        } catch (error) {
            console.error('Error saving chart image:', error);
        }
    };

    const handleClose = () => {
        saveChartImage(); // Save the chart before closing the popup
        onClose(); // Close the popup
    };

    return (
        <div className="popup-container">
            <div className="popup">
                <h2>Performance Feedback</h2>
                <Bar ref={chartRef} data={chartData} options={chartOptions} />
                <button onClick={handleClose} className="close-button">
                    X
                </button>
            </div>
        </div>
    );
};

export default StudentTasks_VisualFeedback;
