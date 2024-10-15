import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
import Select from 'react-select';


interface Doer {
    id: number;
    taskID: string;
    identifier: string;
    input: string;
    inputValue: string;
    doerRole: string;
    empID: string;
    empName: string;
    createdBy: string;
    updatedBy: string;
}

interface TaskList {
    id: number;
    taskID: string;
}

interface EmployeeList {
    empId: string;
    employeeName: string;
}
interface RoleList {
    id: number;
    roleName: string;
}



const EmployeeInsert = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [employeeList, setEmployeeList] = useState<EmployeeList[]>([]);
    const [empName, setEmpName] = useState<string | null>()
    const [taskList, setTaskList] = useState<TaskList[]>([]);
    const [roleList, setRoleList] = useState<RoleList[]>([]);
    const [doers, setDoers] = useState<Doer>({
        id: 0,
        taskID: '',
        identifier: '',
        input: '',
        inputValue: '',
        doerRole: '',
        empID: '',
        empName: '',
        createdBy: '',
        updatedBy: '',

    });

    useEffect(() => {
        const storedEmpName = localStorage.getItem('EmpName');
        if (storedEmpName) {
            setEmpName(storedEmpName);
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

    useEffect(() => {
        fetchEmployeeList();
        fetchTaskLists();
        fetchRoleLists();
    }, []);


    const fetchDoerById = async (id: string) => {
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/DoerMaster/GetDoer`, {
                params: { id: id }
            });
            if (response.data.isSuccess) {
                const fetchedModule = response.data.doerMasterList[0];
                setDoers(fetchedModule);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching module:', error);
        }
    };



    const fetchEmployeeList = async () => {
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/CommonDropdown/GetEmployeeListWithId`);
            if (response.data.isSuccess) {
                setEmployeeList(response.data.employeeLists);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching MIS Exempt list:', error);
        }
    };

    const fetchTaskLists = async () => {
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/CommonDropdown/GetTaskList`);
            if (response.data.isSuccess) {
                setTaskList(response.data.taskList);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching MIS Exempt list:', error);
        }
    };

    const fetchRoleLists = async () => {
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/CommonDropdown/GetRoleMasterList`);
            if (response.data.isSuccess) {
                setRoleList(response.data.roleMasterLists);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching MIS Exempt list:', error);
        }
    };


    const handleChange = (e: ChangeEvent<any>) => {
        const { name, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setDoers({
                ...doers,
                [name]: checked
            });
        } else {
            const value = (e.target as HTMLInputElement | HTMLSelectElement).value;
            setDoers({
                ...doers,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const payload = {
            ...doers,
            createdBy: editMode ? doers.createdBy : empName,
            updatedBy: editMode ? empName : '',
        };

        try {
            if (editMode) {
                await axios.post(`${config.API_URL_APPLICATION}/DoerMaster/UpdateDoer`, payload);
            } else {
                await axios.post(`${config.API_URL_APPLICATION}/DoerMaster/InsertDoer`, payload);
            }
            navigate('/pages/DoerMaster');
        } catch (error) {
            console.error('Error submitting module:', error);
        }
    };


    return (
        <div>
            <div className="container">
                <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center fs-20 rounded-3 border">
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit Doer' : 'Add Doer'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col lg={6}>
                                <Form.Group controlId="taskID" className="mb-3">
                                    <Form.Label>Module Name</Form.Label>
                                    <Select
                                        name="taskID"
                                        value={taskList.find((mod) => mod.taskID === doers.taskID)}
                                        onChange={(selectedOption) => {
                                            setDoers({
                                                ...doers,
                                                taskID: selectedOption?.taskID || '',
                                            });
                                        }}
                                        getOptionLabel={(mod) => mod.taskID}
                                        getOptionValue={(mod) => mod.taskID}
                                        options={taskList}
                                        isSearchable={true}
                                        placeholder="Select Module Name"
                                        required
                                    />
                                </Form.Group>
                            </Col>


                            <Col lg={6}>
                                <Form.Group controlId="identifier" className="mb-3">
                                    <Form.Label>identifier:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="identifier"
                                        value={doers.identifier}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="input" className="mb-3">
                                    <Form.Label>Input:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="input"
                                        value={doers.input}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="inputValue" className="mb-3">
                                    <Form.Label>Input Value:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="inputValue"
                                        value={doers.inputValue}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="doerRole" className="mb-3">
                                    <Form.Label>Process  Name</Form.Label>
                                    <Select
                                        name="doerRole"
                                        value={roleList.find(
                                            (mod) => mod.roleName === doers.doerRole
                                        )}
                                        onChange={(selectedOption) => {
                                            setDoers({
                                                ...doers,
                                                doerRole: selectedOption?.roleName || ''
                                            });
                                        }}
                                        getOptionLabel={(mod) => mod.roleName}
                                        getOptionValue={(mod) => mod.roleName}
                                        options={roleList}
                                        isSearchable={true}
                                        placeholder="Select Process Owner Name"
                                        required
                                    />
                                </Form.Group>
                            </Col>


                            <Col lg={6}>
                                <Form.Group controlId="empName" className="mb-3">
                                    <Form.Label>Process Owner Name</Form.Label>
                                    <Select
                                        name="empName"
                                        value={employeeList.find(
                                            (mod) => mod.employeeName === doers.empName
                                        )}
                                        onChange={(selectedOption) => {
                                            setDoers({
                                                ...doers,
                                                empName: selectedOption?.employeeName || '',
                                                empID: selectedOption?.empId || '',
                                            });
                                        }}
                                        getOptionLabel={(mod) => mod.employeeName}
                                        getOptionValue={(mod) => mod.employeeName}
                                        options={employeeList}
                                        isSearchable={true}
                                        placeholder="Select Process Owner Name"
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col className='align-items-end d-flex justify-content-between mb-3'>
                                <div>
                                    <span className='fs-5 '>All fields are required*</span>
                                </div>
                                <div>
                                    <Link to={'/pages/DoerMaster'}>
                                        <Button variant="primary" >
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update Doer' : 'Add Doer'}
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