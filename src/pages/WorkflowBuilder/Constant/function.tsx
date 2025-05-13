import { TABLE_INPUT_HEADERS } from "@/pages/FormBuilder/Constant/Constant";
import { BASIC_FIELD, LOGIC_ITEM, TRIGGER_ACTION } from "@/pages/FormBuilder/Constant/Interface";
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


const getActiveNode = (nodes: Node[], id: string): Node | undefined => {
    console.log(nodes, id)
    const activeNode = nodes.find(
        (node) =>
            node.data.activeDoer === id &&
            node.data.isActive &&
            (node.data?.status || node.data.status !== "completed")
    );
    console.log(activeNode)
    return activeNode;
};


const getCompletedNodes = (nodes: Node[]): Node[] => {
    console.log('nodes', nodes)
    const completedNode = nodes.filter(
        (node) =>
            node.data.status === "completed"
    );
    return completedNode;
}

const getBlockName = (blocks: any) => {
    const blockName = blocks.map((block: any) => block.property.label);
    return blockName;
}

type BlockNameOption = {
    label: string;
    value: string;
};

const getBlockNameOptions = (blocks: BASIC_FIELD[], inputType?: string): BlockNameOption[] => {
    return blocks
        .map((block: BASIC_FIELD) => {
            if (inputType) {
                if (block.is === inputType) {
                    return { label: `${block.property.label} ( ${block.property.id} )`, value: block.property.id };
                }
                return null; // Explicitly return null when the block doesn't match inputType
            } else {
                return { label: `${block.property.label} ( ${block.property.id} )`, value: block.property.id };
            }
        })
        .filter(Boolean) as BlockNameOption[]; // Filter out null values
};
const getPreviousTaskList = (
    nodes: Node[],
    edges: Edge[],
    edgeId: string,
    targetId: string,
    result: { label: string; value: string }[] = [],
    outputLabel?: string,
    visited: Set<string> = new Set()
): { label: string; value: string }[] => {
    const workflowData = {
        edges,
        nodes,
        apiSetting: [],
    };

    const node = getSource(workflowData, edgeId, outputLabel);

    if (node && !visited.has(node.id)) {
        visited.add(node.id);

        if (node.id == '2' || node.id === targetId) {
            return result;
        } else {
            result.push({ label: node.data.label, value: node.id });

            if (node.data.outputLabels && node.data.outputLabels.length > 1) {
                node.data.outputLabels.forEach((outputLabel: string) => {
                    getPreviousTaskList(nodes, edges, node.id, targetId, result, outputLabel, visited);
                });
            } else {
                getPreviousTaskList(nodes, edges, node.id, targetId, result, undefined, visited);
            }
        }
    }

    return result;
};


const getAllBlockName = (
    nodes: Node[],
    id: string,
    selection?: string,
    blockNameList: { label: string; value: string }[] = []
): { label: string; value: string }[] => {

    const node = nodes.find(n => n.id === id);

    if (node) {
        if (node.data.TaskBinding && node.data.BindingOption === "formAndValueWithEditMode") {
            blockNameList = getAllBlockName(nodes, node.data.TaskBinding, selection, blockNameList);
        }

        if (typeof node?.data.form !== "string") {
            blockNameList = getBlockNameOptions(node?.data.form.blocks, selection);
        }
    }

    return blockNameList;
};


const getAllBlockOptions = (nodes: Node[], taskNumber: string, blockId: string) => {
    const node = nodes.find(n => n.id == taskNumber);
    let blockOptions: { label: string, value: string }[] = [];
    if (node) {
        if (typeof node?.data.form === "string") {

        } else {
            const block = node?.data.form.blocks.find((block: any) => block.property.id === blockId);
            if (block) {
                blockOptions = block.property.options;
            }
        }
    }
    return blockOptions;
}

const fetchTableFields = (
    nodes: Node[],
    parallerTaskNumber: string,
    parallerTaskBlockName: string
): any => {
    const node = nodes.find(n => n.id === parallerTaskNumber);

    // Recursive case: if form is still a string, follow the binding
    if (typeof node?.data?.form === "string") {
        if (node.data.TaskBinding && node.data.BindingOption === "formAndValueWithEditMode") {
            return fetchTableFields(nodes, node.data.TaskBinding, parallerTaskBlockName);
        }
        return null;
    }

    // Find the block
    const block = node?.data?.form?.blocks?.find(
        (b: any) => b.property.id === parallerTaskBlockName
    );

    if (!block || !block.property?.tableConfiguration) return null;

    // Extract the table fields
    const tableField = TABLE_INPUT_HEADERS[block.property.tableConfiguration];

    return tableField || null;
  };
  

const updateIsPermanentRecursively = (
    triggeredActions: TRIGGER_ACTION[],
    index: number = 0
): TRIGGER_ACTION[] => {
    if (index >= triggeredActions.length) return triggeredActions;

    const currentBlock = triggeredActions[index];

    if (currentBlock.block && currentBlock.block.property.hasOwnProperty('isPermanent')) {
        currentBlock.block.property.isPermanent = false;
    }

    return updateIsPermanentRecursively(triggeredActions, index + 1);
};

const extractRecursively = (data: LOGIC_ITEM[], index = 0, acc: string[] = []): string[] => {
    if (index >= data.length) return acc;

    const current = data[index];

    const recurseStart2 = (arr: string[], i = 0): string[] => {
        if (i >= arr.length) return acc;
        acc.push(`${current.start1}.${arr[i]}`);
        return recurseStart2(arr, i + 1);
    };

    recurseStart2(current.start2);
    return extractRecursively(data, index + 1, acc);
};

// const getFilterTasks = (item: any) => {
//     try {
//         const templateJson = JSON.parse(item.templateJson);
//         const nodes = templateJson.nodes || [];
//         const activeNode = nodes.find((n: any) => n.data.isActive && localStorage.getItem("EmpId") === n.data.activeDoer);

//         if (activeNode) {
//             return {
//                 taskName: activeNode.data.label,
//                 task_Number: item.processID + activeNode.data.taskNumber
//             };
//         }

//         return null;
//     } catch (error) {
//         console.error("Failed to parse templateJson or process task:", error);
//         return null;
//     }
// };

const getFilterTasks = (item: any): { [key: string]: any } => {
    try {
        const templateJson = JSON.parse(item.templateJson);
        const nodes = templateJson.nodes || [];
        const activeNode = nodes.find((n: any) =>  localStorage.getItem("EmpId") === n.data.activeDoer);

        if (activeNode) {
            return {
                taskName: activeNode.data.label,
                task_Number: item.processID +'.'+ activeNode.data.taskNumber,
                ...item
            };
        }

        return {...item};
    } catch (error) {
        console.error("Failed to parse templateJson or process task:", error);
        return {};
    }
};




export {
    getActiveNode,
    getCompletedNodes,
    getBlockName,
    getPreviousTaskList,
    getAllBlockName,
    getAllBlockOptions,
    extractRecursively,
    updateIsPermanentRecursively,
    fetchTableFields,
    getFilterTasks,
}