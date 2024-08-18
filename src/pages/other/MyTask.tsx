import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Accordion, Card, Col, Row } from 'react-bootstrap'
import { PageBreadcrumb } from '@/components'
import { FileUploader } from '@/components/FileUploader'








const DynamicForm = ({ formData }) => {
    const [formState, setFormState] = useState({});

    // Initialize form state
    useEffect(() => {
        const initialState = {};
        formData.inputs.forEach(input => {
            initialState[input.inputId] = input.value || '';
        });
        setFormState(initialState);
    }, [formData]);

    const handleChange = (inputId, value) => {
        setFormState(prevState => ({
            ...prevState,
            [inputId]: value
        }));
    };




    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission, e.g., send formState to an API
        console.log('Form submitted:', formState);
    };

    return (
        <>
            <Row>
                <Col xl={6}>
                    <Card>

                        <Card.Body>
                            <Accordion defaultActiveKey="0">


                                {/* <form onSubmit={handleSubmit}> */}
                                <form >
                                    <Accordion.Item eventKey="3">
                                        <Accordion.Header as="h2" ><b>Task Name</b>&nbsp;- {formData.formName}</Accordion.Header>
                                        <Accordion.Body className='my-task'>

                                            {formData.inputs.map(input => (
                                                <div className='m-3 form-group' key={input.inputId} style={{ marginBottom: '1rem' }}>
                                                    <label>{input.label}</label>
                                                    {input.type === 'text' && (
                                                        <input
                                                            type="text"
                                                            className='form-control'
                                                            placeholder={input.placeholder}
                                                            value={formState[input.inputId]}
                                                            onChange={e => handleChange(input.inputId, e.target.value)}
                                                            style={{ display: 'block', width: '100%', padding: '0.5rem', border: '2px solid' }}
                                                        />
                                                    )}
                                                    {input.type === 'custom' && (
                                                        <input
                                                            type="text"
                                                            placeholder={input.placeholder}
                                                            value={formState[input.inputId]}
                                                            onChange={e => handleChange(input.inputId, e.target.value)}
                                                            style={{ display: 'block', width: '100%', padding: '0.5rem' }}
                                                        />
                                                    )}
                                                    {input.type === 'select' && (
                                                        <select
                                                            value={formState[input.inputId]}
                                                            onChange={e => handleChange(input.inputId, e.target.value)}
                                                            style={{ display: 'block', width: '100%', padding: '0.5rem' }}

                                                        >
                                                            <option value="" disabled>Select an option</option>
                                                            {input.options.map(option => (
                                                                <option key={option.id} value={option.label}>
                                                                    {option.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    )}
                                                    {input.type === 'multiselect' && (
                                                        <select
                                                            className='form-select form-control'
                                                            value={formState[input.inputId]}
                                                            onChange={e => handleChange(input.inputId, e.target.value)}
                                                            style={{ display: 'block', width: '100%', padding: '0.5rem' }}

                                                        >
                                                            <option value="" disabled>Select an option</option>
                                                            {input.options.map(option => (
                                                                <option key={option.id} value={option.label}>
                                                                    {option.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    )}
                                                    {input.type === 'CustomSelect' && (
                                                        <select
                                                            value={formState[input.inputId]}
                                                            onChange={e => handleChange(input.inputId, e.target.value)}
                                                            style={{ display: 'block', width: '100%', padding: '0.5rem' }}

                                                        >
                                                            <option value="" disabled>Select an option</option>
                                                            {input.options.map(option => (
                                                                <option key={option.id} value={option.label}>
                                                                    {option.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    )}
                                                    {input.type === 'file' && (
                                                        // <input
                                                        //     type="file"
                                                        //     placeholder={'file'}
                                                        //     onChange={e => handleChange(input.fileId, e.target.value)}
                                                        //     style={{ display: 'block', width: '100%', padding: '0.5rem' }}
                                                        // />
                                                        <FileUploader
                                                            icon="ri-upload-cloud-2-line"
                                                            text="Drop files here or click to upload."

                                                        />
                                                    )}

                                                    {input.type === 'checkbox' && (
                                                        <input
                                                            type="checkbox"
                                                            checked={formState[input.inputId]}
                                                            onChange={e => handleChange(input.inputId, e.target.checked)}

                                                        />
                                                    )}
                                                    {input.type === 'radio' && (
                                                        <input
                                                            type="radio"
                                                            checked={formState[input.inputId]}
                                                            onChange={e => handleChange(input.inputId, e.target.checked)}
                                                        />
                                                    )}
                                                    {input.type === 'status' && (
                                                        <input
                                                            type="text"
                                                            checked={formState[input.inputId]}
                                                            onChange={e => handleChange(input.inputId, e.target.checked)}
                                                        />
                                                    )}
                                                    {input.type === 'successorTask' && (
                                                        <input
                                                            type="text"
                                                            checked={formState[input.inputId]}
                                                            onChange={e => handleChange(input.inputId, e.target.checked)}
                                                        />
                                                    )}
                                                    {input.type === 'date' && (
                                                        <input
                                                            type="date"
                                                            value={formState[input.inputId]}
                                                            onChange={e => handleChange(input.inputId, e.target.value)}
                                                            style={{ display: 'block', width: '100%', padding: '0.5rem' }}

                                                        />
                                                    )}
                                                </div>
                                            ))}


                                            <div className="col-12 d-flex justify-content-end">
                                                <button className='btn btn-primary' type="submit" style={{ padding: '0.5rem 1rem' }}>Submit</button>

                                            </div>
                                        </Accordion.Body>

                                    </Accordion.Item>


                                </form>

                            </Accordion>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

const TaskFormPage = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const jsonData = async () => {
        try {
            const response = await axios.get('https://localhost:7235/api/AccountModule/GetAllAccountTaskByIds?ModuleId=ACC&ProcessId=ACC.03', {
                params: { id: 3 }
            });
            if (response.data.isSuccess) {
                const data = response.data.getAllAccWeeklyTaskById.map(task => ({
                    taskName: task.processName, // Assuming the task name is in processName
                    taskJson: JSON.parse(task.task_Json)
                }));
                setTasks(data);
                console.log(data);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        jsonData();
    }, []);

    return (
        <div style={{ padding: '2rem' }}>
            <p className='bg-white p-2 mb-3 text-primary fs-4'><i className="ri-list-check-3"></i> Task List</p>
            {loading ? (
                <div className='loader-container'>
                    <div className="loader"></div>
                    <div className='mt-2'>Please Wait!</div>
                </div>
            ) : tasks.length > 0 ? (
                <Row>
                    <Col xl={12}>
                        <Card>
                            <Card.Body>
                                <Accordion defaultActiveKey="0">
                                    {tasks.map((task, index) => (
                                        <DynamicForm key={index} formData={task.taskJson} taskName={task.taskName} />
                                    ))}
                                </Accordion>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            ) : (
                <p>No Task Assigned Yet.</p>
            )}
        </div>
    );
};

export default TaskFormPage;