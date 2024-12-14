import { Link } from 'react-router-dom';
import './RoleSelection.css';
import studentImg from '../images/student.webp'; // student icon
import teacherImg from '../images/teacher.webp';

const RoleSelection = () => {
    return (
        <div className="role-selection-container">
            <h1>Register as...</h1>
            <div className="roles-container">
                <Link to="/ibmathvisualizer/signup-student" className="role-option">
                    <div className="role-circle">
                        <img src={studentImg} alt="Student" className="role-img" />
                    </div>
                    <p>Student</p>
                </Link>
                <Link to="/ibmathvisualizer/signup-teacher" className="role-option">
                    <div className="role-circle">
                        <img src={teacherImg} alt="Teacher" className="role-img" />
                    </div>
                    <p>Teacher</p>
                </Link>
            </div>
        </div>
    );
};

export default RoleSelection;
