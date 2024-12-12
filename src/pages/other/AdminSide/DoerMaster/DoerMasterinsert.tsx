import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import config from '@/config';
import Select from 'react-select';

const YourComponent = () => {
    const [identifierList, setIdentifierList] = useState<any[]>([]);
    const [selectedIdentifierOne, setSelectedIdentifierOne] = useState<any>('');
    const [selectedIdentifierTwo, setSelectedIdentifierTwo] = useState<any>('');
    const [taskList, setTaskList] = useState<any[]>([]);
    const [selectedTask, setSelectedTask] = useState<string | null>(null);
    const [doerMasterList, setDoerMasterList] = useState<any[]>([]);

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

    const fetchDoerMasterList = async () => {
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/DoerMaster/GetDoerByIdentifier?PageIndex=1`);
            if (response.data.isSuccess) {
                setDoerMasterList(response.data.getDoerByIdentifiers);
                console.log(doerMasterList) // Update to match the new response structure
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching doer master list:', error);
        }
    };


    // Call fetchDoerMasterList on component mount
    useEffect(() => {
        fetchDoerMasterList();
    }, []);

    const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        const requestData = {
            TaskID: selectedTask,
            Identifier: selectedIdentifierOne,
            Identifier1: selectedIdentifierTwo
        };

        console.log(requestData);

        try {
            const response = await axios.post(`${config.API_URL_APPLICATION}/DoerMaster/InsertDoerByIdentifier`, requestData);

            if (response.data.isSuccess) {
                console.log('Data submitted successfully', response.data);
                // fetchDoerMasterList(); // Refresh table data
                console.log(doerMasterList)
            } else {
                console.error('Error:', response.data.message);
            }
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };

    const handleIdentifierChange = (selectedOption: any, identifier: string) => {
        if (identifier === 'identifierOne') {
            setSelectedIdentifierOne(selectedOption ? selectedOption.label : '');
        } else {
            setSelectedIdentifierTwo(selectedOption ? selectedOption.label : '');
        }
    };

    const handleTaskChange = (selectedOption: { value: string; label: string } | null) => {
        if (selectedOption) {
            setSelectedTask(selectedOption.label);
        } else {
            setSelectedTask(null);
        }
    };


    return (
        <div>
            <div className="d-flex p-2 bg-white mt-2 mb-2 rounded shadow"><h5 className="mb-0">Task's Identifier Combinations</h5></div>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group controlId="taskSelection">
                            <Form.Label>Task</Form.Label>
                            <Select
                                options={taskList.map((item) => ({
                                    value: item.id,
                                    label: item.taskID
                                }))}
                                value={selectedTask
                                    ? { value: selectedTask, label: taskList.find(item => item.taskID === selectedTask)?.taskID }
                                    : null}
                                onChange={(selectedOption) => handleTaskChange(selectedOption)}
                                placeholder="Select Task"
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="identifierOne">
                            <Form.Label>Identifier One</Form.Label>
                            <Select
                                options={identifierList.map((item) => ({
                                    value: item.id,
                                    label: item.identifier
                                }))}
                                value={selectedIdentifierOne
                                    ? { value: selectedIdentifierOne, label: identifierList.find(item => item.identifier === selectedIdentifierOne)?.identifier }
                                    : null}
                                onChange={(selectedOption) => handleIdentifierChange(selectedOption, 'identifierOne')}
                                placeholder="Select Identifier One"
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="identifierTwo">
                            <Form.Label>Identifier Two</Form.Label>
                            <Select
                                options={[
                                    { value: null, label: 'Not Applied' },
                                    ...identifierList.map((item) => ({
                                        value: item.id,
                                        label: item.identifier
                                    }))
                                ]}
                                value={selectedIdentifierTwo
                                    ? { value: selectedIdentifierTwo, label: identifierList.find(item => item.identifier === selectedIdentifierTwo)?.identifier }
                                    : null}
                                onChange={(selectedOption) => handleIdentifierChange(selectedOption, 'identifierTwo')}
                                placeholder="Select Identifier Two"
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Button className="mt-3" variant="primary" type="submit">
                    Submit
                </Button>
            </Form>

            {/* Table to display DoerMaster list */}
            <div className="mt-4">
                <h5>Task Identifier Combinations</h5>
                <Table hover className="bg-white">
                    <thead>
                        <tr>
                            <th>Task Name</th>
                            <th>Identifier</th>
                            <th>Identifier 1</th>
                        </tr>
                    </thead>
                    <tbody>
                        {doerMasterList.map((item, index) => (
                            <tr key={index}>
                                <td>{item.taskID}</td>
                                <td>{item.identifier}</td>
                                <td>{item.identifier1}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>



        </div>
    );
};

export default YourComponent;
