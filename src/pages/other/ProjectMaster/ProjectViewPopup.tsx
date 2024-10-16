import { Row, Col, Container, Alert, Modal, Button, Pagination, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from "axios";
import config from "@/config";
import { useEffect, useState, } from "react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface ProcessCanvasProps {
    showView: boolean;
    setShowView: (show: boolean) => void;
    id: any;
}

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


const ProjectViewPopup: React.FC<ProcessCanvasProps> = ({ showView, setShowView, id }) => {


    const [loading, setLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [project, setProject] = useState<Project[]>([]);
    const [totalPages, setTotalPages] = useState(1);



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


    const handleClose = () => {
        setShowView(false);
    };


    return (
        <div>
            <Modal className="" show={showView} onHide={handleClose} size='xl'>
                <Modal.Header closeButton>
                    <Modal.Title className="text-dark">View Sub Project</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    {loading ? (
                        <div className='loader-container'>
                            <div className="loader"></div>
                            <div className='mt-2'>Please Wait!</div>
                        </div>
                    ) : (
                        <>
                            {!project ? (
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
                                <div className="overflow-auto text-nowrap">

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
                                                                                {column.id === 'inputValue' && (<i className="ri-keyboard-line"></i>)}
                                                                                {column.id === 'taskID' && (<i className="ri-settings-2-fill"></i>)}
                                                                                {column.id === 'doerRole' && (<i className="ri-user-settings-fill"></i>)}
                                                                                {column.id === 'empName' && (<i className="ri-user-fill"></i>)}
                                                                                {column.id === 'identifier' && (<i className="ri-price-tag-3-fill"></i>)}
                                                                                {column.id === 'input' && (<i className="ri-pencil-fill"></i>)}
                                                                                {column.id === 'empID' && (<i className="ri-user-follow-fill"></i>)}
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
                                                {project.length > 0 ? (
                                                    project.slice(0, 10).map((item, index) => (
                                                        <tr key={item.id}>
                                                            <td>{(currentPage - 1) * 10 + index + 1}</td>
                                                            {columns.filter(col => col.visible).map((col) => (
                                                                <td key={col.id}>
                                                                    <div>{item[col.id as keyof Project]}</div>
                                                                </td>
                                                            ))}
                                                            <td><Link to={`/pages/ProjectSubmasterinsert/${item.id}`}>
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
                                </div>


                            )}

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
                    <Link to={`/pages/ProjectSubmasterinsert`}>
                        <Button variant='primary' className='p-1 text-white'>
                            Edit
                        </Button>
                    </Link>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ProjectViewPopup;
