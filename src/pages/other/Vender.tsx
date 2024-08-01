import React, { useState, useEffect, ChangeEvent } from 'react';
import { Button, Form, Offcanvas, Table, Pagination } from 'react-bootstrap';
import axios from 'axios';

<<<<<<< HEAD
interface Bank {
    id: number;
    bank: string;
    ifsc: string;
    branch: string;
    city1: string;
    city2: string;
    state: string;
}

const BanksPage: React.FC = () => {
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
=======
interface Vendor {
    id: number;
    vendorName: string;
    email: string;
    vendorContactMobile: string;
    vendorContactPerson: string;
    gstin: string;
    tradeName: string;
    categoryID: number;
    fillingFrequencyID: number;
    pincode: string;
    state: string;
    district: string;
    areaID: number;
    address: string;
    ifscCode: string;
    bankName: string;
    branchName: string;
    bankAccountNumber: string;
    createdBy: string;
    updatedBy: string;
}

const VendorMaster: React.FC = () => {
    const [vendor, setVendor] = useState<Vendor>({
        id: 0,
        vendorName: '',
        email: '',
        vendorContactMobile: '',
        vendorContactPerson: '',
        gstin: '',
        tradeName: '',
        categoryID: 0,
        fillingFrequencyID: 0,
        pincode: '',
        state: '',
        district: '',
        areaID: 0,
        address: '',
        ifscCode: '',
        bankName: '',
        branchName: '',
        bankAccountNumber: '',
        createdBy: '',
        updatedBy: ''
    });

    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [show, setShow] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loading, setLoading] = useState<boolean>(false);


    useEffect(() => {
        fetchVendors();
    }, [currentPage, rowsPerPage]);

    const fetchVendors = async () => {
        setLoading(true);

        try {
            const response = await axios.get('https://localhost:7074/api/VendorMaster/GetVendor', {
                params: {
                    PageIndex: currentPage
                }
            });
            if (response.data.isSuccess) {
                setVendors(response.data.vendorMasterList);
                console.log(response.data.vendorMasterList);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching vendors:', error);
        }
        finally {
            setLoading(false); // End loading
        }
    };

    const handleShow = () => setShow(true);

    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement | HTMLSelectElement;
        if (type === 'checkbox') {
            setVendor({
                ...vendor,
                [name]: checked
            });
        } else {
            setVendor({
                ...vendor,
                [name]: value
            });
        }
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
=======
        try {
            if (editingIndex !== null) {
                await axios.post('https://localhost:7074/api/VendorMaster/UpdateVendor', vendor);
            } else {
                await axios.post('https://localhost:7074/api/VendorMaster/InsertVendor', vendor);
            }
            fetchVendors();
            handleClose();
        } catch (error) {
            console.error('Error submitting vendor:', error);
        }
    };

    const handleEdit = (index: number) => {
        setEditingIndex(index);
        setVendor(vendors[index]);
        handleShow();
    };

    const handleClose = () => {
        setShow(false);
        setEditingIndex(null);
        setVendor({
            id: 0,
            vendorName: '',
            email: '',
            vendorContactMobile: '',
            vendorContactPerson: '',
            gstin: '',
            tradeName: '',
            categoryID: 0,
            fillingFrequencyID: 0,
            pincode: '',
            state: '',
            district: '',
            areaID: 0,
            address: '',
            ifscCode: '',
            bankName: '',
            branchName: '',
            bankAccountNumber: '',
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

    const filteredVendors = vendors.filter(vendor =>
        vendor.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.gstin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.vendorContactMobile.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.vendorContactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.tradeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.pincode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.ifscCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.bankName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.branchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.bankAccountNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indexOfLastVendor = currentPage * rowsPerPage;
    const indexOfFirstVendor = indexOfLastVendor - rowsPerPage;
    const currentVendors = filteredVendors.slice(indexOfFirstVendor, indexOfLastVendor);

    const totalPages = Math.ceil(filteredVendors.length / rowsPerPage);

    const convertToCSV = (data: Vendor[]) => {
        const csvRows = [
            ['Vendor ID', 'Vendor Name', 'Email', 'Contact Mobile', 'Contact Person', 'GSTIN', 'Trade Name', 'Category ID', 'Filling Frequency ID', 'Pincode', 'State', 'District', 'Area ID', 'Address', 'IFSC Code', 'Bank Name', 'Branch Name', 'Bank Account Number'],
            ...data.map(vend => [
                vend.id.toString(),
                vend.vendorName,
                vend.email,
                vend.vendorContactMobile,
                vend.vendorContactPerson,
                vend.gstin,
                vend.tradeName,
                vend.categoryID.toString(),
                vend.fillingFrequencyID.toString(),
                vend.pincode,
                vend.state,
                vend.district,
                vend.areaID.toString(),
                vend.address,
                vend.ifscCode,
                vend.bankName,
                vend.branchName,
                vend.bankAccountNumber
            ])
        ];

        return csvRows.map(row => row.join(',')).join('\n');
    };

    const downloadCSV = () => {
        const csvData = convertToCSV(vendors);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'Vendors.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="container">
            <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center">
                <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>Vendors List</span></span>
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
                                    placeholder="Search vendor..."
                                    value={searchQuery}
                                    onChange={handleSearch}
>>>>>>> sumit-dev
                                />
                                <span className="ri-search-line search-icon text-muted" />
                            </div>
                        </form>
                    </div>
                    <Button variant="primary" onClick={handleShow} className="me-2">
<<<<<<< HEAD
                        Add Bank
                    </Button>
                    <Button variant="secondary" onClick={downloadCSV}>
=======
                        Add Vendor
                    </Button>
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
=======
            <Offcanvas show={show} onHide={handleClose} >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Vendor Form</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="vendorName" className="mb-3">
                            <Form.Label>Vendor Name:</Form.Label>
                            <Form.Control
                                type="text"
                                name="vendorName"
                                value={vendor.vendorName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="email" className="mb-3">
                            <Form.Label>Email:</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={vendor.email}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="vendorContactMobile" className="mb-3">
                            <Form.Label>Contact Mobile:</Form.Label>
                            <Form.Control
                                type="text"
                                name="vendorContactMobile"
                                value={vendor.vendorContactMobile}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="vendorContactPerson" className="mb-3">
                            <Form.Label>Contact Person:</Form.Label>
                            <Form.Control
                                type="text"
                                name="vendorContactPerson"
                                value={vendor.vendorContactPerson}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="gstin" className="mb-3">
                            <Form.Label>GSTIN:</Form.Label>
                            <Form.Control
                                type="text"
                                name="gstin"
                                value={vendor.gstin}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="tradeName" className="mb-3">
                            <Form.Label>Trade Name:</Form.Label>
                            <Form.Control
                                type="text"
                                name="tradeName"
                                value={vendor.tradeName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="categoryID" className="mb-3">
                            <Form.Label>Category ID:</Form.Label>
                            <Form.Control
                                type="number"
                                name="categoryID"
                                value={vendor.categoryID}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="fillingFrequencyID" className="mb-3">
                            <Form.Label>Filling Frequency ID:</Form.Label>
                            <Form.Control
                                type="number"
                                name="fillingFrequencyID"
                                value={vendor.fillingFrequencyID}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="pincode" className="mb-3">
                            <Form.Label>Pincode:</Form.Label>
                            <Form.Control
                                type="text"
                                name="pincode"
                                value={vendor.pincode}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="state" className="mb-3">
                            <Form.Label>State:</Form.Label>
                            <Form.Control
                                type="text"
                                name="state"
                                value={vendor.state}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="district" className="mb-3">
                            <Form.Label>District:</Form.Label>
                            <Form.Control
                                type="text"
                                name="district"
                                value={vendor.district}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="areaID" className="mb-3">
                            <Form.Label>Area ID:</Form.Label>
                            <Form.Control
                                type="number"
                                name="areaID"
                                value={vendor.areaID}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="address" className="mb-3">
                            <Form.Label>Address:</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                value={vendor.address}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="ifscCode" className="mb-3">
                            <Form.Label>IFSC Code:</Form.Label>
                            <Form.Control
                                type="text"
                                name="ifscCode"
                                value={vendor.ifscCode}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="bankName" className="mb-3">
                            <Form.Label>Bank Name:</Form.Label>
                            <Form.Control
                                type="text"
                                name="bankName"
                                value={vendor.bankName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="branchName" className="mb-3">
                            <Form.Label>Branch Name:</Form.Label>
                            <Form.Control
                                type="text"
                                name="branchName"
                                value={vendor.branchName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="bankAccountNumber" className="mb-3">
                            <Form.Label>Bank Account Number:</Form.Label>
                            <Form.Control
                                type="text"
                                name="bankAccountNumber"
                                value={vendor.bankAccountNumber}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="createdBy" className="mb-3">
                            <Form.Label>Created By:</Form.Label>
                            <Form.Control
                                type="text"
                                name="createdBy"
                                value={vendor.createdBy}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="updatedBy" className="mb-3">
                            <Form.Label>Updated By:</Form.Label>
                            <Form.Control
                                type="text"
                                name="updatedBy"
                                value={vendor.updatedBy}
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
            ) :(
                <Table className='bg-white' striped bordered hover>
                    <thead>
                        <tr>
                            <th>Vendor Name</th>
                            <th>Email</th>
                            <th>Contact Mobile</th>
                            <th>Contact Person</th>
                            <th>GSTIN</th>
                            <th>Trade Name</th>
                            <th>Category ID</th>
                            <th>Filling Frequency ID</th>
                            <th>Pincode</th>
                            <th>State</th>
                            <th>District</th>
                            <th>Area ID</th>
                            <th>Address</th>
                            <th>IFSC Code</th>
                            <th>Bank Name</th>
                            <th>Branch Name</th>
                            <th>Bank Account Number</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentVendors.map((vend, index) => (
                            <tr key={index}>
                                <td>{vend.vendorName}</td>
                                <td>{vend.email}</td>
                                <td>{vend.vendorContactMobile}</td>
                                <td>{vend.vendorContactPerson}</td>
                                <td>{vend.gstin}</td>
                                <td>{vend.tradeName}</td>
                                <td>{vend.categoryID}</td>
                                <td>{vend.fillingFrequencyID}</td>
                                <td>{vend.pincode}</td>
                                <td>{vend.state}</td>
                                <td>{vend.district}</td>
                                <td>{vend.areaID}</td>
                                <td>{vend.address}</td>
                                <td>{vend.ifscCode}</td>
                                <td>{vend.bankName}</td>
                                <td>{vend.branchName}</td>
                                <td>{vend.bankAccountNumber}</td>
                                <td>
                                    <i className='btn ri-edit-line' onClick={() => handleEdit(index)}></i>
>>>>>>> sumit-dev
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
<<<<<<< HEAD

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
=======
                
            </div>
>>>>>>> sumit-dev
        </div>
    );
};

<<<<<<< HEAD
export default BanksPage;
=======
export default VendorMaster;
>>>>>>> sumit-dev
