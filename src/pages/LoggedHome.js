import React from "react";

const LoggedHome = () => {
    return (
        <div>
            <h1>Welcome Back!</h1>
            <p>This is the logged-in homepage.</p>
            <ul>
                <li><a href="/tasks">View Tasks</a></li>
                <li><a href="/statistics">View Statistics</a></li>
            </ul>
        </div>
    );
}

export default LoggedHome;
