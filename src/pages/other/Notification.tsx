import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, Collapse, Offcanvas, } from 'react-bootstrap'; // Assuming DynamicForm is in the same directory
import { FileUploader } from '@/components/FileUploader'
import { useNavigate } from 'react-router-dom';

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

const ProjectAssignTable: React.FC = () => {
  const [data, setData] = useState<ProjectAssignListWithDoer[]>([]);
  const [preData, setPreData] = useState<FilteredTask[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [parsedCondition, setParsedCondition] = useState<any[]>([]);
  const [taskCommonId, setTaskCommonId] = useState<number | null>(null);
  // const [formState, setFormState] = useState<any>({});
  const [show, setShow] = useState(false);
  const navigate = useNavigate()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const role = localStorage.getItem('EmpId') || '';
        const response = await axios.get<ApiResponse>(
          `https://localhost:44382/api/ProcessInitiation/GetFilterTask?Flag=1&DoerId=${role}`
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
            setTaskCommonId(commonId);
            localStorage.setItem('taskCommonId', commonId);  // Use a string key for localStorage
            console.log("This is updated:", commonId);  // Log the correct value
          } else {
            console.error('No taskCommonId values found.');
          }
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
          `https://localhost:44382/api/ProcessInitiation/GetFilterTask?TaskCommonId=${taskCommonId}&Flag=${flag}`
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

    // Initialize form state
    useEffect(() => {
      const initialState: { [key: string]: any } = {};
      formData.inputs.forEach((input: Input) => {
        initialState[input.inputId] = input.value || '';
      });
      setFormState(initialState);
    }, [formData]);

    const [messList, setMessList] = useState<{ messID: string; messName: string; managerEmpID: string; managerName: string }[]>([]);
    const projectName = 'PNC_DELHI_VADODARA_PKG29'; // Replace this with the actual project name from your state

    useEffect(() => {
      const fetchMessData = async () => {
        try {
          const response = await axios.get(`https://localhost:44307/api/CommonDropdown/GetMessandManagerListByProjectName?ProjectName=${projectName}`);
          if (response.data.isSuccess) {
            setMessList(response.data.messProjectListResponses);
          } else {
            console.error('Failed to fetch mess data');
          }
        } catch (error) {
          console.error('Error fetching mess data:', error);
        }
      };

      if (projectName) {
        fetchMessData();
      }
    }, [projectName]);

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
          selectedLabel = selectedOption.label;  // Capture label for display
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
      const role = localStorage.getItem('EmpId') || '';
      const taskData = data.find(task => task.task_Number === taskNumber);

      // Prepare the data to be posted
      const taskCommonId = localStorage.getItem('taskCommonId') || 0;  // Retrieve from localStorage or set to 0 if not found

      const requestData = {
        id: taskData?.id || 0,
        doerID: role || '',
        task_Json: taskJson,  // Use the updated taskJson state
        isExpired: 0,
        isCompleted: formState['Pending'] || 'Completed',
        task_Number: taskNumber,
        summary: formState['summary'] || 'Task Summary',  // Ensure summary is from formState
        condition_Json: JSON.stringify(parsedCondition),  // Assuming parsedCondition is defined
        taskCommonId: taskCommonId,  // Use the taskCommonId fetched from localStorage or state
        updatedBy: role
      };

      console.log(requestData);

      setLoading(true);  // Show loader when the request is initiated

      try {
        const response = await fetch('https://localhost:44382/api/ProcessInitiation/UpdateDoerTask', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        if (response.ok) {
          const responseData = await response.json();
          navigate('/pages/completedTask')
          console.log('Task updated successfully:', responseData);
        } else {
          console.error('Failed to update the task:', response.statusText);
        }
      } catch (error) {
        console.error('Error occurred while updating task:', error);
      } finally {
        setLoading(false);  // Hide loader when the request completes (success or error)
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
        <Offcanvas className="p-3" show={show} onHide={handleClose} >



          {messList.map((mess, index) => (
            <React.Fragment key={mess.messID}>
              {preData.map((task, index) => (
                <div key={index}>
                  <h5 className='mt-2'>Updated data from <span className='text-primary'>{task.taskNumber}</span></h5>
                  <div>
                    {task.inputs.map((input, idx) => (
                      <div key={idx}>
                        <strong>{input.label}:</strong> <span className='text-primary'>{input.value}</span>
                      </div>
                    ))}
                  </div>
                  <hr />
                </div>
              ))}
            </React.Fragment>
          ))}
          {/* {/ <form onSubmit={handleSubmit}> /} */}
          <form className='' onSubmit={(event) => handleSubmit(event, taskNumber)}>
            {/* <Accordion.Item eventKey={taskNumber}> */}
            <div className='d-flex flex-column mt-2'>
              <div className='fs-6 mb-1 fw-bolder col-12'>Task Name</div>
              <div className='col-12 fs-5 text-primary'>{formData.inputs.find((input: { inputId: string; label: string }) => input.inputId === "99")?.label}</div>
            </div>
            <Offcanvas.Body className='p-0 mt-3'>
              {messList.map((mess, index) => (
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
                            // <input
                            //     type="file"
                            //     placeholder={'file'}
                            //     onChange={e => handleChange(input.fileId, e.target.value)}
                            //     style={{ display: 'block', width: '100%', padding: '0.5rem' }}
                            // />
                            <FileUploader
                              icon="ri-upload-cloud-2-line"
                              text="Drop files here or click to upload."

                            />
                          )}

                          {input.type === 'checkbox' && (
                            // <input

                            //     className='form-control'

                            // />
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
                  </div>
                </React.Fragment>
              ))}
              <div className="form-group">
                <label htmlFor="taskSummary">Write Task Summary</label>
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
              </div>

            </Offcanvas.Body>

            {/* </Accordion.Item> */}


          </form>
          {/* </Accordion> */}
        </Offcanvas>
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


  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
  };

  return (

    <>
      <div>
        <div className="d-flex p-2 bg-white mt-2 mb-2 rounded shadow"><h5 className='mb-0'>Pending Task</h5></div>
        {data.length === 0 ? (
          <p>No data available.</p>
        ) : (
          <Table className='bg-white' striped bordered hover>
            <thead>
              <tr>
                {/* {/ <th>ID</th> /} */}
                {/* <th>Module ID</th> */}
                <th>Sr.no </th>
                <th>Module </th>
                {/* <th>Process ID</th> */}
                <th>Process </th>
                <th>Project </th>
                <th>Assigned Role</th>
                <th>Task Id</th>
                <th>Task Type</th>
                <th>Planned Date</th>
                <th>Initation Date</th>
                <th>Actions</th>
                <th>CondtionJson</th>
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
                    {/* {/ <td>{item.id}</td> /} */}
                    {/* <td>{item.moduleID}</td> */}
                    <td>{item.moduleName}</td>
                    {/* <td>{item.processID}</td> */}
                    <td>{item.processName}</td>
                    <td>{item.projectName}</td>
                    <td>{item.roleName}</td>
                    <td>{item.task_Number}</td>
                    <td>{item.taskType}</td>
                    <td>{item.taskTime}</td>
                    <td>{item.createdDate}</td>
                    <td>
                      <Button onClick={handleShow}>
                        Show
                      </Button>
                    </td>
                    <td>
                      <Button onClick={() => toggleExpandRow(item.id)}>
                        {expandedRow === item.id ? 'Hide' : 'Show'}
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
                          // Add other props as needed
                          />
                        </div>
                      </Collapse>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </>

  );
};

export default ProjectAssignTable;