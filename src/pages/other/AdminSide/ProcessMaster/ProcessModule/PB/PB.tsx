import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { Button, Col, Form, Row, ButtonGroup, Overlay, Popover, Modal, Table } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
// import Select from 'react-select';
import DynamicForm from '@/pages/other/Component/DynamicForm';
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

// interface GetTypeDayTimeList {
//     id: number;
//     name: string;
// }
interface AdhocList {
    id: number;
    formName: string;
}
const PB = () => {
    const role = localStorage.getItem('role');
    const { id } = useParams<{ id: string }>();
    const { processID } = useParams<{ processID: string }>();
    const { moduleID } = useParams<{ moduleID: string }>();

    const navigate = useNavigate();
    const [empName, setEmpName] = useState<string | null>('')
    const [show, setShow] = useState(false);
    const [adhocLlist, setAdhocLlist] = useState<AdhocList[]>([]);
    const [adhocJson, setAdhocJson] = useState<String | any>('');
    const [showAdhoc, setShowAdhoc] = useState(false);
    const [adhocApplicable, setAdhocApplicable] = useState(0);
    const [showAdhocDynamic, setShowAdhocDynamic] = useState(false);
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

    // const [dropdownValuesFlag1, setDropdownValuesFlag1] = useState<GetTypeDayTimeList[]>([]);
    // const [dropdownValuesFlag2, setDropdownValuesFlag2] = useState<GetTypeDayTimeList[]>([]);
    // const [dropdownValuesFlag3, setDropdownValuesFlag3] = useState<GetTypeDayTimeList[]>([]);
    // const [dropdownValuesFlag4, setDropdownValuesFlag4] = useState<GetTypeDayTimeList[]>([]);


    useEffect(() => {
        toast.dismiss()

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
    //     GetTypeDayTimeList(1, setDropdownValuesFlag1);
    //     GetTypeDayTimeList(2, setDropdownValuesFlag2);
    //     GetTypeDayTimeList(3, setDropdownValuesFlag3);
    //     GetTypeDayTimeList(4, setDropdownValuesFlag4);
    // }, []);

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




    // const GetTypeDayTimeList = async (flag: any, setStateCallback: any) => {
    //     try {
    //         const response = await axios.get(`${config.API_URL_APPLICATION}/CommonDropdown/GetTypeDayTimeList?flag=${flag}`);
    //         if (response.data.isSuccess) {
    //             setStateCallback(response.data.typeListResponses);
    //         } else {
    //             console.error(response.data.message);
    //         }
    //     } catch (error) {
    //         console.error('Error fetching modules:', error);
    //     }

    // };


    useEffect(() => {
        if (showAdhoc) {
            const fetchAdhocList = async () => {
                try {
                    const response = await axios.get(`${config.API_URL_ACCOUNT}/ProcessTaskMaster/GetTemplateJson`);
                    if (response.data.isSuccess) {
                        setAdhocLlist(response.data.getTemplateJsons);
                    } else {
                        console.error(response.data.message);
                    }
                } catch (error) {
                    console.error("Error fetching Adhoc list:", error);
                }
            };
            fetchAdhocList();
        }
    }, [showAdhoc]);


    console.log(process)



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
            moduleName: process.moduleID,
            taskNumber: processID,
            createdBy: empName
        };
        console.log(payload)
        e.preventDefault();
        try {
            await axios.post(`${config.API_URL_ACCOUNT}/ProcessInitiation/ManualProcessTaskInitiation`, payload);
            navigate('/pages/ProcessInitiation', {
                state: {
                    successMessage: "Process Initiated successfully!",
                }
            });

        } catch (error: any) {
            toast.error(error);
            console.error('Error submitting module:', error);
        }
    };

    const [target, setTarget] = useState<HTMLElement | null>(null);
    const ref = useRef(null);


    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setShow(!show);
        setTarget(event.target as HTMLElement);
    };
    const handleAdhocInitiation = () => {
        setShowAdhoc(true);
    };



    const handleClose = () => {
        setShowAdhoc(false);
        setShowLink(false)
    };


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

    const handleSelectAdhoc = async (adhocID: number) => {
        console.log(`Selected Adhoc Form ID: ${adhocID}`);

        try {
            const response = await axios.get(`${config.API_URL_ACCOUNT}/ProcessTaskMaster/GetTemplateJson`, {
                params: { id: adhocID }
            });
            if (response.data.isSuccess) {
                setAdhocJson(response.data.getTemplateJsons[0]);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error("Error fetching Adhoc list:", error);
        }

        setShowAdhoc(false)
        setShowAdhocDynamic(true)
    };

    if (adhocJson && adhocJson.templateJson) {
        try {
            const parsedJson = JSON.parse(adhocJson.templateJson);
            console.log("Parsed templateJson:", parsedJson);
        } catch (error) {
            console.error("Error parsing templateJson:", error);
        }
    }


    const handleChangeExpirable = (value: number) => {
        setAdhocApplicable(value);
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

                            {(role === 'Admin' || role === 'DME') &&
                                <Col lg={6}>
                                    <Form.Group controlId="processOwnerName" className="mb-3">
                                        <Form.Label>Adhoc Applicable</Form.Label>
                                        <div className='d-flex'>
                                            <Form.Check
                                                inline
                                                type="radio"
                                                id="statusDeactive"
                                                name="isExpirable"
                                                value={0}
                                                label="No"
                                                checked={adhocApplicable === 0}
                                                onChange={() => handleChangeExpirable(0)}
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                id="statusActive"
                                                name="isExpirable"
                                                value={1}
                                                label="Yes"
                                                checked={adhocApplicable === 1}
                                                onChange={() => handleChangeExpirable(1)}
                                            />
                                        </div>
                                    </Form.Group>
                                </Col>
                            }


                            <Col lg={12}>
                                {/* <Row>
                                    <h4>Specific Time</h4>
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
                                    {["Weekly"].includes(process.intervalType) && (
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

                                    {["Monthly"].includes(process.intervalType) && (
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
                                </Row> */}

                            </Col>
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
                                    {adhocApplicable === 1 &&
                                        <>
                                            <Button className="btn btn-primary" onClick={handleAdhocInitiation}>
                                                Initiation Via Adhoc
                                            </Button>
                                            &nbsp;
                                        </>
                                    }
                                    {
                                        role === 'Admin' &&
                                        <Button variant="primary" type="submit">
                                            Initate Process
                                        </Button>
                                    }
                                </ButtonGroup>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>

            <Modal className="p-2" show={showAdhoc} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title className="text-dark">Select Adhoc Form</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {adhocLlist.length > 0 ? (
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Sr.no.</th>
                                    <th>Form Name</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {adhocLlist.map((adhoc, index) => (
                                    <tr key={adhoc.id}>
                                        <td>{index + 1}</td>
                                        <td>{adhoc.formName}</td>
                                        <td>
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => handleSelectAdhoc(adhoc.id)}
                                            >
                                                Select
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <p>No Adhoc Forms Available</p>
                    )}
                </Modal.Body>
            </Modal>

            {adhocJson && adhocJson.templateJson &&
                <DynamicForm
                    fromComponent="AccountProcess"
                    formData={JSON.parse(adhocJson.templateJson)}
                    formBuilderData={JSON.parse(adhocJson.templateJson)}
                    taskNumber
                    data
                    taskName
                    show={showAdhocDynamic}
                    finishPoint
                    setShow={setShowAdhocDynamic}
                    parsedCondition
                    preData
                    taskCommonIDRow
                    taskStatus
                    processId={processID}
                    moduleId={moduleID}
                    rejectBlock
                    ProcessInitiationID
                    approval_Console
                    projectName
                    problemSolver
                    approvarActions
                    rejectData
                />

            }
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
                            processID === 'PB.01' ? <ul className="fs-15 text-dark">
                                <li>UID</li>
                                <li>Project</li>
                                <li>Quartor QX</li>
                            </ul> :
                                processID === 'PB.02' ?
                                    <ul className="fs-15 text-dark">
                                        <li>UID</li>
                                        <li>Project Name</li>
                                        <li>Month</li>
                                        <li>Client_JV Name</li>
                                        <li>Type of Reconciliation = [Material Reconciliation]</li>
                                    </ul> :
                                    processID === 'PB.03' ?
                                        <ul className="fs-15 text-dark">
                                            <li>UID</li>
                                            <li>Project Name</li>
                                            <li>Month</li>
                                            <li>Type of Reconciliation = [PRW Reconciliation]</li>
                                        </ul> :
                                        processID === 'PB.04' ?
                                            <ul className="fs-15 text-dark">
                                                <li>UID</li>
                                                <li>Project Name</li>
                                                <li>Quarter QX</li>
                                                <li>Type of Reconciliation</li>
                                            </ul> :
                                            processID === 'PB.05' ?
                                                <ul className="fs-15 text-dark">
                                                    <li>UID</li>
                                                    <li>Project Name</li>
                                                    <li>Initiation Type</li>
                                                    <li>Week</li>
                                                </ul> :
                                                processID === 'PB.06' ?
                                                    <ul className="fs-15 text-dark">
                                                        <li>UID</li>
                                                        <li>Project Name</li>
                                                        <li>Initiation Type</li>
                                                        <li>Month</li>
                                                    </ul> :
                                                    processID === 'PB.07' ?
                                                        <ul className="fs-15 text-dark">
                                                            <li>UID</li>
                                                            <li>Project Name</li>
                                                            <li>Month</li>
                                                        </ul> :
                                                        processID === 'PB.08' ?
                                                            <ul className="fs-15 text-dark">
                                                                <li>UID</li>
                                                                <li>Project Name</li>
                                                                <li>Month</li>
                                                            </ul> :
                                                            processID === 'PB.09' ?
                                                                <ul className="fs-15 text-dark">
                                                                    <li>UID</li>
                                                                    <li>Project Name</li>
                                                                    <li>Month</li>
                                                                </ul> :
                                                                processID === 'PB.10' ?
                                                                    <ul className="fs-15 text-dark">
                                                                        <li>UID</li>
                                                                        <li>Project Name</li>
                                                                        <li>Initiation Type</li>
                                                                    </ul> :
                                                                    processID === 'PB.11' ?
                                                                        <ul className="fs-15 text-dark">
                                                                            <li>UID</li>
                                                                            <li>Project Name</li>
                                                                            <li>Initiation Type</li>
                                                                        </ul> :
                                                                        processID === 'PB.12' ?
                                                                            <ul className="fs-15 text-dark">
                                                                                <li>UID</li>
                                                                                <li>Project Name</li>
                                                                                <li>Month</li>
                                                                            </ul> :
                                                                            processID === 'PB.13' ?
                                                                                <ul className="fs-15 text-dark">
                                                                                    <li>UID</li>
                                                                                    <li>Project Name</li>
                                                                                    <li>Month</li>
                                                                                    <li>Office Order</li>
                                                                                </ul> :
                                                                                processID === 'PB.14' ?
                                                                                    <ul className="fs-15 text-dark">
                                                                                        <li>UID</li>
                                                                                        <li>Project Name</li>
                                                                                        <li>Month</li>
                                                                                    </ul> :
                                                                                    processID === 'PB.15' ?
                                                                                        <ul className="fs-15 text-dark">
                                                                                            <li>UID</li>
                                                                                            <li>Project Name</li>
                                                                                            <li>Month</li>
                                                                                        </ul> :
                                                                                        processID === 'PB.16' ?
                                                                                            <ul className="fs-15 text-dark">
                                                                                                <li>UID</li>
                                                                                                <li>Project Name</li>
                                                                                                <li>Month</li>
                                                                                            </ul> :
                                                                                            processID === 'PB.17' ?
                                                                                                <ul className="fs-15 text-dark">
                                                                                                    <li>UID</li>
                                                                                                    <li>Project Name</li>
                                                                                                    <li>Period</li>
                                                                                                </ul> :
                                                                                                processID === 'PB.18' ?
                                                                                                    <ul className="fs-15 text-dark">
                                                                                                        <li>Project</li>
                                                                                                        <li>Quarter QX</li>
                                                                                                        <li>ID</li>
                                                                                                    </ul> : null

                        }





                    </Popover.Body>
                </Popover>
            </Overlay>
        </div >
    );
};

export default PB;