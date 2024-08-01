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

<<<<<<< HEAD
const BanksPage: React.FC = () => {
=======
const BankMaster: React.FC = () => {
>>>>>>> sumit-dev
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
<<<<<<< HEAD
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
=======
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loading, setLoading] = useState<boolean>(false);


    useEffect(() => {
        fetchBanks();
    }, [currentPage, rowsPerPage]);

    const fetchBanks = async () => {
        setLoading(true);

        try {
            const response = await axios.get('https://localhost:7074/api/BankMaster/GetBankList', {
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
>>>>>>> sumit-dev
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
<<<<<<< HEAD

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

=======
        try {
            if (editingIndex !== null) {
                await axios.post('https://localhost:7074/api/BankMaster/UpdateBank', bank);
            } else {
                await axios.post('https://localhost:7074/api/BankMaster/InsertBank', bank);
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

>>>>>>> sumit-dev
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

<<<<<<< HEAD
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
=======
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
>>>>>>> sumit-dev
    );

    const indexOfLastBank = currentPage * rowsPerPage;
    const indexOfFirstBank = indexOfLastBank - rowsPerPage;
    const currentBanks = filteredBanks.slice(indexOfFirstBank, indexOfLastBank);

    const totalPages = Math.ceil(filteredBanks.length / rowsPerPage);

<<<<<<< HEAD
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
=======
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
>>>>>>> sumit-dev
                <div className="d-flex">
                    <div className="app-search d-none d-lg-block me-4">
                        <form>
                            <div className="input-group">
                                <input
                                    type="search"
                                    className="form-control"
<<<<<<< HEAD
                                    placeholder="Search Bank..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
=======
                                    placeholder="Search bank..."
                                    value={searchQuery}
                                    onChange={handleSearch}
>>>>>>> sumit-dev
                                />
                                <span className="ri-search-line search-icon text-muted" />
                            </div>
                        </form>
                    </div>
                    <Button variant="primary" onClick={handleShow} className="me-2">
                        Add Bank
                    </Button>
<<<<<<< HEAD
                    <Button variant="secondary" onClick={downloadCSV}>
=======
                    <Button variant="primary" onClick={downloadCSV} className="me-2">
>>>>>>> sumit-dev
                        Download CSV
                    </Button>
                </div>
            </div>

<<<<<<< HEAD

            {loading ? (
                 <div className='loader-container'>
                 <div className="loader"></div>
                 <div className='mt-2'>Please Wait!</div>
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
=======
            <Offcanvas show={show} onHide={handleClose} >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Bank Form</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="bank" className="mb-3">
                            <Form.Label>Bank:</Form.Label>
>>>>>>> sumit-dev
                            <Form.Control
                                type="text"
                                name="bank"
                                value={bank.bank}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
<<<<<<< HEAD

                        <Form.Group controlId="formIFSC" className="mt-3">
                            <Form.Label>IFSC</Form.Label>
=======
                        <Form.Group controlId="ifsc" className="mb-3">
                            <Form.Label>IFSC:</Form.Label>
>>>>>>> sumit-dev
                            <Form.Control
                                type="text"
                                name="ifsc"
                                value={bank.ifsc}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
<<<<<<< HEAD

                        <Form.Group controlId="formBranch" className="mt-3">
                            <Form.Label>Branch</Form.Label>
=======
                        <Form.Group controlId="branch" className="mb-3">
                            <Form.Label>Branch:</Form.Label>
>>>>>>> sumit-dev
                            <Form.Control
                                type="text"
                                name="branch"
                                value={bank.branch}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
<<<<<<< HEAD

                        <Form.Group controlId="formCity1" className="mt-3">
                            <Form.Label>City 1</Form.Label>
=======
                        <Form.Group controlId="city1" className="mb-3">
                            <Form.Label>City 1:</Form.Label>
>>>>>>> sumit-dev
                            <Form.Control
                                type="text"
                                name="city1"
                                value={bank.city1}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
<<<<<<< HEAD

                        <Form.Group controlId="formCity2" className="mt-3">
                            <Form.Label>City 2</Form.Label>
=======
                        <Form.Group controlId="city2" className="mb-3">
                            <Form.Label>City 2:</Form.Label>
>>>>>>> sumit-dev
                            <Form.Control
                                type="text"
                                name="city2"
                                value={bank.city2}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
<<<<<<< HEAD

                        <Form.Group controlId="formState" className="mt-3">
                            <Form.Label>State</Form.Label>
=======
                        <Form.Group controlId="state" className="mb-3">
                            <Form.Label>State:</Form.Label>
>>>>>>> sumit-dev
                            <Form.Control
                                type="text"
                                name="state"
                                value={bank.state}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
<<<<<<< HEAD

                        <Button variant="primary" type="submit" className="mt-3">
                            {editingIndex !== null ? 'Update Bank' : 'Add Bank'}
=======
                        <Button variant="primary" type="submit">
                            Submit
>>>>>>> sumit-dev
                        </Button>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>
<<<<<<< HEAD
=======
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
>>>>>>> sumit-dev
        </div>
    );
};

<<<<<<< HEAD
export default BanksPage;
=======
export default BankMaster;
>>>>>>> sumit-dev
