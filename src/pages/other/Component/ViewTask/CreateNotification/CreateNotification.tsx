import axios from 'axios';
import { useState, useEffect } from 'react';
import { Button, Pagination, Table, Container, Row, Col, Alert, Form, ButtonGroup } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import config from '@/config';
import Select from 'react-select';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CreatePopup from './CreatePopup';
import PushNotification from './PushNotification';




interface Designation {
    id: number;
    title: string;
    subject: string;
    content: string;
    allocated: string;
    count: number;
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
    const role = localStorage.getItem('role');

    // const [designations, setDesignations] = useState<Designation[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [departmentList, setDepartmentList] = useState<DepartmentList[]>([]);
    const [searchDept, setSearchDept] = useState('');
    const [searchStatus, setSearchStatus] = useState('');
    const [searchTriggered, setSearchTriggered] = useState(false);
    const [show, setShow] = useState(false);
    const [manageId, setManageID] = useState<number>();
    const [showView, setShowView] = useState(false);


    const [notifications, setNotifications] = useState<Designation[]>([
        {
            id: 1,
            title: "System Update",
            subject: "Scheduled Maintenance Notification",
            content: "The system will undergo maintenance on Saturday from 2 AM to 6 AM. Please save your work beforehand.",
            allocated: "DME",
            count: 150
        },
        {
            id: 2,
            title: "New Policy Announcement",
            subject: "Remote Work Policy Update",
            content: "Starting next month, employees are allowed to work remotely twice a week. Please refer to the HR portal for more details.",
            allocated: "Management",
            count: 3
        },
        {
            id: 3,
            title: "Training Reminder",
            subject: "Mandatory Compliance Training",
            content: "All employees are required to complete the compliance training by the end of this week.",
            allocated: "Admin",
            count: 50
        },
        {
            id: 4,
            title: "Event Invitation",
            subject: "Annual Company Meetup",
            content: "You are cordially invited to our Annual Company Meetup happening next Friday. RSVP by this Wednesday.",
            allocated: "Employee",
            count: 500
        },
        {
            id: 5,
            title: "Security Alert",
            subject: "Phishing Email Awareness",
            content: "Please be cautious of phishing emails. Avoid clicking on suspicious links and report them to the IT department immediately.",
            allocated: "ProjectIncharge",
            count: 17
        }
    ]);


    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        if (location.state?.successMessage) {
            toast.dismiss()
            toast.success(location.state.successMessage);
            navigate(location.pathname, { replace: true });
        }
    }, [location.state, navigate]);


    // both are required to make dragable column of table 
    const [columns, setColumns] = useState<Column[]>([
        { id: 'title', label: 'Title', visible: true },
        { id: 'subject', label: 'Subject', visible: true },
        { id: 'content', label: 'Content ', visible: true },
        { id: 'allocated', label: 'Allocated to ', visible: true },
        { id: 'count', label: 'Count ', visible: true },
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
        fetchData();
    }, [currentPage]);


    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/DepartmentMaster/GetDepartment`, {
                params: { PageIndex: currentPage }
            });
            if (response.data.isSuccess) {
                // setDesignations(response.data.departments);
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
        if (searchDept || searchStatus) {
            handleSearch();
        } else {
            fetchData();
        }
    }, [currentPage, searchDept, searchStatus, searchTriggered]);







    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        let query = `?`;
        if (searchDept) query += `DepartmentName=${searchDept}&`;
        if (searchStatus) query += `Status=${searchStatus}&`;
        query += `PageIndex=${currentPage}`;

        query = query.endsWith('&') ? query.slice(0, -1) : query;
        const apiUrl = `${config.API_URL_APPLICATION}/DepartmentMaster/SearchDepartment${query}`;
        axios.get(apiUrl, { headers: { 'accept': '*/*' } })
            .then((response) => {
                console.log("search response ", response.data.departments);
                setNotifications(response.data.departments)
                setTotalPages(Math.ceil(response.data.totalCount / 10));
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
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

    const handleClear = async () => {
        setCurrentPage(1);
        setSearchDept('');
        setSearchStatus('')
        await new Promise(resolve => setTimeout(resolve, 200));
        await fetchData();
    };



    const optionsStatus = [
        { value: 'Enabled', label: 'Enabled' },
        { value: 'Disabled', label: 'Disabled' }
    ];


    const handleShowview = () => setShowView(true);
    const handleViewEdit = (id: any) => {
        handleShowview();
        setManageID(id)

    };

    return (
        <>
            <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center">
                <span><i className="ri-file-list-line me-2 text-dark fs-16"></i><span className='fw-bold text-dark fs-15'>Notifications</span></span>
                <div className="d-flex justify-content-end  ">


                    {(role === 'Admin' || role === 'DME') && (
                        <Button variant="primary" className="me-2"
                            onClick={() => setShow(true)}
                        >
                            Create Notification
                        </Button>
                    )}

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
                        <Form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                setCurrentPage(1);
                                setSearchTriggered(true);
                            }}
                        >
                            <Row>
                                <Col lg={4}>
                                    <Form.Group controlId="searchDept">
                                        <Form.Label>Title</Form.Label>
                                        <Select
                                            name="searchDept"
                                            value={departmentList.find(item => item.departmentName === searchDept) || null}
                                            onChange={(selectedOption) => setSearchDept(selectedOption ? selectedOption.departmentName : '')}
                                            options={departmentList}
                                            getOptionLabel={(item) => item.departmentName}
                                            getOptionValue={(item) => item.departmentName}
                                            isSearchable={true}
                                            placeholder="Select Title"
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
                                </div>

                            </div>
                        </Row>
                    </div>

                    <div className="overflow-auto text-nowrap">
                        {!notifications ? (
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
                                                                        {column.id === 'departmentName' && (<i className="ri-group-fill"></i>)}
                                                                        &nbsp; {column.label}
                                                                    </div>
                                                                </th>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                    {(role === 'Admin' || role === 'DME') && (
                                                        <>
                                                            <th className='text-center'>Publish</th>
                                                            <th>Action</th>
                                                        </>
                                                    )}
                                                </tr>
                                            )}
                                        </Droppable>
                                    </thead>
                                    <tbody>
                                        {notifications.length > 0 ? (
                                            notifications.slice(0, 10).map((item, index) => (
                                                <tr key={item.id}>
                                                    <td>{(currentPage - 1) * 10 + index + 1}</td>
                                                    {columns.filter(col => col.visible).map((col) => (
                                                        <td key={col.id}
                                                            className={
                                                                col.id === 'content' ? 'truncated-text-500' :
                                                                    ''
                                                            }
                                                        >
                                                            <div>{item[col.id as keyof Designation]}</div>
                                                        </td>
                                                    ))}

                                                    {(role === 'Admin' || role === 'DME') && (
                                                        <>
                                                            <td className='text-center'>
                                                                <Button variant='primary' className='text-white' onClick={() => handleViewEdit(item.id)}>
                                                                    {item.count > 0 ? 'Published' : 'Publish'}
                                                                </Button>
                                                            </td>

                                                            <td>
                                                                <Button variant='primary' className='p-0 text-white' onClick={() => handleViewEdit(item.id)}>
                                                                    <i className='btn ri-edit-line text-white' ></i>
                                                                </Button>
                                                            </td>
                                                        </>


                                                    )}
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
                    </div >
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
            <CreatePopup show={show} setShow={setShow} />
            <PushNotification showView={showView} setShowView={setShowView} id={manageId} />



        </>
    );
};

export default DesignationMaster;