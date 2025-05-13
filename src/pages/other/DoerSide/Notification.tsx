import React, { useEffect, useState } from 'react';
// import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Button, Table, Container, Row, Col, Alert, Collapse, Pagination, Form, ButtonGroup, Modal } from 'react-bootstrap'; // Assuming DynamicForm is in the same directory
import { format } from 'date-fns';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import DynamicForm from '../Component/DynamicForm';
import config from '@/config';
import HeirarchyView from '../Component/ViewTask/HeirarchyView';
import ViewOutput from '../Component/ViewTask/ViewOutput';
import { getPlannedDate } from '../Component/PlanDateFunction';
import { toast } from 'react-toastify';
// import { Divider } from 'rsuite';
import Flatpickr from 'react-flatpickr';
import Select from 'react-select';
import { BLOCK_VALUE, FIELD } from '@/pages/FormBuilder/Constant/Interface';
import { Node } from 'reactflow';
// import ReactFlow, { Background, Controls, Edge, MiniMap, Node, useEdgesState, useNodesState } from 'reactflow';
import ActiveNode from '@/pages/WorkflowBuilder/ActiveNode';
import { getActiveNode, getCompletedNodes, getFilterTasks } from '@/pages/WorkflowBuilder/Constant/function';
// import { getActiveNode, getCompletedNodes } from '@/pages/WorkflowBuilder/Constant/function';

