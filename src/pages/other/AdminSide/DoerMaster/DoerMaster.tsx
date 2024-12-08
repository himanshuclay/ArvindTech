import axios from 'axios';
import { useState, useEffect, ChangeEvent } from 'react';
import { Button, Pagination, Table, Container, Row, Col, Alert, Form, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import IconWithLetter from '@/pages/ui/IconWithLetter';
import config from '@/config';
import Select from 'react-select';
import CustomSuccessToast from '../../Component/CustomSuccessToast';
import { useLocation, useNavigate } from 'react-router-dom';




interface Doer {
    id: number;
    taskID: string;
    identifier: string;
    input: string;
    inputValue: string;
    doerRole: string;
    empID: string;
    empName: any;
    createdBy: string;
    updatedBy: string;
}

interface Column {
    id: string;
    label: string;
    visible: boolean;
}
interface EmployeeList {
    empId: string;
    employeeName: string;
}

interface TaskList {
    id: string;
    taskID: string;
}
interface Identifier {
    id: string;
    identifier: string;
}

const ModuleMaster = () => {
    const [doers, setDoers] = useState<Doer[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [downloadCsv, setDownloadCsv] = useState<Doer[]>([]);

    const [employeeList, setEmployeeList] = useState<EmployeeList[]>([]);
    const [taskList, setTaskList] = useState<TaskList[]>([]);
    const [identifierList, setIdentifierList] = useState<Identifier[]>([]);


    
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

    // both are required to make dragable column of table 
    const [columns, setColumns] = useState<Column[]>([
        { id: 'taskID', label: 'Task ID', visible: true },
        { id: 'identifier', label: 'Identifier', visible: true },
        { id: 'identifier1', label: 'Identifier 1', visible: true },
        { id: 'inputValue', label: 'Input Value', visible: true },
        { id: 'inputValue1', label: 'Input Value 1', visible: true },
        { id: 'empID', label: 'Employee ID', visible: true },
        { id: 'empName', label: 'Employee Name', visible: true },

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
        fetchDoers();
        fetchRolesCsv();
    }, [currentPage]);


    const [searchEmployeeName, setSearchEmployeeName] = useState('');
    const [searchTaskId, setSearchTaskId] = useState('');
    const [searchIdentifier, setSearchIdentifier] = useState('');

    const handleSearch = (e: any) => {
        e.preventDefault();

        let query = `?`;
        if (searchEmployeeName) query += `DoerName=${searchEmployeeName}&`;
        if (searchTaskId) query += `TaskID=${searchTaskId}&`;
        if (searchIdentifier) query += `Identifier=${searchIdentifier}&`;
        query += `PageIndex=${currentPage}`;


        query = query.endsWith('&') ? query.slice(0, -1) : query;

        const apiUrl = `${config.API_URL_APPLICATION}/DoerMaster/SearchDoer${query}`;

        console.log(apiUrl)
        axios.get(apiUrl, {
            headers: {
                'accept': '*/*'
            }
        })
            .then((response) => {
                console.log("search response ", response.data.doerMasterListResponses);
                setDoers(response.data.doerMasterListResponses)
                setTotalPages(Math.ceil(response.data.totalCount / 10));

            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    };

    const fetchDoers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/DoerMaster/GetDoer`, {
                params: { PageIndex: currentPage }
            });
            if (response.data.isSuccess) {
                setDoers(response.data.doerMasterList);
                setTotalPages(Math.ceil(response.data.totalCount / 10));
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching doers:', error);
        }
        finally {
            setLoading(false);
        }
    };

    const fetchRolesCsv = async () => {
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/IdentifierMaster/GetIdentifier`);
            if (response.data.isSuccess) {
                setDownloadCsv(response.data.identifierLists);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching doers:', error);
        }

    };

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

        fetchData('CommonDropdown/GetEmployeeListWithId', setEmployeeList, 'employeeLists');
        fetchData('CommonDropdown/GetTaskList', setTaskList, 'taskList');
        fetchData('CommonDropdown/GetIdentifier', setIdentifierList, 'identifierList');
    }, []);







    const handleClear = () => {
        setSearchEmployeeName('');
        setSearchIdentifier('');
        setSearchTaskId('');
        fetchDoers();
    };


    const convertToCSV = (data: Doer[]) => {
        const csvRows = [
            ['Task ID', 'Identifier', 'Input', 'Input Value', 'Doer Role', 'Emp ID', 'Emp Name'],
            ...data.map(doer => [
                doer.taskID,
                doer.identifier,
                doer.input,
                doer.inputValue,
                doer.doerRole,
                doer.empID,
                doer.empName
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
            link.setAttribute('download', 'Doers.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleSearchcurrent = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const filteredDoers = doers.filter(doer =>
        doer.taskID.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doer.identifier.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doer.empName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return (
        <>
            <div className="container">
                <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center">
                    <span><i className="ri-file-list-line me-2 text-dark fs-16"></i><span className='fw-bold text-dark fs-15'>Doers List</span></span>
                    <div className="d-flex justify-content-end  ">

                        <Link to='/pages/DoerMasterinsert'>
                            <Button variant="primary" className="me-2">
                                Add Task's identifier
                            </Button>
                        </Link>

                    </div>
                </div>


                {loading ? (
                    <div className='loader-container'>
                        <div className="loader"></div>
                        <div className='mt-2'>Please Wait!</div>
                    </div>
                ) : (

                    <>
                        <div className='bg-white p-2 pb-2'>
                            <Form onSubmit={handleSearch}>
                                <Row>
                                    <Col lg={4}>
                                        <Form.Group controlId="searchEmployeeName">
                                            <Form.Label>Doer Name:</Form.Label>
                                            <Select
                                                name="searchEmployeeName"
                                                value={employeeList.find(emp => emp.empId === searchEmployeeName) || null} // handle null
                                                onChange={(selectedOption) => setSearchEmployeeName(selectedOption ? selectedOption.empId : "")} // null check
                                                options={employeeList}
                                                getOptionLabel={(emp) => emp.employeeName}
                                                getOptionValue={(emp) => emp.empId}
                                                isSearchable={true}
                                                placeholder="Search..."
                                                className="h45"
                                            />
                                        </Form.Group>
                                    </Col>


                                    <Col lg={4}>
                                        <Form.Group controlId="searchTaskId">
                                            <Form.Label>Task ID:</Form.Label>
                                            <Select
                                                name="searchTaskId"
                                                value={taskList.find(task => task.taskID === searchTaskId) || null} // handle null
                                                onChange={(selectedOption) => setSearchTaskId(selectedOption ? selectedOption.taskID : "")} // null check
                                                options={taskList}
                                                getOptionLabel={(task) => task.taskID}
                                                getOptionValue={(task) => task.taskID}
                                                isSearchable={true}
                                                placeholder="Search..."
                                                className="h45"
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col lg={4} className="">
                                        <Form.Group controlId="searchIdentifier">
                                            <Form.Label>Identifier:</Form.Label>
                                            <Select
                                                name="searchIdentifier"
                                                value={identifierList.find(item => item.identifier === searchIdentifier) || null} // handle null
                                                onChange={(selectedOption) => setSearchIdentifier(selectedOption ? selectedOption.identifier : "")} // null check
                                                options={identifierList}
                                                getOptionLabel={(item) => item.identifier}
                                                getOptionValue={(item) => item.identifier}
                                                isSearchable={true}
                                                placeholder="Search..."
                                                className="h45"
                                            />
                                        </Form.Group>
                                    </Col>

                                  

                                

                                    <Col></Col>

                                    <Col lg={4} className="align-items-end d-flex justify-content-end mt-2">
                                        <ButtonGroup aria-label="Basic example" className="w-100">
                                            <Button type="button" variant="primary" onClick={handleClear}>
                                                <i className="ri-loop-left-line"></i>
                                            </Button>
                                            &nbsp;
                                            <Button type="submit" variant="primary">
                                                Search
                                            </Button>
                                        </ButtonGroup>
                                    </Col>
                                </Row>
                            </Form>



                            <Row className='mt-3'>
                                <div className="d-flex justify-content-end bg-light p-1">
                                    <div className="app-search d-none d-lg-block me-4">
                                        <form>
                                            <div className="input-group px300 ">
                                                <input
                                                    type="search"
                                                    className=" bg-white"
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
                            {!filteredDoers ? (
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
                            ) : (
                                <DragDropContext onDragEnd={handleOnDragEnd}>
                                    <Table hover className='bg-white '>
                                        <thead>
                                            <Droppable droppableId="columns" direction="horizontal">
                                                {(provided) => (
                                                    <tr {...provided.droppableProps} ref={provided.innerRef as React.Ref<HTMLTableRowElement>}>
                                                        <th><i className="ri-list-ordered-2"></i>  Sr. No</th>
                                                        {columns.filter(col => col.visible).map((column, index) => (
                                                            <Draggable key={column.id} draggableId={column.id} index={index}>
                                                                {(provided) => (
                                                                    <th>
                                                                        <div ref={provided.innerRef}
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}>
                                                                            {column.id === 'inputValue' && (<i className="ri-keyboard-line"></i>)}
                                                                            {column.id === 'inputValue1' && (<i className="ri-keyboard-line"></i>)}
                                                                            {column.id === 'taskID' && (<i className="ri-settings-2-fill"></i>)}
                                                                            {column.id === 'doerRole' && (<i className="ri-user-settings-fill"></i>)}
                                                                            {column.id === 'empName' && (<i className="ri-user-fill"></i>)}
                                                                            {column.id === 'identifier' && (<i className="ri-price-tag-3-fill"></i>)}
                                                                            {column.id === 'identifier1' && (<i className="ri-price-tag-3-fill"></i>)}
                                                                            {column.id === 'empID' && (<i className="ri-user-follow-fill"></i>)}
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
                                                                    // Add class based on column id
                                                                    col.id === 'empID' ? 'fw-bold fs-13 text-dark' :
                                                                        col.id === 'taskID' ? 'fw-bold fs-13 text-dark' :
                                                                            col.id === 'empName' ? 'fw-bold fs-13 text-dark' :
                                                                                // Add class based on value (e.g., expired tasks)
                                                                                // (col.id === 'taskID' && item[col.id] === 'ACC.01.T1') ? 'task1' :
                                                                                ''
                                                                }
                                                            >
                                                                <div>
                                                                    {col.id === 'empName' ? (
                                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                            <IconWithLetter letter={item.empName.charAt(0)} />
                                                                            {item.empName.split('_')[0]}
                                                                        </div>
                                                                    ) : (
                                                                        <>
                                                                            {item[col.id as keyof Doer]}
                                                                        </>
                                                                    )}

                                                                </div>
                                                            </td>
                                                        ))}

                                                        <td><Link to={`/pages/DoerMasterinsert/${item.id}`}>
                                                            <Button variant='primary' className='p-0 text-white'>
                                                                <i className='btn ri-edit-line text-white' ></i>
                                                            </Button>
                                                        </Link>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={12}>
                                                        <Container className="mt-5">
                                                        <Row className="justify-content-center">
                                                            <Col xs={12} md={8} lg={6}>
                                                                <Alert variant="info" className="text-center">
                                                                    <h4>No Data Found</h4>
                                                                    <p>You currently don't have Data</p>
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
                            )}
                        </div>
                    </>
                )}

                <div className="d-flex justify-content-center align-items-center bg-white w-20 rounded-5 m-auto py-1 pb-1 my-2 pagination-rounded">
                    <Pagination >
                        <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                        <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
                        <Pagination.Item active>{currentPage}</Pagination.Item>
                        <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
                        <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
                    </Pagination>
                </div>


            </div >
            <CustomSuccessToast
                show={showToast}
                toastMessage={toastMessage}
                toastVariant={toastVariant}
                onClose={() => setShowToast(false)}
            />
        </>
    );
};

export default ModuleMaster;