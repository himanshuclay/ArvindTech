import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, Container, Row, Col, Alert, Collapse } from 'react-bootstrap'; // Assuming DynamicForm is in the same directory
import { parse, format, addDays } from 'date-fns';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import DynamicForm from '../Component/DynamicForm';
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
  task_Status: number;
  isExpired: number;
  taskCommonId: number;
  expiredSummary: string | null;
  createdBy: string;
  status: "Pending" | "Done";
  isCompleted: string;
  condition_Json: string;
  createdDate: string;
  taskTime: string;
  taskType: string;
  roleName: string;
  taskNumber: string;
  inputs: Input[];
  data: string;
  approval_Console: string | null;
  approvalConsoleInputID: number;
  approvalConsoleDoerID: string | null;
  approvalConsoleDoerName: string | null;
  projectCoordinator: string;
  projectCoordinatorMobileNumber: number;
  projectCoordinatorID: string;
  projectIncharge: string;
  projectInchargeID: string;
  projectInchargeMobileNumber: number;
  taskName: string;
  completedDate: string | null;
  finishPoint: number;
  problemSolver: string;
  problemSolverMobileNumber: number;

}
interface Input {
  label: string;
  value: string;
}

interface ApiResponse {
  isSuccess: boolean;
  message: string;
  getFilterTasks: ProjectAssignListWithDoer[];
}

