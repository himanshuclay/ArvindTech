import config from "@/config";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Select from "react-select";
import { Table, Button, Card } from "react-bootstrap";
import "remixicon/fonts/remixicon.css";


interface Configuration {
    start1: string;
    start2: string;
}

interface TemplateOption {
    label: string;
    value: string;
}

const ProcessRelation: React.FC = () => {
    const [relations, setRelations] = useState<Configuration[]>([]);
    const [templateOptions, setTemplateOptions] = useState<TemplateOption[]>([]);

    const fetchRelations = async () => {
        try {
            const res = await axios.get(`${config.API_URL_ACCOUNT}/ProcessInitiation/GetStartItem`);
            if (res.data.isSuccess) {
                setRelations(res.data.startItems); // assumes the response is in [{start1: '', start2: ''}, ...] format
            }
        } catch (err) {
            toast.error("Failed to fetch saved relations.");
        }
    };
    const fetchTemplates = async () => {
        try {
            const res = await axios.get(`${config.API_URL_ACCOUNT}/WorkflowBuilder/GetWorkflowBuilder`);
            if (res.data.isSuccess) {
                const options = res.data.workflowBuilderLists.map((item: any) => ({
                    label: item.name,
                    value: item.id.toString()
                }));
                setTemplateOptions(options);

            }
            console.log(templateOptions);
        } catch (err) {
            toast.error("Failed to fetch templates.");
        }
    };

    useEffect(() => {
        fetchTemplates();
        fetchRelations();
    }, []);

    const handleAddRelation = () => {
        setRelations([...relations, { start1: "", start2: "" }]);
    };

    const handleRemoveRelation = (index: number) => {
        const updated = [...relations];
        updated.splice(index, 1);
        setRelations(updated);
    };

    const handleSelectChange = (index: number, field: keyof Configuration, value: string) => {
        const updated = [...relations];
        updated[index][field] = value;
        setRelations(updated);
    };

    const handleSave = async () => {
        try {
            console.log(relations);
            const response = await axios.post(`${config.API_URL_ACCOUNT}/ProcessInitiation/InsertStartItem`, relations);

            if (response.data?.isSuccess) {
                toast.success("Relations saved successfully!");
            } else {
                toast.error(response.data?.message || "Failed to save relations.");
            }
        } catch (error) {
            console.error("API Error:", error);
            toast.error("An error occurred while saving relations.");
        }

    };
    

    return (
        <div className="container mt-4">
            <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center fs-20">
                <span><i className="ri-file-list-line me-2"></i><span className="fw-bold test-nowrap">Process Relation</span></span>
                <div className="d-flex">
                    <button type="button" onClick={handleAddRelation} className="me-2 btn btn-primary">Add Relation</button>
                </div>
            </div>
            {/* <h3 className="text-center mb-3">Process Relation</h3>
            <div className="text-center mb-3">
                <Button variant="success" onClick={handleAddRelation}>Add Relation</Button>
            </div> */}

            {relations.length === 0 ? (
                <p className="text-center text-muted">No relations added.</p>
            ) : (
                <Card className="shadow-sm" style={{ height: "calc(100vh - 184px)", overflowY: "auto" }}>
                    <Card.Body>
                        <div className="h-100">
                            <Table responsive bordered className="align-middle">
                                <thead className="table-light text-center">
                                    <tr>
                                        <th>Start Form</th>
                                        <th style={{ width: "50px" }}>→</th>
                                        <th>End Form</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {relations.map((relation, index) => (
                                        <tr key={index}>
                                            <td>
                                                <Select
                                                    options={templateOptions}
                                                    value={templateOptions.find(opt => opt.value === relation.start1) || null}
                                                    onChange={(selected) =>
                                                        handleSelectChange(index, "start1", selected?.value || "")
                                                    }
                                                    placeholder="Select Start Form"
                                                />
                                            </td>
                                            <td className="text-center">→</td>
                                            <td>
                                                <Select
                                                    options={templateOptions}
                                                    value={templateOptions.find(opt => opt.value === relation.start2) || null}
                                                    onChange={(selected) =>
                                                        handleSelectChange(index, "start2", selected?.value || "")
                                                    }
                                                    placeholder="Select End Form"
                                                />
                                            </td>
                                            <td className="text-center">
                                                <i
                                                    className="ri-indeterminate-circle-line text-danger fs-5 mx-2 cursor-pointer"
                                                    onClick={() => handleRemoveRelation(index)}
                                                    title="Remove Relation"
                                                ></i>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </Card.Body>
                    <div className="text-end m-2">
                        <Button variant="primary" onClick={handleSave}>Save Relation</Button>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default ProcessRelation;
