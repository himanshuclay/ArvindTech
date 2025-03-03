import React, { useState, useCallback, useEffect, useMemo } from 'react';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Node,
    Edge,
    Connection,
    Handle,
    Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import WorkflowBuilderSetting from './WorkflowBuilderSetting';
import FormBuilder from '../FormBuilder/FormBuilder';
import { Modal } from 'react-bootstrap';
import { FIELD } from '../FormBuilder/Constant/Interface';

const initialNodes: Node[] = [
    { id: '1', type: 'input', data: { label: 'Start Node', inputHandles: 1, outputHandles: 1 }, position: { x: 100, y: 100 } },
    { id: '2', type: 'output', data: { label: 'End Node', inputHandles: 1, outputHandles: 1 }, position: { x: 500, y: 100 } },
];

const initialEdges: Edge[] = [{ id: 'e1-1', source: '1', target: '2' }];

interface APISetting {
    name: string;
    api: string;
    id: number;
}

interface WorkflowBuilderConfig {
    apiSetting: APISetting[];
    edges: Edge[];
}

const CustomNode = ({ data, id }: { data: any, id: string }) => {
    const [inputHandles,] = useState(data.inputHandles || 1);
    const [outputHandles,] = useState(data.outputHandles || 1);
    return (
        <div style={{ border: '1px solid black', padding: '10px', borderRadius: '5px', background: 'white', position: 'relative' }}>
            {[...Array(inputHandles)].map((_, index) => (
                <Handle
                    key={`input-${id}-${index}`}
                    type='target'
                    position={Position.Top}
                    style={{ left: `${(index + 1) * (100 / (inputHandles + 1))}%` }}
                />
            ))}
            {data.label}
            {[...Array(outputHandles)].map((_, index) => (
                <Handle
                    key={`output-${id}-${index}`}
                    type='source'
                    position={Position.Bottom}
                    style={{ left: `${(index + 1) * (100 / (outputHandles + 1))}%` }}
                />
            ))}
        </div>
    );
};

const WorkflowBuilder: React.FC = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null)
    const [nodeId, setNodeId] = useState<number>(3);
    const [showSettings, setShowSettings] = useState<boolean>(false);
    const [workflowBuilder, setWorkflowBuilder] = useState<WorkflowBuilderConfig>({
        apiSetting: [],
        edges: [],
    });
    const [formBuilder, setFormBuilder] = useState<FIELD>({
        name: '',
        blocks: [],
        editMode: true,
        rules: [],
        advance: {
            backgroundColor: '',
            color: '',
        }
    });
    const [showFormBuilder, setShowFormBuilder] = useState(false);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    const addNewNode = (x: number, y: number) => {
        const newNode: Node = {
            id: nodeId.toString(),
            type: 'custom',
            data: { label: `New Node ${nodeId}`, handles: Math.floor(Math.random() * 4) + 1 },
            position: { x, y },
        };
        setNodes((nds) => [...nds, newNode]);
        setNodeId(nodeId + 1);
        return nodeId;
    };

    const toggleWorkflowSetting = () => {
        setShowSettings(!showSettings);
    };

    const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, field: string) => {
        e.dataTransfer.setData('ACTION', field);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const action = e.dataTransfer.getData('ACTION');
        if (action === 'ADD_NODE') {
            addNewNode(50, 50);
        } else if (action === 'ADD_FORM') {
            setShowFormBuilder(true);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleEdgeClick = (_event: React.MouseEvent, edge: Edge) => {
        setSelectedEdge(edge);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Delete' && selectedEdge) {
            setEdges((eds) => eds.filter((e) => e.id !== selectedEdge.id));
            setSelectedEdge(null);
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedEdge]); workflowBuilder

    useEffect(() => {
        if (formBuilder.blocks.length > 0) {
            const nodeId = addNewNode(50, 50);
            setWorkflowBuilder(prevWorkflowBuilder => ({
                ...prevWorkflowBuilder,  // Ensures we keep previous state
                [nodeId]: {
                    ...formBuilder,  // Now uses the latest updated formBuilder
                },
            }));
            setShowFormBuilder(false);
            setFormBuilder({
                name: '',
                blocks: [],
                editMode: true,
                rules: [],
                advance: {
                    backgroundColor: '',
                    color: '',
                }
            })
        }
    }, [formBuilder]);

    useEffect(() => {
        console.log('edges', edges)
        setWorkflowBuilder(prevWorkflowBuilder => ({
            ...prevWorkflowBuilder,  // Ensures we keep previous state
            edges: edges,
        }));
    },[edges])

    const handleSaveWorkflowBuilder = () => {
        console.log('Final updated workflowBuilder:', workflowBuilder);
        
        console.log('edges', edges)
    }



    return (
        <div>
            {/* Top Navigation Bar */}
            <div className='bg-white d-flex align-items-center justify-content-between p-3' style={{ height: '3rem', borderBottom: '1px solid #ddd' }}>
                <h5 className='m-0'>Workflow Builder</h5>
                <i onClick={toggleWorkflowSetting} className='ri-settings-5-fill' style={{ fontSize: '1.5rem', cursor: 'pointer' }}></i>
                <button type='button' onClick={handleSaveWorkflowBuilder}>save workflow</button>
            </div>
            <div className='row d-flex'>
                <div className='col-9' style={{ height: 'calc(100vh - 200px)', position: 'relative' }}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        nodeTypes={nodeTypes}
                        fitView
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onEdgeClick={handleEdgeClick}
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
                            <FormBuilder formBuilder={formBuilder} setFormBuilder={setFormBuilder} />
                        </Modal.Body>
                    </Modal>
                    <div draggable onDragStart={(e) => handleDragStart(e, 'ADD_NODE')} style={{ padding: '10px', border: '1px solid #ccc', cursor: 'grab', marginBottom: '10px' }}>Drag to Add Node</div>
                    <div draggable onDragStart={(e) => handleDragStart(e, 'ADD_FORM')} style={{ padding: '10px', border: '1px solid #ccc', cursor: 'grab', marginBottom: '10px' }}>Drag to Add Node With Form</div>
                    {workflowBuilder.apiSetting.map((api) => (
                        <div key={api.id}>{api.name}</div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WorkflowBuilder;