import config from "@/config";
import { FIELD, PROPERTY } from "@/pages/FormBuilder/Constant/Interface";
import Editor from "@/pages/FormBuilder/Editor";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Alert, Card, Col, Container, Row } from "react-bootstrap";

// Define the TypeScript interface for the data
interface Input {
    label: string;
    value: string | number | boolean;
    type: string | number | boolean;
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
    id: number;
    taskCommonId: number;
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
    console.log("yha dekhao", groupedData);
    const formData = groupedData?.undefined ? groupedData.undefined[0]?.form_Json ? JSON.parse(groupedData.undefined[0]?.form_Json) : {} : {}
    const blockData = groupedData?.undefined ? groupedData.undefined[0]?.blockValue ? JSON.parse(groupedData.undefined[0]?.blockValue) : {} : {}
    // console.log('groupedData', JSON.parse(groupedData.undefined[0].form_Json))
    const [form, setForm] = useState<FIELD>({ ...formData, editMode: true });
    const [property, setProperty] = useState<PROPERTY>({
        label: '',
        id: '',
        placeholder: '',
        value: '',
        type: '',
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


    console.log(data)
    const downloadFile = async (processInitiationID: number, taskCommonID: number) => {
        try {
            // Step 1: Fetch file URLs
            const response = await axios.get(
                `${config.API_URL_ACCOUNT}/FileUpload/GetFileUrls?ProcessInitiationID=${processInitiationID}&TaskCommonID=${taskCommonID}`
            );

            if (response.status === 200) {
                const fileUrls = response.data.fileUrls;

                if (fileUrls && fileUrls.length > 0) {
                    const fileUrl = fileUrls[0]; // The first file URL
                    console.log(fileUrl);

                    try {
                        // Step 2: Fetch the file content using the DownloadFile API
                        const downloadResponse = await axios({
                            method: 'GET',
                            url: `${config.API_URL_ACCOUNT}/FileUpload/DownloadFile`,
                            params: { url: fileUrl },
                            responseType: 'blob', // Make sure to set the response type to 'blob' for binary files
                        });

                        // Step 3: Create an object URL and trigger the download
                        const url = window.URL.createObjectURL(new Blob([downloadResponse.data]));
                        const link = document.createElement('a');
                        link.href = url;

                        const fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);

                        const fileExtension = fileUrl.split('.').pop();

                        const finalFileName = `${fileName}.${fileExtension}`;

                        link.setAttribute('download', finalFileName);
                        document.body.appendChild(link);
                        link.click(); // Trigger the download

                        // Clean up by revoking the object URL
                        window.URL.revokeObjectURL(url);
                    } catch (downloadError) {
                        console.error('Error downloading the file:', downloadError);
                    }

                } else {
                    console.error("File URL not found in the response.");
                }
            } else {
                console.error("Failed to fetch file URL from the API.");
            }
        } catch (error) {
            console.error("Error fetching file URLs:", error);
        }
    };




    return (
        <div className="container mt-2 ">
            <Row>
                {/* {JSON.stringify(groupedData)} */}
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
                            {/* {form.blocks?.length === 0 && ( */}
                            <Col key={messName} className="">
                                <div>
                                    <div className="bg-primary text-white">

                                        {/* <h5 className="mb-0">
                                                {
                                                    messName &&
                                                        messName !== 'undefined' &&
                                                        messName !== null &&
                                                        messName !== ''
                                                        ? messName
                                                        : messTasks[0]?.taskName || 'Task'
                                                }
                                            </h5> */}




                                        {/* <h5>{messTasks[0]?.taskName || 'Task'}</h5> */}


                                    </div>
                                    <div className="row m-0 g-3"> {/* 'g-3' adds gutter (space) between columns */}
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
                                            <Card key={index} className="col-4 mb-3"> {/* Add margin-bottom 'mb-3' */}
                                                <Card.Header className="bg-primary text-white">
                                                    {/* Task name */}
                                                    <h5>{task.taskName || 'Task'}</h5>
                                                </Card.Header>
                                                <Card.Body>
                                                    {/* Manager details */}
                                                    {task.messManager && (
                                                        <p className="m-0"><strong>Manager:</strong> {task.messManager}</p>
                                                    )}
                                                    {task.managerNumber && (
                                                        <p className="m-0">
                                                            <strong>Mess Manager Contact: </strong>
                                                            <a
                                                                href={`tel:${task.managerNumber}`}
                                                                className="ms-1 text-primary"
                                                                style={{ textDecoration: "none" }}
                                                                aria-label="Call"
                                                            >
                                                                <i className="ri-phone-fill" style={{ fontSize: "1rem" }}></i>
                                                                {task.managerNumber}
                                                            </a>
                                                        </p>
                                                    )}
                                                    {task.managerNumber && (
                                                        <hr />
                                                    )}

                                                    {/* Task inputs */}
                                                    {Array.isArray(task.inputs) && task.inputs.length > 0 ? (
                                                        <ul>
                                                            {task.inputs.map((input, i) => (
                                                                input.label && input.value !== "" && (
                                                                    <li key={i}>
                                                                        <strong>{input.label}:</strong> {input.value.toString()}
                                                                    </li>
                                                                )
                                                            ))}
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
                                                </Card.Body>

                                                {Array.isArray(task.inputs) && task.inputs.some((input) => input.type === "file") && (
                                                    <button
                                                        onClick={() => downloadFile(task.id, task.taskCommonId)}
                                                        className="btn btn-primary"
                                                    >
                                                        Download File
                                                    </button>
                                                )}
                                            </Card>
                                        ))}
                                    </div>

                                </div>
                            </Col>
                            {/* )} */}
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
