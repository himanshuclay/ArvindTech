import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row, ButtonGroup } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
import Select from 'react-select';
import CustomSuccessToast from '@/pages/other/Component/CustomSuccessToast';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_green.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Table, Container, Alert } from 'react-bootstrap';
import IconWithLetter from '@/pages/ui/IconWithLetter';


interface Process {
    id: number;
    moduleName: string;
    moduleID: string;
    processID: string;
    processDisplayName: string;
    misExempt: string;
    status: string;
    processObjective: string;
    processFlowchart: string;
    processOwnerID: string;
    processOwnerName: string;
    intervalType: string;
    day: string;
    time: string;
    date: string;
    dateValue: string;
    periodFrom: string;
    weekFrom: string;
    weekTo: string;
    periodTo: string;
    type: string;
    shopID: string;
    shopName: string;
    month: string;
    source: string;
    createdBy: string;
    updatedBy: string;
}

interface GetTypeDayTimeList {
    id: number;
    name: string;
}
interface MessDetail {
    projectName: string;
    messID: string;
    messName: string;
    managerEmpID: string;
    managerName: string;
}

interface Column {
    id: string;
    label: string;
    visible: boolean;
}


const AccountProcess = () => {
    const { id } = useParams<{ id: string }>();

    const navigate = useNavigate();

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState('');
    const [empName, setEmpName] = useState<string | null>('')
    const [messDetail, setMessDetail] = useState<MessDetail[]>([])
    const [process, setProcess] = useState<Process>({
        id: 0,
        moduleName: '',
        moduleID: '',
        processID: '',
        processDisplayName: '',
        misExempt: '',
        status: '',
        processObjective: '',
        processFlowchart: '',
        processOwnerID: '',
        processOwnerName: '',
        intervalType: '',
        day: '',
        time: '',
        date: '',
        dateValue: '',
        periodFrom: '',
        weekFrom: '',
        weekTo: '',
        periodTo: '',
        type: '',
        shopID: '',
        shopName: '',
        month: '',
        source: '',
        createdBy: '',
        updatedBy: ''
    });

    const [dropdownValuesFlag1, setDropdownValuesFlag1] = useState<GetTypeDayTimeList[]>([]);
    const [dropdownValuesFlag2, setDropdownValuesFlag2] = useState<GetTypeDayTimeList[]>([]);
    const [dropdownValuesFlag3, setDropdownValuesFlag3] = useState<GetTypeDayTimeList[]>([]);
    const [dropdownValuesFlag4, setDropdownValuesFlag4] = useState<GetTypeDayTimeList[]>([]);



    // both are required to make dragable column of table 
    const [columns, setColumns] = useState<Column[]>([
        { id: 'projectName', label: 'Project Name', visible: true },
        { id: 'messID', label: 'Mess ID', visible: true },
        { id: 'messName', label: 'Mess Name', visible: true },
        { id: 'managerEmpID', label: 'Manager Emp ID', visible: true },
        { id: 'managerName', label: 'Manager Name', visible: true },
    ]);
    const handleOnDragEnd = (result: any) => {
        if (!result.destination) return;
        const reorderedColumns = Array.from(columns);
        const [movedColumn] = reorderedColumns.splice(result.source.index, 1);
        reorderedColumns.splice(result.destination.index, 0, movedColumn);
        setColumns(reorderedColumns);
    };
    // ==============================================================


    useEffect(() => {
        const storedEmpName = localStorage.getItem('EmpName');
        if (storedEmpName) {
            setEmpName(storedEmpName);
        }
    }, []);

    useEffect(() => {
        if (id) {
            fetchModuleById(id);
        }
    }, [id]);

    useEffect(() => {

        fetchMessDetails(process.moduleName, process.processID);

    }, [process.moduleName, process.processID]);

    useEffect(() => {
        GetTypeDayTimeList(1, setDropdownValuesFlag1);
        GetTypeDayTimeList(2, setDropdownValuesFlag2);
        GetTypeDayTimeList(3, setDropdownValuesFlag3);
        GetTypeDayTimeList(4, setDropdownValuesFlag4);
    }, []);

    const fetchModuleById = async (id: string) => {
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/InitiationMaster/GetAccountIInitiation`, {
                params: { id: id }
            });
            if (response.data.isSuccess) {
                const fetchedModule = response.data.getAccountIInitiation;
                setProcess(fetchedModule);
                console.log(fetchedModule);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching module:', error);
        }
    };


    const fetchMessDetails = async (moduleName: string, processID: string) => {
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/InitiationMaster/GetMessDetailsforAccount`, {
                params: { ModuleName: moduleName, ProcessID: processID }
            });
            if (response.data.isSuccess) {
                const fetchedModule = response.data.getMessDetailsforAccount;
                setMessDetail(fetchedModule);
                console.log(fetchedModule);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching module:', error);
        }
    };



    console.log(id)

    const GetTypeDayTimeList = async (flag: any, setStateCallback: any) => {
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/CommonDropdown/GetTypeDayTimeList?flag=${flag}`);
            if (response.data.isSuccess) {
                setStateCallback(response.data.typeListResponses);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching modules:', error);
        }

    };




    // Handle form field changes
    const handleChange = (e: ChangeEvent<any> | null, name?: string, value?: any) => {
        if (e) {
            const { name: eventName, type } = e.target;

            if (type === 'checkbox') {
                const checked = (e.target as HTMLInputElement).checked;
                setProcess({
                    ...process,
                    [eventName]: checked
                });
            } else {
                const inputValue = (e.target as HTMLInputElement | HTMLSelectElement).value;
                setProcess({
                    ...process,
                    [eventName]: inputValue
                });
            }
        } else if (name) {
            setProcess({
                ...process,
                [name]: value
            });
        }
    };




    useEffect(() => {
        if (["Daily"].includes(process.intervalType)) {
            setProcess(process => ({
                ...process,
                day: '',
            }));
        }
    }, [process.intervalType]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        const payload = {
            ...process,
            updatedBy: empName
        };
        console.log(payload)
        e.preventDefault();
        try {
            await axios.post(`${config.API_URL_APPLICATION}/InitiationMaster/UpdateAccountIInitiation`, payload);
            navigate('/pages/ProcessMaster', {
                state: {
                    showToast: true,
                    toastMessage: "Process Initiated successfully!",
                    toastVariant: "rgb(28 175 85)"
                }
            });

        } catch (error) {
            setToastMessage("Error Adding/Updating");
            setToastVariant("rgb(213 18 18)");
            setShowToast(true);
            console.error('Error submitting module:', error);
        }
    };

    const moduleNameValidIDs = ['ACC.01', 'ACC.02', 'ACC.03', 'ACC.04', 'ACC.05'];
    const processDisplayNameValidIDs = ['ACC.01', 'ACC.02', 'ACC.03', 'ACC.04', 'ACC.05'];
    const processObjectiveValidIDs = ['ACC.01', 'ACC.02', 'ACC.03', 'ACC.04', 'ACC.05'];
    const processFlowchartValidIDs = ['ACC.01', 'ACC.02', 'ACC.03', 'ACC.04', 'ACC.05'];
    const misExemptValidIDs = ['ACC.01', 'ACC.02', 'ACC.03', 'ACC.04', 'ACC.05'];
    const statusValidIDs = ['ACC.01', 'ACC.02', 'ACC.03', 'ACC.04', 'ACC.05'];

    const periodFromValidIDs = ['ACC.01'];
    const periodToValidIDs = ['ACC.01'];
    const intervalTypeValidIDs = ['ACC.01', 'ACC.02', 'ACC.03', 'ACC.04', 'ACC.05'];
    const timeValidIDs = ['ACC.01', 'ACC.02', 'ACC.03', 'ACC.04', 'ACC.05'];
    const OwnerNameValidIDs = ['ACC.01', 'ACC.02', 'ACC.03', 'ACC.04', 'ACC.05'];
    // const weekToValidIDs = ['ACC.01', 'ACC.02', 'ACC.04', 'ACC.05'];
    // const weekFromValidIDs = ['ACC.01', 'ACC.02','ACC.04', 'ACC.05'];
    // const typeValidIDs = ['ACC.01', 'ACC.02', 'ACC.03', 'ACC.04', 'ACC.05'];
    const shopIDValidIDs = ['ACC.02'];
    const shopNameValidIDs = ['ACC.02'];



    // const options = [
    //     { value: 'Adanced', label: 'Adanced' },
    //     { value: 'Shop Bill', label: 'Shop Bill' }
    // ];
    return (
        <div>
            <div >


                <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center fs-20 rounded-3 border">
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>Process Initiation </span></span>
                </div>

                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>




                            {moduleNameValidIDs.includes(process.processID) && (
                                <Col lg={6}>
                                    <Form.Group controlId="moduleDisplayName" className="mb-3">
                                        <Form.Label>Module Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="moduleDisplayName"
                                            value={process.moduleName}
                                            readOnly
                                            disabled
                                        />
                                    </Form.Group>
                                </Col>
                            )}

                            {processDisplayNameValidIDs.includes(process.processID) && (
                                <Col lg={6}>
                                    <Form.Group controlId="processDisplayName" className="mb-3">
                                        <Form.Label>Process Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="processDisplayName"
                                            value={process.processDisplayName}
                                            disabled
                                            readOnly
                                        />
                                    </Form.Group>
                                </Col>
                            )}




                            {processObjectiveValidIDs.includes(process.processID) && (
                                <Col lg={6}>
                                    <Form.Group controlId="processObjective" className="mb-3">
                                        <Form.Label>Process Objective:</Form.Label>
                                        <Form.Control
                                            type="textarea"
                                            name="processObjective"
                                            value={process.processObjective ? process.processObjective : 'No File Avilable'}
                                            readOnly
                                            disabled
                                        />
                                    </Form.Group>
                                </Col>
                            )}

                            {processFlowchartValidIDs.includes(process.processID) && (
                                <Col lg={6}>
                                    <Form.Group controlId="processFlowchart" className="mb-3 position-relative">
                                        <Form.Label>Process Flowchart:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="processFlowchart"
                                            readOnly
                                            disabled
                                        />

                                        {process.processFlowchart && (
                                            <div className="mt-2 position-absolute download-file">
                                                <a
                                                    href={`path_to_your_files/${process.processFlowchart}`}
                                                    download={process.processFlowchart}
                                                    className="btn btn-link"
                                                >
                                                    <i className="ri-download-fill"></i>
                                                </a>
                                            </div>
                                        )}
                                    </Form.Group>
                                </Col>
                            )}


                            {misExemptValidIDs.includes(process.processID) && (
                                <Col lg={6}>
                                    <Form.Group controlId="misExempt" className="mb-3">
                                        <Form.Label>MIS Exempt:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="misExempt"
                                            value={process.misExempt}
                                            disabled
                                            readOnly
                                        />
                                    </Form.Group>
                                </Col>
                            )}

                            {statusValidIDs.includes(process.processID) && (
                                <Col lg={6}>
                                    <Form.Group controlId="status1" className="mb-3">
                                        <Form.Label>Status:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="status1"
                                            value={process.status}
                                            disabled
                                            readOnly
                                        />
                                    </Form.Group>
                                </Col>
                            )}
                            {OwnerNameValidIDs.includes(process.processID) && (

                                <Col lg={6}>
                                    <Form.Group controlId="processOwnerName" className="mb-3">
                                        <Form.Label>Process Owner Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="processOwnerName"
                                            value={process.processOwnerName}
                                            disabled
                                            readOnly
                                        />
                                    </Form.Group>
                                </Col>
                            )}

                            {periodFromValidIDs.includes(process.processID) && (
                                <Col lg={6}>
                                    <Form.Group controlId="periodFrom" className="mb-3">
                                        <Form.Label>Period From</Form.Label>
                                        <Select
                                            name="periodFrom"
                                            value={dropdownValuesFlag4.find((exempt) => exempt.name === process.periodFrom)}
                                            onChange={(selectedOption) => {
                                                setProcess({
                                                    ...process,
                                                    periodFrom: selectedOption?.name || '',
                                                });
                                            }}
                                            getOptionLabel={(item) => item.name}
                                            getOptionValue={(item) => item.name}
                                            options={dropdownValuesFlag4}
                                            isSearchable={true}
                                            placeholder="Select Date"
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            )}

                            {periodToValidIDs.includes(process.processID) && (
                                <Col lg={6}>
                                    <Form.Group controlId="periodTo" className="mb-3">
                                        <Form.Label>Period To</Form.Label>
                                        <Select
                                            name="periodTo"
                                            value={dropdownValuesFlag4.find((exempt) => exempt.name === process.periodTo)}
                                            onChange={(selectedOption) => {
                                                setProcess({
                                                    ...process,
                                                    periodTo: selectedOption?.name || '',
                                                });
                                            }}
                                            getOptionLabel={(item) => item.name}
                                            getOptionValue={(item) => item.name}
                                            options={dropdownValuesFlag4}
                                            isSearchable={true}
                                            placeholder="Select Date"
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            )}

                            {intervalTypeValidIDs.includes(process.processID) && (
                                <Col lg={6}>
                                    <Form.Group controlId="intervalType" className="mb-3">
                                        <Form.Label>Interval Type:</Form.Label>
                                        <Select
                                            name="intervalType"
                                            value={dropdownValuesFlag1.find((item) => item.name === process.intervalType)}
                                            onChange={(selectedOption) => {
                                                setProcess({
                                                    ...process,
                                                    intervalType: selectedOption?.name || '',
                                                });
                                            }}
                                            getOptionLabel={(item) => item.name}
                                            getOptionValue={(item) => item.name}
                                            options={dropdownValuesFlag1}
                                            isSearchable={true}
                                            placeholder="Select Interval Type"
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            )}


                            {["Weekly"].includes(process.intervalType) && (['ACC.01', 'ACC.02', 'ACC.03', 'ACC.04', 'ACC.05'].includes(process.processID)) && (
                                <Col lg={6}>
                                    <Form.Group controlId="intervalType" className="mb-3">
                                        <Form.Label>Day:</Form.Label>
                                        <Select
                                            name="day"
                                            value={dropdownValuesFlag2.find((item) => item.name === process.day)}
                                            onChange={(selectedOption) => {
                                                setProcess({
                                                    ...process,
                                                    day: selectedOption?.name || '',
                                                });
                                            }}
                                            getOptionLabel={(item) => item.name}
                                            getOptionValue={(item) => item.name}
                                            options={dropdownValuesFlag2}
                                            isSearchable={true}
                                            placeholder="Select Day"
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            )}

                            {["Monthly"].includes(process.intervalType) && (['ACC.01', 'ACC.02', 'ACC.03', 'ACC.04', 'ACC.05'].includes(process.processID)) && (
                                <Col lg={6}>
                                    <Form.Group controlId="date" className="mb-3">
                                        <Form.Label>Date:</Form.Label>
                                        <Select
                                            name="date"
                                            value={dropdownValuesFlag4.find((item) => item.name === process.day)}
                                            onChange={(selectedOption) => {
                                                setProcess({
                                                    ...process,
                                                    date: selectedOption?.name || '',
                                                });
                                            }}
                                            getOptionLabel={(item) => item.name}
                                            getOptionValue={(item) => item.name}
                                            options={dropdownValuesFlag4}
                                            isSearchable={true}
                                            placeholder="Select Date"
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            )}


                            {timeValidIDs.includes(process.processID) && (
                                < Col lg={6}>
                                    <Form.Group controlId="time" className="mb-3">
                                        <Form.Label>Time:</Form.Label>
                                        <Select
                                            name="time"
                                            value={dropdownValuesFlag3.find((item) => item.name === process.time)}
                                            onChange={(selectedOption) => {
                                                setProcess({
                                                    ...process,
                                                    time: selectedOption?.name || '',
                                                });
                                            }}
                                            getOptionLabel={(item) => item.name}
                                            getOptionValue={(item) => item.name}
                                            options={dropdownValuesFlag3}
                                            isSearchable={true}
                                            placeholder="Select Time"
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            )}
                            {/* 
                            {weekFromValidIDs.includes(process.processID) && (
                                <Col lg={6}>
                                    <Form.Group controlId="weekFrom" className="mb-3">
                                        <Form.Label>Week From:</Form.Label>

                                        <Flatpickr
                                            value={process.weekFrom}
                                            onChange={([date]) => setProcess({
                                                ...process,
                                                weekFrom: date.toISOString()
                                            })}
                                            options={{
                                                enableTime: false,
                                                dateFormat: "Y-m-d",
                                                time_24hr: false,
                                            }}
                                            placeholder="Enter Week From"
                                            className="form-control"
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            )}
                            {weekToValidIDs.includes(process.processID) && (
                                <Col lg={6}>
                                    <Form.Group controlId="weekTo" className="mb-3">
                                        <Form.Label>Week To:</Form.Label>

                                        <Flatpickr
                                            value={process.weekTo}
                                            onChange={([date]) => setProcess({
                                                ...process,
                                                weekTo: date.toISOString()
                                            })}
                                            options={{
                                                enableTime: false,
                                                dateFormat: "Y-m-d",
                                                time_24hr: false,
                                            }}
                                            placeholder="Enter Week From"
                                            className="form-control"
                                            required
                                        />
                                    </Form.Group>

                                </Col>
                            )} */}


                            {/* {typeValidIDs.includes(process.processID) && (
                                <Col lg={6}>
                                    <Form.Group controlId="type" className="mb-3">
                                        <Form.Label>Type</Form.Label>
                                        <Select
                                            name="type"
                                            options={options}
                                            value={options.find(option => option.value === process.type)}
                                            onChange={selectedOption => handleChange(null, 'type', selectedOption?.value)}
                                            placeholder="Select Fms Type"
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            )} */}


                            {shopIDValidIDs.includes(process.processID) && (
                                <Col lg={6}>
                                    <Form.Group controlId="shopID" className="mb-3">
                                        <Form.Label>Shop ID</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="shopID"
                                            value={process.shopID}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            )}
                            {shopNameValidIDs.includes(process.processID) && (
                                <Col lg={6}>
                                    <Form.Group controlId="shopName" className="mb-3">
                                        <Form.Label>Shop Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="shopName"
                                            value={process.shopName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            )}


                            <Col></Col>
                            <Col lg={2} className='align-items-end d-flex justify-content-end mb-3'>
                                <ButtonGroup aria-label="Basic example" className='w-100'>
                                    <Link to={'/pages/ProcessMaster'} className="btn btn-primary">
                                        Back
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        Initate Process
                                    </Button>
                                </ButtonGroup>
                            </Col>

                        </Row>

                    </Form>
                </div>

                <div className="overflow-auto mt-2 ">
                    <DragDropContext onDragEnd={handleOnDragEnd}>
                        <Table hover className='bg-white '>
                            <thead className='text-nowrap'>
                                <Droppable droppableId="columns" direction="horizontal">
                                    {(provided) => (
                                        <tr {...provided.droppableProps} ref={provided.innerRef as React.Ref<HTMLTableRowElement>}>
                                            <th><i className="ri-list-ordered-2"></i> Sr. No</th>
                                            {columns
                                                .filter((col) => col.visible)
                                                .map((column, index) => (
                                                    <Draggable key={column.id} draggableId={column.id} index={index}>
                                                        {(provided) => (
                                                            <th>
                                                                <div ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}>
                                                                    {column.id === 'moduleName' && (<i className="ri-settings-2-fill"></i>)}
                                                                    {column.id === 'processID' && (<i className="ri-user-settings-fill"></i>)}
                                                                    {column.id === 'processOwnerName' && (<i className="ri-user-fill"></i>)}
                                                                    {column.id === 'processDisplayName' && (<i className="ri-user-follow-fill"></i>)}
                                                                    {column.id === 'processObjective' && (<i className="ri-information-fill"></i>)}
                                                                    &nbsp; {column.label}
                                                                </div>
                                                            </th>
                                                        )}
                                                    </Draggable>
                                                ))}
                                            {provided.placeholder}
                                        </tr>
                                    )}
                                </Droppable>
                            </thead>
                            <tbody>
                                {messDetail.length > 0 ? (
                                    messDetail.slice(0, 10).map((item, index) => (
                                        <tr key={item.messID}>
                                            <td>{index + 1}</td>
                                            {columns.filter(col => col.visible).map((col) => (
                                                <td key={col.id}
                                                    className={
                                                        col.id === 'processOwnerName' ? 'fw-bold fs-13 text-dark text-nowrap' :
                                                            col.id === 'moduleName' ? 'fw-bold fs-13   text-nowrap' :
                                                                ''
                                                    }
                                                >
                                                    {col.id === 'managerName' ? (
                                                        <td>
                                                            <div className='d-flex align-items-center'>
                                                                <IconWithLetter letter={item.managerName.charAt(0)} />
                                                                {item.managerName.split('_')[0]}
                                                            </div>
                                                        </td>
                                                    ) : (
                                                        <div>

                                                            <td>{item[col.id as keyof MessDetail]}</td>
                                                        </div>
                                                    )}



                                                </td>
                                            ))}

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={12}>
                                            <Container className="mt-5">
                                                <Row className="justify-content-center">
                                                    <Col xs={12} md={8} lg={6}>
                                                        <Alert variant="info" className="text-center">
                                                            <h4>No Task Found</h4>
                                                            <p>You currently don't have Completed tasks</p>
                                                        </Alert>
                                                    </Col>
                                                </Row>
                                            </Container>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </DragDropContext>
                </div>


            </div>
            <CustomSuccessToast show={showToast} toastMessage={toastMessage} toastVariant={toastVariant} onClose={() => setShowToast(false)} />

        </div >
    );
};

export default AccountProcess;