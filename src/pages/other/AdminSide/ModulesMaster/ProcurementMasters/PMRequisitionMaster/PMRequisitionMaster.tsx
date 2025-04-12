import axios from 'axios';
import { useState, useEffect } from 'react';
import { Button, Pagination, Table, Container, Row, Col, Alert, Form, DropdownButton } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import config from '@/config';
// import Select from 'react-select';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';



interface Mess {
    id: number,
    entryDate: string,
    projectID: string,
    projectName: string,
    assetName: string,
    specification: string,
    otherSpecification: string,
    requisitionQuantity: string,
    unit: string,
    source: string,
    requesterEmpID: string,
    requesterEmpName: string,
    coreCategory: string,
    acceptedQty: string,
    code: string,
    reconcileQtyPR_Local: string,
    reconsileQtyPO_STPO_Local: string,
    reconsileScheduleLotQty: string,
    reconsileDispatchedLotQty: string,
    reconsileRejectQty: string,
    reconsileShortCloseQty: string,
    reconsileReOrderQty: string,
    createdDate: string,
    createdBy: string,
    updatedDate: string,
    updatedBy: string

}

interface Column {
    id: string;
    label: string;
    visible: boolean;
}

// interface MessList {
//     messId: string;
//     messName: string;
// }

// interface ModuleProjectList {
//     id: string;
//     projectName: string
//     moduleName: string
// }


