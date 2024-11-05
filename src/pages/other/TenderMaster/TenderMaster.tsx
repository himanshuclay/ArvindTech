import axios from 'axios';
import { useState, useEffect, ChangeEvent } from 'react';
import { Button, Pagination, Table, Container, Row, Col, Alert, Form, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import config from '@/config';
import Select from 'react-select';
import { useLocation, useNavigate } from 'react-router-dom';
import CustomSuccessToast from '../Component/CustomSuccessToast';


interface Tender {
    tenderID: number;
    tenderStatus: string;
    executorCompany: string;
    country: string;
    state: string;
    workName: string;
    notificationDate: string;
    tenderLink: string;
    deptPrincipleEmployerID: string;
    deptPrincipleEmployerName: string;
    contractType: string;
    estimatedCost: string;
    docPurchaseDeadline: string;
    initialBidSubmitDate: string;
    latestBidSubmissionDate: string;
    completionPeriod: string;
    notificationFilePath: string;
    notificationFileURL: string;
    referredBy: string;
    enteredByEmpID: string;
    enteredByEmpName: string;
    entryDate: string;
    handlingType: string;
    boqDeliveryDate: string;
    executionModel: string;
    client_JVID: string;
    client_JVName: string;
    ddcVendorCode: string;
    ddcVendorName: string;
    technicalBidResultDate: string;
    financialBidOpeningDate: string;
    statusLastUpdatedDate: string;
    atBid: string;
    l1BidderCode: string;
    l1BidderName: string;
    l1Bid: string;
    loiDate: string;
    loiStatus: string;
    agreementSigned: string;
    pbgSubmissionRequired: string;
    pbgSubmissionDate: string;
    lostTenderReviewRequired: string;
    tenderComparisionReportPath: string;
    tenderComparisionReportURL: string;
    createdBy: string;
    updatedBy: string;
}


interface Column {
    id: string;
    label: string;
    visible: boolean;
}


interface StatusList {
    id: number;
    name: string;
}

const TenderMaster = () => {
    const [tenders, setTenders] = useState<Tender[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [downloadCsv, setDownloadCsv] = useState<Tender[]>([]);
    const [statusList, setStatusList] = useState<StatusList[]>([]);


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
        { id: 'tenderStatus', label: 'Tender Status', visible: true },
        { id: 'executorCompany', label: 'Executor Company', visible: true },
        { id: 'country', label: 'Country', visible: true },
        { id: 'state', label: 'State', visible: true },
        { id: 'workName', label: 'Work Name', visible: true },
        { id: 'notificationDate', label: 'Notification Date', visible: true },
        { id: 'tenderLink', label: 'Tender Link', visible: true },
        { id: 'deptPrincipleEmployerID', label: 'Dept Principle Employer ID', visible: true },
        { id: 'deptPrincipleEmployerName', label: 'Dept Principle Employer Name', visible: true },
        { id: 'contractType', label: 'Contract Type', visible: true },
        { id: 'estimatedCost', label: 'Estimated Cost', visible: true },
        { id: 'docPurchaseDeadline', label: 'Document Purchase Deadline', visible: true },
        { id: 'initialBidSubmitDate', label: 'Initial Bid Submit Date', visible: true },
        { id: 'latestBidSubmissionDate', label: 'Latest Bid Submission Date', visible: true },
        { id: 'completionPeriod', label: 'Completion Period', visible: true },
        { id: 'notificationFilePath', label: 'Notification File Path', visible: true },
        { id: 'notificationFileURL', label: 'Notification File URL', visible: true },
        { id: 'referredBy', label: 'Referred By', visible: true },
        { id: 'enteredByEmpID', label: 'Entered By Emp ID', visible: true },
        { id: 'enteredByEmpName', label: 'Entered By Emp Name', visible: true },
        { id: 'entryDate', label: 'Entry Date', visible: true },
        { id: 'handlingType', label: 'Handling Type', visible: true },
        { id: 'boqDeliveryDate', label: 'BOQ Delivery Date', visible: true },
        { id: 'executionModel', label: 'Execution Model', visible: true },
        { id: 'client_JVID', label: 'Client JV ID', visible: true },
        { id: 'client_JVName', label: 'Client JV Name', visible: true },
        { id: 'ddcVendorCode', label: 'DDC Vendor Code', visible: true },
        { id: 'ddcVendorName', label: 'DDC Vendor Name', visible: true },
        { id: 'technicalBidResultDate', label: 'Technical Bid Result Date', visible: true },
        { id: 'financialBidOpeningDate', label: 'Financial Bid Opening Date', visible: true },
        { id: 'statusLastUpdatedDate', label: 'Status Last Updated Date', visible: true },
        { id: 'atBid', label: 'AT Bid', visible: true },
        { id: 'l1BidderCode', label: 'L1 Bidder Code', visible: true },
        { id: 'l1BidderName', label: 'L1 Bidder Name', visible: true },
        { id: 'l1Bid', label: 'L1 Bid', visible: true },
        { id: 'loiDate', label: 'LOI Date', visible: true },
        { id: 'loiStatus', label: 'LOI Status', visible: true },
        { id: 'agreementSigned', label: 'Agreement Signed', visible: true },
        { id: 'pbgSubmissionRequired', label: 'PBG Submission Required', visible: true },
        { id: 'pbgSubmissionDate', label: 'PBG Submission Date', visible: true },
        { id: 'lostTenderReviewRequired', label: 'Lost Tender Review Required', visible: true },
        { id: 'tenderComparisionReportPath', label: 'Tender Comparison Report Path', visible: true },
        { id: 'tenderComparisionReportURL', label: 'Tender Comparison Report URL', visible: true },
        { id: 'typeofTender', label: 'Type of Tender', visible: true },
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
        fetchMaster();
        fetchModulesCsv()
    }, [currentPage]);



    const [searchStatusValue, setSearchStatusValue] = useState('');

    const handleSearch = (e: any) => {
        e.preventDefault();

        let query = `?`;

        if (searchStatusValue) query += `TenderStatus=${searchStatusValue}&`;
        if (searchStatusValue) query += `TypeofTender=${searchStatusValue}&`;

        query = query.endsWith('&') ? query.slice(0, -1) : query;

        const apiUrl = `${config.API_URL_APPLICATION}/TenderMaster/SearchTender${query}`;

        console.log(apiUrl)
        axios.get(apiUrl, {
            headers: {
                'accept': '*/*'
            }
        })
            .then((response) => {
                // console.log("search response ", response.data.tenders);
                setTenders(response.data.tenders)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    };



    const fetchMaster = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/TenderMaster/GetTender`, {
                params: { PageIndex: currentPage }
            });
            if (response.data.isSuccess) {
                setTenders(response.data.tenders);
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
            const response = await axios.get(`${config.API_URL_APPLICATION}/TenderMaster/GetTender`);
            if (response.data.isSuccess) {
                setDownloadCsv(response.data.tenders);
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

        fetchData('CommonDropdown/GetStatus', setStatusList, 'statusListResponses');
    }, []);



    const handleClear = () => {
        setSearchStatusValue('')
        fetchMaster();
    };


    const convertToCSV = (data: Tender[]) => {
        const csvRows = [
            [
                'ID',
                'Tender Status', 'Executor Company', 'Country',
                'State', 'Work Name', 'Notification Date',
                'Tender Link', 'Dept Principle Employer ID',
                'Dept Principle Employer Name', 'Contract Type',
                'Estimated Cost', 'Document Purchase Deadline',
                'Initial Bid Submit Date', 'Latest Bid Submission Date',
                'Completion Period', 'Notification File Path',
                'Notification File URL', 'Referred By', 'Entered By Emp ID',
                'Entered By Emp Name', 'Entry Date', 'Handling Type',
                'BOQ Delivery Date', 'Execution Model',
                'Client JV ID', 'Client JV Name', 'DDC Vendor Code',
                'DDC Vendor Name', 'Technical Bid Result Date', 'Financial Bid Opening Date',
                'Status Last Updated Date', 'AT Bid', 'L1 Bidder Code',
                'L1 Bidder Name', 'L1 Bid', 'LOI Date', 'LOI Status',
                'Agreement Signed', 'PBG Submission Required', 'PBG Submission Date',
                'Lost Tender Review Required', 'Tender Comparison Report Path',
                'Tender Comparison Report URL', 'Created By', 'Updated By'
            ],
            ...data.map(tender => [
                tender.tenderID,
                tender.tenderStatus,
                tender.executorCompany,
                tender.country,
                tender.state,
                tender.workName,
                tender.notificationDate,
                tender.tenderLink,
                tender.deptPrincipleEmployerID,
                tender.deptPrincipleEmployerName,
                tender.contractType,
                tender.estimatedCost,
                tender.docPurchaseDeadline,
                tender.initialBidSubmitDate,
                tender.latestBidSubmissionDate,
                tender.completionPeriod,
                tender.notificationFilePath,
                tender.notificationFileURL,
                tender.referredBy,
                tender.enteredByEmpID,
                tender.enteredByEmpName,
                tender.entryDate,
                tender.handlingType,
                tender.boqDeliveryDate,
                tender.executionModel,
                tender.client_JVID,
                tender.client_JVName,
                tender.ddcVendorCode,
                tender.ddcVendorName,
                tender.technicalBidResultDate,
                tender.financialBidOpeningDate,
                tender.statusLastUpdatedDate,
                tender.atBid,
                tender.l1BidderCode,
                tender.l1BidderName,
                tender.l1Bid,
                tender.loiDate,
                tender.loiStatus,
                tender.agreementSigned,
                tender.pbgSubmissionRequired,
                tender.pbgSubmissionDate,
                tender.lostTenderReviewRequired,
                tender.tenderComparisionReportPath,
                tender.tenderComparisionReportURL,
                tender.createdBy,
                tender.updatedBy
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
            link.setAttribute('download', 'Tenders.csv');
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
                    <span><i className="ri-file-list-line me-2 text-dark fs-16"></i><span className='fw-bold text-dark fs-15'>Tender List</span></span>
                    <div className="d-flex justify-content-end  ">

                        <Link to='/pages/TenderMasterinsert'>
                            <Button variant="primary" className="me-2">
                                Add Tender
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
                                    <Col lg={6}>
                                        <Form.Group controlId="searchStatusValue">
                                            <Form.Label>Status </Form.Label>
                                            <Select
                                                name="searchStatusValue"
                                                value={statusList.find(emp => emp.name === searchStatusValue) || null}
                                                onChange={(selectedOption) => setSearchStatusValue(selectedOption ? selectedOption.name : "")}
                                                options={statusList}
                                                getOptionLabel={(emp) => emp.name}
                                                getOptionValue={(emp) => emp.name}
                                                isSearchable={true}
                                                placeholder="Select Status"
                                                className="h45"
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col lg={6}>
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
                            {!tenders ? (
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

                                                                            {column.id === 'id' && (<i className="ri-id-card-fill"></i>)}
                                                                            {column.id === 'tenderStatus' && (<i className="ri-information-line"></i>)}
                                                                            {column.id === 'executorCompany' && (<i className="ri-building-line"></i>)}
                                                                            {column.id === 'country' && (<i className="ri-earth-fill"></i>)}
                                                                            {column.id === 'state' && (<i className="ri-map-pin-fill"></i>)}
                                                                            {column.id === 'workName' && (<i className="ri-file-text-fill"></i>)}
                                                                            {column.id === 'notificationDate' && (<i className="ri-calendar-line"></i>)}
                                                                            {column.id === 'tenderLink' && (<i className="ri-links-line"></i>)}
                                                                            {column.id === 'deptPrincipleEmployerID' && (<i className="ri-user-settings-line"></i>)}
                                                                            {column.id === 'deptPrincipleEmployerName' && (<i className="ri-user-fill"></i>)}
                                                                            {column.id === 'contractType' && (<i className="ri-briefcase-line"></i>)}
                                                                            {column.id === 'estimatedCost' && (<i className="ri-money-dollar-circle-line"></i>)}
                                                                            {column.id === 'docPurchaseDeadline' && (<i className="ri-timer-line"></i>)}
                                                                            {column.id === 'initialBidSubmitDate' && (<i className="ri-file-list-3-line"></i>)}
                                                                            {column.id === 'latestBidSubmissionDate' && (<i className="ri-calendar-check-line"></i>)}
                                                                            {column.id === 'completionPeriod' && (<i className="ri-timer-flash-line"></i>)}
                                                                            {column.id === 'notificationFilePath' && (<i className="ri-file-list-line"></i>)}
                                                                            {column.id === 'notificationFileURL' && (<i className="ri-link"></i>)}
                                                                            {column.id === 'referredBy' && (<i className="ri-user-heart-line"></i>)}
                                                                            {column.id === 'enteredByEmpID' && (<i className="ri-user-line"></i>)}
                                                                            {column.id === 'enteredByEmpName' && (<i className="ri-user-3-line"></i>)}
                                                                            {column.id === 'entryDate' && (<i className="ri-calendar-event-line"></i>)}
                                                                            {column.id === 'handlingType' && (<i className="ri-hand-coin-line"></i>)}
                                                                            {column.id === 'boqDeliveryDate' && (<i className="ri-calendar-todo-line"></i>)}
                                                                            {column.id === 'executionModel' && (<i className="ri-bar-chart-box-line"></i>)}
                                                                            {column.id === 'client_JVID' && (<i className="ri-user-line"></i>)}
                                                                            {column.id === 'client_JVName' && (<i className="ri-user-line"></i>)}
                                                                            {column.id === 'ddcVendorCode' && (<i className="ri-building-2-line"></i>)}
                                                                            {column.id === 'ddcVendorName' && (<i className="ri-user-2-line"></i>)}
                                                                            {column.id === 'technicalBidResultDate' && (<i className="ri-calendar-line"></i>)}
                                                                            {column.id === 'financialBidOpeningDate' && (<i className="ri-calendar-check-line"></i>)}
                                                                            {column.id === 'statusLastUpdatedDate' && (<i className="ri-calendar-event-line"></i>)}
                                                                            {column.id === 'atBid' && (<i className="ri-money-dollar-circle-line"></i>)}
                                                                            {column.id === 'l1BidderCode' && (<i className="ri-barcode-box-line"></i>)}
                                                                            {column.id === 'l1BidderName' && (<i className="ri-user-star-line"></i>)}
                                                                            {column.id === 'l1Bid' && (<i className="ri-money-dollar-circle-fill"></i>)}
                                                                            {column.id === 'loiDate' && (<i className="ri-calendar-star-line"></i>)}
                                                                            {column.id === 'loiStatus' && (<i className="ri-file-shield-2-line"></i>)}
                                                                            {column.id === 'agreementSigned' && (<i className="ri-handshake-line"></i>)}
                                                                            {column.id === 'pbgSubmissionRequired' && (<i className="ri-secure-payment-line"></i>)}
                                                                            {column.id === 'pbgSubmissionDate' && (<i className="ri-calendar-check-fill"></i>)}
                                                                            {column.id === 'lostTenderReviewRequired' && (<i className="ri-eye-line"></i>)}
                                                                            {column.id === 'tenderComparisionReportPath' && (<i className="ri-file-search-line"></i>)}
                                                                            {column.id === 'tenderComparisionReportURL' && (<i className="ri-links-line"></i>)}
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
                                            {tenders.length > 0 ? (
                                                tenders.slice(0, 10).map((item, index) => (
                                                    <tr key={item.tenderID}>
                                                        <td>{(currentPage - 1) * 10 + index + 1}</td>
                                                        {columns.filter(col => col.visible).map((col) => (
                                                            <td key={col.id}
                                                                className={
                                                                    (col.id === 'tenderStatus' && item[col.id] === 'INACTIVE') ? 'task4' :
                                                                        (col.id === 'tenderStatus' && item[col.id] === 'ACTIVE') ? 'task1' :
                                                                            ''
                                                                }
                                                            >
                                                                <div>{item[col.id as keyof Tender]}</div>
                                                            </td>
                                                        ))}

                                                        <td><Link to={`/pages/TenderMasterinsert/${item.tenderID}`}>
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
            <CustomSuccessToast
                show={showToast}
                toastMessage={toastMessage}
                toastVariant={toastVariant}
                onClose={() => setShowToast(false)}
            />
        </>
    );
};

export default TenderMaster;