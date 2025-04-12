import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table } from 'react-bootstrap'; // Assuming DynamicForm is in the same directory
import config from '@/config';


interface TestData {
  id: number;
  projectId: string;
  projectName: string;
  moduleId: string;
  moduleName: string;
  processId: string;
  processName: string;
  roleId: string;
  roleName: string;
  doerId: string;
  doerName: string;
  task_Json: string;
  task_Number: string;
  task_Status: string;
  condition_Json: string;
  createdBy: string;
  createdDate: string;
  updatedBy: string;
  updatedDate: string | null;
}

const GetTestData: React.FC = () => {
  const [data, setData] = useState<TestData[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${config.API_URL_ACCOUNT}/AccountModule/GetTestData`);
        if (response.data.isSuccess) {
          setData(response.data.getTestData);
          console.log(response.data.getTestData)
        } else {
          setError('Failed to fetch data');
        }
      } catch (err) {
        setError('An error occurred while fetching data');
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{overflowY: 'auto'}}>
      <h1 className="text-2xl font-bold mb-4">Test Data</h1>
      {error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <Table className='bg-white' striped bordered hover>
          <thead>
            <tr>
              <th >ID</th>
              <th >Project Name</th>
              <th >Module Name</th>
              <th >Process Name</th>
			  <th >Role Name</th>
              <th >Doer Name</th>
			  <th >Task Json</th>
              <th >Task Number</th>
              <th >Task Status</th>
			  <th >Condtional Json</th>
              <th >Created By</th>
              <th >Created Date</th>
			  <th >Created Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td >{item.id}</td>
                <td >{item.projectName}</td>
                <td >{item.moduleName}</td>
                <td >{item.processName}</td>
				<td >{item.roleName}</td>
                <td >{item.doerName}</td>
				<td >{item.task_Json}</td> 
                <td >{item.task_Number}</td>
                <td >{item.task_Status}</td>
				<td >{item.condition_Json}</td>
                <td >{item.createdBy}</td>
                <td >{item.createdDate}</td>
                <td >{new Date(item.createdDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
</div>
  );
};

export default GetTestData;
