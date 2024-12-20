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

}
interface SubProject {
    id: string;
    subProjectID: string;
    name: string;
}

const ProcessCanvas: React.FC<ProcessCanvasProps> = ({ show, setShow, manageId }) => {
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
        const storedEmpName = localStorage.getItem('EmpName');
        if (storedEmpName) {
            setEmpName(storedEmpName);
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

        const filteredData = assignedProject.map(item => ({
            projectID: item.projectID,
            projectName: item.projectName
        }));
        const payload = {
            ...assignProject,
            type: activeButton,

        };

        const payloadUpdate = {
            ...process,
            source: JSON.stringify(filteredData)
        };
        try {
            const apiUrl = `${config.API_URL_APPLICATION}/AssignProjecttoProcess/AssignProjecttoProcess`;
            const response = await axios.post(apiUrl, payload);

            if (response.data.isSuccess) {
                setAssignProject(prev => ({ ...prev, projects: [] }));
                await fetchGetProject(moduleName, processId);
                await axios.post(
                    `${config.API_URL_APPLICATION}/ProcessMaster/UpdateProcess`,
                    payloadUpdate
                );
                toast.dismiss()
                toast.success("Project assigned successfully!");

            } else {
                toast.dismiss()
                toast.error(response.data.message || "Failed to process request");
            }
        } catch (error: any) {
            toast.error(error)
        }


    };




    const handleDelete = async (id: any) => {

        const filteredData = assignedProject.map(item => ({
            projectID: item.projectID,
            projectName: item.projectName
        }));
        const payloadUpdate = {
            source: JSON.stringify(filteredData)
        };
        try {
            await axios.delete(
                `${config.API_URL_APPLICATION}/AssignProjecttoProcess/DeleteProjectAssigntoProcess`,
                { params: { id, ModuleName: moduleName, ProcessID: processId }, }
            );
            await fetchGetProject(moduleName, processId);
            await axios.post(
                `${config.API_URL_APPLICATION}/ProcessMaster/UpdateProcess`,
                payloadUpdate
            );

            toast.dismiss();
            toast.warn("Project deleted successfully!");
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "An error occurred.";
            toast.error(errorMessage);
            console.error("Error deleting project assignment:", error);
        }
    };



    console.log(assignedProject)

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
                                onClick={() => handleButtonClick('subProject')}
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
