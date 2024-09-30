import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, Collapse, Offcanvas, Container, Row, Col, Alert, Modal } from 'react-bootstrap'; // Assuming DynamicForm is in the same directory
import { FileUploader } from '@/components/FileUploader'
import { useNavigate } from 'react-router-dom';
import { format, addDays, parse } from 'date-fns';
import config from '../../config';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';



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
          localStorage.setitem(taskCommonId)
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



  interface Option {
    id: string;
    label: string;
    color?: string;
  }

  interface Input {
    inputId: string;
    type: string;
    label: string;
    placeholder: string;
    options?: Option[];
    required: boolean;
    conditionalFieldId?: string;
    value?: string | boolean;
  }

  interface DynamicFormProps {
    formData: { inputs: Input[] };
    taskNumber: string;
    doer: string | null;
    onDoerChange: (taskNumber: string, selectedOption: Option | null) => void;
  }


  const DynamicForm: React.FC<DynamicFormProps> = ({ formData, taskNumber, doer, onDoerChange }) => {
    const [formState, setFormState] = useState<{ [key: string]: any }>({});
    const [summary, setSummary] = useState('');
    const [taskJson, setTaskJson] = useState<string>(JSON.stringify(formData));
    const [messManagers, setMessManagers] = useState<{ value: string, label: string }[]>([]);
    const [selectedManager, setSelectedManager] = useState<string>("Avisineni Pavan Kumar_LLP05337"); // Initialize with default value
    const [showMessManagerSelect, setShowMessManagerSelect] = useState(false);

    useEffect(() => {
      const fetchMessManagers = async () => {
        try {
          const response = await axios.get(`${config.API_URL_APPLICATION}/CommonDropdown/GetMessManagerNameListWithId`);
          const data = response.data.messManagerNameLists;

          // Map the response data to the format required for the Select component
          const formattedData = data.map((manager: { messManagerEmpId: string, messManagerName: string }) => ({
            value: manager.messManagerEmpId,
            label: manager.messManagerName
          }));

          setMessManagers(formattedData);
        } catch (error) {
          console.error('Error fetching mess managers:', error);
        }
      };

      fetchMessManagers();
    }, []);

    const handleSelectMessImpChange = (selectedOption: any) => {
      setSelectedManager(selectedOption ? selectedOption.value : null);
      console.log('Selected manager ID:', selectedOption ? selectedOption.value : null);
    };

    // Initialize form state
    useEffect(() => {
      const initialState: { [key: string]: any } = {};
      formData.inputs.forEach((input: Input) => {
        initialState[input.inputId] = input.value || '';
      });
      setFormState(initialState);
    }, [formData]);

    const [messList, setMessList] = useState<{ messID: string; messName: string; managerEmpID: string; managerName: string }[]>([]);
    const projectNames = data.map((item) => item.projectName); // Replace this with the actual project name from your state

    useEffect(() => {
      const fetchMessData = async () => {
        try {
          const response = await axios.get(`${config.API_URL_APPLICATION}/CommonDropdown/GetMessandManagerListByProjectName?ProjectName=${projectNames}`);
          if (response.data.isSuccess) {
            setMessList(response.data.messProjectListResponses);
          } else {
            console.error('Failed to fetch mess data');
          }
        } catch (error) {
          console.error('Error fetching mess data:', error);
        }
      };

      console.log("this is given data", parsedCondition)

      if (projectNames) {
        fetchMessData();
      }
    }, [projectNames]);

    interface Condition {
      inputId: string;
      optionId: string;
      taskNumber: string;
      taskTiming: string;
      taskType: string;
      daySelection: string;
    }


    const [selectedCondition, setSelectedCondition] = useState<any[]>([]);
    const [currentStep, setCurrentStep] = useState(0); // Track the current step

    // const handleNextStep = () => {
    //   if (currentStep < messList.length - 1) {
    //     setCurrentStep(prevStep => prevStep + 1);  // Move to next step
    //   }
    // };
    const handleNextStep = () => {
      if (currentStep < messList.length) {
        // Save data for the current mess before moving to the next step
        const currentMessId = messList[currentStep].messID;
        const currentData = {
          messId: currentMessId,
          inputs: formState,
          summary: summary,
        };
        // You can save `currentData` to your backend or state management here
  
        // Move to the next step
        setCurrentStep(prevStep => prevStep + 1);
        // Reset formState for the next mess
        setFormState({});
        setSummary('');
      }
    };

    const handlePrevStep = () => {
      if (currentStep > 0) {
        setCurrentStep(prevStep => prevStep - 1);  // Move to previous step
      }
    };

    // Handle change in input values
    const handleChange = (inputId: string, value: string | boolean | string[]) => {
      // Find the input field in the formData
      const excludedInputIds = ['99', '100', '102', '103'];
      const input = formData.inputs.find(input => input.inputId === inputId);

      let updatedValue = value;
      let selectedLabel: string | undefined;

      if (input) {
        selectedLabel = input.label;
      }

      if (input && (input.type === 'select' || input.type === 'CustomSelect')) {

        const selectedOption = input.options?.find(option => option.label === value);
        if (selectedOption) {
          updatedValue = selectedOption.id;  // Use option ID for internal use
          selectedLabel = selectedOption.label;
          const selectedConditionFromParsed = parsedCondition[0].find((condition: Condition) => condition.optionId === updatedValue);

          // Update the state with the selected condition
          if (selectedConditionFromParsed) {
            setSelectedCondition([selectedConditionFromParsed]); // Store selected condition in state
          }
          // Capture label for display
        }
        if (selectedOption?.id === '11-1') {
          setShowMessManagerSelect(true);
        } else if (selectedOption?.id !== '11-1') {
          setShowMessManagerSelect(false); // Hide if no 'active' value is selected
        }
      }

      // Handle 'multiselect' input type (storing an array of selected option IDs)
      if (input && input.type === 'multiselect') {
        updatedValue = (value as string[]).map(label => {
          const selectedOption = input.options?.find(option => option.label === label);
          return selectedOption ? selectedOption.id : label;
        });
      }

      // Handle 'text', 'radio', 'checkbox', 'date', and other input types
      if (input) {
        switch (input.type) {
          case 'text':
          case 'textarea':
            updatedValue = value as string;  // Handle simple text or textarea
            selectedLabel = input.label;  // Keep label from the input object
            break;
          case 'checkbox':
            updatedValue = value as boolean;  // Boolean for checkboxes
            selectedLabel = input.label;  // Capture checkbox label
            break;
          case 'radio':
            updatedValue = value as boolean;  // Boolean for radio buttons
            selectedLabel = input.label;  // Capture radio label
            break;
          case 'date':
            updatedValue = value as string;  // Date input will give a string value (ISO format)
            selectedLabel = input.label;  // Capture date label
            break;
          case 'file':
            // Handle file input separately
            break;
          default:
            break;
        }
      }

      // Update formState
      setFormState(prevState => {
        const newState = {
          ...prevState,
          ...(excludedInputIds.includes(inputId) ? {} : { [inputId]: updatedValue })
        };

        // Update taskJson only when inputId is not excluded
        if (!excludedInputIds.includes(inputId)) {
          const updatedTaskJson = JSON.stringify({
            ...formData,
            inputs: formData.inputs.map(input => ({
              ...input,
              value: newState[input.inputId] || input.value,
            })),
          });
          setTaskJson(updatedTaskJson);
        }

        // Re-evaluate conditions after state update
        reEvaluateConditions(newState);

        return newState;
      });
    };


    const handleSubmit = async (event: React.FormEvent, taskNumber: string) => {
      event.preventDefault();
    
      const role = localStorage.getItem('EmpId') || ''; // Fetch role (EmpId) from localStorage
      const taskData = data.find(task => task.task_Number === taskNumber); // Find the task using taskNumber
    
      // Ensure taskData exists
      if (!taskData) {
        console.error("Task not found.");
        return;
      }
    
      const taskCommonId = localStorage.getItem('taskCommonId') || 0; // Retrieve taskCommonId or set default
      const conditionToSend = selectedCondition.length > 0 ? selectedCondition : parsedCondition[0]; // Use selected or fallback condition
    
      // Construct the taskJson for multiple messes using the fetched messList
      const taskJsonArray = messList.map(mess => ({
        messId: mess.messID, // Use the actual key for the mess ID
        taskJson: taskJson,  // Use the taskJson variable you have
      }));
    
      // Convert the taskJsonArray to a string
      const taskJsonString = JSON.stringify(taskJsonArray); // Convert array to JSON string
    
      // Prepare the request payload
      const requestData = {
        id: taskData.id || 0,  // Set task ID or default to 0
        doerID: role,  // Role fetched from localStorage
        task_Json: taskJsonString,  // Use the JSON string instead of array
        isExpired: 0,  // Assume not expired (can be modified)
        isCompleted:  'Pending', // Set completion status from formState
        task_Number: taskNumber,  // Task number from props or state
        summary: formState['summary'] || 'Task Summary',  // Get summary from formState
        condition_Json: JSON.stringify(conditionToSend),  // Stringify the selected condition
        taskCommonId: taskCommonId,  // Retrieved from localStorage
        updatedBy: role  // Set updatedBy to role/empId
      };
    
      console.log('Submitting task with data:', requestData);
    
      setLoading(true);  // Show loader during async operation
    
      try {
        const response = await fetch('https://localhost:44382/api/ProcessInitiation/UpdateDoerTask', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),  // Stringify the request payload
        });
    
        // Check if the response is ok
        if (response.ok) {
          const responseData = await response.json();
          console.log('Task updated successfully:', responseData);
    
          // Redirect to completedTask page with task details and success toast
          navigate('/pages/completedTask', { state: { showToast: true, taskName: taskData.task_Number } });
        } else {
          console.error('Failed to update the task:', response.statusText);
        }
      } catch (error) {
        console.error('Error occurred while updating task:', error);
      } finally {
        setLoading(false);  // Always hide loader after request is finished
      }
    };
    



    // Function to re-evaluate conditions for showing/hiding fields
    const reEvaluateConditions = (newState: { [key: string]: any }) => {
      const updatedState = { ...newState };

      formData.inputs.forEach((input) => {
        if (input.conditionalFieldId) {
          const conditionValue = newState[input.conditionalFieldId];
          const shouldDisplay = conditionValue === input.conditionalFieldId;

          if (shouldDisplay) {
            // Ensure the input is displayed if condition is met
            updatedState[input.inputId] = newState[input.inputId] || '';
          } else {
            // Optionally reset value if condition is not met
            // updatedState[input.inputId] = ''; // or keep existing value
          }
        }
      });

      setFormState(updatedState);
    };

    const shouldDisplayInput = (input: Input): boolean => {
      if (!input.conditionalFieldId) return true;

      const conditionValue = input.conditionalFieldId;
      if (conditionValue === 'someid') return true;

      for (const otherInput of formData.inputs) {
        if (otherInput.inputId === conditionValue) {
          return formState[otherInput.inputId] !== '';

        }
        // console.log(otherInput)
        if (otherInput.options && otherInput.options.some(option => option.id === conditionValue)) {
          return formState[otherInput.inputId] === conditionValue;
        }
      }

      return false;
    };


    return (
      <>
        <Modal className="p-3" show={show} placement="end" onHide={handleClose} >
          <Modal.Header closeButton className=' '>
            <Modal.Title className='text-dark'>Task Details</Modal.Title>
          </Modal.Header>


          {messList.map((mess, index) => (
            <React.Fragment key={mess.messID}>
              {preData.map((task, index) => (
                <div key={index}>
                  {selectedTasknumber != task.taskNumber && (
                    <>
                      <h5 className='mt-2'>Updated data from <span className='text-primary'>{task.taskNumber}</span></h5>
                      <div>
                        {task.inputs.map((input, idx) => (
                          <div key={idx}>
                            <strong>{input.label}:</strong> <span className='text-primary'>{input.value}</span>
                          </div>
                        ))}
                      </div>
                      <hr />
                    </>
                  )}
                </div>
              ))}
            </React.Fragment>
          ))}
          {/* {/ <form onSubmit={handleSubmit}> /} */}
          <form className='side-scroll' onSubmit={(event) => handleSubmit(event, taskNumber)}>
            {/* <Accordion.Item eventKey={taskNumber}> */}
            <div className='d-flex flex-column mt-2 py-1 px-3'>
              <div className='fs-6 mb-1 fw-bolder col-12'>Task Name</div>
              <div className='col-12 fs-5 text-primary'>{formData.inputs.find((input: { inputId: string; label: string }) => input.inputId === "99")?.label}</div>
            </div>
            {/* <Offcanvas.Body className='p-0 mt-3'> */}



            {/* {messList.map((mess, index) => (
                <React.Fragment key={mess.messID}>
                  <h5>Please Update data for <span className='text-primary'>{mess.messName}</span></h5>
                  <div className="my-task">
                    {formData.inputs.map((input: Input) => (
                      shouldDisplayInput(input) && (
                        <div className='form-group' key={input.inputId} style={{ marginBottom: '1rem' }}>
                          <label className='label'>{input.label}</label>
                          {input.type === 'text' && (
                            <input
                              type="text"
                              className='form-control'
                              placeholder={input.placeholder}
                              value={formState[input.inputId]}
                              onChange={e => handleChange(input.inputId, e.target.value)}
                            />
                          )}
                          {input.type === 'custom' && (
                            <input
                              type="text"
                              placeholder={input.placeholder}
                              value={formState[input.inputId]}
                              onChange={e => handleChange(input.inputId, e.target.value)}
                              style={{ display: 'block', width: '100%', padding: '0.5rem' }}
                            />
                          )}
                          {input.type === 'select' && (
                            <select
                              id={input.inputId}
                              className='form-select form-control'
                              value={formState[input.inputId] || ''}
                              onChange={e => handleChange(input.inputId, e.target.value)}
                              style={{ display: 'block', width: '100%', padding: '0.5rem' }}
                            >
                              <option value="" disabled>Select an option</option>
                              {input.options?.map(option => (
                                <option key={option.id} value={option.label}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          )}

                          {input.type === 'multiselect' && (
                            <select
                              className='form-select form-control'
                              value={formState[input.inputId]}
                              onChange={e => handleChange(input.inputId, e.target.value)}
                              style={{ display: 'block', width: '100%', padding: '0.5rem' }}

                            >
                              <option value="" disabled>Select an option</option>
                              {input.options?.map(option => (
                                <option key={option.id} value={option.label}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          )}
                          {input.type === 'CustomSelect' && (
                            <select
                              value={formState[input.inputId]}
                              onChange={e => handleChange(input.inputId, e.target.value)}
                              style={{ display: 'block', width: '100%', padding: '0.5rem' }}

                            >
                              <option value="" disabled>Select an option</option>
                              {input.options?.map(option => (
                                <option key={option.id} value={option.label}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          )}
                          {input.type === 'file' && (
                          
                            <FileUploader
                              icon="ri-upload-cloud-2-line"
                              text="Drop files here or click to upload."

                            />
                          )}

                          {input.type === 'checkbox' && (
                         
                            <span className="form-check">
                              <input className="form-check-input" type="checkbox"
                                checked={formState[input.inputId]}
                                onChange={e => handleChange(input.inputId, e.target.checked)} />
                            </span>
                          )}
                          {input.type === 'radio' && (
                            <input
                              type="radio"
                              checked={formState[input.inputId]}
                              onChange={e => handleChange(input.inputId, e.target.checked)}
                            />
                          )}
                          {input.type === 'status' && (
                            <input
                              type="text"
                              checked={formState[input.inputId]}
                              onChange={e => handleChange(input.inputId, e.target.checked)}
                            />
                          )}
                          {input.type === 'successorTask' && (
                            <input
                              type="text"
                              checked={formState[input.inputId]}
                              onChange={e => handleChange(input.inputId, e.target.checked)}
                            />
                          )}
                          {input.type === 'date' && (
                            <input
                              type="date"
                              value={formState[input.inputId]}
                              onChange={e => handleChange(input.inputId, e.target.value)}
                              style={{ display: 'block', width: '100%', padding: '0.5rem' }}

                            />
                          )}
                        </div>
                      )

                    ))}
                    {showMessManagerSelect && (
                      <div className='form-group my-2'>
                        <label>Select Mess Manager</label>
                        <select
                          className='form-control'
                          value={selectedManager} // Bound to selectedManager state
                          onChange={handleSelectMessImpChange} // Updates state on change
                        >
                         
                          <option value="Avisineni Pavan Kumar_LLP05337">Avisineni Pavan Kumar_LLP05337</option>
                        
                          {messManagers.map((manager) => (
                            <option key={manager.value} value={manager.value}>
                              {manager.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </React.Fragment>

              ))} */}



            {/* <div className="form-group">
                <label htmlFor="taskSummary">Comments</label>
                <input
                  type="text"
                  className='form-control'
                  id="taskSummary"
                  value={summary}  // Bind the input to the state
                  onChange={(e) => setSummary(e.target.value)}  // Update the state on input change
                  style={{ display: 'block', width: '100%', padding: '0.5rem' }}
                />
              </div>
              <div className="col-12 d-flex justify-content-end mt-3">
                <button className='btn btn-primary' type="submit" style={{ padding: '0.5rem 1rem' }}>
                  Submit
                </button>
              </div> */}

            {/* </Offcanvas.Body> */}

            <Modal.Body className=" p-4">
              {/* Stepper on the Left */}
              <div className="stepper-vertical" style={{
                width: '100%',
                paddingRight: '10px',
                position: 'relative',
                display:'flex',
                justifyContent:'space-between',
                marginBottom:'20px'

              }}>
                {messList.map((mess, index) => {
                  let stepClass = 'step';

                  if (index < currentStep) {
                    stepClass += ' completed'; // Add class for completed steps
                  } else if (index === currentStep) {
                    stepClass += ' active'; // Add class for the current active step
                  }

                  return (
                    <div
                      key={mess.messID}
                      className={stepClass}
                      onClick={() => setCurrentStep(index)}
                      style={{
                        cursor: 'pointer',
                        padding: '10px 0',
                        margin: '0 0 5px 0',
                        background: index < currentStep ? 'green' : index === currentStep ? 'green' : '#e1e1e1', // Change color based on step status
                        color: "#fff", // Change text color for readability
                        borderRadius: '50%', // Optional: Add rounded corners
                        position: 'relative',
                      }}
                    >
                      {index + 1}

                      {/* Render the connecting line only if it's not the last step */}
                      {index < messList.length - 1 && (
                        <div
                          className={`step-line ${index < currentStep ? 'completed' : ''}`}
                          style={{
                            backgroundColor: index < currentStep ? 'green' : '#e1e1e1',
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>



              {/* Form on the Right */}
              <div className="form-section" style={{ width: '90%', paddingLeft: '20px' }}>
                {messList.map((mess, index) => (
                  currentStep === index && (
                    <div key={mess.messID}>
                      <h5>Please Update data for <span className='text-primary'>{mess.messName}</span></h5>
                      <div className="my-task">
                        {formData.inputs.map((input) => (
                          shouldDisplayInput(input) && (
                            <div className='form-group' key={input.inputId} style={{ marginBottom: '1rem' }}>
                              <label className='label'>{input.label}</label>
                              {input.type === 'text' && (
                                <input
                                  type="text"
                                  className='form-control'
                                  placeholder={input.placeholder}
                                  value={formState[input.inputId] || ''}
                                  onChange={e => handleChange(input.inputId, e.target.value)}
                                />
                              )}
                              {input.type === 'custom' && (
                                <input
                                  type="text"
                                  placeholder={input.placeholder}
                                  value={formState[input.inputId] || ''}
                                  onChange={e => handleChange(input.inputId, e.target.value)}
                                  style={{ display: 'block', width: '100%', padding: '0.5rem' }}
                                />
                              )}
                              {input.type === 'select' && (
                                <select
                                  id={input.inputId}
                                  className='form-select form-control'
                                  value={formState[input.inputId] || ''}
                                  onChange={e => handleChange(input.inputId, e.target.value)}
                                  style={{ display: 'block', width: '100%', padding: '0.5rem' }}
                                >
                                  <option value="" disabled>Select an option</option>
                                  {input.options?.map(option => (
                                    <option key={option.id} value={option.label}>
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                              )}
                              {input.type === 'multiselect' && (
                                <select
                                  className='form-select form-control'
                                  value={formState[input.inputId] || ''}
                                  onChange={e => handleChange(input.inputId, e.target.value)}
                                  style={{ display: 'block', width: '100%', padding: '0.5rem' }}
                                >
                                  <option value="" disabled>Select an option</option>
                                  {input.options?.map(option => (
                                    <option key={option.id} value={option.label}>
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                              )}
                              {input.type === 'file' && (
                                <FileUploader
                                  icon="ri-upload-cloud-2-line"
                                  text="Drop files here or click to upload."
                                />
                              )}
                              {input.type === 'checkbox' && (
                                <span className="form-check">
                                  <input className="form-check-input" type="checkbox"
                                    checked={formState[input.inputId] || false}
                                    onChange={e => handleChange(input.inputId, e.target.checked)} />
                                </span>
                              )}
                              {input.type === 'date' && (
                                <input
                                  type="date"
                                  value={formState[input.inputId] || ''}
                                  onChange={e => handleChange(input.inputId, e.target.value)}
                                  style={{ display: 'block', width: '100%', padding: '0.5rem' }}
                                />
                              )}
                            </div>
                          )
                        ))}
                      </div>
                      <div className="form-group mb-2">
                        <label htmlFor="taskSummary">Comments</label>
                        <input
                          type="text"
                          className='form-control'
                          id="taskSummary"
                          value={summary}  // Bind the input to the state
                          onChange={(e) => setSummary(e.target.value)}  // Update the state on input change
                          style={{ display: 'block', width: '100%', padding: '0.5rem' }}
                        />
                      </div>
                    </div>
                  )
                ))}

                {/* Navigation Buttons */}
                <div className="d-flex justify-content-between">
                  {currentStep <= messList.length - 1 && (
                    <button
                      type="button"  // Add this to prevent form submission
                      className="btn btn-secondary"
                      onClick={handlePrevStep}
                      disabled={currentStep === 0}
                    >
                      Previous
                    </button>
                  )}
                  {/* Conditional rendering of Next or Submit button */}
                  {currentStep < messList.length - 1 && (
                    <button
                      type="button"  // Add this to prevent form submission
                      className="btn btn-primary"
                      onClick={handleNextStep}
                    // disabled={currentStep === messList.length - 1}
                    >
                      Next
                    </button>
                  )}

                  {currentStep === messList.length - 1 && (
                    <button
                      type="submit"  // This button will submit the form
                      className="btn btn-success"
                    >
                      Submit
                    </button>
                  )}


                  {/* : (
                    <button
                      type="submit"  // This button will submit the form
                      className="btn btn-success"
                    >
                      Submit
                    </button>
                  )}


                  {step < 4 && (
                    <Button variant="primary" onClick={handleNext}>
                      Next
                    </Button>
                  )}
                  {step === 4 && (
                    <Button variant="success" type="submit">
                      Submit
                    </Button>
                  )} */}
                </div>
              </div>
            </Modal.Body>

            {/* </Accordion.Item> */}


          </form>
          {/* </Accordion> */}
        </Modal>

        
      </>
    );
  };

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
    return format(updatedDate, 'dd-MM-yyyy HH:mm:ss');
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