import config from '@/config';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Form, Modal, Button } from 'react-bootstrap';
import 'remixicon/fonts/remixicon.css';

// Interfaces
interface DESIGNATION {
    name: string;
    asPerEstimate: number;
    availableatSite: number;
    jvPartnerCount: number;
    _3MonthTimeline: number;
    projectSectionBifurcation?: ProjectSectionBifurcation; // ✅ Corrected to hold full object
}

interface DEPARTMENT {
    name: string;
    designation: DESIGNATION[];
    isExpanded: boolean;
}

interface ThreeMonthData {
    month: string;
    count: number;
    roles: string[];
}

interface ProjectSectionBifurcation {
    Administration: number;
    Highway: number;
    CastingYard1: number;
    CastingYard2: number;
    CastingYard3: number;
    SteelYard: number;
    FabricationYard: number;
    Section1Foundation: number;
    Section1SubStructure: number;
    Section1Launching: number;
    Section1Deck: number;
    TotalSiteRequirement: number;
}

// Initial Bifurcation Object
const initialProjectSectionBifurcation: ProjectSectionBifurcation = {
    Administration: 0,
    Highway: 0,
    CastingYard1: 0,
    CastingYard2: 0,
    CastingYard3: 0,
    SteelYard: 0,
    FabricationYard: 0,
    Section1Foundation: 0,
    Section1SubStructure: 0,
    Section1Launching: 0,
    Section1Deck: 0,
    TotalSiteRequirement: 0,
};