// import CustomNode from '@/pages/WorkflowBuilder/CustomNode';



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
  doerNumber: string;
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
  planDate: string;
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
  finishPoint: String;
  rejectedJson: string;
  problemSolver: string;
  problemSolverMobileNumber: number;
  blockValue: BLOCK_VALUE;
  form_Json: FIELD;

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
interface dropDownList {
  processID: string;
  processName: string;
  moduleID: string;
  moduleName: string;
  taskID: string;
  empID: string;
  empName: string;
  name: string;
}
const ProjectAssignTable: React.FC = () => {
  const [data, setData] = useState<ProjectAssignListWithDoer[]>([]);
  const [preData, setPreData] = useState<FilteredTask[]>([]);
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState<boolean>(true);
  const [parsedCondition, setParsedCondition] = useState<string>('');
  const [taskCommonIDRow, setTaskCommonIdRow] = useState<number | null>(null);
  const [pId, setPId] = useState<number>(0);
  const [show, setShow] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showViewOutput, setShowViewOutput] = useState(false);
  const [manageId, setManageID] = useState<number>();
  const [, setSearchTriggered] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [projectList,] = useState<dropDownList[]>([]);
  const [projectName, setProjectName] = useState('');
  const [options, setOptions] = useState('');
  const [moduleList,] = useState<dropDownList[]>([]);
  const [moduleID, setModuleID] = useState('');
  const [ModuleName, setModuleName] = useState('');
  const [processList,] = useState<dropDownList[]>([]);
  const [ProcessName, setProcessName] = useState('');
  const [taskNumberList,] = useState<dropDownList[]>([]);
  const [taskNumberName, setTaskNumberName] = useState('');
  const [activeTaskId, setActiveTaskId] = useState(0);
  // const [doerList, ] = useState<dropDownList[]>([]);
  const [, setDoerName] = useState('');
  // const [nodes, setNodes] = useNodesState([]);
  // const [edges, setEdges] = useEdgesState([]);

  const [expandedRow, setExpandedRow] = useState<number | null>(null); // For row expansion
  // interface APISetting {
  //   name: string;
  //   api: string;
  //   id: number;
  // }

  // interface WorkflowBuilderConfig {
  //   apiSetting: APISetting[];
  //   edges: Edge[];
  //   nodes: Node[];
  // }

  // const [workflowData, setWorkflowData] = useState<WorkflowBuilderConfig>();
  const [activeNode, setActiveNode] = useState<Node | "">("");
  const [completedNodes, setCompletedNodes] = useState<Node[] | "">("");

  // useEffect(() => {
  //   if (workflowData) {
  //     // getActiveNode(workflowData);
  //     // const start = workflowData.edges.find(e => e.source == "1");
  //     // const activeNode = workflowData.nodes.find(n => n.id === start?.target);
  //     const completedNodes = getCompletedNodes(workflowData, "1");
  //     const activeNode = getActiveNode(workflowData, "1");
  //     console.log(activeNode)
  //     if (activeNode) {
  //       if (activeNode.data.TaskBinding && activeNode.data.BindingOption === "formAndValueWithEditMode") {
  //         let extraActive = completedNodes.find(node => node.id === activeNode.data.TaskBinding);
  //         if (extraActive) {
  //           activeNode.data.form = extraActive.data.form;
  //           activeNode.data.blockValue = extraActive.data.blockValue;
  //         }
  //       }
  //       setCompletedNodes(completedNodes);
  //       setActiveNode(activeNode);
  //     } else {
  //       setActiveNode(""); // or handle it differently
  //     }

  //   }
  // }, [workflowData])


  const handleClear = async () => {
    setDoerName('');
    setTaskNumberName('');
    setProcessName('');
    setModuleID('');
    setProjectName('');
    setEndDate('');
    setOptions('');
    setStartDate('');
    setCurrentPage(1);
    setSearchTriggered(false);
  };

  const toggleExpandRow = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  // both are required to make dragable column of table 
  const [columns, setColumns] = useState<Column[]>([
    { id: 'uuid', label: 'Process uUID', visible: true },
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
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const role = localStorage.getItem('EmpId') || '';
        const response = await axios.get(
          `${config.API_URL_ACCOUNT}/ProcessInitiation/GetFilterTask`,
          {
            params: {
              Flag: 1,
              DoerId: role,
              Id: 0,
              PageIndex: currentPage,
            },
          }
        );

        if (response.data && response.data.isSuccess) {
          const fetchedData = response.data.getFilterTasks || [];
          setData(fetchedData);
          setTotalPages(Math.ceil(response.data.totalCount / 10));
        } else {
          console.error('API Response Error:', response.data?.message || 'Unknown error');
        }
      } catch (error) {
        toast.error('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.pathname, currentPage]);


  const fetchPreData = async (taskCommonId: number) => {
    try {
      const flag = 5;
      const response = await axios.get<ApiResponse>(
        `${config.API_URL_ACCOUNT}/ProcessInitiation/GetFilterTask?TaskCommonId=${taskCommonId}&Flag=${flag}`
      );

      if (response.data?.isSuccess) {
        const fetchedData = response.data.getFilterTasks || [];


        // Filter and transform data
        const filteredTasks = fetchedData
          .filter((task) => task.isCompleted !== "Pending") // Exclude pending tasks
          .flatMap((task: ProjectAssignListWithDoer) => {
            let taskJsonArray: any[] = [];



            try {
              // Parse task_Json and check its structure
              taskJsonArray = JSON.parse(task.task_Json);
            } catch (error) {
              return []; // Return an empty array if parsing fails
            }

            // If taskJsonArray is not an array, log and handle accordingly
            if (!Array.isArray(taskJsonArray)) {
              console.error("taskJsonArray is not an array:", taskJsonArray);

              // Handle taskJsonArray as an object if it's an object
              if (typeof taskJsonArray === "object" && taskJsonArray !== null) {
                // Transform the object into an array for processing
                taskJsonArray = [taskJsonArray]; // Wrap the object in an array
              } else {
                return []; // If not an object or array, return an empty array
              }
            }

            // Proceed with the rest of the taskJsonArray processing
            return taskJsonArray.flatMap((taskJson: any, form_Json: any) => {
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

              // Return transformed task object
              return {
                messID: taskJson.messID,
                messName: taskJson.messName,
                messManager: taskJson.messManager,
                managerNumber: taskJson.mobileNumber,
                messTaskNumber: taskJson.messTaskNumber,
                taskName: label,
                inputs: filteredInputsData,
                blockValue: task.blockValue,
                form_Json: task.form_Json,

              };
            });
          });

        setPreData(filteredTasks);



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

  console.log("this is predata", preData);




  const formatPeriod = (createdDate: string): string => {
    const startDate = new Date(createdDate);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6); // Add 7 days to the start date

    return `${format(startDate, "dd-MMM-yyyy")} to ${format(endDate, "dd-MMM-yyyy")}`;
  };


  // const fetchSingleDataById = async (taskCommonId: number) => {
  //   try {
  //     const flag = 5;
  //     const response = await axios.get<ApiResponse>(
  //       `${config.API_URL_ACCOUNT}/ProcessInitiation/GetFilterTask?TaskCommonId=${taskCommonId}&Flag=${flag}`
  //     );

  //     if (response.data && response.data.isSuccess) {
  //       const singledatabyID = response.data.getFilterTasks[0]?.task_Json;

  //       if (typeof singledatabyID === 'string') {
  //         console.log('fetch single Data:', JSON.parse(singledatabyID));
  //         setSingleDataById(JSON.parse(singledatabyID));
  //       } else {
  //         console.error('task_Json is not a valid string:', singledatabyID);
  //       }
  //     } else {
  //       console.error('API Response Error:', response.data?.message || 'Unknown error');
  //     }
  //   } catch (error) {
  //     if (axios.isAxiosError(error)) {
  //       console.error('Axios Error Response:', error.response?.data || 'No response data');
  //       console.error('Axios Error Message:', error.message);
  //     } else {
  //       console.error('Unexpected Error:', error);
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  if (loading) {
    return <div className="loader-fixed">
      <div className="loader"></div>
      <div className="mt-2">Please Wait!</div>
    </div>;
  }

  const handleShow = () => setShow(true);

  const handleEdit = (taskCommonId: number, taskCondition: string, item: any) => {
    if (item.templateJson) {
      const templateJson = JSON.parse(item.templateJson);
      if (templateJson.edges && templateJson.edges.length) {
        const doerId = localStorage.getItem("EmpId");
        if (doerId) {
          const activeNode = getActiveNode(templateJson.nodes, doerId);
          const completedNodes = getCompletedNodes(templateJson.nodes);
          console.log('completedNodes', completedNodes)
          setCompletedNodes(completedNodes);
          if (activeNode) {
            if (activeNode.data.TaskBinding && activeNode.data.BindingOption === "formAndValueWithEditMode") {
              let extraActive = completedNodes.find(node => node.id === activeNode.data.TaskBinding);
              if (extraActive) {
                activeNode.data.form = extraActive.data.form;
                activeNode.data.blockValue = extraActive.data.blockValue;
              }
            }
            setActiveNode(activeNode);
            setActiveTaskId(item.id);
          }
        }
      }
      setPId(item.id)
    } else if (item.task_Json) {
      setTaskCommonIdRow(taskCommonId);
      fetchPreData(taskCommonId);
      setParsedCondition(taskCondition);
      handleShow();
    }
    // if (item.templateJson) {
    //   const templateJson = JSON.parse(item.templateJson);
    //   if (templateJson.edges && templateJson.edges.length) {
    //     setWorkflowData(templateJson)
    //     setActiveTaskId(item.id);
    //   }
    // }

  };

  let conditionArray = [];
  try {
    if (data[0]?.condition_Json) {
      conditionArray = JSON.parse(data[0].condition_Json);
    }
  } catch (error) {
    console.error("Failed to parse condition_Json:", error);
  }
  const expiryLogic = conditionArray[0]?.expiryLogic;
  const expirationTime = conditionArray[0]?.expirationTime;



  const isTimeExtended = (createdDate: string) => {
    const created = new Date(createdDate);
    const currentDate = new Date();
    const twoDaysLater = new Date(created);
    twoDaysLater.setDate(created.getDate() + 2);
    return currentDate > twoDaysLater;
  }
  const optionsDataAccesLevel = [
    { value: 'All', label: 'All' },
    { value: 'OnlySelf', label: 'OnlySelf' },
    { value: 'ProjectModule', label: 'ProjectModule' },
    { value: 'Module', label: 'Module' },
    { value: 'Project', label: 'Project' }
  ];


  function calculatePlannedDate(createdDate: string): string {
    const parsedDate = new Date(createdDate);
    if (isNaN(parsedDate.getTime())) {
      console.error('Invalid date format');
      return ''; // Return an empty string if the date is invalid
    }
    const plannedDate = new Date(parsedDate.getTime() + 86 * 60 * 60 * 1000);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[plannedDate.getMonth()];
    const day = String(plannedDate.getDate()).padStart(2, '0');
    const year = plannedDate.getFullYear();
    let hours = plannedDate.getHours();
    const minutes = String(plannedDate.getMinutes()).padStart(2, '0');
    const amPm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert to 12-hour format and handle midnight (0 becomes 12)
    return `${day}-${month}-${year} ${String(hours).padStart(2, '0')}:${minutes} ${amPm}`;
  }



  const handleShowview = () => setShowView(true);
  const handleShowviewOutput = () => setShowViewOutput(true);

  const handleViewEdit = (id: any) => {
    handleShowview();
    setManageID(id)

  };
  const handleViewEditOutput = (taskCommonId: any) => {
    handleShowviewOutput();
    fetchPreData(taskCommonId);
  };

  // useEffect(() => {
  // if (workflowData) {
  // console.log('workflowData',workflowData)
  // const start = workflowData.edges.find(e => e.source == "1");
  // console.log(start)
  // }
  // }, [workflowData])

  const handleCloseActiveForm = () => {
    setActiveNode("")
  }
  // const nodeTypes = useMemo(() => ({
  //   custom: (props: any) => <CustomNode {...props} setNodes={setNodes} edges={edges} isCompleteTask={true} />,
  // }), [setNodes, edges]);  // ✅ Include edges in dependencies
  // const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
  //   console.log(node);
  //   if (node.data.completedBy && node.data.completedBy == localStorage.getItem("EmpId")) {
  //     setSelectedNode(node); // ✅ Sets the node you're editing
  //     // console.log(node.data.blockValue);
  //     // console.log(setShowFormBuilder);
  //     setBlockValue(node.data.blockValue);
  //     if (node.data.form?.blocks?.length) {
  //       setShowFormBuilder(true);
  //       setFormBuilder(node.data.form); // ✅ Prefill existing form
  //       setIsAddFormBuilder(false);
  //     } else {
  //       if (node.data.form != "ADD_NODE")
  //         setDynamicComponent(node.data.form);
  //     }
  //   } else if (!node.data.completedBy) {
  //     // setSelectedNode(node); // ✅ Sets the node you're editing
  //     // console.log(node.data.blockValue);
  //     // setBlockValue(node.data.blockValue);
  //     // if (node.data.form?.blocks?.length) {
  //     //   setShowFormBuilder(true);
  //     //   setFormBuilder(node.data.form); // ✅ Prefill existing form
  //     //   setIsAddFormBuilder(false);
  //     // } else {
  //     //   if (node.data.form != "ADD_NODE")
  //     //     setDynamicComponent(node.data.form);
  //     // }
  //   }
  // }, []);
  return (

    <>
      <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center fs-20">
        <span><i className="ri-file-list-line me-2"></i><span className='fw-bold test-nowrap'>Pending Task</span></span>
      </div>
      <div className='bg-white p-2 pb-2'>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            setCurrentPage(1);
            setSearchTriggered(true);
          }}
        >
          <Row>

            <Col lg={4}>
              <Form.Group controlId="dateRange" className="mb-3">
                <Form.Label>Select Date Range</Form.Label>
                <Flatpickr
                  value={[startDate, endDate]}
                  onChange={([start, end]) => {
                    if (start && end) {
                      const formattedStart = start.toLocaleDateString('en-CA');
                      const formattedEnd = end.toLocaleDateString('en-CA');
                      setStartDate(formattedStart);
                      setEndDate(formattedEnd);

                    }
                  }}
                  options={{
                    mode: "range",
                    enableTime: false,
                    dateFormat: "Y-m-d",
                    time_24hr: false,
                  }}
                  placeholder=" Select Date Range "
                  className="form-control "
                />
              </Form.Group>
            </Col>



            <Col lg={4}>
              <Form.Group controlId="projectName">
                <Form.Label>Select Project</Form.Label>
                <Select
                  name="projectName"
                  value={projectList.find(item => item.name === projectName) || null}
                  onChange={(selectedOption) => {
                    setProjectName(selectedOption ? selectedOption.name : "")
                  }}
                  options={projectList}
                  getOptionLabel={(item) => item.name}
                  getOptionValue={(item) => item.name}
                  isSearchable={true}
                  placeholder="Select Project Name"
                  className="h45"
                />
              </Form.Group>
            </Col>
            {/* <Col lg={3}>
                                <Form.Group controlId="ModuleName">
                                    <Form.Label>Sort  By</Form.Label>
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
                                        placeholder="Select Project Name"
                                        className="h45"
                                    />
                                </Form.Group>
                            </Col> */}
            <Col lg={4}>
              <Form.Group controlId="options">
                <Form.Label>Select Any Option</Form.Label>
                <Select
                  name="options"
                  options={optionsDataAccesLevel}
                  value={optionsDataAccesLevel.find(option => option.value === options) || null}
                  onChange={(selectedOption) => setOptions(selectedOption?.value || '')}
                  placeholder="Select Any Option"
                />
              </Form.Group>
            </Col>
            <Col lg={3}>
              <Form.Group controlId="ModuleName">
                <Form.Label>Select Module</Form.Label>
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
                <Form.Label>Select Process</Form.Label>
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
                <Form.Label>Select Task </Form.Label>
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
      <div className='overflow-auto'>
        {!data ? (
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
                        {columns.filter(col => col.visible).map((column, index) => (
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
                    data.slice(0, 20).map((item, index) => (
                      <React.Fragment key={item.id}>
                        <tr>
                          {columns.filter(col => col.visible).map((col) => (
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
                              <div className="">
                                {
                                  col.id === 'planDate' ? (
                                    <>
                                      {item.task_Number === 'ACC.01.T1'
                                        ? calculatePlannedDate(item.createdDate)
                                        : getPlannedDate(item.createdDate, item.planDate)}
                                    </>
                                  ) :

                                    col.id === 'projectName' ? (
                                      <>
                                        <i className="ri-building-line"></i> {item.projectName}-{item.projectId}
                                      </>
                                    ) : (
                                      <>
                                        {getFilterTasks(item)?.[col.id] ?? ''}
                                      </>

                                    )
                                }
                              </div>

                            </td>

                          ))}

                          <td className='text-end pr-3'>
                            <Button
                              variant={isTimeExtended(item.createdDate) ? 'warning' : 'primary'}
                              onClick={() => toggleExpandRow(item.id)}
                            >
                              {expandedRow === item.id ? <i className=" fs-18 ri-arrow-up-s-line"></i> : <i className=" fs-18 ri-arrow-down-s-line"></i>}
                            </Button>
                          </td>
                          <td colSpan={10} className='d-none'>
                            <div>
                              {(expandedRow === item.id && item.task_Json != '') &&
                                // <>wwwwwwwwwwwwwww{JSON.stringify(item)}</>
                                <DynamicForm
                                  fromComponent='PendingTask'
                                  formData={JSON.parse(item.task_Json)}
                                  formBuilderData={JSON.parse(item.task_Json)}
                                  taskNumber={item.task_Number}
                                  taskName={item.taskName}
                                  data={data}
                                  show={show}
                                  finishPoint={item.finishPoint}
                                  setShow={setShow}
                                  parsedCondition={parsedCondition}
                                  preData={preData}
                                  rejectBlock={item.rejectedJson}
                                  taskCommonIDRow={taskCommonIDRow}
                                  projectName={item.projectName}
                                  taskStatus
                                  processId={item.processID}
                                  moduleId={item.moduleID}
                                  ProcessInitiationID={item.id}
                                  approval_Console={item.approval_Console}
                                  problemSolver={item.problemSolver}
                                  approvarActions={item.approvalConsoleInputID}
                                  rejectData={item.rejectedJson}
                                />
                              }
                            </div>
                          </td>
                        </tr>
                        {expandedRow && expandedRow === item.id ?
                          <tr>
                            <td colSpan={12}>
                              <Collapse in={expandedRow === item.id}  >
                                <div className='p-3'>

                                  <Row>
                                    <Col lg={8}>
                                      <table>
                                        <tbody>
                                          <tr>
                                            <td><h5 className='text-nowrap'>Task Name :</h5></td>
                                            <td>  <h5 className='text-primary'>{item.taskName}</h5></td>
                                          </tr>
                                          <tr>
                                            <td><h5>Link :</h5></td>
                                            <td> <h5 className='text-primary'>SOP (3) / Checklist / Training Video / Office Order (4) / Process Flowchart</h5></td>
                                          </tr>
                                          <tr>
                                            <td><h5>Process :</h5></td>
                                            <td> <h5 className='text-primary'>{item.processName}</h5></td>
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
                                    <Col lg={4}>
                                      <table>
                                        <tbody>
                                          <tr>
                                            <td><h5>Problem Solver :</h5></td>
                                            <td>
                                              <h5 className='text-primary'> {item.problemSolver}</h5>
                                              {item.problemSolverMobileNumber ?
                                                <p className=' fw-normal m-0'><a href={`tel:${item.problemSolverMobileNumber}`}>
                                                  <i className="ri-phone-fill"></i> {item.problemSolverMobileNumber}</a></p> : ""
                                              }
                                            </td>
                                          </tr>
                                          <tr>
                                            <td><h5>Expiry Logic :</h5></td>
                                            <td>
                                              <h5 className='text-primary'> {expiryLogic === "Expire On Defined Time" ? `${expirationTime} Hr` : (expiryLogic || 'N/A')}</h5>
                                            </td>

                                          </tr>
                                          <tr>
                                            <td><h5>Sunday Logic:</h5></td>
                                            <td><h5 className="text-primary">
                                              {JSON.parse(item.condition_Json || "[]")[0]?.sundayLogic || "N/A"}
                                            </h5></td>
                                          </tr>

                                          {/* <tr>
                                            <td><h5>Approval :</h5></td>
                                            <td> <h5 className='text-primary'>{item.approval_Console !== null ? 'Yes' : 'No'}</h5></td>
                                          </tr> */}

                                          {item.approval_Console === 'Select Approval_Console' &&
                                            <tr>
                                              <td><h5>Approver :</h5></td>
                                              <td><h5 className='text-primary'>{item.approvalConsoleDoerName}</h5>
                                              </td>
                                            </tr>}

                                        </tbody>
                                      </table>
                                    </Col>
                                  </Row>

                                  <hr className='my-1' />
                                  <Row className=''>
                                    {item.processID === 'ACC.01' &&
                                      <Col lg={4}>
                                        <tr>
                                          <td> <h5 >Initiation period : </h5></td>
                                          <td><h5 className='text-primary'>{formatPeriod(item.createdDate)}</h5></td>
                                        </tr>
                                        {/* <tr>
                                         <td> <h5 >Source : </h5></td>
                                         <td><h5 className='text-primary'>Source</h5>
                                         </td>
                                       </tr> */}

                                      </Col>
                                    }

                                    {/* <Col lg={4}>
                                      <tr>
                                        <td> <h5 >Week : </h5></td>
                                        <td><h5 className='text-primary'>Source</h5></td>
                                      </tr>
                                      <tr>
                                        <td> <h5 >Var Field 1 : </h5></td>
                                        <td><h5 className='text-primary'>Var Field 1</h5>
                                        </td>
                                      </tr>

                                    </Col> */}
                                    {item.processID === 'ACC.01' &&
                                      <Col lg={4}>
                                        <tr>
                                          <td> <h5>Mess Manager : </h5></td>
                                          <td><h5 className='text-primary'>Mess Manager Name</h5></td>
                                        </tr>
                                        {/* <tr>
                                          <td> <h5 className='mb-1'>Var Field 2 : </h5></td>
                                          <td><h5 className='text-primary'>Var Field 2</h5>
                                          </td>
                                        </tr> */}

                                      </Col>
                                    }

                                  </Row>
                                  <hr className='my-1' />
                                  <Row>
                                    <Col lg={3} className='mt-2'>
                                      <td><h5>Created Date :</h5></td>
                                      <td><h5 className='text-primary'>{format(new Date(item.createdDate), 'dd-MMM-yyyy HH:mm')}</h5></td>
                                    </Col>
                                    <Col lg={3} className='mt-2'>
                                      <td><h5>Extended Date :</h5></td>
                                      <td><h5 className='text-primary'>N/A</h5></td>
                                    </Col>
                                    <Col lg={3} className='mt-2'>
                                      <td><h5>Completed Date :</h5></td>
                                      <td><h5 className='text-primary'>N/A</h5></td>
                                    </Col>
                                    <Col lg={3} className=''>
                                      <div className=' d-flex justify-content-end align-items-center'>
                                        <span className='text-primary me-2 cursor-pointer fw-bold' onClick={() => handleViewEditOutput(item.taskCommonId)}>View Output</span>
                                        <span className='text-primary cursor-pointer me-2 fw-bold' onClick={() => handleViewEdit(item.taskCommonId)}>Hierarchy  View</span>
                                        <span className='text-primary me-2 fw-bold'>Help</span>
                                        <Button className='ms-auto ' onClick={() => handleEdit(item.taskCommonId, item.condition_Json, item)}>
                                          Finish
                                        </Button>
                                      </div>
                                    </Col>
                                  </Row>
                                </div>
                              </Collapse>
                            </td>
                          </tr>
                          : ''
                        }
                      </React.Fragment>
                    ))
                  ) : (
                    <tr><td colSpan={columns.length + 1}> <Container className="mt-5">
                      <Row className="justify-content-center">
                        <Col xs={12} md={8} lg={6}>
                          <Alert variant="info" className="text-center">
                            <h4>No Task Found</h4>
                            <p>You currently don't have any tasks assigned.</p>
                          </Alert>
                        </Col>
                      </Row>
                    </Container></td></tr>
                  )}

                </tbody>
              </Table >
            </DragDropContext>
          </>
        )}
        <HeirarchyView showView={showView} setShowView={setShowView} id={manageId} />
        <ViewOutput showViewOutput={showViewOutput} setShowViewOutput={setShowViewOutput} preData={preData} />

      </div>
      <div className="d-flex justify-content-center align-items-center bg-white w-20 rounded-5 m-auto py-1 pb-1 my-2 pagination-rounded">
        <Pagination>
          <Pagination.First
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          />
          <Pagination.Prev
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          />
          <Pagination.Item active>{currentPage}</Pagination.Item>
          <Pagination.Next
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          />
          <Pagination.Last
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </div>
      {activeNode && (
        <Modal show={true} onHide={handleCloseActiveForm} size='xl'>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>

            {/* <div className='col-12' style={{ height: 'calc(100vh - 200px)', position: 'relative' }}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                // onNodesChange={handleNodesChange}
                // onEdgesChange={onEdgesChange}
                // onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                // onDrop={handleDrop}
                // onDragOver={handleDragOver}
                // onEdgeClick={handleEdgeClick}
                // onNodeClick={onNodeClick}
              >
                <MiniMap />
                <Controls />
                <Background />
              </ReactFlow>
            </div> */}
            <ActiveNode activeNode={activeNode} activeTaskId={activeTaskId} setActiveNode={setActiveNode} completedNodes={completedNodes} setCompletedNodes={setCompletedNodes} pId={pId} />
          </Modal.Body>
        </Modal>
      )}
    </>

  );
};

export default ProjectAssignTable;