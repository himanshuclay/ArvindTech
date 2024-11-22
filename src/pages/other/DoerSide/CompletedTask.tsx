import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Button, Table, Offcanvas, Toast, Container, Row, Col, Alert, Card } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { parse, addDays, format, isValid } from 'date-fns';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';
import config from '@/config';




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
  inputs: string;
  messID: string;
}

interface ApiResponse {
  isSuccess: boolean;
  message: string;
  getFilterTasks: ProjectAssignListWithDoer[];
}

interface Column {
  id: string;
  label: string;
  visible: boolean;
}



const ProjectAssignTable: React.FC = () => {
  const [data, setData] = useState<ProjectAssignListWithDoer[]>([]);
  const [preData, setPreData] = useState<ProjectAssignListWithDoer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [show, setShow] = useState(false);
  const [taskCommonId, setTaskCommonId] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [taskName, setTaskName] = useState<string | undefined>(undefined);

  const [popoverIndex, setPopoverIndex] = useState<number | null>(null);
  // =======================================================================
  // both are required to make dragable column of table 
  const [columns, setColumns] = useState<Column[]>([
    { id: 'moduleName', label: 'Module Name', visible: true },
    { id: 'processName', label: 'Process Name', visible: true },
    { id: 'projectName', label: 'Project Name', visible: true },
    { id: 'roleName', label: 'Role Name', visible: true },
    { id: 'task_Number', label: 'Task Number', visible: true },
    { id: 'taskType', label: 'Task Type', visible: true },
    { id: 'plannedDate', label: 'Planned Date', visible: true },
    { id: 'createdDate', label: 'Created Date', visible: true },
    { id: 'completedDate', label: 'Completed Date', visible: true },

  ]);

  const handleOnDragEnd = (result: any) => {
    if (!result.destination) return;
    const reorderedColumns = Array.from(columns);
    const [movedColumn] = reorderedColumns.splice(result.source.index, 1);
    reorderedColumns.splice(result.destination.index, 0, movedColumn);
    setColumns(reorderedColumns);
  };
  // ==============================================================

  const targetRefs = useRef<(HTMLSpanElement | null)[]>([]);


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
        const role = localStorage.getItem('EmpId') || '';
        const response = await axios.get<ApiResponse>(
          `${config.API_URL_ACCOUNT}/ProcessInitiation/GetFilterTask?Flag=2&DoerId=${role}`
        );

        if (response.data && response.data.isSuccess) {
          setData(response.data.getFilterTasks || []);
          console.log(response.data.getFilterTasks || []);
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


  // console.log(taskCommonId)
  // console.log(data[0].taskCommonId)
  // Fetch task data when taskCommonId is set
  useEffect(() => {
    if (taskCommonId !== null) {
      fetchPreData(taskCommonId);
    }
  }, [taskCommonId]);

  const fetchPreData = async (taskCommonId: number) => {
    try {
      const flag = 5;
      const response = await axios.get<ApiResponse>(
        `${config.API_URL_ACCOUNT}/ProcessInitiation/GetFilterTask?TaskCommonId=${taskCommonId}&Flag=${flag}`
      );

      if (response.data && response.data.isSuccess) {
        const fetchedData = response.data.getFilterTasks || [];
        // console.log(fetchedData);

        // Filter out tasks with isCompleted as "Pending"
        const filteredTasks = fetchedData
          .filter((task) => task.isCompleted !== "Pending") // Filter step
          .map((task: ProjectAssignListWithDoer) => {
            const taskJsonArray = JSON.parse(task.task_Json); // Parse task_Json to get an array of taskJson objects
            console.log(taskJsonArray)
            // Assuming taskJsonArray is an array, handle each taskJson object
            return taskJsonArray.map((taskJson: any) => {
              // Ensure taskJson is valid and has taskJson and inputs
              if (taskJson && taskJson.taskJson && taskJson.taskJson.inputs && Array.isArray(taskJson.taskJson.inputs)) {
                // Create a map for the options
                const optionsMap = taskJson.taskJson.inputs.reduce((map: Record<string, string>, input: any) => {
                  if (input.options) {
                    input.options.forEach((option: any) => {
                      map[option.id] = option.label; // Map option ids to labels
                    });
                  }
                  return map;
                }, {});

                // Create a filtered array of inputs excluding specific inputIds
                const filteredInputsdata = taskJson.taskJson.inputs
                  .filter((input: any) => !['99', '100', '102', '103'].includes(input.inputId)) // Exclude unwanted inputIds
                  .map((input: any) => ({
                    label: input.label,
                    value: optionsMap[input.value] || input.value // Replace value with label if it exists in optionsMap
                  }));

                return {
                  messID: taskJson.messID, // Include messID for reference
                  inputs: filteredInputsdata // Return filtered inputs
                };
              } else {
                console.error('taskJson does not have valid inputs:', taskJson);
                return null; // Handle invalid inputs array gracefully
              }
            }).filter((item: number) => item !== null); // Filter out any null tasks resulting from invalid inputs
          }).flat(); // Flatten the array if needed

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
    const taskCommonId = data[0].taskCommonId
    // const taskCommonId = data

    setTaskCommonId(taskCommonId);

    // Set the taskCommonId to fetch the specific task data
    setShow(true); // Show the Offcanvas
  };

  const handleClose = () => setShow(false);

  if (loading) {
    return <div className="loader-fixed">Loading...</div>;
  }

  const formatAndUpdateDate = (createdDate: string, taskTime: string) => {
    // Parse the created date with the correct format 'MM/dd/yyyy HH:mm:ss'
    const createdDateObj = parse(createdDate, 'dd/MM/yyyy HH:mm:ss', new Date());

    // Check if the createdDateObj is valid
    if (!isValid(createdDateObj)) {
      console.error('Invalid createdDate:', createdDate);
      return 'Invalid created date';
    }

    const taskTimeValue = parseInt(taskTime, 10); // Assuming taskTime is in hours

    // Check if taskTime is a valid number
    if (isNaN(taskTimeValue)) {
      console.error('Invalid taskTime:', taskTime);
      return 'Invalid task time';
    }

    // Calculate the number of days to add
    const daysToAdd = Math.floor(taskTimeValue / 24);

    // Add days to the created date
    const updatedDate = addDays(createdDateObj, daysToAdd);

    // Format the updated date to the desired format 'MM/dd/yyyy HH:mm:ss'
    return format(updatedDate, 'dd/mmm/yyyy HH:mm:ss');
  };

  // Example Usage
  // const updatedDate = formatAndUpdateDate('21-09-2023 15:30:00', '48');
  // console.log(updatedDate);



  const SuccessToast: React.FC<{ show: boolean; taskName?: string; onClose: () => void }> = ({ show, onClose }) => {
    return (
      <Toast
        show={show}
        onClose={onClose}
        delay={5000}
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
                Updated data from <span className="text-primary">{task.messID}</span> &nbsp;&nbsp;&nbsp;
                <span className='fs-15 information-btn '
                  ref={(el) => (targetRefs.current[index] = el)} // Store the ref for each task
                  onClick={() => setPopoverIndex(popoverIndex === index ? null : index)} // Toggle popover visibility for the clicked task
                >
                  <i className="ri-error-warning-fill fs-20"></i>
                </span>

              </h5>
              <div>
                <Overlay
                  target={targetRefs.current[index]} // Use the ref for the current task
                  show={popoverIndex === index} // Only show popover for the clicked task
                  placement="left"
                >
                  {(props) => (
                    <Tooltip id="overlay-example" {...props} className='tooltip-position'>
                      <div className='d-flex'>
                        {Array.isArray(task.inputs) && task.inputs.length > 0 ? (
                          Array.isArray(task.inputs[0]) ? ( // Check if the first element is an array
                            task.inputs.map((inputArray: any, arrIndex: number) => (
                              <Card key={arrIndex} className="m-2 pop-card">
                                <Card.Body>
                                  {inputArray.map((input: any, i: number) => (
                                    <Col key={i}>
                                      <strong>{input.label}:</strong> <span className="text-primary">{input.value}</span>
                                    </Col>
                                  ))}
                                </Card.Body>
                              </Card>
                            ))
                          ) : ( // If not, assume it's a single array of inputs
                            <Card className="m-2 pop-card">
                              <Row>
                                <Card.Body>
                                  {task.inputs.map((input: any, i: number) => (
                                    <Col key={i}>
                                      <strong>{input.label}:</strong> <span className="text-primary">{input.value}</span>
                                    </Col>
                                  ))}
                                </Card.Body>
                              </Row>
                            </Card>
                          )
                        ) : (
                          <p>No inputs available</p> // Handle case where inputs are not available
                        )}
                      </div>
                    </Tooltip>
                  )}
                </Overlay>

              </div>
              <hr />
            </div>
          ))}
        </Offcanvas.Body>
      </Offcanvas>

      <div className="d-flex p-2 bg-white mt-2 mb-2 rounded shadow"><h5 className="mb-0">Completed Tasks</h5></div>
      <div className='overflow-auto '>
        {data.length === 0 ? (
          <Container className="mt-5">
            <Row className="justify-content-center">
              <Col xs={12} md={8} lg={6}>
                <Alert variant="info" className="text-center">
                  <h4>No Task Found</h4>
                  <p>You currently don't have Completed tasks</p>
                </Alert>
              </Col>
            </Row>
          </Container>
        ) : (

          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Table hover className="bg-white">
              <thead>
                <Droppable droppableId="columns" direction="horizontal">
                  {(provided) => (
                      <tr 
                      {...provided.droppableProps}  ref={provided.innerRef as React.Ref<HTMLTableRowElement>}
                       className="text-nowrap">
                        <th><i className="ri-list-ordered-2"></i> Sr. No</th>
                        {columns
                          .filter((col) => col.visible)
                          .map((column, index) => (
                            <Draggable key={column.id} draggableId={column.id} index={index}>
                              {(provided) => (
                                <th>
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    {column.id === 'processName' && <i className="ri-map-2-line"></i>}
                                    {column.id === 'projectName' && <i className="ri-building-line"></i>}
                                    {column.id === 'task_Number' && <i className="ri-health-book-line"></i>}
                                    {column.id === 'roleName' && <i className="ri-shield-user-line"></i>}
                                    {column.id === 'taskType' && <i className="ri-bookmark-line"></i>}
                                    {column.id === 'taskTime' && <i className="ri-calendar-line"></i>}
                                    {column.id === 'createdDate' && <i className="ri-hourglass-line"></i>}
                                    {column.id === 'completedDate' && <i className="ri-focus-3-line"></i>}
                                    {column.id === 'moduleName' && <i className="ri-box-3-line"></i>}
                                    &nbsp; {column.label}
                                  </div>
                                </th>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                        <th>Action</th>
                      </tr>
                  )}
                </Droppable>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.slice(0, 10).map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      {columns
                        .filter((col) => col.visible)
                        .map((col) => (
                          <td
                            key={col.id}
                            className={
                              col.id === 'processName'
                                ? 'fw-bold fs-14 text-dark text-nowrap'
                                : col.id === 'task_Number'
                                  ? 'fw-bold fs-13 text-dark text-nowrap task1'
                                  : col.id === 'processOwnerName'
                                    ? 'fw-bold fs-13 text-dark text-nowrap'
                                    : col.id === 'plannedDate'
                                      ? ' text-nowrap '
                                      : col.id === 'completedDate'
                                        ? ' text-nowrap '
                                        : col.id === 'moduleName' && item[col.id] === 'Accounts'
                                          ? 'text-nowrap task4'
                                          : col.id === 'moduleName' && item[col.id] === 'Accounts Checklist'
                                            ? 'text-nowrap task3'
                                            : ''
                            }
                          >
                            <div>
                              {col.id === 'plannedDate' ? (
                                <td>{formatAndUpdateDate(item.createdDate, item.taskTime)}</td>
                              ) : (
                                <>{item[col.id as keyof typeof item]}</>
                              )}
                            </div>
                          </td>
                        ))}
                      <td>
                        <Button onClick={() => handleEdit(item.id)}>
                          <i className="ri-edit-2-fill"></i>
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length + 1}>No data available</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </DragDropContext>



        )}
      </div>

      <SuccessToast show={showToast} taskName={taskName} onClose={() => setShowToast(false)} />
    </>
  );
};

export default ProjectAssignTable;