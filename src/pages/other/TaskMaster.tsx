import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Modal, Form, Table } from 'react-bootstrap';
import Select from 'react-select'; // Make sure you have this or the appropriate select component imported
import CustomFlatpickr from '@/components/CustomFlatpickr';

// Define interfaces for the data
interface AccountProcessTask {
    id: number;
    moduleID: string;
    moduleName: string;
    processID: string;
    processName: string;
    startDate: string;
    task_Json: string;
    task_Number: string;
    finishPoint: string;
    roleId: string;
    roleName: string;
    doerName: string;
}

interface Module {
    id: number;
    moduleID: string;
    moduleName: string;
}

interface Process {
    processID: string;
    processName: string;
    moduleId: string;
    moduleName: string;
}

// interface Role {
//     id: number;
//     roleName: string;
//     module: string;
// }

interface Option {
    id: string;
    label: string;
    color: string;
}

interface FilteredJsonInputType {
    inputId: string;
    type: string;
    label: string;
    placeholder: string;
    options?: Option[];  // Optional if some inputs don't have options
    required: boolean;
    conditionalFieldId: string;
    value: string;
}

interface FilteredJsonType {
    inputId: string;
    type: string;
    label: string;
    placeholder: string;
    options: Option[];
    required: boolean;
    conditionalFieldId: string;
    value: string;
    inputs: FilteredJsonInputType[];
}

interface ModalFormProps {
    showModalone: boolean;
    handleClose: () => void;
    filteredJson: FilteredJsonType | null;
}

