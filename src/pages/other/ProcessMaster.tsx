import React, { useState, useEffect, ChangeEvent } from 'react';
import { Button, Form, Offcanvas, Table, Pagination } from 'react-bootstrap';
import config from '../../config';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import IconWithLetter from '../ui/IconWithLetter';



interface Process {
    id: number;
    moduleName: string;
    processID: string;
    processDisplayName: string;
    misExempt: string;
    dashboardTab: string;
    processInput: string;
    processOutput: string;
    processFlowchart: string;
    processOwnerID: string;
    processOwnerName: string;
    createdBy: string;
    updatedBy: string;
}
interface Column {
    id: string;
    label: string;
    visible: boolean;
}

const ProcessMaster: React.FC = () => {
    const [process, setProcess] = useState<Process>({
        id: 0,
        moduleName: '',
        processID: '',
        processDisplayName: '',
        misExempt: '',
        dashboardTab: '',
        processInput: '',
        processOutput: '',
        processFlowchart: '',
        processOwnerID: '',
        processOwnerName: '',
        createdBy: '',
        updatedBy: ''
    });

    const [processes, setProcesses] = useState<Process[]>([]);
    const [show, setShow] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState<boolean>(false);

    // =======================================================================

    // both are required to make dragable column of table 
    const [columns, setColumns] = useState<Column[]>([
        { id: 'moduleName', label: 'Module Name', visible: true },
        { id: 'processID', label: 'Process ID', visible: true },
        { id: 'processDisplayName', label: 'Process Display Name', visible: true },
        { id: 'misExempt', label: 'Mis Exempt', visible: true },
        { id: 'processInput', label: 'Process Input', visible: true },
        { id: 'processOutput', label: 'Process Output', visible: true },
        { id: 'processFlowchart', label: 'Process Flowchart', visible: true },
        { id: 'processOwnerID', label: 'Process Owner ID', visible: true },
        { id: 'processOwnerName', label: 'Process Owner Name', visible: true },

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
        fetchProcesses();
    }, [currentPage]);

    const fetchProcesses = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/ProcessMaster/GetProcess`, {
                params: {
                    PageIndex: currentPage
                }
            });
            if (response.data.isSuccess) {
                setProcesses(response.data.processMasterList);
                setTotalPages(Math.ceil(response.data.totalCount / 10));
                console.log(response.data.processMasterList);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching processes:', error);
        }
        finally {
            setLoading(false); // End loading
        }
    };

    const handleShow = () => setShow(true);

    const handleChange = (e: ChangeEvent<any>) => {
        const { name, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked; // Cast to HTMLInputElement to access `checked`
            setProcess({
                ...process,
                [name]: checked
            });
        } else {
            const value = (e.target as HTMLSelectElement | HTMLInputElement).value; // Cast to HTMLSelectElement or HTMLInputElement to access `value`
            setProcess({
                ...process,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (editingIndex !== null) {
                await axios.post(`${config.API_URL_APPLICATION}/ProcessMaster/UpdateProcess`, process);
            } else {
                await axios.post(`${config.API_URL_APPLICATION}/ProcessMaster/InsertProcess`, process);
            }
            fetchProcesses();
            handleClose();
        } catch (error) {
            console.error('Error submitting process:', error);
        }
    };

    const handleEdit = (index: number) => {
        setEditingIndex(index);
        setProcess(processes[index]);
        handleShow();
    };

    const handleClose = () => {
        setShow(false);
        setEditingIndex(null);
        setProcess({
            id: 0,
            moduleName: '',
            processID: '',
            processDisplayName: '',
            misExempt: '',
            dashboardTab: '',
            processInput: '',
            processOutput: '',
            processFlowchart: '',
            processOwnerID: '',
            processOwnerName: '',
            createdBy: '',
            updatedBy: ''
        });
    };

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page on search
    };


    const filteredProcesses = processes.filter(proc =>
        proc.moduleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proc.processID.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proc.processDisplayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proc.processInput.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proc.processOutput.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proc.processFlowchart.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proc.processOwnerID.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proc.processOwnerName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const convertToCSV = (data: Process[]) => {
        const csvRows = [
            ['ID', 'Module Name', 'Process ID', 'Process Display Name', 'MIS Exempt', 'Dashboard Tab', 'Process Input', 'Process Output', 'Process Flowchart', 'Process Owner ID', 'Process Owner Name', 'Created By', 'Updated By'],
            ...data.map(proc => [
                proc.id.toString(),
                proc.moduleName,
                proc.processID,
                proc.processDisplayName,
                proc.misExempt,
                proc.dashboardTab,
                proc.processInput,
                proc.processOutput,
                proc.processFlowchart,
                proc.processOwnerID,
                proc.processOwnerName,
                proc.createdBy,
                proc.updatedBy
            ])
        ];

        return csvRows.map(row => row.join(',')).join('\n');
    };

    const downloadCSV = () => {
        const csvData = convertToCSV(processes);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'Processes.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="container">
            <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center">
                <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>Processes List</span></span>
                <div className="d-flex">
                    <div className="app-search d-none d-lg-block me-4">
                        <form>
                            <div className="input-group">
                                <input
                                    type="search"
                                    className="form-control"
                                    placeholder="Search process..."
                                    value={searchQuery}
                                    onChange={handleSearch}
                                />
                                <span className="ri-search-line search-icon text-muted" />
                            </div>
                        </form>
                    </div>
                    <Button variant="primary" onClick={handleShow} className="me-2">
                        Add Process
                    </Button>
                    <Button variant="primary" onClick={downloadCSV} className="me-2">
                        Download CSV
                    </Button>
                </div>
            </div>

            <Offcanvas show={show} onHide={handleClose} >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Process Form</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="moduleName" className="mb-3">
                            <Form.Label>Module Name:</Form.Label>
                            <Form.Control
                                type="text"
                                name="moduleName"
                                value={process.moduleName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="processID" className="mb-3">
                            <Form.Label>Process ID:</Form.Label>
                            <Form.Control
                                type="text"
                                name="processID"
                                value={process.processID}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="processDisplayName" className="mb-3">
                            <Form.Label>Process Display Name:</Form.Label>
                            <Form.Control
                                type="text"
                                name="processDisplayName"
                                value={process.processDisplayName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="misExempt" className="mb-3">
                            <Form.Label>MIS Exempt:</Form.Label>
                            <Form.Control
                                type="text"
                                name="misExempt"
                                value={process.misExempt}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="dashboardTab" className="mb-3">
                            <Form.Label>Dashboard Tab:</Form.Label>
                            <Form.Control
                                type="text"
                                name="dashboardTab"
                                value={process.dashboardTab}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="processInput" className="mb-3">
                            <Form.Label>Process Input:</Form.Label>
                            <Form.Control
                                type="text"
                                name="processInput"
                                value={process.processInput}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="processOutput" className="mb-3">
                            <Form.Label>Process Output:</Form.Label>
                            <Form.Control
                                type="text"
                                name="processOutput"
                                value={process.processOutput}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="processFlowchart" className="mb-3">
                            <Form.Label>Process Flowchart:</Form.Label>
                            <Form.Control
                                type="text"
                                name="processFlowchart"
                                value={process.processFlowchart}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="processOwnerID" className="mb-3">
                            <Form.Label>Process Owner ID:</Form.Label>
                            <Form.Control
                                type="text"
                                name="processOwnerID"
                                value={process.processOwnerID}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="processOwnerName" className="mb-3">
                            <Form.Label>Process Owner Name:</Form.Label>
                            <Form.Control
                                type="text"
                                name="processOwnerName"
                                value={process.processOwnerName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="createdBy" className="mb-3">
                            <Form.Label>Created By:</Form.Label>
                            <Form.Control
                                type="text"
                                name="createdBy"
                                value={process.createdBy}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="updatedBy" className="mb-3">
                            <Form.Label>Updated By:</Form.Label>
                            <Form.Control
                                type="text"
                                name="updatedBy"
                                value={process.updatedBy}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>

            <div className="overflow-auto">
                {loading ? (
                    <div className='loader-container'>
                        <div className="loader"></div>
                        <div className='mt-2'>Please Wait!</div>
                    </div>
                ) : (

                    // <Table className='bg-white' striped bordered hover>
                    //     <thead>
                    //         <tr className='text-nowrap'>

                    //             <th>Sr.No.</th>
                    //             <th>Module Name</th>
                    //             <th>Process ID</th>
                    //             <th>Process Display Name</th>
                    //             <th>MIS Exempt</th>
                    //             <th>Process Input</th>
                    //             <th>Process Output</th>
                    //             <th>Process Flowchart</th>
                    //             <th>Process Owner ID</th>
                    //             <th>Process Owner Name</th>
                    //             <th>Action</th>
                    //         </tr>
                    //     </thead>
                    //     <tbody>
                    //         {filteredProcesses.map((proc, index) => (
                    //             <tr key={index}>
                    //                 <td>{(currentPage - 1) * 10 + index + 1}</td>
                    //                 <td>{proc.moduleName}</td>
                    //                 <td>{proc.processID}</td>
                    //                 <td>{proc.processDisplayName}</td>
                    //                 <td>{proc.misExempt}</td>
                    //                 <td>{proc.processInput}</td>
                    //                 <td>{proc.processOutput}</td>
                    //                 <td>{proc.processFlowchart}</td>
                    //                 <td>{proc.processOwnerID}</td>
                    //                 <td>{proc.processOwnerName}</td>
                    //                 <td>
                    //                     <i className='btn ri-edit-line' onClick={() => handleEdit(index)}></i>
                    //                     {/* <a href="http://localhost:3000/pages/MyTask"><i className='btn ri-eye-line' title='View Task' ></i></a> */}
                    //                 </td>
                    //             </tr>
                    //         ))}
                    //     </tbody>
                    // </Table>

                    <DragDropContext onDragEnd={handleOnDragEnd}>
                        <Table hover className='bg-white '>
                            <thead>
                                <Droppable droppableId="columns" direction="horizontal">
                                    {(provided) => (
                                        <tr {...provided.droppableProps} ref={provided.innerRef} className='text-nowrap'>
                                            <th><i className="ri-list-ordered-2"></i>  Sr. No</th>
                                            {columns.filter(col => col.visible).map((column, index) => (
                                                <Draggable key={column.id} draggableId={column.id} index={index}>
                                                    {(provided) => (
                                                        <th ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                            {column.id === 'processFlowchart' && (<i className="ri-map-2-line"></i>)}
                                                            {column.id === 'processID' && (<i className="ri-user-settings-fill"></i>)}
                                                            {column.id === 'processOwnerName' && (<i className="ri-user-fill"></i>)}
                                                            {column.id === 'processDisplayName' && (<i className="ri-price-tag-3-fill"></i>)}
                                                            {column.id === 'processOwnerID' && (<i className="ri-user-follow-fill"></i>)}
                                                            {column.id === 'processOutput' && (<i className="ri-arrow-up-circle-line"></i>)}
                                                            {column.id === 'processInput' && (<i className="ri-arrow-down-circle-line"></i>)}
                                                            {column.id === 'misExempt' && (<i className="ri-prohibited-line"></i>)}
                                                            {column.id === 'moduleName' && (<i className="ri-box-3-line"></i>)}

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

                                {filteredProcesses.length > 0 ? (
                                    filteredProcesses.slice(0, 10).map((item, index) => (
                                        <tr key={item.id}>
                                            {/* Render the index for pagination (currentPage - 1) * pageSize + index + 1 */}
                                            <td>{(currentPage - 1) * 10 + index + 1}</td>
                                            {/* Dynamically render visible columns */}
                                            {columns.filter(col => col.visible).map((col) => (
                                                <td key={col.id}
                                                    className={
                                                        // Add class based on column id
                                                        col.id === 'processDisplayName' ? 'fw-bold fs-14 text-dark' :
                                                            col.id === 'processID' ? 'fw-bold fs-13 text-dark text-nowrap task1' :
                                                                col.id === 'processOwnerName' ? 'fw-bold fs-13 text-dark text-nowrap' :
                                                                    col.id === 'processOwnerID' ? 'fw-bold fs-13 text-dark text-nowrap task3' :
                                                                        // Add class based on value (e.g., expired tasks)
                                                                        (col.id === 'misExempt' && item[col.id] === 'NO') ? 'task4' :
                                                                            (col.id === 'moduleName' && item[col.id] === 'Accounts') ? ' task2' :
                                                                                (col.id === 'moduleName' && item[col.id] === 'Business Development') ? ' text-nowrap task1' :
                                                                                    (col.id === 'moduleName' && item[col.id] === 'Human Resources') ? 'text-nowrap task4' :
                                                                                        (col.id === 'moduleName' && item[col.id] === 'Accounts Checklist') ? 'text-nowrap task3' :
                                                                                            ''
                                                    }
                                                >
                                                    <div>
                                                        {/* {col.id === 'inputValue' && (<i className="ri-edit-2-fill edit-icon"></i>)} */}

                                                        {col.id === 'processOwnerName' ? (
                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                <IconWithLetter letter={item.processOwnerName.charAt(0)} />
                                                                {item.processOwnerName}
                                                            </div>
                                                        ) : (<>{item[col.id as keyof Doer]}</>
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
                                    <tr><td colSpan={columns.length + 1}>No data available</td></tr>
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

export default ProcessMaster;

