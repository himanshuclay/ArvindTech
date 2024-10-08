import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';

interface Module {
    id: number;
    moduleDisplayName: string;
    fmsType: string;
    moduleID: string;
    misExempt: number;
    statusID: number;
    moduleOwnerID: string;
    moduleOwnerName: string;
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
interface ModuleDisplayName {
    id: number;
    moduleID: string;
    moduleName: string;
}
interface ModuleOwnerName {
    empId: string;
    employeeName: string;
}

const EmployeeInsert = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [editMode, setEditMode] = useState<boolean>(false);
    const [misExempt, setMisExempt] = useState<MISExempt[]>([]);
    const [statusID, setStatusID] = useState<Status[]>([]);
    const [moduleDisplayName, setModuleDisplayName] = useState<ModuleDisplayName[]>([]);
    const [moduleOwnerName, setModuleOwnerName] = useState<ModuleOwnerName[]>([]);
    const [empName, setEmpName] = useState<string | null>('Admin')
    const [module, setModule] = useState<Module>({
        id: 0,
        moduleDisplayName: '',
        fmsType: '',
        moduleID: '',
        misExempt: 0,
        statusID: 0,
        moduleOwnerID: '',
        moduleOwnerName: '',
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
            setModule((module) => ({
                ...module,
                updatedBy: empName || '',
                createdBy: ''

            }));
        } else {
            setEditMode(false);
            setModule((module) => ({
                ...module,
                createdBy: empName || '',
                updatedBy: ''

            }));
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
        const fetchMISExempt = async () => {
            try {
                const response = await axios.get(`${config.API_URL_APPLICATION}/CommonDropdown/GetMISExempt`);
                if (response.data.isSuccess) {
                    setMisExempt(response.data.mISExemptListResponses);
                } else {
                    console.error(response.data.message);
                }
            } catch (error) {
                console.error('Error fetching MIS Exempt list:', error);
            }
        };
        fetchMISExempt();
    }, []);

    useEffect(() => {
        const fetchStatusID = async () => {
            try {
                const response = await axios.get(`${config.API_URL_APPLICATION}/CommonDropdown/GetStatus`);
                if (response.data.isSuccess) {
                    setStatusID(response.data.statusListResponses);
                } else {
                    console.error(response.data.message);
                }
            } catch (error) {
                console.error('Error fetching MIS Exempt list:', error);
            }
        };
        fetchStatusID();
    }, []);


    useEffect(() => {
        const fetchModuleDisplayName = async () => {
            try {
                const response = await axios.get(`${config.API_URL_APPLICATION}/CommonDropdown/GetModuleList`);
                if (response.data.isSuccess) {
                    setModuleDisplayName(response.data.moduleNameListResponses);
                } else {
                    console.error(response.data.message);
                }
            } catch (error) {
                console.error('Error fetching MIS Exempt list:', error);
            }
        };
        fetchModuleDisplayName();
    }, []);


    useEffect(() => {
        const fetchModuleOwnerName = async () => {
            try {
                const response = await axios.get(`${config.API_URL_APPLICATION}/CommonDropdown/GetEmployeeListWithId`);
                if (response.data.isSuccess) {
                    setModuleOwnerName(response.data.employeeLists);
                } else {
                    console.error(response.data.message);
                }
            } catch (error) {
                console.error('Error fetching MIS Exempt list:', error);
            }
        };
        fetchModuleOwnerName();
    }, []);


