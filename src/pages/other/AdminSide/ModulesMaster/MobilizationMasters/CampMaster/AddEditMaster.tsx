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
    workStartDate: string,
    noOfCampsRequired: string,
    campPlanLocation: string,
    campChainage: string,
    minimumLength: number,
    minimumWidth: number,
    completionofCampConstruction: string,
    statusDate: string,
    createdDate: string,
    createdBy: string,
    updatedDate: string,
    updatedBy: string
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

const CampMasterAddEdit = () => {
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
        workStartDate: '',
        noOfCampsRequired: '',
        campPlanLocation: '',
        campChainage: '',
        minimumLength: 0,
        minimumWidth: 0,
        completionofCampConstruction: '',
        statusDate: '',
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
            const response = await axios.get(`${config.API_URL_APPLICATION1}/CampMaster/GetCamp/${id}`);
            console.log('response', response)
            if (response.data.isSuccess) {
                const fetchedModule = response.data.campMasters[0];
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


        if (!messes.projectID) { errors.projectID = 'Project ID is required' }
        if (!messes.projectName) { errors.projectName = 'Project Name is required' }
        if (!messes.workStartDate) { errors.workStartDate = 'Work Start Date is required' }
        if (!messes.noOfCampsRequired) { errors.noOfCampsRequired = 'No Of Camps Required is required' }
        if (!messes.campPlanLocation) { errors.campPlanLocation = 'Camp Plan Location is required' }
        if (!messes.campChainage) { errors.campChainage = 'Camp Chainage is required' }
        if (!messes.minimumLength) { errors.minimumLength = 'Minimum Length is required' }
        if (!messes.minimumWidth) { errors.minimumWidth = 'Minimum Width is required' }
        if (!messes.completionofCampConstruction) { errors.completionofCampConstruction = 'Completion of Camp Construction is required' }
        if (!messes.statusDate) { errors.statusDate = 'Status Date is required' }


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
                await axios.put(`${config.API_URL_APPLICATION1}/CampMaster/UpdateCamp/${id}`, payload);
                navigate('/pages/CampMaster', {
                    state: {
                        successMessage: "Challan Master Updated successfully!",
                    }
                });
            } else {
                await axios.post(`${config.API_URL_APPLICATION1}/CampMaster/CreateCamp`, payload);
                navigate('/pages/CampMaster', {
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
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit Camp Master' : 'Add Camp Master'}</span></span>
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
                                        placeholder='Enter project ID'
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
                                        disabled={editMode}
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
                                        type="text"
                                        name="workStartDate"
                                        value={messes.workStartDate}
                                        onChange={(selectedDates) => handleDateChange("date", selectedDates)}
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
                                <Form.Group controlId="noOfCampsRequired" className="mb-3">
                                    <Form.Label>No Of Camps Required*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="noOfCampsRequired"
                                        value={messes.noOfCampsRequired}
                                        onChange={handleChange}
                                        placeholder='Enter No Of Camps Required'
                                        className={validationErrors.noOfCampsRequired ? " input-border" : "  "}
                                    />
                                    {validationErrors.noOfCampsRequired && (
                                        <small className="text-danger">{validationErrors.noOfCampsRequired}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="campPlanLocation" className="mb-3">
                                    <Form.Label>Camp Plan Location*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="campPlanLocation"
                                        placeholder='Enter Camp Plan Location'
                                        value={messes.campPlanLocation}
                                        onChange={handleChange}
                                        className={validationErrors.campPlanLocation ? "input-border" : ""}
                                    />

                                    {validationErrors.campPlanLocation && (
                                        <small className="text-danger">{validationErrors.campPlanLocation}</small>
                                    )}
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="campChainage" className="mb-3">
                                    <Form.Label>Camp Chainage*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="campChainage"
                                        value={messes.campChainage}
                                        onChange={handleChange}
                                        placeholder='Enter Camp Chainage'
                                        className={validationErrors.campChainage ? " input-border" : "  "}
                                    />
                                    {validationErrors.campChainage && (
                                        <small className="text-danger">{validationErrors.campChainage}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="minimumLength" className="mb-3">
                                    <Form.Label>Minimum Length*</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="minimumLength"
                                        value={messes.minimumLength}
                                        onChange={handleChange}
                                        placeholder='Enter Minimum Length'
                                        className={validationErrors.minimumLength ? " input-border" : "  "}
                                    />
                                    {validationErrors.minimumLength && (
                                        <small className="text-danger">{validationErrors.minimumLength}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="minimumWidth" className="mb-3">
                                    <Form.Label>Minimum Width*</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="minimumWidth"
                                        value={messes.minimumWidth}
                                        onChange={handleChange}
                                        placeholder='Enter Minimum Width'
                                        className={validationErrors.minimumWidth ? " input-border" : "  "}
                                    />
                                    {validationErrors.minimumWidth && (
                                        <small className="text-danger">{validationErrors.minimumWidth}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="completionofCampConstruction" className="mb-3">
                                    <Form.Label>Completion of Camp Construction*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="completionofCampConstruction"
                                        value={messes.completionofCampConstruction}
                                        onChange={handleChange}
                                        placeholder='Enter Completion of Camp Construction'
                                        className={validationErrors.completionofCampConstruction ? " input-border" : "  "}
                                    />
                                    {validationErrors.completionofCampConstruction && (
                                        <small className="text-danger">{validationErrors.completionofCampConstruction}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="statusDate" className="mb-3">
                                    <Form.Label>Status Date*</Form.Label>
                                    <Flatpickr
                                        type="date"
                                        name="statusDate"
                                        value={messes.statusDate}
                                        onChange={(selectedDates) => handleDateChange("statusDate", selectedDates)}
                                        options={dateOptions}
                                        placeholder='Enter Status Date'
                                        className={validationErrors.statusDate ? " input-border" : "  "}
                                    />
                                    {validationErrors.statusDate && (
                                        <small className="text-danger">{validationErrors.statusDate}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            






                            <Col className='align-items-end d-flex justify-content-between mb-3'>
                                <div>
                                    <span className='fs-5 '>This field is required*</span>
                                </div>
                                <div>
                                    <Link to={'/pages/CampMaster'}>
                                        <Button variant="primary" >
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update Camp' : 'Add Camp'}
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

export default CampMasterAddEdit;