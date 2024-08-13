import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
        <form onSubmit={handleSubmit}>
            {formData.inputs.map(input => (
                <div className='m-5' key={input.inputId} style={{ marginBottom: '1rem' }}>
                    <label>{input.label}</label>
                    {input.type === 'text'  && (
                        <input
                            type="text"
                            placeholder={input.placeholder}
                            value={formState[input.inputId]}
                            onChange={e => handleChange(input.inputId, e.target.value)}
                            style={{ display: 'block', width: '100%', padding: '0.5rem' }}
                        />
                    )}
                    {input.type === 'custom'  && (
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
                    {input.type === 'file'  && (
                        <input
                            type="file"
                            placeholder={'file'}
                            value={formState[input.file]}
                            onChange={e => handleChange(input.fileId, e.target.value)}
                            style={{ display: 'block', width: '100%', padding: '0.5rem' }}
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
            <button type="submit" style={{ padding: '0.5rem 1rem' }}>Submit</button>
        </form>

        
        </>

        
    );
};

const TaskFormPage = () => {
    const [json, setJson] = useState(null);
    const [loading, setLoading] = useState(true);

    const jsonData = async () => {
        try {
            const response = await axios.get('https://localhost:7235/api/MessWeeklyPayments/GetAllAccWeeklyTaskById', {
                params: {
                    id: 1
                }
            });
            if (response.data.isSuccess) {
                const data = response.data.getAllAccWeeklyTaskById[0];
                const parsedTaskJson = JSON.parse(data.task_Json);
                setJson(parsedTaskJson);
                console.log(parsedTaskJson)
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
            <h1>Dynamic Task Form</h1>
            {loading ? (
                <p>Loading...</p>
            ) : json ? (
                <DynamicForm formData={json} />
            ) : (
                <p>No data available.</p>
            )}
        </div>
    );
};

export default TaskFormPage;
