import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Form, Table, Alert, Container, Row, Col } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Link } from 'react-router-dom';
import config from '@/config';
import Select from 'react-select';
import TaskCondition from './Taskcondition';
import DynamicForm from '../../Component/DynamicForm';

// Interfaces for the data
interface Task {
    id: number;
    moduleName: string;
    processName: string;
    task_Number: string;
    roleName: string;
    task_Json: string;
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
    const [tasks, setTasks] = useState<Task[]>([]);
    const [taskID, setTaskID] = useState<number>(0);
    const [modules, setModules] = useState<Module[]>([]);
    const [processes, setProcesses] = useState<Process[]>([]);
    const [selectedModule, setSelectedModule] = useState<string>('');
    const [selectedModuleId, setSelectedModuleId] = useState<string>('');
    const [selectedProcess, setSelectedProcess] = useState<string>('');
    const [show, setShow] = useState(false);
    const [selectedJson, setSelectedJson] = useState<string>(''); // State for JSON display
    const [showJsonModal, setShowJsonModal] = useState(false); // State to show/hide JSON modal




    const [columns, setColumns] = useState<Column[]>([
        { id: 'moduleName', label: 'Module', visible: true },
        { id: 'processName', label: 'Process', visible: true },
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
                }
            })
            .catch((error) => console.error('Error fetching tasks:', error));
    }, [selectedModuleId && selectedProcess]);




    const handleShow = () => setShow(true);
    const handleCondition = (id: number) => {
        handleShow();
        setTaskID(id)
        console.log(taskID)

    };



    // Handle JSON Modal
    const handleJsonModal = (task_Json: string) => {
        setSelectedJson(task_Json);
        setShowJsonModal(true)
    };

    console.log(selectedJson)



    return (
        <div>
            <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center fs-20">
                <span><i className="ri-file-list-line me-2"></i><span className='fw-bold test-nowrap'>Task List</span></span>
                <div className="col-md-4 my-1 d-flex justify-content-end">
                    <Link to="/pages/Modules-Master">
                        <Button variant="primary">Create Task</Button>
                    </Link>
                </div>

            </div>
            <div className="row m-0 align-items-end bg-white p-3  shadow">
                <Form.Group className="col-md-4 my-1">
                    <Form.Label>Select Module</Form.Label>
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
                    <Form.Label>Select Process</Form.Label>
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

            <div className="overflow-auto mt-2">
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
                                                                {...provided.dragHandleProps}>
                                                                {column.label}
                                                            </div>
                                                        </th>
                                                    )}
                                                </Draggable>
                                            ))}
                                        {provided.placeholder}
                                        <th>Action</th>
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
                                                        col.id === 'moduleName' ? 'fw-bold fs-13 text-dark text-nowrap' :
                                                            col.id === 'taskName' ? 'fw-bold fs-13   text-wrap' :
                                                                ''
                                                    }
                                                >

                                                    {col.id && (
                                                        task[col.id as keyof Task]
                                                    )}
                                                </td>
                                            ))}
                                        <td>
                                            <Button
                                                variant="primary"
                                                onClick={() => {

                                                    handleJsonModal(task.task_Json);

                                                }}
                                                className='text-nowrap'
                                            >
                                                View Task
                                            </Button>
                                        </td>
                                        <td>
                                            <Button variant="primary" onClick={() => handleCondition(task.id)}>Conditions</Button>
                                        </td>
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
                </DragDropContext>
            </div>
            <TaskCondition show={show} setShow={setShow} taskID={taskID} />

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

        </div>
    );
};

export default TaskMaster;
