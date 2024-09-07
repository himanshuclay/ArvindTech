import React, { useState, useEffect, ChangeEvent } from 'react';
import { Button, Form, Offcanvas, Table, Pagination } from 'react-bootstrap';
import axios from 'axios';

interface Module {
    id: number;
    moduleDisplayName: string;
    fmsType: string;
    moduleID: string;
    misExemptID: number;
    statusID: number;
    moduleOwnerID: string;
    moduleOwnerName: string;
    createdBy: string;
    updatedBy: string;
}

const ModuleMaster: React.FC = () => {
    const [module, setModule] = useState<Module>({
        id: 0,
        moduleDisplayName: '',
        fmsType: '',
        moduleID: '',
        misExemptID: 0,
        statusID: 0,
        moduleOwnerID: '',
        moduleOwnerName: '',
        createdBy: '',
        updatedBy: ''
    });

    const [modules, setModules] = useState<Module[]>([]);
    const [show, setShow] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        fetchModules();
    }, [currentPage, rowsPerPage]);

    const fetchModules = async () => {
        try {
            const response = await axios.get('https://localhost:44307/api/ModuleMaster/GetModule', {
                params: {
                    PageIndex: currentPage
                }
            });
            if (response.data.isSuccess) {
                setModules(response.data.moduleMasterList);
                console.log(response.data.moduleMasterList);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching modules:', error);
        }
    };

    const handleShow = () => setShow(true);

    const handleChange =  (e: ChangeEvent<any>) => {
        const { name, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked; // Cast to HTMLInputElement to access `checked`
            setModule({
                ...module,
                [name]: checked
            });
        } else {
            const value = (e.target as HTMLSelectElement | HTMLInputElement).value; // Cast to HTMLInputElement or HTMLSelectElement to access `value`
            setModule({
                ...module,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (editingIndex !== null) {
                await axios.post('https://localhost:44307/api/ModuleMaster/UpdateModule', module);
            } else {
                await axios.post('https://localhost:44307/api/ModuleMaster/InsertModule', module);
            }
            fetchModules();
            handleClose();
        } catch (error) {
            console.error('Error submitting module:', error);
        }
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
            id: 0,
            moduleDisplayName: '',
            fmsType: '',
            moduleID: '',
            misExemptID: 0,
            statusID: 0,
            moduleOwnerID: '',
            moduleOwnerName: 'new',
            createdBy: '',
            updatedBy: ''
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
        module.moduleDisplayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        module.moduleID.toLowerCase().includes(searchQuery.toLowerCase())||
        module.fmsType.toLowerCase().includes(searchQuery.toLowerCase())||
        module.moduleOwnerID.toLowerCase().includes(searchQuery.toLowerCase())||
        module.moduleOwnerName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indexOfLastModule = currentPage * rowsPerPage;
    const indexOfFirstModule = indexOfLastModule - rowsPerPage;
    const currentModules = filteredModules.slice(indexOfFirstModule, indexOfLastModule);

    const totalPages = Math.ceil(filteredModules.length / rowsPerPage);

    const convertToCSV = (data: Module[]) => {
        const csvRows = [
            ['ID', 'Module Display Name', 'FMS Type', 'Module ID', 'MIS Exempt ID', 'Status ID', 'Module Owner Name ID', 'Created By', 'Updated By'],
            ...data.map(mod => [
                mod.id.toString(),
                mod.moduleDisplayName,
                mod.fmsType,
                mod.moduleID,
                mod.misExemptID.toString(),
                mod.statusID.toString(),
                mod.moduleOwnerName.toString(),
                mod.createdBy,
                mod.updatedBy
            ])
        ];

        return csvRows.map(row => row.join(',')).join('\n');
    };

    const downloadCSV = () => {
        const csvData = convertToCSV(modules);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'Modules.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
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
                    <Button variant="primary" onClick={downloadCSV} className="me-2">
                        Download CSV
                    </Button>
                </div>
            </div>

            <Offcanvas show={show} onHide={handleClose}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Module Form</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="moduleDisplayName" className="mb-3">
                            <Form.Label>Module Display Name:</Form.Label>
                            <Form.Control
                                type="text"
                                name="moduleDisplayName"
                                value={module.moduleDisplayName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="moduleID" className="mb-3">
                            <Form.Label>Module ID:</Form.Label>
                            <Form.Control
                                type="text"
                                name="moduleID"
                                value={module.moduleID}
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
                        <Form.Group controlId="misExemptID" className="mb-3">
                            <Form.Label>MIS Exempt ID:</Form.Label>
                            <Form.Control
                                type="number"
                                name="misExemptID"
                                value={module.misExemptID}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="statusID" className="mb-3">
                            <Form.Label>Status ID:</Form.Label>
                            <Form.Control
                                type="number"
                                name="statusID"
                                value={module.statusID}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="moduleOwnerNameID" className="mb-3">
                            <Form.Label>Module Owner Name ID:</Form.Label>
                            <Form.Control
                                type="text"
                                name="moduleOwnerNameID"
                                value={module.moduleOwnerName}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="createdBy" className="mb-3">
                            <Form.Label>Created By:</Form.Label>
                            <Form.Control
                                type="text"
                                name="createdBy"
                                value={module.createdBy}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="updatedBy" className="mb-3">
                            <Form.Label>Updated By:</Form.Label>
                            <Form.Control
                                type="text"
                                name="updatedBy"
                                value={module.updatedBy}
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
            <div className="overflow-auto">
            <Table className='bg-white' striped bordered hover>
                <thead>
                    <tr>
                        <th>Module Display Name</th>
                        <th>Module ID</th>
                        <th>FMS Type</th>
                        <th>MIS Exempt ID</th>
                        <th>Status ID</th>
                        <th>Module Owner ID</th>
                        <th>Module Owner Name</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentModules.map((mod, index) => (
                        <tr key={index}>
                            <td>{mod.moduleDisplayName}</td>
                            <td>{mod.moduleID}</td>
                            <td>{mod.fmsType}</td>
                            <td>{mod.misExemptID}</td>
                            <td>{mod.statusID}</td>
                            <td>{mod.moduleOwnerID}</td>
                            <td>{mod.moduleOwnerName}</td>
                            <td>
                                <i className='btn ri-edit-line' onClick={() => handleEdit(index)}></i>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            </div>
          
        </div>
    );
};

export default ModuleMaster;

