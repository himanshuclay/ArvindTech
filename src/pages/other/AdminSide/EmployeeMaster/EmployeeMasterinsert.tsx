import axios from 'axios';
import { useEffect, useState, ChangeEvent, useRef } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
// import { DateRangePicker, DatePicker } from 'rsuite';
import config from '@/config';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_green.css';
import { toast } from 'react-toastify';

interface Employee {
    id: number;
    empID: string;
    employeeName: string;
    fatherName: string;
    email: string;
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
    daL_Module: string[];
    daL_Project: string[];
    registrationDate: string;
    createdBy: string;
    updatedBy: string;
}

interface GenderList {
    id: number;
    name: string
}

interface ModuleProjectList {
    id: string;
    projectName: string
    moduleName: string
}

interface Department {
    id: number;
    departmentName: string;
    department: string;
}
interface District {
    district: string;
    state: string;
}

interface AreaData {
    areaName: string;
}


const EmployeeMasterInsert = () => {
    const { id } = useParams<{ id: any }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [empName, setEmpName] = useState<string | null>()
    const [genderList, setGenderList] = useState<GenderList[]>([])
    const [projectList, setProjectList] = useState<ModuleProjectList[]>([])
    const [moduleList, setModuleList] = useState<ModuleProjectList[]>([])
    const [departmentList, setDepartmentList] = useState<Department[]>([]);
    const [employee, setEmployee] = useState<Employee>({
        id: 0,
        empID: '',
        employeeName: '',
        fatherName: '',
        email: '',
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
        daL_Module: [],
        daL_Project: [],
        registrationDate: '',
        createdBy: '',
        updatedBy: '',
    });
    const [ifscError, setIfscError] = useState({
        salary: '',
        reimbursement: '',
        expense: ''
    });
    const [errorMessage, setErrorMessage] = useState('');


    const [districts, setDistricts] = useState<District[]>([]);
    const [areaData, setAreaData] = useState<AreaData[]>([]);
    const [searchPin, setSearchPin] = useState('');
    const [searchDistrict, setSearchDistrict] = useState('');

    const [isMobileVerified, setIsMobileVerified] = useState(false);

    const dateOfLeavingRef = useRef<any>(null);
    useEffect(() => {
        toast.dismiss()
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
                // Handle no bank details found
                setIfscError((prevState) => ({
                    ...prevState,
                    [accountType.toLowerCase()]: 'Bank details not found for the given IFSC code.'
                }));
            }
        } catch (error) {
            console.error('Error fetching bank details:', error);
            setIfscError((prevState) => ({
                ...prevState,
                [accountType.toLowerCase()]: 'Error fetching bank details.'
            }));
        }
    };


    const handleIfscBlur = async (accountType: string) => {
        const ifscField = `${accountType.toLowerCase()}BankIfsc` as keyof Employee;
        const bankNameField = `${accountType.toLowerCase()}BankName` as keyof Employee;
        const branchNameField = `${accountType.toLowerCase()}BranchName` as keyof Employee;

        const ifsc = employee[ifscField];

        // Check if IFSC is valid
        if (typeof ifsc !== 'string' || ifsc.length !== 11) {
            // Reset bank details if IFSC is invalid
            setEmployee((prevState) => ({
                ...prevState,
                [bankNameField]: '',
                [branchNameField]: ''
            }));

            setIfscError((prevState) => ({
                ...prevState,
                [accountType.toLowerCase()]: ifsc ? 'Invalid IFSC code. Please enter a valid 11-character code.' : ''
            }));

            return;
        }

        setIfscError((prevState) => ({
            ...prevState,
            [accountType.toLowerCase()]: ''
        }));
        // Fetch bank details if IFSC is valid
        await fetchBankByIFSC(ifsc, accountType);
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
        fetchData('CommonDropdown/GetDepartment', setDepartmentList, 'getDepartments');
        fetchData('CommonDropdown/GetModuleList', setModuleList, 'moduleNameListResponses');
    }, []);

    console.log(searchDistrict)
    const fetchDistricts = async () => {
        try {
            // Clear previous errors
            setErrorMessage('');
            if (!searchPin.trim()) {
                setDistricts([]);
                setSearchDistrict('');
                setAreaData([]);
                setEmployee(prev => ({ ...prev, district: '', area: '', state: '' }));
                return; // Stop execution if the pincode is blank
            }

            const response = await axios.get(`${config.API_URL_APPLICATION}/AddressMaster/GetAddressData?PinCode=${searchPin}`);
            const fetchedDistricts = response.data.addresses;

            if (fetchedDistricts.length > 0) {
                setDistricts(fetchedDistricts);

                const firstDistrict = fetchedDistricts[0].district;
                const fetchedState = fetchedDistricts[0]?.state || '';
                console.log('hi')
                setSearchDistrict(firstDistrict);
                setEmployee(prev => ({
                    ...prev,
                    district: firstDistrict,
                    state: fetchedState,
                }));

                // Fetch area data for the default district
                await fetchAreaData(searchPin, firstDistrict);
            } else {
                // Handle invalid pincode
                setDistricts([]);
                setSearchDistrict('');
                setAreaData([]);
                setEmployee(prev => ({ ...prev, district: '', area: '', state: '' }));

                setErrorMessage('Invalid Pincode. Please try again.');
            }
        } catch (error) {
            console.error('Error fetching districts:', error);
            setDistricts([]);
            setSearchDistrict('');
            setAreaData([]);
            setEmployee(prev => ({ ...prev, district: '', area: '', state: '' }));

            setErrorMessage('Invalid Pincode. Please try again.');
        }
    };


    const fetchAreaData = async (pin: string, district: string) => {
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/AddressMaster/GetAddressData?PinCode=${pin}&District=${district}`);
            const fetchedAreas = response.data.addresses;

            if (fetchedAreas.length > 0) {
                setAreaData(fetchedAreas);

                const firstArea = fetchedAreas[0].areaName;
                const fetchedState = fetchedAreas[0]?.state || '';
                setEmployee(prev => ({
                    ...prev,
                    area: firstArea,
                    state: fetchedState,
                }));
            } else {
                // Handle invalid pincode or no areas found
                setAreaData([]);
                setEmployee(prev => ({ ...prev, area: '', state: '' }));
                toast.error("Invalid Pincode or no areas found. Please try again.");
            }
        } catch (error) {
            console.error('Error fetching area data:', error);
            setAreaData([]);
            setEmployee(prev => ({ ...prev, area: '', state: '' }));
            toast.error("Invalid Pincode or no areas found. Please try again.");
        }
    };



    const handleChange = (e: ChangeEvent<any> | null, name?: string, value?: any) => {
        const validateMobileNumber = (fieldName: string, fieldValue: string) => {
            if (!/^\d{0,10}$/.test(fieldValue)) {

                return false;
            }

            setEmployee((prevData) => ({
                ...prevData,
                [fieldName]: fieldValue,
            }));

            if (fieldValue.length === 10) {
                if (!/^[6-9]/.test(fieldValue)) {
                    toast.error("Mobile number should start with a digit between 6 and 9.");
                    setIsMobileVerified(true);
                    return false;
                }
            } else {
                setIsMobileVerified(false);
            }

            return true;
        };

        if (e) {
            const { name: eventName, type } = e.target;

            if (type === 'checkbox') {
                const checked = (e.target as HTMLInputElement).checked;
                setEmployee((prevData) => ({
                    ...prevData,
                    [eventName]: checked,
                }));
            } else {
                const inputValue = (e.target as HTMLInputElement | HTMLSelectElement).value;

                if (eventName === "userUpdatedMobileNo" || eventName === "hrUpdatedMobileNo") {
                    validateMobileNumber(eventName, inputValue);
                } else {
                    setEmployee((prevData) => {
                        const updatedData = { ...prevData, [eventName]: inputValue };

                        // Clear corresponding fields based on dataAccessLevel
                        if (eventName === "dataAccessLevel") {
                            if (inputValue === "Module") {
                                updatedData.daL_Project = [];
                            } else if (inputValue === "Project") {
                                updatedData.daL_Module = [];
                            } else if (inputValue === "ProjectModule") {
                                if (!updatedData.daL_Project?.length || !updatedData.daL_Module?.length) {
                                    toast.error("Both DAL Project and DAL Module are required for ProjectModule.");
                                }
                            } else {
                                updatedData.daL_Module = [];
                                updatedData.daL_Project = [];
                            }
                        }
                        if (name === 'empStatus') {
                            if (value !== 'Former') {
                                updatedData.dateOfLeaving = '';
                            }
                        }

                        return updatedData;
                    });
                }
            }
        } else if (name) {
            setEmployee((prevData) => {
                const updatedData = { ...prevData, [name]: value };

                // Clear corresponding fields based on dataAccessLevel
                if (name === "dataAccessLevel") {
                    if (value === "Module") {
                        updatedData.daL_Project = [];
                    } else if (value === "Project") {
                        updatedData.daL_Module = [];
                    } else if (value === "ProjectModule") {
                        if (!updatedData.daL_Project?.length || !updatedData.daL_Module?.length) {
                            toast.error("Both DAL Project and DAL Module are required for ProjectModule.");
                        }
                    } else {
                        updatedData.daL_Module = [];
                        updatedData.daL_Project = [];
                    }
                }

                if (name === 'empStatus') {
                    if (value !== 'Former') {
                        updatedData.dateOfLeaving = '';
                    }
                }

                return updatedData;
            });
        }

    };


    const handleIfscChange = (e: ChangeEvent<any>, accountType: string) => {
        const { value } = e.target;
        const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
        const fieldIfsc = `${accountType.toLowerCase()}BankIfsc` as keyof Employee;

        setEmployee((prevState) => ({
            ...prevState,
            [fieldIfsc]: capitalizedValue
        }));

        // Validate IFSC length after input change (optional for some cases)
        if (value.length === 11) {
            fetchBankByIFSC(value, accountType);
        } else {
            // Reset error if it's incomplete
            setIfscError((prevError) => ({
                ...prevError,
                [accountType.toLowerCase()]: ''
            }));
        }
    };


    const handleBankAccountNumberChange = (e: ChangeEvent<any>, accountType: string) => {
        const { value } = e.target as HTMLInputElement;

        const validValue = value.replace(/[^0-9]/g, "");

        setEmployee((prevState) => ({
            ...prevState,
            [`${accountType}BankAccountNumber`]: validValue
        }));
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        toast.dismiss()
        if (isMobileVerified) {
            toast.error("Please verify your mobile number before submitting the form.");
            return;
        }

        if (employee.empStatus === 'Former' && !employee.dateOfLeaving) {
            dateOfLeavingRef.current?.flatpickr.open(); // Focus and open the Flatpickr field
            return;
        }

        const payload = {
            ...employee,
            createdBy: editMode ? employee.createdBy : empName,
            updatedBy: editMode ? empName : '',
            daL_Module: Array.isArray(employee.daL_Module) ? employee.daL_Module.join(',') : employee.daL_Module,
            daL_Project: Array.isArray(employee.daL_Project) ? employee.daL_Project.join(',') : employee.daL_Project,
        };

        console.log(payload)
        try {
            if (editMode) {
                await axios.post(`${config.API_URL_APPLICATION}/EmployeeMaster/UpdateEmployee`, payload);
                navigate('/pages/EmployeeMaster', {
                    state: {
                        successMessage: `Employee Updated successfully! `,
                    }
                });
            } else {
                await axios.post(`${config.API_URL_APPLICATION}/EmployeeMaster/InsertEmployee`, payload);
                navigate('/pages/EmployeeMaster', {
                    state: {
                        successMessage: ` Employee Added successfully! `,
                    }
                });
            }
        } catch (error: any) {
            toast.error(error || "Error Adding/Updating");
            console.error('Error submitting module:', error);
        }
    };



    const optionsAppAccess = [
        { value: 'Enabled', label: 'Enabled' },
        { value: 'Disabled', label: 'Disabled' }
    ];
    const optionsAppExempt = [
        { value: 'Yes', label: 'Yes' },
        { value: 'No', label: 'No' }
    ];
    const optionsEmpStatus = [
        { value: 'Current', label: 'Current' },
        { value: 'Former', label: 'Former' },
        { value: 'Absconding', label: 'Absconding' },
    ];
    const optionsAppAccesLevel = [
        { value: 'Admin', label: 'Admin' },
        { value: 'Employee', label: 'Employee' },
        { value: 'Management', label: 'Management' },
        { value: 'PC', label: 'PC' },
        { value: 'DME', label: 'DME' },
    ];
    const optionsDataAccesLevel = [
        { value: 'All', label: 'All' },
        { value: 'OnlySelf', label: 'OnlySelf' },
        { value: 'ProjectModule', label: 'ProjectModule' },
        { value: 'Module', label: 'Module' },
        { value: 'Project', label: 'Project' }
    ];

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
                                <Form.Group controlId="empID" className="mb-3">
                                    <Form.Label>Employee ID *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="empID"
                                        value={employee.empID || ''}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter Employee ID'
                                        disabled={editMode}
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="employeeName" className="mb-3">
                                    <Form.Label>Employee Name *</Form.Label>
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
                                    <Form.Label>Department Name *</Form.Label>
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
                                    <Form.Label>Designation *</Form.Label>
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
                                    <Form.Label>HR Update Mobile Number  *</Form.Label>
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
                                    <Form.Label>Gender *</Form.Label>
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
                                    <Form.Label>Father Name *</Form.Label>
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
                                    <Form.Label> Date of Birth *</Form.Label>
                                    <Flatpickr
                                        value={employee.dateOfBirth}
                                        onChange={([date]) => {
                                            if (date) {
                                                const formattedDate = date.toLocaleDateString('en-CA');
                                                setEmployee({
                                                    ...employee,
                                                    dateOfBirth: formattedDate,
                                                });
                                            }
                                        }}
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
                                <Form.Group controlId="dateOfJoining" className="mb-3">
                                    <Form.Label> Date of Joining *</Form.Label>
                                    <Flatpickr
                                        value={employee.dateOfJoining}
                                        onChange={([date]) => {
                                            if (date) {
                                                const formattedDate = date.toLocaleDateString('en-CA');
                                                setEmployee({
                                                    ...employee,
                                                    dateOfJoining: formattedDate,
                                                });
                                            }
                                        }}
                                        options={{
                                            enableTime: false,
                                            dateFormat: "Y-m-d",
                                            time_24hr: false,
                                        }}
                                        placeholder=" Date of Joining "
                                        className="form-control"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="currentProjectName" className="mb-3">
                                    <Form.Label>Current Project Name</Form.Label>
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
                                        placeholder="Select Current Project"
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="appAccess" className="mb-3">
                                    <Form.Label>App Access *</Form.Label>
                                    <Select
                                        name="appAccess"
                                        options={optionsAppAccess}
                                        value={optionsAppAccess.find(option => option.value === employee.appAccess)}
                                        onChange={selectedOption => handleChange(null, 'appAccess', selectedOption?.value)}
                                        placeholder="Select App Access"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="appExempt" className="mb-3">
                                    <Form.Label>Exempt Status *</Form.Label>
                                    <Select
                                        name="appExempt"
                                        options={optionsAppExempt}
                                        value={optionsAppExempt.find(option => option.value === employee.appExempt)}
                                        onChange={selectedOption => handleChange(null, 'appExempt', selectedOption?.value)}
                                        placeholder="Select Exempt Status"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="isPerformanceReview" className="mb-3">
                                    <Form.Label>Performance Review Applicability *</Form.Label>
                                    <Select
                                        name="isPerformanceReview"
                                        options={optionsAppExempt}
                                        value={optionsAppExempt.find(option => option.value === employee.isPerformanceReview)}
                                        onChange={selectedOption => handleChange(null, 'isPerformanceReview', selectedOption?.value)}
                                        placeholder="Select Performance Review Applicability"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="dataAccessLevel" className="mb-3">
                                    <Form.Label>Data Access Level *</Form.Label>
                                    <Select
                                        name="dataAccessLevel"
                                        options={optionsDataAccesLevel}
                                        value={optionsDataAccesLevel.find(option => option.value === employee.dataAccessLevel)}
                                        onChange={selectedOption => handleChange(null, 'dataAccessLevel', selectedOption?.value)}
                                        placeholder="Select Data Access Level"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="appAccessLevel" className="mb-3">
                                    <Form.Label>App Access Level *</Form.Label>
                                    <Select
                                        name="appAccessLevel"
                                        options={optionsAppAccesLevel}
                                        value={optionsAppAccesLevel.find(option => option.value === employee.appAccessLevel)}
                                        onChange={selectedOption => handleChange(null, 'appAccessLevel', selectedOption?.value)}
                                        placeholder="Select App Access Level"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="empStatus" className="mb-3">
                                    <Form.Label>Employee Status *</Form.Label>
                                    <Select
                                        name="empStatus"
                                        options={optionsEmpStatus}
                                        value={optionsEmpStatus.find(option => option.value === employee.empStatus)}
                                        onChange={selectedOption => handleChange(null, 'empStatus', selectedOption?.value)}
                                        placeholder="Select Employee Status"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="daL_Module" className="mb-3">
                                    <Form.Label> DAL Module {(employee.dataAccessLevel === 'Module' || employee.dataAccessLevel === 'ProjectModule') ? '*' : null} </Form.Label>

                                    <Select
                                        name="daL_Module"
                                        value={moduleList.filter(emp => employee.daL_Module.includes(emp.moduleName)
                                        )}
                                        onChange={(selectedOptions) => {
                                            const daL_Module = (selectedOptions || []).map(option => option.moduleName);
                                            setEmployee(prev => ({
                                                ...prev,
                                                daL_Module
                                            }));
                                        }}
                                        getOptionLabel={(emp) => emp.moduleName}
                                        getOptionValue={(emp) => emp.moduleName}
                                        options={moduleList}
                                        isSearchable={true}
                                        isMulti={true}
                                        required={employee.dataAccessLevel === 'Module' || employee.dataAccessLevel === 'ProjectModule'}
                                        placeholder="Select Module"
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="daL_Project" className="mb-3">
                                    <Form.Label> DAL Project {(employee.dataAccessLevel === 'Project' || employee.dataAccessLevel === 'ProjectModule') ? '*' : null} </Form.Label>

                                    <Select
                                        name="daL_Project"
                                        value={projectList.filter(emp => employee.daL_Project.includes(emp.projectName)
                                        )}
                                        onChange={(selectedOptions) => {
                                            const daL_Project = (selectedOptions || []).map(option => option.projectName);
                                            setEmployee(prev => ({
                                                ...prev,
                                                daL_Project
                                            }));
                                        }}
                                        getOptionLabel={(emp) => emp.projectName}
                                        getOptionValue={(emp) => emp.projectName}
                                        options={projectList}
                                        isSearchable={true}
                                        isMulti={true}
                                        required={employee.dataAccessLevel === 'Project' || employee.dataAccessLevel === 'ProjectModule'}
                                        placeholder="Select Projects"
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="isRegistered" className="mb-3">
                                    <Form.Label>Is Registered *</Form.Label>
                                    <Form.Control
                                        name="isRegistered"
                                        value={employee.isRegistered}
                                        placeholder="Is Registered"
                                        disabled
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="registrationDate" className="mb-3">
                                    <Form.Label>Registration Date *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="registrationDate"
                                        value={employee.registrationDate}
                                        placeholder='Date of Registration'
                                        disabled

                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="userUpdatedMobileNo" className="mb-3">
                                    <Form.Label>User Updated Mobile Number </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="userUpdatedMobileNo"
                                        value={employee.userUpdatedMobileNo}
                                        placeholder='User Updated Mobile Number'
                                        disabled
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="dateOfLeaving" className="mb-3">
                                    <Form.Label> Date of Leaving {employee.empStatus === 'Former' ? '*' : null}</Form.Label>
                                    <Flatpickr
                                        value={employee.dateOfLeaving}
                                        onChange={([date]) => setEmployee({
                                            ...employee,
                                            dateOfLeaving: date.toISOString().split('T')[0]
                                        })}
                                        options={{
                                            enableTime: false,
                                            dateFormat: "Y-m-d",
                                            time_24hr: false,
                                        }}
                                        placeholder=" Date of Leaving "
                                        className="form-control"
                                        required={employee.empStatus === 'Former'}

                                    />

                                    {employee.empStatus === 'Former' && !employee.dateOfLeaving && (
                                        <Form.Text className="text-danger">
                                            Date of Leaving is required for Former employees.
                                        </Form.Text>
                                    )}
                                </Form.Group>
                            </Col>


                            <h3>Address Details</h3>
                            <Col lg={6}>
                                <Form.Group controlId="pin" className="mb-3">
                                    <Form.Label>Pincode *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="pin"
                                        value={employee.pin}
                                        onChange={(e) => {
                                            setSearchPin(e.target.value || employee.pin);
                                            setEmployee(prev => ({ ...prev, pin: e.target.value }));
                                        }}
                                        onBlur={fetchDistricts}
                                        required
                                        placeholder="Enter Pincode"
                                    />
                                    {errorMessage && <div className="text-danger mt-1">{errorMessage}</div>}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="state" className="mb-3">
                                    <Form.Label>State </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="state"
                                        value={employee.state}
                                        onChange={handleChange}
                                        placeholder='Enter State Name'
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="district" className="mb-3">
                                    <Form.Label>District </Form.Label>
                                    <Select
                                        name="district"
                                        value={
                                            districts.find(item => item.district === employee.district) ||
                                            (employee.district && { district: employee.district }) ||
                                            null
                                        }
                                        onChange={(selectedOption) => {
                                            const district = selectedOption ? selectedOption.district : '';
                                            setSearchDistrict(district);
                                            setEmployee(prev => ({ ...prev, district })); // Update district in employee
                                            fetchAreaData(searchPin, district);
                                        }}
                                        options={districts || []}
                                        getOptionLabel={(item) => item.district}
                                        getOptionValue={(item) => item.district}
                                        isSearchable={true}
                                        placeholder="Select District"
                                        className="h45"
                                    />

                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="area" className="mb-3">
                                    <Form.Label>Area </Form.Label>
                                    <Select
                                        name="area"
                                        value={
                                            areaData.find(item => item.areaName === employee.area) ||
                                            (employee.area && { areaName: employee.area }) ||
                                            null
                                        }
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
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={12}>
                                <Form.Group controlId="address" className="mb-3">
                                    <Form.Label>Address *</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="address"
                                        value={employee.address}
                                        rows={3}
                                        onChange={handleChange}
                                        placeholder='Enter Your Full Address'
                                        required
                                    />
                                </Form.Group>
                            </Col>


                            <h3>Salary Account Details</h3>
                            <Col lg={6}>
                                <Form.Group controlId="salaryBankIfsc" className="mb-3">
                                    <Form.Label>IFSC Code</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="salaryBankIfsc"
                                        value={employee.salaryBankIfsc}
                                        onChange={(e) => handleIfscChange(e, 'salary')}
                                        onBlur={() => handleIfscBlur('salary')}
                                        placeholder="Enter IFSC Code"
                                    />
                                    {ifscError.salary && <div className="text-danger mt-1">{ifscError.salary}</div>}
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="salaryBankName" className="mb-3">
                                    <Form.Label>Bank Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="salaryBankName"
                                        value={employee.salaryBankName}
                                        placeholder=' Bank Name'
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="salaryBranchName" className="mb-3">
                                    <Form.Label>Branch  Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="salaryBranchName"
                                        value={employee.salaryBranchName}
                                        placeholder=' Branch  Name'
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>



                            <Col lg={6}>
                                <Form.Group controlId="salaryBankAccountNumber" className="mb-3">
                                    <Form.Label>Bank Account Number</Form.Label>
                                    <Form.Control
                                        type="text" // Change to "text" to preserve leading zeroes
                                        name="salaryBankAccountNumber"
                                        value={employee.salaryBankAccountNumber}
                                        onChange={(e) => handleBankAccountNumberChange(e, 'salary')}
                                        placeholder="Enter Bank Account Number"
                                    />
                                </Form.Group>
                            </Col>

                            <h3>Reimbursement Account Details</h3>
                            <Col lg={6}>
                                <Form.Group controlId="reimbursementBankIfsc" className="mb-3">
                                    <Form.Label>IFSC Code</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="reimbursementBankIfsc"
                                        value={employee.reimbursementBankIfsc}
                                        onChange={(e) => handleIfscChange(e, 'reimbursement')}

                                        onBlur={() => handleIfscBlur('reimbursement')}
                                        placeholder="Enter IFSC Code"
                                    />
                                    {ifscError.reimbursement && <div className="text-danger mt-1">{ifscError.reimbursement}</div>}
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="reimbursementBankName" className="mb-3">
                                    <Form.Label>Bank Name</Form.Label>
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
                                    <Form.Label>Branch  Name</Form.Label>
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
                                    <Form.Label>Bank Account Number</Form.Label>
                                    <Form.Control
                                        type="text" // Change to "text" to preserve leading zeroes
                                        name="reimbursementBankAccountNumber"
                                        value={employee.reimbursementBankAccountNumber}
                                        onChange={(e) => handleBankAccountNumberChange(e, 'reimbursement')}
                                        placeholder="Enter Bank Account Number"
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
                                        onBlur={() => handleIfscBlur('expense')}
                                        onChange={(e) => handleIfscChange(e, 'expense')}

                                        placeholder="Enter IFSC Code"
                                    />
                                    {ifscError.expense && <div className="text-danger mt-1">{ifscError.expense}</div>}
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
                                        onChange={(e) => handleBankAccountNumberChange(e, 'expense')}
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
        </div>
    );
};

export default EmployeeMasterInsert;