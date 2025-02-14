import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Button, Col, Form, Row, ButtonGroup, Overlay, Popover, Modal } from 'react-bootstrap';
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
    link: string;
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
    problemSolver: any;
}



const DDPS = () => {
    const { id, processID } = useParams<{ id: string, processID: string }>();
    const [show, setShow] = useState(false);

    const navigate = useNavigate();
    const [empName, setEmpName] = useState<string | null>('')
    const [showLink, setShowLink] = useState(false);
    const [iframeUrl, setIframeUrl] = useState("");
    const [urlError, setUrlError] = useState("");
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
        link: '',
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
        updatedBy: '',
        problemSolver: ''
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


    const handleOpenLink = () => {
        setShowLink(true)

        if (process.link.includes("youtube.com") || process.link.includes("youtu.be")) {
            const videoId = getYouTubeVideoId(process.link);
            if (videoId) {
                setIframeUrl(`https://www.youtube.com/embed/${videoId}`);
            } else {
                setUrlError("Invalid YouTube video link.");
            }
        } else {
            setUrlError("Only YouTube links are supported for embedding.");
        }
    };

    // Extract YouTube video ID from a URL
    const getYouTubeVideoId = (url: string) => {
        const regex = /(?:youtube\.com.*(?:\?v=|\/embed\/|\/v\/|\/.*\/)|youtu\.be\/)([^#&?]*).*/;
        const match = url.match(regex);
        return match && match[1] ? match[1] : null;
    };

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
    const handleClose = () => {
        setShowLink(false)
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
                            <Col lg={6}>
                                <Form.Group controlId="link" className="mb-3 position-relative">
                                    <Form.Label>Link</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="link"
                                        value={process.link}
                                        placeholder="e.g., https://www.example.com"
                                        disabled

                                    />
                                    <Form.Control.Feedback type="invalid">{urlError}</Form.Control.Feedback>
                                    <div onClick={handleOpenLink} className="mt-2 link-btn p-1"><i className="ri-eye-fill"></i></div>


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
                <Modal className="p-0" show={showLink} onHide={handleClose} size="xl">
                    <Modal.Body>
                        {iframeUrl ? (
                            <div className="p-0 m-0">
                                <iframe
                                    width="100%"
                                    height="550"
                                    src={iframeUrl}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        ) :
                            urlError}
                    </Modal.Body>
                </Modal>
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
                                processID === 'DDPS.01' ?
                                    <ul className="fs-15 text-dark">
                                        <li> Project </li>
                                        <li>Structure ID</li>
                                        <li>Structure Type</li>
                                        <li>PMS Start Date</li>
                                        <li> Type of Design</li>
                                        <li>Pier/Span/Chainage Number</li>
                                        <li>Drawing Broad Category</li>
                                        <li>DTN ID[Auto Generate]</li>
                                        <li>DTN Generation Date [ Upload Date]</li>
                                    </ul> :
                                    processID === 'DDPS.02' ?
                                        <ul className="fs-15 text-dark">
                                            <li>Project</li>
                                            <li>Type of Drawing</li>
                                            <li>Location of Structure</li>
                                            <li>DTN ID</li>
                                            <li>Drawing Title</li>
                                            <li>Drawing Number</li>
                                            <li>Drawing Revision Number</li>
                                            <li>Number of Sheets in Drawing</li>
                                            <li>GFC Date</li>

                                        </ul> :
                                        processID === 'DDPS.03' ?
                                            <ul className="fs-15 text-dark">
                                                <li>Project</li>
                                                <li>Week [ddMMMyy - ddMMMyy]</li>
                                            </ul> :
                                            processID === 'DDPS.04' || processID === 'DDPS.05' ?
                                                <ul className="fs-15 text-dark">
                                                    <li>Project</li>
                                                    <li>Period [18MMMyy - 17MMMyy]</li>
                                                </ul> :
                                                processID === 'DDPS.06' ?
                                                    <ul className="fs-15 text-dark">
                                                        <li>Project</li>
                                                        <li>UniqueID</li>
                                                        <li>Safety Person</li>
                                                        <li>Assign Date</li>
                                                        <li>Observation Type</li>
                                                        <li>Observation</li>
                                                        <li>Site & Exact Location</li>
                                                        <li>Responsible Contractor</li>
                                                        <li>Recommendation</li>
                                                        <li>Target Date</li>
                                                        <li>Allocated LineIncharge</li>
                                                        <li>Severity Rate Level</li>
                                                        <li>Upload PhotoGraph</li>

                                                    </ul> :
                                                    null

                            }


                        </Popover.Body>
                    </Popover>
                </Overlay>

            </div >
        </div >
    );
};

export default DDPS;