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
    projectID: string,
    projectName: string,
    safetyPerson: string,
    assignDate: string,
    observationType: string,
    observation: string,
    site_ExactLocation: string,
    responsibleContractor: string,
    recommendation: string,
    targetDate: string,
    allocatedLineIncharge: string,
    severityRateLevel: string,
    uploadPhotograph: string,
    approvedCorrectionPhotograph: string,
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

const HSEObservationMasterAddEdit = () => {
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
        safetyPerson: '',
        assignDate: '',
        observationType: '',
        observation: '',
        site_ExactLocation: '',
        responsibleContractor: '',
        recommendation: '',
        targetDate: '',
        allocatedLineIncharge: '',
        severityRateLevel: '',
        uploadPhotograph: '',
        approvedCorrectionPhotograph: '',
        createdBy: '',
        createdDate: '',
        updatedBy: '',
        updatedDate: '',
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
            const response = await axios.get(`${config.API_URL_APPLICATION1}/HSEObservation/GetHSEObservation/${id}`);
            console.log('response', response)
            if (response.data.isSuccess) {
                const fetchedModule = response.data.hSEObservationMasters[0];
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

    
if(!messes.projectID) { errors.projectID = 'Project ID is required'}
if(!messes.projectName) { errors.projectName = 'Project Name is required'}
if(!messes.safetyPerson) { errors.safetyPerson = 'Safety Person is required'}
if(!messes.assignDate) { errors.assignDate = 'Assign Date is required'}
if(!messes.observationType) { errors.observationType = 'Observation Type is required'}
if(!messes.observation) { errors.observation = 'Observation is required'}
if(!messes.site_ExactLocation) { errors.site_ExactLocation = 'Site ExactLocation is required'}
if(!messes.responsibleContractor) { errors.responsibleContractor = 'Responsible Contractor is required'}
if(!messes.recommendation) { errors.recommendation = 'Rcommendation is required'}
if(!messes.targetDate) { errors.targetDate = 'Target Date is required'}
if(!messes.allocatedLineIncharge) { errors.allocatedLineIncharge = 'Allocated Line Incharge is required'}
if(!messes.severityRateLevel) { errors.severityRateLevel = 'Severity Rate Level is required'}
if(!messes.uploadPhotograph) { errors.uploadPhotograph = 'Upload Photograph is required'}
if(!messes.approvedCorrectionPhotograph) { errors.approvedCorrectionPhotograph = 'Approved Correction Photograph is required'}





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
                if (eventName === "no") {
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
                await axios.put(`${config.API_URL_APPLICATION1}/HSEObservation/UpdateHSEObservation/${id}`, payload);
                navigate('/pages/HSEObservationMaster', {
                    state: {
                        successMessage: "Challan Master Updated successfully!",
                    }
                });
            } else {
                await axios.post(`${config.API_URL_APPLICATION1}/HSEObservation/CreateHSEObservation`, payload);
                navigate('/pages/HSEObservationMaster', {
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
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit HSEObservation Master' : 'Add HSEObservation Master'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>

                            <Col lg={6}>
                                <Form.Group controlId="projectID" className="mb-3">
                                    <Form.Label>Project ID*</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="projectID"
                                        value={messes.projectID}
                                        onChange={handleChange}
                                        placeholder='Enter Project ID'
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
                                <Form.Group controlId="safetyPerson" className="mb-3">
                                    <Form.Label>Safety Person*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="safetyPerson"
                                        value={messes.safetyPerson}
                                        onChange={handleChange}
                                        placeholder='Enter Safety Person'
                                        className={validationErrors.safetyPerson ? " input-border" : "  "}
                                    />
                                    {validationErrors.safetyPerson && (
                                        <small className="text-danger">{validationErrors.safetyPerson}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="assignDate" className="mb-3">
                                    <Form.Label>Assign Date*</Form.Label>
                                    <Flatpickr
                                        type="date"
                                        name="assignDate"
                                        value={messes.assignDate}
                                        onChange={(selectedDates) => handleDateChange("assignDate", selectedDates)}
                                        placeholder='Enter Assign Date'
                                        options={dateOptions}
                                        className={validationErrors.assignDate ? "form-control input-border" : "form-control"}
                                    />
                                    {validationErrors.assignDate && (
                                        <small className="text-danger">{validationErrors.assignDate}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="observationType" className="mb-3">
                                    <Form.Label>Observation Type*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="observationType"
                                        value={messes.observationType}
                                        onChange={handleChange}
                                        placeholder='Enter Observation Type'
                                        className={validationErrors.observationType ? " input-border" : "  "}
                                    />
                                    {validationErrors.observationType && (
                                        <small className="text-danger">{validationErrors.observationType}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="observation" className="mb-3">
                                    <Form.Label>Observation*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="observation"
                                        value={messes.observation}
                                        onChange={handleChange}
                                        placeholder='Enter Observation'
                                        className={validationErrors.observation ? " input-border" : "  "}
                                    />
                                    {validationErrors.observation && (
                                        <small className="text-danger">{validationErrors.observation}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="site_ExactLocation" className="mb-3">
                                    <Form.Label>Site ExactLocation*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="site_ExactLocation"
                                        value={messes.site_ExactLocation}
                                        onChange={handleChange}
                                        placeholder='Enter Site ExactLocation'
                                        className={validationErrors.site_ExactLocation ? " input-border" : "  "}
                                    />
                                    {validationErrors.site_ExactLocation && (
                                        <small className="text-danger">{validationErrors.site_ExactLocation}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="responsibleContractor" className="mb-3">
                                    <Form.Label>Responsible Contractor*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="responsibleContractor"
                                        value={messes.responsibleContractor}
                                        onChange={handleChange}
                                        placeholder='Enter Responsible Contractor'
                                        className={validationErrors.responsibleContractor ? " input-border" : "  "}
                                    />
                                    {validationErrors.responsibleContractor && (
                                        <small className="text-danger">{validationErrors.responsibleContractor}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="recommendation" className="mb-3">
                                    <Form.Label>recommendation*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="recommendation"
                                        value={messes.recommendation}
                                        onChange={handleChange}
                                        placeholder='Enter recommendation'
                                        className={validationErrors.recommendation ? " input-border" : "  "}
                                    />
                                    {validationErrors.recommendation && (
                                        <small className="text-danger">{validationErrors.recommendation}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="targetDate" className="mb-3">
                                    <Form.Label>Target Date*</Form.Label>
                                    <Flatpickr
                                        type="date"
                                        name="targetDate"
                                        value={messes.targetDate}
                                        onChange={(selectedDates) => handleDateChange("targetDate", selectedDates)}
                                        options={dateOptions}
                                        placeholder='Enter Target Date'
                                        className={validationErrors.targetDate ? "form-control input-border" : "form-control"}
                                    />
                                    {validationErrors.targetDate && (
                                        <small className="text-danger">{validationErrors.targetDate}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="allocatedLineIncharge" className="mb-3">
                                    <Form.Label>Allocated Line Incharge*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="allocatedLineIncharge"
                                        value={messes.allocatedLineIncharge}
                                        onChange={handleChange}
                                        placeholder='Enter Allocated Line Incharge'
                                        className={validationErrors.allocatedLineIncharge ? " input-border" : "  "}
                                    />
                                    {validationErrors.allocatedLineIncharge && (
                                        <small className="text-danger">{validationErrors.allocatedLineIncharge}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="severityRateLevel" className="mb-3">
                                    <Form.Label>Severity Rate Level*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="severityRateLevel"
                                        value={messes.severityRateLevel}
                                        onChange={handleChange}
                                        placeholder='Enter Severity Rate Level'
                                        className={validationErrors.severityRateLevel ? " input-border" : "  "}
                                    />
                                    {validationErrors.severityRateLevel && (
                                        <small className="text-danger">{validationErrors.severityRateLevel}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="uploadPhotograph" className="mb-3">
                                    <Form.Label>Upload Photograph*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="uploadPhotograph"
                                        value={messes.uploadPhotograph}
                                        onChange={handleChange}
                                        placeholder='Enter Upload Photograph'
                                        className={validationErrors.uploadPhotograph ? " input-border" : "  "}
                                    />
                                    {validationErrors.uploadPhotograph && (
                                        <small className="text-danger">{validationErrors.uploadPhotograph}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="approvedCorrectionPhotograph" className="mb-3">
                                    <Form.Label>Approved Correction Photograph*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="approvedCorrectionPhotograph"
                                        value={messes.approvedCorrectionPhotograph}
                                        onChange={handleChange}
                                        placeholder='Enter Approved Correction Photograph'
                                        className={validationErrors.approvedCorrectionPhotograph ? " input-border" : "  "}
                                    />
                                    {validationErrors.approvedCorrectionPhotograph && (
                                        <small className="text-danger">{validationErrors.approvedCorrectionPhotograph}</small>
                                    )}
                                </Form.Group>
                            </Col>
                           


                            <Col className='align-items-end d-flex justify-content-between mb-3'>
                                <div>
                                    <span className='fs-5 '>This field is required*</span>
                                </div>
                                <div>
                                    <Link to={'/pages/HSEObservationMaster'}>
                                        <Button variant="primary" >
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update HSEObservation' : 'Add HSEObservation'}
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

export default HSEObservationMasterAddEdit;