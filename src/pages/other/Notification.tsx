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
          `https://localhost:44382/api/AccountModule/GetTaskAssignListWithDoer?Flag=2&DoerId=${role}`
        );

        if (response.data && response.data.isSuccess) {
          setData(response.data.taskAssignListWithDoers || []);
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
    console.log(data)

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
  
    // Handle change in input values
    const handleChange = (inputId: string, value: string | boolean) => {
      const input = formData.inputs.find(input => input.inputId === inputId);
  
      let updatedValue = value;
      if (input && input.type === 'select') {
        const selectedOption = input.options?.find(option => option.label === value);
        if (selectedOption) {
          updatedValue = selectedOption.id;
        }
      }
  
      setFormState(prevState => {
        const newState = {
          ...prevState,
          [inputId]: updatedValue
        };
  
        // Trigger re-evaluation of conditions
        reEvaluateConditions(newState);
  
        return newState;
      });
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
                {[...Array(2)].map((_, index) => (
                  <React.Fragment key={index}>
                    <span>Mess {index + 1}</span>
                    <div className='my-task'>
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

                      <div className="col-12 d-flex justify-content-end">
                        <button className='btn btn-primary' type="submit" style={{ padding: '0.5rem 1rem' }}>
                          Submit
                        </button>
                      </div>
                    </div>
                  </React.Fragment>
                ))}

              </Accordion.Body>

            </Accordion.Item>


          </form>
        </Accordion>
      </>
    );
  };


  const handleStatusToggle = (id: number) => {
    setData(prevData =>
      prevData.map(item =>
        item.id === id
          ? { ...item, status: item.status === 'Pending' ? 'Done' : 'Pending' }
          : item
      )
    );
  };

  const toggleExpandRow = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleDoerChange = (taskNumber: string, selectedOption: any) => {
    // Handle the change for doer selection
    console.log(`Doer changed for task ${taskNumber}:`, selectedOption);
  };

  const handleSubmit = (event: React.FormEvent, taskNumber: string) => {
    event.preventDefault();
    // Handle form submission here
    console.log(`Form submitted for task ${taskNumber}`);
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
