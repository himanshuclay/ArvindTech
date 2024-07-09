import React, { useState, useEffect, ChangeEvent } from 'react';
import { Button, Form, Offcanvas, Table, Pagination } from 'react-bootstrap';

interface Project {
    id: number;
    projectName: string;
    projectID: string;
    stateId: number;
    projectType: number;
    managementContract: number;
    projectIncharge: number;
    projectCoordinator: number;
    completionStatus: number;
    nameOfWork: string;
    createdDate: string;
    createdBy: string;
}

const ProjectsPage: React.FC = () => {
    const [project, setProject] = useState<Project>({
        id: 0,
        projectName: '',
        projectID: '',
        stateId: 0,
        projectType: 0,
        managementContract: 0,
        projectIncharge: 0,
        projectCoordinator: 0,
        completionStatus: 0,
        nameOfWork: '',
        createdDate: '',
        createdBy: ''
    });

    const [projects, setProjects] = useState<Project[]>([]);
    const [show, setShow] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        const storedProjects = localStorage.getItem('projects');
        if (storedProjects) {
            setProjects(JSON.parse(storedProjects));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('projects', JSON.stringify(projects));
    }, [projects]);

    const handleShow = () => setShow(true);

    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement | HTMLSelectElement;
        if (type === 'checkbox') {
            setProject({
                ...project,
                [name]: checked ? 1 : 0
            });
        } else {
            setProject({
                ...project,
                [name]: value
            });
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (editingIndex !== null) {
            const updatedProjects = [...projects];
            updatedProjects[editingIndex] = project;
            setProjects(updatedProjects);
        } else {
            setProjects([...projects, { ...project, id: projects.length + 1 }]);
        }
        setProject({
            id: 0,
            projectName: '',
            projectID: '',
            stateId: 0,
            projectType: 0,
            managementContract: 0,
            projectIncharge: 0,
            projectCoordinator: 0,
            completionStatus: 0,
            nameOfWork: '',
            createdDate: '',
            createdBy: ''
        });
        handleClose();
    };

    const handleEdit = (index: number) => {
        setEditingIndex(index);
        setProject(projects[index]);
        handleShow();
    };

    const handleClose = () => {
        setShow(false);
        setEditingIndex(null);
        setProject({
            id: 0,
            projectName: '',
            projectID: '',
            stateId: 0,
            projectType: 0,
            managementContract: 0,
            projectIncharge: 0,
            projectCoordinator: 0,
            completionStatus: 0,
            nameOfWork: '',
            createdDate: '',
            createdBy: ''
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

    const filteredProjects = projects.filter(project =>
        project.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.projectID.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.stateId.toString().includes(searchQuery) ||
        project.projectType.toString().includes(searchQuery) ||
        project.managementContract.toString().includes(searchQuery) ||
        project.projectIncharge.toString().includes(searchQuery) ||
        project.projectCoordinator.toString().includes(searchQuery) ||
        project.completionStatus.toString().includes(searchQuery) ||
        project.nameOfWork.toLowerCase().includes(searchQuery) ||
        project.createdDate.toLowerCase().includes(searchQuery) ||
        project.createdBy.toLowerCase().includes(searchQuery)
    );

    const indexOfLastProject = currentPage * rowsPerPage;
    const indexOfFirstProject = indexOfLastProject - rowsPerPage;
    const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

    const totalPages = Math.ceil(filteredProjects.length / rowsPerPage);

    const convertToCSV = (data: Project[]) => {
        const csvRows = [
            ['Project Name', 'Project ID', 'State ID', 'Project Type', 'Management Contract', 'Project Incharge', 'Project Coordinator', 'Completion Status', 'Name of Work', 'Created Date', 'Created By'],
            ...data.map(proj => [
                proj.projectName,
                proj.projectID,
                proj.stateId.toString(),
                proj.projectType.toString(),
                proj.managementContract.toString(),
                proj.projectIncharge.toString(),
                proj.projectCoordinator.toString(),
                proj.completionStatus.toString(),
                proj.nameOfWork,
                proj.createdDate,
                proj.createdBy
            ])
        ];

        return csvRows.map(row => row.join(',')).join('\n');
    };

    const downloadCSV = () => {
        const csvData = convertToCSV(projects);
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'projects.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="container">
            <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center">
                <span><i className="ri-projector-line me-2"></i><span className='fw-bold'>Projects List</span></span>
                <div className="d-flex">
                    <div className="app-search d-none d-lg-block me-4">
                        <form>
                            <div className="input-group">
                                <input
                                    type="search"
                                    className="form-control"
                                    placeholder="Search project..."
                                    value={searchQuery}
                                    onChange={handleSearch}
                                />
                                <span className="ri-search-line search-icon text-muted" />
                            </div>
                        </form>
                    </div>
                    <Button variant="primary" onClick={handleShow} className="me-2">
                        Add Project
                    </Button>
                    <Button variant="secondary" onClick={downloadCSV}>
                        Download CSV
                    </Button>
                </div>
            </div>

            <Offcanvas show={show} onHide={handleClose} >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Project Form</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="projectName" className="mb-3">
                            <Form.Label>Project Name:</Form.Label>
                            <Form.Control
                                type="text"
                                name="projectName"
                                value={project.projectName}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="projectID" className="mb-3">
                            <Form.Label>Project ID:</Form.Label>
                            <Form.Control
                                type="text"
                                name="projectID"
                                value={project.projectID}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="stateId" className="mb-3">
                            <Form.Label>State ID:</Form.Label>
                            <Form.Control
                                type="number"
                                name="stateId"
                                value={project.stateId}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="projectType" className="mb-3">
                            <Form.Label>Project Type:</Form.Label>
                            <Form.Control
                                type="number"
                                name="projectType"
                                value={project.projectType}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="managementContract" className="mb-3">
                            <Form.Label>Management Contract:</Form.Label>
                            <Form.Control
                                type="number"
                                name="managementContract"
                                value={project.managementContract}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="projectIncharge" className="mb-3">
                            <Form.Label>Project Incharge:</Form.Label>
                            <Form.Control
                                type="number"
                                name="projectIncharge"
                                value={project.projectIncharge}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="projectCoordinator" className="mb-3">
                            <Form.Label>Project Coordinator:</Form.Label>
                            <Form.Control
                                type="number"
                                name="projectCoordinator"
                                value={project.projectCoordinator}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="completionStatus" className="mb-3">
                            <Form.Label>Completion Status:</Form.Label>
                            <Form.Control
                                type="number"
                                name="completionStatus"
                                value={project.completionStatus}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="nameOfWork" className="mb-3">
                            <Form.Label>Name of Work:</Form.Label>
                            <Form.Control
                                type="text"
                                name="nameOfWork"
                                value={project.nameOfWork}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="createdDate" className="mb-3">
                            <Form.Label>Created Date:</Form.Label>
                            <Form.Control
                                type="date"
                                name="createdDate"
                                value={project.createdDate}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="createdBy" className="mb-3">
                            <Form.Label>Created By:</Form.Label>
                            <Form.Control
                                type="text"
                                name="createdBy"
                                value={project.createdBy}
                                onChange={handleChange}
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
                        <th>Project Name</th>
                        <th>Project ID</th>
                        <th>State ID</th>
                        <th>Project Type</th>
                        <th>Management Contract</th>
                        <th>Project Incharge</th>
                        <th>Project Coordinator</th>
                        <th>Completion Status</th>
                        <th>Name of Work</th>
                        <th>Created Date</th>
                        <th>Created By</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentProjects.map((proj, index) => (
                        <tr key={index}>
                            <td>{proj.projectName}</td>
                            <td>{proj.projectID}</td>
                            <td>{proj.stateId}</td>
                            <td>{proj.projectType}</td>
                            <td>{proj.managementContract}</td>
                            <td>{proj.projectIncharge}</td>
                            <td>{proj.projectCoordinator}</td>
                            <td>{proj.completionStatus}</td>
                            <td>{proj.nameOfWork}</td>
                            <td>{proj.createdDate}</td>
                            <td>{proj.createdBy}</td>
                            <td>
                                <i className='btn ri-edit-line' onClick={() => handleEdit(index + indexOfFirstProject)}></i>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default ProjectsPage;
