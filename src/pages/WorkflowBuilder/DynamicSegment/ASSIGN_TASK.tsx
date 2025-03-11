import { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import Select, { SingleValue } from 'react-select';

interface AssignTask {
    Task: string;
    taskName: string;
}

const YES_NO_OPTIONS = [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" }
];

const ASSIGN_TASK = () => {
    const [assignTask, setAssignTask] = useState<AssignTask>({
        Task: '',
        taskName: '',
    });

    // Handle Select Changes
    const handleSelectChange = (
        selectedOption: SingleValue<{ label: string; value: string }>,
        fieldName: keyof AssignTask
    ) => {
        setAssignTask(prev => ({
            ...prev,
            [fieldName]: selectedOption ? selectedOption.value : '',
        }));
    };

    // Handle Input Change
    const handleInputChange = (key: keyof AssignTask, value: string) => {
        setAssignTask(prevState => ({
            ...prevState,
            [key]: value,
        }));
    };

    return (
        <div>
            <Row>
                <Col lg={4}>
                    <Form.Group controlId="Task">
                        <Form.Label>Task</Form.Label>
                        <Select
                            options={YES_NO_OPTIONS}
                            value={YES_NO_OPTIONS.find(option => option.value === assignTask.Task)}
                            onChange={(selectedOption) => handleSelectChange(selectedOption, "Task")}
                            placeholder="Select Yes or No"
                        />
                    </Form.Group>
                </Col>
                <Col lg={4}>
                    <Form.Group controlId="TaskName">
                        <Form.Label>Task Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={assignTask.taskName}
                            onChange={(e) => handleInputChange("taskName", e.target.value)}
                            placeholder="Enter Task Name"
                        />
                    </Form.Group>
                </Col>
            </Row>
        </div>
    );
};

export default ASSIGN_TASK;
