import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
import Select from 'react-select';
import CustomSuccessToast from '@/pages/other/Component/CustomSuccessToast';



interface Identifier {
    id: number;
    identifier: string;
    identifier1: string;
    taskID: string;
    identifierValue: string;
    identifierValue1: string;
    empID: string;
    employeeName: string;
    source: string;
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

interface IdentifierValue {
    id: string;
    name: string;
}



const EmployeeInsert = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [taskList, setTaskList] = useState<TaskList[]>([]);
    const [employeeList, setEmployeeList] = useState<EmployeeList[]>([]);
    const [empName, setEmpName] = useState<string | null>('')
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState('');
    const [identifierValue, setIdentifierValue] = useState<IdentifierValue[]>([]);
    const [identifierValue1, setIdentifierValue1] = useState<IdentifierValue[]>([]);
    const [identifiers, setIdentifiers] = useState<Identifier>({
        id: 0,
        identifier: '',
        identifier1: '',
        taskID: '',
        identifierValue: '',
        identifierValue1: '',
        empID: '',
        source: '',
        employeeName: '',
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

    const fetchDoerById = async (id: string) => {
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/IdentifierMaster/GetIdentifier`, {
                params: { id: id }
            });
            if (response.data.isSuccess) {
                const fetchedModule = response.data.identifierLists[0];
                setIdentifiers(fetchedModule);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching module:', error);
        }
    };

    useEffect(() => {
        const fetchIdentifierValue = async (identifierName: string, setter: React.Dispatch<React.SetStateAction<any>>) => {
            try {
                const response = await axios.get(`${config.API_URL_APPLICATION}/IdentifierMaster/GetIdentifierByFlag`, {
                    params: { IdentifierName: identifierName }
                });
                if (response.data.isSuccess) {
                    const fetchedModule = response.data.getIdentifierByFlags;
                    setter(fetchedModule);
                } else {
                    console.error(response.data.message);
                }
            } catch (error) {
                console.error('Error fetching module:', error);
            }
        };

        if (identifiers.identifier) {
            fetchIdentifierValue(identifiers.identifier, setIdentifierValue);
        }
        if (identifiers.identifier1) {
            fetchIdentifierValue(identifiers.identifier1, setIdentifierValue1);
        }
    }, [identifiers.identifier, identifiers.identifier1]);



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



    const handleChange = (e: ChangeEvent<any> | null, name?: string, value?: any) => {
        if (e) {
            const { name: eventName, type } = e.target;

            if (type === 'checkbox') {
                const checked = (e.target as HTMLInputElement).checked;
                setIdentifiers({
                    ...identifiers,
                    [eventName]: checked
                });
            } else {
                const inputValue = (e.target as HTMLInputElement | HTMLSelectElement).value;
                setIdentifiers({
                    ...identifiers,
                    [eventName]: inputValue
                });
            }
        } else if (name) {
            setIdentifiers({
                ...identifiers,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const payload = {
            ...identifiers,
            createdBy: editMode ? identifiers.createdBy : empName,
            updatedBy: editMode ? empName : '',
        };

        try {
            await axios.post(`${config.API_URL_APPLICATION}/IdentifierMaster/InsertUpdateIdentifier`, payload);
            navigate('/pages/IdentifierMaster', {
                state: {
                    showToast: true,
                    toastMessage: editMode ? 'Identifier Updated Successfully! ' : 'Identifier Added Successfully!',
                    toastVariant: "rgb(28 175 85)"
                }
            });
        } catch (error: any) {
            setToastMessage(error || "Error Adding/Updating");
            setToastVariant("rgb(213 18 18)");
            setShowToast(true);
            console.error('Error submitting module:', error);
        }
    };


    const options = [
        { value: 'Master', label: 'Master' },
        { value: 'Manual Creation', label: 'Manual Creation' }
    ];
    const optionsIdentifier = [
        { value: 'PROJECT', label: 'PROJECT' },
        { value: 'SUBPROJECT', label: 'SUBPROJECT' },
        { value: 'INVOICETYPE', label: 'INVOICETYPE' },
        { value: 'BANK', label: 'BANK' }
    ];

    return (
        <div>
            <div className="container">
                <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center fs-20 rounded-3 border">
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit Identifier' : 'Add Identifier'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col lg={6}>
                                <Form.Group controlId="taskID" className="mb-3">
                                    <Form.Label>Task Number</Form.Label>
                                    <Select
                                        name="taskID"
                                        value={taskList.find((mod) => mod.taskID === identifiers.taskID)}
                                        onChange={(selectedOption) => {
                                            setIdentifiers({
                                                ...identifiers,
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
                                    <Form.Label>Identifier Name:</Form.Label>
                                    <Select
                                        name="identifier"
                                        options={optionsIdentifier}
                                        value={optionsIdentifier.find(option => option.value === identifiers.identifier)}
                                        onChange={(selectedOption) => {
                                            const value = selectedOption?.value || '';
                                            handleChange(null, 'identifier', value);
                                        }}
                                        placeholder="Select Identifier Name"
                                        required
                                    />
                                </Form.Group>
                            </Col>


                            <Col lg={6}>
                                <Form.Group controlId="identifierValue" className="mb-3">
                                    <Form.Label>Identifier Value:</Form.Label>
                                    <Select
                                        name="identifierValue"
                                        value={identifierValue.find((mod) => mod.name === identifiers.identifierValue)}
                                        onChange={(selectedOption) => {
                                            setIdentifiers({
                                                ...identifiers,
                                                identifierValue: selectedOption?.name || '',
                                            });
                                        }}
                                        getOptionLabel={(mod) => mod.name}
                                        getOptionValue={(mod) => mod.name}
                                        options={identifierValue}
                                        isSearchable={true}
                                        placeholder="Select Identifier Value"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="identifier1" className="mb-3">
                                    <Form.Label>Identifier Name 1:</Form.Label>
                                    <Select
                                        name="identifier1"
                                        options={optionsIdentifier}
                                        value={optionsIdentifier.find(option => option.value === identifiers.identifier1)}
                                        onChange={(selectedOption) => {
                                            const value = selectedOption?.value || '';
                                            handleChange(null, 'identifier1', value);
                                        }}
                                        placeholder="Select Identifier Name 1"
                                        required
                                    />
                                </Form.Group>
                            </Col>


                            <Col lg={6}>
                                <Form.Group controlId="identifierValue1" className="mb-3">
                                    <Form.Label>Identifier Value1</Form.Label>
                                    <Select
                                        name="identifierValue1"
                                        value={identifierValue1.find((mod) => mod.name === identifiers.identifierValue1)}
                                        onChange={(selectedOption) => {
                                            setIdentifiers({
                                                ...identifiers,
                                                identifierValue1: selectedOption?.name || '',
                                            });
                                        }}
                                        getOptionLabel={(mod) => mod.name}
                                        getOptionValue={(mod) => mod.name}
                                        options={identifierValue1}
                                        isSearchable={true}
                                        placeholder="Select Identifier Value1"
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="source" className="mb-3">
                                    <Form.Label>Source</Form.Label>
                                    <Select
                                        name="source"
                                        options={options}
                                        value={options.find(option => option.value === identifiers.source)}
                                        onChange={selectedOption => handleChange(null, 'source', selectedOption?.value)}
                                        placeholder="Source Type"
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="employeeName" className="mb-3">
                                    <Form.Label>Employee Name</Form.Label>
                                    <Select
                                        name="employeeName"
                                        value={employeeList.find(
                                            (mod) => mod.employeeName === identifiers.employeeName
                                        )}
                                        onChange={(selectedOption) => {
                                            setIdentifiers({
                                                ...identifiers,
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
                            <Col className='align-items-end d-flex justify-content-between mb-3'>
                                <div>
                                    <span className='fs-5 '>This field is required*</span>
                                </div>
                                <div>
                                    <Link to={'/pages/IdentifierMaster'}>
                                        <Button variant="primary" >
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update Identifier' : 'Add Identifier'}
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