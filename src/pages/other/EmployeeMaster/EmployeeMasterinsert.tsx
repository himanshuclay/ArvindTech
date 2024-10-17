import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_green.css';


interface Employee {
    id: number;
    empID: string;
    employeeName: string;
    fatherName: string;
    email: string;
    role: string;
    dataAccessLevel: string;
    empStatus: string;
    hrUpdatedMobileNo: string;
    userUpdatedMobileNo: string;
    state: string;
    district: string;
    area: string;
    pin: string;
    address: string;
    photo: string;
    gender: string;
    dateOfBirth: string;
    dateOfJoining: string;
    dateOfLeaving: string;
    departmentName: string;
    designation: string;
    appExempt: string;
    isPerformanceReview: string;
    appAccessLevel: string;
    appAccess: string;
    currentProjectName: string;
    salaryBankAccountType: string;
    salaryBankAccountNumber: string;
    salaryBankName: string;
    salaryBankIfsc: string;
    salaryBranchName: string;
    reimbursementBankAccountType: string;
    reimbursementBankAccountNumber: string;
    reimbursementBankName: string;
    reimbursementBankIfsc: string;
    reimbursementBranchName: string;
    expenseBankAccountType: string;
    expenseBankAccountNumber: string;
    expenseBankName: string;
    expenseBankIfsc: string;
    expenseBranchName: string;
    excelDobValue: string;
    excelDojValue: string;
    excelDolValue: string;
    isRegistered: string;
    createdBy: string;
    updatedBy: string;
}

interface GenderList {
    id: number;
    name: string
}





