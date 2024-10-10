import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import { FileUploader } from '@/components/FileUploader'
import { useNavigate } from 'react-router-dom';
import config from '@/config';

interface Option {
    id: string;
    label: string;
    color?: string;
}

interface Input {
    inputId: any;
    type: string;
    label: string;
    formName: string;
    formId: string;
    placeholder: string;
    options?: Option[];
    required: boolean;
    conditionalFieldId?: string;
    value?: any;
}

interface DynamicFormProps {
    formData: {
        formId: string; // Add formId
        formName: string; // Add formName
        inputs: Input[];
    };
    taskNumber: string;
    doer: string | null;
    onDoerChange: (taskNumber: string, selectedOption: Option | null) => void;
    data: any;
    show: boolean;
    parsedCondition: any;
    setShow: any;
    preData: any;
    selectedTasknumber: string
    setLoading: any
    taskCommonIDRow: any
    taskStatus: any
}

interface Condition {
    inputId: string;
    optionId: string;
    taskNumber: string;
    taskTiming: string;
    taskType: string;
    daySelection: string;
}

interface MessData {
    messID: string; 
    taskJson: any;
    comments: string; 
}
interface FormState {
    [key: string]: any; // or more specific types
}
interface Task {
    task_Number: any;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
    // formData,
    taskNumber, 
    data,
    show,
    setShow,
    parsedCondition,
    preData,
    selectedTasknumber,
    formData,
    taskCommonIDRow,
    taskStatus,
    setLoading }) => {
  
const [formState, setFormState] = useState<FormState>({});
    const [summary, setSummary] = useState('');
    const [taskJson, setTaskJson] = useState<{ [key: string]: any }>({});
    const [messManagers, setMessManagers] = useState<{ value: string, label: string }[]>([]);
    const [selectedManager, setSelectedManager] = useState<string>("Avisineni Pavan Kumar_LLP05337"); // Initialize with default value
    const [showMessManagerSelect, setShowMessManagerSelect] = useState(false);
    const [messList, setMessList] = useState<{ messID: string; messName: string; managerEmpID: string; managerName: string }[]>([]);

    const [selectedCondition, setSelectedCondition] = useState<any[]>([]);
    
    const [currentStep, setCurrentStep] = useState(0); // Track the current step


    console.log("clicked id", taskCommonIDRow)

    const navigate = useNavigate()
    console.log("value form", formState)

    useEffect(() => {
        console.log(formData);

        if (formData) {
            try {
                // Check if formData is a string and parse it; otherwise, use it as-is
                const parsedData = typeof formData === 'string'
                    ? JSON.parse(formData)  // Parse the string if it's in JSON format
                    : formData;  // Use as-is if it's already an object

                setTaskJson(parsedData); // Set the parsed or direct object
            } catch (e) {
                console.error("Error parsing formData:", e);
            }
        } else {
            console.warn("formData is undefined or empty");
        }
    }, [formData]);



    type InputConfig = {
        inputId: string;
        type?: string;
        label?: string;
        placeholder?: string;
        options?: any[];
        required?: boolean;
        conditionalFieldId?: string;
    };

    const saveDataToLocalStorage = () => {
        // Retrieve saved data from localStorage or initialize with an empty array if none
        const savedData = JSON.parse(localStorage.getItem(localStorageKey) || '[]');


        // Create a copy of saved data
        const updatedData = [...savedData];

        // Get the current messID for the step
        const currentmessID = messList[currentStep].messID;
        // const formConfig = formData?.inputs || [];

        // Transform formState into the taskJson structure
        // Assuming formData is already an object, there's no need to parse it.
        const taskJson = {
            formId: formData?.formId || 'defaultFormId',  // Fetch formId from formData or fallback
            formName: formData?.formName || 'defaultFormName',  // Fetch formName from formData or fallback
            inputs: Object.keys(formState)  // Iterate through formState keys to construct inputs
                .filter(inputId => inputId !== 'formId' && inputId !== 'formName')
                .map(inputId => {
                    const inputConfig = formData?.inputs?.find(config => config.inputId === inputId) || {} as InputConfig; // Get metadata for the input

                    return {
                        inputId,  // From formState
                        value: formState[inputId],  // Value from formState
                        type: inputConfig.type || 'text',  // Default to 'text' if type not found
                        label: inputConfig.label || '',  // Fetch label from config or set as empty
                        placeholder: inputConfig.placeholder || '',  // Fetch or set empty
                        options: inputConfig.options || [],  // Fetch options or default to empty array
                        required: inputConfig.required || false,  // Default to false if not found
                        conditionalFieldId: inputConfig.conditionalFieldId || '',  // Default to empty string
                    };
                }),
        };


        // Find if the current messID already exists in the savedData array
        const existingIndex = updatedData.findIndex((data) => data.messID === currentmessID);

        // If messID exists, update the taskJson and comments
        if (existingIndex >= 0) {
            updatedData[existingIndex] = {
                messID: currentmessID,
                taskJson,  // Replace with the newly transformed taskJson
                comments: summary,   // Replace with current comments
            };
        } else {
            // If messID doesn't exist, add a new entry with current messID, taskJson, and comments
            updatedData.push({
                messID: currentmessID,
                taskJson,  // Use the transformed taskJson
                comments: summary,
            });
        }

        // Save the updated data back to localStorage
        localStorage.setItem(localStorageKey, JSON.stringify(updatedData));
    };



    useEffect(() => {
        // Function to run on reload or component mount
        const runOnReload = () => {
            console.log("Page reloaded or component mounted");
            localStorage.removeItem(localStorageKey);
            // Your logic here
        };

        // Call the function when the component mounts
        runOnReload();

        // Optionally, return a cleanup function (if needed)
        return () => {
            // Cleanup code if required
        };
    }, []);

    type TaskJson = {
        inputs: Input[];
    };

    type SavedData = {
        messID: string;
        taskJson: TaskJson;
        comments?: string;
    };


    const handleNextStep = () => {
        // Save current form data before moving to next step
        saveDataToLocalStorage();
        

        // Move to the next step if it's within the bounds of the messList
        if (currentStep < messList.length - 1) {
            const nextStep = currentStep + 1;
            setCurrentStep(nextStep);

            // Load the saved data for the next step from localStorage
            const savedData: SavedData[] = JSON.parse(localStorage.getItem(localStorageKey) || '[]');
            const nextMessID = messList[nextStep].messID;

            // Find saved data for the next step
            const nextData = savedData.find((data: SavedData) => data.messID === nextMessID);

            if (nextData && nextData.taskJson) {
                // Safely check if taskJson and inputs exist before processing
                const { taskJson } = nextData;

                if (taskJson.inputs && Array.isArray(taskJson.inputs)) {
                    // Update formState with the saved taskJson
                    const newFormState = taskJson.inputs.reduce((acc: { [key: string]: string }, input: Input) => {
                        acc[input.inputId] = input.value || '';  // Safely handle missing values
                        return acc;
                    }, {});

                    setFormState(newFormState); // Set the formState with loaded values
                } else {
                    console.error('Invalid taskJson inputs structure:', taskJson.inputs);
                }
            } else {
                console.warn('No saved data found for messID:', nextMessID);
            }

            // Optionally load the comments for the next step
            if (nextData && nextData.comments) {
                setSummary(nextData.comments);
            } else {
                setSummary(''); // Clear the summary if no comments exist
            }
        }
    };


    // const handlePrevStep = () => {

    //     saveDataToLocalStorage();

    //     if (currentStep > 0) {
    //         const prevStep = currentStep - 1;
    //         setCurrentStep(prevStep);

    //         const savedData =  JSON.parse(localStorage.getItem(localStorageKey) || '[]');
    //         const prevMessID = messList[prevStep].messID;
    //         const prevData = savedData.find((data) => data.messID === prevMessID);

    //         if (prevData && prevData.taskJson) {

    //             const newFormState = prevData.taskJson.inputs.reduce((acc, input) => {
    //                 acc[input.inputId] = input.value;
    //                 return acc;
    //             }, {});

    //             setFormState(newFormState); 
    //         }

    //         if (prevData && prevData.comments) {
    //             setSummary(prevData.comments);
    //         }
    //     }
    // };




    useEffect(() => {
        const fetchMessManagers = async () => {
            try {
                const response = await axios.get(`${config.API_URL_APPLICATION}/CommonDropdown/GetMessManagerNameListWithId`);
                const data = response.data.messManagerNameLists;

                // Map the response data to the format required for the Select component
                const formattedData = data.map((manager: { messManagerEmpId: string, messManagerName: string }) => ({
                    value: manager.messManagerEmpId,
                    label: manager.messManagerName
                }));

                setMessManagers(formattedData);
            } catch (error) {
                console.error('Error fetching mess managers:', error);
            }
        };

        fetchMessManagers();
    }, []);

    const handleSelectMessImpChange = (selectedOption: any) => {
        setSelectedManager(selectedOption ? selectedOption.value : null);
        console.log('Selected manager ID:', selectedOption ? selectedOption.value : null);
    };


    const handleClose = () => {
        setShow(false);
    };


    // Initialize form state
    // useEffect(() => {
    //     // Initialize formState with a deep copy of formData to preserve its structure
    //     const initialState: { [key: string]: any } = JSON.parse(JSON.stringify(formData));

    //     // Update the values of the inputs in the initialState
    //     formData.inputs.forEach((input: Input) => {
    //         // Ensure that we only update the specific input values
    //         initialState.inputs = initialState.inputs.map((item: Input) =>
    //             item.inputId === input.inputId ? { ...item, value: input.value || '' } : item
    //         );
    //     });

    //     // Update the formState with the merged initial state
    //     setFormState(initialState);
    // }, [formData]);




    // console.log(projectName)


    const projectNames = 'PNC_GWALIOR';

    // console.log(projectNames)


    useEffect(() => {
        const fetchMessData = async () => {
            try {
                const response = await axios.get(`${config.API_URL_APPLICATION}/CommonDropdown/GetMessandManagerListByProjectName?ProjectName=${projectNames}`);
                if (response.data.isSuccess) {
                    const fetchedMessList = response.data.messProjectListResponses; // Store fetched list
                    setMessList(fetchedMessList);
                    console.log("Fetched mess list:", fetchedMessList); // Log the fetched list directly
                } else {
                    console.error('Failed to fetch mess data');
                }
            } catch (error) {
                console.error('Error fetching mess data:', error);
            }
        };

        if (projectNames) {
            fetchMessData();
        }
    }, [projectNames]);


    const localStorageKey = 'messFormData'; // Key for localStorage








    // Handle change in input values
const handleChange = (inputId: string, value: string | boolean | string[]) => {
    // Prevent default behavior (if needed)
    // event.preventDefault(); 

    const excludedInputIds = ['99', '100', '102', '103'];
    const input = formData.inputs.find(input => input.inputId === inputId);

    let updatedValue = value;
    let selectedLabel: string ;

    if (input) {
        selectedLabel = input.label;
    }

    // Handle select and CustomSelect input types
    if (input && (input.type === 'select' || input.type === 'CustomSelect')) {
        const selectedOption = input.options?.find(option => option.label === value);
        if (selectedOption) {
            updatedValue = selectedOption.id;
            selectedLabel = selectedOption.label;
    
            // Ensure parsedCondition is an array of arrays and has at least one array
            if (Array.isArray(parsedCondition) && parsedCondition.length > 0) {
                const selectedConditionFromParsed = parsedCondition[0].find((condition: Condition) => condition.optionId === updatedValue);
                
                if (selectedConditionFromParsed) {
                    setSelectedCondition([selectedConditionFromParsed]);
                }
            }
    
            // Update visibility based on the selected option ID
            setShowMessManagerSelect(selectedOption.id === '11-1');
        } else {
            // Handle case where no option is selected
            console.warn(`No option found for the value: ${value}`);
        }
    }
    

    // Handle multiselect input type
    if (input && input.type === 'multiselect') {
        updatedValue = (value as string[]).map(label => {
            const selectedOption = input.options?.find(option => option.label === label);
            return selectedOption ? selectedOption.id : label;
        });
    }

    // Handle other input types
    if (input) {
        switch (input.type) {
            case 'text':
            case 'textarea':
                updatedValue = value as string;
                selectedLabel = input.label;
                break;
            case 'checkbox':
                updatedValue = value as boolean;
                selectedLabel = input.label;
                break;
            case 'radio':
                updatedValue = value as boolean;
                selectedLabel = input.label;
                break;
            case 'date':
                updatedValue = value as string;
                selectedLabel = input.label;
                break;
            case 'file':
                // Handle file separately
                break;
            default:
                break;
        }
    }

    // Update formState
    setFormState(prevState => {
        const newState = {
            ...prevState,
            ...(excludedInputIds.includes(inputId) ? {} : { [inputId]: updatedValue }),
        };

        // Update taskJson only when inputId is not excluded
        if (!excludedInputIds.includes(inputId)) {
            const updatedTaskJson = {
                ...formData,
                inputs: formData.inputs.map(input => ({
                    ...input,
                    value: newState[input.inputId] !== undefined ? newState[input.inputId] : input.value,
                })),
            };

            // Set taskJson in JSON format, matching formData structure
            // setTaskJson(JSON.stringify(updatedTaskJson, null, 2)); 
            setTaskJson(updatedTaskJson); 
        }

        console.log(taskJson);

        // Re-evaluate conditions after state update
        reEvaluateConditions(newState);

        console.log(newState);

        return newState;
    });
};



    const handleSubmit = async (event: React.FormEvent, taskNumber: string) => {
        event.preventDefault();
        saveDataToLocalStorage();
        const finalData = JSON.parse(localStorage.getItem(localStorageKey) ?? '[]');
        localStorage.removeItem(localStorageKey);
        console.log('Final Submitted Data:', finalData);
        const role = localStorage.getItem('EmpId') || '';
        const taskData = data.find((task:Task) => task.task_Number === taskNumber);

        // Prepare the data to be posted
        // const taskCommonId = localStorage.getItem('taskCommonId') || 0;  // Retrieve from localStorage or set to 0 if not found

        const conditionToSend = selectedCondition.length > 0 ? selectedCondition : parsedCondition[0];

        const requestData = {
            id: taskData?.id || 0,
            doerID: role || '',
            task_Json: JSON.stringify(finalData),   // Use the updated taskJson state
            isExpired: 0,
            isCompleted: formState['Pending'] || 'Completed',
            task_Number: taskNumber,
            summary: formState['summary'] || 'Task Summary',  // Ensure summary is from formState
            condition_Json: JSON.stringify(conditionToSend),  // Assuming parsedCondition is defined
            taskCommonId: taskCommonIDRow,
            taskStatus: taskStatus, // Use the taskCommonId fetched from localStorage or state
            updatedBy: role
        };

        console.log(requestData);

        setLoading(true);  // Show loader when the request is initiated

        try {
            const response = await fetch(`${config.API_URL_ACCOUNT}/ProcessInitiation/UpdateDoerTask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (response.ok) {
                const responseData = await response.json();
                navigate('/pages/completedTask', { state: { showToast: true, taskName: data[0].task_Number } });
                console.log('Task updated successfully:', responseData);
            } else {
                console.error('Failed to update the task:', response.statusText);
            }
        } catch (error) {
            console.error('Error occurred while updating task:', error);
        } finally {
            setLoading(false);  // Hide loader when the request completes (success or error)
        }
    };


    // Function to re-evaluate conditions for showing/hiding fields
    const reEvaluateConditions = (newState: { [key: string]: any }) => {
        const updatedState = { ...newState };

        formData.inputs.forEach((input) => {
            if (input.conditionalFieldId) {
                const conditionValue = newState[input.conditionalFieldId];
                const shouldDisplay = conditionValue === input.conditionalFieldId;

                if (shouldDisplay) {
                    // Ensure the input is displayed if condition is met
                    updatedState[input.inputId] = newState[input.inputId] || '';
                } else {
                    // Optionally reset value if condition is not met
                    // updatedState[input.inputId] = ''; // or keep existing value
                }
            }
        });

        setFormState(updatedState);
    };

    const shouldDisplayInput = (input: Input): boolean => {
        if (!input.conditionalFieldId) return true;

        const conditionValue = input.conditionalFieldId;
        if (conditionValue === 'someid') return true;

        for (const otherInput of formData.inputs) {
            if (otherInput.inputId === conditionValue) {
                return formState[otherInput.inputId] !== '';

            }
            // console.log(otherInput)
            if (otherInput.options && otherInput.options.some(option => option.id === conditionValue)) {
                return formState[otherInput.inputId] === conditionValue;
            }
        }

        return false;
    };

    // console.log(formData)

    const [showBankModal, setShowBankModal] = useState(false);

    // Handlers to show/hide the modal
    const handleShow2 = () => setShowBankModal(true);
    const handleClose2 = () => setShowBankModal(false);


    useEffect(() => {
        const savedDataString = localStorage.getItem(localStorageKey);
        const savedData: MessData[] = JSON.parse(savedDataString || '[]'); 

        const currentData = savedData.find((data) => data.messID === messList[currentStep].messID);
        if (currentData) {
            setFormState(currentData.taskJson || []); 
            setSummary(currentData.comments || ''); 
        } else {
            setFormState([]); 
            setSummary(''); 
        }
    }, [currentStep, messList]);

    return (
        <>
            <Modal className="p-3" show={show} placement="end" onHide={handleClose} >
                <Modal.Header closeButton className=' '>
                    <Modal.Title className='text-dark'>Task Details</Modal.Title>
                </Modal.Header>


                <div className='px-3'>

                    {preData.map((task:any, index:any) => (
                        <div key={index}>
                            {selectedTasknumber != task.taskNumber && (
                                <>
                                    <h5 className='mt-2'>Updated data from <span className='text-primary'>{task.taskNumber}</span></h5>
                                    <div>
                                        {task.inputs.map((input:any, idx:any) => (
                                            <div key={idx}>
                                                <strong>{input.label}:</strong> <span className='text-primary'>{input.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <hr />
                                </>
                            )}
                        </div>
                    ))}


                </div>


                {formData.inputs &&
                    <form className='side-scroll' onSubmit={(event) => handleSubmit(event, taskNumber)}>

                        <Modal.Body className=" p-4">
                            <div className="stepper-vertical" style={{
                                width: 'max-content',
                                paddingRight: '10px',
                                position: 'relative',
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '20px'

                            }}>
                                {messList.map((mess, index) => {
                                    let stepClass = 'step';

                                    if (index < currentStep) {
                                        stepClass += ' completed'; // Add class for completed steps
                                    } else if (index === currentStep) {
                                        stepClass += ' active'; // Add class for the current active step
                                    }

                                    return (
                                        <>

                                            <div
                                                key={mess.messID}
                                                className={stepClass}
                                                onClick={() => setCurrentStep(index)}
                                                style={{
                                                    cursor: 'pointer',
                                                    padding: '10px 0',
                                                    margin: '0 20px 5px 0',
                                                    background: index < currentStep ? 'green' : index === currentStep ? 'green' : '#e1e1e1', // Change color based on step status
                                                    color: "#fff", // Change text color for readability
                                                    borderRadius: '50%', // Optional: Add rounded corners
                                                    position: 'relative',
                                                }}
                                            >

                                                {index + 1}

                                                {index < messList.length - 1 && (
                                                    <div
                                                        className={`step-line ${index < currentStep ? 'completed' : ''}`}
                                                        style={{
                                                            backgroundColor: index < currentStep ? 'green' : '#e1e1e1',
                                                        }}
                                                    />
                                                )}

                                            </div>
                                            <br />
                                            <div>
                                                {mess.messName}
                                            </div>

                                        </>

                                    );
                                })}
                            </div>



                            <div className="form-section" style={{ width: '90%', paddingLeft: '20px' }}>
                                <div className="my-task">
                                    {formData.inputs.map((input: Input) => (
                                        shouldDisplayInput(input) && (
                                            <div className='form-group' key={input.inputId} style={{ marginBottom: '1rem' }}>
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
                                                        id={input.inputId}
                                                        className='form-select form-control'
                                                        value={formState[input.inputId] || ''}
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
                                                        additionalData={{
                                                            ModuleID: 'yourModuleID',
                                                            CreatedBy: 'yourUserID',
                                                            TaskCommonID: 3463,
                                                            Task_Number: 'yourTaskNumber',
                                                            ProcessInitiationID: 35635,
                                                            ProcessID: 'yourProcessID',
                                                            UpdatedBy: 'yourUpdatedBy',
                                                        }}
                                                        onFileUpload={(files) => {
                                                            // Handle file upload logic here
                                                            console.log('Files uploaded:', files);
                                                        }}
                                                    />
                                                )}

                                                {input.type === 'checkbox' && (

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
                                        )

                                    ))}
                                    {showMessManagerSelect && (
                                        <div className='form-group my-2'>
                                            <label>Select Mess Manager</label>
                                            <select
                                                className='form-control'
                                                value={selectedManager} // Bound to selectedManager state
                                                onChange={handleSelectMessImpChange} // Updates state on change
                                            >
                                                <option value="Avisineni Pavan Kumar_LLP05337">Avisineni Pavan Kumar_LLP05337</option>
                                                {messManagers.map((manager) => (
                                                    <option key={manager.value} value={manager.value}>
                                                        {manager.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <i className="ri-pencil-fill fs-4" onClick={handleShow2}></i>
                                        </div>
                                    )}
                                </div>

                                {showBankModal && (
                                    <div className="modal-overlay">
                                        <div className="modal-content">
                                            <h4>Bank Details</h4>
                                            <form className='form-group'>
                                                <div className="mt-3">
                                                    <label>Reimbursement Account</label>
                                                    <input className='form-control' type="text" placeholder="Enter account number" />
                                                </div>

                                                <div className="mt-3">
                                                    <label>Reimbursement Bank</label>
                                                    <input className='form-control' type="text" placeholder="Enter account number" />
                                                </div>
                                                <div className="mt-3">
                                                    <label>Reimbursement Bank Branch</label>
                                                    <input className='form-control' type="text" placeholder="Enter account number" />
                                                </div>

                                                <div className="mt-3">
                                                    <label>Reimbursement IFSC Code</label>
                                                    <input className='form-control' type="text" placeholder="Enter IFSC code" />
                                                </div>
                                                <div className="mt-3">
                                                    <label>Mess Manager</label>
                                                    <input className='form-control' type="text" placeholder="Enter IFSC code" />
                                                </div>
                                                <div className="mt-3">
                                                    <label>Mess Manager Mobile Number</label>
                                                    <input className='form-control' type="text" placeholder="Enter IFSC code" />
                                                </div>

                                                <div className="modal-buttons mt-3 d-flex justify-content-end">
                                                    <button className='btn btn-primary' type="submit" onClick={handleClose2}>Save</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                )}
                                <div className="form-group mb-2">
                                    <label htmlFor="taskSummary">Comments</label>
                                    <input
                                        type="text"
                                        className='form-control'
                                        id="taskSummary"
                                        value={summary}  // Bind the input to the state
                                        onChange={(e) => setSummary(e.target.value)}  // Update the state on input change
                                        style={{ display: 'block', width: '100%', padding: '0.5rem' }}
                                    />
                                </div>
                                {/* </div>
             )
         ))} */}

                                <div className="d-flex justify-content-between">
                                    {/* {currentStep <= messList.length - 1 && (
                                        <button
                                            type="button"  
                                            className="btn btn-secondary"
                                            onClick={handlePrevStep}
                                            disabled={currentStep === 0}>
                                            Previous
                                        </button>
                                    )}  */}
                                    {currentStep < messList.length - 1 && (
                                        <button
                                            type="button"  // Add this to prevent form submission
                                            className="btn btn-primary"
                                            onClick={handleNextStep}
                                        // disabled={currentStep === messList.length - 1}
                                        >
                                            Next
                                        </button>
                                    )}

                                    {currentStep === messList.length - 1 && (
                                        <button
                                            type="submit"  // This button will submit the form
                                            className="btn btn-success"
                                        >
                                            Submit
                                        </button>
                                    )}

                                </div>
                            </div>
                        </Modal.Body>



                    </form>
                }

            </Modal>


        </>
    );
};



export default DynamicForm