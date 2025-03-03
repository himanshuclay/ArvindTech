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
    moduleID: string,
    moduleName: string,
    delegationPriority: string,
    delegationRemarks: string,
    delegationDescription: string,
    allocatedEmployee: string,
    delegationRaisedby: string,
    delegationCreationDatetime: string,
    delegationID: string,
    taskID: string,
    closureRemark: string,
    assignedDate: string,
    inputRequired: string,
    delegationStatus: string,
    taskStatus: string,
    delegationStatusUpdateDatetime: string,
    taskStatusUpdateDatetime: string,
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

const DelegationMasterAddEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [empName, setEmpName] = useState<string | null>('')
    const [, setProjectList] = useState<ProjectList[]>([])
    const [, setStatusList] = useState<Status[]>([])
    const [, setEmployeeList] = useState<EmployeeList[]>([])
    const [messes, setMesses] = useState<BTS_PAYMENT>({
        id: 0,
        moduleID: '',
        moduleName: '',
        delegationPriority: '',
        delegationRemarks: '',
        delegationDescription: '',
        allocatedEmployee: '',
        delegationRaisedby: '',
        delegationCreationDatetime: '',
        delegationID: '',
        taskID: '',
        closureRemark: '',
        assignedDate: '',
        inputRequired: '',
        delegationStatus: '',
        taskStatus: '',
        delegationStatusUpdateDatetime: '',
        taskStatusUpdateDatetime: '',
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
            const response = await axios.get(`${config.API_URL_APPLICATION1}/DelegationMaster/GetDelegation/${id}`);
            console.log('response', response)
            if (response.data.isSuccess) {
                const fetchedModule = response.data.delegationMasters[0];
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


        if (!messes.moduleID) { errors.moduleID = 'Module ID is required' }
        if (!messes.moduleName) { errors.moduleName = 'Module Name is required' }
        if (!messes.delegationPriority) { errors.delegationPriority = 'Delegation Priority is required' }
        if (!messes.delegationRemarks) { errors.delegationRemarks = 'Delegation Remarks is required' }
        if (!messes.delegationDescription) { errors.delegationDescription = 'Delegation Description is required' }
        if (!messes.allocatedEmployee) { errors.allocatedEmployee = 'Allocated Employee is required' }
        if (!messes.delegationRaisedby) { errors.delegationRaisedby = 'Delegation Raisedby is required' }
        if (!messes.delegationCreationDatetime) { errors.delegationCreationDatetime = 'Delegation Creation Datetime is required' }
        if (!messes.delegationID) { errors.delegationID = 'Delegation ID is required' }
        if (!messes.taskID) { errors.taskID = 'Task ID is required' }
        if (!messes.closureRemark) { errors.closureRemark = 'Closure Remark is required' }
        if (!messes.assignedDate) { errors.assignedDate = 'Assigned Date is required' }
        if (!messes.inputRequired) { errors.inputRequired = 'Input Required is required' }
        if (!messes.delegationStatus) { errors.delegationStatus = 'Delegation Status is required' }
        if (!messes.taskStatus) { errors.taskStatus = 'Task Status is required' }
        if (!messes.delegationStatusUpdateDatetime) { errors.delegationStatusUpdateDatetime = 'Delegation Status Update Datetime is required' }
        if (!messes.taskStatusUpdateDatetime) { errors.taskStatusUpdateDatetime = 'Task Status Update Datetime is required' }



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
                    await axios.put(`${config.API_URL_APPLICATION1}/DelegationMaster/UpdateDelegation/${id}`, payload);
                    navigate('/pages/DelegationMaster', {
                        state: {
                            successMessage: "Challan Master Updated successfully!",
                        }
                    });
                } else {
                    await axios.post(`${config.API_URL_APPLICATION1}/DelegationMaster/CreateDelegation`, payload);
                    navigate('/pages/DelegationMaster', {
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
                        <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit Delegation Master' : 'Add Delegation Master'}</span></span>
                    </div>
                    <div className='bg-white p-2 rounded-3 border'>
                        <Form onSubmit={handleSubmit}>
                            <Row>

                                <Col lg={6}>
                                    <Form.Group controlId="moduleID" className="mb-3">
                                        <Form.Label>Module ID*</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="moduleID"
                                            value={messes.moduleID}
                                            onChange={handleChange}
                                            placeholder='Enter Module ID'
                                            disabled={editMode}
                                            className={validationErrors.moduleID ? " input-border" : "  "}
                                        />
                                        {validationErrors.moduleID && (
                                            <small className="text-danger">{validationErrors.moduleID}</small>
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col lg={6}>
                                    <Form.Group controlId="moduleName" className="mb-3">
                                        <Form.Label>Module Name*</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="moduleName"
                                            value={messes.moduleName}
                                            onChange={handleChange}
                                            placeholder='Enter Module Name'
                                            disabled={editMode}
                                            className={validationErrors.moduleName ? " input-border" : "  "}
                                        />
                                        {validationErrors.moduleName && (
                                            <small className="text-danger">{validationErrors.moduleName}</small>
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col lg={6}>
                                    <Form.Group controlId="delegationPriority" className="mb-3">
                                        <Form.Label>Delegation Priority*</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="delegationPriority"
                                            value={messes.delegationPriority}
                                            onChange={handleChange}
                                            placeholder='Enter Delegation Priority'
                                            className={validationErrors.delegationPriority ? " input-border" : "  "}
                                        />
                                        {validationErrors.delegationPriority && (
                                            <small className="text-danger">{validationErrors.delegationPriority}</small>
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col lg={6}>
                                    <Form.Group controlId="delegationRemarks" className="mb-3">
                                        <Form.Label>Delegation Remarks*</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="delegationRemarks"
                                            value={messes.delegationRemarks}
                                            onChange={handleChange}
                                            placeholder='Enter Delegation Remarks'
                                            className={validationErrors.delegationRemarks ? " input-border" : "  "}
                                        />
                                        {validationErrors.delegationRemarks && (
                                            <small className="text-danger">{validationErrors.delegationRemarks}</small>
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col lg={6}>
                                    <Form.Group controlId="delegationDescription" className="mb-3">
                                        <Form.Label>Delegation Description*</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="delegationDescription"
                                            value={messes.delegationDescription}
                                            onChange={handleChange}
                                            placeholder='Enter Delegation Description'
                                            className={validationErrors.delegationDescription ? "input-border" : ""}
                                        />

                                        {validationErrors.delegationDescription && (
                                            <small className="text-danger">{validationErrors.delegationDescription}</small>
                                        )}
                                    </Form.Group>
                                </Col>

                                <Col lg={6}>
                                    <Form.Group controlId="allocatedEmployee" className="mb-3">
                                        <Form.Label>Allocated Employee*</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="allocatedEmployee"
                                            value={messes.allocatedEmployee}
                                            onChange={handleChange}
                                            placeholder='Enter Allocated Employee'
                                            className={validationErrors.allocatedEmployee ? " input-border" : "  "}
                                        />
                                        {validationErrors.allocatedEmployee && (
                                            <small className="text-danger">{validationErrors.allocatedEmployee}</small>
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col lg={6}>
                                    <Form.Group controlId="delegationRaisedby" className="mb-3">
                                        <Form.Label>Delegation Raisedby*</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="delegationRaisedby"
                                            value={messes.delegationRaisedby}
                                            onChange={handleChange}
                                            placeholder='Enter Delegation Raisedby'
                                            className={validationErrors.delegationRaisedby ? " input-border" : "  "}
                                        />
                                        {validationErrors.delegationRaisedby && (
                                            <small className="text-danger">{validationErrors.delegationRaisedby}</small>
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col lg={6}>
                                    <Form.Group controlId="delegationCreationDatetime" className="mb-3">
                                        <Form.Label>Delegation Creation Datetime*</Form.Label>
                                        <Flatpickr
                                            type="number"
                                            name="delegationCreationDatetime"
                                            value={messes.delegationCreationDatetime}
                                            onChange={(selectedDates) => handleDateChange("delegationCreationDatetime", selectedDates)}
                                            placeholder='Enter Delegation Creation Datetime'
                                            options={dateOptions}
                                            className={validationErrors.delegationCreationDatetime ? "form-control input-border" : "form-control"}
                                        />
                                        {validationErrors.delegationCreationDatetime && (
                                            <small className="text-danger">{validationErrors.delegationCreationDatetime}</small>
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col lg={6}>
                                    <Form.Group controlId="delegationID" className="mb-3">
                                        <Form.Label>Delegation ID*</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="delegationID"
                                            value={messes.delegationID}
                                            onChange={handleChange}
                                            placeholder='Enter Delegation ID'
                                            className={validationErrors.delegationID ? " input-border" : "  "}
                                        />
                                        {validationErrors.delegationID && (
                                            <small className="text-danger">{validationErrors.delegationID}</small>
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
                                    <Form.Group controlId="assignedDate" className="mb-3">
                                        <Form.Label>Assigned Date*</Form.Label>
                                        <Flatpickr
                                            type="text"
                                            name="assignedDate"
                                            value={messes.assignedDate}
                                            onChange={(selectedDates) => handleDateChange("assignedDate", selectedDates)}
                                            placeholder='Enter Assigned Date'
                                            options={dateOptions}
                                            className={validationErrors.assignedDate ? "form-control input-border" : "form-control"}
                                        />
                                        {validationErrors.assignedDate && (
                                            <small className="text-danger">{validationErrors.assignedDate}</small>
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col lg={6}>
                                    <Form.Group controlId="inputRequired" className="mb-3">
                                        <Form.Label>Input Required*</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="inputRequired"
                                            value={messes.inputRequired}
                                            onChange={handleChange}
                                            placeholder='Enter Input Required'
                                            className={validationErrors.inputRequired ? " input-border" : "  "}
                                        />
                                        {validationErrors.inputRequired && (
                                            <small className="text-danger">{validationErrors.inputRequired}</small>
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col lg={6}>
                                    <Form.Group controlId="delegationStatus" className="mb-3">
                                        <Form.Label>Delegation Status*</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="delegationStatus"
                                            value={messes.delegationStatus}
                                            onChange={handleChange}
                                            placeholder='Enter Delegation Status'
                                            className={validationErrors.delegationStatus ? " input-border" : "  "}
                                        />
                                        {validationErrors.delegationStatus && (
                                            <small className="text-danger">{validationErrors.delegationStatus}</small>
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
                                    <Form.Group controlId="delegationStatusUpdateDatetime" className="mb-3">
                                        <Form.Label>Delegation Status Update Datetime*</Form.Label>
                                        <Flatpickr
                                            type="text"
                                            name="delegationStatusUpdateDatetime"
                                            value={messes.delegationStatusUpdateDatetime}
                                            onChange={(selectedDates) => handleDateChange("delegationStatusUpdateDatetime", selectedDates)}
                                            placeholder='Enter Delegation Status Update Datetime'
                                            options={dateOptions}
                                            className={validationErrors.delegationStatusUpdateDatetime ? "form-control input-border" : "form-control"}
                                        />
                                        {validationErrors.delegationStatusUpdateDatetime && (
                                            <small className="text-danger">{validationErrors.delegationStatusUpdateDatetime}</small>
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
                                        <Link to={'/pages/DelegationMaster'}>
                                            <Button variant="primary" >
                                                Back
                                            </Button>
                                        </Link>
                                        &nbsp;
                                        <Button variant="primary" type="submit">
                                            {editMode ? 'Update Delegation' : 'Add Delegation'}
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

    export default DelegationMasterAddEdit;