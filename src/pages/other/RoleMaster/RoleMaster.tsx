import axios from 'axios';
import { useState, useEffect, ChangeEvent } from 'react';
import { Button, Pagination, Table, Container, Row, Col, Alert, Form, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import config from '@/config';
import Select from 'react-select';



interface Role {
    id: number;
    roleName: string;
    createdBy: string;
    updatedBy: string;
    updatedDate: string;
    createdDate: string;
}
interface Column {
    id: string;
    label: string;
    visible: boolean;
}

const ModuleMaster = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [downloadCsv, setDownloadCsv] = useState<Role[]>([]);
    const [roleList, setRoleList] = useState<Role[]>([]);
    const [searchRole, setSearchRole] = useState<number>();









    // both are required to make dragable column of table 
    const [columns, setColumns] = useState<Column[]>([
        { id: 'roleName', label: 'Role Name', visible: true },
        { id: 'createdBy', label: 'Created By', visible: true },
        { id: 'updatedBy', label: 'Updated By', visible: true },
        { id: 'createdDate', label: 'Created Date ', visible: true },
        { id: 'updatedDate', label: 'Updated Date', visible: true },


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
        fetchRoles();
        fetchRolesCsv();
    }, [currentPage]);



    const handleSearch = () => {
        if (searchRole) {
            fetchsinglerole(searchRole);
        }
    };
    


    const fetchRoles = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/RoleMaster/GetRole`, {
                params: { PageIndex: currentPage }
            });
            if (response.data.isSuccess) {
                setRoles(response.data.roleMasterListResponses);
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



    const fetchsinglerole = async (searchRole: number) => {
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/RoleMaster/GetRole`, {
                params: { id: searchRole }
            });
            if (response.data.isSuccess) {
                setRoles(response.data.roleMasterListResponses);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching doers:', error);
        }
      
    };

    const fetchRolesCsv = async () => {
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/RoleMaster/GetRole`);
            if (response.data.isSuccess) {
                setDownloadCsv(response.data.roleMasterListResponses);
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

        fetchData('CommonDropdown/GetRoleMasterList', setRoleList, 'roleMasterLists');
    }, []);


    const handleClear = () => {
        fetchRoles();
        setSearchRole(undefined);
    };


    const convertToCSV = (data: Role[]) => {
        const csvRows = [
            ['ID', 'Role Name', 'Created By', 'Updated By','Created Date','Updated Date'],
            ...data.map(role => [
                role.id.toString(),
                role.roleName,
                role.createdBy,
                role.updatedBy,
                role.createdDate,
                role.updatedDate,
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
            link.setAttribute('download', 'Roles.csv');
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


    // const filteredDoers = roles.filter(role =>
    //     role.roleName.toLowerCase().includes(searchQuery.toLowerCase())
    // );
    return (
        <>
            <div className="container">
                <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center">
                    <span><i className="ri-file-list-line me-2 text-dark fs-16"></i><span className='fw-bold text-dark fs-15'>Role List</span></span>
                    <div className="d-flex justify-content-end  ">

                        <Link to='/pages/RoleMasterinsert'>
                            <Button variant="primary" className="me-2">
                                Add Role
                            </Button>
                        </Link>

                    </div>
                </div>


                {loading ? (
                    <div className='loader-container'>
                        <div className="loader"></div>
                        <div className='mt-2'>Please Wait!</div>
                    </div>
                ) : (<>
                    <div className='bg-white p-2 pb-2'>
                            <Row>
                                <Col lg={6} className="mt-2">
                                    <Form.Group controlId="searchRole">
                                        <Form.Label>Roles:</Form.Label>
                                        <Select
                                            name="searchRole"
                                            value={roleList.find(item => item.id === searchRole) || null}  
                                            onChange={(selectedOption) => setSearchRole(selectedOption ? selectedOption.id : 0)} 
                                            options={roleList} 
                                            getOptionLabel={(item) => item.roleName} 
                                            getOptionValue={(item) => item.roleName}
                                            isSearchable={true} 
                                            placeholder="Select Role"
                                            className="h45"
                                        />
                                    </Form.Group>
                                </Col>

                                <Col></Col>
                                <Col lg={3} className="align-items-end d-flex justify-content-end mt-2">
                                    <ButtonGroup aria-label="Basic example" className="w-100">
                                        <Button type="button" variant="primary" onClick={handleClear}>
                                            <i className="ri-loop-left-line"></i>
                                        </Button>
                                        &nbsp;
                                        <Button type="submit" variant="primary" onClick={handleSearch}>
                                            Search
                                        </Button>
                                    </ButtonGroup>
                                </Col>
                            </Row>



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
                        {!roles ? (
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
                                                                        {column.id === 'createdBy' && (<i className="ri-user-add-line"></i>)}
                                                                        {column.id === 'updatedBy' && (<i className="ri-user-edit-line"></i>)}
                                                                        {column.id === 'roleName' && (<i className="ri-user-3-line"></i>)}
                                                                        {column.id === 'createdDate' && (<i className="ri-calendar-line"></i>)}
                                                                        {column.id === 'updatedDate' && (<i className="ri-time-line"></i>)}
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
                                        {roles.length > 0 ? (
                                            roles.slice(0, 10).map((item, index) => (
                                                <tr key={item.id}>
                                                    <td>{(currentPage - 1) * 10 + index + 1}</td>
                                                    {columns.filter(col => col.visible).map((col) => (
                                                        <td key={col.id}
                                                        className={
                                                            col.id === 'roleName' ? 'fw-bold fs-13 text-dark text-nowrap' : ''
                                                        }>
                                                            <div>{item[col.id as keyof Role]}</div>
                                                        </td>
                                                    ))}
                                                    <td><Link to={`/pages/RoleMasterinsert/${item.id}`}>
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

export default ModuleMaster;