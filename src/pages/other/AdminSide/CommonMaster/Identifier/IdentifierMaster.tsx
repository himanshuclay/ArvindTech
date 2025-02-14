import axios from 'axios';
import { useState, useEffect } from 'react';
import { Button, Pagination, Table, Container, Row, Col, Alert, Form, ButtonGroup, Modal, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import config from '@/config';
import Select from 'react-select';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';



interface Identifier {
    id: number;
    identifierName: string;
    identifierValue: string;
    status: string;
    source: string;
}
interface Column {
    id: string;
    label: string;
    visible: boolean;
}

interface IdentifierList {
    identifier: string;
}

const ModuleMaster = () => {
    const role = localStorage.getItem('role');
    const [identifiers, setIdentifiers] = useState<Identifier[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [downloadCsv, setDownloadCsv] = useState<Identifier[]>([]);
    const [identifierID, setIdentifierID] = useState('');
    const [identifierList, setIdentifierList] = useState<IdentifierList[]>([]);
    const [searchTriggered, setSearchTriggered] = useState(false);
    const [selectedRow, setSelectedRow] = useState<string | null>(null);
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




    const handleModalOpen = (identifierValue: string) => {
        setSelectedRow(identifierValue); // Set the identifier value of the selected row
    };

    const handleModalClose = () => {
        setSelectedRow(null); // Clear the selected row
    };
    // both are required to make dragable column of table 
    const [columns, setColumns] = useState<Column[]>([
        { id: 'identifierName', label: 'Identifier Name', visible: true },
        { id: 'identifierValue', label: 'Identifier Value', visible: true },
        { id: 'status', label: 'Status', visible: true },
        { id: 'source', label: 'Source Type', visible: true },


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


    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();


        let query = `?`;
        if (identifierID) query += `IdentifierName=${identifierID}&`;
        if (searchStatus) query += `Status=${searchStatus}&`;
        query += `PageIndex=${currentPage}`;
        const apiUrl = `${config.API_URL_APPLICATION}/IdentifierMaster/SearchIdentifier${query}`;

        console.log(apiUrl)
        axios.get(apiUrl, {
            headers: {
                'accept': '*/*'
            }
        })
            .then((response) => {
                setIdentifiers(response.data.identifierLists)
                setTotalPages(Math.ceil(response.data.totalCount / 10));
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    };



    const fetchRoles = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/IdentifierMaster/GetIdentifier`, {
                params: { PageIndex: currentPage }
            });
            if (response.data.isSuccess) {
                setIdentifiers(response.data.identifierLists);
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
        fetchData('CommonDropdown/GetIdentifier?Flag=1', setIdentifierList, 'identifierList');
        fetchData('IdentifierMaster/GetIdentifier', setDownloadCsv, 'identifierLists');
    }, []);


    const handleClear = async () => {
        setIdentifierID('');
        setSearchStatus('');
        setCurrentPage(1);
        setSearchTriggered(false);
        await fetchRoles();

    };


    const convertToCSV = (data: Identifier[]) => {
        const csvRows = [
            ['ID', 'IdentifierName', 'identifierValue', 'Status', 'source'],
            ...data.map(identifier => [
                identifier.id.toString(),
                `"${identifier.identifierName}"`,
                `"${identifier.identifierValue}"`,
                identifier.status,
                identifier.source,
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
            link.setAttribute('download', 'Identifier.csv');
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
                <span><i className="ri-file-list-line me-2 text-dark fs-16"></i><span className='fw-bold text-dark fs-15'>Identifier List</span></span>
                <div className="d-flex justify-content-end  ">
                    <Button variant="primary" onClick={downloadCSV} className="me-2">
                        Download CSV
                    </Button>
                    {role === 'Admin' && (
                        <Link to='/pages/Identifiermasterinsert'>
                            <Button variant="primary" className="me-2">
                                Add Identifier
                            </Button>
                        </Link>
                    )}


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
                        onSubmit={(e) => {
                            e.preventDefault();
                            setCurrentPage(1);
                            setSearchTriggered(true);
                        }}
                    >
                        <Row>
                            <Col lg={4}>
                                <Form.Group controlId="identifierID">
                                    <Form.Label>Identifier Name</Form.Label>

                                    <Select
                                        name="identifierID"
                                        value={identifierList.find(item => item.identifier === identifierID) || null} // handle null
                                        onChange={(selectedOption) => setIdentifierID(selectedOption ? selectedOption.identifier : "")} // null check
                                        options={identifierList}
                                        getOptionLabel={(item) => item.identifier}
                                        getOptionValue={(item) => item.identifier}
                                        isSearchable={true}
                                        placeholder="Select Identifier Name"
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



                            <Col lg={4} className='align-items-end d-flex justify-content-end'>
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
                            </div>
                        </div>
                    </Row>
                </div>

                <div className="overflow-auto text-nowrap">
                    {!identifiers ? (
                        <Container className="mt-5">
                            <Row className="justify-content-center">
                                <Col xs={12} md={8} lg={6}>
                                    <Alert variant="info" className="text-center">
                                        <h4>No Identifier Found</h4>
                                        <p>You currently don't have Identifier</p>
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
                                                                    {column.id === 'identifier' && (<i className="ri-user-3-line"></i>)}
                                                                    {column.id === 'taskID' && (<i className="ri-task-line"></i>)}
                                                                    {column.id === 'input' && (<i className="ri-input-cursor-move"></i>)}
                                                                    {column.id === 'inputValue' && (<i className="ri-input-method-line"></i>)}
                                                                    {column.id === 'empID' && (<i className="ri-id-card-line"></i>)}
                                                                    {column.id === 'employeeName' && (<i className="ri-user-line"></i>)}

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
                                    {identifiers.length > 0 ? (
                                        identifiers.slice(0, 10).map((item, index) => (
                                            <tr key={item.id}>
                                                <td>{(currentPage - 1) * 10 + index + 1}</td>
                                                {columns.filter(col => col.visible).map((col) => (
                                                    <td key={col.id}

                                                        className={
                                                            (col.id === 'status' && item[col.id] === "Enabled") ? 'task1' :
                                                                (col.id === 'status' && item[col.id] === "Disabled") ? 'task4' : ''
                                                        }>
                                                        {col.id === "identifierValue" ? (
                                                            <div
                                                                className="fw-bold text-dark ellipsis-text"
                                                                style={{ cursor: "pointer" }}
                                                                onClick={() => handleModalOpen(String(item.identifierValue))}
                                                            >
                                                                {item[col.id as keyof typeof item]}
                                                            </div>
                                                        ) : (
                                                            <div>{item[col.id as keyof typeof item]}</div>
                                                        )}
                                                    </td>
                                                ))}
                                                {role === 'Admin' && (
                                                    <td>
                                                        <Link to={`/pages/identifiermasterinsert/${item.id}`}>
                                                            <Button variant="primary" className="p-0 text-white">
                                                                <i className="btn ri-edit-line text-white"></i>
                                                            </Button>
                                                        </Link>
                                                    </td>
                                                )}

                                                {/* Modal for the selected row */}
                                                {selectedRow === String(item.identifierValue) && (
                                                    <Modal show={!!selectedRow} onHide={handleModalClose} centered>
                                                        <Modal.Header closeButton>
                                                            <Modal.Title>Identifier Value</Modal.Title>
                                                        </Modal.Header>
                                                        <Modal.Body>
                                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '4px', marginTop: '4px' }}>
                                                                {selectedRow.split(',').map(item => item.trim()).map((tag, index) => (
                                                                    <Badge bg="primary" key={index} style={{ display: 'flex', alignItems: 'center', fontSize: '13px', padding: '5px 10px' }}>
                                                                        {tag}

                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        </Modal.Body>
                                                    </Modal>
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

export default ModuleMaster;

