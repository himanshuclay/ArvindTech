import React, { useState, useEffect, ChangeEvent } from 'react';
import { Button, Form, Offcanvas, Table, InputGroup, FormControl, Pagination } from 'react-bootstrap';

interface Employee {
    name: string;
    id: string;
    department: string;
    designation: string;
    appAccess: boolean;
    currentProject: string;
    dataAccessLevel: string;
    gender: string;
}

const EmployeeForm: React.FC = () => {
    const [employee, setEmployee] = useState<Employee>({
        name: '',
        id: '',
        department: '',
        designation: '',
        appAccess: false,
        currentProject: '',
        dataAccessLevel: '',
        gender: ''
    });

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [show, setShow] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        const storedEmployees = localStorage.getItem('employees');
        if (storedEmployees) {
            setEmployees(JSON.parse(storedEmployees));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('employees', JSON.stringify(employees));
    }, [employees]);

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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (editingIndex !== null) {
            const updatedEmployees = [...employees];
            updatedEmployees[editingIndex] = employee;
            setEmployees(updatedEmployees);
        } else {
            setEmployees([...employees, employee]);
        }
        setEmployee({
            name: '',
            id: '',
            department: '',
            designation: '',
            appAccess: false,
            currentProject: '',
            dataAccessLevel: '',
            gender: ''
        });
        handleClose();
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
            name: '',
            id: '',
            department: '',
            designation: '',
            appAccess: false,
            currentProject: '',
            dataAccessLevel: '',
            gender: ''
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
        employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.currentProject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.dataAccessLevel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.gender.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indexOfLastEmployee = currentPage * rowsPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - rowsPerPage;
    const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

    const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);

    const convertToCSV = (data: Employee[]) => {
        const csvRows = [
            ['Name', 'ID', 'Department', 'Designation', 'App Access', 'Current Project', 'Data Access Level', 'Gender'],
            ...data.map(emp => [
                emp.name,
                emp.id,
                emp.department,
                emp.designation,
                emp.appAccess ? 'Enabled' : 'Disabled',
                emp.currentProject,
                emp.dataAccessLevel,
                emp.gender
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

            <Offcanvas show={show} onHide={handleClose} >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Employee Form</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="name" className="mb-3">
                            <Form.Label>Employee Name:</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={employee.name}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="id" className="mb-3">
                            <Form.Label>Employee ID:</Form.Label>
                            <Form.Control
                                type="text"
                                name="id"
                                value={employee.id}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="department" className="mb-3">
                            <Form.Label>Department Name:</Form.Label>
                            <Form.Control
                                type="text"
                                name="department"
                                value={employee.department}
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
                        <Form.Group controlId="appAccess" className="mb-3">
                            <Form.Check
                                type="checkbox"
                                label="App Access"
                                name="appAccess"
                                checked={employee.appAccess}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="currentProject" className="mb-3">
                            <Form.Label>Current Project:</Form.Label>
                            <Form.Control
                                as="select"
                                name="currentProject"
                                value={employee.currentProject}
                                onChange={handleChange}
                            >
                                <option value="">Select Project</option>
                                <option value="Project A">Project A</option>
                                <option value="Project B">Project B</option>
                                <option value="Project C">Project C</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="dataAccessLevel" className="mb-3">
                            <Form.Label>Data Access Level:</Form.Label>
                            <Form.Control
                                type="text"
                                name="dataAccessLevel"
                                value={employee.dataAccessLevel}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="gender" className="mb-3">
                            <Form.Label>Gender:</Form.Label>
                            <Form.Control
                                as="select"
                                name="gender"
                                value={employee.gender}
                                onChange={handleChange}
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </Form.Control>
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
                        <th>Name</th>
                        <th>ID</th>
                        <th>Department</th>
                        {/* <th>Designation</th> */}
                        <th>App Access</th>
                        <th>Current Project</th>
                        <th>Data Access Level</th>
                        <th>Gender</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentEmployees.map((emp, index) => (
                        <tr key={index}>
                            <td>{emp.name}</td>
                            <td>{emp.id}</td>
                            <td>{emp.department}</td>
                            {/* <td>{emp.designation}</td> */}
                            <td>{emp.appAccess ? 'Enabled' : 'Disabled'}</td>
                            <td>{emp.currentProject}</td>
                            <td>{emp.dataAccessLevel}</td>
                            <td>{emp.gender}</td>
                            <td>
                                <i className='btn ri-edit-line' onClick={() => handleEdit(index + indexOfFirstEmployee)}></i>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default EmployeeForm;
