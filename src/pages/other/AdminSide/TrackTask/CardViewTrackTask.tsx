import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, ButtonGroup, Form, Pagination, Card } from 'react-bootstrap';
import config from '@/config';
import Select from 'react-select';
import { format, } from 'date-fns';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import TrackPopUpView from './TrackPopupView';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_green.css';
import HeirarchyView from '../../Component/ViewTask/HeirarchyView';
import { getPlannedDate } from '../../Component/PlanDateFunction';



interface LnMaster {
    id: number;
    processID: string;
    projectName: string;
    moduleName: string;
    processName: string;
    task_Number: string;
    createdDate: string;
    completedDate: string;
    taskTime: string;
    taskType: string;
    roleName: string;
    doerName: string;
    doerNumber: number;
    taskName: string;
    problemSolver: string;
    projectIncharge: string;
    projectCoordinator: string;
    approval_Console: string;
    projectId: string;
    condition_Json: string;
    task_Json: string;
    planDate: string;
    isCompleted: string;
    problemSolverMobileNumber: number;
    taskCommonId: number;
    approvalConsoleDoerName: string;
}



interface dropDownList {
    processID: string;
    processName: string;
    moduleID: string;
    moduleName: string;
    taskID: string;
    empID: string;
    empName: string;
    name: string;
}


