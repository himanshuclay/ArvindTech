import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row, ButtonGroup } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
import Select from 'react-select';
import { toast } from 'react-toastify';



interface Process {
    id: number;
    moduleName: string;
    moduleID: string;
    processID: string;
    processDisplayName: string;
    misExempt: string;
    status: string;
    processObjective: string;
    processFlowchart: string;
    processOwnerID: string;
    processOwnerName: string;
    intervalType: string;
    day: string;
    time: string;
    date: string;
    dateValue: string;
    periodFrom: string;
    weekFrom: string;
    weekTo: string;
    periodTo: string;
    type: string;
    shopID: string;
    shopName: string;
    month: string;
    source: string;
    createdBy: string;
    updatedBy: string;
}

interface GetTypeDayTimeList {
    id: number;
    name: string;
}

const HumanResource = () => {
    toast.dismiss()
    const { id } = useParams<{ id: string }>();

    const navigate = useNavigate();

    const [empName, setEmpName] = useState<string | null>('')
    const [process, setProcess] = useState<Process>({
        id: 0,
        moduleName: '',
        moduleID: '',
        processID: '',
        processDisplayName: '',
        misExempt: '',
        status: '',
        processObjective: '',
        processFlowchart: '',
        processOwnerID: '',
        processOwnerName: '',
        intervalType: '',
        day: '',
        time: '',
        date: '',
        dateValue: '',
        periodFrom: '',
        weekFrom: '',
        weekTo: '',
        periodTo: '',
        type: '',
        shopID: '',
        shopName: '',
        month: '',
        source: '',
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
            fetchModuleById(id);
        }
    }, [id]);

    // useEffect(() => {

    //     fetchMessDetails(process.moduleName, process.processID);

    // }, [process.moduleName, process.processID]);

    useEffect(() => {
        GetTypeDayTimeList(1, setDropdownValuesFlag1);
        GetTypeDayTimeList(2, setDropdownValuesFlag2);
        GetTypeDayTimeList(3, setDropdownValuesFlag3);
        GetTypeDayTimeList(4, setDropdownValuesFlag4);
    }, []);

    const fetchModuleById = async (id: string) => {
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/InitiationMaster/GetAccountIInitiation`, {
                params: { id: id }
            });
            if (response.data.isSuccess) {
                const fetchedModule = response.data.getAccountIInitiation;
                setProcess(fetchedModule);
                console.log(fetchedModule);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching module:', error);
        }
    };


 



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
    const handleChange = (e: ChangeEvent<any> | null, name?: string, value?: any) => {
        if (e) {
            const { name: eventName, type } = e.target;

            if (type === 'checkbox') {
                const checked = (e.target as HTMLInputElement).checked;
                setProcess({
                    ...process,
                    [eventName]: checked
                });
            } else {
                const inputValue = (e.target as HTMLInputElement | HTMLSelectElement).value;
                setProcess({
                    ...process,
                    [eventName]: inputValue
                });
            }
        } else if (name) {
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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        const payload = {
            ...process,
            updatedBy: empName
        };
        console.log(payload)
        e.preventDefault();
        try {
            await axios.post(`${config.API_URL_APPLICATION}/InitiationMaster/UpdateAccountIInitiation`, payload);
            navigate('/pages/ProcessMaster', {
                state: {
                    successMessage: "Process Initiated successfully!",
                }
            });

        } catch (error:any) {
            toast.error(error || "Error Adding/Updating");
            console.error('Error submitting module:', error);
        }
    };


    const intervalTypeValidIDs = ['HR.01', 'HR.02', 'HR.03', 'HR.04', 'HR.05','HR.06','HR.07'];
    const timeValidIDs = ['HR.01', 'HR.02', 'HR.03', 'HR.04', 'HR.05','HR.06','HR.07'];
    const shopIDValidIDs = ['HR.02'];
    const shopNameValidIDs = ['HR.02'];
    const processAmountValidIDs = ['HR.02'];
  
    return (
        <div>
            <div >


                <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center fs-20 rounded-3 border">
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>Process Initiation </span></span>
                </div>

                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col lg={6}>
                                <Form.Group controlId="moduleDisplayName" className="mb-3">
                                    <Form.Label>Module Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="moduleDisplayName"
                                        value={process.moduleName}
                                        readOnly
                                        disabled
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="processDisplayName" className="mb-3">
                                    <Form.Label>Process Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="processDisplayName"
                                        value={process.processDisplayName}
                                        disabled
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="processObjective" className="mb-3">
                                    <Form.Label>Process Objective:</Form.Label>
                                    <Form.Control
                                        type="textarea"
                                        name="processObjective"
                                        value={process.processObjective ? process.processObjective : 'No File Avilable'}
                                        readOnly
                                        disabled
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="processFlowchart" className="mb-3 position-relative">
                                    <Form.Label>Process Flowchart:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="processFlowchart"
                                        readOnly
                                        disabled
                                    />

                                    {process.processFlowchart && (
                                        <div className="mt-2 position-absolute download-file">
                                            <a
                                                href={`path_to_your_files/${process.processFlowchart}`}
                                                download={process.processFlowchart}
                                                className="btn btn-link"
                                            >
                                                <i className="ri-download-fill"></i>
                                            </a>
                                        </div>
                                    )}
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="misExempt" className="mb-3">
                                    <Form.Label>MIS Exempt:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="misExempt"
                                        value={process.misExempt}
                                        disabled
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="status1" className="mb-3">
                                    <Form.Label>Status:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="status1"
                                        value={process.status}
                                        disabled
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="processOwnerName" className="mb-3">
                                    <Form.Label>Process Owner Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="processOwnerName"
                                        value={process.processOwnerName}
                                        disabled
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={12}>

                                <Row>
                                    <h4>Specific Time</h4>

                                    {intervalTypeValidIDs.includes(process.processID) && (
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
                                    )}


                                    {["Weekly"].includes(process.intervalType) && (['HR.01', 'HR.02', 'HR.03', 'HR.04', 'HR.05','HR.06','HR.07'].includes(process.processID)) && (
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
                                    )}

                                    {["Monthly"].includes(process.intervalType)&& (['HR.01', 'HR.02', 'HR.03', 'HR.04', 'HR.05','HR.06','HR.07'].includes(process.processID)) && (
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
                                    )}

                                    {timeValidIDs.includes(process.processID) && (
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
                                    )}
                                </Row>

                            </Col>


                            {shopIDValidIDs.includes(process.processID) && (
                                <Col lg={6}>
                                    <Form.Group controlId="shopID" className="mb-3">
                                        <Form.Label>Shop ID</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="shopID"
                                            value={process.shopID}
                                            onChange={handleChange}
                                            required
                                            placeholder='Enter Shop ID'

                                        />
                                    </Form.Group>
                                </Col>
                            )}
                            {shopNameValidIDs.includes(process.processID) && (
                                <Col lg={6}>
                                    <Form.Group controlId="shopName" className="mb-3">
                                        <Form.Label>Shop Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="shopName"
                                            value={process.shopName}
                                            onChange={handleChange}
                                            required
                                            placeholder='Enter Shop Name'
                                        />
                                    </Form.Group>
                                </Col>
                            )}

                            {processAmountValidIDs.includes(process.processID) && (
                                <Col lg={6}>
                                    <Form.Group controlId="processedAmount" className="mb-3">
                                        <Form.Label>Processed Amount</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="processedAmount"
                                            value={process.shopName}
                                            onChange={handleChange}
                                            required
                                            placeholder='Enter Processed Amount'
                                        />
                                    </Form.Group>
                                </Col>
                            )}


                            <Col></Col>
                            <Col lg={2} className='align-items-end d-flex justify-content-end mb-3'>
                                <ButtonGroup aria-label="Basic example" className='w-100'>
                                    <Link to={'/pages/ProcessMaster'} className="btn btn-primary">
                                        Back
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        Initate Process
                                    </Button>
                                </ButtonGroup>
                            </Col>

                        </Row>

                    </Form>
                </div>

            </div>
        </div >
    );
};

export default HumanResource;