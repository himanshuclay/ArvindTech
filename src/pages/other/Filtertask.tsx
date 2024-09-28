import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button, Offcanvas } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';

import axios from 'axios';

interface Module {
  id: number;
  moduleID: string;
  moduleName: string;
}

interface Process {
  processID: string;
  processName: string;
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
  taskAssignListWithDoers?: ProjectAssign[];
  message?: string;
}

const App: React.FC = () => {
  const [data, setData] = useState<ProjectAssign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [selectedProcess, setSelectedProcess] = useState<string>('');
  const [show, setShow] = useState(false);
  const [doers, setDoers] = useState();



  // Fetch the initial data with Flag=1 on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);


      // console.log(data)
      try {
        const response = await fetch('https://arvindo-api.clay.in/api/AccountModule/GetTaskAssignListWithDoer?Flag=1');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result: ApiResponse = await response.json();
        if (result.isSuccess) {
          setData(result.taskAssignListWithDoers || []);
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
        const response = await fetch('https://arvindo-api2.clay.in/api/CommonDropdown/GetModuleList');
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


  
    const fetchDoer = async () => {

      try {
        const response = await fetch('https://arvindo-api2.clay.in/api/CommonDropdown/GetEmployeeListWithId');
        const result = await response.json();
        if (result.isSuccess) {
          setDoers(result.employeeLists);
          console.log(result.employeeLists)
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setError('Failed to fetch modules');
      }
    };


console.log(doers)

  // Fetch processes whenever selectedModule changes
  useEffect(() => {
    const fetchProcesses = async () => {

      if (selectedModule) {
        try {
          const response = await fetch(`https://arvindo-api2.clay.in/api/CommonDropdown/GetProcessNameByModuleName?ModuleName=${selectedModule}`);
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
        let apiUrl = 'https://arvindo-api.clay.in/api/AccountModule/GetTaskAssignListWithDoer?Flag=1';
        const selectedModuleObj = modules.find((module) => module.moduleName === selectedModule);


        if (selectedModuleObj && selectedProcess) {
          apiUrl = `https://arvindo-api.clay.in/api/AccountModule/GetTaskAssignListWithDoer?Flag=2&ModuleId=${selectedModuleObj.moduleID}&ProcessId=${selectedProcess}`;
        }

        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result: ApiResponse = await response.json();
        if (result.isSuccess) {
          setData(result.taskAssignListWithDoers || []);
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

  const handleShow = () => setShow(true);

  const handleEdit = (index: number) => {
    handleShow();
    fetchDoer();

  };

  const handleClose = () => {
    setShow(false);

  };

  // const handleChange = (e) => {
  //   // const { name, value } = e.target;
  //   // setBank({
  //   //     ...bank,
  //   //     [name]: value
  //   // });
  // };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        if (!null) {
            await axios.post(`https://arvindo-api.clay.in/api/ProcessInitiation/UpdateTaskDoer` );
        } 
        handleClose();
    } catch (error) {
        console.error('Error submitting bank:', error);
    }
  };

  return (
    <div>

      <Offcanvas show={show} onHide={handleClose}  placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Employee List</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formProcessName">
              <Form.Label>Select Employee</Form.Label>
              <Form.Control as="select"  onChange={(e) => handleChange(e.target.value)} >
                <option value="">Select Employee</option>
                {/* {doers.map((doer) => (
                  <option key={doer.empId} value={doer.empId}>
                    {doer.employeeName}
                  </option>
                ))} */}
              </Form.Control>
            </Form.Group>



            <Button variant="primary" type="submit" className='mt-2  m-end d-flex'>
              Submit
            </Button>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>


      <div className="d-flex p-2 bg-white mt-2 mb-2 rounded shadow"><h5 className='mb-0'>Active Task</h5></div>

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

        </Row>
      </Form>

      <Table className="bg-white" striped bordered hover>
        <thead>
          <tr>
            <th>Sr.No.</th>
            <th>Module Name</th>
            <th>Process Name</th>
            <th>Role</th>
            <th>Doer Name</th>
            <th>Task Number</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.moduleName}</td>
                <td>{item.processName}</td>
                <td>{item.roleName}</td>
                <td>{item.doerName}</td>
                <td>{item.task_Number}</td>
                <td>
                  <Button onClick={() => handleEdit(index)}>Edit</Button>
                </td>
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