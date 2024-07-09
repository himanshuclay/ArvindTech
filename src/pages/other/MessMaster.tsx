import React, { useState, useEffect, ChangeEvent } from 'react';
import { Button, Form, Offcanvas, Table, Pagination } from 'react-bootstrap';

interface MessMaster {
    project_Id: number;
    messName: string;
    managerId: number;
    status: number;
    createdDate: string;
    createdBy: string;
    updatedDate: string;
    updatedBy: string;
}

const MessPage: React.FC = () => {
    const [messData, setMessData] = useState<MessMaster>({
        project_Id: 0,
        messName: '',
        managerId: 0,
        status: 0,
        createdDate: '',
        createdBy: '',
        updatedDate: '',
        updatedBy: ''
    });

    const [messList, setMessList] = useState<MessMaster[]>([]);
    const [show, setShow] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        const storedMessList = localStorage.getItem('messList');
        if (storedMessList) {
            setMessList(JSON.parse(storedMessList));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('messList', JSON.stringify(messList));
    }, [messList]);

    const handleShow = () => setShow(true);

    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target as HTMLInputElement | HTMLSelectElement;
        setMessData({
            ...messData,
            [name]: value
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (editingIndex !== null) {
            const updatedMessList = [...messList];
            updatedMessList[editingIndex] = messData;
            setMessList(updatedMessList);
        } else {
            setMessList([...messList, { ...messData, project_Id: messList.length + 1 }]);
        }
        setMessData({
            project_Id: 0,
            messName: '',
            managerId: 0,
            status: 0,
            createdDate: '',
            createdBy: '',
            updatedDate: '',
            updatedBy: ''
        });
        handleClose();
    };

    const handleEdit = (index: number) => {
        setEditingIndex(index);
        setMessData(messList[index]);
        handleShow();
    };

    const handleClose = () => {
        setShow(false);
        setEditingIndex(null);
        setMessData({
            project_Id: 0,
            messName: '',
            managerId: 0,
            status: 0,
            createdDate: '',
            createdBy: '',
            updatedDate: '',
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

    const filteredMessList = messList.filter(mess =>
        mess.messName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mess.managerId.toString().includes(searchQuery) ||
        mess.status.toString().includes(searchQuery) ||
        mess.createdDate.toLowerCase().includes(searchQuery) ||
        mess.createdBy.toLowerCase().includes(searchQuery) ||
        mess.updatedDate.toLowerCase().includes(searchQuery) ||
        mess.updatedBy.toLowerCase().includes(searchQuery)
    );

    const indexOfLastMess = currentPage * rowsPerPage;
    const indexOfFirstMess = indexOfLastMess - rowsPerPage;
    const currentMessList = filteredMessList.slice(indexOfFirstMess, indexOfLastMess);

    const totalPages = Math.ceil(filteredMessList.length / rowsPerPage);

    const convertToCSV = (data: MessMaster[]) => {
        const csvRows = [
            ['Project Id', 'Mess Name', 'Manager Id', 'Status', 'Created Date', 'Created By', 'Updated Date', 'Updated By'],
            ...data.map(mess => [
                mess.project_Id.toString(),
                mess.messName,
                mess.managerId.toString(),
                mess.status.toString(),
                mess.createdDate,
                mess.createdBy,
                mess.updatedDate,
                mess.updatedBy
            ])
        ];

        return csvRows.map(row => row.join(',')).join('\n');
    };

    const downloadCSV = () => {
        const csvData = convertToCSV(messList);
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'messList.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="container">
            <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center">
                <span><i className="ri-projector-line me-2"></i><span className='fw-bold'>Mess List</span></span>
                <div className="d-flex">
                    <div className="app-search d-none d-lg-block me-4">
                        <form>
                            <div className="input-group">
                                <input
                                    type="search"
                                    className="form-control"
                                    placeholder="Search mess..."
                                    value={searchQuery}
                                    onChange={handleSearch}
                                />
                                <span className="ri-search-line search-icon text-muted" />
                            </div>
                        </form>
                    </div>
                    <Button variant="primary" onClick={handleShow} className="me-2">
                        Add Mess
                    </Button>
                    <Button variant="secondary" onClick={downloadCSV}>
                        Download CSV
                    </Button>
                </div>
            </div>

            <Offcanvas show={show} onHide={handleClose} >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Mess Form</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="messName" className="mb-3">
                            <Form.Label>Mess Name:</Form.Label>
                            <Form.Control
                                type="text"
                                name="messName"
                                value={messData.messName}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="managerId" className="mb-3">
                            <Form.Label>Manager Id:</Form.Label>
                            <Form.Control
                                type="number"
                                name="managerId"
                                value={messData.managerId}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="status" className="mb-3">
                            <Form.Label>Status:</Form.Label>
                            <Form.Control
                                type="number"
                                name="status"
                                value={messData.status}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="createdDate" className="mb-3">
                            <Form.Label>Created Date:</Form.Label>
                            <Form.Control
                                type="date"
                                name="createdDate"
                                value={messData.createdDate}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="createdBy" className="mb-3">
                            <Form.Label>Created By:</Form.Label>
                            <Form.Control
                                type="text"
                                name="createdBy"
                                value={messData.createdBy}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="updatedDate" className="mb-3">
                            <Form.Label>Updated Date:</Form.Label>
                            <Form.Control
                                type="date"
                                name="updatedDate"
                                value={messData.updatedDate}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="updatedBy" className="mb-3">
                            <Form.Label>Updated By:</Form.Label>
                            <Form.Control
                                type="text"
                                name="updatedBy"
                                value={messData.updatedBy}
                                onChange={handleChange}
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
                        <th>Project Id</th>
                        <th>Mess Name</th>
                        <th>Manager Id</th>
                        <th>Status</th>
                        <th>Created Date</th>
                        <th>Created By</th>
                        <th>Updated Date</th>
                        <th>Updated By</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentMessList.map((mess, index) => (
                        <tr key={index}>
                            <td>{mess.project_Id}</td>
                            <td>{mess.messName}</td>
                            <td>{mess.managerId}</td>
                            <td>{mess.status}</td>
                            <td>{mess.createdDate}</td>
                            <td>{mess.createdBy}</td>
                            <td>{mess.updatedDate}</td>
                            <td>{mess.updatedBy}</td>
                            <td>
                                <i className='btn ri-edit-line' onClick={() => handleEdit(index + indexOfFirstMess)}></i>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default MessPage;
