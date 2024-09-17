import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table} from 'react-bootstrap'; // Assuming DynamicForm is in the same directory

interface GetFilterTask {
  id: number;
  projectId: string;
  projectName: string;
  moduleID: string;
  moduleName: string;
  processID: string;
  processName: string;
  roleName: string;
  doerName: string;
  task_Json: string;
  task_Number: string;
  isCompleted: string;
  createdDate: string;
  taskType:string;
  taskTime:string;

}

interface ApiResponse {
  isSuccess: boolean;
  message: string;
  getFilterTasks: GetFilterTask[];
}

const TaskPlanned: React.FC = () => {
  const [data, setData] = useState<GetFilterTask[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  useEffect(() => {
    const role = localStorage.getItem('EmpId') || '';
    const fetchData = async () => {
      try {
        const response = await axios.get<ApiResponse>(
          `https://arvindo-api.clay.in/api/ProcessInitiation/GetFilterTask?Flag=4&DoerId=${role}`
        );

        if (response.data && response.data.isSuccess) {
          setData(response.data.getFilterTasks || []);
          console.log(data)
        }

        else {
          console.error('API Response Error:', response.data?.message || 'Unknown error');
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Axios Error Response:', error.response?.data || 'No response data');
          console.error('Axios Error Message:', error.message);
        } else {
          console.error('Unexpected Error:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const toggleExpandRow = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };
  if (loading) {
    return <div className="loader-fixed">
      <div className="loader"></div>
      <div className="mt-2">Please Wait!</div>
    </div>;
  }
  return (
    <div>
      <div className="d-flex p-2 bg-white mt-2 mb-2 rounded shadow"><h5 className='mb-0'> Task Planned</h5></div>
      {data.length === 0 ? (
        <p>No data available.</p>
      ) : (
        <Table className='bg-white' striped bordered hover>
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Module </th>
              <th>Process </th>
              <th>Project </th>
              <th>Assigned Role</th>
              <th>Task Id</th>
              <th>Task Type</th>
              <th>Task Time</th>
              <th>Initation Date</th>
             <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <React.Fragment key={item.id}>
                <tr>
                  <td>{index+1}</td>
                  <td>{item.moduleName}</td>
                  {/* <td>{item.processID}</td> */}
                  <td>{item.processName}</td>
                  <td>{item.projectName}</td>
                  <td>{item.roleName}</td>

                  <td>{item.task_Number}</td>
                  <td>{item.taskType}</td>
                  <td>{item.taskTime}</td>
                  <td>{item.createdDate}</td>
                  <td>
                    <Button onClick={() => toggleExpandRow(item.id)}>
                      {expandedRow === item.id ? 'Hide' : 'Show'}
                    </Button>
                  </td>
                </tr>
               
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default TaskPlanned;