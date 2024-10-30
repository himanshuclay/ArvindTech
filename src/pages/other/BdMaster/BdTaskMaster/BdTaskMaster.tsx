import axios from 'axios';
import { useState, useEffect, ChangeEvent } from 'react';
import { Button, Pagination, Table, Container, Row, Col, Alert } from 'react-bootstrap';
// import { Button, Pagination, Table, Container, Row, Col, Alert, Form, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import config from '@/config';
import CustomSuccessToast from '../../Component/CustomSuccessToast';
// import Select from 'react-select';
import { useLocation, useNavigate } from 'react-router-dom';

interface BdTask {
    id: number;
    moduleID: string;
    processID: string;
    taskDisplayName: string;
    taskDescription: string;
    role: string;
    howPlannedDateIsCalculated: string;
    predecessor: string;
    successor: string;
    generationType: string;
    misExempt: string;
    status: string;
    problemSolver: string;
    sundayLogic: string;
    createdBy: string;
    updatedBy: string;
}



interface Column {
    id: string;
    label: string;
    visible: boolean;
}


const BdTaskMaster = () => {


    const [bdTasks, setBdTasks] = useState<BdTask[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [downloadCsv, setDownloadCsv] = useState<BdTask[]>([]);



    const location = useLocation();
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastVariant, setToastVariant] = useState('');



    useEffect(() => {
        if (location.state && location.state.showToast) {
            setShowToast(true);
            setToastMessage(location.state.toastMessage);
            setToastVariant(location.state.toastVariant);

            setTimeout(() => {
                setShowToast(false);
                navigate(location.pathname, { replace: true });
            }, 5000);
        }
        return () => {
            setShowToast(false);
            setToastMessage('');
            setToastVariant('');
        };
    }, [location.state, navigate]);


    // const [moduleDisplayName, setModuleDisplayName] = useState('');
    // const [moduleOwnerName, setModuleOwnerName] = useState('');


    // const handleSearch = (e: any) => {
    //     e.preventDefault();

    //     let query = `?`;
    //     if (moduleDisplayName) query += `ModuleDisplayName=${moduleDisplayName}&`;
    //     if (moduleOwnerName) query += `ModuleOwnerName=${moduleOwnerName}&`;

    //     query = query.endsWith('&') ? query.slice(0, -1) : query;

    //     const apiUrl = `https://arvindo-api2.clay.in/api/ModuleMaster/SearchModuleList${query}`;

    //     axios.get(apiUrl, {
    //         headers: {
    //             'accept': '*/*'
    //         }
    //     })
    //         .then((response) => {
    //             console.log(response.data.moduleMasterListResponses);
    //             setBdTasks(response.data.moduleMasterListResponses)
    //         })
    //         .catch((error) => {
    //             console.error('Error fetching data:', error);
    //         });
    // };



    // both are required to make dragable column of table 
    const [columns, setColumns] = useState<Column[]>([
        { id: 'moduleID', label: 'Module ID', visible: true },
        { id: 'processID', label: 'Process ID', visible: true },
        { id: 'taskDisplayName', label: 'Task Display Name', visible: true },
        { id: 'taskDescription', label: 'Task Description', visible: true },
        { id: 'role', label: 'Role', visible: true },
        { id: 'howPlannedDateIsCalculated', label: 'How Planned Date Is Calculated', visible: true },
        { id: 'predecessor', label: 'Predecessor', visible: true },
        { id: 'successor', label: 'Successor', visible: true },
        { id: 'generationType', label: 'Generation Type', visible: true },
        { id: 'misExempt', label: 'MIS Exempt', visible: true },
        { id: 'status', label: 'Status', visible: true },
        { id: 'problemSolver', label: 'Problem Solver', visible: true },
        { id: 'sundayLogic', label: 'Sunday Logic', visible: true },
    ]);



    const handleOnDragEnd = (result: any) => {
        if (!result.destination) return;
        const reorderedColumns = Array.from(columns);
        const [movedColumn] = reorderedColumns.splice(result.source.index, 1);
        reorderedColumns.splice(result.destination.index, 0, movedColumn);
        setColumns(reorderedColumns);
    };
    // ==============================================================






    // Fetch the department list on component mount
    useEffect(() => {
        fetchModules();
        fetchModulesCsv()
    }, [currentPage]);

    const fetchModules = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/BDTaskMaster/GetBDTask`, {
                params: {
                    PageIndex: currentPage
                }
            });
            if (response.data.isSuccess) {
                setBdTasks(response.data.bDTasks);
                setTotalPages(Math.ceil(response.data.totalCount / 10));
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching hrTasks:', error);
        }
        finally {
            setLoading(false);
        }
    };

    const fetchModulesCsv = async () => {
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/BDTaskMaster/GetBDTask`);
            if (response.data.isSuccess) {
                setDownloadCsv(response.data.bDTasks);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching hrTasks:', error);
        }

    };



    // useEffect(() => {
    //     const fetchData = async (endpoint: string, setter: Function, listName: string) => {
    //         try {
    //             const response = await axios.get(`${config.API_URL_APPLICATION}/${endpoint}`);
    //             if (response.data.isSuccess) {
    //                 setter(response.data[listName]);
    //             } else {
    //                 console.error(response.data.message);
    //             }
    //         } catch (error) {
    //             console.error(`Error fetching data from ${endpoint}:`, error);
    //         }
    //     };

    //     fetchData('CommonDropdown/GetModuleList', setModuleList, 'moduleNameListResponses');
    //     fetchData('CommonDropdown/GetEmployeeListWithId', setEmployeeList, 'employeeLists');
    // }, []);






    // const handleClear = () => {
    //     setModuleDisplayName('');
    //     setModuleOwnerName('');
    //     fetchModules();
    // };


    const filteredTasks = bdTasks.filter(task =>
        task.taskDisplayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.taskDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.moduleID.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.processID.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.predecessor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.successor.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const convertToCSV = (data: BdTask[]) => {
        const csvRows = [
            ['ID', 'Task Display Name', 'Task Description', 'Role', 'How Planned Date Is Calculated',
                'Predecessor', 'Successor', 'Generation Type', 'MIS Exempt', 'Status',
                'Problem Solver', 'Sunday Logic', 'Module ID', 'Process ID', 'Created By', 'Updated By'],
            ...data.map(task => [
                task.id,
                task.taskDisplayName,
                task.taskDescription,
                task.role,
                task.howPlannedDateIsCalculated,
                task.predecessor,
                task.successor,
                task.generationType,
                task.misExempt,
                task.status,
                task.problemSolver,
                task.sundayLogic,
                task.moduleID,
                task.processID,
                task.createdBy,
                task.updatedBy
            ])
        ];

        return csvRows.map(row => row.join(',')).join('\n');
    };


    const downloadCSV = () => {

        const csvData = convertToCSV(downloadCsv);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'Modules.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };


    const handleSearchcurrent = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    return (
        <>
            <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center fs-20">
                <span><i className="ri-file-list-line me-2"></i><span className='fw-bold test-nowrap'>Bd Task List</span></span>
                <div className="d-flex">
                    <Link to='/pages/BdTaskMasterinsert'>
                        <Button variant="primary">
                            Add Bd Task
                        </Button>
                    </Link>

                </div>
            </div>

            {!bdTasks ? (
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
                <div className="">
                    <div >
                        {loading ? (
                            <div className='loader-container'>
                                <div className="loader"></div>
                                <div className='mt-2'>Please Wait!</div>
                            </div>
                        ) : (
                            <>
                                <div className='bg-white p-2 pb-2'>
                                    {/* <Form onSubmit={handleSearch}>
                                        <Row>
                                            <Col lg={5}>
                                                <Form.Group controlId="ModuleDisplayName">
                                                    <Form.Label>BdInput Display Name:</Form.Label>

                                                    <Select
                                                        name="searchProjectName"
                                                        value={moduleList.find(item => item.moduleName === moduleDisplayName) || null} // handle null
                                                        onChange={(selectedOption) => setModuleDisplayName(selectedOption ? selectedOption.moduleName : "")} // null check
                                                        options={moduleList}
                                                        getOptionLabel={(item) => item.moduleName}
                                                        getOptionValue={(item) => item.moduleName}
                                                        isSearchable={true}
                                                        placeholder="Select BdInput Display Name"
                                                        className="h45"
                                                    />
                                                </Form.Group>
                                            </Col>

                                            <Col lg={5}>
                                                <Form.Group controlId="ModuleOwnerName">
                                                    <Form.Label>BdInput Owner Name:</Form.Label>
                                                    <Select
                                                        name="ModuleOwnerName"
                                                        value={employeeList.find(emp => emp.empId === moduleOwnerName) || null} // handle null
                                                        onChange={(selectedOption) => setModuleOwnerName(selectedOption ? selectedOption.empId : "")} // null check
                                                        options={employeeList}
                                                        getOptionLabel={(emp) => emp.employeeName}
                                                        getOptionValue={(emp) => emp.empId}
                                                        isSearchable={true}
                                                        placeholder="Select BdInput Owner Name."
                                                        className="h45"
                                                    />
                                                </Form.Group>
                                            </Col>

                                            <Col className='align-items-end d-flex justify-content-end'>

                                                <ButtonGroup aria-label="Basic example" className='w-100'>
                                                    <Button type="button" variant="primary" onClick={handleClear}>
                                                        <i className="ri-loop-left-line"></i>
                                                    </Button>
                                                    &nbsp;
                                                    <Button type="submit" variant="primary" >
                                                        Search
                                                    </Button>
                                                </ButtonGroup>
                                            </Col>
                                        </Row>

                                    </Form> */}

                                    <div>Select filter will be apply</div>
                                    <Row className='mt-3'>
                                        <div className="d-flex justify-content-end bg-light p-1">
                                            <div className="app-search d-none d-lg-block me-4">
                                                <form>
                                                    <div className="input-group px300 ">
                                                        <input
                                                            type="search"
                                                            className=" bg-white "
                                                            placeholder="Search..."
                                                            value={searchQuery}
                                                            onChange={handleSearchcurrent}
                                                        />
                                                        <span className="ri-search-line search-icon text-muted" />
                                                    </div>
                                                </form>
                                            </div>
                                            <Button variant="primary" onClick={downloadCSV} className="">
                                                Download CSV
                                            </Button>
                                        </div>
                                    </Row>
                                </div>
                                <div className="overflow-auto text-nowrap">
                                    <DragDropContext onDragEnd={handleOnDragEnd}>
                                        <Table hover className='bg-white '>
                                            <thead>
                                                <Droppable droppableId="columns" direction="horizontal">
                                                    {(provided) => (
                                                        <tr {...provided.droppableProps} ref={provided.innerRef as React.Ref<HTMLTableRowElement>}>
                                                            <th><i className="ri-list-ordered-2"></i> Sr. No</th>
                                                            {columns
                                                                .filter((col) => col.visible)
                                                                .map((column, index) => (
                                                                    <Draggable key={column.id} draggableId={column.id} index={index}>
                                                                        {(provided) => (
                                                                            <th>
                                                                                <div ref={provided.innerRef as React.Ref<HTMLTableHeaderCellElement>}
                                                                                    {...provided.draggableProps}
                                                                                    {...provided.dragHandleProps}>
                                                                                    {column.id === 'moduleID' && (<i className="ri-settings-2-fill"></i>)}
                                                                                    {column.id === 'taskDisplayName' && (<i className="ri-user-settings-fill"></i>)}
                                                                                    {column.id === 'taskDescription' && (<i className="ri-file-text-fill"></i>)}
                                                                                    {column.id === 'role' && (<i className="ri-user-star-fill"></i>)}
                                                                                    {column.id === 'predecessor' && (<i className="ri-flow-chart-fill"></i>)}
                                                                                    {column.id === 'successor' && (<i className="ri-arrow-right-s-fill"></i>)}
                                                                                    {column.id === 'generationType' && (<i className="ri-magic-fill"></i>)}
                                                                                    {column.id === 'misExempt' && (<i className="ri-shield-check-fill"></i>)}
                                                                                    {column.id === 'status' && (<i className="ri-information-fill"></i>)}
                                                                                    {column.id === 'problemSolver' && (<i className="ri-lightbulb-fill"></i>)}
                                                                                    {column.id === 'sundayLogic' && (<i className="ri-calendar-check-fill"></i>)}

                                                                                    &nbsp; {column.label}

                                                                                </div>
                                                                            </th>
                                                                        )}
                                                                    </Draggable>
                                                                ))}
                                                            {provided.placeholder}
                                                            <th>Action</th>
                                                        </tr>
                                                    )}
                                                </Droppable>
                                            </thead>
                                            <tbody>
                                                {filteredTasks.length > 0 ? (
                                                    filteredTasks.slice(0, 10).map((item, index) => (
                                                        <tr key={item.id}>
                                                            <td>{(currentPage - 1) * 10 + index + 1}</td>
                                                            {columns.filter(col => col.visible).map((col) => (
                                                                <td key={col.id}
                                                                    className={
                                                                        col.id === 'moduleOwnerName' ? 'fw-bold fs-14 text-dark' :
                                                                            col.id === 'moduleOwnerID' ? 'fw-bold fs-13  ' :
                                                                                (col.id === 'status' && item[col.id] === 'INACTIVE') ? 'task4' :
                                                                                    (col.id === 'status' && item[col.id] === 'ACTIVE') ? 'task1' :
                                                                                        (col.id === 'misExempt' && item[col.id] === 'INACTIVE') ? 'task4' :
                                                                                            (col.id === 'misExempt' && item[col.id] === 'ACTIVE') ? 'task1' :
                                                                                                ''
                                                                    }
                                                                >
                                                                    <div>

                                                                        <td>{item[col.id as keyof BdTask]}</td>
                                                                    </div>
                                                                </td>
                                                            ))}
                                                            <td><Link to={`/pages/BdTaskMasterinsert/${item.id}`}>
                                                                <i className='btn ri-edit-line' ></i>
                                                            </Link>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={columns.length + 1}>
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
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </Table>
                                    </DragDropContext>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="d-flex justify-content-center align-items-center bg-white w-20 rounded-5 m-auto py-1 pb-1 my-2 pagination-rounded">
                        <Pagination >
                            <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                            <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
                            <Pagination.Item active>{currentPage}</Pagination.Item>
                            <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
                            <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
                        </Pagination>
                    </div>

                </div>
            )}
            <CustomSuccessToast
                show={showToast}
                toastMessage={toastMessage}
                toastVariant={toastVariant}
                onClose={() => setShowToast(false)}
            />
        </>
    );
};

export default BdTaskMaster;