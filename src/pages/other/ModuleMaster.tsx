import React, { useState, useEffect, ChangeEvent } from 'react';
import { Button, Form, Offcanvas, Table, Pagination } from 'react-bootstrap';
import axios from 'axios';

interface Bank {
    id: number;
    bank: string;
    ifsc: string;
    branch: string;
    city1: string;
    city2: string;
    state: string;
}

const ModuleMaster: React.FC = () => {
    const [bank, setBank] = useState<Bank>({
        id: 0,
        bank: '',
        ifsc: '',
        branch: '',
        city1: '',
        city2: '',
        state: ''
    });

    const [banks, setBanks] = useState<Bank[]>([]);
    const [show, setShow] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        fetchBanks();
    }, [currentPage]);

    const fetchBanks = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ PageIndex: currentPage.toString() });
            const url = `https://localhost:44344/api/BankMaster/GetBankList?${params.toString()}`;
            const response = await axios.get(url, { headers: { 'accept': '*/*' } });

            if (response && response.status === 200 && response.data.isSuccess) {
                const responseData = Array.isArray(response.data.bankMasterListResponses)
                    ? response.data.bankMasterListResponses
                    : [response.data.bankMasterListResponses];
                setBanks(responseData);
            } else {
                console.error('Failed to fetch banks: Invalid response status');
            }
        } catch (error) {
            console.error('An error occurred while fetching the banks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setBank({ ...bank, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const payload = { ...bank };

        try {
            const response = await axios.post('https://localhost:44344/api/BankMaster/InsertBank', payload, { headers: { 'accept': '*/*', 'Content-Type': 'application/json' } });

            if (response.status === 200 || response.status === 201) {
                const newBank = response.data;

                if (editingIndex !== null) {
                    const updatedBanks = [...banks];
                    updatedBanks[editingIndex] = newBank;
                    setBanks(updatedBanks);
                } else {
                    setBanks([...banks, { ...newBank, id: banks.length + 1 }]);
                }
                handleClose();
            } else {
                console.error('Failed to submit bank');
            }
        } catch (error) {
            console.error('An error occurred while submitting the bank:', error);
        }
    };

    const handleClose = () => {
        setShow(false);
        setEditingIndex(null);
        setBank({
            id: 0,
            bank: '',
            ifsc: '',
            branch: '',
            city1: '',
            city2: '',
            state: ''
        });
    };

    const handleShow = () => setShow(true);

    const handleEdit = (index: number) => {
        setEditingIndex(index);
        setBank(banks[index]);
        handleShow();
    };

    const filteredBanks = banks.filter(bank =>
        (bank.bank || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (bank.ifsc || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (bank.branch || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (bank.city1 || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (bank.city2 || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (bank.state || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indexOfLastBank = currentPage * rowsPerPage;
    const indexOfFirstBank = indexOfLastBank - rowsPerPage;
    const currentBanks = filteredBanks.slice(indexOfFirstBank, indexOfLastBank);

    const totalPages = Math.ceil(filteredBanks.length / rowsPerPage);

    const downloadCSV = () => {
        const csvData = convertToCSV(banks);
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'banks.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const convertToCSV = (data: Bank[]) => {
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(bank => Object.values(bank).join(','));
        return [headers, ...rows].join('\n');
    };

    return (
        <div className="container ">

            <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center">
                <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>Tender Modules List</span></span>
                <div className="d-flex">
                    <div className="app-search d-none d-lg-block me-4">
                        <form>
                            <div className="input-group">
                                <input
                                    type="search"
                                    className="form-control"
                                    placeholder="Search Bank..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <span className="ri-search-line search-icon text-muted" />
                            </div>
                        </form>
                    </div>
                    <Button variant="primary" onClick={handleShow} className="me-2">
                        Add Bank
                    </Button>
                    <Button variant="secondary" onClick={downloadCSV}>
                        Download CSV
                    </Button>
                </div>
            </div>


            {loading ? (
                <div className="d-flex justify-content-center mt-5">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            ) : (
                <Table striped bordered hover responsive className="mb-0">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Bank</th>
                            <th>IFSC</th>
                            <th>Branch</th>
                            <th>City 1</th>
                            <th>City 2</th>
                            <th>State</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentBanks.map((bank, index) => (
                            <tr key={index}>
                                <td>{index + 1 + (currentPage - 1) * rowsPerPage}</td>
                                <td>{bank.bank}</td>
                                <td>{bank.ifsc}</td>
                                <td>{bank.branch}</td>
                                <td>{bank.city1}</td>
                                <td>{bank.city2}</td>
                                <td>{bank.state}</td>
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

            <div className="d-flex justify-content-between mt-3">
                <Pagination>
                    <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                    <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />
                    {[...Array(totalPages).keys()].map(number => (
                        <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => setCurrentPage(number + 1)}>
                            {number + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} />
                    <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
                </Pagination>
                <Form.Control
                    as="select"
                    value={rowsPerPage}
                    onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
                >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                </Form.Control>
            </div>

            <Offcanvas show={show} onHide={handleClose} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>{editingIndex !== null ? 'Edit Bank' : 'Add Bank'}</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formBank">
                            <Form.Label>Bank</Form.Label>
                            <Form.Control
                                type="text"
                                name="bank"
                                value={bank.bank}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formIFSC" className="mt-3">
                            <Form.Label>IFSC</Form.Label>
                            <Form.Control
                                type="text"
                                name="ifsc"
                                value={bank.ifsc}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formBranch" className="mt-3">
                            <Form.Label>Branch</Form.Label>
                            <Form.Control
                                type="text"
                                name="branch"
                                value={bank.branch}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formCity1" className="mt-3">
                            <Form.Label>City 1</Form.Label>
                            <Form.Control
                                type="text"
                                name="city1"
                                value={bank.city1}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formCity2" className="mt-3">
                            <Form.Label>City 2</Form.Label>
                            <Form.Control
                                type="text"
                                name="city2"
                                value={bank.city2}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formState" className="mt-3">
                            <Form.Label>State</Form.Label>
                            <Form.Control
                                type="text"
                                name="state"
                                value={bank.state}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="mt-3">
                            {editingIndex !== null ? 'Update Bank' : 'Add Bank'}
                        </Button>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
};

export default ModuleMaster;
