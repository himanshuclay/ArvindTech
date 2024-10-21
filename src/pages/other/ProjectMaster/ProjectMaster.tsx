import axios from 'axios';
import { useState, useEffect, ChangeEvent } from 'react';
import { Button, Pagination, Table, Container, Row, Col, Alert, Form, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import config from '@/config';
import ProjectViewPopup from './ProjectViewPopup';
import Select from 'react-select';




interface Project {
    id: number;
    projectName: string;
    projectID: string;
    stateId: number;
    projectType: number;
    managementContract: number;
    projectIncharge: number;
    projectCoordinator: number;
    completionStatus: number;
    nameOfWork: string;
    createdBy: string;
    updatedBy: string;
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
    id: number;
    name: any;
}

const ProjectMaster = () => {
    const [project, setProject] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [showView, setShowView] = useState(false);
    const [manageId, setManageID] = useState<string>('');
    const [employeeList, setEmployeeList] = useState<EmployeeList[]>([]);
    const [projectList, setProjectList] = useState<ProjectList[]>([]);
    const [completionStatus, setCompletionStatus] = useState<CompletionStatus[]>([]);



    const [searchProjectInchage, setSearchProjectInchage] = useState('');
    const [searchProjectCoordinator, setSearchProjectCoordinator] = useState('');
    const [searchProjectName, setSearchProjectName] = useState('');
    const [searchCompletionStatus, setSearchCompletionStatus] = useState<number>();


    // both are required to make dragable column of table 
    const [columns, setColumns] = useState<Column[]>([
        { id: 'projectName', label: 'Project Name', visible: true },
        { id: 'projectID', label: 'Project ID', visible: true },
        { id: 'stateName', label: 'State Name', visible: true },
        { id: 'projectTypeName', label: 'Project Type', visible: true },
        { id: 'managementContractName', label: 'Management Contract', visible: true },
        { id: 'projectInchargeName', label: 'Project Incharge', visible: true },
        { id: 'projectCoordinatorName', label: 'Project Coordinator', visible: true },
        { id: 'completionStatusName', label: 'Completion Status', visible: true }
    ]);

    const handleOnDragEnd = (result: any) => {
        if (!result.destination) return;
        const reorderedColumns = Array.from(columns);
        const [movedColumn] = reorderedColumns.splice(result.source.index, 1);
        reorderedColumns.splice(result.destination.index, 0, movedColumn);
        setColumns(reorderedColumns);
    };
    // ==============================================================

    const handleClear = () => {
        setSearchProjectInchage('')
        setSearchProjectCoordinator('')
        setSearchProjectName('')
        setSearchCompletionStatus(0)
        fetchDoers();
    };

    const handleSearch = (e: any) => {
        e.preventDefault();

        let query = `?`;
        if (searchProjectInchage) query += `ProjectIncharge=${searchProjectInchage}&`;
        if (searchProjectCoordinator) query += `ProjectCoordinator=${searchProjectCoordinator}&`;
        if (searchProjectName) query += `ProjectName=${searchProjectName}&`;
        if (searchCompletionStatus) query += `CompletionStatus=${searchCompletionStatus}&`;
     

        query = query.endsWith('&') ? query.slice(0, -1) : query;

        const apiUrl = `${config.API_URL_APPLICATION}/ProjectMaster/SearchProject${query}`;

        console.log(apiUrl)
        axios.get(apiUrl, {
            headers: {
                'accept': '*/*'
            }
        })
            .then((response) => {
                console.log("search response ", response.data.projectMasterList);
                setProject(response.data.projectMasterList)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    };

    useEffect(() => {
        fetchDoers();
    }, [currentPage]);

    const fetchDoers = async () => {
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

    const convertToCSV = (data: Project[]) => {
        const csvRows = [
            ['ID', 'Project Name', 'Project ID', 'State Name', 'Project Type', 'Management Contract', 'Project Incharge', 'Project Coordinator', 'Completion Status', 'Name of Work'],
            ...data.map(project => [
                project.id,
                project.projectName,
                project.projectID,
                project.stateId,
                project.projectType,
                project.managementContract,
                project.projectIncharge,
                project.projectCoordinator,
                project.completionStatus,
                project.nameOfWork
            ])
        ];
        return csvRows.map(row => row.join(',')).join('\n');
    };


    const downloadCSV = () => {
        const csvData = convertToCSV(project);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'Projects.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleSearchcurrent = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const filteredDoers = project.filter(doer =>
        doer.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doer.projectID.toLowerCase().includes(searchQuery.toLowerCase())
    );


    const handleShowview = () => setShowView(true);


    const handleViewEdit = (projectName: string) => {
        handleShowview();
        setManageID(projectName)

    };

    return (
        <>
            <div className="container">
                <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center">
                    <span><i className="ri-file-list-line me-2 text-dark fs-16"></i><span className='fw-bold text-dark fs-15'>Project List</span></span>
                    <div className="d-flex justify-content-end  ">
                       
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

                    </div>
                </div>


                {loading ? (
                    <div className='loader-container'>
                        <div className="loader"></div>
                        <div className='mt-2'>Please Wait!</div>
                    </div>
                ) : (
                    <>
                        <div className='bg-white p-2 pb-2'>
                            <Form onSubmit={handleSearch}>
                                <Row>

                                    <Col lg={6} className="">
                                        <Form.Group controlId="searchProjectName">
                                            <Form.Label>Project Name:</Form.Label>
                                            <Select
                                                name="searchProjectName"
                                                value={projectList.find(item => item.projectName === searchProjectName) || null} // handle null
                                                onChange={(selectedOption) => setSearchProjectName(selectedOption ? selectedOption.projectName : "")} // null check
                                                options={projectList}
                                                getOptionLabel={(item) => item.projectName}
                                                getOptionValue={(item) => item.projectName}
                                                isSearchable={true}
                                                placeholder="Search..."
                                                className="h45"
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col lg={6}>
                                        <Form.Group controlId="searchProjectIncharge">
                                            <Form.Label>Project Incharge:</Form.Label>
                                            <Select
                                                name="searchProjectIncharge"
                                                value={employeeList.find(emp => emp.empId === searchProjectInchage) || null} // handle null
                                                onChange={(selectedOption) => setSearchProjectInchage(selectedOption ? selectedOption.empId : "")} // null check
                                                options={employeeList}
                                                getOptionLabel={(emp) => emp.employeeName}
                                                getOptionValue={(emp) => emp.empId}
                                                isSearchable={true}
                                                placeholder="Search..."
                                                className="h45"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col lg={6} className="mt-2">
                                        <Form.Group controlId="searchProjectCoordinator">
                                            <Form.Label>Project Coordinator:</Form.Label>
                                            <Select
                                                name="searchProjectCoordinator"
                                                value={employeeList.find(emp => emp.empId === searchProjectCoordinator) || null} // handle null
                                                onChange={(selectedOption) => setSearchProjectCoordinator(selectedOption ? selectedOption.empId : "")} // null check
                                                options={employeeList}
                                                getOptionLabel={(emp) => emp.employeeName}
                                                getOptionValue={(emp) => emp.empId}
                                                isSearchable={true}
                                                placeholder="Search..."
                                                className="h45"
                                            />
                                        </Form.Group>
                                    </Col>



                                    <Col lg={6} className="mt-2">
                                        <Form.Group controlId="searchCompletionStatus">
                                            <Form.Label>Completion Status:</Form.Label>
                                            <Select
                                                name="searchCompletionStatus"
                                                value={completionStatus.find(task => task.id === searchCompletionStatus) } 
                                                onChange={(selectedOption) => setSearchCompletionStatus(selectedOption ? selectedOption.id : 0)} 
                                                options={completionStatus}
                                                getOptionLabel={(task) => task.id == 1 ? "Ongoing" : 'Completed'}
                                                getOptionValue={(task) => task.id == 1 ? "Ongoing" : 'Completed'}
                                                isSearchable={true}
                                                placeholder="Search..."
                                                className="h45"
                                            />
                                        </Form.Group>
                                    </Col>



                                 

                                 
                                    <Col lg={8} className="mt-2"></Col>

                                    <Col lg={4} className="align-items-end d-flex justify-content-end mt-3">
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
                                        <form>
                                            <div className="input-group px300 ">
                                                <input
                                                    type="search"
                                                    className=" bg-white"
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
                        <div className="overflow-auto text-nowrap ">
                            {!filteredDoers ? (
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
                                                                            {column.id === 'nameOfWork' && (<i className="ri-pencil-ruler-2-line"></i>)}


                                                                            &nbsp; {column.label}
                                                                        </div>
                                                                    </th>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                        {provided.placeholder}
                                                        <th>Sub Project</th>
                                                        <th>Action</th>
                                                    </tr>
                                                )}
                                            </Droppable>
                                        </thead>
                                        <tbody>
                                            {filteredDoers.length > 0 ? (
                                                filteredDoers.slice(0, 10).map((item, index) => (
                                                    <tr key={item.id}>
                                                        <td>{(currentPage - 1) * 10 + index + 1}</td>
                                                        {columns.filter(col => col.visible).map((col) => (
                                                            <td key={col.id}
                                                            // className={
                                                            //     // Add class based on column id
                                                            //     col.id === 'empID' ? 'fw-bold fs-13 text-dark' :''
                                                            // }
                                                            >
                                                                <div>{item[col.id as keyof Project]}</div>
                                                            </td>
                                                        ))}
                                                        {/* Action Button */}
                                                        <td><Button variant='primary' className='px-3 text-white' onClick={() => handleViewEdit(item.projectName)}>  <i className="ri-eye-line fs-4"></i></Button></td>
                                                        <td><Link to={`/pages/ProjectMasterinsert/${item.id}`}>
                                                            <Button variant='primary' className='p-0 text-white'>
                                                                <i className='btn ri-edit-line text-white' ></i>
                                                            </Button>
                                                        </Link>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={columns.length + 1}>No data available</td>
                                                </tr>
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


            </div>

        </>
    );
};

export default ProjectMaster;