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
    finishPoint: string;
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
    const [RoleName, setRoleName] = useState('');
    // const [selectedProblemSolver, setSelectedProblemSolver] = useState('');

    // const [taskName, setTaskName] = useState<string | null>(null);
    // const handleTaskNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setTaskName(e.target.value);
    // };

    // const [showModal, setShowModal] = useState<boolean>(false);

    const handleShowModal = (taskId: number) => {
        setTaskIdToEdit(taskId);         // Set the task ID that is being edited
        // setProblemSolver(solver);        // Set the solver for the task
    };

    const handleCloseModal = () => {
        setTaskIdToEdit(null);           // Close modal by clearing taskIdToEdit
        // setProblemSolver('');
        // setTaskName('');
    };

    const [taskData, setTaskData] = useState<any>(null);
    const [updatedFields, setUpdatedFields] = useState<any>({});

    // Fetch the task data when taskIdToEdit changes

    // Function to fetch task data by ID

    // useEffect(() => {
    //     const initialFields = inputs.reduce((acc, input) => {
    //         acc[input.inputId] = {
    //             required: input.required,
    //             visibility: input.visibility,
    //         };
    //         return acc;
    //     }, {});
    //     setUpdatedFields(initialFields);
    // }, [inputs]);


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
                    roleName: RoleName ? RoleName : taskData.roleName,
                    updatedBy: "YourNameHere",
                    updatedDate: new Date().toISOString(),
                    problem_Solver: problemSolver ? problemSolver : taskData.problem_Solver,
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
                if (response.status === 200) {
                    // Perform the actions when the response is successful (status 200)
                    handleCloseModal();
                    fetchTasks();
                    toast.dismiss()
                    toast.success("Task has been updated successfully");
                    setRoleName('');
                    setProblemSolver('');

                } else {
                    // Handle any unexpected status codes
                    toast.error("Error: Task update failed");
                }
            } else {
                console.error('task_Json does not contain valid inputs');
                alert('Error: task_Json is invalid or missing inputs');
            }
        } catch (error) {
            console.error('Error updating task:', error);
            alert('Error updating task');
        }
    };

    // console.log(problemSolver)

    useEffect(() => {
        // if (taskIdToEdit !== null) {
        console.log('Updated taskIdToEdit:', taskIdToEdit);
        // console.log('Updated problemSolver:', problemSolver);
        if (taskIdToEdit) {
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
                                        required: input.required,
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
        // }
    }, [taskIdToEdit]);

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

    const [downloadCsv, setDownloadCsv] = useState<Task[]>([]);

    useEffect(() => {
        const fetchData = async (endpoint: string, setter: Function) => {
          try {
            const response = await axios.get(`${config.API_URL_ACCOUNT}/${endpoint}`);
            console.log(response);
            console.log('API Response:', response);
            if (response.data.isSuccess && response.data.getProcessTaskByIds) {
              setter(response.data.getProcessTaskByIds);
            } else {
              console.error('Expected data not found in response', response.data);
            }
          } catch (error) {
            console.error(`Error fetching data from ${endpoint}:`, error);
          }
        };
      
        fetchData('ProcessTaskMaster/GetProcessTaskByIds?Flag=5', setDownloadCsv);
      }, [show]);

    // Fetch Processes based on selected module
    useEffect(() => {
        if (selectedModule) {
            const moduleNameStr = String(selectedModule)
            axios
                .get(`${config.API_URL_APPLICATION}/CommonDropdown/GetProcessNameByModuleName?ModuleName=${encodeURIComponent(
                    moduleNameStr
                  )}`)
                .then((response) => {
                    if (response.data.isSuccess) {
                        setProcesses(response.data.processListResponses);
                    }
                })
                .catch((error) => console.error('Error fetching processes:', error));
        }
    }, [selectedModule]);

    const fetchTasks = () => {
        
        const endpoint = selectedModuleId && selectedProcess
            ? `${config.API_URL_ACCOUNT}/ProcessTaskMaster/GetProcessTaskByIds?Flag=2&ModuleId=${selectedModuleId}&ProcessId=${selectedProcess}&PageIndex=${currentPage}`
            : `${config.API_URL_ACCOUNT}/ProcessTaskMaster/GetProcessTaskByIds?Flag=1&PageIndex=${currentPage}`;

        axios
            .get(endpoint)
            .then((response) => {
                if (response.data.isSuccess) {
                    setTasks(response.data.getProcessTaskByIds);
                    setTotalPages(Math.ceil(response.data.totalCount / 10));
                }
                console.log('Fetched tasks:', response.data.getProcessTaskByIds);
            })
            .catch((error) => console.error('Error fetching tasks:', error));
    };
    

    useEffect(() => {
        fetchTasks();
    }, [selectedModuleId, selectedProcess, currentPage]);

    useEffect(() => {
        fetchTasks();
    }, [selectedModuleId, selectedProcess]);

    const convertToCSV = (data: Task[]) => {
        const csvRows = [
          [
            'ID',
            'Module Name',
            'Module ID',
            'Process ID',
            'Process Name',
            'Role ID',
            'Role Name',
            'Task Number',
            'Task Status',
            'Task Type',
            'Problem Solver',
            'Finish Point',
            'Is Expired',
            'Created By',
            'Created Date',
            'Updated By',
            'Updated Date',
            'Task Name'
          ],
          ...data?.map((task) => {
      
            return [
              task.id,
              `"${task.moduleName}"`,
              task.moduleID,
              task.processID,
              `"${task.processName}"`,
              task.roleId,
              task.roleName,
              task.task_Number,
              task.task_Status,
              task.taskType,
              `"${task.problem_Solver}"`,
              task.finishPoint,
              task.isExpired,
              task.createdBy,
              task.createdDate,
              task.updatedBy,
              task.updatedDate,
              `"${task.task_Name}"`
            ];
          })
        ];
      
        return csvRows.map((row) => row.join(',')).join('\n');
      };
      
      const downloadCSV = () => {
        const csvData = convertToCSV(downloadCsv);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', 'Process_Master.csv');
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      };



    const handleShow = () => setShow(true);
    const handleCondition = (id: number, task_Number: string) => {
        handleShow();
        setTaskID(id)
        setTaskNumber(task_Number)
        console.log(taskID)
        console.log(taskNumber)

    };

    interface CustomOption {
        employeeName: any;
        employeeId?: any; // Optional for static options
        className?: any; // Optional className for styling
    }




    // Handle JSON Modal
    const handleJsonModal = (task_Json: string) => {
        setSelectedJson(task_Json);
        setShowJsonModal(true)
    };


    return (
        <div>
            <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center fs-20">
                <span><i className="ri-file-list-line me-2"></i><span className='fw-bold test-nowrap'>Task List</span></span>
                <div className="col-md-4  d-flex justify-content-end">
                    <Button variant="primary" onClick={downloadCSV} className="me-2">
                        Download CSV
                    </Button>
                    {role === "Admin" && (
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
                                        {role === 'Admin' && (
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
                            {Array.isArray(tasks) && tasks.length > 0 ? (
                                tasks.slice(0, 10).map((task, index) => (
                                    <tr key={task.id}>
                                        <td>{(currentPage - 1) * 10 + index + 1}</td>
                                        {columns
                                            .filter((col) => col.visible)
                                            .map((col) => (
                                                <td
                                                    key={col.id}
                                                    className={
                                                        col.id === 'moduleName'
                                                            ? 'fw-bold text-dark text-nowrap py-2'
                                                            : col.id === 'taskName'
                                                                ? 'fw-bold text-wrap'
                                                                : ''
                                                    }
                                                >
                                                    {col.id && task[col.id as keyof Task]}
                                                </td>
                                            ))}
                                        {role === 'Admin' && (
                                            <>
                                                <td>
                                                    <Button
                                                        variant="primary"
                                                        onClick={() => {
                                                            handleJsonModal(task.task_Json);
                                                        }}
                                                        className="text-nowrap"
                                                    >
                                                        <i className="ri-eye-line"></i>
                                                    </Button>
                                                </td>
                                                <td>
                                                    <Button
                                                        variant="primary"
                                                        onClick={() => handleShowModal(task.id)}
                                                        className="text-nowrap"
                                                    >
                                                        <i className="ri-pencil-line"></i>
                                                    </Button>
                                                </td>
                                                <td className="text-center">
                                                    <Button
                                                        variant="primary"
                                                        onClick={() =>
                                                            handleCondition(task.id, task.task_Number)
                                                        }
                                                    >
                                                        <i className="ri-braces-line"></i>
                                                    </Button>
                                                </td>
                                            </>
                                        )}
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
                    {Array.isArray(tasks) && tasks.map((task) => (
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
                                        {/* Input for Problem Solver */}
                                        <Form.Group controlId="problemSolver">
                                            <Form.Label>Problem Solver</Form.Label>
                                            <Select
                                                name="problemSolver"
                                                value={[
                                                    { employeeName: "Project Coordinator", className: "special-option" },
                                                    { employeeName: "Project Incharge", className: "special-option" },
                                                    ...employeeList.map(emp => ({ employeeName: emp.employeeName, employeeId: emp.empId })),
                                                ].find(emp => emp.employeeName === task.problem_Solver) || null}
                                                onChange={(selectedOption: CustomOption | null) => {
                                                    setTasks((prevTasks) =>
                                                        prevTasks.map((t) =>
                                                            t.id === task.id
                                                                ? { ...t, problem_Solver: selectedOption?.employeeName || '' }
                                                                : t
                                                        )
                                                    );
                                                    setProblemSolver(selectedOption?.employeeName || '');
                                                }}
                                                getOptionLabel={(emp: CustomOption) => emp.employeeName}
                                                getOptionValue={(emp: CustomOption) => emp.employeeName}
                                                options={[
                                                    { employeeName: "Project Coordinator", className: "special-option" },
                                                    { employeeName: "Project Incharge", className: "special-option" },
                                                    ...employeeList.map(emp => ({ employeeName: emp.employeeName, employeeId: emp.empId })),
                                                ]}
                                                classNames={{
                                                    option: (state) => state.data.className || "",
                                                }}
                                                isSearchable={true}
                                                placeholder="Select Problem Solver"
                                            />
                                        </Form.Group>

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
                                                                    <div className="card-header d-flex justify-content-between">
                                                                        <div><span className='fs-6 text-primary'>Input Name</span><br></br><span className='text-primary'></span> {input.label}</div>
                                                                        {input.inputId != '99' && '102' && '103' && '101' && (<div className='d-flex flex-column justify-content-start align-items-end'><div className='shadow-light-btn mb-1'>{input.type}</div><span className='fs-6 text-danger'>{input.required ? "Required" : ""}</span></div>)}
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
                                                                                                onChange={(e) => {
                                                                                                    handleFieldChange(input.inputId, 'label', e.target.value),
                                                                                                        setRoleName(e.target.value)
                                                                                                }} // Update `label` on change
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
                                                                                {input.inputId != '103' && (
                                                                                    <>
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
                                                                                        </div>
                                                                                        <div className="form-group form-switch col-6 mt-2 ps-0" key={input.inputId}>
                                                                                            <label htmlFor={`required-${input.inputId}`} className="toggle-label">
                                                                                                Required
                                                                                            </label>
                                                                                            <div
                                                                                                className={`toggle-switch ${updatedFields[input.inputId]?.required ? 'active' : ''}`}
                                                                                                onClick={() =>
                                                                                                    handleFieldChange(input.inputId, 'required', !updatedFields[input.inputId]?.required)
                                                                                                }
                                                                                            >
                                                                                                <div className="toggle-circle"></div>
                                                                                                <span className="toggle-text">
                                                                                                    {updatedFields[input.inputId]?.required ? 'Yes' : 'No'}
                                                                                                </span>
                                                                                            </div>
                                                                                        </div>
                                                                                    </>
                                                                                )}
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
                    formBuilderData={JSON.parse(selectedJson)}
                    taskNumber
                    data
                    taskName
                    finishPoint
                    show={showJsonModal}
                    setShow={setShowJsonModal}
                    parsedCondition
                    preData
                    projectName
                    taskCommonIDRow
                    taskStatus
                    processId
                    moduleId
                    rejectBlock
                    ProcessInitiationID
                    approval_Console
                    problemSolver
                    approvarActions
                    rejectData

                />
            }

            <div className="d-flex justify-content-center align-items-center bg-white w-20 rounded-5 m-auto py-1 pb-1 my-2 pagination-rounded">
                <div className="d-flex justify-content-center align-items-center bg-white w-20 rounded-5 m-auto py-1 pb-1 my-2 pagination-rounded">
                    <Pagination>
                        <Pagination.First
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                        />
                        <Pagination.Prev
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        />
                        <Pagination.Item active>{currentPage}</Pagination.Item>
                        <Pagination.Next
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        />
                        <Pagination.Last
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                        />
                    </Pagination>
                </div>
            </div>

        </div>
    );
};

export default TaskMaster;
