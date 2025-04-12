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
scheduledDate: string,
poNumber: string,
projectID: string,
projectName: string,
vendorID: string,
vendorName: string,
material_MachineryBBEJName: string,
specification: string,
scheduledQty: string,
vehicleRequiredByDate: string,
source: string,
arrangementFrom: string,
vehicleType: string,
expectedDateofFulfilment: string,
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

const TransportationMasterAddEdit = () => {
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
scheduledDate: '',
poNumber: '',
projectID: '',
projectName: '',
vendorID: '',
vendorName: '',
material_MachineryBBEJName: '',
specification: '',
scheduledQty: '',
vehicleRequiredByDate: '',
source: '',
arrangementFrom: '',
vehicleType: '',
expectedDateofFulfilment: '',
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
            const response = await axios.get(`${config.API_URL_APPLICATION1}/TransportationMaster/GetTransportation/${id}`);
            console.log('response', response)
            if (response.data.isSuccess) {
                const fetchedModule = response.data.transportationMasters[0];
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
if(!messes.scheduledDate) { errors.scheduledDate = 'scheduledDate is required'}
if(!messes.poNumber) { errors.poNumber = 'poNumber is required'}
if(!messes.projectID) { errors.projectID = 'projectID is required'}
if(!messes.projectName) { errors.projectName = 'projectName is required'}
if(!messes.vendorID) { errors.vendorID = 'vendorID is required'}
if(!messes.vendorName) { errors.vendorName = 'vendorName is required'}
if(!messes.material_MachineryBBEJName) { errors.material_MachineryBBEJName = 'material_MachineryBBEJName is required'}
if(!messes.specification) { errors.specification = 'specification is required'}
if(!messes.scheduledQty) { errors.scheduledQty = 'scheduledQty is required'}
if(!messes.vehicleRequiredByDate) { errors.vehicleRequiredByDate = 'vehicleRequiredByDate is required'}
if(!messes.source) { errors.source = 'source is required'}
if(!messes.arrangementFrom) { errors.arrangementFrom = 'arrangementFrom is required'}
if(!messes.vehicleType) { errors.vehicleType = 'vehicleType is required'}
if(!messes.expectedDateofFulfilment) { errors.expectedDateofFulfilment = 'expectedDateofFulfilment is required'}


       



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
                await axios.put(`${config.API_URL_APPLICATION1}/TransportationMaster/UpdateTransportation/${id}`, payload);
                navigate('/pages/TransportationMaster', {
                    state: {
                        successMessage: "Challan Master Updated successfully!",
                    }
                });
            } else {
                await axios.post(`${config.API_URL_APPLICATION1}/TransportationMaster/CreateTransportation`, payload);
                navigate('/pages/TransportationMaster', {
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
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit Transportation Master' : 'Add Transportation Master'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>

                            <Col lg={6}>
                                <Form.Group controlId="reqID" className="mb-3">
                                    <Form.Label>reqID</Form.Label>
                                    <Form.Control
                                        type="number"
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
                                <Form.Group controlId="scheduledDate" className="mb-3">
                                    <Form.Label>scheduledDate</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="scheduledDate"
                                        value={messes.scheduledDate}
                                        onChange={handleChange}
                                        placeholder='Enter scheduledDate'
                                        disabled={editMode}
                                        className={validationErrors.scheduledDate ? " input-border" : "  "}
                                    />
                                    {validationErrors.scheduledDate && (
                                        <small className="text-danger">{validationErrors.scheduledDate}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="poNumber" className="mb-3">
                                    <Form.Label>poNumber</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="poNumber"
                                        value={messes.poNumber}
                                        onChange={handleChange}
                                        placeholder='Enter poNumber'
                                        disabled={editMode}
                                        className={validationErrors.poNumber ? " input-border" : "  "}
                                    />
                                    {validationErrors.poNumber && (
                                        <small className="text-danger">{validationErrors.poNumber}</small>
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
                                        placeholder='Enter Project ID'
                                        className={validationErrors.projectName ? " input-border" : "  "}
                                    />
                                    {validationErrors.projectName && (
                                        <small className="text-danger">{validationErrors.projectName}</small>
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
                                        placeholder='Enter Project Name'
                                        className={validationErrors.vendorID ? " input-border" : "  "}
                                    />
                                    {validationErrors.vendorID && (
                                        <small className="text-danger">{validationErrors.vendorID}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="vendorName" className="mb-3">
                                    <Form.Label>vendorName</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="vendorName"
                                        value={messes.vendorName}
                                        onChange={handleChange}
                                        className={validationErrors.vendorName ? "input-border" : ""}
                                    />

                                    {validationErrors.vendorName && (
                                        <small className="text-danger">{validationErrors.vendorName}</small>
                                    )}
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="material_MachineryBBEJName" className="mb-3">
                                    <Form.Label>material_MachineryBBEJName</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="material_MachineryBBEJName"
                                        value={messes.material_MachineryBBEJName}
                                        onChange={handleChange}
                                        placeholder='Enter material_MachineryBBEJName'
                                        className={validationErrors.material_MachineryBBEJName ? " input-border" : "  "}
                                    />
                                    {validationErrors.material_MachineryBBEJName && (
                                        <small className="text-danger">{validationErrors.material_MachineryBBEJName}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="specification" className="mb-3">
                                    <Form.Label>specification</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="specification"
                                        value={messes.specification}
                                        onChange={handleChange}
                                        placeholder='Enter specification'
                                        className={validationErrors.specification ? " input-border" : "  "}
                                    />
                                    {validationErrors.specification && (
                                        <small className="text-danger">{validationErrors.specification}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="scheduledQty" className="mb-3">
                                    <Form.Label>scheduledQty</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="scheduledQty"
                                        value={messes.scheduledQty}
                                        onChange={handleChange}
                                        placeholder='Enter scheduledQty'
                                        className={validationErrors.scheduledQty ? " input-border" : "  "}
                                    />
                                    {validationErrors.scheduledQty && (
                                        <small className="text-danger">{validationErrors.scheduledQty}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="vehicleRequiredByDate" className="mb-3">
                                    <Form.Label>vehicleRequiredByDate</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="vehicleRequiredByDate"
                                        value={messes.vehicleRequiredByDate}
                                        onChange={handleChange}
                                        placeholder='Enter vehicleRequiredByDate'
                                        className={validationErrors.vehicleRequiredByDate ? " input-border" : "  "}
                                    />
                                    {validationErrors.vehicleRequiredByDate && (
                                        <small className="text-danger">{validationErrors.vehicleRequiredByDate}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            
                            <Col lg={6}>
                                <Form.Group controlId="source" className="mb-3">
                                    <Form.Label>source</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="source"
                                        value={messes.source}
                                        onChange={handleChange}
                                        placeholder='Enter source'
                                        className={validationErrors.source ? " input-border" : "  "}
                                    />
                                    {validationErrors.source && (
                                        <small className="text-danger">{validationErrors.source}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="arrangementFrom" className="mb-3">
                                    <Form.Label>arrangementFrom</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="arrangementFrom"
                                        value={messes.arrangementFrom}
                                        onChange={handleChange}
                                        placeholder='Enter arrangementFrom'
                                        className={validationErrors.arrangementFrom ? " input-border" : "  "}
                                    />
                                    {validationErrors.arrangementFrom && (
                                        <small className="text-danger">{validationErrors.arrangementFrom}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="vehicleType" className="mb-3">
                                    <Form.Label>vehicleType</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="vehicleType"
                                        value={messes.vehicleType}
                                        onChange={handleChange}
                                        placeholder='Enter vehicleType'
                                        className={validationErrors.vehicleType ? " input-border" : "  "}
                                    />
                                    {validationErrors.vehicleType && (
                                        <small className="text-danger">{validationErrors.vehicleType}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="expectedDateofFulfilment" className="mb-3">
                                    <Form.Label>expectedDateofFulfilment</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="expectedDateofFulfilment"
                                        value={messes.expectedDateofFulfilment}
                                        onChange={handleChange}
                                        placeholder='Enter expectedDateofFulfilment'
                                        className={validationErrors.expectedDateofFulfilment ? " input-border" : "  "}
                                    />
                                    {validationErrors.expectedDateofFulfilment && (
                                        <small className="text-danger">{validationErrors.expectedDateofFulfilment}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            
                           
                           








                            <Col className='align-items-end d-flex justify-content-between mb-3'>
                                <div>
                                    <span className='fs-5 '>This field is required*</span>
                                </div>
                                <div>
                                    <Link to={'/pages/TransportationMaster'}>
                                        <Button variant="primary" >
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update Transportation' : 'Add Transportation'}
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

export default TransportationMasterAddEdit;