import { Form, Button, Modal, Row, Col, ButtonGroup, Container, Alert } from "react-bootstrap";
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
    type: string;
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
    type: string;

}
interface SubProject {
    id: string;
    subProjectID: string;
    name: string;
}

const ProcessCanvas: React.FC<ProcessCanvasProps> = ({ show, setShow, manageId }) => {
    const role = localStorage.getItem('role');
    const [loading, setLoading] = useState(false);

    const [assignedProject, setAssignedProject] = useState<Project[]>([]);
    const [projectList, setProjectList] = useState<Project[]>([]);
    const [subProjectList, setSubProjectList] = useState<SubProject[]>([]);
    const [moduleName, setModuleName] = useState<string>("");
    const [processId, setProcessId] = useState<string>("");
    const [empName, setEmpName] = useState<string | null>('');
    const [activeButton, setActiveButton] = useState('project');
    const [assignProject, setAssignProject] = useState<AssignProjecttoProcess>({
        id: 0,
        moduleName: '',
        processId: '',
        type: '',
        projects: [],
        createdBy: '',
        updatedBy: empName || '',
    });

    const [process, setProcess] = useState({
        source: '',

    });



    useEffect(() => {
        toast.dismiss();

        const storedEmpName = localStorage.getItem('EmpName');
        const storedEmpID = localStorage.getItem('EmpId');
        if (storedEmpName || storedEmpID) {
            setEmpName(`${storedEmpName} - ${storedEmpID}`);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (manageId) {
                await fetchModuleById(manageId);
                await fetchProcessByid(manageId);
            }
        };
        fetchData();


    }, [manageId, show]);

    useEffect(() => {
        if (show && moduleName && processId) {
            const fetchProject = async () => {
                await fetchGetProject(moduleName, processId);
            };
            fetchProject();
        }
    }, [show, moduleName, processId]);



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
        fetchData('CommonDropdown/GetProjectList', setProjectList, 'projectListResponses');
        fetchData('CommonDropdown/GetSubProjectList', setSubProjectList, 'subProjectLists');
    }, []);




    const fetchProcessByid = async (id: string) => {
        setLoading(true);
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/ProcessMaster/GetProcess`, {
                params: { id: id }
            });
            if (response.data.isSuccess) {
                const fetchedModule = response.data.processMasterList[0];
                setProcess(fetchedModule);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching module:', error);
        }
        finally {
            setLoading(false);
        }
    };

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
                setActiveButton(fetchedProject[0]?.type);
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


    const handleButtonClick = (buttonName: string) => {
        setActiveButton(buttonName);

        setAssignProject({
            id: 0,
            moduleName: assignProject.moduleName,
            processId: assignProject.processId,
            type: activeButton,
            projects: [],
            createdBy: '',
            updatedBy: empName || '',
        });
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const payload = {
            ...assignProject,
            type: activeButton,
        };
        console.log("Initial Payload:", payload);

        try {
            const apiUrl = `${config.API_URL_APPLICATION}/AssignProjecttoProcess/AssignProjecttoProcess`;
            const response = await axios.post(apiUrl, payload);

            if (response.data.isSuccess) {
                toast.dismiss();
                toast.success("Project assigned successfully!");

                try {
                    const fetchUrl = `${config.API_URL_APPLICATION}/AssignProjecttoProcess/GetProjectAssignListbyIDs`;
                    const fetchResponse = await axios.get(fetchUrl, {
                        params: { ModuleName: moduleName, ProcessId: processId },
                    });

                    if (fetchResponse.data.isSuccess) {
                        const fetchedProject = fetchResponse.data.getProjectAssignListbyIDs;
                        setAssignedProject(fetchedProject);
                        const updatedFilteredData = fetchedProject.map((item: Project) => item.projectName);

                        const updatedPayloadUpdate = {
                            ...process,
                            updatedBy: empName || '',
                            source: JSON.stringify(updatedFilteredData),
                        };

                        try {
                            await axios.post(
                                `${config.API_URL_APPLICATION}/ProcessMaster/UpdateProcess`,
                                updatedPayloadUpdate
                            );
                            await setAssignProject(prev => ({ ...prev, projects: [] }));
                        } catch (updateError: any) {
                            toast.error("Failed to update process master.");
                            console.error("Error updating process master:", updateError);
                        }
                    } else {
                        console.error(fetchResponse.data.message || "Failed to fetch assigned projects.");
                    }
                } catch (fetchError) {
                    toast.error("Error fetching updated project data.");
                    console.error("Error fetching project:", fetchError);
                }
            } else {
                toast.dismiss();
                toast.error(response.data.message || "Failed to assign project.");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "An error occurred.");
            console.error("Error in handleSubmit:", error);
        }
    };

    const handleDelete = async (id: any) => {
        try {
            const apiUrl = `${config.API_URL_APPLICATION}/AssignProjecttoProcess/DeleteProjectAssigntoProcess`;
            const deleteResponse = await axios.delete(apiUrl, {
                params: { id, ModuleName: moduleName, ProcessID: processId },
            });

            if (deleteResponse.data.isSuccess) {
                toast.dismiss();
                toast.warn("Project deleted successfully!");
                try {
                    const fetchUrl = `${config.API_URL_APPLICATION}/AssignProjecttoProcess/GetProjectAssignListbyIDs`;
                    const fetchResponse = await axios.get(fetchUrl, {
                        params: { ModuleName: moduleName, ProcessId: processId },
                    });

                    if (fetchResponse.data.isSuccess) {
                        const fetchedProjects = fetchResponse.data.getProjectAssignListbyIDs;
                        setAssignedProject(fetchedProjects);
                        const updatedFilteredData = fetchedProjects.map((item: Project) => item.projectName);

                        const updatedPayload = {
                            ...process,
                            updatedBy: empName || '',
                            source: JSON.stringify(updatedFilteredData),
                        };

                        try {
                            await axios.post(
                                `${config.API_URL_APPLICATION}/ProcessMaster/UpdateProcess`,
                                updatedPayload
                            );
                            setAssignProject((prev) => ({ ...prev, projects: [] }));
                        } catch (updateError: any) {
                            toast.error("Failed to update the process master.");
                            console.error("Error updating process master:", updateError);
                        }
                    } else {
                        const fetchMessage = fetchResponse.data.message || "Failed to fetch updated assigned projects.";
                        toast.error(fetchMessage);
                        console.error(fetchMessage);
                    }
                } catch (fetchError: any) {
                    const fetchErrorMessage =
                        fetchError.response?.data?.message || "Error fetching updated project data.";
                    toast.error(fetchErrorMessage);
                    console.error("Error fetching updated project:", fetchError);
                }
            } else {
                const deleteMessage = deleteResponse.data.message || "Failed to delete the project assignment.";
                toast.error(deleteMessage);
                console.error(deleteMessage);
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "An error occurred.";
            toast.error(errorMessage);
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
                    {loading ? (
                        <div className='d-flex justify-content-center align-items-center my-3 flex-column'>
                            <div className="loader"></div>
                            <div className='mt-2'>Please Wait!</div>
                        </div>
                    ) : (
                        <div className="">
                            {assignedProject && assignedProject.length > 0 ? (
                                assignedProject.map((project, index) => (
                                    <div key={project.projectID} className="my-1 p-1 bg-light rounded-1 border d-flex justify-content-between">
                                        <> {index + 1}. {project.projectName} - {project.projectID}</>
                                        <div className="cursor-pointer">
                                            {role === 'Admin' && (
                                                <i className="ri-close-line fs-14 " onClick={() => handleDelete(project.id)}></i>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <Container className="mt-4">
                                    <Row className="justify-content-center">
                                        <Col xs={12} md={8} lg={6}>
                                            <Alert variant="info" className="text-center">
                                                <h4> No  Process Assigned to  Project</h4>
                                                {/* <p>You don't have Completed tasks</p> */}
                                            </Alert>
                                        </Col>
                                    </Row>
                                </Container>
                            )}
                        </div>

                    )}




                    {role === 'Admin' && (
                        <>
                            <Col lg={6} className='align-items-end d-flex justify-content-end' >
                                <ButtonGroup aria-label="Basic example" className='w-100'>
                                    <Button type="button"
                                        variant={activeButton === 'project' ? 'primary' : 'outline-primary'}
                                        onClick={() => handleButtonClick('project')}
                                        disabled={assignedProject[0]?.type === 'subProject'}
                                    >
                                        Project
                                    </Button>
                                    <Button type="button"
                                        variant={activeButton === 'subProject' ? 'primary' : 'outline-primary'}
                                        onClick={() => handleButtonClick('subProject')}
                                        disabled={assignedProject[0]?.type === 'project'}
                                    >Sub Project</Button>
                                </ButtonGroup>
                            </Col>




                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    {activeButton === 'project' && (
                                        <Col lg={12}>
                                            <Form.Group controlId="moduleName" className="mb-3 mt-2">
                                                <Form.Label>Project Name</Form.Label>
                                                <Select
                                                    name="projectName"
                                                    value={projectList.filter(project =>
                                                        assignProject.projects.some(ap => ap.projectID === project.id)
                                                    )}
                                                    onChange={(selectedOption) => {
                                                        const selectedProjects = (selectedOption || []) as Project[];
                                                        const updatedProjects = selectedProjects.map(project => ({
                                                            projectID: project.id,
                                                            projectName: project.projectName,
                                                        }));
                                                        setAssignProject({
                                                            ...assignProject,
                                                            projects: updatedProjects,
                                                        });
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
                                    )}
                                    {activeButton === 'subProject' && (
                                        <Col lg={12}>
                                            <Form.Group controlId="subProjectName" className="mb-3 mt-2">
                                                <Form.Label>Sub Project Name</Form.Label>
                                                <Select
                                                    name="subProjectName"
                                                    value={subProjectList.filter(subProject =>
                                                        assignProject.projects.some(ap => ap.projectID === subProject.id)
                                                    )}

                                                    onChange={(selectedOptions) => {
                                                        const selectedSubProjects = (selectedOptions || []) as SubProject[];
                                                        const newSubProjectArray = selectedSubProjects.map(subProject => ({
                                                            projectID: subProject.id,
                                                            projectName: subProject.name,
                                                        }));

                                                        setAssignProject({
                                                            ...assignProject,
                                                            projects: newSubProjectArray,
                                                        });
                                                    }}
                                                    getOptionLabel={(subProject) => subProject.name}
                                                    getOptionValue={(subProject) => subProject.id}
                                                    options={subProjectList}
                                                    isSearchable={true}
                                                    isMulti={true}
                                                    placeholder="Select Sub Projects"
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    )}
                                </Row>


                                <Button variant="primary" type="submit" className="mt-2">
                                    Submit
                                </Button>
                            </Form>
                        </>
                    )}

                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ProcessCanvas;
