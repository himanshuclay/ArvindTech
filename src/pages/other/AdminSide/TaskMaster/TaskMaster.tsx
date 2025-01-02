import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Form, Table, Alert, Container, Row, Col, Modal, Pagination } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Link } from 'react-router-dom';
import config from '@/config';
import Select from 'react-select';
import TaskCondition from './Taskcondition';
import DynamicForm from '../../Component/DynamicForm';
import { toast } from 'react-toastify';

// Interfaces for the data
interface Task {
    id: number;
    moduleID: string;
    moduleName: string;
    processID: string;
    processName: string;
    roleId: string;
    roleName: string;
    task_Json: string;
    task_Number: string;
    task_Status: number;
    taskType: string;
    problem_Solver: string;
    finishPoint: number;
    condition_Json: string;
    isExpired: number;
    template_Json: string;
    condition_Template_Json: string;
    approval_Console: string;
    approvalConsoleDoerID: string;
    approvalConsoleDoerName: string;
    approvalConsoleInputID: number;
    createdBy: string;
    createdDate: string;
    updatedBy: string;
    updatedDate: string;
    task_Name: string;
}

interface Employee {
    employeeName: string;
    empId: string;
}


interface Module {
    moduleID: string;
    moduleName: string;
}

interface Process {
    processID: string;
    processName: string;
}

interface Column {
    id: string;
    label: string;
    visible: boolean;
}

