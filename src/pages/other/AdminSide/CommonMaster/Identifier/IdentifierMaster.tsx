import axios from 'axios';
import { useState, useEffect, ChangeEvent } from 'react';
import { Button, Pagination, Table, Container, Row, Col, Alert, Form, ButtonGroup, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import config from '@/config';
import Select from 'react-select';
import CustomSuccessToast from '@/pages/other/Component/CustomSuccessToast';
import { useLocation, useNavigate } from 'react-router-dom';



interface Identifier {
    id: number;
    identifierName: string;
    identifierValue: string;
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
    const [identifiers, setIdentifiers] = useState<Identifier[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [downloadCsv, setDownloadCsv] = useState<Identifier[]>([]);
    const [identifierID, setIdentifierID] = useState('');
    const [identifierList, setIdentifierList] = useState<IdentifierList[]>([]);

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
        // { id: 'taskID', label: 'Task Number', visible: true },
        { id: 'identifierName', label: 'Identifier Name', visible: true },
        { id: 'identifierValue', label: 'Identifier Value', visible: true },
        // { id: 'identifier1', label: 'Identifier 1', visible: true },
        // { id: 'identifierValue1', label: 'Identifier Value 1', visible: true },
        { id: 'source', label: 'Source Type', visible: true },
        // { id: 'empID', label: 'Employee ID ', visible: true },
        // { id: 'employeeName', label: 'Employee Name', visible: true },


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



    const handleSearch = (e: any) => {

        e.preventDefault();

        let query = `?`;
        if (identifierID) query += `IdentifierName=${identifierID}&`;
        query += `PageIndex=${currentPage}`;

        // Remove trailing '&' or '?' from the query string
        // query = query.endsWith('&') ? query.slice(0, -1) : query;

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




    const fetchRolesCsv = async () => {
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/IdentifierMaster/GetIdentifier`);
            if (response.data.isSuccess) {
                setDownloadCsv(response.data.identifierLists);
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
        fetchData('CommonDropdown/GetIdentifier', setIdentifierList, 'identifierList');
    }, []);


    const handleClear = () => {
        fetchRoles();
        setIdentifierID('');

    };


    const convertToCSV = (data: Identifier[]) => {
        const csvRows = [
            ['ID', 'IdentifierName', 'identifierValue', 'source'],
            ...data.map(identifier => [
                identifier.id.toString(),
                identifier.identifierName,
                identifier.identifierValue,
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

    const handleSearchcurrent = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const [modalContent, setModalContent] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

    const handleModalOpen = (content: string) => {
        setModalContent(content);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setModalContent(null);
    };


    const filteredIdentifiers = identifiers.filter(identifier =>
        // identifier.identifier.toLowerCase().includes(searchQuery.toLowerCase()) ||
        // identifier.taskID.toLowerCase().includes(searchQuery.toLowerCase()) ||
        identifier.identifierValue.toLowerCase().includes(searchQuery.toLowerCase())
        //  ||
        // identifier.empID.toLowerCase().includes(searchQuery.toLowerCase()) ||
        // identifier.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <div className="container">
                <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center">
                    <span><i className="ri-file-list-line me-2 text-dark fs-16"></i><span className='fw-bold text-dark fs-15'>Identifier List</span></span>
                    <div className="d-flex justify-content-end  ">

                        <Link to='/pages/Identifiermasterinsert'>
                            <Button variant="primary" className="me-2">
                                Add Identifier
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
                        <Form onSubmit={handleSearch}>
                            <Row>
                                <Col lg={3}>
                                    <Form.Group controlId="identifierID">
                                        <Form.Label>Identifier</Form.Label>

                                        <Select
                                            name="identifierID"
                                            value={identifierList.find(item => item.identifier === identifierID) || null} // handle null
                                            onChange={(selectedOption) => setIdentifierID(selectedOption ? selectedOption.identifier : "")} // null check
                                            options={identifierList}
                                            getOptionLabel={(item) => item.identifier}
                                            getOptionValue={(item) => item.identifier}
                                            isSearchable={true}
                                            placeholder="Select Identifier"
                                            className="h45"
                                        />
                                    </Form.Group>
                                </Col>

                                <Col>

                                </Col>


                                <Col className='align-items-end d-flex justify-content-end'>
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
                        {!filteredIdentifiers ? (
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
                                                    <th>Action</th>
                                                </tr>
                                            )}
                                        </Droppable>
                                    </thead>
                                    <tbody>
                                        {filteredIdentifiers.length > 0 ? (
                                            filteredIdentifiers.slice(0, 10).map((item, index) => (
                                                <tr key={item.id}>
                                                    <td>{(currentPage - 1) * 10 + index + 1}</td>
                                                    {columns.filter(col => col.visible).map((col) => (
                                                        <td key={col.id}>
                                                            {col.id === 'identifierValue' ? (
                                                                <div
                                                                    className="fw-bold fs-13 text-dark ellipsis-text"
                                                                    style={{ cursor: 'pointer' }}
                                                                    onClick={() => handleModalOpen(String(item[col.id as keyof typeof item]))}
                                                                >
                                                                    {item[col.id as keyof typeof item]}
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    {item[col.id as keyof typeof item]}
                                                                </div>
                                                            )}
                                                        </td>
                                                    ))}
                                                    {modalContent && (
                                                        <Modal show={showModal} onHide={handleModalClose} centered>
                                                            <Modal.Header closeButton>
                                                                <Modal.Title>Details</Modal.Title>
                                                            </Modal.Header>
                                                            <Modal.Body>
                                                                {modalContent}
                                                            </Modal.Body>
                                                            <Modal.Footer>
                                                                <Button variant="secondary" onClick={handleModalClose}>
                                                                    Close
                                                                </Button>
                                                            </Modal.Footer>
                                                        </Modal>
                                                    )}
                                                    <td><Link to={`/pages/identifiermasterinsert/${item.id}`}>
                                                        <Button variant='primary' className='p-0 text-white'>
                                                            <i className='btn ri-edit-line text-white' ></i>
                                                        </Button>
                                                    </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={12}><Container className="mt-5">
                                                    <Row className="justify-content-center">
                                                        <Col xs={12} md={8} lg={6}>
                                                            <Alert variant="info" className="text-center">
                                                                <h4>No Data Found</h4>
                                                                <p>You currently don't have Data</p>
                                                            </Alert>
                                                        </Col>
                                                    </Row>
                                                </Container></td>
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

export default ModuleMaster;

