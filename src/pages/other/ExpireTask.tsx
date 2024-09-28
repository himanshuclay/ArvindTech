import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table ,Container, Row, Col, Alert } from 'react-bootstrap'; // Assuming DynamicForm is in the same directory

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
  completedDate:string;
   expiredSummary:string;

}

interface ApiResponse {
  isSuccess: boolean;
  message: string;
  getFilterTasks: GetFilterTask[];
}

const ExpireTask: React.FC = () => {
  const [data, setData] = useState<GetFilterTask[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  useEffect(() => {
    const role = localStorage.getItem('EmpId') || '';

    const fetchData = async () => {
      try {
        const response = await axios.get<ApiResponse>(
          `https://arvindo-api.clay.in/api/ProcessInitiation/GetFilterTask?Flag=3&DoerId=${role}`
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
      <div className="d-flex p-2 bg-white mt-2 mb-2 rounded shadow"><h5 className='mb-0'>Expired Task</h5></div>
      {data.length === 0 ? (
         <Container className="mt-5">
         <Row className="justify-content-center">
           <Col xs={12} md={8} lg={6}>
             <Alert variant="info" className="text-center">
               <h4>No Task Found</h4>
               <p>You currently don't have any tasks assigned.</p>
             </Alert>
           </Col>
         </Row>
       </Container>
      ) : (
        <Table className='bg-white' striped bordered hover>
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Module </th>
              <th>Process </th>
              <th>Role </th>
              <th>Task Id</th>
              <th>Expired</th>
              <th>Initation Date</th>
              <th>Expired Date</th>
              <th>Expired summary</th>

              <th>Actions</th>
              <th>Conditional Json</th>

            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <React.Fragment key={item.id}>
                <tr>
                  <td>{index+1}</td>
                  <td>{item.moduleName}</td>
                  <td>{item.processName}</td>
                  <td>{item.roleName}</td>
                  <td>{item.task_Number}</td>
                  <td>Expired</td>

                  <td>{item.createdDate}</td>
                  <td>{item.completedDate}</td>
                  <td>{item.expiredSummary}</td>

                  <td>
                    <Button onClick={() => toggleExpandRow(item.id)}>
                      {expandedRow === item.id ? 'Hide' : 'Show'}
                    </Button>
                  </td>
                  <td>
                    <Button onClick={() => toggleExpandRow(item.id)}>
                      {expandedRow === item.id ? 'Hide' : 'Show'}
                    </Button>
                  </td>
                </tr>
                <tr>
                  {/* <td colSpan={10}>
                    <Collapse in={expandedRow === item.id}>
                      <div>
                        <DynamicForm
                          formData={JSON.parse(item.task_Json)}
                          taskNumber={item.task_Number}
                          doer={null} 
                          onDoerChange={handleDoerChange}
                        />
                      </div>
                    </Collapse>
                  </td> */}
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default ExpireTask;