import axios from 'axios';
import { useState, useEffect } from 'react';
import { Button, Pagination, Table, Container, Row, Col, Alert, Form, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import config from '@/config';
import Select from 'react-select';
import { useLocation, useNavigate } from 'react-router-dom';
import CustomSuccessToast from '@/pages/other/Component/CustomSuccessToast';




interface ProjectType {
    id: number;
    name: string;
    status: string;
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
    const [identifiers, setIdentifiers] = useState<ProjectType[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [downloadCsv, setDownloadCsv] = useState<ProjectType[]>([]);
    const [managementContracts, setManagementContracts] = useState<ProjectType[]>([]);
    const [searchRole, setSearchRole] = useState<number>();

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
        { id: 'name', label: 'Project Type', visible: true },
        { id: 'status', label: 'Status', visible: true },
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
            const response = await axios.get(`${config.API_URL_APPLICATION}/ProjectTypeMaster/GetProjectType`, {
                params: { PageIndex: currentPage }
            });
            if (response.data.isSuccess) {
                setIdentifiers(response.data.projectTypes);
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
            const response = await axios.get(`${config.API_URL_APPLICATION}/ProjectTypeMaster/GetProjectType`, {
                params: { id: searchRole }
            });
            if (response.data.isSuccess) {
                setIdentifiers(response.data.projectTypes);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching doers:', error);
        }

    };

    const fetchRolesCsv = async () => {
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/ProjectTypeMaster/GetProjectType`);
            if (response.data.isSuccess) {
                setDownloadCsv(response.data.projectTypes);
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

        fetchData('CommonDropdown/GetProjectType', setManagementContracts, 'projectTypeListResponses');
    }, []);


    const handleClear = () => {
        fetchRoles();
        setSearchRole(undefined);
    };


    const formatDate = (dateString: string): string => {
        // If your input is in a known string format, return it directly
        // This ensures no changes to the date format
        return dateString;
    };

    const convertToCSV = (data: ProjectType[]) => {
        const csvRows = [
            ['ID', 'Management Contract', 'Status', 'Created By', 'Updated By', 'Created Date', 'Updated Date'],
            ...data.map(identifier => [
                identifier.id.toString(),
                identifier.name,
                identifier.status,
                identifier.createdBy,
                identifier.updatedBy,
                formatDate(identifier.createdDate),
                formatDate(identifier.updatedDate),

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
            link.setAttribute('download', 'ProjectType Master.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <>
            <div className="container">
                <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center">
                    <span><i className="ri-file-list-line me-2 text-dark fs-16"></i><span className='fw-bold text-dark fs-15'>Project Type List</span></span>
                    <div className="d-flex justify-content-end  ">
                        <Button variant="primary" onClick={downloadCSV} className="me-2">
                            Download CSV
                        </Button>
                        <Link to='/pages/ProjectTypeMasterinsert'>
                            <Button variant="primary" className="me-2">
                                Add  Project Type
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
                                    <Form.Label>Project Type</Form.Label>
                                    <Select
                                        name="searchRole"
                                        value={managementContracts.find(item => item.id === searchRole) || null}
                                        onChange={(selectedOption) => setSearchRole(selectedOption ? selectedOption.id : 0)}
                                        options={managementContracts}
                                        getOptionLabel={(item) => item.name}
                                        getOptionValue={(item) => item.name}
                                        isSearchable={true}
                                        placeholder="Select Project Type"
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

                                </div>


                            </div>
                        </Row>
                    </div>

                    <div className="overflow-auto text-nowrap">
                        {!identifiers ? (
                            <Container className="mt-5">
                                <Row className="justify-content-center">
                                    <Col xs={12} md={8} lg={6}>
                                        <Alert variant="info" className="text-center">
                                            <h4>No Identifier Found</h4>
                                            <p>You currently don't have Identifier</p>
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
                                                                        {column.id === 'name' && (<i className="ri-user-3-line"></i>)}
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
                                        {identifiers.length > 0 ? (
                                            identifiers.slice(0, 10).map((item, index) => (
                                                <tr key={item.id}>
                                                    <td>{(currentPage - 1) * 10 + index + 1}</td>
                                                    {columns.filter(col => col.visible).map((col) => (
                                                        <td key={col.id}
                                                            className={
                                                                col.id === 'name' ? 'fw-bold fs-13 text-dark text-nowrap' :
                                                                    (col.id === 'status' && item[col.id] === "Enabled") ? 'task1' :
                                                                        (col.id === 'status' && item[col.id] === "Disabled") ? 'task4' :
                                                                            ''
                                                            }>
                                                            <div>{item[col.id as keyof ProjectType]}</div>
                                                        </td>
                                                    ))}
                                                    <td><Link to={`/pages/ProjectTypeMasterinsert/${item.id}`}>
                                                        <Button variant='primary' className='p-0 text-white'>
                                                            <i className='btn ri-edit-line text-white' ></i>
                                                        </Button>
                                                    </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={12}><Container className="mt-5">
                                                    <Row className="justify-content-center">
                                                        <Col xs={12} md={8} lg={6}>
                                                            <Alert variant="info" className="text-center">
                                                                <h4>No Data Found</h4>
                                                                <p>You currently don't have Data</p>
                                                            </Alert>
                                                        </Col>
                                                    </Row>
                                                </Container></td>
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