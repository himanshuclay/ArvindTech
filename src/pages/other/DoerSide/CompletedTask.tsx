import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { Button, Table, Container, Row, Col, Alert, Modal, Pagination } from 'react-bootstrap';
// import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import config from '@/config';
import MessCards from '../Component/Previous&Completed';
import { getPlannedDate } from '../Component/PlanDateFunction';
import ReactFlow, { Background, Controls, MiniMap, Node, useEdgesState, useNodesState } from 'reactflow';
import CustomNode from '@/pages/WorkflowBuilder/CustomNode';
import { FIELD, PROPERTY } from '@/pages/FormBuilder/Constant/Interface';
import STAFF_ALLOCATION_PLAN from '@/pages/WorkflowBuilder/DynamicSegment/STAFF_ALLOCATION_PLAN';
import APPOINTMENT from '@/pages/WorkflowBuilder/DynamicSegment/APPOINTMENT';
import NEW_APPOINTMENT from '@/pages/WorkflowBuilder/DynamicSegment/NEW_APPOINTMENT';
import OLD_STAFF_TRANSFER from '@/pages/WorkflowBuilder/DynamicSegment/OLD_STAFF_TRANSFER';
import INDUCTION from '@/pages/WorkflowBuilder/DynamicSegment/INDUCTION';
import UPDATE_EMPLOYEE from '@/pages/WorkflowBuilder/DynamicSegment/UPDATE_EMPLOYEE';
import APPOINTMENT_LETTER from '@/pages/WorkflowBuilder/DynamicSegment/APPOINTMENT_LETTER';
import ASSIGN_TASK from '@/pages/WorkflowBuilder/DynamicSegment/ASSIGN_TASK';
import Editor from '@/pages/FormBuilder/Editor';
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
  task_Json: string;
  task_Number: string;
  task_Status: 1;
  isExpired: 0;
  taskCommonId: number;
  expiredSummary: null;
  createdBy: string;
  status: string;
  isCompleted: string;
  condition_Json: string;
  createdDate: string;
  completedDate: string;
  taskTime: string;
  taskType: string;
  roleName: string;
  inputs: string;
  messID: string;
  planDate: string;
  plannedDate: string;
  taskName: string;
}

