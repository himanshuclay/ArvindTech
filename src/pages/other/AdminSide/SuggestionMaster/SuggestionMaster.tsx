import axios from 'axios';
import { useState, useEffect } from 'react';
import { Button, Pagination, Table, Container, Row, Col, Alert, Form, ButtonGroup } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import config from '@/config';
import { toast } from 'react-toastify';

interface Suggestion {
    id: number;
    doerID: string;
    doerName: string;
    suggestion: string;
    createdBy: string;
    updatedBy: string;
    createdDate: string;
    updatedDate: string;
}

interface Column {
    id: string;
    label: string;
    visible: boolean;
}

const SuggestionMasterList = () => {
    const role = localStorage.getItem('role');
    const location = useLocation();
    const navigate = useNavigate();

    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [downloadCsv, setDownloadCsv] = useState<Suggestion[]>([]);
    const [searchDoerID, setSearchDoerID] = useState('');
    const [searchDoerName, setSearchDoerName] = useState('');
    const [searchTriggered, setSearchTriggered] = useState(false);

    // Column drag and drop config
    const [columns, setColumns] = useState<Column[]>([
        { id: 'doerID', label: 'Doer ID', visible: true },
        { id: 'doerName', label: 'Doer Name', visible: true },
        { id: 'suggestion', label: 'Suggestion', visible: true },
        { id: 'createdBy', label: 'Created By', visible: true },
        { id: 'updatedBy', label: 'Updated By', visible: true },
        { id: 'createdDate', label: 'Created Date', visible: true },
        { id: 'updatedDate', label: 'Updated Date', visible: true },
    ]);

    useEffect(() => {
        if (location.state?.successMessage) {
            toast.dismiss();
            toast.success(location.state.successMessage);
            navigate(location.pathname, { replace: true });
        }
    }, [location.state, navigate]);

    const handleOnDragEnd = (result: any) => {
        if (!result.destination) return;
        const reorderedColumns = Array.from(columns);
        const [movedColumn] = reorderedColumns.splice(result.source.index, 1);
        reorderedColumns.splice(result.destination.index, 0, movedColumn);
        setColumns(reorderedColumns);
    };

    useEffect(() => {
        if (searchTriggered) {
            handleSearch();
        } else {
            fetchSuggestions();
        }
    }, [currentPage, searchTriggered]);

    const fetchSuggestions = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION1}/SuggestionMaster/GetSuggestionMaster/0`);

            if (response.data.isSuccess) {
                setSuggestions(response.data.suggestionMasters);
                setDownloadCsv(response.data.suggestionMasters);
                setTotalPages(Math.ceil(response.data.totalCount / 10));
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        setLoading(true);
        // try {
        //     const response = await axios.get(`${config.API_URL_APPLICATION}/SuggestionMaster/GetSuggestionMaster/0`);

        //     if (response.data.isSuccess) {
        //         let filteredSuggestions = response.data.suggestionMasters;

        //         if (searchDoerID) {
        //             filteredSuggestions = filteredSuggestions.filter(s =>
        //                 s.doerID.toLowerCase().includes(searchDoerID.toLowerCase())
        //             );
        //         }

        //         if (searchDoerName) {
        //             filteredSuggestions = filteredSuggestions.filter(s =>
        //                 s.doerName.toLowerCase().includes(searchDoerName.toLowerCase())
        //             );
        //         }

        //         setSuggestions(filteredSuggestions);
        //         setTotalPages(Math.ceil(filteredSuggestions.length / 10));
        //     } else {
        //         toast.error(response.data.message);
        //     }
        // } catch (error) {
        //     console.error('Error searching suggestions:', error);
        // } finally {
        //     setLoading(false);
        // }
    };

    const handleClear = () => {
        setSearchDoerID('');
        setSearchDoerName('');
        setCurrentPage(1);
        setSearchTriggered(false);
        fetchSuggestions();
    };

    const convertToCSV = (data: Suggestion[]) => {
        const csvRows = [
            ['ID', 'Doer ID', 'Doer Name', 'Suggestion', 'Created By', 'Updated By', 'Created Date', 'Updated Date'],
            ...data.map(item => [
                item.id,
                item.doerID,
                item.doerName,
                item.suggestion,
                item.createdBy,
                item.updatedBy,
                item.createdDate,
                item.updatedDate,
            ]),
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
            link.setAttribute('download', 'SuggestionMaster.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <>
            <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center">
                <span><i className="ri-file-list-line me-2 text-dark fs-16"></i><span className='fw-bold text-dark fs-15'>Suggestion Master List</span></span>
                <div className="d-flex justify-content-end">
                    <Button variant="primary" onClick={downloadCSV} className="me-2">Download CSV</Button>
                    {role === 'Admin' && (
                        <Link to='/pages/SuggestionMasterInsert'>
                            <Button variant="primary" className="me-2">Add Suggestion</Button>
                        </Link>
                    )}
                </div>
            </div>

            <div className='bg-white p-2 pb-2'>
                <Row>
                    <Col lg={4}>
                        <Form.Group controlId="searchDoerID">
                            <Form.Label>Doer ID</Form.Label>
                            <Form.Control
                                type="text"
                                value={searchDoerID}
                                onChange={(e) => setSearchDoerID(e.target.value)}
                                placeholder="Search by Doer ID"
                            />
                        </Form.Group>
                    </Col>

                    <Col lg={4}>
                        <Form.Group controlId="searchDoerName">
                            <Form.Label>Doer Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={searchDoerName}
                                onChange={(e) => setSearchDoerName(e.target.value)}
                                placeholder="Search by Doer Name"
                            />
                        </Form.Group>
                    </Col>

                    <Col lg={4} className="align-items-end d-flex justify-content-end mt-2">
                        <ButtonGroup aria-label="Basic example" className="w-100">
                            <Button type="button" variant="primary" onClick={handleClear}>
                                <i className="ri-loop-left-line"></i> Clear
                            </Button>
                            &nbsp;
                            <Button type="button" variant="primary" onClick={() => {
                                setCurrentPage(1);
                                setSearchTriggered(true);
                            }}>
                                Search
                            </Button>
                        </ButtonGroup>
                    </Col>
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
                        {!suggestions.length ? (
                            <Container className="mt-5">
                                <Row className="justify-content-center">
                                    <Col xs={12} md={8} lg={6}>
                                        <Alert variant="info" className="text-center">
                                            <h4>No Suggestions Found</h4>
                                            <p>You currently don't have suggestions</p>
                                        </Alert>
                                    </Col>
                                </Row>
                            </Container>
                        ) : (
                            <DragDropContext onDragEnd={handleOnDragEnd}>
                                <Table hover className='bg-white'>
                                    <thead>
                                        <Droppable droppableId="columns" direction="horizontal">
                                            {(provided) => (
                                                <tr {...provided.droppableProps} ref={provided.innerRef as React.Ref<HTMLTableRowElement>}>
                                                    <th><i className="ri-list-ordered-2"></i> Sr. No</th>
                                                    {columns.filter(col => col.visible).map((column, index) => (
                                                        <Draggable key={column.id} draggableId={column.id} index={index}>
                                                            {(provided) => (
                                                                <th>
                                                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                                        &nbsp; {column.label}
                                                                    </div>
                                                                </th>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                    {/* {role === 'Admin' && <th>Action</th>} */}
                                                </tr>
                                            )}
                                        </Droppable>
                                    </thead>
                                    <tbody>
                                        {suggestions.slice((currentPage - 1) * 10, currentPage * 10).map((item, index) => (
                                            <tr key={item.id}>
                                                <td>{(currentPage - 1) * 10 + index + 1}</td>
                                                {columns.filter(col => col.visible).map(col => (
                                                    <td key={col.id}>
                                                        {item[col.id as keyof Suggestion]}
                                                    </td>
                                                ))}
                                                {/* {role === 'Admin' && (
                                                    <td>
                                                        <Link to={`/pages/SuggestionMasterInsert/${item.id}`}>
                                                            <Button variant='primary' className='p-0 text-white'>
                                                                <i className='btn ri-edit-line text-white'></i>
                                                            </Button>
                                                        </Link>
                                                    </td>
                                                )} */}
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </DragDropContext>
                        )}
                    </div>
                </>
            )}

            <div className="d-flex justify-content-center align-items-center bg-white w-20 rounded-5 m-auto py-1 pb-1 my-2 pagination-rounded">
                <Pagination>
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

export default SuggestionMasterList;
