import React, { useState } from 'react';
import 'remixicon/fonts/remixicon.css'; // Ensure Remix Icons are included

const STAFF_ALLOCATION_PLAN = () => {
    const [department, setDepartment] = useState([
        {
            name: 'Engineering and Field',
            designation: [
                { name: "Assistant General Manager", asPerEstimate: 2 },
                { name: "Deputy General Manager", asPerEstimate: 1 },
                { name: "Project Manager", asPerEstimate: 1 },
                { name: "Deputy Project Manager", asPerEstimate: 0 },
                { name: "Senior Engineer Civil", asPerEstimate: 3 },
                { name: "Engineer Civil", asPerEstimate: 4 },
                { name: "Junior Engineer Civil", asPerEstimate: 2 },
                { name: "Trainee Engineer Civil", asPerEstimate: 1 },
                { name: "Foreman", asPerEstimate: 2 },
                { name: "Senior Supervisor", asPerEstimate: 1 },
                { name: "Junior Site Supervisor", asPerEstimate: 0 },
                { name: "Launching Site Supervisor", asPerEstimate: 0 },
                { name: "Casting Yard Supervisor", asPerEstimate: 0 },
                { name: "Reinforcement Yard Supervisor", asPerEstimate: 0 }
            ],
            isExpanded: false,
        },
        {
            name: 'Survey',
            designation: [],
            isExpanded: false,
        }
    ]);

    // Toggle department expansion
    const handleToggleDepartment = (index: number) => {
        setDepartment((prev) =>
            prev.map((dept, i) =>
                i === index ? { ...dept, isExpanded: !dept.isExpanded } : dept
            )
        );
    };

    return (
        <div>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#f4f4f4' }}>
                        <th>Department</th>
                        <th>As per Estimate</th>
                        <th>Hiring already in Process</th>
                        <th>Available at Site</th>
                        <th>JV Partner Count</th>
                        <th>3 months requirement</th>
                        <th>Project Section Bifurcation</th>
                        <th>Requirement Timeline</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {department.map((depart, departIndex) => (
                        <React.Fragment key={depart.name}>
                            <tr>
                                <td>{depart.name}</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>Submit/Edit</td>
                                <td>
                                    <button
                                        onClick={() => handleToggleDepartment(departIndex)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                        {depart.isExpanded ? (
                                            <i className="ri-arrow-down-s-line"></i>
                                        ) : (
                                            <i className="ri-arrow-right-s-line"></i>
                                        )}
                                    </button>
                                </td>
                            </tr>
                            {depart.isExpanded &&
                                depart.designation.map((role, roleIndex) => (
                                    <tr key={`${departIndex}-${roleIndex}`} style={{ background: '#fafafa' }}>
                                        <td style={{ paddingLeft: '30px' }}>{role.name}</td>
                                        <td>{role.asPerEstimate}</td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>Submit/Edit</td>
                                        <td></td>
                                    </tr>
                                ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default STAFF_ALLOCATION_PLAN;