// Component
const STAFF_ALLOCATION_PLAN = () => {
    // State
    const [department, setDepartment] = useState<DEPARTMENT[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [showThreeMonthModal, setShowThreeMonthModal] = useState(false);
    const [showProjectSectionBifurcationModal, setShowProjectSectionBifurcationModal] = useState(false);

    const [selectedRole, setSelectedRole] = useState<DESIGNATION | null>(null);
    const [selectedDeptIndex, setSelectedDeptIndex] = useState<number | null>(null);
    const [selectedRoleIndex, setSelectedRoleIndex] = useState<number | null>(null);

    const [availableAtSiteInput, setAvailableAtSiteInput] = useState<number>(0);
    const [dynamicSelectValues, setDynamicSelectValues] = useState<string[]>([]);

    const [threeMonthData, setThreeMonthData] = useState<ThreeMonthData[]>(generateMonthData());
    const [projectSectionBifurcationData, setProjectSectionBifurcationData] = useState<ProjectSectionBifurcation>(initialProjectSectionBifurcation);

    const [confirmStaffAllocationPlan, setConfirmStaffAllocationPlan] = useState<string>("");

    function generateMonthData(): ThreeMonthData[] {
        const months: ThreeMonthData[] = [];
        const now = new Date();

        for (let i = 0; i < 4; i++) {
            const tempDate = new Date(now.getFullYear(), now.getMonth() + i, 1);
            const monthName = tempDate.toLocaleString('default', { month: 'long' });

            months.push({
                month: monthName,
                count: 0,
                roles: [],
            });
        }

        return months;
    }

    // Toggle department expansion
    const handleToggleDepartment = (index: number) => {
        setDepartment((prev) =>
            prev.map((dept, i) =>
                i === index ? { ...dept, isExpanded: !dept.isExpanded } : dept
            )
        );
    };

    // Handle department role input change
    const handleInputChange = (departIndex: number, roleIndex: number, e: any) => {
        const updatedDepartments = department.map((dept, dIndex) => {
            if (dIndex === departIndex) {
                const updatedDesignations = dept.designation.map((role, rIndex) => {
                    if (rIndex === roleIndex) {
                        return { ...role, [e.target.name]: Number(e.target.value) };
                    }
                    return role;
                });
                return { ...dept, designation: updatedDesignations };
            }
            return dept;
        });

        setDepartment(updatedDepartments);
    };

    // Modal Handlers
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedRole(null);
        setSelectedDeptIndex(null);
        setSelectedRoleIndex(null);
        setAvailableAtSiteInput(0);
        setDynamicSelectValues([]);
    };

    const handleCloseThreeMonthModal = () => {
        setShowThreeMonthModal(false);
        setSelectedRole(null);
        setSelectedDeptIndex(null);
        setSelectedRoleIndex(null);
        setThreeMonthData(generateMonthData());
    };

    const handleCloseProjectSectionBifurcationModal = () => {
        setShowProjectSectionBifurcationModal(false);
        setSelectedRole(null);
        setSelectedDeptIndex(null);
        setSelectedRoleIndex(null);
    };

    // Available at Site Save
    const handleSaveAvailableAtSite = () => {
        if (selectedDeptIndex === null || selectedRoleIndex === null) return;

        const updatedDepartments = [...department];
        const roleToUpdate = updatedDepartments[selectedDeptIndex].designation[selectedRoleIndex];

        roleToUpdate.availableatSite = availableAtSiteInput;

        console.log('Selected dropdown values:', dynamicSelectValues);

        setDepartment(updatedDepartments);
        handleCloseModal();
    };

    const handleDynamicSelectChange = (index: number, value: string) => {
        const updatedValues = [...dynamicSelectValues];
        updatedValues[index] = value;
        setDynamicSelectValues(updatedValues);
    };

    const renderDynamicSelects = () => {
        if (selectedDeptIndex === null || selectedRoleIndex === null) return;

        return [...Array(availableAtSiteInput)].map((_, i) => (
            <Form.Group key={i} className="mb-2">
                <Form.Label>Select Option {i + 1}</Form.Label>
                <Form.Control
                    as="select"
                    value={dynamicSelectValues[i] || ''}
                    onChange={(e) => handleDynamicSelectChange(i, e.target.value)}
                >
                    <option value="">Select</option>
                    <option value="Worker">Worker</option>
                    <option value="Supervisor">Supervisor</option>
                    <option value="Foreman">Foreman</option>
                </Form.Control>
            </Form.Group>
        ));
    };

    // 3 Month Input Change
    const handleThreeMonthInputChange = (index: number, field: string, value: any) => {
        const updatedData = [...threeMonthData];
        updatedData[index] = {
            ...updatedData[index],
            [field]: field === 'count' ? Number(value) : value,
        };

        if (field === 'count') {
            const count = Number(value);
            updatedData[index].roles = Array(count).fill('');
        }

        setThreeMonthData(updatedData);
    };

    const handleThreeMonthRoleChange = (monthIndex: number, roleIndex: number, value: string) => {
        const updatedData = [...threeMonthData];
        updatedData[monthIndex].roles[roleIndex] = value;
        setThreeMonthData(updatedData);
    };

    const handleSaveThreeMonthData = () => {
        console.log('Saving 3 month data:', threeMonthData);

        if (selectedDeptIndex === null || selectedRoleIndex === null) return;

        const updatedDepartments = [...department];
        const roleToUpdate = updatedDepartments[selectedDeptIndex].designation[selectedRoleIndex];

        const totalTimeline = threeMonthData.reduce((acc, curr) => acc + curr.count, 0);
        roleToUpdate._3MonthTimeline = totalTimeline;

        setDepartment(updatedDepartments);
        handleCloseThreeMonthModal();
    };

    // Project Section Bifurcation Input
    const calculateTotalSiteRequirement = (data: ProjectSectionBifurcation) => {
        return Object.entries(data)
            .filter(([key]) => key !== 'TotalSiteRequirement')
            .reduce((acc, [, value]) => acc + value, 0);
    };

    const handleProjectSectionBifurcationInputChange = (field: keyof ProjectSectionBifurcation, value: any) => {
        setProjectSectionBifurcationData((prev) => {
            const updated = {
                ...prev,
                [field]: Number(value),
            };

            const total = calculateTotalSiteRequirement(updated);

            return {
                ...updated,
                TotalSiteRequirement: total,
            };
        });
    };

    const handleSaveProjectSectionBifurcationData = () => {
        console.log('Saving Project Section Bifurcation Data:', projectSectionBifurcationData);

        if (selectedDeptIndex === null || selectedRoleIndex === null) return;

        const updatedDepartments = [...department];
        const roleToUpdate = updatedDepartments[selectedDeptIndex].designation[selectedRoleIndex];

        roleToUpdate.projectSectionBifurcation = { ...projectSectionBifurcationData };

        setDepartment(updatedDepartments);
        handleCloseProjectSectionBifurcationModal();
    };

    // Modal Openers
    const handleOpenModal = (departIndex: number, roleIndex: number, role: DESIGNATION) => {
        setSelectedRole(role);
        setSelectedDeptIndex(departIndex);
        setSelectedRoleIndex(roleIndex);
        setAvailableAtSiteInput(role.availableatSite || 0);
        setDynamicSelectValues(Array(role.availableatSite || 0).fill(''));
        setShowModal(true);
    };

    const handleOpenThreeMonthModal = (departIndex: number, roleIndex: number, role: DESIGNATION) => {
        setSelectedRole(role);
        setSelectedDeptIndex(departIndex);
        setSelectedRoleIndex(roleIndex);
        setShowThreeMonthModal(true);
    };

    const handleOpenProjectSectionBifurcationModal = (departIndex: number, roleIndex: number, role: DESIGNATION) => {
        setSelectedRole(role);
        setSelectedDeptIndex(departIndex);
        setSelectedRoleIndex(roleIndex);

        setProjectSectionBifurcationData(role.projectSectionBifurcation || initialProjectSectionBifurcation);

        setShowProjectSectionBifurcationModal(true);
    };

    const getDepartmentTotalEstimate = (dept: DEPARTMENT): number => {
        return dept.designation.reduce((total, designation) => total + (designation.asPerEstimate || 0), 0);
    };

    const getDepartmentDesignation = async () => {
        try {
            const response = await axios.get(`${config.API_URL_ACCOUNT}/WorkflowBuilder/GetDepartmentandDesignation`);
            if (response.data.isSuccess) {
                const departmentsWithExpand = response.data.department.map((dept: any) => ({
                    ...dept,
                    isExpanded: false,
                }));
                setDepartment(departmentsWithExpand);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getDepartmentDesignation();
    }, []);

    return (
        <div>
            {/* Department Table */}
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
                                <td>{getDepartmentTotalEstimate(depart)}</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>Submit/Edit</td>
                                <td>
                                    <button onClick={() => handleToggleDepartment(departIndex)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                        {depart.isExpanded ? (
                                            <i className="ri-arrow-down-s-line"></i>
                                        ) : (
                                            <i className="ri-arrow-right-s-line"></i>
                                        )}
                                    </button>
                                </td>
                            </tr>
                            {depart.isExpanded && depart.designation.map((role, roleIndex) => (
                                <tr key={`${departIndex}-${roleIndex}`} style={{ background: '#fafafa' }}>
                                    <td style={{ paddingLeft: '30px' }}>{role.name}</td>
                                    <td>
                                        <Form.Control
                                            type="number"
                                            name="asPerEstimate"
                                            value={role.asPerEstimate}
                                            onChange={(e) => handleInputChange(departIndex, roleIndex, e)}
                                            placeholder="Enter Estimate"
                                        />
                                    </td>
                                    <td>0</td>
                                    <td>
                                        <Button variant="link" onClick={() => handleOpenModal(departIndex, roleIndex, role)}>
                                            {role.availableatSite}
                                        </Button>
                                    </td>
                                    <td>
                                        <Form.Control
                                            type="number"
                                            value={role.jvPartnerCount}
                                            name="jvPartnerCount"
                                            onChange={(e) => handleInputChange(departIndex, roleIndex, e)}
                                            placeholder="Enter JV Count"
                                        />
                                    </td>
                                    <td>
                                        <Button variant="link" onClick={() => handleOpenThreeMonthModal(departIndex, roleIndex, role)}>
                                            {role._3MonthTimeline}
                                        </Button>
                                    </td>
                                    <td>
                                        <Button variant="link" onClick={() => handleOpenProjectSectionBifurcationModal(departIndex, roleIndex, role)}>
                                            {role.projectSectionBifurcation?.TotalSiteRequirement || 0}
                                        </Button>
                                    </td>
                                    <td>Submit/Edit</td>
                                    <td></td>
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>

             {/* Available at Site Modal */}
             <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Update Available at Site</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedRole ? (
                        <>
                            <p><strong>Designation Name:</strong> {selectedRole.name}</p>

                            <Form.Group>
                                <Form.Label>Available at Site</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="0"
                                    value={availableAtSiteInput}
                                    onChange={(e) => {
                                        const count = Number(e.target.value);
                                        setAvailableAtSiteInput(count);
                                        setDynamicSelectValues(Array(count).fill(''));
                                    }}
                                    placeholder="Enter count"
                                />
                            </Form.Group>

                            {renderDynamicSelects()}
                        </>
                    ) : (
                        <p>No role selected.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                    <Button variant="primary" onClick={handleSaveAvailableAtSite}>Save</Button>
                </Modal.Footer>
            </Modal>

            {/* 3 Month Requirement Modal */}
            <Modal show={showThreeMonthModal} onHide={handleCloseThreeMonthModal} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>3 Months Requirement</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
                        {threeMonthData.map((data, index) => (
                            <div key={index} style={{ flex: '1', minWidth: '200px' }}>
                                <Form.Group>
                                    <Form.Label>{data.month}</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={data.count}
                                        onChange={(e) => handleThreeMonthInputChange(index, 'count', e.target.value)}
                                        placeholder={`Enter count for ${data.month}`}
                                        disabled={index === 0}
                                    />
                                </Form.Group>

                                {[...Array(Number(data.count))].map((_, roleIndex) => (
                                    <Form.Group className="mt-2" key={roleIndex}>
                                        <Form.Label>Specialized Role {roleIndex + 1}</Form.Label>
                                        <Form.Control
                                            as="select"
                                            value={data.roles[roleIndex] || ""}
                                            onChange={(e) => handleThreeMonthRoleChange(index, roleIndex, e.target.value)}
                                        >
                                            <option value="">Select Role</option>
                                            <option value="Project Manager">Project Manager</option>
                                            <option value="Senior Project Manager">Senior Project Manager</option>
                                            <option value="Supervisor">Supervisor</option>
                                        </Form.Control>
                                    </Form.Group>
                                ))}
                            </div>
                        ))}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseThreeMonthModal}>Close</Button>
                    <Button variant="primary" onClick={handleSaveThreeMonthData}>
                        <i className="ri-check-line"></i> Save
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Project Section Bifurcation */}
            <Modal show={showProjectSectionBifurcationModal} onHide={handleCloseProjectSectionBifurcationModal} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Project Section Bifurcation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {Object.entries(projectSectionBifurcationData).map(([section, value]) => (
                        <Form.Group key={section} className="mb-2">
                            <Form.Label>{section.replace(/([A-Z])/g, ' $1').trim()}</Form.Label>
                            <Form.Control
                                type="number"
                                value={value}
                                onChange={(e) => handleProjectSectionBifurcationInputChange(section as keyof ProjectSectionBifurcation, e.target.value)}
                                placeholder={`Enter count for ${section}`}
                                disabled={section === 'TotalSiteRequirement'}
                            />
                        </Form.Group>
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseProjectSectionBifurcationModal}>Close</Button>
                    <Button variant="primary" onClick={handleSaveProjectSectionBifurcationData}>
                        <i className="ri-check-line"></i> Save
                    </Button>
                </Modal.Footer>
            </Modal>
            <Form.Group className="mt-2">
                <Form.Label>Confirm Staff Allocation Plan Has Been Filled Properly</Form.Label>
                <Form.Control
                    as="select"
                    value={confirmStaffAllocationPlan}
                    onChange={(e) => setConfirmStaffAllocationPlan(e.target.value)}
                >
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </Form.Control>
            </Form.Group>
        </div>
    );
};

export default STAFF_ALLOCATION_PLAN;
