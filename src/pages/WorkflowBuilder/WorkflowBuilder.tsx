import React, { useState, useCallback, useEffect, useMemo } from 'react';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    // addEdge,
    Node,
    Edge,
    Connection,
    applyNodeChanges,
    MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import WorkflowBuilderSetting from './WorkflowBuilderSetting';
import FormBuilder from '../FormBuilder/FormBuilder';
import { Form, Modal } from 'react-bootstrap';
import { FIELD } from '../FormBuilder/Constant/Interface';
import { toast } from 'react-toastify';
import axios from 'axios';
import config from '@/config';
import STAFF_ALLOCATION_PLAN from './DynamicSegment/STAFF_ALLOCATION_PLAN';
import { useNavigate, useParams } from 'react-router-dom';
import APPOINTMENT from './DynamicSegment/APPOINTMENT';
import { INPUT_HANDLES, LABEL, OUTPUT_HANDLES, OUTPUT_LABELS } from './Constant';
import NEW_APPOINTMENT from './DynamicSegment/NEW_APPOINTMENT';
import OLD_STAFF_TRANSFER from './DynamicSegment/OLD_STAFF_TRANSFER';
import INDUCTION from './DynamicSegment/INDUCTION';
import UPDATE_EMPLOYEE from './DynamicSegment/UPDATE_EMPLOYEE';
import APPOINTMENT_LETTER from './DynamicSegment/APPOINTMENT_LETTER';
import ASSIGN_TASK from './DynamicSegment/ASSIGN_TASK';
import CustomNode from './CustomNode';
import BUSINESS_GROWTH_REVIEW from './DynamicSegment/BUSINESS_GROWTH_REVIEW';
import SALARY_PROCESSING from './DynamicSegment/SELARY_PROCESSING';

const initialNodes: Node[] = [
    { id: '1', type: 'input', data: { label: 'Start Node', inputHandles: 1, outputHandles: 1 }, position: { x: 100, y: 100 } },
    { id: '2', type: 'output', data: { label: 'End Node', inputHandles: 1, outputHandles: 1 }, position: { x: 500, y: 100 } },
];

const initialEdges: Edge[] = [{ id: 'e1-1', source: '1', target: '2', animated: true, type: 'smoothstep' }];

interface APISetting {
    name: string;
    api: string;
    id: number;
}

interface WorkflowBuilderConfig {
    apiSetting: APISetting[];
    edges: Edge[];
    nodes: Node[];
}












