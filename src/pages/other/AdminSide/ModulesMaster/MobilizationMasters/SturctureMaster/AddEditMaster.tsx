import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
// import Select from 'react-select';
import { toast } from 'react-toastify';


interface BTS_PAYMENT {
    id: number,
    projectID: string,
    projectName: string,
    structureName: string,
    hydrologyRequired: string,
    keyAreas: string,
    dangerWaterLevel: string,
    geoTechRequired: string,
    gadRequired: string,
    hydrologyStatus: string,
    geotechStatus: string,
    gadStatus: string,
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

const SturctureMasterAddEdit = () => {
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
        structureName: '',
        hydrologyRequired: '',
        keyAreas: '',
        dangerWaterLevel: '',
        geoTechRequired: '',
        gadRequired: '',
        hydrologyStatus: '',
        geotechStatus: '',
        gadStatus: '',
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
            const response = await axios.get(`${config.API_URL_APPLICATION1}/StructureMaster/GetStructure/${id}`);
            console.log('response', response)
            if (response.data.isSuccess) {
                const fetchedModule = response.data.structureMasters[0];
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


        if (!messes.projectID) { errors.projectID = 'projectID is required' }
        if (!messes.projectName) { errors.projectName = 'projectName is required' }
        if (!messes.structureName) { errors.structureName = 'structureName is required' }
        if (!messes.hydrologyRequired) { errors.hydrologyRequired = 'hydrologyRequired is required' }
        if (!messes.keyAreas) { errors.keyAreas = 'keyAreas is required' }
        if (!messes.dangerWaterLevel) { errors.dangerWaterLevel = 'dangerWaterLevel is required' }
        if (!messes.geoTechRequired) { errors.geoTechRequired = 'geoTechRequired is required' }
        if (!messes.gadRequired) { errors.gadRequired = 'gadRequired is required' }
        if (!messes.hydrologyStatus) { errors.hydrologyStatus = 'hydrologyStatus is required' }
        if (!messes.geotechStatus) { errors.geotechStatus = 'geotechStatus is required' }
        if (!messes.gadStatus) { errors.gadStatus = 'gadStatus is required' }



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
                await axios.put(`${config.API_URL_APPLICATION1}/StructureMaster/UpdateStructure/${id}`, payload);
                navigate('/pages/SturctureMaster', {
                    state: {
                        successMessage: "Challan Master Updated successfully!",
                    }
                });
            } else {
                await axios.post(`${config.API_URL_APPLICATION1}/StructureMaster/CreateStructure`, payload);
                navigate('/pages/SturctureMaster', {
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
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit Sturcture Master' : 'Add Sturcture Master'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>

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
                                        type="number"
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
                                <Form.Group controlId="structureName" className="mb-3">
                                    <Form.Label>structureName</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="structureName"
                                        value={messes.structureName}
                                        onChange={handleChange}
                                        placeholder='Enter Project ID'
                                        className={validationErrors.structureName ? " input-border" : "  "}
                                    />
                                    {validationErrors.structureName && (
                                        <small className="text-danger">{validationErrors.structureName}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="hydrologyRequired" className="mb-3">
                                    <Form.Label>hydrologyRequired</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="hydrologyRequired"
                                        value={messes.hydrologyRequired}
                                        onChange={handleChange}
                                        placeholder='Enter Project Name'
                                        className={validationErrors.hydrologyRequired ? " input-border" : "  "}
                                    />
                                    {validationErrors.hydrologyRequired && (
                                        <small className="text-danger">{validationErrors.hydrologyRequired}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="keyAreas" className="mb-3">
                                    <Form.Label>keyAreas</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="keyAreas"
                                        value={messes.keyAreas}
                                        onChange={handleChange}
                                        className={validationErrors.keyAreas ? "input-border" : ""}
                                    />

                                    {validationErrors.keyAreas && (
                                        <small className="text-danger">{validationErrors.keyAreas}</small>
                                    )}
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="dangerWaterLevel" className="mb-3">
                                    <Form.Label>dangerWaterLevel</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="dangerWaterLevel"
                                        value={messes.dangerWaterLevel}
                                        onChange={handleChange}
                                        placeholder='Enter dangerWaterLevel'
                                        className={validationErrors.dangerWaterLevel ? " input-border" : "  "}
                                    />
                                    {validationErrors.dangerWaterLevel && (
                                        <small className="text-danger">{validationErrors.dangerWaterLevel}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="geoTechRequired" className="mb-3">
                                    <Form.Label>geoTechRequired</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="geoTechRequired"
                                        value={messes.geoTechRequired}
                                        onChange={handleChange}
                                        placeholder='Enter geoTechRequired'
                                        className={validationErrors.geoTechRequired ? " input-border" : "  "}
                                    />
                                    {validationErrors.geoTechRequired && (
                                        <small className="text-danger">{validationErrors.geoTechRequired}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="gadRequired" className="mb-3">
                                    <Form.Label>gadRequired</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="gadRequired"
                                        value={messes.gadRequired}
                                        onChange={handleChange}
                                        placeholder='Enter gadRequired'
                                        className={validationErrors.gadRequired ? " input-border" : "  "}
                                    />
                                    {validationErrors.gadRequired && (
                                        <small className="text-danger">{validationErrors.gadRequired}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="hydrologyStatus" className="mb-3">
                                    <Form.Label>hydrologyStatus</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="hydrologyStatus"
                                        value={messes.hydrologyStatus}
                                        onChange={handleChange}
                                        placeholder='Enter hydrologyStatus'
                                        className={validationErrors.hydrologyStatus ? " input-border" : "  "}
                                    />
                                    {validationErrors.hydrologyStatus && (
                                        <small className="text-danger">{validationErrors.hydrologyStatus}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="geotechStatus" className="mb-3">
                                    <Form.Label>geotechStatus</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="geotechStatus"
                                        value={messes.geotechStatus}
                                        onChange={handleChange}
                                        placeholder='Enter geotechStatus'
                                        className={validationErrors.geotechStatus ? " input-border" : "  "}
                                    />
                                    {validationErrors.geotechStatus && (
                                        <small className="text-danger">{validationErrors.geotechStatus}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="gadStatus" className="mb-3">
                                    <Form.Label>gadStatus</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="gadStatus"
                                        value={messes.gadStatus}
                                        onChange={handleChange}
                                        placeholder='Enter gadStatus'
                                        className={validationErrors.gadStatus ? " input-border" : "  "}
                                    />
                                    {validationErrors.gadStatus && (
                                        <small className="text-danger">{validationErrors.gadStatus}</small>
                                    )}
                                </Form.Group>
                            </Col>







                            <Col className='align-items-end d-flex justify-content-between mb-3'>
                                <div>
                                    <span className='fs-5 '>This field is required*</span>
                                </div>
                                <div>
                                    <Link to={'/pages/SturctureMaster'}>
                                        <Button variant="primary" >
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update Sturcture' : 'Add Sturcture'}
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

export default SturctureMasterAddEdit;