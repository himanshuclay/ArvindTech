import { Offcanvas, Row, Col, Card, Container, Alert } from 'react-bootstrap';
import axios from "axios";
import config from "@/config";
import { useEffect, useState } from "react";

interface ProcessCanvasProps {
    showView: boolean;
    setShowView: (show: boolean) => void;
    id: any; // Ensure this is defined as a string
}




interface HeirarchyViewData {
    id: number;
    taskName: string;
    task_Number: string;
    doerName: string;
    problem_Solver: string;
    planDate: string;
    roleName: string;
    doerNumber: string;
    isCompleted: string;
    createdDate: any;
}

interface ApiResponse {
    isSuccess: boolean;
    message: string;
    getFilterTasks: HeirarchyViewData[];
}

const HeirarchyView: React.FC<ProcessCanvasProps> = ({ showView, setShowView, id }) => {

    const [preData, setPreData] = useState<HeirarchyViewData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);




    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                await fetchPreData(id);
            }
        };
        fetchData();
    }, [id]);


    console.log(id)

    const fetchPreData = async (taskCommonId: number) => {
        try {
            const flag = 5;
            const response = await axios.get<ApiResponse>(
                `${config.API_URL_ACCOUNT}/ProcessInitiation/GetFilterTask?TaskCommonId=${taskCommonId}&Flag=${flag}`
            );

            if (response.data && response.data.isSuccess) {
                const fetchedData = response.data.getFilterTasks || [];
                setPreData(fetchedData)

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



    const handleClose = () => {
        setShowView(false);
    };


    return (
        <div>
            <Offcanvas className="" show={showView} placement="end" onHide={handleClose}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title className="text-dark">View Tasks</Offcanvas.Title>
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
                                    {task.doerName}
                                    {task.taskName}
                                    {task.planDate}
                                    {task.doerNumber}
                                    {task.isCompleted}
                                    {task.task_Number}

                                </div>
                            )) : <Container className="mt-5">
                                <Row className="justify-content-center">
                                    <Col xs={12} md={8} lg={10}>
                                        <Alert variant="info" className="text-center">
                                            <h4>No Data Found</h4>
                                            <p>You currently don't have any Data</p>
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

export default HeirarchyView;
