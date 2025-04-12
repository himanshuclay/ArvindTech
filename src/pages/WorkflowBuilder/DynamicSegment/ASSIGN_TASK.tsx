import { useState, forwardRef, useImperativeHandle } from "react";
import { Col, Form, Row } from "react-bootstrap";
import Select, { SingleValue } from 'react-select';

// Define types for the state
interface AssignTask {
    Task: string;
    taskName: string;
}

const YES_NO_OPTIONS = [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" }
];

const ASSIGN_TASK = forwardRef((props: any, ref) => {
    // Use blockValue as the main state variable
    const [blockValue, setBlockValue] = useState<AssignTask>({
        Task: '',
        taskName: '',
    });

    // Handle Select Changes dynamically
    const handleSelectChange = (
        selectedOption: SingleValue<{ label: string; value: string }>,
        fieldName: keyof AssignTask
    ) => {
        setBlockValue(prev => ({
            ...prev,
            [fieldName]: selectedOption ? selectedOption.value : '',
        }));
    };

    // Handle Input Change dynamically
    const handleInputChange = (key: keyof AssignTask, value: string) => {
        setBlockValue(prevState => ({
            ...prevState,
            [key]: value,
        }));
    };

    // Expose blockValue to parent component via useImperativeHandle
    useImperativeHandle(ref, () => ({
        ASSIGN_TASK: () => blockValue
    }));

    return (
        <div>
            <Row>
                {/* Task Select Input */}
                <Col lg={4}>
                    <Form.Group controlId="Task">
                        <Form.Label>Task</Form.Label>
                        <Select
                            options={YES_NO_OPTIONS}
                            value={YES_NO_OPTIONS.find(option => option.value === blockValue.Task)}
                            onChange={(selectedOption) => handleSelectChange(selectedOption, "Task")}
                            placeholder="Select Yes or No"
                        />
                    </Form.Group>
                </Col>

                {/* Task Name Input */}
                <Col lg={4}>
                    <Form.Group controlId="taskName">
                        <Form.Label>Task Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={blockValue.taskName}
                            onChange={(e) => handleInputChange("taskName", e.target.value)}
                            placeholder="Enter Task Name"
                        />
                    </Form.Group>
                </Col>
            </Row>
        </div>
    );
});

export default ASSIGN_TASK;
