import config from "@/config";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Select from "react-select";
import { Table, Form, Button, Card, Spinner } from "react-bootstrap";

interface Configuration {
    processId: string;
    formId: string;
    nodeId: string;
    nodes: [{ label: string, value: string }];
}

interface DROP_DOWN {
    id: string;
    name: string;
    nodes: string[];
}

// interface TEMPLATE_DROP_DOWN {
//     id: string;
//     templatesName: string;
// }

const AdhocConfig: React.FC = () => {
    const [configurations, setConfigurations] = useState<Configuration[]>([]);
    const [formOptions, setFormOptions] = useState<{ label: string; value: string }[]>([]);
    const [loading, setLoading] = useState(false);

    // Update configuration using react-select
    const handleConfigurationChange = (
        index: number,
        key: keyof Configuration,
        selectedOption: { value: string } | null
    ) => {
        const value = selectedOption ? selectedOption.value : "";
        const updatedConfigurations = configurations.map((config, i) =>
            i === index ? { ...config, [key]: value } : config
        );
        setConfigurations(updatedConfigurations);
    };

    // Save configurations
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

    // Fetch dropdown data and format options for react-select
    const getInitialDropDown = async () => {
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/CommonDropdown/GetAllTemplatesList`);
            console.log(response)
            if (response.data.isSuccess) {
                const newConfigurations = response.data.processDropdowns.map((p: DROP_DOWN) => ({
                    processId: p.id,
                    nodes: p.nodes,
                    formId: response.data.templateDropdowns[1] && JSON.parse(response.data.templateDropdowns[1].configurations)?.find(
                        (config: any) => config.processId === p.id
                    )?.formId || "",
                    nodeId: response.data.templateDropdowns[1] && JSON.parse(response.data.templateDropdowns[1].configurations)?.find(
                        (config: any) => config.processId === p.id
                    )?.nodeId || "",
                }));
                setConfigurations(newConfigurations);

                setFormOptions(
                    response.data.templatesLists.map((w: DROP_DOWN) => ({
                        label: w.name,
                        value: w.id,
                    }))
                );
            }
        } catch (error) {
            toast.error("Failed to fetch dropdown data.");
            console.error(error);
        }
    };

    useEffect(() => {
        getInitialDropDown();
    }, []);

    return (
        <div className="container mt-4">
            {/* Fixed Header and Save Button */}
            <div className="sticky-header">
                <h3 className="text-center mb-0">Form Configuration</h3>
                <div className="text-center mt-2">
                    <Button variant="primary" onClick={handleSaveConfiguration} disabled={configurations.length === 0 || loading}>
                        {loading ? <Spinner animation="border" size="sm" /> : "Save Configuration"}
                    </Button>
                </div>
            </div>

            {/* Configurations Table */}
            {configurations.length === 0 ? (
                <p className="text-center text-muted mt-4">No configurations added.</p>
            ) : (
                <Card className="shadow-sm mt-4">
                    <Card.Body>
                        <Table responsive bordered hover className="text-center align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th style={{ width: "30%" }}>Process Name</th>
                                    <th style={{ width: "30%" }}>Form Name</th>
                                    <th style={{ width: "40%" }}>Nodes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {configurations.map((config, index) => (
                                    <tr key={index}>
                                        <td>
                                            <Form.Control type="text" value={config.processId} disabled />
                                        </td>
                                        <td>
                                            <Select
                                                options={formOptions}
                                                value={formOptions.find(w => w.value === config.formId) || null}
                                                onChange={selectedOption => handleConfigurationChange(index, "formId", selectedOption)}
                                                placeholder="Select Form"
                                                isClearable
                                            />
                                        </td>
                                        <td>
                                            {config.nodes.length ?
                                                <Select
                                                    options={config.nodes}
                                                    value={config.nodes.find(w => w.value === config.nodeId) || null}
                                                    onChange={selectedOption => handleConfigurationChange(index, "nodeId", selectedOption)}
                                                    placeholder="Select Form"
                                                    isClearable
                                                />

                                                : ''}
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
