import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Button, Col, Form, Row, ButtonGroup, Overlay, Popover } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';

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




const MDO = () => {
    const { id, processID } = useParams<{ id: string, processID: string }>();
    const [show, setShow] = useState(false);

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


    const [target, setTarget] = useState<HTMLElement | null>(null);
    const ref = useRef(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setShow(!show);
        setTarget(event.target as HTMLElement);
    };

    useEffect(() => {
        toast.dismiss();
        const storedEmpName = localStorage.getItem('EmpName');
        const storedEmpID = localStorage.getItem('EmpId');
        if (storedEmpName || storedEmpID) {
            setEmpName(`${storedEmpName} - ${storedEmpID}`);
        }
    }, []);

    useEffect(() => {
        if (id) {
            fetchModuleById(id);
        }
    }, [id]);



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
            moduleName: process.moduleName,
            taskNumber: processID,
            createdBy: empName
        };
        console.log(payload)
        e.preventDefault();
        try {
            const response = await axios.post(
                `${config.API_URL_ACCOUNT}/ProcessInitiation/ManualProcessTaskInitiation`,
                payload
            );
            if (response.status >= 200 && response.status < 300) {
                navigate('/pages/ProcessInitiation', {
                    state: {
                        successMessage: "Process Initiated successfully!",
                    }
                });
            } else {
                toast.warning("Process initiated with unexpected status code.");
                console.warn('Unexpected response:', response);
            }

        } catch (error: any) {
            toast.error(error || "Error Adding/Updating");
            console.error('Error submitting module:', error);
        }
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
                        </Row>

                        <Row>
                            <Col lg={3} className='align-items-end d-flex justify-content-end mb-3'>
                                <ButtonGroup aria-label="Basic example" className='w-100'>
                                    <Link to={'/pages/ProcessInitiation'} className="btn btn-primary">
                                        Back
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" onClick={handleClick}>
                                        View Initiation Fields
                                    </Button>
                                </ButtonGroup>
                            </Col>
                            <Col></Col>

                            <Col lg={3} className='align-items-end d-flex justify-content-end mb-3'>
                                <ButtonGroup aria-label="Basic example" className='w-100'>

                                    <Button variant="primary" type="submit">
                                        Initate Process
                                    </Button>
                                </ButtonGroup>
                            </Col>
                        </Row>

                    </Form>
                </div>
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
                                processID === 'MDO.01' ? <ul className="fs-15 text-dark">
                                    <li>Delegation form as and when it is filled with the Fields as mentioned in Form Fields</li>

                                </ul> :
                                    processID === 'MDO.02' ?
                                        <ul className="fs-15 text-dark">
                                            <li>Helpticket form as and when it is filled with the Fields as mentioned in Form Fields</li>

                                        </ul> :
                                        processID === 'MDO.03' ?
                                            <ul className="fs-15 text-dark">
                                                <li>Initiation through Help form filled either at Task Level / App Level / Login Level</li>

                                            </ul> :
                                            processID === 'MDO.04' ?
                                                <ul className="fs-15 text-dark">
                                                    <li>Reported Date</li>
                                                    <li>Employee Name</li>
                                                    <li>Employee ID</li>
                                                    <li>Project [Employee Master]</li>
                                                    <li>Designation [Employee Master]</li>
                                                    <li>HR Updated Mobile [Employee Master]</li>
                                                    <li>User Updated Mobile [Employee Master]</li>
                                                    <li>ObservationID Count [EMP ID][Repeat]</li>

                                                </ul> :
                                                processID === 'MDO.05' ?
                                                    <ul className="fs-15 text-dark">
                                                        <li>Task Creation Date</li>
                                                        <li>LNID</li>
                                                        <li>TaskID</li>
                                                        <li>TaskName</li>
                                                        <li>TaskDoer [No Doer Assigned]</li>
                                                        <li>Last Doer Changed by</li>
                                                        <li>Last Doer Change Datetime</li>
                                                        <li>Last Doer Change Reason </li>
                                                        <li>Identifiers and the respective values</li>
                                                        <li>Issue Type</li>

                                                    </ul> :
                                                    processID === 'MDO.06' ?
                                                        <ul className="fs-15 text-dark">
                                                            <li>Training Requirement Date</li>
                                                            <li>Employee Name</li>
                                                            <li>Employee ID</li>
                                                            <li>Project [Employee Master]</li>
                                                            <li>HR Updated Mobile [Employee Master]</li>
                                                            <li>User Updated Mobile [Employee Master]</li>
                                                            <li>Training Requirement Description</li>
                                                            <li>TrainingID [Auto]</li>
                                                        </ul> :
                                                        processID === 'MDO.07' ?
                                                            <ul className="fs-15 text-dark">
                                                                <li>Project</li>
                                                                <li>Month [MMMYY]</li>
                                                                <li>UID</li>

                                                            </ul> :
                                                            processID === 'MDO.08' ?
                                                                <ul className="fs-15 text-dark">
                                                                    <li>Date</li>
                                                                    <li>Project</li>
                                                                    <li>LicenseType</li>
                                                                    <li>Requirment Update Date</li>
                                                                    <li>Expiry Date</li>
                                                                    <li>UID</li>
                                                                </ul> :
                                                                processID === 'MDO.09' ?
                                                                    <ul className="fs-15 text-dark">
                                                                        <li>Project [Ongoing]</li>
                                                                        <li>UID</li>
                                                                        <li>Month [MMMYY]</li>
                                                                        <li>Auditor Employee Name [Employee Master]</li>
                                                                    </ul> :
                                                                    null

                            }


                        </Popover.Body>
                    </Popover>
                </Overlay>

            </div>
        </div >
    );
};

export default MDO;