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
    initiationDate: string,
    month: string,
    type: string,
    confirmationOfUpdationOfRequirementOfSubContractor: string,
    dateOfRequirement: string,
    expectedDate: string,
    technicalDetails: string,
    circulationOfRFPToAllShortlistedVendors: string,
    preparationOfComparativeStatement_ManagerSubcontract: string,
    comparativeStatementPreparedBasedOn: string,
    approvedVendorID: string,
    woNumber: number,
    woRate: string,
    woDate: string,
    vendorID: string,
    typeOfJobWork: string,
    expectedDateOfDeployment: string,
    actualDateOfDeployment: string,
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

const PRWSubContractorMasterAddEdit = () => {
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
initiationDate: '',
month: '',
type: '',
confirmationOfUpdationOfRequirementOfSubContractor: '',
dateOfRequirement: '',
expectedDate: '',
technicalDetails: '',
circulationOfRFPToAllShortlistedVendors: '',
preparationOfComparativeStatement_ManagerSubcontract: '',
comparativeStatementPreparedBasedOn: '',
approvedVendorID: '',
woNumber: 0,
woRate: '',
woDate: '',
vendorID: '',
typeOfJobWork: '',
expectedDateOfDeployment: '',
actualDateOfDeployment: '',
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
            const response = await axios.get(`${config.API_URL_APPLICATION1}/PRWSubContractorMaster/GetPRWSubContractor/${id}`);
            console.log('response', response)
            if (response.data.isSuccess) {
                const fetchedModule = response.data.prwSubContractorMasters[0];
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
if(!messes.initiationDate) { errors.initiationDate = 'initiationDate is required'}
if(!messes.month) { errors.month = 'month is required'}
if(!messes.type) { errors.type = 'type is required'}
if(!messes.confirmationOfUpdationOfRequirementOfSubContractor) { errors.confirmationOfUpdationOfRequirementOfSubContractor = 'confirmationOfUpdationOfRequirementOfSubContractor is required'}
if(!messes.dateOfRequirement) { errors.dateOfRequirement = 'dateOfRequirement is required'}
if(!messes.expectedDate) { errors.expectedDate = 'expectedDate is required'}
if(!messes.technicalDetails) { errors.technicalDetails = 'technicalDetails is required'}
if(!messes.circulationOfRFPToAllShortlistedVendors) { errors.circulationOfRFPToAllShortlistedVendors = 'circulationOfRFPToAllShortlistedVendors is required'}
if(!messes.preparationOfComparativeStatement_ManagerSubcontract) { errors.preparationOfComparativeStatement_ManagerSubcontract = 'preparationOfComparativeStatement_ManagerSubcontract is required'}
if(!messes.comparativeStatementPreparedBasedOn) { errors.comparativeStatementPreparedBasedOn = 'comparativeStatementPreparedBasedOn is required'}
if(!messes.approvedVendorID) { errors.approvedVendorID = 'approvedVendorID is required'}
if(!messes.woNumber) { errors.woNumber = 'woNumber is required'}
if(!messes.woRate) { errors.woRate = 'woRate is required'}
if(!messes.woDate) { errors.woDate = 'woDate is required'}
if(!messes.vendorID) { errors.vendorID = 'vendorID is required'}
if(!messes.typeOfJobWork) { errors.typeOfJobWork = 'typeOfJobWork is required'}
if(!messes.expectedDateOfDeployment) { errors.expectedDateOfDeployment = 'expectedDateOfDeployment is required'}
if(!messes.actualDateOfDeployment) { errors.actualDateOfDeployment = 'actualDateOfDeployment is required'}











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
                await axios.put(`${config.API_URL_APPLICATION1}/PRWSubContractorMaster/UpdatePRWSubContractor/${id}`, payload);
                navigate('/pages/PRWSubContractorMaster', {
                    state: {
                        successMessage: "Challan Master Updated successfully!",
                    }
                });
            } else {
                await axios.post(`${config.API_URL_APPLICATION1}/PRWSubContractorMaster/CreatePRWSubContractor`, payload);
                navigate('/pages/PRWSubContractorMaster', {
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
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit PRWSubContractor Master' : 'Add PRWSubContractor Master'}</span></span>
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
                                <Form.Group controlId="initiationDate" className="mb-3">
                                    <Form.Label>initiationDate</Form.Label>
                                    <Form.Control
                                        type="text"
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
                                <Form.Group controlId="month" className="mb-3">
                                    <Form.Label>month</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="month"
                                        value={messes.month}
                                        onChange={handleChange}
                                        placeholder='Enter month'
                                        disabled={editMode}
                                        className={validationErrors.month ? " input-border" : "  "}
                                    />
                                    {validationErrors.month && (
                                        <small className="text-danger">{validationErrors.month}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="type" className="mb-3">
                                    <Form.Label>type</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="type"
                                        value={messes.type}
                                        onChange={handleChange}
                                        placeholder='Enter Project ID'
                                        className={validationErrors.type ? " input-border" : "  "}
                                    />
                                    {validationErrors.type && (
                                        <small className="text-danger">{validationErrors.type}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="confirmationOfUpdationOfRequirementOfSubContractor" className="mb-3">
                                    <Form.Label>confirmationOfUpdationOfRequirementOfSubContractor</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="confirmationOfUpdationOfRequirementOfSubContractor"
                                        value={messes.confirmationOfUpdationOfRequirementOfSubContractor}
                                        onChange={handleChange}
                                        placeholder='Enter Project Name'
                                        className={validationErrors.confirmationOfUpdationOfRequirementOfSubContractor ? " input-border" : "  "}
                                    />
                                    {validationErrors.confirmationOfUpdationOfRequirementOfSubContractor && (
                                        <small className="text-danger">{validationErrors.confirmationOfUpdationOfRequirementOfSubContractor}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="dateOfRequirement" className="mb-3">
                                    <Form.Label>dateOfRequirement</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="dateOfRequirement"
                                        value={messes.dateOfRequirement}
                                        onChange={handleChange}
                                        className={validationErrors.dateOfRequirement ? "input-border" : ""}
                                    />

                                    {validationErrors.dateOfRequirement && (
                                        <small className="text-danger">{validationErrors.dateOfRequirement}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="expectedDate" className="mb-3">
                                    <Form.Label>expectedDate</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="expectedDate"
                                        value={messes.expectedDate}
                                        onChange={handleChange}
                                        className={validationErrors.expectedDate ? "input-border" : ""}
                                    />

                                    {validationErrors.expectedDate && (
                                        <small className="text-danger">{validationErrors.expectedDate}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="technicalDetails" className="mb-3">
                                    <Form.Label>technicalDetails</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="technicalDetails"
                                        value={messes.technicalDetails}
                                        onChange={handleChange}
                                        className={validationErrors.technicalDetails ? "input-border" : ""}
                                    />

                                    {validationErrors.technicalDetails && (
                                        <small className="text-danger">{validationErrors.technicalDetails}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="circulationOfRFPToAllShortlistedVendors" className="mb-3">
                                    <Form.Label>circulationOfRFPToAllShortlistedVendors</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="circulationOfRFPToAllShortlistedVendors"
                                        value={messes.circulationOfRFPToAllShortlistedVendors}
                                        onChange={handleChange}
                                        className={validationErrors.circulationOfRFPToAllShortlistedVendors ? "input-border" : ""}
                                    />

                                    {validationErrors.circulationOfRFPToAllShortlistedVendors && (
                                        <small className="text-danger">{validationErrors.circulationOfRFPToAllShortlistedVendors}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="preparationOfComparativeStatement_ManagerSubcontract" className="mb-3">
                                    <Form.Label>preparationOfComparativeStatement_ManagerSubcontract</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="preparationOfComparativeStatement_ManagerSubcontract"
                                        value={messes.preparationOfComparativeStatement_ManagerSubcontract}
                                        onChange={handleChange}
                                        className={validationErrors.preparationOfComparativeStatement_ManagerSubcontract ? "input-border" : ""}
                                    />

                                    {validationErrors.preparationOfComparativeStatement_ManagerSubcontract && (
                                        <small className="text-danger">{validationErrors.preparationOfComparativeStatement_ManagerSubcontract}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="comparativeStatementPreparedBasedOn" className="mb-3">
                                    <Form.Label>comparativeStatementPreparedBasedOn</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="comparativeStatementPreparedBasedOn"
                                        value={messes.comparativeStatementPreparedBasedOn}
                                        onChange={handleChange}
                                        className={validationErrors.comparativeStatementPreparedBasedOn ? "input-border" : ""}
                                    />

                                    {validationErrors.comparativeStatementPreparedBasedOn && (
                                        <small className="text-danger">{validationErrors.comparativeStatementPreparedBasedOn}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="approvedVendorID" className="mb-3">
                                    <Form.Label>approvedVendorID</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="approvedVendorID"
                                        value={messes.approvedVendorID}
                                        onChange={handleChange}
                                        className={validationErrors.approvedVendorID ? "input-border" : ""}
                                    />

                                    {validationErrors.approvedVendorID && (
                                        <small className="text-danger">{validationErrors.approvedVendorID}</small>
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
                                <Form.Group controlId="woRate" className="mb-3">
                                    <Form.Label>woRate</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="woRate"
                                        value={messes.woRate}
                                        onChange={handleChange}
                                        className={validationErrors.woRate ? "input-border" : ""}
                                    />

                                    {validationErrors.woRate && (
                                        <small className="text-danger">{validationErrors.woRate}</small>
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
                                        type="text"
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
                                <Form.Group controlId="typeOfJobWork" className="mb-3">
                                    <Form.Label>typeOfJobWork</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="typeOfJobWork"
                                        value={messes.typeOfJobWork}
                                        onChange={handleChange}
                                        className={validationErrors.typeOfJobWork ? "input-border" : ""}
                                    />

                                    {validationErrors.typeOfJobWork && (
                                        <small className="text-danger">{validationErrors.typeOfJobWork}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="expectedDateOfDeployment" className="mb-3">
                                    <Form.Label>expectedDateOfDeployment</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="expectedDateOfDeployment"
                                        value={messes.expectedDateOfDeployment}
                                        onChange={handleChange}
                                        className={validationErrors.expectedDateOfDeployment ? "input-border" : ""}
                                    />

                                    {validationErrors.expectedDateOfDeployment && (
                                        <small className="text-danger">{validationErrors.expectedDateOfDeployment}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="actualDateOfDeployment" className="mb-3">
                                    <Form.Label>actualDateOfDeployment</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="actualDateOfDeployment"
                                        value={messes.actualDateOfDeployment}
                                        onChange={handleChange}
                                        className={validationErrors.actualDateOfDeployment ? "input-border" : ""}
                                    />

                                    {validationErrors.actualDateOfDeployment && (
                                        <small className="text-danger">{validationErrors.actualDateOfDeployment}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            
                            














                            <Col className='align-items-end d-flex justify-content-between mb-3'>
                                <div>
                                    <span className='fs-5 '>This field is required*</span>
                                </div>
                                <div>
                                    <Link to={'/pages/PRWSubContractorMaster'}>
                                        <Button variant="primary" >
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update PRWSubContractor' : 'Add PRWSubContractor'}
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

export default PRWSubContractorMasterAddEdit;