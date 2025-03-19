import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
// import Select from 'react-select';
import { toast } from 'react-toastify';


interface BTS_PAYMENT {
    id: number,
flaggedDate: string,
projectID: string,
projectName: string,
material: string,
unit: string,
minQty: string,
currentQty: string,
status: string,
imsType: string,
red: string,
physicalInventoryCorrectAsPerIMSfilled: string,
incorrect: string,
decision: string,
orderQty: string,
prPendingForPO: string,
poPendingForDispatch: string,
incorrectInventory: string,
other: string,
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

const LowInventoryTrackingMasterAddEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [empName, setEmpName] = useState<string | null>('')
    const [, setProjectList] = useState<ProjectList[]>([])
    const [, setStatusList] = useState<Status[]>([])
    const [, setEmployeeList] = useState<EmployeeList[]>([])
    const [messes, setMesses] = useState<BTS_PAYMENT>({
        id: 0,
        flaggedDate: '',
        projectID: '',
        projectName: '',
        material: '',
        unit: '',
        minQty: '',
        currentQty: '',
        status: '',
        imsType: '',
        red: '',
        physicalInventoryCorrectAsPerIMSfilled: '',
        incorrect: '',
        decision: '',
        orderQty: '',
        prPendingForPO: '',
        poPendingForDispatch: '',
        incorrectInventory: '',
        other: '',
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
            const response = await axios.get(`${config.API_URL_APPLICATION1}/LowInventoryTrackingMaster/GetLowInventoryTracking/${id}`);
            console.log('response', response)
            if (response.data.isSuccess) {
                const fetchedModule = response.data.lowInventoryTrackingMasters[0];
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


if(!messes.flaggedDate) { errors.flaggedDate = 'flaggedDate is required'}
if(!messes.projectID) { errors.projectID = 'projectID is required'}
if(!messes.projectName) { errors.projectName = 'projectName is required'}
if(!messes.material) { errors.material = 'material is required'}
if(!messes.unit) { errors.unit = 'unit is required'}
if(!messes.minQty) { errors.minQty = 'minQty is required'}
if(!messes.currentQty) { errors.currentQty = 'currentQty is required'}
if(!messes.status) { errors.status = 'status is required'}
if(!messes.imsType) { errors.imsType = 'imsType is required'}
if(!messes.red) { errors.red = 'red is required'}
if(!messes.physicalInventoryCorrectAsPerIMSfilled) { errors.physicalInventoryCorrectAsPerIMSfilled = 'physicalInventoryCorrectAsPerIMSfilled is required'}
if(!messes.incorrect) { errors.incorrect = 'incorrect is required'}
if(!messes.decision) { errors.decision = 'decision is required'}
if(!messes.orderQty) { errors.orderQty = 'orderQty is required'}
if(!messes.prPendingForPO) { errors.prPendingForPO = 'prPendingForPO is required'}
if(!messes.poPendingForDispatch) { errors.poPendingForDispatch = 'poPendingForDispatch is required'}
if(!messes.incorrectInventory) { errors.incorrectInventory = 'incorrectInventory is required'}
if(!messes.other) { errors.other = 'other is required'}






       



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
                await axios.put(`${config.API_URL_APPLICATION1}/LowInventoryTrackingMaster/UpdateLowInventoryTracking/${id}`, payload);
                navigate('/pages/LowInventoryTrackingMaster', {
                    state: {
                        successMessage: "Challan Master Updated successfully!",
                    }
                });
            } else {
                await axios.post(`${config.API_URL_APPLICATION1}/LowInventoryTrackingMaster/CreateLowInventoryTracking`, payload);
                navigate('/pages/LowInventoryTrackingMaster', {
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
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit LowInventoryTracking Master' : 'Add LowInventoryTracking Master'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>

                            <Col lg={6}>
                                <Form.Group controlId="flaggedDate" className="mb-3">
                                    <Form.Label>flaggedDate</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="flaggedDate"
                                        value={messes.flaggedDate}
                                        onChange={handleChange}
                                        placeholder='Enter flaggedDate'
                                        disabled={editMode}
                                        className={validationErrors.flaggedDate ? " input-border" : "  "}
                                    />
                                    {validationErrors.flaggedDate && (
                                        <small className="text-danger">{validationErrors.flaggedDate}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="projectID" className="mb-3">
                                    <Form.Label>projectID</Form.Label>
                                    <Form.Control
                                        type="number"
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
                                <Form.Group controlId="material" className="mb-3">
                                    <Form.Label>material</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="material"
                                        value={messes.material}
                                        onChange={handleChange}
                                        placeholder='Enter material'
                                        disabled={editMode}
                                        className={validationErrors.material ? " input-border" : "  "}
                                    />
                                    {validationErrors.material && (
                                        <small className="text-danger">{validationErrors.material}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="unit" className="mb-3">
                                    <Form.Label>unit</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="unit"
                                        value={messes.unit}
                                        onChange={handleChange}
                                        placeholder='Enter Project ID'
                                        className={validationErrors.unit ? " input-border" : "  "}
                                    />
                                    {validationErrors.unit && (
                                        <small className="text-danger">{validationErrors.unit}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="minQty" className="mb-3">
                                    <Form.Label>minQty</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="minQty"
                                        value={messes.minQty}
                                        onChange={handleChange}
                                        placeholder='Enter Project Name'
                                        className={validationErrors.minQty ? " input-border" : "  "}
                                    />
                                    {validationErrors.minQty && (
                                        <small className="text-danger">{validationErrors.minQty}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="currentQty" className="mb-3">
                                    <Form.Label>currentQty</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="currentQty"
                                        value={messes.currentQty}
                                        onChange={handleChange}
                                        className={validationErrors.currentQty ? "input-border" : ""}
                                    />

                                    {validationErrors.currentQty && (
                                        <small className="text-danger">{validationErrors.currentQty}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="statuss" className="mb-3">
                                    <Form.Label>status</Form.Label>
                                    <Form.Control
                                        type="text"
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
                            <Col lg={6}>
                                <Form.Group controlId="imsType" className="mb-3">
                                    <Form.Label>imsType</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="imsType"
                                        value={messes.imsType}
                                        onChange={handleChange}
                                        className={validationErrors.imsType ? "input-border" : ""}
                                    />

                                    {validationErrors.imsType && (
                                        <small className="text-danger">{validationErrors.imsType}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="red" className="mb-3">
                                    <Form.Label>red</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="red"
                                        value={messes.red}
                                        onChange={handleChange}
                                        className={validationErrors.red ? "input-border" : ""}
                                    />

                                    {validationErrors.red && (
                                        <small className="text-danger">{validationErrors.red}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="physicalInventoryCorrectAsPerIMSfilled" className="mb-3">
                                    <Form.Label>physicalInventoryCorrectAsPerIMSfilled</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="physicalInventoryCorrectAsPerIMSfilled"
                                        value={messes.physicalInventoryCorrectAsPerIMSfilled}
                                        onChange={handleChange}
                                        className={validationErrors.physicalInventoryCorrectAsPerIMSfilled ? "input-border" : ""}
                                    />

                                    {validationErrors.physicalInventoryCorrectAsPerIMSfilled && (
                                        <small className="text-danger">{validationErrors.physicalInventoryCorrectAsPerIMSfilled}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="incorrect" className="mb-3">
                                    <Form.Label>incorrect</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="incorrect"
                                        value={messes.incorrect}
                                        onChange={handleChange}
                                        className={validationErrors.incorrect ? "input-border" : ""}
                                    />

                                    {validationErrors.incorrect && (
                                        <small className="text-danger">{validationErrors.incorrect}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="decision" className="mb-3">
                                    <Form.Label>decision</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="decision"
                                        value={messes.decision}
                                        onChange={handleChange}
                                        className={validationErrors.decision ? "input-border" : ""}
                                    />

                                    {validationErrors.decision && (
                                        <small className="text-danger">{validationErrors.decision}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="orderQty" className="mb-3">
                                    <Form.Label>orderQty</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="orderQty"
                                        value={messes.orderQty}
                                        onChange={handleChange}
                                        className={validationErrors.orderQty ? "input-border" : ""}
                                    />

                                    {validationErrors.orderQty && (
                                        <small className="text-danger">{validationErrors.orderQty}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="prPendingForPO" className="mb-3">
                                    <Form.Label>prPendingForPO</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="prPendingForPO"
                                        value={messes.prPendingForPO}
                                        onChange={handleChange}
                                        className={validationErrors.prPendingForPO ? "input-border" : ""}
                                    />

                                    {validationErrors.prPendingForPO && (
                                        <small className="text-danger">{validationErrors.prPendingForPO}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="poPendingForDispatch" className="mb-3">
                                    <Form.Label>poPendingForDispatch</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="poPendingForDispatch"
                                        value={messes.poPendingForDispatch}
                                        onChange={handleChange}
                                        className={validationErrors.poPendingForDispatch ? "input-border" : ""}
                                    />

                                    {validationErrors.poPendingForDispatch && (
                                        <small className="text-danger">{validationErrors.poPendingForDispatch}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="incorrectInventory" className="mb-3">
                                    <Form.Label>incorrectInventory</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="incorrectInventory"
                                        value={messes.incorrectInventory}
                                        onChange={handleChange}
                                        className={validationErrors.incorrectInventory ? "input-border" : ""}
                                    />

                                    {validationErrors.incorrectInventory && (
                                        <small className="text-danger">{validationErrors.incorrectInventory}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="other" className="mb-3">
                                    <Form.Label>other</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="other"
                                        value={messes.other}
                                        onChange={handleChange}
                                        className={validationErrors.other ? "input-border" : ""}
                                    />

                                    {validationErrors.other && (
                                        <small className="text-danger">{validationErrors.other}</small>
                                    )}
                                </Form.Group>
                            </Col>
                           
                            
                            
                            
                           
                           








                            <Col className='align-items-end d-flex justify-content-between mb-3'>
                                <div>
                                    <span className='fs-5 '>This field is required*</span>
                                </div>
                                <div>
                                    <Link to={'/pages/LowInventoryTrackingMaster'}>
                                        <Button variant="primary" >
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update LowInventoryTracking' : 'Add LowInventoryTracking'}
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

export default LowInventoryTrackingMasterAddEdit;