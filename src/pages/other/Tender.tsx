import React, { useState, useEffect, ChangeEvent } from 'react';
import { Button, Form, Offcanvas, Table, InputGroup, FormControl, Pagination } from 'react-bootstrap';

interface TenderMasterModule {
    tenderId: string;
    tenderStatus: string;
    typetendering: string;
    workName: string;
    deptEmployee: string;
    entryEmplyee: string;
    contracttype: string;
    estimatedCost: number;
    complitionPeriod: number;

}

const TenderModule: React.FC = () => {
    const [tenderModule, setTenderModule] = useState<TenderMasterModule>({
        tenderId: '',
        tenderStatus: '',
        typetendering: '',
        workName: '',
        deptEmployee: '',
        entryEmplyee:'',
        contracttype: '',
        estimatedCost: 0 ,
        complitionPeriod:0 ,
    });

    const [tenderModules, setTenderModules] = useState<TenderMasterModule[]>([]);
    const [show, setShow] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        const storedModules = localStorage.getItem('tenderModules');
        if (storedModules) {
            setTenderModules(JSON.parse(storedModules));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('tenderModules', JSON.stringify(tenderModules));
    }, [tenderModules]);

    const handleShow = () => setShow(true);

    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement | HTMLSelectElement;
        if (type === 'checkbox') {
            setTenderModule({
                ...tenderModule,
                [name]: checked
            });
        } else {
            setTenderModule({
                ...tenderModule,
                [name]: value
            });
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (editingIndex !== null) {
            const updatedModules = [...tenderModules];
            updatedModules[editingIndex] = tenderModule;
            setTenderModules(updatedModules);
        } else {
            setTenderModules([...tenderModules, tenderModule]);
        }
        setTenderModule({
            tenderId: '',
            tenderStatus: '',
            typetendering: '',
            workName: '',
            deptEmployee: '',
            entryEmplyee:'',
            contracttype: '',
            estimatedCost: 0 ,
            complitionPeriod:0 ,
        });
        handleClose();
    };

    const handleEdit = (index: number) => {
        setEditingIndex(index);
        setTenderModule(tenderModules[index]);
        handleShow();
    };

    const handleClose = () => {
        setShow(false);
        setEditingIndex(null);
        setTenderModule({
            tenderId: '',
        tenderStatus: '',
        typetendering: '',
        workName: '',
        deptEmployee: '',
        entryEmplyee:'',
        contracttype: '',
        estimatedCost: 0 ,
        complitionPeriod:0 ,
        });
    };

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    const handleRowsPerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset to first page on rows per page change
    };

    const filteredModules = tenderModules.filter(tenderModule =>
        tenderModule.tenderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenderModule.tenderStatus.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenderModule.typetendering.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenderModule.workName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenderModule.deptEmployee.toLowerCase().includes(searchQuery.toLowerCase())||
        tenderModule.entryEmplyee.toLowerCase().includes(searchQuery.toLowerCase())||
        tenderModule.contracttype.toLowerCase().includes(searchQuery.toLowerCase())||
        tenderModule.estimatedCost.toString().includes(searchQuery.toLowerCase())||
        tenderModule.complitionPeriod.toString().includes(searchQuery.toLowerCase())
    );

    const indexOfLastModule = currentPage * rowsPerPage;
    const indexOfFirstModule = indexOfLastModule - rowsPerPage;
    const currentModules = filteredModules.slice(indexOfFirstModule, indexOfLastModule);

    const totalPages = Math.ceil(filteredModules.length / rowsPerPage);

    const convertToCSV = (data: TenderMasterModule[]) => {
        const csvRows = [
            ['Tender ID', 'Tender Status', 'Type of Tendering', 'Work Name', 'Dept/Principal Employer', 'Entry Employee', 'Contract Type','Estimated Cost','Complition Period'],
            ...data.map(mod => [
                mod.tenderId,
                mod.tenderStatus,
                mod.typetendering,
                mod.workName ,
                mod.deptEmployee,
                mod.entryEmplyee,
                mod.contracttype,
                mod.estimatedCost,
                mod.complitionPeriod,
            ])
        ];

        return csvRows.map(row => row.join(',')).join('\n');
    };

    const downloadCSV = () => {
        const csvData = convertToCSV(tenderModules);
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tenderModules.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="container">
            <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center">
                <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>Tender Modules List</span></span>
                <div className="d-flex">
                    <div className="app-search d-none d-lg-block me-4">
                        <form>
                            <div className="input-group">
                                <input
                                    type="search"
                                    className="form-control"
                                    placeholder="Search tender..."
                                    value={searchQuery}
                                    onChange={handleSearch}
                                />
                                <span className="ri-search-line search-icon text-muted" />
                            </div>
                        </form>
                    </div>
                    <Button variant="primary" onClick={handleShow} className="me-2">
                        Add Tender
                    </Button>
                    <Button variant="secondary" onClick={downloadCSV}>
                        Download CSV
                    </Button>
                </div>
            </div>

            <Offcanvas show={show} onHide={handleClose} >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Module Form</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="tenderId" className="mb-3">
                            <Form.Label>Tender ID:</Form.Label>
                            <Form.Control
                                type="text"
                                name="tenderId"
                                value={tenderModule.tenderId}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="tenderStatus" className="mb-3">
                            <Form.Label>Tender Status:</Form.Label>
                            <Form.Control
                                type="text"
                                name="tenderStatus"
                                value={tenderModule.tenderStatus}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="typetendering" className="mb-3">
                            <Form.Label>Type of Tendering:</Form.Label>
                            <Form.Control
                                type="text"
                                name="typetendering"
                                value={tenderModule.typetendering}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="workName" className="mb-3">
                            <Form.Label>Work Name:</Form.Label>
                            <Form.Control
                                type="text"
                                name="workName"
                                value={tenderModule.workName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                     
                        <Form.Group controlId="deptEmployee" className="mb-3">
                            <Form.Label>Dept/Principal Employer:</Form.Label>
                            <Form.Control
                                type="text"
                                name="deptEmployee"
                                value={tenderModule.deptEmployee}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                     
                       
                        <Form.Group controlId="entryEmplyee" className="mb-3">
                            <Form.Label>Entry Employee:</Form.Label>
                            <Form.Control
                                type="text"
                                name="entryEmplyee"
                                value={tenderModule.entryEmplyee}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="contracttype" className="mb-3">
                            <Form.Label>Contract Tpye:</Form.Label>
                            <Form.Control
                                type="text"
                                name="contracttype"
                                value={tenderModule.contracttype}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="estimatedCost" className="mb-3">
                            <Form.Label>Estimated Cost:</Form.Label>
                            <Form.Control
                                type="text"
                                name="estimatedCost"
                                value={tenderModule.estimatedCost}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="complitionPeriod" className="mb-3">
                            <Form.Label>Completion Period:</Form.Label>
                            <Form.Control
                                type="text"
                                name="complitionPeriod"
                                value={tenderModule.complitionPeriod}
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
            <div className="d-flex justify-content-between align-items-center my-2">
                <div>
                    <Form.Select value={rowsPerPage} onChange={handleRowsPerPageChange}>
                        <option value={5}>5 rows</option>
                        <option value={10}>10 rows</option>
                        <option value={20}>20 rows</option>
                    </Form.Select>
                </div>
                <Pagination>
                    <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                    <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
                    <Pagination.Item active>{currentPage}</Pagination.Item>
                    <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
                    <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
                </Pagination>
            </div>
            <Table className='bg-white' striped bordered hover>
                <thead>
                    <tr>
                        <th>Tender ID</th>
                        <th>Tender Status</th>
                        <th>Type of Tendering</th>
                        <th>Work Name</th>
                        <th>Dept/Principal Employer</th>
                        <th>Entry Employee</th>
                        <th>Contract Type</th>
                        <th>Estimated Cost</th>
                        <th>Complition Period</th>
                        <th>Details</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentModules.map((mod, index) => (
                        <tr key={index}>
                            <td>{mod.tenderId}</td>
                            <td>{mod.tenderStatus}</td>
                            <td>{mod.typetendering}</td>
                            <td>{mod.workName ? 'Yes' : 'No'}</td>
                            <td>{mod.deptEmployee}</td>
                            <td>{mod.entryEmplyee}</td>
                            <td>{mod.contracttype}</td>
                            <td>{mod.estimatedCost}</td>
                            <td>{mod.complitionPeriod}</td>
                            <td>
                                <i className='btn ri-edit-line' onClick={() => handleEdit(index + indexOfFirstModule)}></i>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default TenderModule;
