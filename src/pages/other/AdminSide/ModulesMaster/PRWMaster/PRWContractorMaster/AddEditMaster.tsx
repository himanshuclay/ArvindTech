import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
// import Select from 'react-select';
import { toast } from 'react-toastify';


interface BTS_PAYMENT {
    id: number,
projectID: string,
projectName: string,
leadDate: string,
prwLeadID: string,
sourceofLead: string,
searchTeamMember: string,
location_State: string,
location_District: string,
fullNameofLead: string,
fullNameofFirmoftheLead: string,
leadMobileNumber: string,
leadAlternateContactNumber: string,
prwCoordinator: string,
callingConclusion: string,
reasonforRejection: string,
callBackDate: string,
contractorID: string,
undertaking_GSTR3B: string,
monthlyturnoveramount_InLakhs: string,
gstNo: string,
uploadCopyofGSTReturn: string,
nameofCompany_currentlyworkingwith: string,
contractorType: string,
pleaseconfirmifthePRWworksonSupply_MeasurementBasis: string,
typeofCapability: string,
originStateofMainContractor: string,
isPRWregisteredunderEPF_ESI: string,
ifaboveisNo_IsPRWwillingtoberegisteredunderEPF_ESI: string,
statusUpdatedAt: string,
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

const PRWContractorMasterAddEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [empName, setEmpName] = useState<string | null>('')
    const [, setProjectList] = useState<ProjectList[]>([])
    const [, setStatusList] = useState<Status[]>([])
    const [, setEmployeeList] = useState<EmployeeList[]>([])
    const [messes, setMesses] = useState<BTS_PAYMENT>({
        id: 0,
        projectID: '',
        projectName: '',
        leadDate: '',
        prwLeadID: '',
        sourceofLead: '',
        searchTeamMember: '',
        location_State: '',
        location_District: '',
        fullNameofLead: '',
        fullNameofFirmoftheLead: '',
        leadMobileNumber: '',
        leadAlternateContactNumber: '',
        prwCoordinator: '',
        callingConclusion: '',
        reasonforRejection: '',
        callBackDate: '',
        contractorID: '',
        undertaking_GSTR3B: '',
        monthlyturnoveramount_InLakhs: '',
        gstNo: '',
        uploadCopyofGSTReturn: '',
        nameofCompany_currentlyworkingwith: '',
        contractorType: '',
        pleaseconfirmifthePRWworksonSupply_MeasurementBasis: '',
        typeofCapability: '',
        originStateofMainContractor: '',
        isPRWregisteredunderEPF_ESI: '',
        ifaboveisNo_IsPRWwillingtoberegisteredunderEPF_ESI: '',
        statusUpdatedAt: '',
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
            const response = await axios.get(`${config.API_URL_APPLICATION1}/PRWContractorMaster/GetPRWContractor/${id}`);
            console.log('response', response)
            if (response.data.isSuccess) {
                const fetchedModule = response.data.prwContractorMasters[0];
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

  
if(!messes.projectID) { errors.projectID = 'projectID is required'}
if(!messes.projectName) { errors.projectName = 'projectName is required'}
if(!messes.leadDate) { errors.leadDate = 'leadDate is required'}
if(!messes.prwLeadID) { errors.prwLeadID = 'prwLeadID is required'}
if(!messes.sourceofLead) { errors.sourceofLead = 'sourceofLead is required'}
if(!messes.searchTeamMember) { errors.searchTeamMember = 'searchTeamMember is required'}
if(!messes.location_State) { errors.location_State = 'location_State is required'}
if(!messes.location_District) { errors.location_District = 'location_District is required'}
if(!messes.fullNameofLead) { errors.fullNameofLead = 'fullNameofLead is required'}
if(!messes.fullNameofFirmoftheLead) { errors.fullNameofFirmoftheLead = 'fullNameofFirmoftheLead is required'}
if(!messes.leadMobileNumber) { errors.leadMobileNumber = 'leadMobileNumber is required'}
if(!messes.leadAlternateContactNumber) { errors.leadAlternateContactNumber = 'leadAlternateContactNumber is required'}
if(!messes.prwCoordinator) { errors.prwCoordinator = 'prwCoordinator is required'}
if(!messes.callingConclusion) { errors.callingConclusion = 'callingConclusion is required'}
if(!messes.reasonforRejection) { errors.reasonforRejection = 'reasonforRejection is required'}
if(!messes.callBackDate) { errors.callBackDate = 'callBackDate is required'}
if(!messes.contractorID) { errors.contractorID = 'contractorID is required'}
if(!messes.undertaking_GSTR3B) { errors.undertaking_GSTR3B = 'undertaking_GSTR3B is required'}
if(!messes.monthlyturnoveramount_InLakhs) { errors.monthlyturnoveramount_InLakhs = 'monthlyturnoveramount_InLakhs is required'}
if(!messes.gstNo) { errors.gstNo = 'gstNo is required'}
if(!messes.uploadCopyofGSTReturn) { errors.uploadCopyofGSTReturn = 'uploadCopyofGSTReturn is required'}
if(!messes.nameofCompany_currentlyworkingwith) { errors.nameofCompany_currentlyworkingwith = 'nameofCompany_currentlyworkingwith is required'}
if(!messes.contractorType) { errors.contractorType = 'contractorType is required'}
if(!messes.pleaseconfirmifthePRWworksonSupply_MeasurementBasis) { errors.pleaseconfirmifthePRWworksonSupply_MeasurementBasis = 'pleaseconfirmifthePRWworksonSupply_MeasurementBasis is required'}
if(!messes.typeofCapability) { errors.typeofCapability = 'typeofCapability is required'}
if(!messes.originStateofMainContractor) { errors.originStateofMainContractor = 'originStateofMainContractor is required'}
if(!messes.isPRWregisteredunderEPF_ESI) { errors.isPRWregisteredunderEPF_ESI = 'isPRWregisteredunderEPF_ESI is required'}
if(!messes.ifaboveisNo_IsPRWwillingtoberegisteredunderEPF_ESI) { errors.ifaboveisNo_IsPRWwillingtoberegisteredunderEPF_ESI = 'ifaboveisNo_IsPRWwillingtoberegisteredunderEPF_ESI is required'}
if(!messes.statusUpdatedAt) { errors.statusUpdatedAt = 'statusUpdatedAt is required'}










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
                await axios.put(`${config.API_URL_APPLICATION1}/PRWContractorMaster/UpdatePRWContractor/${id}`, payload);
                navigate('/pages/PRWContractorMaster', {
                    state: {
                        successMessage: "Challan Master Updated successfully!",
                    }
                });
            } else {
                await axios.post(`${config.API_URL_APPLICATION1}/PRWContractorMaster/CreatePRWContractor`, payload);
                navigate('/pages/PRWContractorMaster', {
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
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit PRWContractor Master' : 'Add PRWContractor Master'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>

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
                                        type="date"
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
                                <Form.Group controlId="leadDate" className="mb-3">
                                    <Form.Label>leadDate</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="leadDate"
                                        value={messes.leadDate}
                                        onChange={handleChange}
                                        placeholder='Enter leadDate'
                                        disabled={editMode}
                                        className={validationErrors.leadDate ? " input-border" : "  "}
                                    />
                                    {validationErrors.leadDate && (
                                        <small className="text-danger">{validationErrors.leadDate}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="prwLeadID" className="mb-3">
                                    <Form.Label>prwLeadID</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="prwLeadID"
                                        value={messes.prwLeadID}
                                        onChange={handleChange}
                                        placeholder='Enter prwLeadID'
                                        disabled={editMode}
                                        className={validationErrors.prwLeadID ? " input-border" : "  "}
                                    />
                                    {validationErrors.prwLeadID && (
                                        <small className="text-danger">{validationErrors.prwLeadID}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="sourceofLead" className="mb-3">
                                    <Form.Label>sourceofLead</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="sourceofLead"
                                        value={messes.sourceofLead}
                                        onChange={handleChange}
                                        placeholder='Enter Project ID'
                                        className={validationErrors.sourceofLead ? " input-border" : "  "}
                                    />
                                    {validationErrors.sourceofLead && (
                                        <small className="text-danger">{validationErrors.sourceofLead}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="searchTeamMember" className="mb-3">
                                    <Form.Label>searchTeamMember</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="searchTeamMember"
                                        value={messes.searchTeamMember}
                                        onChange={handleChange}
                                        placeholder='Enter Project Name'
                                        className={validationErrors.searchTeamMember ? " input-border" : "  "}
                                    />
                                    {validationErrors.searchTeamMember && (
                                        <small className="text-danger">{validationErrors.searchTeamMember}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="location_State" className="mb-3">
                                    <Form.Label>location_State</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="location_State"
                                        value={messes.location_State}
                                        onChange={handleChange}
                                        className={validationErrors.location_State ? "input-border" : ""}
                                    />

                                    {validationErrors.location_State && (
                                        <small className="text-danger">{validationErrors.location_State}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="location_District" className="mb-3">
                                    <Form.Label>location_District</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="location_District"
                                        value={messes.location_District}
                                        onChange={handleChange}
                                        className={validationErrors.location_District ? "input-border" : ""}
                                    />

                                    {validationErrors.location_District && (
                                        <small className="text-danger">{validationErrors.location_District}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="fullNameofLead" className="mb-3">
                                    <Form.Label>fullNameofLead</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="fullNameofLead"
                                        value={messes.fullNameofLead}
                                        onChange={handleChange}
                                        className={validationErrors.fullNameofLead ? "input-border" : ""}
                                    />

                                    {validationErrors.fullNameofLead && (
                                        <small className="text-danger">{validationErrors.fullNameofLead}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="fullNameofFirmoftheLead" className="mb-3">
                                    <Form.Label>fullNameofFirmoftheLead</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="fullNameofFirmoftheLead"
                                        value={messes.fullNameofFirmoftheLead}
                                        onChange={handleChange}
                                        className={validationErrors.fullNameofFirmoftheLead ? "input-border" : ""}
                                    />

                                    {validationErrors.fullNameofFirmoftheLead && (
                                        <small className="text-danger">{validationErrors.fullNameofFirmoftheLead}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="leadMobileNumber" className="mb-3">
                                    <Form.Label>leadMobileNumber</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="leadMobileNumber"
                                        value={messes.leadMobileNumber}
                                        onChange={handleChange}
                                        className={validationErrors.leadMobileNumber ? "input-border" : ""}
                                    />

                                    {validationErrors.leadMobileNumber && (
                                        <small className="text-danger">{validationErrors.leadMobileNumber}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="leadAlternateContactNumber" className="mb-3">
                                    <Form.Label>leadAlternateContactNumber</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="leadAlternateContactNumber"
                                        value={messes.leadAlternateContactNumber}
                                        onChange={handleChange}
                                        className={validationErrors.leadAlternateContactNumber ? "input-border" : ""}
                                    />

                                    {validationErrors.leadAlternateContactNumber && (
                                        <small className="text-danger">{validationErrors.leadAlternateContactNumber}</small>
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
                                <Form.Group controlId="callingConclusion" className="mb-3">
                                    <Form.Label>callingConclusion</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="callingConclusion"
                                        value={messes.callingConclusion}
                                        onChange={handleChange}
                                        className={validationErrors.callingConclusion ? "input-border" : ""}
                                    />

                                    {validationErrors.callingConclusion && (
                                        <small className="text-danger">{validationErrors.callingConclusion}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="reasonforRejection" className="mb-3">
                                    <Form.Label>reasonforRejection</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="reasonforRejection"
                                        value={messes.reasonforRejection}
                                        onChange={handleChange}
                                        className={validationErrors.reasonforRejection ? "input-border" : ""}
                                    />

                                    {validationErrors.reasonforRejection && (
                                        <small className="text-danger">{validationErrors.reasonforRejection}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="callBackDate" className="mb-3">
                                    <Form.Label>callBackDate</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="callBackDate"
                                        value={messes.callBackDate}
                                        onChange={handleChange}
                                        className={validationErrors.callBackDate ? "input-border" : ""}
                                    />

                                    {validationErrors.callBackDate && (
                                        <small className="text-danger">{validationErrors.callBackDate}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="contractorID" className="mb-3">
                                    <Form.Label>contractorID</Form.Label>
                                    <Form.Control
                                        type="text"
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
                                <Form.Group controlId="undertaking_GSTR3B" className="mb-3">
                                    <Form.Label>undertaking_GSTR3B</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="undertaking_GSTR3B"
                                        value={messes.undertaking_GSTR3B}
                                        onChange={handleChange}
                                        className={validationErrors.undertaking_GSTR3B ? "input-border" : ""}
                                    />

                                    {validationErrors.undertaking_GSTR3B && (
                                        <small className="text-danger">{validationErrors.undertaking_GSTR3B}</small>
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
                                <Form.Group controlId="gstNo" className="mb-3">
                                    <Form.Label>gstNo</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="gstNo"
                                        value={messes.gstNo}
                                        onChange={handleChange}
                                        className={validationErrors.gstNo ? "input-border" : ""}
                                    />

                                    {validationErrors.gstNo && (
                                        <small className="text-danger">{validationErrors.gstNo}</small>
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
                                <Form.Group controlId="nameofCompany_currentlyworkingwith" className="mb-3">
                                    <Form.Label>nameofCompany_currentlyworkingwith</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="nameofCompany_currentlyworkingwith"
                                        value={messes.nameofCompany_currentlyworkingwith}
                                        onChange={handleChange}
                                        className={validationErrors.nameofCompany_currentlyworkingwith ? "input-border" : ""}
                                    />

                                    {validationErrors.nameofCompany_currentlyworkingwith && (
                                        <small className="text-danger">{validationErrors.nameofCompany_currentlyworkingwith}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="contractorType" className="mb-3">
                                    <Form.Label>contractorType</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="contractorType"
                                        value={messes.contractorType}
                                        onChange={handleChange}
                                        className={validationErrors.contractorType ? "input-border" : ""}
                                    />

                                    {validationErrors.contractorType && (
                                        <small className="text-danger">{validationErrors.contractorType}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="pleaseconfirmifthePRWworksonSupply_MeasurementBasis" className="mb-3">
                                    <Form.Label>pleaseconfirmifthePRWworksonSupply_MeasurementBasis</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="pleaseconfirmifthePRWworksonSupply_MeasurementBasis"
                                        value={messes.pleaseconfirmifthePRWworksonSupply_MeasurementBasis}
                                        onChange={handleChange}
                                        className={validationErrors.pleaseconfirmifthePRWworksonSupply_MeasurementBasis ? "input-border" : ""}
                                    />

                                    {validationErrors.pleaseconfirmifthePRWworksonSupply_MeasurementBasis && (
                                        <small className="text-danger">{validationErrors.pleaseconfirmifthePRWworksonSupply_MeasurementBasis}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="typeofCapability" className="mb-3">
                                    <Form.Label>typeofCapability</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="typeofCapability"
                                        value={messes.typeofCapability}
                                        onChange={handleChange}
                                        className={validationErrors.typeofCapability ? "input-border" : ""}
                                    />

                                    {validationErrors.typeofCapability && (
                                        <small className="text-danger">{validationErrors.typeofCapability}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="originStateofMainContractor" className="mb-3">
                                    <Form.Label>originStateofMainContractor</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="originStateofMainContractor"
                                        value={messes.originStateofMainContractor}
                                        onChange={handleChange}
                                        className={validationErrors.originStateofMainContractor ? "input-border" : ""}
                                    />

                                    {validationErrors.originStateofMainContractor && (
                                        <small className="text-danger">{validationErrors.originStateofMainContractor}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="isPRWregisteredunderEPF_ESI" className="mb-3">
                                    <Form.Label>isPRWregisteredunderEPF_ESI</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="isPRWregisteredunderEPF_ESI"
                                        value={messes.isPRWregisteredunderEPF_ESI}
                                        onChange={handleChange}
                                        className={validationErrors.isPRWregisteredunderEPF_ESI ? "input-border" : ""}
                                    />

                                    {validationErrors.isPRWregisteredunderEPF_ESI && (
                                        <small className="text-danger">{validationErrors.isPRWregisteredunderEPF_ESI}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="ifaboveisNo_IsPRWwillingtoberegisteredunderEPF_ESI" className="mb-3">
                                    <Form.Label>ifaboveisNo_IsPRWwillingtoberegisteredunderEPF_ESI</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="ifaboveisNo_IsPRWwillingtoberegisteredunderEPF_ESI"
                                        value={messes.ifaboveisNo_IsPRWwillingtoberegisteredunderEPF_ESI}
                                        onChange={handleChange}
                                        className={validationErrors.ifaboveisNo_IsPRWwillingtoberegisteredunderEPF_ESI ? "input-border" : ""}
                                    />

                                    {validationErrors.ifaboveisNo_IsPRWwillingtoberegisteredunderEPF_ESI && (
                                        <small className="text-danger">{validationErrors.ifaboveisNo_IsPRWwillingtoberegisteredunderEPF_ESI}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="statusUpdatedAt" className="mb-3">
                                    <Form.Label>statusUpdatedAt</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="statusUpdatedAt"
                                        value={messes.statusUpdatedAt}
                                        onChange={handleChange}
                                        className={validationErrors.statusUpdatedAt ? "input-border" : ""}
                                    />

                                    {validationErrors.statusUpdatedAt && (
                                        <small className="text-danger">{validationErrors.statusUpdatedAt}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            














                            <Col className='align-items-end d-flex justify-content-between mb-3'>
                                <div>
                                    <span className='fs-5 '>This field is required*</span>
                                </div>
                                <div>
                                    <Link to={'/pages/PRWContractorMaster'}>
                                        <Button variant="primary" >
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update PRWContractor' : 'Add PRWContractor'}
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

export default PRWContractorMasterAddEdit;