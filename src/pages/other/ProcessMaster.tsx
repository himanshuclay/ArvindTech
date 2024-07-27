import React, { useState, useEffect, ChangeEvent } from 'react';
import { Button, Form, Offcanvas, Table, Pagination } from 'react-bootstrap';
import axios from 'axios';

interface ProcessMaster {
    id: number;
    moduleID: number;
    processDisplayName: string;
    dashboardTab: string;
    processID: string;
    processInput: string;
    procssOutput: string;
    createdBy: string;
    updatedBy: string;
}

const ProcessMasterPage: React.FC = () => {
    const [processMaster, setProcessMaster] = useState<ProcessMaster>({
        id: 0,
        moduleID: 0,
        processDisplayName: '',
        dashboardTab: '',
        processID: '',
        processInput: '',
        procssOutput: '',
        createdBy: '',
        updatedBy: ''
    });

    const [processMasterList, setProcessMasterList] = useState<ProcessMaster[]>([]);
    const [show, setShow] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        fetchProcessMaster(currentPage, rowsPerPage);
    }, [currentPage, rowsPerPage]);

    const fetchProcessMaster = async (page: number, rows: number) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ PageIndex: page.toString(), RowsPerPage: rows.toString() });
            const url = `https://localhost:44306/api/ProcessMaster/GetProcess?id=1&${params.toString()}`;

            const response = await axios.get(url, {
                headers: {
                    'accept': '*/*'
                }
            });

            if (response && response.status === 200 && response.data.isSuccess) {
                setProcessMasterList(response.data.processMasterList);
                setTotalCount(response.data.totalCount);
            } else {
                console.error('Failed to fetch process master list: Invalid response status');
            }
        } catch (error) {
            console.error('An error occurred while fetching the process master list:', error);
            if (error.response) {
                console.error('Error response data:', error.response.data);
                console.error('Error response status:', error.response.status);
                console.error('Error response headers:', error.response.headers);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleShow = () => setShow(true);

    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement | HTMLSelectElement;
        if (type === 'checkbox') {
            setProcessMaster({
                ...processMaster,
                [name]: checked
            });
        } else {
            setProcessMaster({
                ...processMaster,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const payload = { ...processMaster, updatedBy: processMaster.createdBy };
        console.log(payload)

        try {
            let response;
            if (editingIndex !== null) {
                // Update existing process master
                response = await axios.post('https://localhost:44306/api/ProcessMaster/UpdateProcess', payload, {
                    headers: {
                        'accept': '*/*',
                        'Content-Type': 'application/json'
                    }
                });
            } else {
                // Insert new process master
                response = await axios.post('https://localhost:44306/api/ProcessMaster/InsertProcess', payload, {
                    headers: {
                        'accept': '*/*',
                        'Content-Type': 'application/json'
                    }
                });
            }

            if (response.status === 200 || response.status === 201) {
                const newProcessMaster = response.data;

                if (editingIndex !== null) {
                    const updatedProcessMasterList = [...processMasterList];
                    updatedProcessMasterList[editingIndex] = newProcessMaster;
                    setProcessMasterList(updatedProcessMasterList);
                } else {
                    setProcessMasterList([...processMasterList, { ...newProcessMaster, id: processMasterList.length + 1 }]);
                }
                handleClose();
            } else {
                console.error('Failed to submit process master');
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('An error occurred while submitting the process master:', error.response.data);
            } else {
                console.error('An error occurred while submitting the process master:', error);
            }
        }
    };

    const handleEdit = (index: number) => {
        setEditingIndex(index);
        setProcessMaster(processMasterList[index]);
        handleShow();
    };

    const handleClose = () => {
        setShow(false);
        setEditingIndex(null);
        setProcessMaster({
            id: 0,
            moduleID: 0,
            processDisplayName: '',
            dashboardTab: '',
            processID: '',
            processInput: '',
            procssOutput: '',
            createdBy: '',
            updatedBy: ''
        });
    };

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleRowsPerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(totalCount / rowsPerPage);

    const convertToCSV = (data: ProcessMaster[]) => {
        const csvRows = [
            ['Process Display Name', 'Module ID', 'Dashboard Tab', 'Process ID', 'Process Input', 'Process Output', 'Created By'],
            ...data.map(process => [
                process.processDisplayName,
                process.moduleID.toString(),
                process.dashboardTab,
                process.processID,
                process.processInput,
                process.procssOutput,
                process.createdBy
            ])
        ];

        return csvRows.map(row => row.join(',')).join('\n');
    };

    const downloadCSV = () => {
        const csvData = convertToCSV(processMasterList);
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'process_masters.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="container">
            <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center">
                <span><i className="ri-projector-line me-2"></i><span className='fw-bold'>Process Master List</span></span>
                <div className="d-flex">
                    <div className="app-search d-none d-lg-block me-4">
                        <form>
                            <div className="input-group">
                                <input
                                    type="search"
                                    className="form-control"
                                    placeholder="Search Process Master..."
                                    value={searchQuery}
                                    onChange={handleSearch}
                                />
                                <span className="ri-search-line search-icon text-muted" />
                            </div>
                        </form>
                    </div>
                    <Button variant="primary" onClick={handleShow}>
                        <i className="ri-add-line align-bottom me-1"></i> Add Process Master
                    </Button>
                    <Button variant="success" onClick={downloadCSV} className="ms-2">
                        <i className="ri-file-download-line align-bottom me-1"></i> Download CSV
                    </Button>
                </div>
            </div>
            {loading ? (
                <div className="text-center mt-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Process Display Name</th>
                            <th>Module ID</th>
                            <th>Dashboard Tab</th>
                            <th>Process ID</th>
                            <th>Process Input</th>
                            <th>Process Output</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {processMasterList.map((process, index) => (
                            <tr key={index}>
                                <td>{process.processDisplayName}</td>
                                <td>{process.moduleID}</td>
                                <td>{process.dashboardTab}</td>
                                <td>{process.processID}</td>
                                <td>{process.processInput}</td>
                                <td>{process.procssOutput}</td>
                                <td>
                                    <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(index)}>
                                        <i className="ri-edit-line"></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
           <div className="d-flex justify-content-between align-items-center my-2">
                <div>
                    <Form.Select value={rowsPerPage} onChange={handleRowsPerPageChange}>
                        <option value={5}>5 rows</option>
                        <option value={10}>10 rows</option>
                        <option value={20}>20 rows</option>
                    </Form.Select>
                </div>
                <Pagination>
                    <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                    <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
                    <Pagination.Item active>{currentPage}</Pagination.Item>
                    <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
                    <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
                </Pagination>
            </div>
            <Offcanvas show={show} onHide={handleClose} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>{editingIndex !== null ? 'Edit Process Master' : 'Add Process Master'}</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Process Display Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Process Display Name"
                                name="processDisplayName"
                                value={processMaster.processDisplayName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Module ID</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter Module ID"
                                name="moduleID"
                                value={processMaster.moduleID}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Dashboard Tab</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Dashboard Tab"
                                name="dashboardTab"
                                value={processMaster.dashboardTab}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Process ID</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Process ID"
                                name="processID"
                                value={processMaster.processID}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Process Input</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Process Input"
                                name="processInput"
                                value={processMaster.processInput}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Process Output</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Process Output"
                                name="procssOutput"
                                value={processMaster.procssOutput}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Created By</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Creator's Name"
                                name="createdBy"
                                value={processMaster.createdBy}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="me-2">
                            {editingIndex !== null ? 'Update Process Master' : 'Add Process Master'}
                        </Button>
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
};

export default ProcessMasterPage;
