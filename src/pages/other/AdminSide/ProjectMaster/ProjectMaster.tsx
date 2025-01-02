import axios from 'axios';
import { useState, useEffect } from 'react';
import { Button, Pagination, Table, Container, Row, Col, Alert, Form, ButtonGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import config from '@/config';
import ProjectViewPopup from './ProjectViewPopup';
import Select from 'react-select';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';




interface Project {
    id: number;
    projectName: string;
    projectID: string;
    stateId: number;
    projectType: number;
    managementContract: number;
    projectIncharge: string;
    projectInchargeName: string;
    projectCoordinator: number;
    projectCoordinatorName: number;
    completionStatus: string;
    status: string;
    nameOfWork: string;
    createdBy: string;
    subProjectName: string;
    subProjectID: string;
    subProjectStatus: string;
    updatedBy: string;
    projectTypeName: string;
    stateName: string;
    managementContractName: string;
    projectInchargeMobileNumber: string;
    projectCoordinatorMobileNumber: string;
    completionStatusName: string;
    contractualWorkValue: string;
    executorCompany: string;
    nextValueofWorkItemForTeam: string;
    percentageofWorkDone: string;
    revisedContractualWorkValue: string;
    totalWorkDoneValueuptoPreviousMonth: string;
    valueofWorkDoneinthisMonth: string;
    valueofWorkDoneinthisFY: string;
    contractualStartDate: string;
    contractualCompletionDate: string;
    expectedDateofEarliestProjectCompletion: string;
    expectedDateofLatestProjectCompletion: string;
    refreshWorkDate: string;
    estimateCompletionDate: string;
    recordedMonth: string;
    recordedYear: string;
    createdDate: string;
    updatedDate: string;
}


interface Column {
    id: string;
    label: string;
    visible: boolean;
}

interface EmployeeList {
    empId: string;
    employeeName: string;
}
interface ProjectList {
    id: number;
    projectName: string;
}
interface CompletionStatus {
    id: string;
    name: any;
}

const ProjectMaster = () => {
    const role = localStorage.getItem('role');

    const [project, setProject] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showView, setShowView] = useState(false);
    const [manageId, setManageID] = useState<string>('');
    const [employeeList, setEmployeeList] = useState<EmployeeList[]>([]);
    const [projectList, setProjectList] = useState<ProjectList[]>([]);
    const [completionStatus, setCompletionStatus] = useState<CompletionStatus[]>([]);
    const [searchProjectInchage, setSearchProjectInchage] = useState('');
    const [searchProjectCoordinator, setSearchProjectCoordinator] = useState('');
    const [searchProjectName, setSearchProjectName] = useState('');
    const [searchAppAccess, setSearchAppAccess] = useState('');
    const [searchCompletionStatus, setSearchCompletionStatus] = useState('');
    const [downloadCsv, setDownloadCsv] = useState<Project[]>([]);
    const [searchTriggered, setSearchTriggered] = useState(false);


    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        if (location.state?.successMessage) {
            toast.dismiss()
            toast.success(location.state.successMessage);
            navigate(location.pathname, { replace: true });
        }
    }, [location.state, navigate]);


    // both are required to make dragable column of table 
    const [columns, setColumns] = useState<Column[]>([
        { id: 'projectName', label: 'Project Name', visible: true },
        { id: 'projectID', label: 'Project ID', visible: true },
        { id: 'projectInchargeName', label: 'Project Incharge', visible: true },
        { id: 'projectCoordinatorName', label: 'Project Coordinator ', visible: true },
        { id: 'completionStatusName', label: 'Completion Status', visible: true },
        { id: 'status', label: 'Project Status', visible: true },
        { id: 'stateName', label: 'State Name', visible: true },
        { id: 'projectTypeName', label: 'Project Type', visible: true },
        { id: 'managementContractName', label: 'Management Contract', visible: true },
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
        if (searchTriggered || currentPage) {
            handleSearch();

        } else {
            fetchProjects();
        }
    }, [currentPage, searchTriggered]);


    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        let query = `?`;


        if (searchProjectInchage) query += `ProjectIncharge=${searchProjectInchage}&`;
        if (searchProjectCoordinator) query += `ProjectCoordinator=${searchProjectCoordinator}&`;
        if (searchProjectName) query += `ProjectName=${searchProjectName}&`;
        if (searchCompletionStatus) query += `CompletionStatus=${searchCompletionStatus}&`;
        if (searchAppAccess) query += `Status=${searchAppAccess}&`;
        query += `PageIndex=${currentPage}`;

        query = query.endsWith('&') ? query.slice(0, -1) : query;

        const apiUrl = `${config.API_URL_APPLICATION}/ProjectMaster/SearchProject${query}`;
        console.log(apiUrl)
        axios.get(apiUrl, { headers: { 'accept': '*/*' } })
            .then((response) => {
                console.log("search response ", response.data.projectMasterList);
                setTotalPages(Math.ceil(response.data.totalCount / 10));
                setProject(response.data.projectMasterList)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    };

    useEffect(() => {
        fetchProjects();
        fetchModulesCsv()
    }, [currentPage]);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/ProjectMaster/GetProject`, {
                params: { PageIndex: currentPage }
            });
            if (response.data.isSuccess) {
                setProject(response.data.projectMasterList);
                setTotalPages(Math.ceil(response.data.totalCount / 10));
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching doers:', error);
        }
        finally {
            setLoading(false);
        }
    };


    const fetchModulesCsv = async () => {
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/ProjectMaster/GetProject`);
            if (response.data.isSuccess) {
                setDownloadCsv(response.data.projectMasterList);
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

        fetchData('CommonDropdown/GetEmployeeListWithId', setEmployeeList, 'employeeLists');
        fetchData('CommonDropdown/GetProjectList', setProjectList, 'projectListResponses');
        fetchData('CommonDropdown/GetCompletionStatus', setCompletionStatus, 'completionStatusListResponses');

    }, []);


    const downloadCSV = () => {
        const csvData = convertToCSV(downloadCsv);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'Project Master.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };
    const convertToCSV = (data: Project[]) => {
        const csvRows = [
            [
                'ID', 'Project Name', 'Project ID', 'State Name',
                'Project Type Name', 'Management Contract Name',
                'Project Incharge Name', 'Project Incharge Mobile Number',
                'Project Coordinator Name', 'Project Coordinator Mobile Number',
                'Completion Status Name', 'Project Status', 'Sub Project ID', 'Sub Project Name', 'Sub Project Status',
                'Name of Work', 'Contractual Work Value', 'Executor Company',
                'Next Value of Work Item for Team', 'Percentage of Work Done',
                'Revised Contractual Work Value', 'Total Work Done Value Upto Previous Month',
                'Value of Work Done in This Month', 'Value of Work Done in This FY',
                'Contractual Start Date', 'Contractual Completion Date',
                'Expected Date of Earliest Project Completion',
                'Expected Date of Latest Project Completion',
                'Refresh Work Date', 'Estimate Completion Date',
                'Recorded Month', 'Recorded Year', 'Created By',
                'Updated By', 'Created Date', 'Updated Date'
            ],
            ...data.map(project => [
                project.id,
                project.projectName,
                project.projectID,
                project.stateName,
                project.projectTypeName,
                project.managementContractName,
                `"${project.projectInchargeName}"`,
                project.projectInchargeMobileNumber || '',
                project.projectCoordinatorName || '',
                project.projectCoordinatorMobileNumber || '',
                project.completionStatusName,
                project.status,
                project.subProjectID || '',
                project.subProjectName || '',
                project.subProjectStatus || '',
                project.nameOfWork || '',
                project.contractualWorkValue || '',
                project.executorCompany || '',
                project.nextValueofWorkItemForTeam || '',
                project.percentageofWorkDone || '',
                project.revisedContractualWorkValue || '',
                project.totalWorkDoneValueuptoPreviousMonth || '',
                project.valueofWorkDoneinthisMonth || '',
                project.valueofWorkDoneinthisFY || '',
                project.contractualStartDate || '',
                project.contractualCompletionDate || '',
                project.expectedDateofEarliestProjectCompletion || '',
                project.expectedDateofLatestProjectCompletion || '',
                project.refreshWorkDate || '',
                project.estimateCompletionDate || '',
                project.recordedMonth || '',
                project.recordedYear || '',
                project.createdBy || '',
                project.updatedBy || '',
                project.createdDate || '',
                project.updatedDate || ''
            ])
        ];
        return csvRows.map(row => row.join(',')).join('\n');
    };



    const handleClear = async () => {
        setCurrentPage(1);
        setSearchProjectInchage('')
        setSearchProjectCoordinator('')
        setSearchProjectName('')
        setSearchAppAccess('')
        setSearchCompletionStatus('');
        setSearchTriggered(false);
        await fetchProjects();
    };



    const handleShowview = () => setShowView(true);
    const handleViewEdit = (projectName: string) => {
        handleShowview();
        setManageID(projectName)

    };


    const optionsAppAccess = [
        { value: 'Enabled', label: 'Enabled' },
        { value: 'Disabled', label: 'Disabled' }
    ];

    return (
        <>
            <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center">
                <span><i className="ri-file-list-line me-2 text-dark fs-16"></i><span className='fw-bold text-dark fs-15'>Project List</span></span>
                <div className="d-flex justify-content-end  ">
                    <Button variant="primary" onClick={downloadCSV} className="me-2">
                        Download CSV
                    </Button>
                    {(role === 'Admin' || role === 'DME') && (
                        <>
                            <Link to='/pages/ProjectMasterinsert'>
                                <Button variant="primary" className="me-2">
                                    Add Project
                                </Button>
                            </Link>
                            <Link to='/pages/ProjectSubmasterinsert'>
                                <Button variant="primary" className="me-2">
                                    Add Sub Project
                                </Button>
                            </Link>
                        </>

                    )
                    }

                </div>
            </div>
            <div className='bg-white p-2 pb-2'>
                <Form
                    onSubmit={(e) => {
                        e.preventDefault();
                        setCurrentPage(1);
                        setSearchTriggered(true);
                    }}
                >
                    <Row>

                        <Col lg={4} className="">
                            <Form.Group controlId="searchProjectName">
                                <Form.Label>Project Name</Form.Label>
                                <Select
                                    name="searchProjectName"
                                    value={projectList.find(item => item.projectName === searchProjectName) || null} // handle null
                                    onChange={(selectedOption) => setSearchProjectName(selectedOption ? selectedOption.projectName : "")} // null check
                                    options={projectList}
                                    getOptionLabel={(item) => item.projectName}
                                    getOptionValue={(item) => item.projectName}
                                    isSearchable={true}
                                    placeholder="Select Project Name"
                                    className="h45"
                                />
                            </Form.Group>
                        </Col>

                        <Col lg={4}>
                            <Form.Group controlId="searchProjectIncharge">
                                <Form.Label>Project Incharge</Form.Label>
                                <Select
                                    name="searchProjectIncharge"
                                    value={employeeList.find(emp => emp.empId === searchProjectInchage) || null} // handle null
                                    onChange={(selectedOption) => setSearchProjectInchage(selectedOption ? selectedOption.empId : "")} // null check
                                    options={employeeList}
                                    getOptionLabel={(emp) => emp.employeeName}
                                    getOptionValue={(emp) => emp.empId}
                                    isSearchable={true}
                                    placeholder="Select Employee"
                                    className="h45"
                                />
                            </Form.Group>
                        </Col>
                        <Col lg={4} className="">
                            <Form.Group controlId="searchProjectCoordinator">
                                <Form.Label>Project Coordinator</Form.Label>
                                <Select
                                    name="searchProjectCoordinator"
                                    value={employeeList.find(emp => emp.empId === searchProjectCoordinator) || null} // handle null
                                    onChange={(selectedOption) => setSearchProjectCoordinator(selectedOption ? selectedOption.empId : "")} // null check
                                    options={employeeList}
                                    getOptionLabel={(emp) => emp.employeeName}
                                    getOptionValue={(emp) => emp.empId}
                                    isSearchable={true}
                                    placeholder="Select Employee "
                                    className="h45"
                                />
                            </Form.Group>
                        </Col>

                        <Col lg={4} className="mt-2">
                            <Form.Group controlId="searchCompletionStatus">
                                <Form.Label>Completion Status</Form.Label>
                                <Select
                                    name="searchCompletionStatus"
                                    value={completionStatus.find(task => task.id === searchCompletionStatus) || null}
                                    onChange={(selectedOption) => setSearchCompletionStatus(selectedOption ? selectedOption.id : "")}
                                    options={completionStatus}
                                    getOptionLabel={(task) => task.name}
                                    getOptionValue={(task) => task.id}
                                    isSearchable={true}
                                    placeholder="Select Completion Status"
                                    className="h45"
                                />
                            </Form.Group>
                        </Col>
                        <Col lg={4} className="mt-2">
                            <Form.Group controlId="searchAppAccess">
                                <Form.Label>Project Status</Form.Label>
                                <Select
                                    name="searchAppAccess"
                                    options={optionsAppAccess}
                                    value={optionsAppAccess.find(option => option.value === searchAppAccess) || null}
                                    onChange={(selectedOption) => setSearchAppAccess(selectedOption?.value || '')}
                                    placeholder="Select Project Status"
                                />
                            </Form.Group>
                        </Col>

                        <Col lg={4} className="align-items-end d-flex justify-content-end mt-2">
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
            ) : (
                <>

                    <div className="overflow-auto text-nowrap ">
                        {!project ? (
                            <Container className="mt-5">
                                <Row className="justify-content-center">
                                    <Col xs={12} md={8} lg={6}>
                                        <Alert variant="info" className="text-center">
                                            <h4>No Data Found</h4>
                                            <p>You currently don't have any Data</p>
                                        </Alert>
                                    </Col>
                                </Row>
                            </Container>
                        ) : (
                            <DragDropContext onDragEnd={handleOnDragEnd}>
                                <Table hover className='bg-white'>
                                    <thead>
                                        <Droppable droppableId="columns" direction="horizontal">
                                            {(provided) => (
                                                <tr {...provided.droppableProps} ref={provided.innerRef as React.Ref<HTMLTableRowElement>}>
                                                    <th><i className="ri-list-ordered-2"></i>  Sr. No</th>
                                                    {columns.filter(col => col.visible).map((column, index) => (
                                                        <Draggable key={column.id} draggableId={column.id} index={index}>
                                                            {(provided) => (
                                                                <th>
                                                                    <div ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}>
                                                                        {column.id === 'projectName' && (<i className="ri-file-list-line"></i>)}
                                                                        {column.id === 'projectID' && (<i className="ri-barcode-box-line"></i>)}
                                                                        {column.id === 'stateName' && (<i className="ri-map-pin-line"></i>)}
                                                                        {column.id === 'projectTypeName' && (<i className="ri-treasure-map-line"></i>)}
                                                                        {column.id === 'managementContractName' && (<i className="ri-briefcase-line"></i>)}
                                                                        {column.id === 'projectInchargeName' && (<i className="ri-user-settings-line"></i>)}
                                                                        {column.id === 'projectCoordinatorName' && (<i className="ri-group-line"></i>)}
                                                                        {column.id === 'completionStatusName' && (<i className="ri-check-line"></i>)}
                                                                        {column.id === 'status' && (<i className="ri-check-line"></i>)}
                                                                        {column.id === 'nameOfWork' && (<i className="ri-pencil-ruler-2-line"></i>)}


                                                                        &nbsp; {column.label}
                                                                    </div>
                                                                </th>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                    <th>Sub Project</th>
                                                    {(role === 'Admin' || role === 'DME') && (
                                                        <th>Action</th>
                                                    )}
                                                </tr>
                                            )}
                                        </Droppable>
                                    </thead>
                                    <tbody>
                                        {project.length > 0 ? (
                                            project.slice(0, 10).map((item, index) => (
                                                <tr key={item.id}>
                                                    <td>{(currentPage - 1) * 10 + index + 1}</td>
                                                    {columns.filter(col => col.visible).map((col) => (
                                                        <td key={col.id}
                                                            className={
                                                                (col.id === 'status' && item[col.id] === "Enabled") ? 'task1' :
                                                                    (col.id === 'status' && item[col.id] === "Disabled") ? 'task4' :
                                                                        ''
                                                            }
                                                        >
                                                            <div>

                                                                {col.id === 'projectInchargeName' ? (
                                                                    <td>
                                                                        <div className='d-flex align-items-center'>
                                                                            {item.projectInchargeName}
                                                                        </div>
                                                                        {item.projectInchargeMobileNumber ?
                                                                            <p className='fw-normal m-0'><a href={`tel:${item.projectInchargeMobileNumber}`}>
                                                                                <i className="ri-phone-fill"></i> {item.projectInchargeMobileNumber}</a></p> : ""
                                                                        }
                                                                    </td>
                                                                ) : col.id === 'projectCoordinatorName' ? (


                                                                    <td>
                                                                        <div className='d-flex align-items-center'>
                                                                            {item.projectCoordinatorName}
                                                                        </div>
                                                                        {item.projectCoordinatorMobileNumber ?
                                                                            <p className='fw-normal m-0'><a href={`tel:${item.projectCoordinatorMobileNumber}`}>
                                                                                <i className="ri-phone-fill"></i> {item.projectCoordinatorMobileNumber}</a></p> : ""
                                                                        }
                                                                    </td>
                                                                ) : (
                                                                    <td>{item[col.id as keyof Project]}</td>
                                                                )}

                                                            </div>
                                                        </td>



                                                    ))}
                                                    {/* Action Button */}
                                                    <td><Button variant='primary' className='px-3 text-white' onClick={() => handleViewEdit(item.projectName)}>  <i className="ri-eye-line fs-4"></i></Button></td>

                                                    {(role === 'Admin' || role === 'DME') && (
                                                        <td><Link to={`/pages/ProjectMasterinsert/${item.id}`}>
                                                            <Button variant='primary' className='p-0 text-white'>
                                                                <i className='btn ri-edit-line text-white' ></i>
                                                            </Button>
                                                        </Link>
                                                        </td>)}
                                                </tr>
                                            ))
                                        ) : (
                                            // <tr>
                                            <td colSpan={12}>
                                                <Container className="mt-5">
                                                    <Row className="justify-content-center">
                                                        <Col xs={12} md={8} lg={6}>
                                                            <Alert variant="info" className="text-center">
                                                                <h4>No Data Found</h4>
                                                                <p>You currently don't have any Data</p>
                                                            </Alert>
                                                        </Col>
                                                    </Row>
                                                </Container>
                                            </td>
                                            // </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </DragDropContext>
                        )}
                    </div>
                </>

            )}

            <div className="d-flex justify-content-center align-items-center bg-white w-20 rounded-5 m-auto py-1 pb-1 my-2 pagination-rounded">
                <Pagination >
                    <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                    <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
                    <Pagination.Item active>{currentPage}</Pagination.Item>
                    <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
                    <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
                </Pagination>
            </div>

            <ProjectViewPopup showView={showView} setShowView={setShowView} projectName={manageId} />


        </>
    );
};

export default ProjectMaster;