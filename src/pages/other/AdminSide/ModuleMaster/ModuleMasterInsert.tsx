import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row, ButtonGroup } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
import Select from 'react-select';
import CustomSuccessToast from '@/pages/other/Component/CustomSuccessToast';

interface Module {
    id: number;
    moduleDisplayName: string;
    fmsType: string;
    misExempt: string;
    moduleID: string;
    statusID: number;
    createdBy: string;
    updatedBy: string;
}

interface MISExempt {
    id: number;
    name: string;
}
interface Status {
    id: number;
    name: boolean;
}

const EmployeeInsert = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState<string>('');
    const [toastVariant, setToastVariant] = useState('');
    const [editMode, setEditMode] = useState<boolean>(false);
    const [misExempt, setMisExempt] = useState<MISExempt[]>([]);
    const [statusID, setStatusID] = useState<Status[]>([]);
    const [empName, setEmpName] = useState<string | null>('')
    const [module, setModule] = useState<Module>({
        id: 0,
        moduleDisplayName: '',
        fmsType: '',
        misExempt: '',
        moduleID: '',
        statusID: 0,
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
            const response = await axios.get('https://arvindo-api2.clay.in/api/ModuleMaster/GetModule', {
                params: { id: id }
            });
            if (response.data.isSuccess) {
                const fetchedModule = response.data.moduleMasterList[0];
                setModule(fetchedModule);
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

        fetchData('CommonDropdown/GetStatus', setStatusID, 'statusListResponses');
        fetchData('CommonDropdown/GetMISExempt', setMisExempt, 'mISExemptListResponses');
    }, []);



    const handleChange = (e: ChangeEvent<any> | null, name?: string, value?: any) => {
        if (e) {
            const { name: eventName, type } = e.target;

            if (type === 'checkbox') {
                const checked = (e.target as HTMLInputElement).checked;
                setModule({
                    ...module,
                    [eventName]: checked
                });
            } else {
                const inputValue = (e.target as HTMLInputElement | HTMLSelectElement).value;
                setModule({
                    ...module,
                    [eventName]: inputValue
                });
            }
        } else if (name) {
            setModule({
                ...module,
                [name]: value
            });
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const payload = {
            ...module,
            createdBy: editMode ? module.createdBy : empName,
            updatedBy: editMode ? empName : '',
        };

        console.log(payload);

        try {
            const apiUrl = `${config.API_URL_APPLICATION}/ModuleMaster/${editMode ? 'UpdateModule' : 'InsertModule'}`;
            const response = await axios.post(apiUrl, payload);

            if (response.status === 200) {
                navigate('/pages/ModuleMaster', {
                    state: {
                        showToast: true,
                        toastMessage: editMode ? "Module updated successfully!" : "Module added successfully!",
                        toastVariant: "rgb(28 175 85)",
                    },
                });
            } else {
                setToastMessage(response.data.message || "Failed to process request");
            }
        } catch (error: any) {
            setToastMessage(error);
            setToastVariant("rgb(213 18 18)");
            setShowToast(true);
            console.error('Error submitting module:', error);
        }
    };
    

    const options = [
        { value: 'CHK', label: 'CHK' },
        { value: 'MOD', label: 'MOD' }
    ];
    return (
        <div>
            <div className="container">
                <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center fs-20 rounded-3 border">
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit Module' : 'Add Module'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>


                        <Row>

                            <Col lg={6}>
                                <Form.Group controlId="moduleDisplayName" className="mb-3">
                                    <Form.Label>Module Display Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="moduleDisplayName"
                                        value={module.moduleDisplayName}
                                        onChange={(e) => setModule({ ...module, moduleDisplayName: e.target.value })}
                                        required
                                        placeholder='Enter Module Name'
                                        disabled={editMode}
                                    />
                                  

                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="ModuleID" className="mb-3">
                                    <Form.Label>ModuleID:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="moduleID"
                                        value={module.moduleID}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter Module ID'
                                        disabled={editMode}
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="fmsType" className="mb-3">
                                    <Form.Label>Type of Module</Form.Label>
                                    <Select
                                        name="fmsType"
                                        options={options}
                                        value={options.find(option => option.value === module.fmsType)}
                                        onChange={selectedOption => handleChange(null, 'fmsType', selectedOption?.value)}
                                        placeholder="Select Fms Type"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>

                                <Form.Group controlId="misExempt" className="mb-3">
                                    <Form.Label>MIS Exempt:</Form.Label>

                                    <Select
                                        name="statusID"
                                        value={misExempt.find((mod) => mod.name === module.misExempt)}
                                        onChange={(selectedOption) => {
                                            setModule({
                                                ...module,
                                                misExempt: selectedOption?.name || '',
                                            });
                                        }}
                                        getOptionLabel={(mod) => mod.name}
                                        getOptionValue={(mod) => mod.name}
                                        options={misExempt}
                                        isSearchable={true}
                                        placeholder="Select Exempt"
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>

                                <Form.Group controlId="statusID" className="mb-3">
                                    <Form.Label>Status:</Form.Label>
                                    <Select
                                        name="statusID"
                                        value={statusID.find((mod) => mod.id === module.statusID)}
                                        onChange={(selectedOption) => {
                                            setModule({
                                                ...module,
                                                statusID: selectedOption?.id || 0,
                                            });
                                        }}
                                        getOptionLabel={(mod) => mod.id === 1 ? 'ACTIVE' : "INACTIVE"}
                                        getOptionValue={(mod) => mod.id === 1 ? 'ACTIVE' : "INACTIVE"}
                                        options={statusID}
                                        isSearchable={true}
                                        placeholder="Select Status"
                                        required
                                    />
                                </Form.Group>
                            </Col>


                            <Col></Col>
                            <Col lg={2} className='align-items-end d-flex justify-content-end mb-3'>
                                <ButtonGroup aria-label="Basic example" className='w-100'>
                                    <Link to={'/pages/ModuleMaster'} className="btn btn-primary">
                                        Back
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update Module' : 'Add Module'}
                                    </Button>
                                </ButtonGroup>
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