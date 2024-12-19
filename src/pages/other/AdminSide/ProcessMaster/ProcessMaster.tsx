import axios from 'axios';
import { useState, useEffect } from 'react';
import { Button, Pagination, Table, Container, Row, Col, Alert, Form, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import IconWithLetter from '@/pages/ui/IconWithLetter';
import config from '@/config';
import ProcessCanvas from './ProcessCanvas';
import ProcessViewPopup from './ProcessViewPopup';
import Select from 'react-select';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';



interface Process {
    id: number;
    moduleName: string;
    moduleID: string;
    processID: string;
    processDisplayName: string;
    processObjective: string;
    processOwnerName: string;
    createdBy: string;
    updatedBy: string;
    createdDate: string;
    updatedDate: string;
    processName: string;
    userUpdatedMobileNumber: string;
    empId: string;
    employeeName: string;
    status: string;
    misExempt: string;
    manageId: number;
}

interface Column {
    id: string;
    label: string;
    visible: boolean;
}

const ModuleMaster = () => {
    const [processes, setProcesses] = useState<Process[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [moduleList, setModuleList] = useState<Process[]>([]);
    const [employeeList, setEmployeeList] = useState<Process[]>([]);
    const [processList, setProcessList] = useState<Process[]>([]);
    const [ModuleName, setModuleName] = useState('');
    const [ProcessName, setProcessName] = useState('');
    const [ProcessOwnerName, setProcessOwnerName] = useState('');
    const [manageId, setManageID] = useState<number>();
    const [downloadCsv, setDownloadCsv] = useState<Process[]>([]);

    const [show, setShow] = useState(false);
    const [showView, setShowView] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        if (location.state?.successMessage) {
            toast.dismiss()
            toast.success(location.state.successMessage);
            navigate(location.pathname, { replace: true });
        }
    }, [location.state, navigate]);



    const handleSearch = (e: any) => {
        e.preventDefault();

        let query = `?`;
        if (ProcessName) query += `ProcessName=${ProcessName}&`;
        if (ModuleName) query += `ModuleName=${ModuleName}&`;
        if (ProcessOwnerName) query += `ProcessOwnerName=${ProcessOwnerName}&`;

        // Remove trailing '&' or '?' from the query string
        query = query.endsWith('&') ? query.slice(0, -1) : query;

        const apiUrl = `${config.API_URL_APPLICATION}/ProcessMaster/SearchProcessList${query}`;

        console.log(apiUrl)
        axios.get(apiUrl, {
            headers: {
                'accept': '*/*'
            }
        })
            .then((response) => {
                setProcesses(response.data.processMasterListResponses)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    };

    // both are required to make dragable column of table 
    const [columns, setColumns] = useState<Column[]>([
        { id: 'moduleName', label: 'Module Name', visible: true },
        { id: 'processID', label: 'Process ID', visible: true },
        { id: 'processDisplayName', label: 'Process Display Name', visible: true },
        { id: 'processOwnerName', label: 'Process Owner Name', visible: true },
        { id: 'processObjective', label: 'Process Objective', visible: true },
        { id: 'status', label: 'Status', visible: true },
    ]);

    const handleOnDragEnd = (result: any) => {
        if (!result.destination) return;
        const reorderedColumns = Array.from(columns);
        const [movedColumn] = reorderedColumns.splice(result.source.index, 1);
        reorderedColumns.splice(result.destination.index, 0, movedColumn);
        setColumns(reorderedColumns);
    };
    // ==============================================================

    useEffect(() => {
        fetchProcess();
        fetchProcessCsv()
    }, [currentPage]);


    const fetchProcess = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/ProcessMaster/GetProcess`, {
                params: {
                    PageIndex: currentPage
                }
            });
            if (response.data.isSuccess) {
                setProcesses(response.data.processMasterList);
                setTotalPages(Math.ceil(response.data.totalCount / 10));
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching modules:', error);
        }
        finally {
            setLoading(false);
        }
    };

    const fetchProcessCsv = async () => {
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/ProcessMaster/GetProcess`);
            if (response.data.isSuccess) {
                setDownloadCsv(response.data.processMasterList);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching modules:', error);
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
        fetchData('CommonDropdown/GetProcessOwnerName', setEmployeeList, 'processOwnerNames');
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

    const handleClear = () => {
        setModuleName('');
        setProcessName('');
        setProcessOwnerName('');
        fetchProcess();
    };


    const convertToCSV = (data: Process[]) => {
        const csvRows = [
            ['ID', 'Module Name', 'Module ID', 'Process ID', 'Process Display Name',
                'Process Objective', 'Process Owner Name',
                'User Updated Mobile Number', 'Mis Exempt', 'Status',
                'Created By', 'Updated By', 'Created Date', 'Updated Date'],
            ...data.map(mod => [
                mod.id,
                mod.moduleName,
                mod.moduleID,
                mod.processID,
                mod.processDisplayName,
                `"${mod.processObjective}"`,
                mod.processOwnerName || '',
                mod.userUpdatedMobileNumber || '',
                mod.misExempt || '',
                mod.status || '',
                mod.createdBy,
                mod.updatedBy,
                mod.createdDate,
                mod.updatedDate
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
            link.setAttribute('download', 'Process Master.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };


    const handleShow = () => setShow(true);

    const handleShowview = () => setShowView(true);

    const handleEdit = (id: any) => {
        handleShow();
        setManageID(id)

    };
    const handleViewEdit = (id: any) => {
        handleShowview();
        setManageID(id)

    };

    return (
        <>
            <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center fs-20">
                <span><i className="ri-file-list-line me-2"></i><span className='fw-bold test-nowrap'>Process List</span></span>
                <div className="d-flex">
                    <Button variant="primary" onClick={downloadCSV} className="me-2">
                        Download CSV
                    </Button>
                    <Link to='/pages/ProcessMasterinsert'>
                        <Button variant="primary">
                            Add Process
                        </Button>
                    </Link>

                </div>
            </div>
            {!processes ? (
                <Container className="mt-5">
                    <Row className="justify-content-center">
                        <Col xs={12} md={8} lg={6}>
                            <Alert variant="info" className="text-center">
                                <h4>No Process Found</h4>
                                <p>You currently don't have Completed tasks</p>
                            </Alert>
                        </Col>
                    </Row>
                </Container>
            ) : (
                <div className="">
                    <div>
                        {loading ? (
                            <div className='loader-container'>
                                <div className="loader"></div>
                                <div className='mt-2'>Please Wait!</div>
                            </div>
                        ) : (
                            <>
                                <div className='bg-white p-2 pb-1'>
                                    <Form onSubmit={handleSearch}>
                                        <Row>
                                            <Col lg={4}>
                                                <Form.Group controlId="ModuleName">
                                                    <Form.Label>Module Name</Form.Label>

                                                    <Select
                                                        name="ModuleName"
                                                        value={moduleList.find(item => item.moduleName === ModuleName) || null} // handle null
                                                        onChange={(selectedOption) => setModuleName(selectedOption ? selectedOption.moduleName : "")} // null check
                                                        options={moduleList}
                                                        getOptionLabel={(item) => item.moduleName}
                                                        getOptionValue={(item) => item.moduleName}
                                                        isSearchable={true}
                                                        placeholder="Select Module Name"
                                                        className="h45"
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col lg={3}>
                                                <Form.Group controlId="ModuleOwnerName">
                                                    <Form.Label>Process Name</Form.Label>

                                                    <Select
                                                        name="ModuleOwnerName"
                                                        value={processList.find(item => item.processName === ProcessName) || null} // handle null
                                                        onChange={(selectedOption) => setProcessName(selectedOption ? selectedOption.processName : "")} // null check
                                                        options={processList}
                                                        getOptionLabel={(item) => item.processName}
                                                        getOptionValue={(item) => item.processName}
                                                        isSearchable={true}
                                                        placeholder="Select Process Name"
                                                        className="h45"
                                                        isDisabled={!ModuleName}
                                                    />
                                                </Form.Group>
                                            </Col>

                                            <Col lg={3}>
                                                <Form.Group controlId="ProcessOwnerName">
                                                    <Form.Label>Process Owner Name</Form.Label>
                                                    <Select
                                                        name="ProcessOwnerName"
                                                        value={employeeList.find(item => item.processOwnerName === ProcessOwnerName) || null} // handle null
                                                        onChange={(selectedOption) => setProcessOwnerName(selectedOption ? selectedOption.processOwnerName : "")} // null check
                                                        options={employeeList}
                                                        getOptionLabel={(item) => item.processOwnerName}
                                                        getOptionValue={(item) => item.processOwnerName}
                                                        isSearchable={true}
                                                        placeholder="Select Process Owner Name"
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
                                                    <Button type="submit" variant="primary" >Search</Button>
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
                                <div className="overflow-auto ">
                                    <DragDropContext onDragEnd={handleOnDragEnd}>
                                        <Table hover className='bg-white '>
                                            <thead className='text-nowrap'>
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
                                                                                <div ref={provided.innerRef}
                                                                                    {...provided.draggableProps}
                                                                                    {...provided.dragHandleProps}>
                                                                                    {column.id === 'moduleName' && (<i className="ri-settings-2-fill"></i>)}
                                                                                    {column.id === 'processID' && (<i className="ri-user-settings-fill"></i>)}
                                                                                    {column.id === 'processOwnerName' && (<i className="ri-user-fill"></i>)}
                                                                                    {column.id === 'processDisplayName' && (<i className="ri-user-follow-fill"></i>)}
                                                                                    {column.id === 'processObjective' && (<i className="ri-information-fill"></i>)}
                                                                                    &nbsp; {column.label}
                                                                                </div>
                                                                            </th>
                                                                        )}
                                                                    </Draggable>
                                                                ))}
                                                            {provided.placeholder}
                                                            <th><i className="ri-flow-chart "></i> Project/SubProject</th>
                                                            <th><i className="ri-task-line"></i> Tasks</th>
                                                            <th><i className="ri-tools-line"></i> Action</th>
                                                        </tr>
                                                    )}
                                                </Droppable>
                                            </thead>
                                            <tbody>
                                                {processes.length > 0 ? (
                                                    processes.slice(0, 10).map((item, index) => (
                                                        <tr key={item.id}>
                                                            <td>{(currentPage - 1) * 10 + index + 1}</td>
                                                            {columns.filter(col => col.visible).map((col) => (
                                                                <td key={col.id}
                                                                    className={
                                                                        col.id === 'processOwnerName' ? 'fw-bold  text-dark text-nowrap' :
                                                                            col.id === 'moduleName' ? 'fw-bold text-dark   text-nowrap' :
                                                                                (col.id === 'status' && item[col.id] === "Enabled") ? 'task1' :
                                                                                    (col.id === 'status' && item[col.id] === "Disabled") ? 'task4' :
                                                                                        col.id === 'processObjective' ? 'w-200px' :
                                                                                            ''
                                                                    }
                                                                >
                                                                    {col.id === 'processOwnerName' ? (
                                                                        <td>
                                                                            <div className='d-flex align-items-center'>
                                                                                <IconWithLetter letter={item.processOwnerName.charAt(0)} />
                                                                                {item.processOwnerName.split('_')[0]}
                                                                            </div>
                                                                            {item.userUpdatedMobileNumber ?
                                                                                <p className='phone_user fw-normal m-0'><a href={`tel:${item.userUpdatedMobileNumber}`}> <i className="ri-phone-fill"></i> {item.userUpdatedMobileNumber}</a></p> : ""
                                                                            }
                                                                        </td>
                                                                    ) : (
                                                                        <div>

                                                                            <td>{item[col.id as keyof Process]}</td>
                                                                        </div>
                                                                    )}



                                                                </td>
                                                            ))}
                                                            <td><Button variant='primary' className=' text-white icon-padding' title="You can Add and Remove Porject from this Process." onClick={() => handleEdit(item.id)}> <i className="fs-18 ri-folder-add-line "></i> </Button></td>
                                                            <td><Button variant='primary' className=' text-white icon-padding' title="You can View the running tasks." onClick={() => handleViewEdit(item.id)}>  <i className=" fs-18 ri-eye-line "></i></Button></td>
                                                            <td><Link to={`/pages/ProcessMasterinsert/${item.id}`}><Button variant='primary' className=' text-white icon-padding' title="You can Edit the Porcess." ><i className='fs-18 ri-edit-line text-white' ></i></Button></Link></td>

                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={12}>
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

                    <ProcessCanvas show={show} setShow={setShow} manageId={manageId} />
                    <ProcessViewPopup showView={showView} setShowView={setShowView} id={manageId} />


                </div>
            )}
        </>
    );
};

export default ModuleMaster;