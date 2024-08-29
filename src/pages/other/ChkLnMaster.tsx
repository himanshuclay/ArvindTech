import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Modal, Form, Table } from 'react-bootstrap';

// Define interfaces for the data
interface AccountProcessTask {
    id: number;
    moduleID: string;
    moduleName: string;
    processID: string;
    processName: string;
    startDate: string;
    task_Json: string;
    task_Number: string;
}

interface Employee {
    empID: string;
    empName: string;
}

interface Module {
    id: number;
    moduleID: string;
    moduleName: string;
}

interface Process {
    processID: string;
    processName: string;
    moduleId: string;
    moduleName: string;
}

interface Role {
    id: number;
    roleName: string;
    module: string;
}

const AccountProcessTable: React.FC = () => {
    const [tasks, setTasks] = useState<AccountProcessTask[]>([]);
    const [modules, setModules] = useState<Module[]>([]);
    const [processes, setProcesses] = useState<Process[]>([]);
    const [selectedModule, setSelectedModule] = useState<string>('');
    const [selectedProcess, setSelectedProcess] = useState<string>('');
    const [showModal, setShowModal] = useState(false);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [selectedTask, setSelectedTask] = useState<AccountProcessTask | null>(null);
    const [selectedEmployee, setSelectedEmployee] = useState<string>('');
    const [selectedRole, setSelectedRole] = useState<number | null>(null);
    const [projects, setProjects] = useState<{ id: string; projectName: string }[]>([]);
    const [selectedProject, setSelectedProject] = useState<string>('');
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [assignedTasks, setAssignedTasks] = useState<Map<number, { employeeId: string, roleName: string }>>(new Map());

    // Fetch Modules
    useEffect(() => {
        const fetchModules = async () => {
            try {
                const response = await axios.get('https://arvindo-api2.clay.in/api/CommonDropdown/GetModuleList');
                if (response.data.isSuccess) {
                    setModules(response.data.moduleNameListResponses);
                }
            } catch (error) {
                console.error('Error fetching modules', error);
            }
        };
        fetchModules();
    }, []);

    // Fetch Processes based on selected module
    useEffect(() => {
        if (selectedModule) {
            const fetchProcesses = async () => {
                try {
                    const response = await axios.get(`https://arvindo-api2.clay.in/api/CommonDropdown/GetProcessNameByModuleName?ModuleName=${selectedModule}`);
                    if (response.data.isSuccess) {
                        setProcesses(response.data.processListResponses);
                    }
                } catch (error) {
                    console.error('Error fetching processes', error);
                }
            };
            fetchProcesses();
        }
    }, [selectedModule]);

    // Fetch Tasks based on selected module and process
    useEffect(() => {
        if (selectedModule && selectedProcess) {
            const fetchTasks = async () => {
                try {
                    const response = await axios.get(`https://arvindo-api.clay.in/api/AccountModule/GetAccountProcessTaskByIds?ModuleId=ACC&ProcessId=${selectedProcess}`);
                    if (response.data.isSuccess) {
                        setTasks(response.data.getAccountProcessTaskByIds);
                    }
                } catch (error) {
                    console.error('Error fetching tasks', error);
                }
            };
            fetchTasks();
        }
    }, [selectedModule, selectedProcess]);

    // Fetch Employees and Roles when assigning task
    const handleAssignClick = async (task: AccountProcessTask) => {
        setSelectedTask(task);
        try {
            const roleResponse = await axios.get('https://arvindo-api2.clay.in/api/RoleMaster/GetRole?PageIndex=1');
            if (roleResponse.data.isSuccess) {
                setRoles(roleResponse.data.roleMasterListResponses);
                setShowModal(true);
            }
        } catch (error) {
            console.error('Error fetching roles', error);
        }
    };

    // Fetch Doers based on the selected role
    const handleRoleChange = async (roleId: number) => {
        setSelectedRole(roleId);
        try {
            const selectedRoleName = roles.find((role) => role.id === roleId)?.roleName;
            if (selectedRoleName) {
                const doerResponse = await axios.get(`https://arvindo-api2.clay.in/api/CommonDropdown/GetDoerListbyRole?DoerRole=${selectedRoleName}`);
                if (doerResponse.data.isSuccess) {
                    setEmployees(doerResponse.data.doerListResponses);
                } else {
                    console.error('Failed to fetch doers');
                }
            }
        } catch (error) {
            console.error('Error fetching doers', error);
        }
    };

    const handleAssign = () => {
        if (selectedTask && selectedEmployee && selectedRole !== null) {
            const roleName = roles.find((role) => role.id === selectedRole)?.roleName || '';
            
            // Update assignedTasks state
            setAssignedTasks(new Map(assignedTasks).set(selectedTask.id, { employeeId: selectedEmployee, roleName }));

            // Show the payload in an alert
            alert(`Payload: ${JSON.stringify({
                id:'string',
                moduleID: selectedTask.moduleID,
                moduleName: selectedTask.moduleName,
                processID: selectedTask.processID,
                processName: selectedTask.processName,
                roleName,
                doerId: selectedEmployee,
                doerName: employees.find((employee) => employee.empID === selectedEmployee)?.empName || '', // Get employee name based on empID
                task_Number: selectedTask.task_Number,
                task_Json: selectedTask.task_Json,
                task_Status: true,
                createdBy: 'sameer hussain',
                updatedBy: "sameer hussain"

            }, null, 2)}`);

            // Now proceed with the API request
            const assignTask = async () => {
                try {
                    const response = await axios.post('https://arvindo-api.clay.in/api/AccountModule/TaskAssignRoleWithDoer', {
                        id:'string',
                        moduleID: selectedTask.moduleID,
                        moduleName: selectedTask.moduleName,
                        processID: selectedTask.processID,
                        processName: selectedTask.processName,
                        roleName,
                        doerId: selectedEmployee,
                        doerName: employees.find((employee) => employee.empID === selectedEmployee)?.empName || '', // Get employee name based on empID
                        task_Number: selectedTask.task_Number,
                        task_Json: selectedTask.task_Json,
                        task_Status: true,
                        createdBy: 'sameer hussain',
                        updatedBy: "sameer hussain"

                    });
                    if (response.data.isSuccess) {
                        console.log('Task assigned successfully');
                    } else {
                        console.error('Failed to assign task');
                    }
                } catch (error) {
                    console.error('Error assigning task', error);
                }
            };
            assignTask();
        }
        setShowModal(false);
    };

    const handleApplyProcessToProject = async () => {
        if (selectedProject && selectedTask) {
            const payload = {
                projectId: selectedProject,
                projectName: projects.find((project) => project.id === selectedProject)?.projectName || '',
                moduleId: selectedTask.moduleID,
                processId: selectedTask.processID,
                createdBy: 'sameer',
            }

            // Show the payload in an alert
            alert(`Payload: ${JSON.stringify(payload, null, 2)}`);

            // Proceed with the API request
            try {
                const response = await axios.post('https://arvindo-api.clay.in/AccountModule/ProcessAssignWithProject', payload);
                if (response.data.isSuccess) {
                    console.log('Process assigned to project successfully');
                } else {
                    console.error('Failed to assign process to project');
                }
            } catch (error) {
                console.error('Error assigning process to project', error);
            }

            setShowApplyModal(false);
        } else {
            alert('Please select a project and task before applying.');
        }
    }

    // Fetch Projects
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get('https://arvindo-api2.clay.in/api/CommonDropdown/GetProjectList');
                if (response.data.isSuccess) {
                    setProjects(response.data.projectListResponses);
                }
            } catch (error) {
                console.error('Error fetching projects', error);
            }
        };
        fetchProjects();
    }, []);

    return (
        <div>
            <div className="d-flex p-2 bg-white mt-2 mb-2 rounded shadow">Apply Process on Project</div>
            <div className="row m-0 align-items-end bg-white p-3 rounded shadow">
                <Form.Group className="col-md-3 my-1" controlId="moduleSelect">
                    <Form.Label>Select Module</Form.Label>
                    <Form.Control
                        as="select"
                        value={selectedModule}
                        onChange={(e) => setSelectedModule(e.target.value)}
                    >
                        <option value="">Select a module</option>
                        {modules.map((module) => (
                            <option key={module.moduleID} value={module.moduleName}>
                                {module.moduleName}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="processSelect" className="col-md-3 my-1">
                    <Form.Label>Select Process</Form.Label>
                    <Form.Control
                        as="select"
                        value={selectedProcess}
                        onChange={(e) => setSelectedProcess(e.target.value)}
                        disabled={!selectedModule}
                    >
                        <option value="">Select a process</option>
                        {processes.map((process) => (
                            <option key={process.processID} value={process.processID}>
                                {process.processName}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Form.Group className="col-md-3 my-1">
                    <Form.Label>Select Project</Form.Label>
                    <Form.Control
                        as="select"
                        value={selectedProject}
                        onChange={(e) => setSelectedProject(e.target.value)}
                    >
                        <option value="">Select a project</option>
                        {projects.map((project) => (
                            <option key={project.id} value={project.id}>
                                {project.projectName}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Button
                    className="col-md-3 mb-1"
                    variant="primary"
                    onClick={() => setShowApplyModal(true)}
                    disabled={!selectedProject}
                    title='Please assign doer to every Task'
                >
                    Apply Process to Project
                </Button>
            </div>
            <Table className="bg-white mt-4" striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Module ID</th>
                        <th>Module Name</th>
                        <th>Process ID</th>
                        <th>Process Name</th>
                        <th>Start Date</th>
                        <th>Task Number</th>
                        <th>Role Name</th>
                        <th>Doer Name</th>
                        <th>Assign</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task) => {
                        const assignedTask = assignedTasks.get(task.id);
                        return (
                            <React.Fragment key={task.id}>
                                <tr>
                                    <td>{task.id}</td>
                                    <td>{task.moduleID}</td>
                                    <td>{task.moduleName}</td>
                                    <td>{task.processID}</td>
                                    <td>{task.processName}</td>
                                    <td>{new Date(task.startDate).toLocaleString()}</td>
                                    <td>{task.task_Number}</td>
                                    <td>{assignedTask?.roleName || 'N/A'}</td>
                                    <td>{employees.find(emp => emp.empID === assignedTask?.employeeId) ? employees.find(emp => emp.empID === assignedTask?.employeeId)?.empName : 'NA'}</td>
                                    <td>
                                        <Button onClick={() => handleAssignClick(task)}>Assign</Button>
                                    </td>
                                </tr>
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Assign Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="roleSelect" className="mt-3">
                            <Form.Label>Select Role</Form.Label>
                            <Form.Control
                                as="select"
                                value={selectedRole !== null ? selectedRole : ''}
                                onChange={(e) => handleRoleChange(Number(e.target.value))}
                            >
                                <option value="">Select a role</option>
                                {roles.map((role) => (
                                    <option key={role.id} value={role.id}>
                                        {role.roleName}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="employeeSelect">
                            <Form.Label>Select Employee</Form.Label>
                            <Form.Control
                                as="select"
                                value={selectedEmployee}
                                onChange={(e) => setSelectedEmployee(e.target.value)}
                            >
                                <option value="">Select an employee</option>
                                {employees.map((employee) => (
                                    <option key={employee.empID} value={employee.empID}>
                                        {employee.empName}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleAssign}>
                        Assign
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showApplyModal} onHide={() => setShowApplyModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Apply Process to Project</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>You have selected project: {selectedProject}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowApplyModal(false)}>
                        Close
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleApplyProcessToProject}
                    >
                        Apply
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default AccountProcessTable;