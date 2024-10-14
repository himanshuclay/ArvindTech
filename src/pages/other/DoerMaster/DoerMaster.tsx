import axios from 'axios';
import { useState, useEffect, ChangeEvent } from 'react';
import { Button, Pagination, Table, Container, Row, Col, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import IconWithLetter from '@/pages/ui/IconWithLetter';
import config from '@/config';



interface Doer {
    id: number;
    taskID: string;
    identifier: string;
    input: string;
    inputValue: string;
    doerRole: string;
    empID: string;
    empName: string;
    createdBy: string;
    updatedBy: string;
}

interface Column {
    id: string;
    label: string;
    visible: boolean;
}

const ModuleMaster = () => {
    const [doers, setDoers] = useState<Doer[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    // both are required to make dragable column of table 
    const [columns, setColumns] = useState<Column[]>([
        { id: 'taskID', label: 'Task ID', visible: true },
        { id: 'identifier', label: 'Identifier', visible: true },
        { id: 'input', label: 'Input', visible: true },
        { id: 'inputValue', label: 'Input Value', visible: true },
        { id: 'doerRole', label: 'Doer Role', visible: true },
        { id: 'empID', label: 'Emp ID', visible: true },
        { id: 'empName', label: 'Emp Name', visible: true },

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
        fetchDoers();
    }, [currentPage]);

    const fetchDoers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/DoerMaster/GetDoer`, {
                params: {PageIndex: currentPage}
            });
            if (response.data.isSuccess) {
                setDoers(response.data.doerMasterList);
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

    const convertToCSV = (data: Doer[]) => {
        const csvRows = [
            ['Task ID', 'Identifier', 'Input', 'Input Value', 'Doer Role', 'Emp ID', 'Emp Name'],
            ...data.map(doer => [
                doer.taskID,
                doer.identifier,
                doer.input,
                doer.inputValue,
                doer.doerRole,
                doer.empID,
                doer.empName
            ])
        ];
        return csvRows.map(row => row.join(',')).join('\n');
    };

    const downloadCSV = () => {
        const csvData = convertToCSV(doers);
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

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const filteredDoers = doers.filter(doer =>
        doer.taskID.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doer.identifier.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doer.empName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <div className="container">
                <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center">
                    <span><i className="ri-file-list-line me-2 text-dark fs-16"></i><span className='fw-bold text-dark fs-15'>Doers List</span></span>
                    <div className="d-flex justify-content-end  ">
                        <div className="app-search d-none d-lg-block me-4">
                            <form>
                                <div className="input-group px300 ">
                                    <input
                                        type="search"
                                        className=" "
                                        placeholder="Search doer..."
                                        value={searchQuery}
                                        onChange={handleSearch}
                                    />
                                    <span className="ri-search-line search-icon text-muted" />
                                </div>
                            </form>
                        </div>
                        <Link to='/pages/DoerMasterinsert'>
                            <Button variant="primary" className="me-2">
                                Add Doer
                            </Button>
                        </Link>
                        <Button variant="primary" onClick={downloadCSV} className="me-2">
                            Download CSV
                        </Button>
                    </div>
                </div>


                {loading ? (
                    <div className='loader-container'>
                        <div className="loader"></div>
                        <div className='mt-2'>Please Wait!</div>
                    </div>
                ) : (

                    <div className="overflow-auto text-nowrap">
                        {!filteredDoers ? (
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
                                                                        {column.id === 'inputValue' && (<i className="ri-keyboard-line"></i>)}
                                                                        {column.id === 'taskID' && (<i className="ri-settings-2-fill"></i>)}
                                                                        {column.id === 'doerRole' && (<i className="ri-user-settings-fill"></i>)}
                                                                        {column.id === 'empName' && (<i className="ri-user-fill"></i>)}
                                                                        {column.id === 'identifier' && (<i className="ri-price-tag-3-fill"></i>)}
                                                                        {column.id === 'input' && (<i className="ri-pencil-fill"></i>)}
                                                                        {column.id === 'empID' && (<i className="ri-user-follow-fill"></i>)}
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
                                        {filteredDoers.length > 0 ? (
                                            filteredDoers.slice(0, 10).map((item, index) => (
                                                <tr key={item.id}>
                                                    <td>{(currentPage - 1) * 10 + index + 1}</td>
                                                    {columns.filter(col => col.visible).map((col) => (
                                                        <td key={col.id}
                                                            className={
                                                                // Add class based on column id
                                                                col.id === 'empID' ? 'fw-bold fs-13 text-dark' :
                                                                    col.id === 'taskID' ? 'fw-bold fs-13 text-dark' :
                                                                        col.id === 'empName' ? 'fw-bold fs-13 text-dark' :
                                                                            // Add class based on value (e.g., expired tasks)
                                                                            // (col.id === 'taskID' && item[col.id] === 'ACC.01.T1') ? 'task1' :
                                                                            ''
                                                            }
                                                        >
                                                            <div>
                                                                {col.id === 'empName' ? (
                                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                        <IconWithLetter letter={item.empName.charAt(0)} />
                                                                        {item.empName}
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                        {item[col.id as keyof Doer]}
                                                                    </>
                                                                )}

                                                            </div>
                                                        </td>
                                                    ))}

                                                    <td><Link to={`/pages/DoerMasterinsert/${item.id}`}>
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


            </div>

        </>
    );
};

export default ModuleMaster;