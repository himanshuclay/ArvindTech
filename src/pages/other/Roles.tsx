import React, { useState, useEffect, ChangeEvent } from 'react';
import { Button, Form, Offcanvas, Table, Pagination } from 'react-bootstrap';
import axios from 'axios';

interface Role {
    id: number;
    roleName: string;
    moduleID: number;
    createdBy: string;
    updatedBy: string;
}

const RoleMaster: React.FC = () => {
    const [role, setRole] = useState<Role>({
        id: 0,
        roleName: '',
        moduleID: 0,
        createdBy: '',
        updatedBy: ''
    });

    const [roles, setRoles] = useState<Role[]>([]);
    const [show, setShow] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loading, setLoading] = useState<boolean>(false);


    useEffect(() => {
        fetchRoles();
    }, [currentPage, rowsPerPage]);

    const fetchRoles = async () => {
        setLoading(true);

        try {
            const response = await axios.get('https://arvindo-api2.clay.in/api/RoleMaster/GetRole', {
                params: {
                    PageIndex: currentPage
                }
            });
            if (response.data.isSuccess) {
                setRoles(response.data.roleMasterListResponses);
                console.log(response.data.roleMasterListResponses);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
        finally {
            setLoading(false); // End loading
        }
    };

    const handleShow = () => setShow(true);

    const handleChange = (e: ChangeEvent<any>) => {
        const { name, value } = e.target as HTMLInputElement | HTMLSelectElement;
        setRole({
            ...role,
            [name]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (editingIndex !== null) {
                await axios.post('https://arvindo-api2.clay.in/api/RoleMaster/UpdateRole', role);
            } else {
                await axios.post('https://arvindo-api2.clay.in/api/RoleMaster/InsertRole', role);
            }
            fetchRoles();
            handleClose();
        } catch (error) {
            console.error('Error submitting role:', error);
        }
    };

    const handleEdit = (index: number) => {
        setEditingIndex(index);
        setRole(roles[index]);
        handleShow();
    };

    const handleClose = () => {
        setShow(false);
        setEditingIndex(null);
        setRole({
            id: 0,
            roleName: '',
            moduleID: 0,
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

    const filteredRoles = roles.filter(role =>
        role.roleName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indexOfLastRole = currentPage * rowsPerPage;
    const indexOfFirstRole = indexOfLastRole - rowsPerPage;
    const currentRoles = filteredRoles.slice(indexOfFirstRole, indexOfLastRole);

    const totalPages = Math.ceil(filteredRoles.length / rowsPerPage);

    const convertToCSV = (data: Role[]) => {
        const csvRows = [
            ['ID', 'Role Name', 'Module ID', 'Created By', 'Updated By'],
            ...data.map(role => [
                role.id.toString(),
                role.roleName,
                role.moduleID.toString(),
                role.createdBy,
                role.updatedBy
            ])
        ];

        return csvRows.map(row => row.join(',')).join('\n');
    };

    const downloadCSV = () => {
        const csvData = convertToCSV(roles);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'Roles.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="container">
            <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center">
                <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>Roles List</span></span>
                <div className="d-flex">
                    <div className="app-search d-none d-lg-block me-4">
                        <form>
                            <div className="input-group">
                                <input
                                    type="search"
                                    className="form-control"
                                    placeholder="Search role..."
                                    value={searchQuery}
                                    onChange={handleSearch}
                                />
                                <span className="ri-search-line search-icon text-muted" />
                            </div>
                        </form>
                    </div>
                    <Button variant="primary" onClick={handleShow} className="me-2">
                        Add Role
                    </Button>
                    <Button variant="primary" onClick={downloadCSV} className="me-2">
                        Download CSV
                    </Button>
                </div>
            </div>

            <Offcanvas show={show} onHide={handleClose}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Role Form</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="roleName" className="mb-3">
                            <Form.Label>Role Name:</Form.Label>
                            <Form.Control
                                type="text"
                                name="roleName"
                                value={role.roleName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="moduleID" className="mb-3">
                            <Form.Label>Module ID:</Form.Label>
                            <Form.Control
                                type="number"
                                name="moduleID"
                                value={role.moduleID}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="createdBy" className="mb-3">
                            <Form.Label>Created By:</Form.Label>
                            <Form.Control
                                type="text"
                                name="createdBy"
                                value={role.createdBy}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="updatedBy" className="mb-3">
                            <Form.Label>Updated By:</Form.Label>
                            <Form.Control
                                type="text"
                                name="updatedBy"
                                value={role.updatedBy}
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
                {loading ? (
                    <div className='loader-container'>
                        <div className="loader"></div>
                        <div className='mt-2'>Please Wait!</div>
                    </div>
                ) : (

                    <Table className='bg-white' striped bordered hover>
                        <thead>
                            <tr>
                                <th>Role Name</th>
                                <th>Module ID</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRoles.map((role, index) => (
                                <tr key={index}>
                                    <td>{role.roleName}</td>
                                    <td>{role.moduleID}</td>
                                    <td>
                                        <i className='btn ri-edit-line' onClick={() => handleEdit(index)}></i>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}

            </div>
        </div>
    );
};

export default RoleMaster;
