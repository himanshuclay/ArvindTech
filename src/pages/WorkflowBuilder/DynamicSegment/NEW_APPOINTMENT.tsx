import { useState } from "react";
import { Col, Form, Row, Button } from "react-bootstrap";

interface Candidate {
    name: string;
}

interface AppointmentState {
    updateInterviewedCandidates: Candidate[];
}

const NEW_APPOINTMENT = () => {
    const [newAppointment, setNewAppointment] = useState<AppointmentState>({
        updateInterviewedCandidates: [],
    });

    // Function to add a new candidate
    const handleAddUpdateInterviewedCandidates = () => {
        setNewAppointment(prevState => ({
            ...prevState,
            updateInterviewedCandidates: [
                ...prevState.updateInterviewedCandidates,
                { name: "" }, // Adding a new empty candidate
            ],
        }));
    };

    // Function to update candidate name
    const handleInputChange = (index: number, value: string) => {
        const updatedCandidates = [...newAppointment.updateInterviewedCandidates];
        updatedCandidates[index].name = value;
        setNewAppointment(prevState => ({
            ...prevState,
            updateInterviewedCandidates: updatedCandidates,
        }));
    };

    // Function to remove a candidate
    const handleRemoveUpdateInterviewCandidates = (index: number) => {
        setNewAppointment(prevState => ({
            ...prevState,
            updateInterviewedCandidates: prevState.updateInterviewedCandidates.filter((_, i) => i !== index),
        }));
    };

    return (
        <div>
            <Row>
                <div>
                    <p>Update Interviewed Candidates</p>
                    <Button variant="primary" onClick={handleAddUpdateInterviewedCandidates}>Add Candidate</Button>
                </div>
                <Col lg={4}>
                    <Form.Group controlId="updateInterviewedCandidates">
                        {newAppointment.updateInterviewedCandidates.map((updatedInterview, index) => (
                            <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                                <Form.Control
                                    type="text"
                                    name={`updatedInterview-${index}`}
                                    value={updatedInterview.name}
                                    onChange={(e) => handleInputChange(index, e.target.value)}
                                    placeholder="Enter Candidate Name"
                                    style={{ marginRight: "8px" }}
                                />
                                <Button 
                                    variant="danger" 
                                    size="sm" 
                                    onClick={() => handleRemoveUpdateInterviewCandidates(index)}
                                >
                                    Remove
                                </Button>
                            </div>
                        ))}
                    </Form.Group>
                </Col>
            </Row>
        </div>
    );
};

export default NEW_APPOINTMENT;
