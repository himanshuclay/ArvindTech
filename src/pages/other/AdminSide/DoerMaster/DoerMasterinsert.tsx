import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
import Select from 'react-select';
import CustomSuccessToast from '../../Component/CustomSuccessToast';


interface Doer {
    id: number;
    taskID: string;
    identifier: string;
    input: string;
    inputValue: string;
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




const EmployeeInsert = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [employeeList, setEmployeeList] = useState<EmployeeList[]>([]);
    const [empName, setEmpName] = useState<string | null>()
    const [taskList, setTaskList] = useState<TaskList[]>([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState('');
    const [doers, setDoers] = useState<Doer>({
        id: 0,
        taskID: '',
        identifier: '',
        input: '',
        inputValue: '',
        empID: '',
        empName: '',
        createdBy: '',
        updatedBy: '',

    });

    const [searchTaskID, setSearchTaskID] = useState('');
    // const [identifierData, setIdentifierData] = useState('');

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
        fetchData('CommonDropdown/GetEmployeeListWithId', setEmployeeList, 'employeeLists');
        fetchData('CommonDropdown/GetTaskList', setTaskList, 'taskList');
    }, []);



    useEffect(() => {
        const fetchDistricts = async () => {
            try {
                const response = await axios.get(`${config.API_URL_APPLICATION}/IdentifierMaster/GetIdentifierByTaskID?TaskID=${searchTaskID}`);
                const fetchedTasks = response.data.identifierLists;
                if (fetchedTasks.length > 0) {
                    setDoers(prev => ({
                        ...prev,
                        taskID: fetchedTasks[0].taskID,
                        identifier: fetchedTasks[0].identifier,
                        input: fetchedTasks[0].input,
                        inputValue: fetchedTasks[0].inputValue,
                    }));
                }
            } catch (error) {
                console.error('Error fetching districts:', error);
            }
        };
        fetchDistricts();
    }, [searchTaskID]);






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
        console.log(payload)
        try {
            if (editMode) {
                await axios.post(`${config.API_URL_APPLICATION}/DoerMaster/UpdateDoer`, payload);
                navigate('/pages/DoerMaster', {
                    state: {
                        showToast: true,
                        toastMessage: "Doer Updated successfully!",
                        toastVariant: "rgb(28 175 85)"
                    }
                });
            } else {
                await axios.post(`${config.API_URL_APPLICATION}/DoerMaster/InsertDoer`, payload);
                navigate('/pages/DoerMaster', {
                    state: {
                        showToast: true,
                        toastMessage: "Doer Added successfully!",
                        toastVariant: "rgb(28 175 85)"
                    }
                });
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error Adding/Updating';
            setToastMessage(errorMessage);
            setToastVariant("rgb(213 18 18)"); 
            setShowToast(true);
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
                                    <Form.Label>Task Number</Form.Label>
                                    <Select
                                        name="taskID"
                                        value={taskList.find(item => item.taskID === doers.taskID) || null}
                                        onChange={(selectedOption) => {
                                            const taskID = selectedOption ? selectedOption.taskID : '';
                                            setSearchTaskID(taskID);
                                            setDoers(prev => ({ ...prev, taskID })); // Update district in employee
                                        }}
                                        options={taskList || []}
                                        getOptionLabel={(item) => item.taskID}
                                        getOptionValue={(item) => item.taskID}
                                        isSearchable={true}
                                        placeholder="Select Task Number"
                                        className="h45"
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
                                        placeholder='Enter Identifier'
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
                                        placeholder='Enter Input'
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
                                        placeholder='Enter InputValue'
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="empName" className="mb-3">
                                    <Form.Label> Doer Name</Form.Label>
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
                                        placeholder="Select Doer Name"
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
            <CustomSuccessToast show={showToast} toastMessage={toastMessage} toastVariant={toastVariant} onClose={() => setShowToast(false)} />

        </div>
    );
};

export default EmployeeInsert;