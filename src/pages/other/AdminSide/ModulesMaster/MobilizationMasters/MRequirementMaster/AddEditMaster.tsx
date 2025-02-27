import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
// import Select from 'react-select';
import { toast } from 'react-toastify';


interface BTS_PAYMENT {
    id: number,
    requirement: string,
    tat: number,
    requisitionHandler: string,
    roleName: string,
    campLand: string,
    createdDate: string,
    createdBy: string,
    updatedDate: string,
    updatedBy: string
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

const MRequirementMasterAddEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [empName, setEmpName] = useState<string | null>('')
    const [, setProjectList] = useState<ProjectList[]>([])
    const [, setStatusList] = useState<Status[]>([])
    const [, setEmployeeList] = useState<EmployeeList[]>([])
    const [messes, setMesses] = useState<BTS_PAYMENT>({
        id: 0,
        requirement: '',
        tat: 0,
        requisitionHandler: '',
        roleName: '',
        campLand: '',
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
            const response = await axios.get(`${config.API_URL_APPLICATION1}/RequirementMaster/GetRequirement/${id}`);
            console.log('response', response)
            if (response.data.isSuccess) {
                const fetchedModule = response.data.requirementMasters[0];
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


        if (!messes.requirement) { errors.requirement = 'requirement is required' }
        if (!messes.tat) { errors.tat = 'tat is required' }
        if (!messes.requisitionHandler) { errors.requisitionHandler = 'requisitionHandler is required' }
        if (!messes.roleName) { errors.roleName = 'roleName is required' }
        if (!messes.campLand) { errors.campLand = 'campLand is required' }



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
                await axios.put(`${config.API_URL_APPLICATION1}/RequirementMaster/UpdateRequirement/${id}`, payload);
                navigate('/pages/MRequirementMaster', {
                    state: {
                        successMessage: "Challan Master Updated successfully!",
                    }
                });
            } else {
                await axios.post(`${config.API_URL_APPLICATION1}/RequirementMaster/CreateRequirement`, payload);
                navigate('/pages/MRequirementMaster', {
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
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit Requirement Master' : 'Add Requirement Master'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>

                            <Col lg={6}>
                                <Form.Group controlId="requirement" className="mb-3">
                                    <Form.Label>requirement</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="requirement"
                                        value={messes.requirement}
                                        onChange={handleChange}
                                        placeholder='Enter requirement'
                                        disabled={editMode}
                                        className={validationErrors.requirement ? " input-border" : "  "}
                                    />
                                    {validationErrors.requirement && (
                                        <small className="text-danger">{validationErrors.requirement}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="tat" className="mb-3">
                                    <Form.Label>tat</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="tat"
                                        value={messes.tat}
                                        onChange={handleChange}
                                        placeholder='Enter tat'
                                        disabled={editMode}
                                        className={validationErrors.tat ? " input-border" : "  "}
                                    />
                                    {validationErrors.tat && (
                                        <small className="text-danger">{validationErrors.tat}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="requisitionHandler" className="mb-3">
                                    <Form.Label>requisitionHandler</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="requisitionHandler"
                                        value={messes.requisitionHandler}
                                        onChange={handleChange}
                                        placeholder='Enter Project ID'
                                        className={validationErrors.requisitionHandler ? " input-border" : "  "}
                                    />
                                    {validationErrors.requisitionHandler && (
                                        <small className="text-danger">{validationErrors.requisitionHandler}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="roleName" className="mb-3">
                                    <Form.Label>roleName</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="roleName"
                                        value={messes.roleName}
                                        onChange={handleChange}
                                        placeholder='Enter Project ID'
                                        className={validationErrors.roleName ? " input-border" : "  "}
                                    />
                                    {validationErrors.roleName && (
                                        <small className="text-danger">{validationErrors.roleName}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="campLand" className="mb-3">
                                    <Form.Label>campLand</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="campLand"
                                        value={messes.campLand}
                                        onChange={handleChange}
                                        placeholder='Enter Project ID'
                                        className={validationErrors.campLand ? " input-border" : "  "}
                                    />
                                    {validationErrors.campLand && (
                                        <small className="text-danger">{validationErrors.campLand}</small>
                                    )}
                                </Form.Group>
                            </Col>








                            <Col className='align-items-end d-flex justify-content-between mb-3'>
                                <div>
                                    <span className='fs-5 '>This field is required*</span>
                                </div>
                                <div>
                                    <Link to={'/pages/MRequirementMaster'}>
                                        <Button variant="primary" >
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update Requirement' : 'Add Requirement'}
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

export default MRequirementMasterAddEdit;