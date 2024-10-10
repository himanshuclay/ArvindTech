import React, { useState, useEffect, ChangeEvent } from 'react';
import { Button, Form, Offcanvas, Table, Pagination } from 'react-bootstrap';
import config from '../../config';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import IconWithLetter from '../ui/IconWithLetter';



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

const DoerMaster: React.FC = () => {
    const [doer, setDoer] = useState<Doer>({
        id: 0,
        taskID: '',
        identifier: '',
        input: '',
        inputValue: '',
        doerRole: '',
        empID: '',
        empName: '',
        createdBy: '',
        updatedBy: ''
    });

    const [doers, setDoers] = useState<Doer[]>([]);
    const [show, setShow] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    // const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalPages, setTotalPages] = useState(1); // Added state for total pages

    const [loading, setLoading] = useState<boolean>(false);


    // =======================================================================
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
                params: {
                    PageIndex: currentPage
                }
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
            setLoading(false); // End loading
        }
    };

    const handleShow = () => setShow(true);

    const handleChange = (e: ChangeEvent<any>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement; // Explicitly cast to HTMLInputElement
            setDoer({
                ...doer,
                [name]: checked
            });
        } else {
            setDoer({
                ...doer,
                [name]: value
            });
        }
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (editingIndex !== null) {
                await axios.post(`${config.API_URL_APPLICATION}/DoerMaster/UpdateDoer`, doer);
            } else {
                await axios.post(`${config.API_URL_APPLICATION}/DoerMaster/InsertDoer`, doer);
            }
            fetchDoers();
            handleClose();
        } catch (error) {
            console.error('Error submitting doer:', error);
        }
    };

    const handleEdit = (index: number) => {
        setEditingIndex(index);
        setDoer(doers[index]);
        handleShow();
    };

    const handleClose = () => {
        setShow(false);
        setEditingIndex(null);
        setDoer({
            id: 0,
            taskID: '',
            identifier: '',
            input: '',
            inputValue: '',
            doerRole: '',
            empID: '',
            empName: '',
            createdBy: '',
            updatedBy: ''
        });
    };

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page on search
    };



    const filteredDoers = doers.filter(doer =>
        doer.taskID.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doer.identifier.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doer.empName.toLowerCase().includes(searchQuery.toLowerCase())
    );



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





    return (
        <div className="container">
            <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center">
                <span><i className="ri-file-list-line me-2 text-dark fs-16"></i><span className='fw-bold text-dark fs-15'>Doers List</span></span>
                <div className="d-flex">
                    <div className="app-search d-none d-lg-block me-4">
                        <form>
                            <div className="input-group">
                                <input
                                    type="search"
                                    className="form-control"
                                    placeholder="Search doer..."
                                    value={searchQuery}
                                    onChange={handleSearch}
                                />
                                <span className="ri-search-line search-icon text-muted" />
                            </div>
                        </form>
                    </div>
                    <Button variant="primary" onClick={handleShow} className="me-2">
                    <i className="ri-add-line"></i> Add Doer
                    </Button>
                    <Button variant="primary" onClick={downloadCSV} className="me-2">
                    <i className="ri-download-fill"></i> Download CSV
                    </Button>
                </div>
            </div>

            <Offcanvas show={show} onHide={handleClose}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title className='text-dark'><i className="ri-survey-line"></i> Doer Form</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="taskID" className="mb-3">
                            <Form.Label> <i className="ri-settings-2-fill"></i> Task ID:</Form.Label>
                            <Form.Control
                                type="text"
                                name="taskID"
                                value={doer.taskID}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="identifier" className="mb-3">
                            <Form.Label> <i className="ri-price-tag-3-fill"></i> Identifier:</Form.Label>
                            <Form.Control
                                type="text"
                                name="identifier"
                                value={doer.identifier}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="input" className="mb-3">
                            <Form.Label><i className="ri-pencil-fill"></i> Input:</Form.Label>
                            <Form.Control
                                type="text"
                                name="input"
                                value={doer.input}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="inputValue" className="mb-3">
                            <Form.Label><i className="ri-keyboard-line"></i> Input Value:</Form.Label>
                            <Form.Control
                                type="text"
                                name="inputValue"
                                value={doer.inputValue}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="doerRole" className="mb-3">
                            <Form.Label><i className="ri-user-settings-fill"></i> Doer Role:</Form.Label>
                            <Form.Control
                                type="text"
                                name="doerRole"
                                value={doer.doerRole}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="empID" className="mb-3">
                            <Form.Label><i className="ri-user-follow-fill"></i> Employee ID:</Form.Label>
                            <Form.Control
                                type="text"
                                name="empID"
                                value={doer.empID}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="empName" className="mb-3">
                            <Form.Label><i className="ri-user-fill"></i> Employee Name:</Form.Label>
                            <Form.Control
                                type="text"
                                name="empName"
                                value={doer.empName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="createdBy" className="mb-3">
                            <Form.Label><i className="ri-user-add-fill"></i> Created By:</Form.Label>
                            <Form.Control
                                type="text"
                                name="createdBy"
                                value={doer.createdBy}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="updatedBy" className="mb-3">
                            <Form.Label><i className="ri-arrow-up-circle-fill"></i> Updated By:</Form.Label>
                            <Form.Control
                                type="text"
                                name="updatedBy"
                                value={doer.updatedBy}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            {editingIndex !== null ? 'Update Doer' : 'Add Doer'}
                        </Button>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>





            <div className="overflow-auto text-nowrap">
                {loading ? (
                    <div className='loader-container'>
                        <div className="loader"></div>
                        <div className='mt-2'>Please Wait!</div>
                    </div>
                ) : (
                    <DragDropContext onDragEnd={handleOnDragEnd}>
                        <Table hover className='bg-white '>
                            <thead>
                                <Droppable droppableId="columns" direction="horizontal">
                                    {(provided) => (
                                        <tr 
                                        // {...provided.droppableProps}
                                        //  ref={provided.innerRef}
                                         >
                                            <th><i className="ri-list-ordered-2"></i>  Sr. No</th>
                                            {columns.filter(col => col.visible).map((column, index) => (
                                                <Draggable key={column.id} draggableId={column.id} index={index}>
                                                    {(provided) => (
                                                        <th
                                                            // ref={provided.innerRef}
                                                            // {...provided.draggableProps}
                                                            // {...provided.dragHandleProps}


                                                        >
                                                            {column.id === 'inputValue' && (<i className="ri-keyboard-line"></i>)}
                                                            {column.id === 'taskID' && (<i className="ri-settings-2-fill"></i>)}
                                                            {column.id === 'doerRole' && (<i className="ri-user-settings-fill"></i>)}
                                                            {column.id === 'empName' && (<i className="ri-user-fill"></i>)}
                                                            {column.id === 'identifier' && (<i className="ri-price-tag-3-fill"></i>)}
                                                            {column.id === 'input' && (<i className="ri-pencil-fill"></i>)}
                                                            {column.id === 'empID' && (<i className="ri-user-follow-fill"></i>)}



                                                            &nbsp; {column.label}
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
                                {/* {filteredDoers.slice(0, 10).map((doer, index) => (
                                    <tr key={doer.id}>
                                        <td>{(currentPage - 1) * 10 + index + 1}</td>
                                        <td>{doer.taskID}</td>
                                        <td>{doer.identifier}</td>
                                        <td>{doer.input}</td>
                                        <td>{doer.inputValue}</td>
                                        <td>{doer.doerRole}</td>
                                        <td>{doer.empID}</td>
                                        <td>{doer.empName}</td>
                                        <td>
                                            <Button variant="warning" onClick={() => handleEdit(index)}>
                                                Edit
                                            </Button>
                                        </td>
                                    </tr>
                                ))} */}

                                {filteredDoers.length > 0 ? (
                                    filteredDoers.slice(0, 10).map((item, index) => (
                                        <tr key={item.id}>
                                            {/* Render the index for pagination (currentPage - 1) * pageSize + index + 1 */}
                                            <td>{(currentPage - 1) * 10 + index + 1}</td>
                                            {/* Dynamically render visible columns */}
                                            {columns.filter(col => col.visible).map((col) => (
                                                <td key={col.id}

                                                    className={
                                                        // Add class based on column id
                                                        col.id === 'identifier' ? 'fw-bold fs-14 text-dark' :
                                                            col.id === 'empID' ? 'fw-bold fs-13 text-dark' :
                                                                // Add class based on value (e.g., expired tasks)
                                                                (col.id === 'taskID' && item[col.id] === 'ACC.02.T1') ? 'task1' :
                                                                    (col.id === 'taskID' && item[col.id] === 'ACC.02.T2') ? 'task2' :
                                                                        ''
                                                    }
                                                >


                                                    <div>
                                                        {/* {col.id === 'inputValue' && (<i className="ri-edit-2-fill edit-icon"></i>)} */}

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
                                            {/* Action Button */}
                                            <td>
                                                <Button variant="primary" onClick={() => handleEdit(index)}>
                                                    <i className="ri-edit-2-fill"></i>
                                                </Button>
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
    );
};

export default DoerMaster;
