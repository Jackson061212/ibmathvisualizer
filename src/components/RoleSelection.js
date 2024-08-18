import { Link } from 'react-router-dom';

const RoleSelection = () => {
    return (
        <div>
            <h1>Are You A:</h1>
            <Link to="/signup-student"><button>Student</button></Link>
            <Link to="/signup-teacher"><button>Teacher</button></Link>
        </div>
    );
};

export default RoleSelection;
