import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select, { SingleValue } from 'react-select';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import config from '@/config';
import DynamicForm from './Component/DynamicForm';
// import 'remixicon/fonts/remixicon.css'; // Import Remix Icons

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
  isCompleted: 'Pending' | 'Completed' | 'Pending for Approval';
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
  { value: 'approved_with_amendment', label: 'Approved with Amendment' },
];

const ApprovalPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [approvalStatuses, setApprovalStatuses] = useState<Record<number, OptionType | null>>({});
  const [selectedTask, setSelectedTask] = useState<Task | any>('');
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
        const approvalStatus = approvalStatuses[task.id]?.value; // approved, rejected, or amendment
        const isApprovalConsole = task.approval_Console === "Select Approval_Console";
        let parsedTaskJson;

        try {
          parsedTaskJson = JSON.parse(task.task_Json);
        } catch (error) {
          console.error('Error parsing task_Json:', error);
          return null;
        }

        let updatedTaskJson = [...parsedTaskJson];
        let updatedIsCompleted = task.isCompleted;

        if (isApprovalConsole) {
          if (approvalStatus === "rejected") {
            updatedIsCompleted = "Pending";
          } else if (approvalStatus === "approved") {
            updatedIsCompleted = "Completed";
          } else if (approvalStatus === "amendment") {
            updatedTaskJson = updatedTaskJson.map((field) => {
              if (field.inputId === "specificFieldId") {
                return { ...field, value: "Amended Value" };
              }
              return field;
            });
            updatedIsCompleted = "Pending for Approval";
          }
        } else {
          updatedIsCompleted = isApprovalConsole ? "Pending for Approval" : "Completed";
        }

        const payload = {
          id: task.id,
          doerID: task.doerId,
          task_Json: JSON.stringify(updatedTaskJson),
          doer_task_Json: task.task_Json,
          approval_task_Json: isApprovalConsole ? JSON.stringify(updatedTaskJson) : null,
          isCompleted: updatedIsCompleted,
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

  return (
    <>
      <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center fs-20">
        <span><i className="ri-file-list-line me-2"></i><span className='fw-bold test-nowrap'>Approval Page</span></span>

      </div>
      {tasks.length === 0 ? (
        <Container className="mt-5">
          <Row className="justify-content-center">
            <Col xs={12} md={8} lg={6}>
              <Alert variant="info" className="text-center">
                <h4>No Approvals Found</h4>
                <p>You currently don't have any tasks to approve.</p>
              </Alert>
            </Col>
          </Row>
        </Container>

      ) : (
        tasks.map((task) => (
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
                <div className="d-flex justify-content-end">
                  <Button onClick={() => handleShowDetails(task)}>
                    Show Details
                  </Button>
                </div>
              </Row>
            </Card.Body>
          </Card>
        ))
      )}

      <Button variant="primary" onClick={handleSubmit} className="mt-4">
        Submit Approvals
      </Button>

      {selectedTask && show && (
        <DynamicForm
          fromComponent="ApprovalConsole"
          formData={JSON.parse(selectedTask.task_Json)}
          taskNumber={selectedTask.task_Number}
          data={tasks}
          show={show}
          taskName
          setShow={setShow}
          parsedCondition={[]}
          preData={[]}
          selectedTasknumber={selectedTask.task_Number}
          setLoading={() => { }}
          taskCommonIDRow={selectedTask.taskCommonId}
          taskStatus={selectedTask.isCompleted}
          processId={selectedTask.processID}
          moduleId={selectedTask.moduleID}
          ProcessInitiationID={selectedTask.id}
          approval_Console={selectedTask.approval_Console}
          approvalConsoleInputID={selectedTask.approvalConsoleInputID}
          projectName

        />
      )}
    </>
  );
};

export default ApprovalPage;
