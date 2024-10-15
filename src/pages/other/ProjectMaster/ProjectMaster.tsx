import axios from 'axios';
import { useState, useEffect, ChangeEvent } from 'react';
import { Button, Pagination, Table, Container, Row, Col, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import config from '@/config';
import ProjectViewPopup from './ProjectViewPopup';




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

const ProjectMaster = () => {
    const [project, setProject] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [showView, setShowView] = useState(false);
    const [manageId, setManageID] = useState<number>();



    // both are required to make dragable column of table 
    const [columns, setColumns] = useState<Column[]>([
        { id: 'projectName', label: 'Project Name', visible: true },
        { id: 'projectID', label: 'Project ID', visible: true },
        { id: 'stateId', label: 'State Name', visible: true },
        { id: 'projectType', label: 'Project Type', visible: true },
        { id: 'managementContract', label: 'Management Contract', visible: true },
        { id: 'projectIncharge', label: 'Project Incharge', visible: true },
        { id: 'projectCoordinator', label: 'Project Coordinator', visible: true },
        { id: 'completionStatus', label: 'Completion Status', visible: true },
        { id: 'nameOfWork', label: 'Name of Work', visible: true }
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

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const filteredDoers = project.filter(doer =>
        doer.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doer.projectID.toLowerCase().includes(searchQuery.toLowerCase())
    );


    const handleShowview = () => setShowView(true);


    const handleViewEdit = (id: any) => {
        handleShowview();
        setManageID(id)

    };

    return (
        <>
            <div className="container">
                <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center">
                    <span><i className="ri-file-list-line me-2 text-dark fs-16"></i><span className='fw-bold text-dark fs-15'>Project List</span></span>
                    <div className="d-flex justify-content-end  ">
                        <div className="app-search d-none d-lg-block me-4">
                            <form>
                                <div className="input-group px300 ">
                                    <input
                                        type="search"
                                        className=" "
                                        placeholder="Search Project..."
                                        value={searchQuery}
                                        onChange={handleSearch}
                                    />
                                    <span className="ri-search-line search-icon text-muted" />
                                </div>
                            </form>
                        </div>
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
                        <Button variant="primary" onClick={downloadCSV} className="me-2">
                            Download CSV
                        </Button>
                    </div>
                </div>


                {loading ? (
                    <div className='loader-container'>
                        <div className="loader"></div>
                        <div className='mt-2'>Please Wait!</div>
                    </div>
                ) : (

                    <div className="overflow-auto text-nowrap">
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
                                <Table hover className='bg-white '>
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
                                                                        {column.id === 'stateId' && (<i className="ri-map-pin-line"></i>)}
                                                                        {column.id === 'projectType' && (<i className="ri-treasure-map-line"></i>)}
                                                                        {column.id === 'managementContract' && (<i className="ri-briefcase-line"></i>)}
                                                                        {column.id === 'projectIncharge' && (<i className="ri-user-settings-line"></i>)}
                                                                        {column.id === 'projectCoordinator' && (<i className="ri-group-line"></i>)}
                                                                        {column.id === 'completionStatus' && (<i className="ri-check-line"></i>)}
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
                                                    <td><Button variant='primary' className='px-3 text-white' onClick={() => handleViewEdit(item.id)}>  <i className="ri-eye-line fs-4"></i></Button></td>
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


                <ProjectViewPopup showView={showView} setShowView={setShowView} id={manageId} />


            </div>

        </>
    );
};

export default ProjectMaster;