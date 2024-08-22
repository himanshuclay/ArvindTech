import React, { useState, useEffect, ChangeEvent } from 'react';
import { Button, Form, Offcanvas, Table, Pagination } from 'react-bootstrap';
import axios from 'axios';

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
    // createdDate: string;
    createdBy: string;
    updatedBy: string; // Added updatedBy field
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
        createdBy: '',
        updatedBy: ''
    });

    const [projects, setProjects] = useState<Project[]>([]);
    const [show, setShow] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        fetchProjects();
    }, [currentPage]);


    const fetchProjects = async () => {
        setLoading(true);
        try {
            // Construct the URL with URLSearchParams
            const params = new URLSearchParams({ PageIndex: currentPage.toString() });
            const url = `https://localhost:44306/api/ProjectMaster/GetProject?${params.toString()}`;

            console.log('Fetching URL:', url); // Log the URL to verify

            const response = await axios.get(url, {
                headers: {
                    'accept': '*/*'
                }
            });

            console.log('API Response:', response.data); // Log the response data

            if (response && response.status === 200) {
                const responseData = Array.isArray(response.data.projectMasterList)
                    ? response.data.projectMasterList
                    : [response.data.projectMasterList];
                setProjects(responseData);
            } else {
                console.error('Failed to fetch projects: Invalid response status');
            }
        } catch (error) {
            console.error('An error occurred while fetching the projects:', error);
            if (error.response) {
                console.error('Error response data:', error.response.data);
                console.error('Error response status:', error.response.status);
                console.error('Error response headers:', error.response.headers);
            }
        }
        finally {
            setLoading(false); // End loading
        }
    };







    const handleShow = () => setShow(true);

    const handleChange = (e: ChangeEvent<any>) => {
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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const payload = {
            id: project.id,
            projectName: project.projectName,
            projectID: project.projectID,
            stateId: project.stateId,
            projectType: project.projectType,
            managementContract: project.managementContract,
            projectIncharge: project.projectIncharge,
            projectCoordinator: project.projectCoordinator,
            completionStatus: project.completionStatus,
            nameOfWork: project.nameOfWork,
            createdBy: project.createdBy,
            updatedBy: project.createdBy // Assuming updatedBy is the same as createdBy for now
        };

        console.log('Payload:', payload); // Log the payload

        try {
            const response = await axios.post('https://localhost:44306/api/ProjectMaster/InsertProject', payload, {
                headers: {
                    'accept': '*/*',
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200 || response.status === 201) {
                const newProject = response.data;

                if (editingIndex !== null) {
                    const updatedProjects = [...projects];
                    updatedProjects[editingIndex] = newProject;
                    setProjects(updatedProjects);
                } else {
                    setProjects([...projects, { ...newProject, id: projects.length + 1 }]);
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
                    createdBy: '',
                    updatedBy: ''
                });
                handleClose();
            } else {
                console.error('Failed to submit project');
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('An error occurred while submitting the project:', error.response.data);
            } else {
                console.error('An error occurred while submitting the project:', error);
            }
        }
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
            createdBy: '',
            updatedBy: ''
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
        (project.projectName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.projectID || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.stateId !== null && project.stateId !== undefined && project.stateId.toString().includes(searchQuery)) ||
        (project.projectType !== null && project.projectType !== undefined && project.projectType.toString().includes(searchQuery)) ||
        (project.managementContract !== null && project.managementContract !== undefined && project.managementContract.toString().includes(searchQuery)) ||
        (project.projectIncharge !== null && project.projectIncharge !== undefined && project.projectIncharge.toString().includes(searchQuery)) ||
        (project.projectCoordinator !== null && project.projectCoordinator !== undefined && project.projectCoordinator.toString().includes(searchQuery)) ||
        (project.completionStatus !== null && project.completionStatus !== undefined && project.completionStatus.toString().includes(searchQuery)) ||
        (project.nameOfWork || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        // (project.createdDate || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.createdBy || '').toLowerCase().includes(searchQuery.toLowerCase())
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
                // proj.createdDate,
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
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={handleSearch}
                                />
                                <span className="ri-search-line"></span>
                            </div>
                        </form>
                    </div>
                    <Button variant="primary" onClick={handleShow}><i className="ri-add-line"></i> Add Project</Button>
                    <Button variant="secondary" className="ms-2" onClick={downloadCSV}><i className="ri-download-line"></i> Export CSV</Button>
                </div>
            </div>
            {loading ? (
                <div className='loader-container'>
                    <div className="loader"></div>
                    <div className='mt-2'>Please Wait!</div>
                </div>
            ) : (
                <Table striped bordered hover responsive className="mb-0">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Project Name</th>
                            <th>Project ID</th>
                            <th>State ID</th>
                            <th>Project Type</th>
                            <th>Management Contract</th>
                            <th>Project Incharge</th>
                            <th>Project Coordinator</th>
                            <th>Completion Status</th>
                            <th>Name of Work</th>
                            {/* <th>Created Date</th> */}
                            <th>Created By</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>

                        {currentProjects.map((proj, index) => (
                            <tr key={index}>
                                <td>{index + 1 + (currentPage - 1) * rowsPerPage}</td>
                                <td>{proj.projectName}</td>
                                <td>{proj.projectID}</td>
                                <td>{proj.stateId}</td>
                                <td>{proj.projectType}</td>
                                <td>{proj.managementContract}</td>
                                <td>{proj.projectIncharge}</td>
                                <td>{proj.projectCoordinator}</td>
                                <td>{proj.completionStatus}</td>
                                <td>{proj.nameOfWork}</td>
                                {/* <td>{proj.createdDate}</td> */}
                                <td>{proj.createdBy}</td>
                                <td>
                                    <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(index)}>
                                        <i className="ri-edit-line"></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )
            }

            <div className="d-flex justify-content-between align-items-center mt-3">
                {/* <div>
                    <span>Rows per page: </span>
                    <select value={rowsPerPage} onChange={handleRowsPerPageChange} className="form-select form-select-sm">
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                    </select>
                </div> */}
                <Pagination>
                    <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                    <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
                    {[...Array(totalPages)].map((_, i) => (
                        <Pagination.Item key={i} active={i + 1 === currentPage} onClick={() => setCurrentPage(i + 1)}>
                            {i + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
                    <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
                </Pagination>
            </div>

            <Offcanvas show={show} onHide={handleClose} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>{editingIndex !== null ? 'Edit Project' : 'Add Project'}</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formProjectName">
                            <Form.Label>Project Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="projectName"
                                value={project.projectName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formProjectID" className="mt-3">
                            <Form.Label>Project ID</Form.Label>
                            <Form.Control
                                type="text"
                                name="projectID"
                                value={project.projectID}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formStateId" className="mt-3">
                            <Form.Label>State ID</Form.Label>
                            <Form.Control
                                type="number"
                                name="stateId"
                                value={project.stateId}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formProjectType" className="mt-3">
                            <Form.Label>Project Type</Form.Label>
                            <Form.Control
                                type="number"
                                name="projectType"
                                value={project.projectType}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formManagementContract" className="mt-3">
                            <Form.Label>Management Contract</Form.Label>
                            <Form.Control
                                type="number"
                                name="managementContract"
                                value={project.managementContract}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formProjectIncharge" className="mt-3">
                            <Form.Label>Project Incharge</Form.Label>
                            <Form.Control
                                type="number"
                                name="projectIncharge"
                                value={project.projectIncharge}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formProjectCoordinator" className="mt-3">
                            <Form.Label>Project Coordinator</Form.Label>
                            <Form.Control
                                type="number"
                                name="projectCoordinator"
                                value={project.projectCoordinator}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formCompletionStatus" className="mt-3">
                            <Form.Label>Completion Status</Form.Label>
                            <Form.Control
                                type="number"
                                name="completionStatus"
                                value={project.completionStatus}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formNameOfWork" className="mt-3">
                            <Form.Label>Name of Work</Form.Label>
                            <Form.Control
                                type="text"
                                name="nameOfWork"
                                value={project.nameOfWork}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formCreatedBy" className="mt-3">
                            <Form.Label>Created By</Form.Label>
                            <Form.Control
                                type="text"
                                name="createdBy"
                                value={project.createdBy}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formUpdatedBy" className="mt-3">
                            <Form.Label>Updated By</Form.Label>
                            <Form.Control
                                type="text"
                                name="updatedBy"
                                value={project.updatedBy}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="mt-3">
                            {editingIndex !== null ? 'Update Project' : 'Add Project'}
                        </Button>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
};

export default ProjectsPage;
