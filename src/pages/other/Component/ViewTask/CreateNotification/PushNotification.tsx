import { Form, Button, Modal, Row, Col, ButtonGroup } from "react-bootstrap";
import { useEffect, useState } from "react";
import Select from 'react-select';
import { toast } from "react-toastify";
import config from "@/config";
import axios from "axios";

interface ProcessCanvasProps {
    showView: boolean;
    setShowView: (show: boolean) => void;
    data: AssignProjecttoProcess | any;  // Ensure `data` can be `null`
}

interface AssignProjecttoProcess {
    id: number;
    doerIDs: { doerID: string, isRead: number, readAt: string }[];  // Update this to be an array of objects with the necessary properties
    roleNames: string[];
    content: string;
    levelType: string;
    subject: string;
    createdBy: string;
    updatedBy: string;
}


interface DepartmentOrProject {
    name: string;
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
    console.log(data)

    const [empName, setEmpName] = useState<string | null>('');
    const [employeeList, setEmployeeList] = useState<Employee[]>([]);
    const [activeButton, setActiveButton] = useState<'Group' | 'Department' | 'Project' | 'Employee'>('Group');

    const [departmentList, setDepartmentList] = useState<DepartmentOrProject[]>([]);
    const [projectList, setProjectList] = useState<DepartmentOrProject[]>([]);

    const [assignProject, setAssignProject] = useState<AssignProjecttoProcess>({
        id: 0,
        doerIDs: [],
        roleNames: [],
        content: '',
        levelType: '',
        subject: '',
        createdBy: '',
        updatedBy: '',
    });


    const [isNotificationPublished, setIsNotificationPublished] = useState<boolean>(false);

    useEffect(() => {
        if (data) {
            const dataLevel = data.levelType as 'Group' | 'Department' | 'Project' | 'Employee';
            setActiveButton(dataLevel);
            setAssignProject({
                ...data,
                updatedBy: empName || '',
            });

            const isPublished = data.doerIDs.length > 0;
            setIsNotificationPublished(isPublished);  // This controls if buttons should be active or disabled
        } else {
            setActiveButton('Group');
            setAssignProject(prev => ({
                ...prev,
                levelType: 'Group',
                updatedBy: empName || '',
            }));
        }
    }, [data, empName]);


    useEffect(() => {
        if (!data) {
            setAssignProject(prev => ({
                ...prev,
                levelType: activeButton,
            }));
        }
    }, [empName, activeButton]);


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

    const handleButtonClick = (buttonName: 'Group' | 'Department' | 'Project' | 'Employee') => {
        setActiveButton(buttonName);

        setAssignProject(prevState => ({
            ...prevState,
            levelType: buttonName,
            doerIDs: [],
            roleNames: [],
        }));
    };


