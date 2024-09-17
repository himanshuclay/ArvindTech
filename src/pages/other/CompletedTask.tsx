import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, Offcanvas } from 'react-bootstrap'; 

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
          console.log(data)
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
        `https://localhost:44382/api/ProcessInitiation/GetFilterTask?TaskCommonId=${taskCommonId}&Flag=${flag}`
      );

      if (response.data && response.data.isSuccess) {
        const fetchedData = response.data.getFilterTasks || [];
        const filteredTasks = fetchedData.map((task: ProjectAssignListWithDoer) => {
          const parsedTaskJson = JSON.parse(task.task_Json);
          const filteredInputs = parsedTaskJson.inputs.filter(
            (input: any) => !['99', '100', '102', '103'].includes(input.inputId)
          );
          return {
            taskNumber: task.task_Number,
            inputs: filteredInputs.map((input: any) => ({
              label: input.label,
              value: input.value
            }))
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

  return (
    <>
      <Offcanvas show={show} onHide={handleClose}>
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
          <h5 className="mb-0">Completed Tasks</h5>
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
                  <td>
                    <Button onClick={() => handleEdit(item.id)}>Show</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </>
  );
};

export default ProjectAssignTable;
