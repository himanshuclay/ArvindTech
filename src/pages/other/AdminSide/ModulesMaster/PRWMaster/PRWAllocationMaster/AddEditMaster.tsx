import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
// import Select from 'react-select';
import { toast } from 'react-toastify';


interface BTS_PAYMENT {
    id: number,
    reqID: string,
    initiationDate: string,
    projectID: string,
    projectName: string,
    activitestobeperfomed: string,
    typeofContractor: string,
    typeofWork: string,
    noofManpower: string,
    requiredDate: string,
    remarks: string,
    source_RP_PRW_LBR_Adhoc: string,
    contractorID: string,
    contractorName: string,
    fullNameoffirmoftheContractor: string,
    contractorContactNumber: string,
    contractorAlternateContactNumber: string,
    monthlyturnoveramount_InLakhs: string,
    uploadCopyofGSTReturn: string,
    prwCoordinator: string,
    dateofConcallwithManagerSub_contractor_HO: string,
    confirmationofPRW_Manager_Subcontract_HO: string,
    reasonforNotSuitable: string,
    dateofConcallwithProject_Incharge: string,
    uploadPreviousworkorderofthecontractor: string,
    remarksafterConcallwithProject_Incharge: string,
    reasonofNotSuitable: string,
    dateofsitevisit: string,
    confirmationofSitevisited: string,
    contractorInterestedinWorking: string,
    travelarrangementDeploymentTransportation: string,
    dateofWorkorder: string,
    dateofDeployment: string,
    woNumber: string,
    woRate_Text: string,
    woDate: string,
    vendorID: string,
    finalizationofworkorderforPRWcontractor: string,
    confirmationDeploymentofPRWatProject: string,
    doyouwishtoclosethisRequestid: string,
    lastestUpdatedate: string,
    reviewdecisionofrejectionofPRWcontractor: string,
    selectReasonforRejection: string,
    status: string,
    createdBy: string,
    createdDate: string,
    updatedBy: string,
    updatedDate: string,
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

const PRWAllocationMasterAddEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [empName, setEmpName] = useState<string | null>('')
    const [, setProjectList] = useState<ProjectList[]>([])
    const [, setStatusList] = useState<Status[]>([])
    const [, setEmployeeList] = useState<EmployeeList[]>([])
    const [messes, setMesses] = useState<BTS_PAYMENT>({
        id: 0,
        reqID: '',
        initiationDate: '',
        projectID: '',
        projectName: '',
        activitestobeperfomed: '',
        typeofContractor: '',
        typeofWork: '',
        noofManpower: '',
        requiredDate: '',
        remarks: '',
        source_RP_PRW_LBR_Adhoc: '',
        contractorID: '',
        contractorName: '',
        fullNameoffirmoftheContractor: '',
        contractorContactNumber: '',
        contractorAlternateContactNumber: '',
        monthlyturnoveramount_InLakhs: '',
        uploadCopyofGSTReturn: '',
        prwCoordinator: '',
        dateofConcallwithManagerSub_contractor_HO: '',
        confirmationofPRW_Manager_Subcontract_HO: '',
        reasonforNotSuitable: '',
        dateofConcallwithProject_Incharge: '',
        uploadPreviousworkorderofthecontractor: '',
        remarksafterConcallwithProject_Incharge: '',
        reasonofNotSuitable: '',
        dateofsitevisit: '',
        confirmationofSitevisited: '',
        contractorInterestedinWorking: '',
        travelarrangementDeploymentTransportation: '',
        dateofWorkorder: '',
        dateofDeployment: '',
        woNumber: '',
        woRate_Text: '',
        woDate: '',
        vendorID: '',
        finalizationofworkorderforPRWcontractor: '',
        confirmationDeploymentofPRWatProject: '',
        doyouwishtoclosethisRequestid: '',
        lastestUpdatedate: '',
        reviewdecisionofrejectionofPRWcontractor: '',
        selectReasonforRejection: '',
        status: '',
        createdBy: '',
        createdDate: '',
        updatedBy: '',
        updatedDate: '',
    }
    );

