import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, Pagination, Col, Form, Row, Table } from 'react-bootstrap';
import config from '@/config';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const YourComponent = () => {
    const [identifierList, setIdentifierList] = useState<any[]>([]);
    const [selectedIdentifierOne, setSelectedIdentifierOne] = useState<any>('');
    const [selectedIdentifierTwo, setSelectedIdentifierTwo] = useState<any>('');
    const [taskList, setTaskList] = useState<any[]>([]);
    const [selectedTask, setSelectedTask] = useState<string | null>(null);
    const [doerMasterList, setDoerMasterList] = useState<any[]>([]);
    const [identifierOneSource, setIdentifierOneSource] = useState<string | null>(null);
    const [identifierTwoSource, setIdentifierTwoSource] = useState<string | null>(null);
    // const [selectedSource, setSelectedSource] = useState<string | null>(null);
    const [previousTask, setPreviousTask] = useState<string | null>(null);
    const [inputFieldOptions, setInputFieldOptions] = useState([]);
    const [selectedInputField, setSelectedInputField] = useState<SelectOption | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);



    // Fetch identifier list and task list from API
    useEffect(() => {
        const fetchData = async (endpoint: string, setter: Function, listName: string) => {
            try {
                const response = await axios.get(`${config.API_URL_APPLICATION}/${endpoint}`);
                if (response.data.isSuccess) {
                    setter(response.data[listName]);
                } else {
                    console.error(response.data.message);
                }
            } catch (error) {
                console.error(`Error fetching data from ${endpoint}:`, error);
            }
        };
        fetchData('CommonDropdown/GetIdentifier?Flag=2', setIdentifierList, 'identifierList');
        fetchData('CommonDropdown/GetTaskList', setTaskList, 'taskList');
    }, []);

    const fetchDoerMasterList = async () => {
        try {
            // const response = await axios.get(`${config.API_URL_APPLICATION}/DoerMaster/GetDoerByIdentifier?PageIndex=1`);
            const response = await axios.get(`${config.API_URL_APPLICATION}/DoerMaster/GetDoerByIdentifier`, {
                params: { PageIndex: currentPage }
            });
            if (response.data.isSuccess) {
                setDoerMasterList(response.data.getDoerByIdentifiers);
                setTotalPages(Math.ceil(response.data.totalCount / 10));
                console.log(doerMasterList) // Update to match the new response structure
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching doer master list:', error);
        }
    };

    type SelectOption = {
        label: string;
        value: string;
    };


    // Call fetchDoerMasterList on component mount
    useEffect(() => {
        fetchDoerMasterList();
    }, []);

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Prepare the request data by extracting only the label values
        const requestData = {
            taskNumber: selectedTask, // Maps to the `TaskID`
            identifier1: selectedIdentifierOne?.label, // Extracting label for identifier1
            identifier1Source: identifierOneSource, // Should be set based on user input
            identifier2: selectedIdentifierTwo?.label, // Extracting label for identifier2
            identifier2Source: identifierTwoSource, // Should also be dynamically set
            previousTaskNumber: previousTask, // Add this field if applicable
            selectLabel: selectedInputField?.label || "", // Extracting label for selectLabel
        };

        console.log("Request Data:", requestData);

        try {
            const response = await axios.post(
                `${config.API_URL_ACCOUNT}/DynamicDoerAllocation/DynamicDoerAllocation`,
                requestData,
                {
                    headers: {
                        Accept: "*/*",
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.isSuccess) {
                console.log("Data submitted successfully:", response.data);

                toast.success("Doer Combination  submitted successfully");
                fetchDoerMasterList()
            } else {
<<<<<<< HEAD
                toast.error(response.data.message);
=======
                toast.error( response.data.message);
>>>>>>> a9a4718a7d8f68fe9598c094e12098cd8216fc06
            }
        } catch (error: any) {
            toast.error(error || "An error occurred");
        }
    };



    const handleSourceChange = (selectedOption: any, sourceType: 'identifierOne' | 'identifierTwo') => {
        if (sourceType === 'identifierOne') {
            setIdentifierOneSource(selectedOption?.value ?? null);
        } else if (sourceType === 'identifierTwo') {
            setIdentifierTwoSource(selectedOption?.value ?? null);
        }
        setSelectedInputField(null);
    };

    const handleTaskNumberChange = (selectedOption: any) => {
        setPreviousTask(selectedOption?.value ?? null);
    };

    const handleIdentifierChange = (selectedOption: any, identifier: string) => {
        if (identifier === 'identifierOne') {
            setSelectedIdentifierOne(selectedOption); // Store the whole object
            console.log("Identifier One Selected:", selectedOption?.label || "None");
        } else {
            setSelectedIdentifierTwo(selectedOption); // Store the whole object
            console.log("Identifier Two Selected:", selectedOption?.label || "None");
        }
    };

    useEffect(() => {
        const fetchInputFieldOptions = async () => {
            try {
                const response = await axios.get(`${config.API_URL_ACCOUNT}/DynamicDoerAllocation/GetLabelFromType`, {
                    params: { PreviousTaskNumber: previousTask }
                });

                const dataResponse = response.data.getLabelFromSelects;

                console.log("Fetched Data:", dataResponse); // Log the response data to verify
                console.log("Fetched Data:", response); // Log the response data to verify

                if (dataResponse && dataResponse.length > 0) {
                    // Only extract the label values into the options array
                    const options = dataResponse.map((item: { label: string }) => item.label);
                    setInputFieldOptions(options); // Set the options state
                    console.log("Options:", options); // Log the options to verify
                } else {
                    console.log("No labels found in the response.");
                }
            } catch (error) {
                console.error("Error fetching input field options:", error);
            }
        };

        fetchInputFieldOptions();
    }, [previousTask]); // Runs whenever previousTask changes



    console.log(inputFieldOptions)




    // Log the updated inputFieldOptions state after it changes
    useEffect(() => {
        console.log("Updated Input Field Options:", inputFieldOptions); // Log the updated state
    }, [inputFieldOptions]);// Runs whenever previousTask changes


    const handleTaskChange = (selectedOption: { value: string; label: string } | null) => {
        if (selectedOption) {
            setSelectedTask(selectedOption.label);
        } else {
            setSelectedTask(null);
        }
    };

    const handleSelectedInputFieldChange = (selectedOption: any) => {
        setSelectedInputField(selectedOption);
    };

    const [desiredTaskOptions, setDesiredTaskOptions] = useState<{ value: string; label: string }[]>([]);

    useEffect(() => {
        if (selectedTask) {
            // Fetch data from the API whenever a task is selected
            fetchDesiredTaskOptions(selectedTask);
        }
    }, [selectedTask]);

    const fetchDesiredTaskOptions = async (taskNumber: string) => {
        try {
            const response = await axios.get(
                `${config.API_URL_ACCOUNT}/DynamicDoerAllocation/GetTaskListfromTaskNumber`,
                { params: { TaskNumber: taskNumber } }
            );
            if (response.data.isSuccess && response.data.getTaskListfromTaskNumbers) {
                const options = response.data.getTaskListfromTaskNumbers.map((item: { taskID: string }) => ({
                    value: item.taskID,
                    label: item.taskID,
                }));
                setDesiredTaskOptions(options);
            }
        } catch (error) {
            console.error("Error fetching desired task options:", error);
        }
    };


    return (
        <div>
            <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center fs-20 rounded-3 border">
                <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>Task's Identifier Combinations</span></span>
            </div>

            <div className='bg-white p-2 rounded-3 border'>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        {/* Task Selection */}
                        <Col md={6}>
                            <Form.Group controlId="taskSelection" className='mb-2'>
                                <Form.Label>Task</Form.Label>
                                <Select
                                    options={taskList.map((item) => ({
                                        value: item.taskID,
                                        label: item.taskID,
                                    }))}
                                    value={
                                        selectedTask
                                            ? { value: selectedTask, label: taskList.find((item) => item.taskID === selectedTask)?.taskID }
                                            : null
                                    }
                                    onChange={(selectedOption) => handleTaskChange(selectedOption)}
                                    placeholder="Select Task"
                                />
                            </Form.Group>
                        </Col>

                        {/* Identifier One */}
                        <Col md={6}>
                            <Form.Group controlId="identifierOne" className='mb-2'>
                                <Form.Label>Identifier One</Form.Label>
                                <Select
                                    options={identifierList.map((item) => ({
                                        value: item.id,
                                        label: item.identifier,
                                    }))}
                                    value={selectedIdentifierOne} // Bind directly to the selected object
                                    onChange={(selectedOption) => handleIdentifierChange(selectedOption, "identifierOne")}
                                    placeholder="Select Identifier One"
                                />
                            </Form.Group>
                        </Col>


                        {/* Identifier One Source */}
                        <Col md={6}>
                            <Form.Group controlId="identifierOneSource" className='mb-2'>
                                <Form.Label>Identifier One Source</Form.Label>
                                <Select
                                    options={[
                                        { value: "fromInitiationFields", label: "From Initiation Fields" },
                                        { value: "fromProcessInputFields", label: "From Process Input Fields" },
                                    ]}
                                    value={
                                        identifierOneSource
                                            ? { value: identifierOneSource, label: identifierOneSource }
                                            : null
                                    }
                                    onChange={(selectedOption) => handleSourceChange(selectedOption, 'identifierOne')}
                                    placeholder="Select Identifier One Source"
                                />
                            </Form.Group>
                        </Col>

                        {/* Identifier Two */}
                        <Col md={6}>
                            <Form.Group controlId="identifierTwo" className='mb-2'>
                                <Form.Label>Identifier Two</Form.Label>
                                <Select
                                    options={[
                                        { value: null, label: "Not Applied" },
                                        ...identifierList.map((item) => ({
                                            value: item.id,
                                            label: item.identifier,
                                        })),
                                    ]}
                                    value={selectedIdentifierTwo} // Directly bind to the selected object
                                    onChange={(selectedOption) => handleIdentifierChange(selectedOption, "identifierTwo")}
                                    placeholder="Select Identifier Two"
                                />
                            </Form.Group>
                        </Col>


                        {/* Identifier Two Source */}
                        <Col md={6}>
                            <Form.Group controlId="identifierTwoSource" className='mb-2'>
                                <Form.Label>Identifier Two Source</Form.Label>
                                <Select
                                    options={[
                                        { value: "fromInitiationFields", label: "From Initiation Fields" },
                                        { value: "fromProcessInputFields", label: "From Process Input Fields" },
                                    ]}
                                    value={
                                        identifierTwoSource
                                            ? { value: identifierTwoSource, label: identifierTwoSource }
                                            : null
                                    }
                                    onChange={(selectedOption) => handleSourceChange(selectedOption, 'identifierTwo')}
                                    placeholder="Select Identifier Two Source"
                                />
                            </Form.Group>
                        </Col>

                        {/* Conditional Fields */}
                        {identifierTwoSource === "fromProcessInputFields" && (
                            <>
                                <Col md={6}>
                                    <Form.Group controlId="previousTask" className='mb-2'>
                                        <Form.Label>Previous Task Number</Form.Label>
                                        <Select
                                            options={desiredTaskOptions}
                                            value={
                                                previousTask
                                                    ? desiredTaskOptions.find((option) => option.value === previousTask)
                                                    : null
                                            }
                                            onChange={(selectedOption) => handleTaskNumberChange(selectedOption)}
                                            placeholder="Select Previous Task Number"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="inputFields" className='mb-2'>
                                        <Form.Label>Input Field</Form.Label>
                                        <Select
                                            options={inputFieldOptions.map((option) => ({
                                                label: option,  // Label for display
                                                value: option,  // Value for internal use
                                            }))}
                                            value={selectedInputField}  // Bind selected value
                                            onChange={handleSelectedInputFieldChange}  // Handle change
                                            placeholder="Select Input Field"
                                        />
                                    </Form.Group>
                                </Col>

                            </>
                        )}
                    </Row>


                    <Col className='align-items-end d-flex justify-content-end mb-3'>
                        <div>
                            <Link to={'/pages/DoerMaster'}>
                                <Button variant="primary" >
                                    Back
                                </Button>
                            </Link>
                            &nbsp;
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </div>
                    </Col>
                </Form>



            </div>

            {/* Table to display DoerMaster list */}
            <div className="mt-4">
                <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center fs-20 rounded-3 border">
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>Task's Identifier Combinations</span></span>
                    <Link to={'/pages/DoerMaster'}>
                        <Button variant="primary" >
                            Back
                        </Button>
                    </Link>
                </div>
                <Table hover className="bg-white">
                    <thead>
                        <tr>
                            <th className='py-2'>Sr.no</th>
                            <th className='py-2'>Task Name</th>
                            <th className='py-2'>Identifier One</th>
                            <th className='py-2'>Identifier One Source</th>
                            <th className='py-2'>Identifier Two</th>
                            <th className='py-2'>Identifier Two Source</th>
                            <th className='py-2'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {doerMasterList.slice(0, 10).map((item, index) => (
                            <tr key={index}>
                                <td >{index + 1}</td>
                                <td >{item.taskID}</td>
                                <td >{item.identifier1}</td>
                                <td >{item.identifier1Source}</td>
                                <td >{item.identifier2}</td>
                                <td >
                                    {item.identifier2Source ? (
                                        <>
                                            {item.identifier2Source}
                                            <br />
                                            From: {item.previousTaskNumber} ({item.selectLabel})
                                        </>
                                    ) : (
                                        "Not applicable"
                                    )}
                                </td>
                                <td >
                                    <Link to={`/pages/DoerMasterinsert/${item.taskID}`}>
                                        <Button variant='primary' className='p-0 text-white'>
                                            <i className='btn ri-edit-line text-white' ></i>
                                        </Button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
            <div className="d-flex justify-content-center align-items-center bg-white w-20 rounded-5 m-auto py-1 pb-1 my-2 pagination-rounded">
                <Pagination >
                    <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                    <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
                    <Pagination.Item active>{currentPage}</Pagination.Item>
                    <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
                    <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
                </Pagination>
            </div>



        </div>
    );
};

export default YourComponent;
