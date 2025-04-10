import config from "@/config";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Col, Form, Modal, Row } from "react-bootstrap";
import Select from 'react-select';
import { Handle, Position } from 'reactflow';
import { ASSIGN_DOER_TYPE, TASK_CREATION_TYPE, TIME_MANAGEMENT_OPTION, WEEKS } from "./Constant";
import Flatpickr from 'react-flatpickr';
// import { speak } from "@/utils/speak";
import { APPOINTMENT, NEW_APPOINTMENT } from "./Constant/Binding";
import { getAllBlockName, getAllBlockOptions, getBlockName, getPreviousTaskList } from "./Constant/function";
import { toast } from "react-toastify";
import { speak } from "@/utils/speak";

interface DROP_DOWN {
    empId: string;
    employeeName: string;
    id?: string;
    identifier?: string;
}

interface roleDropDown {
    roleName: string;
    id: number;
}

interface Option {
    label: string;
    value: string;
}

type NodeSetting = {
    assignDoerType: any;
    doer: any;
    taskNumber: any;
    specificDate: any;
    taskTimeOptions: any;
    days: any;
    taskCreationType: any;
    time: any;
    hours: any;
    weeks: any;
    label: any;
    doerAssignList: any;
    bindingValues: any;
    doerTaskNumber: any;
    doerBlockName: any;
    doerBlockOptions: any;
    // Add an index signature to allow any string-based key
    [key: string]: any;
};

