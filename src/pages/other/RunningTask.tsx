import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, Offcanvas, Toast } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';

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




const RunningTask: React.FC = () => {
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
        // const role = localStorage.getItem('EmpId') || '';
        const response = await axios.get<ApiResponse>(
          `https://arvindo-api.clay.in/api/ProcessInitiation/GetFilterTask?Flag=6`
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
      const flag = 7;
      const response = await axios.get<ApiResponse>(
        `https://arvindo-api.clay.in/api/ProcessInitiation/GetFilterTask?TaskCommonId=${taskCommonId}&Flag=${flag}`
      );

      if (response.data && response.data.isSuccess) {
        const fetchedData = response.data.getFilterTasks || [];
        const filteredTasks = fetchedData.map((task: ProjectAssignListWithDoer) => {
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
    const taskCommonId = id
    setTaskCommonId(taskCommonId); // Set the taskCommonId to fetch the specific task data
    setShow(true); // Show the Offcanvas
  };

  const handleClose = () => setShow(false);

  if (loading) {
    return <div className="loader-fixed">Loading...</div>;
  }



  const SuccessToast: React.FC<{ show: boolean; taskName?: string; onClose: () => void }> = ({ show, onClose }) => {
    return (
      <Toast
        show={show}
        onClose={onClose}
        delay={9000}
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
        <Offcanvas.Header closeButton>
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
          <h5 className="mb-0">Running Tasks</h5>
        </div>
        {data.length === 0 ? (
          <p>No data available.</p>
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
                  <td>{item.taskTime}</td>
                  <td>{item.createdDate}</td>
                  <td className={item.completedDate === '' ? 'text-warning fw-bolder' : ''}>
                    {item.completedDate !== '' ? (
                      item.completedDate
                    ) : (
                      <span>
                        In Progress <i className="ri-loader-2-fill fs-5"></i>
                      </span>
                    )}
                  </td>
                  <td>{item.completedDate !== '' ? (<Button onClick={() => handleEdit(item.id)}>Show</Button>) : (<Button disabled>Show</Button>)}</td>
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

export default RunningTask;
