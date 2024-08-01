import React, { useState, useEffect, ChangeEvent } from 'react';
import { Button, Form, Offcanvas, Table, Pagination } from 'react-bootstrap';
import axios from 'axios';

interface Employee {
    id: number;
    employeeName: string;
    employeeID: string;
    departmentID: number;
    designation: string;
    hrUpdateMobileNumber: string;
    genderID: number;
    fatherName: string;
    dob: string; // Date in ISO format
    doj: string; // Date in ISO format
    currentProjectID: number;
    appAccessID: number;
    exemptStatusID: number;
    performanceReviewID: number;
    pincode: string;
    state: string;
    district: string;
    areaID: number;
    address: string;
    salaryIFSCCode: string;
    salaryBankName: string;
    salaryBranchName: string;
    salaryBankAccountNumber: string;
    reimbursementIFSCCode: string;
    reimbursementBankName: string;
    reimbursementBranchName: string;
    reimbursementBankAccountNumber: string;
    expenseIFSCCode: string;
    expenseBankName: string;
    expenseBranchName: string;
    expenseBankAccountNumber: string;
    createdBy: string;
    updatedBy: string;
}

const EmployeeMaster: React.FC = () => {
    const [employee, setEmployee] = useState<Employee>({
        id: 0,
        employeeName: '',
        employeeID: '',
        departmentID: 0,
        designation: '',
        hrUpdateMobileNumber: '',
        genderID: 0,
        fatherName: '',
        dob: '',
        doj: '',
        currentProjectID: 0,
        appAccessID: 0,
        exemptStatusID: 0,
        performanceReviewID: 0,
        pincode: '',
        state: '',
        district: '',
        areaID: 0,
        address: '',
        salaryIFSCCode: '',
        salaryBankName: '',
        salaryBranchName: '',
        salaryBankAccountNumber: '',
        reimbursementIFSCCode: '',
        reimbursementBankName: '',
        reimbursementBranchName: '',
        reimbursementBankAccountNumber: '',
        expenseIFSCCode: '',
        expenseBankName: '',
        expenseBranchName: '',
        expenseBankAccountNumber: '',
        createdBy: '',
        updatedBy: ''
    });

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [show, setShow] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        fetchEmployees();
    }, [currentPage, rowsPerPage]);

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://localhost:7074/api/EmployeeMaster/GetEmployee', {
                params: {
                    PageIndex: currentPage
                }
            });
            if (response.data.isSuccess) {
                setEmployees(response.data.employeeMasterList);
                // console.log(response.data.employeeMasterList);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
        finally {
            setLoading(false); // End loading
        }
    };

    const handleShow = () => setShow(true);

    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement | HTMLSelectElement;
        if (type === 'checkbox') {
            setEmployee({
                ...employee,
                [name]: checked
            });
        } else {
            setEmployee({
                ...employee,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (editingIndex !== null) {
                await axios.post('https://localhost:7074/api/EmployeeMaster/UpdateEmployee', employee);
            } else {
                await axios.post('https://localhost:7074/api/EmployeeMaster/InsertEmployee', employee);
            }
            fetchEmployees();
            handleClose();
        } catch (error) {
            console.error('Error submitting employee:', error);
        }
    };

    const handleEdit = (index: number) => {
        setEditingIndex(index);
        setEmployee(employees[index]);
        handleShow();
    };

    const handleClose = () => {
        setShow(false);
        setEditingIndex(null);
        setEmployee({
            id: 0,
            employeeName: '',
            employeeID: '',
            departmentID: 0,
            designation: '',
            hrUpdateMobileNumber: '',
            genderID: 0,
            fatherName: '',
            dob: '',
            doj: '',
            currentProjectID: 0,
            appAccessID: 0,
            exemptStatusID: 0,
            performanceReviewID: 0,
            pincode: '',
            state: '',
            district: '',
            areaID: 0,
            address: '',
            salaryIFSCCode: '',
            salaryBankName: '',
            salaryBranchName: '',
            salaryBankAccountNumber: '',
            reimbursementIFSCCode: '',
            reimbursementBankName: '',
            reimbursementBranchName: '',
            reimbursementBankAccountNumber: '',
            expenseIFSCCode: '',
            expenseBankName: '',
            expenseBranchName: '',
            expenseBankAccountNumber: '',
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

    const filteredEmployees = employees.filter(employee =>
        employee.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.employeeID.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indexOfLastEmployee = currentPage * rowsPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - rowsPerPage;
    const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

    const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);

    const convertToCSV = (data: Employee[]) => {
        const csvRows = [
            ['ID', 'Employee Name', 'Employee ID', 'Department ID', 'Designation', 'HR Update Mobile Number', 'Gender ID', 'Father Name', 'DOB', 'DOJ', 'Current Project ID', 'App Access ID', 'Exempt Status ID', 'Performance Review ID', 'Pincode', 'State', 'District', 'Area ID', 'Address', 'Salary IFSC Code', 'Salary Bank Name', 'Salary Branch Name', 'Salary Bank Account Number', 'Reimbursement IFSC Code', 'Reimbursement Bank Name', 'Reimbursement Branch Name', 'Reimbursement Bank Account Number', 'Expense IFSC Code', 'Expense Bank Name', 'Expense Branch Name', 'Expense Bank Account Number', 'Created By', 'Updated By'],
            ...data.map(emp => [
                emp.id.toString(),
                emp.employeeName,
                emp.employeeID,
                emp.departmentID.toString(),
                emp.designation,
                emp.hrUpdateMobileNumber,
                emp.genderID.toString(),
                emp.fatherName,
                emp.dob,
                emp.doj,
                emp.currentProjectID.toString(),
                emp.appAccessID.toString(),
                emp.exemptStatusID.toString(),
                emp.performanceReviewID.toString(),
                emp.pincode,
                emp.state,
                emp.district,
                emp.areaID.toString(),
                emp.address,
                emp.salaryIFSCCode,
                emp.salaryBankName,
                emp.salaryBranchName,
                emp.salaryBankAccountNumber,
                emp.reimbursementIFSCCode,
                emp.reimbursementBankName,
                emp.reimbursementBranchName,
                emp.reimbursementBankAccountNumber,
                emp.expenseIFSCCode,
                emp.expenseBankName,
                emp.expenseBranchName,
                emp.expenseBankAccountNumber,
                emp.createdBy,
                emp.updatedBy
            ])
        ];

        return csvRows.map(row => row.join(',')).join('\n');
    };

    const downloadCSV = () => {
        const csvData = convertToCSV(employees);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'Employees.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="container">
            <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center">
                <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>Employees List</span></span>
                <div className="d-flex">
                    <div className="app-search d-none d-lg-block me-4">
                        <form>
                            <div className="input-group">
                                <input
                                    type="search"
                                    className="form-control"
                                    placeholder="Search employee..."
                                    value={searchQuery}
                                    onChange={handleSearch}
                                />
                                <span className="ri-search-line search-icon text-muted" />
                            </div>
                        </form>
                    </div>
                    <Button variant="primary" onClick={handleShow} className="me-2">
                        Add Employee
                    </Button>
                    <Button variant="primary" onClick={downloadCSV} className="me-2">
                        Download CSV
                    </Button>
                </div>
            </div>

            <Offcanvas show={show} onHide={handleClose}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Employee Form</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="employeeName" className="mb-3">
                            <Form.Label>Employee Name:</Form.Label>
                            <Form.Control
                                type="text"
                                name="employeeName"
                                value={employee.employeeName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="employeeID" className="mb-3">
                            <Form.Label>Employee ID:</Form.Label>
                            <Form.Control
                                type="text"
                                name="employeeID"
                                value={employee.employeeID}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="departmentID" className="mb-3">
                            <Form.Label>Department ID:</Form.Label>
                            <Form.Control
                                type="number"
                                name="departmentID"
                                value={employee.departmentID}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="designation" className="mb-3">
                            <Form.Label>Designation:</Form.Label>
                            <Form.Control
                                type="text"
                                name="designation"
                                value={employee.designation}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="hrUpdateMobileNumber" className="mb-3">
                            <Form.Label>HR Update Mobile Number:</Form.Label>
                            <Form.Control
                                type="text"
                                name="hrUpdateMobileNumber"
                                value={employee.hrUpdateMobileNumber}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="genderID" className="mb-3">
                            <Form.Label>Gender ID:</Form.Label>
                            <Form.Control
                                type="number"
                                name="genderID"
                                value={employee.genderID}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="fatherName" className="mb-3">
                            <Form.Label>Father Name:</Form.Label>
                            <Form.Control
                                type="text"
                                name="fatherName"
                                value={employee.fatherName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="dob" className="mb-3">
                            <Form.Label>Date of Birth:</Form.Label>
                            <Form.Control
                                type="date"
                                name="dob"
                                value={employee.dob}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="doj" className="mb-3">
                            <Form.Label>Date of Joining:</Form.Label>
                            <Form.Control
                                type="date"
                                name="doj"
                                value={employee.doj}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="currentProjectID" className="mb-3">
                            <Form.Label>Current Project ID:</Form.Label>
                            <Form.Control
                                type="number"
                                name="currentProjectID"
                                value={employee.currentProjectID}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="appAccessID" className="mb-3">
                            <Form.Label>App Access ID:</Form.Label>
                            <Form.Control
                                type="number"
                                name="appAccessID"
                                value={employee.appAccessID}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="exemptStatusID" className="mb-3">
                            <Form.Label>Exempt Status ID:</Form.Label>
                            <Form.Control
                                type="number"
                                name="exemptStatusID"
                                value={employee.exemptStatusID}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="performanceReviewID" className="mb-3">
                            <Form.Label>Performance Review ID:</Form.Label>
                            <Form.Control
                                type="number"
                                name="performanceReviewID"
                                value={employee.performanceReviewID}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="pincode" className="mb-3">
                            <Form.Label>Pincode:</Form.Label>
                            <Form.Control
                                type="text"
                                name="pincode"
                                value={employee.pincode}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="state" className="mb-3">
                            <Form.Label>State:</Form.Label>
                            <Form.Control
                                type="text"
                                name="state"
                                value={employee.state}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="district" className="mb-3">
                            <Form.Label>District:</Form.Label>
                            <Form.Control
                                type="text"
                                name="district"
                                value={employee.district}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="areaID" className="mb-3">
                            <Form.Label>Area ID:</Form.Label>
                            <Form.Control
                                type="number"
                                name="areaID"
                                value={employee.areaID}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="address" className="mb-3">
                            <Form.Label>Address:</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                value={employee.address}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="salaryIFSCCode" className="mb-3">
                            <Form.Label>Salary IFSC Code:</Form.Label>
                            <Form.Control
                                type="text"
                                name="salaryIFSCCode"
                                value={employee.salaryIFSCCode}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="salaryBankName" className="mb-3">
                            <Form.Label>Salary Bank Name:</Form.Label>
                            <Form.Control
                                type="text"
                                name="salaryBankName"
                                value={employee.salaryBankName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="salaryBranchName" className="mb-3">
                            <Form.Label>Salary Branch Name:</Form.Label>
                            <Form.Control
                                type="text"
                                name="salaryBranchName"
                                value={employee.salaryBranchName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="salaryBankAccountNumber" className="mb-3">
                            <Form.Label>Salary Bank Account Number:</Form.Label>
                            <Form.Control
                                type="text"
                                name="salaryBankAccountNumber"
                                value={employee.salaryBankAccountNumber}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="reimbursementIFSCCode" className="mb-3">
                            <Form.Label>Reimbursement IFSC Code:</Form.Label>
                            <Form.Control
                                type="text"
                                name="reimbursementIFSCCode"
                                value={employee.reimbursementIFSCCode}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="reimbursementBankName" className="mb-3">
                            <Form.Label>Reimbursement Bank Name:</Form.Label>
                            <Form.Control
                                type="text"
                                name="reimbursementBankName"
                                value={employee.reimbursementBankName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="reimbursementBranchName" className="mb-3">
                            <Form.Label>Reimbursement Branch Name:</Form.Label>
                            <Form.Control
                                type="text"
                                name="reimbursementBranchName"
                                value={employee.reimbursementBranchName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="reimbursementBankAccountNumber" className="mb-3">
                            <Form.Label>Reimbursement Bank Account Number:</Form.Label>
                            <Form.Control
                                type="text"
                                name="reimbursementBankAccountNumber"
                                value={employee.reimbursementBankAccountNumber}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="expenseIFSCCode" className="mb-3">
                            <Form.Label>Expense IFSC Code:</Form.Label>
                            <Form.Control
                                type="text"
                                name="expenseIFSCCode"
                                value={employee.expenseIFSCCode}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="expenseBankName" className="mb-3">
                            <Form.Label>Expense Bank Name:</Form.Label>
                            <Form.Control
                                type="text"
                                name="expenseBankName"
                                value={employee.expenseBankName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="expenseBranchName" className="mb-3">
                            <Form.Label>Expense Branch Name:</Form.Label>
                            <Form.Control
                                type="text"
                                name="expenseBranchName"
                                value={employee.expenseBranchName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="expenseBankAccountNumber" className="mb-3">
                            <Form.Label>Expense Bank Account Number:</Form.Label>
                            <Form.Control
                                type="text"
                                name="expenseBankAccountNumber"
                                value={employee.expenseBankAccountNumber}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="createdBy" className="mb-3">
                            <Form.Label>Created By:</Form.Label>
                            <Form.Control
                                type="text"
                                name="createdBy"
                                value={employee.createdBy}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="updatedBy" className="mb-3">
                            <Form.Label>Updated By:</Form.Label>
                            <Form.Control
                                type="text"
                                name="updatedBy"
                                value={employee.updatedBy}
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

            <div className='overflow-auto'>

            {loading ? (
                <div className='loader-container'>
                    <div className="loader"></div>
                    <div className='mt-2'>Please Wait!</div>
                </div>
            ) :(
                <Table className='bg-white' striped bordered hover>
                <thead>
                    <tr>
                        <th>Employee Name</th>
                        <th>Employee ID</th>
                        <th>Department ID</th>
                        <th>Designation</th>
                        <th>HR Update Mobile Number</th>
                        <th>Gender ID</th>
                        <th>Father Name</th>
                        <th>Date of Birth</th>
                        <th>Date of Joining</th>
                        <th>Current Project ID</th>
                        <th>App Access ID</th>
                        <th>Exempt Status ID</th>
                        <th>Performance Review ID</th>
                        <th>Pincode</th>
                        <th>State</th>
                        <th>District</th>
                        <th>Area ID</th>
                        <th>Address</th>
                        <th>Salary IFSC Code</th>
                        <th>Salary Bank Name</th>
                        <th>Salary Branch Name</th>
                        <th>Salary Bank Account Number</th>
                        <th>Reimbursement IFSC Code</th>
                        <th>Reimbursement Bank Name</th>
                        <th>Reimbursement Branch Name</th>
                        <th>Reimbursement Bank Account Number</th>
                        <th>Expense IFSC Code</th>
                        <th>Expense Bank Name</th>
                        <th>Expense Branch Name</th>
                        <th>Expense Bank Account Number</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentEmployees.map((emp, index) => (
                        <tr key={index}>
                            <td>{emp.employeeName}</td>
                            <td>{emp.employeeID}</td>
                            <td>{emp.departmentID}</td>
                            <td>{emp.designation}</td>
                            <td>{emp.hrUpdateMobileNumber}</td>
                            <td>{emp.genderID}</td>
                            <td>{emp.fatherName}</td>
                            <td>{emp.dob}</td>
                            <td>{emp.doj}</td>
                            <td>{emp.currentProjectID}</td>
                            <td>{emp.appAccessID}</td>
                            <td>{emp.exemptStatusID}</td>
                            <td>{emp.performanceReviewID}</td>
                            <td>{emp.pincode}</td>
                            <td>{emp.state}</td>
                            <td>{emp.district}</td>
                            <td>{emp.areaID}</td>
                            <td>{emp.address}</td>
                            <td>{emp.salaryIFSCCode}</td>
                            <td>{emp.salaryBankName}</td>
                            <td>{emp.salaryBranchName}</td>
                            <td>{emp.salaryBankAccountNumber}</td>
                            <td>{emp.reimbursementIFSCCode}</td>
                            <td>{emp.reimbursementBankName}</td>
                            <td>{emp.reimbursementBranchName}</td>
                            <td>{emp.reimbursementBankAccountNumber}</td>
                            <td>{emp.expenseIFSCCode}</td>
                            <td>{emp.expenseBankName}</td>
                            <td>{emp.expenseBranchName}</td>
                            <td>{emp.expenseBankAccountNumber}</td>
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

export default EmployeeMaster;
