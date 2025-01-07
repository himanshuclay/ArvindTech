import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, ButtonGroup, Table, Form, Collapse } from 'react-bootstrap';
import config from '@/config';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Select from 'react-select';
import { format, } from 'date-fns';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import LnPopupVew from './LnPopupVew';

interface LnMaster {
  id: number;
  projectName: string;
  moduleName: string;
  processName: string;
  task_Number: string;
  createdDate: string;
  completedDate: string;
  taskTime: string;
  taskType: string;
  roleName: string;
  taskName: string;
  problemSolver: string;
  doerName: string;
  approval_Console: string;
  projectIncharge: string;
  projectCoordinator: string;
  doerNumber: string;
  projectId: string;
  condition_Json: string;
  problemSolverMobileNumber: number;
}

interface Column {
  id: string;
  label: string;
  visible: boolean;
}

interface dropDownList {
  processID: string;
  processName: string;
  moduleID: string;
  moduleName: string;
  taskID: string;
  empID: string;
  empName: string;
}


const LnMaster: React.FC = () => {
  const [data, setData] = useState<LnMaster[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [moduleList, setModuleList] = useState<dropDownList[]>([]);
  const [processList, setProcessList] = useState<dropDownList[]>([]);
  const [taskNumberList, setTaskNumberList] = useState<dropDownList[]>([]);
  const [doerList, setDoerList] = useState<dropDownList[]>([]);
  const [show, setShow] = useState(false);
  const [manageId, setManageID] = useState<number>();
  const [expandedRow, setExpandedRow] = useState<number | null>(null); // For row expansion


  const [ModuleName, setModuleName] = useState('');
  const [ProcessName, setProcessName] = useState('');
  const [taskNumberName, setTaskNumberName] = useState('');
  const [doerName, setDoerName] = useState('');
  const [moduleID, setModuleID] = useState('');



  // both are required to make dragable column of table 
  const [columns, setColumns] = useState<Column[]>([
    { id: 'moduleName', label: 'Module', visible: true },
    { id: 'processName', label: 'Process', visible: true },
    { id: 'projectName', label: 'Project', visible: true },
    { id: 'roleName', label: 'Assigned Role', visible: true },
    { id: 'task_Number', label: 'Task Number', visible: true },
    { id: 'taskType', label: 'Task Type', visible: true },
    // { id: 'taskTime', label: 'Planned Date', visible: true },
    { id: 'createdDate', label: 'Initiation Date', visible: true },
  ]);

  const handleOnDragEnd = (result: any) => {
    if (!result.destination) return;
    const reorderedColumns = Array.from(columns);
    const [movedColumn] = reorderedColumns.splice(result.source.index, 1);
    reorderedColumns.splice(result.destination.index, 0, movedColumn);
    setColumns(reorderedColumns);
  };
  // ==============================================================


  const toggleExpandRow = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleSearch = (e: any) => {
    e.preventDefault();

    let query = `?`;
    if (ProcessName) query += `ProcessID=${ProcessName}&`;
    if (moduleID) query += `ModuleID=${moduleID}&`;
    if (taskNumberName) query += `TaskID=${taskNumberName}&`;
    if (doerName) query += `DoerID=${doerName}&`;

    query = query.endsWith('&') ? query.slice(0, -1) : query;

    const apiUrl = `${config.API_URL_ACCOUNT}/ProcessInitiation/SearchTaskListByIDs${query}`;
    axios.get(apiUrl, {
      headers: {
        'accept': '*/*'
      }
    })
      .then((response) => {
        setData(response.data.getFilterTasks)
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };




  // Fetch initial data
  useEffect(() => {

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${config.API_URL_ACCOUNT}/ProcessInitiation/GetFilterTask?Flag=6`
      );
      if (response.data && response.data.isSuccess) {
        setData(response.data.getFilterTasks || []);
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


  useEffect(() => {
    const fetchData = async (endpoint: string, setter: Function, listName: string) => {
      try {
        const response = await axios.get(`${config.API_URL_APPLICATION}/${endpoint}`);
        if (response.data.isSuccess) {
          setter(response.data[listName]);
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error(`Error fetching data from ${endpoint}:`, error);
      }
    };

    fetchData('CommonDropdown/GetModuleList', setModuleList, 'moduleNameListResponses');
    fetchData('CommonDropdown/GetTaskList', setTaskNumberList, 'taskList');
    fetchData('CommonDropdown/GetDoerFromDoerMaster', setDoerList, 'doerListResponses');
  }, []);



  useEffect(() => {
    const fetchProcessName = async () => {
      try {
        const response = await axios.get(`${config.API_URL_APPLICATION}/CommonDropdown/GetProcessNameByModuleName?ModuleName=${ModuleName}`);
        if (response.data.isSuccess) {
          setProcessList(response.data.processListResponses);
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error('Error fetching modules:', error);
      }
    };
    if (ModuleName) {
      fetchProcessName();
    }
  }, [ModuleName])


  const handleClear = () => {
    setDoerName('');
    setTaskNumberName('');
    setProcessName('');
    setModuleID('');
    fetchData();
  };

  const handleShow = () => setShow(true);
  const handleView = (id: number) => {
    handleShow();
    setManageID(id)

  }


  console.log(data)

  const formatPeriod = (createdDate: string): string => {
    const startDate = new Date(createdDate);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    return `${format(startDate, "dd MMM yyyy")} to ${format(endDate, "dd MMM yyyy")}`;
  };

  // const formatDate = (dateString: string): string => {
  //   const date = new Date(dateString);
  //   return format(date, "dd MMM yyyy");
  // };


  let conditionArray = [];
  try {
    if (data[0]?.condition_Json) {
      conditionArray = JSON.parse(data[0].condition_Json);
    }
  } catch (error) {
    console.error("Failed to parse condition_Json:", error);
  }

  const expiryLogic = conditionArray[0]?.expiryLogic;



  return (
    <>

      <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center">
        <span><i className="ri-file-list-line me-2 text-dark fs-16"></i><span className='fw-bold text-dark fs-15'>Running Task</span></span>
      </div>
      {loading ? (
        <div className='loader-container'>
          <div className="loader"></div>
          <div className='mt-2'>Please Wait!</div>
        </div>
      ) : (<>


        <div className='bg-white p-2 pb-2'>
          <Form onSubmit={handleSearch}>
            <Row>
              <Col lg={3}>
                <Form.Group controlId="ModuleName">
                  <Form.Label>Module Name</Form.Label>
                  <Select
                    name="ModuleName"
                    value={moduleList.find(item => item.moduleID === moduleID) || null}
                    onChange={(selectedOption) => {
                      setModuleName(selectedOption ? selectedOption.moduleName : ""),
                        setModuleID(selectedOption ? selectedOption.moduleID : "")

                    }}
                    options={moduleList}
                    getOptionLabel={(item) => item.moduleName}
                    getOptionValue={(item) => item.moduleID}
                    isSearchable={true}
                    placeholder="Select Module Name"
                    className="h45"
                  />
                </Form.Group>
              </Col>
              <Col lg={3}>
                <Form.Group controlId="ModuleOwnerName">
                  <Form.Label>Process Name</Form.Label>
                  <Select
                    name="ModuleOwnerName"
                    value={processList.find(item => item.processID === ProcessName) || null}
                    onChange={(selectedOption) => setProcessName(selectedOption ? selectedOption.processID : "")}
                    options={processList}
                    getOptionLabel={(item) => item.processName}
                    getOptionValue={(item) => item.processID}
                    isSearchable={true}
                    placeholder="Select Process Name"
                    className="h45"
                    isDisabled={!ModuleName}
                  />
                </Form.Group>
              </Col>

              <Col lg={3} className="">
                <Form.Group controlId="searchTaskNumber">
                  <Form.Label>Task Number</Form.Label>
                  <Select
                    name="searchTaskNumber"
                    value={taskNumberList.find(item => item.taskID === taskNumberName) || null}
                    onChange={(selectedOption) => setTaskNumberName(selectedOption ? selectedOption.taskID : "")}
                    options={taskNumberList}
                    getOptionLabel={(item) => item.taskID}
                    getOptionValue={(item) => item.taskID}
                    isSearchable={true}
                    placeholder="Select Task Number"
                    className="h45"
                  />
                </Form.Group>
              </Col>
              <Col lg={3} className="">
                <Form.Group controlId="searchDoerName">
                  <Form.Label>Doer Name</Form.Label>
                  <Select
                    name="searchDoerName"
                    value={doerList.find(item => item.empID === doerName) || null}
                    onChange={(selectedOption) => setDoerName(selectedOption ? selectedOption.empID : "")}
                    options={doerList}
                    getOptionLabel={(item) => item.empName}
                    getOptionValue={(item) => item.empID}
                    isSearchable={true}
                    placeholder="Select Doer Name"
                    className="h45"
                  />
                </Form.Group>
              </Col>


              <Col></Col>

              <Col lg={3} className="align-items-end d-flex justify-content-end mt-2">
                <ButtonGroup aria-label="Basic example" className="w-100">
                  <Button type="button" variant="primary" onClick={handleClear}>
                    <i className="ri-loop-left-line"></i>
                  </Button>
                  &nbsp;
                  <Button type="submit" variant="primary">
                    Search
                  </Button>
                </ButtonGroup>
              </Col>
            </Row>
          </Form>



          <Row className='mt-3'>
            <div className="d-flex justify-content-end bg-light p-1">
              <div className="app-search d-none d-lg-block me-4">

              </div>
            </div>
          </Row>
        </div>

        <div className="overflow-auto text-nowrap">
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
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Table hover className='bg-white '>
                <thead>
                  <Droppable droppableId="columns" direction="horizontal">
                    {(provided) => (
                      <tr {...provided.droppableProps} ref={provided.innerRef as React.Ref<HTMLTableRowElement>}>
                        <th><i className="ri-list-ordered-2"></i>  Sr. No</th>
                        {columns.filter(col => col.visible).map((column, index) => (
                          <Draggable key={column.id} draggableId={column.id} index={index}>
                            {(provided) => (
                              <th>
                                <div ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}>
                                  {column.id === 'moduleName' && (<i className="ri-layout-grid-line"></i>)}
                                  {column.id === 'processName' && (<i className="ri-flow-chart-line"></i>)}
                                  {column.id === 'projectName' && (<i className="ri-briefcase-line"></i>)}
                                  {column.id === 'roleName' && (<i className="ri-user-settings-fill"></i>)}
                                  {column.id === 'task_Number' && (<i className="ri-hashtag"></i>)}
                                  {column.id === 'taskType' && (<i className="ri-task-line"></i>)}
                                  {column.id === 'taskTime' && (<i className="ri-calendar-line"></i>)}
                                  {column.id === 'createdDate' && (<i className="ri-time-line"></i>)}
                                  &nbsp; {column.label}
                                </div>
                              </th>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        <th>Working Status</th>
                        <th className='text-center'>View</th>
                      </tr>
                    )}
                  </Droppable>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    data.map((item, index) => (
                      <>
                        <tr key={item.id}>
                          <td>{index + 1}</td>
                          {columns.filter(col => col.visible).map((col) => (
                            <td key={col.id}
                              className={
                                col.id === 'moduleName' ? 'fw-bold  text-dark ' :
                                  col.id === 'task_Number' ? 'fw-bold  text-dark p-2' :
                                    ''
                              }
                            >
                              <div>
                                {col.id === 'taskType' ? (
                                  <>
                                    {item.task_Number.endsWith('.T1') ? "Actual" : ""}
                                  </>
                                ) : (
                                  <>{item[col.id as keyof LnMaster]}</>
                                )}
                              </div>
                            </td>
                          ))}

                          <td className={item.completedDate === '' ? 'text-warning fw-bolder' : ''}>
                            {item.completedDate !== '' ? (
                              item.completedDate
                            ) : (
                              <span>
                                In Progress <i className="ri-loader-2-fill fs-5"></i>
                              </span>
                            )}
                          </td>


                          <td className='text-end pr-3'>
                            <Button onClick={() => toggleExpandRow(item.id)}>
                              {expandedRow === item.id ? <i className=" fs-16 ri-arrow-up-s-line"></i> : <i className=" fs-16 ri-arrow-down-s-line"></i>}
                            </Button>
                          </td>
                        </tr>

                        {expandedRow && expandedRow === item.id ?
                          <tr>
                            <td colSpan={12}>
                              <Collapse in={expandedRow === item.id}  >
                                <div className='p-3'>

                                  <Row>
                                    <Col lg={7}>
                                      <table>
                                        <tbody>
                                          <tr>
                                            <td><h5 className='text-nowrap'>Task Name :</h5></td>
                                            <td>  <h5 className='text-primary'>{item.taskName}</h5></td>
                                          </tr>
                                          <tr>
                                            <td><h5>Link :</h5></td>
                                            <td> <h5 className='text-primary'>NA</h5></td>
                                          </tr>
                                          <tr>
                                            <td><h5>Process :</h5></td>
                                            <td> <h5 className='text-primary'>{item.processName}</h5></td>
                                          </tr>
                                          <tr>
                                            <td><h5>Created Date :</h5></td>
                                            <td><h5 className='text-primary'>{format(new Date(item.createdDate), 'MMM dd, yyyy HH:mm')}</h5></td>
                                          </tr>
                                          <tr>
                                            <td><h5>Doer :</h5></td>
                                            <td>
                                              <h5 className='text-primary'> {item.doerName}</h5>
                                              {item.doerNumber ?
                                                <p className='fw-normal m-0'><a href={`tel:${item.doerNumber}`}>
                                                  <i className="ri-phone-fill"></i> {item.doerNumber}</a></p> : ""
                                              }
                                            </td>
                                          </tr>
                                          <tr>
                                            <td><h5>Role :</h5></td>
                                            <td><h5 className='text-primary'> {item.roleName}</h5></td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </Col>
                                    <Col lg={5}>
                                      <table>
                                        <tbody>
                                          <tr>
                                            <td><h5>Problem Solver :</h5></td>
                                            <td>
                                              <h5 className="text-primary">{item.problemSolver}</h5>
                                              {item.problemSolverMobileNumber ? (
                                                <p className="fw-normal m-0">
                                                  <a href={`tel:${item.problemSolverMobileNumber}`}>
                                                    <i className="ri-phone-fill"></i> {item.problemSolverMobileNumber}
                                                  </a>
                                                </p>
                                              ) : ""}
                                            </td>
                                          </tr>

                                          <tr>
                                            <td><h5>Expiry Logic:</h5></td>
                                            <td> <h5 className='text-primary'>{expiryLogic ? expiryLogic : 'N/A'}</h5></td>
                                          </tr>

                                          <tr>
                                            <td><h5>Approval :</h5></td>
                                            <td> <h5 className='text-primary'>{item.approval_Console !== null ? 'Yes' : 'No'}</h5></td>
                                          </tr>

                                          {item.approval_Console !== null &&
                                            <tr>
                                              <td><h5>Approver :</h5></td>
                                              <td><h5 className='text-primary'>NA</h5>
                                              </td>
                                            </tr>}
                                        </tbody>
                                      </table>
                                    </Col>

                                  </Row>
                                  <hr />

                                  <Row className=''>
                                    <Col lg={4}>
                                      <tr>
                                        <td> <h5 >Initiation period : </h5></td>
                                        <td><h5 className='text-primary'>{formatPeriod(item.createdDate)}</h5></td>
                                      </tr>
                                      <tr>
                                        <td> <h5 >Source : </h5></td>
                                        <td><h5 className='text-primary'>Source</h5>
                                        </td>
                                      </tr>

                                    </Col>
                                    <Col lg={4}>
                                      <tr>
                                        <td> <h5 >Week : </h5></td>
                                        <td><h5 className='text-primary'>Source</h5></td>
                                      </tr>
                                      <tr>
                                        <td> <h5 >Var Field 1 : </h5></td>
                                        <td><h5 className='text-primary'>Var Field 1</h5>
                                        </td>
                                      </tr>

                                    </Col>
                                    <Col lg={4}>
                                      <tr>
                                        <td> <h5>Mess Manager : </h5></td>
                                        <td><h5 className='text-primary'>Mess Manager Name</h5></td>
                                      </tr>
                                      <tr>
                                        <td> <h5 className='mb-1'>Var Field 2 : </h5></td>
                                        <td><h5 className='text-primary'>Var Field 2</h5>
                                        </td>
                                      </tr>

                                    </Col>
                                  </Row>

                                  <hr />

                                  <Row>
                                    <Col lg={7}>
                                      <table>
                                        <tbody>
                                          <tr>
                                            <td><h5>Created Date :</h5></td>
                                            <td><h5 className='text-primary'>{format(new Date(item.createdDate), 'MMM dd, yyyy HH:mm')}</h5></td>
                                          </tr>
                                          <tr>
                                            <td><h5>Extended Date :</h5></td>
                                            <td><h5 className='text-primary'>{format(new Date(item.createdDate), 'MMM dd, yyyy HH:mm')}</h5></td>
                                          </tr>
                                          <tr>
                                            <td><h5>Completed Date :</h5></td>
                                            <td><h5 className='text-primary'>{format(new Date(item.createdDate), 'MMM dd, yyyy HH:mm')}</h5></td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </Col>

                                    <Col lg={5} className='d-flex justify-content-end text-end'>
                                      <table>
                                        <tbody>
                                          <tr>
                                            <td><h5 className='text-primary'>View Output</h5></td>
                                          </tr>
                                          <tr>
                                            <td><h5 className='text-primary'>Heirarchy View</h5></td>
                                          </tr>
                                          <tr>
                                            <td><h5 className='text-primary'>Help</h5></td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </Col>
                                  </Row>



                                  <div className=' d-flex justify-content-end'>
                                    <Button variant='primary' onClick={() => handleView(item.id)}> Show</Button>
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
                    <tr>
                      <td colSpan={12}>
                        <Container className="mt-5">
                          <Row className="justify-content-center">
                            <Col xs={12} md={8} lg={6}>
                              <Alert variant="info" className="text-center">
                                <h4>No Data Found</h4>
                                <p>You currently don't have Data</p>
                              </Alert>
                            </Col>
                          </Row>
                        </Container>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </DragDropContext>
          )}
        </div>
      </>)}

      <LnPopupVew show={show} setShow={setShow} manageId={manageId} />


    </>
  );
};

export default LnMaster;
