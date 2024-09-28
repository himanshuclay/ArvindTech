import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, Collapse, Accordion } from 'react-bootstrap'; // Assuming DynamicForm is in the same directory
import { FileUploader } from '@/components/FileUploader'

interface ProjectAssignListWithDoer {
  id: number;
  projectId: string;
  projectName: string;
  moduleID: string;
  moduleName: string;
  processID: string;
  processName: string;
  role: string;
  task_Json: string;
  task_Number: string;
  createdBy: string;
  status: 'Pending' | 'Done';
}

interface ApiResponse {
  isSuccess: boolean;
  message: string;
  taskAssignListWithDoers: ProjectAssignListWithDoer[];
}

const ProjectAssignTable: React.FC = () => {
  const [data, setData] = useState<ProjectAssignListWithDoer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const role = localStorage.getItem('EmpId') || '';
        const response = await axios.get<ApiResponse>(
          `https://arvindo-api.clay.in/api/ProcessInitiation/GetDoerTaskListById?DoerId=${role}`
        );

        if (response.data && response.data.isSuccess) {
          setData(response.data.taskAssignListWithDoers || []);
          console.log(data)
        }

        else {
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
          const response = await axios.get(`https://arvindo-api2.clay.in/api/CommonDropdown/GetMessandManagerListByProjectName?ProjectName=${projectName}`);
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
    
      // Handle 'select' and 'CustomSelect' input type
      if (input && (input.type === 'select' || input.type === 'CustomSelect')) {
        const selectedOption = input.options?.find(option => option.label === value);
        if (selectedOption) {
          updatedValue = selectedOption.id;  // Use option ID instead of label
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
            break;
          case 'checkbox':
            updatedValue = value as boolean;  // Boolean for checkboxes
            break;
          case 'radio':
            updatedValue = value as boolean;  // Boolean for radio buttons
            break;
          case 'date':
            updatedValue = value as string;  // Date input will give a string value (ISO format)
            break;
          case 'file':
            // For file input, handle the file uploading separately
            // updatedValue = (e.target.files[0] as File);  // Placeholder for file handling
            break;
          default:
            break;
        }
      }
    
      // Update the formState with the new value
      setFormState(prevState => {
        // Only include updates for inputIds that are not in the excluded list
        const newState = {
          ...prevState,
          ...(excludedInputIds.includes(inputId) ? {} : { [inputId]: updatedValue })
        };
    
        // Re-evaluate conditions after state update
        reEvaluateConditions(newState);
    
        return newState;
      });
    };

    const handleSubmit = async (event: React.FormEvent, taskNumber: string) => {
      event.preventDefault();
      const role = localStorage.getItem('EmpId') || '';
  
      // Prepare the data to be posted
      const requestData = {
        id: 0,
        doerID: role || '',
        task_Json: JSON.stringify(formState),  // Assume formState is defined
        isExpired: 0,
        isCompleted: formState['isCompleted'] || 'false',
        task_Number: taskNumber,
        summary: formState['summary'] || 'Task Summary',
      };
      console.log(requestData)
  
      setLoading(true);  // Show loader when the request is initiated
  
      try {
        const response = await fetch('https://arvindo-api.clay.in/api/ProcessInitiation/UpdateDoerTask', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });
  
        if (response.ok) {
          const responseData = await response.json();
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
        console.log(otherInput)
        if (otherInput.options && otherInput.options.some(option => option.id === conditionValue)) {
          return formState[otherInput.inputId] === conditionValue;
        }
      }

      return false;
    };

    return (
      <>

        <Accordion key={taskNumber}
          defaultActiveKey="0"
          className="mb-3"
          activeKey={activeKey}
          onSelect={(eventKey) => setActiveKey(eventKey as string | null)}>
          {/* <form onSubmit={handleSubmit}> */}
          <form onSubmit={(event) => handleSubmit(event, taskNumber)}>
            <Accordion.Item eventKey={taskNumber}>
              <Accordion.Header as="h2" >
                <div className='fs-6 mb-1 fw-bolder'>Task Name</div>
                <div className='col-12 fs-5 text-primary'>{formData.inputs.find((input: { inputId: string; label: string }) => input.inputId === "99")?.label}</div>
              </Accordion.Header>
              <Accordion.Body>
                {messList.map((mess, index) => (
                  <React.Fragment key={mess.messID}>
                    <span>Mess {index + 1}: {mess.messName}</span>
                    <div className="my-task">
                      {formData.inputs.map((input: Input) => (
                        shouldDisplayInput(input) && (
                          <div className='m-3 form-group' key={input.inputId} style={{ marginBottom: '1rem' }}>
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
                <div className="col-12 d-flex justify-content-end">
                  <button className='btn btn-primary' type="submit" style={{ padding: '0.5rem 1rem' }}>
                    Submit
                  </button>
                </div>

              </Accordion.Body>

            </Accordion.Item>


          </form>
        </Accordion>
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

  return (
    <div>
      <div className="d-flex p-2 bg-white mt-2 mb-2 rounded shadow"><h5 className='mb-0'>Pending Task</h5></div>
      {data.length === 0 ? (
        <p>No data available.</p>
      ) : (
        <Table className='bg-white' striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Module ID</th>
              <th>Module Name</th>
              <th>Process ID</th>
              <th>Process Name</th>
              <th>Task Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <React.Fragment key={item.id}>
                <tr
                  style={{
                    backgroundColor: item.status === 'Done' ? 'lightgreen' : 'white',
                  }}
                >
                  <td>{item.id}</td>
                  <td>{item.moduleID}</td>
                  <td>{item.moduleName}</td>
                  <td>{item.processID}</td>
                  <td>{item.processName}</td>
                  <td>{item.task_Number}</td>
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
  );
};

export default ProjectAssignTable;