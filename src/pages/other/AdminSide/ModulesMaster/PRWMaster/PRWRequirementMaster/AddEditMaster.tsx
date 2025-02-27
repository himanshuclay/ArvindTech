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
    initiationDate: string,
    projectID: string,
    projectName: string,
    activitiesToBePerformed: string,
    typeOfContractor: string,
    typeOfWork: string,
    noOfManpower: number,
    requiredDate: string,
    remarks: string,
    source_RP_PRW_LBR_Adhoc: string,
    lastestUpdatedate: string,
    finalStatus: string,
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

const PRWRequirementMasterAddEdit = () => {
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
        initiationDate: '',
        projectID: '',
        projectName: '',
        activitiesToBePerformed: '',
        typeOfContractor: '',
        typeOfWork: '',
        noOfManpower: 0,
        requiredDate: '',
        remarks: '',
        source_RP_PRW_LBR_Adhoc: '',
        lastestUpdatedate: '',
        finalStatus: '',
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
            const response = await axios.get(`${config.API_URL_APPLICATION1}/PRWRequirementMaster/GetPRWRequirement/${id}`);
            console.log('response', response)
            if (response.data.isSuccess) {
                const fetchedModule = response.data.prwRequirementMasters[0];
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
        if(!messes.initiationDate) { errors.initiationDate = 'initiationDate is required'}
        if(!messes.projectID) { errors.projectID = 'projectID is required'}
        if(!messes.projectName) { errors.projectName = 'projectName is required'}
        if(!messes.activitiesToBePerformed) { errors.activitiesToBePerformed = 'activitiesToBePerformed is required'}
        if(!messes.typeOfContractor) { errors.typeOfContractor = 'typeOfContractor is required'}
        if(!messes.typeOfWork) { errors.typeOfWork = 'typeOfWork is required'}
        if(!messes.noOfManpower) { errors.noOfManpower = 'noOfManpower is required'}
        if(!messes.requiredDate) { errors.requiredDate = 'requiredDate is required'}
        if(!messes.remarks) { errors.remarks = 'remarks is required'}
        if(!messes.source_RP_PRW_LBR_Adhoc) { errors.source_RP_PRW_LBR_Adhoc = 'source_RP_PRW_LBR_Adhoc is required'}
        if(!messes.lastestUpdatedate) { errors.lastestUpdatedate = 'lastestUpdatedate is required'}
        if(!messes.finalStatus) { errors.finalStatus = 'finalStatus is required'}
        








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
                await axios.put(`${config.API_URL_APPLICATION1}/PRWRequirementMaster/UpdatePRWRequirement/${id}`, payload);
                navigate('/pages/PRWRequirementMaster', {
                    state: {
                        successMessage: "Challan Master Updated successfully!",
                    }
                });
            } else {
                await axios.post(`${config.API_URL_APPLICATION1}/PRWRequirementMaster/CreatePRWRequirement`, payload);
                navigate('/pages/PRWRequirementMaster', {
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
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit PRWRequirement Master' : 'Add PRWRequirement Master'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>

                            <Col lg={6}>
                                <Form.Group controlId="reqID" className="mb-3">
                                    <Form.Label>reqID</Form.Label>
                                    <Form.Control
                                        type="text"
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
                                <Form.Group controlId="initiationDate" className="mb-3">
                                    <Form.Label>initiationDate</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="initiationDate"
                                        value={messes.initiationDate}
                                        onChange={handleChange}
                                        placeholder='Enter initiationDate'
                                        disabled={editMode}
                                        className={validationErrors.initiationDate ? " input-border" : "  "}
                                    />
                                    {validationErrors.initiationDate && (
                                        <small className="text-danger">{validationErrors.initiationDate}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="projectID" className="mb-3">
                                    <Form.Label>projectID</Form.Label>
                                    <Form.Control
                                        type="text"
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
                                <Form.Group controlId="activitiesToBePerformed" className="mb-3">
                                    <Form.Label>activitiesToBePerformed</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="activitiesToBePerformed"
                                        value={messes.activitiesToBePerformed}
                                        onChange={handleChange}
                                        placeholder='Enter Project ID'
                                        className={validationErrors.activitiesToBePerformed ? " input-border" : "  "}
                                    />
                                    {validationErrors.activitiesToBePerformed && (
                                        <small className="text-danger">{validationErrors.activitiesToBePerformed}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="typeOfContractor" className="mb-3">
                                    <Form.Label>typeOfContractor</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="typeOfContractor"
                                        value={messes.typeOfContractor}
                                        onChange={handleChange}
                                        placeholder='Enter Project Name'
                                        className={validationErrors.typeOfContractor ? " input-border" : "  "}
                                    />
                                    {validationErrors.typeOfContractor && (
                                        <small className="text-danger">{validationErrors.typeOfContractor}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="typeOfWork" className="mb-3">
                                    <Form.Label>typeOfWork</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="typeOfWork"
                                        value={messes.typeOfWork}
                                        onChange={handleChange}
                                        className={validationErrors.typeOfWork ? "input-border" : ""}
                                    />

                                    {validationErrors.typeOfWork && (
                                        <small className="text-danger">{validationErrors.typeOfWork}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="noOfManpower" className="mb-3">
                                    <Form.Label>noOfManpower</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="noOfManpower"
                                        value={messes.noOfManpower}
                                        onChange={handleChange}
                                        className={validationErrors.noOfManpower ? "input-border" : ""}
                                    />

                                    {validationErrors.noOfManpower && (
                                        <small className="text-danger">{validationErrors.noOfManpower}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="requiredDate" className="mb-3">
                                    <Form.Label>requiredDate</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="requiredDate"
                                        value={messes.requiredDate}
                                        onChange={handleChange}
                                        className={validationErrors.requiredDate ? "input-border" : ""}
                                    />

                                    {validationErrors.requiredDate && (
                                        <small className="text-danger">{validationErrors.requiredDate}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="remarks" className="mb-3">
                                    <Form.Label>remarks</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="remarks"
                                        value={messes.remarks}
                                        onChange={handleChange}
                                        className={validationErrors.remarks ? "input-border" : ""}
                                    />

                                    {validationErrors.remarks && (
                                        <small className="text-danger">{validationErrors.remarks}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="source_RP_PRW_LBR_Adhoc" className="mb-3">
                                    <Form.Label>source_RP_PRW_LBR_Adhoc</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="source_RP_PRW_LBR_Adhoc"
                                        value={messes.source_RP_PRW_LBR_Adhoc}
                                        onChange={handleChange}
                                        className={validationErrors.source_RP_PRW_LBR_Adhoc ? "input-border" : ""}
                                    />

                                    {validationErrors.source_RP_PRW_LBR_Adhoc && (
                                        <small className="text-danger">{validationErrors.source_RP_PRW_LBR_Adhoc}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="lastestUpdatedate" className="mb-3">
                                    <Form.Label>lastestUpdatedate</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="lastestUpdatedate"
                                        value={messes.lastestUpdatedate}
                                        onChange={handleChange}
                                        className={validationErrors.lastestUpdatedate ? "input-border" : ""}
                                    />

                                    {validationErrors.lastestUpdatedate && (
                                        <small className="text-danger">{validationErrors.lastestUpdatedate}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="finalStatus" className="mb-3">
                                    <Form.Label>finalStatus</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="finalStatus"
                                        value={messes.finalStatus}
                                        onChange={handleChange}
                                        className={validationErrors.finalStatus ? "input-border" : ""}
                                    />

                                    {validationErrors.finalStatus && (
                                        <small className="text-danger">{validationErrors.finalStatus}</small>
                                    )}
                                </Form.Group>
                            </Col>














                            <Col className='align-items-end d-flex justify-content-between mb-3'>
                                <div>
                                    <span className='fs-5 '>This field is required*</span>
                                </div>
                                <div>
                                    <Link to={'/pages/PRWRequirementMaster'}>
                                        <Button variant="primary" >
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update PRWRequirement' : 'Add PRWRequirement'}
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

export default PRWRequirementMasterAddEdit;