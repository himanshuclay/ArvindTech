import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select, { SingleValue } from 'react-select';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import config from '@/config';

interface Input {
  inputId: string;
  value: string;
  type: string;
  label: string;
  placeholder: string;
  options: { id: string; label: string; color: string }[];
  required: boolean;
  conditionalFieldId: string;
}

interface Task {
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
  task_Status: number;
  isExpired: number;
  taskCommonId: number;
  expiredSummary: null | string;
  createdBy: string;
  status: 'Pending' | 'Done';
  isCompleted: 'Pending' | 'Completed';
  condition_Json: string;
  createdDate: string;
  taskTime: string;
  taskType: string;
  roleName: string;
  taskNumber: string;
  inputs: Input[];
  data: string;
  approval_Console: string;
  approvalConsoleInputID: number;
}

type OptionType = { value: string; label: string };

const options: OptionType[] = [
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

const ApprovalPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [approvalStatuses, setApprovalStatuses] = useState<Record<number, OptionType | null>>({});
  const [comments, setComments] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const role = localStorage.getItem('EmpId') || '';
        const response = await axios.get<{ isSuccess: boolean; getFilterTasks: Task[] }>(
          `${config.API_URL_ACCOUNT}/ProcessInitiation/GetFilterTask?Flag=8&DoerId=${role}`
        );

        if (response.data.isSuccess) {
          setTasks(response.data.getFilterTasks);
        } else {
          console.error('Failed to fetch tasks');
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchData();
  }, []);

  const handleSelectChange = (taskId: number, selectedOption: SingleValue<OptionType>) => {
    setApprovalStatuses((prevStatuses) => ({
      ...prevStatuses,
      [taskId]: selectedOption || null,
    }));
  };

  const handleCommentChange = (messId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    setComments((prevComments) => ({
      ...prevComments,
      [messId]: event.target.value,
    }));
  };;

  const handleSubmit = async () => {
    try {
      const requests = tasks.map(async (task) => {
        const isApproved = approvalStatuses[task.id]?.value === 'approved';

        // Parse task_Json to an array of mess details
        let parsedTaskJson;
        try {
          parsedTaskJson = JSON.parse(task.task_Json);
        } catch (error) {
          console.error('Error parsing task_Json:', error);
          return null;
        }

        // Update each mess entry's comment field based on the `comments` state
        const updatedTaskJson = parsedTaskJson.map((mess: { messID: string; comments: string }) => {
          const messComment = comments[mess.messID] || '';
          return { ...mess, comments: messComment };
        });

        // Prepare the payload with the updated task_Json and isCompleted field
        const payload = {
          id: task.id,
          doerID: task.doerId,
          task_Json: JSON.stringify(updatedTaskJson), // Convert updated task_Json back to a string
          isExpired: task.isExpired,
          isCompleted: isApproved ? 'Completed' : 'Pending',
          task_Number: task.task_Number,
          summary: task.expiredSummary || '',
          condition_Json: task.condition_Json,
          taskCommonID: task.taskCommonId,
          taskExpired: task.isExpired,
          updatedBy: task.createdBy,
        };

        // Submit the task with the updated payload
        const response = await axios.post(`${config.API_URL_ACCOUNT}/ProcessInitiation/UpdateDoerTask`, payload);
        return response.data;
      });

      // Await all requests
      const responses = await Promise.all(requests);
      console.log('Tasks submitted successfully:', responses);
    } catch (error) {
      console.error('Error submitting tasks:', error);
    }
  };


  return (
    <Container>
      <h2 className="my-4">Approval Page</h2>
      {tasks.map((task) => (
        <Card key={task.id} className="mb-4">
          <Card.Header as="h5">Task Number: {task.task_Number}</Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <Card.Text>Project Name: {task.projectName}</Card.Text>
                <Card.Text>Process Name: {task.processName}</Card.Text>
                <Card.Text>Status: {task.isCompleted}</Card.Text>
              </Col>
              <Col md={6}>
                {task.approval_Console === 'Select Approval_Console' && (
                  <Form.Group>
                    <Form.Label>Approval Status</Form.Label>
                    <Select
                      options={options}
                      value={approvalStatuses[task.id] || null}
                      onChange={(selectedOption) => handleSelectChange(task.id, selectedOption)}
                      placeholder="Select Approval Status"
                    />
                  </Form.Group>
                )}
              </Col>
            </Row>
            {task.task_Json && (
              <div>
                <h5>Mess Details</h5>
                {(() => {
                  try {
                    const parsedJson = JSON.parse(task.task_Json);

                    if (Array.isArray(parsedJson)) {
                      return parsedJson.map((mess: { messID: string; taskJson: { inputs: Input[] } }) => (
                        <Card key={mess.messID} className="mt-3">
                          <Card.Body>
                            <h6>Mess ID: {mess.messID}</h6>
                            <div className="row">
                              {mess.taskJson.inputs.map((input) => (
                                <Form.Group key={input.inputId} className="mb-2 col-4">
                                  <Form.Label>{input.label}</Form.Label>
                                  <Form.Text className="ms-2 text-primary fw-bold">: {input.value}</Form.Text>
                                </Form.Group>
                              ))}
                            </div>
                            <Form.Group className="col-4 mt-3">
                              <Form.Label>Comment</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter comment"
                                value={comments[mess.messID] || ''}
                                onChange={(e) => handleCommentChange(mess.messID, e as React.ChangeEvent<HTMLInputElement>)}
                              />
                            </Form.Group>
                          </Card.Body>
                        </Card>
                      ));
                    } else {
                      return <p>No valid array found in task_Json</p>;
                    }
                  } catch (error) {
                    console.error('Error parsing JSON:', error);
                    return <p>Error parsing task details.</p>;
                  }
                })()}
              </div>
            )}
          </Card.Body>
        </Card>
      ))}
      <Button variant="primary" onClick={handleSubmit} className="mt-4">
        Submit Approvals
      </Button>
    </Container>
  );
};

export default ApprovalPage;
