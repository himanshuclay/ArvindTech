import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap'; // Optional: Assuming you use react-bootstrap for styling

const AccountProcessTaskTable: React.FC = () => {
  const [data, setData] = useState<any[]>([]); // State to store fetched data

  // Fetch data when the component mounts
  useEffect(() => {
    fetch('https://localhost:7235/api/AccountModule/GetAccountProcessTaskByIds?ModuleId=ACC&ProcessId=ACC.03')
      .then((response) => response.json())
      .then((data) => {
        if (data.isSuccess) {
          setData(data.getAccountProcessTaskByIds);
        } else {
          console.error('Failed to fetch data:', data.message);
        }
      })
      .catch((error) => console.error('Error:', error));
  }, []);

  return (
    <div>
      <h2>Account Process Task Details</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Module ID</th>
            <th>Module Name</th>
            <th>Process ID</th>
            <th>Process Name</th>
            <th>Start Date</th>
            <th>Task Number</th>
            <th>Task JSON</th>
          </tr>
        </thead>
        <tbody>
          {data.map((task) => (
            <tr key={task.id}>
              <td>{task.id}</td>
              <td>{task.moduleID}</td>
              <td>{task.moduleName}</td>
              <td>{task.processID}</td>
              <td>{task.processName}</td>
              <td>{new Date(task.startDate).toLocaleString()}</td>
              <td>{task.task_Number}</td>
              <td>
                <pre>{JSON.stringify(JSON.parse(task.task_Json), null, 2)}</pre>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AccountProcessTaskTable;
