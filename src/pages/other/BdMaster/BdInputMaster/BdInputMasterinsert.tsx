import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row, ButtonGroup } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
import Select from 'react-select';
import CustomSuccessToast from '../../Component/CustomSuccessToast';

interface HrInput {
    id: number;
    moduleID: string;
    processID: string;
    taskID: string;
    inputID: string;
    inputType: string;
    inputDisplayName: string;
    inputVariables: string;
    predecessorOrLogic: string;
    status: string;
    createdBy: string;
    updatedBy: string;
}


interface MISExempt {
    id: number;
    name: string;
}


interface PrrocessList {
    processID: string;
    moduleId: string;
    processName: string;
}

interface TaskList {
    id: number;
    taskID: string;
}


const HrInputMasterinsert = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState('');
    const [editMode, setEditMode] = useState<boolean>(false);
    const [misExempt, setMisExempt] = useState<MISExempt[]>([]);
    const [processList, setProcessList] = useState<PrrocessList[]>([]);
    const [taskList, setTaskList] = useState<TaskList[]>([]);
    const [empName, setEmpName] = useState<string | null>('')
    const [hrInputs, setHrInputs] = useState<HrInput>({
        id: 0,
        moduleID: '',
        processID: '',
        taskID: '',
        inputID: '',
        inputType: '',
        inputDisplayName: '',
        inputVariables: '',
        predecessorOrLogic: '',
        status: '',
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
            const response = await axios.get(`${config.API_URL_APPLICATION}/BDInputMaster/GetBDInput`, {
                params: { id: id }
            });
            if (response.data.isSuccess) {
                const fetchedModule = response.data.bDInputs[0];
                setHrInputs(fetchedModule);
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
        fetchData('CommonDropdown/GetProcessNameByModuleName?ModuleName=Business%20Development', setProcessList, 'processListResponses');
        fetchData('CommonDropdown/GetTaskList', setTaskList, 'taskList');
    }, []);


    // Handle form field changes
    const handleChange = (e: ChangeEvent<any>) => {
        const { name, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setHrInputs({
                ...hrInputs,
                [name]: checked
            });
        } else {
            const value = (e.target as HTMLInputElement | HTMLSelectElement).value;
            setHrInputs({
                ...hrInputs,
                [name]: value
            });
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        const payload = {
            ...hrInputs,
            createdBy: editMode ? hrInputs.createdBy : empName,
            updatedBy: editMode ? empName : '',
        };
        console.log(payload)
        e.preventDefault();
        try {
            if (editMode) {
                await axios.post(`${config.API_URL_APPLICATION}/BDInputMaster/InsertorUpdateBDInput`, payload);
                navigate('/pages/BdInputMaster', { state: { 
                    showToast: true,
                    toastMessage:"BdInput Updated successfully!",
                    toastVariant:"rgb(28 175 85)"
                   } });
            } else {
                await axios.post(`${config.API_URL_APPLICATION}/BDInputMaster/InsertorUpdateBDInput`, payload);
                navigate('/pages/BdInputMaster', { state: { 
                    showToast: true,
                    toastMessage:"BdInput Added successfully!",
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
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit BD Input' : 'Add BD Input'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            
                            <Col lg={6}>
                                <Form.Group controlId="processID" className="mb-3">
                                    <Form.Label>Process  Name</Form.Label>
                                    <Select
                                        name="processID"
                                        value={processList.find((mod) => mod.processID === hrInputs.processID)}
                                        onChange={(selectedOption) => {
                                            setHrInputs({
                                                ...hrInputs,
                                                processID: selectedOption?.processID || '',
                                                moduleID: selectedOption?.moduleId || '',
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
                                <Form.Group controlId="taskID" className="mb-3">
                                    <Form.Label>Task Number</Form.Label>
                                    <Select
                                        name="taskID"
                                        value={taskList.find((mod) => mod.taskID === hrInputs.taskID)}
                                        onChange={(selectedOption) => {
                                            setHrInputs({
                                                ...hrInputs,
                                                taskID: selectedOption?.taskID || '',
                                            });
                                        }}
                                        getOptionLabel={(mod) => mod.taskID}
                                        getOptionValue={(mod) => mod.taskID}
                                        options={taskList}
                                        isSearchable={true}
                                        placeholder="Select Task Number"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                          
                            <Col lg={6}>
                                <Form.Group controlId="inputID" className="mb-3">
                                    <Form.Label>Input ID:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="inputID"
                                        value={hrInputs.inputID}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter Input ID'
                                    />
                                </Form.Group>
                            </Col>
                            
                            <Col lg={6}>
                                <Form.Group controlId="inputType" className="mb-3">
                                    <Form.Label>Input Type:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="inputType"
                                        value={hrInputs.inputType}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter Input Type'

                                    />
                                </Form.Group>
                            </Col>
                            
                          
                            
                            <Col lg={6}>
                                <Form.Group controlId="inputDisplayName" className="mb-3">
                                    <Form.Label>Input Display Name:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="inputDisplayName"
                                        value={hrInputs.inputDisplayName}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter Input Display Name'

                                    />
                                </Form.Group>
                            </Col>
                            
                            
                            <Col lg={6}>
                                <Form.Group controlId="inputVariables" className="mb-3">
                                    <Form.Label>Input Variable:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="inputVariables"
                                        value={hrInputs.inputVariables}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter Input Variable'

                                    />
                                </Form.Group>
                            </Col>
                            
                          
                            <Col lg={6}>
                                <Form.Group controlId="predecessorOrLogic" className="mb-3">
                                    <Form.Label>Predecessor Or Logic</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="predecessorOrLogic"
                                        value={hrInputs.predecessorOrLogic}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter Predecessor Or Logic'

                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="status" className="mb-3">
                                    <Form.Label>Status</Form.Label>
                                    <Select
                                        name="status"
                                        value={misExempt.find((mod) => mod.name === hrInputs.status)}
                                        onChange={(selectedOption) => {
                                            setHrInputs({
                                                ...hrInputs,
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
                          

                            <Col></Col>
                            <Col lg={2} className='align-items-end d-flex justify-content-end mb-3'>
                                <ButtonGroup aria-label="Basic example" className='w-100'>
                                    <Link to={'/pages/BdInputMaster'} className="btn btn-primary">
                                        Back
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update BD Input' : 'Add BD Input'}
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

export default HrInputMasterinsert;