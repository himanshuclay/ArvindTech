import { FIELD, PROPERTY } from "@/pages/FormBuilder/Constant/Interface";
import Editor from "@/pages/FormBuilder/Editor";
import React, { useEffect, useState } from "react";
import { Alert, Card, Col, Container, Row } from "react-bootstrap";

// Define the TypeScript interface for the data
interface Input {
    label: string;
    value: string | number | boolean;
}

interface Task {
    messID: string;
    messName: string;
    messManager: string;
    managerNumber: string;
    messTaskNumber: string;
    taskName: string;
    inputs: Input[];
    form_Json: any;
    blockValue: any;
}

interface GroupedData {
    [messName: string]: Task[];
}

// Helper function to group data by messName
const groupByMessName = (data: Task[]): GroupedData => {
    return data.reduce((acc: GroupedData, item: Task) => {
        if (!acc[item.messName]) {
            acc[item.messName] = [];
        }
        console.log(data);
        acc[item.messName].push(item);
        return acc;

    }, {});
};

const MessCards: React.FC<{ data: Task[] }> = ({ data }) => {
    // Group the data
    const groupedData = groupByMessName(data);
    console.log("yha dekhao",groupedData);
    const formData = groupedData?.undefined ? JSON.parse(groupedData.undefined[0]?.form_Json ) : {}
    const blockData = groupedData?.undefined ? JSON.parse(groupedData.undefined[0]?.blockValue ) : {}
    // console.log('groupedData', JSON.parse(groupedData.undefined[0].form_Json))
    const [form, setForm] = useState<FIELD>({ ...formData, editMode: true });
    const [property, setProperty] = useState<PROPERTY>({
        label: '',
        id: '',
        placeholder: '',
        value: '',
        required: "false",
        options: [{ label: '', value: '' }],
        advance: {
            backgroundColor: '',
            color: '',
        },
        isShow: false,
        disabled: false,
    })
    const [blockValue, setBlockValue] = useState({ ...blockData })
    useEffect(() => {
        setForm((preForm) => ({
            ...preForm,
            editMode: false,
        }))
        console.log('form', form)
    }, [])
    return (
        <div className="container mt-2 ">
            <Row>
                {Object.keys(groupedData).length === 0 ?
                    <Container className="my-5">
                        <Row className="justify-content-center">
                            <Col xs={12} md={8} lg={6}>
                                <Alert variant="info" className="text-center">
                                    <h4>No Details Found</h4>
                                    <p>You currently don't have any Data</p>
                                </Alert>
                            </Col>
                        </Row>
                    </Container>
                    : (Object.entries(groupedData).map(([messName, messTasks]) => (
                        <>
                            {form.blocks?.length === 0 && (
                                <Col key={messName} md={6} lg={4} className="">
                                    <Card>
                                        <Card.Header className="bg-primary text-white">

                                            <h5 className="mb-0">
                                                {
                                                    messName &&
                                                        messName !== 'undefined' &&
                                                        messName !== null &&
                                                        messName !== ''
                                                        ? messName
                                                        : messTasks[0]?.taskName || 'Task'
                                                }
                                            </h5>


                                            {/* <h5>{messTasks[0]?.taskName || 'Task'}</h5> */}


                                        </Card.Header>
                                        <Card.Body>
                                            {messTasks[0]?.messManager &&
                                                <p className="m-0"><strong>Manager:</strong> {messTasks[0]?.messManager}</p>
                                            }
                                            {messTasks[0]?.managerNumber &&
                                                <p className="m-0"><strong>Mess Manager Contact: </strong>
                                                    <a
                                                        href={`tel:${messTasks[0]?.managerNumber}`}
                                                        className="ms-1 text-primary"
                                                        style={{ textDecoration: "none" }}
                                                        aria-label="Call"
                                                    >
                                                        <i className="ri-phone-fill" style={{ fontSize: "1rem" }}></i>
                                                        {messTasks[0]?.managerNumber}
                                                    </a>
                                                </p>
                                            }
                                            {messTasks[0]?.managerNumber && messTasks[0]?.managerNumber &&
                                                <hr />}
                                            <h6>Tasks:</h6>

                                            {messTasks.map((task, index) => (
                                                <div key={index} className="">

                                                    {task.messTaskNumber ?
                                                        <p className="m-0">
                                                            <strong>Task ID:</strong> {task.messTaskNumber}
                                                        </p> : ''
                                                    }
                                                    {Array.isArray(task.inputs) && task.inputs.length > 0 ? (
                                                        <ul>
                                                            {task.inputs.map(
                                                                (input, i) =>
                                                                    input.label && input.value !== "" && (
                                                                        <li key={i}>
                                                                            <strong>{input.label}:</strong> {input.value.toString()}
                                                                        </li>
                                                                    )
                                                            )}
                                                        </ul>

                                                    ) : (
                                                        <Container className="my-5">
                                                            <Row className="justify-content-center">
                                                                <Col xs={12} md={8} lg={6}>
                                                                    <Alert variant="info" className="text-center">
                                                                        <h4>No Details Found</h4>
                                                                        <p>You currently don't have any Data</p>
                                                                    </Alert>
                                                                </Col>
                                                            </Row>
                                                        </Container>
                                                    )}
                                                    <hr />

                                                </div>
                                            ))}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            )}
                            {form.blocks?.length && (
                                <Editor form={form} setForm={setForm} property={property} setProperty={setProperty} blockValue={blockValue} setBlockValue={setBlockValue} isPreview={true} />
                            )}
                        </>
                    ))
                    )
                }







            </Row>
        </div>
    );
};



export default MessCards;
