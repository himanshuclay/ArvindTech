import config from "@/config";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import Select from 'react-select';
import { Handle, Position } from 'reactflow';
import { ASSIGN_DOER_TYPE, TASK_CREATION_TYPE, TIME_MANAGEMENT_OPTION, WEEKS } from "./Constant";
import Flatpickr from 'react-flatpickr';
// import { speak } from "@/utils/speak";
import { APPOINTMENT, NEW_APPOINTMENT } from "./Constant/Binding";
import { getBlockName } from "./Constant/function";

interface DROP_DOWN {
    empId: string;
    employeeName: string;
    id?: string;
    identifier?: string;
}

interface roleDropDown
{   
    roleName: string;
    id: number;
}

interface Option {
    label: string;
    value: string;
}

const CustomNode = ({ data, id, setNodes, edges, isCompleteTask }: { data: any; id: string; setNodes: any; edges: any[], isCompleteTask: boolean }) => {
    const [showSettings, setShowSettings] = useState(false);
    const [showBinding, setShowBinding] = useState(false);
    const [loading, setLoading] = useState(false);
    const inputHandles = data.inputHandles || 1;
    const outputHandles = data.outputHandles || 1;
    const outputLabels = data.outputLabels || Array(outputHandles).fill("").map((_, i) => `Out ${i + 1}`);

    const BINDING: { [key: string]: string[] } = {
        APPOINTMENT,
        NEW_APPOINTMENT,
    };

    const [nodeSetting, setNodeSetting] = useState({
        assignDoerType: data.assignDoerType || '',  // Preserve existing selection
        doer: data.doer || '',
        taskNumber: data.taskNumber || '',
        role: data.role || '',
        specificDate: data.specificDate || '',
        taskTimeOptions: data.taskTimeOptions || '',
        days: data.days || '',
        taskCreationType: data.taskCreationType || '',
        time: data.time || '',
        hours: data.hours || '',
        weeks: data.weeks || '',
        label: data.label || '',
        doerAssignList: data.doerAssignList || {},
        bindingValues: data.bindingValues || {},
    });

    const [doerList, setDoerList] = useState<{ value: string; label: string }[]>([]);
    const [roleList, setRoleList] = useState<{ value: string; label: string }[]>([]);
    const [projectList, setProjectList] = useState<{ id: string; projectName: string }[]>([]);

    const [isStartNode, setIsStartNode] = useState(false);
    const [mastersLists, setMasterLists] = useState<Option[]>([]);
    const [blockName, setBlockName] = useState<string[]>([]);
    const [columnLists, setColumnLists] = useState<{ [key: string]: Option[] }>({}); // Store column options


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
    const getRoleList = async () => {
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/CommonDropdown/GetRoleMasterList`);
            if (response.data.isSuccess) {
                setRoleList(response.data.roleMasterLists.map((w: roleDropDown) => ({
                    value: w.id,
                    label: w.roleName,
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
        getRoleList();

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
            role: data.role || '',
            hours: data.hours || '',
            weeks: data.weeks || '',
            label: data.label || '',
            taskNumber: data.taskNumber || '',
            doerAssignList: data.doerAssignList || {},
            bindingValues: data.bindingValues || {},
        });
    }, [data]);

    const handleSaveDoer = () => {
        console.log(nodeSetting)
        data.assignDoerType = nodeSetting.assignDoerType;
        data.doer = nodeSetting.doer;
        data.role = nodeSetting.role
        data.taskTimeOptions = nodeSetting.taskTimeOptions;
        data.taskTime = nodeSetting.days;
        data.taskCreationType = nodeSetting.taskCreationType;
        data.taskNumber = nodeSetting.taskNumber;
        data.time = nodeSetting.time;
        data.hours = nodeSetting.hours;
        data.weeks = nodeSetting.weeks;
        data.doerAssignList = nodeSetting.doerAssignList;
        data.bindingValues = nodeSetting.bindingValues;

        setNodes((prevNodes: any) =>
            prevNodes.map((node: any) =>
                node.id === id
                    ? {
                        ...node,
                        data: {
                            ...node.data,
                            assignDoerType: nodeSetting.assignDoerType,
                            doer: nodeSetting.doer,
                            role: nodeSetting.role,
                            taskTimeOptions: nodeSetting.taskTimeOptions,
                            days: nodeSetting.days,
                            taskCreationType: nodeSetting.taskCreationType,
                            time: nodeSetting.time,
                            hours: nodeSetting.hours,
                            weeks: nodeSetting.weeks,
                            label: nodeSetting.label,
                            taskNumber: nodeSetting.taskNumber,
                            doerAssignList: nodeSetting.doerAssignList,
                            bindingValues: nodeSetting.bindingValues,
                        }
                    }
                    : node
            )
        );

        setShowSettings(false);
        setShowBinding(false);
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
        if (isCompleteTask && data.completedBy == localStorage.getItem("EmpId")) {
            return { border: '4px solid green' };
        }
        return {};
    };

    useEffect(() => {
        setLoading(true);
        axios.get(`${config.API_URL_APPLICATION}/FormBuilder/GetMasterList`).then(response => {
            setMasterLists(response.data.masterForms);
        });
        console.log('data', data);
        if (typeof data.form != "string" && data.form?.blocks?.length) {
            const blockNames = getBlockName(data.form.blocks);
            setBlockName(blockNames);

        } else {
            setBlockName(BINDING[data.form]);
        }
        setLoading(false);
        // if (!nodeSetting.assignDoerType) {
        //   speak("Please assign a doer type for this node.");
        // }
    }, []); // when settings modal opens

    // Using a ref to track if the columns for a master have been fetched
    const fetchedMastersRef = useRef<Set<string>>(new Set());

    useEffect(() => {
        // Fetch columns for the selected master when modal opens
        if (showBinding) {
            BINDING[data.form]?.forEach((block) => {
                const currentBindingValue = nodeSetting.bindingValues?.[block];
                console.log('currentBindingValue', currentBindingValue)
                if (currentBindingValue) {
                    // Fetch columns for the selected master if not already fetched
                    fetchColumnNames(currentBindingValue.master);
                }
            });
        }
    }, [showBinding, nodeSetting.bindingValues]);

    // The fetchColumnNames function definition remains the same
    const fetchColumnNames = async (masterName: string) => {
        if (!fetchedMastersRef.current.has(masterName)) {
            try {
                const response = await axios.get(`${config.API_URL_APPLICATION}/FormBuilder/GetColumnList`, { params: { id: masterName } });
                setColumnLists((prev) => ({ ...prev, [masterName]: response.data.columnFormLists }));
                fetchedMastersRef.current.add(masterName); // Mark this master as fetched
            } catch (error) {
                console.error('Error fetching columns:', error);
            }
        }
    };


    return (
        <div className="custom-node" style={getBorderStyle()}>
            {/* Settings Icon */}
            <div className="settings-button">
                <button className="setting-button-design" onClick={(e) => { e.stopPropagation(); setShowBinding(!showBinding); }} disabled={isCompleteTask}>
                    <i className="ri-git-merge-line"></i>
                </button>
                <button className="setting-button-design" onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); }} disabled={isCompleteTask}>
                    <i className="ri-settings-3-fill"></i>
                </button>
            </div>

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
                            <Form.Label>Select Role*</Form.Label>
                            <Select
                                options={roleList}
                                value={roleList.find(option => option.value === nodeSetting.role)}
                                onChange={(selectedOption) =>
                                    setNodeSetting(prev => ({ ...prev, role: selectedOption?.value || '' }))
                                }
                                placeholder="Select a role"
                            />
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
            {/* Binding Modal */}
            <Modal show={showBinding} backdrop="static" size="xl">
                {!loading && (
                    <div onClick={(e) => e.stopPropagation()}>
                        <Modal.Header>
                            <Modal.Title>Binding Forms to Masters</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {JSON.stringify(nodeSetting)}
                            {blockName?.map((block, index) => {
                                const currentBindingValue = nodeSetting.bindingValues?.[block];
                                const masterName = currentBindingValue?.master;
                                const columnName = currentBindingValue?.column;

                                return (
                                    <div key={index} style={{ marginBottom: '1rem' }}>
                                        <Form.Control
                                            type="text"
                                            value={block}
                                            readOnly
                                            style={{ marginBottom: '0.5rem' }}
                                        />

                                        {/* Display the master name part */}

                                        <Select
                                            options={mastersLists}
                                            value={mastersLists.find((option) => option.value === masterName) || null}
                                            onChange={(selectedOption) => {
                                                const newMasterName = selectedOption?.value || '';

                                                // Update the binding value and fetch columns
                                                setNodeSetting((prev) => ({
                                                    ...prev,
                                                    bindingValues: {
                                                        ...prev.bindingValues,
                                                        [block]: {
                                                            master: newMasterName,
                                                            column: columnName || '',
                                                        },
                                                    },
                                                }));

                                                // Fetch columns for the selected master name
                                                fetchColumnNames(newMasterName);
                                            }}
                                            placeholder={`Select a Master for ${block}`}
                                        />

                                        {/* Display column select dropdown if the mastername is selected */}
                                        {masterName && columnLists[masterName] && (
                                            <Select
                                                options={columnLists[masterName] || []}
                                                value={columnLists[masterName]?.find(
                                                    (option) => option.value === columnName
                                                )}
                                                onChange={(selectedOption) => {
                                                    const newColumnName = selectedOption?.value || '';

                                                    // Update the column value in bindingValues
                                                    setNodeSetting((prev) => ({
                                                        ...prev,
                                                        bindingValues: {
                                                            ...prev.bindingValues,
                                                            [block]: {
                                                                column: newColumnName,
                                                                master: masterName || '',
                                                            },
                                                        },
                                                    }));
                                                }}
                                                placeholder={`Select a Column for ${block}`}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </Modal.Body>
                        <Modal.Footer>
                            <button className="close-button" onClick={() => setShowBinding(false)}>Close</button>
                            <button className="save-button" onClick={handleSaveDoer}>
                                Save
                            </button>
                        </Modal.Footer>
                    </div>
                )}
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