const TaskMaster: React.FC = () => {
    const role = localStorage.getItem('role');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [taskID, setTaskID] = useState<number>(0);
    const [taskNumber, setTaskNumber] = useState<string>('');
    const [modules, setModules] = useState<Module[]>([]);
    const [processes, setProcesses] = useState<Process[]>([]);
    const [selectedModule, setSelectedModule] = useState<string>('');
    const [selectedModuleId, setSelectedModuleId] = useState<string>('');
    const [selectedProcess, setSelectedProcess] = useState<string>('');
    const [show, setShow] = useState(false);
    const [selectedJson, setSelectedJson] = useState<string>(''); // State for JSON display
    const [showJsonModal, setShowJsonModal] = useState(false); // State to show/hide JSON modal
    const [taskIdToEdit, setTaskIdToEdit] = useState<any | null>(null);
    const [problemSolver, setProblemSolver] = useState<string>('');
    const [employeeList, setEmployeeList] = useState<Employee[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    // const [selectedProblemSolver, setSelectedProblemSolver] = useState('');

    // const [taskName, setTaskName] = useState<string | null>(null);
    // const handleTaskNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setTaskName(e.target.value);
    // };

    // const [showModal, setShowModal] = useState<boolean>(false);

    const handleShowModal = (taskId: number, solver: string) => {
        setTaskIdToEdit(taskId);         // Set the task ID that is being edited
        setProblemSolver(solver);        // Set the solver for the task
    };

    const handleCloseModal = () => {
        setTaskIdToEdit(null);           // Close modal by clearing taskIdToEdit
        setProblemSolver('');
        // setTaskName('');
    };

    const handleProblemSolverChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setProblemSolver(e.target.value);
        console.log(problemSolver)
    };




    const [taskData, setTaskData] = useState<any>(null);
    const [updatedFields, setUpdatedFields] = useState<any>({});

    // Fetch the task data when taskIdToEdit changes

    // Function to fetch task data by ID


    // Function to handle field updates
    const handleFieldChange = (inputId: string, field: string, value: string | boolean) => {
        setUpdatedFields((prevFields: any) => ({
            ...prevFields,
            [inputId]: {
                ...prevFields[inputId],
                [field]: value,
            },
        }));
    };

    // Function to save the updated task data
    const handleSaveTask = async () => {
        if (!taskIdToEdit || !taskData) {
            alert('Please provide values to update.');
            return;
        }

        try {
            // Parse the task_Json to update the inputs
            const parsedTaskJson = JSON.parse(taskData.task_Json);

            // Ensure parsedTaskJson has inputs, then update them
            if (Array.isArray(parsedTaskJson.inputs)) {
                const updatedInputs = parsedTaskJson.inputs.map((input: any) => ({
                    ...input,
                    ...updatedFields[input.inputId], // Apply the updated values from the form
                }));

                // Update the task data with the new inputs
                const updatedTaskData = {
                    ...taskData,
                    task_Json: JSON.stringify({
                        ...parsedTaskJson,
                        inputs: updatedInputs, // Update the inputs with new values
                    }),
                    updatedBy: "YourNameHere",
                    updatedDate: new Date().toISOString(),
                    problem_Solver: problemSolver,
                };

                // Send the updated task data to the API
                const response = await axios.post(`${config.API_URL_ACCOUNT}/ProcessTaskMaster/InsertUpdateProcessTaskandDoer`,
                    updatedTaskData,
                    {
                        headers: {
                            accept: '*/*',
                            'Content-Type': 'application/json',
                        },
                    }
                );
                console.log(updatedTaskData)

                console.log('Task updated:', response.data);
                // alert('Task updated successfully');
                handleCloseModal();
                toast.success("Task has been Updated succussfully")
            } else {
                console.error('task_Json does not contain valid inputs');
                alert('Error: task_Json is invalid or missing inputs');
            }
        } catch (error) {
            console.error('Error updating task:', error);
            alert('Error updating task');
        }
    };

    useEffect(() => {
        if (taskIdToEdit !== null && problemSolver) {
            console.log('Updated taskIdToEdit:', taskIdToEdit);
            console.log('Updated problemSolver:', problemSolver);

            const fetchTaskData = async (taskIdToEdit: number) => {
                try {
                    const { data } = await axios.get(`${config.API_URL_ACCOUNT}/ProcessTaskMaster/GetProcessTaskByIds?Flag=3&ID=${taskIdToEdit}`
                    );
                    const task = data.getProcessTaskByIds[0];
                    console.log(task)

                    // Check if task and task.inputs are defined before proceeding
                    if (task && task.task_Json) {
                        try {
                            // Parse the task_Json string if it's a stringified JSON object
                            const parsedTaskJson = typeof task.task_Json === 'string' ? JSON.parse(task.task_Json) : task.task_Json;

                            // Ensure inputs is an array
                            if (Array.isArray(parsedTaskJson.inputs)) {
                                setTaskData(task); // Store the fetched task data in state
                                console.log(task);

                                // Initialize updatedFields to keep track of the updated values
                                const initialUpdatedFields = parsedTaskJson.inputs.reduce((acc: any, input: any) => {
                                    acc[input.inputId] = {
                                        label: input.label,
                                        placeholder: input.placeholder,
                                        visibility: input.visibility,
                                    };
                                    return acc;
                                }, {});

                                // Set initial updated fields
                                setUpdatedFields(initialUpdatedFields);

                                console.log(updatedFields)
                            } else {
                                console.error('Task data "inputs" is missing or is not an array.');
                            }
                        } catch (error) {
                            console.error('Error parsing task_Json:', error);
                        }
                    } else {
                        console.error('Task data is missing "task_Json".');
                    }

                } catch (error) {
                    console.error('Error fetching task data:', error);
                }
            };

            fetchTaskData(taskIdToEdit);
        }
    }, [taskIdToEdit, problemSolver]);









    const [columns, setColumns] = useState<Column[]>([
        { id: 'moduleName', label: 'Module', visible: true },
        { id: 'processName', label: 'Process', visible: true },
        { id: 'problem_Solver', label: 'Problem Solver', visible: true },
        { id: 'task_Number', label: 'Task Number', visible: true },
        { id: 'roleName', label: 'Role Name', visible: true },
        { id: 'task_Name', label: 'Task Name', visible: true },
    ]);

    // Handle column drag-and-drop
    const handleOnDragEnd = (result: any) => {
        if (!result.destination) return;
        const reorderedColumns = Array.from(columns);
        const [movedColumn] = reorderedColumns.splice(result.source.index, 1);
        reorderedColumns.splice(result.destination.index, 0, movedColumn);
        setColumns(reorderedColumns);
    };

    useEffect(() => {
        axios
            .get(`${config.API_URL_APPLICATION}/CommonDropdown/GetEmployeeListWithId`)
            .then((response) => {
                if (response.data.isSuccess) {
                    setEmployeeList(response.data.employeeLists);
                }
            })
            .catch((error) => {
                console.error('Error fetching employee list:', error);
            });
    }, []);

    interface Role {
        roleId: string;
        roleName: string;
    }

    const [roles, setRoles] = useState<Role[]>([]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axios.get(`${config.API_URL_APPLICATION}/CommonDropdown/GetRoleMasterList`);
                if (response.data.isSuccess) {
                    setRoles(response.data.roleMasterLists); // Adjust as per API response structure
                } else {
                    console.error('Error fetching roles:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchRoles();
    }, []);


    // Fetch Modules
    useEffect(() => {
        axios
            .get(`${config.API_URL_APPLICATION}/CommonDropdown/GetModuleList`)
            .then((response) => {
                if (response.data.isSuccess) {
                    setModules(response.data.moduleNameListResponses);
                }
            })
            .catch((error) => console.error('Error fetching modules:', error));
    }, []);

    // Fetch Processes based on selected module
    useEffect(() => {
        if (selectedModule) {
            axios
                .get(`${config.API_URL_APPLICATION}/CommonDropdown/GetProcessNameByModuleName?ModuleName=${selectedModule}`)
                .then((response) => {
                    if (response.data.isSuccess) {
                        setProcesses(response.data.processListResponses);
                    }
                })
                .catch((error) => console.error('Error fetching processes:', error));
        }
    }, [selectedModule]);




    // Fetch Tasks
    useEffect(() => {
        const endpoint = selectedModuleId && selectedProcess
            ? `${config.API_URL_ACCOUNT}/ProcessTaskMaster/GetProcessTaskByIds?Flag=2&ModuleId=${selectedModuleId}&ProcessId=${selectedProcess}`
            : `${config.API_URL_ACCOUNT}/ProcessTaskMaster/GetProcessTaskByIds?Flag=1`;

        axios
            .get(endpoint)
            .then((response) => {
                if (response.data.isSuccess) {
                    setTasks(response.data.getProcessTaskByIds);
                    setTotalPages(Math.ceil(response.data.totalCount / 10));
                }
                console.log(tasks)
            })


            .catch((error) => console.error('Error fetching tasks:', error));
    },
        [selectedModuleId && selectedProcess]);




    const handleShow = () => setShow(true);
    const handleCondition = (id: number, task_Number: string) => {
        handleShow();
        setTaskID(id)
        setTaskNumber(task_Number)
        console.log(taskID)
        console.log(taskNumber)

    };



    // Handle JSON Modal
    const handleJsonModal = (task_Json: string) => {
        setSelectedJson(task_Json);
        setShowJsonModal(true)
    };


    return (
        <div>
            <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center fs-20">
                <span><i className="ri-file-list-line me-2"></i><span className='fw-bold test-nowrap'>Task List</span></span>
                <div className="col-md-4 my-1 d-flex justify-content-end">
                    {role === "DME" && (
                        <Link to="/pages/Modules-Master">
                            <Button variant="primary">Create Task</Button>
                        </Link>
                    )}

                </div>

            </div>
            <div className="row m-0 align-items-end bg-white pb-2 shadow">
                <Form.Group className="col-md-4 my-1">
                    <Form.Label>Module Name</Form.Label>
                    <Select
                        name="selectedModule"
                        value={modules.find(item => item.moduleName === selectedModule) || null}
                        onChange={(selectedOption) => {
                            setSelectedModule(selectedOption ? selectedOption.moduleName : "");
                            setSelectedModuleId(selectedOption ? selectedOption.moduleID : "");
                        }}
                        options={modules}
                        getOptionLabel={(item) => item.moduleName}
                        getOptionValue={(item) => item.moduleID}
                        isSearchable={true}
                        placeholder="Select Module Name"
                        className="h45"
                    />
                </Form.Group>


                <Form.Group className="col-md-4 my-1">
                    <Form.Label>Process Name</Form.Label>
                    <Select
                        name="selectedProcess"
                        value={processes.find(item => item.processID === selectedProcess) || null}
                        onChange={(selectedOption) => setSelectedProcess(selectedOption ? selectedOption.processID : "")}
                        options={processes}
                        getOptionLabel={(item) => item.processName}
                        getOptionValue={(item) => item.processID}
                        isSearchable={true}
                        placeholder="Select Process Name"
                        className="h45"
                        isDisabled={!selectedModule}
                    />
                </Form.Group>


            </div>

            <div className="overflow-auto mt-2 ">
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Table hover className="bg-white">
                        <thead>
                            <Droppable droppableId="columns" direction="horizontal">
                                {(provided) => (
                                    <tr {...provided.droppableProps} ref={provided.innerRef as React.Ref<HTMLTableRowElement>}>

                                        <th>#</th>
                                        {columns
                                            .filter((col) => col.visible)
                                            .map((column, index) => (
                                                <Draggable key={column.id} draggableId={column.id} index={index}>
                                                    {(provided) => (
                                                        <th>

                                                            <div ref={provided.innerRef as React.Ref<HTMLTableHeaderCellElement>}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps} className='text-nowrap my-1'>
                                                                {column.label}
                                                            </div>
                                                        </th>
                                                    )}
                                                </Draggable>
                                            ))}
                                        {provided.placeholder}
                                        {role === 'DME' && (
                                            <>
                                                <th>View</th>
                                                <th>Action</th>
                                                <th>Conditions</th>
                                            </>
                                        )}
                                    </tr>
                                )}
                            </Droppable>
                        </thead>
                        <tbody>
                            {tasks.length > 0 ? (
                                tasks.map((task, index) => (
                                    <tr key={task.id}>
                                        <td>{index + 1}</td>
                                        {columns

                                            .filter((col) => col.visible)
                                            .map((col) => (
                                                <td key={col.id}
                                                    className={
                                                        col.id === 'moduleName' ? 'fw-bold  text-dark text-nowrap py-2' :
                                                            col.id === 'taskName' ? 'fw-bold    text-wrap' :
                                                                ''
                                                    }
                                                >

                                                    {col.id && (
                                                        task[col.id as keyof Task]
                                                    )}
                                                </td>
                                            ))}

                                        {
                                            role === 'DME' && (
                                                <>
                                                    <td>
                                                        <Button
                                                            variant="primary"
                                                            onClick={() => { handleJsonModal(task.task_Json); }}
                                                            className='text-nowrap'
                                                        >
                                                            View Task
                                                        </Button>
                                                    </td>
                                                    <td>
                                                        <Button
                                                            variant="primary"
                                                            onClick={() => handleShowModal(task.id, task.problem_Solver)}
                                                            className="text-nowrap"
                                                        >
                                                            Edit Task
                                                        </Button>
                                                    </td>
                                                    <td>
                                                        <Button variant="primary" onClick={() => handleCondition(task.id, task.task_Number)}>Conditions</Button>
                                                    </td>
                                                </>


                                            )
                                        }

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={12}>
                                        <Container className="mt-5">
                                            <Row className="justify-content-center">
                                                <Col xs={12} md={8} lg={6}>
                                                    <Alert variant="info" className="text-center">
                                                        <h4>No Tasks Found</h4>
                                                        <p>No tasks available for the selected criteria.</p>
                                                    </Alert>
                                                </Col>
                                            </Row>
                                        </Container>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                    {tasks.map((task) => (
                        <div key={task.id}>

                            {/* Show only one modal at a time for the specific task */}
                            {taskIdToEdit === task.id && (
                                <Modal
                                    show={taskIdToEdit === task.id}
                                    onHide={handleCloseModal}
                                    backdrop="static" // Prevent closing when clicking outside the modal
                                    size='xl'
                                >
                                    <Modal.Header closeButton>
                                        <Modal.Title>Edit Task for {task.task_Number}</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <Form>
                                            {/* Input for Problem Solver */}
                                            <Form.Group controlId="problemSolver">
                                                <Form.Label>Problem Solver</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    value={task.problem_Solver || ''}
                                                    onChange={handleProblemSolverChange}
                                                >
                                                    {/* <option value="">{task.problem_Solver}</option> */}
                                                    {employeeList.map((employee) => (
                                                        <option key={employee.employeeName} value={employee.employeeName}>
                                                            {employee.employeeName}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                            </Form.Group>
                                            {/* <Form.Group controlId="taskName">
                                                <Form.Label>Task Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={taskName || task.task_Name || ''}
                                                    onChange={handleTaskNameChange}
                                                    placeholder="Enter Task Name"
                                                />
                                            </Form.Group> */}
                                        </Form>
                                        {taskData && taskData.task_Json && (
                                            <div className="container mt-4 row">
                                                {/* Parse task_Json if it's a string */}
                                                {(() => {
                                                    const parsedTaskJson = typeof taskData.task_Json === 'string'
                                                        ? JSON.parse(taskData.task_Json)
                                                        : taskData.task_Json;

                                                    if (parsedTaskJson && Array.isArray(parsedTaskJson.inputs)) {
                                                        return parsedTaskJson.inputs.map((input: any) => {
                                                            // Exclude inputIds 100, 102, 103 and handle inputId 99 differently
                                                            if (['100', '102'].includes(input.inputId)) {
                                                                return null; // Skip this input
                                                            }

                                                            return (
                                                                <div key={input.inputId} className="col-6 card mb-3">
                                                                    <div className="card-header">
                                                                        <h5> <span className='text-primary'>Input Name -</span> {input.label}</h5>
                                                                    </div>
                                                                    <div className="card-body row m-0">
                                                                        {/* Only allow label to be edited for inputId 99 */}
                                                                        {input.inputId === '99' ? (
                                                                            <div className="form-group">
                                                                                <label htmlFor={`label-${input.inputId}`}>Task Name</label>
                                                                                <input
                                                                                    id={`label-${input.inputId}`}
                                                                                    type="text"
                                                                                    className="form-control"
                                                                                    value={updatedFields[input.inputId]?.label || ''}
                                                                                    onChange={(e) =>
                                                                                        handleFieldChange(input.inputId, 'label', e.target.value)
                                                                                    }
                                                                                />
                                                                            </div>

                                                                        ) : (
                                                                            <>
                                                                                {/* Label input */}
                                                                                {input.inputId != '103' ? (
                                                                                    <div className="form-group col-6">
                                                                                        <label htmlFor={`label-${input.inputId}`}>Label</label>
                                                                                        <input
                                                                                            id={`label-${input.inputId}`}
                                                                                            type="text"
                                                                                            className="form-control"
                                                                                            value={updatedFields[input.inputId]?.label || ''}
                                                                                            onChange={(e) =>
                                                                                                handleFieldChange(input.inputId, 'label', e.target.value)
                                                                                            }
                                                                                        />
                                                                                    </div>) :
                                                                                    (
                                                                                        <div className="form-group col-6">
                                                                                            <label htmlFor={`role-${input.inputId}`}>Role</label>
                                                                                            <select
                                                                                                id={`role-${input.inputId}`}
                                                                                                className="form-control"
                                                                                                value={updatedFields[input.inputId]?.label || ''} // Tie the value to `label`
                                                                                                onChange={(e) => handleFieldChange(input.inputId, 'label', e.target.value)} // Update `label` on change
                                                                                            >
                                                                                                <option value="" disabled>
                                                                                                    Select Role
                                                                                                </option>
                                                                                                {roles.map((role) => (
                                                                                                    <option key={role.roleId} value={role.roleName}>
                                                                                                        {role.roleName}
                                                                                                    </option>
                                                                                                ))}
                                                                                            </select>
                                                                                        </div>
                                                                                    )
                                                                                }

                                                                                {/* Placeholder input */}
                                                                                <div className="form-group col-6">
                                                                                    <label htmlFor={`placeholder-${input.inputId}`}>Placeholder</label>
                                                                                    <input
                                                                                        id={`placeholder-${input.inputId}`}
                                                                                        type="text"
                                                                                        className="form-control"
                                                                                        value={updatedFields[input.inputId]?.placeholder || ''}
                                                                                        onChange={(e) =>
                                                                                            handleFieldChange(input.inputId, 'placeholder', e.target.value)
                                                                                        }
                                                                                    />
                                                                                </div>

                                                                                {/* Visibility toggle button */}
                                                                                <div className="form-group form-switch col-6 mt-2 ps-0">
                                                                                    <label htmlFor={`visibility-${input.inputId}`} className="toggle-label">
                                                                                        Visibility
                                                                                    </label>
                                                                                    <div
                                                                                        className={`toggle-switch ${updatedFields[input.inputId]?.visibility ? 'active' : ''}`}
                                                                                        onClick={() =>
                                                                                            handleFieldChange(input.inputId, 'visibility', !updatedFields[input.inputId]?.visibility)
                                                                                        }
                                                                                    >
                                                                                        <div className="toggle-circle"></div>
                                                                                        <span className="toggle-text">
                                                                                            {updatedFields[input.inputId]?.visibility ? 'Show' : 'Hide'}
                                                                                        </span>
                                                                                    </div>
                                                                                    <div></div>
                                                                                </div>



                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                            );
                                                        });
                                                    } else {
                                                        console.error('Inputs not found or not an array');
                                                        return null;
                                                    }
                                                })()}

                                            </div>
                                        )}



                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={handleCloseModal}>
                                            Close
                                        </Button>
                                        <Button variant="primary" onClick={handleSaveTask}>
                                            Save Changes
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                            )}
                        </div>
                    ))}
                </DragDropContext>
            </div>
            <TaskCondition show={show} setShow={setShow} taskID={taskID} taskNumber={taskNumber} />

            {selectedJson &&
                <DynamicForm
                    fromComponent='TaskMaster'
                    formData={JSON.parse(selectedJson)}
                    taskNumber
                    data
                    show={showJsonModal}
                    setShow={setShowJsonModal}
                    parsedCondition
                    preData
                    selectedTasknumber
                    setLoading
                    taskCommonIDRow
                    taskStatus
                    processId
                    moduleId
                    ProcessInitiationID
                    approval_Console
                    approvalConsoleInputID

                />
            }

            <div className="d-flex justify-content-center align-items-center bg-white w-20 rounded-5 m-auto py-1 pb-1 my-2 pagination-rounded">
                <Pagination >
                    <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                    <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
                    <Pagination.Item active>{currentPage}</Pagination.Item>
                    <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
                    <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
                </Pagination>
            </div>

        </div>
    );
};

export default TaskMaster;