interface ApiResponse {
  isSuccess: boolean;
  message: string;
  getFilterTasks: ProjectAssignListWithDoer[];
  totalCount: any;
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
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);

  const [, setSelectedNode] = useState<Node | null>(null);
  const [showFormBuilder, setShowFormBuilder] = useState(false);
  const [formBuilder, setFormBuilder] = useState<FIELD>({
    name: '',
    blocks: [],
    editMode: true,
    blockCount: 0,
    configureSelectionLogics: [],
    rules: [],
    advance: {
      backgroundColor: '',
      color: '',
    }
  });
  const [property, setProperty] = useState<PROPERTY>({
    label: '',
    id: '',
    placeholder: '',
    value: '',
    type: '',
    required: "false",
    options: [{ label: '', value: '' }],
    advance: {
        backgroundColor: '',
        color: '',
    },
    isShow: false,
    disabled: false,
})
  const [, setIsAddFormBuilder] = useState(false);
  const [dynamicComponent, setDynamicComponent] = useState<string>('');

  const componentMap: { [key: string]: React.FC<any> } = {
    STAFF_ALLOCATION_PLAN: React.forwardRef((props, ref) => <STAFF_ALLOCATION_PLAN {...props} ref={ref} />),
    APPOINTMENT: React.forwardRef((props, ref) => <APPOINTMENT {...props} ref={ref} />),
    NEW_APPOINTMENT: React.forwardRef((props, ref) => <NEW_APPOINTMENT {...props} ref={ref} />),
    OLD_STAFF_TRANSFER: React.forwardRef((props, ref) => <OLD_STAFF_TRANSFER {...props} ref={ref} />),
    INDUCTION: React.forwardRef((props, ref) => <INDUCTION {...props} ref={ref} />),
    UPDATE_EMPLOYEE: React.forwardRef((props, ref) => <UPDATE_EMPLOYEE {...props} ref={ref} />),
    APPOINTMENT_LETTER: React.forwardRef((props, ref) => <APPOINTMENT_LETTER {...props} ref={ref} />),
    ASSIGN_TASK: React.forwardRef((props, ref) => <ASSIGN_TASK {...props} ref={ref} />),
  };

  const componentRefMap = useRef<{ [key: string]: any }>({});
  const [blockValue, setBlockValue] = useState({})


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


  // Function to handle node selection
  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    console.log(node);
    if (node.data.completedBy && node.data.completedBy == localStorage.getItem("EmpId")) {
      setSelectedNode(node); // ✅ Sets the node you're editing
      // console.log(node.data.blockValue);
      // console.log(setShowFormBuilder);
      setBlockValue(node.data.blockValue);
      if (node.data.form?.blocks?.length) {
        setShowFormBuilder(true);
        setFormBuilder(node.data.form); // ✅ Prefill existing form
        setIsAddFormBuilder(false);
      } else {
        if (node.data.form != "ADD_NODE")
          setDynamicComponent(node.data.form);
      }
    } else if (!node.data.completedBy) {
      // setSelectedNode(node); // ✅ Sets the node you're editing
      // console.log(node.data.blockValue);
      // setBlockValue(node.data.blockValue);
      // if (node.data.form?.blocks?.length) {
      //   setShowFormBuilder(true);
      //   setFormBuilder(node.data.form); // ✅ Prefill existing form
      //   setIsAddFormBuilder(false);
      // } else {
      //   if (node.data.form != "ADD_NODE")
      //     setDynamicComponent(node.data.form);
      // }
    }
  }, []);

  const nodeTypes = useMemo(() => ({
    custom: (props: any) => <CustomNode {...props} setNodes={setNodes} edges={edges} isCompleteTask={true} />,
  }), [setNodes, edges]);  // ✅ Include edges in dependencies

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
      setLoading(true);
      try {
        const role = localStorage.getItem('EmpId') || '';
        const response = await axios.get<ApiResponse>(
          `${config.API_URL_ACCOUNT}/ProcessInitiation/GetFilterTask`,
          {
            params: {
              Flag: 2,
              DoerId: role,
              PageIndex: currentPage, // Adding pagination support
            },
          }
        );
        console.log('response', response)
        setLoading(true);
        try {
          const role = localStorage.getItem('EmpId') || '';
          const response = await axios.get<ApiResponse>(
            `${config.API_URL_ACCOUNT}/ProcessInitiation/GetFilterTask`,
            {
              params: {
                Flag: 2,
                DoerId: role,
                PageIndex: currentPage, // Adding pagination support
              },
            }
          );
          console.log('response', response)

          if (response.data?.isSuccess) {
            setData(response.data.getFilterTasks || []);
            setTotalPages(Math.ceil(response.data.totalCount / 10)); // Setting pagination
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
        if (response.data?.isSuccess) {
          setData(response.data.getFilterTasks || []);
          setTotalPages(Math.ceil(response.data.totalCount / 10)); // Setting pagination
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
  }, [currentPage]); // Added currentPage as a dependency for pagination




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


  const handleEdit = (taskCommonId: number, item: any) => {
    fetchPreData(taskCommonId);
    setShow(true);
    if (item.templateJson) {
      const templateJson = JSON.parse(item.templateJson);
      setNodes(templateJson.nodes);
      setEdges(templateJson.edges);
    }
  };

  const handleClose = () => {
    setShow(false);
    setPreData([]);
  };


  const handleFormClose = () => {
    setDynamicComponent('')
    setShowFormBuilder(false);
  };


  if (loading) {
    return <div className="loader-fixed">Loading...</div>;
  }

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
          {preData.length
            ?
            <MessCards data={preData} />
            :
            <>
              <div className='col-12' style={{ height: 'calc(100vh - 200px)', position: 'relative' }}>
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
                  onNodeClick={onNodeClick}
                >
                  <MiniMap />
                  <Controls />
                  <Background />
                </ReactFlow>
              </div>
            </>
          }
        </Modal.Body>
      </Modal>

      <Modal size='xl' show={showFormBuilder} onHide={handleFormClose} placement="end">
        <Modal.Header closeButton>
          <Modal.Title>Task Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formBuilder?.blocks?.length ? (
            <Editor
            form={formBuilder}
            setForm={setFormBuilder}
            property={property}
            setProperty={setProperty}
            blockValue={blockValue}
            setBlockValue={setBlockValue}
            isShowSave={false}
            isPreview={true}
            />
          ) : ''}
        </Modal.Body>
      </Modal>

      {dynamicComponent && (
        <Modal
          show={true}
          backdrop="static"
          size='xl'
          onHide={handleFormClose}
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Task for</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <fieldset disabled style={{ pointerEvents: "none" }}>
              {dynamicComponent && componentMap[dynamicComponent] && React.createElement(componentMap[dynamicComponent], {
                ref: (instance: any) => {
                  if (instance) {
                    componentRefMap.current[dynamicComponent] = instance;
                  }
                },
                blockValue: blockValue
              })}
            </fieldset>
          </Modal.Body>
        </Modal>
      )}



      <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center fs-20">
        <span><i className="ri-file-list-line me-2"></i><span className='fw-bold test-nowrap'>Completed Task</span></span>
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
                                    col.id === 'planDate' ? (
                                      <>
                                        {item.task_Number === 'ACC.01.T1' ? (
                                          calculatePlannedDate(item.createdDate)
                                        ) : (
                                          getPlannedDate(item.createdDate, item.planDate)

                                        )}
                                      </>
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
                            <Button onClick={() => handleEdit(item.taskCommonId, item)}>
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
    </>
  );
};

export default ProjectAssignTable;