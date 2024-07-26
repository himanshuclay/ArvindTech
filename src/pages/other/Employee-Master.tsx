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

const EmployeePage: React.FC = () => {
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

    const [employeeList, setEmployeeList] = useState<Employee[]>([]);
    const [show, setShow] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        fetchEmployee(currentPage, rowsPerPage);
    }, [currentPage, rowsPerPage]);

    const fetchEmployee = async (page: number, rows: number) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ PageIndex: page.toString(), RowsPerPage: rows.toString() });
            const url = `https://localhost:44344/api/EmployeeMaster/GetEmployee?${params.toString()}`;

            const response = await axios.get(url, {
                headers: {
                    'accept': '*/*'
                }
            });

            if (response && response.status === 200 && response.data.isSuccess) {
                setEmployeeList(response.data.employeeMasterList);
                setTotalCount(response.data.totalCount);
            } else {
                console.error('Failed to fetch employee list: Invalid response status');
            }
        } catch (error) {
            console.error('An error occurred while fetching the employee list:', error);
        } finally {
            setLoading(false);
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

        const payload = { ...employee, updatedBy: employee.createdBy };

        try {
            let response;
            if (editingIndex !== null) {
                // Update existing employee
                response = await axios.post('https://localhost:44344/api/EmployeeMaster/UpdateEmployee', payload, {
                    headers: {
                        'accept': '*/*',
                        'Content-Type': 'application/json'
                    }
                });
            } else {
                // Insert new employee
                response = await axios.post('https://localhost:44344/api/EmployeeMaster/InsertEmployee', payload, {
                    headers: {
                        'accept': '*/*',
                        'Content-Type': 'application/json'
                    }
                });
            }

            if (response.status === 200 || response.status === 201) {
                const newEmployee = response.data;

                if (editingIndex !== null) {
                    const updatedEmployeeList = [...employeeList];
                    updatedEmployeeList[editingIndex] = newEmployee;
                    setEmployeeList(updatedEmployeeList);
                } else {
                    setEmployeeList([...employeeList, newEmployee]);
                }
                handleClose();
            } else {
                console.error('Failed to submit employee');
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('An error occurred while submitting the employee:', error.response.data);
            } else {
                console.error('An error occurred while submitting the employee:', error);
            }
        }
    };

    const handleEdit = (index: number) => {
        setEditingIndex(index);
        setEmployee(employeeList[index]);
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
        setCurrentPage(1);
    };

    const handleRowsPerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(totalCount / rowsPerPage);

    const convertToCSV = (data: Employee[]) => {
        const csvRows = [
            ['Employee Name', 'Employee ID', 'Department ID', 'Designation', 'HR Mobile Number', 'Gender ID', 'Father Name', 'DOB', 'DOJ', 'Current Project ID', 'App Access ID', 'Exempt Status ID', 'Performance Review ID', 'Pincode', 'State', 'District', 'Area ID', 'Address', 'Salary IFSC Code', 'Salary Bank Name', 'Salary Branch Name', 'Salary Bank Account Number', 'Reimbursement IFSC Code', 'Reimbursement Bank Name', 'Reimbursement Branch Name', 'Reimbursement Bank Account Number', 'Expense IFSC Code', 'Expense Bank Name', 'Expense Branch Name', 'Expense Bank Account Number', 'Created By'],
            ...data.map(emp => [
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
                emp.createdBy
            ])
        ];

        return csvRows.map(row => row.join(',')).join('\n');
    };

    const downloadCSV = () => {
        const csvData = convertToCSV(employeeList);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'employees.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div>
            
            <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center">
                <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>Employee List</span></span>
                <div className="d-flex">
                    <div className="app-search d-none d-lg-block me-4">
                        <form>
                            <div className="input-group">
                                <input
                                    type="search"
                                    className="form-control"
                                    placeholder="Search module..."
                                    value={searchQuery}
                                    onChange={handleSearch}
                                />
                                <span className="ri-search-line search-icon text-muted" />
                            </div>
                        </form>
                    </div>
                    <Button variant="primary" onClick={handleShow} className="me-2">
                        Add Eployee 
                    </Button>
                    <Button variant="secondary" onClick={downloadCSV}>
                        Download CSV
                    </Button>
                </div>
            </div>
          
            {loading ? <p>Loading...</p> : (
                <div className='overflow-auto'>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Employee Name</th>
                                <th>Employee ID</th>
                                <th>Department ID</th>
                                <th>Designation</th>
                                <th>Hr Update Mobile Number</th>
                                <th>Gender ID</th>
                                <th>Father Name</th>
                                <th>Date of Birth</th>
                                <th>Date of Joining</th>
                                <th>Current Project ID</th>
                                <th>App Access ID</th>
                                <th>Exempt Status ID</th>
                                <th>Performance Review ID</th>
                                <th>State</th>
                                <th>District</th>
                                <th>Area ID</th>
                                <th>Address</th>
                                <th>Salary IFSCCode</th>
                                <th>Salary BankName</th>
                                <th>Salary BranchName</th>
                                <th>Salary Bank Account Number</th>
                                <th>Reimbursement IFSCCode</th>
                                <th>Reimbursement BankName</th>
                                <th>Reimbursement BranchName</th>
                                <th>Reimbursement BnkAccountNumber</th>
                                <th>Expense IFSCCode</th>
                                <th>Expense BankName</th>
                                <th>Expense BranchName</th>
                                <th>Expense Bank AccountNumber</th>
                                <th>CreatedBy</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employeeList.filter(emp => emp.employeeName.toLowerCase().includes(searchQuery.toLowerCase())).map((emp, index) => (
                                <tr key={emp.id}>
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
                                    <td>
                                        <Button variant="info" onClick={() => handleEdit(index)}>Edit</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>

            )}
           
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
            <Offcanvas show={show} onHide={handleClose}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>{editingIndex !== null ? 'Edit Employee' : 'Add Employee'}</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Employee Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Employee Name"
                                name="employeeName"
                                value={employee.employeeName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Employee ID</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Employee ID"
                                name="employeeID"
                                value={employee.employeeID}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>departmentID ID</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Department ID"
                                name="departmentID"
                                value={employee.departmentID}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Designation ID</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Designation"
                                name="designation"
                                value={employee.designation}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Hr update Mobile Number</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter hr update Mobile Number"
                                name="hrUpdateMobileNumber"
                                value={employee.hrUpdateMobileNumber}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Gender Id</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Gender"
                                name="genderID"
                                value={employee.genderID}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label> Father Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Gender"
                                name="fatherName"
                                value={employee.fatherName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        {/* Repeat for other fields such as departmentID, designation, etc. */}
                        <Form.Group className="mb-3">
                            <Form.Label>Date of Birth</Form.Label>
                            <Form.Control
                                type="date"
                                name="dob"
                                value={employee.dob.split('T')[0]}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Date of Joining</Form.Label>
                            <Form.Control
                                type="date"
                                name="doj"
                                value={employee.doj.split('T')[0]}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label> Project Id</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Project Id"
                                name="currentProjectID"
                                value={employee.currentProjectID}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label> App Access Id</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter App Access ID"
                                name="appAccessID"
                                value={employee.appAccessID}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label> Exempt Status Id</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Exempt Status ID"
                                name="exemptStatusID"
                                value={employee.exemptStatusID}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label> Performance Review Id</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter performance Review ID"
                                name="performanceReviewID"
                                value={employee.performanceReviewID}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label> Pin code</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter PinCode"
                                name="pincode"
                                value={employee.pincode}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>  State</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter State"
                                name="state"
                                value={employee.state}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>  District</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter District"
                                name="district"
                                value={employee.district}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>  Area Id</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Area Id"
                                name="areaID"
                                value={employee.areaID}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>  Address</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Address"
                                name="address"
                                value={employee.address}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>  Salary IFSC code</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Salary IFSC code"
                                name="salaryIFSCCode"
                                value={employee.salaryIFSCCode}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>  Salary  Bank Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter  Salary  Bank Name"
                                name="salaryBankName"
                                value={employee.salaryBankName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>  Salary  Branch Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter  Salary  Branch Name"
                                name="salaryBranchName"
                                value={employee.salaryBranchName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>  Salary  Bank Account number</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter  Salary  Bank Account number "
                                name="salaryBankAccountNumber"
                                value={employee.salaryBankAccountNumber}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>  Reimbursement IFSCCode</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter  Reimbursement IFSCCode "
                                name="reimbursementIFSCCode"
                                value={employee.reimbursementIFSCCode}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>  Reimbursement BankName</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter  Reimbursement BankName "
                                name="reimbursementBankName"
                                value={employee.reimbursementBankName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>  Reimbursement BranchName</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter  Reimbursement BranchName "
                                name="reimbursementBranchName"
                                value={employee.reimbursementBranchName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>  Reimbursement Bank Account Number</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter  Reimbursement Bank   Account Number "
                                name="reimbursementBankAccountNumber"
                                value={employee.reimbursementBankAccountNumber}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>  Expense IFSCCode</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter  Expense IFSCCode "
                                name="expenseIFSCCode"
                                value={employee.expenseIFSCCode}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>  Expense BankName</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter  Expense BankName "
                                name="expenseBankName"
                                value={employee.expenseBankName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>  Expense BranchName</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter  Expense BranchName "
                                name="expenseBranchName"
                                value={employee.expenseBranchName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>  Expense Bank Account Number</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter  Expense Bank Account Number "
                                name="expenseBankAccountNumber"
                                value={employee.expenseBankAccountNumber}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>  CreatedBy</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter CreatedBy "
                                name="createdBy"
                                value={employee.createdBy}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        {/* Include other fields as needed */}
                        <Button variant="primary" type="submit">
                            {editingIndex !== null ? 'Update' : 'Add'}
                        </Button>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
};

export default EmployeePage;