const EmployeeMasterInsert = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [empName, setEmpName] = useState<string | null>()
    const [genderList, setGenderList] = useState<GenderList[]>([])

    const [employee, setEmployee] = useState<Employee>({
        id: 0,
        empID: '',
        employeeName: '',
        fatherName: '',
        email: '',
        role: '',
        dataAccessLevel: '',
        empStatus: '',
        hrUpdatedMobileNo: '',
        userUpdatedMobileNo: '',
        state: '',
        district: '',
        area: '',
        pin: '',
        address: '',
        photo: '',
        gender: '',
        dateOfBirth: '',
        dateOfJoining: '',
        dateOfLeaving: '',
        departmentName: '',
        designation: '',
        appExempt: '',
        isPerformanceReview: '',
        appAccessLevel: '',
        appAccess: '',
        currentProjectName: '',
        salaryBankAccountType: '',
        salaryBankAccountNumber: '',
        salaryBankName: '',
        salaryBankIfsc: '',
        salaryBranchName: '',
        reimbursementBankAccountType: '',
        reimbursementBankAccountNumber: '',
        reimbursementBankName: '',
        reimbursementBankIfsc: '',
        reimbursementBranchName: '',
        expenseBankAccountType: '',
        expenseBankAccountNumber: '',
        expenseBankName: '',
        expenseBankIfsc: '',
        expenseBranchName: '',
        excelDobValue: '',
        excelDojValue: '',
        excelDolValue: '',
        isRegistered: '',
        createdBy: '',
        updatedBy: '',
    });



    useEffect(() => {
        const storedEmpName = localStorage.getItem('EmpName');
        if (storedEmpName) {
            setEmpName(storedEmpName);
        }
    }, []);


    useEffect(() => {
        if (id) {
            setEditMode(true);
            fetchEmployeeById(id);
        } else {
            setEditMode(false);
        }
    }, [id]);



    const fetchEmployeeById = async (id: string) => {
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/EmployeeMaster/GetEmployee`, {
                params: { id: id }
            });
            if (response.data.isSuccess) {
                const fetchedModule = response.data.employeeMasterList[0];
                setEmployee(fetchedModule);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching module:', error);
        }
    };




    useEffect(() => {
        const fetchData = async (endpoint: string, setter: Function, listName: string) => {
            try {
                const response = await axios.get(`${config.API_URL_APPLICATION}/${endpoint}`);
                if (response.data.isSuccess) {
                    setter(response.data[listName]);
                } else {
                    console.error(response.data.message);
                }
            } catch (error) {
                console.error(`Error fetching data from ${endpoint}:`, error);
            }
        };

        fetchData('CommonDropdown/GetGender', setGenderList, 'genderListResponses');


    }, []);



    const handleChange = (e: ChangeEvent<any>) => {
        const { name, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setEmployee({
                ...employee,
                [name]: checked
            });
        } else {
            const value = (e.target as HTMLInputElement | HTMLSelectElement).value;
            setEmployee({
                ...employee,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const payload = {
            ...employee,
            createdBy: editMode ? employee.createdBy : empName,
            updatedBy: editMode ? empName : '',
        };
        console.log(payload)

        try {
            if (editMode) {
                await axios.post(`${config.API_URL_APPLICATION}/ProjectMaster/UpdateProject`, payload);
            } else {
                await axios.post(`${config.API_URL_APPLICATION}/ProjectMaster/InsertProject`, payload);
            }
            navigate('/pages/ProjectMaster');
        } catch (error) {
            console.error('Error submitting module:', error);
        }
    };


    return (
        <div>
            <div className="container ">
                <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center fs-20 rounded-3 border">
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit Employee' : 'Add Employee'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>


                            <Col lg={6}>
                                <Form.Group controlId="employeeName" className="mb-3">
                                    <Form.Label>Employee Name *:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="employeeName"
                                        value={employee.employeeName}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter Employee Name'

                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="departmentName" className="mb-3">
                                    <Form.Label>Department Name *:</Form.Label>
                                    <Select
                                        name="departmentName"
                                        // value={employeeList.find((emp) => emp.empId === employee.projectIncharge)}
                                        // onChange={(selectedOption) => {
                                        //     setEmployee({
                                        //         ...employee,
                                        //         projectIncharge: selectedOption?.empId || "",
                                        //     });
                                        // }}
                                        // getOptionLabel={(emp) => emp.employeeName}
                                        // getOptionValue={(emp) => emp.employeeName}
                                        // options={employeeList}
                                        isSearchable={true}
                                        placeholder="Select Department Name"
                                        required
                                    />
                                </Form.Group>
                            </Col>


                            <Col lg={6}>
                                <Form.Group controlId="designation" className="mb-3">
                                    <Form.Label>Designation  *:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="designation"
                                        value={employee.designation}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter Designation Name'

                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="hrUpdatedMobileNo" className="mb-3">
                                    <Form.Label>HR Update Mobile Number  *:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="hrUpdatedMobileNo"
                                        value={employee.hrUpdatedMobileNo}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter Mobile Number'

                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="gender" className="mb-3">
                                    <Form.Label>Gender *:</Form.Label>
                                    <Select
                                        name="gender"
                                        value={genderList.find((emp) => emp.name === employee.gender)}
                                        onChange={(selectedOption) => {
                                            setEmployee({
                                                ...employee,
                                                gender: selectedOption?.name || "",
                                            });
                                        }}
                                        getOptionLabel={(emp) => emp.name}
                                        getOptionValue={(emp) => emp.name}
                                        options={genderList}
                                        isSearchable={true}
                                        placeholder="Select Project Coordinator"
                                        required
                                    />
                                </Form.Group>
                            </Col>





                            <Col lg={6}>
                                <Form.Group controlId="fatherName" className="mb-3">
                                    <Form.Label>bapu Name:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="fatherName"
                                        value={employee.fatherName}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>


                            <Col lg={6}>
                                <Form.Group controlId="dateOfBirth" className="mb-3">
                                    <Form.Label> Date of Birth:</Form.Label>
                                    <Flatpickr
                                        value={employee.dateOfBirth}
                                        onChange={([date]) => setEmployee({
                                            ...employee,
                                            dateOfBirth: date.toISOString()
                                        })}
                                        options={{
                                            enableTime: false,
                                            dateFormat: "Y-m-d",
                                            time_24hr: false,
                                        }}
                                        placeholder=" Date of Birth "
                                        className="form-control"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            
                            <Col lg={6}>
                                <Form.Group controlId="estimateCompletionDate" className="mb-3">
                                    <Form.Label>Estimate Completion Date:</Form.Label>
                                    <Flatpickr
                                        value={employee.dateOfBirth}
                                        onChange={([date]) => setEmployee({
                                            ...employee,
                                            dateOfBirth: date.toISOString()
                                        })}
                                        options={{
                                            enableTime: false,
                                            dateFormat: "Y-m-d",
                                            time_24hr: false,
                                        }}
                                        placeholder="Estimate Completion Date"
                                        className="form-control"
                                        required
                                    />
                                </Form.Group>
                            </Col>



                            <Col lg={6}>
                                <Form.Group controlId="currentProjectName" className="mb-3">
                                    <Form.Label>Current Project *:</Form.Label>
                                    <Select
                                        name="currentProjectName"
                                        value={genderList.find((emp) => emp.name === employee.gender)}
                                        onChange={(selectedOption) => {
                                            setEmployee({
                                                ...employee,
                                                gender: selectedOption?.name || "",
                                            });
                                        }}
                                        getOptionLabel={(emp) => emp.name}
                                        getOptionValue={(emp) => emp.name}
                                        options={genderList}
                                        isSearchable={true}
                                        placeholder="Select currentProjectName"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="currentProjectName" className="mb-3">
                                    <Form.Label>App Access *:</Form.Label>
                                    <Select
                                        name="currentProjectName"
                                        value={genderList.find((emp) => emp.name === employee.gender)}
                                        onChange={(selectedOption) => {
                                            setEmployee({
                                                ...employee,
                                                gender: selectedOption?.name || "",
                                            });
                                        }}
                                        getOptionLabel={(emp) => emp.name}
                                        getOptionValue={(emp) => emp.name}
                                        options={genderList}
                                        isSearchable={true}
                                        placeholder="Select App Access"
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="currentProjectName" className="mb-3">
                                    <Form.Label>Exempt Status *:</Form.Label>
                                    <Select
                                        name="currentProjectName"
                                        value={genderList.find((emp) => emp.name === employee.gender)}
                                        onChange={(selectedOption) => {
                                            setEmployee({
                                                ...employee,
                                                gender: selectedOption?.name || "",
                                            });
                                        }}
                                        getOptionLabel={(emp) => emp.name}
                                        getOptionValue={(emp) => emp.name}
                                        options={genderList}
                                        isSearchable={true}
                                        placeholder="Select Exempt Status"
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="currentProjectName" className="mb-3">
                                    <Form.Label>Performance Review Applicapblity *:</Form.Label>
                                    <Select
                                        name="currentProjectName"
                                        value={genderList.find((emp) => emp.name === employee.gender)}
                                        onChange={(selectedOption) => {
                                            setEmployee({
                                                ...employee,
                                                gender: selectedOption?.name || "",
                                            });
                                        }}
                                        getOptionLabel={(emp) => emp.name}
                                        getOptionValue={(emp) => emp.name}
                                        options={genderList}
                                        isSearchable={true}
                                        placeholder="Select Performance Review Applicapblity"
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="Pincode" className="mb-3">
                                    <Form.Label>Pincode:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="Pincode"
                                        // value={employee.nameOfWork}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="State" className="mb-3">
                                    <Form.Label>State:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="State"
                                        // value={employee.nameOfWork}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="District" className="mb-3">
                                    <Form.Label>District:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="District"
                                        // value={employee.nameOfWork}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="Area" className="mb-3">
                                    <Form.Label>Area:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="Area"
                                        // value={employee.nameOfWork}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="Address" className="mb-3">
                                    <Form.Label>Address:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="Address"
                                        // value={employee.nameOfWork}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>


                            <Col className='align-items-end d-flex justify-content-between mb-3'>
                                <div>
                                    <span className='fs-5 '>All fields are required*</span>
                                </div>
                                <div>
                                    <Link to={'/pages/ProjectMaster'}>
                                        <Button variant="primary" >
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update Employee' : 'Add Employee'}
                                    </Button>
                                </div>

                            </Col>

                        </Row>

                    </Form>
                </div>

            </div>
        </div>
    );
};

export default EmployeeMasterInsert;