import axios from 'axios';
import { useEffect, useState,  useRef } from 'react';
import { Button, Col, Form, Row, ButtonGroup, Overlay, Popover } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
import Select from 'react-select';
import CustomSuccessToast from '@/pages/other/Component/CustomSuccessToast';

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
const AccountProcess = () => {
    const { id } = useParams<{ id: string }>();
    const { processID } = useParams<{ processID: string }>();

    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState('');
    const [empName, setEmpName] = useState<string | null>('')
    const [show, setShow] = useState(false);
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
                    showToast: true,
                    toastMessage: "Process Initiated successfully!",
                    toastVariant: "rgb(28 175 85)"
                }
            });

        } catch (error) {
            setToastMessage("Error Adding/Updating");
            setToastVariant("rgb(213 18 18)");
            setShowToast(true);
            console.error('Error submitting module:', error);
        }
    };

    const intervalTypeValidIDs = ['ACC.01', 'ACC.02', 'ACC.03', 'ACC.04', 'ACC.05'];
    const timeValidIDs = ['ACC.01', 'ACC.02', 'ACC.03', 'ACC.04', 'ACC.05'];

    const [target, setTarget] = useState<HTMLElement | null>(null);
    const ref = useRef(null);


    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setShow(!show);
        setTarget(event.target as HTMLElement);
    };

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


                                    {["Weekly"].includes(process.intervalType) && (['ACC.01', 'ACC.02', 'ACC.03', 'ACC.04', 'ACC.05'].includes(process.processID)) && (
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

                                    {["Monthly"].includes(process.intervalType) && (['ACC.01', 'ACC.02', 'ACC.03', 'ACC.04', 'ACC.05'].includes(process.processID)) && (
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

                            

                        

                            <Col lg={2} className='align-items-end d-flex justify-content-end mb-3'>
                                <ButtonGroup aria-label="Basic example" className='w-100'>
                                    <Button variant="primary" onClick={handleClick}>
                                        View Initiation Fields
                                    </Button>
                                </ButtonGroup>
                            </Col>
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
            <CustomSuccessToast show={showToast} toastMessage={toastMessage} toastVariant={toastVariant} onClose={() => setShowToast(false)} />

            <Overlay
                show={show}
                target={target}
                placement="right"
                container={ref.current}
                rootClose
                onHide={() => setShow(false)}
            >
                <Popover id="popover-basic" className='initiation-popup'>
                    <Popover.Header as="h3" className="text-dark">
                        Initiation  Fields
                    </Popover.Header>
                    <Popover.Body>
                        {
                            processID === 'ACC.01' ? <ul className="fs-15 text-dark">
                                <li>Project</li>
                                <li>Period</li>
                                <li>Mess Name</li>
                                <li>Week</li>
                                <li>Mess Manager</li>
                                <li>Source</li>
                            </ul> :
                                processID === 'ACC.02' ?
                                    <ul className="fs-15 text-dark">
                                        <li>Project</li>
                                        <li>Period</li>
                                        <li>Mess Name</li>
                                        <li>Mess Manager EmpID</li>
                                        <li>Mess Manager Name</li>
                                        <li>ShopID</li>
                                        <li>Shop Name</li>
                                        <li>ReconID</li>
                                    </ul> :
                                    processID === 'ACC.03' ?
                                        <ul className="fs-15 text-dark">
                                            <li>Project</li>
                                            <li>Period</li>
                                            <li>Month</li>
                                            <li>Source</li>
                                        </ul> :
                                        processID === 'ACC.04' ?
                                            <ul className="fs-15 text-dark">
                                                <li>Project</li>
                                                <li>Period</li>
                                                <li>ID</li>
                                                <li>Source</li>
                                            </ul> :
                                            processID === 'ACC.05' ?
                                                <ul className="fs-15 text-dark">
                                                    <li>Project</li>
                                                    <li>Period</li>
                                                    <li>Date</li>
                                                </ul> : null

                        }





                    </Popover.Body>
                </Popover>
            </Overlay>
        </div >
    );
};

export default AccountProcess;