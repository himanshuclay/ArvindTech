import config from "@/config";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Select from "react-select";
import { Table, Form, Button, Card, Spinner } from "react-bootstrap";

interface BlockOption {
    label: string;
    value: string;
}

interface SelectBlock {
    label: string;
    value: string;
    blockOptions?: BlockOption[];
}

interface FormOption {
    label: string;
    value: string;
    selectBlocks?: SelectBlock[];
}

interface Configuration {
    processId: string;
    formId: string;
    nodeId: string;
    nodes: { label: string; value: string }[];
    blockId: string;
    formBlocks?: SelectBlock[];
    blockOptions?: BlockOption[];
    nodeIds?: string[];
    nodesId?: string[];
    [key: string]: any;
}

interface DROP_DOWN {
    id: string;
    name: string;
    nodes: string[];
    selectBlocks: SelectBlock[];
}

const AdhocConfig: React.FC = () => {
    const [configurations, setConfigurations] = useState<Configuration[]>([]);
    const [formOptions, setFormOptions] = useState<FormOption[]>([]);
    const [loading, setLoading] = useState(false);

    type NodeChangeOption = {
        blockValue: string;
        selectedNode: { label: string; value: string } | null;
    };

    const handleConfigurationChange = (
        index: number,
        key: keyof Configuration | string,
        selectedOption: FormOption | { value: string } | NodeChangeOption | null
    ) => {
        const updatedConfigurations = [...configurations];
        const config = updatedConfigurations[index];

        if (typeof key === "string" && key.startsWith("nodeId")) {
            const idx = parseInt(key.replace("nodeId", ""), 10);
            if (!isNaN(idx)) {
                config.nodeIds = config.nodeIds || [];
                config.nodesId = config.nodesId || [];

                const selectedNode = (selectedOption as NodeChangeOption)?.selectedNode;
                const blockValue = (selectedOption as NodeChangeOption)?.blockValue;

                config.nodeIds[idx] = selectedNode?.value || "";
                config.nodesId[idx] = `${selectedNode?.value || ""}_${blockValue || ""}`;
            }

        } else if (key === "formId") {
            config.formId = (selectedOption as FormOption)?.value || "";
            config.formBlocks = (selectedOption as FormOption)?.selectBlocks || [];
            config.blockId = "";
            config.blockOptions = [];
            config.nodeIds = [];
        } else if (key === "blockId") {
            config.blockId = (selectedOption as { value: string })?.value || "";
        } else {
            config[key] = (selectedOption as { value: string })?.value || "";
        }

        setConfigurations(updatedConfigurations);
    };


    const handleSaveConfiguration = async () => {
        if (configurations.length === 0) {
            toast.warn("No configurations to save.");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(`${config.API_URL_ACCOUNT}/WorkflowBuilder/InsertUpdateTemplate`, {
                id: 2,
                configurations: JSON.stringify(configurations),
            });

            if (response.data.isSuccess) {
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Failed to save configurations.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getInitialDropDown = async () => {
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/CommonDropdown/GetAllTemplatesList`);

            if (response.data.isSuccess) {
                const templateList: DROP_DOWN[] = response.data.templatesLists;

                const newConfigurations = response.data.processDropdowns.map((p: DROP_DOWN) => {
                    const existingConfig = response.data.templateDropdowns[1] &&
                        JSON.parse(response.data.templateDropdowns[1].configurations)?.find(
                            (config: any) => config.processId === p.id
                        );

                    const selectedTemplate = templateList.find(t => t.id === existingConfig?.formId);

                    return {
                        processId: p.id,
                        nodes: p.nodes,
                        formId: existingConfig?.formId || "",
                        nodeId: existingConfig?.nodeId || "",
                        blockId: existingConfig?.blockId || "",
                        formBlocks: selectedTemplate?.selectBlocks || [],
                        blockOptions: selectedTemplate?.selectBlocks?.find(
                            b => b.value === existingConfig?.blockId
                        )?.blockOptions || [],
                        nodeIds: existingConfig?.nodeIds || []
                    };
                });

                setConfigurations(newConfigurations);

                setFormOptions(
                    templateList.map(w => ({
                        label: w.name,
                        value: w.id,
                        selectBlocks: w.selectBlocks,
                    }))
                );
            }
        } catch (error) {
            toast.error("Failed to fetch dropdown data.");
            console.error(error);
        }
    };


    const handleBlockChange = (index: number, selection: SelectBlock[]) => {
        const updated = [...configurations];
        updated[index].formBlocks = selection;
        setConfigurations(updated);
    };

    const handleNodes = (index: number, selection: BlockOption[]) => {
        const updated = [...configurations];
        updated[index].blockOptions = selection;
        updated[index].nodeIds = new Array(selection.length).fill("");
        setConfigurations(updated);
    };

    useEffect(() => {
        getInitialDropDown();
    }, []);

    return (
        <div className="container mt-4">
            <div className="sticky-header">
                <h3 className="text-center mb-0">Form Configuration</h3>
                <div className="text-center mt-2">
                    <Button variant="primary" onClick={handleSaveConfiguration} disabled={configurations.length === 0 || loading}>
                        {loading ? <Spinner animation="border" size="sm" /> : "Save Configuration"}
                    </Button>
                </div>
            </div>

            {configurations.length === 0 ? (
                <p className="text-center text-muted mt-4">No configurations added.</p>
            ) : (
                <Card className="shadow-sm mt-4">
                    <Card.Body>
                        <Table responsive bordered hover className="text-center align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Process Name</th>
                                    <th>Form Name</th>
                                    <th>Decider Input</th>
                                    <th>Defined Task</th>
                                </tr>
                            </thead>
                            <tbody>
                                {configurations.map((config, index) => (
                                    <tr key={index}>
                                        <td className="col-3 align-top">
                                            <Form.Control type="text" value={config.processId} disabled />
                                        </td>
                                        <td className="col-3 align-top">
                                            <Select
                                                options={formOptions}
                                                value={formOptions.find(w => w.value === config.formId) || null}
                                                onChange={(selectedOption: FormOption | null) => {
                                                    handleConfigurationChange(index, "formId", selectedOption);
                                                    if (selectedOption?.selectBlocks) {
                                                        handleBlockChange(index, selectedOption.selectBlocks);
                                                    }
                                                }}
                                                placeholder="Select Form"
                                                isClearable
                                            />
                                        </td>
                                        <td className="col-3 align-top">
                                            {config.formBlocks?.length ? (
                                                <Select
                                                    options={config.formBlocks}
                                                    value={config.formBlocks.find(w => w.value === config.blockId) || null}
                                                    onChange={(selectedOption: SelectBlock | null) => {
                                                        handleConfigurationChange(index, "blockId", selectedOption);
                                                        if (selectedOption?.blockOptions) {
                                                            handleNodes(index, selectedOption.blockOptions);
                                                        }
                                                    }}
                                                    placeholder="Select Block"
                                                    isClearable
                                                />
                                            ) : (
                                                ""
                                            )}
                                        </td>
                                        <td className="col-12 align-top">
                                            {config.blockOptions?.length ? (
                                                <>
                                                    {config.blockOptions.map((node, nodeIndex) => {
                                                        const selectedNodeValue = config.nodeIds?.[nodeIndex] || "";
                                                        const selectedNode = config.nodes.find(n => n.value === selectedNodeValue) || null;

                                                        return (
                                                            <div key={nodeIndex} className="mb-2">
                                                                <Form.Control
                                                                    type="text"
                                                                    value={node.label}
                                                                    disabled
                                                                    className="mb-1"
                                                                />
                                                                <Select
                                                                    options={config.nodes}
                                                                    value={selectedNode}
                                                                    onChange={selectedOption =>
                                                                        handleConfigurationChange(index, `nodeId${nodeIndex}`, {
                                                                            blockValue: node.value,
                                                                            selectedNode: selectedOption
                                                                        })
                                                                    }
                                                                    placeholder="Select Node"
                                                                    isClearable
                                                                />

                                                            </div>
                                                        );
                                                    })}


                                                </>
                                            ) : config.nodes.length ? (
                                                // <>{JSON.stringify(config.nodes)}</>
                                                <Select
                                                    options={config.nodes}
                                                    value={config.nodes.find(w => w.value === config.nodeId) || null}
                                                    onChange={selectedOption => handleConfigurationChange(index, "nodeId", selectedOption)}
                                                    placeholder="Select Node"
                                                    isClearable
                                                />
                                            ) : (
                                                ""
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            )}
        </div>
    );
};

export default AdhocConfig;
