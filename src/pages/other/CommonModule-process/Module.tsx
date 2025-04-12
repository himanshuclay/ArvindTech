import axios from 'axios';
import { useState, useEffect } from 'react';
import { Button, Pagination, Table, Container, Row, Col, Alert, Form, ButtonGroup } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import config from '@/config';
import Select from 'react-select';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface Module {
    id: number;
    moduleName: string;
    moduleDisplayName: string;
    fmsType: string;
    moduleID: string;
    misExempt: string;
    status: string;
    userUpdatedMobileNumber: number;
    moduleOwnerID: string;
    moduleOwnerName: string;
    empId: string;
    employeeName: string;
    createdBy: string;
    updatedBy: string;
    createdDate: string;
    updatedDate: string;
}

interface Column {
    id: string;
    label: string;
    visible: boolean;
}


const Module = () => {
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [moduleList, setModuleList] = useState<Module[]>([]);
    const [moduleDisplayName, setModuleDisplayName] = useState('');
    const [searchStatus, setSearchStatus] = useState('');



    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        if (location.state?.successMessage) {
            toast.dismiss()
            toast.success(location.state.successMessage);
            navigate(location.pathname, { replace: true });
        }
    }, [location.state, navigate]);



    useEffect(() => {
        if (moduleDisplayName || searchStatus) {
            handleSearch();
        } else {
            fetchModules();
        }
    }, [currentPage]);


    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        let query = `?`;
        if (moduleDisplayName) query += `ModuleDisplayName=${moduleDisplayName}&`;
        if (searchStatus) query += `status=${searchStatus}&`;
        query += `PageIndex=${currentPage}`;
        query = query.endsWith('&') ? query.slice(0, -1) : query;

        const apiUrl = `${config.API_URL_APPLICATION}/ModuleMaster/SearchModuleList${query}`;
        console.log(apiUrl)
        axios.get(apiUrl, { headers: { 'accept': '*/*' } })
            .then((response) => {
                console.log(response.data.moduleMasterListResponses)
                setModules(response.data.moduleMasterListResponses)
                setTotalPages(Math.ceil(response.data.totalCount / 10));
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    };



    // both are required to make dragable column of table 
    const [columns, setColumns] = useState<Column[]>([
        { id: 'moduleID', label: 'Module ID', visible: true },
        { id: 'moduleDisplayName', label: 'Module Display Name', visible: true },
        { id: 'fmsType', label: 'Fms Types', visible: true },
        { id: 'misExempt', label: 'Mis Exempt ID', visible: true },
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








    const fetchModules = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/ModuleMaster/GetModule`, {
                params: { PageIndex: currentPage }
            });
            if (response.data.isSuccess) {
                setModules(response.data.moduleMasterList);
                setTotalPages(Math.ceil(response.data.totalCount / 10));
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching modules:', error);
        }
        finally {
            setLoading(false);
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
        fetchData('CommonDropdown/GetModuleList', setModuleList, 'moduleNameListResponses');
    }, []);






    const handleClear = () => {
        setModuleDisplayName('');
        setSearchStatus('');
        setCurrentPage(1);
        fetchModules();
    };


    const optionsStatus = [
        { value: 'Enabled', label: 'Enabled' },
        { value: 'Disabled', label: 'Disabled' }
    ];


    return (
        <>
            <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center fs-20">
                <span><i className="ri-file-list-line me-2"></i><span className='fw-bold test-nowrap'>Modules List</span></span>
            </div>
            <div className='bg-white p-2 pb-2'>
                <Form onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch();
                    setCurrentPage(1);
                }}>
                    <Row>
                        <Col lg={4}>
                            <Form.Group controlId="ModuleDisplayName">
                                <Form.Label>Module Display Name</Form.Label>

                                <Select
                                    name="searchProjectName"
                                    value={moduleList.find(item => item.moduleName === moduleDisplayName) || null} // handle null
                                    onChange={(selectedOption) => setModuleDisplayName(selectedOption ? selectedOption.moduleName : "")} // null check
                                    options={moduleList}
                                    getOptionLabel={(item) => item.moduleName}
                                    getOptionValue={(item) => item.moduleName}
                                    isSearchable={true}
                                    placeholder="Select Module Display Name"
                                    className="h45"
                                />
                            </Form.Group>
                        </Col>

                        <Col lg={4} className="">
                            <Form.Group controlId="searchStatus">
                                <Form.Label>Status</Form.Label>
                                <Select
                                    name="searchStatus"
                                    options={optionsStatus}
                                    value={optionsStatus.find(option => option.value === searchStatus) || null}
                                    onChange={(selectedOption) => setSearchStatus(selectedOption?.value || '')}
                                    placeholder="Select Status"
                                />
                            </Form.Group>
                        </Col>
                        <Col lg={4} className='align-items-end d-flex justify-content-end mt-3'>

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

                </Form>
                <Row className='mt-3'>
                    <div className="d-flex justify-content-end bg-light p-1">
                        <div className="app-search d-none d-lg-block me-4">
                        </div>


                    </div>
                </Row>
            </div>
            {!modules ? (
                <Container className="mt-5">
                    <Row className="justify-content-center">
                        <Col xs={12} md={8} lg={6}>
                            <Alert variant="info" className="text-center">
                                <h4>No Data Found</h4>
                                <p>You currently don't have any Data</p>
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

                                                                                    {column.id === 'moduleOwnerID' && (<i className="ri-settings-2-fill"></i>)}
                                                                                    {column.id === 'moduleID' && (<i className="ri-settings-2-fill"></i>)}
                                                                                    {column.id === 'moduleDisplayName' && (<i className="ri-user-settings-fill"></i>)}
                                                                                    {column.id === 'moduleOwnerName' && (<i className="ri-user-fill"></i>)}
                                                                                    {column.id === 'identifier' && (<i className="ri-price-tag-3-fill"></i>)}
                                                                                    {column.id === 'input' && (<i className="ri-pencil-fill"></i>)}
                                                                                    {column.id === 'fmsType' && (<i className="ri-user-follow-fill"></i>)}
                                                                                    {column.id === 'statusID' && (<i className="ri-information-fill"></i>)}
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
                                                {modules.length > 0 ? (
                                                    modules.slice(0, 10).map((item, index) => (
                                                        <tr key={item.id}>
                                                            <td>{(currentPage - 1) * 10 + index + 1}</td>
                                                            {columns.filter(col => col.visible).map((col) => (
                                                                <td key={col.id}
                                                                    className={
                                                                        col.id === 'moduleOwnerName' ? 'fw-bold fs-14 text-dark' :
                                                                            col.id === 'moduleOwnerID' ? 'fw-bold fs-13  ' :
                                                                                (col.id === 'status' && item[col.id] === "Enabled") ? 'task1' :
                                                                                    (col.id === 'status' && item[col.id] === "Disabled") ? 'task4' :
                                                                                        (col.id === 'misExempt' && item[col.id] === 'Active') ? 'task1' :
                                                                                            (col.id === 'misExempt' && item[col.id] === 'Inactive') ? 'task4' :
                                                                                                (col.id === 'misExempt' && item[col.id] === 'Yes') ? 'task1' :
                                                                                                    (col.id === 'misExempt' && item[col.id] === 'No') ? 'task4' :
                                                                                                        ''
                                                                    }
                                                                >
                                                                    <div>
                                                                        {(
                                                                            <td>{item[col.id as keyof Module]}</td>
                                                                        )}


                                                                    </div>
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={columns.length + 1}>
                                                            <Container className="mt-5">
                                                                <Row className="justify-content-center">
                                                                    <Col xs={12} md={8} lg={6}>
                                                                        <Alert variant="info" className="text-center">
                                                                            <h4>No Data Found</h4>
                                                                            <p>You currently don't have any Data</p>
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
        </>
    );
};

export default Module;