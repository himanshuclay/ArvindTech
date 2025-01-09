import { Row, Col, Container, Alert, Modal } from 'react-bootstrap';
import MessCards from '../Previous&Completed';

interface ProcessCanvasProps {
    showViewOutput: boolean;
    setShowViewOutput: (show: boolean) => void;
    preData: any; // Ensure this is defined as a string
}


const ViewOutput: React.FC<ProcessCanvasProps> = ({ showViewOutput, setShowViewOutput, preData }) => {

    const handleClose = () => {
        setShowViewOutput(false);
    };

    return (
        <div>
            <Modal size='xl' show={showViewOutput} placement="end" onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title className="text-dark"> Tasks Output</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {preData.length < 0 ? (
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
                        <MessCards data={preData} />
                    )}
                </Modal.Body>

            </Modal>
        </div>
    );
};

export default ViewOutput;
