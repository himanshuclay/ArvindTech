import React, { useState } from "react";
import { Button, Form, ListGroup, Card } from "react-bootstrap";
import {

    Edge,

} from 'reactflow';
interface APISetting {
    id: number;
    name: string;
    api: string;
}



interface WORKFLOW_BUILDER_SETTING_PROPS {
    workflowBuilder: {
        apiSetting: APISetting[];
    }
    setWorkflowBuilder: React.Dispatch<React.SetStateAction<{
        apiSetting: APISetting[],
        edges: Edge[];
    }>>;
}

const WorkflowBuilderSetting: React.FC<WORKFLOW_BUILDER_SETTING_PROPS> = ({ workflowBuilder, setWorkflowBuilder }) => {
    const [apiList, setApiList] = useState<APISetting[]>(workflowBuilder.apiSetting);
    const [newApiName, setNewApiName] = useState("");
    const [newApiEndpoint, setNewApiEndpoint] = useState("");

    const handleAddAPI = () => {
        if (!newApiName.trim() || !newApiEndpoint.trim()) {
            alert("Please enter both API Name and Endpoint!");
            return;
        }

        const newApi: APISetting = {
            id: apiList.length + 1,
            name: newApiName,
            api: newApiEndpoint,
        };

        setApiList([...apiList, newApi]);
        setWorkflowBuilder((prev) => ({ ...prev, apiSetting: [...prev.apiSetting, newApi] }));

        setNewApiName("");
        setNewApiEndpoint("");
    };

    return (
        <div className="p-4 bg-white shadow-md rounded-md max-w-lg mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Workflow API Settings</h2>

            {/* Input Fields */}
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>API Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter API Name"
                        value={newApiName}
                        onChange={(e) => setNewApiName(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>API Endpoint</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter API Endpoint"
                        value={newApiEndpoint}
                        onChange={(e) => setNewApiEndpoint(e.target.value)}
                    />
                </Form.Group>

                <Button onClick={handleAddAPI} variant="primary" className="w-100">
                    Add API
                </Button>
            </Form>

            {/* API List */}
            {apiList.length === 0 ? (
                <p className="text-gray-500 mt-3">No APIs added yet.</p>
            ) : (
                <Card className="mt-3">
                    <Card.Body>
                        <h5 className="mb-3">API List</h5>
                        <ListGroup>
                            {workflowBuilder.apiSetting.map((api) => (
                                <ListGroup.Item key={api.id} className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>{api.name}</strong> - <span className="text-muted">{api.api}</span>
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Card.Body>
                </Card>
            )}
        </div>
    );
};

export default WorkflowBuilderSetting;
