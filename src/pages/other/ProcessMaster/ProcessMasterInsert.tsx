import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row, ButtonGroup } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
import Select from 'react-select';
// import Flatpickr from 'react-flatpickr';
// import 'flatpickr/dist/themes/material_green.css';
import CustomSuccessToast from '../Component/CustomSuccessToast';

interface Process {
    id: number;
    moduleName: string;
    processID: string;
    processDisplayName: string;
    misExempt: string;
    processObjective: string;
    processFlowchart: string;
    processOwnerID: string;
    processOwnerName: string;
    intervalType: string;
    status: string;
    day: string;
    time: string;
    date: string;
    periodFrom: string;
    periodTo: string;
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
interface GetTypeDayTimeList {
    id: number;
    name: string;
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
        processDisplayName: '',
        misExempt: '',
        processObjective: '',
        processFlowchart: '',
        processOwnerID: '',
        processOwnerName: '',
        status: '',
        intervalType: '',
        day: '',
        time: '',
        date: '',
        periodFrom: '',
        periodTo: '',
        createdBy: '',
        updatedBy: ''
    });
    const [dropdownValuesFlag1, setDropdownValuesFlag1] = useState<GetTypeDayTimeList[]>([]);
    const [dropdownValuesFlag2, setDropdownValuesFlag2] = useState<GetTypeDayTimeList[]>([]);
    const [dropdownValuesFlag3, setDropdownValuesFlag3] = useState<GetTypeDayTimeList[]>([]);
    const [dropdownValuesFlag4, setDropdownValuesFlag4] = useState<GetTypeDayTimeList[]>([]);


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

    useEffect(() => {
        GetTypeDayTimeList(1, setDropdownValuesFlag1);
        GetTypeDayTimeList(2, setDropdownValuesFlag2);
        GetTypeDayTimeList(3, setDropdownValuesFlag3);
        GetTypeDayTimeList(4, setDropdownValuesFlag4);
    }, []);

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



    const GetTypeDayTimeList = async (flag: any, setStateCallback: any) => {
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/CommonDropdown/GetTypeDayTimeList?flag=${flag}`);
            if (response.data.isSuccess) {
                setStateCallback(response.data.typeListResponses);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching modules:', error);
        }

    };




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

    useEffect(() => {
        if (["Daily"].includes(process.intervalType)) {
            setProcess(process => ({
                ...process,
                day: '',
            }));
        }
    }, [process.intervalType]);
    
    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        const payload = {
            ...process,
            createdBy: editMode ? process.createdBy : empName,
            updatedBy: editMode ? empName : '',
        };
        console.log(payload)
        e.preventDefault();
        try {
            if (editMode) {
                await axios.post(`${config.API_URL_APPLICATION}/ProcessMaster/UpdateProcess`, payload);
                navigate('/pages/ProcessMaster', { state: { 
                    showToast: true,
                    toastMessage:"Process Updated successfully!",
                    toastVariant:"rgb(28 175 85)"
                   } });
            } else {
                await axios.post(`${config.API_URL_APPLICATION}/ProcessMaster/InsertProcess`, payload);
                navigate('/pages/ProcessMaster', { state: { 
                    showToast: true,
                    toastMessage:"Process Added successfully!",
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
                                <Form.Group controlId="processFlowchart" className="mb-3">
                                    <Form.Label>Process Flowchart:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="processFlowchart"
                                        value={process.processFlowchart}
                                        onChange={handleChange}
                                        required
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
                                <Form.Group controlId="periodFrom" className="mb-3">
                                    <Form.Label>Period From</Form.Label>
                                    <Select
                                        name="periodFrom"
                                        value={dropdownValuesFlag4.find((exempt) => exempt.name === process.periodFrom)}
                                        onChange={(selectedOption) => {
                                            setProcess({
                                                ...process,
                                                periodFrom: selectedOption?.name || '',
                                            });
                                        }}
                                        getOptionLabel={(item) => item.name}
                                        getOptionValue={(item) => item.name}
                                        options={dropdownValuesFlag4}
                                        isSearchable={true}
                                        placeholder="Select Date"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="periodTo" className="mb-3">
                                    <Form.Label>Period To</Form.Label>
                                    <Select
                                        name="periodTo"
                                        value={dropdownValuesFlag4.find((exempt) => exempt.name === process.periodTo)}
                                        onChange={(selectedOption) => {
                                            setProcess({
                                                ...process,
                                                periodTo: selectedOption?.name || '',
                                            });
                                        }}
                                        getOptionLabel={(item) => item.name}
                                        getOptionValue={(item) => item.name}
                                        options={dropdownValuesFlag4}
                                        isSearchable={true}
                                        placeholder="Select Date"
                                        required
                                    />
                                </Form.Group>
                            </Col>


                            <Col lg={6}>
                                <Form.Group controlId="intervalType" className="mb-3">
                                    <Form.Label>Interval Type:</Form.Label>
                                    <Select
                                        name="intervalType"
                                        value={dropdownValuesFlag1.find((item) => item.name === process.intervalType)}
                                        onChange={(selectedOption) => {
                                            setProcess({
                                                ...process,
                                                intervalType: selectedOption?.name || '',
                                            });
                                        }}
                                        getOptionLabel={(item) => item.name}
                                        getOptionValue={(item) => item.name}
                                        options={dropdownValuesFlag1}
                                        isSearchable={true}
                                        placeholder="Select Interval Type"
                                        required
                                    />
                                </Form.Group>
                            </Col>

                         
                            {["Weekly"].includes(process.intervalType) &&
                                        <Col lg={6}>
                                            <Form.Group controlId="intervalType" className="mb-3">
                                                <Form.Label>Day:</Form.Label>
                                                <Select
                                                    name="day"
                                                    value={dropdownValuesFlag2.find((item) => item.name === process.day)}
                                                    onChange={(selectedOption) => {
                                                        setProcess({
                                                            ...process,
                                                            day: selectedOption?.name || '',
                                                        });
                                                    }}
                                                    getOptionLabel={(item) => item.name}
                                                    getOptionValue={(item) => item.name}
                                                    options={dropdownValuesFlag2}
                                                    isSearchable={true}
                                                    placeholder="Select Day"
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    }

                                    {["Monthly"].includes(process.intervalType) &&
                                        <Col lg={6}>
                                            <Form.Group controlId="date" className="mb-3">
                                                <Form.Label>Date:</Form.Label>
                                                <Select
                                                    name="date"
                                                    value={dropdownValuesFlag4.find((item) => item.name === process.day)}
                                                    onChange={(selectedOption) => {
                                                        setProcess({
                                                            ...process,
                                                            date: selectedOption?.name || '',
                                                        });
                                                    }}
                                                    getOptionLabel={(item) => item.name}
                                                    getOptionValue={(item) => item.name}
                                                    options={dropdownValuesFlag4}
                                                    isSearchable={true}
                                                    placeholder="Select Date"
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    }

                                    < Col lg={6}>
                                        <Form.Group controlId="time" className="mb-3">
                                            <Form.Label>Time:</Form.Label>
                                            <Select
                                                name="time"
                                                value={dropdownValuesFlag3.find((item) => item.name === process.time)}
                                                onChange={(selectedOption) => {
                                                    setProcess({
                                                        ...process,
                                                        time: selectedOption?.name || '',
                                                    });
                                                }}
                                                getOptionLabel={(item) => item.name}
                                                getOptionValue={(item) => item.name}
                                                options={dropdownValuesFlag3}
                                                isSearchable={true}
                                                placeholder="Select Time"
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