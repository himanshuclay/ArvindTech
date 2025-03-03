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
appHelpCategory: string,
projectID: string,
projectName: string,
moduleID: string,
processID: string,
taskID: string,
lineItemID: string,
appHelpContent: string,
requestedInput: string,
appHelpRaisedBy: string,
appHelpCreationDatetime: string,
appHelpID: string,
appHelpStatus: string,
appHelpLevel: string,
lastStatusUpdate: string,
closureRemarks: string,
haEandResolutionDate: string,
historicalRemarks: string,
trainingRequirement: string,
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

const AppHelpMasterAddEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [empName, setEmpName] = useState<string | null>('')
    const [, setProjectList] = useState<ProjectList[]>([])
    const [, setStatusList] = useState<Status[]>([])
    const [, setEmployeeList] = useState<EmployeeList[]>([])
    const [messes, setMesses] = useState<BTS_PAYMENT>({
        id: 0,
        appHelpCategory: '',
        projectID: '',
        projectName: '',
        moduleID: '',
        processID: '',
        taskID: '',
        lineItemID: '',
        appHelpContent: '',
        requestedInput: '',
        appHelpRaisedBy: '',
        appHelpCreationDatetime: '',
        appHelpID: '',
        appHelpStatus: '',
        appHelpLevel: '',
        lastStatusUpdate: '',
        closureRemarks: '',
        haEandResolutionDate: '',
        historicalRemarks: '',
        trainingRequirement: '',
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
            const response = await axios.get(`${config.API_URL_APPLICATION1}/AppHelpMaster/GetAppHelp/${id}`);
            console.log('response', response)
            if (response.data.isSuccess) {
                const fetchedModule = response.data.appHelpMasters[0];
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

if(!messes.appHelpCategory){ errors.appHelpCategory = 'App Help Category is required'}
if(!messes.projectID){ errors.projectID = 'Project ID is required'}
if(!messes.projectName){ errors.projectName = 'Project Name is required'}
if(!messes.moduleID){ errors.moduleID = 'Module ID is required'}
if(!messes.processID){ errors.processID = 'Process ID is required'}
if(!messes.taskID){ errors.taskID = 'Task ID is required'}
if(!messes.lineItemID){ errors.lineItemID = 'Line Item ID is required'}
if(!messes.appHelpContent){ errors.appHelpContent = 'App Help Content is required'}
if(!messes.requestedInput){ errors.requestedInput = 'Requested Input is required'}
if(!messes.appHelpRaisedBy){ errors.appHelpRaisedBy = 'App Help Raised By is required'}
if(!messes.appHelpCreationDatetime){ errors.appHelpCreationDatetime = 'App Help Creation Datetime is required'}
if(!messes.appHelpID){ errors.appHelpID = 'App Help ID is required'}
if(!messes.appHelpStatus){ errors.appHelpStatus = 'App Help Status is required'}
if(!messes.appHelpLevel){ errors.appHelpLevel = 'App Help Level is required'}
if(!messes.lastStatusUpdate){ errors.lastStatusUpdate = 'Last Status Update is required'}
if(!messes.closureRemarks){ errors.closureRemarks = 'Closure Remarks is required'}
if(!messes.haEandResolutionDate){ errors.haEandResolutionDate = 'HAE and Resolution Date is required'}
if(!messes.historicalRemarks){ errors.historicalRemarks = 'Historical Remarks is required'}
if(!messes.trainingRequirement){ errors.trainingRequirement = 'Training Requirement is required'}



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
                await axios.put(`${config.API_URL_APPLICATION1}/AppHelpMaster/UpdateAppHelp/${id}`, payload);
                navigate('/pages/AppHelpMaster', {
                    state: {
                        successMessage: "Challan Master Updated successfully!",
                    }
                });
            } else {
                await axios.post(`${config.API_URL_APPLICATION1}/AppHelpMaster/CreateAppHelp`, payload);
                navigate('/pages/AppHelpMaster', {
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
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit AppHelp Master' : 'Add AppHelp Master'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>

                            <Col lg={6}>
                                <Form.Group controlId="appHelpCategory" className="mb-3">
                                    <Form.Label>App Help Category*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="appHelpCategory"
                                        value={messes.appHelpCategory}
                                        onChange={handleChange}
                                        placeholder='Enter App Help Category'
                                        disabled={editMode}
                                        className={validationErrors.appHelpCategory ? " input-border" : "  "}
                                    />
                                    {validationErrors.appHelpCategory && (
                                        <small className="text-danger">{validationErrors.appHelpCategory}</small>
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
                                <Form.Group controlId="moduleID" className="mb-3">
                                    <Form.Label>Module ID*</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="moduleID"
                                        value={messes.moduleID}
                                        onChange={handleChange}
                                        placeholder='Enter Module Id'
                                        className={validationErrors.moduleID ? " input-border" : "  "}
                                    />
                                    {validationErrors.moduleID && (
                                        <small className="text-danger">{validationErrors.moduleID}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="processID" className="mb-3">
                                    <Form.Label>Process ID*</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="processID"
                                        value={messes.processID}
                                        onChange={handleChange}
                                        placeholder='Enter Process ID'
                                        className={validationErrors.processID ? "input-border" : ""}
                                    />

                                    {validationErrors.processID && (
                                        <small className="text-danger">{validationErrors.processID}</small>
                                    )}
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="taskID" className="mb-3">
                                    <Form.Label>Task ID*</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="taskID"
                                        value={messes.taskID}
                                        onChange={handleChange}
                                        placeholder='Enter Task ID'
                                        className={validationErrors.taskID ? " input-border" : "  "}
                                    />
                                    {validationErrors.taskID && (
                                        <small className="text-danger">{validationErrors.taskID}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="lineItemID" className="mb-3">
                                    <Form.Label>Line Item ID*</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="lineItemID"
                                        value={messes.lineItemID}
                                        onChange={handleChange}
                                        placeholder='Enter Line Item ID'
                                        className={validationErrors.lineItemID ? " input-border" : "  "}
                                    />
                                    {validationErrors.lineItemID && (
                                        <small className="text-danger">{validationErrors.lineItemID}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="appHelpContent" className="mb-3">
                                    <Form.Label>App Help Content*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="appHelpContent"
                                        value={messes.appHelpContent}
                                        onChange={handleChange}
                                        placeholder='Enter App Help Content'
                                        className={validationErrors.appHelpContent ? " input-border" : "  "}
                                    />
                                    {validationErrors.appHelpContent && (
                                        <small className="text-danger">{validationErrors.appHelpContent}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="requestedInput" className="mb-3">
                                    <Form.Label>Requested Input*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="requestedInput"
                                        value={messes.requestedInput}
                                        onChange={handleChange}
                                        placeholder='Enter Requested Input'
                                        className={validationErrors.requestedInput ? " input-border" : "  "}
                                    />
                                    {validationErrors.requestedInput && (
                                        <small className="text-danger">{validationErrors.requestedInput}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="appHelpRaisedBy" className="mb-3">
                                    <Form.Label>App Help Raised By*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="appHelpRaisedBy"
                                        value={messes.appHelpRaisedBy}
                                        onChange={handleChange}
                                        placeholder='Enter App Help Raised By'
                                        className={validationErrors.appHelpRaisedBy ? " input-border" : "  "}
                                    />
                                    {validationErrors.appHelpRaisedBy && (
                                        <small className="text-danger">{validationErrors.appHelpRaisedBy}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="appHelpCreationDatetime" className="mb-3">
                                    <Form.Label>App Help Creation Date time*</Form.Label>
                                    <Flatpickr
                                        type="text"
                                        name="appHelpCreationDatetime"
                                        value={messes.appHelpCreationDatetime}
                                        onChange={(selectedDates) => handleDateChange("appHelpCreationDatetime", selectedDates)}
                                        options={dateOptions}
                                        placeholder='Enter App Help Creation Date time'
                                        className={validationErrors.appHelpCreationDatetime ? "form-control input-border" : "form-control"}
                                    />
                                    {validationErrors.appHelpCreationDatetime && (
                                        <small className="text-danger">{validationErrors.appHelpCreationDatetime}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="appHelpID" className="mb-3">
                                    <Form.Label>App Help ID*</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="appHelpID"
                                        value={messes.appHelpID}
                                        onChange={handleChange}
                                        placeholder='Enter App Help ID'
                                        className={validationErrors.appHelpID ? " input-border" : "  "}
                                    />
                                    {validationErrors.appHelpID && (
                                        <small className="text-danger">{validationErrors.appHelpID}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="appHelpStatus" className="mb-3">
                                    <Form.Label>App Help Status*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="appHelpStatus"
                                        value={messes.appHelpStatus}
                                        onChange={handleChange}
                                        placeholder='Enter App Help Status'
                                        className={validationErrors.appHelpStatus ? " input-border" : "  "}
                                    />
                                    {validationErrors.appHelpStatus && (
                                        <small className="text-danger">{validationErrors.appHelpStatus}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="appHelpLevel" className="mb-3">
                                    <Form.Label>App Help Level*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="appHelpLevel"
                                        value={messes.appHelpLevel}
                                        onChange={handleChange}
                                        placeholder='Enter App Help Level'
                                        className={validationErrors.appHelpLevel ? " input-border" : "  "}
                                    />
                                    {validationErrors.appHelpLevel && (
                                        <small className="text-danger">{validationErrors.appHelpLevel}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="lastStatusUpdate" className="mb-3">
                                    <Form.Label>Last Status Update*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="lastStatusUpdate"
                                        value={messes.lastStatusUpdate}
                                        onChange={handleChange}
                                        placeholder='Enter Last Status Update'
                                        className={validationErrors.lastStatusUpdate ? " input-border" : "  "}
                                    />
                                    {validationErrors.lastStatusUpdate && (
                                        <small className="text-danger">{validationErrors.lastStatusUpdate}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="closureRemarks" className="mb-3">
                                    <Form.Label>Closure Remarks*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="closureRemarks"
                                        value={messes.closureRemarks}
                                        onChange={handleChange}
                                        placeholder='Enter Closure Remarks'
                                        className={validationErrors.closureRemarks ? " input-border" : "  "}
                                    />
                                    {validationErrors.closureRemarks && (
                                        <small className="text-danger">{validationErrors.closureRemarks}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="haEandResolutionDate" className="mb-3">
                                    <Form.Label>HAE and Resolution Date*</Form.Label>
                                    <Flatpickr
                                        type="text"
                                        name="haEandResolutionDate"
                                        value={messes.haEandResolutionDate}
                                        onChange={(selectedDates) => handleDateChange("haEandResolutionDate", selectedDates)}
                                        placeholder='Enter HAE and Resolution Date'
                                        options={dateOptions}
                                        className={validationErrors.haEandResolutionDate ? "form-control input-border" : "form-control"}
                                    />
                                    {validationErrors.haEandResolutionDate && (
                                        <small className="text-danger">{validationErrors.haEandResolutionDate}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="historicalRemarks" className="mb-3">
                                    <Form.Label>Historical Remarks*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="historicalRemarks"
                                        value={messes.historicalRemarks}
                                        onChange={handleChange}
                                        placeholder='Enter Historical Remarks'
                                        className={validationErrors.historicalRemarks ? " input-border" : "  "}
                                    />
                                    {validationErrors.historicalRemarks && (
                                        <small className="text-danger">{validationErrors.historicalRemarks}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="trainingRequirement" className="mb-3">
                                    <Form.Label>Training Requirement*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="trainingRequirement"
                                        value={messes.trainingRequirement}
                                        onChange={handleChange}
                                        placeholder='Enter Training Requirement'
                                        className={validationErrors.trainingRequirement ? " input-border" : "  "}
                                    />
                                    {validationErrors.trainingRequirement && (
                                        <small className="text-danger">{validationErrors.trainingRequirement}</small>
                                    )}
                                </Form.Group>
                            </Col>








                            <Col className='align-items-end d-flex justify-content-between mb-3'>
                                <div>
                                    <span className='fs-5 '>This field is required*</span>
                                </div>
                                <div>
                                    <Link to={'/pages/AppHelpMaster'}>
                                        <Button variant="primary" >
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update AppHelp' : 'Add AppHelp'}
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

export default AppHelpMasterAddEdit;