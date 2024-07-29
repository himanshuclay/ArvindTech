import React, { useState, useEffect, ChangeEvent } from 'react';
import { Button, Form, Offcanvas, Table, Pagination } from 'react-bootstrap';
import axios from 'axios';

interface ModuleMaster {
    id: number;
    moduleDisplayName: string;
    fmsType: string;
    moduleID: string;
    misExemptID: number;
    statusID: number;
    moduleOwnerNameID: number;
    createdBy: string;
    updatedBy: string;
}

const ModuleMasterPage: React.FC = () => {
    const [moduleMaster, setModuleMaster] = useState<ModuleMaster>({
        id: 0,
        moduleDisplayName: '',
        fmsType: '',
        moduleID: '',
        misExemptID: 0,
        statusID: 0,
        moduleOwnerNameID: 0,
        createdBy: '',
        updatedBy: ''
    });

    const [moduleMasterList, setModuleMasterList] = useState<ModuleMaster[]>([]);
    const [show, setShow] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        fetchModuleMaster(currentPage, rowsPerPage);
    }, [currentPage, rowsPerPage]);

    const fetchModuleMaster = async (page: number, rows: number) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ id: '1', PageIndex: page.toString(), RowsPerPage: rows.toString() });
            const url = `https://localhost:44306/api/ModuleMaster/GetModule?${params.toString()}`;

            const response = await axios.get(url, {
                headers: {
                    'accept': '*/*'
                }
            });

            if (response && response.status === 200 && response.data.isSuccess) {
                setModuleMasterList(response.data.moduleMasterList);
                setTotalCount(response.data.totalCount);
            } else {
                console.error('Failed to fetch module master list: Invalid response status');
            }
        } catch (error) {
            console.error('An error occurred while fetching the module master list:', error);
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
            setModuleMaster({
                ...moduleMaster,
                [name]: checked
            });
        } else {
            setModuleMaster({
                ...moduleMaster,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const payload = { ...moduleMaster, updatedBy: moduleMaster.createdBy };

        try {
            let response;
            if (editingIndex !== null) {
                // Update existing module master
                response = await axios.post('https://localhost:44306/api/ModuleMaster/UpdateModule', payload, {
                    headers: {
                        'accept': '*/*',
                        'Content-Type': 'application/json'
                    }
                });
            } else {
                // Insert new module master
                response = await axios.post('https://localhost:44306/api/ModuleMaster/InsertModule', payload, {
                    headers: {
                        'accept': '*/*',
                        'Content-Type': 'application/json'
                    }
                });
            }

            if (response.status === 200 || response.status === 201) {
                const newModuleMaster = response.data;

                if (editingIndex !== null) {
                    const updatedModuleMasterList = [...moduleMasterList];
                    updatedModuleMasterList[editingIndex] = newModuleMaster;
                    setModuleMasterList(updatedModuleMasterList);
                } else {
                    setModuleMasterList([...moduleMasterList, { ...newModuleMaster, id: moduleMasterList.length + 1 }]);
                }
                handleClose();
            } else {
                console.error('Failed to submit module master');
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('An error occurred while submitting the module master:', error.response.data);
            } else {
                console.error('An error occurred while submitting the module master:', error);
            }
        }
    };

    const handleEdit = (index: number) => {
        setEditingIndex(index);
        setModuleMaster(moduleMasterList[index]);
        handleShow();
    };

    const handleClose = () => {
        setShow(false);
        setEditingIndex(null);
        setModuleMaster({
            id: 0,
            moduleDisplayName: '',
            fmsType: '',
            moduleID: '',
            misExemptID: 0,
            statusID: 0,
            moduleOwnerNameID: 0,
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

    const convertToCSV = (data: ModuleMaster[]) => {
        const csvRows = [
            ['Module Display Name', 'FMS Type', 'Module ID', 'MIS Exempt ID', 'Status ID', 'Module Owner Name ID', 'Created By'],
            ...data.map(module => [
                module.moduleDisplayName,
                module.fmsType,
                module.moduleID,
                module.misExemptID.toString(),
                module.statusID.toString(),
                module.moduleOwnerNameID.toString(),
                module.createdBy
            ])
        ];

        return csvRows.map(row => row.join(',')).join('\n');
    };

    const downloadCSV = () => {
        const csvData = convertToCSV(moduleMasterList);
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'module_masters.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="container">
            <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center">
                <span><i className="ri-projector-line me-2"></i><span className='fw-bold'>Module Master List</span></span>
                <div className="d-flex">
                    <div className="app-search d-none d-lg-block me-4">
                        <form>
                            <div className="input-group">
                                <input
                                    type="search"
                                    className="form-control"
                                    placeholder="Search Module..."
                                    value={searchQuery}
                                    onChange={handleSearch}
                                />
                                <span className="ri-search-line search-icon text-muted" />
                            </div>
                        </form>
                    </div>
                    <Button variant="primary" onClick={handleShow}>
                        <i className="ri-add-line align-bottom me-1"></i> Add Module Master
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
                            <th>Module Display Name</th>
                            <th>FMS Type</th>
                            <th>Module ID</th>
                            <th>MIS Exempt ID</th>
                            <th>Status ID</th>
                            <th>Module Owner Name ID</th>
                            <th>Created By</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {moduleMasterList.map((module, index) => (
                            <tr key={index}>
                                <td>{module.moduleDisplayName}</td>
                                <td>{module.fmsType}</td>
                                <td>{module.moduleID}</td>
                                <td>{module.misExemptID}</td>
                                <td>{module.statusID}</td>
                                <td>{module.moduleOwnerNameID}</td>
                                <td>{module.createdBy}</td>
                                <td>
                                    <Button variant="warning" size="sm" onClick={() => handleEdit(index)}>
                                        Edit
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
            <Offcanvas show={show} onHide={handleClose} placement='end'>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>{editingIndex !== null ? 'Edit Module Master' : 'Add Module Master'}</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Module Display Name</Form.Label>
                            <Form.Control type="text" name="moduleDisplayName" value={moduleMaster.moduleDisplayName} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>FMS Type</Form.Label>
                            <Form.Control type="text" name="fmsType" value={moduleMaster.fmsType} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Module ID</Form.Label>
                            <Form.Control type="text" name="moduleID" value={moduleMaster.moduleID} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>MIS Exempt ID</Form.Label>
                            <Form.Control type="number" name="misExemptID" value={moduleMaster.misExemptID} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Status ID</Form.Label>
                            <Form.Control type="number" name="statusID" value={moduleMaster.statusID} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Module Owner Name ID</Form.Label>
                            <Form.Control type="number" name="moduleOwnerNameID" value={moduleMaster.moduleOwnerNameID} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Created By</Form.Label>
                            <Form.Control type="text" name="createdBy" value={moduleMaster.createdBy} onChange={handleChange} required />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            {editingIndex !== null ? 'Update' : 'Save'}
                        </Button>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
};

export default ModuleMasterPage;
