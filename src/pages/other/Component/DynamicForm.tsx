import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
// import { FileUploader } from '@/components/FileUploader'
// import { useNavigate } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import config from '@/config';
import Select, { SingleValue } from 'react-select';
import MessCards from './Previous&Completed';

interface Option {
    id: string;
    label: string;
    color?: string;
}

interface Input {
    inputId: any;
    fieldId: string;
    type: string;
    label: string;
    formName: string;
    formId: string;
    placeholder: string;
    options?: Option[];
    required: boolean;
    conditionalFieldId?: string;
    value?: any;
    selectedMaster?: string;
    selectedHeader?: string;
    visibility?: boolean;
}

interface DynamicFormProps {
    formData: {
        formId: string; // Add formId
        formName: string; // Add formName
        approval_Console: string;
        inputs: Input[];
    };
    taskNumber: any;
    data: any;
    show: boolean;
    parsedCondition: any;
    setShow: any;
    preData: any;
    selectedTasknumber: any
    setLoading: any
    taskCommonIDRow: any
    taskStatus: any
    processId: any
    moduleId: any
    ProcessInitiationID: any
    approval_Console: any
    approvalConsoleInputID: any
    fromComponent: string
}

// interface taskSelection {
//     inputId: string;
//     optionId: string;
//     taskNumber: string;
//     taskTiming: string;
//     taskType: string;
//     daySelection: string;
// }

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
    taskNumber,
    processId,
    ProcessInitiationID,
    moduleId,
    data,
    show,
    setShow,
    parsedCondition,
    preData,
    selectedTasknumber,
    formData,
    taskCommonIDRow,
    approval_Console,
    approvalConsoleInputID,
    taskStatus,
    fromComponent,
    setLoading }) => {
    //  const [formDatas, setFormDatas] = useState<any>({});
    const [formState, setFormState] = useState<FormState>({});
    const [summary, setSummary] = useState('');
    // const [taskJson, setTaskJson] = useState<{ [key: string]: any }>({});
    const [globalTaskJson, setglobalTaskJson] = useState<any>(JSON.stringify(formData));
    const [messManagers, setMessManagers] = useState<{ value: string, label: string }[]>([]);
    const [selectedManager, setSelectedManager] = useState<string>("Avisineni Pavan Kumar_LLP05337"); // Initialize with default value
    const [showMessManagerSelect, setShowMessManagerSelect] = useState(false);
    const [messList, setMessList] = useState<{ messID: string; messName: string; managerEmpID: string; managerName: string; mobileNumber: string }[]>([]);

    const [selectedCondition, setSelectedCondition] = useState<any[]>([]);

    const [currentStep, setCurrentStep] = useState(0); // Track the current step

    const location = useLocation();

    const navigate = useNavigate()



    // useEffect(() => {

    //     if (formData) {
    //         try {
    //             // Check if formData is a string and parse it; otherwise, use it as-is
    //             const parsedData = typeof formData === 'string'
    //                 ? JSON.parse(formData)  // Parse the string if it's in JSON format
    //                 : formData;  // Use as-is if it's already an object

    //             setTaskJson(parsedData); // Set the parsed or direct object
    //         } catch (e) {
    //             console.error("Error parsing formData:", e);
    //         }
    //     } else {
    //         console.warn("formData is undefined or empty");
    //     }
    // }, [formData]);



    // useEffect(()=>{
    //     if(taskCommonIDRow){

    //         fetchSingleDataById(taskCommonIDRow);
    //     }
    // },[taskCommonIDRow])
    // const fetchSingleDataById = async (taskCommonId: number) => {
    //     try {
    //       const flag = 5;
    //       const response = await axios.get<ApiResponse>(
    //         `${config.API_URL_ACCOUNT}/ProcessInitiation/GetFilterTask?TaskCommonId=${taskCommonId}&Flag=${flag}`
    //       );

    //       if (response.data && response.data.isSuccess) {
    //         // Safely access task_Json and ensure it's a string
    //         const singledatabyID = response.data.getFilterTasks[0]?.task_Json;

    //         if (typeof singledatabyID === 'string') {
    //           console.log('fetch single Data:', JSON.parse(singledatabyID));
    //         //   setSingleDataById(JSON.parse(singledatabyID));
    //         setFormDatas(JSON.parse(singledatabyID));
    //         // setFormDatas(singledatabyID);

    //         } else {
    //           console.error('task_Json is not a valid string:', singledatabyID);
    //         }
    //       } else {
    //         console.error('API Response Error:', response.data?.message || 'Unknown error');
    //       }
    //     } catch (error) {
    //       if (axios.isAxiosError(error)) {
    //         console.error('Axios Error Response:', error.response?.data || 'No response data');
    //         console.error('Axios Error Message:', error.message);
    //       } else {
    //         console.error('Unexpected Error:', error);
    //       }
    //     } finally {
    //       setLoading(false);
    //     }
    //   };


    console.log(taskCommonIDRow)
    console.log(formData)
    console.log(preData)
    // console.log(formDatas)



    type InputConfig = {
        inputId: string;
        type?: string;
        label?: string;
        placeholder?: string;
        options?: any[];
        required?: boolean;
        conditionalFieldId?: string;
        fieldId?: string;
    };

    const saveDataToLocalStorage = () => {
        // Retrieve saved data from localStorage or initialize with an empty array if none
        const savedData = JSON.parse(localStorage.getItem(localStorageKey) || '[]');


        // Create a copy of saved data
        const updatedData = [...savedData];

        // Get the current messID for the step
        const currentmessID = messList[currentStep].messID;
        const currentmessName = messList[currentStep].messName;
        const currentmessManagerName = messList[currentStep].managerName;
        const currentmessManagerId = messList[currentStep].managerEmpID;
        const currentmessManagerNumber = messList[currentStep].mobileNumber;
        const messTaskNumber = taskNumber;
        // const formConfig = formData?.inputs || [];

        // Transform formState into the taskJson structure
        // Assuming formData is already an object, there's no need to parse it.
        const taskJson = {
            approvalStatus: approval_Console,  // Fetch formName from formData or fallback
            inputs: Object.keys(formState)  // Iterate through formState keys to construct inputs
                .filter(inputId => inputId !== 'formId' && inputId !== 'formName')
                .map(inputId => {
                    const inputConfig = formData?.inputs?.find(config => config.inputId === inputId) || {} as InputConfig; // Get metadata for the input

                    return {
                        inputId,  // From formState
                        value: formState[inputId],  // Value from formState
                        type: inputConfig.type || 'text',  // Default to 'text' if type not found
                        label: inputConfig.label || '',  // Fetch label from config or set as empty
                        fieldId: inputConfig.fieldId,
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
                messTaskNumber: messTaskNumber,
                messName: currentmessName,
                messManager: currentmessManagerName,
                messManagerId: currentmessManagerId,
                mobileNumber: currentmessManagerNumber,
                formId: formData.formId,
                formName: formData.formName,
                taskJson,  // Replace with the newly transformed taskJson
                comments: summary,   // Replace with current comments
            };
        } else {
            // If messID doesn't exist, add a new entry with current messID, taskJson, and comments
            updatedData.push({
                messID: currentmessID,
                messName: currentmessName,
                messTaskNumber: messTaskNumber,
                messManager: currentmessManagerName,
                messManagerId: currentmessManagerId,
                mobileNumber: currentmessManagerNumber,
                formId: formData.formId,
                formName: formData.formName,
                taskJson,  // Use the transformed taskJson
                comments: summary,
            });
        }

        // Save the updated data back to localStorage
        localStorage.setItem(localStorageKey, JSON.stringify(updatedData));
    };

    interface DropdownItem {
        name: string;
    }

    const [vendors, setVendors] = useState<DropdownItem[]>([]);

    useEffect(() => {

        console.log(selectedCondition)

        const customSelectInput = formData.inputs?.find(
            (input) => input.type === "CustomSelect"
        );

        if (customSelectInput && customSelectInput.selectedMaster && customSelectInput.selectedHeader) {
            const fetchVendors = async () => {
                try {
                    const response = await axios.get(
                        "${config.API_URL_APPLICATION}/CommonDropdown/GetData",
                        {
                            params: {
                                MasterName: customSelectInput.selectedMaster,
                                HeaderName: customSelectInput.selectedHeader,
                            },
                        }
                    );

                    if (response.data.isSuccess) {
                        setVendors(response.data.dropDownLists);
                    } else {
                        console.error("Failed to fetch vendors:", response.data.message);
                    }
                } catch (error) {
                    console.error("Error fetching vendor data:", error);
                }
            };

            fetchVendors();
        } else {
            console.warn("No CustomSelect input with MasterName and HeaderName found.");
        }
    }, [formData]);








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
        messName: string;
        messManager: string;
        messManagerId: string;
        mobileNumber: string;
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




    // useEffect(() => {
    //     const fetchMessManagers = async () => {
    //         try {
    //             const response = await axios.get(`${config.API_URL_APPLICATION}/CommonDropdown/GetMessManagerNameListWithId`);
    //             const data = response.data.messManagerNameLists;

    //             // Map the response data to the format required for the <select> component
    //             const formattedData = data.map((manager: { messManagerEmpId: string, messManagerName: string }) => ({
    //                 value: manager.messManagerEmpId,
    //                 label: manager.messManagerName
    //             }));

    //             setMessManagers(formattedData);
    //         } catch (error) {
    //             console.error('Error fetching mess managers:', error);
    //         }
    //     };

    //     fetchMessManagers();
    // }, []);

    // const handleSelectMessImpChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    //     const selectedValue = event.target.value;
    //     setSelectedManager(selectedValue);
    //     console.log('Selected manager ID:', selectedValue);
    // };


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

    type OptionType = { value: string; label: string };

    const options: OptionType[] = [
        { value: 'approved', label: 'Approved' },
        { value: 'rejected', label: 'Rejected' },
    ];

    const handleSelectChange = (selectedOption: SingleValue<OptionType>) => {
        setApprovalStatus(selectedOption);
    };


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




    const [approvalStatus, setApprovalStatus] = useState<OptionType | null>(null);

    console.log("this is my condition", parsedCondition)

    // Handle change in input values
    const handleChange = (inputId: string, value: string | boolean | string[]) => {
        // Prevent default behavior (if needed)
        // event.preventDefault(); 

        const excludedInputIds = ['99', '100', '102', '103'];
        const input = formData.inputs.find(input => String(input.inputId) === String(inputId));

        let updatedValue = value;
        var selectedLabel: any;
        console.log(`Selected label: ${selectedLabel}`);
        console.log(input)


        if (input) {
            selectedLabel = input.label;
        }

        if (input && input.type === 'decimal') {
            const regex = /^(\d+(\.\d{0,2})?)?$/;
            if (regex.test(value as string) && parseFloat(value as string) >= 0) {
                updatedValue = value as string;
            } else {
                console.warn('Invalid decimal value. Value must be 0 or greater with up to 2 decimals.');
                return; // Exit if the value is invalid
            }
        }

        // Handle select and CustomSelect input types
        if (input && (input.type === 'select' || input.type === 'CustomSelect')) {
            const selectedOption = input.options?.find(option => option.label === value);


            if (selectedOption) {
                updatedValue = selectedOption.id;
                selectedLabel = selectedOption.label;


                if (Array.isArray(parsedCondition)) {
                    const flattenedCondition = parsedCondition.flat();
                    flattenedCondition.forEach((condition) => {
                        if (Array.isArray(condition.taskSelections)) {

                            const filteredTaskSelections = condition.taskSelections.filter(
                                (taskSelection: any) => String(taskSelection.inputId) === String(updatedValue)
                            );

                            if (filteredTaskSelections.length > 0) {
                                setSelectedCondition({ ...condition, taskSelections: filteredTaskSelections });

                            } else {
                                console.warn('No matching task found for updatedValue:', updatedValue);
                            }
                        } else {
                            console.error('taskSelections is not an array or undefined:', condition.taskSelections);
                        }
                    });
                } else { console.error('parsedCondition is not an array:', parsedCondition); }

                setShowMessManagerSelect(selectedOption.id === '11-1');
            } else {
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

            if (!excludedInputIds.includes(inputId)) {
                const updatedTaskJson = {
                    ...formData,
                    inputs: formData.inputs.map(input => ({
                        ...input,
                        value: newState[input.inputId] !== undefined ? newState[input.inputId] : input.value,
                    })),
                };
                setglobalTaskJson(updatedTaskJson);
            }
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
        // if (fromComponent != 'AccountProcess'){
        // }

        // Prepare the data to be posted
        // const taskCommonId = localStorage.getItem('taskCommonId') || 0;  // Retrieve from localStorage or set to 0 if not found

        // const conditionToSend = selectedCondition.length > 0 ? selectedCondition : [parsedCondition[0]]; // Ensure the fallback is an array


        // setLoading(true);  // Show loader when the request is initiated
        if (fromComponent === 'AccountProcess') {
            const adhocRequestedData = {
                projectName: projectNames,
                moduleID: moduleId,
                processID: processId,
                taskCommonID: 1, // need to re work for this
                adhocJson: JSON.stringify(globalTaskJson),
                createdBy: role,
            }

            try {
                const apiUrl = `${config.API_URL_ACCOUNT}/AdhocForm/InsertAdhocJsonMaster`;
                const response = await axios.post(apiUrl, adhocRequestedData);
                console.log(response)

                if (response.status >= 200 && response.status < 300) {
                    console.log('ADHOC submitted successfully:', response.data);
                    navigate('/pages/ProcessMaster');
                } else {
                    console.error('Error submitting module:', response.status, response.statusText);
                    // Optionally, show an error message to the user
                }
            } catch (error: any) {
                console.error('Error submitting module:', error.message || error);
                // Optionally, handle network errors or unexpected errors here
            }
        }
        if (fromComponent === 'PendingTask') {
            console.log(globalTaskJson)

            const taskData = data.find((task: Task) => task.task_Number === taskNumber);
            const requestData = {
                id: taskData?.id || 0,
                doerID: role || '', // Fallback to an empty string if role is undefined
                task_Json: processId === "ACC.01" ? JSON.stringify(finalData) : JSON.stringify(globalTaskJson), // Conditional task_Json based on processId
                isExpired: 0, // Assuming this is a static value
                isCompleted: formState['Pending'] || 'Completed', // Use 'Pending' if available, else default to 'Completed'
                task_Number: taskNumber, // Ensure taskNumber is available
                summary: formState['summary'] || 'Task Summary', // Fallback to a default if 'summary' is not in formState
                condition_Json: JSON.stringify(selectedCondition), // Ensure conditionToSend is properly serialized
                taskCommonId: taskCommonIDRow, // Use the taskCommonIDRow value from the context
                taskStatus: taskStatus, // Ensure taskStatus is available
                updatedBy: role, // Use role for updatedBy
            };


            try {
                const response = await fetch(`${config.API_URL_ACCOUNT}/ProcessInitiation/UpdateDoerTaskss`, {
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

            }

        }
    };

    // const handleApprovalSubmit = async (event: React.FormEvent, taskNumber: string) => {
    //     event.preventDefault();
    //     saveDataToLocalStorage();
    //     localStorage.removeItem(localStorageKey);

    //     const role = localStorage.getItem('EmpId') || '';
    //     const taskData = data.find((task: Task) => task.task_Number === taskNumber);
    //     const conditionToSend = selectedCondition.length > 0 ? selectedCondition : parsedCondition[0];

    //     const taskJson = {
    //         formId: formData?.formId || '',
    //         formName: formData?.formName || '',
    //         inputs: Object.keys(formState)
    //             .filter(inputId => inputId !== 'formId' && inputId !== 'formName')
    //             .map(inputId => {
    //                 const { type = 'text', label = '', placeholder = '', options = [], required = false, conditionalFieldId = '' } = formData?.inputs?.find(config => config.inputId === inputId) || {};
    //                 return { inputId, value: formState[inputId], type, label, placeholder, options, required, conditionalFieldId };
    //             }),
    //     };


    //     const fullJson = {
    //         messID: 'MESS-1717998452037',  // Placeholder value; replace with actual messID
    //         taskJson,
    //         comments: formState['comments'] || '',  // Optional comments field
    //     };

    //     const requestData = {
    //         id: taskData?.id || 0,
    //         doerID: role || '',
    //         task_Json: JSON.stringify(fullJson),  // Use fullJson for approval submission
    //         isExpired: 0,
    //         isCompleted: formState['Pending'] || 'Completed',
    //         task_Number: taskNumber,
    //         summary: formState['summary'] || 'Task Summary',
    //         condition_Json: JSON.stringify(conditionToSend),
    //         taskCommonId: taskCommonIDRow,
    //         taskStatus: taskStatus,
    //         updatedBy: role,
    //     };

    //     console.log(requestData)

    //     setLoading(true);

    //     try {
    //         const response = await fetch(`${config.API_URL_ACCOUNT}/ProcessInitiation/UpdateApprovalTask`, {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify(requestData),
    //         });

    //         if (response.ok) {
    //             const responseData = await response.json();
    //             navigate('/pages/approvedTasks', { state: { showToast: true, taskName: taskNumber } });
    //             console.log('Task approved successfully:', responseData);
    //         } else {
    //             console.error('Failed to approve the task:', response.statusText);
    //         }
    //     } catch (error) {
    //         console.error('Error occurred while approving task:', error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };



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
            console.log(otherInput)
            if (otherInput.options && otherInput.options.some(option => option.id === conditionValue)) {
                return formState[otherInput.inputId] === conditionValue;
            }
        }

        return false;
    };


    const [showBankModal, setShowBankModal] = useState(false);


    const [bankDetails, setBankDetails] = useState({
        reimbursementBankAccountNumber: '',
        reimbursementBankName: '',
        reimbursementBranchName: '',
        reimbursementBankIfsc: '',
        managerName: '',
        userUpdateMobileNumber: ''
    });

    useEffect(() => {
        if (selectedManager) {
            const fetchBankDetails = async () => {
                try {
                    const response = await axios.get(`https://arvindo-api.clay.in/api/ProcessInitiation/GetMessData?EmpID=${selectedManager}`);
                    const data = response.data.getMessDataByMessManagerEmpID[0]; // Assuming one result

                    setBankDetails({
                        reimbursementBankAccountNumber: data.reimbursementBankAccountNumber,
                        reimbursementBankName: data.reimbursementBankName,
                        reimbursementBranchName: data.reimbursementBranchName,
                        reimbursementBankIfsc: data.reimbursementBankIfsc,
                        managerName: data.managerName,
                        userUpdateMobileNumber: data.userUpdateMobileNumber
                    });

                } catch (error) {
                    console.error('Error fetching bank details:', error);
                }
            };

            fetchBankDetails();
        }
    }, [selectedManager]);

    // Handlers to show/hide the modal
    const handleShow2 = () => {
        setShowBankModal(true); // Show the modal
    };


    const handleClose2 = () => setShowBankModal(false);

    const handleSelectMessImpChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        setSelectedManager(selectedValue);
        console.log(selectedManager)
    };


    useEffect(() => {
        const fetchMessManagers = async () => {
            try {
                const response = await axios.get(`${config.API_URL_APPLICATION}/CommonDropdown/GetMessManagerNameListWithId`);
                const data = response.data.messManagerNameLists;

                // Map the response data to the format required for the <select> component
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





    // useEffect(() => {
    //     if (showBankModal && selectedManager) {
    //         // Fetch details when modal is shown and selectedManager is set
    //         fetchBankDetails(selectedManager);
    //     }
    // }, [showBankModal, selectedManager]);

    // const fetchBankDetails = async (empID: string) => {
    //     try {
    //         const response = await axios.get(`https://arvindo-api.clay.in/api/ProcessInitiation/GetMessData?EmpID=${selectedManager}`);
    //         if (response.data.isSuccess) {
    //             const data = response.data.getMessDataByMessManagerEmpID[0];
    //             setBankDetails({
    //                 managerName: data.managerName,
    //                 reimbursementBankAccountNumber: data.reimbursementBankAccountNumber,
    //                 reimbursementBankName: data.reimbursementBankName,
    //                 reimbursementBankIfsc: data.reimbursementBankIfsc,
    //                 reimbursementBranchName: data.reimbursementBranchName,
    //                 userUpdateMobileNumber: data.userUpdateMobileNumber,
    //             });

    //             console.log(data)
    //         } else {
    //             console.error('Failed to fetch bank details');
    //         }
    //     } catch (error) {
    //         console.error('Error fetching bank details:', error);
    //     }
    // };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setBankDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value
        }));
    };


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
            <Modal size='xl' className="p-3" show={show} placement="end" onHide={handleClose} >
                <Modal.Header closeButton className=' '>
                    <Modal.Title className='text-dark'>Task Details</Modal.Title>
                </Modal.Header>

                {location.pathname != '/pages/ApprovalConsole' && (
                    <div className='px-3'>


                        {location.pathname !== '/pages/ApprovalConsole' && (
                            <div className="d-flex flex-wrap mx-3">
                                {/* {preData && preData.length > 0 && preData.map((task: { taskNumber: string; messName: string; messTaskNumber: string; messManager: string; managerNumber: string; inputs: { label: string; value: string }[] }, index: number) => (
                                    <div key={index} className={`m-1 w-24 ${currentStep === index ? "activeIndex" : ""}`}>
                                        {selectedTasknumber !== task.taskNumber && (
                                            <div className="card shadow-sm w-100">
                                                <div className="card-body">
                                                    <h5 className="card-title text-primary">Task Number: <span>{task.messTaskNumber}</span></h5>

                                                    {messList.length > 0 &&
                                                        index === messList.length &&
                                                        (
                                                            <p className="card-text mb-2">
                                                                <strong>Mess Name: </strong><span className="text-primary">{task.messName}</span><br />
                                                                <strong>Mess Manager Name: </strong> <span className="text-primary">{task.messManager}</span><br />
                                                                <strong>Mess Manager Contact: </strong>
                                                                <a
                                                                    href={`tel:${task.managerNumber}`}
                                                                    className="ms-1 text-primary"
                                                                    style={{ textDecoration: "none" }}
                                                                    aria-label="Call"
                                                                >
                                                                    <i className="ri-phone-fill" style={{ fontSize: "1rem" }}></i>
                                                                    {task.managerNumber}
                                                                </a>
                                                            </p>
                                                        )
                                                    }

                                                    <div className="card-text">
                                                        <h6>Value:</h6>
                                                        <ul className="">
                                                            {task.inputs.map((input, idx) => (
                                                                <li key={idx} className="list-group-item">
                                                                    <strong>{input.label} </strong> <span className="text-primary">{input.value}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))} */}
                                {preData && preData.length > 0 &&
                                    (
                                        <MessCards data={preData} />
                                    )
                                }
                            </div>
                        )}



                    </div>
                )
                }



                {/* {location.pathname === '/pages/ApprovalConsole' && 
                    ( */}
                <div>
                    {/* {formData.map((mess) => (
                                <form
                                    key={mess.messID}
                                    className='side-scroll'
                                    onSubmit={(event) => handleApprovalSubmit(event, taskNumber)}  // Use handleApprovalSubmit here
                                >
                                    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
                                        <h2>{mess.taskJson.formName}</h2>
                                        <h3>Mess ID: {mess.messID}</h3>
                                        {mess.taskJson.inputs.map((input) => (
                                            <div key={input.inputId} style={{ marginBottom: '15px' }}>
                                                <label style={{ display: 'block', fontWeight: 'bold' }}>
                                                    {input.label} {input.required && '*'}
                                                </label>
                                                {input.type === 'select' && (
                                                    <select
                                                        value={formState[input.inputId] || input.value}  // Bind to formState
                                                        onChange={(e) => setFormState({
                                                            ...formState,
                                                            [input.inputId]: e.target.value
                                                        })}
                                                        style={{ padding: '5px', width: '100%' }}
                                                    >
                                                        {input.options?.map((option) => (
                                                            <option key={option.id} value={option.id} style={{ color: option.color }}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                                {input.type === 'text' && (
                                                    <input
                                                        type="text"
                                                        value={formState[input.inputId] || input.value}  // Bind to formState
                                                        onChange={(e) => setFormState({
                                                            ...formState,
                                                            [input.inputId]: e.target.value
                                                        })}
                                                        placeholder={input.placeholder}
                                                        style={{ padding: '5px', width: '100%' }}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <button type="submit" className="btn btn-success">
                                        Submit
                                    </button>
                                </form>
                            ))} */}





                    {formData && formData.inputs &&
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
                                    {processId === "ACC.01" && (
                                        <>
                                            {messList.map((mess, index) => {
                                                let stepClass = 'step';

                                                if (index < currentStep) {
                                                    stepClass += ' completed';
                                                } else if (index === currentStep) {
                                                    stepClass += ' active';
                                                }

                                                return (
                                                    <div key={mess.messID}>
                                                        <div
                                                            className={stepClass}
                                                            onClick={() => setCurrentStep(index)}
                                                            style={{
                                                                cursor: 'pointer',
                                                                padding: '10px 0',
                                                                margin: '0 20px 5px 0',
                                                                background: index < currentStep ? 'green' : index === currentStep ? 'green' : '#e1e1e1', // Change color based on step status
                                                                color: "#fff",
                                                                borderRadius: '50%',
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

                                                        <div className='me-2'>
                                                            {mess.messName}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </>
                                    )
                                    }

                                </div>



                                <div className="form-section" style={{ width: '90%', paddingLeft: '20px' }}>
                                    <div className="my-task">
                                        {formData.inputs.map((input: Input) => (
                                            (fromComponent === 'TaskMaster' && 'PendingTask' || shouldDisplayInput(input)) && (
                                                <div className={input.visibility === false ? 'd-none' : 'form-group'}
                                                    key={input.inputId} style={{ marginBottom: '1rem' }}>
                                                    <label className='label'>{input.label}</label>
                                                    {input.type === 'text'
                                                        &&
                                                        (
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder={input.placeholder}
                                                                value={formState[input.inputId] || ''}
                                                                onChange={e => handleChange(input.inputId, e.target.value)}
                                                            />
                                                        )}
                                                    {input.type === 'number' &&
                                                        //  input.visibility !== false && 
                                                        (
                                                            <input
                                                                type="number"
                                                                className='form-control'
                                                                placeholder={input.placeholder}
                                                                value={formState[input.inputId]}
                                                                onChange={e => handleChange(input.inputId, e.target.value)}
                                                            />
                                                        )}
                                                    {input.type === 'decimal' && (
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder={input.placeholder || '0.00'}
                                                            value={formState[input.inputId] || ''}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                const regex = /^(\d+(\.\d{0,2})?)?$/;

                                                                // Validate the input value for decimals with up to 2 places
                                                                if (regex.test(value) && (parseFloat(value) >= 0 || value === '')) {
                                                                    handleChange(input.inputId, value);
                                                                } else {
                                                                    console.warn('Invalid decimal input. Must be 0 or greater with up to 2 decimal places.');
                                                                }
                                                            }}
                                                            onBlur={() => {
                                                                // Ensure the value is properly formatted or reset on blur
                                                                const formattedValue = parseFloat(formState[input.inputId] || '0').toFixed(2);
                                                                if (!isNaN(Number(formattedValue)) && Number(formattedValue) >= 0) {
                                                                    handleChange(input.inputId, formattedValue);
                                                                } else {
                                                                    alert('Enter a valid decimal value (0 or greater, up to 2 decimals).');
                                                                    handleChange(input.inputId, '0.00');
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                    {input.type === 'positive-integer' && (
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder={input.placeholder || 'Enter a positive integer'}
                                                            value={formState[input.inputId] || ''}
                                                            onChange={(e) => {
                                                                const value = e.target.value;

                                                                // Validation: Positive integers only
                                                                const regex = /^[0-9]*$/;
                                                                if (regex.test(value) && (parseInt(value, 10) >= 0 || value === '')) {
                                                                    handleChange(input.inputId, value);
                                                                } else {
                                                                    console.warn('Invalid input. Only positive integers are allowed.');
                                                                }
                                                            }}
                                                            onBlur={() => {
                                                                // Ensure the value is properly formatted or reset on blur
                                                                const parsedValue = parseInt(formState[input.inputId] || '0', 10);
                                                                if (!isNaN(parsedValue) && parsedValue >= 0) {
                                                                    handleChange(input.inputId, parsedValue.toString());
                                                                } else {
                                                                    alert('Enter a valid positive integer.');
                                                                    handleChange(input.inputId, '0');
                                                                }
                                                            }}
                                                        />
                                                    )}

                                                    {input.type === 'email' && (
                                                        <input
                                                            type="email"
                                                            className='form-control'
                                                            placeholder={input.placeholder}
                                                            value={formState[input.inputId]}
                                                            onChange={e => handleChange(input.inputId, e.target.value)}
                                                        />
                                                    )}
                                                    {input.type === 'tel' && (
                                                        <input
                                                            type="tel"
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
                                                        <select className='form-control'
                                                            value={formState[input.inputId]}
                                                            onChange={e => handleChange(input.inputId, e.target.value)}
                                                            style={{ display: 'block', width: '100%', padding: '0.5rem' }}

                                                        >
                                                            <option value="" disabled>Select an option</option>
                                                            {vendors.map((vendor, index) => (
                                                                <option key={index} value={vendor.name}>
                                                                    {vendor.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    )}
                                                    {/* {input.type === 'file' && (
                                                        <FileUploader
                                                            icon="ri-upload-cloud-2-line"
                                                            text="Drop files here or click to upload."
                                                            additionalData={{
                                                                ModuleID: moduleId,
                                                                CreatedBy: 'yourUserID',
                                                                TaskCommonID: taskCommonIDRow,
                                                                Task_Number: taskNumber,
                                                                ProcessInitiationID: ProcessInitiationID,
                                                                ProcessID: processId,
                                                                UpdatedBy: 'yourUpdatedBy',
                                                            }}
                                                            onFileUpload={(files) => {
                                                                console.log('Files uploaded:', files);
                                                            }}
                                                        />
                                                    )} */}


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
                                            <div className='form-group my-2 position-relative'>
                                                <label>Select Mess Manager</label>
                                                <select
                                                    className='form-control'
                                                    value={selectedManager} // Bound to selectedManager state
                                                    onChange={handleSelectMessImpChange} // Updates state on change
                                                >
                                                    <option value="">Select a Manager</option> {/* Default placeholder option */}
                                                    {messManagers.map((manager) => (
                                                        <option key={manager.value} value={manager.value}>
                                                            {manager.label}
                                                        </option>
                                                    ))}
                                                </select>
                                                <i style={{ position: 'absolute', right: '10px', bottom: '6px' }} className="ri-pencil-fill fs-4" onClick={handleShow2}></i> {/* This shows the modal */}
                                            </div>
                                        )}
                                        {approval_Console === "Select Approval_Console" && (
                                            <div>
                                                <label>Is Approved</label>
                                                <Select
                                                    options={options}                         // Set options for the dropdown
                                                    value={approvalStatus}                    // Bind the selected option
                                                    onChange={handleSelectChange}             // Update state on selection
                                                    placeholder="Select Approval Status"      // Placeholder text
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {showBankModal && (
                                        <div className="modal-overlay">
                                            <div className="modal-content">
                                                <h4>Bank Details</h4>
                                                <form className='form-group row'>
                                                    <div className="mt-3 col-6">
                                                        <label>Reimbursement Account</label>
                                                        <input
                                                            className='form-control'
                                                            type="text"
                                                            name="reimbursementBankAccountNumber" // Name for state update
                                                            value={bankDetails.reimbursementBankAccountNumber}
                                                            placeholder="Enter account number"
                                                            onChange={handleInputChange} // Handle changes in input
                                                        />
                                                    </div>

                                                    <div className="mt-3 col-6">
                                                        <label>Reimbursement Bank</label>
                                                        <input
                                                            className='form-control'
                                                            type="text"
                                                            name="reimbursementBankName" // Name for state update
                                                            value={bankDetails.reimbursementBankName}
                                                            placeholder="Enter bank name"
                                                            onChange={handleInputChange} // Handle changes in input
                                                        />
                                                    </div>

                                                    <div className="mt-3 col-6">
                                                        <label>Reimbursement Bank Branch</label>
                                                        <input
                                                            className='form-control'
                                                            type="text"
                                                            name="reimbursementBranchName" // Name for state update
                                                            value={bankDetails.reimbursementBranchName}
                                                            placeholder="Enter branch name"
                                                            onChange={handleInputChange} // Handle changes in input
                                                        />
                                                    </div>

                                                    <div className="mt-3 col-6">
                                                        <label>Reimbursement IFSC Code</label>
                                                        <input
                                                            className='form-control'
                                                            type="text"
                                                            name="reimbursementBankIfsc" // Name for state update
                                                            value={bankDetails.reimbursementBankIfsc}
                                                            placeholder="Enter IFSC code"
                                                            onChange={handleInputChange} // Handle changes in input
                                                        />
                                                    </div>

                                                    <div className="mt-3 col-6">
                                                        <label>Mess Manager</label>
                                                        <input
                                                            className='form-control'
                                                            type="text"
                                                            name="managerName" // Name for state update
                                                            value={bankDetails.managerName}
                                                            placeholder="Enter manager name"
                                                            onChange={handleInputChange} // Handle changes in input
                                                        />
                                                    </div>

                                                    <div className="mt-3 col-6">
                                                        <label>Mess Manager Mobile Number</label>
                                                        <input
                                                            className='form-control'
                                                            type="text"
                                                            name="userUpdateMobileNumber" // Name for state update
                                                            value={bankDetails.userUpdateMobileNumber}
                                                            placeholder="Enter mobile number"
                                                            onChange={handleInputChange} // Handle changes in input
                                                        />
                                                    </div>

                                                    <div className="modal-buttons mt-3 d-flex justify-content-end">
                                                        <button className='btn btn-primary' type="button" onClick={handleClose2}>Close</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    )}
                                    {/* <div className="form-group mb-2">
                                    <label htmlFor="taskSummary">Comments</label>
                                    <input
                                        type="text"
                                        className='form-control'
                                        id="taskSummary"
                                        value={summary}  // Bind the input to the state
                                        onChange={(e) => setSummary(e.target.value)}  // Update the state on input change
                                        style={{ display: 'block', width: '100%', padding: '0.5rem' }}
                                    />
                                </div> */}
                                    {/* </div>
                                        )
                                    ))} */}
                                    <div>
                                        {processId === "ACC.01" ? (
                                            <div className="d-flex justify-content-between mt-2">
                                                {/* Next Button */}
                                                {currentStep < messList.length - 1 && (
                                                    <button
                                                        type="button" // Add this to prevent form submission
                                                        className="btn btn-primary"
                                                        onClick={handleNextStep}
                                                    >
                                                        Next
                                                    </button>
                                                )}
                                                {currentStep === messList.length - 1 && (
                                                    <button
                                                        type="submit" // This button will submit the form
                                                        className="btn btn-success"
                                                    >
                                                        Submit
                                                    </button>
                                                )}
                                            </div>
                                        ) : <> {fromComponent != 'TaskMaster' && <button
                                            type="submit" // This button will submit the form
                                            className="btn btn-success mt-2"
                                        >
                                            Submit
                                        </button>}
                                        </>
                                        }
                                    </div>
                                </div>
                            </Modal.Body>
                        </form>
                    }
                </div>
                {/* )


                } */}

            </Modal >
        </>
    );
};



export default DynamicForm