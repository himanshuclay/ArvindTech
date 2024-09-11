import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Modal, Form, Table } from 'react-bootstrap';
import Select from 'react-select'; // Make sure you have this or the appropriate select component imported

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
    finishPoint: string;
    roleId: string;
    roleName: string;
}

interface Employee {
    empID: string;
    empName: string;
    employeeName: string;
    empId: string;

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
    // const [Status, setStatus] = useState<number | null>(1);
    const [projects, setProjects] = useState<{ id: string; projectName: string }[]>([]);
    const [selectedProject, setSelectedProject] = useState<string>('');
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [assignedTasks, setAssignedTasks] = useState<Map<number, { employeeId: string, roleId: number }>>(new Map());
    const [filteredJson, setFilteredJson] = useState<FilteredJsonType | null>(null);

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

    interface Option {
        id: string;
        label: string;
        color: string;
    }

    interface FilteredJsonType {
        inputId: string;
        type: string;
        label: string;
        placeholder: string;
        options: Option[];
        required: boolean;
        conditionalFieldId: string;
        value: string;
    }

    interface ModalFormProps {
        showModalone: boolean;
        handleClose: () => void;
        filteredJson: FilteredJsonType | null;
    }

    interface Option {
        id: string;
        label: string;
        color: string;
    }

    interface FilteredJsonType {
        inputId: string;
        type: string;
        label: string;
        placeholder: string;
        options: Option[];
        required: boolean;
        conditionalFieldId: string;
        value: string;
    }

    interface ModalFormProps {
        showModalone: boolean;
        handleClose: () => void;
        filteredJson: FilteredJsonType | null;
    }



