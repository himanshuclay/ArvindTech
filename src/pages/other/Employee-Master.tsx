import React, { useState, useEffect, ChangeEvent } from 'react';
import { Button, Form, Offcanvas, Table, InputGroup, FormControl, Pagination } from 'react-bootstrap';

interface Employee {
    id: number;
    employeeName: string;
    employeeID: string;
    departmentID: number;
    designation: string;
    hrUpdateMobileNumber: string;
    genderID: number;
    fatherName: string;
    dob: string;
    doj: string;
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

const EmployeeForm: React.FC = () => {
    const [employee, setEmployee] = useState<Employee>({
        id: 0,
        employeeName: '',
        employeeID: '',
        departmentID: 0,
        designation: '',
        hrUpdateMobileNumber: '',
        genderID: 0,
        fatherName: '',
        dob: new Date().toISOString(),
        doj: new Date().toISOString(),
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

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await fetch('https://localhost:44344/api/EmployeeMaster/GetEmployee?PageIndex=1', {
                method: 'GET',
                headers: {
                    'Accept': '*/*'
                }
            });
            const data = await response.json();
            if (data.isSuccess) {
                setEmployees(data.employeeMasterList);
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const handleShow = () => setShow(true);

    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement | HTMLSelectElement;
        if (type === 'checkbox') {
            setEmployee(prev => ({ ...prev, [name]: checked ? 1 : 0 }));
        } else {
            setEmployee(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch('https://localhost:44344/api/EmployeeMaster/InsertEmployee', {
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(employee)
            });
            const data = await response.json();
            if (data.isSuccess) {
                // If successful, refresh the employee list
                fetchEmployees();
                handleClose();
            } else {
                console.error('Error inserting employee:', data.message);
            }
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
            dob: new Date().toISOString(),
            doj: new Date().toISOString(),
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
        employee.employeeID.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.departmentID.toString().includes(searchQuery.toLowerCase()) ||
        employee.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.currentProjectID.toString().includes(searchQuery.toLowerCase()) ||
        employee.salaryBankName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indexOfLastEmployee = currentPage * rowsPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - rowsPerPage;
    const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

    const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);

    const convertToCSV = (data: Employee[]) => {
        const csvRows = [
            ['ID', 'Employee Name', 'Employee ID', 'Department ID', 'Designation', 'HR Mobile Number', 'Gender ID', 'Father Name', 'DOB', 'DOJ', 'Current Project ID', 'App Access ID', 'Exempt Status ID', 'Performance Review ID', 'Pincode', 'State', 'District', 'Area ID', 'Address', 'Salary IFSC Code', 'Salary Bank Name', 'Salary Branch Name', 'Salary Bank Account Number', 'Reimbursement IFSC Code', 'Reimbursement Bank Name', 'Reimbursement Branch Name', 'Reimbursement Bank Account Number', 'Expense IFSC Code', 'Expense Bank Name', 'Expense Branch Name', 'Expense Bank Account Number', 'Created By', 'Updated By'],
            ...data.map(emp => [
                emp.id,
                emp.employeeName,
                emp.employeeID,
                emp.departmentID,
                emp.designation,
                emp.hrUpdateMobileNumber,
                emp.genderID,
                emp.fatherName,
                emp.dob,
                emp.doj,
                emp.currentProjectID,
                emp.appAccessID,
                emp.exemptStatusID,
                emp.performanceReviewID,
                emp.pincode,
                emp.state,
                emp.district,
                emp.areaID,
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
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'employees.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="container">
            <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center">
                <span><i className="ri-team-line me-2"></i><span className='fw-bold'>Employees List</span></span>
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
                    <Button variant="secondary" onClick={downloadCSV}>
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
                            />
                        </Form.Group>
                        <Form.Group controlId="employeeID" className="mb-3">
                            <Form.Label>Employee ID:</Form.Label>
                            <Form.Control
                                type="text"
                                name="employeeID"
                                value={employee.employeeID}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="departmentID" className="mb-3">
                            <Form.Label>Department ID:</Form.Label>
                            <Form.Control
                                type="number"
                                name="departmentID"
                                value={employee.departmentID}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="designation" className="mb-3">
                            <Form.Label>Designation:</Form.Label>
                            <Form.Control
                                type="text"
                                name="designation"
                                value={employee.designation}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="hrUpdateMobileNumber" className="mb-3">
                            <Form.Label>HR Update Mobile Number:</Form.Label>
                            <Form.Control
                                type="text"
                                name="hrUpdateMobileNumber"
                                value={employee.hrUpdateMobileNumber}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="genderID" className="mb-3">
                            <Form.Label>Gender ID:</Form.Label>
                            <Form.Control
                                type="number"
                                name="genderID"
                                value={employee.genderID}
                                onChange={handleChange}
                            >
                                <option value="0">Select Gender</option>
                                <option value="1">Male</option>
                                <option value="2">Female</option>
                                <option value="3">Other</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="fatherName" className="mb-3">
                            <Form.Label>Father's Name:</Form.Label>
                            <Form.Control
                                type="text"
                                name="fatherName"
                                value={employee.fatherName}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="dob" className="mb-3">
                            <Form.Label>Date of Birth:</Form.Label>
                            <Form.Control
                                type="date"
                                name="dob"
                                value={employee.dob.split('T')[0]} // Format date
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="doj" className="mb-3">
                            <Form.Label>Date of Joining:</Form.Label>
                            <Form.Control
                                type="date"
                                name="doj"
                                value={employee.doj.split('T')[0]} // Format date
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="currentProjectID" className="mb-3">
                            <Form.Label>Current Project ID:</Form.Label>
                            <Form.Control
                                type="number"
                                name="currentProjectID"
                                value={employee.currentProjectID}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="appAccessID" className="mb-3">
                            <Form.Label>App Access ID:</Form.Label>
                            <Form.Control
                                type="number"
                                name="appAccessID"
                                value={employee.appAccessID}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="exemptStatusID" className="mb-3">
                            <Form.Label>Exempt Status ID:</Form.Label>
                            <Form.Control
                                type="number"
                                name="exemptStatusID"
                                value={employee.exemptStatusID}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="performanceReviewID" className="mb-3">
                            <Form.Label>Performance Review ID:</Form.Label>
                            <Form.Control
                                type="number"
                                name="performanceReviewID"
                                value={employee.performanceReviewID}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="pincode" className="mb-3">
                            <Form.Label>Pincode:</Form.Label>
                            <Form.Control
                                type="text"
                                name="pincode"
                                value={employee.pincode}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="state" className="mb-3">
                            <Form.Label>State:</Form.Label>
                            <Form.Control
                                type="text"
                                name="state"
                                value={employee.state}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="district" className="mb-3">
                            <Form.Label>District:</Form.Label>
                            <Form.Control
                                type="text"
                                name="district"
                                value={employee.district}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="areaID" className="mb-3">
                            <Form.Label>Area ID:</Form.Label>
                            <Form.Control
                                type="number"
                                name="areaID"
                                value={employee.areaID}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="address" className="mb-3">
                            <Form.Label>Address:</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                value={employee.address}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="salaryIFSCCode" className="mb-3">
                            <Form.Label>Salary IFSC Code:</Form.Label>
                            <Form.Control
                                type="text"
                                name="salaryIFSCCode"
                                value={employee.salaryIFSCCode}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="salaryBankName" className="mb-3">
                            <Form.Label>Salary Bank Name:</Form.Label>
                            <Form.Control
                                type="text"
                                name="salaryBankName"
                                value={employee.salaryBankName}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="salaryBranchName" className="mb-3">
                            <Form.Label>Salary Branch Name:</Form.Label>
                            <Form.Control
                                type="text"
                                name="salaryBranchName"
                                value={employee.salaryBranchName}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="salaryBankAccountNumber" className="mb-3">
                            <Form.Label>Salary Bank Account Number:</Form.Label>
                            <Form.Control
                                type="text"
                                name="salaryBankAccountNumber"
                                value={employee.salaryBankAccountNumber}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="reimbursementIFSCCode" className="mb-3">
                            <Form.Label>Reimbursement IFSC Code:</Form.Label>
                            <Form.Control
                                type="text"
                                name="reimbursementIFSCCode"
                                value={employee.reimbursementIFSCCode}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="reimbursementBankName" className="mb-3">
                            <Form.Label>Reimbursement Bank Name:</Form.Label>
                            <Form.Control
                                type="text"
                                name="reimbursementBankName"
                                value={employee.reimbursementBankName}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="reimbursementBranchName" className="mb-3">
                            <Form.Label>Reimbursement Branch Name:</Form.Label>
                            <Form.Control
                                type="text"
                                name="reimbursementBranchName"
                                value={employee.reimbursementBranchName}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="reimbursementBankAccountNumber" className="mb-3">
                            <Form.Label>Reimbursement Bank Account Number:</Form.Label>
                            <Form.Control
                                type="text"
                                name="reimbursementBankAccountNumber"
                                value={employee.reimbursementBankAccountNumber}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="expenseIFSCCode" className="mb-3">
                            <Form.Label>Expense IFSC Code:</Form.Label>
                            <Form.Control
                                type="text"
                                name="expenseIFSCCode"
                                value={employee.expenseIFSCCode}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="expenseBankName" className="mb-3">
                            <Form.Label>Expense Bank Name:</Form.Label>
                            <Form.Control
                                type="text"
                                name="expenseBankName"
                                value={employee.expenseBankName}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="expenseBranchName" className="mb-3">
                            <Form.Label>Expense Branch Name:</Form.Label>
                            <Form.Control
                                type="text"
                                name="expenseBranchName"
                                value={employee.expenseBranchName}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="expenseBankAccountNumber" className="mb-3">
                            <Form.Label>Expense Bank Account Number:</Form.Label>
                            <Form.Control
                                type="text"
                                name="expenseBankAccountNumber"
                                value={employee.expenseBankAccountNumber}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="createdBy" className="mb-3">
                            <Form.Label>Created By:</Form.Label>
                            <Form.Control
                                type="text"
                                name="createdBy"
                                value={employee.createdBy}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="updatedBy" className="mb-3">
                            <Form.Label>Updated By:</Form.Label>
                            <Form.Control
                                type="text"
                                name="updatedBy"
                                value={employee.updatedBy}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Save Employee
                        </Button>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Employee ID</th>
                        <th>Department ID</th>
                        <th>Designation</th>
                        <th>HR Mobile Number</th>
                        <th>Gender ID</th>
                        <th>Father's Name</th>
                        <th>DOB</th>
                        <th>DOJ</th>
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
                        <th>Created By</th>
                        <th>Updated By</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentEmployees.map((emp, index) => (
                        <tr key={emp.id}>
                            <td>{emp.id}</td>
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
                            <td>{emp.createdBy}</td>
                            <td>{emp.updatedBy}</td>
                            <td>
                                <Button variant="warning" onClick={() => handleEdit(index)}>
                                    Edit
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <div className="d-flex justify-content-between align-items-center mt-4">
                <Pagination>
                    <Pagination.Prev
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    />
                    {Array.from({ length: totalPages }, (_, i) => (
                        <Pagination.Item
                            key={i + 1}
                            active={i + 1 === currentPage}
                            onClick={() => setCurrentPage(i + 1)}
                        >
                            {i + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    />
                </Pagination>

                <Form.Group controlId="rowsPerPage" className="d-flex align-items-center">
                    <Form.Label className="me-2">Rows per page:</Form.Label>
                    <Form.Control
                        as="select"
                        value={rowsPerPage}
                        onChange={handleRowsPerPageChange}
                    >
                        {[5, 10, 15].map(rows => (
                            <option key={rows} value={rows}>
                                {rows}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>
            </div>
        </div>
    );
};

export default EmployeeForm;
