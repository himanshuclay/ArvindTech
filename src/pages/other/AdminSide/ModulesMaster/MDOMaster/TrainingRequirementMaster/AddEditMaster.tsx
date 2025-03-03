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
    trainingRequirementDate: string,
    employeeName: string,
    employeeID: string,
    projectID: string,
    projectName: string,
    hrUpdatedMobile: string,
    userUpdatedMobile: string,
    trainingRequirementDescription: string,
    trainingID: string,
    opsTrainingStatus: string,
    dmeTrainingStatus: string,
    finalCompletionStatus: string,
    opsTrainingDatetime: string,
    dmeTrainingDatetime: string,
    finalTrainingDatetime: string,
    trainingRemarks: string,
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

const TrainingRequirementMasterAddEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [empName, setEmpName] = useState<string | null>('')
    const [, setProjectList] = useState<ProjectList[]>([])
    const [, setStatusList] = useState<Status[]>([])
    const [, setEmployeeList] = useState<EmployeeList[]>([])
    const [messes, setMesses] = useState<BTS_PAYMENT>({
        id: 0,
        trainingRequirementDate: '',
        employeeName: '',
        employeeID: '',
        projectID: '',
        projectName: '',
        hrUpdatedMobile: '',
        userUpdatedMobile: '',
        trainingRequirementDescription: '',
        trainingID: '',
        opsTrainingStatus: '',
        dmeTrainingStatus: '',
        finalCompletionStatus: '',
        opsTrainingDatetime: '',
        dmeTrainingDatetime: '',
        finalTrainingDatetime: '',
        trainingRemarks: '',
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
            const response = await axios.get(`${config.API_URL_APPLICATION1}/TrainingRequirementMaster/GetTrainingRequirement/${id}`);
            console.log('response', response)
            if (response.data.isSuccess) {
                const fetchedModule = response.data.trainingRequirementMasters[0];
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

        if (!messes.trainingRequirementDate) { errors.trainingRequirementDate = 'trainingRequirementDate is required' }
        if (!messes.employeeName) { errors.employeeName = 'employeeName is required' }
        if (!messes.employeeID) { errors.employeeID = 'employeeID is required' }
        if (!messes.projectID) { errors.projectID = 'projectID is required' }
        if (!messes.projectName) { errors.projectName = 'projectName is required' }
        if (!messes.hrUpdatedMobile) { errors.hrUpdatedMobile = 'hrUpdatedMobile is required' }
        if (!messes.userUpdatedMobile) { errors.userUpdatedMobile = 'userUpdatedMobile is required' }
        if (!messes.trainingRequirementDescription) { errors.trainingRequirementDescription = 'trainingRequirementDescription is required' }
        if (!messes.trainingID) { errors.trainingID = 'trainingID is required' }
        if (!messes.opsTrainingStatus) { errors.opsTrainingStatus = 'opsTrainingStatus is required' }
        if (!messes.dmeTrainingStatus) { errors.dmeTrainingStatus = 'dmeTrainingStatus is required' }
        if (!messes.finalCompletionStatus) { errors.finalCompletionStatus = 'finalCompletionStatus is required' }
        if (!messes.opsTrainingDatetime) { errors.opsTrainingDatetime = 'opsTrainingDatetime is required' }
        if (!messes.dmeTrainingDatetime) { errors.dmeTrainingDatetime = 'dmeTrainingDatetime is required' }
        if (!messes.finalTrainingDatetime) { errors.finalTrainingDatetime = 'finalTrainingDatetime is required' }
        if (!messes.trainingRemarks) { errors.trainingRemarks = 'trainingRemarks is required' }
        


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
                if (['userUpdatedMobile', 'hrUpdatedMobile'].includes(eventName)) {
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
                await axios.put(`${config.API_URL_APPLICATION1}/TrainingRequirementMaster/UpdateTrainingRequirement/${id}`, payload);
                navigate('/pages/TrainingRequirementMaster', {
                    state: {
                        successMessage: "Challan Master Updated successfully!",
                    }
                });
            } else {
                await axios.post(`${config.API_URL_APPLICATION1}/TrainingRequirementMaster/CreateTrainingRequirement`, payload);
                navigate('/pages/TrainingRequirementMaster', {
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
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit TrainingRequirement Master' : 'Add TrainingRequirement Master'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>

                            <Col lg={6}>
                                <Form.Group controlId="trainingRequirementDate" className="mb-3">
                                    <Form.Label>Training Requirement Date*</Form.Label>
                                    <Flatpickr
                                        type="number"
                                        name="trainingRequirementDate"
                                        value={messes.trainingRequirementDate}
                                        onChange={(selectedDates) => handleDateChange("trainingRequirementDate", selectedDates)}
                                        placeholder='Enter Training Requirement Date'
                                        options={dateOptions}
                                        disabled={editMode}
                                        className={validationErrors.trainingRequirementDate ? "form-control input-border" : "form-control"}
                                    />
                                    {validationErrors.trainingRequirementDate && (
                                        <small className="text-danger">{validationErrors.trainingRequirementDate}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="employeeName" className="mb-3">
                                    <Form.Label>Employee Name*</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="employeeName"
                                        value={messes.employeeName}
                                        onChange={handleChange}
                                        placeholder='Enter Employee Name'
                                        disabled={editMode}
                                        className={validationErrors.employeeName ? " input-border" : "  "}
                                    />
                                    {validationErrors.employeeName && (
                                        <small className="text-danger">{validationErrors.employeeName}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="employeeID" className="mb-3">
                                    <Form.Label>Employee ID*</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="employeeID"
                                        value={messes.employeeID}
                                        onChange={handleChange}
                                        placeholder='Enter Employee ID'
                                        className={validationErrors.employeeID ? " input-border" : "  "}
                                    />
                                    {validationErrors.employeeID && (
                                        <small className="text-danger">{validationErrors.employeeID}</small>
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
                                        className={validationErrors.projectName ? "input-border" : ""}
                                    />

                                    {validationErrors.projectName && (
                                        <small className="text-danger">{validationErrors.projectName}</small>
                                    )}
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="hrUpdatedMobile" className="mb-3">
                                    <Form.Label>HR Updated Mobile*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="hrUpdatedMobile"
                                        value={messes.hrUpdatedMobile}
                                        onChange={handleChange}
                                        placeholder='Enter HR Updated Mobile'
                                        className={validationErrors.hrUpdatedMobile ? " input-border" : "  "}
                                    />
                                    {validationErrors.hrUpdatedMobile && (
                                        <small className="text-danger">{validationErrors.hrUpdatedMobile}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="userUpdatedMobile" className="mb-3">
                                    <Form.Label>User Updated Mobile*</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="userUpdatedMobile"
                                        value={messes.userUpdatedMobile}
                                        onChange={handleChange}
                                        placeholder='Enter User Updated Mobile'
                                        className={validationErrors.userUpdatedMobile ? " input-border" : "  "}
                                    />
                                    {validationErrors.userUpdatedMobile && (
                                        <small className="text-danger">{validationErrors.userUpdatedMobile}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="trainingRequirementDescription" className="mb-3">
                                    <Form.Label>Training Requirement Description*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="trainingRequirementDescription"
                                        value={messes.trainingRequirementDescription}
                                        onChange={handleChange}
                                        placeholder='Enter Training Requirement Description'
                                        className={validationErrors.trainingRequirementDescription ? " input-border" : "  "}
                                    />
                                    {validationErrors.trainingRequirementDescription && (
                                        <small className="text-danger">{validationErrors.trainingRequirementDescription}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="trainingID" className="mb-3">
                                    <Form.Label>Training ID*</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="trainingID"
                                        value={messes.trainingID}
                                        onChange={handleChange}
                                        placeholder='Enter Training ID'
                                        className={validationErrors.trainingID ? " input-border" : "  "}
                                    />
                                    {validationErrors.trainingID && (
                                        <small className="text-danger">{validationErrors.trainingID}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="opsTrainingStatus" className="mb-3">
                                    <Form.Label>Ops Training Status*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="opsTrainingStatus"
                                        value={messes.opsTrainingStatus}
                                        onChange={handleChange}
                                        placeholder='Enter Ops Training Status'
                                        className={validationErrors.opsTrainingStatus ? " input-border" : "  "}
                                    />
                                    {validationErrors.opsTrainingStatus && (
                                        <small className="text-danger">{validationErrors.opsTrainingStatus}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            
                            
                            
                            <Col lg={6}>
                                <Form.Group controlId="dmeTrainingStatus" className="mb-3">
                                    <Form.Label>Dme Training Status*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="dmeTrainingStatus"
                                        value={messes.dmeTrainingStatus}
                                        onChange={handleChange}
                                        placeholder='Enter Dme Training Status'
                                        className={validationErrors.dmeTrainingStatus ? " input-border" : "  "}
                                    />
                                    {validationErrors.dmeTrainingStatus && (
                                        <small className="text-danger">{validationErrors.dmeTrainingStatus}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="finalCompletionStatus" className="mb-3">
                                    <Form.Label>Final Completion Status*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="finalCompletionStatus"
                                        value={messes.finalCompletionStatus}
                                        onChange={handleChange}
                                        placeholder='Enter Final Completion Status'
                                        className={validationErrors.finalCompletionStatus ? " input-border" : "  "}
                                    />
                                    {validationErrors.finalCompletionStatus && (
                                        <small className="text-danger">{validationErrors.finalCompletionStatus}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="opsTrainingDatetime" className="mb-3">
                                    <Form.Label>Ops Training Datetime*</Form.Label>
                                    <Flatpickr
                                        type="text"
                                        name="opsTrainingDatetime"
                                        value={messes.opsTrainingDatetime}
                                        onChange={(selectedDates) => handleDateChange("opsTrainingDatetime", selectedDates)}
                                        options={dateOptions}
                                        placeholder='Enter Ops Training Datetime'
                                        className={validationErrors.opsTrainingDatetime ? "form-control input-border" : "form-control"}
                                    />
                                    {validationErrors.opsTrainingDatetime && (
                                        <small className="text-danger">{validationErrors.opsTrainingDatetime}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="dmeTrainingDatetime" className="mb-3">
                                    <Form.Label>Dme Training Datetime*</Form.Label>
                                    <Flatpickr
                                        type="text"
                                        name="dmeTrainingDatetime"
                                        value={messes.dmeTrainingDatetime}
                                        onChange={(selectedDates) => handleDateChange("dmeTrainingDatetime", selectedDates)}
                                        options={dateOptions}
                                        placeholder='Enter Dme Training Datetime'
                                        className={validationErrors.dmeTrainingDatetime ? "form-control input-border" : "form-control"}
                                    />
                                    {validationErrors.dmeTrainingDatetime && (
                                        <small className="text-danger">{validationErrors.dmeTrainingDatetime}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="finalTrainingDatetime" className="mb-3">
                                    <Form.Label>Final Training Datetime*</Form.Label>
                                    <Flatpickr
                                        type="text"
                                        name="finalTrainingDatetime"
                                        value={messes.finalTrainingDatetime}
                                        onChange={(selectedDates) => handleDateChange("finalTrainingDatetime", selectedDates)}
                                        options={dateOptions}
                                        placeholder='Enter Final Training Datetime'
                                        className={validationErrors.finalTrainingDatetime ? "form-control input-border" : "form-control"}
                                    />
                                    {validationErrors.finalTrainingDatetime && (
                                        <small className="text-danger">{validationErrors.finalTrainingDatetime}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="trainingRemarks" className="mb-3">
                                    <Form.Label>Training Remarks*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="trainingRemarks"
                                        value={messes.trainingRemarks}
                                        onChange={handleChange}
                                        placeholder='Enter Training Remarks'
                                        className={validationErrors.trainingRemarks ? " input-border" : "  "}
                                    />
                                    {validationErrors.trainingRemarks && (
                                        <small className="text-danger">{validationErrors.trainingRemarks}</small>
                                    )}
                                </Form.Group>
                            </Col>








                            <Col className='align-items-end d-flex justify-content-between mb-3'>
                                <div>
                                    <span className='fs-5 '>This field is required*</span>
                                </div>
                                <div>
                                    <Link to={'/pages/TrainingRequirementMaster'}>
                                        <Button variant="primary" >
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update TrainingRequirement' : 'Add TrainingRequirement'}
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

export default TrainingRequirementMasterAddEdit;