import React, { useState, useEffect, ChangeEvent } from 'react';
import { Button, Form, Offcanvas, Table, InputGroup, FormControl, Pagination } from 'react-bootstrap';

interface Module {
    displayName: string;
    fmsType: string;
    departmentId: string;
    misExempt: boolean;
    status2: string;
    ownerName: string;
}

const ModuleMaster: React.FC = () => {
    const [module, setModule] = useState<Module>({
        displayName: '',
        fmsType: '',
        departmentId: '',
        misExempt: false,
        status2: '',
        ownerName: ''
    });

    const [modules, setModules] = useState<Module[]>([]);
    const [show, setShow] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        const storedModules = localStorage.getItem('modules');
        if (storedModules) {
            setModules(JSON.parse(storedModules));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('modules', JSON.stringify(modules));
    }, [modules]);

    const handleShow = () => setShow(true);

    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement | HTMLSelectElement;
        if (type === 'checkbox') {
            setModule({
                ...module,
                [name]: checked
            });
        } else {
            setModule({
                ...module,
                [name]: value
            });
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (editingIndex !== null) {
            const updatedModules = [...modules];
            updatedModules[editingIndex] = module;
            setModules(updatedModules);
        } else {
            setModules([...modules, module]);
        }
        setModule({
            displayName: '',
            fmsType: '',
            departmentId: '',
            misExempt: false,
            status2: '',
            ownerName: ''
        });
        handleClose();
    };

    const handleEdit = (index: number) => {
        setEditingIndex(index);
        setModule(modules[index]);
        handleShow();
    };

    const handleClose = () => {
        setShow(false);
        setEditingIndex(null);
        setModule({
            displayName: '',
            fmsType: '',
            departmentId: '',
            misExempt: false,
            status2: '',
            ownerName: ''
        });
    };

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    const handleRowsPerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset to first page on rows per page change
    };

    const filteredModules = modules.filter(module =>
        module.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        module.fmsType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        module.departmentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        module.status2.toLowerCase().includes(searchQuery.toLowerCase()) ||
        module.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indexOfLastModule = currentPage * rowsPerPage;
    const indexOfFirstModule = indexOfLastModule - rowsPerPage;
    const currentModules = filteredModules.slice(indexOfFirstModule, indexOfLastModule);

    const totalPages = Math.ceil(filteredModules.length / rowsPerPage);

    const convertToCSV = (data: Module[]) => {
        const csvRows = [
            ['Display Name', 'Account', 'FMS Type', 'Department ID', 'MIS Exempt', 'Statu2s', 'Module Owner Name'],
            ...data.map(mod => [
                mod.displayName,
                mod.fmsType,
                mod.departmentId,
                mod.misExempt ? 'Yes' : 'No',
                mod.status2,
                mod.ownerName
            ])
        ];

        return csvRows.map(row => row.join(',')).join('\n');
    };

    const downloadCSV = () => {
        const csvData = convertToCSV(modules);
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'modules.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="container">
            <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center">
                <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>Modules List</span></span>
                <div className="d-flex">
                    <div className="app-search d-none d-lg-block me-4">
                        <form>
                            <div className="input-group">
                                <input
                                    type="search"
                                    className="form-control"
                                    placeholder="Search module..."
                                    value={searchQuery}
                                    onChange={handleSearch}
                                />
                                <span className="ri-search-line search-icon text-muted" />
                            </div>
                        </form>
                    </div>
                    <Button variant="primary" onClick={handleShow} className="me-2">
                        Add Module
                    </Button>
                    <Button variant="secondary" onClick={downloadCSV}>
                        Download CSV
                    </Button>
                </div>
            </div>

            <Offcanvas show={show} onHide={handleClose} >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Module Form</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="displayName" className="mb-3">
                            <Form.Label>Module Display Name:</Form.Label>
                            <Form.Control
                                type="text"
                                name="displayName"
                                value={module.displayName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="fmsType" className="mb-3">
                            <Form.Label>FMS Type:</Form.Label>
                            <Form.Control
                                type="text"
                                name="fmsType"
                                value={module.fmsType}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="departmentId" className="mb-3">
                            <Form.Label>Department ID:</Form.Label>
                            <Form.Control
                                type="text"
                                name="departmentId"
                                value={module.departmentId}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="misExempt" className="mb-3">
                            <Form.Check
                                type="checkbox"
                                label="MIS Exempt"
                                name="misExempt"
                                checked={module.misExempt}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="status2" className="mb-3">
                            <Form.Label>Status:</Form.Label>
                            <Form.Control
                                as="select"
                                name="status2"
                                value={module.status2}
                                onChange={handleChange}
                                required

                            >
                                <option value="">Select Status</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="ownerName" className="mb-3">
                            <Form.Label>Module Owner Name:</Form.Label>
                            <Form.Control
                                type="text"
                                name="ownerName"
                                value={module.ownerName}
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
             

            <Table className='bg-white' striped bordered hover>
                <thead>
                    <tr>
                        <th>Display Name</th>
                        <th>FMS Type</th>
                        <th>Department ID</th>
                        <th>MIS Exempt</th>
                        <th>Status</th>
                        <th>Module Owner Name</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentModules.map((mod, index) => (
                        <tr key={index}>
                            <td>{mod.displayName}</td>
                            <td>{mod.fmsType}</td>
                            <td>{mod.departmentId}</td>
                            <td>{mod.misExempt ? 'Yes' : 'No'}</td>
                            <td>{mod.status2}</td>
                            <td>{mod.ownerName}</td>
                            <td>
                                <i className='btn ri-edit-line' onClick={() => handleEdit(index + indexOfFirstModule)}></i>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default ModuleMaster;
