import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, Container, Row, Col, Alert } from 'react-bootstrap'; // Assuming DynamicForm is in the same directory
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
  taskNumber: string;
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





  // both are required to make dragable column of table 
  const [columns, setColumns] = useState<Column[]>([
    // { id: 'moduleName', label: 'Module Name', visible: true },
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

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleDetails = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };



  useEffect(() => {

    const fetchPreData = async (taskCommonId: number) => {
      try {
        const flag = 5;
        const response = await axios.get<ApiResponse>(
          `${config.API_URL_ACCOUNT}/ProcessInitiation/GetFilterTask?TaskCommonId=${taskCommonId}&Flag=${flag}`
        );

        if (response.data && response.data.isSuccess) {
          const fetchedData = response.data.getFilterTasks || [];
          console.log(fetchedData);

          // Filter out tasks with isCompleted as "Pending"
          const filteredTasks = fetchedData
            .filter((task) => task.isCompleted !== "Pending") // Filter step
            .map((task: ProjectAssignListWithDoer) => {
              const taskJsonArray = JSON.parse(task.task_Json); // Parse task_Json to get an array of taskJson objects

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

  const handleDoerChange = (taskNumber: string, selectedOption: any) => {
    // Handle the change for doer selection
    console.log(`Doer changed for task ${taskNumber}:`, selectedOption);
  };





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
                        <th><i className="ri-list-ordered-2"></i>Task Name</th>
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
                      <tr key={item.id}>
                        <td>{JSON.parse(item.task_Json)?.inputs.find(
                          (input: any) => input.inputId === "99"
                        )?.label || "Task name not found"}</td>
                        {columns.filter(col => col.visible).map((col) => (
                          <td key={col.id}

                            className={
                              // Add class based on column id
                              col.id === 'processName' ? 'fw-bold fs-14 text-dark text-nowrap' :
                                col.id === 'task_Number' ? 'fw-bold fs-13 text-dark text-nowrap task1' :
                                  col.id === 'processOwnerName' ? 'fw-bold fs-13 text-dark text-nowrap' :
                                    col.id === 'plannedDate' ? ' text-nowrap ' :
                                      col.id === 'createdDate' ? ' text-nowrap ' :
                                        // Add class based on value (e.g., expired tasks)
                                        (col.id === 'moduleName' && item[col.id] === 'Accounts') ? 'text-nowrap task4' :
                                          (col.id === 'moduleName' && item[col.id] === 'Accounts Checklist') ? 'text-nowrap task3' :
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
                          <button
                            className="btn btn-link text-decoration-none"
                            onClick={() => toggleDetails(index)}
                          >
                            <i
                              className={`ri-arrow-${openIndex === index ? "up" : "down"}-s-line ri-lg`}
                            ></i>
                          </button>
                        </td>
                        <td colSpan={10}>
                          <div>
                            <DynamicForm
                              formData={JSON.parse(item.task_Json)}
                              taskNumber={item.task_Number}
                              onDoerChange={handleDoerChange}
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
                    ))
                  ) : (
                    <tr><td colSpan={columns.length + 1}>No data available</td></tr>
                  )}

                  <tr>
                    <td colSpan={100}>
                      {data.map((item, index) => (
                        <div key={item.id} className="task-item">
                          <div
                            className={`card-body task-details ${openIndex === index ? "open" : "closed"
                              }`}
                          >
                            <div className='mt-1 d-flex justify-content-start'>
                              <div className="col-4 mb-2 d-flex flex-column">
                                <span className="fs-5">Task Name:</span>{" "}
                                <span className='text-primary fw-bold'>
                                  {JSON.parse(item.task_Json)?.inputs.find(
                                    (input: any) => input.inputId === "99"
                                  )?.label || "Task name not found"}
                                </span>
                              </div>
                              <div className='col-4 d-flex flex-column'>
                                <span className="fs-5">Role: </span><span className='text-primary fw-bold'>{item.roleName}</span>
                              </div>
                              <div className="mb-2 col-4 d-flex flex-column">
                                <span className="fs-5">Process Name : </span> <span className='text-primary fw-bold'>{item.processName}</span>
                              </div>
                            </div>
                            <div className="d-flex flex-row align-items-start p-2 shadow">
                              <div className='flex-column d-flex col-4'>
                                <span className="fs-5">Problem Solver:</span>
                                <div className="d-flex flex-row my-2 align-items-center">
                                  <span className="icon-circle me-1">{item.problemSolver.charAt(0).toUpperCase()}</span>
                                  <div className='d-flex flex-column'>
                                    <span className='text-primary fw-bold'>{item.problemSolver}</span>
                                    <div className="d-flex align-items-center">
                                      <span>{item.problemSolverMobileNumber}</span>
                                      <a
                                        href={`tel:${item.problemSolverMobileNumber}`}
                                        className="ms-1 text-primary"
                                        style={{ textDecoration: "none" }}
                                        aria-label="Call"
                                      >
                                        <i className="ri-phone-line" style={{ fontSize: "1rem" }}></i>
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className='flex-column d-flex col-4'>
                                <span className="fs-5">Project Coordinator</span>
                                <div className="d-flex flex-row my-2 align-items-center">
                                  <span className="icon-circle me-1">{item.projectCoordinator.charAt(0).toUpperCase()}</span>
                                  <div className="d-flex flex-column">
                                    <span className="text-primary fw-bold">{item.projectCoordinator}</span>
                                    <div className="d-flex align-items-center">
                                      <span>{item.projectCoordinatorMobileNumber}</span>
                                      <a
                                        href={`tel:${item.projectCoordinatorMobileNumber}`}
                                        className="ms-1 text-primary"
                                        style={{ textDecoration: "none" }}
                                        aria-label="Call"
                                      >
                                        <i className="ri-phone-line" style={{ fontSize: "1rem" }}></i>
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className='flex-column d-flex col-4'>
                                <span className="fs-5">Project Incharge</span>
                                <div className="d-flex flex-row my-2 align-items-center">
                                  <span className="icon-circle me-1">{item.projectIncharge.charAt(0).toUpperCase()}</span>
                                  <div className="d-flex flex-column">
                                    <span className="text-primary fw-bold">{item.projectIncharge}</span>
                                    <div className="d-flex align-items-center">
                                      <span>{item.projectInchargeMobileNumber}</span>
                                      <a
                                        href={`tel:${item.projectInchargeMobileNumber}`}
                                        className="ms-1 text-primary"
                                        style={{ textDecoration: "none" }}
                                        aria-label="Call"
                                      >
                                        <i className="ri-phone-line" style={{ fontSize: "1rem" }}></i>
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className='mt-2 d-flex justify-content-between'>
                              <div className="mb-2 d-flex col-4 flex-column">
                                <span className="fs-5">Project Name: </span> <span className='text-primary fw-bold'>{item.projectName} <span className='fw-bold text-dark'> ({item.projectId})</span></span>
                              </div>
                              <div className="mb-2 col-4 d-flex col-4 flex-column">
                                <span className="fs-5">Period: </span> <span className='text-primary fw-bold'>{formatPeriod(item.createdDate)}</span>
                              </div>
                              <div className="mb-2 col-4 d-flex col-4 flex-column">
                                <span className="fs-5">Created at: </span> <span className='text-primary fw-bold'>{formatDate(item.createdDate)}</span>
                              </div>
                            </div>
                            <div className='d-flex justify-content-end'>
                              <Button className='ms-auto' onClick={() => handleEdit(item.taskCommonId)}>
                                Show
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </td>
                  </tr>
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