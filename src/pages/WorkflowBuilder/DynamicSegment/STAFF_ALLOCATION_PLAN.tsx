import config from '@/config';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import 'remixicon/fonts/remixicon.css'; // Ensure Remix Icons are included

interface DESIGNATION {
    name: string,
    asPerEstimate: number,
}
interface DEPARTMENT {
    name: string,
    designation: DESIGNATION[],
    isExpanded: boolean,
}
const STAFF_ALLOCATION_PLAN = () => {
    const [department, setDepartment] = useState<DEPARTMENT[]>([]);

    // Toggle department expansion
    const handleToggleDepartment = (index: number) => {
        setDepartment((prev) =>
            prev.map((dept, i) =>
                i === index ? { ...dept, isExpanded: !dept.isExpanded } : dept
            )
        );
    };

    const getDepartmentDesignation = async () => {
        try {
            const response = await axios.get(`${config.API_URL_ACCOUNT}/WorkflowBuilder/GetDepartmentandDesignation`);
            if (response.data.isSuccess) {
                console.log('response', response)
                setDepartment(response.data.department);
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getDepartmentDesignation();
    }, [])

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