    const ModalForm = ({ showModalone, handleClose, filteredJson }: ModalFormProps) => {
        // State to store task numbers for each option

        // Handle change for task numbers
        const [selectedTaskNumbers, setSelectedTaskNumbers] = useState<{ [key: string]: string }>({});

        // Handle change for task number selection
        const handleTaskNumberChange = (optionId: string, value: string) => {
            setSelectedTaskNumbers(prevState => ({
                ...prevState,
                [optionId]: value
            }));
        };

        const [taskTiming, setTaskTiming] = useState<{ [key: string]: string }>({});
        const [daySelection, setDaySelection] = useState<{ [key: string]: string }>({});
        const [weekdaySelection, setWeekdaySelection] = useState<{ [key: string]: string[] }>({});
        const [selectedTaskTypes, setSelectedTaskTypes] = useState<{ [key: string]: string }>({});


        const handleTaskTimingChange = (optionId: string, timingType: string) => {
            setTaskTiming(prev => ({ ...prev, [optionId]: timingType }));
        };

        const handleDaySelectionChange = (optionId: string, value: string) => {
            setDaySelection(prev => ({ ...prev, [optionId]: value }));
        };

        const handleTaskTypeChange = (optionId: string, value: string) => {
            setSelectedTaskTypes(prevState => ({
                ...prevState,
                [optionId]: value
            }));
        };

        const handleWeekdaySelectionChange = (optionId: string, selectedWeekdays: string[]) => {
            setWeekdaySelection(prev => ({ ...prev, [optionId]: selectedWeekdays }));
        };


        // Handle form submission
        const handleSaveChanges = async () => {
            const payload = filteredJson.options.map(option => ({
                optionId: option.id,
                taskNumber: selectedTaskNumbers[option.id] || null,
                taskTiming: taskTiming[option.id] || null,
                taskType: selectedTaskTypes[option.id] || null, // Include Task Type here
                daySelection: taskTiming[option.id] === 'day' ? daySelection[option.id] || null : null,
                weekdaySelection: taskTiming[option.id] === 'weekday' ? weekdaySelection[option.id] || [] : []
            }));
            console.log(payload)

            try {
                const response = await axios.post('https://your-api-endpoint.com/api/saveTaskData', payload);
                console.log("Data successfully posted.");
                handleClose();
            } catch (error) {
                console.error("Error posting data:", error);
            }
        };

        return (
            <Modal size="lg" show={showModalone} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Conditions Form</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {filteredJson ? (
                        <>
                            <form className='form-group'>
                                <label>{filteredJson.label}</label>
                                <select className='form-control'>
                                    {filteredJson.options.map(option => (
                                        <option key={option.id} value={option.id} style={{ color: option.color }}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>

                                {filteredJson.options.map(option => (
                                    <div className='form-group row' key={option.id} style={{ marginTop: '10px' }}>
                                        <div className="col-4">
                                            <label>
                                                Select Successor Task For <span style={{ color: option.color }}>{option.label}</span>
                                            </label>
                                            <select
                                                className='form-control'
                                                value={selectedTaskNumbers[option.id] || ''}
                                                onChange={(e) => handleTaskNumberChange(option.id, e.target.value)}
                                            >
                                                <option value="" disabled>Select Task Number</option>
                                                {tasks.map(task => (
                                                    <option key={task.id} value={task.task_Number}>
                                                        {task.task_Number}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-4">
                                            <label htmlFor="">Task Type</label>
                                            <select
                                                className='form-control'
                                                value={selectedTaskTypes[option.id] || ''}
                                                onChange={(e) => handleTaskTypeChange(option.id, e.target.value)}
                                            >
                                                <option value="" disabled>Select task type</option>
                                                <option value="Actual">Actual</option>
                                                <option value="Planned">Planned</option>
                                            </select>
                                        </div>

                                        {/* Toggle button for Task Timing */}
                                        <div className="form-group col-4" style={{ marginTop: '10px' }}>
                                            <label>Task Timing</label>
                                            <div>
                                                <button
                                                    type="button"
                                                    className={`toggle-btn ${taskTiming[option.id] === 'day' ? 'active-btn' : 'normal-btn'}`}
                                                    onClick={() => handleTaskTimingChange(option.id, 'day')}
                                                >
                                                    Day
                                                </button>
                                                <button
                                                    type="button"
                                                    className={`toggle-btn ${taskTiming[option.id] === 'weekday' ? 'active-btn' : 'normal-btn'}`}
                                                    onClick={() => handleTaskTimingChange(option.id, 'weekday')}
                                                >
                                                    Weekday
                                                </button>
                                            </div>

                                            {/* Conditional rendering for Day or Weekday selection */}
                                            {taskTiming[option.id] === 'day' ? (
                                                <div style={{ marginTop: '10px' }}>
                                                    <label>Enter number of days</label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        value={daySelection[option.id] || ''}
                                                        onChange={(e) => handleDaySelectionChange(option.id, e.target.value)}
                                                        min="1"
                                                        placeholder="Enter days"
                                                    />
                                                </div>
                                            ) : taskTiming[option.id] === 'weekday' ? (
                                                <div style={{ marginTop: '10px' }}>
                                                    <label>Select weekdays</label>
                                                    <select
                                                        className="form-control"
                                                        multiple
                                                        value={weekdaySelection[option.id] || []}
                                                        onChange={(e) =>
                                                            handleWeekdaySelectionChange(
                                                                option.id,
                                                                Array.from(e.target.selectedOptions, option => option.value)
                                                            )
                                                        }
                                                    >
                                                        <option value="mon">Monday</option>
                                                        <option value="tue">Tuesday</option>
                                                        <option value="wed">Wednesday</option>
                                                        <option value="thu">Thursday</option>
                                                        <option value="fri">Friday</option>
                                                        <option value="sat">Saturday</option>
                                                        <option value="sun">Sunday</option>
                                                    </select>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                ))}
                            </form>
                        </>
                    ) : (
                        <p>No data found for the selected inputId.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveChanges}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

        );
    };

    const [showModalone, setShowModalone] = useState(false);

    // Function to handle opening the modal
    // Fetch the related JSON when the modal is opened
    useEffect(() => {
        if (showModalone && selectedTask) {
            fetchJsonByInputId(selectedTask);
            console.log(selectedTask)
        }
    }, [showModalone, selectedTask]);

    const handleShow = async (task: AccountProcessTask) => {
        setSelectedTask(task);
        console.log(selectedTask) // Set the clicked task
        setShowModalone(true);
    };

    const handleClose = () => setShowModalone(false);


    const fetchJsonByInputId = async (task: AccountProcessTask) => {
        if (tasks.length > 0) {
            const taskWithJson = tasks.find(t => t.id === task.id && t.finishPoint); // Get the task that has a finishPoint
            console.log("Task with finishPoint:", taskWithJson);

            if (taskWithJson) {
                try {
                    // Parse the task_Json from string to an object
                    const taskJsonParsed = JSON.parse(taskWithJson.task_Json);
                    console.log("Parsed task_Json:", taskJsonParsed);

                    // Access the 'inputs' array from the parsed JSON
                    const inputsArray = taskJsonParsed.inputs;

                    console.log("Inputs array:", inputsArray);
                    console.log("Finish Point:", taskWithJson.finishPoint);

                    // Debug each comparison
                    const inputField = inputsArray.find((field: any) => String(field.inputId) === String(taskWithJson.finishPoint));


                    console.log("Found inputField:", taskWithJson.finishPoint);

                    // If inputField is found, set it to the state
                    setFilteredJson(inputField || null);
                } catch (error) {
                    console.error("Error parsing task_Json:", error);
                }
            }
        }
    };



    // Fetch the related JSON when the modal is opened
    useEffect(() => {
        if (showModalone && selectedTask) {
            fetchJsonByInputId(selectedTask);
        }
    }, [showModalone, selectedTask]);

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
                        console.log(tasks)
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
        setSelectedEmployee(assignedTasks.get(task.id)?.employeeId || '');
        setSelectedRole(assignedTasks.get(task.id)?.roleId || null);

        try {
            const roleResponse = await axios.get('https://arvindo-api2.clay.in/api/RoleMaster/GetRole?PageIndex=1');
            if (roleResponse.data.isSuccess) {
                setRoles(roleResponse.data.roleMasterListResponses);
                setShowModal(true);
                console.log(roles)
            }
        } catch (error) {
            console.error('Error fetching roles', error);
        }
    };

    // Fetch Doers based on the selected role
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get(`https://arvindo-api2.clay.in/api/CommonDropdown/GetEmployeeListWithId`);
                if (response.data.isSuccess) {
                    setEmployees(response.data.employeeLists);
                } else {
                    console.error("Failed to fetch employees");
                }
            } catch (error) {
                console.error("Error fetching employees:", error);
            }
        };

        fetchEmployees();
    }, []);

    const handleAssign = () => {
        if (selectedTask && selectedEmployee) {
            // Find the selected employee object to get the employee name
            const selectedEmployeeObj = employees.find(emp => emp.empId === selectedEmployee);

            if (!selectedEmployeeObj) {
                console.error('Selected employee not found.');
                return;
            }

            // Update assignedTasks for each task uniquely
            if (selectedRole !== null) {
                setAssignedTasks(
                    new Map(assignedTasks).set(selectedTask.id, {
                        employeeId: selectedEmployee,
                        roleId: selectedRole,
                    })
                );
            }

            // Prepare the payload to be submitted
            const payload = {
                id: "", // Ensure this ID matches the task
                moduleID: selectedTask.moduleID,
                moduleName: selectedTask.moduleName,
                processID: selectedTask.processID,
                processName: selectedTask.processName,
                roleName: selectedTask.roleName, // Use role name from selected task
                roleId: selectedTask.roleId,
                doerId: selectedEmployee, // The employee ID assigned to this task
                doerName: selectedEmployeeObj.employeeName, // Use employeeName from the selected object
                task_Number: selectedTask.task_Number,
                task_Json: selectedTask.task_Json,
                task_Status: true, // Set task status as true (active or assigned)
                createdBy: 'sameer hussain',
                updatedBy: 'sameer hussain',
            };

            // Log the payload to the console before submission
            console.log('Payload:', payload);

            // Now proceed with the API request
            const assignTask = async () => {
                try {
                    const response = await axios.post('https://arvindo-api.clay.in/api/AccountModule/TaskAssignRoleWithDoer', payload);

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
        } else {
            console.error('Please select a task and an employee before assigning.');
        }

        setShowModal(false); // Close the modal after assignment
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

            try {
                const response = await axios.post('https://arvindo-api2.clay.in/api/AccountModule/ProcessAssignWithProject', payload);
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
            </div>

            <div className="d-flex p-2 bg-white mt-3 rounded shadow">Task List</div>
            <div className="bg-white p-3 rounded shadow">
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Module</th>
                            <th>Process</th>
                            <th>Task Number</th>
                            <th>Role Name</th>
                            <th>Doer Name</th>
                            {/* <th>Action</th> */}
                            <th>conditions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task, index) => {
                            // const assignedTask = assignedTasks.get(task.id);
                            // const doerName = assignedTask ? employees.find((employee) => employee.empID === assignedTask.employeeId)?.empName : 'Select Doer';

                            return (
                                <tr key={task.id}>
                                    <td>{index + 1}</td>
                                    <td>{task.moduleName}</td>
                                    <td>{task.processName}</td>
                                    <td>{task.task_Number}</td>
                                    <td>{task.roleName}</td>
                                    {/* <td>{doerName}</td> */}
                                    <td>
                                        <Button
                                            variant="primary"
                                            onClick={() => handleAssignClick(task)}
                                        >
                                            Assign Role & Employee
                                        </Button>
                                    </td>
                                    <td>
                                        <Button variant='primary' onClick={() => handleShow(task)}>
                                            Conditions
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>

                </Table>
            </div>

            <ModalForm
                showModalone={showModalone}
                handleClose={handleClose}
                filteredJson={filteredJson}
            />

            {/* <Modal show={showModalone} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Conditions Form</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {filteredJson ? (
                        <pre>{JSON.stringify(filteredJson, null, 2)}</pre>
                    ) : (
                        <p>No data found for the selected inputId.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal> */}


            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Assign Role and Employee</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mt-3">
                        <Form.Label>Assign Employee</Form.Label>
                        <Select
                            value={employees
                                .map(employee => ({ value: employee.empId, label: employee.employeeName }))
                                .find(option => option.value === selectedEmployee)
                            }
                            onChange={(selectedOption) => {
                                if (selectedOption) {
                                    // When an employee is selected, update state and log details
                                    setSelectedEmployee(selectedOption.value);  // selectedOption.value is guaranteed to be a string
                                    const selectedEmployeeObj = employees.find(emp => emp.empId === selectedOption.value);
                                    if (selectedEmployeeObj) {
                                        console.log(`Selected Employee ID: ${selectedEmployeeObj.empId}, Name: ${selectedEmployeeObj.employeeName}`);
                                        localStorage.setItem("selectedEmpId", selectedEmployeeObj.empId);
                                        localStorage.setItem("selectedEmpName", selectedEmployeeObj.employeeName);
                                    }
                                }
                            }}

                            options={employees.map(employee => ({
                                value: employee.empId,
                                label: employee.employeeName,
                            }))}
                            placeholder="Select an employee"
                            isSearchable // Enable search functionality
                        />
                    </Form.Group>
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



            {/* Apply Process to Project */}
            <div className="bg-white p-3 rounded shadow">
                <Button variant="primary" onClick={() => setShowApplyModal(true)}>
                    Apply Process to Project
                </Button>
                <Modal show={showApplyModal} onHide={() => setShowApplyModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Apply Process to Project</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group controlId="projectSelect">
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
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowApplyModal(false)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleApplyProcessToProject}>
                            Apply
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default AccountProcessTable;