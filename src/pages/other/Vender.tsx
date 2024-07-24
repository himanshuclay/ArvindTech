import React, { useState, useEffect, ChangeEvent } from 'react';
import { Button, Form, Offcanvas, Table, Pagination } from 'react-bootstrap';
import axios from 'axios';

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

const VendorsPage: React.FC = () => {
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
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loading, setLoading] = useState<boolean>(false);

    // console.log(editingIndex)

    useEffect(() => {
        fetchVendors();
    }, [currentPage]);

    const fetchVendors = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ PageIndex: currentPage.toString() });
            const url = `https://localhost:44344/api/VendorMaster/GetVendor?${params.toString()}`;

            const response = await axios.get(url, {
                headers: {
                    'accept': '*/*'
                }
            });
            

            if (response && response.status === 200 && response.data.isSuccess) {
                const responseData = Array.isArray(response.data.vendorMasterList)
                    ? response.data.vendorMasterList
                    : [response.data.vendorMasterList];
                setVendors(responseData);
                // console.log(responseData)///////////////////////////////////////////////////////////////////////////////////////////////////////////
            } else {
                console.error('Failed to fetch vendors: Invalid response status');
            }
        } catch (error) {
            console.error('An error occurred while fetching the vendors:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleShow = () => setShow(true);

    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement | HTMLSelectElement;
        if (type === 'checkbox') {
            setVendor({
                ...vendor,
                [name]: checked ? 1 : 0
            });
        } else {
            setVendor({
                ...vendor,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const payload = {
            ...vendor,
            updatedBy: vendor.createdBy
        };

        try {
            const response = await axios.post('https://localhost:44344/api/VendorMaster/InsertVendor', payload, {
                headers: {
                    'accept': '*/*',
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200 || response.status === 201) {
                const newVendor = response.data;

                if (editingIndex !== null) {
                    const updatedVendors = [...vendors];
                    updatedVendors[editingIndex] = newVendor;
                    setVendors(updatedVendors);
                    console.log('error')
                } else {
                    setVendors([...vendors, { ...newVendor, id: vendors.length + 1 }]);
                }
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
                handleClose();
            } else {
                console.error('Failed to submit vendor');
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('An error occurred while submitting the vendor:', error.response.data);
            } else {
                console.error('An error occurred while submitting the vendor:', error);
            }
        }
    };



    // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    
    //     const payload = {
    //         ...vendor,
    //         updatedBy: vendor.createdBy
    //     };
    
    //     console.log("Payload:", payload);
    
    //     try {
    //         const response = await axios.post('https://localhost:44344/api/VendorMaster/InsertVendor', payload, {
    //             headers: {
    //                 'accept': '*/*',
    //                 'Content-Type': 'application/json'
    //             }
    //         });
    
    //         console.log("Response Status:", response.status);
    //         console.log("Response Data:", response.data);
    
    //         if (response.status === 200 || response.status === 201) {
    //             const newVendor = response.data;
    
    //             if (editingIndex !== null) {
    //                 const updatedVendors = [...vendors];
    //                 updatedVendors[editingIndex] = newVendor;
    //                 setVendors(updatedVendors);
    //             } else {
    //                 setVendors([...vendors, { ...newVendor, id: vendors.length + 1 }]);
    //             }
    //             setVendor({
    //                 id: 0,
    //                 vendorName: '',
    //                 email: '',
    //                 vendorContactMobile: '',
    //                 vendorContactPerson: '',
    //                 gstin: '',
    //                 tradeName: '',
    //                 categoryID: 0,
    //                 fillingFrequencyID: 0,
    //                 pincode: '',
    //                 state: '',
    //                 district: '',
    //                 areaID: 0,
    //                 address: '',
    //                 ifscCode: '',
    //                 bankName: '',
    //                 branchName: '',
    //                 bankAccountNumber: '',
    //                 createdBy: '',
    //                 updatedBy: ''
    //             });
    //             handleClose();
    //         } else {
    //             console.error('Failed to submit vendor');
    //         }
    //     } catch (error) {
    //         if (axios.isAxiosError(error) && error.response) {
    //             console.error('An error occurred while submitting the vendor:', error.response.data);
    //         } else {
    //             console.error('An error occurred while submitting the vendor:', error);
    //         }
    //     }
    // };
    





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
        (vendor.vendorName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (vendor.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (vendor.vendorContactMobile || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (vendor.vendorContactPerson || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (vendor.gstin || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (vendor.tradeName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (vendor.categoryID !== null && vendor.categoryID !== undefined && vendor.categoryID.toString().includes(searchQuery)) ||
        (vendor.fillingFrequencyID !== null && vendor.fillingFrequencyID !== undefined && vendor.fillingFrequencyID.toString().includes(searchQuery)) ||
        (vendor.pincode || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (vendor.state || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (vendor.district || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (vendor.areaID !== null && vendor.areaID !== undefined && vendor.areaID.toString().includes(searchQuery)) ||
        (vendor.address || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (vendor.ifscCode || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (vendor.bankName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (vendor.branchName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (vendor.bankAccountNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (vendor.createdBy || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indexOfLastVendor = currentPage * rowsPerPage;
    const indexOfFirstVendor = indexOfLastVendor - rowsPerPage;
    const currentVendors = filteredVendors.slice(indexOfFirstVendor, indexOfLastVendor);

    const totalPages = Math.ceil(filteredVendors.length / rowsPerPage);

    const convertToCSV = (data: Vendor[]) => {
        const csvRows = [
            ['Vendor Name', 'Email', 'Vendor Contact Mobile', 'Vendor Contact Person', 'GSTIN', 'Trade Name', 'Category ID', 'Filling Frequency ID', 'Pincode', 'State', 'District', 'Area ID', 'Address', 'IFSC Code', 'Bank Name', 'Branch Name', 'Bank Account Number', 'Created By', 'Updated By'],
            ...data.map(vend => [
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
                vend.bankAccountNumber,
                vend.createdBy,
                vend.updatedBy
            ])
        ];

        return csvRows.map(row => row.join(',')).join('\n');
    };

    const downloadCSV = () => {
        const csvData = convertToCSV(vendors);
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'vendors.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div>
        

<div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center">
                <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>Vender Modules List</span></span>
                <div className="d-flex">
                    <div className="app-search d-none d-lg-block me-4">
                        <form>
                            <div className="input-group">
                                <input
                                    type="search"
                                    className="form-control"
                                    placeholder="Search Vender..."
                                    value={searchQuery}
                                    onChange={handleSearch}
                                />
                                <span className="ri-search-line search-icon text-muted" />
                            </div>
                        </form>
                    </div>
                    <Button variant="primary" onClick={handleShow} className="me-2">
                        Add Vender
                    </Button>
                    <Button variant="secondary" onClick={downloadCSV}>
                        Download CSV
                    </Button>
                </div>
            </div>





            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Vendor Name</th>
                        <th>Email</th>
                        <th>Vendor Contact Mobile</th>
                        <th>Vendor Contact Person</th>
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
                        <th>Created By</th>
                        <th>Updated By</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentVendors.map((vend, index) => (
                        <tr key={vend.id}>
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
                            <td>{vend.createdBy}</td>
                            <td>{vend.updatedBy}</td>
                            <td>
                                <Button variant="warning" onClick={() => handleEdit(index)}>Edit</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Pagination>
                {[...Array(totalPages).keys()].map(number => (
                    <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => setCurrentPage(number + 1)}>
                        {number + 1}
                    </Pagination.Item>
                ))}
            </Pagination>
            <Form.Select value={rowsPerPage} onChange={handleRowsPerPageChange} className="mb-3">
                {[10, 20, 50, 100].map(size => (
                    <option key={size} value={size}>{size} rows per page</option>
                ))}
            </Form.Select>
            <Offcanvas show={show} onHide={handleClose}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>{editingIndex !== null ? 'Edit Vendor' : 'Add Vendor'}</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Vendor Name</Form.Label>
                            <Form.Control type="text" name="vendorName" value={vendor.vendorName} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" name="email" value={vendor.email} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Vendor Contact Mobile</Form.Label>
                            <Form.Control type="text" name="vendorContactMobile" value={vendor.vendorContactMobile} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Vendor Contact Person</Form.Label>
                            <Form.Control type="text" name="vendorContactPerson" value={vendor.vendorContactPerson} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>GSTIN</Form.Label>
                            <Form.Control type="text" name="gstin" value={vendor.gstin} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Trade Name</Form.Label>
                            <Form.Control type="text" name="tradeName" value={vendor.tradeName} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Category ID</Form.Label>
                            <Form.Control type="number" name="categoryID" value={vendor.categoryID} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Filling Frequency ID</Form.Label>
                            <Form.Control type="number" name="fillingFrequencyID" value={vendor.fillingFrequencyID} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Pincode</Form.Label>
                            <Form.Control type="text" name="pincode" value={vendor.pincode} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>State</Form.Label>
                            <Form.Control type="text" name="state" value={vendor.state} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>District</Form.Label>
                            <Form.Control type="text" name="district" value={vendor.district} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Area ID</Form.Label>
                            <Form.Control type="number" name="areaID" value={vendor.areaID} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Address</Form.Label>
                            <Form.Control type="text" name="address" value={vendor.address} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>IFSC Code</Form.Label>
                            <Form.Control type="text" name="ifscCode" value={vendor.ifscCode} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Bank Name</Form.Label>
                            <Form.Control type="text" name="bankName" value={vendor.bankName} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Branch Name</Form.Label>
                            <Form.Control type="text" name="branchName" value={vendor.branchName} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Bank Account Number</Form.Label>
                            <Form.Control type="text" name="bankAccountNumber" value={vendor.bankAccountNumber} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Created By</Form.Label>
                            <Form.Control type="text" name="createdBy" value={vendor.createdBy} onChange={handleChange} required />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            {editingIndex !== null ? 'Update' : 'Add'}
                        </Button>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
};

export default VendorsPage;