const CardViewTrackTask: React.FC = () => {
    const [data, setData] = useState<LnMaster[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [moduleList, setModuleList] = useState<dropDownList[]>([]);
    const [processList, setProcessList] = useState<dropDownList[]>([]);
    const [taskNumberList, setTaskNumberList] = useState<dropDownList[]>([]);
    const [projectList, setProjectlist] = useState<dropDownList[]>([]);
    const [doerList, setDoerList] = useState<dropDownList[]>([]);
    const [show, setShow] = useState(false);
    const [manageId, setManageID] = useState<number>();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTriggered, setSearchTriggered] = useState(false);

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [projectName, setProjectName] = useState('');
    const [options, setOptions] = useState('');
    const [ModuleName, setModuleName] = useState('');
    const [ProcessName, setProcessName] = useState('');
    const [taskNumberName, setTaskNumberName] = useState('');
    const [doerName, setDoerName] = useState('');
    const [moduleID, setModuleID] = useState('');


    const [expandedCard, setExpandedCard] = useState<number | null>(null); // Track expanded card
    const [activeCard, setActiveCard] = useState<number | null>(null);

    const [showView, setShowView] = useState(false);

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        let query = `?`;
        if (startDate) query += `StartDate=${startDate}&`;
        if (endDate) query += `EndDate=${endDate}&`;
        if (options) query += `Option=${options}&`;
        if (projectName) query += `ProjectName=${projectName}&`;
        if (ProcessName) query += `ProcessID=${ProcessName}&`;
        if (moduleID) query += `ModuleID=${moduleID}&`;
        if (taskNumberName) query += `TaskID=${taskNumberName}&`;
        if (doerName) query += `DoerID=${doerName}&`;
        query += `PageIndex=${currentPage}`;

        query = query.endsWith('&') ? query.slice(0, -1) : query;

        const apiUrl = `${config.API_URL_APPLICATION}/Task/SearchTrackTaskList${query}`;
        console.log(apiUrl)
        axios.get(apiUrl, {
            headers: {
                'accept': '*/*'
            }
        })
            .then((response) => {
                setData(response.data.tasks)
                console.log(response.data.tasks)
                setTotalPages(Math.ceil(response.data.totalCount / 10));
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    };

    console.log(data)


    useEffect(() => {
        setActiveCard(null);
        setExpandedCard(null);
        if (searchTriggered && currentPage) {
            handleSearch();

        } else {
            fetchData();
        }
    }, [currentPage, searchTriggered]);

    // useEffect(() => {
    //     fetchData();
    // }, []);


    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${config.API_URL_ACCOUNT}/ProcessInitiation/GetFilterTask?Flag=6`, {
                params: {
                    PageIndex: currentPage
                }
            }
            );
            if (response.data && response.data.isSuccess) {
                setData(response.data.getFilterTasks || []);
                setTotalPages(Math.ceil(response.data.totalCount / 10));
            } else {
                console.error('API Response Error:', response.data?.message || 'Unknown error');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Axios Error:', error.message);
            } else {
                console.error('Unexpected Error:', error);
            }
        } finally {
            setLoading(false);
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

        fetchData('CommonDropdown/GetModuleList', setModuleList, 'moduleNameListResponses');
        fetchData('CommonDropdown/GetTaskList', setTaskNumberList, 'taskList');
        fetchData('CommonDropdown/GetDoerFromDoerMaster', setDoerList, 'doerListResponses');
        fetchData('CommonDropdown/GetCommonList?flag=6', setProjectlist, 'commonLists');
    }, []);



    useEffect(() => {
        const fetchProcessName = async () => {
            try {
                const response = await axios.get(`${config.API_URL_APPLICATION}/CommonDropdown/GetProcessNameByModuleName?ModuleName=${ModuleName}`);
                if (response.data.isSuccess) {
                    setProcessList(response.data.processListResponses);
                } else {
                    console.error(response.data.message);
                }
            } catch (error) {
                console.error('Error fetching modules:', error);
            }
        };
        if (ModuleName) {
            fetchProcessName();
        }
    }, [ModuleName])

    const handleClear = async () => {
        setDoerName('');
        setTaskNumberName('');
        setProcessName('');
        setModuleID('');
        setProjectName('');
        setEndDate('');
        setOptions('');
        setStartDate('');
        setCurrentPage(1);
        setSearchTriggered(false);
        await fetchData();
    };

    const handleShow = () => setShow(true);
    const handleView = (id: number) => {
        handleShow();
        setManageID(id)

    }

    const formatPeriod = (createdDate: string): string => {
        const startDate = new Date(createdDate);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);

        return `${format(startDate, "dd-MMM-yyyy")} to ${format(endDate, "dd-MMM-yyyy")}`;
    };

    const optionsDataAccesLevel = [
        { value: 'All', label: 'All' },
        { value: 'OnlySelf', label: 'OnlySelf' },
        { value: 'ProjectModule', label: 'ProjectModule' },
        { value: 'Module', label: 'Module' },
        { value: 'Project', label: 'Project' }
    ];

    let conditionArray = [];
    try {
        if (data[0]?.condition_Json) {
            conditionArray = JSON.parse(data[0].condition_Json);
        }
    } catch (error) {
        console.error("Failed to parse condition_Json:", error);
    }
    const expiryLogic = conditionArray[0]?.expiryLogic;
    const expirationTime = conditionArray[0]?.expirationTime;



    const handleShowview = () => setShowView(true);
    const handleViewEdit = (id: any) => {
        handleShowview();
        setManageID(id)

    };
    function calculatePlannedDate(createdDate: string): string {
        const parsedDate = new Date(createdDate);
        if (isNaN(parsedDate.getTime())) {
            console.error('Invalid date format');
            return ''; // Return an empty string if the date is invalid
        }
        const plannedDate = new Date(parsedDate.getTime() + 24 * 60 * 60 * 1000);
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month = months[plannedDate.getMonth()];
        const day = String(plannedDate.getDate()).padStart(2, '0');
        const year = plannedDate.getFullYear();
        let hours = plannedDate.getHours();
        const minutes = String(plannedDate.getMinutes()).padStart(2, '0');
        const amPm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert to 12-hour format and handle midnight (0 becomes 12)
        return `${day}-${month}-${year} ${String(hours).padStart(2, '0')}:${minutes} ${amPm}`;
    }
    const isCompletedLate = (planDate: string, completedDate: string) => {
        const planDateObj = new Date(planDate);
        const completedDateObj = new Date(completedDate);

        return completedDateObj > planDateObj;
    };



    // Handle card click to expand details
    const handleCardClick = (id: number) => {
        setActiveCard(id);  // Set the active card when clicked
        setExpandedCard(id); // Show the details for the clicked card
    };

    // Handle the back button click to reset view
    const handleBackClick = () => {
        setActiveCard(null);
        setExpandedCard(null);
    };

    return (
        <>


            <div className='bg-white p-2 pb-2'>
                <Form
                    onSubmit={(e) => {
                        e.preventDefault();
                        setCurrentPage(1);
                        setSearchTriggered(true);
                    }}
                >
                    <Row>

                        <Col lg={3}>
                            <Form.Group controlId="dateRange" className="mb-3">
                                <Form.Label>Select Date Range</Form.Label>
                                <Flatpickr
                                    value={[startDate, endDate]}
                                    onChange={([start, end]) => {
                                        if (start && end) {
                                            const formattedStart = start.toLocaleDateString('en-CA');
                                            const formattedEnd = end.toLocaleDateString('en-CA');
                                            setStartDate(formattedStart);
                                            setEndDate(formattedEnd);

                                        }
                                    }}
                                    options={{
                                        mode: "range",
                                        enableTime: false,
                                        dateFormat: "Y-m-d",
                                        time_24hr: false,
                                    }}
                                    placeholder=" Select Date Range "
                                    className="form-control "
                                />
                            </Form.Group>
                        </Col>



                        <Col lg={3}>
                            <Form.Group controlId="projectName">
                                <Form.Label>Select Project</Form.Label>
                                <Select
                                    name="projectName"
                                    value={projectList.find(item => item.name === projectName) || null}
                                    onChange={(selectedOption) => {
                                        setProjectName(selectedOption ? selectedOption.name : "")
                                    }}
                                    options={projectList}
                                    getOptionLabel={(item) => item.name}
                                    getOptionValue={(item) => item.name}
                                    isSearchable={true}
                                    placeholder="Select Project Name"
                                    className="h45"
                                />
                            </Form.Group>
                        </Col>
                        {/* <Col lg={3}>
                                <Form.Group controlId="ModuleName">
                                    <Form.Label>Sort  By</Form.Label>
                                    <Select
                                        name="ModuleName"
                                        value={moduleList.find(item => item.moduleID === moduleID) || null}
                                        onChange={(selectedOption) => {
                                            setModuleName(selectedOption ? selectedOption.moduleName : ""),
                                                setModuleID(selectedOption ? selectedOption.moduleID : "")

                                        }}
                                        options={moduleList}
                                        getOptionLabel={(item) => item.moduleName}
                                        getOptionValue={(item) => item.moduleID}
                                        isSearchable={true}
                                        placeholder="Select Project Name"
                                        className="h45"
                                    />
                                </Form.Group>
                            </Col> */}
                        <Col lg={3}>
                            <Form.Group controlId="options">
                                <Form.Label>Select Any Option</Form.Label>
                                <Select
                                    name="options"
                                    options={optionsDataAccesLevel}
                                    value={optionsDataAccesLevel.find(option => option.value === options) || null}
                                    onChange={(selectedOption) => setOptions(selectedOption?.value || '')}
                                    placeholder="Select Any Option"
                                />
                            </Form.Group>
                        </Col>
                        <Col lg={3}>
                            <Form.Group controlId="ModuleName">
                                <Form.Label>Select Module</Form.Label>
                                <Select
                                    name="ModuleName"
                                    value={moduleList.find(item => item.moduleID === moduleID) || null}
                                    onChange={(selectedOption) => {
                                        setModuleName(selectedOption ? selectedOption.moduleName : ""),
                                            setModuleID(selectedOption ? selectedOption.moduleID : "")

                                    }}
                                    options={moduleList}
                                    getOptionLabel={(item) => item.moduleName}
                                    getOptionValue={(item) => item.moduleID}
                                    isSearchable={true}
                                    placeholder="Select Module Name"
                                    className="h45"
                                />
                            </Form.Group>
                        </Col>
                        <Col lg={3}>
                            <Form.Group controlId="ModuleOwnerName">
                                <Form.Label>Select Process</Form.Label>
                                <Select
                                    name="ModuleOwnerName"
                                    value={processList.find(item => item.processID === ProcessName) || null}
                                    onChange={(selectedOption) => setProcessName(selectedOption ? selectedOption.processID : "")}
                                    options={processList}
                                    getOptionLabel={(item) => item.processName}
                                    getOptionValue={(item) => item.processID}
                                    isSearchable={true}
                                    placeholder="Select Process Name"
                                    className="h45"
                                    isDisabled={!ModuleName}
                                />
                            </Form.Group>
                        </Col>

                        <Col lg={3} className="">
                            <Form.Group controlId="searchTaskNumber">
                                <Form.Label>Select Task </Form.Label>
                                <Select
                                    name="searchTaskNumber"
                                    value={taskNumberList.find(item => item.taskID === taskNumberName) || null}
                                    onChange={(selectedOption) => setTaskNumberName(selectedOption ? selectedOption.taskID : "")}
                                    options={taskNumberList}
                                    getOptionLabel={(item) => item.taskID}
                                    getOptionValue={(item) => item.taskID}
                                    isSearchable={true}
                                    placeholder="Select Task Number"
                                    className="h45"
                                />
                            </Form.Group>
                        </Col>
                        <Col lg={3} className="">
                            <Form.Group controlId="searchDoerName">
                                <Form.Label>Select Doer</Form.Label>
                                <Select
                                    name="searchDoerName"
                                    value={doerList.find(item => item.empID === doerName) || null}
                                    onChange={(selectedOption) => setDoerName(selectedOption ? selectedOption.empID : "")}
                                    options={doerList}
                                    getOptionLabel={(item) => item.empName}
                                    getOptionValue={(item) => item.empID}
                                    isSearchable={true}
                                    placeholder="Select Doer Name"
                                    className="h45"
                                />
                            </Form.Group>
                        </Col>


                        <Col lg={3} className="align-items-end d-flex justify-content-end mt-2">
                            <ButtonGroup aria-label="Basic example" className="w-100">
                                <Button type="button" variant="primary" onClick={handleClear}>
                                    <i className="ri-loop-left-line"></i>
                                </Button>
                                &nbsp;
                                <Button type="submit" variant="primary">
                                    Search
                                </Button>
                            </ButtonGroup>
                        </Col>
                    </Row>
                </Form>



                <Row className='mt-3'>
                    <div className="d-flex justify-content-end bg-light p-1">
                        <div className="app-search d-none d-lg-block me-4">

                        </div>
                    </div>
                </Row>
            </div>
            {loading ? (
                <div className='loader-container'>
                    <div className="loader"></div>
                    <div className='mt-2'>Please Wait!</div>
                </div>
            ) : (<>




                <div className="overflow-auto text-nowrap">
                    {!data ? (
                        <Container className="mt-5">
                            <Row className="justify-content-center">
                                <Col xs={12} md={8} lg={6}>
                                    <Alert variant="info" className="text-center">
                                        <h4>No Task Found</h4>
                                        <p>You currently don't have Completed tasks</p>
                                    </Alert>
                                </Col>
                            </Row>
                        </Container>
                    ) : (

                        <>

                            <div className="bg-white p-2 pb-2">
                                <Container fluid className="d-flex">
                                    {/* Left Side - Cards Layout */}
                                    <div
                                        className={`task-cards-container ${activeCard ? 'task-cards-left' : ''}`}
                                        style={{
                                            flex: 1,
                                            display: 'grid',
                                            gridTemplateColumns: activeCard ? '1fr' : 'repeat(3, 1fr)', // 1 column if active, 3 columns otherwise
                                            gap: '15px',
                                            height: activeCard ? '80vh' : '',
                                            overflowY: 'auto',
                                        }}
                                    >
                                        {data.slice(0, 10).map((item, index) => (
                                            <Card
                                                className="task-card"
                                                style={{
                                                    border: '1px solid #ddd',
                                                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                                                    cursor: 'pointer',
                                                    opacity: activeCard && activeCard !== item.id ? 0.5 : 1, // Reduce opacity of other cards
                                                }}
                                                key={item.id}
                                                onClick={() => handleCardClick(item.id)}
                                            >
                                                <Card.Body className='text-dark'>
                                                    <Card.Title className="fw-bold text-wrap fs-18 "><strong>Task No: </strong> <span className=''>

                                                        {item.task_Number}
                                                    </span>
                                                    </Card.Title>
                                                    <Card.Text className=" text-wrap"><strong>Task Name:</strong> {item.taskName}</Card.Text>
                                                    <Card.Text className="mb-2 "><strong>Project Name:</strong> {item.projectName}</Card.Text>
                                                    <Card.Text className="mb-2"><strong>Planned:</strong>                                                                                 {item.task_Number.split(".")[2] === "T1" ? (
                                                        calculatePlannedDate(item.createdDate)
                                                    ) : (
                                                        getPlannedDate(item.createdDate, item.planDate)
                                                    )}</Card.Text>
                                                    <Card.Text>
                                                        <span className='me-2'>

                                                            <strong >Status:</strong> {item.isCompleted}
                                                        </span>
                                                        {item.isCompleted === "Pending"
                                                            ? <i className="ri-circle-fill" style={{ color: 'red' }}></i>  // Red circle for Pending
                                                            : <i className="ri-circle-fill" style={{ color: 'green' }}></i>  // Green circle for Completed
                                                        }
                                                    </Card.Text>


                                                    <div className='d-flex justify-content-between align-items-center'>
                                                        <div className='fs-14 fw-bold index-style'>{(currentPage - 1) * 10 + index + 1}</div>
                                                        <Button
                                                            onClick={() => handleCardClick(item.id)}
                                                            variant={isCompletedLate(
                                                                item.task_Number === 'ACC.01.T1'
                                                                    ? calculatePlannedDate(item.createdDate)
                                                                    : getPlannedDate(item.createdDate, item.planDate),
                                                                item.completedDate
                                                            ) ? "danger" : "primary"}
                                                        >
                                                            <span className='me-2'> View Details</span>

                                                            {expandedCard === item.id ? (
                                                                <i className="fs-16 ri-eye-off-line "></i>
                                                            ) : (
                                                                <i className="fs-16 ri-eye-line"></i>
                                                            )}
                                                        </Button>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        ))}
                                    </div>

                                    {activeCard && (
                                        <div
                                            className="task-details-container"
                                            style={{
                                                flex: 3,
                                                position: 'sticky',
                                                width: '100vw',
                                                top: 0,
                                            }}
                                        >
                                            <Card className="task-details-card ">
                                                <Card.Body>
                                                    <div className='d-flex justify-content-end'>
                                                        <div onClick={handleBackClick} className='m-0'><i className="ri-close-large-fill fs-18 fw-bold"></i></div>
                                                    </div>

                                                    {data.filter(item => item.id === activeCard).map(item => (
                                                        <>
                                                            <div className=''>

                                                                <Row>
                                                                    <Col lg={12}>
                                                                        <table>
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td><h5 className='text-nowrap'>Task Number :</h5></td>
                                                                                    <td>
                                                                                        <h5 className='text-primary'>
                                                                                            {item.task_Number}
                                                                                        </h5>
                                                                                    </td>

                                                                                </tr>
                                                                                <tr>
                                                                                    <td><h5 className='text-nowrap'>Task Name :</h5></td>
                                                                                    <td>
                                                                                        <h5 className='text-primary'>
                                                                                            {item.processID === "ACC.01" ? (
                                                                                                item.isCompleted !== "Completed" ? (
                                                                                                    item.taskName
                                                                                                ) : (
                                                                                                    (() => {
                                                                                                        const taskJson = JSON.parse(item.task_Json);
                                                                                                        const firstTaskName =
                                                                                                            taskJson && Array.isArray(taskJson) && taskJson.length > 0
                                                                                                                ? taskJson[0].taskName
                                                                                                                : 'No task names available';
                                                                                                        return firstTaskName;
                                                                                                    })()
                                                                                                )
                                                                                            ) : (
                                                                                                item.taskName
                                                                                            )}
                                                                                        </h5>
                                                                                    </td>

                                                                                </tr>


                                                                                <tr>
                                                                                    <td><h5>Link :</h5></td>
                                                                                    <td> <h5 className='text-primary'>SOP (3) / Checklist / Training Video / Office Order (4) / Process Flowchart</h5></td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td><h5>Process :</h5></td>
                                                                                    <td> <h5 className='text-primary'>{item.processName}</h5></td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td><h5>Created Date :</h5></td>
                                                                                    <td><h5 className='text-primary'>{format(new Date(item.createdDate), 'MMM dd, yyyy HH:mm')}</h5></td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td><h5>Doer :</h5></td>
                                                                                    <td>
                                                                                        <h5 className='text-primary'> {item.doerName}</h5>
                                                                                        {item.doerNumber ?
                                                                                            <p className='fw-normal m-0'><a href={`tel:${item.doerNumber}`}>
                                                                                                <i className="ri-phone-fill"></i> {item.doerNumber}</a></p> : ""
                                                                                        }
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td><h5>Role :</h5></td>
                                                                                    <td><h5 className='text-primary'> {item.roleName}</h5></td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </Col>
                                                                    <Col lg={12}>
                                                                        <table>
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td><h5>Problem Solver :</h5></td>
                                                                                    <td>
                                                                                        <h5 className="text-primary">{item.problemSolver}</h5>
                                                                                        {item.problemSolverMobileNumber ? (
                                                                                            <p className="fw-normal m-0">
                                                                                                <a href={`tel:${item.problemSolverMobileNumber}`}>
                                                                                                    <i className="ri-phone-fill"></i> {item.problemSolverMobileNumber}
                                                                                                </a>
                                                                                            </p>
                                                                                        ) : ""}
                                                                                    </td>
                                                                                </tr>

                                                                                <tr>
                                                                                    <td><h5>Expiry Logic:</h5></td>
                                                                                    <td>
                                                                                        <h5 className='text-primary'>
                                                                                            {expiryLogic === "Expire On Defined Time" ? `${expirationTime} Hr` : (expiryLogic || 'N/A')}
                                                                                        </h5>
                                                                                    </td>

                                                                                </tr>
                                                                                {item.approval_Console === 'Select Approval_Console' &&
                                                                                    <tr>
                                                                                        <td><h5>Approver :</h5></td>
                                                                                        <td><h5 className='text-primary'>{item.approvalConsoleDoerName}</h5>
                                                                                        </td>
                                                                                    </tr>}
                                                                            </tbody>
                                                                        </table>
                                                                    </Col>

                                                                </Row>

                                                                <hr className='my-1' />
                                                                <Row className=''>
                                                                    <Col lg={12}>
                                                                        <tr>
                                                                            <td> <h5 >Initiation period : </h5></td>
                                                                            <td><h5 className='text-primary'>{formatPeriod(item.createdDate)}</h5></td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td> <h5 >Source : </h5></td>
                                                                            <td><h5 className='text-primary'>Source</h5>
                                                                            </td>
                                                                        </tr>

                                                                    </Col>
                                                                    <Col lg={4}>
                                                                        <tr>
                                                                            <td> <h5 >Week : </h5></td>
                                                                            <td><h5 className='text-primary'>Source</h5></td>
                                                                        </tr>


                                                                    </Col>
                                                                    {item.processID === 'ACC.01' &&
                                                                        <Col lg={4}>
                                                                            <tr>
                                                                                <td> <h5>Mess Manager : </h5></td>
                                                                                <td><h5 className='text-primary'>Mess Manager Name</h5></td>
                                                                            </tr>

                                                                        </Col>
                                                                    }

                                                                </Row>
                                                                <hr className='my-1' />

                                                                <Row>
                                                                    <Col lg={6} className='mt-2'>
                                                                        <td><h5>Created Date :</h5></td>
                                                                        <td><h5 className='text-primary'>{item.createdDate && format(new Date(item.createdDate), 'dd-MMM-yyyy HH:mm')}</h5></td>
                                                                    </Col>
                                                                    <Col lg={6} className='mt-2'>
                                                                        <td><h5>Extended Date :</h5></td>
                                                                        <td><h5 className='text-primary'>N/A</h5></td>
                                                                    </Col>
                                                                    <Col lg={6} className='mt-2'>
                                                                        <td><h5>Completed Date :</h5></td>
                                                                        <td><h5 className='text-primary'>{item.completedDate ? format(new Date(item.completedDate), 'dd-MMM-yyyy HH:mm') : '--'}</h5></td>
                                                                    </Col>

                                                                </Row>

                                                                <Row className='d-flex justify-content-end '>
                                                                    <Col lg={6} >
                                                                        <div className=' d-flex justify-content-end align-items-center'>
                                                                            <span className='text-primary me-3 cursor-pointer fw-bold' onClick={() => handleView(item.id)}>View Output</span>
                                                                            <span className='text-primary cursor-pointer me-3 fw-bold' onClick={() => handleViewEdit(item.taskCommonId)}>Hierarchy  View</span>
                                                                            <span className='text-primary me-2 fw-bold'>Help</span>
                                                                            <Button variant='primary' onClick={() => handleView(item.id)}> Show</Button>
                                                                        </div>
                                                                    </Col>
                                                                </Row>





                                                            </div>
                                                        </>

                                                    ))}
                                                </Card.Body>
                                            </Card>
                                        </div>
                                    )}
                                </Container>
                            </div>
                        </>
                    )}
                </div>
            </>)
            }
            <div className="d-flex justify-content-center align-items-center bg-white w-20 rounded-5 m-auto py-1 pb-1 my-2 pagination-rounded">
                <Pagination >
                    <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                    <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
                    <Pagination.Item active>{currentPage}</Pagination.Item>
                    <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
                    <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
                </Pagination>
            </div>
            <TrackPopUpView show={show} setShow={setShow} manageId={manageId} />

            <HeirarchyView showView={showView} setShowView={setShowView} id={manageId} />

        </>
    );
};

export default CardViewTrackTask;
