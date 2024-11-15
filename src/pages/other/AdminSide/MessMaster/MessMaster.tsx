import axios from 'axios';
import { useState, useEffect, ChangeEvent } from 'react';
import { Button, Pagination, Table, Container, Row, Col, Alert, Form, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import config from '@/config';
import Select from 'react-select';
import IconWithLetter from '@/pages/ui/IconWithLetter';
import { useLocation, useNavigate } from 'react-router-dom';
import CustomSuccessToast from '../../Component/CustomSuccessToast';



interface Mess {
    id: number
    messID: number;
    messName: string;
    managerEmpID: string;
    managerName: string;
    mobileNumber: string;
    projectName: string;
    status: string;
    createdBy: string;
    updatedBy: string;

}

interface Column {
    id: string;
    label: string;
    visible: boolean;
}

interface MessList {
    messId: string;
    messName: string;
}

const MessMaster = () => {
    const [messes, setMesses] = useState<Mess[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [downloadCsv, setDownloadCsv] = useState<Mess[]>([]);
    const [messList, setMessList] = useState<MessList[]>([]);
    
    
    const [MessName, setMessName] = useState('');



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
        { id: 'messID', label: 'Mess ID', visible: true },
        { id: 'messName', label: 'Mess Name', visible: true },
        { id: 'managerEmpID', label: 'Manager EmpID', visible: true },
        { id: 'managerName', label: 'Manager Name', visible: true },
        { id: 'projectName', label: 'Project Name', visible: true },
        { id: 'mobileNumber', label: 'Mess Contact No', visible: true },
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

    useEffect(() => {
        fetchRoles();
        fetchRolesCsv();
    }, [currentPage]);


    // const handleSearch = (e: any) => {
    //     e.preventDefault();

    //     let query = `?`;
    //     if (ProcessName) query += `ProcessName=${ProcessName}&`;
    //     if (ModuleName) query += `ModuleName=${ModuleName}&`;
    //     if (ProcessOwnerName) query += `ProcessOwnerName=${ProcessOwnerName}&`;

    //     // Remove trailing '&' or '?' from the query string
    //     query = query.endsWith('&') ? query.slice(0, -1) : query;

    //     const apiUrl = `https://arvindo-api2.clay.in/api/ProcessMaster/SearchProcessList${query}`;

    //     console.log(apiUrl)
    //     axios.get(apiUrl, {
    //         headers: {
    //             'accept': '*/*'
    //         }
    //     })
    //         .then((response) => {
    //             setProcesses(response.data.processMasterListResponses)
    //         })
    //         .catch((error) => {
    //             console.error('Error fetching data:', error);
    //         });
    // };


    const fetchRoles = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/MessMaster/GetMess`, {
                params: { PageIndex: currentPage }
            });
            if (response.data.isSuccess) {
                setMesses(response.data.messMasterList);
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
            const response = await axios.get(`${config.API_URL_APPLICATION}/MessMaster/GetMess`);
            if (response.data.isSuccess) {
                setDownloadCsv(response.data.messMasterList);
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

        fetchData('CommonDropdown/GetMessNameListWithId', setMessList, 'messNameLists');
    }, []);


    const handleClear = () => {
        fetchRoles();
    };


    const convertToCSV = (data: Mess[]) => {
        const csvRows = [
            ['Mess ID', 'Mess Name', 'Manager Emp ID', 'Manager Name', 'Mess Contact No','Project Name', 'Status', 'Created By', 'Updated By'],
            ...data.map(mess => [
                mess.messID.toString(),
                mess.messName,
                mess.managerEmpID,
                mess.managerName,
                mess.mobileNumber,
                mess.projectName,
                mess.status,
                mess.createdBy,
                mess.updatedBy,

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
            link.setAttribute('download', 'Messes.csv');
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


    // const filteredDoers = messes.filter(role =>
    //     role.roleName.toLowerCase().includes(searchQuery.toLowerCase())
    // );
    return (
        <>
            <div className="container">
                <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center">
                    <span><i className="ri-file-list-line me-2 text-dark fs-16"></i><span className='fw-bold text-dark fs-15'>Mess List</span></span>
                    <div className="d-flex justify-content-end  ">

                        <Link to='/pages/MessMasterinsert'>
                            <Button variant="primary" className="me-2">
                                Add Mess
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
                        <Form 
                        // onSubmit={handleSearch}
                        >
                            <Row>

                                <Col lg={6}>
                                    <Form.Group controlId="searchMessName">
                                        <Form.Label>Mess Name:</Form.Label>

                                        <Select
                                            name="searchMessName"
                                            value={messList.find(item => item.messName === MessName) || null} // handle null
                                            onChange={(selectedOption) => setMessName(selectedOption ? selectedOption.messName : "")} // null check
                                            options={messList}
                                            getOptionLabel={(item) => item.messName}
                                            getOptionValue={(item) => item.messName}
                                            isSearchable={true}
                                            placeholder="Search..."
                                            className="h45"
                                        />
                                    </Form.Group>
                                </Col>

                                <Col lg={6}>
                                    <Form.Group controlId="ProcessOwnerName">
                                        <Form.Label>Manager Name:</Form.Label>
                                        <Select
                                            name="ProcessOwnerName"
                                            // value={employeeList.find(item => item.empId === ProcessOwnerName) || null} // handle null
                                            // onChange={(selectedOption) => setProcessOwnerName(selectedOption ? selectedOption.empId : "")} // null check
                                            // options={employeeList}
                                            // getOptionLabel={(item) => item.employeeName.split('_')[0]}
                                            // getOptionValue={(item) => item.empId}
                                            isSearchable={true}
                                            placeholder="Search..."
                                            className="h45"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col lg={6} className='mt-2'>
                                    <Form.Group controlId="ProcessOwnerName">
                                        <Form.Label>Project Name:</Form.Label>
                                        <Select
                                            name="ProcessOwnerName"
                                            // value={employeeList.find(item => item.empId === ProcessOwnerName) || null} // handle null
                                            // onChange={(selectedOption) => setProcessOwnerName(selectedOption ? selectedOption.empId : "")} // null check
                                            // options={employeeList}
                                            // getOptionLabel={(item) => item.employeeName.split('_')[0]}
                                            // getOptionValue={(item) => item.empId}
                                            isSearchable={true}
                                            placeholder="Search..."
                                            className="h45"
                                        />
                                    </Form.Group>
                                </Col>

                                <Col></Col>
                                <Col lg={3} className='align-items-end d-flex justify-content-end'>
                                    <ButtonGroup aria-label="Basic example" className='w-100'>
                                        <Button type="button" variant="primary" onClick={handleClear}>
                                            <i className="ri-loop-left-line"></i>
                                        </Button>
                                        &nbsp;
                                        <Button type="submit" variant="primary" >Search</Button>
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
                        {!messes ? (
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
                                                                        {column.id === 'messID' && (<i className="ri-user-add-line"></i>)}
                                                                        {column.id === 'messName' && (<i className="ri-building-line"></i>)}
                                                                        {column.id === 'managerEmpID' && (<i className="ri-user-3-line"></i>)}
                                                                        {column.id === 'managerName' && (<i className="ri-user-2-line"></i>)}
                                                                        {column.id === 'projectName' && (<i className="ri-folder-line"></i>)}
                                                                        {column.id === 'status' && (<i className="ri-time-line"></i>)}


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
                                        {messes.length > 0 ? (
                                            messes.slice(0, 10).map((item, index) => (
                                                <tr key={item.id}>
                                                    <td>{(currentPage - 1) * 10 + index + 1}</td>
                                                    {columns.filter(col => col.visible).map((col) => (
                                                        <td key={col.id}
                                                            className={
                                                                col.id === 'roleName' ? 'fw-bold fs-13 text-dark text-nowrap' :
                                                                    (col.id === 'status' && item[col.id] === 'Active') ? 'task1' :
                                                                        (col.id === 'status' && item[col.id] === 'Blocked') ? 'task4' :
                                                                            (col.id === 'status' && item[col.id] === 'ACTIVE') ? 'task1' :
                                                                                (col.id === 'status' && item[col.id] === 'INACTIVE') ? 'task4' :
                                                                                    ''
                                                            }>
                                                            <div> {col.id === 'managerName' ? (
                                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                    <IconWithLetter letter={item.managerName.charAt(0)} />
                                                                    {item.managerName.split('_')[0]}
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    {item[col.id as keyof Mess]}
                                                                </>
                                                            )}</div>

                                                        </td>
                                                    ))}

                                                    <td><Link to={`/pages/MessMasterinsert/${item.id}`}>
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

export default MessMaster;