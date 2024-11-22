import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';  // Import Table from react-bootstrap
import config from '@/config';

// Define types based on your API response
interface ProjectAssign {
  id: number;
  projectId: string | null;
  projectName: string | null;
  moduleID: string;
  moduleName: string;
  processID: string;
  doerName:string;
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${config.API_URL_ACCOUNT}/AccountModule/GetTaskAssignListWithDoer?Flag=1`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result: ApiResponse = await response.json();
        console.log('API Response:', result); // Log the result for debugging
        if (result.isSuccess) {
          setData(result.taskAssignListWithDoers || []);
        } else {
          setError(result.message || 'An error occurred');
        }
      } catch (error) {
        console.error('Fetch error:', error); // Log the error for debugging
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Additional check to ensure data is being received correctly
  console.log('Data:', data);

  return (
    <div>
      <h1>Process Applied Task </h1>
      <Table className='bg-white' striped bordered hover>
        <thead>
          <tr>
            <th>Module ID</th>
            <th>Module Name</th>
            <th>Process ID</th>
            <th>Process Name</th>
            <th>Role  </th>
            <th>Doer Name</th>
            <th>Task Number</th>
            <th>Status</th>

          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item.id}>
                <td>{item.moduleID}</td>
                <td>{item.moduleName}</td>
                <td>{item.processID}</td>
                <td>{item.processName}</td>
                <td>{item.roleName}</td>
                <td>{item.doerName}</td>
                <td>{item.task_Number}</td>
                <td>
                  <Button>
                    Pending
                  </Button>
                </td>
                
                {/* <td>
                  <pre>{item.task_Json}</pre>
                </td> */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9}>No data available</td>
            </tr>
          )}
        </tbody>
      </Table>
      
    </div>
  );
  
  
};

export default App;
