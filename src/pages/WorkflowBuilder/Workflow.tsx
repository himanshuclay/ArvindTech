import config from '@/config';
import axios from 'axios';
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useEdgesState, useNodesState } from 'reactflow';

const Workflow = () => {
    const { id } = useParams<{ id: string }>();
    const [name, setName] = useState('');
    const [nodes, setNodes] = useNodesState([]);
    const [edges, setEdges] = useEdgesState([]);

    const fetchDoerById = async (id: string) => {
        try {
            const response = await axios.get(`${config.API_URL_ACCOUNT}/WorkflowBuilder/GetWorkflowBuilder?ID=${id}`);
            if (response.data.isSuccess) {
                const fetchedModule = response.data.workflowBuilderLists[0];
                setName(fetchedModule.name);
                setNodes(JSON.parse(fetchedModule.workflowBuilder).nodes)
                setEdges(JSON.parse(fetchedModule.workflowBuilder).edges)
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching module:', error);
        }
    };
    useEffect(() => {
        if (id) {
            fetchDoerById(id);
        }
    }, [id]);
    useEffect(() => {
        console.log('edges', edges)
        console.log('nodes', nodes)
        edges.map((edg) => {
            if(edg.source === "1"){
                console.log(edg.target)
                let node = nodes.find((nod) => nod.id === edg.target)
                console.log(node);
                // manageFormSegment(node);
            }
        })
    },[edges])
    return (
        <div>
            <div>{name}</div>

        </div>
    )
}

export default Workflow
