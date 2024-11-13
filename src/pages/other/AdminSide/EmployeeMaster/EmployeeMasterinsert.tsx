import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_green.css';
import CustomSuccessToast from '../../Component/CustomSuccessToast';


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

interface ProjectList {
    id: string;
    projectName: string
}

interface MISExempt {
    id: number;
    name: string;
}
interface AppAccess {
    id: number;
    appAccess: string;
}
interface Department {
    id: number;
    departmentName: string;
}
interface District {
    district: string;
    state: string;
}

interface AreaData {
    areaName: string;
}


const EmployeeMasterInsert = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [empName, setEmpName] = useState<string | null>()
    const [genderList, setGenderList] = useState<GenderList[]>([])
    const [projectList, setProjectList] = useState<ProjectList[]>([])
    const [misExempt, setMisExempt] = useState<MISExempt[]>([]);
    const [appAccess, setAppAccess] = useState<AppAccess[]>([]);
    const [departmentList, setDepartmentList] = useState<Department[]>([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState('');
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

    const [districts, setDistricts] = useState<District[]>([]);
    const [areaData, setAreaData] = useState<AreaData[]>([]);
    const [searchPin, setSearchPin] = useState('');
    const [searchDistrict, setSearchDistrict] = useState('');

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




    const fetchBankByIFSC = async (ifsc: string, accountType: string) => {
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/BankMaster/GetBank`, {
                params: { ifsc }
            });

            if (response.data.isSuccess && response.data.bankMasterListResponses.length > 0) {
                const fetchedBankDetails = response.data.bankMasterListResponses[0];

                setEmployee((prevState) => ({
                    ...prevState,
                    [`${accountType.toLowerCase()}BankName`]: fetchedBankDetails.bank,
                    [`${accountType.toLowerCase()}BranchName`]: fetchedBankDetails.branch
                }));
            } else {
                console.error(response.data.message || "Bank details not found.");
            }
        } catch (error) {
            console.error('Error fetching bank details:', error);
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
        fetchData('CommonDropdown/GetProjectList', setProjectList, 'projectListResponses');
        fetchData('CommonDropdown/GetMISExempt', setMisExempt, 'mISExemptListResponses');
        fetchData('CommonDropdown/GetAppAccess', setAppAccess, 'appAccessListResponses');
        fetchData('CommonDropdown/GetDepartment', setDepartmentList, 'getDepartments');


    }, []);

    useEffect(() => {
        const fetchDistricts = async () => {
            try {
                const response = await axios.get(`${config.API_URL_APPLICATION}/AddressMaster/GetAddressData?PinCode=${searchPin}`);
                const fetchedDistricts = response.data.addresses;
                setDistricts(fetchedDistricts);
                if (fetchedDistricts.length > 0) {
                    const firstDistrict = fetchedDistricts[0].district; // Assuming the first district in the list
                    setSearchDistrict(firstDistrict);
                    setEmployee(prev => ({ ...prev, district: firstDistrict })); // Automatically set district in employee
                }
            } catch (error) {
                console.error('Error fetching districts:', error);
                setDistricts([]);
            }
        };

        if (searchPin.length === 6) {
            fetchDistricts();
        } else {
            setDistricts([]);
            setSearchDistrict('');
            setAreaData([]);
        }
    }, [searchPin]);


    useEffect(() => {
        const fetchAreaData = async () => {
            try {
                const response = await axios.get(`${config.API_URL_APPLICATION}/AddressMaster/GetAddressData?PinCode=${searchPin}&District=${searchDistrict}`);
                const fetchedAreas = response.data.addresses;
                setAreaData(fetchedAreas);
                if (fetchedAreas.length > 0) {
                    const firstArea = fetchedAreas[0].areaName; 
                    setEmployee(prev => ({ 
                        ...prev,
                         area: firstArea ,
                         state: fetchedAreas[0].state
                        
                    })); 
                }
            } catch (error) {
                console.error('Error fetching area data:', error);
                setAreaData([]);
            }
        };

        if (searchPin.length === 6 && searchDistrict) {
            fetchAreaData();
        }
    }, [searchPin, searchDistrict]);




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


    const handleIfscChange = (e: ChangeEvent<any>, accountType: string) => {
        const { value } = e.target;
        const fieldIfsc = `${accountType.toLowerCase()}BankIfsc`;

        setEmployee((prevState) => ({
            ...prevState,
            [fieldIfsc]: value
        }));

        // Only fetch if the value is of a specific length
        if (value.length === 11) {
            fetchBankByIFSC(value, accountType);
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
                await axios.post(`${config.API_URL_APPLICATION}/EmployeeMaster/UpdateEmployee`, payload);
                navigate('/pages/EmployeeMaster', {
                    state: {
                        showToast: true,
                        toastMessage: "Employee Updated successfully!",
                        toastVariant: "rgb(28 175 85)"
                    }
                });
            } else {
                await axios.post(`${config.API_URL_APPLICATION}/EmployeeMaster/InsertEmployee`, payload);
                navigate('/pages/EmployeeMaster', {
                    state: {
                        showToast: true,
                        toastMessage: "Employee Added successfully!",
                        toastVariant: "rgb(28 175 85)"
                    }
                });
            }
        } catch (error) {
            setToastMessage("Error Adding/Updating");
            setToastVariant("rgb(213 18 18)");
            setShowToast(true);
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
                                        value={departmentList.find((emp) => emp.departmentName === employee.departmentName)}
                                        onChange={(selectedOption) => {
                                            setEmployee({
                                                ...employee,
                                                departmentName: selectedOption?.departmentName || "",
                                            });
                                        }}
                                        getOptionLabel={(emp) => emp.departmentName}
                                        getOptionValue={(emp) => emp.departmentName}
                                        options={departmentList}
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
                                        placeholder="Select Gender"
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="fatherName" className="mb-3">
                                    <Form.Label>Father Name:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="fatherName"
                                        value={employee.fatherName}
                                        onChange={handleChange}
                                        required
                                        placeholder='Father Name'
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
                                            dateOfBirth: date.toISOString().split('T')[0]
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
                                <Form.Group controlId="currentProjectName" className="mb-3">
                                    <Form.Label>Current Project</Form.Label>
                                    <Select
                                        name="currentProjectName"
                                        value={projectList.find((emp) => emp.projectName === employee.currentProjectName)}
                                        onChange={(selectedOption) => {
                                            setEmployee({
                                                ...employee,
                                                currentProjectName: selectedOption?.projectName || "",
                                            });
                                        }}
                                        getOptionLabel={(emp) => emp.projectName}
                                        getOptionValue={(emp) => emp.projectName}
                                        options={projectList}
                                        isSearchable={true}
                                        placeholder="Select currentProjectName"
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="appAccessLevel" className="mb-3">
                                    <Form.Label>App Access *:</Form.Label>
                                    <Select
                                        name="appAccessLevel"
                                        value={appAccess.find((emp) => emp.appAccess === employee.appAccessLevel)}
                                        onChange={(selectedOption) => {
                                            setEmployee({
                                                ...employee,
                                                appAccessLevel: selectedOption?.appAccess || "",
                                            });
                                        }}
                                        getOptionLabel={(emp) => emp.appAccess}
                                        getOptionValue={(emp) => emp.appAccess}
                                        options={appAccess}
                                        isSearchable={true}
                                        placeholder="Select App Access"
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="appExempt" className="mb-3">
                                    <Form.Label>Exempt Status *:</Form.Label>
                                    <Select
                                        name="appExempt"
                                        value={misExempt.find((emp) => emp.name === employee.appExempt)}
                                        onChange={(selectedOption) => {
                                            setEmployee({
                                                ...employee,
                                                appExempt: selectedOption?.name || "",
                                            });
                                        }}
                                        getOptionLabel={(emp) => emp.name}
                                        getOptionValue={(emp) => emp.name}
                                        options={misExempt}
                                        isSearchable={true}
                                        placeholder="Select Exempt Status"
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="isPerformanceReview" className="mb-3">
                                    <Form.Label>Performance Review Applicapblity *:</Form.Label>
                                    <Select
                                        name="isPerformanceReview"
                                        value={misExempt.find((emp) => emp.name === employee.isPerformanceReview)}
                                        onChange={(selectedOption) => {
                                            setEmployee({
                                                ...employee,
                                                isPerformanceReview: selectedOption?.name || "",
                                            });
                                        }}
                                        getOptionLabel={(emp) => emp.name}
                                        getOptionValue={(emp) => emp.name}
                                        options={misExempt}
                                        isSearchable={true}
                                        placeholder="Select Performance Review Applicapblity"
                                        required
                                    />
                                </Form.Group>
                            </Col>


                            <h3>Address Details</h3>

                            <Col lg={6}>
                                <Form.Group controlId="pin" className="mb-3">
                                    <Form.Label>Pincode:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="pin"
                                        value={employee.pin}
                                        onChange={(e) => {
                                            setSearchPin(e.target.value);
                                            setEmployee(prev => ({ ...prev, pin: e.target.value })); // Update pin in employee
                                        }}
                                        required
                                        placeholder="Enter Pincode"
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="state" className="mb-3">
                                    <Form.Label>State:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="state"
                                        value={employee.state}
                                        onChange={handleChange}
                                        placeholder='Enter State Name'
                                        readOnly
                                        disabled={!searchPin}
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="district" className="mb-3">
                                    <Form.Label>District:</Form.Label>
                                    <Select
                                        name="district"
                                        value={districts.find(item => item.district === employee.district) || null}
                                        onChange={(selectedOption) => {
                                            const district = selectedOption ? selectedOption.district : '';
                                            setSearchDistrict(district);
                                            setEmployee(prev => ({ ...prev, district })); // Update district in employee
                                        }}
                                        options={districts || []}
                                        getOptionLabel={(item) => item.district}
                                        getOptionValue={(item) => item.district}
                                        isSearchable={true}
                                        placeholder="Select District"
                                        className="h45"
                                        isDisabled={!searchPin}
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="area" className="mb-3">
                                    <Form.Label>Area:</Form.Label>
                                    <Select
                                        name="area"
                                        value={areaData.find(item => item.areaName === employee.area) || null}
                                        onChange={(selectedOption) => {
                                            const areaName = selectedOption ? selectedOption.areaName : '';
                                            setEmployee(prev => ({ ...prev, area: areaName })); // Update area in employee
                                        }}
                                        options={areaData || []}
                                        getOptionLabel={(item) => item?.areaName || ''}
                                        getOptionValue={(item) => item?.areaName || ''}
                                        isSearchable={true}
                                        placeholder="Select Area"
                                        className="h45"
                                        isDisabled={!searchDistrict}
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={12}>
                                <Form.Group controlId="address" className="mb-3">
                                    <Form.Label>Address:</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="address"
                                        value={employee.address}
                                        rows={3}
                                        onChange={handleChange}
                                        placeholder='Enter Your Full Address'
                                    />
                                </Form.Group>
                            </Col>


                            <h3>Salary Account Details</h3>
                            <Col lg={6}>
                                <Form.Group controlId="salaryBankIfsc" className="mb-3">
                                    <Form.Label>IFSC Code:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="salaryBankIfsc"
                                        value={employee.salaryBankIfsc}
                                        onChange={(e) => handleIfscChange(e, 'salary')}
                                        placeholder='Enter IFSC Code'
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="salaryBankName" className="mb-3">
                                    <Form.Label>Bank Name:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="salaryBankName"
                                        value={employee.salaryBankName}
                                        onChange={handleChange}
                                        placeholder=' Bank Name'
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="salaryBranchName" className="mb-3">
                                    <Form.Label>Branch  Name:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="salaryBranchName"
                                        value={employee.salaryBranchName}
                                        onChange={handleChange}
                                        placeholder=' Branch  Name'
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>



                            <Col lg={6}>
                                <Form.Group controlId="salaryBankAccountNumber" className="mb-3">
                                    <Form.Label>Bank Account Number:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="salaryBankAccountNumber"
                                        value={employee.salaryBankAccountNumber}
                                        onChange={handleChange}
                                        placeholder='Enter Bank Account Number'
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="salaryBankAccountType" className="mb-3">
                                    <Form.Label>Bank Account Type:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="salaryBankAccountType"
                                        value={employee.salaryBankAccountType}
                                        onChange={handleChange}
                                        placeholder='Enter Bank Account Number'
                                        required
                                    />
                                </Form.Group>
                            </Col>


                            <h3>Reimbursement Account Details</h3>
                            <Col lg={6}>
                                <Form.Group controlId="reimbursementBankIfsc" className="mb-3">
                                    <Form.Label>IFSC Code:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="reimbursementBankIfsc"
                                        value={employee.reimbursementBankIfsc}
                                        onChange={(e) => handleIfscChange(e, 'reimbursement')}
                                        placeholder='Enter IFSC Code'
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="reimbursementBankName" className="mb-3">
                                    <Form.Label>Bank Name:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="reimbursementBankName"
                                        value={employee.reimbursementBankName}
                                        onChange={handleChange}
                                        placeholder=' Bank Name'
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="reimbursementBranchName" className="mb-3">
                                    <Form.Label>Branch  Name:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="reimbursementBranchName"
                                        value={employee.reimbursementBranchName}
                                        onChange={handleChange}
                                        placeholder=' Branch  Name'
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>



                            <Col lg={6}>
                                <Form.Group controlId="reimbursementBankAccountNumber" className="mb-3">
                                    <Form.Label>Bank Account Number:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="reimbursementBankAccountNumber"
                                        value={employee.reimbursementBankAccountNumber}
                                        onChange={handleChange}
                                        placeholder='Enter Bank Account Number'
                                    />
                                </Form.Group>
                            </Col>


                            <h3>Expense Account Details</h3>
                            <Col lg={6}>
                                <Form.Group controlId="expenseBankIfsc" className="mb-3">
                                    <Form.Label>IFSC Code:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="expenseBankIfsc"
                                        value={employee.expenseBankIfsc}
                                        onChange={(e) => handleIfscChange(e, 'expense')}
                                        placeholder='Enter IFSC Code'
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="expenseBankName" className="mb-3">
                                    <Form.Label>Bank Name:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="expenseBankName"
                                        value={employee.expenseBankName}
                                        onChange={handleChange}
                                        placeholder=' Bank Name'
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="expenseBranchName" className="mb-3">
                                    <Form.Label>Branch  Name:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="expenseBranchName"
                                        value={employee.expenseBranchName}
                                        onChange={handleChange}
                                        placeholder=' Branch  Name'
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>



                            <Col lg={6}>
                                <Form.Group controlId="expenseBankAccountNumber" className="mb-3">
                                    <Form.Label>Bank Account Number:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="expenseBankAccountNumber"
                                        value={employee.expenseBankAccountNumber}
                                        onChange={handleChange}
                                        placeholder='Enter Bank Account Number'
                                    />
                                </Form.Group>
                            </Col>




                            <Col className='align-items-end d-flex justify-content-between mb-3'>
                                <div>
                                    <span className='fs-5 '>All fields are required*</span>
                                </div>
                                <div>
                                    <Link to={'/pages/EmployeeMaster'}>
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
            <CustomSuccessToast show={showToast} toastMessage={toastMessage} toastVariant={toastVariant} onClose={() => setShowToast(false)} />

        </div>
    );
};

export default EmployeeMasterInsert;