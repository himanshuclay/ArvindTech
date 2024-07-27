    import React, { useState, useEffect, ChangeEvent } from 'react';
    import { Button, Form, Offcanvas, Table, Pagination } from 'react-bootstrap';
    import axios from 'axios';

    interface MessMaster {
        id: number;
        project_Id: number;
        messName: string;
        managerId: number;
        status: boolean;
        createdBy: string;
        updatedBy: string;
    }

    const MessMasterPage: React.FC = () => {
        const [messMaster, setMessMaster] = useState<MessMaster>({
            id: 0,
            project_Id: 0,
            messName: '',
            managerId: 0,
            status: true,
            createdBy: '',
            updatedBy: ''
        });

        const [messMasterList, setMessMasterList] = useState<MessMaster[]>([]);
        const [show, setShow] = useState(false);
        const [editingIndex, setEditingIndex] = useState<number | null>(null);
        const [searchQuery, setSearchQuery] = useState('');
        const [currentPage, setCurrentPage] = useState<number>(1);
        const [rowsPerPage, setRowsPerPage] = useState<number>(10);
        const [totalCount, setTotalCount] = useState<number>(0);
        const [loading, setLoading] = useState<boolean>(false);

        useEffect(() => {
            fetchMessMaster(currentPage, rowsPerPage);
        }, [currentPage, rowsPerPage]);

        const fetchMessMaster = async (page: number, rows: number) => {
            setLoading(true);
            try {
                const params = new URLSearchParams({ PageIndex: page.toString(), RowsPerPage: rows.toString() });
                const url = `https://localhost:44344/api/MessMaster/GetMess?${params.toString()}`;

                const response = await axios.get(url, {
                    headers: {
                        'accept': '*/*'
                    }
                });

                if (response && response.status === 200 && response.data.isSuccess) {
                    setMessMasterList(response.data.messMasterList);
                    setTotalCount(response.data.totalCount);
                } else {
                    console.error('Failed to fetch mess master list: Invalid response status');
                }
            } catch (error) {
                console.error('An error occurred while fetching the mess master list:', error);
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
                setMessMaster({
                    ...messMaster,
                    [name]: checked
                });
            } else {
                setMessMaster({
                    ...messMaster,
                    [name]: value
                });
            }
        };

        const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            const payload = { ...messMaster, updatedBy: messMaster.createdBy };

            try {
                let response;
                if (editingIndex !== null) {
                    // Update existing mess master
                    response = await axios.post('https://localhost:44344/api/MessMaster/UpdateMess', payload, {
                        headers: {
                            'accept': '*/*',
                            'Content-Type': 'application/json'
                        }
                    });
                } else {
                    // Insert new mess master
                    response = await axios.post('https://localhost:44344/api/MessMaster/InsertMess', payload, {
                        headers: {
                            'accept': '*/*',
                            'Content-Type': 'application/json'
                        }
                    });
                }

                if (response.status === 200 || response.status === 201) {
                    const newMessMaster = response.data;

                    if (editingIndex !== null) {
                        const updatedMessMasterList = [...messMasterList];
                        updatedMessMasterList[editingIndex] = newMessMaster;
                        setMessMasterList(updatedMessMasterList);
                    } else {
                        setMessMasterList([...messMasterList, { ...newMessMaster, id: messMasterList.length + 1 }]);
                    }
                    handleClose();
                } else {
                    console.error('Failed to submit mess master');
                }
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    console.error('An error occurred while submitting the mess master:', error.response.data);
                } else {
                    console.error('An error occurred while submitting the mess master:', error);
                }
            }
        };

        const handleEdit = (index: number) => {
            setEditingIndex(index);
            setMessMaster(messMasterList[index]);
            handleShow();
        };

        const handleClose = () => {
            setShow(false);
            setEditingIndex(null);
            setMessMaster({
                id: 0,
                project_Id: 0,
                messName: '',
                managerId: 0,
                status: true,
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

        const convertToCSV = (data: MessMaster[]) => {
            const csvRows = [
                ['Mess Name', 'Project ID', 'Manager ID', 'Status', 'Created By'],
                ...data.map(mess => [
                    mess.messName,
                    mess.project_Id.toString(),
                    mess.managerId.toString(),
                    mess.status.toString(),
                    mess.createdBy
                ])
            ];

            return csvRows.map(row => row.join(',')).join('\n');
        };

        const downloadCSV = () => {
            const csvData = convertToCSV(messMasterList);
            const blob = new Blob([csvData], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'mess_masters.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };

        return (
            <div className="container">
                <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center">
                    <span><i className="ri-projector-line me-2"></i><span className='fw-bold'>Mess Master List</span></span>
                    <div className="d-flex">
                        <div className="app-search d-none d-lg-block me-4">
                            <form>
                                <div className="input-group">
                                    <input
                                        type="search"
                                        className="form-control"
                                        placeholder="Search Bank..."
                                        value={searchQuery}
                                        onChange={handleSearch}
                                    />
                                    <span className="ri-search-line search-icon text-muted" />
                                </div>
                            </form>
                        </div>
                        <Button variant="primary" onClick={handleShow}>
                            <i className="ri-add-line align-bottom me-1"></i> Add Mess Master
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
                                <th>Mess Name</th>
                                <th>Project ID</th>
                                <th>Manager ID</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {messMasterList.map((mess, index) => (
                                <tr key={index}>
                                    <td>{mess.messName}</td>
                                    <td>{mess.project_Id}</td>
                                    <td>{mess.managerId}</td>
                                    <td>{mess.status ? 'Active' : 'Inactive'}</td>
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
        

    {/* <div className="d-flex justify-content-between align-items-center my-2">
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
                </div> */}




            



    <div className="d-flex justify-content-between align-items-center mt-2">
                    <Pagination>
                        <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                        <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                            <Pagination.Item key={pageNumber} active={pageNumber === currentPage} onClick={() => setCurrentPage(pageNumber)}>
                                {pageNumber}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
                        <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
                    </Pagination>
                    <Form.Group controlId="rowsPerPageSelect" className="d-flex align-items-center">
                        <Form.Label className="me-2 mb-0">Rows per page:</Form.Label>
                        <Form.Control as="select" value={rowsPerPage} onChange={handleRowsPerPageChange}>
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
                        </Form.Control>
                    </Form.Group>
                </div>

                <Offcanvas show={show} onHide={handleClose} placement="end">
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>{editingIndex !== null ? 'Edit Mess Master' : 'Add Mess Master'}</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Mess Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Mess Name"
                                    name="messName"
                                    value={messMaster.messName}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Project ID</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter Project ID"
                                    name="project_Id"
                                    value={messMaster.project_Id}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Manager ID</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter Manager ID"
                                    name="managerId"
                                    value={messMaster.managerId}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    label="Active"
                                    name="status"
                                    checked={messMaster.status}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Created By</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Creator's Name"
                                    name="createdBy"
                                    value={messMaster.createdBy}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="me-2">
                                {editingIndex !== null ? 'Update Mess Master' : 'Add Mess Master'}
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

    export default MessMasterPage;
