import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, Offcanvas, Toast, Container, Row, Col, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { parse, addDays, format, isValid } from 'date-fns';

interface ProjectAssignListWithDoer {
  id: number;
  projectId: string;
  projectName: string;
  moduleID: string;
  moduleName: string;
  processID: string;
  processName: string;
  roleId: string;
  doerId: string;
  doerName: string;
  task_Json: string;
  task_Number: string;
  task_Status: 1;
  isExpired: 0;
  taskCommonId: number;
  expiredSummary: null;
  createdBy: string;
  status: 'Pending' | 'Done';
  isCompleted: 'Pending';
  condition_Json: string;
  createdDate: string;
  completedDate: string;
  taskTime: string;
  taskType: string;
  roleName: string;
}

interface ApiResponse {
  isSuccess: boolean;
  message: string;
  getFilterTasks: ProjectAssignListWithDoer[];
}




const ProjectAssignTable: React.FC = () => {
  const [data, setData] = useState<ProjectAssignListWithDoer[]>([]);
  const [preData, setPreData] = useState<ProjectAssignListWithDoer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [show, setShow] = useState(false);
  const [taskCommonId, setTaskCommonId] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [taskName, setTaskName] = useState<string | undefined>(undefined);






  const location = useLocation();
  const navigate = useNavigate();






  useEffect(() => {
    if (location.state && location.state.showToast) {
      setShowToast(true);
      setTaskName(location.state.taskName);
    }
    navigate(location.pathname, { replace: true });
  }, [location.state]);






  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const role = localStorage.getItem('EmpId') || '';
        const response = await axios.get<ApiResponse>(
          `https://arvindo-api.clay.in/api/ProcessInitiation/GetFilterTask?Flag=2&DoerId=${role}`
        );

        if (response.data && response.data.isSuccess) {
          setData(response.data.getFilterTasks || []);
        } else {
          console.error('API Response Error:', response.data?.message || 'Unknown error');
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Axios Error:', error.message);
        } else {
          console.error('Unexpected Error:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  console.log(taskCommonId)
  // Fetch task data when taskCommonId is set
  useEffect(() => {
    if (taskCommonId !== null) {
      fetchPreData(taskCommonId);
    }
  }, [taskCommonId]);

  const fetchPreData = async (taskCommonId: number) => {
    try {
      const flag = 5;
      const response = await axios.get<ApiResponse>(
        `https://arvindo-api.clay.in/api/ProcessInitiation/GetFilterTask?TaskCommonId=${taskCommonId}&Flag=${flag}`
      );
  
      if (response.data && response.data.isSuccess) {
        const fetchedData = response.data.getFilterTasks || [];
        console.log(fetchedData);
        
        // Filter out tasks with isCompleted as "Pending"
        const filteredTasks = fetchedData
          .filter((task) => task.isCompleted !== "Pending")  // Filter step
          .map((task: ProjectAssignListWithDoer) => {
            const parsedTaskJson = JSON.parse(task.task_Json);
            const optionsMap = parsedTaskJson.inputs.reduce((map: Record<string, string>, input: any) => {
              if (input.options) {
                input.options.forEach((option: any) => {
                  map[option.id] = option.label;
                });
              }
              return map;
            }, {});
  
            const filteredInputs = parsedTaskJson.inputs
              .filter((input: any) => !['99', '100', '102', '103'].includes(input.inputId)) // Exclude unwanted inputIds
              .map((input: any) => ({
                label: input.label,
                value: optionsMap[input.value] || input.value // Replace value with label if it exists in optionsMap
              }));
  
            return {
              taskNumber: task.task_Number,
              inputs: filteredInputs
            };
          });
  
        setPreData(filteredTasks);
      } else {
        console.error('API Response Error:', response.data?.message || 'Unknown error');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios Error:', error.message);
      } else {
        console.error('Unexpected Error:', error);
      }
    } finally {
      setLoading(false);
    }
  };
  

  const handleEdit = (id: number) => {
    // const taskCommonId = id
    const taskCommonId =2

    setTaskCommonId(taskCommonId); 
    
  // Set the taskCommonId to fetch the specific task data
    setShow(true); // Show the Offcanvas
  };

  const handleClose = () => setShow(false);

  if (loading) {
    return <div className="loader-fixed">Loading...</div>;
  }

  const formatAndUpdateDate = (createdDate: string, taskTime: string) => {
    // Parse the created date with the correct format 'MM/dd/yyyy HH:mm:ss'
    const createdDateObj = parse(createdDate, 'MM/dd/yyyy HH:mm:ss', new Date());

    // Check if the createdDateObj is valid
    if (!isValid(createdDateObj)) {
        console.error('Invalid createdDate:', createdDate);
        return 'Invalid created date';
    }

    const taskTimeValue = parseInt(taskTime, 10); // Assuming taskTime is in hours

    // Check if taskTime is a valid number
    if (isNaN(taskTimeValue)) {
        console.error('Invalid taskTime:', taskTime);
        return 'Invalid task time';
    }

    // Calculate the number of days to add
    const daysToAdd = Math.floor(taskTimeValue / 24);

    // Add days to the created date
    const updatedDate = addDays(createdDateObj, daysToAdd);

    // Format the updated date to the desired format 'MM/dd/yyyy HH:mm:ss'
    return format(updatedDate, 'MM/dd/yyyy HH:mm:ss');
};

// Example Usage
// const updatedDate = formatAndUpdateDate('21-09-2023 15:30:00', '48');
// console.log(updatedDate);



  const SuccessToast: React.FC<{ show: boolean; taskName?: string; onClose: () => void }> = ({ show, onClose }) => {
    return (
      <Toast
        show={show}
        onClose={onClose}
        delay={5000}
        autohide
        style={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 105000,
        }}
      >
        <Toast.Header className="col-12 d-flex justify-content-between">
          <i className="ri-thumb-up-fill text-primary fs-2"></i>
          <div onClick={onClose}></div>
        </Toast.Header>
        <Toast.Body className="bg-primary text-white fs-4 rounded">
          {`Task "${taskName}" has been saved successfully!`}
        </Toast.Body>
      </Toast>
    );
  };


  return (
    <>
      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton className='p-0 mb-2'>
          <Offcanvas.Title>Task Details</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {preData.map((task, index) => (
            <div key={index}>
              <h5 className="mt-2">
                Updated data from <span className="text-primary">{task.taskNumber}</span>
              </h5>
              <div>
                {task.inputs.map((input, i) => (
                  <div key={i}>
                    <strong>{input.label}:</strong> <span className="text-primary">{input.value}</span>
                  </div>
                ))}
              </div>
              <hr />
            </div>
          ))}
        </Offcanvas.Body>
      </Offcanvas>

      <div>
        <div className="d-flex p-2 bg-white mt-2 mb-2 rounded shadow">
          <h5 className="mb-0">Completed Tasks</h5>
        </div>
        {data.length === 0 ? (
          <Container className="mt-5">
            <Row className="justify-content-center">
              <Col xs={12} md={8} lg={6}>
                <Alert variant="info" className="text-center">
                  <h4>No Task Found</h4>
                  <p>You currently don't have Completed tasks</p>
                </Alert>
              </Col>
            </Row>
          </Container>
        ) : (
          <Table className="bg-white" striped bordered hover>
            <thead>
              <tr>
                <th>Sr.no</th>
                <th>Module</th>
                <th>Process</th>
                <th>Project</th>
                <th>Assigned Role</th>
                <th>Task Id</th>
                <th>Task Type</th>
                <th>Planned Date</th>
                <th>Initiation Date</th>
                <th>Completed Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr
                  key={item.id}
                  style={{
                    backgroundColor: item.status === 'Done' ? 'lightgreen' : 'white',
                  }}
                >
                  <td>{index + 1}</td>
                  <td>{item.moduleName}</td>
                  <td>{item.processName}</td>
                  <td>{item.projectName}</td>
                  <td>{item.roleName}</td>
                  <td>{item.task_Number}</td>
                  <td>{item.taskType}</td>
                  <td>{formatAndUpdateDate(item.createdDate, item.taskTime)}</td>
                  <td>{item.createdDate}</td>
                  <td>{item.completedDate}</td>
                  <td>
                    <Button onClick={() => handleEdit(item.id)}>Show</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>

      <SuccessToast show={showToast} taskName={taskName} onClose={() => setShowToast(false)} />
    </>
  );
};

export default ProjectAssignTable;
