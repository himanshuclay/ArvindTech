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

const BankMaster: React.FC = () => {
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
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loading, setLoading] = useState<boolean>(false);


    useEffect(() => {
        fetchBanks();
    }, [currentPage, rowsPerPage]);

    const fetchBanks = async () => {
        setLoading(true);

        try {
            const response = await axios.get('https://localhost:44306/api/BankMaster/GetBankList', {
                params: {
                    PageIndex: currentPage
                }
            });
            if (response.data.isSuccess) {
                setBanks(response.data.bankMasterListResponses);
                console.log(response.data.bankMasterListResponses);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching banks:', error);
        }
        finally {
            setLoading(false); // End loading
        }
    };

    const handleShow = () => setShow(true);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setBank({
            ...bank,
            [name]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (editingIndex !== null) {
                await axios.post('https://localhost:44306/api/BankMaster/UpdateBank', bank);
            } else {
                await axios.post('https://localhost:44306/api/BankMaster/InsertBank', bank);
            }
            fetchBanks();
            handleClose();
        } catch (error) {
            console.error('Error submitting bank:', error);
        }
    };

    const handleEdit = (index: number) => {
        setEditingIndex(index);
        setBank(banks[index]);
        handleShow();
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

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    const handleRowsPerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset to first page on rows per page change
    };

    const filteredBanks = banks.filter(bank =>
        bank.bank.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bank.ifsc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bank.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bank.city1.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bank.city2.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bank.state.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indexOfLastBank = currentPage * rowsPerPage;
    const indexOfFirstBank = indexOfLastBank - rowsPerPage;
    const currentBanks = filteredBanks.slice(indexOfFirstBank, indexOfLastBank);

    const totalPages = Math.ceil(filteredBanks.length / rowsPerPage);

    const convertToCSV = (data: Bank[]) => {
        const csvRows = [
            ['ID', 'Bank', 'IFSC', 'Branch', 'City 1', 'City 2', 'State'],
            ...data.map(bk => [
                bk.id.toString(),
                bk.bank,
                bk.ifsc,
                bk.branch,
                bk.city1,
                bk.city2,
                bk.state
            ])
        ];

        return csvRows.map(row => row.join(',')).join('\n');
    };

    const downloadCSV = () => {
        const csvData = convertToCSV(banks);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'Banks.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="container">
            <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center">
                <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>Banks List</span></span>
                <div className="d-flex">
                    <div className="app-search d-none d-lg-block me-4">
                        <form>
                            <div className="input-group">
                                <input
                                    type="search"
                                    className="form-control"
                                    placeholder="Search bank..."
                                    value={searchQuery}
                                    onChange={handleSearch}
                                />
                                <span className="ri-search-line search-icon text-muted" />
                            </div>
                        </form>
                    </div>
                    <Button variant="primary" onClick={handleShow} className="me-2">
                        Add Bank
                    </Button>
                    <Button variant="primary" onClick={downloadCSV} className="me-2">
                        Download CSV
                    </Button>
                </div>
            </div>

            <Offcanvas show={show} onHide={handleClose} >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Bank Form</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="bank" className="mb-3">
                            <Form.Label>Bank:</Form.Label>
                            <Form.Control
                                type="text"
                                name="bank"
                                value={bank.bank}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="ifsc" className="mb-3">
                            <Form.Label>IFSC:</Form.Label>
                            <Form.Control
                                type="text"
                                name="ifsc"
                                value={bank.ifsc}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="branch" className="mb-3">
                            <Form.Label>Branch:</Form.Label>
                            <Form.Control
                                type="text"
                                name="branch"
                                value={bank.branch}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="city1" className="mb-3">
                            <Form.Label>City 1:</Form.Label>
                            <Form.Control
                                type="text"
                                name="city1"
                                value={bank.city1}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="city2" className="mb-3">
                            <Form.Label>City 2:</Form.Label>
                            <Form.Control
                                type="text"
                                name="city2"
                                value={bank.city2}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="state" className="mb-3">
                            <Form.Label>State:</Form.Label>
                            <Form.Control
                                type="text"
                                name="state"
                                value={bank.state}
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
                                <th>Bank</th>
                                <th>IFSC</th>
                                <th>Branch</th>
                                <th>City 1</th>
                                <th>City 2</th>
                                <th>State</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentBanks.map((bk, index) => (
                                <tr key={index}>
                                    <td>{bk.bank}</td>
                                    <td>{bk.ifsc}</td>
                                    <td>{bk.branch}</td>
                                    <td>{bk.city1}</td>
                                    <td>{bk.city2}</td>
                                    <td>{bk.state}</td>
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

export default BankMaster;
