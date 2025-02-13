import axios from 'axios';
import { useState, useEffect } from 'react';
import { Button, Pagination, Table, Container, Row, Col, Alert, Form, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// import IconWithLetter from '@/pages/ui/IconWithLetter';
import config from '@/config';
import Select from 'react-select';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface FORM_LIST {
    id: number;
    name: string;
}

interface Column {
    id: string;
    label: string;
    visible: boolean;
}


const FormList = () => {
    const role = localStorage.getItem('role');
    const [formList, setFormList] = useState<FORM_LIST[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [moduleList, setModuleList] = useState<FORM_LIST[]>([]);
    const [downloadCsv, setDownloadCsv] = useState<FORM_LIST[]>([]);
    const [moduleDisplayName, setModuleDisplayName] = useState('');
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



    useEffect(() => {
        if (moduleDisplayName || searchStatus) {
            // handleSearch();
        } else {
            fetchFormList();
        }
    }, [currentPage]);


    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        let queryParams = new URLSearchParams();

        if (moduleDisplayName) queryParams.append("ModuleDisplayName", moduleDisplayName);
        if (searchStatus) queryParams.append("status", searchStatus);
        queryParams.append("PageIndex", String(currentPage));

        const apiUrl = `${config.API_URL_APPLICATION}/ModuleMaster/SearchModuleList?${queryParams.toString()}`;

        console.log(apiUrl);

        axios.get(apiUrl, { headers: { 'accept': '*/*' } })
            .then((response) => {
                console.log(response.data.moduleMasterListResponses);
                setFormList(response.data.moduleMasterListResponses);
                setTotalPages(Math.ceil(response.data.totalCount / 10));
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    };



    // both are required to make dragable column of table 
    const [columns, setColumns] = useState<Column[]>([
        { id: 'name', label: 'Form Name', visible: true },

    ]);

    const handleOnDragEnd = (result: any) => {
        if (!result.destination) return;
        const reorderedColumns = Array.from(columns);
        const [movedColumn] = reorderedColumns.splice(result.source.index, 1);
        reorderedColumns.splice(result.destination.index, 0, movedColumn);
        setColumns(reorderedColumns);
    };
    // ==============================================================








    const fetchFormList = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/FormBuilder/GetForm`, {
                params: { PageIndex: currentPage }
            });
            console.log('response', response)
            if (response.data.isSuccess) {
                setFormList(response.data.getForms);
                setTotalPages(Math.ceil(response.data.totalCount / 10));
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching modules:', error);
        }
        finally {
            setLoading(false);
        }
    };


    // useEffect(() => {
    //     const fetchData = async (endpoint: string, setter: Function, listName: string) => {
    //         try {
    //             const response = await axios.get(`${config.API_URL_APPLICATION}/${endpoint}`);
    //             if (response.data.isSuccess) {
    //                 setter(response.data[listName]);
    //             } else {
    //                 console.error(response.data.message);
    //             }
    //         } catch (error) {
    //             console.error(`Error fetching data from ${endpoint}:`, error);
    //         }
    //     };
    //     fetchData('CommonDropdown/GetModuleList', setModuleList, 'moduleNameListResponses');
    //     fetchData('ModuleMaster/GetModule', setDownloadCsv, 'moduleMasterList');
    // }, []);






    const handleClear = () => {
        setModuleDisplayName('');
        setSearchStatus('');
        setCurrentPage(1);
        fetchFormList();
    };



    // const convertToCSV = (data: FORM_LIST[]) => {
    //     const csvRows = [
    //         ['ID', 'Module Display Name', 'FMS Type', 'Module ID', 'MIS Exempt Status', 'Status', 'Created By', 'Updated By', 'Created Date', 'Updated Date'],
    //         ...data.map(mod => [
    //             mod.id,
    //             `"${mod.moduleDisplayName}"`,
    //             mod.fmsType,
    //             mod.moduleID,
    //             mod.misExempt,
    //             mod.status,
    //             mod.createdBy,
    //             mod.updatedBy,
    //             mod.createdDate,
    //             mod.updatedDate
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
    //         link.setAttribute('download', 'Module Master.csv');
    //         link.style.visibility = 'hidden';
    //         document.body.appendChild(link);
    //         link.click();
    //         document.body.removeChild(link);
    //     }
    // };
    const optionsStatus = [
        { value: 'Enabled', label: 'Enabled' },
        { value: 'Disabled', label: 'Disabled' }
    ];


    return (
        <>
            <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center fs-20">
                <span><i className="ri-file-list-line me-2"></i><span className='fw-bold test-nowrap'>Form List</span></span>
                <div className="d-flex">
                    {/* <Button variant="primary" onClick={downloadCSV} className="me-2">
                        Download CSV
                    </Button> */}
                    {role === 'Admin' && (
                        <Link to='/pages/FormBuilder'>
                            <Button variant="primary">
                                Add Form
                            </Button>
                        </Link>
                    )
                    }

                </div>
            </div>
            <div className='bg-white p-2 pb-2'>
                <Form onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch();
                    setCurrentPage(1);
                }}>
                    <Row>
                        {/* <Col lg={4}>
                            <Form.Group controlId="ModuleDisplayName">
                                <Form.Label>Module Display Name</Form.Label>

                                <Select
                                    name="searchProjectName"
                                    value={moduleList.find(item => item.moduleName === moduleDisplayName) || null} // handle null
                                    onChange={(selectedOption) => setModuleDisplayName(selectedOption ? selectedOption.moduleName : "")} // null check
                                    options={moduleList}
                                    getOptionLabel={(item) => item.moduleName}
                                    getOptionValue={(item) => item.moduleName}
                                    isSearchable={true}
                                    placeholder="Select Module Display Name"
                                    className="h45"
                                />
                            </Form.Group>
                        </Col> */}

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
                        <Col lg={4} className='align-items-end d-flex justify-content-end mt-3'>

                            <ButtonGroup aria-label="Basic example" className='w-100'>
                                <Button type="button" variant="primary" onClick={handleClear}>
                                    <i className="ri-loop-left-line"></i>
                                </Button>
                                &nbsp;
                                <Button type="submit" variant="primary" >
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
            {!formList ? (
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
                <div className="">
                    <div >
                        {loading ? (
                            <div className='loader-container'>
                                <div className="loader"></div>
                                <div className='mt-2'>Please Wait!</div>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-auto text-nowrap">
                                    <DragDropContext onDragEnd={handleOnDragEnd}>
                                        <Table hover className='bg-white '>
                                            <thead>
                                                <Droppable droppableId="columns" direction="horizontal">
                                                    {(provided) => (
                                                        <tr {...provided.droppableProps} ref={provided.innerRef as React.Ref<HTMLTableRowElement>}>
                                                            <th><i className="ri-list-ordered-2"></i> Sr. No</th>
                                                            {columns
                                                                .filter((col) => col.visible)
                                                                .map((column, index) => (
                                                                    <Draggable key={column.id} draggableId={column.id} index={index}>
                                                                        {(provided) => (
                                                                            <th>
                                                                                <div ref={provided.innerRef as React.Ref<HTMLTableHeaderCellElement>}
                                                                                    {...provided.draggableProps}
                                                                                    {...provided.dragHandleProps}>

                                                                                    {column.id === 'name' && (<i className="ri-settings-2-fill"></i>)}
                                                                                    {column.id === 'id' && (<i className="ri-settings-2-fill"></i>)}
                                                                                    &nbsp; {column.label}

                                                                                </div>
                                                                            </th>
                                                                        )}
                                                                    </Draggable>
                                                                ))}
                                                            {provided.placeholder}
                                                            {role === 'Admin' && (
                                                                <th>Action</th>
                                                            )}
                                                        </tr>
                                                    )}
                                                </Droppable>

                                            </thead>
                                            <tbody>
                                                {formList.length > 0 ? (
                                                    formList.slice(0, 10).map((item, index) => (
                                                        <tr key={item.id}>
                                                            <td>{(currentPage - 1) * 10 + index + 1}</td>
                                                            {columns.filter(col => col.visible).map((col) => (
                                                                <td key={col.id}>
                                                                    <div>
                                                                        {(
                                                                            <td>{item[col.id as keyof FORM_LIST]}</td>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            ))}
                                                            {role === 'Admin' ? (
                                                                <td><Link to={`/pages/FormBuilder/${item.id}`}>
                                                                    <Button variant='primary' className=' text-white p-0' title="You can Edit the Porcess." >
                                                                        <i className='btn ri-edit-line text-white' ></i>

                                                                    </Button></Link></td>
                                                            ) : ''}

                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={columns.length + 1}>
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
                                </div>
                            </>

                        )}

                    </div>
                    <div className="d-flex justify-content-center align-items-center bg-white w-20 rounded-5 m-auto py-1 pb-1 my-2 pagination-rounded">

                        <Pagination >
                            <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                            <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
                            <Pagination.Item active>{currentPage}</Pagination.Item>
                            <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
                            <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
                        </Pagination>
                    </div>
                </div>
            )}
        </>
    );
};

export default FormList;