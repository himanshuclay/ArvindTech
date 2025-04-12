import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
// import Select from 'react-select';
import { toast } from 'react-toastify';
import Flatpickr from 'react-flatpickr';

interface BTS_PAYMENT {
    id: number,
    tenderID: string,
    clientID: string,
    client_JVName: string,
    contractType: string,
    executionModel: string,
    workName: string,
    country: string,
    state: string,
    projectID: string,
    projectName: string,
    workStartDate: string,
    contractualCompletionDate: string,
    projectCoordinatorEmpID: string,
    projectCoordinatorName: string,
    projectCoordinatorNumber: string,
    projectInchargeEmpID: string,
    projectInchargeName: string,
    projectInchargeNumber: string,
    projectInchargeEmpID2: string,
    projectInchargeName2: string,
    projectInchargeNumber2: string,
    decisionToMobilize: string,
    expectedMobilizationDate: string,
    expectedDateofKickofMeeting: string,
    keyMobTeamDeployedTeam1: string,
    keyMobTeamDeployedTeam1Date: string,
    keyMobTeamDeployedTeam2: string,
    keyMobTeamDeployedTeam2Date: string,
    constructionProgramSubmitted: string,
    constructionProgramSubmittedDate: string,
    layoutPlanFinalized: string,
    campConstructionCompleted: string,
    electricalPlanFinalized: string,
    electricalPlanFinalizationDate: string,
    topographicReportShared: string,
    alignmentReportShared: string,
    hindranceListReviewed: string,
    bankAccountOpened: string,
    guestHouseFinalized: string,
    labCommissioned: string,
    labCommissioningDate: string,
    campLandFinalized: string,
    createdDate: string,
    createdBy: string,
    updatedDate: string,
    updatedBy: string,
}

interface ProjectList {
    id: string;
    BillEntryDate: string
}
interface Status {
    id: string;
    name: string
}
interface EmployeeList {
    empId: string;
    employeeName: string
}

const MobilizationMasterAddEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [empName, setEmpName] = useState<string | null>('')
    const [, setProjectList] = useState<ProjectList[]>([])
    const [, setStatusList] = useState<Status[]>([])
    const [, setEmployeeList] = useState<EmployeeList[]>([])
    const [messes, setMesses] = useState<BTS_PAYMENT>({
        id: 0,
        tenderID: '',
        clientID: '',
        client_JVName: '',
        contractType: '',
        executionModel: '',
        workName: '',
        country: '',
        state: '',
        projectID: '',
        projectName: '',
        workStartDate: '',
        contractualCompletionDate: '',
        projectCoordinatorEmpID: '',
        projectCoordinatorName: '',
        projectCoordinatorNumber: '',
        projectInchargeEmpID: '',
        projectInchargeName: '',
        projectInchargeNumber: '',
        projectInchargeEmpID2: '',
        projectInchargeName2: '',
        projectInchargeNumber2: '',
        decisionToMobilize: '',
        expectedMobilizationDate: '',
        expectedDateofKickofMeeting: '',
        keyMobTeamDeployedTeam1: '',
        keyMobTeamDeployedTeam1Date: '',
        keyMobTeamDeployedTeam2: '',
        keyMobTeamDeployedTeam2Date: '',
        constructionProgramSubmitted: '',
        constructionProgramSubmittedDate: '',
        layoutPlanFinalized: '',
        campConstructionCompleted: '',
        electricalPlanFinalized: '',
        electricalPlanFinalizationDate: '',
        topographicReportShared: '',
        alignmentReportShared: '',
        hindranceListReviewed: '',
        bankAccountOpened: '',
        guestHouseFinalized: '',
        labCommissioned: '',
        labCommissioningDate: '',
        campLandFinalized: '',
        createdDate: '',
        createdBy: '',
        updatedDate: '',
        updatedBy: '',
    }
    );

    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        toast.dismiss();

        const storedEmpName = localStorage.getItem('EmpName');
        const storedEmpID = localStorage.getItem('EmpId');
        if (storedEmpName || storedEmpID) {
            setEmpName(`${storedEmpName} - ${storedEmpID}`);
        }
    }, []);



    useEffect(() => {
        if (id) {
            setEditMode(true);
            fetchDoerById(id);
        } else {
            setEditMode(false);
        }
    }, [id]);

    const fetchDoerById = async (id: string) => {
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION1}/MobilizationMaster/GetMobilization/${id}`);
            console.log('response', response)
            if (response.data.isSuccess) {
                const fetchedModule = response.data.mobilizationMasters[0];
                setMesses(fetchedModule);
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
        fetchData('CommonDropdown/GetProjectList', setProjectList, 'projectListResponses');
        fetchData('CommonDropdown/GetStatus', setStatusList, 'statusListResponses');
        fetchData('CommonDropdown/GetEmployeeListWithId', setEmployeeList, 'employeeLists');
    }, []);



    const validateFields = (): boolean => {
        const errors: { [key: string]: string } = {};


        if (!messes.tenderID) { errors.tenderID = 'Tender ID is required' }
        if (!messes.clientID) { errors.clientID = 'Client ID is required' }
        if (!messes.client_JVName) { errors.client_JVName = 'Client JV Name is required' }
        if (!messes.contractType) { errors.contractType = 'Contract Type is required' }
        if (!messes.executionModel) { errors.executionModel = 'Execution Model is required' }
        if (!messes.workName) { errors.workName = 'Work Name is required' }
        if (!messes.country) { errors.country = 'Country is required' }
        if (!messes.state) { errors.state = 'State is required' }
        if (!messes.projectID) { errors.projectID = 'Project ID is required' }
        if (!messes.projectName) { errors.projectName = 'Project Name is required' }
        if (!messes.workStartDate) { errors.workStartDate = 'Work Start Date is required' }
        if (!messes.contractualCompletionDate) { errors.contractualCompletionDate = 'Contractual Completion Date is required' }
        if (!messes.projectCoordinatorEmpID) { errors.projectCoordinatorEmpID = 'Project Coordinator Emp ID is required' }
        if (!messes.projectCoordinatorName) { errors.projectCoordinatorName = 'Project Coordinator Name is required' }
        if (!messes.projectCoordinatorNumber) { errors.projectCoordinatorNumber = 'Project Coordinator Number is required' }
        if (!messes.projectInchargeEmpID) { errors.projectInchargeEmpID = 'Project Incharge Emp ID is required' }
        if (!messes.projectInchargeName) { errors.projectInchargeName = 'Project Incharge Name is required' }
        if (!messes.projectInchargeNumber) { errors.projectInchargeNumber = 'Project Incharge Number is required' }
        if (!messes.projectInchargeEmpID2) { errors.projectInchargeEmpID2 = 'Project Incharge EmpID2 is required' }
        if (!messes.projectInchargeName2) { errors.projectInchargeName2 = 'Project Incharge Name2 is required' }
        if (!messes.projectInchargeNumber2) { errors.projectInchargeNumber2 = 'Project Incharge Number2 is required' }
        if (!messes.decisionToMobilize) { errors.decisionToMobilize = 'Decision To Mobilize is required' }
        if (!messes.expectedMobilizationDate) { errors.expectedMobilizationDate = 'Expected Mobilization Date is required' }
        if (!messes.expectedDateofKickofMeeting) { errors.expectedDateofKickofMeeting = 'Expected Dateof Kickof Meeting is required' }
        if (!messes.keyMobTeamDeployedTeam1) { errors.keyMobTeamDeployedTeam1 = 'Key Mob Team Deployed Team1 is required' }
        if (!messes.keyMobTeamDeployedTeam1Date) { errors.keyMobTeamDeployedTeam1Date = 'Key Mob Team Deployed Team1 Date is required' }
        if (!messes.keyMobTeamDeployedTeam2) { errors.keyMobTeamDeployedTeam2 = 'Key Mob Team Deployed Team2 is required' }
        if (!messes.keyMobTeamDeployedTeam2Date) { errors.keyMobTeamDeployedTeam2Date = 'Key Mob Team Deployed Team2 Date is required' }
        if (!messes.constructionProgramSubmitted) { errors.constructionProgramSubmitted = 'Construction Program Submitted is required' }
        if (!messes.constructionProgramSubmittedDate) { errors.constructionProgramSubmittedDate = 'Construction Program Submitted Date is required' }
        if (!messes.layoutPlanFinalized) { errors.layoutPlanFinalized = 'Layout Plan Finalized is required' }
        if (!messes.campConstructionCompleted) { errors.campConstructionCompleted = 'Camp Construction Completed is required' }
        if (!messes.electricalPlanFinalized) { errors.electricalPlanFinalized = 'Electrical Plan Finalized is required' }
        if (!messes.electricalPlanFinalizationDate) { errors.electricalPlanFinalizationDate = 'Electrical Plan Finalization Date is required' }
        if (!messes.topographicReportShared) { errors.topographicReportShared = 'Topographic Report Shared is required' }
        if (!messes.alignmentReportShared) { errors.alignmentReportShared = 'Alignment Report Shared is required' }
        if (!messes.hindranceListReviewed) { errors.hindranceListReviewed = 'Hindrance List Reviewed is required' }
        if (!messes.bankAccountOpened) { errors.bankAccountOpened = 'Bank Account Opened is required' }
        if (!messes.guestHouseFinalized) { errors.guestHouseFinalized = 'Guest House Finalized is required' }
        if (!messes.labCommissioned) { errors.labCommissioned = 'Lab Commissioned is required' }
        if (!messes.labCommissioningDate) { errors.labCommissioningDate = 'Lab Commissioning Date is required' }
        if (!messes.campLandFinalized) { errors.campLandFinalized = 'Camp Land Finalized is required' }
       








        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };


    const handleChange = (e: ChangeEvent<any> | null, name?: string, value?: any) => {
        const validateMobileNumber = (fieldName: string, fieldValue: string) => {
            const errors: { [key: string]: string } = {};
            if (!/^\d{0,10}$/.test(fieldValue)) {
                return false;
            }

            setMesses((prevData) => ({
                ...prevData,
                [fieldName]: fieldValue,
            }));

            if (fieldValue.length === 10) {
                if (!/^[6-9]/.test(fieldValue)) {
                    errors.no = "Mobile number should start with a digit between 6 and 9.";
                    return false;
                }
            } else {
                errors.no = "Mobile number should be 10 digits only"
                setValidationErrors(errors);
                return false;
            }
            return true;
        };
        if (e) {
            const { name: eventName, type } = e.target;
            if (type === 'checkbox') {
                const checked = (e.target as HTMLInputElement).checked;
                setMesses((prevData) => ({
                    ...prevData,
                    [eventName]: checked,
                }));
            } else {
                const inputValue = (e.target as HTMLInputElement | HTMLSelectElement).value;
                if (eventName === "mobileNumber") {
                    validateMobileNumber(eventName, inputValue);
                } else {
                    setMesses((prevData) => {
                        const updatedData = { ...prevData, [eventName]: inputValue };
                        return updatedData;
                    });
                }
            }
        }

    };




    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(messes)
        if (!validateFields()) {
            toast.dismiss()
            toast.error('Please fill in all required fields.');
            return;
        }




       
        const payload = {
            ...messes,
            createdDate: new Date(),
            createdBy: editMode ? messes.createdBy : empName,
            updatedBy: editMode ? empName : '',
            updatedDate: new Date(),
        };
        try {
            if (editMode) {
                await axios.put(`${config.API_URL_APPLICATION1}/MobilizationMaster/UpdateMobilization/${id}`, payload);
                navigate('/pages/MobilizationMaster', {
                    state: {
                        successMessage: "Challan Master Updated successfully!",
                    }
                });
            } else {
                await axios.post(`${config.API_URL_APPLICATION1}/MobilizationMaster/CreateMobilization`, payload);
                navigate('/pages/MobilizationMaster', {
                    state: {
                        successMessage: "Challan Master Added successfully!",
                    }
                });
            }
        } catch (error: any) {
            toast.error(error || 'Error Adding/Updating');
        }

    };
    const handleDateChange = (fieldName: string, selectedDates: Date[]) => {
        if (selectedDates.length > 0) {
            setMesses((prevData) => ({
                ...prevData,
                [fieldName]: selectedDates[0].toISOString().split("T")[0], // ✅ Store as YYYY-MM-DD
            }));
        }
    };
 const dateOptions = {
        enableTime: false,
        dateFormat: 'Y-m-d',
    }
    return (
        <div>
            <div className="container">
                <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center fs-20 rounded-3 border">
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit Mobilization Master' : 'Add Mobilization Master'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>

                            <Col lg={6}>
                                <Form.Group controlId="tenderID" className="mb-3">
                                    <Form.Label>Tender ID*</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="tenderID"
                                        value={messes.tenderID}
                                        onChange={handleChange}
                                        placeholder='Enter Tender ID'
                                        disabled={editMode}
                                        className={validationErrors.tenderID ? " input-border" : "  "}
                                    />
                                    {validationErrors.tenderID && (
                                        <small className="text-danger">{validationErrors.tenderID}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="clientID" className="mb-3">
                                    <Form.Label>Client ID*</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="clientID"
                                        value={messes.clientID}
                                        onChange={handleChange}
                                        placeholder='Enter Client ID'
                                        disabled={editMode}
                                        className={validationErrors.clientID ? " input-border" : "  "}
                                    />
                                    {validationErrors.clientID && (
                                        <small className="text-danger">{validationErrors.clientID}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="client_JVName" className="mb-3">
                                    <Form.Label>Client JV Name*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="client_JVName"
                                        value={messes.client_JVName}
                                        onChange={handleChange}
                                        placeholder='Enter Client JV Name'
                                        className={validationErrors.client_JVName ? " input-border" : "  "}
                                    />
                                    {validationErrors.client_JVName && (
                                        <small className="text-danger">{validationErrors.client_JVName}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="contractType" className="mb-3">
                                    <Form.Label>Contract Type*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="contractType"
                                        value={messes.contractType}
                                        onChange={handleChange}
                                        placeholder='Enter Contract Type'
                                        className={validationErrors.contractType ? " input-border" : "  "}
                                    />
                                    {validationErrors.contractType && (
                                        <small className="text-danger">{validationErrors.contractType}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="executionModel" className="mb-3">
                                    <Form.Label>Execution Model*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="executionModel"
                                        value={messes.executionModel} 
                                        placeholder='Enter Execution Model'
                                        onChange={handleChange}
                                        className={validationErrors.executionModel ? "input-border" : ""}
                                    />

                                    {validationErrors.executionModel && (
                                        <small className="text-danger">{validationErrors.executionModel}</small>
                                    )}
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="workName" className="mb-3">
                                    <Form.Label>Work Name*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="workName"
                                        value={messes.workName}
                                        onChange={handleChange}
                                        placeholder='Enter Work Name'
                                        className={validationErrors.workName ? " input-border" : "  "}
                                    />
                                    {validationErrors.workName && (
                                        <small className="text-danger">{validationErrors.workName}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="country" className="mb-3">
                                    <Form.Label>Country*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="country"
                                        value={messes.country}
                                        onChange={handleChange}
                                        placeholder='Enter Country'
                                        className={validationErrors.country ? " input-border" : "  "}
                                    />
                                    {validationErrors.country && (
                                        <small className="text-danger">{validationErrors.country}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="state" className="mb-3">
                                    <Form.Label>State*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="state"
                                        value={messes.state}
                                        onChange={handleChange}
                                        placeholder='Enter State'
                                        className={validationErrors.state ? " input-border" : "  "}
                                    />
                                    {validationErrors.state && (
                                        <small className="text-danger">{validationErrors.state}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="projectID" className="mb-3">
                                    <Form.Label>Project ID*</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="projectID"
                                        value={messes.projectID}
                                        onChange={handleChange}
                                        placeholder='Enter Project ID'
                                        className={validationErrors.projectID ? " input-border" : "  "}
                                    />
                                    {validationErrors.projectID && (
                                        <small className="text-danger">{validationErrors.projectID}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="projectName" className="mb-3">
                                    <Form.Label>Project Name*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="projectName"
                                        value={messes.projectName}
                                        onChange={handleChange}
                                        placeholder='Enter Project Name'
                                        className={validationErrors.projectName ? " input-border" : "  "}
                                    />
                                    {validationErrors.projectName && (
                                        <small className="text-danger">{validationErrors.projectName}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="workStartDate" className="mb-3">
                                    <Form.Label>Work Start Date*</Form.Label>
                                    <Flatpickr
                                        type="date"
                                        name="workStartDate"
                                        value={messes.workStartDate}
                                        onChange={(selectedDates) => handleDateChange("workStartDate", selectedDates)}
                                        options={dateOptions}
                                        placeholder='Enter Work Start Date'
                                        className={validationErrors.workStartDate ? "form-control input-border" : "form-control"}
                                    />
                                    {validationErrors.workStartDate && (
                                        <small className="text-danger">{validationErrors.workStartDate}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="contractualCompletionDate" className="mb-3">
                                    <Form.Label>Contractual Completion Date*</Form.Label>
                                    <Flatpickr
                                        type="text"
                                        name="contractualCompletionDate"
                                        value={messes.contractualCompletionDate}
                                        onChange={(selectedDates) => handleDateChange("contractualCompletionDate", selectedDates)}
                                        options={dateOptions}
                                        placeholder='Enter Contractual Completion Date'
                                        className={validationErrors.contractualCompletionDate ?"form-control input-border" : "form-control"}
                                    />
                                    {validationErrors.contractualCompletionDate && (
                                        <small className="text-danger">{validationErrors.contractualCompletionDate}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="projectCoordinatorEmpID" className="mb-3">
                                    <Form.Label>Project Coordinator EmpID*</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="projectCoordinatorEmpID"
                                        value={messes.projectCoordinatorEmpID}
                                        onChange={handleChange}
                                        placeholder='Enter Project Coordinator EmpID'
                                        className={validationErrors.projectCoordinatorEmpID ? " input-border" : "  "}
                                    />
                                    {validationErrors.projectCoordinatorEmpID && (
                                        <small className="text-danger">{validationErrors.projectCoordinatorEmpID}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="projectCoordinatorName" className="mb-3">
                                    <Form.Label>Project Coordinator Name*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="projectCoordinatorName"
                                        value={messes.projectCoordinatorName}
                                        onChange={handleChange}
                                        placeholder='Enter Project Coordinator Name'
                                        className={validationErrors.projectCoordinatorName ? " input-border" : "  "}
                                    />
                                    {validationErrors.projectCoordinatorName && (
                                        <small className="text-danger">{validationErrors.projectCoordinatorName}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="projectCoordinatorNumber" className="mb-3">
                                    <Form.Label>Project Coordinator Number*</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="projectCoordinatorNumber"
                                        value={messes.projectCoordinatorNumber}
                                        onChange={handleChange}
                                        placeholder='Enter Project Coordinator Number'
                                        className={validationErrors.projectCoordinatorNumber ? " input-border" : "  "}
                                    />
                                    {validationErrors.projectCoordinatorNumber && (
                                        <small className="text-danger">{validationErrors.projectCoordinatorNumber}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="projectInchargeEmpID" className="mb-3">
                                    <Form.Label>Project Incharge EmpID*</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="projectInchargeEmpID"
                                        value={messes.projectInchargeEmpID}
                                        onChange={handleChange}
                                        placeholder='Enter Project Incharge EmpID'
                                        className={validationErrors.projectInchargeEmpID ? " input-border" : "  "}
                                    />
                                    {validationErrors.projectInchargeEmpID && (
                                        <small className="text-danger">{validationErrors.projectInchargeEmpID}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="projectInchargeName" className="mb-3">
                                    <Form.Label>Project Incharge Name*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="projectInchargeName"
                                        value={messes.projectInchargeName}
                                        onChange={handleChange}
                                        placeholder='Enter Project Incharge Name'
                                        className={validationErrors.projectInchargeName ? " input-border" : "  "}
                                    />
                                    {validationErrors.projectInchargeName && (
                                        <small className="text-danger">{validationErrors.projectInchargeName}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="projectInchargeNumber" className="mb-3">
                                    <Form.Label>Project Incharge Number*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="projectInchargeNumber"
                                        value={messes.projectInchargeNumber}
                                        onChange={handleChange}
                                        placeholder='Enter Project Incharge Number'
                                        className={validationErrors.projectInchargeNumber ? " input-border" : "  "}
                                    />
                                    {validationErrors.projectInchargeNumber && (
                                        <small className="text-danger">{validationErrors.projectInchargeNumber}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="projectInchargeEmpID2" className="mb-3">
                                    <Form.Label>Project Incharge EmpID2*</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="projectInchargeEmpID2"
                                        value={messes.projectInchargeEmpID2}
                                        onChange={handleChange}
                                        placeholder='Enter Project Incharge EmpID2'
                                        className={validationErrors.projectInchargeEmpID2 ? " input-border" : "  "}
                                    />
                                    {validationErrors.projectInchargeEmpID2 && (
                                        <small className="text-danger">{validationErrors.projectInchargeEmpID2}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="projectInchargeName2" className="mb-3">
                                    <Form.Label>Project Incharge Name2*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="projectInchargeName2"
                                        value={messes.projectInchargeName2}
                                        onChange={handleChange}
                                        placeholder='Enter Project Incharge Name2'
                                        className={validationErrors.projectInchargeName2 ? " input-border" : "  "}
                                    />
                                    {validationErrors.projectInchargeName2 && (
                                        <small className="text-danger">{validationErrors.projectInchargeName2}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="projectInchargeNumber2" className="mb-3">
                                    <Form.Label>Project Incharge Number2*</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="projectInchargeNumber2"
                                        value={messes.projectInchargeNumber2}
                                        onChange={handleChange}
                                        placeholder='Enter Project Incharge Number2'
                                        className={validationErrors.projectInchargeNumber2 ? " input-border" : "  "}
                                    />
                                    {validationErrors.projectInchargeNumber2 && (
                                        <small className="text-danger">{validationErrors.projectInchargeNumber2}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="decisionToMobilize" className="mb-3">
                                    <Form.Label>Decision To Mobilize*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="decisionToMobilize"
                                        value={messes.decisionToMobilize}
                                        onChange={handleChange}
                                        placeholder='Enter Decision To Mobilize'
                                        className={validationErrors.decisionToMobilize ? " input-border" : "  "}
                                    />
                                    {validationErrors.decisionToMobilize && (
                                        <small className="text-danger">{validationErrors.decisionToMobilize}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="expectedMobilizationDate" className="mb-3">
                                    <Form.Label>Expected Mobilization Date*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="expectedMobilizationDate"
                                        value={messes.expectedMobilizationDate}
                                        onChange={handleChange}
                                        placeholder='Enter Expected Mobilization Date'
                                        className={validationErrors.expectedMobilizationDate ? " input-border" : "  "}
                                    />
                                    {validationErrors.expectedMobilizationDate && (
                                        <small className="text-danger">{validationErrors.expectedMobilizationDate}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="expectedDateofKickofMeeting" className="mb-3">
                                    <Form.Label>Expected Dateof Kickof Meeting*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="expectedDateofKickofMeeting"
                                        value={messes.expectedDateofKickofMeeting}
                                        onChange={handleChange}
                                        placeholder='Enter Expected Dateof Kickof Meeting'
                                        className={validationErrors.expectedDateofKickofMeeting ? " input-border" : "  "}
                                    />
                                    {validationErrors.expectedDateofKickofMeeting && (
                                        <small className="text-danger">{validationErrors.expectedDateofKickofMeeting}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="keyMobTeamDeployedTeam1" className="mb-3">
                                    <Form.Label>Key Mob Team Deployed Team1*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="keyMobTeamDeployedTeam1"
                                        value={messes.keyMobTeamDeployedTeam1}
                                        onChange={handleChange}
                                        placeholder='Enter Key Mob Team Deployed Team1'
                                        className={validationErrors.keyMobTeamDeployedTeam1 ? " input-border" : "  "}
                                    />
                                    {validationErrors.keyMobTeamDeployedTeam1 && (
                                        <small className="text-danger">{validationErrors.keyMobTeamDeployedTeam1}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="keyMobTeamDeployedTeam1Date" className="mb-3">
                                    <Form.Label>Key Mob Team Deployed Team1 Date*</Form.Label>
                                    <Flatpickr
                                        type="date"
                                        name="keyMobTeamDeployedTeam1Date"
                                        value={messes.keyMobTeamDeployedTeam1Date}
                                        onChange={(selectedDates) => handleDateChange("keyMobTeamDeployedTeam1Date", selectedDates)}
                                        options={dateOptions}
                                        placeholder='Enter Key Mob Team Deployed Team1 Date'
                                        className={validationErrors.keyMobTeamDeployedTeam1Date ? "form-control input-border" : "form-control"}
                                    />
                                    {validationErrors.keyMobTeamDeployedTeam1Date && (
                                        <small className="text-danger">{validationErrors.keyMobTeamDeployedTeam1Date}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="keyMobTeamDeployedTeam2" className="mb-3">
                                    <Form.Label>Key Mob Team Deployed Team2*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="keyMobTeamDeployedTeam2"
                                        value={messes.keyMobTeamDeployedTeam2}
                                        onChange={handleChange}
                                        placeholder='Enter Key Mob Team Deployed Team2'
                                        className={validationErrors.keyMobTeamDeployedTeam2 ? " input-border" : "  "}
                                    />
                                    {validationErrors.keyMobTeamDeployedTeam2 && (
                                        <small className="text-danger">{validationErrors.keyMobTeamDeployedTeam2}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="keyMobTeamDeployedTeam2Date" className="mb-3">
                                    <Form.Label>Key Mob Team Deployed Team2 Date*</Form.Label>
                                    <Flatpickr
                                        type="text"
                                        name="keyMobTeamDeployedTeam2Date"
                                        value={messes.keyMobTeamDeployedTeam2Date}
                                        onChange={(selectedDates) => handleDateChange("keyMobTeamDeployedTeam2Date", selectedDates)}
                                        options={dateOptions}
                                        placeholder='Enter Key Mob Team Deployed Team2 Date'
                                        className={validationErrors.keyMobTeamDeployedTeam2Date ?"form-control input-border" : "form-control"}
                                    />
                                    {validationErrors.keyMobTeamDeployedTeam2Date && (
                                        <small className="text-danger">{validationErrors.keyMobTeamDeployedTeam2Date}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="constructionProgramSubmitted" className="mb-3">
                                    <Form.Label>Construction Program Submitted*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="constructionProgramSubmitted"
                                        value={messes.constructionProgramSubmitted}
                                        onChange={handleChange}
                                        placeholder='Enter Construction Program Submitted'
                                        className={validationErrors.constructionProgramSubmitted ? " input-border" : "  "}
                                    />
                                    {validationErrors.constructionProgramSubmitted && (
                                        <small className="text-danger">{validationErrors.constructionProgramSubmitted}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="constructionProgramSubmittedDate" className="mb-3">
                                    <Form.Label>Construction Program Submitted Date*</Form.Label>
                                    <Flatpickr
                                        type="date"
                                        name="constructionProgramSubmittedDate"
                                        value={messes.constructionProgramSubmittedDate}
                                        onChange={(selectedDates) => handleDateChange("constructionProgramSubmittedDate", selectedDates)}
                                        options={dateOptions}
                                        placeholder='Enter Construction Program Submitted Date'
                                        className={validationErrors.constructionProgramSubmittedDate ? "form-control input-border" : "form-control"}
                                    />
                                    {validationErrors.constructionProgramSubmittedDate && (
                                        <small className="text-danger">{validationErrors.constructionProgramSubmittedDate}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="layoutPlanFinalized" className="mb-3">
                                    <Form.Label>Layout Plan Finalized*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="layoutPlanFinalized"
                                        value={messes.layoutPlanFinalized}
                                        onChange={handleChange}
                                        placeholder='Enter Layout Plan Finalized'
                                        className={validationErrors.layoutPlanFinalized ? " input-border" : "  "}
                                    />
                                    {validationErrors.layoutPlanFinalized && (
                                        <small className="text-danger">{validationErrors.layoutPlanFinalized}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="campConstructionCompleted" className="mb-3">
                                    <Form.Label>Camp Construction Completed*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="campConstructionCompleted"
                                        value={messes.campConstructionCompleted}
                                        onChange={handleChange}
                                        placeholder='Enter Camp Construction Completed'
                                        className={validationErrors.campConstructionCompleted ? " input-border" : "  "}
                                    />
                                    {validationErrors.campConstructionCompleted && (
                                        <small className="text-danger">{validationErrors.campConstructionCompleted}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="electricalPlanFinalized" className="mb-3">
                                    <Form.Label>Electrical Plan Finalized*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="electricalPlanFinalized"
                                        value={messes.electricalPlanFinalized}
                                        onChange={handleChange}
                                        placeholder='Enter Electrical Plan Finalized'
                                        className={validationErrors.electricalPlanFinalized ? " input-border" : "  "}
                                    />
                                    {validationErrors.electricalPlanFinalized && (
                                        <small className="text-danger">{validationErrors.electricalPlanFinalized}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="electricalPlanFinalizationDate" className="mb-3">
                                    <Form.Label>Electrical Plan Finalization Date*</Form.Label>
                                    <Flatpickr
                                        type="date"
                                        name="electricalPlanFinalizationDate"
                                        value={messes.electricalPlanFinalizationDate}
                                        onChange={(selectedDates) => handleDateChange("electricalPlanFinalizationDate", selectedDates)}
                                        options={dateOptions}
                                        placeholder='Enter Electrical Plan Finalization Date'
                                        className={validationErrors.electricalPlanFinalizationDate ? "form-control input-border" : "form-control"}
                                    />
                                    {validationErrors.electricalPlanFinalizationDate && (
                                        <small className="text-danger">{validationErrors.electricalPlanFinalizationDate}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="topographicReportShared" className="mb-3">
                                    <Form.Label>Topographic Report Shared*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="topographicReportShared"
                                        value={messes.topographicReportShared}
                                        onChange={handleChange}
                                        placeholder='Enter Topographic Report Shared'
                                        className={validationErrors.topographicReportShared ? " input-border" : "  "}
                                    />
                                    {validationErrors.topographicReportShared && (
                                        <small className="text-danger">{validationErrors.topographicReportShared}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="alignmentReportShared" className="mb-3">
                                    <Form.Label>Alignment Report Shared*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="alignmentReportShared"
                                        value={messes.alignmentReportShared}
                                        onChange={handleChange}
                                        placeholder='Enter Alignment Report Shared'
                                        className={validationErrors.alignmentReportShared ? " input-border" : "  "}
                                    />
                                    {validationErrors.alignmentReportShared && (
                                        <small className="text-danger">{validationErrors.alignmentReportShared}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="hindranceListReviewed" className="mb-3">
                                    <Form.Label>Hindrance List Reviewed*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="hindranceListReviewed"
                                        value={messes.hindranceListReviewed}
                                        onChange={handleChange}
                                        placeholder='Enter Hindrance List Reviewed'
                                        className={validationErrors.hindranceListReviewed ? " input-border" : "  "}
                                    />
                                    {validationErrors.hindranceListReviewed && (
                                        <small className="text-danger">{validationErrors.hindranceListReviewed}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="bankAccountOpened" className="mb-3">
                                    <Form.Label>Bank Account Opened*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="bankAccountOpened"
                                        value={messes.bankAccountOpened}
                                        onChange={handleChange}
                                        placeholder='Enter Bank Account Opened'
                                        className={validationErrors.bankAccountOpened ? " input-border" : "  "}
                                    />
                                    {validationErrors.bankAccountOpened && (
                                        <small className="text-danger">{validationErrors.bankAccountOpened}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="guestHouseFinalized" className="mb-3">
                                    <Form.Label>Guest House Finalized*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="guestHouseFinalized"
                                        value={messes.guestHouseFinalized}
                                        onChange={handleChange}
                                        placeholder='Enter Guest House Finalized'
                                        className={validationErrors.guestHouseFinalized ? " input-border" : "  "}
                                    />
                                    {validationErrors.guestHouseFinalized && (
                                        <small className="text-danger">{validationErrors.guestHouseFinalized}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="labCommissioned" className="mb-3">
                                    <Form.Label>Lab Commissioned*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="labCommissioned"
                                        value={messes.labCommissioned}
                                        onChange={handleChange}
                                        placeholder='Enter Lab Commissioned'
                                        className={validationErrors.labCommissioned ? " input-border" : "  "}
                                    />
                                    {validationErrors.labCommissioned && (
                                        <small className="text-danger">{validationErrors.labCommissioned}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="labCommissioningDate" className="mb-3">
                                    <Form.Label>Lab Commissioning Date*</Form.Label>
                                    <Flatpickr
                                        type="date"
                                        name="labCommissioningDate"
                                        value={messes.labCommissioningDate}
                                        onChange={(selectedDates) => handleDateChange("labCommissioningDate", selectedDates)}
                                        options={dateOptions}
                                        placeholder='Enter Lab Commissioning Date'
                                        className={validationErrors.labCommissioningDate ? "form-control input-border" : "form-control"}
                                    />
                                    {validationErrors.labCommissioningDate && (
                                        <small className="text-danger">{validationErrors.labCommissioningDate}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="campLandFinalized" className="mb-3">
                                    <Form.Label>Camp Land Finalized*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="campLandFinalized"
                                        value={messes.campLandFinalized}
                                        onChange={handleChange}
                                        placeholder='Enter Camp Land Finalized'
                                        className={validationErrors.campLandFinalized ? " input-border" : "  "}
                                    />
                                    {validationErrors.campLandFinalized && (
                                        <small className="text-danger">{validationErrors.campLandFinalized}</small>
                                    )}
                                </Form.Group>
                            </Col>






                            <Col className='align-items-end d-flex justify-content-between mb-3'>
                                <div>
                                    <span className='fs-5 '>This field is required*</span>
                                </div>
                                <div>
                                    <Link to={'/pages/MobilizationMaster'}>
                                        <Button variant="primary" >
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update Mobilization' : 'Add Mobilization'}
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

export default MobilizationMasterAddEdit;