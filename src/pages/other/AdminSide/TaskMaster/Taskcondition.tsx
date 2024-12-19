import { Form, Modal, Col, Row, Button, Card } from "react-bootstrap";
import axios from "axios";
import config from "@/config";
import { useEffect, useState } from "react";
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_green.css';
import { format } from 'date-fns';
import { toast } from "react-toastify";



interface ProcessCanvasProps {
    show: boolean;
    setShow: (show: boolean) => void;
    taskID: number;
}


interface TaskData {
    id: number;
    moduleID: string;
    moduleName: string;
    processID: string;
    processName: string;
    roleId: string;
    roleName: string;
    task_Json: string; // JSON string
    task_Number: string;
    task_Status: number;
    problem_Solver: string;
    finishPoint: number;
    condition_Json: string; // JSON string
    isExpired: number;
    template_Json: string; // JSON string
    condition_Template_Json: string; // JSON string
    approval_Console: string;
    approvalConsoleDoerID: string;
    approvalConsoleDoerName: string;
    approvalConsoleInputID: number;
    createdBy: string;
    createdDate: string; // ISO 8601 date string
    updatedBy: string;
    updatedDate: string; // ISO 8601 date string
    task_Name: string;
}


interface TaskOption {
    task_Number: string;
    task_Label: string;
}
interface GetTypeDayTimeList {
    id: number;
    name: string;
}

interface Option {
    id: string;
    inputId: string;
    optionId?: string;
    label?: string;
    color?: string;
    taskNumber?: string;
    taskTiming?: string;
    taskType?: string;
    WeekDay?: string;
    time?: string;
}

interface FormData {
    isExpirable: any; // 0 or 1
    expirationDate: string | null; // ISO 8601 string or null
    sundayLogic: string | null; // Selected value for Sunday logic
    taskSelections: {
        taskNumber?: string;
        taskType?: string;
        taskTiming?: string;
        Day?: string;
        WeekDay?: string;
        time?: string;
    };
}
interface TaskSelections {
    optionId?: string;
    inputId?: string;
    taskNumber?: string;
    taskType?: string;
    taskTiming?: string;
    Day?: string;
    WeekDay?: string;
    time?: string;
}


