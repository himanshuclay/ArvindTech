import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, Container, Row, Col, Alert, Modal } from 'react-bootstrap';
// import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import config from '@/config';
import MessCards from '../Component/Previous&Completed';




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
  plannedDate: string;
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
  const [preData, setPreData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [show, setShow] = useState(false);

  // const [popoverIndex, setPopoverIndex] = useState<number | null>(null);
  // =======================================================================
  // both are required to make dragable column of table 
  const [columns, setColumns] = useState<Column[]>([
    { id: 'task_Number', label: 'Task', visible: true },
    { id: 'taskName', label: 'Task Name', visible: true },
    { id: 'projectName', label: 'Project', visible: true },
    { id: 'planDate', label: 'Planned', visible: true },
    { id: 'isCompleted', label: 'Status', visible: true },
  ]);

  const handleOnDragEnd = (result: any) => {
    if (!result.destination) return;
    const reorderedColumns = Array.from(columns);
    const [movedColumn] = reorderedColumns.splice(result.source.index, 1);
    reorderedColumns.splice(result.destination.index, 0, movedColumn);
    setColumns(reorderedColumns);
  };
  // ==============================================================


  useEffect(() => {
    const fetchData = async () => {
      try {
        const role = localStorage.getItem('EmpId') || '';
        const response = await axios.get<ApiResponse>(
          `${config.API_URL_ACCOUNT}/ProcessInitiation/GetFilterTask?Flag=3&DoerId=${role}`
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



  const fetchPreData = async (taskCommonId: number) => {
    try {
      const flag = 5;
      const response = await axios.get<ApiResponse>(
        `${config.API_URL_ACCOUNT}/ProcessInitiation/GetFilterTask?TaskCommonId=${taskCommonId}&Flag=${flag}`
      );

      if (response.data?.isSuccess) {
        const fetchedData = response.data.getFilterTasks || [];
        console.log(fetchedData);

        // Filter and transform data
        const filteredTasks = fetchedData
          .filter((task) => task.isCompleted !== "Pending") // Exclude pending tasks
          .flatMap((task: ProjectAssignListWithDoer) => {
            let taskJsonArray: any[] = [];

            try {
              // Parse task_Json and check its structure
              taskJsonArray = JSON.parse(task.task_Json);
              console.log("Parsed taskJsonArray:", taskJsonArray);
            } catch (error) {
              console.error("Error parsing task_Json:", task.task_Json, error);
              return []; // Return an empty array if parsing fails
            }

            if (!Array.isArray(taskJsonArray)) {
              if (typeof taskJsonArray === "object" && taskJsonArray !== null) {
                taskJsonArray = [taskJsonArray]; // Wrap the object in an array
              } else {
                return []; // If not an object or array, return an empty array
              }
            }

            return taskJsonArray.flatMap((taskJson: any) => {
              if (!taskJson) {
                console.error("Invalid taskJson:", taskJson);
                return [];
              }
              const inputs = taskJson.taskJson?.inputs || taskJson.inputs;
              if (!Array.isArray(inputs)) {
                console.error("Invalid inputs:", inputs);
                return [];
              }
              console.log(inputs);

              // Map options for replacing value with label
              const optionsMap = inputs.reduce((map: Record<string, string>, input: any) => {
                if (input.options) {
                  input.options.forEach((option: any) => {
                    map[option.id] = option.label;
                  });
                }
                return map;
              }, {});

              // Filter and map inputs
              const filteredInputsData = inputs
                .filter((input: any) => !["99", "100", "102", "103"].includes(input.inputId)) // Exclude unwanted inputs
                .map((input: any) => ({
                  label: input.label,
                  value: optionsMap[input.value] || input.value, // Replace value with label if available
                }));

              const input = inputs.find(item => item.inputId === "99");
              const label = input ? input.label : null;


              return {
                messID: taskJson.messID || '',
                messName: taskJson.messName || '',
                messManager: taskJson.messManager || '',
                managerNumber: taskJson.mobileNumber || '',
                messTaskNumber: taskJson.messTaskNumber || '',
                taskName: label,
                inputs: filteredInputsData,
              };
            });
          });

        setPreData(filteredTasks);
        console.log("Filtered Tasks:", filteredTasks);
      } else {
        console.error("API Response Error:", response.data?.message || "Unknown error");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.message);
      } else {
        console.error("Unexpected Error:", error);
      }
    } finally {
      setLoading(false);
    }
  };


  const handleEdit = (taskCommonId: number) => {
    fetchPreData(taskCommonId);
    setShow(true);
    console.log(preData)
  };

  console.log(preData)


  const handleClose = () => {
    setShow(false);
    setPreData([]);
  };



  function calculatePlannedDate(createdDate: string): string {
    const parsedDate = new Date(createdDate);
    if (isNaN(parsedDate.getTime())) {
      console.error('Invalid date format');
      return ''; // Return an empty string if the date is invalid
    }
    const plannedDate = new Date(parsedDate.getTime() + 88 * 60 * 60 * 1000);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[plannedDate.getMonth()];
    const day = String(plannedDate.getDate()).padStart(2, '0');
    const year = plannedDate.getFullYear();
    const hours = String(plannedDate.getHours()).padStart(2, '0');
    const minutes = String(plannedDate.getMinutes()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }


  return (
    <>
      <Modal size='xl' show={show} onHide={handleClose} placement="end">
        <Modal.Header closeButton>
          <Modal.Title>Task Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <MessCards data={preData} />
        </Modal.Body>
      </Modal>


      <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center fs-20">
        <span><i className="ri-file-list-line me-2"></i><span className='fw-bold test-nowrap'>Expire Task</span></span>
      </div>

      <div className='overflow-auto '>
        {!data ? (
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
          <>
            {loading ? (
              <div className='loader-container'>
                <div className="loader"></div>
                <div className='mt-2'>Please Wait!</div>
              </div>
            ) : (
              <DragDropContext onDragEnd={handleOnDragEnd}>
                <Table hover className="bg-white">
                  <thead>
                    <Droppable droppableId="columns" direction="horizontal">
                      {(provided) => (
                        <tr
                          {...provided.droppableProps} ref={provided.innerRef as React.Ref<HTMLTableRowElement>}
                          className="text-nowrap">
                          <th><i className="ri-list-ordered-2"></i> Sr. No</th>
                          {columns
                            .filter((col) => col.visible)
                            .map((column, index) => (
                              <Draggable key={column.id} draggableId={column.id} index={index}>
                                {(provided) => (
                                  <th
                                    key={column.id}
                                    className={
                                      column.id === 'projectName' ? 'text-end' :
                                        column.id === 'isCompleted' ? 'text-end' :
                                          column.id === 'planDate' ? 'text-end' :
                                            ''
                                    }
                                  >
                                    <div ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}>
                                      {column.id === 'processName' && (<i className="ri-map-2-line"></i>)}
                                      {column.id === 'projectName' && (<i className="ri-building-line"></i>)}
                                      {column.id === 'task_Number' && (<i className="ri-health-book-line pl-1-5"></i>)}
                                      {column.id === 'isCompleted' && (<i className="ri-flag-line"></i>)}
                                      {column.id === 'planDate' && (<i className="ri-hourglass-line"></i>)}
                                      {column.id === 'taskName' && (<i className="ri-tools-line"></i>)}
                                      &nbsp; {column.label}
                                    </div>
                                  </th>
                                )}
                              </Draggable>
                            ))}
                          {provided.placeholder}
                          <th className='text-end pr-3'>Action</th>
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
                              <td key={col.id}
                                className={
                                  col.id === 'taskName' ? 'fw-bold fs-14 text-dark truncated-text' :
                                    col.id === 'task_Number' ? 'fw-bold fs-14 text-dark pl-3' :
                                      col.id === 'planDate' ? 'text-nowrap text-end' :
                                        col.id === 'projectName' ? 'text-end' :
                                          col.id === 'isCompleted' ? 'text-nowrap text-end' :
                                            ''
                                }
                              >
                                <div>
                                  {
                                    col.id === 'plannedDate' ? (
                                      <>{item.task_Number === 'ACC.01.T1' ? calculatePlannedDate(item.createdDate) : item.plannedDate}</>
                                    ) :
                                      col.id === 'createdDate' ? (
                                        <>{format(new Date(item.createdDate), 'dd-MMM-yyyy HH:mm')}</>
                                      ) :
                                        col.id === 'completedDate' ? (
                                          <>{format(new Date(item.completedDate), 'dd-MMM-yyyy HH:mm')}</>
                                        ) :

                                          (
                                            <>{item[col.id as keyof typeof item]}</>
                                          )}
                                </div>
                              </td>
                            ))}
                          <td className='text-end pr-3'>
                            <Button onClick={() => handleEdit(item.taskCommonId)}>
                              Show
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={columns.length + 1}>
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
                      </td></tr>
                    )}
                  </tbody>
                </Table>
              </DragDropContext>
            )}
          </>

        )}
      </div>
    </>
  );
};

export default ProjectAssignTable;