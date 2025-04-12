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
    helpTicketType: string,
    projectID: string,
    projectName: string,
    helpTicketCategory: string,
    module: string,
    process: string,
    helpTicketDescription: string,
    problemSolver: string,
    htRaisedBy: string,
    htCreationDatetime: string,
    htid: string,
    taskID: string,
    closureRemark: string,
    agreedResolutionDate: string,
    helpStatus: string,
    taskStatus: string,
    helpStatusUpdateDatetime: string,
    taskStatusUpdateDatetime: string,
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

const HelpTicketMasterAddEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [empName, setEmpName] = useState<string | null>('')
    const [, setProjectList] = useState<ProjectList[]>([])
    const [, setStatusList] = useState<Status[]>([])
    const [, setEmployeeList] = useState<EmployeeList[]>([])
    const [messes, setMesses] = useState<BTS_PAYMENT>({
        id: 0,
        helpTicketType: '',
        projectID: '',
        projectName: '',
        helpTicketCategory: '',
        module: '',
        process: '',
        helpTicketDescription: '',
        problemSolver: '',
        htRaisedBy: '',
        htCreationDatetime: '',
        htid: '',
        taskID: '',
        closureRemark: '',
        agreedResolutionDate: '',
        helpStatus: '',
        taskStatus: '',
        helpStatusUpdateDatetime: '',
        taskStatusUpdateDatetime: '',
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
            const response = await axios.get(`${config.API_URL_APPLICATION1}/HelpTicketMaster/GetHelpTicket/${id}`);
            console.log('response', response)
            if (response.data.isSuccess) {
                const fetchedModule = response.data.helpTicketMasters[0];
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

if(!messes.helpTicketType){ errors.helpTicketType = 'Help Ticket Type is required'}
if(!messes.projectID){ errors.projectID = 'Project ID is required'}
if(!messes.projectName){ errors.projectName = 'Project Name is required'}
if(!messes.helpTicketCategory){ errors.helpTicketCategory = 'Help Ticket Category is required'}
if(!messes.module){ errors.module = 'Module is required'}
if(!messes.process){ errors.process = 'Process is required'}
if(!messes.helpTicketDescription){ errors.helpTicketDescription = 'Help Ticket Description is required'}
if(!messes.problemSolver){ errors.problemSolver = 'Problem Solver is required'}
if(!messes.htRaisedBy){ errors.htRaisedBy = 'HT Raised By is required'}
if(!messes.htCreationDatetime){ errors.htCreationDatetime = 'HT Creation Datetime is required'}
if(!messes.htid){ errors.htid = 'HT id is required'}
if(!messes.taskID){ errors.taskID = 'Task ID is required'}
if(!messes.closureRemark){ errors.closureRemark = 'Closure Remark is required'}
if(!messes.agreedResolutionDate){ errors.agreedResolutionDate = 'Agreed Resolution Date is required'}
if(!messes.helpStatus){ errors.helpStatus = 'Help Status is required'}
if(!messes.taskStatus){ errors.taskStatus = 'Task Status is required'}
if(!messes.helpStatusUpdateDatetime){ errors.helpStatusUpdateDatetime = 'Help Status Update Datetime is required'}
if(!messes.taskStatusUpdateDatetime){ errors.taskStatusUpdateDatetime = 'Task Status Update Datetime is required'}



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
                await axios.put(`${config.API_URL_APPLICATION1}/HelpTicketMaster/UpdateHelpTicket/${id}`, payload);
                navigate('/pages/HelpTicketMaster', {
                    state: {
                        successMessage: "Challan Master Updated successfully!",
                    }
                });
            } else {
                await axios.post(`${config.API_URL_APPLICATION1}/HelpTicketMaster/CreateHelpTicket`, payload);
                navigate('/pages/HelpTicketMaster', {
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
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit HelpTicket Master' : 'Add HelpTicket Master'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>

                            <Col lg={6}>
                                <Form.Group controlId="helpTicketType" className="mb-3">
                                    <Form.Label>Help Ticket Type*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="helpTicketType"
                                        value={messes.helpTicketType}
                                        onChange={handleChange}
                                        placeholder='Enter Help Ticket Type'
                                        disabled={editMode}
                                        className={validationErrors.helpTicketType ? " input-border" : "  "}
                                    />
                                    {validationErrors.helpTicketType && (
                                        <small className="text-danger">{validationErrors.helpTicketType}</small>
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
                                <Form.Group controlId="helpTicketCategory" className="mb-3">
                                    <Form.Label>Help Ticket Category*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="helpTicketCategory"
                                        value={messes.helpTicketCategory}
                                        onChange={handleChange}
                                        placeholder='Enter Help Ticket Category'
                                        className={validationErrors.helpTicketCategory ? " input-border" : "  "}
                                    />
                                    {validationErrors.helpTicketCategory && (
                                        <small className="text-danger">{validationErrors.helpTicketCategory}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="module" className="mb-3">
                                    <Form.Label>Module*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="module"
                                        value={messes.module}
                                        placeholder='Enter Module'
                                        onChange={handleChange}
                                        className={validationErrors.module ? "input-border" : ""}
                                    />

                                    {validationErrors.module && (
                                        <small className="text-danger">{validationErrors.module}</small>
                                    )}
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="process" className="mb-3">
                                    <Form.Label>Process*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="process"
                                        value={messes.process}
                                        onChange={handleChange}
                                        placeholder='Enter Process'
                                        className={validationErrors.process ? " input-border" : "  "}
                                    />
                                    {validationErrors.process && (
                                        <small className="text-danger">{validationErrors.process}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="helpTicketDescription" className="mb-3">
                                    <Form.Label>Help Ticket Description*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="helpTicketDescription"
                                        value={messes.helpTicketDescription}
                                        onChange={handleChange}
                                        placeholder='Enter Help Ticket Description'
                                        className={validationErrors.helpTicketDescription ? " input-border" : "  "}
                                    />
                                    {validationErrors.helpTicketDescription && (
                                        <small className="text-danger">{validationErrors.helpTicketDescription}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="problemSolver" className="mb-3">
                                    <Form.Label>Problem Solver*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="problemSolver"
                                        value={messes.problemSolver}
                                        onChange={handleChange}
                                        placeholder='Enter Problem Solver'
                                        className={validationErrors.problemSolver ? " input-border" : "  "}
                                    />
                                    {validationErrors.problemSolver && (
                                        <small className="text-danger">{validationErrors.problemSolver}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="htRaisedBy" className="mb-3">
                                    <Form.Label>HT Raised By*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="htRaisedBy"
                                        value={messes.htRaisedBy}
                                        onChange={handleChange}
                                        placeholder='Enter HT Raised By'
                                        className={validationErrors.htRaisedBy ? " input-border" : "  "}
                                    />
                                    {validationErrors.htRaisedBy && (
                                        <small className="text-danger">{validationErrors.htRaisedBy}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="htCreationDatetime" className="mb-3">
                                    <Form.Label>HT Creation Datetime*</Form.Label>
                                    <Flatpickr
                                        type="text"
                                        name="htCreationDatetime"
                                        value={messes.htCreationDatetime}
                                        onChange={(selectedDates) => handleDateChange("htCreationDatetime", selectedDates)}
                                        placeholder='Enter HT Creation Datetime'
                                        options={dateOptions}
                                        className={validationErrors.htCreationDatetime ? "form-control input-border" : "form-control"}
                                    />
                                    {validationErrors.htCreationDatetime && (
                                        <small className="text-danger">{validationErrors.htCreationDatetime}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="htid" className="mb-3">
                                    <Form.Label>HT id*</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="htid"
                                        value={messes.htid}
                                        onChange={handleChange}
                                        placeholder='Enter HT id'
                                        className={validationErrors.htid ? " input-border" : "  "}
                                    />
                                    {validationErrors.htid && (
                                        <small className="text-danger">{validationErrors.htid}</small>
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
                                <Form.Group controlId="closureRemark" className="mb-3">
                                    <Form.Label>Closure Remark*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="closureRemark"
                                        value={messes.closureRemark}
                                        onChange={handleChange}
                                        placeholder='Enter Closure Remark'
                                        className={validationErrors.closureRemark ? " input-border" : "  "}
                                    />
                                    {validationErrors.closureRemark && (
                                        <small className="text-danger">{validationErrors.closureRemark}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="agreedResolutionDate" className="mb-3">
                                    <Form.Label>Agreed Resolution Date*</Form.Label>
                                    <Flatpickr
                                        name="agreedResolutionDate"
                                        value={messes.agreedResolutionDate}
                                        onChange={(selectedDates) => handleDateChange("agreedResolutionDate", selectedDates)}
                                        placeholder='Enter Agreed Resolution Date'
                                        options={dateOptions}
                                        className={validationErrors.agreedResolutionDate ? "form-control input-border" : "form-control"}
                                    />
                                    {validationErrors.agreedResolutionDate && (
                                        <small className="text-danger">{validationErrors.agreedResolutionDate}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="helpStatus" className="mb-3">
                                    <Form.Label>Help Status*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="helpStatus"
                                        value={messes.helpStatus}
                                        onChange={handleChange}
                                        placeholder='Enter Help Status'
                                        className={validationErrors.helpStatus ? " input-border" : "  "}
                                    />
                                    {validationErrors.helpStatus && (
                                        <small className="text-danger">{validationErrors.helpStatus}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="taskStatus" className="mb-3">
                                    <Form.Label>Task Status*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="taskStatus"
                                        value={messes.taskStatus}
                                        onChange={handleChange}
                                        placeholder='Enter Task Status'
                                        className={validationErrors.taskStatus ? " input-border" : "  "}
                                    />
                                    {validationErrors.taskStatus && (
                                        <small className="text-danger">{validationErrors.taskStatus}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="helpStatusUpdateDatetime" className="mb-3">
                                    <Form.Label>Help Status Update Datetime*</Form.Label>
                                    <Flatpickr
                                        name="helpStatusUpdateDatetime"
                                        value={messes.helpStatusUpdateDatetime}
                                        onChange={(selectedDates) => handleDateChange("helpStatusUpdateDatetime", selectedDates)}
                                        placeholder='Enter Help Status Update Datetime'
                                        options={dateOptions}
                                        className={validationErrors.helpStatusUpdateDatetime ? "form-control input-border" : "form-control"}
                                    />
                                    {validationErrors.helpStatusUpdateDatetime && (
                                        <small className="text-danger">{validationErrors.helpStatusUpdateDatetime}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="taskStatusUpdateDatetime" className="mb-3">
                                    <Form.Label>Task Status Update Datetime*</Form.Label>
                                    <Flatpickr
                                        type="text"
                                        name="taskStatusUpdateDatetime"
                                        value={messes.taskStatusUpdateDatetime}
                                        onChange={(selectedDates) => handleDateChange("taskStatusUpdateDatetime", selectedDates)}
                                        placeholder='Enter Task Status Update Datetime'
                                        options={dateOptions}
                                        className={validationErrors.taskStatusUpdateDatetime ? "form-control input-border" : "form-control"}
                                    />
                                    {validationErrors.taskStatusUpdateDatetime && (
                                        <small className="text-danger">{validationErrors.taskStatusUpdateDatetime}</small>
                                    )}
                                </Form.Group>
                            </Col>








                            <Col className='align-items-end d-flex justify-content-between mb-3'>
                                <div>
                                    <span className='fs-5 '>This field is required*</span>
                                </div>
                                <div>
                                    <Link to={'/pages/HelpTicketMaster'}>
                                        <Button variant="primary" >
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update HelpTicket' : 'Add HelpTicket'}
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

export default HelpTicketMasterAddEdit;