import axios from 'axios';
import { useState, useEffect } from 'react';
import { Button, Pagination, Table, Container, Row, Col, Alert, Form, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import config from '@/config';
import Select from 'react-select';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';




interface Bank {
    id: number;
    bank: string;
    ifsc: string;
    branch: string;
    city1: string;
    city2: string;
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
    city: string
}
interface BankList {
    bank: string;
    bankName: string;
    branch: string;
}

const BankMaster = () => {
    const [banks, setBanks] = useState<Bank[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [stateList, setStateList] = useState<StateList[]>([]);
    const [bankList, setBankList] = useState<BankList[]>([]);

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
        { id: 'bank', label: 'Bank', visible: true },
        { id: 'ifsc', label: 'IFSC', visible: true },
        { id: 'branch', label: 'Branch', visible: true },
        { id: 'city1', label: 'City 1', visible: true },
        { id: 'city2', label: 'City 2', visible: true },
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





    const [searchBank, setSearchBank] = useState('');
    const [searchIfsc, setSearchIfsc] = useState('');
    const [searchBranch, setSearchBranch] = useState('');
    const [searchStatus, setSearchStatus] = useState('');
    const [searchState, setSearchState] = useState('');

    const [searchTriggered, setSearchTriggered] = useState(false);

    useEffect(() => {
        if (searchTriggered && (searchBank || searchIfsc || searchBranch || searchState || searchStatus)) {
            handleSearch();
        } else {
            fetchStaffRequirements();
        }
    }, [currentPage, searchTriggered]);


    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        let query = `?`;
        if (searchBank) query += `Bank=${searchBank}&`;
        if (searchIfsc) query += `Ifsc=${searchIfsc}&`;
        if (searchBranch) query += `Branch=${searchBranch}&`;
        if (searchState) query += `State=${searchState}&`;
        if (searchStatus) query += `Status=${searchStatus}&`;
        query += `PageIndex=${currentPage}`;

        query = query.endsWith('&') ? query.slice(0, -1) : query;
        const apiUrl = `${config.API_URL_APPLICATION}/BankMaster/SearchBank${query}`;

        setLoading(true);
        console.log("API URL:", apiUrl);

        try {
            const { data } = await axios.get(apiUrl, {
                headers: { 'accept': '*/*' }
            });

            if (data.isSuccess) {
                setBanks(data.bankMasterListResponses);
                setTotalPages(Math.ceil(data.totalCount / 10));
                console.log("Search Response:", data.bankMasterListResponses);
            } else {
                console.log("Error in API response:", data.message);
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
            const response = await axios.get(`${config.API_URL_APPLICATION}/BankMaster/GetBankList`, {
                params: { PageIndex: currentPage }
            });
            if (response.data.isSuccess) {
                setBanks(response.data.bankMasterListResponses);
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
        fetchData('CommonDropdown/GetBankName', setBankList, 'bankNames');
    }, []);




    const handleClear = async () => {
        setSearchState('');
        setSearchBranch('');
        setSearchIfsc('');
        setSearchBank('');
        setSearchStatus('');
        setSearchTriggered(false);
        await new Promise(resolve => setTimeout(resolve, 200));
        await setCurrentPage(1);
        await fetchStaffRequirements();
    };

    const convertToCSV = (data: Bank[]) => {
        const csvRows = [
            ['ID', 'Bank', 'IFSC', 'Branch', 'City 1', 'City 2', 'State', 'Created By', 'Updated By', 'Created Date', 'Updated Date'],
            ...data.map(bank => [
                bank.id,
                bank.bank,
                bank.ifsc,
                bank.branch,
                bank.city1,
                bank.city2,
                bank.state,
                bank.createdBy,
                bank.updatedBy,
                bank.createdDate,
                bank.updatedDate,
            ])
        ];
        return csvRows.map(row => row.join(',')).join('\n');
    };


    const downloadCSV = () => {
        const csvData = convertToCSV(banks);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'Banks.csv');
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
                <span><i className="ri-file-list-line me-2 text-dark fs-16"></i><span className='fw-bold text-dark fs-15'>Bank List</span></span>
                <div className="d-flex justify-content-end  ">
                    <div>
                        <Button variant="primary" onClick={downloadCSV} className="me-2">
                            Download CSV
                        </Button>
                        <Link to='/pages/BankMasterinsert'>
                            <Button variant="primary" className="">
                                Add Bank
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
            <div className='bg-white p-2 pb-2'>
                <Form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        setSearchTriggered(true);
                        setCurrentPage(1);
                    }}
                >

                    <Row>
                        <Col lg={6} className=''>
                            <Form.Group controlId="searchIfsc">
                                <Form.Label>IFSC Code</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="searchIfsc"
                                    value={searchIfsc}
                                    onChange={(e) => setSearchIfsc(e.target.value)}
                                    placeholder='Enter ISFC Code'
                                />
                            </Form.Group>
                        </Col>
                        <Col lg={6} className=''>
                            <Form.Group controlId="searchState">
                                <Form.Label>State</Form.Label>
                                <Select
                                    name="searchState"
                                    value={stateList.find(item => item.stateName === searchState) || null}
                                    onChange={(selectedOption) => setSearchState(selectedOption ? selectedOption.stateName : '')}
                                    options={stateList}
                                    getOptionLabel={(item) => item.stateName}
                                    getOptionValue={(item) => item.stateName}
                                    isSearchable={true}
                                    placeholder="Select State"
                                    className="h45"
                                />
                            </Form.Group>
                        </Col>

                        <Col lg={6} className='mt-2'>
                            <Form.Group controlId="searchBank">
                                <Form.Label>Bank Name</Form.Label>
                                <Select
                                    name="searchBank"
                                    value={bankList.find(item => (item.bank || item.bankName) === searchBank) || null}
                                    onChange={(selectedOption) => setSearchBank(selectedOption ? (selectedOption.bank || selectedOption.bankName) : '')}
                                    options={bankList}
                                    getOptionLabel={(item) => item.bank || item.bankName}
                                    getOptionValue={(item) => item.bank || item.bankName}
                                    isSearchable={true}
                                    placeholder="Select Bank Name"
                                    className="h45"
                                />
                            </Form.Group>
                        </Col>
                        <Col lg={6} className="mt-2">
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
                        <Col lg={4} className="align-items-end d-flex justify-content-end mt-3">
                            <ButtonGroup aria-label="Basic example" className="w-100">
                                <Button type="button" variant="primary" onClick={handleClear}>
                                    <i className="ri-loop-left-line"></i>
                                </Button>
                                &nbsp;
                                <Button type="submit" variant="primary"

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
                        {!banks ? (
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
                                                                        {column.id === 'bank' && (<i className="ri-bank-fill"></i>)}
                                                                        {column.id === 'ifsc' && (<i className="ri-barcode-box-line"></i>)}
                                                                        {column.id === 'branch' && (<i className="ri-building-2-line"></i>)}
                                                                        {column.id === 'city1' && (<i className="ri-map-pin-line"></i>)}
                                                                        {column.id === 'city2' && (<i className="ri-map-pin-line"></i>)}
                                                                        {column.id === 'state' && (<i className="ri-map-line"></i>)}

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
                                        {banks.length > 0 ? (
                                            banks.slice(0, 10).map((item, index) => (
                                                <tr key={item.id}>
                                                    <td>{(currentPage - 1) * 10 + index + 1}</td>
                                                    {columns.filter(col => col.visible).map((col) => (
                                                        <td key={col.id}
                                                            className={
                                                                // Add class based on column id
                                                                col.id === 'bank' ? 'fw-bold  text-dark ' :
                                                                    (col.id === 'status' && item[col.id] === "Enabled") ? 'task1' :
                                                                        (col.id === 'status' && item[col.id] === "Disabled") ? 'task4' :
                                                                            ''
                                                            }
                                                        >
                                                            <div>{item[col.id as keyof Bank]}</div>
                                                        </td>
                                                    ))}

                                                    <td><Link to={`/pages/BankMasterinsert/${item.id}`}>
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

export default BankMaster;