const AccountProcessTable: React.FC = () => {
    const [tasks, setTasks] = useState<AccountProcessTask[]>([]);
    const [modules, setModules] = useState<Module[]>([]);
    const [processes, setProcesses] = useState<Process[]>([]);
    const [selectedModule, setSelectedModule] = useState<string>('');
    const [selectedModuleId, setSelectedModuleId] = useState<string>('');
    const [selectedProcess, setSelectedProcess] = useState<string>('');
    const [showModal, setShowModal] = useState(false);
    const [employees, setEmployees] = useState<Employee[]>([]);
    // const [roles, setRoles] = useState<Role[]>([]);
    const [selectedTask, setSelectedTask] = useState<AccountProcessTask | null>(null);
    const [selectedEmployee, setSelectedEmployee] = useState<string>('');
    // const [selectedRole, setSelectedRole] = useState<number | null>(null);
    // const [Status, setStatus] = useState<number | null>(1);
    const [projects, setProjects] = useState<{ id: string; projectName: string }[]>([]);
    const [selectedProject, setSelectedProject] = useState<string>('');
    const [showApplyModal, setShowApplyModal] = useState(false);
    // const [assignedTasks, setAssignedTasks] = useState<Map<number, { employeeId: string, roleId: number }>>(new Map());
    const [filteredJson, setFilteredJson] = useState<FilteredJsonType | null>(null);
    const [selectedConditionTask, setSelectedConditionTask] = useState<string>('');


    // Fetch Modules
    useEffect(() => {
        const fetchModules = async () => {
            try {
                const response = await axios.get('https://arvindo-api2.clay.in/api/CommonDropdown/GetModuleList');
                if (response.data.isSuccess) {
                    setModules(response.data.moduleNameListResponses);
                }
            } catch (error) {
                console.error('Error fetching modules', error);
            }
        };
        fetchModules();
    }, []);

    const ModalForm = ({ showModalone, handleClose, filteredJson }: ModalFormProps) => {
        // State to store task numbers for each option

        // Handle change for task numbers
        const [selectedTaskNumbers, setSelectedTaskNumbers] = useState<{ [key: string]: string }>({});
        console.log(filteredJson);
        console.log(filteredJson?.inputs);

        // Handle change for task number selection
        const handleTaskNumberChange = (optionId: string, value: string) => {
            if (value === "updateMaster") {
                // Set the selected task number for this option to "updateMaster"
                setSelectedTaskNumbers(prevState => ({
                    ...prevState,
                    [optionId]: "updateMaster"
                }));
                console.log("Update Master selected for option:", optionId);
            } else {
                // Set the selected task number for normal task numbers
                setSelectedTaskNumbers(prevState => ({
                    ...prevState,
                    [optionId]: value
                }));
            }
        };
        // const handleNextTask = (inputId: string, selectedTaskNumber: string) => {
        //     setSelectedTaskNumbers(prevState => ({
        //         ...prevState,
        //         [inputId]: selectedTaskNumber // Update the task number for the corresponding input ID
        //     }));
        // }


        const [taskTiming, setTaskTiming] = useState<{ [key: string]: string }>({});
        const [daySelection, setDaySelection] = useState<{ [key: string]: string }>({});
        const [weekdaySelection, setWeekdaySelection] = useState<{ [key: string]: string[] }>({});
        const [timeSelection, setTimeSelection] = useState<any>({});
        const [selectedTaskTypes, setSelectedTaskTypes] = useState<{ [key: string]: string }>({});


        const handleTaskTimingChange = (inputId: string, optionId: string | null, timingType: string) => {
            const key = optionId || inputId; // Use optionId if present, otherwise fall back to inputId
            setTaskTiming(prev => ({ ...prev, [key]: timingType }));
        };

        const handleDaySelectionChange = (inputId: string, optionId: string | null, value: string) => {
            const key = optionId || inputId; // Use optionId if available, otherwise fall back to inputId
            setDaySelection(prev => ({ ...prev, [key]: value }));
        };


        const handleTaskTypeChange = (inputId: string, optionId: string | null, value: string) => {
            const key = optionId || inputId; // Use optionId if present, otherwise fall back to inputId
            setSelectedTaskTypes(prevState => ({
                ...prevState,
                [key]: value
            }));
        };

        const handleWeekdaySelectionChange = (inputId: string, optionId: string | null, selectedWeekdays: string[]) => {
            const key = optionId || inputId; // Use optionId if present, otherwise fall back to inputId
            setWeekdaySelection(prev => {
                const newState = { ...prev, [key]: selectedWeekdays };
                console.log(newState); // Log the new state here
                return newState; // Return the new state
            });
        };


        const handleTimeChange = (inputId: string, optionId: string | null, selectedTime: Date | string | undefined) => {
            const key = optionId || inputId; // Use optionId if present, otherwise fall back to inputId
            let timeString = '';

            // Logging to debug
            console.log('inputId:', inputId);
            console.log('optionId:', optionId);
            console.log('selectedTime:', selectedTime);

            // Check if selectedTime is valid
            if (!selectedTime) {
                console.error('Error: selectedTime is undefined or null');
                return; // Exit early if there's no selected time
            }

            // If selectedTime is a Date object, format it to 'h:mm A' string (e.g., '8:30 PM')
            if (selectedTime instanceof Date) {
                const hours = selectedTime.getHours();
                const minutes = selectedTime.getMinutes();
                const isPM = hours >= 12;
                const formattedHours = isPM ? hours % 12 || 12 : hours; // Handle 12-hour format
                const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes; // Ensure 2-digit minutes
                timeString = `${formattedHours}:${formattedMinutes} ${isPM ? 'PM' : 'AM'}`;

                // Log the formatted time string
                console.log('Formatted Time String:', timeString);
            } else if (typeof selectedTime === 'string') {
                // If it's a string, use it directly (just for safety)
                timeString = selectedTime;
                console.log('Time as string:', timeString); // Log string if provided as input
            } else {
                console.error('Error: selectedTime is not a valid Date or string');
                return; // Exit early if selectedTime is neither a Date nor a string
            }

            // Split and parse the time string into hours and minutes
            const [time, period] = timeString.split(' ');
            console.log('Split Time:', time, 'Period:', period); // Log the split result

            if (time) {
                const [hoursStr, minutes] = time.split(':');
                let hours = parseInt(hoursStr);

                // Log parsed hours and minutes before conversion
                console.log('Parsed Hours:', hours, 'Parsed Minutes:', minutes);

                if (period?.toLowerCase() === 'pm' && hours !== 12) {
                    hours += 12; // Convert PM times to 24-hour format
                } else if (period?.toLowerCase() === 'am' && hours === 12) {
                    hours = 0; // Midnight case
                }

                // Log final converted hours and minutes in 24-hour format
                console.log('Converted Hours (24-hour format):', hours, 'Minutes:', minutes);

                interface TimeSelection {
                    [key: string]: {
                        time: string;
                        hours: number;
                        minutes: number;
                    };
                }

                // Update the state with parsed hours and minutes
                setTimeSelection((prev: TimeSelection) => ({
                    ...prev,
                    [key]: {
                        time: timeString,
                        hours,
                        minutes: parseInt(minutes) || 0, // Ensure minutes is a number
                    },
                }));
                console.log(time)
            } else {
                console.log('Error: Time string is invalid or could not be parsed.');
            }
        };

        const handleToggleExpirable = () => {
            setIsExpirable(prev => (prev === 'yes' ? 'no' : 'yes'));
        };

        // Handle form submission
        const convertToHoursString = (value: string | null): string | null => {
            if (value === null || isNaN(Number(value))) {
                return null; // Return null if value is not a number or is null
            }
            return (Number(value) * 24).toString(); // Multiply by 24 and convert back to string
        };

        // Function to process each option and return it in the desired structure
        // const processOption = (inputId: string, option: any): any => {
        //     const optionId = option.id;

        //     return {
        //         inputId: inputId, // Use inputId from filteredJson
        //         optionId: optionId, // Use optionId from option

        //         // Fetch values from the state based on optionId
        //         taskNumber: selectedTaskNumbers[optionId] || null,
        //         taskTiming: taskTiming[optionId] || null,
        //         taskType: selectedTaskTypes[optionId] || null,

        //         // Check for taskTiming based on optionId and convert day selection accordingly
        //         daySelection: taskTiming[optionId] === 'day' ? convertToHoursString(daySelection[optionId]) : null,
        //     };
        // };

        // Function to flatten nested arrays and process options into a single array
        // const flattenAndProcessOptions = (inputId: string, options: any): any[] => {
        //     const flatOptions: any[] = [];

        //     // Function to recursively flatten options
        //     const flatten = (opt: any) => {
        //         if (Array.isArray(opt)) {
        //             opt.forEach(item => flatten(item));
        //         } else {
        //             flatOptions.push(processOption(inputId, opt)); // Process and add each option to the flat array
        //         }
        //     };

        //     flatten(options); // Start flattening
        //     return flatOptions; // Return the final flat array
        // };


        const handleSaveChanges = async () => {
            if (selectedTask && selectedEmployee) {
                if (!filteredJson) {
                    console.error("No valid data found in filteredJson.");
                    return;
                }

                // Initialize the conditionJson array
                const conditionJson: Array<{
                    inputId: string;
                    optionId: string;
                    taskNumber: string | null;
                    taskTiming: string | null;
                    taskType: string | null;
                    daySelection: string | null;
                }> = [];

                // Function to process condition entries
                const processConditionEntry = (
                    key: string,
                    timingType: string | null,
                    selectedDays: string[],
                    hoursString: string | null,
                    optionId?: string
                ) => {
                    const selectedTime = timeSelection[key]?.time || ''; // Get the time value from timeSelection

                    // Log values to debug
                    console.log('Timing Type:', timingType);
                    console.log('Selected Days:', selectedDays);
                    console.log('Hours String:', hoursString);
                    console.log('Selected Time:', selectedTime);

                    // Initialize hours and minutes
                    let formattedTime = '';
                    if (selectedTime) {
                        // Split and parse the time string
                        const [time, period] = selectedTime.split(' ');
                        const [hoursStr, minutes] = time.split(':');
                        let hours = parseInt(hoursStr);

                        // Convert to 24-hour format
                        if (period?.toLowerCase() === 'pm' && hours !== 12) {
                            hours += 12; // Convert PM times to 24-hour format
                        } else if (period?.toLowerCase() === 'am' && hours === 12) {
                            hours = 0; // Midnight case
                        }

                        // Format the time string for output
                        formattedTime = `${hours}:${minutes}`; // e.g., "14:30" for 2:30 PM
                    }

                    // Combine weekdays and formatted time for the 'weekday' timing
                    const daySelectionValue = timingType === 'weekday'
                        ? `${selectedDays.join(', ')}-${formattedTime}`
                        : hoursString;

                    // Log the final daySelectionValue before pushing to conditionJson
                    console.log('Day Selection Value:', daySelectionValue);

                    conditionJson.push({
                        inputId: key,  // Use inputId from filteredJson
                        optionId: optionId || "", // Use optionId or default to an empty string
                        taskNumber: selectedTaskNumbers[key] || null,
                        taskTiming: timingType,
                        taskType: selectedTaskTypes[key] || null,
                        daySelection: daySelectionValue // Set to either selected weekdays and time, or converted hours
                    });
                };

                // Process the options if they exist
                if (filteredJson.options && filteredJson.options.length > 0) {
                    filteredJson.options.forEach(option => {
                        const key = option.id; // Use the inputId from the option
                        const timingType = taskTiming[key]; // Get the timing type
                        const selectedDays = weekdaySelection[key] || []; // Get the selected weekdays
                        const hoursString = timingType === 'day' ? convertToHoursString(daySelection[key]) : null;

                        // Call the function to process the condition entry
                        processConditionEntry(key, timingType, selectedDays, hoursString, option.id);
                    });
                } else {
                    // Handle the case when there are no options
                    const key = filteredJson.inputId; // Use the key from filteredJson
                    const timingType = taskTiming[key]; // Get the timing type
                    const selectedDays = weekdaySelection[key] || []; // Get the selected weekdays
                    const hoursString = timingType === 'day' ? convertToHoursString(daySelection[key]) : null;

                    // Call the function to process the condition entry with no optionId
                    processConditionEntry(key, timingType, selectedDays, hoursString);
                }

                // Prepare and send the payload if task and employee are selected
                if (selectedTask && selectedEmployee) {
                    const selectedEmployeeObj = employees.find(emp => emp.empId === selectedEmployee);
                    const conditionJsonString = JSON.stringify(conditionJson); // Convert conditionJson to string as expected by the API

                    const payload = {
                        id: selectedTask.id,
                        moduleID: selectedTask.moduleID,
                        moduleName: selectedTask.moduleName,
                        processID: selectedTask.processID,
                        processName: selectedTask.processName,
                        roleId: selectedTask.roleId,
                        roleName: selectedTask.roleName,
                        doerId: selectedEmployee, // The employee ID assigned to this task
                        doerName: selectedEmployeeObj?.employeeName || "", // Use employeeName from the selected object
                        task_Json: selectedTask.task_Json,
                        task_Number: selectedTask.task_Number,
                        task_Status: 1,
                        createdBy: "Himanshu Pant",
                        finishPoint: selectedTask.finishPoint,
                        updatedBy: "Himanshu Pant",
                        condition_Json: conditionJsonString, // Send the stringified conditionJson
                        isExpired: isExpirable === 'yes' ? 1 : 0,
                    };

                    console.log("Payload being sent:", payload);

                    try {
                        const response = await axios.post('https://arvindo-api.clay.in/api/ProcessTaskMaster/InsertUpdateProcessTaskandDoer', payload);
                        console.log("Data successfully posted.");
                        setSelectedConditionTask("");
                        handleClose();
                        console.log(response);
                    } catch (error) {
                        console.error("Error posting data:", error);
                    }
                }
            }
        };

        const [isExpirable, setIsExpirable] = useState('no'); // Global state for task expirable (Yes/No)

        // Handler for toggling global expirable state

        return (
            <Modal size="lg" show={showModalone} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Conditions Form</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group row" style={{ marginTop: '10px' }}>
                        <div className="col-12">
                            <label>Is Task Expirable?</label>
                            <div>
                                <button
                                    type="button"
                                    className={`toggle-btn ${isExpirable === 'yes' ? 'active-btn' : 'normal-btn'}`}
                                    onClick={handleToggleExpirable}
                                >
                                    {isExpirable === 'yes' ? 'Yes' : 'No'}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="form-group row" style={{ marginTop: '10px' }}>
                        <div className="col-4">
                            <label>Select Applicable Custom logic</label>
                            <select className='form-control'>
                                <option>
                                    Sunday Logic
                                </option>
                            </select>
                        </div>
                    </div>

                    {filteredJson ? (
                        <>
                            <form className='form-group'>
                                {filteredJson.type !== "select" && (
                                    <div className='col-12'>
                                        {/* <div className="form-group">
                                            <label htmlFor="">Select Successor Task For Input Labeled with <label>{filteredJson.label}</label></label>
                                            <select className='form-control' onChange={(e) => handleNextTask(filteredJson.inputId, e.target.value)}>
                                                {tasks
                                                    .filter(task => task.task_Number !== selectedConditionTask) // Exclude selectedConditionTask
                                                    .map(task => (
                                                        <option key={task.id} value={task.task_Number}>
                                                            {task.task_Number}
                                                        </option>
                                                    ))
                                                }
                                            </select>
                                        </div> */}

                                        {filteredJson ? (
                                            <div className="form-group row" key={filteredJson.inputId} style={{ marginTop: '10px' }}>
                                                {/* Display the Label */}
                                                <div className="col-4">
                                                    <label>
                                                        Select Successor Task for <span>{filteredJson.label}</span>
                                                    </label>

                                                    {/* Select Task Number */}
                                                    <select
                                                        className="form-control"
                                                        value={selectedTaskNumbers[filteredJson.inputId] || ''} // Reference inputId for state management
                                                        onChange={(e) => handleTaskNumberChange(filteredJson.inputId, e.target.value)}
                                                    >
                                                        <option value="" disabled>Select Task Number</option>
                                                        <option value="updateMaster">Update Master</option>

                                                        {/* Filter tasks based on task_Number */}
                                                        {tasks
                                                            .filter(task => task.task_Number !== selectedConditionTask) // Exclude selectedConditionTask
                                                            .map(task => (
                                                                <option key={task.id} value={task.task_Number}>
                                                                    {task.task_Number}
                                                                </option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>

                                                {/* Select Task Type */}
                                                <div className="col-4">
                                                    <label htmlFor="">Task Type</label>
                                                    <select
                                                        className="form-control"
                                                        value={selectedTaskTypes[filteredJson.inputId] || ''} // Use inputId for selecting Task Type
                                                        onChange={(e) => handleTaskTypeChange(filteredJson.inputId, null, e.target.value)}
                                                    >
                                                        <option value="" disabled>Select task type</option>
                                                        <option value="Actual">Actual</option>
                                                        <option value="Planned">Planned</option>
                                                    </select>
                                                </div>

                                                {/* Toggle Task Timing */}
                                                <div className="form-group col-4">
                                                    <label>Task Timing</label>
                                                    <div>
                                                        <button
                                                            type="button"
                                                            className={`toggle-btn ${taskTiming[filteredJson.inputId] === 'day' ? 'active-btn' : 'normal-btn'}`}
                                                            onClick={() => handleTaskTimingChange(filteredJson.inputId, null, 'day')} // Pass `null` for `optionId` if it isn't available
                                                        >
                                                            Day
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className={`toggle-btn ${taskTiming[filteredJson.inputId] === 'weekday' ? 'active-btn' : 'normal-btn'}`}
                                                            onClick={() => handleTaskTimingChange(filteredJson.inputId, null, 'weekday')} // Ensure all 3 arguments are passed
                                                        >
                                                            Weekday
                                                        </button>

                                                    </div>

                                                    {/* Conditional Rendering for Day or Weekday selection */}
                                                    {taskTiming[filteredJson.inputId] === 'day' ? (
                                                        <div>
                                                            <label>Enter number of days</label>
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                value={daySelection[filteredJson.inputId] || ''}
                                                                onChange={(e) => handleDaySelectionChange(filteredJson.inputId, null, e.target.value)}
                                                                min="1"
                                                                placeholder="Enter days"
                                                            />
                                                        </div>
                                                    ) : taskTiming[filteredJson.inputId] === 'weekday' ? (
                                                        <div>
                                                            <label>Select weekdays</label>
                                                            <select
                                                                className="form-control"
                                                                multiple
                                                                value={weekdaySelection[filteredJson.inputId] || []} // Make sure the value comes from the state
                                                                onChange={(e) =>
                                                                    handleWeekdaySelectionChange(
                                                                        filteredJson.inputId,
                                                                        null, // Pass null for optionId if it's not being used
                                                                        Array.from(e.target.selectedOptions, option => option.value) // Convert selected options to an array of values
                                                                    )
                                                                }
                                                            >
                                                                <option value="mon">Monday</option>
                                                                <option value="tue">Tuesday</option>
                                                                <option value="wed">Wednesday</option>
                                                                <option value="thu">Thursday</option>
                                                                <option value="fri">Friday</option>
                                                                <option value="sat">Saturday</option>
                                                                <option value="sun">Sunday</option>
                                                            </select>

                                                            <label>Select time</label>
                                                            <CustomFlatpickr
                                                                value={timeSelection[filteredJson.inputId]?.time || ''} // Ensure there's a valid value
                                                                onChange={(value) => {
                                                                    if (value && value.length > 0) {
                                                                        handleTimeChange(filteredJson.inputId, null, value[0]); // Pass the first value from the array
                                                                    } else {
                                                                        console.warn('No time selected or invalid value');
                                                                    }
                                                                }}
                                                                options={{
                                                                    enableTime: true,
                                                                    noCalendar: true,
                                                                    dateFormat: 'h:i K',
                                                                }}
                                                            />

                                                            {timeSelection[filteredJson.inputId] && (
                                                                <div>
                                                                    <strong>Selected Time:</strong>{' '}
                                                                    {`${timeSelection[filteredJson.inputId].hours} hours and ${timeSelection[filteredJson.inputId].minutes} mins`}
                                                                </div>
                                                            )}
                                                        </div>

                                                    ) : null}
                                                </div>
                                            </div>
                                        ) : (
                                            <p>No input data available</p>
                                        )}



                                    </div>
                                )}

                                {/* <select className='form-control'>
                                    {filteredJson.options.map(option => (
                                        <option key={option.id} value={option.id} style={{ color: option.color }}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select> */}

                                {filteredJson.options.map(option => (
                                    <div className='form-group row' key={option.id} style={{ marginTop: '10px' }}>
                                        <div className="col-4">
                                            <label>
                                                Select Successor Task For <span style={{ color: option.color }}>{option.label}</span>

                                            </label>
                                            <select
                                                className='form-control'
                                                value={selectedTaskNumbers[option.id] || ''}
                                                onChange={(e) => handleTaskNumberChange(option.id, e.target.value)}
                                            >
                                                <option value="" disabled>Select Task Number</option>
                                                <option value="updateMaster">Update Master</option>

                                                {/* Filter tasks to exclude the selectedConditionTask value */}
                                                {tasks
                                                    .filter(task => task.task_Number !== selectedConditionTask) // Exclude selectedConditionTask
                                                    .map(task => (
                                                        <option key={task.id} value={task.task_Number}>
                                                            {task.task_Number}
                                                        </option>
                                                    ))
                                                }
                                            </select>

                                        </div>
                                        <div className="col-3">
                                            <label htmlFor="">Task Type</label>
                                            <select
                                                className='form-control'
                                                value={selectedTaskTypes[option.id] || ''}
                                                onChange={(e) => handleTaskTypeChange(filteredJson.inputId, option.id, e.target.value)}

                                            >
                                                <option value="" disabled>Select task type</option>
                                                <option value="Actual">Actual</option>
                                                <option value="Planned">Planned</option>
                                            </select>
                                        </div>

                                        {/* Toggle button for Task Timing */}
                                        <div className="form-group col-5">
                                            <label>Task Timing</label>
                                            <div>
                                                <button
                                                    type="button"
                                                    className={`toggle-btn ${taskTiming[option.id] === 'day' ? 'active-btn' : 'normal-btn'}`}
                                                    onClick={() => handleTaskTimingChange(filteredJson.inputId, option.id, 'day')}
                                                >
                                                    Day
                                                </button>
                                                <button
                                                    type="button"
                                                    className={`toggle-btn ${taskTiming[option.id] === 'weekday' ? 'active-btn' : 'normal-btn'}`}
                                                    onClick={() => handleTaskTimingChange(filteredJson.inputId, option.id, 'weekday')}
                                                >
                                                    Weekday
                                                </button>
                                            </div>

                                            {/* Conditional rendering for Day or Weekday selection */}
                                            {taskTiming[option.id] === 'day' ? (
                                                <div>
                                                    <label>Enter number of days</label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        value={daySelection[option.id] || ''}
                                                        onChange={(e) => handleDaySelectionChange(filteredJson.inputId, option.id, e.target.value)}
                                                        min="1"
                                                        placeholder="Enter days"
                                                    />
                                                </div>
                                            ) : taskTiming[option.id] === 'weekday' ? (
                                                <div className='form-group row'>
                                                    <div className='form-group col-6'>
                                                        <label>Select weekdays</label>
                                                        <select
                                                            className="form-control"
                                                            multiple
                                                            value={weekdaySelection[option.id] || []}
                                                            onChange={(e) =>
                                                                handleWeekdaySelectionChange(filteredJson.inputId,
                                                                    option.id,
                                                                    Array.from(e.target.selectedOptions, option => option.value)
                                                                )
                                                            }
                                                        >
                                                            <option value="mon">Monday</option>
                                                            <option value="tue">Tuesday</option>
                                                            <option value="wed">Wednesday</option>
                                                            <option value="thu">Thursday</option>
                                                            <option value="fri">Friday</option>
                                                            <option value="sat">Saturday</option>
                                                            <option value="sun">Sunday</option>
                                                        </select>
                                                    </div>
                                                    <div className='form-group col-6'>
                                                        <label>Select time</label>
                                                        <CustomFlatpickr
                                                            value={timeSelection[filteredJson.inputId]?.time || ''} // Ensure there's a valid value
                                                            onChange={(value) => {
                                                                if (value && value.length > 0) {
                                                                    handleTimeChange(filteredJson.inputId, null, value[0]); // Pass the first value from the array
                                                                } else {
                                                                    console.warn('No time selected or invalid value');
                                                                }
                                                            }}
                                                            options={{
                                                                enableTime: true,
                                                                noCalendar: true,
                                                                dateFormat: 'h:i K',
                                                            }}
                                                        />
                                                        {timeSelection[filteredJson.inputId] && (
                                                            <div>
                                                                <strong>Selected Time:</strong>{' '}
                                                                {`${timeSelection[filteredJson.inputId].hours} hours and ${timeSelection[filteredJson.inputId].minutes} mins`}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                ))}
                            </form>
                        </>
                    ) : (
                        <p>No data found for the selected inputId.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveChanges}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

        );
    };

    const [showModalone, setShowModalone] = useState(false);

    interface Employee {
        empId: string;
        employeeName: string;
    }

    // Function to handle opening the modal
    // Fetch the related JSON when the modal is opened
    useEffect(() => {
        if (showModalone && selectedTask) {
            fetchJsonByInputId(selectedTask);
        }
    }, [showModalone, selectedTask]);

    const handleShow = async (task: AccountProcessTask) => {
        setSelectedTask(task);
        setShowModalone(true);
    };

    type TaskJson = {
        formId: string;
        formName: string;
        inputs: Array<{
            inputId: string;
            type: string;
            label: string;
            placeholder: string;
            required: boolean;
            value: string;
        }>;
    };

    const handleClose = () => setShowModalone(false);


    const fetchJsonByInputId = async (task: AccountProcessTask) => {
        if (tasks.length > 0) {
            const taskWithJson = tasks.find(t => t.id === task.id && t.finishPoint); // Get the task that has a finishPoint

            if (taskWithJson) {
                try {
                    // Parse the task_Json from string to an object
                    const taskJsonParsed = JSON.parse(taskWithJson.task_Json);
                    // Access the 'inputs' array from the parsed JSON
                    const inputsArray = taskJsonParsed.inputs;
                    setSelectedConditionTask(taskWithJson.task_Number)

                    // Debug each comparison
                    const inputField = inputsArray.find((field: any) => String(field.inputId) === String(taskWithJson.finishPoint));

                    // If inputField is found, set it to the state
                    setFilteredJson(inputField || null);
                } catch (error) {
                    console.error("Error parsing task_Json:", error);
                }
            }
        }
    };

    // const [selectedEmployeeName, setSelectedEmployeeName] = useState<string | null>(null);

    useEffect(() => {
        // Retrieve employee name and ID from localStorage when the component mounts
        const storedEmpId = localStorage.getItem('selectedEmpId');
        const storedEmpName = localStorage.getItem('selectedEmpName');
        if (storedEmpId && storedEmpName) {
            setSelectedEmployee(storedEmpId);
            // setSelectedEmployeeName(storedEmpName);
        }
    }, []);


    // const handleEmployeeChange = (selectedOption: any) => {
    //     if (selectedOption) {
    //         const selectedEmployeeObj = employees.find(emp => emp.empId === selectedOption.value);
    //         if (selectedEmployeeObj) {
    //             setSelectedEmployee(selectedEmployeeObj.empId);
    //             setSelectedEmployeeName(selectedEmployeeObj.employeeName);

    //             // Store selected employee details in localStorage
    //             localStorage.setItem('selectedEmpId', selectedEmployeeObj.empId);
    //             localStorage.setItem('selectedEmpName', selectedEmployeeObj.employeeName);
    //         }
    //     }
    // };


    // Fetch the related JSON when the modal is opened
    useEffect(() => {
        if (showModalone && selectedTask) {
            fetchJsonByInputId(selectedTask);
        }
    }, [showModalone, selectedTask]);

    // Fetch Processes based on selected module
    useEffect(() => {
        if (selectedModule) {
            const fetchProcesses = async () => {
                try {
                    const response = await axios.get(`https://arvindo-api2.clay.in/api/CommonDropdown/GetProcessNameByModuleName?ModuleName=${selectedModule}`);
                    if (response.data.isSuccess) {
                        setProcesses(response.data.processListResponses);
                    }
                } catch (error) {
                    console.error('Error fetching processes', error);
                }
            };
            fetchProcesses();
        }
    }, [selectedModule]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                let response;

                if (selectedModule != "" && selectedProcess != "") {
                    // API call when both `selectedModule` and `selectedProcess` are selected
                    response = await axios.get(`https://arvindo-api.clay.in/api/ProcessTaskMaster/GetProcessTaskByIds?Flag=2&ModuleId=${selectedModuleId}&ProcessId=${selectedProcess}`);
                    console.log(selectedModuleId, selectedProcess)
                } else {
                    // Default API call when neither `selectedModule` nor `selectedProcess` is selected
                    response = await axios.get(`https://arvindo-api.clay.in/api/ProcessTaskMaster/GetProcessTaskByIds?Flag=1`);
                    console.log(selectedModule, selectedProcess)
                }

                // Check if API response is successful
                if (response.data.isSuccess) {
                    setTasks(response.data.getProcessTaskByIds);
                    console.log("Fetched tasks:", response.data.getProcessTaskByIds);
                } else {
                    console.error('Failed to fetch tasks:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        // Fetch tasks whenever the component mounts and when `selectedModule` or `selectedProcess` changes
        fetchTasks();

    }, [selectedModule, selectedProcess]);




    // useEffect(() => {
    //     if (selectedModule && selectedProcess) {
    //         const fetchTasks = async () => {
    //             try {
    //                 const response = await axios.get(`https://arvindo-api.clay.in/api/ProcessTaskMaster/GetProcessTaskByIds?Flag=1&ModuleID=${selectedModule}&ProcessId=${selectedProcess}`);
    //                 if (response.data.isSuccess) {
    //                     setTasks(response.data.getProcessTaskByIds);

    //                 }
    //             } catch (error) {
    //                 console.error('Error fetching tasks', error);
    //             }
    //         };
    //         fetchTasks();
    //     }
    // }, [selectedModule, selectedProcess]);

    // Fetch Employees and Roles when assigning task

    // Fetch Doers based on the selected role
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get(`https://arvindo-api2.clay.in/api/CommonDropdown/GetEmployeeListWithId`);
                if (response.data.isSuccess) {
                    setEmployees(response.data.employeeLists);
                } else {
                    console.error("Failed to fetch employees");
                }
            } catch (error) {
                console.error("Error fetching employees:", error);
            }
        };

        fetchEmployees();
    }, []);

    const handleAssigndoer = (task: AccountProcessTask) => {
        setSelectedTask(task);
        setShowModal(true); // Show modal
    };

    // Handle employee change in the Select dropdown
    const handleEmployeeChange = (selectedOption: any) => {
        setSelectedEmployee(selectedOption ? selectedOption.value : null);
    };

    const handleAssign = () => {
        if (selectedTask && selectedEmployee) {
            // Find the selected employee object to get the employee name
            const selectedEmployeeObj = employees.find(emp => emp.empId === selectedEmployee);

            if (!selectedEmployeeObj) {
                console.error('Selected employee not found.');
                return;
            }

            // Update assignedTasks for each task uniquely
            // if (selectedRole !== null) {
            //     setAssignedTasks(
            //         new Map(assignedTasks).set(selectedTask.id, {
            //             employeeId: selectedEmployee,
            //             roleId: selectedRole,
            //         })
            //     );
            // }

            const payload = {
                id: selectedTask.id ? selectedTask.id : 0, // Ensure this ID matches the task
                moduleID: selectedTask.moduleID,
                moduleName: selectedTask.moduleName,
                processID: selectedTask.processID,
                processName: selectedTask.processName,
                roleName: selectedTask.roleName, // Use role name from selected task
                roleId: selectedTask.roleId,
                doerId: selectedEmployee, // The employee ID assigned to this task
                doerName: selectedEmployeeObj.employeeName, // Use employeeName from the selected object
                task_Number: selectedTask.task_Number,
                task_Json: selectedTask.task_Json,
                condition_Json: "string",
                isExpired: 0,
                finishPoint: selectedTask.finishPoint,
                task_Status: 1, // Set task status as true (active or assigned)
                createdBy: 'sameer hussain',
                updatedBy: 'sameer hussain',
            };

            const assignTask = async () => {
                try {
                    const response = await axios.post('https://arvindo-api.clay.in/api/ProcessTaskMaster/InsertUpdateProcessTaskandDoer', payload);

                    if (response.data.isSuccess) {
                        console.log('Task assigned successfully');
                    } else {
                        console.error('Failed to assign task');
                    }
                } catch (error) {
                    console.log('Payload:', payload);
                    console.error('Error assigning task', error);
                }
            };

            assignTask();
        } else {
            console.error('Please select a task and an employee before assigning.');
        }

        setShowModal(false);
    };

    const extractInputValue = (taskJson: string, inputId: string): string => {
        try {
            const parsedJson: TaskJson = JSON.parse(taskJson);
            const inputField = parsedJson.inputs.find(input => input.inputId === inputId);
            return inputField ? inputField.label || inputField.value : '';
        } catch (error) {
            console.error('Error parsing task_Json:', error);
            return '';
        }
    };

    const handleApplyProcessToProject = async () => {
        if (selectedProject && selectedTask) {
            const payload = {
                projectId: selectedProject,
                projectName: projects.find((project) => project.id === selectedProject)?.projectName || '',
                moduleId: selectedTask.moduleID,
                processId: selectedTask.processID,
                createdBy: 'sameer',
                taskStatus: 1,
            }

            console.log(payload)

            try {
                const response = await axios.post('https://arvindo-api.clay.in/api/ProcessTaskMaster/ProcessAssignWithProject', payload);
                if (response.data.isSuccess) {
                    console.log('Process assigned to project successfully');
                } else {
                    console.error('Failed to assign process to project');
                }
            } catch (error) {
                console.error('Error assigning process to project', error);
            }

            setShowApplyModal(false);
        } else {
            alert('Please select a project and task before applying.');
        }
    }

    // Fetch Projects
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get('https://arvindo-api2.clay.in/api/CommonDropdown/GetProjectList');
                if (response.data.isSuccess) {
                    setProjects(response.data.projectListResponses);
                }
            } catch (error) {
                console.error('Error fetching projects', error);
            }
        };
        fetchProjects();
    }, []);

    return (
        <div>
            <div className="d-flex p-2 bg-white mt-2 mb-2 rounded shadow">Apply Process on Project</div>
            <div className="row m-0 align-items-end bg-white p-3 rounded shadow">
                <Form.Group className="col-md-4 my-1" controlId="moduleSelect">
                    <Form.Label>Select Module</Form.Label>
                    <Form.Control
                        as="select"
                        value={selectedModule}  // This holds the selected moduleName
                        onChange={(e) => {
                            const selectedModuleName = e.target.value;
                            const selectedModuleData = modules.find(module => module.moduleName === selectedModuleName);

                            setSelectedModule(selectedModuleName);  // Store moduleName
                            if (selectedModuleData) {
                                setSelectedModuleId(selectedModuleData.moduleID);  // Store moduleID
                            }
                        }}
                    >
                        <option value="">Select a module</option>
                        {modules.map((module) => (
                            <option key={module.moduleID} value={module.moduleName}>  {/* Use moduleName as value */}
                                {module.moduleName}  {/* Display moduleName */}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="processSelect" className="col-md-4 my-1">
                    <Form.Label>Select Process</Form.Label>
                    <Form.Control
                        as="select"
                        value={selectedProcess}
                        onChange={(e) => setSelectedProcess(e.target.value)}
                        disabled={!selectedModule}
                    >
                        <option value="">Select a process</option>
                        {processes.map((process) => (
                            <option key={process.processID} value={process.processID}>
                                {process.processName}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>
                <div className="bg-white rounded d-flex justify-content-end col-md-4 my-1">
                    <Button variant="primary" onClick={() => setShowApplyModal(true)}>
                        Apply Process to Project
                    </Button>
                    <Modal show={showApplyModal} onHide={() => setShowApplyModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Apply Process to Project</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Group controlId="projectSelect">
                                <Form.Label>Select Project</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={selectedProject}
                                    onChange={(e) => setSelectedProject(e.target.value)}
                                >
                                    <option value="">Select a project</option>
                                    {projects.map((project) => (
                                        <option key={project.id} value={project.id}>
                                            {project.projectName}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowApplyModal(false)}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={handleApplyProcessToProject}>
                                Apply
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>

            <div className="d-flex p-2 bg-white mt-3 rounded shadow">Task List</div>
            <div className="bg-white p-3 rounded shadow">
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Sr. No</th>
                            <th>Module</th>
                            <th>Process</th>
                            <th>Task Number</th>
                            <th>Role Name</th>
                            <th className='d-none'>Doer Name</th>
                            <th>Task Name</th>
                            <th>Conditions</th>
                            <th className='d-none'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task, index) => {
                            // const assignedTask = assignedTasks.get(task.id);
                            // const doerName = assignedTask ? employees.find((employee) => employee.empID === assignedTask.employeeId)?.empName : 'Select Doer';
                            const taskName = extractInputValue(task.task_Json, '99');
                            return (
                                <tr key={task.id}>
                                    <td>{index + 1}</td>
                                    <td>{task.moduleName}</td>
                                    <td>{task.processName}</td>
                                    <td>{task.task_Number}</td>
                                    <td>{task.roleName}</td>
                                    <td>{taskName}</td>
                                    {/* <td>{selectedEmployeeObj.employeeName}</td> */}
                                    {/* <td>{doerName}</td> */}
                                    <td className='d-none'>{task.doerName}</td>
                                    <td>
                                        <Button variant='primary' onClick={() => handleShow(task)}>
                                            Conditions
                                        </Button>
                                    </td>
                                    <td className='d-none'>
                                        <Button
                                            variant="primary"
                                            onClick={() => handleAssigndoer(task)} // Open the modal for assigning doer
                                        >
                                            {task.doerName === "" ? "Select Doer" : "Update Doer"}
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>

                </Table>
            </div>

            <ModalForm
                showModalone={showModalone}
                handleClose={handleClose}
                filteredJson={filteredJson}
            />

            {/* <Modal show={showModalone} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Conditions Form</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {filteredJson ? (
                        <pre>{JSON.stringify(filteredJson, null, 2)}</pre>
                    ) : (
                        <p>No data found for the selected inputId.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal> */}


            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Assign Role and Employee</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mt-3">
                        <Form.Label>Assign Employee</Form.Label>
                        <Select
                            value={employees
                                .map(employee => ({ value: employee.empId, label: employee.employeeName }))
                                .find(option => option.value === selectedEmployee)
                            }
                            onChange={handleEmployeeChange}
                            options={employees.map(employee => ({
                                value: employee.empId,
                                label: employee.employeeName,
                            }))}
                            placeholder="Select an employee"
                            isSearchable
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleAssign}>
                        Assign
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default AccountProcessTable;