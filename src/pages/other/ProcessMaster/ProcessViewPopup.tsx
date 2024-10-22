import { Offcanvas, Row, Col, Card, Container, Alert } from 'react-bootstrap';

import axios from "axios";
import config from "@/config";
import { useEffect, useState, useRef } from "react";
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';
import { format } from 'date-fns'; // For date formatting

interface ProcessCanvasProps {
    showView: boolean;
    setShowView: (show: boolean) => void;
    id: any; // Ensure this is defined as a string
}




interface ProjectAssignListWithDoer {
    id: number;
    task_Name: string;
    task_Number: string;
    processName: string;
    moduleID: string;
    problem_Solver: string;
    roleName: string;
    createdDate: any;



}
const ProcessViewPopup: React.FC<ProcessCanvasProps> = ({ showView, setShowView, id }) => {

    const targetRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const [popoverIndex, setPopoverIndex] = useState<number | null>(null);
    const [moduleName, setModuleName] = useState<string>("");
    const [processId, setProcessId] = useState<string>("");
    const [preData, setPreData] = useState<ProjectAssignListWithDoer[]>([]);
    const [loading, setLoading] = useState<boolean>(false);




    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                await fetchModuleById(id);
            }
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        if (showView && moduleName && processId) {
            const fetchProject = async () => {
                await GetProcessTaskByIds(moduleName, processId);
            };
            fetchProject();
        }
    }, [showView, moduleName, processId]);


    const fetchModuleById = async (id: string) => {
        setLoading(true);
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/ProcessMaster/GetProcess`, {
                params: { id: id }
            });
            if (response.data.isSuccess) {
                const fetchedModule = response.data.processMasterList[0];
                setProcessId(fetchedModule.processID);
                setModuleName(fetchedModule.moduleName);

            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching module:', error);
        }
        finally {
            setLoading(false); // End loading
        }
    };

    const GetProcessTaskByIds = async (moduleName: string, processId: string) => {
        try {
            const response = await axios.get(`${config.API_URL_ACCOUNT}/ProcessTaskMaster/GetProcessTaskByIds`, {
                params: { Flag: 3, ModuleID: moduleName, ProcessID: processId }
            });
            if (response.data.isSuccess) {
                const fetchedProject = response.data.getProcessTaskByIds;
                setPreData(fetchedProject);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching project:', error);
        }
    };



    const handleClose = () => {
        setShowView(false);
    };


    return (
        <div>
            <Offcanvas className="" show={showView} placement="end" onHide={handleClose}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title className="text-dark">View Projects</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>

                    {loading ? (
                        <div className='loader-container'>
                            <div className="loader"></div>
                            <div className='mt-2'>Please Wait!</div>
                        </div>
                    ) : (
                        <>
                            {preData.length > 0 ? preData.map((task, index) => (
                                <div key={index}>
                                    <span className='fs-15 information-btn '
                                        ref={(el) => (targetRefs.current[index] = el)}
                                        onClick={() => setPopoverIndex(popoverIndex === index ? null : index)}
                                    >
                                        <h5 className="mt-2 border border-primary rounded-1 p-2 d-flex justify-content-between cursor-pointer">

                                            <span>
                                                <span className='fs-4 fw-bold text-primary'> Task Id : </span> <span className="text-primary fs-13 fw-500"> {task.task_Number}</span> &nbsp;&nbsp;&nbsp;
                                            </span>

                                            <i className="ri-eye-line fs-4"></i>

                                        </h5>
                                    </span>
                                    <div>
                                        <Overlay
                                            target={targetRefs.current[index]}
                                            show={popoverIndex === index}
                                            placement="left"
                                        >
                                            {(props) => (
                                                <Tooltip id="overlay-example" {...props} className='tooltip-position'>
                                                    <Card className="m-2 pop-card">
                                                        <Row>
                                                            <Card.Body className='text-left text-primary'>
                                                                <table>
                                                                    <tbody>
                                                                        <h4 className=''>Task</h4>
                                                                        <tr>
                                                                            <td><strong>Task ID :</strong></td>
                                                                            <td>{task.task_Number}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td><strong>Title :</strong></td>
                                                                            <td>{task.task_Name}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td><strong>Process :</strong></td>
                                                                            <td>{task.processName}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td><strong>Module :</strong></td>
                                                                            <td>{task.moduleID}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td><strong>Created Date :</strong></td>
                                                                            <td>{format(new Date(task.createdDate), 'MMM dd, yyyy HH:mm')}</td>
                                                                        </tr>

                                                                        <h4 className='text-primary mt-2'>Problem Solver</h4>
                                                                        <tr>
                                                                            <td><strong>Name :</strong></td>
                                                                            <td>{task.problem_Solver.split('_')[0]}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td><strong>Role :</strong></td>
                                                                            <td>{task.roleName}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td><strong>Emp ID :</strong></td>
                                                                            <td>{task.problem_Solver.split('_')[1]}</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </Card.Body>
                                                        </Row>
                                                    </Card>
                                                </Tooltip>
                                            )}
                                        </Overlay>

                                    </div>
                                </div>
                            )) : <Container className="mt-5">
                                <Row className="justify-content-center">
                                    <Col xs={12} md={8} lg={10}>
                                        <Alert variant="info" className="text-center">
                                            <h4>No Project Found</h4>
                                            <p>You currently don't have Assigned Project</p>
                                        </Alert>
                                    </Col>
                                </Row>
                            </Container>

                            }
                        </>
                    )}
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
};

export default ProcessViewPopup;
