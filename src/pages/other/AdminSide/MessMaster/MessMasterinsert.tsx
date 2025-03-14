import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
import Select from 'react-select';
import { toast } from 'react-toastify';


interface Mess {
    id: number
    messID: string;
    messName: string;
    managerEmpID: string;
    managerName: string;
    projectName: string;
    mobileNumber: string;
    status: string;
    createdBy: string;
    updatedBy: string;
}

interface ProjectList {
    id: string;
    projectName: string
}
interface Status {
    id: string;
    name: string
}
interface EmployeeList {
    empId: string;
    employeeName: string
}

const EmployeeInsert = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [empName, setEmpName] = useState<string | null>('')
    const [projectList, setProjectList] = useState<ProjectList[]>([])
    const [statusList, setStatusList] = useState<Status[]>([])
    const [employeeList, setEmployeeList] = useState<EmployeeList[]>([])
    const [messes, setMesses] = useState<Mess>({
        id: 0,
        messID: '',
        messName: '',
        managerEmpID: '',
        managerName: '',
        projectName: '',
        mobileNumber: '',
        status: '',
        createdBy: '',
        updatedBy: ''
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
            const response = await axios.get(`${config.API_URL_APPLICATION}/MessMaster/GetMess`, {
                params: { id: id }
            });
            if (response.data.isSuccess) {
                const fetchedModule = response.data.messMasterList[0];
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

        if (!messes.projectName) { errors.projectName = 'Project Name is required'; }
        if (!messes.messID) { errors.messID = 'Mess ID is required'; }
        if (!messes.managerName) { errors.managerName = 'Manager Name is required'; }
        if (!messes.messName) { errors.messName = 'Mess Name is required'; }
        if (!messes.status) { errors.status = 'Status is required'; }
        if (!messes.mobileNumber) { errors.mobileNumber = 'Mobile No. is required'; }


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

        if (!validateFields()) {
            toast.dismiss()
            toast.error('Please fill in all required fields.');
            return;
        }


        if (messes.mobileNumber.length !== 10) {
            toast.dismiss()
            toast.error("Mobile number should be exactly 10 digits long.");
            setIsMobileVerified(true);
            return false;
        }

        if (isMobileVerified) {
            toast.dismiss()
            toast.error("Please verify your mobile number before submitting the form.");
            return;
        }
        const payload = {
            ...messes,
            createdBy: editMode ? messes.createdBy : empName,
            updatedBy: editMode ? empName : '',
        };
        try {
            if (editMode) {
                await axios.post(`${config.API_URL_APPLICATION}/MessMaster/UpdateMess`, payload);
                navigate('/pages/MessMaster', {
                    state: {
                        successMessage: "Doer Updated successfully!",
                    }
                });
            } else {
                await axios.post(`${config.API_URL_APPLICATION}/MessMaster/InsertMess`, payload);
                navigate('/pages/MessMaster', {
                    state: {
                        successMessage: "Doer Added successfully!",
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
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit Mess' : 'Add Mess'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col lg={6}>
                                <Form.Group controlId="projectName" className="mb-3">
                                    <Form.Label>Project Name</Form.Label>
                                    <Select
                                        name="projectName"
                                        value={projectList.find((mod) => mod.projectName === messes.projectName)}
                                        onChange={(selectedOption) => {
                                            setMesses({
                                                ...messes,
                                                projectName: selectedOption?.projectName || '',
                                            });
                                        }}
                                        getOptionLabel={(mod) => mod.projectName}
                                        getOptionValue={(mod) => mod.projectName}
                                        options={projectList}
                                        isSearchable={true}
                                        placeholder="Select Project Name"
                                        className={validationErrors.projectName ? " input-border" : "  "}
                                    />
                                    {validationErrors.projectName && (
                                        <small className="text-danger">{validationErrors.projectName}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="messID" className="mb-3">
                                    <Form.Label>Mess ID</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="messID"
                                        value={messes.messID}
                                        onChange={handleChange}
                                        placeholder='Enter Mess Id'
                                        disabled={editMode}
                                        className={validationErrors.messID ? " input-border" : "  "}
                                    />
                                    {validationErrors.messID && (
                                        <small className="text-danger">{validationErrors.messID}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="messName" className="mb-3">
                                    <Form.Label>Mess Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="messName"
                                        value={messes.messName}
                                        onChange={handleChange}
                                        placeholder='Enter Mess Name'
                                        className={validationErrors.messName ? " input-border" : "  "}
                                    />
                                    {validationErrors.messName && (
                                        <small className="text-danger">{validationErrors.messName}</small>
                                    )}
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="status" className="mb-3">
                                    <Form.Label>Status</Form.Label>
                                    <Select
                                        name="status"
                                        value={statusList.find((mod) => mod.name === messes.status)}
                                        onChange={(selectedOption) => {
                                            setMesses({
                                                ...messes,
                                                status: selectedOption?.name || '',
                                            });
                                        }}
                                        getOptionLabel={(mod) => mod.name}
                                        getOptionValue={(mod) => mod.name}
                                        options={statusList}
                                        isSearchable={true}
                                        placeholder="Select Status"
                                        className={validationErrors.status ? " input-border" : "  "}
                                    />
                                    {validationErrors.status && (
                                        <small className="text-danger">{validationErrors.status}</small>
                                    )}
                                </Form.Group>
                            </Col>


                            <Col lg={6}>
                                <Form.Group controlId="managerEmpID" className="mb-3">
                                    <Form.Label>Manager Name</Form.Label>
                                    <Select
                                        name="managerEmpID"
                                        value={employeeList.find((mod) => mod.employeeName === messes.managerName)}
                                        // value={messes.managerName}
                                        onChange={(selectedOption) => {
                                            setMesses({
                                                ...messes,
                                                managerName: selectedOption?.employeeName || '',
                                                managerEmpID: selectedOption?.empId || '',
                                            });
                                        }}
                                        getOptionLabel={(mod) => mod.employeeName.split('_')[0]}
                                        getOptionValue={(mod) => mod.employeeName}
                                        options={employeeList}
                                        isSearchable={true}
                                        placeholder="Select Employee"
                                        className={validationErrors.managerName ? " input-border" : "  "}
                                    />
                                    {validationErrors.managerName && (
                                        <small className="text-danger">{validationErrors.managerName}</small>
                                    )}
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="mobileNumber" className="mb-3">
                                    <Form.Label>Mess Manager Contact</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="mobileNumber"
                                        value={messes.mobileNumber}
                                        onChange={handleChange}
                                        placeholder='Enter Mess Manager Contact'
                                        className={validationErrors.mobileNumber ? " input-border" : "  "}
                                    />
                                    {validationErrors.mobileNumber && (
                                        <small className="text-danger">{validationErrors.mobileNumber}</small>
                                    )}
                                </Form.Group>
                            </Col>




                            <Col className='align-items-end d-flex justify-content-between mb-3'>
                                <div>
                                    <span className='fs-5 '>This field is required*</span>
                                </div>
                                <div>
                                    <Link to={'/pages/MessMaster'}>
                                        <Button variant="primary" >
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update Mess' : 'Add Mess'}
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

export default EmployeeInsert;