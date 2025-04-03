import config from "@/config";
import axios from "axios";
import { useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import Select from 'react-select';
import { Handle, Position } from 'reactflow';
import { ASSIGN_DOER_TYPE, TASK_CREATION_TYPE, TIME_MANAGEMENT_OPTION, WEEKS } from "./Constant";
import Flatpickr from 'react-flatpickr';
import { speak } from "@/utils/speak";

interface DROP_DOWN {
    empId: string;
    employeeName: string;
    id?: string;
    identifier?: string;
}

const CustomNode = ({ data, id, setNodes, edges, isCompleteTask }: { data: any; id: string; setNodes: any; edges: any[], isCompleteTask: boolean }) => {
    const [showSettings, setShowSettings] = useState(false);
    const inputHandles = data.inputHandles || 1;
    const outputHandles = data.outputHandles || 1;
    const outputLabels = data.outputLabels || Array(outputHandles).fill("").map((_, i) => `Out ${i + 1}`);

    const [nodeSetting, setNodeSetting] = useState({
        assignDoerType: data.assignDoerType || '',  // Preserve existing selection
        doer: data.doer || '',
        taskNumber: data.taskNumber || '',
        specificDate: data.specificDate || '',
        taskTimeOptions: data.taskTimeOptions || '',
        days: data.days || '',
        taskCreationType: data.taskCreationType || '',
        time: data.time || '',
        hours: data.hours || '',
        weeks: data.weeks || '',
        label: data.label || '',
        doerAssignList: data.doerAssignList || {},
    });

    const [doerList, setDoerList] = useState<{ value: string; label: string }[]>([]);
    const [projectList, setProjectList] = useState<{ id: string; projectName: string }[]>([]);

    const [isStartNode, setIsStartNode] = useState(false);
    useEffect(() => {
        // Check if this node is directly connected to the start node
        const hasStartNodeConnection = edges.some(edge => edge.target === id.toString() && edge.source === "1");
        setIsStartNode(hasStartNodeConnection);
    }, [edges, id, showSettings]);

    const getDoerList = async () => {
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/CommonDropdown/GetEmployeeListWithId`);
            if (response.data.isSuccess) {
                setDoerList(response.data.employeeLists.map((w: DROP_DOWN) => ({
                    value: w.empId,
                    label: w.employeeName,
                })));
            }
        } catch (error) {
            console.error("Error fetching doer list:", error);
        }
    };

    const getProjectList = async () => {
        try {
            const response = await fetch(`${config.API_URL_APPLICATION}/CommonDropdown/GetProjectList`);
            const result = await response.json();
            // console.log(result)
            if (result.isSuccess) {
                setProjectList(result.projectListResponses);
            }
        } catch (error) {
            console.error("Error fetching doer list:", error);
        }
    };


    useEffect(() => {
        getDoerList();

        getProjectList();
    }, []);

    useEffect(() => {
        setNodeSetting({
            assignDoerType: data.assignDoerType || '',
            doer: data.doer || '',
            specificDate: data.specificDate || '',
            taskTimeOptions: data.taskTimeOptions || '',
            days: data.taskTime || '',
            taskCreationType: data.taskCreationType || '',
            time: data.time || '',
            hours: data.hours || '',
            weeks: data.weeks || '',
            label: data.label || '',
            taskNumber: data.taskNumber || '',
            doerAssignList: data.doerAssignList || {},
        });
    }, [data]);

    const handleSaveDoer = () => {
        data.assignDoerType = nodeSetting.assignDoerType;
        data.doer = nodeSetting.doer;
        data.taskTimeOptions = nodeSetting.taskTimeOptions;
        data.taskTime = nodeSetting.days;
        data.taskCreationType = nodeSetting.taskCreationType;
        data.taskNumber = nodeSetting.taskNumber;
        data.time = nodeSetting.time;
        data.hours = nodeSetting.hours;
        data.weeks = nodeSetting.weeks;
        data.doerAssignList = nodeSetting.doerAssignList;

        setNodes((prevNodes: any) =>
            prevNodes.map((node: any) =>
                node.id === id
                    ? {
                        ...node,
                        data: {
                            ...node.data,
                            assignDoerType: nodeSetting.assignDoerType,
                            doer: nodeSetting.doer,
                            taskTimeOptions: nodeSetting.taskTimeOptions,
                            days: nodeSetting.days,
                            taskCreationType: nodeSetting.taskCreationType,
                            time: nodeSetting.time,
                            hours: nodeSetting.hours,
                            weeks: nodeSetting.weeks,
                            label: nodeSetting.label,
                            taskNumber: nodeSetting.taskNumber,
                            doerAssignList: nodeSetting.doerAssignList,
                        }
                    }
                    : node
            )
        );

        setShowSettings(false);
    };


    const handleTaskTimeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        console.log(e.target.value);  // Log the new value

        // Update the state with the changed value
        setNodeSetting((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,  // Dynamically update the field in the state
        }));
    };

    const getBorderStyle = () => {
        if (!nodeSetting.assignDoerType || nodeSetting.assignDoerType.trim() === '') {
            return { border: '2px solid red' };
        }
        if(isCompleteTask && data.completedBy == localStorage.getItem("EmpId")){
            return {border: '4px solid green'};
        }
        return {};
    };

    useEffect(() => {
        if (!nodeSetting.assignDoerType) {
          speak("Please assign a doer type for this node.");
        }
      }, [showSettings]); // when settings modal opens


    return (
        <div className="custom-node" style={getBorderStyle()}>
            {/* Settings Icon */}
            <button className="settings-button" onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); }} disabled={isCompleteTask}>
                <i className="ri-settings-3-fill"></i>
            </button>

            {/* Settings Modal */}
            <Modal show={showSettings} backdrop="static" size='xl'>
                <div onClick={(e) => e.stopPropagation()}>
                    <Modal.Header>
                        <Modal.Title>Edit Task</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p><strong>Node Settings</strong></p>
                        <Form.Group>
                            <Form.Label>Label</Form.Label>
                            <Form.Control
                                type="text"
                                value={nodeSetting.label}
                                name="label"
                                onChange={handleTaskTimeChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Task Number</Form.Label>
                            <Form.Control
                                type="text"
                                value={nodeSetting.taskNumber} // Bind data.taskNumber to the value
                                name="taskNumber"
                                onChange={handleTaskTimeChange} // Call handleTaskTimeChange when input changes
                            />
                        </Form.Group>
                        {/* <Form.Group>
                            <Form.Label>Select Number</Form.Label>
                            <Form.Control
                                type="text"
                                value={nodeSetting.taskNumber} // Bind data.taskNumber to the value
                                name="taskNumber"
                                onChange={handleTaskTimeChange} // Call handleTaskTimeChange when input changes
                            />
                        </Form.Group> */}

                        <Form.Group>
                            <Form.Label>Assign Doer Type</Form.Label>
                            <Select
                                options={ASSIGN_DOER_TYPE}
                                value={ASSIGN_DOER_TYPE.find(option => option.value === nodeSetting.assignDoerType)}
                                onChange={(selectedOption) =>
                                    setNodeSetting(prev => ({ ...prev, assignDoerType: selectedOption?.value || '' }))
                                }
                                placeholder="Select Assign Doer Type"
                            />
                        </Form.Group>
                        {nodeSetting.assignDoerType === 'fixedDoer' && (
                            <Form.Group>
                                <Form.Label>Assign Doer*</Form.Label>
                                <Select
                                    options={doerList}
                                    value={doerList.find(option => option.value === nodeSetting.doer)}
                                    onChange={(selectedOption) =>
                                        setNodeSetting(prev => ({ ...prev, doer: selectedOption?.value || '' }))
                                    }
                                    placeholder="Select a Doer"
                                />
                            </Form.Group>
                        )}
                        {nodeSetting.assignDoerType === 'projectWithDoer' && (
                            <Form.Group>
                                <Form.Label>Project With Doer</Form.Label>
                                {projectList.length > 0 ? (
                                    projectList.map((project, index) => (
                                        <div key={index} style={{ marginBottom: '1rem' }}>
                                            <Form.Control
                                                type="text"
                                                value={project.projectName}
                                                readOnly
                                                style={{ marginBottom: '0.5rem' }}
                                            />
                                            <Select
                                                options={doerList}
                                                value={doerList.find(option => option.value === nodeSetting.doerAssignList?.[project.projectName])} // Use projectName as key
                                                onChange={(selectedOption) => {
                                                    setNodeSetting(prev => ({
                                                        ...prev,
                                                        doerAssignList: {
                                                            ...prev.doerAssignList, // Spread existing doerAssignList
                                                            [project.projectName]: selectedOption?.value || '' // Assign doer to this project
                                                        }
                                                    }));
                                                }}
                                                placeholder={`Select a Doer for ${project.projectName}`}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <div>No projects available</div>
                                )}
                            </Form.Group>
                        )}


                        <Form.Group>
                            <Form.Label>Time Management</Form.Label>
                            <Select
                                options={TIME_MANAGEMENT_OPTION}
                                value={TIME_MANAGEMENT_OPTION.find(option => option.value === nodeSetting.taskTimeOptions)}
                                onChange={(selectedOption) =>
                                    setNodeSetting(prev => ({ ...prev, taskTimeOptions: selectedOption?.value || '' }))
                                }
                                placeholder="Select Assign Doer Type"
                            />
                        </Form.Group>
                        {['onlyDays', 'daysWithTime'].includes(nodeSetting.taskTimeOptions) && (
                            <Form.Group>
                                <Form.Label>Days</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={nodeSetting.days}
                                    name="days"
                                    onChange={handleTaskTimeChange}
                                    placeholder="Enter Days"
                                />
                            </Form.Group>
                        )}
                        {['hours'].includes(nodeSetting.taskTimeOptions) && (
                            <Form.Group>
                                <Form.Label>Hours</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={nodeSetting.hours}
                                    name="hours"
                                    onChange={handleTaskTimeChange}
                                    placeholder="Enter Days"
                                />
                            </Form.Group>
                        )}
                        {['weeks', 'weeksWithTime'].includes(nodeSetting.taskTimeOptions) && (
                            <Form.Group>
                                <Form.Label>Weeks</Form.Label>
                                <Select
                                    options={WEEKS}
                                    value={WEEKS.find((option: any) => option.value === nodeSetting.weeks)}
                                    onChange={(selectedOption) =>
                                        setNodeSetting(prev => ({ ...prev, weeks: selectedOption?.value || '' }))
                                    }
                                    placeholder="Select Assign Doer Type"
                                />
                            </Form.Group>
                        )}
                        {['daysWithTime', 'weeksWithTime'].includes(nodeSetting.taskTimeOptions) && (
                            <Form.Group>
                                <Form.Label>Time</Form.Label> {/* Label now correctly represents time */}
                                <Flatpickr
                                    value={nodeSetting.time}
                                    onChange={([date]) => setNodeSetting({
                                        ...nodeSetting,
                                        time: date.toISOString() // Store the full date-time
                                    })}
                                    options={{
                                        enableTime: true, // Allow time selection
                                        noCalendar: true, // Hide the calendar if only time is needed
                                        dateFormat: "H:i", // Use 24-hour format
                                        time_24hr: true, // Enforce 24-hour format
                                    }}
                                    placeholder="Select Time"
                                    className="form-control"
                                    required
                                />
                            </Form.Group>
                        )}
                        {['specificDate'].includes(nodeSetting.taskTimeOptions) && (
                            <Form.Group>
                                <Form.Label>Specific Date</Form.Label> {/* Label now correctly represents time */}
                                <Flatpickr
                                    value={nodeSetting.specificDate}
                                    onChange={([date]) => setNodeSetting({
                                        ...nodeSetting,
                                        specificDate: date.toISOString() // Store the full date-time
                                    })}
                                    options={{
                                        enableTime: false, // Allow time selection
                                        noCalendar: false, // Hide the calendar if only time is needed
                                        dateFormat: "F, d, Y", // Use 24-hour format
                                        time_24hr: true, // Enforce 24-hour format
                                    }}
                                    placeholder="Select Time"
                                    className="form-control"
                                    required
                                />
                            </Form.Group>
                        )}
                        {!isStartNode && (
                            <Form.Group>
                                <Form.Label>Task Creation Type</Form.Label>
                                <Select
                                    options={TASK_CREATION_TYPE}
                                    value={TASK_CREATION_TYPE.find(option => option.value === nodeSetting.taskCreationType)}
                                    onChange={(selectedOption) =>
                                        setNodeSetting(prev => ({ ...prev, taskCreationType: selectedOption?.value || '' }))
                                    }
                                    placeholder="Select Assign Doer Type"
                                />
                            </Form.Group>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="close-button" onClick={() => setShowSettings(false)}>Close</button>
                        <button className="save-button" onClick={handleSaveDoer}>
                            Save
                        </button>

                    </Modal.Footer>
                </div>
            </Modal>

            {/* Input Handles */}
            {[...Array(inputHandles)].map((_, index) => (
                <Handle key={`input-${id}-${index}`} type="target" position={Position.Left} className="input-handle" />
            ))}

            {/* Main Label */}
            <div className="node-label">{data.label}</div>

            {/* Output Handles */}
            <div className="output-container">
                {outputLabels.map((label: any, index: number) => (
                    <div key={`output-container-${id}-${index}`} className="output-box">
                        <span>{label}</span>
                        <Handle key={`output-${id}-${index}`} id={`${label}`} type="source" position={Position.Right} className="output-handle" />
                    </div>
                ))}
            </div>
            {!nodeSetting.assignDoerType && (
                <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                    ⚠️ Assign Doer Type is required
                </div>
            )}

        </div>
    );
};

export default CustomNode;
