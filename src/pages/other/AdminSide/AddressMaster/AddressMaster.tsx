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


interface District {
    district: string;
}

interface AreaData {
    areaName: string;
}

const AddressMaster = () => {
    const [addresses, setAddresses] = useState<Addresses[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [stateList, setStateList] = useState<StateList[]>([]);

    
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

    useEffect(() => {
        fetchStaffRequirements();
    }, [currentPage]);


    useEffect(() => {
        // If any search criteria is filled, run handleSearch; otherwise, fetch master data
        if (searchPinCode || searchAreaName || searchDistrict || searchState) {
            handleSearch();
        } else {
            fetchStaffRequirements();
            // fetchModulesCsv
        }
    }, [currentPage]);


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


    const [districts, setDistricts] = useState<District[]>([]);
    const [areaData, setAreaData] = useState<AreaData[]>([]);



    const [searchPinCode, setSearchPinCode] = useState('');
    const [searchAreaName, setSearchAreaName] = useState('');
    const [searchDistrict, setSearchDistrict] = useState('');
    const [searchState, setSearchState] = useState('');



    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        let query = `?`;
        if (searchPinCode) query += `PinCode=${searchPinCode}&`;
        if (searchAreaName) query += `AreaName=${searchAreaName}&`;
        if (searchDistrict) query += `District=${searchDistrict}&`;
        if (searchState) query += `State=${searchState}&`;
        query += `PageIndex=${currentPage}`;


        query = query.endsWith('&') ? query.slice(0, -1) : query;
        const apiUrl = `${config.API_URL_APPLICATION}/AddressMaster/SearchAddress${query}`;

        console.log(apiUrl)
        axios.get(apiUrl, {
            headers: {
                'accept': '*/*'
            }
        })
            .then((response) => {
                console.log("search response ", response.data.addresses);
                setAddresses(response.data.addresses)
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
        fetchData('CommonDropdown/GetStateList', setStateList, 'stateListResponses');
    }, []);


    useEffect(() => {
        const fetchDistricts = async () => {
            try {
                const response = await axios.get(`${config.API_URL_APPLICATION}/AddressMaster/GetAddressData?PinCode=${searchPinCode}`);
                setDistricts(response.data.addresses); // Assume the response contains districtList
            } catch (error) {
                console.error('Error fetching districts:', error);
                setDistricts([]);
            }
        };

        // Only call the API if searchPinCode has exactly 6 digits
        if (searchPinCode.length === 6) {
            fetchDistricts();
        } else {
            setDistricts([]);
            setSearchDistrict(''); // Clear district if pin code is not 6 digits
            setAreaData([]); // Clear area data if conditions are not met
        }
    }, [searchPinCode]);

    useEffect(() => {
        const fetchAreaData = async () => {
            try {
                const response = await axios.get(`${config.API_URL_APPLICATION}/AddressMaster/GetAddressData?PinCode=${searchPinCode}&District=${searchDistrict}`);
                setAreaData(response.data.addresses); // Assume the response contains area data
            } catch (error) {
                console.error('Error fetching area data:', error);
                setAreaData([]);
            }
        };

        // Only call the second API if both searchPinCode and selectedDistrict are valid
        if (searchPinCode.length === 6 && searchDistrict) {
            fetchAreaData();
        }
    }, [searchPinCode, searchDistrict]);

    const handleClear = () => {
        fetchStaffRequirements();
        setSearchState('');
        setSearchPinCode('');
        setSearchAreaName('');
    };


    const convertToCSV = (data: Addresses[]) => {
        const csvRows = [
            ['Pincode', 'Area Name', 'District', 'State', 'Created By', 'Updated By'],
            ...data.map(address => [
                address.pinCode,
                address.areaName,
                address.district,
                address.state,
                address.createdBy,
                address.updatedBy
            ])
        ];
        return csvRows.map(row => row.join(',')).join('\n');
    };


    const downloadCSV = () => {
        const csvData = convertToCSV(addresses);
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

 

    return (
        <>
            <div className="container">
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


                {loading ? (
                    <div className='loader-container'>
                        <div className="loader"></div>
                        <div className='mt-2'>Please Wait!</div>
                    </div>
                ) : (

                    <>
                        <div className='bg-white p-2 pb-2'>
                            <Row>
                                <Col lg={6} className=''>
                                    <Form.Group controlId="searchPinCode">
                                        <Form.Label>Pincode</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="searchPinCode"
                                            value={searchPinCode}
                                            onChange={(e) => setSearchPinCode(e.target.value)}
                                            required
                                            placeholder='Enter Pincode'
                                        />

                                    </Form.Group>
                                </Col>
                                <Col lg={6} className=''>
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
                                            placeholder="Select State"
                                            className="h45"
                                        />
                                    </Form.Group>
                                </Col>

                                <Col lg={6} className='mt-2'>
                                    <Form.Group controlId="searchDistrict">
                                        <Form.Label>District</Form.Label>
                                        <Select
                                            name="searchDistrict"
                                            value={districts && districts.find(item => item.district === searchDistrict) || null}
                                            onChange={(selectedOption) => setSearchDistrict(selectedOption ? selectedOption.district : '')}
                                            options={districts || []}  // Provide empty array if addressData is null
                                            getOptionLabel={(item) => item.district}
                                            getOptionValue={(item) => item.district}
                                            isSearchable={true}
                                            placeholder="Select District"
                                            className="h45"

                                        />
                                    </Form.Group>
                                </Col>
                                <Col lg={6} className='mt-2'>
                                    <Form.Group controlId="searchAreaName">
                                        <Form.Label>Area Name</Form.Label>
                                        <Select
                                            name="searchAreaName"
                                            value={areaData && areaData.find(item => item.areaName === searchAreaName) || null}
                                            onChange={(selectedOption) => setSearchAreaName(selectedOption ? selectedOption.areaName : '')}
                                            options={areaData || []}
                                            getOptionLabel={(item) => item?.areaName || ''}  // Use optional chaining
                                            getOptionValue={(item) => item?.areaName || ''}  // Use optional chaining
                                            isSearchable={true}
                                            placeholder="Select Area"
                                            className="h45"
                                        />
                                    </Form.Group>
                                </Col>

                                <Col ></Col>
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
                                                                    col.id === 'department' ? 'fw-bold fs-13 text-dark task1' : ''
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


            </div >
        </>
    );
};

export default AddressMaster;