import axios from 'axios';
import { useState, useEffect } from 'react';
import { Button, Pagination, Table, Container, Row, Col, Alert, Form, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import config from '@/config';
import Select from 'react-select';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';



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
    updatedDate: string;
    createdDate: string;

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

interface ModuleProjectList {
    id: string;
    projectName: string
    moduleName: string
}


const MessMaster = () => {
    const [messes, setMesses] = useState<Mess[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [downloadCsv, setDownloadCsv] = useState<Mess[]>([]);
    const [messList, setMessList] = useState<MessList[]>([]);
    const [projectList, setProjectList] = useState<ModuleProjectList[]>([])



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
        { id: 'messID', label: 'Mess ID', visible: true },
        { id: 'messName', label: 'Mess Name', visible: true },
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
        if (searchMessName || searchStatus || searchProjectName) {
            handleSearch();
        } else {
            fetchRoles();
        }
    }, [currentPage]);


    const [searchMessName, setSearchMessName] = useState('')
    const [searchStatus, setSearchStatus] = useState('')
    const [searchProjectName, setSearchProjectName] = useState('')


    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        let query = `?`;
        if (searchMessName) query += `MessName=${searchMessName}&`;
        if (searchStatus) query += `Status=${searchStatus}&`;
        if (searchProjectName) query += `ProjectName=${searchProjectName}&`;
        query += `PageIndex=${currentPage}`;

        query = query.endsWith('&') ? query.slice(0, -1) : query;
        const apiUrl = `${config.API_URL_APPLICATION}/MessMaster/SearchMess${query}`;
        axios.get(apiUrl, { headers: { 'accept': '*/*' } })
            .then((response) => {
                console.log("search response ", response.data.departments);
                setMesses(response.data.messMasterList)
                setTotalPages(Math.ceil(response.data.totalCount / 10));
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    };

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

        fetchData('MessMaster/GetMess', setMessList, 'messMasterList');
        fetchData('CommonDropdown/GetProjectList', setProjectList, 'projectListResponses');
        fetchData('MessMaster/GetMess', setDownloadCsv, 'messMasterList');

    }, []);


    const handleClear = () => {
        setSearchMessName('')
        setSearchProjectName('')
        setSearchStatus('');
        setCurrentPage(1);
        fetchRoles();
    };


    const convertToCSV = (data: Mess[]) => {
        const csvRows = [
            ['Mess ID', 'Mess Name', 'Manager Emp ID', 'Manager Name',
                'Mess Contact No', 'Project Name', 'Status',
                'Created By', 'Updated By', 'Created Date', 'Updated Date'],
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
                mess.createdDate,
                mess.updatedDate,

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


    const optionsStatus = [
        { value: 'Enabled', label: 'Enabled' },
        { value: 'Disabled', label: 'Disabled' }
    ];


    return (
        <>
                <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center">
                    <span><i className="ri-file-list-line me-2 text-dark fs-16"></i><span className='fw-bold text-dark fs-15'>Mess List</span></span>
                    <div className="d-flex justify-content-end  ">
                        <Button variant="primary" onClick={downloadCSV} className="me-2">
                            Download CSV
                        </Button>
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
                        <Row>
                            <Col lg={4}>
                                <Form.Group controlId="searchMessName">
                                    <Form.Label>Mess Name</Form.Label>

                                    <Select
                                        name="searchMessName"
                                        value={messList.find(item => item.messName === searchMessName) || null} // handle null
                                        onChange={(selectedOption) => setSearchMessName(selectedOption ? selectedOption.messName : "")} // null check
                                        options={messList}
                                        getOptionLabel={(item) => item.messName}
                                        getOptionValue={(item) => item.messName}
                                        isSearchable={true}
                                        placeholder="Select Mess Name"
                                        className="h45"
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={4} className=''>
                                <Form.Group controlId="searchProjectName">
                                    <Form.Label>Project Name</Form.Label>
                                    <Select
                                        name="searchProjectName"
                                        value={projectList.find(item => item.projectName === searchProjectName) || null} // handle null
                                        onChange={(selectedOption) => setSearchProjectName(selectedOption ? selectedOption.projectName : "")} // null check
                                        options={projectList}
                                        getOptionLabel={(item) => item.projectName}
                                        getOptionValue={(item) => item.projectName}
                                        isSearchable={true}
                                        placeholder="Select Project Name "
                                        className="h45"
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={4}>
                                <Form.Group controlId="searchStatus">
                                    <Form.Label>Mess Status</Form.Label>
                                    <Select
                                        name="searchStatus"
                                        options={optionsStatus}
                                        value={optionsStatus.find(option => option.value === searchStatus) || null}
                                        onChange={(selectedOption) => setSearchStatus(selectedOption?.value || '')}
                                        placeholder="Select Status"
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
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        onClick={() => {
                                            setCurrentPage(1);
                                            handleSearch();
                                        }}
                                    >
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
                                                                (col.id === 'status' && item[col.id] === 'Enabled') ? 'task1' :
                                                                    (col.id === 'status' && item[col.id] === 'Disabled') ? 'task4' :

                                                                        ''
                                                            }>
                                                            <div> {col.id === 'managerName' ? (
                                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                    {item.managerName}
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


        </>
    );
};

export default MessMaster;