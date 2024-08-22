import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Accordion, Card, Col, Row } from 'react-bootstrap'
import { PageBreadcrumb } from '@/components'
import { FileUploader } from '@/components/FileUploader'
import Select from 'react-select'








const DynamicForm = ({ formData }) => {
    const [formState, setFormState] = useState({});
    console.log(formData)

    // Initialize form state
    useEffect(() => {
        const initialState = {};
        formData.inputs.forEach(input => {
            initialState[input.inputId] = input.value || '';
        });
        setFormState(initialState);
    }, [formData]);

    console.log(formData)

    const handleChange = (inputId, value) => {
        setFormState(prevState => ({
            ...prevState,
            [inputId]: value
        }));
    };


    const [employeeNames, setEmployeeNames] = useState<EmployeeName[]>([]);

    // Fetch employee names when the component mounts
    useEffect(() => {
        const fetchEmployeeNames = async (): Promise<EmployeeName[]> => {
            try {
                const response = await axios.get(
                    'https://localhost:44306/api/CommonDropdown/GetEmployeeListWithId',
                    {
                        headers: {
                            accept: '*/*',
                        },
                    }
                );

                if (response.data.isSuccess) {
                    return response.data.employeeLists.map((employee: any) => ({
                        employeeName: employee.employeeName,
                    }));
                } else {
                    console.error(response.data.message);
                    return [];
                }
            } catch (error) {
                console.error('Error fetching employee data:', error);
                return [];
            }
        };

        // Set the employee names state
        fetchEmployeeNames().then((names) => setEmployeeNames(names));
    }, []);

    // Map the employee names to the format required by `react-select`
    const empOptions = employeeNames.map((employee) => ({
        value: employee.employeeName,
        label: employee.employeeName,
    }));



    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission, e.g., send formState to an API
        console.log('Form submitted:', formState);
    };

    return (
        <>

            <Accordion defaultActiveKey="0" className='mb-3'>


                {/* <form onSubmit={handleSubmit}> */}
                <form >
                    <Accordion.Item eventKey="3">
                        <Accordion.Header as="h2" >
                            <div className='fs-6 mb-1 fw-bolder'>Task Name</div>
                            <div className='col-12 fs-5 text-primary'>{formData.inputs.find(input => input.inputId === "1").label}</div>
                        </Accordion.Header>
                        <Accordion.Body className='my-task'>

                            {formData.inputs.map(input => (
                                <div className='m-3 form-group' key={input.inputId} style={{ marginBottom: '1rem' }}>
                                    <label className='label'>{input.label}</label>
                                    {input.type === 'text' && (
                                        <input
                                            type="text"
                                            className='form-control'
                                            placeholder={input.placeholder}
                                            value={formState[input.inputId]}
                                            onChange={e => handleChange(input.inputId, e.target.value)}
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
                                        <select className='form-select form-control'
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
                                        // <input

                                        //     className='form-control'

                                        // />
                                        <span className="form-check">
                                            <input className="form-check-input" type="checkbox"
                                                checked={formState[input.inputId]}
                                                onChange={e => handleChange(input.inputId, e.target.checked)} />
                                        </span>
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
                            <div className='form-group m-3'>
                                <p className="mb-1 fw-bold text-muted">Assign Doer</p>
                                <Select className="select2 z-3" options={empOptions} />
                            </div>
                        </Accordion.Body>

                    </Accordion.Item>


                </form>

            </Accordion>
        </>
    );
};

const TaskFormPage = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modules, setModules] = useState<Module[]>([]);
    const [filterData, setFilterFormData] = useState({
        ModuleName: '',
        ModuleId: '',
        processName: '',
        processID: '',
        processOptions: [],
    });

    interface Module {
        id: number;
        moduleID: string;
        moduleName: string;
    }

    const fetchTasks = async (moduleId: string, processId: string) => {
        try {
            const response = await axios.get('https://localhost:7235/api/AccountModule/GetAccountProcessTaskByIds', {
                params: { ModuleId: moduleId, ProcessId: processId },
            });
            if (response.data.isSuccess) {
                const data = response.data.getAccountProcessTaskByIds.map((task: any) => ({
                    taskName: task.processName,
                    taskJson: JSON.parse(task.task_Json),
                    taskNumber: task.task_Number
                }));
                setTasks(data);
                console.log(data)
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get('https://localhost:44306/api/CommonDropdown/GetProjectList', {
                    headers: {
                        'accept': '*/*',
                    },
                });

                if (response.data.isSuccess) {
                    setProjects(response.data.projectListResponses);
                } else {
                    console.error(response.data.message);
                }
            } catch (error) {
                console.error('Error fetching project list:', error);
            }
        };

        fetchProjects();
    }, []);

    const projectOptions = projects.map(project => ({
        value: project.id,
        label: project.projectName,
    }));



    const fetchModules = async () => {
        try {
            const response = await axios.get('https://localhost:44306/api/CommonDropdown/GetModuleList');
            if (response.data.isSuccess) {
                setModules(response.data.moduleNameListResponses);
            } else {
                console.error('Error fetching modules:', response.data.message);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchModules();
    }, []);

    useEffect(() => {
        if (filterData.ModuleId && filterData.processID) {
            fetchTasks(filterData.ModuleId, filterData.processID);
        }
    }, [filterData.ModuleId, filterData.processID]);

    const handleFormChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = event.target;

        setFilterFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));

        // Reset tasks when module or process is changed
        if (name === 'ModuleName' || name === 'processes') {
            setTasks([]); // Clear tasks

            if (name === 'ModuleName') {
                const selectedModule = modules.find(module => module.moduleName === value);

                if (selectedModule) {
                    try {
                        const response = await axios.get('https://localhost:44306/api/CommonDropdown/GetProcessNameByModuleName', {
                            params: { ModuleName: value },
                        });
                        if (response.data.isSuccess) {
                            setFilterFormData(prevData => ({
                                ...prevData,
                                ModuleId: selectedModule.moduleID,
                                processOptions: response.data.processListResponses,
                                processName: '', // Reset processName to force re-fetch
                                processID: '',   // Reset processID to force re-fetch
                            }));
                        } else {
                            console.error('Error fetching processes:', response.data.message);
                        }
                    } catch (error) {
                        console.error('Error fetching data:', error);
                    }
                }
            }

            if (name === 'processes') {
                const selectedProcess = filterData.processOptions.find(process => process.processName === value);
                if (selectedProcess) {
                    setFilterFormData(prevData => ({
                        ...prevData,
                        processName: selectedProcess.processName,
                        processID: selectedProcess.processID,
                    }));
                }
            }
        }
    };



    return (
        <div>
            <div className='row m-0 bg-white shadow p-2 mt-3 mb-2 rounded'>
                <div className="col-md-4 my-1 form-group">
                    <label htmlFor="ModuleName" className="form-label">Module Name</label>
                    <select
                        id="ModuleName"
                        name="ModuleName"
                        className="form-control"
                        value={filterData.ModuleName}
                        onChange={handleFormChange}
                        required
                    >
                        <option value="">Select Modules</option>
                        {modules.map((module) => (
                            <option key={module.moduleID} value={module.moduleName}>
                                {module.moduleName}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-md-4 my-1 form-group">
                    <label htmlFor="processes" className="form-label">Process Name</label>
                    <select
                        id="processes"
                        name="processes"
                        className="form-control"
                        value={filterData.processName}
                        onChange={handleFormChange}
                        required
                    >
                        <option value="">Select Process</option>
                        {filterData.processOptions?.map((process) => (
                            <option key={process.processID} value={process.processName}>
                                {process.processName}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-md-4 my-1 form-group">
                    <p className="mb-1 fw-bold text-muted">Select project</p>
                    <Select
                        className="select2 select2-multiple z-3"
                        options={projectOptions}
                        isMulti={true}
                    />
                </div>
            </div>
            {loading ? (
                <div className="loader-container">
                    <div className="loader"></div>
                    <div className="mt-2">Please Wait!</div>
                </div>
            ) : tasks.length > 0 ? (
                <Row>
                    <Col xl={12}>
                        <Accordion defaultActiveKey="0" className='row'>
                            {tasks.map((task, index) => (
                                <div className='col-6'>
                                    <div className='bg-primary text-white px-2 py-1'>{tasks[index].taskNumber}</div>
                                    <DynamicForm key={index} formData={task.taskJson} taskName={task.task_Number} />
                                </div>
                            ))}
                        </Accordion>
                    </Col>
                </Row>
            ) : (
                <p>No Task Assigned Yet.</p>
            )}
            <div className="col-12 d-flex justify-content-end">
                <button className='btn btn-primary' type="submit" style={{ padding: '0.5rem 1rem' }}>Apply</button>
            </div>
        </div>
    );
};

export default TaskFormPage;