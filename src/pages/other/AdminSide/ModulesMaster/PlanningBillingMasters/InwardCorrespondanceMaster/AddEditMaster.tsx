import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
// import Select from 'react-select';
import { toast } from 'react-toastify';


interface BTS_PAYMENT {
    id: number,
    entryDate: string,
    reqID: string,
    projectID: string,
    projectName: string,
    week: string,
    month: string,
    correspondenceType: string,
    uploadedFile: string,
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

const InwardCorrespondanceMasterAddEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [empName, setEmpName] = useState<string | null>('')
    const [, setProjectList] = useState<ProjectList[]>([])
    const [, setStatusList] = useState<Status[]>([])
    const [, setEmployeeList] = useState<EmployeeList[]>([])
    const [messes, setMesses] = useState<BTS_PAYMENT>({
        id: 0,
        entryDate: '',
        reqID: '',
        projectID: '',
        projectName: '',
        week: '',
        month: '',
        correspondenceType: '',
        uploadedFile: '',
        createdDate: '',
        createdBy: '',
        updatedDate: '',
        updatedBy: '',
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
            const response = await axios.get(`${config.API_URL_APPLICATION1}/InwardCorrespondanceMaster/GetInwardCorrespondance/${id}`);
            console.log('response', response)
            if (response.data.isSuccess) {
                const fetchedModule = response.data.inwardCorrespondanceMasters[0];
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


        if(!messes.entryDate) { errors.entryDate = 'entryDate is required'}
        if(!messes.reqID) { errors.reqID = 'reqID is required'}
        if(!messes.projectID) { errors.projectID = 'projectID is required'}
        if(!messes.projectName) { errors.projectName = 'projectName is required'}
        if(!messes.week) { errors.week = 'week is required'}
        if(!messes.month) { errors.month = 'month is required'}
        if(!messes.correspondenceType) { errors.correspondenceType = 'correspondenceType is required'}
        if(!messes.uploadedFile) { errors.uploadedFile = 'uploadedFile is required'}
       


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
                await axios.put(`${config.API_URL_APPLICATION1}/InwardCorrespondanceMaster/UpdateInwardCorrespondance/${id}`, payload);
                navigate('/pages/InwardCorrespondanceMaster', {
                    state: {
                        successMessage: "Challan Master Updated successfully!",
                    }
                });
            } else {
                await axios.post(`${config.API_URL_APPLICATION1}/InwardCorrespondanceMaster/CreateInwardCorrespondance`, payload);
                navigate('/pages/InwardCorrespondanceMaster', {
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
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit InwardCorrespondance Master' : 'Add InwardCorrespondance Master'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>

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
                                <Form.Group controlId="week" className="mb-3">
                                    <Form.Label>week</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="week"
                                        value={messes.week}
                                        onChange={handleChange}
                                        placeholder='Enter Project ID'
                                        className={validationErrors.week ? " input-border" : "  "}
                                    />
                                    {validationErrors.week && (
                                        <small className="text-danger">{validationErrors.week}</small>
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
                                        placeholder='Enter Project Name'
                                        className={validationErrors.month ? " input-border" : "  "}
                                    />
                                    {validationErrors.month && (
                                        <small className="text-danger">{validationErrors.month}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="correspondenceType" className="mb-3">
                                    <Form.Label>correspondenceType</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="correspondenceType"
                                        value={messes.correspondenceType}
                                        onChange={handleChange}
                                        className={validationErrors.correspondenceType ? "input-border" : ""}
                                    />

                                    {validationErrors.correspondenceType && (
                                        <small className="text-danger">{validationErrors.correspondenceType}</small>
                                    )}
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="uploadedFile" className="mb-3">
                                    <Form.Label>uploadedFile</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="uploadedFile"
                                        value={messes.uploadedFile}
                                        onChange={handleChange}
                                        placeholder='Enter uploadedFile'
                                        className={validationErrors.uploadedFile ? " input-border" : "  "}
                                    />
                                    {validationErrors.uploadedFile && (
                                        <small className="text-danger">{validationErrors.uploadedFile}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            







                            <Col className='align-items-end d-flex justify-content-between mb-3'>
                                <div>
                                    <span className='fs-5 '>This field is required*</span>
                                </div>
                                <div>
                                    <Link to={'/pages/InwardCorrespondanceMaster'}>
                                        <Button variant="primary" >
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update InwardCorrespondance' : 'Add InwardCorrespondance'}
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

export default InwardCorrespondanceMasterAddEdit;