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
uid: string,
projectID: string,
projectName: string,
licenseAgreementType: string,
complianceRequired: string,
owner: string,
expiryDate: string,
documentPath: string,
documentURL: string,
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

const SCMasterAddEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [empName, setEmpName] = useState<string | null>('')
    const [, setProjectList] = useState<ProjectList[]>([])
    const [, setStatusList] = useState<Status[]>([])
    const [, setEmployeeList] = useState<EmployeeList[]>([])
    const [messes, setMesses] = useState<BTS_PAYMENT>({
        id: 0,
        uid: '',
        projectID: '',
        projectName: '',
        licenseAgreementType: '',
        complianceRequired: '',
        owner: '',
        expiryDate: '',
        documentPath: '',
        documentURL: '',
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
            const response = await axios.get(`${config.API_URL_APPLICATION1}/SCMaster/GetSC/${id}`);
            console.log('response', response)
            if (response.data.isSuccess) {
                const fetchedModule = response.data.scMasters[0];
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

if(!messes.uid){ errors.uid = 'U Id is required'}
if(!messes.projectID){ errors.projectID = 'Project ID is required'}
if(!messes.projectName){ errors.projectName = 'Project Name is required'}
if(!messes.licenseAgreementType){ errors.licenseAgreementType = 'License Agreement Type is required'}
if(!messes.complianceRequired){ errors.complianceRequired = 'Compliance Required is required'}
if(!messes.owner){ errors.owner = 'Owner is required'}
if(!messes.expiryDate){ errors.expiryDate = 'Expiry Date is required'}
if(!messes.documentPath){ errors.documentPath = 'Document Path is required'}
if(!messes.documentURL){ errors.documentURL = 'Document URL is required'}


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
                await axios.put(`${config.API_URL_APPLICATION1}/SCMaster/UpdateSC/${id}`, payload);
                navigate('/pages/SCMaster', {
                    state: {
                        successMessage: "Challan Master Updated successfully!",
                    }
                });
            } else {
                await axios.post(`${config.API_URL_APPLICATION1}/SCMaster/CreateSC`, payload);
                navigate('/pages/SCMaster', {
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
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit SC Master' : 'Add SC Master'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>

                            <Col lg={6}>
                                <Form.Group controlId="uid" className="mb-3">
                                    <Form.Label>U id*</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="uid"
                                        value={messes.uid}
                                        onChange={handleChange}
                                        placeholder='Enter U id'
                                        disabled={editMode}
                                        className={validationErrors.uid ? " input-border" : "  "}
                                    />
                                    {validationErrors.uid && (
                                        <small className="text-danger">{validationErrors.uid}</small>
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
                                <Form.Group controlId="licenseAgreementType" className="mb-3">
                                    <Form.Label>License Agreement Type*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="licenseAgreementType"
                                        value={messes.licenseAgreementType}
                                        onChange={handleChange}
                                        placeholder='Enter License Agreement Type'
                                        className={validationErrors.licenseAgreementType ? " input-border" : "  "}
                                    />
                                    {validationErrors.licenseAgreementType && (
                                        <small className="text-danger">{validationErrors.licenseAgreementType}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="complianceRequired" className="mb-3">
                                    <Form.Label>Compliance Required*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="complianceRequired"
                                        value={messes.complianceRequired}
                                        placeholder='Enter Compliance Required'
                                        onChange={handleChange}
                                        className={validationErrors.complianceRequired ? "input-border" : ""}
                                    />

                                    {validationErrors.complianceRequired && (
                                        <small className="text-danger">{validationErrors.complianceRequired}</small>
                                    )}
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="owner" className="mb-3">
                                    <Form.Label>Owner*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="owner"
                                        value={messes.owner}
                                        onChange={handleChange}
                                        placeholder='Enter Owner'
                                        className={validationErrors.owner ? " input-border" : "  "}
                                    />
                                    {validationErrors.owner && (
                                        <small className="text-danger">{validationErrors.owner}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="expiryDate" className="mb-3">
                                    <Form.Label>Expiry Date*</Form.Label>
                                    <Flatpickr
                                        name="expiryDate"
                                        value={messes.expiryDate}
                                        onChange={(selectedDates) => handleDateChange("expiryDate", selectedDates)}
                                        placeholder='Enter Expiry Date'
                                        options={dateOptions}
                                        className={validationErrors.expiryDate ? "form-control input-border" : "form-control"}
                                    />
                                    {validationErrors.expiryDate && (
                                        <small className="text-danger">{validationErrors.expiryDate}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="documentPath" className="mb-3">
                                    <Form.Label>Document Path*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="documentPath"
                                        value={messes.documentPath}
                                        onChange={handleChange}
                                        placeholder='Enter Document Path'
                                        className={validationErrors.documentPath ? " input-border" : "  "}
                                    />
                                    {validationErrors.documentPath && (
                                        <small className="text-danger">{validationErrors.documentPath}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="documentURL" className="mb-3">
                                    <Form.Label>Document URL*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="documentURL"
                                        value={messes.documentURL}
                                        onChange={handleChange}
                                        placeholder='Enter Document URL'
                                        className={validationErrors.documentURL ? " input-border" : "  "}
                                    />
                                    {validationErrors.documentURL && (
                                        <small className="text-danger">{validationErrors.documentURL}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            








                            <Col className='align-items-end d-flex justify-content-between mb-3'>
                                <div>
                                    <span className='fs-5 '>This field is required*</span>
                                </div>
                                <div>
                                    <Link to={'/pages/SCMaster'}>
                                        <Button variant="primary" >
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update SC' : 'Add SC'}
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

export default SCMasterAddEdit;