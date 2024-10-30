import axios from 'axios';
import { useState, useEffect, ChangeEvent } from 'react';
import { Button, Pagination, Table, Container, Row, Col, Alert } from 'react-bootstrap';
// import { Button, Pagination, Table, Container, Row, Col, Alert, Form, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import config from '@/config';
import CustomSuccessToast from '../../Component/CustomSuccessToast';
// import Select from 'react-select';
import { useLocation, useNavigate } from 'react-router-dom';

interface BdInput {
    id: number;
    moduleID: string;
    processID: string;
    taskID: string;
    inputID: string;
    inputType: string;
    inputDisplayName: string;
    inputVariables: string;
    predecessorOrLogic: string;
    status: string;
    createdBy: string;
    updatedBy: string;
}


interface Column {
    id: string;
    label: string;
    visible: boolean;
}


const BdInputMaster = () => {
    const [hrResumes, setHrResumes] = useState<BdInput[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [downloadCsv, setDownloadCsv] = useState<BdInput[]>([]);



    const location = useLocation();
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastVariant, setToastVariant] = useState('');



    useEffect(() => {
        if (location.state && location.state.showToast) {
            setShowToast(true);
            setToastMessage(location.state.toastMessage);
            setToastVariant(location.state.toastVariant);

            setTimeout(() => {
                setShowToast(false);
                navigate(location.pathname, { replace: true });
            }, 5000);
        }
        return () => {
            setShowToast(false);
            setToastMessage('');
            setToastVariant('');
        };
    }, [location.state, navigate]);


    // const [moduleDisplayName, setModuleDisplayName] = useState('');
    // const [moduleOwnerName, setModuleOwnerName] = useState('');


    // const handleSearch = (e: any) => {
    //     e.preventDefault();

    //     let query = `?`;
    //     if (moduleDisplayName) query += `ModuleDisplayName=${moduleDisplayName}&`;
    //     if (moduleOwnerName) query += `ModuleOwnerName=${moduleOwnerName}&`;

    //     query = query.endsWith('&') ? query.slice(0, -1) : query;

    //     const apiUrl = `https://arvindo-api2.clay.in/api/ModuleMaster/SearchModuleList${query}`;

    //     axios.get(apiUrl, {
    //         headers: {
    //             'accept': '*/*'
    //         }
    //     })
    //         .then((response) => {
    //             console.log(response.data.moduleMasterListResponses);
    //             setHrResumes(response.data.moduleMasterListResponses)
    //         })
    //         .catch((error) => {
    //             console.error('Error fetching data:', error);
    //         });
    // };



    // both are required to make dragable column of table 
    const [columns, setColumns] = useState<Column[]>([
        { id: 'moduleID', label: 'Module ID', visible: true },
        { id: 'processID', label: 'Process ID', visible: true },
        { id: 'taskID', label: 'Task ID', visible: true },
        { id: 'inputID', label: 'Input ID', visible: true },
        { id: 'inputType', label: 'Input Type', visible: true },
        { id: 'inputDisplayName', label: 'Input Display Name', visible: true },
        { id: 'inputVariables', label: 'Input Variables', visible: true },
        { id: 'predecessorOrLogic', label: 'Predecessor or Logic', visible: true },
        { id: 'status', label: 'Status', visible: true },
    ]);


    const handleOnDragEnd = (result: any) => {
        if (!result.destination) return;
        const reorderedColumns = Array.from(columns);
        const [movedColumn] = reorderedColumns.splice(result.source.index, 1);
        reorderedColumns.splice(result.destination.index, 0, movedColumn);
        setColumns(reorderedColumns);
    };
    // ==============================================================






    // Fetch the department list on component mount
    useEffect(() => {
        fetchModules();
        fetchModulesCsv()
    }, [currentPage]);

    const fetchModules = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/BDInputMaster/GetBDInput`, {
                params: {
                    PageIndex: currentPage
                }
            });
            if (response.data.isSuccess) {
                setHrResumes(response.data.bDInputs);
                setTotalPages(Math.ceil(response.data.totalCount / 10));
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching hrResumes:', error);
        }
        finally {
            setLoading(false);
        }
    };

    const fetchModulesCsv = async () => {
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/BDInputMaster/GetBDInput`);
            if (response.data.isSuccess) {
                setDownloadCsv(response.data.bDInputs);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching hrResumes:', error);
        }

    };



    // useEffect(() => {
    //     const fetchData = async (endpoint: string, setter: Function, listName: string) => {
    //         try {
    //             const response = await axios.get(`${config.API_URL_APPLICATION}/${endpoint}`);
    //             if (response.data.isSuccess) {
    //                 setter(response.data[listName]);
    //             } else {
    //                 console.error(response.data.message);
    //             }
    //         } catch (error) {
    //             console.error(`Error fetching data from ${endpoint}:`, error);
    //         }
    //     };

    //     fetchData('CommonDropdown/GetModuleList', setModuleList, 'moduleNameListResponses');
    //     fetchData('CommonDropdown/GetEmployeeListWithId', setEmployeeList, 'employeeLists');
    // }, []);






    // const handleClear = () => {
    //     setModuleDisplayName('');
    //     setModuleOwnerName('');
    //     fetchModules();
    // };


    const filteredDoers = hrResumes.filter(input =>
        input.taskID.toLowerCase().includes(searchQuery.toLowerCase()) ||
        input.moduleID.toLowerCase().includes(searchQuery.toLowerCase()) ||
        input.processID.toLowerCase().includes(searchQuery.toLowerCase()) ||
        input.inputID.toLowerCase().includes(searchQuery.toLowerCase()) ||
        input.inputType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        input.inputDisplayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        input.inputVariables.toLowerCase().includes(searchQuery.toLowerCase()) ||
        input.predecessorOrLogic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        input.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        input.createdBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        input.updatedBy.toLowerCase().includes(searchQuery.toLowerCase())
    );



    const convertToCSV = (data: BdInput[]) => {
        const csvRows = [
            ['ID', 'Module ID', 'Process ID',
                'Task ID', 'Input ID', 'Input Type',
                'Input Display Name', 'Input Variables',
                'Predecessor or Logic', 'Status',
                'Created By', 'Updated By'],
            ...data.map(input => [
                input.id,
                input.moduleID,
                input.processID,
                input.taskID,
                input.inputID,
                input.inputType,
                input.inputDisplayName,
                input.inputVariables,
                input.predecessorOrLogic,
                input.status,
                input.createdBy,
                input.updatedBy
            ])
        ];

        return csvRows.map(row => row.join(',')).join('\n');
    };


    const downloadCSV = () => {

        const csvData = convertToCSV(downloadCsv);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'BdInput.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };


    const handleSearchcurrent = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    return (
        <>
            <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center fs-20">
                <span><i className="ri-file-list-line me-2"></i><span className='fw-bold test-nowrap'>Bd Input</span></span>
                <div className="d-flex">
                    <Link to='/pages/BdInputMasterinsert'>
                        <Button variant="primary">
                            Add Bd Input
                        </Button>
                    </Link>

                </div>
            </div>

            {!hrResumes ? (
                <Container className="mt-5">
                    <Row className="justify-content-center">
                        <Col xs={12} md={8} lg={6}>
                            <Alert variant="info" className="text-center">
                                <h4>No Bd Input Found</h4>
                                <p>You currently don't have Completed tasks</p>
                            </Alert>
                        </Col>
                    </Row>
                </Container>
            ) : (
                <div className="">
                    <div >
                        {loading ? (
                            <div className='loader-container'>
                                <div className="loader"></div>
                                <div className='mt-2'>Please Wait!</div>
                            </div>
                        ) : (
                            <>
                                <div className='bg-white p-2 pb-2'>
                                    {/* <Form onSubmit={handleSearch}>
                                        <Row>
                                            <Col lg={5}>
                                                <Form.Group controlId="ModuleDisplayName">
                                                    <Form.Label>HrInput Display Name:</Form.Label>

                                                    <Select
                                                        name="searchProjectName"
                                                        value={moduleList.find(item => item.moduleName === moduleDisplayName) || null} // handle null
                                                        onChange={(selectedOption) => setModuleDisplayName(selectedOption ? selectedOption.moduleName : "")} // null check
                                                        options={moduleList}
                                                        getOptionLabel={(item) => item.moduleName}
                                                        getOptionValue={(item) => item.moduleName}
                                                        isSearchable={true}
                                                        placeholder="Select HrInput Display Name"
                                                        className="h45"
                                                    />
                                                </Form.Group>
                                            </Col>

                                            <Col lg={5}>
                                                <Form.Group controlId="ModuleOwnerName">
                                                    <Form.Label>HrInput Owner Name:</Form.Label>
                                                    <Select
                                                        name="ModuleOwnerName"
                                                        value={employeeList.find(emp => emp.empId === moduleOwnerName) || null} // handle null
                                                        onChange={(selectedOption) => setModuleOwnerName(selectedOption ? selectedOption.empId : "")} // null check
                                                        options={employeeList}
                                                        getOptionLabel={(emp) => emp.employeeName}
                                                        getOptionValue={(emp) => emp.empId}
                                                        isSearchable={true}
                                                        placeholder="Select HrInput Owner Name."
                                                        className="h45"
                                                    />
                                                </Form.Group>
                                            </Col>

                                            <Col className='align-items-end d-flex justify-content-end'>

                                                <ButtonGroup aria-label="Basic example" className='w-100'>
                                                    <Button type="button" variant="primary" onClick={handleClear}>
                                                        <i className="ri-loop-left-line"></i>
                                                    </Button>
                                                    &nbsp;
                                                    <Button type="submit" variant="primary" >
                                                        Search
                                                    </Button>
                                                </ButtonGroup>
                                            </Col>
                                        </Row>

                                    </Form> */}

                                    <div>Select filter will be apply</div>
                                    <Row className='mt-3'>
                                        <div className="d-flex justify-content-end bg-light p-1">
                                            <div className="app-search d-none d-lg-block me-4">
                                                <form>
                                                    <div className="input-group px300 ">
                                                        <input
                                                            type="search"
                                                            className=" bg-white "
                                                            placeholder="Search..."
                                                            value={searchQuery}
                                                            onChange={handleSearchcurrent}
                                                        />
                                                        <span className="ri-search-line search-icon text-muted" />
                                                    </div>
                                                </form>
                                            </div>
                                            <Button variant="primary" onClick={downloadCSV} className="">
                                                Download CSV
                                            </Button>
                                        </div>
                                    </Row>
                                </div>
                                <div className="overflow-auto text-nowrap">
                                    <DragDropContext onDragEnd={handleOnDragEnd}>
                                        <Table hover className='bg-white '>
                                            <thead>
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
                                                                                <div ref={provided.innerRef as React.Ref<HTMLTableHeaderCellElement>}
                                                                                    {...provided.draggableProps}
                                                                                    {...provided.dragHandleProps}>
                                                                                    {column.id === 'moduleID' && (<i className="ri-folder-3-fill"></i>)}
                                                                                    {column.id === 'processID' && (<i className="ri-projector-2-fill"></i>)}
                                                                                    {column.id === 'taskID' && (<i className="ri-settings-2-fill"></i>)}
                                                                                    {column.id === 'inputID' && (<i className="ri-pencil-fill"></i>)}
                                                                                    {column.id === 'inputType' && (<i className="ri-price-tag-3-fill"></i>)}
                                                                                    {column.id === 'inputDisplayName' && (<i className="ri-user-settings-fill"></i>)}
                                                                                    {column.id === 'inputVariables' && (<i className="ri-variable-fill"></i>)}
                                                                                    {column.id === 'predecessorOrLogic' && (<i className="ri-flow-chart-fill"></i>)}
                                                                                    {column.id === 'status' && (<i className="ri-information-fill"></i>)}
                                                                                    &nbsp; {column.label}

                                                                                </div>
                                                                            </th>
                                                                        )}
                                                                    </Draggable>
                                                                ))}
                                                            {provided.placeholder}
                                                            <th>Action</th>
                                                        </tr>
                                                    )}
                                                </Droppable>
                                            </thead>
                                            <tbody>
                                                {filteredDoers.length > 0 ? (
                                                    filteredDoers.slice(0, 10).map((item, index) => (
                                                        <tr key={item.id}>
                                                            <td>{(currentPage - 1) * 10 + index + 1}</td>
                                                            {columns.filter(col => col.visible).map((col) => (
                                                                <td key={col.id}
                                                                    className={
                                                                        (col.id === 'status' && item[col.id] === 'INACTIVE') ? 'task4' :
                                                                            (col.id === 'status' && item[col.id] === 'ACTIVE') ? 'task1' :
                                                                                ''
                                                                    }
                                                                >
                                                                    <div>

                                                                        {item[col.id as keyof BdInput]}
                                                                    </div>
                                                                </td>
                                                            ))}
                                                            <td><Link to={`/pages/BdInputMasterinsert/${item.id}`}>
                                                                <i className='btn ri-edit-line' ></i>
                                                            </Link>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={columns.length + 1}>
                                                            <Container className="mt-5">
                                                                <Row className="justify-content-center">
                                                                    <Col xs={12} md={8} lg={6}>
                                                                        <Alert variant="info" className="text-center">
                                                                            <h4>No Resume Found</h4>
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
                            </>
                        )}
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
            )}
            <CustomSuccessToast
                show={showToast}
                toastMessage={toastMessage}
                toastVariant={toastVariant}
                onClose={() => setShowToast(false)}
            />
        </>
    );
};

export default BdInputMaster;