import React, { useState, useEffect, ChangeEvent } from 'react';
import { Button, Form, Offcanvas, Table, Pagination } from 'react-bootstrap';
import axios from 'axios';

interface Input {
    id: number;
    moduleID: string;
    processID: string;
    taskID: string;
    inputID: string;
    inputType: string;
    inputDisplayName: string;
    inputVariables: string;
    predecessor: string;
    status: string;
    createdBy: string;
    updatedBy: string;
}

const InputMaster: React.FC = () => {
    const [input, setInput] = useState<Input>({
        id: 0,
        moduleID: '',
        processID: '',
        taskID: '',
        inputID: '',
        inputType: '',
        inputDisplayName: '',
        inputVariables: '',
        predecessor: '',
        status: '',
        createdBy: '',
        updatedBy: ''
    });

    const [inputs, setInputs] = useState<Input[]>([]);
    const [show, setShow] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1); // Added state for total pages
    const [loading, setLoading] = useState<boolean>(false);
    
    useEffect(() => {
        fetchInputs();
    }, [currentPage]);

    const fetchInputs = async () => {
        setLoading(true);

        try {
            const response = await axios.get('https://localhost:7074/api/InputMaster/GetInput', {
                params: {
                    PageIndex: currentPage
                }
            });
            if (response.data.isSuccess) {
                setInputs(response.data.inputMasterList);
                setTotalPages(Math.ceil(response.data.totalCount / 10));

            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching inputs:', error);
        }
        finally {
            setLoading(false); // End loading
        }
    };

    const handleShow = () => setShow(true);

    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement | HTMLSelectElement;
        if (type === 'checkbox') {
            setInput({
                ...input,
                [name]: checked
            });
        } else {
            setInput({
                ...input,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (editingIndex !== null) {
                await axios.post('https://localhost:7074/api/InputMaster/UpdateInput', input);
            } else {
                await axios.post('https://localhost:7074/api/InputMaster/InsertInput', input);
            }
            fetchInputs();
            handleClose();
        } catch (error) {
            console.error('Error submitting input:', error);
        }
    };

    const handleEdit = (index: number) => {
        setEditingIndex(index);
        setInput(inputs[index]);
        handleShow();
    };

    const handleClose = () => {
        setShow(false);
        setEditingIndex(null);
        setInput({
            id: 0,
            moduleID: '',
            processID: '',
            taskID: '',
            inputID: '',
            inputType: '',
            inputDisplayName: '',
            inputVariables: '',
            predecessor: '',
            status: '',
            createdBy: '',
            updatedBy: ''
        });
    };

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page on search
    };



    const filteredInputs = inputs.filter(input =>
        input.moduleID.toLowerCase().includes(searchQuery.toLowerCase()) ||
        input.processID.toLowerCase().includes(searchQuery.toLowerCase()) ||
        input.taskID.toLowerCase().includes(searchQuery.toLowerCase()) ||
        input.inputID.toLowerCase().includes(searchQuery.toLowerCase()) ||
        input.inputDisplayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        input.inputType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        input.inputVariables.toLowerCase().includes(searchQuery.toLowerCase()) ||
        input.predecessor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        input.status.toLowerCase().includes(searchQuery.toLowerCase())
    );

    
    const convertToCSV = (data: Input[]) => {
        const csvRows = [
            ['ID', 'Module ID', 'Process ID', 'Task ID', 'Input ID', 'Input Type', 'Input Display Name', 'Input Variables', 'Predecessor', 'Status'],
            ...data.map(input => [
                input.id.toString(),
                input.moduleID,
                input.processID,
                input.taskID,
                input.inputID,
                input.inputType,
                input.inputDisplayName,
                input.inputVariables,
                input.predecessor,
                input.status
            ])
        ];

        return csvRows.map(row => row.join(',')).join('\n');
    };

    const downloadCSV = () => {
        const csvData = convertToCSV(inputs);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'Inputs.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="container">
            <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center">
                <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>Inputs List</span></span>
                <div className="d-flex">
                    <div className="app-search d-none d-lg-block me-4">
                        <form>
                            <div className="input-group">
                                <input
                                    type="search"
                                    className="form-control"
                                    placeholder="Search input..."
                                    value={searchQuery}
                                    onChange={handleSearch}
                                />
                                <span className="ri-search-line search-icon text-muted" />
                            </div>
                        </form>
                    </div>
                    <Button variant="primary" onClick={handleShow} className="me-2">
                        Add Input
                    </Button>
                    <Button variant="primary" onClick={downloadCSV} className="me-2">
                        Download CSV
                    </Button>
                </div>
            </div>

            <Offcanvas show={show} onHide={handleClose}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Input Form</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="moduleID" className="mb-3">
                            <Form.Label>Module ID:</Form.Label>
                            <Form.Control
                                type="text"
                                name="moduleID"
                                value={input.moduleID}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="processID" className="mb-3">
                            <Form.Label>Process ID:</Form.Label>
                            <Form.Control
                                type="text"
                                name="processID"
                                value={input.processID}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="taskID" className="mb-3">
                            <Form.Label>Task ID:</Form.Label>
                            <Form.Control
                                type="text"
                                name="taskID"
                                value={input.taskID}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="inputID" className="mb-3">
                            <Form.Label>Input ID:</Form.Label>
                            <Form.Control
                                type="text"
                                name="inputID"
                                value={input.inputID}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="inputType" className="mb-3">
                            <Form.Label>Input Type:</Form.Label>
                            <Form.Control
                                type="text"
                                name="inputType"
                                value={input.inputType}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="inputDisplayName" className="mb-3">
                            <Form.Label>Input Display Name:</Form.Label>
                            <Form.Control
                                type="text"
                                name="inputDisplayName"
                                value={input.inputDisplayName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="inputVariables" className="mb-3">
                            <Form.Label>Input Variables:</Form.Label>
                            <Form.Control
                                type="text"
                                name="inputVariables"
                                value={input.inputVariables}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="predecessor" className="mb-3">
                            <Form.Label>Predecessor:</Form.Label>
                            <Form.Control
                                type="text"
                                name="predecessor"
                                value={input.predecessor}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="status" className="mb-3">
                            <Form.Label>Status:</Form.Label>
                            <Form.Control
                                type="text"
                                name="status"
                                value={input.status}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            {editingIndex !== null ? 'Update' : 'Submit'}
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
            <Table striped bordered hover responsive className="mt-3">
                <thead>
                    <tr>
                        {/* <th>#</th> */}
                        <th>ID</th>
                        <th>Module ID</th>
                        <th>Process ID</th>
                        <th>Task ID</th>
                        <th>Input ID</th>
                        <th>Input Type</th>
                        <th>Input Display Name</th>
                        <th>Input Variables</th>
                        <th>Predecessor</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredInputs.slice(0, 10).map((input, index) => (
                        <tr key={index}>
                            {/* <td>{(currentPage - 1) * 10 + index + 1}</td> */}
                            <td>{input.id}</td>
                            <td>{input.moduleID}</td>
                            <td>{input.processID}</td>
                            <td>{input.taskID}</td>
                            <td>{input.inputID}</td>
                            <td>{input.inputType}</td>
                            <td>{input.inputDisplayName}</td>
                            <td>{input.inputVariables}</td>
                            <td>{input.predecessor}</td>
                            <td>{input.status}</td>
                            <td>
                            <i className='btn ri-edit-line' onClick={() => handleEdit(index)}></i>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

                )}
        </div>
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
    );
};

export default InputMaster;
