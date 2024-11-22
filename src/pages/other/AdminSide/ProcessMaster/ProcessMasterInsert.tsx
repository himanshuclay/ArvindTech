import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row, ButtonGroup } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
import Select from 'react-select';
import { FileUploader } from '@/components/FileUploader'
import CustomSuccessToast from '../../Component/CustomSuccessToast';

interface Process {
    id: number;
    moduleName: string;
    moduleID: string;
    processID: string;
    processDisplayName: string;
    misExempt: string;
    processObjective: string;
    processFlowchart: string;
    processOwnerID: string;
    processOwnerName: string;
    status: string;
    createdBy: string;
    updatedBy: string;
}


interface MISExempt {
    id: number;
    name: string;
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

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState('');
    const [editMode, setEditMode] = useState<boolean>(false);
    const [misExempt, setMisExempt] = useState<MISExempt[]>([]);
    const [moduleDisplayName, setModuleDisplayName] = useState<ModuleDisplayName[]>([]);
    const [processOwnerName, setProcessOwnerName] = useState<ModuleOwnerName[]>([]);
    const [empName, setEmpName] = useState<string | null>('')
    const [process, setProcess] = useState<Process>({
        id: 0,
        moduleName: '',
        processID: '',
        moduleID: '',
        processDisplayName: '',
        misExempt: '',
        processObjective: '',
        processFlowchart: '',
        processOwnerID: '',
        processOwnerName: '',
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
            setProcess((process) => ({
                ...process,
                updatedBy: empName || '',
                createdBy: ''

            }));
        } else {
            setEditMode(false);
            setProcess((process) => ({
                ...process,
                createdBy: empName || '',
                updatedBy: ''

            }));
        }
    }, [id]);



    const fetchModuleById = async (id: string) => {
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/ProcessMaster/GetProcess`, {
                params: { id: id }
            });
            if (response.data.isSuccess) {
                const fetchedModule = response.data.processMasterList[0];
                setProcess(fetchedModule);
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
                    setProcessOwnerName(response.data.employeeLists);
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
            setProcess({
                ...process,
                [name]: checked
            });
        } else {
            const value = (e.target as HTMLInputElement | HTMLSelectElement).value;
            setProcess({
                ...process,
                [name]: value
            });
        }
    };


    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        const payload = {
            ...process,
            createdBy: editMode ? process.createdBy : empName,
            updatedBy: editMode ? empName : '',
        };
        // console.log(payload)
        e.preventDefault();

        try {
            const apiUrl = `${config.API_URL_APPLICATION}/ProcessMaster/${editMode ? 'UpdateProcess' : 'InsertProcess'}`;
            const response = await axios.post(apiUrl, payload);

            if (response.status === 200) {
                navigate('/pages/ProcessMaster', {
                    state: {
                        showToast: true,
                        toastMessage: editMode ? "Process updated successfully!" : "Process added successfully!",
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


    return (
        <div>
            <div className="container">
                <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center fs-20 rounded-3 border">
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit Process' : 'Add Process'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col lg={6}>
                                <Form.Group controlId="moduleName" className="mb-3">
                                    <Form.Label>Module Name</Form.Label>
                                    <Select
                                        name="moduleName"
                                        value={moduleDisplayName.find((mod) => mod.moduleName === process.moduleName)}
                                        onChange={(selectedOption) => {
                                            setProcess({
                                                ...process,
                                                moduleName: selectedOption?.moduleName || '',
                                                moduleID: selectedOption?.moduleID || '',
                                            });
                                        }}
                                        getOptionLabel={(mod) => mod.moduleName}
                                        getOptionValue={(mod) => mod.moduleName}
                                        options={moduleDisplayName}
                                        isSearchable={true}
                                        placeholder="Select Module Name"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="processID" className="mb-3">
                                    <Form.Label>Process  ID</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="processID"
                                        value={process.processID.toLocaleUpperCase()}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter Process ID'
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="processDisplayName" className="mb-3">
                                    <Form.Label>Process  Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="processDisplayName"
                                        value={process.processDisplayName}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter Process Name'
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="processObjective" className="mb-3">
                                    <Form.Label>Process Objective:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="processObjective"
                                        value={process.processObjective}
                                        onChange={handleChange}
                                        placeholder='Enter Process Objective'
                                    // required
                                    />
                                </Form.Group>
                            </Col>

                           

                            <Col lg={6}>
                                <Form.Group controlId="misExempt" className="mb-3">
                                    <Form.Label>MIS Exempt:</Form.Label>
                                    <Select
                                        name="misExempt"
                                        value={misExempt.find((exempt) => exempt.name === process.misExempt)}
                                        onChange={(selectedOption) => {
                                            setProcess({
                                                ...process,
                                                misExempt: selectedOption?.name || '',
                                            });
                                        }}
                                        getOptionLabel={(exempt) => exempt.name}
                                        getOptionValue={(exempt) => exempt.name}
                                        options={misExempt}
                                        isSearchable={true}
                                        placeholder="Select MIS Exempt"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="status" className="mb-3">
                                    <Form.Label>Status:</Form.Label>
                                    <Select
                                        name="status"
                                        value={misExempt.find((exempt) => exempt.name === process.status)}
                                        onChange={(selectedOption) => {
                                            setProcess({
                                                ...process,
                                                status: selectedOption?.name || '',
                                            });
                                        }}
                                        getOptionLabel={(item) => item.name}
                                        getOptionValue={(item) => item.name}
                                        options={misExempt}
                                        isSearchable={true}
                                        placeholder="Select Status"
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="processOwnerName" className="mb-3">
                                    <Form.Label>Process Owner Name</Form.Label>
                                    <Select
                                        name="processOwnerName"
                                        value={processOwnerName.find(
                                            (mod) => mod.employeeName === process.processOwnerName
                                        )}
                                        onChange={(selectedOption) => {
                                            setProcess({
                                                ...process,
                                                processOwnerName: selectedOption?.employeeName || '',
                                                processOwnerID: selectedOption?.empId || '',
                                            });
                                        }}
                                        getOptionLabel={(mod) => mod.employeeName}
                                        getOptionValue={(mod) => mod.employeeName}
                                        options={processOwnerName}
                                        isSearchable={true}
                                        placeholder="Select Process Owner Name"
                                        required
                                    />
                                </Form.Group>
                            </Col>


                            <Col></Col>
                            <Col lg={2} className='align-items-end d-flex justify-content-end mb-3'>
                                <ButtonGroup aria-label="Basic example" className='w-100'>
                                    <Link to={'/pages/ProcessMaster'} className="btn btn-primary">
                                        Back
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update Process' : 'Add Process'}
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

export default EmployeeInsert;