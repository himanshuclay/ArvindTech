import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Accordion, Col, Row } from 'react-bootstrap'
import { FileUploader } from '@/components/FileUploader'
import Select from 'react-select'

const TaskFormPage = () => {
    const [loading, setLoading] = useState(true);
    const [modules, setModules] = useState<Module[]>([]);
    const [filterData, setFilterFormData] = useState<FilterData>({
        ModuleName: '',
        ModuleId: '',
        processName: '',
        processID: '',
        processOptions: [],
        ProjectId: '',
        ProjectName: '',
        CreatedBy: '',
        UpdateBy: '',
    });

    interface FilterData {
        ModuleName: string;
        ModuleId: string;
        processName: string;
        processID: string;
        processOptions: Array<{ processName: string; processID: string }>;
        ProjectId: string;
        ProjectName: string;
        CreatedBy: string;
        UpdateBy: string;
    }

    interface OptionType {
        value: string;
        label: string;
    }

    interface Module {
        id: number;
        moduleID: string;
        moduleName: string;
    }

    interface Task {
        taskName: string;
        taskJson: any; // Adjust this type according to the structure of your JSON
        taskNumber: string;
        finishPoint: any;
    }

    const [tasks, setTasks] = useState<Task[]>([]);


    console.log(tasks)

    const handleProjectChange = (selectedOption: OptionType | null) => {
        if (selectedOption) {
            setSelectedProject({
                projectId: String(selectedOption.value), // Ensure 'projectId' is a string
                projectName: selectedOption.label,
            });
        } else {
            setSelectedProject(null);
        }
    };

    const fetchConditionalFieldIds = () => {
        tasks.forEach((task) => {
            const inputs = task.taskJson.inputs;

            inputs.forEach((input: any) => {
                if (input.conditionalFieldId) {
                    // console.log(`Task: ${task.taskName}, Input ID: ${input.inputId}, Conditional Field ID: ${input.conditionalFieldId}`);
                }
            });
        });
    };

    // Call this function where appropriate, such as after tasks are loaded or updated
    fetchConditionalFieldIds();


    const [doers, setDoers] = useState<{ [key: string]: string | null }>({});

    const [activeKey, setActiveKey] = useState<string | null>(null);

    interface Input {
        inputId: string;
        value?: string; // Assuming value is optional
    }

    interface FormState {
        [key: string]: string;
    }

    interface Input {
        inputId: string;
        value?: string; // Assuming value is optional
        type?: string; // Add other properties if necessary
        label?: string;
        conditionalFieldId?: string;
        placeholder?: string;
        options?: { id: string; label: string }[]; // Example for options in select inputs
    }

    interface DynamicFormProps {
        formData: any; // Use a specific type if known
        taskNumber: string;
        doer: string | null;
        onDoerChange: (taskNumber: string, selectedOption: OptionType | null) => void;
    }
    const DynamicForm: React.FC<DynamicFormProps> = ({ formData, taskNumber, doer, onDoerChange }) => {
        const [formState, setFormState] = useState<{ [key: string]: any }>({});
        // console.log(formData)

        // Initialize form state
        useEffect(() => {
            // Ensure initialState has the correct type
            const initialState: FormState = {};

            // Type the parameter 'input' correctly
            formData.inputs.forEach((input: Input) => {
                initialState[input.inputId] = input.value || '';
            });

            setFormState(initialState);
        }, [formData]);

        const handleChange = (inputId: string, value: string | boolean) => {
            setFormState(prevState => ({
                ...prevState,
                [inputId]: value
            }));
        };
        return (
            <>

                <Accordion key={taskNumber}
                    defaultActiveKey="0"
                    className="mb-3"
                    activeKey={activeKey}
                    onSelect={(eventKey) => setActiveKey(eventKey as string | null)}>
                    {/* <form onSubmit={handleSubmit}> */}
                    <form onSubmit={(event) => handleSubmit(event, taskNumber)}>
                        <Accordion.Item eventKey={taskNumber}>
                            <Accordion.Header as="h2" >
                                <div className='fs-6 mb-1 fw-bolder'>Task Name</div>
                                <div className='col-12 fs-5 text-primary'>{formData.inputs.find((input: { inputId: string; label: string }) => input.inputId === "99")?.label}</div>
                            </Accordion.Header>
                            <Accordion.Body className='my-task'>

                                {formData.inputs.map((input: Input) => {
                                    // Check if the input should be displayed
                                    // const selectedValue = formState['12-1'] || ''; // Adjust '12' to the actual select inputId

                                    // // Determine if the current input should be displayed
                                    // const shouldDisplay =
                                    //     input.conditionalFieldId == "someid" || // Display if there's no conditionalFieldId
                                    //     (input.conditionalFieldId === selectedValue); // Display if the selected value matches the conditionalFieldId

                                    return (
                                        // shouldDisplay && (
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
                                                    <select
                                                        className='form-select form-control'
                                                        value={formState[input.inputId]}
                                                        onChange={e => handleChange(input.inputId, e.target.value)}
                                                        style={{ display: 'block', width: '100%', padding: '0.5rem' }}
                                                    >
                                                        <option value="" disabled>Select an option</option>
                                                        {input.options?.map(option => (
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
                                                        {input.options?.map(option => (
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
                                                        {input.options?.map(option => (
                                                            <option key={option.id} value={option.label}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                                {input.type === 'file' && (
                                                    <FileUploader
                                                        icon="ri-upload-cloud-2-line"
                                                        text="Drop files here or click to upload."
                                                    />
                                                )}
                                                {input.type === 'checkbox' && (
                                                    <span className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            checked={formState[input.inputId]}
                                                            onChange={e => handleChange(input.inputId, e.target.checked)}
                                                        />
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
                                        )
                                    // );
                                })}

                                <div className='form-group m-3 d-none'>
                                    <p className="mb-1 fw-bold text-muted">Assign Doer</p>
                                    <Select
                                        className="select2 z-3"
                                        options={empOptions}
                                        onChange={(selectedOption) => onDoerChange(taskNumber, selectedOption)} // Pass taskNumber
                                        value={empOptions.find(option => option.value === doer) || null} // Set the selected value
                                    />
                                </div>

                                {/* <div className="col-12 d-flex justify-content-end">
                                    <button className='btn btn-primary' type="submit" style={{ padding: '0.5rem 1rem' }}>
                                        Apply
                                    </button>
                                </div> */}

                            </Accordion.Body>

                        </Accordion.Item>


                    </form>
                </Accordion>
            </>
        );
    };


    const [employeeNames, setEmployeeNames] = useState<{ roleName: string }[]>([]);
    // Define the empOptions mapping based on role names
    const empOptions = employeeNames.map((role) => ({
        value: role.roleName,
        label: role.roleName,
    }));


    // Fetch role names when the component mounts
    useEffect(() => {
        const fetchRoleNames = async (): Promise<{ roleName: string }[]> => {
            try {
                const response = await axios.get(
                    'https://localhost:44307/api/CommonDropdown/GetRoleMasterList',
                    {
                        headers: {
                            accept: '*/*',
                        },
                    }
                );

                if (response.data.isSuccess) {
                    return response.data.roleMasterLists.map((role: any) => ({
                        roleName: role.roleName,
                    }));
                } else {
                    console.error(response.data.message);
                    return [];
                }
            } catch (error) {
                console.error('Error fetching role data:', error);
                return [];
            }
        };

        // Set the role names state
        fetchRoleNames().then((roles) => setEmployeeNames(roles));
    }, []);


    useEffect(() => {
        if (filterData.ModuleId && filterData.processID) {
            fetchTasks(filterData.ModuleId, filterData.processID);
        }
    }, [filterData.ModuleId, filterData.processID]);


    const [selectedProject, setSelectedProject] = useState<{ projectId: string, projectName: string } | null>(null);

    const handleDoerChange = (taskNumber: string, selectedOption: { value: string, label: string } | null) => {
        // Update the doers state without affecting the accordion's state
        setDoers(prevDoers => ({
            ...prevDoers,
            [taskNumber]: selectedOption?.value || null,
        }));
    };;


    const fetchTasks = async (moduleId: string, processId: string) => {
        try {
            const response = await axios.get('https://localhost:5078/api/AccountModule/GetAccountProcessTaskByIds', {
                params: { ModuleId: moduleId, ProcessId: processId },
            });

            if (response.data.isSuccess) {
                const data: Task[] = response.data.getAccountProcessTaskByIds.map((task: any) => ({
                    taskName: task.processName,
                    taskJson: JSON.parse(task.task_Json),
                    taskNumber: task.task_Number,
                    finishPoint: task.finishPoint,
                }));
                console.log(data)
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


    const [projects, setProjects] = useState<{ projectId: string; projectName: string }[]>([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get('https://localhost:44307/api/CommonDropdown/GetProjectList', {
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
        value: project.projectId,
        label: project.projectName,
    }));



    const fetchModules = async () => {
        try {
            const response = await axios.get('https://localhost:44307/api/CommonDropdown/GetModuleList');
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
                        const response = await axios.get('https://localhost:44307/api/CommonDropdown/GetProcessNameByModuleName', {
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

    const handleSubmit = async (event: React.FormEvent, taskNumber: string) => {
        event.preventDefault();

        const task = tasks.find(t => t.taskNumber === taskNumber);

        if (!task || !task.taskJson || !task.taskNumber) {
            alert('Task data is missing or incomplete.');
            return;
        }

        const payload = {
            id: "0",
            projectId: selectedProject?.projectId,
            projectName: selectedProject?.projectName,
            moduleID: filterData.ModuleId,
            moduleName: filterData.ModuleName,
            processID: filterData.processID,
            processName: filterData.processName,
            role: doers[taskNumber],
            task_Json: JSON.stringify(task.taskJson),
            task_Number: task.taskNumber,
            finishPoint: task.finishPoint,
            createdBy: 'himanshu pant',
        };
        console.log(payload)

        try {
            const response = await axios.post('https://localhost:7235/api/AccountModule/ProjectAssignWithDoer', payload);

            if (response?.data?.isSuccess) {
                console.log('Process updated successfully:', response.data);
            } else {
                console.error('API Error:', response?.data?.message || response?.statusText || 'Unexpected error');
                alert('Failed to update process: ' + (response?.data?.message || response?.statusText || 'An unexpected error occurred.'));
            }
        } catch (error) {
            // console.error('Submission Error:', error.response ? error.response.data : error.message);
            alert('There was an error submitting the form. Please try again.');
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
                <div className="col-md-4 my-1 form-group d-none">
                    <p className="mb-1 fw-bold text-muted">Select project</p>
                    <Select
                        className="select2 z-3"
                        options={projectOptions}
                        onChange={handleProjectChange}
                        value={projectOptions.find(option => option.value === String(selectedProject?.projectId)) || null}
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
                        <Accordion defaultActiveKey="0" className='row' activeKey={activeKey}
                            onSelect={key => setActiveKey(key as string | null)}>
                            {tasks.map((task, index) => (
                                <div className='col-6' key={index}>
                                    <div className='bg-primary text-white px-2 py-1'>{task.taskNumber}</div>
                                    <DynamicForm
                                        formData={task.taskJson}
                                        taskNumber={task.taskNumber}
                                        doer={doers[task.taskNumber] || null} // Pass the current doer state
                                        onDoerChange={handleDoerChange} // Pass the handler
                                    />
                                </div>
                            ))}
                        </Accordion>
                    </Col>
                </Row>
            ) : (
                <p>No Task Assigned Yet.</p>
            )}
            {/* <div className="col-12 d-flex justify-content-end">
                <button className='btn btn-primary' type="submit" style={{ padding: '0.5rem 1rem' }} onClick={handleSubmit}>Apply</button>
            </div> */}
        </div>
    );
};

export default TaskFormPage;