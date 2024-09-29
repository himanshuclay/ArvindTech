import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, Collapse, Offcanvas, Container, Row, Col, Alert, Modal } from 'react-bootstrap'; // Assuming DynamicForm is in the same directory
import { useNavigate } from 'react-router-dom';
import { format, addDays, parse } from 'date-fns';
import config from '../../config';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import DynamicForm from './Component/DynamicForm';



interface ProjectAssignListWithDoer {
  id: number;
  projectId: string;
  projectName: string;
  moduleID: string;
  moduleName: string;
  processID: string;
  processName: string;
  roleId: string;
  doerId: string,
  doerName: string,
  task_Json: string;
  task_Number: string;
  task_Status: 1,
  isExpired: 0,
  taskCommonId: number,
  expiredSummary: null
  createdBy: string;
  status: 'Pending' | 'Done';
  isCompleted: "Pending",
  condition_Json: string;
  createdDate: string;
  taskTime: string;
  taskType: string;
  roleName: string;
  taskNumber: string
  inputs: Input[]


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
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [parsedCondition, setParsedCondition] = useState<any[]>([]);
  const [taskCommonId, setTaskCommonId] = useState<number | null>(null);
  const [selectedTasknumber, setSelectedTasknumber] = useState<string>('');
  // const [formState, setFormState] = useState<any>({});
  const [show, setShow] = useState(false);



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

  ]);

  const handleOnDragEnd = (result: any) => {
    if (!result.destination) return;
    const reorderedColumns = Array.from(columns);
    const [movedColumn] = reorderedColumns.splice(result.source.index, 1);
    reorderedColumns.splice(result.destination.index, 0, movedColumn);
    setColumns(reorderedColumns);
  };
  // ==============================================================


  const navigate = useNavigate()
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


  console.log(taskCommonId)

  useEffect(() => {

    const fetchPreData = async (taskCommonId: number) => {
      try {
        // const taskData = data.find(task => task.task_Number === taskNumber);
        // Fetch or pass TaskCommonId dynamically
        console.log(taskCommonId)
        const flag = 5;
        // const taskCommonId = 

        const response = await axios.get<ApiResponse>(
          `${config.API_URL_ACCOUNT}/ProcessInitiation/GetFilterTask?TaskCommonId=${taskCommonId}&Flag=${flag}`
        );

        if (response.data && response.data.isSuccess) {
          const fetchedData = response.data.getFilterTasks || [];
          console.log('Fetched Data:', fetchedData);

          // Filter tasks and exclude unwanted inputIds
          const filteredTasks = fetchedData.map((task: ProjectAssignListWithDoer) => {
            const parsedTaskJson = JSON.parse(task.task_Json);
            const optionsMap = parsedTaskJson.inputs.reduce((map: Record<string, string>, input: any) => {
              if (input.options) {
                input.options.forEach((option: any) => {
                  map[option.id] = option.label;
                });
              }
              return map;
            }, {});

            const filteredInputs = parsedTaskJson.inputs
              .filter((input: any) => !['99', '100', '102', '103'].includes(input.inputId)) // Exclude unwanted inputIds
              .map((input: any) => ({
                label: input.label,
                value: optionsMap[input.value] || input.value // Replace value with label if it exists in optionsMap
              }));

            return {
              taskNumber: task.task_Number,
              inputs: filteredInputs
            };
          });


          // Set data for rendering
          setPreData(filteredTasks);
          console.log('Filtered Tasks:', filteredTasks);

          const parsedConditions = fetchedData.map((task: ProjectAssignListWithDoer) => {
            try {
              return JSON.parse(task.condition_Json); // Parse the condition JSON
            } catch (error) {
              console.error('Error parsing condition_Json:', error);
              return null;
            }
          });

          setParsedCondition(parsedConditions);
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
    if (taskCommonId) {
      fetchPreData(taskCommonId);

    }
  }, [taskCommonId]);





 

  const toggleExpandRow = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

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
    // Parse the created date and task time
    const createdDateObj = parse(createdDate, 'dd-MM-yyyy HH:mm:ss', new Date());
    const taskTimeValue = parseInt(taskTime, 10); // Assuming taskTime is in hours

    // Calculate the number of days to add
    const daysToAdd = Math.floor(taskTimeValue / 24);

    // Add days to the created date
    const updatedDate = addDays(createdDateObj, daysToAdd);

    // Format the updated date to the desired format
    // return format(updatedDate, 'dd-MM-yyyy HH:mm:ss');
  };


  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
  };

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


            {/* <Table className='bg-white' striped bordered hover>
            <thead>
              <tr>
                <th>Sr.no </th>
                <th>Module </th>
                <th>Process </th>
                <th>Project </th>
                <th>Assigned Role</th>
                <th>Task Id</th>
                <th>Task Type</th>
                <th>Planned Date</th>
                <th>Initation Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <React.Fragment key={item.id}>
                  <tr
                    style={{
                      backgroundColor: item.status === 'Done' ? 'lightgreen' : 'white',
                    }}
                  >
                    <td>{index + 1}</td>
                    <td>{item.moduleName}</td>
                    <td>{item.processName}</td>
                    <td>{item.projectName}</td>
                    <td>{item.roleName}</td>
                    <td>{item.task_Number}</td>
                    <td>{item.taskType}</td>
                    <td>{formatAndUpdateDate(item.createdDate, item.taskTime)}</td>
                    <td>{item.createdDate}</td>
                    <td>
                      <Button onClick={handleShow}>
                        Show
                      </Button>
                    </td>

                  </tr>
                  <tr>
                    <td colSpan={10}>
                      <Collapse in={expandedRow === item.id}>
                        <div>
                          <DynamicForm
                            formData={JSON.parse(item.task_Json)}
                            taskNumber={item.task_Number}
                            doer={null} // Replace with actual doer if available
                            onDoerChange={handleDoerChange}
                          />
                        </div>
                      </Collapse>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </Table> */}
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Table hover className='bg-white '>
                <thead>
                  <Droppable droppableId="columns" direction="horizontal">
                    {(provided) => (
                      <tr {...provided.droppableProps} ref={provided.innerRef} className='text-nowrap'>
                        <th><i className="ri-list-ordered-2"></i>  Sr. No</th>
                        {columns.filter(col => col.visible).map((column, index) => (
                          <Draggable key={column.id} draggableId={column.id} index={index}>
                            {(provided) => (
                              <th ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                {column.id === 'processName' && (<i className="ri-map-2-line"></i>)}
                                {column.id === 'projectName' && (<i className="ri-building-line"></i>)}
                                {column.id === 'task_Number' && (<i className="ri-health-book-line"></i>)}
                                {column.id === 'roleName' && (<i className="ri-shield-user-line"></i>)}
                                {column.id === 'taskType' && (<i className="ri-bookmark-line"></i>)}
                                {column.id === 'taskTime' && (<i className="ri-calendar-line"></i>)}
                                {column.id === 'createdDate' && (<i className="ri-hourglass-line"></i>)}
                                {column.id === 'completedDate' && (<i className="ri-focus-3-line"></i>)}
                                {column.id === 'moduleName' && (<i className="ri-box-3-line"></i>)}


                                &nbsp; {column.label}
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
                        {/* Render the index for pagination (currentPage - 1) * pageSize + index + 1 */}
                        <td>{index + 1}</td>
                        {/* Dynamically render visible columns */}
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
                            <div>
                              {/* {col.id === 'inputValue' && (<i className="ri-edit-2-fill edit-icon"></i>)} */}

                              {col.id === 'plannedDate' ? (
                                <td>{formatAndUpdateDate(item.createdDate, item.taskTime)}</td>
                              ) : (<>{item[col.id as keyof ProjectAssignListWithDoer]}</>
                              )}

                            </div>
                          </td>

                        ))}
                        {/* Action Button */}
                        <td>
                          <Button onClick={handleShow}>
                            Show
                          </Button>
                        </td>
                        <td colSpan={10}>
                          <Collapse in={expandedRow === item.id}>
                            <div>
                              <DynamicForm
                                formData={JSON.parse(item.task_Json)}
                                taskNumber={item.task_Number}
                                doer={null} // Replace with actual doer if available
                                onDoerChange={handleDoerChange}
                                data={data}
                                show={show}
                                setShow={setShow}
                                parsedCondition={parsedCondition}
                                preData={preData}
                                selectedTasknumber={selectedTasknumber}
                                setLoading={setLoading}
                                
                              />
                            </div>
                          </Collapse>
                        </td>
                      </tr>
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