    const [isMobileVerified, setIsMobileVerified] = useState(false);
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
            const response = await axios.get(`${config.API_URL_APPLICATION1}/PRWAllocationMaster/GetPRWAllocation/${id}`);
            console.log('response', response)
            if (response.data.isSuccess) {
                const fetchedModule = response.data.prwAllocationMasters[0];
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

        if(!messes.reqID) { errors.reqID = 'reqID is required'}
        if(!messes.initiationDate) { errors.initiationDate = 'initiationDate is required'}
        if(!messes.projectID) { errors.projectID = 'projectID is required'}
        if(!messes.projectName) { errors.projectName = 'projectName is required'}
        if(!messes.activitestobeperfomed) { errors.activitestobeperfomed = 'activitestobeperfomed is required'}
        if(!messes.typeofContractor) { errors.typeofContractor = 'typeofContractor is required'}
        if(!messes.typeofWork) { errors.typeofWork = 'typeofWork is required'}
        if(!messes.noofManpower) { errors.noofManpower = 'noofManpower is required'}
        if(!messes.requiredDate) { errors.requiredDate = 'requiredDate is required'}
        if(!messes.remarks) { errors.remarks = 'remarks is required'}
        if(!messes.source_RP_PRW_LBR_Adhoc) { errors.source_RP_PRW_LBR_Adhoc = 'source_RP_PRW_LBR_Adhoc is required'}
        if(!messes.contractorID) { errors.contractorID = 'contractorID is required'}
        if(!messes.contractorName) { errors.contractorName = 'contractorName is required'}
        if(!messes.fullNameoffirmoftheContractor) { errors.fullNameoffirmoftheContractor = 'fullNameoffirmoftheContractor is required'}
        if(!messes.contractorContactNumber) { errors.contractorContactNumber = 'contractorContactNumber is required'}
        if(!messes.contractorAlternateContactNumber) { errors.contractorAlternateContactNumber = 'contractorAlternateContactNumber is required'}
        if(!messes.monthlyturnoveramount_InLakhs) { errors.monthlyturnoveramount_InLakhs = 'monthlyturnoveramount_InLakhs is required'}
        if(!messes.uploadCopyofGSTReturn) { errors.uploadCopyofGSTReturn = 'uploadCopyofGSTReturn is required'}
        if(!messes.prwCoordinator) { errors.prwCoordinator = 'prwCoordinator is required'}
        if(!messes.dateofConcallwithManagerSub_contractor_HO) { errors.dateofConcallwithManagerSub_contractor_HO = 'dateofConcallwithManagerSub_contractor_HO is required'}
        if(!messes.confirmationofPRW_Manager_Subcontract_HO) { errors.confirmationofPRW_Manager_Subcontract_HO = 'confirmationofPRW_Manager_Subcontract_HO is required'}
        if(!messes.reasonforNotSuitable) { errors.reasonforNotSuitable = 'reasonforNotSuitable is required'}
        if(!messes.dateofConcallwithProject_Incharge) { errors.dateofConcallwithProject_Incharge = 'dateofConcallwithProject_Incharge is required'}
        if(!messes.uploadPreviousworkorderofthecontractor) { errors.uploadPreviousworkorderofthecontractor = 'uploadPreviousworkorderofthecontractor is required'}
        if(!messes.remarksafterConcallwithProject_Incharge) { errors.remarksafterConcallwithProject_Incharge = 'remarksafterConcallwithProject_Incharge is required'}
        if(!messes.reasonofNotSuitable) { errors.reasonofNotSuitable = 'reasonofNotSuitable is required'}
        if(!messes.dateofsitevisit) { errors.dateofsitevisit = 'dateofsitevisit is required'}
        if(!messes.confirmationofSitevisited) { errors.confirmationofSitevisited = 'confirmationofSitevisited is required'}
        if(!messes.contractorInterestedinWorking) { errors.contractorInterestedinWorking = 'contractorInterestedinWorking is required'}
        if(!messes.travelarrangementDeploymentTransportation) { errors.travelarrangementDeploymentTransportation = 'travelarrangementDeploymentTransportation is required'}
        if(!messes.dateofWorkorder) { errors.dateofWorkorder = 'dateofWorkorder is required'}
        if(!messes.dateofDeployment) { errors.dateofDeployment = 'dateofDeployment is required'}
        if(!messes.woNumber) { errors.woNumber = 'woNumber is required'}
        if(!messes.woRate_Text) { errors.woRate_Text = 'woRate_Text is required'}
        if(!messes.woDate) { errors.woDate = 'woDate is required'}
        if(!messes.vendorID) { errors.vendorID = 'vendorID is required'}
        if(!messes.finalizationofworkorderforPRWcontractor) { errors.finalizationofworkorderforPRWcontractor = 'finalizationofworkorderforPRWcontractor is required'}
        if(!messes.confirmationDeploymentofPRWatProject) { errors.confirmationDeploymentofPRWatProject = 'confirmationDeploymentofPRWatProject is required'}
        if(!messes.doyouwishtoclosethisRequestid) { errors.doyouwishtoclosethisRequestid = 'doyouwishtoclosethisRequestid is required'}
        if(!messes.lastestUpdatedate) { errors.lastestUpdatedate = 'lastestUpdatedate is required'}
        if(!messes.reviewdecisionofrejectionofPRWcontractor) { errors.reviewdecisionofrejectionofPRWcontractor = 'reviewdecisionofrejectionofPRWcontractor is required'}
        if(!messes.selectReasonforRejection) { errors.selectReasonforRejection = 'selectReasonforRejection is required'}
        if(!messes.status) { errors.status = 'status is required'}
   









        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };


