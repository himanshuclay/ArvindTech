import axios from 'axios';
import { useState, useEffect } from 'react';
import { Button, Pagination, Table, Container, Row, Col, Alert, Form, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import config from '@/config';
import Select from 'react-select';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


interface Addresses {
    id: number;
    pinCode: number;
    areaName: string;
    district: string;
    state: string;
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


interface StateList {
    id: number;
    stateName: string;
}



const AddressMaster = () => {
    const [addresses, setAddresses] = useState<Addresses[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [stateList, setStateList] = useState<StateList[]>([]);
    const [downloadCsv, setDownloadCsv] = useState<Addresses[]>([]);
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




    // both are required to make dragable column of table 
    const [columns, setColumns] = useState<Column[]>([
        { id: 'pinCode', label: 'Pincode', visible: true },
        { id: 'areaName', label: 'Area Name', visible: true },
        { id: 'district', label: 'District', visible: true },
        { id: 'state', label: 'State', visible: true },
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



    const [searchTriggered, setSearchTriggered] = useState(false);

    useEffect(() => {
        if (searchTriggered && (searchPinCode || searchState || searchStatus)) {
            handleSearch();

        } else {
            fetchStaffRequirements();
        }
    }, [currentPage, searchTriggered]);


    const [searchPinCode, setSearchPinCode] = useState('');
    const [searchState, setSearchState] = useState('');

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        let query = `?`;
        if (searchPinCode) query += `PinCode=${searchPinCode}&`;
        if (searchState) query += `State=${searchState}&`;
        if (searchStatus) query += `Status=${searchStatus}&`;
        query += `PageIndex=${currentPage}`;

        query = query.endsWith('&') ? query.slice(0, -1) : query;
        const apiUrl = `${config.API_URL_APPLICATION}/AddressMaster/SearchAddress${query}`;

        setLoading(true);
        console.log("API URL:", apiUrl);

        try {
            const { data } = await axios.get(apiUrl, {
                headers: { 'accept': '*/*' }
            });

            if (data.isSuccess) {  // Check if the response is successful
                setAddresses(data.addresses);
                setTotalPages(Math.ceil(data.totalCount / 10));
                console.log("Search Response:", data.addresses);
            } else {
                console.log("Error in API response:", data.message);  // Handle error message if needed
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };


    const fetchStaffRequirements = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/AddressMaster/GetAddress`, {
                params: { PageIndex: currentPage }
            });
            if (response.data.isSuccess) {
                setAddresses(response.data.addresses);
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
        fetchData('CommonDropdown/GetStateList', setStateList, 'stateListResponses');
        fetchData('AddressMaster/GetAddress', setDownloadCsv, 'addresses');
    }, []);


    const handleClear = async () => {
        setCurrentPage(1);
        setSearchState('');
        setSearchPinCode('');
        setSearchStatus('');
        setSearchTriggered(false);
        await new Promise(resolve => setTimeout(resolve, 200));
        await fetchStaffRequirements();

    };

    const convertToCSV = (data: Addresses[]) => {
        const csvRows = [
            ['Pincode', 'Area Name', 'District', 'State', 'Created By', 'Updated By', 'Created Date', 'Updated Date'],
            ...data.map(address => [
                address.pinCode,
                address.areaName,
                address.district,
                address.state,
                address.createdBy,
                address.updatedBy,
                address.createdDate,
                address.updatedDate,
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
            link.setAttribute('download', 'Address Master.csv');
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
                <span><i className="ri-file-list-line me-2 text-dark fs-16"></i><span className='fw-bold text-dark fs-15'>Address List</span></span>
                <div className="d-flex justify-content-end  ">

                    <Button variant="primary" onClick={downloadCSV} className="me-2">
                        Download CSV
                    </Button>
                    <Link to='/pages/AddressMasterinsert'>
                        <Button variant="primary" className="me-2">
                            Add Address
                        </Button>
                    </Link>

                </div>
            </div>

            <div className='bg-white p-2 pb-2'>

                <Form onSubmit={async (e) => {
                    e.preventDefault();
                    setSearchTriggered(true);
                    setCurrentPage(1);
                }}
                >

                    <Row>
                        <Col lg={4} className=''>
                            <Form.Group controlId="searchPinCode">
                                <Form.Label>Pincode</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="searchPinCode"
                                    value={searchPinCode}
                                    onChange={(e) => setSearchPinCode(e.target.value)}
                                    maxLength={6}
                                    placeholder='Enter Pincode'
                                />
                            </Form.Group>
                        </Col>
                        <Col lg={4} className=''>
                            <Form.Group controlId="searchState">
                                <Form.Label>State</Form.Label>
                                <Select
                                    name="searchState"
                                    value={stateList.find(item => item.stateName === searchState)}
                                    onChange={(selectedOption) => setSearchState(selectedOption ? selectedOption.stateName : '')}
                                    options={stateList}
                                    getOptionLabel={(item) => item.stateName}
                                    getOptionValue={(item) => item.stateName}
                                    isSearchable={true}
                                    placeholder="Select State Name"
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
                                >
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

            {loading ? (
                <div className='loader-container'>
                    <div className="loader"></div>
                    <div className='mt-2'>Please Wait!</div>
                </div>
            ) : (

                <>

                    <div className="overflow-auto text-nowrap">
                        {!addresses ? (
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
                                                    <th>Action</th>
                                                </tr>
                                            )}
                                        </Droppable>
                                    </thead>
                                    <tbody>
                                        {addresses.length > 0 ? (
                                            addresses.slice(0, 10).map((item, index) => (
                                                <tr key={item.id}>
                                                    <td>{(currentPage - 1) * 10 + index + 1}</td>
                                                    {columns.filter(col => col.visible).map((col) => (
                                                        <td key={col.id}
                                                            className={
                                                                // Add class based on column id
                                                                col.id === 'department' ? 'fw-bold fs-13 text-dark task1' :
                                                                    (col.id === 'status' && item[col.id] === "Enabled") ? 'task1' :
                                                                        (col.id === 'status' && item[col.id] === "Disabled") ? 'task4' : ''
                                                            }
                                                        >
                                                            <div>{item[col.id as keyof Addresses]}</div>
                                                        </td>
                                                    ))}

                                                    <td><Link to={`/pages/AddressMasterinsert/${item.id}`}>
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


        </>
    );
};

export default AddressMaster;