const PMRequisitionMaster = () => {
    const role = localStorage.getItem('role');

    const [messes, setMesses] = useState<Mess[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    // const [downloadCsv, setDownloadCsv] = useState<Mess[]>([]);
    // const [messList, setMessList] = useState<MessList[]>([]);
    // const [projectList, setProjectList] = useState<ModuleProjectList[]>([])
    const [searchTriggered] = useState(false);



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


        { id: 'entryDate', label: 'entryDate', visible: true},
        { id: 'projectID', label: 'projectID', visible: true},
        { id: 'projectName', label: 'projectName', visible: true},
        { id: 'assetName', label: 'assetName', visible: true},
        { id: 'specification', label: 'specification', visible: true},
        { id: 'otherSpecification', label: 'otherSpecification', visible: true},
        { id: 'requisitionQuantity', label: 'requisitionQuantity', visible: true},
        { id: 'unit', label: 'unit', visible: true},
        { id: 'source', label: 'source', visible: true},
        { id: 'requesterEmpID', label: 'requesterEmpID', visible: true},
        { id: 'requesterEmpName', label: 'requesterEmpName', visible: true},
        { id: 'coreCategory', label: 'coreCategory', visible: true},
        { id: 'acceptedQty', label: 'acceptedQty', visible: true},
        { id: 'code', label: 'code', visible: true},
        { id: 'reconcileQtyPR_Local', label: 'reconcileQtyPR_Local', visible: true},
        { id: 'reconsileQtyPO_STPO_Local', label: 'reconsileQtyPO_STPO_Local', visible: true},
        { id: 'reconsileScheduleLotQty', label: 'reconsileScheduleLotQty', visible: true},
        { id: 'reconsileDispatchedLotQty', label: 'reconsileDispatchedLotQty', visible: true},
        { id: 'reconsileRejectQty', label: 'reconsileRejectQty', visible: true},
        { id: 'reconsileShortCloseQty', label: 'reconsileShortCloseQty', visible: true},
        { id: 'reconsileReOrderQty', label: 'reconsileReOrderQty', visible: true},
        { id: 'createdDate', label: 'createdDate', visible: true},
        { id: 'createdBy', label: 'createdBy', visible: true},
        { id: 'updatedDate', label: 'updatedDate', visible: true},
        { id: 'updatedBy', label: 'updatedBy', visible: true},

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
        if (searchTriggered || currentPage) {
            handleSearch();
        } else {
            fetchRoles();
        }
    }, [currentPage, searchTriggered]);


    const [searchMessName] = useState('')
    const [searchStatus] = useState('')
    const [searchProjectName] = useState('')


    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        let query = `?`;
        if (searchMessName) query += `MessName=${searchMessName}&`;
        if (searchStatus) query += `Status=${searchStatus}&`;
        if (searchProjectName) query += `ProjectName=${searchProjectName}&`;
        query += `PageIndex=${currentPage}`;

        query = query.endsWith('&') ? query.slice(0, -1) : query;
        const apiUrl = `${config.API_URL_APPLICATION1}/PMRequisitionMaster/GetPMRequisition/${query}`;
        console.log(apiUrl)
        axios.get(apiUrl, { headers: { 'accept': '*/*' } })
            .then((response) => {
                console.log("search response ", response.data.pmRequisitionMasters);
                setMesses(response.data.pmRequisitionMasters)
                setTotalPages(Math.ceil(response.data.totalCount / 10));
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    };

    const fetchRoles = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION1}/PMRequisitionMaster/GetPMRequisition`, {
                params: { PageIndex: currentPage }
            });
            console.log('response', response)
            if (response.data.isSuccess) {
                setMesses(response.data.pmRequisitionMasters);
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
        // const fetchData = async (endpoint: string, setter: Function, listName: string) => {
        //     try {
        //         const response = await axios.get(`${config.API_URL_APPLICATION1}/${endpoint}`);
        //         console.log('response', response)
        //         if (response.data.isSuccess) {
        //             setter(response.data[listName]);
        //         } else {
        //             console.error(response.data.message);
        //         }
        //     } catch (error) {
        //         console.error(`Error fetching data from ${endpoint}:`, error);
        //     }
        // };

        // fetchData('PMRequisitionMaster/GetPMRequisition', setMessList, 'pmRequisitionMasters');
        // fetchData('CommonDropdown/GetProjectList', setProjectList, 'projectListResponses');
        // fetchData('MessMaster/GetMess', setDownloadCsv, 'messMasterList');

    }, []);


    // const handleClear = async () => {
    //     setSearchMessName('')
    //     setSearchProjectName('')
    //     setSearchStatus('');
    //     setCurrentPage(1);
    //     setSearchTriggered(false);
    //     await fetchRoles();
    // };


    // const convertToCSV = (data: Mess[]) => {
    //     const csvRows = [
    //         ['Mess ID', 'Mess Name', 'Manager Emp ID', 'Manager Name',
    //             'Mess Contact No', 'Project Name', 'Status',
    //             'Created By', 'Updated By', 'Created Date', 'Updated Date'],
    //         ...data.map(mess => [
    //             mess.messID.toString(),
    //             mess.messName,
    //             mess.managerEmpID,
    //             mess.managerName,
    //             mess.mobileNumber,
    //             mess.projectName,
    //             mess.status,
    //             mess.createdBy,
    //             mess.updatedBy,
    //             mess.createdDate,
    //             mess.updatedDate,

    //         ])
    //     ];

    //     return csvRows.map(row => row.join(',')).join('\n');
    // };


    // const downloadCSV = () => {
    //     const csvData = convertToCSV(downloadCsv);
    //     const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    //     const link = document.createElement('a');
    //     if (link.download !== undefined) {
    //         const url = URL.createObjectURL(blob);
    //         link.setAttribute('href', url);
    //         link.setAttribute('download', 'Messes.csv');
    //         link.style.visibility = 'hidden';
    //         document.body.appendChild(link);
    //         link.click();
    //         document.body.removeChild(link);
    //     }
    // };


    // const optionsStatus = [
    //     { value: 'Enabled', label: 'Enabled' },
    //     { value: 'Disabled', label: 'Disabled' }
    // ];


    const handleVisibilityChange = (columnId: string) => {
        setColumns(prevColumns =>
            prevColumns.map(col =>
                col.id === columnId ? { ...col, visible: !col.visible } : col
            )
        );
    };


    return (
        <>
            <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center">
                <span><i className="ri-file-list-line me-2 text-dark fs-16"></i><span className='fw-bold text-dark fs-15'>PMRequisition Master</span></span>
                <div className="d-flex justify-content-end  ">
                    {/* <Button variant="primary" onClick={downloadCSV} className="me-2">
                        Download CSV
                    </Button> */}
                    {(role === 'Admin' || role === 'DME') && (

                        <Link to='/pages/PMRequisitionMasterAddEdit'>
                            <Button variant="primary" className="me-2">
                                Add PMRequisition Master
                            </Button>
                        </Link>)}

                </div>
            </div>

            <div className='bg-white p-2 pb-2'>
                {/* <Form
                    onSubmit={(e) => {
                        e.preventDefault();
                        setCurrentPage(1);
                        setSearchTriggered(true);
                    }}
                >

                    <Row>
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
                                >
                                    Search
                                </Button>
                            </ButtonGroup>
                        </Col>
                    </Row>
                </Form> */}



                <Row className='mt-3'>
                    <div className="d-flex justify-content-end bg-light p-1">
                        <div className=" me-4">
                            <DropdownButton title="Toggle Columns" className="">
                                {columns.map(column => (
                                    <Form.Check
                                        key={column.id}
                                        type="checkbox"
                                        id={`toggle-${column.id}`}
                                        label={column.label}
                                        checked={column.visible}
                                        onChange={() => handleVisibilityChange(column.id)}
                                    />
                                ))}
                            </DropdownButton>
                        </div>


                    </div>
                </Row>
            </div>
            {loading ? (
                <div className='loader-container'>
                    <div className="loader"></div>
                    <div className='mt-2'>Please Wait!</div>
                </div>
            ) : (<>


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
                                                                    {/* {column.id === 'messID' && (<i className="ri-user-add-line"></i>)}
                                                                    {column.id === 'messName' && (<i className="ri-building-line"></i>)}
                                                                    {column.id === 'managerEmpID' && (<i className="ri-user-3-line"></i>)}
                                                                    {column.id === 'managerName' && (<i className="ri-user-2-line"></i>)}
                                                                    {column.id === 'projectName' && (<i className="ri-folder-line"></i>)}
                                                                    {column.id === 'status' && (<i className="ri-time-line"></i>)} */}


                                                                    &nbsp; {column.label}
                                                                </div>
                                                            </th>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                                {(role === 'Admin' || role === 'DME') && (

                                                    <th>Action</th>)}
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
                                                    >
                                                        {/* <div> {col.id === 'managerName' ? (
                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                {item.managerName}
                                                            </div>
                                                        ) : (
                                                            <>
                                                                {item[col.id as keyof Mess]}
                                                            </>
                                                        )}</div> */}
                                                        {item[col.id as keyof Mess]}

                                                    </td>
                                                ))}
                                                {(role === 'Admin' || role === 'DME') && (


                                                    <td><Link to={`/pages/PMRequisitionMasterAddEdit/${item.id}`}>
                                                        <Button variant='primary' className='p-0 text-white'>
                                                            <i className='btn ri-edit-line text-white' ></i>
                                                        </Button>
                                                    </Link>
                                                    </td>)}
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

export default PMRequisitionMaster;