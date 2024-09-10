import React, { useState, useEffect } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';

interface Module {
  id: number;
  moduleID: string;
  moduleName: string;
}

interface Process {
  processID: string;
  processName: string;
}
interface Project {
  id: string;
  projectName: string;
}

interface ProjectAssign {
  id: number;
  projectId: string | null;
  projectName: string | null;
  moduleID: string;
  moduleName: string;
  processID: string;
  doerName: string;
  processName: string;
  task_Number: string;
  roleName: string;
  task_Json?: string; // Optional field
}

interface ApiResponse {
  isSuccess: boolean;
  processAssignListWithProjects?: ProjectAssign[];
  message?: string;
}

const App: React.FC = () => {
  const [data, setData] = useState<ProjectAssign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [selectedProcess, setSelectedProcess] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<string>('');


  // Fetch the initial data with Flag=1 on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);


      // console.log(data)
      try {
        const response = await fetch('https://localhost:44382/api/AccountModule/GetProcesstAssignListWithProject?Flag=1');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result: ApiResponse = await response.json();
        if (result.isSuccess) {
          setData(result.processAssignListWithProjects || []);
        } else {
          setError(result.message || 'An error occurred');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);



  // Fetch modules on component mount
  useEffect(() => {
    const fetchModules = async () => {

      // console.log(modules)
      try {
        const response = await fetch('https://localhost:44307/api/CommonDropdown/GetModuleList');
        const result = await response.json();
        if (result.isSuccess) {
          setModules(result.moduleNameListResponses);
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setError('Failed to fetch modules');
      }
    };

    fetchModules();
  }, []);



  useEffect(() => {
    const fetchProjects = async () => {

      // console.log(modules)
      try {
        const response = await fetch('https://localhost:44307/api/CommonDropdown/GetProjectList');
        const result = await response.json();
        if (result.isSuccess) {
          setProjects(result.projectListResponses);
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setError('Failed to fetch modules');
      }
    };


console.log(selectedProject)
    fetchProjects();
  }, []);

  
  useEffect(() => {
    const fetchProjectsById = async () => {

      // console.log(modules)
      try {
        const response = await fetch(`https://localhost:44382/api/AccountModule/GetProcesstAssignListWithProject?Flag=2&ProjectId=${selectedProject}`);
        const result = await response.json();
        if (result.isSuccess) {
          setData(result.processAssignListWithProjects);
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setError('Failed to fetch modules');
      }
    };
// console.log(projects)
console.log(selectedProject)
fetchProjectsById();
  }, [selectedProject]);

  // Fetch processes whenever selectedModule changes
  useEffect(() => {
    const fetchProcesses = async () => {

      if (selectedModule) {
        try {
          const response = await fetch(`https://localhost:44307/api/CommonDropdown/GetProcessNameByModuleName?ModuleName=${selectedModule}`);
          const result = await response.json();
          if (result.isSuccess) {
            setProcesses(result.processListResponses);
          }
        } catch (error) {
          console.error('Fetch error:', error);
          setError('Failed to fetch processes');
        }
      }
    };

    fetchProcesses();
  }, [selectedModule]);



  useEffect(() => {
    const fetchProcesses = async () => {

      if (selectedModule) {
        try {
          const response = await fetch(`https://localhost:44307/api/CommonDropdown/GetProcessNameByModuleName?ModuleName=${selectedModule}`);
          const result = await response.json();
          if (result.isSuccess) {
            setProcesses(result.processListResponses);
          }
        } catch (error) {
          console.error('Fetch error:', error);
          setError('Failed to fetch processes');
        }
      }
    };

    fetchProcesses();
    
  }, [selectedModule]);



  // Fetch tasks whenever selectedModule or selectedProcess changes
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        let apiUrl = 'https://localhost:44382/api/AccountModule/GetTaskAssignListWithDoer?Flag=1';
        const selectedModuleObj = modules.find((module) => module.moduleName === selectedModule);


        if (selectedModuleObj && selectedProcess) {
          apiUrl = `https://localhost:44382/api/AccountModule/GetProcesstAssignListWithProject?Flag=3&ModuleId=${selectedModuleObj.moduleID}&ProcessId=${selectedProcess}`;
        }

        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result: ApiResponse = await response.json();
        if (result.isSuccess) {
          setData(result.processAssignListWithProjects || []);
        } else {
          setError(result.message || 'An error occurred');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
      console.log(data)
    };

    if (selectedModule && selectedProcess) {
      fetchTasks();
    }
  }, [selectedModule, selectedProcess, modules]);

  if (loading) return <div>
    <div className="loader-fixed">
      <div className="loader"></div>
      <div className="mt-2">Please Wait!</div>
    </div>
  </div>;
  if (error) return <div>Error: {error}</div>;




  // const filteredDoers = data.filter(item =>
  //   item.taskName.toLowerCase().includes(searchQuery.toLowerCase())
  // );


  return (
    <div>
      <div className="d-flex p-2 bg-white mt-2 mb-2 rounded shadow"><h5 className='mb-0'>Active Project</h5></div>

      <Form className='mb-2'>
        <Row>
          <Col>
            <Form.Group controlId="formModuleName">
              <Form.Label>Module Name</Form.Label>
              <Form.Control as="select" value={selectedModule} onChange={(e) => setSelectedModule(e.target.value)}>
                <option value="">Select Module</option>
                {modules.map((module) => (
                  <option key={module.moduleName} value={module.moduleName}>
                    {module.moduleName}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formProcessName">
              <Form.Label>Process Name</Form.Label>
              <Form.Control as="select" value={selectedProcess} onChange={(e) => setSelectedProcess(e.target.value)} disabled={!selectedModule}>
                <option value="">Select Process</option>
                {processes.map((process) => (
                  <option key={process.processID} value={process.processID}>
                    {process.processName}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formProcessName">
              <Form.Label>Project Name</Form.Label>
              <Form.Control as="select" value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
                <option value="">Select Project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.projectName}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
      
        </Row>
      </Form>

      <Table className="bg-white" striped bordered hover>
        <thead>
          <tr>
            <th>Sr. No.</th>
            <th>Project ID</th>
            <th>Project Name</th>
            <th>module ID</th>
            <th>Process ID</th>
            {/* <th>Status</th> */}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.projectId}</td>
                <td>{item.projectName}</td>
                <td>{item.moduleID}</td>
                <td>{item.processID}</td>
                {/* <td>{item.taskStatus}</td>

                {item.taskStatus === 1 ? <i className="ri-checkbox-blank-circle-fill text-success"></i> : <i className="ri-checkbox-blank-circle-fill text-danger"></i>}
                                            &nbsp; {item.taskStatus === 1 ? 'Active' : 'Deactive'} */}
                {/* <td>
                  <Button>Pending</Button>
                </td> */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8}>No data available</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default App;
