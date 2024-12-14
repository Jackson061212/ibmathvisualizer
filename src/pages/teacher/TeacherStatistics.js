import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import './TeacherStatistics.css';

const TeacherStatistics = () => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [groupFilter, setGroupFilter] = useState('');
    const [teacherFilter, setTeacherFilter] = useState('');
    const [sortType, setSortType] = useState('last_name');

    useEffect(() => {
        const fetchStudents = async () => {
            const { data, error } = await supabase
                .from('students')
                .select('email, english_name, last_name, group, subject_teacher');

            if (error) {
                console.error('Error fetching students:', error);
            } else {
                setStudents(data);
                setFilteredStudents(data);
            }
        };

        fetchStudents();
    }, []);

    const handleSortChange = (type) => {
        setSortType(type);
        let sorted = [...filteredStudents];

        if (type === 'last_name') {
            sorted.sort((a, b) => a.last_name.localeCompare(b.last_name));
        } else if (type === 'english_name') {
            sorted.sort((a, b) => a.english_name.localeCompare(b.english_name));
        }

        setFilteredStudents(sorted);
    };

    const filterByGroup = (group) => {
        setGroupFilter(group);
        setFilteredStudents(
            students.filter(
                (student) => group === '' || student.group === group
            )
        );
    };

    const filterByTeacher = (teacher) => {
        setTeacherFilter(teacher);
        setFilteredStudents(
            students.filter(
                (student) => teacher === '' || student.subject_teacher === teacher
            )
        );
    };

    return (
        <div className="teacher-statistics-container">
            <div className="filters">
                <div className="sorting-buttons">
                    <button
                        className={sortType === 'last_name' ? 'active' : ''}
                        onClick={() => handleSortChange('last_name')}
                    >
                        Sort by Last Name
                    </button>
                    <button
                        className={sortType === 'english_name' ? 'active' : ''}
                        onClick={() => handleSortChange('english_name')}
                    >
                        Sort by English Name
                    </button>
                </div>
                <div className="group-filter">
                    <select
                        value={groupFilter}
                        onChange={(e) => filterByGroup(e.target.value)}
                    >
                        <option value="">All Groups</option>
                        <option value="Pre-IB">Pre-IB</option>
                        <option value="DP1 AA HL">DP1 AA HL</option>
                        <option value="DP1 AI HL">DP1 AI HL</option>
                        <option value="DP1 AI SL">DP1 AI SL</option>
                        <option value="DP2 AA HL">DP2 AA HL</option>
                        <option value="DP2 AI HL">DP2 AI HL</option>
                        <option value="DP2 AI SL">DP2 AI SL</option>
                    </select>
                </div>
                <div className="teacher-filter">
                    <select
                        value={teacherFilter}
                        onChange={(e) => filterByTeacher(e.target.value)}
                    >
                        <option value="">All Teachers</option>
                        <option value="Mr. Vega">Mr. Vega</option>
                        <option value="Mr. Stephen">Mr. Stephen</option>
                        <option value="Mr. Orozco">Mr. Orozco</option>
                    </select>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table student-table">
                    <thead>
                    <tr>
                        <th className="index-cell">#</th>
                        <th>Email</th>
                        <th>English Name</th>
                        <th>Last Name</th>
                        <th>Group</th>
                        <th>Subject Teacher</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredStudents.map((student, index) => (
                        <tr key={student.email}>
                            <td className="index-cell">{index + 1}</td>
                            <td>{student.email}</td>
                            <td>{student.english_name}</td>
                            <td>{student.last_name}</td>
                            <td>{student.group}</td>
                            <td>{student.subject_teacher}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TeacherStatistics;
