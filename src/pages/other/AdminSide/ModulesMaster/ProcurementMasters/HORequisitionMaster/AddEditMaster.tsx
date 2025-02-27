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
    entryDate: string,
    typeofAsset: string,
    nameofAsset: string,
    uploadRequisitionSlip: string,
    requestedby: string,
    requestDate: string,
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

const HORequisitionMasterAddEdit = () => {
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
        entryDate: '',
        typeofAsset: '',
        nameofAsset: '',
        uploadRequisitionSlip: '',
        requestedby: '',
        requestDate: '',
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
            const response = await axios.get(`${config.API_URL_APPLICATION1}/HORequisitionMaster/GetHORequisition/${id}`);
            console.log('response', response)
            if (response.data.isSuccess) {
                const fetchedModule = response.data.hoRequisitionMasters[0];
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
if(!messes.entryDate) { errors.entryDate = 'entryDate is required'}
if(!messes.typeofAsset) { errors.typeofAsset = 'typeofAsset is required'}
if(!messes.nameofAsset) { errors.nameofAsset = 'nameofAsset is required'}
if(!messes.uploadRequisitionSlip) { errors.uploadRequisitionSlip = 'uploadRequisitionSlip is required'}
if(!messes.requestedby) { errors.requestedby = 'requestedby is required'}
if(!messes.requestDate) { errors.requestDate = 'requestDate is required'}



       



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
                await axios.put(`${config.API_URL_APPLICATION1}/HORequisitionMaster/UpdateHORequisition/${id}`, payload);
                navigate('/pages/HORequisitionMaster', {
                    state: {
                        successMessage: "Challan Master Updated successfully!",
                    }
                });
            } else {
                await axios.post(`${config.API_URL_APPLICATION1}/HORequisitionMaster/CreateHORequisition`, payload);
                navigate('/pages/HORequisitionMaster', {
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
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit HORequisition Master' : 'Add HORequisition Master'}</span></span>
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
                                <Form.Group controlId="entryDate" className="mb-3">
                                    <Form.Label>entryDate</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="entryDate"
                                        value={messes.entryDate}
                                        onChange={handleChange}
                                        placeholder='Enter entryDate'
                                        disabled={editMode}
                                        className={validationErrors.entryDate ? " input-border" : "  "}
                                    />
                                    {validationErrors.entryDate && (
                                        <small className="text-danger">{validationErrors.entryDate}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="typeofAsset" className="mb-3">
                                    <Form.Label>typeofAsset</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="typeofAsset"
                                        value={messes.typeofAsset}
                                        onChange={handleChange}
                                        placeholder='Enter typeofAsset'
                                        disabled={editMode}
                                        className={validationErrors.typeofAsset ? " input-border" : "  "}
                                    />
                                    {validationErrors.typeofAsset && (
                                        <small className="text-danger">{validationErrors.typeofAsset}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="nameofAsset" className="mb-3">
                                    <Form.Label>nameofAsset</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="nameofAsset"
                                        value={messes.nameofAsset}
                                        onChange={handleChange}
                                        placeholder='Enter nameofAsset'
                                        disabled={editMode}
                                        className={validationErrors.nameofAsset ? " input-border" : "  "}
                                    />
                                    {validationErrors.nameofAsset && (
                                        <small className="text-danger">{validationErrors.nameofAsset}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="uploadRequisitionSlip" className="mb-3">
                                    <Form.Label>uploadRequisitionSlip</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="uploadRequisitionSlip"
                                        value={messes.uploadRequisitionSlip}
                                        onChange={handleChange}
                                        placeholder='Enter Project ID'
                                        className={validationErrors.uploadRequisitionSlip ? " input-border" : "  "}
                                    />
                                    {validationErrors.uploadRequisitionSlip && (
                                        <small className="text-danger">{validationErrors.uploadRequisitionSlip}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="requestedby" className="mb-3">
                                    <Form.Label>requestedby</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="requestedby"
                                        value={messes.requestedby}
                                        onChange={handleChange}
                                        placeholder='Enter Project Name'
                                        className={validationErrors.requestedby ? " input-border" : "  "}
                                    />
                                    {validationErrors.requestedby && (
                                        <small className="text-danger">{validationErrors.requestedby}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="requestDate" className="mb-3">
                                    <Form.Label>requestDate</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="requestDate"
                                        value={messes.requestDate}
                                        onChange={handleChange}
                                        className={validationErrors.requestDate ? "input-border" : ""}
                                    />

                                    {validationErrors.requestDate && (
                                        <small className="text-danger">{validationErrors.requestDate}</small>
                                    )}
                                </Form.Group>
                            </Col>

                            
                            
                           
                           








                            <Col className='align-items-end d-flex justify-content-between mb-3'>
                                <div>
                                    <span className='fs-5 '>This field is required*</span>
                                </div>
                                <div>
                                    <Link to={'/pages/HORequisitionMaster'}>
                                        <Button variant="primary" >
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update HORequisition' : 'Add HORequisition'}
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

export default HORequisitionMasterAddEdit;