const TaskCondition: React.FC<ProcessCanvasProps> = ({ show, setShow, taskID }) => {
    const [ModuleId, setModuleId] = useState<string>('');
    const [ProcessId, setProcessId] = useState<string>('');
    const [parseData, setParseData] = useState<any>(''); // Use `any` or the appropriate type here
    const [parseDataForSingle, setParseDataForsingle] = useState(false); // Use `any` or the appropriate type here
    const [sundayLogic, setSundayLogic] = useState<any>(''); // Use `any` or the appropriate type here
    const [isExpirable, setIsExpirable] = useState(0); // Default to 0 (No)
    const [expirationDate, setExpirationDate] = useState<string>(''); // Default to null (no date selected)
    const [tasks, setTasks] = useState<TaskData[]>([]);
    const [singleData, setSignleData] = useState<TaskData[]>([]); // Use an array of TaskData
    const [parseConditionData, setParseConditionData] = useState<FormData[]>([]);
    const [showNestedModal, setShowNestedModal] = useState(false);


    const [taskSelections, setTaskSelections] = useState(
        parseData?.options?.map((option: Option) => ({
            inputId: option.inputId,
            optionId: option.optionId || '',
            taskNumber: option.taskNumber || '',
            taskTiming: option.taskTiming || '',
            taskType: option.taskType || '',
            WeekDay: option.WeekDay || '',
            time: option.time || '',
            isExpirable: '',
        })) || []
    );


    useEffect(() => {
        if (parseData?.options && !parseDataForSingle) {
            const initialTaskSelections = parseData.options.map((option: Option) => ({
                inputId: option.id,
                optionId: option.id,
                color: option.color,
                label: option.label,
                taskNumber: '',
                taskType: '',
                taskTiming: '',
                Day: '',
                WeekDay: '',
                time: '',
            }));

            setTaskSelections(initialTaskSelections);
        }
    }, [parseData?.options, parseDataForSingle]);

    const [dropdownValuesFlag2, setDropdownValuesFlag2] = useState<GetTypeDayTimeList[]>([]);
    const [dropdownValuesFlag3, setDropdownValuesFlag3] = useState<GetTypeDayTimeList[]>([]);
    const [dropdownValuesFlag4, setDropdownValuesFlag4] = useState<GetTypeDayTimeList[]>([]);



    useEffect(() => {
        if (show && taskID) {
            const fetchProject = async () => {
                await fetchSingleDataById(taskID);
            };
            fetchProject();
        }
    }, [show, taskID]);

    const fetchSingleDataById = async (taskID: number) => {
        try {
            const response = await axios.get(`${config.API_URL_ACCOUNT}/ProcessTaskMaster/GetProcessTaskByIds`, {
                params: { id: taskID, flag: 3 }
            });
            if (response.data.isSuccess) {
                const fetchedModule = response.data.getProcessTaskByIds;
                setSignleData(Array.isArray(fetchedModule) ? fetchedModule : [fetchedModule]);
                if (fetchedModule.length > 0) {
                    setProcessId(fetchedModule[0].processID);
                    setModuleId(fetchedModule[0].moduleID);
                }
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching module:', error);
        }
    };


    useEffect(() => {
        if (singleData.length > 0 && singleData[0].task_Json) {
            const inputs = JSON.parse(singleData[0].task_Json).inputs || [];

            if (Array.isArray(inputs) && singleData[0]?.finishPoint) {
                // Check for 'select' type
                const resultOptionSelect = inputs.find(
                    (input: any) => input.inputId === singleData[0]?.finishPoint?.toString() && input.type === "select"
                );
                setParseData(resultOptionSelect || null);

                // Check for 'not select', 'radio', or 'multiselect' types
                const resultOptionNonSelect = inputs.find(
                    (input: any) => input.inputId === singleData[0]?.finishPoint?.toString() && input.type !== "select" && input.type !== "radio" && input.type !== "multiselect"
                );
                setParseDataForsingle(resultOptionNonSelect || null);
            } else {
                if (!Array.isArray(inputs)) {
                    console.error("inputs is not an array or is undefined");
                }
                if (!singleData[0]?.finishPoint) {
                    console.error("singleData.finishPoint is undefined or null");
                }
            }
        }
    }, [singleData]);




    const parseConditionJson = (singleData: TaskData[]) => {
        if (singleData.length > 0 && singleData[0].condition_Json) {
            const conditionJson = JSON.parse(singleData[0].condition_Json) || [];
            return conditionJson;
        }
        return [];
    };

    useEffect(() => {
        const conditionData = parseConditionJson(singleData);
        setParseConditionData(conditionData);
    }, [show, taskID, singleData]);


    useEffect(() => {
        const fetchProcessName = async () => {
            try {
                const response = await axios.get(`${config.API_URL_ACCOUNT}/ProcessTaskMaster/GetProcessTaskByIds?Flag=2&ModuleId=${ModuleId}&ProcessId=${ProcessId}`);
                if (response.data.isSuccess) {
                    setTasks(response.data.getProcessTaskByIds);
                } else {
                    console.error(response.data.message);
                }
            } catch (error) {
                console.error('Error fetching modules:', error);
            }
        };
        if (ModuleId && ProcessId) {
            fetchProcessName();
        }
    }, [ModuleId, ProcessId]);


    useEffect(() => {
        GetTypeDayTimeList(2, setDropdownValuesFlag2);
        GetTypeDayTimeList(3, setDropdownValuesFlag3);
        GetTypeDayTimeList(4, setDropdownValuesFlag4);
    }, []);

    const GetTypeDayTimeList = async (flag: any, setStateCallback: any) => {
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/CommonDropdown/GetTypeDayTimeList?flag=${flag}`);
            if (response.data.isSuccess) {
                setStateCallback(response.data.typeListResponses);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching modules:', error);
        }

    };



    const handleClose = () => {
        setShow(false);
        setShowNestedModal(false);
    };



    const handleChange = (index: number | null, field: string, value: any) => {
        const updatedSelections = [...taskSelections];

        if (index !== null) {
            updatedSelections[index] = {
                ...updatedSelections[index],
                [field]: value,
            };
        } else {
            updatedSelections[0] = {
                ...updatedSelections[0],
                [field]: value,
            };
        }

        setTaskSelections(updatedSelections);
    };


    const updateTaskSelection = (field: keyof TaskSelections, value: any) => {
        setTaskSelections((prevSelections: TaskSelections[]) => {
            const newSelections = prevSelections.length > 0 ? [...prevSelections] : [];

            if (newSelections.length > 0) {
                newSelections[0] = {
                    ...newSelections[0],
                    inputId: singleData[0]?.finishPoint?.toString(),
                    optionId: '',
                    [field]: value
                };
            } else {
                newSelections.push({
                    inputId: singleData[0]?.finishPoint?.toString(),
                    optionId: '',
                    [field]: value
                });
            }
            return [...newSelections];
        });
    };


    const handleChangeExpirable = (value: number) => {
        setIsExpirable(value);

        // If isExpirable is 0, clear expirationDate
        if (value === 0) {
            setExpirationDate("");  // Set expirationDate to an empty string
        }
    };

    const handleChangeExpirationDate = (date: any) => {
        // Set expirationDate only if isExpirable is not 0
        if (isExpirable !== 0) {
            setExpirationDate(date || "");
        }
    };

    // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();

    //     const conditionJsonFormatted = [

    //         {
    //             sundayLogic,
    //             isExpirable,
    //             expirationDate,
    //             taskSelections
    //         }
    //     ]

    //     const payload = {
    //         ...singleData[0],
    //         condition_Json: JSON.stringify(conditionJsonFormatted)

    //     };

    //     toast.info("This update will be applicable for the next cycle.");
    //     // alert("This Update will be Applicable for next Cycle")


    //     try {
    //         const apiUrl = `${config.API_URL_ACCOUNT}/ProcessTaskMaster/InsertUpdateProcessTaskandDoer`;
    //         const response = await axios.post(apiUrl, payload);

    //         if (response.status === 200) {
    //             const conditionData = parseConditionJson(singleData);
    //             setParseConditionData(conditionData);
    //             toast.success("Condition is set successfully!");
    //         } else {
    //             toast.error(response.data.message || "Failed to process request");
    //         }
    //     } catch (error: any) {
    //         const errorMessage =
    //             error.response?.data?.message || "An unexpected error occurred";
    //         toast.error(errorMessage);
    //         console.error("Error submitting process task:", error);
    //     }

    // };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const conditionJsonFormatted = [
            {
                sundayLogic,
                isExpirable,
                expirationDate,
                taskSelections,
            },
        ];

        const payload = {
            ...singleData[0],
            condition_Json: JSON.stringify(conditionJsonFormatted),
        };

        toast.warn(
            ({ closeToast }) => (
                <div>
                    <p>This update will be applicable for the next cycle. Confirm?</p>
                    <button onClick={async () => {
                        closeToast();
                        await submitPayload(payload);
                    }}
                        style={{ marginRight: "10px", backgroundColor: "green", color: "white", border: "none", padding: "5px 10px", cursor: "pointer", }}
                    >
                        Confirm
                    </button>
                    <button onClick={closeToast}
                        style={{ backgroundColor: "red", color: "white", border: "none", padding: "5px 10px", cursor: "pointer", }}
                    >
                        Cancel
                    </button>
                </div>
            ),
            { autoClose: false }
        );
    };

    const submitPayload = async (payload: any) => {
        try {
            const apiUrl = `${config.API_URL_ACCOUNT}/ProcessTaskMaster/InsertUpdateProcessTaskandDoer`;
            const response = await axios.post(apiUrl, payload);

            console.log(payload)
            if (response.status === 200) {
                const conditionData = parseConditionJson(singleData);
                setParseConditionData(conditionData);
                toast.success("Condition is set successfully!");
            } else {
                toast.error(response.data.message || "Failed to process request");
            }
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message || "An unexpected error occurred";
            toast.error(errorMessage);
            console.error("Error submitting process task:", error);
        }
    };


    const optionssundayLogic = [
        { value: 'Increase Planned day by 1 Day ', label: 'Increase Planned day by 1 Day ' },
        { value: 'Keep making task as per logic ', label: 'Keep making task as per logic ' },
        { value: 'SkipCSkip Creating task', label: 'Skip Creating task' }
    ];
    const ExpiryLogic = [
        { value: 'Expire On Next Task Initiation', label: 'Expire On Next Task Initiation' },
        { value: 'Expire On Defined Days', label: 'Expire On Defined Days' },
    ];
    const optionstaskType = [
        { value: 'Actual', label: 'Actual' },
        { value: 'Planned', label: 'Planned' }
    ];
    const optionsTaskNumber = [
        { value: 'Update Master', label: 'Update Master' },
        { value: 'End', label: 'End Process' }
    ];
    const optionsTaskTiming = [
        { value: 'Day', label: 'Day' },
        { value: 'WeekDay', label: 'Week Day' }
    ];

    const formattedTasks = tasks.map((task: TaskData) => ({
        task_Number: task.task_Number,
        task_Label: task.task_Number,
    }));
    const formattedOptionsTaskNumber = optionsTaskNumber.map((option) => ({
        task_Number: option.value,
        task_Label: option.label,
    }));

    const combinedOptions: TaskOption[] = [...formattedTasks, ...formattedOptionsTaskNumber];

    return (
        <div>
            <Modal size="xl" className="p-2" show={show} placement="end" onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title className="text-dark d-flex justify-content-between w-100">
                        Condition Data Overview
                        <Button variant="primary" className=" mr-2" onClick={() => setShowNestedModal((prev) => !prev)} >
                            {parseConditionData ? 'Edit Conditions' : 'Set Conditions'}
                        </Button>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Col lg={12} className="">
                        <Card.Body>
                            <ul className="list-group">
                                <li className="list-group-item py-1 d-flex justify-content-between align-items-center w-100">
                                    <span><strong>Is Expirable:</strong> {parseConditionData && parseConditionData[0]?.isExpirable === 1 ? "Yes" : "No"}</span>

                                </li>
                                {parseConditionData[0]?.isExpirable === 1 && (
                                    <li className="list-group-item">
                                        <strong>Expiration Date:</strong> {parseConditionData[0]?.expirationDate || "N/A"}
                                    </li>
                                )}
                                <li className="list-group-item">
                                    <strong>Sunday Logic:</strong> {parseConditionData[0]?.sundayLogic || "N/A"}
                                </li>
                                {parseConditionData[0]?.taskSelections && (
                                    <li className="list-group-item">
                                        <strong>Task Selections:</strong>
                                        <div className="d-flex flex-wrap mt-2">
                                            {
                                                (Array.isArray(parseConditionData[0]?.taskSelections) ? parseConditionData[0]?.taskSelections : [parseConditionData[0]?.taskSelections]).map((task: any, index: number) => (
                                                    <div
                                                        key={index}
                                                        className="card m-1 p-1"
                                                        style={{ width: "25%", border: "1px solid #ccc", borderRadius: "5px" }}
                                                    >
                                                        <h5 className="text-primary my-1">{task.label ? (
                                                            <span style={{ color: task.color, textTransform: 'uppercase' }}>{task.label}</span>
                                                        ) : (
                                                            "Task"
                                                        )}
                                                        </h5>

                                                        <span><strong>Task Number:</strong> {task.taskNumber || "N/A"}</span>
                                                        <span><strong>Type:</strong> {task.taskType || "N/A"}</span>
                                                        <span><strong>Timing:</strong> {task.taskTiming || "N/A"}</span>
                                                        {task.taskTiming === "Day" && (
                                                            <span><strong>Day:</strong> {task.Day || "N/A"}</span>
                                                        )}
                                                        {task.taskTiming === "WeekDay" && (
                                                            <>
                                                                <span><strong>WeekDay:</strong> {task.WeekDay || "N/A"}</span>
                                                                <span><strong>Time:</strong> {task.time || "N/A"}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </li>
                                )
                                }

                            </ul>
                        </Card.Body>
                    </Col>



                    {showNestedModal && (
                        <Form onSubmit={handleSubmit} className="mt-3" style={{ border: "1px solid #ccc", borderRadius: "5px" }}>
                            <Row className=" mx-1 ">
                                {/* Is Expirable Radio Buttons */}
                                <Col lg={2}>
                                    <Form.Group controlId="isExpirable" className="mb-3 mt-1">
                                        <Form.Label className='fs-16'>Is Expirable</Form.Label>
                                        <div className='d-flex'>
                                            <Form.Check
                                                inline
                                                type="radio"
                                                id="statusDeactive"
                                                name="isExpirable"
                                                value={0}
                                                label="No"
                                                checked={isExpirable === 0}
                                                onChange={() => handleChangeExpirable(0)}
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                id="statusActive"
                                                name="isExpirable"
                                                value={1}
                                                label="Yes"
                                                checked={isExpirable === 1}
                                                onChange={() => handleChangeExpirable(1)}
                                            />
                                        </div>
                                    </Form.Group>
                                </Col>
                                {isExpirable === 1 && (
                                    <Col lg={8} className="d-flex flex-row mt-2">
                                        <Form.Group className="mx-2">
                                            <Form.Label>Expiration days</Form.Label>
                                            <Select
                                                name="sundayLogic"
                                                options={ExpiryLogic}
                                                // value={ExpiryLogic.find(
                                                //     (opt) => opt.value === ExpiryLogic
                                                // ) || null}
                                                // onChange={(selectedOption) => setSundayLogic(selectedOption?.value)}
                                                placeholder="Select expiry Logic"
                                                required
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="expirationDate" className="mb-3">
                                            <Form.Label>Expiration Date</Form.Label>
                                            <Flatpickr
                                                value={expirationDate || ''}
                                                onChange={([date]) => {
                                                    const formatedDate = format(date, 'dd-MMM-yy hh:mm a');
                                                    handleChangeExpirationDate(formatedDate)
                                                }}
                                                options={{
                                                    enableTime: true,
                                                    dateFormat: "Y-m-d H:i",
                                                    time_24hr: true,
                                                }}
                                                placeholder="Select Expiration Date"
                                                className="form-control"
                                                required
                                            />
                                        </Form.Group>
                                        <Form.Group className="ms-2">
                                            <Form.Label>Expiration days</Form.Label>
                                            <Form.Control
                                                type="number"
                                            ></Form.Control>
                                        </Form.Group>
                                    </Col>

                                )}
                                <Col></Col>





                            </Row>
                            <Col lg={4} className=" mx-2 ">
                                <Form.Group controlId="sundayLogic" className="mb-3">
                                    <Form.Label>Sunday Logic</Form.Label>
                                    <Select
                                        name="sundayLogic"
                                        options={optionssundayLogic}
                                        value={optionssundayLogic.find(
                                            (opt) => opt.value === sundayLogic
                                        ) || null}
                                        onChange={(selectedOption) => setSundayLogic(selectedOption?.value)}
                                        placeholder="Select Sunday Logic"
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            {parseData?.options?.map((option: any, index: number) => {
                                return (
                                    <Row key={index} className="bg-light m-2 p-2">
                                        <Col lg={4}>
                                            <Form.Group controlId="taskNumber" className="mb-3">
                                                <Form.Label>Select Successor Task For <span style={{ color: option.color }}> {option.label}</span></Form.Label>

                                                <Select
                                                    name="taskNumber"
                                                    value={combinedOptions.find((item) => item.task_Number === taskSelections[index]?.taskNumber) || null}
                                                    onChange={selectedOption => handleChange(index, 'taskNumber', selectedOption?.task_Number)}
                                                    options={combinedOptions}
                                                    getOptionLabel={(item) => item.task_Label}
                                                    getOptionValue={(item) => item.task_Number}
                                                    isSearchable={true}
                                                    placeholder="Select Option"
                                                    className="h45"
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col lg={4}>
                                            <Form.Group controlId="taskType" className="mb-3">
                                                <Form.Label>Task Type</Form.Label>
                                                <Select
                                                    name="taskType"
                                                    options={optionstaskType}
                                                    value={optionstaskType.find(option => option.value === taskSelections[index]?.taskType)}
                                                    onChange={selectedOption => handleChange(index, 'taskType', selectedOption?.value)}
                                                    placeholder="Select Task Type"
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col lg={4}>
                                            <Form.Group controlId="taskTiming" className="mb-3">
                                                <Form.Label>Task Timing</Form.Label>
                                                <Select
                                                    name="taskTiming"
                                                    options={optionsTaskTiming}
                                                    value={optionsTaskTiming.find(option => option.value === taskSelections[index]?.taskTiming)}
                                                    onChange={selectedOption => handleChange(index, 'taskTiming', selectedOption?.value)}
                                                    placeholder="Select Task Type"
                                                />
                                            </Form.Group>
                                        </Col>

                                        {/* Conditionally rendered based on taskTiming */}
                                        {taskSelections[index]?.taskTiming === "Day" && (
                                            <Col lg={4}>
                                                <Form.Group controlId="Day" className="mb-3">
                                                    <Form.Label>Day:</Form.Label>
                                                    <Select
                                                        name="Day"
                                                        options={dropdownValuesFlag4}
                                                        value={dropdownValuesFlag4.find(
                                                            (option) => option.name === taskSelections[index]?.Day
                                                        ) || null}
                                                        onChange={selectedOption => handleChange(index, 'Day', selectedOption?.name)}
                                                        getOptionLabel={(item) => item.name}
                                                        getOptionValue={(item) => item.name}
                                                        placeholder="Select Task Day"
                                                    />
                                                </Form.Group>
                                            </Col>
                                        )}

                                        {taskSelections[index]?.taskTiming === "WeekDay" && (
                                            <>
                                                <Col lg={4}>
                                                    <Form.Group controlId="WeekDay" className="mb-3">
                                                        <Form.Label>Date:</Form.Label>
                                                        <Select
                                                            name="WeekDay"
                                                            options={dropdownValuesFlag2}
                                                            value={dropdownValuesFlag2.find(
                                                                (option) => option.name === taskSelections[index]?.WeekDay
                                                            ) || null}
                                                            onChange={(selectedOption) => handleChange(index, 'WeekDay', selectedOption?.name)}
                                                            getOptionLabel={(item) => item.name}
                                                            getOptionValue={(item) => item.name}
                                                            placeholder="Select WeekDay"
                                                        />
                                                    </Form.Group>
                                                </Col>

                                                <Col lg={4}>
                                                    <Form.Group controlId="time" className="mb-3">
                                                        <Form.Label>Time</Form.Label>
                                                        <Select
                                                            name="time"
                                                            options={dropdownValuesFlag3}
                                                            value={dropdownValuesFlag3.find(
                                                                (option) => option.name === taskSelections[index]?.time
                                                            ) || null}
                                                            onChange={(selectedOption) => {
                                                                if (selectedOption) {
                                                                    handleChange(index, 'time', selectedOption.name);
                                                                } else {
                                                                    handleChange(index, 'time', '');
                                                                }
                                                            }}
                                                            getOptionLabel={(item) => item.name}
                                                            getOptionValue={(item) => item.name}
                                                            placeholder="Select Time"
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </>
                                        )}
                                    </Row>
                                );
                            })}


                            {parseDataForSingle ?
                                (
                                    <Row className="bg-light m-2 p-2">
                                        <Col lg={4}>
                                            <Form.Group controlId="taskNumber" className="mb-3">
                                                <Form.Label>Select Successor Task For</Form.Label>
                                                <Select
                                                    name="taskNumber"
                                                    value={combinedOptions.find((item) => item.task_Number === taskSelections[0]?.taskNumber) || null}
                                                    onChange={selectedOption => updateTaskSelection('taskNumber', selectedOption?.task_Number)}
                                                    options={combinedOptions}
                                                    getOptionLabel={(item) => item.task_Label}
                                                    getOptionValue={(item) => item.task_Number}
                                                    isSearchable={true}
                                                    placeholder="Select Option"
                                                    className="h45"
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col lg={4}>
                                            <Form.Group controlId="taskType" className="mb-3">
                                                <Form.Label>Task Type</Form.Label>
                                                <Select
                                                    name="taskType"
                                                    options={optionstaskType}
                                                    value={optionstaskType.find(option => option.value === taskSelections[0]?.taskType)}
                                                    onChange={selectedOption => updateTaskSelection('taskType', selectedOption?.value)}
                                                    placeholder="Select Task Type"
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col lg={4}>
                                            <Form.Group controlId="taskTiming" className="mb-3">
                                                <Form.Label>Task Timing</Form.Label>
                                                <Select
                                                    name="taskTiming"
                                                    options={optionsTaskTiming}
                                                    value={optionsTaskTiming.find(option => option.value === taskSelections[0]?.taskTiming)}
                                                    onChange={selectedOption => updateTaskSelection('taskTiming', selectedOption?.value)}
                                                    placeholder="Select Task Timing"
                                                />
                                            </Form.Group>
                                        </Col>

                                        {/* Conditionally rendered based on taskTiming */}
                                        {taskSelections[0]?.taskTiming === "Day" && (
                                            <Col lg={4}>
                                                <Form.Group controlId="Day" className="mb-3">
                                                    <Form.Label>Day:</Form.Label>
                                                    <Select
                                                        name="Day"
                                                        options={dropdownValuesFlag4}
                                                        value={dropdownValuesFlag4.find(
                                                            (option) => option.name === taskSelections[0]?.Day
                                                        ) || null}
                                                        onChange={selectedOption => updateTaskSelection('Day', selectedOption?.name)}
                                                        getOptionLabel={(item) => item.name}
                                                        getOptionValue={(item) => item.name}
                                                        placeholder="Select Task Day"
                                                    />
                                                </Form.Group>
                                            </Col>
                                        )}

                                        {taskSelections[0]?.taskTiming === "WeekDay" && (
                                            <>
                                                <Col lg={4}>
                                                    <Form.Group controlId="WeekDay" className="mb-3">
                                                        <Form.Label>Date:</Form.Label>
                                                        <Select
                                                            name="WeekDay"
                                                            options={dropdownValuesFlag2}
                                                            value={dropdownValuesFlag2.find(
                                                                (option) => option.name === taskSelections[0]?.WeekDay
                                                            ) || null}
                                                            onChange={selectedOption => updateTaskSelection('WeekDay', selectedOption?.name)}
                                                            getOptionLabel={(item) => item.name}
                                                            getOptionValue={(item) => item.name}
                                                            placeholder="Select WeekDay"
                                                        />
                                                    </Form.Group>
                                                </Col>

                                                <Col lg={4}>
                                                    <Form.Group controlId="time" className="mb-3">
                                                        <Form.Label>Time</Form.Label>
                                                        <Select
                                                            name="time"
                                                            options={dropdownValuesFlag3}
                                                            value={dropdownValuesFlag3.find(
                                                                (option) => option.name === taskSelections[0]?.time
                                                            ) || null}
                                                            onChange={(selectedOption) => updateTaskSelection('time', selectedOption?.name || '')}
                                                            getOptionLabel={(item) => item.name}
                                                            getOptionValue={(item) => item.name}
                                                            placeholder="Select Time"
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </>
                                        )}
                                    </Row>
                                ) : (
                                    null
                                )

                            }

                            {/* Submit Button */}
                            <Button type="submit" className="m-2">Submit</Button>
                        </Form>
                    )}



                </Modal.Body>
            </Modal>

        </div >
    );


};

export default TaskCondition;
