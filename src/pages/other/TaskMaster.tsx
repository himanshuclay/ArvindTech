import React, { useState, useEffect, ChangeEvent } from 'react';
import { Button, Form, Offcanvas, Table, Pagination } from 'react-bootstrap';
import axios from 'axios';

interface Task {
    id: number;
    moduleID: string;
    processID: string;
    taskID: string;
    taskDisplayName: string;
    taskDescription: string;
    role: string;
    howPlannedDateIsCalculated: string;
    predecessor: string;
    successor: string;
    generationType: string;
    misExempt: string;
    status: string;
    problemSolver: string;
    sundayLogic: string;
    createdBy: string;
    updatedBy: string;
}

const TaskMaster: React.FC = () => {
    const [task, setTask] = useState<Task>({
        id: 0,
        moduleID: '',
        processID: '',
        taskID: '',
        taskDisplayName: '',
        taskDescription: '',
        role: '',
        howPlannedDateIsCalculated: '',
        predecessor: '',
        successor: '',
        generationType: '',
        misExempt: '',
        status: '',
        problemSolver: '',
        sundayLogic: '',
        createdBy: '',
        updatedBy: ''
    });

    const [tasks, setTasks] = useState<Task[]>([]);
    const [show, setShow] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1); // Added state for total pages
    const [loading, setLoading] = useState<boolean>(false);


    useEffect(() => {
        fetchTasks();
    }, [currentPage]);

    const fetchTasks = async () => {
        setLoading(true);

        try {
            const response = await axios.get('https://localhost:7074/api/TaskMaster/GetTask', {
                params: {
                    PageIndex: currentPage
                }
            });
            if (response.data.isSuccess) {
                setTasks(response.data.taskMasterList);
                setTotalPages(Math.ceil(response.data.totalCount / 10));
                console.log(response.data.taskMasterList)
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
        finally {
            setLoading(false); // End loading
        }
    };

    const handleShow = () => setShow(true);

    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement | HTMLSelectElement;
        if (type === 'checkbox') {
            setTask({
                ...task,
                [name]: checked
            });
        } else {
            setTask({
                ...task,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (editingIndex !== null) {
                await axios.post('https://localhost:7074/api/TaskMaster/UpdateTask', task);
            } else {
                await axios.post('https://localhost:7074/api/TaskMaster/InsertTask', task);
            }
            fetchTasks();
            handleClose();
        } catch (error) {
            console.error('Error submitting task:', error);
        }
    };

    const handleEdit = (index: number) => {
        setEditingIndex(index);
        setTask(tasks[index]);
        handleShow();
    };

    const handleClose = () => {
        setShow(false);
        setEditingIndex(null);
        setTask({
            id: 0,
            moduleID: '',
            processID: '',
            taskID: '',
            taskDisplayName: '',
            taskDescription: '',
            role: '',
            howPlannedDateIsCalculated: '',
            predecessor: '',
            successor: '',
            generationType: '',
            misExempt: '',
            status: '',
            problemSolver: '',
            sundayLogic: '',
            createdBy: '',
            updatedBy: ''
        });
    };

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    const filteredTasks = tasks.filter(task =>
        task.taskDisplayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.taskID.toLowerCase().includes(searchQuery.toLowerCase())
    );



    const convertToCSV = (data: Task[]) => {
        const csvRows = [
            ['ID', 'Module ID', 'Process ID', 'Task ID', 'Task Display Name', 'Task Description', 'Role', 'How Planned Date Is Calculated', 'Predecessor', 'Successor', 'Generation Type', 'MIS Exempt', 'Status', 'Problem Solver', 'Sunday Logic', 'Created By', 'Updated By'],
            ...data.map(task => [
                task.id.toString(),
                task.moduleID,
                task.processID,
                task.taskID,
                task.taskDisplayName,
                task.taskDescription,
                task.role,
                task.howPlannedDateIsCalculated,
                task.predecessor,
                task.successor,
                task.generationType,
                task.misExempt,
                task.status,
                task.problemSolver,
                task.sundayLogic,
                task.createdBy,
                task.updatedBy
            ])
        ];

        return csvRows.map(row => row.join(',')).join('\n');
    };

    const downloadCSV = () => {
        const csvData = convertToCSV(tasks);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'Tasks.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="container">
            <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center">
                <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>Tasks List</span></span>
                <div className="d-flex">
                    <div className="app-search d-none d-lg-block me-4">
                        <form>
                            <div className="input-group">
                                <input
                                    type="search"
                                    className="form-control"
                                    placeholder="Search task..."
                                    value={searchQuery}
                                    onChange={handleSearch}
                                />
                                <span className="ri-search-line search-icon text-muted" />
                            </div>
                        </form>
                    </div>
                    <Button variant="primary" onClick={handleShow} className="me-2">
                        Add Task
                    </Button>
                    <Button variant="primary" onClick={downloadCSV} className="me-2">
                        Download CSV
                    </Button>
                </div>
            </div>

            <Offcanvas show={show} onHide={handleClose}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Task Form</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="moduleID" className="mb-3">
                            <Form.Label>Module ID:</Form.Label>
                            <Form.Control
                                type="text"
                                name="moduleID"
                                value={task.moduleID}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="processID" className="mb-3">
                            <Form.Label>Process ID:</Form.Label>
                            <Form.Control
                                type="text"
                                name="processID"
                                value={task.processID}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="taskID" className="mb-3">
                            <Form.Label>Task ID:</Form.Label>
                            <Form.Control
                                type="text"
                                name="taskID"
                                value={task.taskID}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="taskDisplayName" className="mb-3">
                            <Form.Label>Task Display Name:</Form.Label>
                            <Form.Control
                                type="text"
                                name="taskDisplayName"
                                value={task.taskDisplayName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="taskDescription" className="mb-3">
                            <Form.Label>Task Description:</Form.Label>
                            <Form.Control
                                type="text"
                                name="taskDescription"
                                value={task.taskDescription}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="role" className="mb-3">
                            <Form.Label>Role:</Form.Label>
                            <Form.Control
                                type="text"
                                name="role"
                                value={task.role}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="howPlannedDateIsCalculated" className="mb-3">
                            <Form.Label>How Planned Date Is Calculated:</Form.Label>
                            <Form.Control
                                type="text"
                                name="howPlannedDateIsCalculated"
                                value={task.howPlannedDateIsCalculated}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="predecessor" className="mb-3">
                            <Form.Label>Predecessor:</Form.Label>
                            <Form.Control
                                type="text"
                                name="predecessor"
                                value={task.predecessor}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="successor" className="mb-3">
                            <Form.Label>Successor:</Form.Label>
                            <Form.Control
                                type="text"
                                name="successor"
                                value={task.successor}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="generationType" className="mb-3">
                            <Form.Label>Generation Type:</Form.Label>
                            <Form.Control
                                type="text"
                                name="generationType"
                                value={task.generationType}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="misExempt" className="mb-3">
                            <Form.Label>MIS Exempt:</Form.Label>
                            <Form.Control
                                type="text"
                                name="misExempt"
                                value={task.misExempt}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="status" className="mb-3">
                            <Form.Label>Status:</Form.Label>
                            <Form.Control
                                type="text"
                                name="status"
                                value={task.status}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="problemSolver" className="mb-3">
                            <Form.Label>Problem Solver:</Form.Label>
                            <Form.Control
                                type="text"
                                name="problemSolver"
                                value={task.problemSolver}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="sundayLogic" className="mb-3">
                            <Form.Label>Sunday Logic:</Form.Label>
                            <Form.Control
                                type="text"
                                name="sundayLogic"
                                value={task.sundayLogic}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="createdBy" className="mb-3">
                            <Form.Label>Created By:</Form.Label>
                            <Form.Control
                                type="text"
                                name="createdBy"
                                value={task.createdBy}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="updatedBy" className="mb-3">
                            <Form.Label>Updated By:</Form.Label>
                            <Form.Control
                                type="text"
                                name="updatedBy"
                                value={task.updatedBy}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="me-2">
                            {editingIndex !== null ? 'Update' : 'Add'} Task
                        </Button>
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>



            <div className="overflow-auto">
                {loading ? (
                    <div className='loader-container'>
                        <div className="loader"></div>
                        <div className='mt-2'>Please Wait!</div>
                    </div>
                ) : (

                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Module ID</th>
                                <th>Process ID</th>
                                <th>Task ID</th>
                                <th>Task Display Name</th>
                                <th>Task Description</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTasks.slice(0, 10).map((task, index) => (
                                <tr key={task.id}>
                                    <td>{(currentPage - 1) * 10 + index + 1}</td>
                                    <td>{task.moduleID}</td>
                                    <td>{task.processID}</td>
                                    <td>{task.taskID}</td>
                                    <td>{task.taskDisplayName}</td>
                                    <td>{task.taskDescription}</td>
                                    <td>{task.role}</td>
                                    <td>
                                    <i className='btn ri-edit-line' onClick={() => handleEdit(index)}></i>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}

                <div className="d-flex justify-content-center align-items-center my-2">

                    <Pagination>
                        <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                        <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
                        <Pagination.Item active>{currentPage}</Pagination.Item>
                        <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
                        <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
                    </Pagination>
                </div>
            </div>
        </div>
    );
};

export default TaskMaster;
