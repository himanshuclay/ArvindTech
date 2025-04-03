import { Edge, Node } from "reactflow";
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

const getSource = (
    workflowData: WorkflowBuilderConfig,
    id: string,
    sourceHandle?: string
) => {
    const start = workflowData.edges.find(e =>
        e.source === id && (sourceHandle ? e.sourceHandle === sourceHandle : true)
    );
    const activeNode = workflowData.nodes.find(n => n.id === start?.target);
    return activeNode;
};


const getActiveNode: any = (workflowData: WorkflowBuilderConfig, id: string, sourceHandle?: string) => {
    const activeNode = getSource(workflowData, id, sourceHandle);
    console.log('activeNode', activeNode)
    if (activeNode?.data.status === "completed") {
        return getActiveNode(workflowData, activeNode.data.nextNode.id, activeNode.data.nextNode.sourceHandle);
    } else {
        return activeNode;
    }
}

const getCompletedNodes = (workerData: WorkflowBuilderConfig, id: string, completedNodes: any[] = [], sourceHandle?: string): any[] => {
    console.log(id, sourceHandle)
    const currentNode = getSource(workerData, id, sourceHandle);
    console.log('currentNode',currentNode)

    // Base case: stop recursion if no node is found or if the status is not "completed"
    if (!currentNode || currentNode.data.status !== "completed") {
        return completedNodes;
    }

    // Push the current node (or specific part of the node you need) into the completedNodes array
    completedNodes.push(currentNode);

    // Recursive call with the next node's ID
    return getCompletedNodes(workerData, currentNode.data.nextNode.id, completedNodes, currentNode.data.nextNode.sourceHandle);
}


export {
    getActiveNode,
    getCompletedNodes,
}