const WorkflowBuilder: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [, setEditMode] = useState<boolean>(false);
    const [nodes, setNodes] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null)
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    // const [nodeId, setNodeId] = useState<number>(3);
    const [showSettings, setShowSettings] = useState<boolean>(false);
    const [workflowBuilder, setWorkflowBuilder] = useState<WorkflowBuilderConfig>({
        apiSetting: [],
        edges: [],
        nodes: initialNodes,
    });

    const nodeTypes = useMemo(() => ({
        custom: (props: any) => <CustomNode {...props} setNodes={setNodes} edges={edges} nodes={nodes} setEdges={setEdges} setWorkflowBuilder={setWorkflowBuilder} setSelectedNode={setSelectedNode} />,
    }), [setNodes, edges]);

    const [formBuilder, setFormBuilder] = useState<FIELD>({
        name: '',
        blocks: [],
        editMode: true,
        blockCount: 0,
        rules: [],
        configureSelectionLogics: [],
        advance: {
            backgroundColor: '',
            color: '',
        }
    });
    const getEmptyFormBuilder = (): FIELD => ({
        name: '',
        blocks: [],
        editMode: true,
        blockCount: 0,
        rules: [],
        configureSelectionLogics: [],
        advance: {
            backgroundColor: '',
            color: '',
        },
    });

    const [showFormBuilder, setShowFormBuilder] = useState(false);
    const [isAddFormBuilder, setIsAddFormBuilder] = useState(false);
    const [isCloseForm, setIsCloseForm] = useState(false);
    const [dynamicComponent, setDynamicComponent] = useState<string>('');

    const [name, setName] = useState('');

    // const onConnect = useCallback(
    //     (params: Connection) => {
    //         setEdges((existingEdges) => {
    //             // Check if the output handle already has a connection
    //             const isAlreadyConnected = existingEdges.some(
    //                 (edge) => edge.source === params.source && edge.sourceHandle === params.sourceHandle
    //             );

    //             if (isAlreadyConnected) {
    //                 alert("This output handle already has a connection.");
    //                 return existingEdges; // Do not allow multiple connections on the same output
    //             }

    //             return addEdge(params, existingEdges);
    //         });
    //     },
    //     [setEdges]
    // );
    const onConnect = useCallback(
        (params: Connection) => {
            setEdges((existingEdges) => {
                // Check if the output handle already has a connection
                const isAlreadyConnected = existingEdges.some(
                    (edge) => edge.source === params.source && edge.sourceHandle === params.sourceHandle
                );

                if (isAlreadyConnected) {
                    alert("This output handle already has a connection.");
                    return existingEdges; // Prevent multiple connections on the same output
                }


                const newEdge: Edge = {
                    ...params,
                    id: `e${params.source}-${params.target}`,
                    type: 'smoothstep', // Edge type (options: 'step', 'straight', 'bezier')
                    animated: true,
                    style: {
                        stroke: '#007bff', // Edge color
                        strokeWidth: 2,
                        strokeDasharray: '5,5', // Dashed line
                    },
                    markerEnd: { type: MarkerType.ArrowClosed }, // ✅ Correct usage of marker type
                    source: params.source ?? '', // Ensure source is always a string
                    target: params.target ?? '', // Ensure target is always a string
                    sourceHandle: params.sourceHandle ?? undefined, // Optional
                    targetHandle: params.targetHandle ?? undefined, // Optional
                };

                return [...existingEdges, newEdge];
            });
        },
        [setEdges]
    );

    console.log("these are nodes", nodes);




    const addNewNode = (x: number, y: number, form?: any, action?: string) => {
        const newNode: Node = {
            id: (nodes.length + 1).toString(),
            type: 'custom',
            data: {
                label: action ? LABEL[action] : form ? form.name : `New Node ${nodes.length + 1}`, handles: Math.floor(Math.random() * 4) + 1, form: action ? action : form || {},
                taskNumber: `T${nodes.length - 1}`,
                inputHandles: action ? INPUT_HANDLES[action] : 1,
                outputHandles: action ? OUTPUT_HANDLES[action] : form.configureSelectionLogics.length ? form.configureSelectionLogics[0].start2.length : 1,
                outputLabels: action ? OUTPUT_LABELS[action] : form.configureSelectionLogics.length ? form.configureSelectionLogics[0].start2 : '',
            },
            position: { x, y },
        };
        console.log(newNode);
        setNodes((nds) => [...nds, newNode]);
        setWorkflowBuilder(prevWorkflowBuilder => ({
            ...prevWorkflowBuilder,
            nodes: [...prevWorkflowBuilder.nodes, newNode]
        }));
        return newNode.id;
    };

    const toggleWorkflowSetting = () => {
        setShowSettings(!showSettings);
    };



    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, field: string) => {
        e.dataTransfer.setData('ACTION', field);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const action = e.dataTransfer.getData('ACTION');
        if (action === 'ADD_NODE') {
            addNewNode(50, 50, '', action);
        } else if (action === 'ADD_FORM') {
            setShowFormBuilder(true);
            setIsAddFormBuilder(true);
        } else if (componentMap[action]) {
            setDynamicComponent(action);
            addNewNode(50, 50, '', action);
            // setWorkflowBuilder(prevWorkflowBuilder => ({
            //     ...prevWorkflowBuilder,
            //     nodes: prevWorkflowBuilder.nodes.map(node =>
            //         node.id === nodeId.toString() ? { ...node, data: { ...node.data, form: action } } : node
            //     )
            // }));
        }
    };



    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleEdgeClick = (_event: React.MouseEvent, edge: Edge) => {
        setSelectedEdge(edge);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Delete') {
            if (selectedEdge) {
                // Delete the selected edge
                setEdges((eds) => eds.filter((e) => e.id !== selectedEdge.id));
                setSelectedEdge(null);
            }
            if (selectedNode) {
                // Delete the selected node and its connected edges
                setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
                setEdges((eds) => eds.filter((edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id));
                setSelectedNode(null);

                // Remove the node from the workflowBuilder state
                setWorkflowBuilder(prevWorkflowBuilder => ({
                    ...prevWorkflowBuilder,
                    nodes: prevWorkflowBuilder.nodes.filter(node => node.id !== selectedNode.id), // 🔹 Remove deleted node
                    edges: prevWorkflowBuilder.edges.filter(edge => edge.source !== selectedNode.id && edge.target !== selectedNode.id) // 🔹 Remove related edges
                }));
            }

        }
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedEdge]);

    useEffect(() => {
        if (formBuilder.blocks.length === 0) return;

        if (isAddFormBuilder || !selectedNode) {
            const newNodeId = addNewNode(50, 50, formBuilder);

            setShowFormBuilder(false);
            setIsAddFormBuilder(false);
            setSelectedNode(null);
            setFormBuilder(getEmptyFormBuilder());

            console.log("Added new node:", newNodeId);
        } else {
            if (isCloseForm) {
                console.log(formBuilder.configureSelectionLogics);
                setNodes((prevNodes) =>
                    prevNodes.map((node) =>
                        node.id === selectedNode.id
                            ? {
                                ...node,
                                data: {
                                    ...node.data,
                                    label: formBuilder.name || node.data.label,
                                    form: formBuilder,
                                    "outputHandles": formBuilder.configureSelectionLogics.length ? formBuilder.configureSelectionLogics[0].start2 : node.data.outputHandles,
                                    "outputLabels": formBuilder.configureSelectionLogics.length ? formBuilder.configureSelectionLogics[0].start2 : node.data.outputLabels,
                                },
                            }
                            : node
                    )
                );

                setWorkflowBuilder((prevWorkflowBuilder) => ({
                    ...prevWorkflowBuilder,
                    nodes: prevWorkflowBuilder.nodes.map((node) =>
                        node.id === selectedNode.id
                            ? {
                                ...node,
                                data: {
                                    ...node.data,
                                    label: formBuilder.name || node.data.label,
                                    form: formBuilder,
                                    "outputHandles": formBuilder.configureSelectionLogics.length ? formBuilder.configureSelectionLogics[0].start2 : node.data.outputHandles,
                                    "outputLabels": formBuilder.configureSelectionLogics.length ? formBuilder.configureSelectionLogics[0].start2 : node.data.outputLabels,
                                },

                            }
                            : node
                    ),
                }));
                console.log('workflowBuilder', workflowBuilder)

                setShowFormBuilder(false);
                setIsAddFormBuilder(false);
                setSelectedNode(null);
                setFormBuilder(getEmptyFormBuilder());
                setIsCloseForm(false);
                console.log("Updated existing node:", selectedNode.id);
            }

        }
    }, [formBuilder, isCloseForm]);




    useEffect(() => {
        setWorkflowBuilder(prevWorkflowBuilder => ({
            ...prevWorkflowBuilder,  // Ensures we keep previous state
            edges: edges,
        }));
    }, [edges])

    const handleSaveWorkflowBuilder = async () => {
        console.log('Final updated workflowBuilder:', workflowBuilder);

        console.log('nodes', nodes)
        console.log('name', name)

        try {
            if (!name) {
                toast.info("Please Fill Workflow Name");
                return;
            }
            // Update workflowBuilder with the latest nodes before saving
            setWorkflowBuilder((prev) => ({
                ...prev,
                nodes: nodes,  // Ensure latest nodes with doer info is saved
            }));


            const response = await axios.post(
                `${config.API_URL_ACCOUNT}/WorkflowBuilder/InsertWorkflowBuilder`, {
                id,
                name,
                workflowBuilder: JSON.stringify(workflowBuilder),
            });
            console.log('response', response)
            if (response.data.isSuccess) {
                toast.success(response.data.message);
                navigate('/pages/WorkflowBuilderList')
            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            console.log(error)
        }
    }

    const handleName = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newName = event.target.value;
        setName(newName);
    };

    const componentMap: { [key: string]: React.FC } = {
        STAFF_ALLOCATION_PLAN,
        APPOINTMENT,
        NEW_APPOINTMENT,
        OLD_STAFF_TRANSFER,
        INDUCTION,
        UPDATE_EMPLOYEE,
        APPOINTMENT_LETTER,
        ASSIGN_TASK,
        BUSINESS_GROWTH_REVIEW,
        SALARY_PROCESSING,
    }

    const handleClose = () => {
        setDynamicComponent('');
    }

    const fetchDoerById = async (id: string) => {
        try {
            console.log(id)
            const response = await axios.get(`${config.API_URL_ACCOUNT}/WorkflowBuilder/GetWorkflowBuilder?ID=${id}`);
            if (response.data.isSuccess) {
                const fetchedModule = response.data.workflowBuilderLists[0];
                setName(fetchedModule.name);
                setNodes(JSON.parse(fetchedModule.workflowBuilder).nodes)
                setEdges(JSON.parse(fetchedModule.workflowBuilder).edges)
                // setWorkflowBuilder(fetchedModule);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching module:', error);
        }
    };

    useEffect(() => {
        if (id) {
            setEditMode(true);
            fetchDoerById(id);
        } else {
            setEditMode(false);
        }
    }, [id]);

    // Add event listener for keydown
    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedNode, selectedEdge]);

    const handleNodesChange = useCallback((changes: any) => {
        setNodes((nds) => {
            const updatedNodes = applyNodeChanges(changes, nds);

            // Update workflowBuilder.nodes without triggering unnecessary re-renders
            setWorkflowBuilder(prev => ({
                ...prev,
                nodes: updatedNodes
            }));

            return updatedNodes;
        });
    }, []);

    // Function to handle node selection
    const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
        setSelectedNode(node); // ✅ Sets the node you're editing
        console.log(node.data.form);

        if (node.data.form?.blocks?.length) {
            setShowFormBuilder(true);
            setFormBuilder(node.data.form); // ✅ Prefill existing form
            setIsAddFormBuilder(false);
        } else {
            console.log(node.data)
            if (node.data.form != "ADD_NODE")
                setDynamicComponent(node.data.form);
        }
    }, []);


    return (
        <div>
            {/* Top Navigation Bar */}
            <div className='bg-white d-flex align-items-center justify-content-between p-4' style={{ height: '3rem', borderBottom: '1px solid #ddd' }}>
                <h5 className='m-0'>Workflow Builder</h5>
                <Form.Group>
                    <Form.Control
                        type="text"
                        className='border-bottom border-0 ' placeholder='Name' style={{ width: '400px' }}
                        value={name}
                        onChange={handleName}
                    />
                </Form.Group>
                <i onClick={toggleWorkflowSetting} className='ri-settings-5-fill' style={{ fontSize: '1.5rem', cursor: 'pointer' }}></i>
                <button type='button' className='btn btn-primary' onClick={handleSaveWorkflowBuilder}><i className="ri-save-fill"></i> workflow</button>
            </div>
            <div className='row d-flex'>
                <div className='col-9' style={{ height: 'calc(100vh - 200px)', position: 'relative' }}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={handleNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        nodeTypes={nodeTypes}
                        fitView
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onEdgeClick={handleEdgeClick}
                        onNodeClick={onNodeClick}
                    >
                        <MiniMap />
                        <Controls />
                        <Background />
                    </ReactFlow>

                </div>
                <div className='bg-white col-3'>
                    {showSettings && (
                        <div style={{ position: 'absolute', top: '3rem', right: '0', width: '300px', background: 'white', border: '1px solid #ddd', boxShadow: '0px 4px 6px rgba(0,0,0,0.1)', padding: '10px', borderRadius: '5px', zIndex: 10 }}>
                            <WorkflowBuilderSetting workflowBuilder={workflowBuilder} setWorkflowBuilder={setWorkflowBuilder} />
                            <button onClick={toggleWorkflowSetting} style={{ marginTop: '10px', width: '100%', padding: '5px', background: '#ddd', border: 'none', borderRadius: '3px' }}>Close</button>
                        </div>
                    )}
                    <Modal
                        show={showFormBuilder}
                        backdrop="static" // Prevent closing when clicking outside the modal
                        size='xl'
                    >
                        <Modal.Header>
                            <Modal.Title>Edit Task for</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <FormBuilder formBuilder={formBuilder} setFormBuilder={setFormBuilder} isShowSaveButton={true} setIsCloseForm={setIsCloseForm} />
                        </Modal.Body>
                    </Modal>
                    <div draggable onDragStart={(e) => handleDragStart(e, 'ADD_NODE')} style={{ padding: '10px', border: '1px solid #ccc', cursor: 'grab', marginBottom: '10px' }}>Drag to Add Node</div>
                    <div draggable onDragStart={(e) => handleDragStart(e, 'ADD_FORM')} style={{ padding: '10px', border: '1px solid #ccc', cursor: 'grab', marginBottom: '10px' }}>Drag to Add Node With Form</div>
                    <div draggable onDragStart={(e) => handleDragStart(e, 'STAFF_ALLOCATION_PLAN')} style={{ padding: '10px', border: '1px solid #ccc', cursor: 'grab', marginBottom: '10px' }}>Staff Allocation Plan</div>
                    <div draggable onDragStart={(e) => handleDragStart(e, 'APPOINTMENT')} style={{ padding: '10px', border: '1px solid #ccc', cursor: 'grab', marginBottom: '10px' }}>Appointment</div>
                    <div draggable onDragStart={(e) => handleDragStart(e, 'NEW_APPOINTMENT')} style={{ padding: '10px', border: '1px solid #ccc', cursor: 'grab', marginBottom: '10px' }}>New Appointment</div>
                    <div draggable onDragStart={(e) => handleDragStart(e, 'OLD_STAFF_TRANSFER')} style={{ padding: '10px', border: '1px solid #ccc', cursor: 'grab', marginBottom: '10px' }}>Old Staff Transfer</div>
                    <div draggable onDragStart={(e) => handleDragStart(e, 'INDUCTION')} style={{ padding: '10px', border: '1px solid #ccc', cursor: 'grab', marginBottom: '10px' }}>Induction</div>
                    <div draggable onDragStart={(e) => handleDragStart(e, 'UPDATE_EMPLOYEE')} style={{ padding: '10px', border: '1px solid #ccc', cursor: 'grab', marginBottom: '10px' }}>Update Employee</div>
                    <div draggable onDragStart={(e) => handleDragStart(e, 'APPOINTMENT_LETTER')} style={{ padding: '10px', border: '1px solid #ccc', cursor: 'grab', marginBottom: '10px' }}>Appointment Letter</div>
                    <div draggable onDragStart={(e) => handleDragStart(e, 'ASSIGN_TASK')} style={{ padding: '10px', border: '1px solid #ccc', cursor: 'grab', marginBottom: '10px' }}>Assign Task</div>
                    <div draggable onDragStart={(e) => handleDragStart(e, 'BUSINESS_GROWTH_REVIEW')} style={{ padding: '10px', border: '1px solid #ccc', cursor: 'grab', marginBottom: '10px' }}>Business Growth Review</div>
                    <div draggable onDragStart={(e) => handleDragStart(e, 'SALARY_PROCESSING')} style={{ padding: '10px', border: '1px solid #ccc', cursor: 'grab', marginBottom: '10px' }}>Salary Processing</div>
                    {workflowBuilder.apiSetting.map((api) => (
                        <div key={api.id}>{api.name}</div>
                    ))}
                    {dynamicComponent && (
                        <Modal
                            show={true}
                            backdrop="static" // Prevent closing when clicking outside the modal
                            size='xl'
                            onHide={handleClose}
                        >
                            <Modal.Header closeButton>
                                <Modal.Title>Edit Task for</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {dynamicComponent && componentMap[dynamicComponent] && React.createElement(componentMap[dynamicComponent])}
                            </Modal.Body>
                        </Modal>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WorkflowBuilder;