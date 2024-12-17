import { Form, Button, Modal, Row, Col, ButtonGroup } from "react-bootstrap";
import axios from "axios";
import config from "@/config";
import { useEffect, useState } from "react";
import Select from 'react-select';
import { toast } from "react-toastify";


interface ProcessCanvasProps {
    show: boolean;
    setShow: (show: boolean) => void;
    manageId: any; // Ensure this is defined as a string
}

interface AssignProjecttoProcess {
    id: number;
    moduleName: string;
    processId: string;
    projects: Array<{
        projectID: string;
        projectName: string;
    }>;
    createdBy: string;
    updatedBy: string;
}
interface Project {
    id: string;
    projectID: string;
    projectName: string;
}

const ProcessCanvas: React.FC<ProcessCanvasProps> = ({ show, setShow, manageId }) => {
    const [assignedProject, setAssignedProject] = useState<Project[]>([]);
    const [projectList, setProjectList] = useState<Project[]>([]);
    const [moduleName, setModuleName] = useState<string>("");
    const [processId, setProcessId] = useState<string>("");
    const [empName, setEmpName] = useState<string | null>('');
    const [activeButton, setActiveButton] = useState('project');
    const [assignProject, setAssignProject] = useState<AssignProjecttoProcess>({
        id: 0,
        moduleName: '',
        processId: '',
        projects: [],
        createdBy: '',
        updatedBy: empName || '',
    });


    useEffect(() => {
        const storedEmpName = localStorage.getItem('EmpName');
        if (storedEmpName) {
            setEmpName(storedEmpName);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (manageId) {
                await fetchModuleById(manageId);
            }
        };
        fetchData();
    }, [manageId]);

    useEffect(() => {
        if (show && moduleName && processId) {
            const fetchProject = async () => {
                await fetchGetProject(moduleName, processId);
            };
            fetchProject();
        }
    }, [show, moduleName, processId]);

    useEffect(() => {
        const fetchProjectList = async () => {
            try {
                const response = await axios.get(`${config.API_URL_APPLICATION}/CommonDropdown/GetProjectList`);
                if (response.data.isSuccess) {
                    const projects = response.data.projectListResponses;
                    setProjectList(projects);
                } else {
                    console.error(response.data.message);
                }
            } catch (error) {
                console.error('Error fetching project list:', error);
            }
        };
        fetchProjectList();
    }, []);

    const fetchModuleById = async (id: string) => {
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/ProcessMaster/GetProcess`, {
                params: { id: id }
            });
            if (response.data.isSuccess) {
                const fetchedModule = response.data.processMasterList[0];
                setProcessId(fetchedModule.processID);
                setModuleName(fetchedModule.moduleName);
                setAssignProject(prev => ({
                    ...prev,
                    moduleName: fetchedModule.moduleName,
                    processId: fetchedModule.processID
                }));
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching module:', error);
        }
    };

    const fetchGetProject = async (moduleName: string, processId: string) => {
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/AssignProjecttoProcess/GetProjectAssignListbyIDs`, {
                params: { ModuleName: moduleName, ProcessId: processId }
            });
            if (response.data.isSuccess) {
                const fetchedProject = response.data.getProjectAssignListbyIDs;
                setAssignedProject(fetchedProject);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching project:', error);
        }
    };

    const handleClose = () => {
        setShow(false);
    };


    // Function to handle button click
    const handleButtonClick = (buttonName: string) => {
        setActiveButton(buttonName);
        console.log(buttonName)
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await axios.post(`${config.API_URL_APPLICATION}/AssignProjecttoProcess/AssignProjecttoProcess`, assignProject);
            // Reset the projects in state
            setAssignProject(prev => ({
                ...prev,
                projects: []
            }));
            fetchGetProject(moduleName, processId);
            toast.success("Project assigned successfully!");
        } catch (error) {
            console.error('Error submitting project assignment:', error);
        }
    };


    const handleDelete = async (id: any) => {
        try {
            await axios.delete(
                `${config.API_URL_APPLICATION}/AssignProjecttoProcess/DeleteProjectAssigntoProcess`,
                {
                    params: {
                        id: id,
                        ModuleName: moduleName,
                        ProcessID: processId,
                    },
                }
            );
            fetchGetProject(moduleName, processId);
            toast.warn("Project deleted successfully!")
        } catch (error: any) {
            toast.error(error)
            console.error("Error deleting project assignment:", error);
        }
    };


    return (
        <div>
            <Modal className="p-2" show={show} placement="end" onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title className="text-dark">Assign Project to Process</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="">
                        {assignedProject.map((project, index) => (
                            <div key={project.projectID} className="my-1 p-1 bg-light rounded-1 border d-flex justify-content-between">
                                <> {index + 1}. {project.projectName} - {project.projectID}</>
                                <div className="cursor-pointer">
                                    <i className="ri-close-line fs-14 " onClick={() => handleDelete(project.id)}></i>
                                </div>
                            </div>
                        ))}
                    </div>


                    <Col lg={6} className='align-items-end d-flex justify-content-end' >
                        <ButtonGroup aria-label="Basic example" className='w-100'>
                            <Button type="button"
                                variant={activeButton === 'project' ? 'primary' : 'outline-primary'}
                                onClick={() => handleButtonClick('project')}
                            >
                                Project
                            </Button>
                            <Button type="button"
                                variant={activeButton === 'subProject' ? 'primary' : 'outline-primary'}
                                onClick={() => handleButtonClick('subProject')} >Sub Project</Button>
                        </ButtonGroup>
                    </Col>


                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col lg={activeButton === 'subProject' ? 6 : 12}>
                                <Form.Group controlId="moduleName" className="mb-3 mt-2">
                                    <Form.Label>Project Name</Form.Label>
                                    <Select
                                        name="projectName"
                                        value={projectList.filter(project => assignProject.projects.some(ap => ap.projectID === project.id))}
                                        onChange={(selectedOptions) => {
                                            const selectedProjects = selectedOptions || [];
                                            const projects = selectedProjects.map(option => ({
                                                projectID: option.id,
                                                projectName: option.projectName
                                            }));
                                            setAssignProject(prev => ({
                                                ...prev,
                                                projects
                                            }));
                                        }}
                                        getOptionLabel={(project) => project.projectName}
                                        getOptionValue={(project) => project.id}
                                        options={projectList}
                                        isSearchable={true}
                                        isMulti={true}
                                        placeholder="Select Projects"
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            {activeButton === 'subProject' ?
                                <Col lg={6}>
                                    <Form.Group controlId="projectName" className="mb-3 mt-2">
                                        <Form.Label>Sub Project Name</Form.Label>
                                        <Select
                                            name="projectName"
                                            value={projectList.filter(project => assignProject.projects.some(ap => ap.projectID === project.id))}
                                            onChange={(selectedOptions) => {
                                                const selectedProjects = selectedOptions || [];
                                                const projects = selectedProjects.map(option => ({
                                                    projectID: option.id,
                                                    projectName: option.projectName
                                                }));
                                                setAssignProject(prev => ({
                                                    ...prev,
                                                    projects
                                                }));
                                            }}
                                            getOptionLabel={(project) => project.projectName}
                                            getOptionValue={(project) => project.id}
                                            options={projectList}
                                            isSearchable={true}
                                            isMulti={true}
                                            placeholder="Select Sub Projects"
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                : null
                            }
                        </Row>

                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ProcessCanvas;
