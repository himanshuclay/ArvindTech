import React, { useState, useEffect, ChangeEvent } from 'react';
import { Button, Form, Offcanvas, Table, Pagination } from 'react-bootstrap';
import axios from 'axios';

<<<<<<< HEAD
interface ProcessMaster {
    id: number;
    moduleID: number;
    processDisplayName: string;
    dashboardTab: string;
    processID: string;
    processInput: string;
    procssOutput: string;
=======
interface Process {
    id: number;
    moduleName: string;
    processID: string;
    processDisplayName: string;
    misExempt: string;
    dashboardTab: string;
    processInput: string;
    processOutput: string;
    processFlowchart: string;
    processOwnerID: string;
    processOwnerName: string;
>>>>>>> sumit-dev
    createdBy: string;
    updatedBy: string;
}

<<<<<<< HEAD
const ProcessMasterPage: React.FC = () => {
    const [processMaster, setProcessMaster] = useState<ProcessMaster>({
        id: 0,
        moduleID: 0,
        processDisplayName: '',
        dashboardTab: '',
        processID: '',
        processInput: '',
        procssOutput: '',
=======
const ProcessMaster: React.FC = () => {
    const [process, setProcess] = useState<Process>({
        id: 0,
        moduleName: '',
        processID: '',
        processDisplayName: '',
        misExempt: '',
        dashboardTab: '',
        processInput: '',
        processOutput: '',
        processFlowchart: '',
        processOwnerID: '',
        processOwnerName: '',
>>>>>>> sumit-dev
        createdBy: '',
        updatedBy: ''
    });

<<<<<<< HEAD
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
=======
    const [processes, setProcesses] = useState<Process[]>([]);
    const [show, setShow] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        fetchProcesses();
    }, [currentPage, rowsPerPage]);

    const fetchProcesses = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://localhost:7074/api/ProcessMaster/GetProcess', {
                params: {
                    PageIndex: currentPage
                }
            });
            if (response.data.isSuccess) {
                setProcesses(response.data.processMasterList);
                console.log(response.data.processMasterList);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching processes:', error);
        }
        finally {
            setLoading(false); // End loading
>>>>>>> sumit-dev
        }
    };

    const handleShow = () => setShow(true);

    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement | HTMLSelectElement;
        if (type === 'checkbox') {
<<<<<<< HEAD
            setProcessMaster({
                ...processMaster,
                [name]: checked
            });
        } else {
            setProcessMaster({
                ...processMaster,
=======
            setProcess({
                ...process,
                [name]: checked
            });
        } else {
            setProcess({
                ...process,
>>>>>>> sumit-dev
                [name]: value
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
<<<<<<< HEAD

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
=======
        try {
            if (editingIndex !== null) {
                await axios.post('https://localhost:7074/api/ProcessMaster/UpdateProcess', process);
            } else {
                await axios.post('https://localhost:7074/api/ProcessMaster/InsertProcess', process);
            }
            fetchProcesses();
            handleClose();
        } catch (error) {
            console.error('Error submitting process:', error);
>>>>>>> sumit-dev
        }
    };

    const handleEdit = (index: number) => {
        setEditingIndex(index);
<<<<<<< HEAD
        setProcessMaster(processMasterList[index]);
=======
        setProcess(processes[index]);
>>>>>>> sumit-dev
        handleShow();
    };

    const handleClose = () => {
        setShow(false);
        setEditingIndex(null);
<<<<<<< HEAD
        setProcessMaster({
            id: 0,
            moduleID: 0,
            processDisplayName: '',
            dashboardTab: '',
            processID: '',
            processInput: '',
            procssOutput: '',
=======
        setProcess({
            id: 0,
            moduleName: '',
            processID: '',
            processDisplayName: '',
            misExempt: '',
            dashboardTab: '',
            processInput: '',
            processOutput: '',
            processFlowchart: '',
            processOwnerID: '',
            processOwnerName: '',
>>>>>>> sumit-dev
            createdBy: '',
            updatedBy: ''
        });
    };

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
<<<<<<< HEAD
        setCurrentPage(1);
=======
        setCurrentPage(1); // Reset to first page on search
>>>>>>> sumit-dev
    };

    const handleRowsPerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(e.target.value));
<<<<<<< HEAD
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
=======
        setCurrentPage(1); // Reset to first page on rows per page change
    };

    const filteredProcesses = processes.filter(proc =>
        proc.moduleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proc.processID.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proc.processDisplayName.toLowerCase().includes(searchQuery.toLowerCase())||
        proc.processInput.toLowerCase().includes(searchQuery.toLowerCase())||
        proc.processOutput.toLowerCase().includes(searchQuery.toLowerCase())||
        proc.processFlowchart.toLowerCase().includes(searchQuery.toLowerCase())||
        proc.processOwnerID.toLowerCase().includes(searchQuery.toLowerCase())||
        proc.processOwnerName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indexOfLastProcess = currentPage * rowsPerPage;
    const indexOfFirstProcess = indexOfLastProcess - rowsPerPage;
    const currentProcesses = filteredProcesses.slice(indexOfFirstProcess, indexOfLastProcess);

    const totalPages = Math.ceil(filteredProcesses.length / rowsPerPage);

    const convertToCSV = (data: Process[]) => {
        const csvRows = [
            ['ID', 'Module Name', 'Process ID', 'Process Display Name', 'MIS Exempt', 'Dashboard Tab', 'Process Input', 'Process Output', 'Process Flowchart', 'Process Owner ID', 'Process Owner Name', 'Created By', 'Updated By'],
            ...data.map(proc => [
                proc.id.toString(),
                proc.moduleName,
                proc.processID,
                proc.processDisplayName,
                proc.misExempt,
                proc.dashboardTab,
                proc.processInput,
                proc.processOutput,
                proc.processFlowchart,
                proc.processOwnerID,
                proc.processOwnerName,
                proc.createdBy,
                proc.updatedBy
>>>>>>> sumit-dev
            ])
        ];

        return csvRows.map(row => row.join(',')).join('\n');
    };

    const downloadCSV = () => {
<<<<<<< HEAD
        const csvData = convertToCSV(processMasterList);
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'process_masters.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
=======
        const csvData = convertToCSV(processes);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'Processes.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
>>>>>>> sumit-dev
    };

    return (
        <div className="container">
            <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center">
<<<<<<< HEAD
                <span><i className="ri-projector-line me-2"></i><span className='fw-bold'>Process Master List</span></span>
=======
                <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>Processes List</span></span>
>>>>>>> sumit-dev
                <div className="d-flex">
                    <div className="app-search d-none d-lg-block me-4">
                        <form>
                            <div className="input-group">
                                <input
                                    type="search"
                                    className="form-control"
<<<<<<< HEAD
                                    placeholder="Search Process Master..."
=======
                                    placeholder="Search process..."
>>>>>>> sumit-dev
                                    value={searchQuery}
                                    onChange={handleSearch}
                                />
                                <span className="ri-search-line search-icon text-muted" />
                            </div>
                        </form>
                    </div>
<<<<<<< HEAD
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
=======
                    <Button variant="primary" onClick={handleShow} className="me-2">
                        Add Process
                    </Button>
                    <Button variant="primary" onClick={downloadCSV} className="me-2">
                        Download CSV
                    </Button>
                </div>
            </div>

            <Offcanvas show={show} onHide={handleClose} >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Process Form</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="moduleName" className="mb-3">
                            <Form.Label>Module Name:</Form.Label>
                            <Form.Control
                                type="text"
                                name="moduleName"
                                value={process.moduleName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="processID" className="mb-3">
                            <Form.Label>Process ID:</Form.Label>
                            <Form.Control
                                type="text"
                                name="processID"
                                value={process.processID}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="processDisplayName" className="mb-3">
                            <Form.Label>Process Display Name:</Form.Label>
                            <Form.Control
                                type="text"
                                name="processDisplayName"
                                value={process.processDisplayName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="misExempt" className="mb-3">
                            <Form.Label>MIS Exempt:</Form.Label>
                            <Form.Control
                                type="text"
                                name="misExempt"
                                value={process.misExempt}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="dashboardTab" className="mb-3">
                            <Form.Label>Dashboard Tab:</Form.Label>
                            <Form.Control
                                type="text"
                                name="dashboardTab"
                                value={process.dashboardTab}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="processInput" className="mb-3">
                            <Form.Label>Process Input:</Form.Label>
                            <Form.Control
                                type="text"
                                name="processInput"
                                value={process.processInput}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="processOutput" className="mb-3">
                            <Form.Label>Process Output:</Form.Label>
                            <Form.Control
                                type="text"
                                name="processOutput"
                                value={process.processOutput}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="processFlowchart" className="mb-3">
                            <Form.Label>Process Flowchart:</Form.Label>
                            <Form.Control
                                type="text"
                                name="processFlowchart"
                                value={process.processFlowchart}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="processOwnerID" className="mb-3">
                            <Form.Label>Process Owner ID:</Form.Label>
                            <Form.Control
                                type="text"
                                name="processOwnerID"
                                value={process.processOwnerID}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="processOwnerName" className="mb-3">
                            <Form.Label>Process Owner Name:</Form.Label>
                            <Form.Control
                                type="text"
                                name="processOwnerName"
                                value={process.processOwnerName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="createdBy" className="mb-3">
                            <Form.Label>Created By:</Form.Label>
                            <Form.Control
                                type="text"
                                name="createdBy"
                                value={process.createdBy}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="updatedBy" className="mb-3">
                            <Form.Label>Updated By:</Form.Label>
                            <Form.Control
                                type="text"
                                name="updatedBy"
                                value={process.updatedBy}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>
            <div className="d-flex justify-content-between align-items-center my-2">
>>>>>>> sumit-dev
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
<<<<<<< HEAD
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
=======
            <div className="overflow-auto">
            {loading ? (
                <div className='loader-container'>
                    <div className="loader"></div>
                    <div className='mt-2'>Please Wait!</div>
                </div>
            ) : (

                <Table className='bg-white' striped bordered hover>
                <thead>
                    <tr>
                        <th>Module Name</th>
                        <th>Process ID</th>
                        <th>Process Display Name</th>
                        <th>MIS Exempt</th>
                        <th>Process Input</th>
                        <th>Process Output</th>
                        <th>Process Flowchart</th>
                        <th>Process Owner ID</th>
                        <th>Process Owner Name</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentProcesses.map((proc, index) => (
                        <tr key={index}>
                            <td>{proc.moduleName}</td>
                            <td>{proc.processID}</td>
                            <td>{proc.processDisplayName}</td>
                            <td>{proc.misExempt}</td>
                            <td>{proc.processInput}</td>
                            <td>{proc.processOutput}</td>
                            <td>{proc.processFlowchart}</td>
                            <td>{proc.processOwnerID}</td>
                            <td>{proc.processOwnerName}</td>
                            <td>
                                <i className='btn ri-edit-line' onClick={() => handleEdit(index)}></i>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            )}
           
            </div>
      
>>>>>>> sumit-dev
        </div>
    );
};

<<<<<<< HEAD
export default ProcessMasterPage;
=======
export default ProcessMaster;

>>>>>>> sumit-dev
