import { Offcanvas, } from 'react-bootstrap';
// import axios from "axios";
// import config from "@/config";
import { useEffect, useMemo } from "react";
// import { getPlannedDate } from '../PlanDateFunction';
import ReactFlow, { Background, Controls, MiniMap, useEdgesState, useNodesState } from 'reactflow';
import CustomNode from '@/pages/WorkflowBuilder/CustomNode';


interface ProcessCanvasProps {
    showView: boolean;
    setShowView: (show: boolean) => void;
    id: any; // Ensure this is defined as a string
    hierarchyView?: any;
}




// interface HeirarchyViewData {
//     id: number;
//     taskName: string;
//     task_Number: string;
//     doerName: string;
//     problem_Solver: string;
//     planDate: string;
//     roleName: string;
//     doerNumber: string;
//     isCompleted: string;
//     createdDate: any;
// }

// interface ApiResponse {
//     isSuccess: boolean;
//     message: string;
//     getFilterTasks: HeirarchyViewData[];
// }

const HeirarchyView: React.FC<ProcessCanvasProps> = ({ showView, setShowView, id, hierarchyView }) => {

    // const [preData, setPreData] = useState<HeirarchyViewData[]>([]);
    // const [loading, setLoading] = useState<boolean>(false);
    const [nodes, setNodes] = useNodesState([]);
    const [edges, setEdges] = useEdgesState([]);

    const nodeTypes = useMemo(() => ({
        custom: (props: any) => <CustomNode {...props} setNodes={setNodes} edges={edges} isCompleteTask={true} isRest={false} />,
    }), [setNodes, edges]);  // ✅ Include edges in dependencies

    useEffect(() => {
        if (hierarchyView && hierarchyView.templateJson) {
            const templateJson = JSON.parse(hierarchyView.templateJson);
            console.log(templateJson)
            setNodes(templateJson.nodes);
            setEdges(templateJson.edges);
        }
    }, [hierarchyView]);

    // const fetchPreData = async (taskCommonId: number) => {
    //     try {
    //         const flag = 5;
    //         const response = await axios.get<ApiResponse>(
    //             `${config.API_URL_ACCOUNT}/ProcessInitiation/GetFilterTask?TaskCommonId=${taskCommonId}&Flag=${flag}`
    //         );

    //         if (response.data && response.data.isSuccess) {
    //             const fetchedData = response.data.getFilterTasks || [];
    //             setPreData(fetchedData)

    //         } else {
    //             console.error('API Response Error:', response.data?.message || 'Unknown error');
    //         }
    //     } catch (error) {
    //         if (axios.isAxiosError(error)) {
    //             console.error('Axios Error:', error.message);
    //         } else {
    //             console.error('Unexpected Error:', error);
    //         }
    //     } finally {
    //         setLoading(false);
    //     }
    // };



    const handleClose = () => {
        setShowView(false);
    };


    // function calculatePlannedDate(createdDate: string): string {
    //     const parsedDate = new Date(createdDate);
    //     if (isNaN(parsedDate.getTime())) {
    //         console.error('Invalid date format');
    //         return ''; // Return an empty string if the date is invalid
    //     }
    //     const plannedDate = new Date(parsedDate.getTime() + 88 * 60 * 60 * 1000);
    //     const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    //     const month = months[plannedDate.getMonth()];
    //     const day = String(plannedDate.getDate()).padStart(2, '0');
    //     const year = plannedDate.getFullYear();
    //     const hours = String(plannedDate.getHours()).padStart(2, '0');
    //     const minutes = String(plannedDate.getMinutes()).padStart(2, '0');
    //     return `${day}-${month}-${year} ${hours}:${minutes}`;
    // }


    // console.log(preData)

    return (
        <div>
            <Offcanvas className="w-50" show={showView} placement="end" onHide={handleClose}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title className="text-dark"> Tasks History</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {/* {loading ? (
                        <div className="loader-container d-flex flex-column align-tasks-center justify-content-center">
                            <div className="loader"></div>
                            <div className="mt-3 text-muted">Please Wait...</div>
                        </div>
                    ) : (
                        <>
                            {preData.length > 0 ? (
                                <Row>
                                    {preData.map((task, index) => (
                                        <Col lg={12} className="task-card p-3 border rounded shadow-sm">
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td className='text-nowrap'><h5>Task Number :</h5></td>
                                                        <td> <h5 className='text-primary'>{task.task_Number}</h5></td>
                                                    </tr>
                                                    <tr>
                                                        <td className='text-nowrap'><h5>Task Name :</h5></td>
                                                        <td> <h5 className='text-primary'>{task.taskName}</h5></td>
                                                    </tr>
                                                    <tr>
                                                        <td className='text-nowrap'><h5>Doer :</h5></td>
                                                        <td>  <h5 className='text-primary'> {task.doerName}</h5>
                                                            {task.doerNumber ?
                                                                <p className=' fw-normal m-0'><a href={`tel:${task.doerNumber}`}>
                                                                    <i className="ri-phone-fill"></i> {task.doerNumber}</a></p> : ""
                                                            }
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className='text-nowrap'><h5>Plan Date :</h5></td>
                                                        <td> <h5 className='text-primary'>
                                                            {/* {task.task_Number.split(".")[2] === "T1" && (
                                                                    calculatePlannedDate(task.createdDate)
                                                                ) : (
                                                                )}
                                                            {getPlannedDate(task.createdDate, task.planDate)}
                                                        </h5></td>
                                                    </tr>
                                                    <tr>
                                                        <td className='text-nowrap'><h5>Status :</h5></td>
                                                        <td> <h5 className='text-primary'>{task.isCompleted}</h5></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </Col>
                                    ))}
                                </Row>
                            ) : ( */}
                                <div className='col-12' style={{ height: 'calc(100vh - 200px)', position: 'relative' }}>
                                    {/* {JSON.stringify(nodes)} */}
                                    <ReactFlow
                                        nodes={nodes}
                                        edges={edges}
                                        // onNodesChange={handleNodesChange}
                                        // onEdgesChange={onEdgesChange}
                                        // onConnect={onConnect}
                                        nodeTypes={nodeTypes}
                                        fitView
                                        // onDrop={handleDrop}
                                        // onDragOver={handleDragOver}
                                        // onEdgeClick={handleEdgeClick}
                                        // onNodeClick={onNodeClick}
                                    >
                                        <MiniMap />
                                        <Controls />
                                        <Background />
                                    </ReactFlow>
                                </div>
                            {/* )}
                        </>
                    )} */}
                </Offcanvas.Body>

            </Offcanvas>
        </div>
    );
};

export default HeirarchyView;
