import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import config from '@/config';
import Select from 'react-select';

const YourComponent = () => {
    const [identifierList, setIdentifierList] = useState<any[]>([]); // Adjust type as needed
    const [selectedIdentifierOne, setSelectedIdentifierOne] = useState<any>(''); // Default as empty string
    const [selectedIdentifierTwo, setSelectedIdentifierTwo] = useState<any>(''); // Default as empty string
    const [taskList, setTaskList] = useState<any[]>([]); // Task list state
    const [selectedTask, setSelectedTask] = useState<string | null>(null); // Selected task

    // Fetch identifier list and task list from API
    useEffect(() => {
        const fetchData = async (endpoint: string, setter: Function, listName: string) => {
            try {
                const response = await axios.get(`${config.API_URL_APPLICATION}/${endpoint}`);
                if (response.data.isSuccess) {
                    setter(response.data[listName]);
                } else {
                    console.error(response.data.message);
                }
            } catch (error) {
                console.error(`Error fetching data from ${endpoint}:`, error);
            }
        };
        fetchData('CommonDropdown/GetIdentifier', setIdentifierList, 'identifierList');
        fetchData('CommonDropdown/GetTaskList', setTaskList, 'taskList');
    }, []);

    // Submit the form data to the API
    const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent form from submitting traditionally

        // Prepare the data to send to the API with names instead of IDs
        const requestData = {
            Identifier1: selectedIdentifierOne, // Sending the name (selected value) instead of ID
            Identifier2: selectedIdentifierTwo, // Sending the name (selected value) instead of ID
            TaskID: selectedTask // Sending the task name
        };

        console.log(requestData)

        try {
            const response = await axios.post(`${config.API_URL_APPLICATION}/DoerMaster/InsertDoerByIdentifier`, requestData);

            if (response.data.isSuccess) {
                // Handle success response
                console.log('Data submitted successfully', response.data);
            } else {
                // Handle error response
                console.error('Error:', response.data.message);
            }
        } catch (error) {
            // Handle network error
            console.error('Error submitting data:', error);
        }
    };

    const handleIdentifierChange = (selectedOption: any, identifier: string) => {
        if (identifier === 'identifierOne') {
            setSelectedIdentifierOne(selectedOption ? selectedOption.label : ''); // Use `label` for name
        } else {
            setSelectedIdentifierTwo(selectedOption ? selectedOption.label : ''); // Use `label` for name
        }
    };

    const handleTaskChange = (selectedOption: { value: string; label: string } | null) => {
        if (selectedOption) {
            setSelectedTask(selectedOption.label); // Use `label` for task name
        } else {
            setSelectedTask(null); // Clear the selected task if none is chosen
        }
    };

    return (
        <div>
            <div className="d-flex p-2 bg-white mt-2 mb-2 rounded shadow"><h5 className="mb-0">Task's Identifier Combinations</h5></div>
            <Form onSubmit={handleSubmit}>
                <Row>
                    {/* Task Selection */}
                    <Col md={6}>
                        <Form.Group controlId="taskSelection">
                            <Form.Label>Task</Form.Label>
                            <Select
                                options={taskList.map((item) => ({
                                    value: item.id, // Use `id` as the value
                                    label: item.taskID // Use `taskID` as the label (this is the name)
                                }))}
                                value={selectedTask
                                    ? { value: selectedTask, label: taskList.find(item => item.taskID === selectedTask)?.taskID }
                                    : null} // If a task is selected, show the corresponding taskID
                                onChange={(selectedOption) => handleTaskChange(selectedOption)} // Update `selectedTask`
                                placeholder="Select Task"
                            />
                        </Form.Group>
                    </Col>

                    {/* Identifier One */}
                    <Col md={6}>
                        <Form.Group controlId="identifierOne">
                            <Form.Label>Identifier One</Form.Label>
                            <Select
                                options={identifierList.map((item) => ({
                                    value: item.id, // Use `id` as the value
                                    label: item.identifier // Use `identifier` as the label (this is the name)
                                }))}
                                value={selectedIdentifierOne
                                    ? { value: selectedIdentifierOne, label: identifierList.find(item => item.identifier === selectedIdentifierOne)?.identifier }
                                    : null} // Map the selected ID to the correct identifier name
                                onChange={(selectedOption) => handleIdentifierChange(selectedOption, 'identifierOne')}
                                placeholder="Select Identifier One"
                            />
                        </Form.Group>
                    </Col>

                    {/* Identifier Two */}
                    <Col md={6}>
                        <Form.Group controlId="identifierTwo">
                            <Form.Label>Identifier Two</Form.Label>
                            <Select
                                options={[
                                    { value: null, label: 'Not Applied' }, // Add the "Not Applied" option
                                    ...identifierList.map((item) => ({
                                        value: item.id, // Use `id` as the value
                                        label: item.identifier // Use `identifier` as the label (this is the name)
                                    }))
                                ]}
                                value={selectedIdentifierTwo
                                    ? { value: selectedIdentifierTwo, label: identifierList.find(item => item.identifier === selectedIdentifierTwo)?.identifier }
                                    : null} // Map the selected ID to the correct identifier name
                                onChange={(selectedOption) => handleIdentifierChange(selectedOption, 'identifierTwo')}
                                placeholder="Select Identifier Two"
                            />
                        </Form.Group>
                    </Col>

                </Row>

                <Button className='mt-3' variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>

    );
};

export default YourComponent;