const CustomNode = ({ data, id, setNodes, edges, isCompleteTask, nodes, setEdges, setWorkflowBuilder, setSelectedNode }: { data: any; id: string; setNodes: any; edges: any[], isCompleteTask: boolean, nodes: any[], setEdges: any; setWorkflowBuilder: any; setSelectedNode: any }) => {
    const [showSettings, setShowSettings] = useState(false);
    const [showBinding, setShowBinding] = useState(false);
    const [loading, setLoading] = useState(false);
    const inputHandles = data.inputHandles || 1;
    const outputHandles = data.outputHandles || 1;
    const outputLabels = data.outputLabels || Array(outputHandles).fill("").map((_, i) => `Out ${i + 1}`);
    const [previousTaskList, setPerviousTaskList] = useState<{ label: string, value: string }[]>([]);
    const [previousBlockList, setPerviousBlockList] = useState<{ label: string, value: string }[]>([]);
    const [previousOptionsList, setPerviousOptionsList] = useState<{ label: string, value: string }[]>([]);

    const BINDING: { [key: string]: string[] } = {
        APPOINTMENT,
        NEW_APPOINTMENT,
    };

    const [nodeSetting, setNodeSetting] = useState<NodeSetting>({
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
        doerTaskNumber: data.doerTaskNumber || '',
        doerBlockName: data.doerBlockName || '',
        doerBlockOptions: data.doerBlockOptions || '',
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
        let value = getPreviousTaskList(nodes, edges, "1", id);
        setPerviousTaskList(value);
    }, [showSettings])

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
            doerTaskNumber: data.doerTaskNumber || '',
            doerBlockName: data.doerBlockName || '',
            doerBlockOptions: data.doerBlockOptions || '',
        });
    }, [data]);

    const handleSaveDoer = () => {
        const validationRules = [
            { field: 'label', message: 'Please Enter Task Name.' },
            { field: 'taskNumber', message: 'Please Enter Task Number.' },
            { field: 'assignDoerType', message: 'Please Select Assign Doer Type.' },
            { field: 'doer', message: 'Please Select Doer.' },
        ];

        for (const rule of validationRules) {
            if (!nodeSetting[rule.field]) {
                speak(rule.message);
                toast.info(rule.message);
                return;
            }
        }
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
        data.doerTaskNumber = nodeSetting.doerTaskNumber;
        data.doerBlockName = nodeSetting.doerBlockName;
        data.doerBlockOptions = nodeSetting.doerBlockOptions;

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
                            doerTaskNumber: nodeSetting.doerTaskNumber,
                            doerBlockName: nodeSetting.doerBlockName,
                            doerBlockOptions: nodeSetting.doerBlockOptions,
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

    useEffect(() => {
        if (nodeSetting.doerTaskNumber) {
            console.log("Selected Task Number:", nodeSetting.doerTaskNumber);

            // Fetch the updated block names based on the selected task number
            const value = getAllBlockName(nodes, nodeSetting.doerTaskNumber);
            setPerviousBlockList(value);

            // Reset doerBlockName to '' since the task number changed
            setNodeSetting(prev => ({
                ...prev,
                doerBlockName: '', // Reset block name to empty string
            }));

            // Optionally clear previous options list
            setPerviousOptionsList([]);
        }
    }, [nodeSetting.doerTaskNumber]); // Triggered whenever doerTaskNumber changes


    useEffect(() => {
        if (nodeSetting.doerBlockName) {
            console.log(nodeSetting.doerBlockName);
            const value = getAllBlockOptions(nodes, nodeSetting.doerTaskNumber, nodeSetting.doerBlockName);
            setPerviousOptionsList(value);
        }
    }, [nodeSetting.doerBlockName])

    const deleteNode = () => {
        setNodes((nds: any) => nds.filter((node: any) => node.id !== id));
        setEdges((eds: any) => eds.filter((edge: any) => edge.source !== id && edge.target !== id));
        // Remove the node from the workflowBuilder state
        setWorkflowBuilder((prevWorkflowBuilder: any) => ({
            ...prevWorkflowBuilder,
            nodes: prevWorkflowBuilder.nodes.filter((node: any) => node.id !== id), // 🔹 Remove deleted node
            edges: prevWorkflowBuilder.edges.filter((edge: any) => edge.source !== id && edge.target !== id) // 🔹 Remove related edges
        }));
    }

    // const cloneNode = () => {
    //     // Find the node to clone
    //     const nodeToClone = nodes.find((node) => node.id === id);
    //     if (!nodeToClone) {
    //         console.error(`Node with id ${id} not found.`);
    //         return;
    //     }
    
    //     // Create a new node by copying the existing node's properties
    //     const clonedNode: Node = {
    //         ...nodeToClone,
    //         id: (nodes.length + 1).toString(),  // Assign a new unique ID based on current nodes length
    //         position: { x: nodeToClone.position.x + 50, y: nodeToClone.position.y + 50 }, // Slightly offset the position for visibility
    //     };
    
    //     // Add the cloned node to the state using the functional update form
    //     setNodes((prevNodes: any) => {
    //         const updatedNodes = [...prevNodes, clonedNode]; // Add the cloned node to the array
    //         // Update the workflowBuilder state as well
    //         setWorkflowBuilder((prevWorkflowBuilder: any) => ({
    //             ...prevWorkflowBuilder,
    //             nodes: updatedNodes,
    //         }));
    //         return updatedNodes;  // Return updated nodes state
    //     });
    
    //     setSelectedNode(clonedNode);  // Optionally select the cloned node
    
    //     console.log('Cloned node:', clonedNode);
    // };
    
    


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
                {/* <button className="setting-button-design" onClick={(e) => { e.stopPropagation(); cloneNode(); }} disabled={isCompleteTask}>
                    <i className="ri-file-copy-line"></i>
                </button> */}
                <button className="setting-button-design" onClick={(e) => { e.stopPropagation(); deleteNode(); }} disabled={isCompleteTask}>
                    <i className="ri-close-circle-line"></i>
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
                        <Row>
                            <Col lg={3}>
                                <Form.Group>
                                    <Form.Label>Label*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={nodeSetting.label}
                                        name="label"
                                        onChange={handleTaskTimeChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={3}>
                                <Form.Group>
                                    <Form.Label>Task Number*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={nodeSetting.taskNumber} // Bind data.taskNumber to the value
                                        name="taskNumber"
                                        onChange={handleTaskTimeChange} // Call handleTaskTimeChange when input changes
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={3}>
                                <Form.Group>
                                    <Form.Label>Assign Doer Type*</Form.Label>
                                    <Select
                                        options={ASSIGN_DOER_TYPE}
                                        value={ASSIGN_DOER_TYPE.find(option => option.value === nodeSetting.assignDoerType)}
                                        onChange={(selectedOption) =>
                                            setNodeSetting(prev => ({ ...prev, assignDoerType: selectedOption?.value || '' }))
                                        }
                                        placeholder="Select Assign Doer Type"
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={3}>
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
                            </Col>
                            {nodeSetting.assignDoerType === 'projectWithDoer' && (
                                <Form.Group>
                                    <Form.Label>Project With Doer</Form.Label>
                                    <Row>
                                        {projectList.length > 0 ? (
                                            projectList.map((project, index) => (
                                                <Col lg={3}>
                                                    <div key={index} style={{ marginBottom: '1rem' }}>
                                                        <Form.Group>
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
                                                        </Form.Group>
                                                    </div>
                                                </Col>
                                            ))
                                        ) : (
                                            <div>No projects available</div>
                                        )}
                                    </Row>
                                </Form.Group>
                            )}
                            {nodeSetting.assignDoerType === 'projectWithFormInput' && (
                                <>
                                    <Form.Label>Form Input Configuration</Form.Label>

                                    <Col lg={3}>
                                        <Form.Group>
                                            <Form.Label>Task Name*</Form.Label>
                                            <Select
                                                options={previousTaskList}
                                                value={previousTaskList.find(option => option.value === nodeSetting.doerTaskNumber)}
                                                onChange={(selectedOption) =>
                                                    setNodeSetting(prev => ({ ...prev, doerTaskNumber: selectedOption?.value || '' }))
                                                }
                                                placeholder="Select a Task"
                                            />
                                        </Form.Group>
                                    </Col>

                                    {nodeSetting.doerTaskNumber && (
                                        <Col lg={3}>
                                            <Form.Group>
                                                <Form.Label>Block Name*</Form.Label>
                                                <Select
                                                    options={previousBlockList} // Updated block list based on task number
                                                    // Ensure value is either a valid option object or undefined/null if no selection
                                                    value={nodeSetting.doerBlockName ? previousBlockList.find(option => option.value === nodeSetting.doerBlockName) : null}
                                                    onChange={(selectedOption) =>
                                                        setNodeSetting(prev => ({
                                                            ...prev,
                                                            doerBlockName: selectedOption ? selectedOption.value : '' // Ensure it's a string value
                                                        }))
                                                    }
                                                    placeholder="Select a Block"
                                                />

                                            </Form.Group>
                                        </Col>
                                    )}

                                    {projectList.length > 0 && (
                                        <Row>
                                            <Form.Label>Doers Configuration</Form.Label>

                                            {projectList.map((project, index) => (
                                                <Col lg={3} key={project.projectName}>  {/* Using projectName as a key */}
                                                    <div style={{ marginBottom: '1rem' }}>
                                                        <Form.Group>
                                                            <Form.Control
                                                                type="text"
                                                                value={project.projectName}
                                                                readOnly
                                                                style={{ marginBottom: '0.5rem' }}
                                                            />
                                                            {previousOptionsList.length > 0 && previousOptionsList.map((options, optionIndex) => (
                                                                <div key={options.value + optionIndex}>
                                                                    <Form.Control
                                                                        type="text"
                                                                        value={options.label}
                                                                        readOnly
                                                                        style={{ marginBottom: '0.5rem' }}
                                                                    />
                                                                    <Select
                                                                        options={doerList}
                                                                        value={doerList.find(option => option.value === nodeSetting.doerAssignList?.[project.projectName]?.[options.value])}
                                                                        onChange={(selectedOption) => {
                                                                            setNodeSetting(prev => ({
                                                                                ...prev,
                                                                                doerAssignList: {
                                                                                    ...prev.doerAssignList,
                                                                                    [project.projectName]: {
                                                                                        ...prev.doerAssignList[project.projectName],
                                                                                        [options.value]: selectedOption?.value || ''
                                                                                    }
                                                                                }
                                                                            }));
                                                                        }}
                                                                        placeholder={`Select a Doer for ${project.projectName} ${options.value}`}
                                                                    />
                                                                </div>
                                                            ))}
                                                        </Form.Group>
                                                    </div>
                                                </Col>
                                            ))}
                                        </Row>
                                    )}
                                </>
                            )}
                            <Col lg={3}>
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
                            </Col>
                            {['onlyDays', 'daysWithTime'].includes(nodeSetting.taskTimeOptions) && (
                                <Col lg={3}>
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
                                </Col>
                            )}
                            {['hours'].includes(nodeSetting.taskTimeOptions) && (
                                <Col lg={3}>
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
                                </Col>
                            )}
                            {['weeks', 'weeksWithTime'].includes(nodeSetting.taskTimeOptions) && (
                                <Col lg={3}>
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
                                </Col>
                            )}
                            {['daysWithTime', 'weeksWithTime'].includes(nodeSetting.taskTimeOptions) && (
                                <Col lg={3}>
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
                                </Col>
                            )}
                            {['specificDate'].includes(nodeSetting.taskTimeOptions) && (
                                <Col lg={3}>
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
                                </Col>
                            )}
                            {!isStartNode && (
                                <Col lg={3}>
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
                                </Col>
                            )}
                            <Col lg={3}>
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
                            </Col>
                        </Row>
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
