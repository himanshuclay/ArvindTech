import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
// import Select from 'react-select';


interface Project {
    id: number;
    projectName: string;
    projectID: string;
    stateId: number;
    projectType: number;
    managementContract: number;
    projectIncharge: number;
    projectCoordinator: number;
    completionStatus: number;
    nameOfWork: string;
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



const SubProjectInsert = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [employeeList, setEmployeeList] = useState<EmployeeList[]>([]);
    const [empName, setEmpName] = useState<string | null>()
    const [taskList, setTaskList] = useState<TaskList[]>([]);
    const [roleList, setRoleList] = useState<RoleList[]>([]);
    const [project, setProject] = useState<Project>({
        id: 0,
        projectName: '',
        projectID: '',
        stateId: 0,
        projectType: 0,
        managementContract: 0,
        projectIncharge: 0,
        projectCoordinator: 0,
        completionStatus: 0,
        nameOfWork: '',
        createdBy: '',
        updatedBy: ''
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
            const response = await axios.get(`${config.API_URL_APPLICATION}/ProjectMaster/GetProject`, {
                params: { id: id }
            });
            if (response.data.isSuccess) {
                const fetchedModule = response.data.projectMasterList[0];
                setProject(fetchedModule);
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
            setProject({
                ...project,
                [name]: checked
            });
        } else {
            const value = (e.target as HTMLInputElement | HTMLSelectElement).value;
            setProject({
                ...project,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const payload = {
            ...project,
            createdBy: editMode ? project.createdBy : empName,
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
            <div className="container ">
                <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center fs-20 rounded-3 border">
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit Sub Project' : 'Add Sub Project'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                <Form onSubmit={handleSubmit}>
                        <Row>
                         


                            <Col lg={6}>
                                <Form.Group controlId="projectName" className="mb-3">
                                    <Form.Label>ProjectName:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="projectName"
                                        value={project.projectName}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="stateId" className="mb-3">
                                    <Form.Label>State:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="stateId"
                                        value={project.stateId}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="projectType" className="mb-3">
                                    <Form.Label>projectType:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="projectType"
                                        value={project.projectType}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="managementContract" className="mb-3">
                                    <Form.Label>managementContract:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="managementContract"
                                        value={project.managementContract}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="projectIncharge" className="mb-3">
                                    <Form.Label>projectIncharge:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="projectIncharge"
                                        value={project.projectIncharge}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="projectCoordinator" className="mb-3">
                                    <Form.Label>projectCoordinator:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="projectCoordinator"
                                        value={project.projectCoordinator}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="completionStatus" className="mb-3">
                                    <Form.Label>completionStatus:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="completionStatus"
                                        value={project.completionStatus}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="nameOfWork" className="mb-3">
                                    <Form.Label>nameOfWork:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="nameOfWork"
                                        value={project.nameOfWork}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>





                            <Col className='align-items-end d-flex justify-content-between mb-3'>
                                <div>
                                    <span className='fs-5 '>All fields are required*</span>
                                </div>
                                <div>
                                    <Link to={'/pages/ProjectMaster'}>
                                        <Button variant="primary" >
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update Project' : 'Add Project'}
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

export default SubProjectInsert;