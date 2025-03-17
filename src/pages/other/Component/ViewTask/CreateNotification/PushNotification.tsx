import { Form, Button, Modal, Row, Col, ButtonGroup } from "react-bootstrap";
import { useEffect, useState } from "react";
import Select from 'react-select';
import { toast } from "react-toastify";
import config from "@/config";
import axios from "axios";

interface ProcessCanvasProps {
    showView: boolean;
    setShowView: (show: boolean) => void;
    data: AssignProjecttoProcess | null;  // Ensure `data` can be `null`
}

interface AssignProjecttoProcess {
    id: number;
    doerIDs: string[];
    roleNames: string[];
    content: string;
    subject: string;
    createdBy: string;
    updatedBy: string;
}

interface Employee {
    empId: string;
    employeeName: string;
}

const roleOptions = [
    { value: 'Admin', label: 'Admin' },
    { value: 'DME', label: 'DME' },
    { value: 'ProcessCoordinator', label: 'Process Coordinator' },
    { value: 'Management', label: 'Management' },
    { value: 'Employee', label: 'Employee' },
];

const PushNotification: React.FC<ProcessCanvasProps> = ({ showView, setShowView, data }) => {
    const role = localStorage.getItem('role');

    const [empName, setEmpName] = useState<string | null>('');
    const [employeeList, setEmployeeList] = useState<Employee[]>([]);
    const [activeButton, setActiveButton] = useState<'group' | 'department' | 'project' | 'employee'>('group');

    const [assignProject, setAssignProject] = useState<AssignProjecttoProcess>({
        id: 0,
        doerIDs: [],
        roleNames: [],
        content: '',
        subject: '',
        createdBy: '',
        updatedBy: empName || '',
    });

    useEffect(() => {
        if (data) {
            setAssignProject({
                id: data.id || 0,
                doerIDs: data.doerIDs || [],
                roleNames: data.roleNames || [],
                subject: data.subject,
                content: data.content,
                createdBy: data.createdBy || '',
                updatedBy: empName || '',
            });
        }
    }, [data, empName]);

    useEffect(() => {
        toast.dismiss();

        const storedEmpName = localStorage.getItem('EmpName');
        const storedEmpID = localStorage.getItem('EmpId');
        if (storedEmpName || storedEmpID) {
            setEmpName(`${storedEmpName} - ${storedEmpID}`);
        }
    }, []);

    const handleClose = () => {
        setShowView(false);
    };

    const handleButtonClick = (buttonName: 'group' | 'department' | 'project' | 'employee') => {
        setActiveButton(buttonName);

        // Optional: Reset selections on button change
        setAssignProject(prevState => ({
            ...prevState,
            doerIDs: buttonName === 'employee' ? prevState.doerIDs : [],
            roleNames: buttonName === 'group' ? prevState.roleNames : [],
        }));
    };

    useEffect(() => {
        const fetchEmployeeList = async () => {
            try {
                const response = await axios.get(`${config.API_URL_APPLICATION}/CommonDropdown/GetEmployeeListWithId`);
                if (response.data.isSuccess) {
                    setEmployeeList(response.data.employeeLists);
                } else {
                    console.error(response.data.message);
                }
            } catch (error) {
                console.error("Error fetching employee list:", error);
            }
        };
        fetchEmployeeList();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const payload = {
            id: assignProject.id,
            subject: assignProject.subject,
            content: assignProject.content,
            attachment: "",
            getDoerDetails: assignProject.doerIDs.map(id => ({
                doerID: id,
                isRead: 0,
                readAt: ""
            })),
            roleNames: assignProject.roleNames,
            createdBy: assignProject.createdBy,
            updatedBy: assignProject.updatedBy
        };
        console.log("Assign Project Payload:", payload);
        try {

            // Uncomment to send data to API
            const apiUrl = `${config.API_URL_APPLICATION}/NotificationMaster/InsertorUpdateNotification`;
            const response = await axios.post(apiUrl, payload);

            if (response.data.isSuccess) {
                toast.success("Doers assigned successfully!");
                setShowView(false);
            } else {
                toast.error(response.data.message || "Failed to assign doers.");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "An error occurred.");
            console.error("Error in handleSubmit:", error);
        }
    };

    const buttonLabels = {
        group: "Group Level",
        department: "Department Level",
        project: "Project Level",
        employee: "Employee Level"
    };

    return (
        <div>
            <Modal className="p-2" show={showView} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title className="text-dark">Send Notification</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {role === 'Admin' && (
                        <>
                            <Col lg={12} className="align-items-end d-flex justify-content-end">
                                <ButtonGroup className="w-100 d-flex">
                                    {Object.entries(buttonLabels).map(([btn, label]) => (
                                        <Button
                                            key={btn}
                                            type="button"
                                            variant={activeButton === btn ? 'primary' : 'outline-primary'}
                                            onClick={() => handleButtonClick(btn as any)}
                                            className="flex-fill"
                                        >
                                            {label}
                                        </Button>
                                    ))}
                                </ButtonGroup>


                            </Col>

                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    {/* Group-Level Selection (Role Names) */}

                                    {activeButton === 'group' && (
                                        <Col lg={12}>
                                            <Form.Group controlId="RoleNames" className="mb-3 mt-2">
                                                <Form.Label>Select Group Roles</Form.Label>
                                                <Select
                                                    name="RoleNames"
                                                    value={roleOptions.filter(role =>
                                                        assignProject.roleNames.includes(role.value)
                                                    )}
                                                    onChange={(selectedOptions) => {
                                                        const selectedRoles = (selectedOptions || []) as { value: string; label: string }[];
                                                        const roleNamesArray = selectedRoles.map(role => role.value);
                                                        setAssignProject({
                                                            ...assignProject,
                                                            roleNames: roleNamesArray,
                                                            doerIDs: [],
                                                        });
                                                    }}
                                                    options={roleOptions}
                                                    isSearchable
                                                    isMulti
                                                    placeholder="Select Roles"
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    )}
                                    {activeButton === 'department' && (
                                        <Col lg={12}>
                                            <Form.Group controlId="RoleNames" className="mb-3 mt-2">
                                                <Form.Label>Select Department Wise</Form.Label>
                                                <Select
                                                    name="RoleNames"
                                                    value={roleOptions.filter(role =>
                                                        assignProject.roleNames.includes(role.value)
                                                    )}
                                                    onChange={(selectedOptions) => {
                                                        const selectedRoles = (selectedOptions || []) as { value: string; label: string }[];
                                                        const roleNamesArray = selectedRoles.map(role => role.value);
                                                        setAssignProject({
                                                            ...assignProject,
                                                            roleNames: roleNamesArray,
                                                            doerIDs: [],
                                                        });
                                                    }}
                                                    options={roleOptions}
                                                    isSearchable
                                                    isMulti
                                                    placeholder="Select Departments"
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    )}
                                    {activeButton === 'project' && (
                                        <Col lg={12}>
                                            <Form.Group controlId="RoleNames" className="mb-3 mt-2">
                                                <Form.Label>Select Project Wise</Form.Label>
                                                <Select
                                                    name="RoleNames"
                                                    value={roleOptions.filter(role =>
                                                        assignProject.roleNames.includes(role.value)
                                                    )}
                                                    onChange={(selectedOptions) => {
                                                        const selectedRoles = (selectedOptions || []) as { value: string; label: string }[];
                                                        const roleNamesArray = selectedRoles.map(role => role.value);
                                                        setAssignProject({
                                                            ...assignProject,
                                                            roleNames: roleNamesArray,
                                                            doerIDs: [],
                                                        });
                                                    }}
                                                    options={roleOptions}
                                                    isSearchable
                                                    isMulti
                                                    placeholder="Select Projects"
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    )}


                                    {activeButton === 'employee' && (
                                        <Col lg={12}>
                                            <Form.Group controlId="Employee" className="mb-3 mt-2">
                                                <Form.Label>Select Employees</Form.Label>
                                                <Select
                                                    name="Employee"
                                                    value={employeeList.filter(emp =>
                                                        assignProject.doerIDs.includes(emp.empId)
                                                    )}
                                                    onChange={(selectedOptions) => {
                                                        const selectedEmployees = (selectedOptions || []) as Employee[];
                                                        const doerIDsArray = selectedEmployees.map(emp => emp.empId);
                                                        setAssignProject({
                                                            ...assignProject,
                                                            doerIDs: doerIDsArray,
                                                            roleNames: [],
                                                        });
                                                    }}
                                                    getOptionLabel={(emp) => emp.employeeName}
                                                    getOptionValue={(emp) => emp.empId}
                                                    options={employeeList}
                                                    isSearchable
                                                    isMulti
                                                    placeholder="Select Employees"
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    )}

                                </Row>

                                <ButtonGroup className="mt-3">
                                    <Button onClick={handleClose} className="me-1">
                                        Cancel
                                    </Button>
                                    <Button type="submit" variant="primary">
                                        Send Notification
                                    </Button>
                                </ButtonGroup>
                            </Form>
                        </>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default PushNotification;