    const handleChange = (e: ChangeEvent<any> | null, name?: string, value?: any) => {
        const validateMobileNumber = (fieldName: string, fieldValue: string) => {
            if (!/^\d{0,10}$/.test(fieldValue)) {
                return false;
            }

            setMesses((prevData) => ({
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




        if (isMobileVerified) {
            toast.dismiss()
            toast.error("Please verify your mobile number before submitting the form.");
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
                await axios.put(`${config.API_URL_APPLICATION1}/PRWAllocationMaster/UpdatePRWAllocation/${id}`, payload);
                navigate('/pages/PRWAllocationMaster', {
                    state: {
                        successMessage: "Challan Master Updated successfully!",
                    }
                });
            } else {
                await axios.post(`${config.API_URL_APPLICATION1}/PRWAllocationMaster/CreatePRWAllocation`, payload);
                navigate('/pages/PRWAllocationMaster', {
                    state: {
                        successMessage: "Challan Master Added successfully!",
                    }
                });
            }
        } catch (error: any) {
            toast.error(error || 'Error Adding/Updating');
        }

    };
    return (
        <div>
            <div className="container">
                <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center fs-20 rounded-3 border">
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit PRWAllocation Master' : 'Add PRWAllocation Master'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>

                            <Col lg={6}>
                                <Form.Group controlId="reqID" className="mb-3">
                                    <Form.Label>reqID</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="reqID"
                                        value={messes.reqID}
                                        onChange={handleChange}
                                        placeholder='Enter reqID'
                                        disabled={editMode}
                                        className={validationErrors.reqID ? " input-border" : "  "}
                                    />
                                    {validationErrors.reqID && (
                                        <small className="text-danger">{validationErrors.reqID}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="initiationDate" className="mb-3">
                                    <Form.Label>initiationDate</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="initiationDate"
                                        value={messes.initiationDate}
                                        onChange={handleChange}
                                        placeholder='Enter initiationDate'
                                        disabled={editMode}
                                        className={validationErrors.initiationDate ? " input-border" : "  "}
                                    />
                                    {validationErrors.initiationDate && (
                                        <small className="text-danger">{validationErrors.initiationDate}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="projectID" className="mb-3">
                                    <Form.Label>projectID</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="projectID"
                                        value={messes.projectID}
                                        onChange={handleChange}
                                        placeholder='Enter projectID'
                                        disabled={editMode}
                                        className={validationErrors.projectID ? " input-border" : "  "}
                                    />
                                    {validationErrors.projectID && (
                                        <small className="text-danger">{validationErrors.projectID}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="projectName" className="mb-3">
                                    <Form.Label>projectName</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="projectName"
                                        value={messes.projectName}
                                        onChange={handleChange}
                                        placeholder='Enter projectName'
                                        disabled={editMode}
                                        className={validationErrors.projectName ? " input-border" : "  "}
                                    />
                                    {validationErrors.projectName && (
                                        <small className="text-danger">{validationErrors.projectName}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="activitestobeperfomed" className="mb-3">
                                    <Form.Label>activitestobeperfomed</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="activitestobeperfomed"
                                        value={messes.activitestobeperfomed}
                                        onChange={handleChange}
                                        placeholder='Enter Project ID'
                                        className={validationErrors.activitestobeperfomed ? " input-border" : "  "}
                                    />
                                    {validationErrors.activitestobeperfomed && (
                                        <small className="text-danger">{validationErrors.activitestobeperfomed}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="typeofContractor" className="mb-3">
                                    <Form.Label>typeofContractor</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="typeofContractor"
                                        value={messes.typeofContractor}
                                        onChange={handleChange}
                                        placeholder='Enter Project Name'
                                        className={validationErrors.typeofContractor ? " input-border" : "  "}
                                    />
                                    {validationErrors.typeofContractor && (
                                        <small className="text-danger">{validationErrors.typeofContractor}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="typeofWork" className="mb-3">
                                    <Form.Label>typeofWork</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="typeofWork"
                                        value={messes.typeofWork}
                                        onChange={handleChange}
                                        className={validationErrors.typeofWork ? "input-border" : ""}
                                    />

                                    {validationErrors.typeofWork && (
                                        <small className="text-danger">{validationErrors.typeofWork}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="noofManpower" className="mb-3">
                                    <Form.Label>noofManpower</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="noofManpower"
                                        value={messes.noofManpower}
                                        onChange={handleChange}
                                        className={validationErrors.noofManpower ? "input-border" : ""}
                                    />

                                    {validationErrors.noofManpower && (
                                        <small className="text-danger">{validationErrors.noofManpower}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="requiredDate" className="mb-3">
                                    <Form.Label>requiredDate</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="requiredDate"
                                        value={messes.requiredDate}
                                        onChange={handleChange}
                                        className={validationErrors.requiredDate ? "input-border" : ""}
                                    />

                                    {validationErrors.requiredDate && (
                                        <small className="text-danger">{validationErrors.requiredDate}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="remarks" className="mb-3">
                                    <Form.Label>remarks</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="remarks"
                                        value={messes.remarks}
                                        onChange={handleChange}
                                        className={validationErrors.remarks ? "input-border" : ""}
                                    />

                                    {validationErrors.remarks && (
                                        <small className="text-danger">{validationErrors.remarks}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="source_RP_PRW_LBR_Adhoc" className="mb-3">
                                    <Form.Label>source_RP_PRW_LBR_Adhoc</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="source_RP_PRW_LBR_Adhoc"
                                        value={messes.source_RP_PRW_LBR_Adhoc}
                                        onChange={handleChange}
                                        className={validationErrors.source_RP_PRW_LBR_Adhoc ? "input-border" : ""}
                                    />

                                    {validationErrors.source_RP_PRW_LBR_Adhoc && (
                                        <small className="text-danger">{validationErrors.source_RP_PRW_LBR_Adhoc}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="contractorID" className="mb-3">
                                    <Form.Label>contractorID</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="contractorID"
                                        value={messes.contractorID}
                                        onChange={handleChange}
                                        className={validationErrors.contractorID ? "input-border" : ""}
                                    />

                                    {validationErrors.contractorID && (
                                        <small className="text-danger">{validationErrors.contractorID}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="contractorName" className="mb-3">
                                    <Form.Label>contractorName</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="contractorName"
                                        value={messes.contractorName}
                                        onChange={handleChange}
                                        className={validationErrors.contractorName ? "input-border" : ""}
                                    />

                                    {validationErrors.contractorName && (
                                        <small className="text-danger">{validationErrors.contractorName}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="fullNameoffirmoftheContractor" className="mb-3">
                                    <Form.Label>fullNameoffirmoftheContractor</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="fullNameoffirmoftheContractor"
                                        value={messes.fullNameoffirmoftheContractor}
                                        onChange={handleChange}
                                        className={validationErrors.fullNameoffirmoftheContractor ? "input-border" : ""}
                                    />

                                    {validationErrors.fullNameoffirmoftheContractor && (
                                        <small className="text-danger">{validationErrors.fullNameoffirmoftheContractor}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="contractorContactNumber" className="mb-3">
                                    <Form.Label>contractorContactNumber</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="contractorContactNumber"
                                        value={messes.contractorContactNumber}
                                        onChange={handleChange}
                                        className={validationErrors.contractorContactNumber ? "input-border" : ""}
                                    />

                                    {validationErrors.contractorContactNumber && (
                                        <small className="text-danger">{validationErrors.contractorContactNumber}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="contractorAlternateContactNumber" className="mb-3">
                                    <Form.Label>contractorAlternateContactNumber</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="contractorAlternateContactNumber"
                                        value={messes.contractorAlternateContactNumber}
                                        onChange={handleChange}
                                        className={validationErrors.contractorAlternateContactNumber ? "input-border" : ""}
                                    />

                                    {validationErrors.contractorAlternateContactNumber && (
                                        <small className="text-danger">{validationErrors.contractorAlternateContactNumber}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="monthlyturnoveramount_InLakhs" className="mb-3">
                                    <Form.Label>monthlyturnoveramount_InLakhs</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="monthlyturnoveramount_InLakhs"
                                        value={messes.monthlyturnoveramount_InLakhs}
                                        onChange={handleChange}
                                        className={validationErrors.monthlyturnoveramount_InLakhs ? "input-border" : ""}
                                    />

                                    {validationErrors.monthlyturnoveramount_InLakhs && (
                                        <small className="text-danger">{validationErrors.monthlyturnoveramount_InLakhs}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="uploadCopyofGSTReturn" className="mb-3">
                                    <Form.Label>uploadCopyofGSTReturn</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="uploadCopyofGSTReturn"
                                        value={messes.uploadCopyofGSTReturn}
                                        onChange={handleChange}
                                        className={validationErrors.uploadCopyofGSTReturn ? "input-border" : ""}
                                    />

                                    {validationErrors.uploadCopyofGSTReturn && (
                                        <small className="text-danger">{validationErrors.uploadCopyofGSTReturn}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="prwCoordinator" className="mb-3">
                                    <Form.Label>prwCoordinator</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="prwCoordinator"
                                        value={messes.prwCoordinator}
                                        onChange={handleChange}
                                        className={validationErrors.prwCoordinator ? "input-border" : ""}
                                    />

                                    {validationErrors.prwCoordinator && (
                                        <small className="text-danger">{validationErrors.prwCoordinator}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="dateofConcallwithManagerSub_contractor_HO" className="mb-3">
                                    <Form.Label>dateofConcallwithManagerSub_contractor_HO</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="dateofConcallwithManagerSub_contractor_HO"
                                        value={messes.dateofConcallwithManagerSub_contractor_HO}
                                        onChange={handleChange}
                                        className={validationErrors.dateofConcallwithManagerSub_contractor_HO ? "input-border" : ""}
                                    />

                                    {validationErrors.dateofConcallwithManagerSub_contractor_HO && (
                                        <small className="text-danger">{validationErrors.dateofConcallwithManagerSub_contractor_HO}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="confirmationofPRW_Manager_Subcontract_HO" className="mb-3">
                                    <Form.Label>confirmationofPRW_Manager_Subcontract_HO</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="confirmationofPRW_Manager_Subcontract_HO"
                                        value={messes.confirmationofPRW_Manager_Subcontract_HO}
                                        onChange={handleChange}
                                        className={validationErrors.confirmationofPRW_Manager_Subcontract_HO ? "input-border" : ""}
                                    />

                                    {validationErrors.confirmationofPRW_Manager_Subcontract_HO && (
                                        <small className="text-danger">{validationErrors.confirmationofPRW_Manager_Subcontract_HO}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="reasonforNotSuitable" className="mb-3">
                                    <Form.Label>reasonforNotSuitable</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="reasonforNotSuitable"
                                        value={messes.reasonforNotSuitable}
                                        onChange={handleChange}
                                        className={validationErrors.reasonforNotSuitable ? "input-border" : ""}
                                    />

                                    {validationErrors.reasonforNotSuitable && (
                                        <small className="text-danger">{validationErrors.reasonforNotSuitable}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="dateofConcallwithProject_Incharge" className="mb-3">
                                    <Form.Label>dateofConcallwithProject_Incharge</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="dateofConcallwithProject_Incharge"
                                        value={messes.dateofConcallwithProject_Incharge}
                                        onChange={handleChange}
                                        className={validationErrors.dateofConcallwithProject_Incharge ? "input-border" : ""}
                                    />

                                    {validationErrors.dateofConcallwithProject_Incharge && (
                                        <small className="text-danger">{validationErrors.dateofConcallwithProject_Incharge}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="uploadPreviousworkorderofthecontractor" className="mb-3">
                                    <Form.Label>uploadPreviousworkorderofthecontractor</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="uploadPreviousworkorderofthecontractor"
                                        value={messes.uploadPreviousworkorderofthecontractor}
                                        onChange={handleChange}
                                        className={validationErrors.uploadPreviousworkorderofthecontractor ? "input-border" : ""}
                                    />

                                    {validationErrors.uploadPreviousworkorderofthecontractor && (
                                        <small className="text-danger">{validationErrors.uploadPreviousworkorderofthecontractor}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="remarksafterConcallwithProject_Incharge" className="mb-3">
                                    <Form.Label>remarksafterConcallwithProject_Incharge</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="remarksafterConcallwithProject_Incharge"
                                        value={messes.remarksafterConcallwithProject_Incharge}
                                        onChange={handleChange}
                                        className={validationErrors.remarksafterConcallwithProject_Incharge ? "input-border" : ""}
                                    />

                                    {validationErrors.remarksafterConcallwithProject_Incharge && (
                                        <small className="text-danger">{validationErrors.remarksafterConcallwithProject_Incharge}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="reasonofNotSuitable" className="mb-3">
                                    <Form.Label>reasonofNotSuitable</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="reasonofNotSuitable"
                                        value={messes.reasonofNotSuitable}
                                        onChange={handleChange}
                                        className={validationErrors.reasonofNotSuitable ? "input-border" : ""}
                                    />

                                    {validationErrors.reasonofNotSuitable && (
                                        <small className="text-danger">{validationErrors.reasonofNotSuitable}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="dateofsitevisit" className="mb-3">
                                    <Form.Label>dateofsitevisit</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="dateofsitevisit"
                                        value={messes.dateofsitevisit}
                                        onChange={handleChange}
                                        className={validationErrors.dateofsitevisit ? "input-border" : ""}
                                    />

                                    {validationErrors.dateofsitevisit && (
                                        <small className="text-danger">{validationErrors.dateofsitevisit}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="confirmationofSitevisited" className="mb-3">
                                    <Form.Label>confirmationofSitevisited</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="confirmationofSitevisited"
                                        value={messes.confirmationofSitevisited}
                                        onChange={handleChange}
                                        className={validationErrors.confirmationofSitevisited ? "input-border" : ""}
                                    />

                                    {validationErrors.confirmationofSitevisited && (
                                        <small className="text-danger">{validationErrors.confirmationofSitevisited}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="contractorInterestedinWorking" className="mb-3">
                                    <Form.Label>contractorInterestedinWorking</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="contractorInterestedinWorking"
                                        value={messes.contractorInterestedinWorking}
                                        onChange={handleChange}
                                        className={validationErrors.contractorInterestedinWorking ? "input-border" : ""}
                                    />

                                    {validationErrors.contractorInterestedinWorking && (
                                        <small className="text-danger">{validationErrors.contractorInterestedinWorking}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="travelarrangementDeploymentTransportation" className="mb-3">
                                    <Form.Label>travelarrangementDeploymentTransportation</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="travelarrangementDeploymentTransportation"
                                        value={messes.travelarrangementDeploymentTransportation}
                                        onChange={handleChange}
                                        className={validationErrors.travelarrangementDeploymentTransportation ? "input-border" : ""}
                                    />

                                    {validationErrors.travelarrangementDeploymentTransportation && (
                                        <small className="text-danger">{validationErrors.travelarrangementDeploymentTransportation}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="dateofWorkorder" className="mb-3">
                                    <Form.Label>dateofWorkorder</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="dateofWorkorder"
                                        value={messes.dateofWorkorder}
                                        onChange={handleChange}
                                        className={validationErrors.dateofWorkorder ? "input-border" : ""}
                                    />

                                    {validationErrors.dateofWorkorder && (
                                        <small className="text-danger">{validationErrors.dateofWorkorder}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="dateofDeployment" className="mb-3">
                                    <Form.Label>dateofDeployment</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="dateofDeployment"
                                        value={messes.dateofDeployment}
                                        onChange={handleChange}
                                        className={validationErrors.dateofDeployment ? "input-border" : ""}
                                    />

                                    {validationErrors.dateofDeployment && (
                                        <small className="text-danger">{validationErrors.dateofDeployment}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="woNumber" className="mb-3">
                                    <Form.Label>woNumber</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="woNumber"
                                        value={messes.woNumber}
                                        onChange={handleChange}
                                        className={validationErrors.woNumber ? "input-border" : ""}
                                    />

                                    {validationErrors.woNumber && (
                                        <small className="text-danger">{validationErrors.woNumber}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="woRate_Text" className="mb-3">
                                    <Form.Label>woRate_Text</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="woRate_Text"
                                        value={messes.woRate_Text}
                                        onChange={handleChange}
                                        className={validationErrors.woRate_Text ? "input-border" : ""}
                                    />

                                    {validationErrors.woRate_Text && (
                                        <small className="text-danger">{validationErrors.woRate_Text}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="woDate" className="mb-3">
                                    <Form.Label>woDate</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="woDate"
                                        value={messes.woDate}
                                        onChange={handleChange}
                                        className={validationErrors.woDate ? "input-border" : ""}
                                    />

                                    {validationErrors.woDate && (
                                        <small className="text-danger">{validationErrors.woDate}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="vendorID" className="mb-3">
                                    <Form.Label>vendorID</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="vendorID"
                                        value={messes.vendorID}
                                        onChange={handleChange}
                                        className={validationErrors.vendorID ? "input-border" : ""}
                                    />

                                    {validationErrors.vendorID && (
                                        <small className="text-danger">{validationErrors.vendorID}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="finalizationofworkorderforPRWcontractor" className="mb-3">
                                    <Form.Label>finalizationofworkorderforPRWcontractor</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="finalizationofworkorderforPRWcontractor"
                                        value={messes.finalizationofworkorderforPRWcontractor}
                                        onChange={handleChange}
                                        className={validationErrors.finalizationofworkorderforPRWcontractor ? "input-border" : ""}
                                    />

                                    {validationErrors.finalizationofworkorderforPRWcontractor && (
                                        <small className="text-danger">{validationErrors.finalizationofworkorderforPRWcontractor}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="confirmationDeploymentofPRWatProject" className="mb-3">
                                    <Form.Label>confirmationDeploymentofPRWatProject</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="confirmationDeploymentofPRWatProject"
                                        value={messes.confirmationDeploymentofPRWatProject}
                                        onChange={handleChange}
                                        className={validationErrors.confirmationDeploymentofPRWatProject ? "input-border" : ""}
                                    />

                                    {validationErrors.confirmationDeploymentofPRWatProject && (
                                        <small className="text-danger">{validationErrors.confirmationDeploymentofPRWatProject}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="doyouwishtoclosethisRequestid" className="mb-3">
                                    <Form.Label>doyouwishtoclosethisRequestid</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="doyouwishtoclosethisRequestid"
                                        value={messes.doyouwishtoclosethisRequestid}
                                        onChange={handleChange}
                                        className={validationErrors.doyouwishtoclosethisRequestid ? "input-border" : ""}
                                    />

                                    {validationErrors.doyouwishtoclosethisRequestid && (
                                        <small className="text-danger">{validationErrors.doyouwishtoclosethisRequestid}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="lastestUpdatedate" className="mb-3">
                                    <Form.Label>lastestUpdatedate</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="lastestUpdatedate"
                                        value={messes.lastestUpdatedate}
                                        onChange={handleChange}
                                        className={validationErrors.lastestUpdatedate ? "input-border" : ""}
                                    />

                                    {validationErrors.lastestUpdatedate && (
                                        <small className="text-danger">{validationErrors.lastestUpdatedate}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="reviewdecisionofrejectionofPRWcontractor" className="mb-3">
                                    <Form.Label>reviewdecisionofrejectionofPRWcontractor</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="reviewdecisionofrejectionofPRWcontractor"
                                        value={messes.reviewdecisionofrejectionofPRWcontractor}
                                        onChange={handleChange}
                                        className={validationErrors.reviewdecisionofrejectionofPRWcontractor ? "input-border" : ""}
                                    />

                                    {validationErrors.reviewdecisionofrejectionofPRWcontractor && (
                                        <small className="text-danger">{validationErrors.reviewdecisionofrejectionofPRWcontractor}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="selectReasonforRejection" className="mb-3">
                                    <Form.Label>selectReasonforRejection</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="selectReasonforRejection"
                                        value={messes.selectReasonforRejection}
                                        onChange={handleChange}
                                        className={validationErrors.selectReasonforRejection ? "input-border" : ""}
                                    />

                                    {validationErrors.selectReasonforRejection && (
                                        <small className="text-danger">{validationErrors.selectReasonforRejection}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="statuss" className="mb-3">
                                    <Form.Label>status</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="status"
                                        value={messes.status}
                                        onChange={handleChange}
                                        className={validationErrors.status ? "input-border" : ""}
                                    />

                                    {validationErrors.status && (
                                        <small className="text-danger">{validationErrors.status}</small>
                                    )}
                                </Form.Group>
                            </Col>














                            <Col className='align-items-end d-flex justify-content-between mb-3'>
                                <div>
                                    <span className='fs-5 '>This field is required*</span>
                                </div>
                                <div>
                                    <Link to={'/pages/PRWAllocationMaster'}>
                                        <Button variant="primary" >
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update PRWAllocation' : 'Add PRWAllocation'}
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

export default PRWAllocationMasterAddEdit;