interface FilteredTask {
  // taskNumber: string;
  inputs: {
    label: string;
    value: string;
  }[];
}
interface Column {
  id: string;
  label: string;
  visible: boolean;
}
const ProjectAssignTable: React.FC = () => {
  const [data, setData] = useState<ProjectAssignListWithDoer[]>([]);
  const [preData, setPreData] = useState<FilteredTask[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [parsedCondition, setParsedCondition] = useState<any[]>([]);
  const [taskCommonId, setTaskCommonId] = useState<number | null>(null);
  const [selectedTasknumber, setSelectedTasknumber] = useState<string>('');
  const [singleDataById, setSingleDataById] = useState<ProjectAssignListWithDoer[]>([]);
  const [taskCommonIDRow, setTaskCommonIdRow] = useState<number | null>(null);
  // const [formState, setFormState] = useState<any>({});
  const [show, setShow] = useState(false);


  const [expandedRow, setExpandedRow] = useState<number | null>(null); // For row expansion


  const toggleExpandRow = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };
  // both are required to make dragable column of table 
  const [columns, setColumns] = useState<Column[]>([
    { id: 'taskName', label: 'Task Name', visible: true },
    // { id: 'processName', label: 'Process Name', visible: true },
    { id: 'projectName', label: 'Project Name', visible: true },
    // { id: 'roleName', label: 'Role Name', visible: true },
    { id: 'task_Number', label: 'Task Number', visible: true },
    // { id: 'taskType', label: 'Task Type', visible: true },
    // { id: 'plannedDate', label: 'Planned Date', visible: true },
    // { id: 'createdDate', label: 'Created Date', visible: true },
    // { id: 'sourceId', label: 'Sourse Id', visible: true },
    // { id: 'taskCommonId', label: 'Request Id', visible: true },
    // { id: 'plannedDate', label: 'Task Period', visible: true },

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
          `${config.API_URL_ACCOUNT}/ProcessInitiation/GetFilterTask?Flag=1&DoerId=${role}`
        );

        if (response.data && response.data.isSuccess) {
          const fetchedData = response.data.getFilterTasks || [];
          console.log('Fetched Data:', fetchedData);


          // Set the fetched data
          setData(fetchedData);

          // Process conditions
          const parsedConditions = fetchedData.map((task: ProjectAssignListWithDoer) => {
            try {
              return JSON.parse(task.condition_Json); // Parse the condition JSON
            } catch (error) {
              console.error('Error parsing condition_Json:', error);
              return null;
            }
          });

          // Extract and set TaskCommonId (assumes it should be a single number)
          const TaskCommonIds = fetchedData.map((task: ProjectAssignListWithDoer) => task.taskCommonId);
          if (TaskCommonIds && TaskCommonIds.length > 0) {
            const commonId = TaskCommonIds[0];
            setTaskCommonId(commonId); // Use a string key for localStorage
            console.log("This is updated:", commonId);  // Log the correct value
          } else {
            console.error('No taskCommonId values found.');
          }
          // Assuming 'fetchedData' is an array of 'ProjectAssignListWithDoer' objects
          const TaskNumber = fetchedData.map((task: ProjectAssignListWithDoer) => task.task_Number);

          if (TaskNumber.length > 0) {
            const selectTask = TaskNumber[0];
            setSelectedTasknumber(selectTask); // Assuming you want the first task number from the array
            console.log(selectTask); // Log the value being set instead of selectedTasknumber
          }
          console.log(selectedTasknumber)

          setTaskCommonId(TaskCommonIds[0]);
          // localStorage.setitem(taskCommonId)
          console.log("this is updated", taskCommonId)

          // Set parsed conditions state
          setParsedCondition(parsedConditions);

          console.log('Task Common IDs:', TaskCommonIds[0]);

        } else {
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

  // console.log(data)




  useEffect(() => {
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

              // If taskJsonArray is not an array, log and handle accordingly
              if (!Array.isArray(taskJsonArray)) {
                console.error("taskJsonArray is not an array:", taskJsonArray);
                console.log("task_Json is not in the expected array format:", task.task_Json);

                // Handle taskJsonArray as an object if it's an object
                if (typeof taskJsonArray === "object" && taskJsonArray !== null) {
                  console.log("task_Json is an object:", taskJsonArray);
                  // Transform the object into an array for processing
                  taskJsonArray = [taskJsonArray]; // Wrap the object in an array
                } else {
                  return []; // If not an object or array, return an empty array
                }
              }

              // Proceed with the rest of the taskJsonArray processing
              return taskJsonArray.flatMap((taskJson: any) => {
                if (!taskJson) {
                  console.error("Invalid taskJson:", taskJson);
                  return [];
                }

                // Extract inputs from the appropriate structure
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

                // Return transformed task object
                return {
                  messID: taskJson.messID,
                  messName: taskJson.messName,
                  messManager: taskJson.messManager,
                  managerNumber: taskJson.mobileNumber,
                  messTaskNumber: taskJson.messTaskNumber,
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





    if (taskCommonId) {
      fetchPreData(taskCommonId);
    }
  }, [taskCommonId]);


  // console.log(preData)

  const formatPeriod = (createdDate: string): string => {
    const startDate = new Date(createdDate);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6); // Add 7 days to the start date

    return `${format(startDate, "dd MMM yyyy")} to ${format(endDate, "dd MMM yyyy")}`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return format(date, "dd MMM yyyy");
  };


  const fetchSingleDataById = async (taskCommonId: number) => {
    try {
      const flag = 5;
      const response = await axios.get<ApiResponse>(
        `${config.API_URL_ACCOUNT}/ProcessInitiation/GetFilterTask?TaskCommonId=${taskCommonId}&Flag=${flag}`
      );

      if (response.data && response.data.isSuccess) {
        // Safely access task_Json and ensure it's a string
        const singledatabyID = response.data.getFilterTasks[0]?.task_Json;

        if (typeof singledatabyID === 'string') {
          console.log('fetch single Data:', JSON.parse(singledatabyID));
          setSingleDataById(JSON.parse(singledatabyID));
        } else {
          console.error('task_Json is not a valid string:', singledatabyID);
        }
      } else {
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

  console.log(singleDataById)









  // const toggleExpandRow = (id: number) => {
  //   setExpandedRow(expandedRow === id ? null : id);
  // };

  // const handleDoerChange = (taskNumber: string, selectedOption: any) => {
  //   // Handle the change for doer selection
  //   console.log(`Doer changed for task ${taskNumber}:`, selectedOption);
  // };





  if (loading) {
    return <div className="loader-fixed">
      <div className="loader"></div>
      <div className="mt-2">Please Wait!</div>
    </div>;
  }

  const formatAndUpdateDate = (createdDate: string, taskTime: string) => {
    // Log the input values for debugging

    // Parse the created date in MM/dd/yyyy HH:mm:ss format
    const createdDateObj = parse(createdDate, 'MM/dd/yyyy HH:mm:ss', new Date());

    // Check if the createdDateObj is valid
    if (isNaN(createdDateObj.getTime())) {
      throw new Error('Invalid created date format');
    }

    const taskTimeValue = parseInt(taskTime, 10); // Assuming taskTime is in hours

    // Calculate the number of days to add
    const daysToAdd = Math.floor(taskTimeValue / 24);

    // Add days to the created date
    const updatedDate = addDays(createdDateObj, daysToAdd);

    // Format the updated date to the desired format
    return format(updatedDate, 'MM/dd/yyyy HH:mm:ss');
  };


  const handleShow = () => setShow(true);

  const handleEdit = (taskCommonId: number) => {
    // setProjectNameIDRow(projectName);  // Set the project name
    setTaskCommonIdRow(taskCommonId);   // Set the task common ID
    handleShow();
    if (taskCommonId) {
      fetchSingleDataById(taskCommonId);

    }
  };

  // console.log(data)



  return (

    <>
      <div className="d-flex p-2 bg-white mt-2 mb-2 rounded shadow"><h5 className='mb-0'>Pending Task</h5></div>
      <div className='overflow-auto'>
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

          <>



            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Table hover className='bg-white '>
                <thead>
                  <Droppable droppableId="columns" direction="horizontal">

                    {(provided) => (
                      <tr
                        {...provided.droppableProps} ref={provided.innerRef as React.Ref<HTMLTableRowElement>}
                        className='text-nowrap'>
                        {/* <th><i className="ri-list-ordered-2"></i>Task Name</th> */}
                        {columns.filter(col => col.visible).map((column, index) => (
                          <Draggable key={column.id} draggableId={column.id} index={index}>
                            {(provided) => (
                              <th >
                                <div ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}>
                                  {column.id === 'processName' && (<i className="ri-map-2-line"></i>)}
                                  {column.id === 'projectName' && (<i className="ri-building-line"></i>)}
                                  {column.id === 'task_Number' && (<i className="ri-health-book-line"></i>)}
                                  {column.id === 'roleName' && (<i className="ri-shield-user-line"></i>)}
                                  {column.id === 'taskType' && (<i className="ri-bookmark-line"></i>)}
                                  {column.id === 'taskTime' && (<i className="ri-calendar-line"></i>)}
                                  {column.id === 'createdDate' && (<i className="ri-hourglass-line"></i>)}
                                  {column.id === 'completedDate' && (<i className="ri-focus-3-line"></i>)}
                                  {column.id === 'moduleName' && (<i className="ri-box-3-line"></i>)}
                                  {column.id === 'sourceId' && (<i className="ri-box-3-line"></i>)}
                                  {column.id === 'requestId' && (<i className="ri-box-3-line"></i>)}
                                  {column.id === 'taskPeriod' && (<i className="ri-box-3-line"></i>)}

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
                      <>



                        <tr key={item.id}>
                          {/* <td>
                          {JSON.parse(item.task_Json)?.inputs?.find(
                          (input: any) => input.inputId === "99"
                        )?.label || "Task name not found"}
                        </td> */}
                          {columns.filter(col => col.visible).map((col) => (
                            <td key={col.id}

                              className={
                                // Add class based on column id
                                col.id === 'taskName' ? 'fw-bold fs-14 text-dark text-nowrap' :
                                  ''
                              }
                            >
                              <div className=''>

                                {col.id === 'plannedDate' ? (
                                  <td>
                                    {formatAndUpdateDate(item.createdDate, item.taskTime)}
                                  </td>
                                ) : (<>{item[col.id as keyof ProjectAssignListWithDoer]}</>
                                )}

                              </div>
                            </td>

                          ))}

                          <td>
                            <Button onClick={() => toggleExpandRow(item.id)}>
                              {expandedRow === item.id ? <i className=" fs-16 ri-arrow-up-s-line"></i> : <i className=" fs-16 ri-arrow-down-s-line"></i>}
                            </Button>
                          </td>
                          <td colSpan={10}>
                            <div>
                              <DynamicForm
                                fromComponent='PendingTask'
                                formData={JSON.parse(item.task_Json)}
                                taskNumber={item.task_Number}
                                data={data}
                                show={show}
                                setShow={setShow}
                                parsedCondition={parsedCondition}
                                preData={preData}
                                selectedTasknumber={selectedTasknumber}
                                setLoading={setLoading}
                                taskCommonIDRow={taskCommonIDRow}
                                taskStatus
                                processId={item.processID}
                                moduleId={item.moduleID}
                                ProcessInitiationID={item.id}
                                approval_Console={item.approval_Console}
                                approvalConsoleInputID={item.approvalConsoleInputID}

                              />
                            </div>
                          </td>
                        </tr>
                        {expandedRow && expandedRow === item.id ?
                          <tr>
                            <td colSpan={12}>
                              <Collapse in={expandedRow === item.id}  >
                                <div className='p-3'>

                                  <Row>
                                    <Col lg={4}>
                                      <p className='mb-1'>Task Name</p>
                                      <h5 className='text-primary'>{item.taskName}</h5>
                                    </Col>
                                    <Col lg={4}>
                                      <p className='mb-1'>Role Name</p>
                                      <h5 className='text-primary'>{item.roleName}</h5>
                                    </Col>
                                    <Col lg={4}>
                                      <p className='mb-1'>Process Name</p>
                                      <h5 className='text-primary'>{item.processName}</h5>
                                    </Col>
                                  </Row>

                                  <Row className='taskDetailsView'>
                                    {item.problemSolver ?
                                      <Col lg={4}>
                                        <p className='mb-1'>Problem Solver</p>
                                        <h5 className='d-flex align-items-center text-primary m-0' >
                                          <span className="icon-circle me-1">{item.problemSolver.charAt(0).toUpperCase()}</span>
                                          {item.problemSolver}
                                        </h5>
                                        {item.problemSolverMobileNumber ?
                                          <p className='phone_user fw-normal m-0'><a href={`tel:${item.problemSolverMobileNumber}`}>
                                            <i className="ri-phone-fill"></i> {item.problemSolverMobileNumber}</a></p> : ""
                                        }
                                      </Col> : null
                                    }
                                    {item.projectIncharge ?
                                      <Col lg={4}>
                                        <p className='mb-1'>Project Incharge</p>
                                        <h5 className='text-primary'>{item.projectIncharge}</h5>
                                      </Col> : null
                                    }
                                    {item.projectCoordinator ?
                                      <Col lg={4}>
                                        <p className='mb-1'>Project Coordinator</p>
                                        <h5 className='text-primary'>{item.projectCoordinator}</h5>

                                      </Col> : null
                                    }
                                  </Row>

                                  <Row>
                                    <Col lg={4}>
                                      <p className='mb-1'>Project Name</p>
                                      <h5 className='text-primary'>{item.projectName}-({item.projectId})</h5>
                                    </Col>

                                    <Col lg={4}>
                                      <p className='mb-1'>Period</p>
                                      <h5 className='text-primary'>{formatPeriod(item.createdDate)}</h5>
                                    </Col>

                                    <Col lg={4}>
                                      <p className='mb-1'>Created At</p>
                                      <h5 className='text-primary'>{formatDate(item.createdDate)}</h5>
                                    </Col>
                                  </Row>



                                  <div className=' d-flex justify-content-end'>

                                    <Button className='ms-auto' onClick={() => handleEdit(item.taskCommonId)}>
                                      Show
                                    </Button>
                                  </div>

                                </div>
                              </Collapse>
                            </td>
                          </tr>
                          : ''
                        }

                      </>
                    ))
                  ) : (
                    <tr><td colSpan={columns.length + 1}>No data available</td></tr>
                  )}

                </tbody>
              </Table>
            </DragDropContext>
          </>
        )}
      </div>
    </>

  );
};

export default ProjectAssignTable;