    // Handle form field changes
    const handleChange = (e: ChangeEvent<any>) => {
        const { name, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setModule({
                ...module,
                [name]: checked
            });
        } else {
            const value = (e.target as HTMLInputElement | HTMLSelectElement).value;
            setModule({
                ...module,
                [name]: value
            });
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        console.log(module)
        e.preventDefault();
        try {
            if (editMode) {
                await axios.post(`${config.API_URL_APPLICATION}/ModuleMaster/UpdateModule`, module);
            } else {
                await axios.post(`${config.API_URL_APPLICATION}/ModuleMaster/InsertModule`, module);
            }
            navigate('/pages/ModuleMaster');  
        } catch (error) {
            console.error('Error submitting module:', error);
        }
    };

    return (
        <div>
            <div className="container">
                <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center fs-20">
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit Module' : 'Add Module'}</span></span>
                </div>

                <Form onSubmit={handleSubmit}>


                    <Row>

                        <Col lg={6}>

                            <Form.Group controlId="moduleDisplayName" className="mb-3">
                                <Form.Label>Module Display Name</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="moduleDisplayName"
                                    value={module.moduleDisplayName}
                                    onChange={(e) => {
                                        const selectedModule = moduleDisplayName.find(
                                            (mod) => mod.moduleName === e.target.value
                                        ); // Find the corresponding module object
                                        setModule({
                                            ...module,
                                            moduleDisplayName: e.target.value,
                                            moduleID: selectedModule?.moduleID || '', // Set the moduleID if found
                                        });
                                    }}
                                >
                                    <option value="">Select Module Display Name</option>
                                    {moduleDisplayName ? (
                                        moduleDisplayName.map((mod) => (
                                            <option key={mod.id} value={mod.moduleName}>
                                                {mod.moduleName}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>No modules available</option> // Fallback when no data is available
                                    )}
                                </Form.Control>
                            </Form.Group>

                        </Col>

                        <Col lg={6}>

                            <Form.Group controlId="fmsType" className="mb-3">
                                <Form.Label>FMS Type:</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="fmsType"
                                    value={module.fmsType}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>

                        <Col lg={6}>

                            <Form.Group controlId="misExempt" className="mb-3">
                                <Form.Label>MIS Exempt:</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="misExempt"
                                    value={module.misExempt}
                                    onChange={(e) => setModule({ ...module, misExempt: e.target.value })}
                                >
                                    <option value="">Select MIS Exempt</option>
                                    {misExempt.length > 0 ? (
                                        misExempt.map((exempt) => (
                                            <option key={exempt.id} value={exempt.name}>
                                                {exempt.name}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>No MIS Exempt IDs available</option>
                                    )}
                                </Form.Control>
                            </Form.Group>
                        </Col>

                        <Col lg={6}>

                            <Form.Group controlId="statusID" className="mb-3">
                                <Form.Label>Status ID:</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="statusID"
                                    value={module.statusID}
                                    onChange={(e) => setModule({ ...module, statusID: parseInt(e.target.value) })}
                                >
                                    <option value="">Select Status ID</option>
                                    {statusID.length > 0 ? (
                                        statusID.map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.id == 1 ? "True" : "False"}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>No Status IDs available</option>
                                    )}
                                </Form.Control>
                            </Form.Group>
                        </Col>

                        <Col lg={6}>

                            <Form.Group controlId="moduleOwnerName" className="mb-3">
                                <Form.Label>Module Owner Name</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="moduleOwnerName"
                                    value={module.moduleOwnerName}
                                    onChange={(e) => {
                                        const selectedModule = moduleOwnerName.find(
                                            (mod) => mod.employeeName === e.target.value
                                        ); // Find the corresponding module object
                                        setModule({
                                            ...module,
                                            moduleOwnerName: e.target.value,
                                            moduleOwnerID: selectedModule?.empId || '', // Set the moduleID if found
                                        });
                                    }}
                                >
                                    <option value="">Select Module Owner Name</option>
                                    {moduleOwnerName ? (
                                        moduleOwnerName.map((mod) => (
                                            <option key={mod.empId} value={mod.employeeName}>
                                                {mod.employeeName}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>No modules available</option> // Fallback when no data is available
                                    )}
                                </Form.Control>
                            </Form.Group>
                        </Col>



                        <Col className='align-items-end d-flex justify-content-end mb-3'>

                            <Link to={'/pages/ModuleMaster'}>
                                <Button variant="primary" >
                                    Back
                                </Button>
                            </Link>

                            &nbsp;
                            <Button variant="primary" type="submit">
                                {editMode ? 'Update Module' : 'Add Module'}
                            </Button>
                        </Col>

                    </Row>

                </Form>
            </div>
        </div>
    );
};

export default EmployeeInsert;
