import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select, { SingleValue } from 'react-select';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import config from '@/config';
import DynamicForm from './Component/DynamicForm';

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

interface FilteredTask {
  taskNumber: string;
  inputs: {
    label: string;
    value: string;
  }[];
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
  const [selectedTask, setSelectedTask] = useState<Task | any>('');
  const [preData, setPreData] = useState<FilteredTask[]>([]);
  // const [loading, setLoading] = useState<boolean>(true);
  const [parsedCondition, setParsedCondition] = useState<any[]>([]);
  // const [taskCommonIDRow, setTaskCommonIdRow] = useState<number | null>(null);
  const [show, setShow] = useState(false);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const role = localStorage.getItem('EmpId') || '';
        const response = await axios.get<{ isSuccess: boolean; getFilterTasks: Task[] }>(
          `${config.API_URL_ACCOUNT}/ProcessInitiation/GetFilterTask?Flag=8&DoerId=${role}`
        );

        if (response.data.isSuccess) {
          setTasks(response.data.getFilterTasks);
          console.log(response.data.getFilterTasks);
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

  const handleShowDetails = (task: Task) => {
    setSelectedTask(task);
    setShow(true);
  };

  const handleSubmit = async () => {
    try {
      const requests = tasks.map(async (task) => {
        const isApproved = approvalStatuses[task.id]?.value === 'approved';
        let parsedTaskJson;

        try {
          parsedTaskJson = JSON.parse(task.task_Json);
        } catch (error) {
          console.error('Error parsing task_Json:', error);
          return null;
        }

        const updatedTaskJson = parsedTaskJson.map((mess: { messID: string; comments: string }) => {
          return { ...mess };
        });

        const payload = {
          id: task.id,
          doerID: task.doerId,
          task_Json: JSON.stringify(updatedTaskJson),
          isExpired: task.isExpired,
          isCompleted: isApproved ? 'Completed' : 'Pending',
          task_Number: task.task_Number,
          summary: task.expiredSummary || '',
          condition_Json: task.condition_Json,
          taskCommonID: task.taskCommonId,
          taskExpired: task.isExpired,
          updatedBy: task.createdBy,
        };

        const response = await axios.post(`${config.API_URL_ACCOUNT}/ProcessInitiation/UpdateDoerTask`, payload);
        return response.data;
      });

      const responses = await Promise.all(requests);
      console.log('Tasks submitted successfully:', responses);
    } catch (error) {
      console.error('Error submitting tasks:', error);
    }
  };
  // console.log(selectedTask.task_Json)

  return (
    <Container>
        <h4 className="ps-2 my-4 py-2 bg-white">Approval Page</h4>
      {tasks.map((task) => (
        <Card key={task.id} className="mb-4">
          <Card.Header as="h5">Task Number: {task.task_Number}</Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <Card.Text>Project Name: {task.projectName}</Card.Text>
                <Card.Text>Process Name: {task.processName}</Card.Text>
                <Card.Text>Status: {task.isCompleted}</Card.Text>
                <Card.Text>Task Start Date: {task.createdDate}</Card.Text>
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
              <div className='d-flex justify-content-end'>
                <Button onClick={() => handleShowDetails(task)}>
                  Show Details
                </Button>
              </div>
            </Row>
          </Card.Body>
        </Card>
      ))}
      <Button variant="primary" onClick={handleSubmit} className="mt-4">
        Submit Approvals
      </Button>

      {selectedTask && show && (
        <DynamicForm
          formData={JSON.parse(selectedTask.task_Json)}
          taskNumber={selectedTask.task_Number}
          onDoerChange={() => { }}
          data={tasks}
          show={show}

          setShow={setShow}
          parsedCondition={parsedCondition}
          preData={preData}
          selectedTasknumber={selectedTask.task_Number}
          setLoading
          taskCommonIDRow
          taskStatus
          processId={selectedTask.processID}
          moduleId={selectedTask.moduleID}
          ProcessInitiationID={selectedTask.id}
          approval_Console={selectedTask.approval_Console}
          approvalConsoleInputID={selectedTask.approvalConsoleInputID}
        />
      )}
    </Container>
  );
};

export default ApprovalPage;
