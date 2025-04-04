import { Row, Col, Container, Alert, Modal, Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from "axios";
import config from "@/config";
import { useEffect, useState, } from "react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface ProcessCanvasProps {
    showView: boolean;
    setShowView: (show: boolean) => void;
    projectName: string;
}

interface Project {
    id: number;
    projectName: string;
    projectID: string;
    stateId: number;
    status: string;
    projectType: number;
    managementContract: number;
    projectIncharge: number;
    projectInchargeName: string;
    projectCoordinatorName: number;
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


const ProjectViewPopup: React.FC<ProcessCanvasProps> = ({ showView, setShowView, projectName }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [subProject, setSubProject] = useState<Project[]>([]);
    const role = localStorage.getItem('role');


    const [columns, setColumns] = useState<Column[]>([
        { id: 'subProjectID', label: 'Sub Project ID', visible: true },
        { id: 'subProjectName', label: 'Sub Project Name', visible: true },
        { id: 'state', label: 'State Name', visible: true },
        { id: 'projectTypeName', label: 'Project Type ', visible: true },
        { id: 'managementContractName', label: 'Management Contract ', visible: true },
        { id: 'projectInchargeName', label: 'Project Incharge', visible: true },
        { id: 'projectCoordinatorName', label: 'Project Coordinator', visible: true },
        { id: 'completionStatusName', label: 'Completion Status', visible: true },
        { id: 'status', label: 'Sub Project Status', visible: true },
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
        const fetchSubProjects = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${config.API_URL_APPLICATION}/SubProjectMaster/GetSubProject`, {
                    params: { ProjectName: projectName }
                });

                if (response.data.isSuccess) {
                    setSubProject(response.data.subProjects);
                } else {
                    console.error(response.data.message);
                }
            } catch (error) {
                console.error('Error fetching sub-projects:', error);
            } finally {
                setLoading(false);
            }
        };

        if (projectName) {
            fetchSubProjects();
        }
    }, [projectName]);

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
                            {!subProject ? (
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
                                                {subProject.length > 0 ? (
                                                    subProject.map((item, index) => (
                                                        <tr key={item.id}>
                                                            <td>{index + 1}</td>
                                                            {columns.filter(col => col.visible).map((col) => (

                                                                <td key={col.id}
                                                                    className={
                                                                        (col.id === 'status' && item[col.id] === "Enabled") ? 'task1' :
                                                                            (col.id === 'status' && item[col.id] === "Disabled") ? 'task4' : ''
                                                                    }>
                                                                    <div>

                                                                        {col.id === 'projectInchargeName' ? (
                                                                            <td>
                                                                                {item.projectInchargeName.split(",")
                                                                                    .map((incharge: any, index: any) => (
                                                                                        <div key={index}>{incharge.trim()}</div> // Display each on a new line
                                                                                    ))}
                                                                            </td>
                                                                        ) : (
                                                                            <td>{item[col.id as keyof Project]}</td>
                                                                        )}

                                                                    </div>
                                                                </td>
                                                            ))}
                                                            {(role === 'Admin' || role === 'DME') && (
                                                                <td><Link to={`/pages/ProjectSubmasterinsert/${item.id}`}>
                                                                    <Button variant='primary' className='p-0 text-white'>
                                                                        <i className='btn ri-edit-line text-white' ></i>
                                                                    </Button>
                                                                </Link>
                                                                </td>)}
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
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
                                                    </tr>
                                                )}
                                            </tbody>
                                        </Table>
                                    </DragDropContext>
                                </div>
                            )}
                        </>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ProjectViewPopup;