    useEffect(() => {
        const fetchData = async (endpoint: string, setter: Function, listName: string) => {
            try {
                const response = await axios.get(`${config.API_URL_APPLICATION}/${endpoint}`);
                if (response.data.isSuccess) {
                    setter(response.data[listName]);
                } else {
                    console.error(response.data.message);
                }
            } catch (error) {
                console.error(`Error fetching data from ${endpoint}:`, error);
            }
        };
        fetchData('CommonDropdown/GetEmployeeListWithId', setEmployeeList, 'employeeLists');
        fetchData('NotificationMaster/GetDepartmentorProjectList?Flag=2', setProjectList, 'getDepartmentorProjectLists');
        fetchData('NotificationMaster/GetDepartmentorProjectList?Flag=1', setDepartmentList, 'getDepartmentorProjectLists');
    }, []);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const payload = {
            id: assignProject.id,
            subject: assignProject.subject,
            content: assignProject.content,
            attachment: "",
            getDoerDetails: assignProject.doerIDs.map(id => ({
                doerID: id.doerID,
                isRead: id.isRead,
                readAt: id.readAt,
            })),
            levelType: assignProject.levelType,
            roleNames: assignProject.roleNames,
            createdBy: assignProject.createdBy,
            updatedBy: assignProject.updatedBy
        };
        console.log("Assign Project Payload:", payload);
        try {

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
        Group: "Group Level",
        Department: "Department Level",
        Project: "Project Level",
        Employee: "Employee Level"
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
                            {/* <Col lg={12} className="align-items-end d-flex justify-content-end">
                                <ButtonGroup className="w-100 d-flex">
                                    {Object.entries(buttonLabels).map(([btn, label]) => {
                                        const isActive = activeButton === btn;
                                        return (
                                            <Button
                                                key={btn}
                                                type="button"
                                                variant={isActive ? 'primary' : 'outline-primary'}
                                                onClick={() => handleButtonClick(btn as 'Group' | 'Department' | 'Project' | 'Employee')}
                                                className="flex-fill"
                                                disabled={isActive || (data?.doerIDs && data.doerIDs.length > 0 && data.levelType !== btn)}  // Disable if it doesn't match levelType or doerIDs length is greater than 0
                                            >
                                                {label}
                                            </Button>
                                        );
                                    })}
                                </ButtonGroup>
                            </Col> */}
                            <Col lg={12} className="align-items-end d-flex justify-content-end">
                                <ButtonGroup className="w-100 d-flex">
                                    {Object.entries(buttonLabels).map(([btn, label]) => {
                                        return (
                                            <Button
                                                key={btn}
                                                type="button"
                                                variant={activeButton === btn && !isNotificationPublished ? 'primary' : 'outline-primary'}
                                                onClick={() => handleButtonClick(btn as 'Group' | 'Department' | 'Project' | 'Employee')}
                                                className="flex-fill"
                                                disabled={isNotificationPublished && activeButton !== btn}
                                            >
                                                {label}
                                            </Button>
                                        );
                                    })}
                                </ButtonGroup>
                            </Col>

                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    {activeButton === 'Group' && !isNotificationPublished && (
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
                                    {activeButton === 'Department' && !isNotificationPublished && (
                                        <Col lg={12}>
                                            <Form.Group controlId="DepartmentList" className="mb-3 mt-2">
                                                <Form.Label>Select Department(s)</Form.Label>
                                                <Select
                                                    name="Departments"
                                                    value={departmentList.filter(dept => assignProject.roleNames.includes(dept.name))}
                                                    onChange={(selectedOptions) => {
                                                        const selectedDepts = selectedOptions as unknown as { name: string }[];
                                                        const doerIDsArray = selectedDepts.map(dept => dept.name);
                                                        setAssignProject({
                                                            ...assignProject,
                                                            roleNames: doerIDsArray,
                                                            doerIDs: [],
                                                        });
                                                    }}
                                                    getOptionLabel={(dept) => dept.name}
                                                    getOptionValue={(dept) => dept.name}
                                                    options={departmentList}
                                                    isSearchable
                                                    isMulti
                                                    placeholder="Select Departments"
                                                    required
                                                />

                                            </Form.Group>
                                        </Col>
                                    )}

                                    {activeButton === 'Project' && !isNotificationPublished && (
                                        <Col lg={12}>
                                            <Form.Group controlId="ProjectList" className="mb-3 mt-2">
                                                <Form.Label>Select Project(s)</Form.Label>
                                                <Select
                                                    name="Projects"
                                                    value={projectList.filter(project => assignProject.roleNames.includes(project.name))}
                                                    onChange={(selectedOptions) => {
                                                        const selectedProjects = selectedOptions as unknown as { name: string }[];
                                                        const doerIDsArray = selectedProjects.map(project => project.name);
                                                        setAssignProject({
                                                            ...assignProject,
                                                            roleNames: doerIDsArray,
                                                            doerIDs: [],
                                                        });
                                                    }}
                                                    getOptionLabel={(proj) => proj.name}
                                                    getOptionValue={(proj) => proj.name}
                                                    options={projectList}
                                                    isSearchable
                                                    isMulti
                                                    placeholder="Select Projects"
                                                    required
                                                />

                                            </Form.Group>
                                        </Col>
                                    )}

                                    {activeButton === 'Employee' && !isNotificationPublished && (
                                        <Col lg={12}>
                                            <Form.Group controlId="Employee" className="mb-3 mt-2">
                                                <Form.Label>Select Employees</Form.Label>
                                                <Select
                                                    name="Employee"
                                                    value={employeeList.filter(emp =>
                                                        assignProject.doerIDs.some(doer => doer.doerID === emp.empId)  // Check if employee is selected
                                                    )}
                                                    onChange={(selectedOptions) => {
                                                        const selectedEmployees = (selectedOptions || []) as Employee[];
                                                        const doerIDsArray = selectedEmployees.map(emp => ({
                                                            doerID: emp.empId,
                                                            isRead: 0,  // Default value for "isRead"
                                                            readAt: "",  // Default value for "readAt"
                                                        }));
                                                        setAssignProject({
                                                            ...assignProject,
                                                            doerIDs: doerIDsArray,
                                                            roleNames: [],  // Reset roleNames when selecting employees
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
                                <div>
                                    <h5 className="my-4">Published Notifications: {data?.levelType}-Level</h5>
                                    <div className="list-group">
                                        {data && data.doerIDs && data.doerIDs.length > 0 ? (
                                            data.doerIDs.map((doer: any, index: any) => (
                                                <div
                                                    key={index}
                                                    className="list-group-item d-flex justify-content-between align-items-center shadow-sm p-2 mb-2 bg-light rounded"
                                                >
                                                    <div>
                                                        <strong>Doer ID: </strong>
                                                        <span>{doer?.doerID}</span>
                                                    </div>
                                                    <div>
                                                        <strong>Status: </strong>
                                                        <span className={doer?.isRead !== 0 ? "text-success" : "text-danger"}>
                                                            {doer?.isRead !== 0 ? "Read" : "UnRead"}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <strong>Read At: </strong>
                                                        <span>{doer?.readAt || "Not read yet"}</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="alert alert-warning">No published notifications found.</div>
                                        )}
                                    </div>
                                </div>

                                <ButtonGroup className="mt-3">
                                    <Button onClick={handleClose} className="me-1">
                                        Cancel
                                    </Button>
                                    {
                                        !isNotificationPublished && (
                                            <Button type="submit" variant="primary">
                                                Send Notification
                                            </Button>
                                        )
                                    }
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
