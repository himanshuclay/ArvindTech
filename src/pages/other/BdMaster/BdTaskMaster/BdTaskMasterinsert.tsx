import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row, ButtonGroup } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
import Select from 'react-select';
import CustomSuccessToast from '../../Component/CustomSuccessToast';

interface BdTask {
    id: number;
    moduleID: string;
    processID: string;
    taskDisplayName: string;
    taskDescription: string;
    role: string;
    howPlannedDateIsCalculated: string;
    predecessor: string;
    successor: string;
    generationType: string;
    misExempt: string;
    status: string;
    problemSolver: string;
    sundayLogic: string;
    createdBy: string;
    updatedBy: string;
}

interface MISExempt {
    id: number;
    name: string;
}


interface PrrocessList {
    processID: string;
    processName: string;
}

// interface TaskList {
//     id: number;
//     taskID: string;
// }


const BdTaskMasterinsert = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState('');
    const [editMode, setEditMode] = useState<boolean>(false);
    const [misExempt, setMisExempt] = useState<MISExempt[]>([]);
    const [processList, setProcessList] = useState<PrrocessList[]>([]);
    // const [taskList, setTaskList] = useState<TaskList[]>([]);
    const [empName, setEmpName] = useState<string | null>('')
    const [bdTasks, setBdTasks] = useState<BdTask>({
        id: 0,
        moduleID: '',
        processID: '',
        taskDisplayName: '',
        taskDescription: '',
        role: '',
        howPlannedDateIsCalculated: '',
        predecessor: '',
        successor: '',
        generationType: '',
        misExempt: '',
        status: '',
        problemSolver: '',
        sundayLogic: '',
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
            fetchModuleById(id);
        } else {
            setEditMode(false);
        }
    }, [id]);

    const fetchModuleById = async (id: string) => {
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/BDTaskMaster/GetBDTask`, {
                params: { id: id }
            });
            if (response.data.isSuccess) {
                const fetchedModule = response.data.bDTasks[0];
                setBdTasks(fetchedModule);
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

        fetchData('CommonDropdown/GetMISExempt', setMisExempt, 'mISExemptListResponses');
        fetchData('CommonDropdown/GetProcessNameByModuleName?ModuleName=Human Resources', setProcessList, 'processListResponses');
        // fetchData('CommonDropdown/GetTaskList', setTaskList, 'taskList');
    }, []);


    // Handle form field changes
    const handleChange = (e: ChangeEvent<any>) => {
        const { name, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setBdTasks({
                ...bdTasks,
                [name]: checked
            });
        } else {
            const value = (e.target as HTMLInputElement | HTMLSelectElement).value;
            setBdTasks({
                ...bdTasks,
                [name]: value
            });
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        const payload = {
            ...bdTasks,
            createdBy: editMode ? bdTasks.createdBy : empName,
            updatedBy: editMode ? empName : '',
        };
        console.log(payload)
        e.preventDefault();
        try {
            if (editMode) {
                await axios.post(`${config.API_URL_APPLICATION}/BDTaskMaster/InsertorUpdateBDTask`, payload);
                navigate('/pages/BdTaskMaster', { state: { 
                    showToast: true,
                    toastMessage:"BdTask Updated successfully!",
                    toastVariant:"rgb(28 175 85)"
                   } });
            } else {
                await axios.post(`${config.API_URL_APPLICATION}/BDTaskMaster/InsertorUpdateBDTask`, payload);
                navigate('/pages/BdTaskMaster', { state: { 
                    showToast: true,
                    toastMessage:"BdTask Added successfully!",
                    toastVariant:"rgb(28 175 85)"
                   } });
            }
        } catch (error) {
            setToastMessage("Error Adding/Updating");
            setToastVariant("rgb(213 18 18)");
            setShowToast(true);
            console.error('Error submitting module:', error);
        }
    };


    return (
        <div>
            <div className="container">
                <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center fs-20 rounded-3 border">
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit Bd Task' : 'Add Bd Task'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col lg={6}>
                                <Form.Group controlId="processID" className="mb-3">
                                    <Form.Label>Process  Name</Form.Label>
                                    <Select
                                        name="processID"
                                        value={processList.find((mod) => mod.processID === bdTasks.processID)}
                                        onChange={(selectedOption) => {
                                            setBdTasks({
                                                ...bdTasks,
                                                processID: selectedOption?.processID || '',
                                                moduleID: selectedOption?.processID || '',
                                            });
                                        }}
                                        getOptionLabel={(mod) => mod.processName}
                                        getOptionValue={(mod) => mod.processID}
                                        options={processList}
                                        isSearchable={true}
                                        placeholder="Select Process Name"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                      
                          
                            <Col lg={6}>
                                <Form.Group controlId="taskDisplayName" className="mb-3">
                                    <Form.Label>Task Display Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="taskDisplayName"
                                        value={bdTasks.taskDisplayName}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter Task Display Name'
                                    />
                                </Form.Group>
                            </Col>
                            
                          
                            <Col lg={6}>
                                <Form.Group controlId="taskDescription" className="mb-3">
                                    <Form.Label>Task Description</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="taskDescription"
                                        value={bdTasks.taskDescription}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter Task Description'
                                    />
                                </Form.Group>
                            </Col>
                          
                            <Col lg={6}>
                                <Form.Group controlId="role" className="mb-3">
                                    <Form.Label>Role</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="role"
                                        value={bdTasks.role}
                                        onChange={handleChange}
                                        required
                                        placeholder='Select role'
                                    />
                                </Form.Group>
                            </Col>
                            
                            <Col lg={6}>
                                <Form.Group controlId="howPlannedDateIsCalculated" className="mb-3">
                                    <Form.Label>How Planned Date Is Calculated</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="howPlannedDateIsCalculated"
                                        value={bdTasks.howPlannedDateIsCalculated}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter Input ID'
                                    />
                                </Form.Group>
                            </Col>
                            
                            <Col lg={6}>
                                <Form.Group controlId="predecessor" className="mb-3">
                                    <Form.Label>Predecessor</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="predecessor"
                                        value={bdTasks.predecessor}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter predecessor'

                                    />
                                </Form.Group>
                            </Col>
                            
                            <Col lg={6}>
                                <Form.Group controlId="successor" className="mb-3">
                                    <Form.Label>Successor</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="successor"
                                        value={bdTasks.successor}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter Input Type'

                                    />
                                </Form.Group>
                            </Col>
                            
                            <Col lg={6}>
                                <Form.Group controlId="generationType" className="mb-3">
                                    <Form.Label>Generation Type</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="generationType"
                                        value={bdTasks.generationType}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter Input Type'

                                    />
                                </Form.Group>
                            </Col>
                            
                            <Col lg={6}>
                                <Form.Group controlId="misExempt" className="mb-3">
                                    <Form.Label>misExempt</Form.Label>
                                    <Select
                                        name="misExempt"
                                        value={misExempt.find((mod) => mod.name === bdTasks.misExempt)}
                                        onChange={(selectedOption) => {
                                            setBdTasks({
                                                ...bdTasks,
                                                misExempt: selectedOption?.name || '',
                                            });
                                        }}
                                        getOptionLabel={(mod) => mod.name}
                                        getOptionValue={(mod) => mod.name}
                                        options={misExempt}
                                        isSearchable={true}
                                        placeholder="Select Status"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                          
                            <Col lg={6}>
                                <Form.Group controlId="status" className="mb-3">
                                    <Form.Label>Status</Form.Label>
                                    <Select
                                        name="status"
                                        value={misExempt.find((mod) => mod.name === bdTasks.status)}
                                        onChange={(selectedOption) => {
                                            setBdTasks({
                                                ...bdTasks,
                                                status: selectedOption?.name || '',
                                            });
                                        }}
                                        getOptionLabel={(mod) => mod.name}
                                        getOptionValue={(mod) => mod.name}
                                        options={misExempt}
                                        isSearchable={true}
                                        placeholder="Select Status"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                          
                            <Col lg={6}>
                                <Form.Group controlId="problemSolver" className="mb-3">
                                    <Form.Label>Problem Solver</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="problemSolver"
                                        value={bdTasks.problemSolver}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter Problem Solver'

                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="sundayLogic" className="mb-3">
                                    <Form.Label>Sunday Logic</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="sundayLogic"
                                        value={bdTasks.sundayLogic}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter Sunday Logic'

                                    />
                                </Form.Group>
                            </Col>

                            <Col></Col>
                            <Col lg={2} className='align-items-end d-flex justify-content-end mb-3'>
                                <ButtonGroup aria-label="Basic example" className='w-100'>
                                    <Link to={'/pages/BdTaskMaster'} className="btn btn-primary">
                                        Back
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update Bd Task' : 'Add Bd Task'}
                                    </Button>
                                </ButtonGroup>
                            </Col>

                        </Row>

                    </Form>
                </div>
            </div>
            <CustomSuccessToast show={showToast} toastMessage={toastMessage} toastVariant={toastVariant} onClose={() => setShowToast(false)} />

        </div >
    );
};

export default BdTaskMasterinsert;