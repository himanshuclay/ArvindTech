import axios from 'axios';
import { useState, useEffect } from 'react';
import { Button, Pagination, Table, Container, Row, Col, Alert, Form, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import config from '@/config';
import Select from 'react-select';
import { useLocation, useNavigate } from 'react-router-dom';
import IconWithLetter from '@/pages/ui/IconWithLetter';
import { toast } from 'react-toastify';


interface Vender {
    id: number;
    vendorCode: string;
    category: string;
    name: string;
    addressLine1: string;
    district: string;
    state: string;
    area: string;
    pin: string;
    email: string;
    contactNo: string;
    bankAccountNumber: string;
    bankName: string;
    ifsc: string;
    branch: string;
    gstin: string;
    status: string;
    trade: string;
    fillingFrequency: string;
    vendorContactPerson: string;
    creatorEmpId: string;
    creatorName: string;
    creatorEmail: string;
    createdDate: string;
    updatedDate: string;
}


interface Column {
    id: string;
    label: string;
    visible: boolean;
}


interface EmployeeList {
    empId: string;
    employeeName: string;
}

const TenderMaster = () => {
    const [venders, setVenders] = useState<Vender[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [downloadCsv, setDownloadCsv] = useState<Vender[]>([]);
    const [employeeList, setEmployeeList] = useState<EmployeeList[]>([]);


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
        { id: 'vendorCode', label: 'Vendor Code', visible: true },
        { id: 'category', label: 'Category', visible: true },
        { id: 'name', label: 'Name', visible: true },
        { id: 'gstin', label: 'GSTIN', visible: true },
        { id: 'status', label: 'Status', visible: true },
        { id: 'trade', label: 'Trade', visible: true },
        { id: 'vendorContactPerson', label: 'Vendor Contact Person', visible: true },
        { id: 'contactNo', label: 'Vendor Contact No', visible: true },
        { id: 'creatorName', label: 'Creator Name', visible: true },
        { id: 'creatorEmpId', label: 'Creator Emp ID', visible: true },
        { id: 'creatorEmail', label: 'Creator Email', visible: true },
        { id: 'email', label: 'Email', visible: true },
        { id: 'district', label: 'District', visible: true },
        { id: 'state', label: 'State', visible: true },
        { id: 'area', label: 'Area', visible: true },
        { id: 'pin', label: 'Pin', visible: true },
        { id: 'addressLine1', label: 'Address Line 1', visible: true },
        { id: 'bankAccountNumber', label: 'Bank Account Number', visible: true },
        { id: 'bankName', label: 'Bank Name', visible: true },
        { id: 'ifsc', label: 'IFSC', visible: true },
        { id: 'branch', label: 'Branch', visible: true },
        { id: 'fillingFrequency', label: 'Filling Frequency', visible: true },
        { id: 'createdDate', label: 'Created Date', visible: true },
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


    const [searchVenderCode, setSearchVenderCode] = useState('');
    const [searchVendorContactPerson, setSearchVendorContactPerson] = useState('');
    const [searchCreatorName, setSearchCreatorName] = useState('');


    useEffect(() => {
        // If any search criteria is filled, run handleSearch; otherwise, fetch master data
        if (searchVenderCode || searchVendorContactPerson || searchCreatorName) {
            handleSearch();
        } else {
            fetchMaster();
            fetchModulesCsv
        }
    }, [currentPage]); // Run this effect when currentPage changes


    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        let query = `?`;

        if (searchVenderCode) query += `VendorCode=${searchVenderCode}&`;
        if (searchVendorContactPerson) query += `VendorContactPerson=${searchVendorContactPerson}&`;
        if (searchCreatorName) query += `CreatorName=${searchCreatorName}&`;
        query += `PageIndex=${currentPage}`;
        query = query.endsWith('&') ? query.slice(0, -1) : query;
        const apiUrl = `${config.API_URL_APPLICATION}/VendorMaster/SearchVendor${query}`;
        console.log(apiUrl)
        axios.get(apiUrl, {
            headers: {
                'accept': '*/*'
            }
        })
            .then((response) => {
                setVenders(response.data.vendorMasterList)
                setTotalPages(Math.ceil(response.data.totalCount / 10));
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    };



    const fetchMaster = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/VendorMaster/GetVendor`, {
                params: { PageIndex: currentPage }
            });
            if (response.data.isSuccess) {
                setVenders(response.data.vendorMasterList);
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


    const fetchModulesCsv = async () => {
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/VendorMaster/GetVendor`);
            if (response.data.isSuccess) {
                setDownloadCsv(response.data.vendorMasterList);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching hrDoers:', error);
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

        fetchData('CommonDropdown/GetEmployeeListWithId', setEmployeeList, 'employeeLists');

    }, []);



    const handleClear = () => {
        setSearchCreatorName('')
        setSearchVendorContactPerson('')
        setSearchVenderCode('')
        fetchMaster();
    };


    const convertToCSV = (data: Vender[]) => {
        const csvRows = [
            [
                'ID',
                'Vendor Code', 'Category',
                'Name', 'Address Line 1',
                'District', 'State', 'Area',
                'Pin', 'Email', 'Contact No',
                'Bank Account Number',
                'Bank Name', 'IFSC', 'Branch',
                'GSTIN', 'Filling Frequency',
                'Vendor Contact Person',
                'Creator Emp ID',
                'Created By', 'Updated By',
                'Created Date', 'Updated Date'
            ],
            ...data.map(tender => [
                tender.id,
                tender.vendorCode,
                tender.category,
                tender.name,
                tender.addressLine1,
                tender.district,
                tender.state,
                tender.area,
                tender.pin,
                tender.email,
                tender.contactNo,
                tender.bankAccountNumber,
                tender.bankName,
                tender.ifsc,
                tender.branch,
                tender.gstin,
                tender.fillingFrequency,
                tender.vendorContactPerson,
                tender.creatorEmpId,
                tender.creatorName,
                tender.creatorEmail,
                tender.createdDate,
                tender.updatedDate,
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
            link.setAttribute('download', 'Vender Master.csv');
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
                    <span><i className="ri-file-list-line me-2 text-dark fs-16"></i><span className='fw-bold text-dark fs-15'>Vendor List</span></span>
                    <div className="d-flex justify-content-end  ">
                        <div>
                            <Button variant="primary" onClick={downloadCSV} className="me-2">
                                Download CSV
                            </Button>
                            <Link to='/pages/VendorMasterinsert'>
                                <Button variant="primary" className="">
                                    Add Vendor
                                </Button>
                            </Link>


                        </div>


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
                                        <Form.Group controlId="searchVenderCode">
                                            <Form.Label>Vendor Code </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="searchVenderCode"
                                                value={searchVenderCode}
                                                onChange={(e) => setSearchVenderCode(e.target.value)}
                                                placeholder='Enter Vendor Code'
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col lg={4}>
                                        <Form.Group controlId="searchVendorContactPerson">
                                            <Form.Label>Vendor Contact Person </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="searchVendorContactPerson"
                                                value={searchVendorContactPerson}
                                                onChange={(e) => setSearchVendorContactPerson(e.target.value)}
                                                placeholder='Enter Vendor Contact Person'
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col lg={4}>
                                        <Form.Group controlId="searchCreatorName">
                                            <Form.Label>Creator Name</Form.Label>
                                            <Select
                                                name="searchCreatorName"
                                                value={employeeList.find(emp => emp.employeeName === searchCreatorName) || null} // handle null
                                                onChange={(selectedOption) => setSearchCreatorName(selectedOption ? selectedOption.employeeName : "")} // null check
                                                options={employeeList}
                                                getOptionLabel={(emp) => emp.employeeName}
                                                getOptionValue={(emp) => emp.employeeName}
                                                isSearchable={true}
                                                placeholder="Select Creator Name"
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

                                    {/* <h4>search filter will be introduce here</h4> */}

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
                            {!venders ? (
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
                                                                            {column.id === 'vendorCode' && (<i className="ri-barcode-line"></i>)}
                                                                            {column.id === 'category' && (<i className="ri-folder-fill"></i>)}
                                                                            {column.id === 'name' && (<i className="ri-user-line"></i>)}
                                                                            {column.id === 'addressLine1' && (<i className="ri-home-4-line"></i>)}
                                                                            {column.id === 'district' && (<i className="ri-map-pin-2-line"></i>)}
                                                                            {column.id === 'state' && (<i className="ri-map-pin-fill"></i>)}
                                                                            {column.id === 'area' && (<i className="ri-map-pin-range-line"></i>)}
                                                                            {column.id === 'pin' && (<i className="ri-pushpin-2-line"></i>)}
                                                                            {column.id === 'email' && (<i className="ri-mail-line"></i>)}
                                                                            {column.id === 'contactNo' && (<i className="ri-phone-line"></i>)}
                                                                            {column.id === 'bankAccountNumber' && (<i className="ri-bank-card-line"></i>)}
                                                                            {column.id === 'bankName' && (<i className="ri-bank-line"></i>)}
                                                                            {column.id === 'ifsc' && (<i className="ri-secure-payment-line"></i>)}
                                                                            {column.id === 'branch' && (<i className="ri-branch-line"></i>)}
                                                                            {column.id === 'gstin' && (<i className="ri-money-cny-circle-line"></i>)}
                                                                            {column.id === 'fillingFrequency' && (<i className="ri-calendar-2-line"></i>)}
                                                                            {column.id === 'vendorContactPerson' && (<i className="ri-user-star-line"></i>)}
                                                                            {column.id === 'creatorEmpId' && (<i className="ri-user-3-line"></i>)}
                                                                            {column.id === 'creatorName' && (<i className="ri-user-smile-line"></i>)}
                                                                            {column.id === 'creatorEmail' && (<i className="ri-mail-open-line"></i>)}
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
                                            {venders.length > 0 ? (
                                                venders.slice(0, 10).map((item, index) => (
                                                    <tr key={item.id}>
                                                        <td>{(currentPage - 1) * 10 + index + 1}</td>
                                                        {columns.filter(col => col.visible).map((col) => (
                                                            <td key={col.id}
                                                                className={
                                                                    col.id === 'addressLine1' ? 'w-200px' :
                                                                        col.id === 'creatorName' ? 'text-dark fw-bold' :
                                                                            col.id === 'vendorContactPerson' ? 'text-dark fw-bold' :
                                                                                ''
                                                                }
                                                            >
                                                                {col.id === 'creatorName' && item.creatorName ? (
                                                                    <div className="d-flex align-items-center">
                                                                        <IconWithLetter letter={item.creatorName.charAt(0)} />
                                                                        {item.creatorName.split('_')[0]}
                                                                    </div>
                                                                ) : col.id === 'vendorContactPerson' && item.vendorContactPerson ? (
                                                                    <div className="d-flex align-items-center">
                                                                        <IconWithLetter letter={item.vendorContactPerson.charAt(0)} />
                                                                        {item.vendorContactPerson.split('_')[0]}
                                                                    </div>
                                                                ) :
                                                                    (
                                                                        <div>
                                                                            {item[col.id as keyof Vender]}
                                                                        </div>
                                                                    )
                                                                }

                                                            </td>
                                                        ))}

                                                        <td><Link to={`/pages/VendorMasterinsert/${item.id}`}>
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
                                                                        <h4>No Data  Found</h4>
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
        </>
    );
};

export default TenderMaster;