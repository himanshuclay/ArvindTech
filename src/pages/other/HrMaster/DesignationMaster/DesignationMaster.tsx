import axios from 'axios';
import { useState, useEffect, ChangeEvent } from 'react';
import { Button, Pagination, Table, Container, Row, Col, Alert, Form, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import config from '@/config';
import Select from 'react-select';



interface Designation {
    id: number;
    department: string;
    coreDesignation: string;
    specializedDesignation: string;
    processType: string;
    uploadJD: string;
    createdBy: string;
    updatedBy: string;
}

interface Column {
    id: string;
    label: string;
    visible: boolean;
}


interface DepartmentList {
    id: number;
    departmentName: string;
}

const DesignationMaster = () => {
    const [designations, setDesignations] = useState<Designation[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');


 
    const [departmentList, setDepartmentList] = useState<DepartmentList[]>([]);


    // both are required to make dragable column of table 
    const [columns, setColumns] = useState<Column[]>([
        { id: 'department', label: 'Department', visible: true },
        { id: 'coreDesignation', label: 'Core Designation', visible: true },
        { id: 'specializedDesignation', label: 'Specialized Designation', visible: true },
        { id: 'processType', label: 'Process Type', visible: true },
        { id: 'uploadJD', label: 'Upload JD', visible: true },
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
        fetchStaffRequirements();
    }, [currentPage]);



    const [searchDepartmentValue, setSearchDepartmentValue] = useState('');

    const handleSearch = (e: any) => {
        e.preventDefault();

        let query = `?`;

        if (searchDepartmentValue) query += `InputValue=${searchDepartmentValue}&`;

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
                setDesignations(response.data.doerMasterListResponses)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    };

    const fetchStaffRequirements = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/DesignationMaster/GetDesignation`, {
                params: { PageIndex: currentPage }
            });
            if (response.data.isSuccess) {
                setDesignations(response.data.designations);
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

        fetchData('CommonDropdown/GetDepartment', setDepartmentList, 'getDepartments');
    }, []);



    const handleClear = () => {
        fetchStaffRequirements();
    };


    const convertToCSV = (data: Designation[]) => {
        const csvRows = [
            ['ID', 
                'Department',
                'Core Designation',
                'Specialized Designation',
                'Process Type', 
                'Recruiter', 'Upload JD',  'Created By', 'Updated By'],
            ...data.map(doer => [
                doer.id,
                doer.department,
                doer.coreDesignation,
                doer.specializedDesignation,
                doer.processType,
                doer.uploadJD,
                doer.createdBy,
                doer.updatedBy
            ])
        ];
        return csvRows.map(row => row.join(',')).join('\n');
    };


    const downloadCSV = () => {
        const csvData = convertToCSV(designations);
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

    // const filteredDoers = doers.filter(doer =>
    //     doer.entryDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //     // doer.identifier.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //     // doer.empName.toLowerCase().includes(searchQuery.toLowerCase())
    // );
    return (
        <>
            <div className="container">
                <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center">
                    <span><i className="ri-file-list-line me-2 text-dark fs-16"></i><span className='fw-bold text-dark fs-15'>Designation List</span></span>
                    <div className="d-flex justify-content-end  ">

                        <Link to='/pages/DesignationMasterinsert'>
                            <Button variant="primary" className="me-2">
                                Add Designation
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
                                        <Form.Group controlId="searchDepartmentName">
                                            <Form.Label>Department Name</Form.Label>
                                            <Select
                                                name="searchDepartmentName"
                                                value={departmentList.find(emp => emp.departmentName === searchDepartmentValue) || null}
                                                onChange={(selectedOption) => setSearchDepartmentValue(selectedOption ? selectedOption.departmentName : "")} 
                                                options={departmentList}
                                                getOptionLabel={(emp) => emp.departmentName}
                                                getOptionValue={(emp) => emp.departmentName}
                                                isSearchable={true}
                                                placeholder="Search..."
                                                className="h45"
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col lg={4}>
                                        <Form.Group controlId="searchCoreDesignation">
                                            <Form.Label>Core Designation</Form.Label>
                                            <Select
                                                name="searchCoreDesignation"
                                                // value={roleList.find(role => role.roleName === searchDoerRole) || null} // handle null
                                                // onChange={(selectedOption) => setSearchDoerRole(selectedOption ? selectedOption.roleName : "")} // null check
                                                // options={roleList}
                                                // getOptionLabel={(role) => role.roleName}
                                                // getOptionValue={(role) => role.roleName}
                                                isSearchable={true}
                                                placeholder="Search..."
                                                className="h45"
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col lg={4}>
                                        <Form.Group controlId="searchSpecialisedDesignation">
                                            <Form.Label>Specialised Designation</Form.Label>
                                            <Select
                                                name="searchSpecialisedDesignation"
                                                // value={taskList.find(task => task.taskID === searchTaskId) || null} // handle null
                                                // onChange={(selectedOption) => setSearchTaskId(selectedOption ? selectedOption.taskID : "")} // null check
                                                // options={taskList}
                                                // getOptionLabel={(task) => task.taskID}
                                                // getOptionValue={(task) => task.taskID}
                                                isSearchable={true}
                                                placeholder="Search..."
                                                className="h45"
                                            />
                                        </Form.Group>
                                    </Col>

                                  
                                    <Col lg={4} className="mt-2"></Col>
                                    <Col lg={4} className="mt-2"></Col>

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
                            {!designations ? (
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
                                                                         
                                                                            {column.id === 'department' && (<i className="ri-group-fill"></i>)}
                                                                            {column.id === 'coreDesignation' && (<i className="ri-briefcase-fill"></i>)}
                                                                            {column.id === 'specializedDesignation' && (<i className="ri-award-fill"></i>)}
                                                                            {column.id === 'uploadJD' && (<i className="ri-file-upload-line"></i>)}
                                                                            {column.id === 'processType' && (<i className="ri-lock-fill"></i>)}
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
                                            {designations.length > 0 ? (
                                                designations.slice(0, 10).map((item, index) => (
                                                    <tr key={item.id}>
                                                        <td>{(currentPage - 1) * 10 + index + 1}</td>
                                                        {columns.filter(col => col.visible).map((col) => (
                                                            <td key={col.id}
                                                                className={
                                                                    // Add class based on column id
                                                                    col.id === 'department' ? 'fw-bold fs-13 text-dark task1' : ''
                                                                }
                                                            >
                                                                <div>{item[col.id as keyof Designation]}</div>
                                                            </td>
                                                        ))}

                                                        <td><Link to={`/pages/DesignationMasterinsert/${item.id}`}>
                                                            <Button variant='primary' className='p-0 text-white'>
                                                                <i className='btn ri-edit-line text-white' ></i>
                                                            </Button>
                                                        </Link>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={columns.length + 1}>No data available</td>
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

        </>
    );
};

export default DesignationMaster;