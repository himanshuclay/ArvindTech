import config from "@/config";
import axios from "axios";
import { useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import Select from 'react-select';
import { Handle, Position } from 'reactflow';
import { ASSIGN_DOER_TYPE, TASK_CREATION_TYPE, TIME_MANAGEMENT_OPTION, WEEKS } from "./Constant";
import Flatpickr from 'react-flatpickr';

interface DROP_DOWN {
    empId: string;
    employeeName: string;
}

const CustomNode = ({ data, id, setNodes, edges }: { data: any; id: string; setNodes: any; edges: any[] }) => {
    const [showSettings, setShowSettings] = useState(false);
    const inputHandles = data.inputHandles || 1;
    const outputHandles = data.outputHandles || 1;
    const outputLabels = data.outputLabels || Array(outputHandles).fill("").map((_, i) => `Out ${i + 1}`);

    const [nodeSetting, setNodeSetting] = useState({
        assignDoerType: data.assignDoerType || '',  // Preserve existing selection
        doer: data.doer || '',
        taskTimeOptions: data.taskTimeOptions || '',
        days: data.days || '',
        taskCreationType: data.taskCreationType || '',
        time: data.time || '',
        hours: data.hours || '',
        weeks: data.weeks || '',
    });

    const [doerList, setDoerList] = useState<{ value: string; label: string }[]>([]);

    const [isStartNode, setIsStartNode] = useState(false);
    useEffect(() => {
        // Check if this node is directly connected to the start node
        console.log('id', id, edges)
        const hasStartNodeConnection = edges.some(edge => edge.target === id.toString() && edge.source === "1");
        console.log(hasStartNodeConnection)
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

    useEffect(() => {
        getDoerList();
    }, []);

    useEffect(() => {
        setNodeSetting({
            assignDoerType: data.assignDoerType || '',
            doer: data.doer || '',
            taskTimeOptions: data.taskTimeOptions || '',
            days: data.taskTime || '',
            taskCreationType: data.taskCreationType || '',
            time: data.time || '',
            hours: data.hours || '',
            weeks: data.weeks || '',

        });
    }, [data]);

    const handleSaveDoer = () => {
        data.assignDoerType = nodeSetting.assignDoerType;
        data.doer = nodeSetting.doer;
        data.taskTimeOptions = nodeSetting.taskTimeOptions;
        data.taskTime = nodeSetting.days;
        data.taskCreationType = nodeSetting.taskCreationType;
        data.time = nodeSetting.time;
        data.hours = nodeSetting.hours;
        data.weeks = nodeSetting.weeks;

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
                        }
                    }
                    : node
            )
        );

        setShowSettings(false);
    };


    const handleTaskTimeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setNodeSetting(prev => ({ ...prev, days: e.target.value }));
    };



    return (
        <div className="custom-node">
            {/* Settings Icon */}
            <button className="settings-button" onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); }}>
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
                            <Form.Control type="text" value={data.label} disabled />
                        </Form.Group>
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
                                <Form.Label>Assign Doer</Form.Label>
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
        </div>
    );
};

export default CustomNode;
