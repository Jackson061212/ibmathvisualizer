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
import { supabase } from '../../supabaseClient';

// register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StudentTasks_VisualFeedback = ({ data, taskId, onClose }) => {
    console.log("VisualFeedback data: ", data)
    const chartRef = useRef(null); // Reference to the chart

    // TODO: MAKE bar chart INTO radar graph. Curr bar chart is for testing, NOT final
    // prep data for bar chart
    // ! THE code in chartData and chartOptions are PROVIDED FROM ChatGPT
    const chartData = {
        labels: data.map((item) => `Q${item.question_number}`), // turn data into string labels Q1, Q2, ...
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

    // Understood from: https://www.chartjs.org/docs/latest/getting-started/usage.html
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

    // function to handle saving the chart image to database
    const saveChartImage = async () => {
        // toBase64Image() for ChartJS learned from: https://quickchart.io/documentation/chart-js/image-export/
        const chart = chartRef.current; // access the chart instance directly
        const imageBase64 = chart.toBase64Image(); // convert chart to a base64-encoded image
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
        saveChartImage(); // save the chart before closing the popup
        onClose();
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
