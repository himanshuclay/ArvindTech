import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEdgesState, useNodesState } from 'reactflow';
import axios from 'axios';
import config from '@/config';

import STAFF_ALLOCATION_PLAN from './DynamicSegment/STAFF_ALLOCATION_PLAN';
import APPOINTMENT from './DynamicSegment/APPOINTMENT';
import NEW_APPOINTMENT from './DynamicSegment/NEW_APPOINTMENT';
import OLD_STAFF_TRANSFER from './DynamicSegment/OLD_STAFF_TRANSFER';
import INDUCTION from './DynamicSegment/INDUCTION';

const Workflow = () => {
    const { id } = useParams<{ id: string }>();
    const [name, setName] = useState('');
    const [nodes, setNodes] = useNodesState([]);
    const [edges, setEdges] = useEdgesState([]);
    const [dynamicComponent, setDynamicComponent] = useState<string>('');
    const [dynamicNode, setDynamicNode] = useState<any | undefined>('');

    // Dynamic Ref Mapping
    const componentRefMap = useRef<{ [key: string]: any }>({});

    const fetchDoerById = async (id: string) => {
        try {
            const response = await axios.get(`${config.API_URL_ACCOUNT}/WorkflowBuilder/GetWorkflowBuilder?ID=${id}`);
            if (response.data.isSuccess) {
                const fetchedModule = response.data.workflowBuilderLists[0];
                setName(fetchedModule.name);
                setNodes(JSON.parse(fetchedModule.workflowBuilder).nodes);
                setEdges(JSON.parse(fetchedModule.workflowBuilder).edges);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching module:', error);
        }
    };

    const manageDynamic = (dynamicNode: any, formData?: any) => {
        console.log(dynamicNode)
        console.log(formData)
        if (dynamicNode?.data?.form === 'APPOINTMENT') {
            edges.forEach((edg) => {
                if (edg.source === dynamicNode.id && edg.sourceHandle === formData.typeOfAppointment) {
                    let node = nodes.find((nod) => nod.id === edg.target);
                    setDynamicComponent(node?.data.form);
                    setDynamicNode(node);
                }
            });
        }else{
            edges.forEach((edg) => {
                if (edg.source === dynamicNode.id) {
                    let node = nodes.find((nod) => nod.id === edg.target);
                    console.log(node)
                    setDynamicComponent(node?.data.form);
                    setDynamicNode(node);
                }
            });
        }
    };

    useEffect(() => {
        if (id) {
            fetchDoerById(id);
        }
    }, [id]);

    useEffect(() => {
        edges.forEach((edg) => {
            if (edg.source === "1") {
                let node = nodes.find((nod) => nod.id === edg.target);
                setDynamicComponent(node?.data.form);
                setDynamicNode(node);
            }
        });
    }, [edges]);

    const componentMap: { [key: string]: React.FC<any> } = {
        STAFF_ALLOCATION_PLAN,
        APPOINTMENT,
        NEW_APPOINTMENT,
        OLD_STAFF_TRANSFER,
        INDUCTION,
    };

    const handleSaveWorkflow = () => {
        console.log(dynamicNode);
        let formData;

        // Fetch data dynamically based on the rendered component
        if (componentRefMap.current[dynamicComponent]) {
            formData = componentRefMap.current[dynamicComponent]?.getAppointmentData?.();
            console.log("Saved Data from Dynamic Component:", formData);
        }
        if (dynamicNode && formData) {
            manageDynamic(dynamicNode, formData);
        }else if(dynamicNode){
            manageDynamic(dynamicNode);
        }
    };

    return (
        <div>
            <div>{name}</div>

            {dynamicComponent && componentMap[dynamicComponent] && (
                React.createElement(componentMap[dynamicComponent], {
                    ref: (instance: any) => {
                        if (instance) {
                            componentRefMap.current[dynamicComponent] = instance;
                        }
                    }
                })
            )}

            <button type='button' onClick={handleSaveWorkflow}>Save</button>
        </div>
    );
};

export default Workflow;
