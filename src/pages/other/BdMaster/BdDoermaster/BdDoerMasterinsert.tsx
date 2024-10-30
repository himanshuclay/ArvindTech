import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row, ButtonGroup } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
import Select from 'react-select';
import CustomSuccessToast from '../../Component/CustomSuccessToast';

interface BdDoer {
    id: number;
    taskID: string;
    identifier: string;
    input: string;
    inputValue: string;
    empID: string;
    employeeName: string;
    createdBy: string;
    updatedBy: string;
}
interface TaskList {
    id: number;
    taskID: string;
}
interface IdentifierList {
    id: number;
    identifier: string;
}
interface EmployeeList {
    empId: string;
    employeeName: string;
}

const BdDoerMasterinsert = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState('');
    const [editMode, setEditMode] = useState<boolean>(false);
    const [identifierList, setIdentifierList] = useState<IdentifierList[]>([]);
    const [employeeList, setEmployeeList] = useState<EmployeeList[]>([]);
    const [taskList, setTaskList] = useState<TaskList[]>([]);
    const [empName, setEmpName] = useState<string | null>('')
    const [bdDoers, setBdDoers] = useState<BdDoer>({
        id: 0,
        taskID: '',
        identifier: '',
        input: '',
        inputValue: '',
        empID: '',
        employeeName: '',
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
            const response = await axios.get(`${config.API_URL_APPLICATION}/BDDoerMaster/GetBDDoer`, {
                params: { id: id }
            });
            if (response.data.isSuccess) {
                const fetchedModule = response.data.bDDoers[0];
                setBdDoers(fetchedModule);
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
        fetchData('CommonDropdown/GetIdentifier', setIdentifierList, 'identifierList');
        fetchData('CommonDropdown/GetTaskList', setTaskList, 'taskList');
    }, []);


    // Handle form field changes
    const handleChange = (e: ChangeEvent<any>) => {
        const { name, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setBdDoers({
                ...bdDoers,
                [name]: checked
            });
        } else {
            const value = (e.target as HTMLInputElement | HTMLSelectElement).value;
            setBdDoers({
                ...bdDoers,
                [name]: value
            });
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        const payload = {
            ...bdDoers,
            createdBy: editMode ? bdDoers.createdBy : empName,
            updatedBy: editMode ? empName : '',
        };
        console.log(payload)
        e.preventDefault();
        try {
            if (editMode) {
                await axios.post(`${config.API_URL_APPLICATION}/BDDoerMaster/InsertorUpdateBDDoer`, payload);
                navigate('/pages/BdDoerMaster', { state: { 
                    showToast: true,
                    toastMessage:"BdDoer Updated successfully!",
                    toastVariant:"rgb(28 175 85)"
                   } });
            } else {
                await axios.post(`${config.API_URL_APPLICATION}/BDDoerMaster/InsertorUpdateBDDoer`, payload);
                navigate('/pages/BdDoerMaster', { state: { 
                    showToast: true,
                    toastMessage:"BdDoer Added successfully!",
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
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit Bd Doer' : 'Add Bd Doer'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            
                          
                            <Col lg={6}>
                                <Form.Group controlId="taskID" className="mb-3">
                                    <Form.Label>Task Number</Form.Label>
                                    <Select
                                        name="taskID"
                                        value={taskList.find((mod) => mod.taskID === bdDoers.taskID)}
                                        onChange={(selectedOption) => {
                                            setBdDoers({
                                                ...bdDoers,
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
                                <Form.Group controlId="identifier" className="mb-3">
                                    <Form.Label>Identifier</Form.Label>
                                    <Select
                                        name="identifier"
                                        value={identifierList.find((mod) => mod.identifier === bdDoers.identifier)}
                                        onChange={(selectedOption) => {
                                            setBdDoers({
                                                ...bdDoers,
                                                identifier: selectedOption?.identifier || '',
                                            });
                                        }}
                                        getOptionLabel={(mod) => mod.identifier}
                                        getOptionValue={(mod) => mod.identifier}
                                        options={identifierList}
                                        isSearchable={true}
                                        placeholder="Select Identifier"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                          
                            <Col lg={6}>
                                <Form.Group controlId="input" className="mb-3">
                                    <Form.Label>Input ID:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="input"
                                        value={bdDoers.input}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter Input '
                                    />
                                </Form.Group>
                            </Col>
                            
                            <Col lg={6}>
                                <Form.Group controlId="inputValue" className="mb-3">
                                    <Form.Label>Input Type:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="inputValue"
                                        value={bdDoers.inputValue}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter Input Value'

                                    />
                                </Form.Group>
                            </Col>
                           
                            <Col lg={6}>
                                <Form.Group controlId="employeeName" className="mb-3">
                                    <Form.Label>Employee Name</Form.Label>
                                    <Select
                                        name="empName"
                                        value={employeeList.find(
                                            (mod) => mod.employeeName === bdDoers.employeeName
                                        )}
                                        onChange={(selectedOption) => {
                                            setBdDoers({
                                                ...bdDoers,
                                                employeeName: selectedOption?.employeeName || '',
                                                empID: selectedOption?.empId || '',
                                            });
                                        }}
                                        getOptionLabel={(mod) => mod.employeeName}
                                        getOptionValue={(mod) => mod.employeeName}
                                        options={employeeList}
                                        isSearchable={true}
                                        placeholder="Select Employee Name"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                          

                            <Col></Col>
                            <Col lg={2} className='align-items-end d-flex justify-content-end mb-3'>
                                <ButtonGroup aria-label="Basic example" className='w-100'>
                                    <Link to={'/pages/BdDoerMaster'} className="btn btn-primary">
                                        Back
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update Bd Doer' : 'Add Bd Doer'}
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

export default BdDoerMasterinsert;