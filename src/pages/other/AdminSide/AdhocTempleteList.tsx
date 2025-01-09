import React, { useState, useEffect } from 'react';
import { Table, Button, Collapse } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
// import { FileUploader } from '@/components/FileUploader'
import config from '@/config';


// Define interface for form options
interface Option {
  id: string;
  label: string;
}

// Define interface for form inputs
interface Input {
  inputId: string;
  label: string;
  placeholder?: string;
  type: string;
  options?: Option[];
}

// Interface for form data containing form inputs
interface FormData {
  inputs: Input[];
}

// Interface for mess manager dropdown options
interface MessManager {
  value: string;
  label: string;
}

// Interface for API response structure
interface Template {
  id: number;
  formName: string;
  templateJson: string;
}

interface ApiResponse {
  isSuccess: boolean;
  message: string;
  getTemplateJsons: Template[];
}

// Main component
const TemplateTable: React.FC = () => {
  const [data, setData] = useState<Template[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<number | null>(null); // For row expansion
  // const [selectedManager, setSelectedManager] = useState<string>(''); // Manager select state

  // Placeholder for mess managers
  const messManagers: MessManager[] = [
    { value: 'manager1', label: 'Manager 1' },
    { value: 'manager2', label: 'Manager 2' },
  ];

  // Fetch API data
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get<ApiResponse>(`${config.API_URL_ACCOUNT}/ProcessTaskMaster/GetTemplateJson`);
        if (response.data.isSuccess) {
          setData(response.data.getTemplateJsons);
        } else {
          setError('Failed to fetch templates');
        }
      } catch (err) {
        setError('An error occurred while fetching templates');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  // Toggle expanded row
  const toggleExpandRow = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  // Handle form input change
  // const handleChange = (inputId: string, value: any) => {
  //   // You can manage form input state here
  // };

  // // Handle manager select change
  // const handleSelectMessImpChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   setSelectedManager(e.target.value);
  // };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center fs-20">
        <span><i className="ri-file-list-line me-2"></i><span className='fw-bold test-nowrap'>Form List</span></span>
        <div className="d-flex">
          <Link to='/pages/CreateTemplates'>
            <Button variant="primary" className="">
              Add Form
            </Button>
          </Link>

        </div>
      </div>
      <Table className='bg-white mt-3' striped bordered hover>
        <thead>
          <tr>
            <th>Sr.no</th>
            <th>Form Name</th>
            <th>Task Type</th>
            <th>Planned Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <React.Fragment key={item.id}>
              <tr>
                <td>{index + 1}</td>
                <td>{item.formName}</td>
                {/* Assuming `taskType` and `plannedDate` can be extracted or handled */}
                <td>Task Type Here</td>
                <td>Planned Date Here</td>
                <td>
                  <Button onClick={() => toggleExpandRow(item.id)}>
                    {expandedRow === item.id ? 'Hide' : 'Show'}
                  </Button>
                </td>
              </tr>
              <tr>
                <td colSpan={5}>
                  <Collapse in={expandedRow === item.id}>
                    <div>
                      {/* Parse and pass the form data from JSON to the dynamic form */}
                      <DynamicForm
                        formData={JSON.parse(item.templateJson)}
                        messName={item.formName}
                        showMessManagerSelect={true} // You can add logic to show/hide this
                        messManagers={messManagers}
                      />
                    </div>
                  </Collapse>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </Table>
    </>
  );
};


// Dynamic form component
interface DynamicFormProps {
  formData: FormData;
  messName: string;
  showMessManagerSelect: boolean;
  messManagers: MessManager[];
}

const DynamicForm: React.FC<DynamicFormProps> = ({ formData, messName, showMessManagerSelect, messManagers }) => {
  const [formState, setFormState] = useState<{ [key: string]: any }>({});

  const handleChange = (inputId: string, value: any) => {
    setFormState(prevState => ({
      ...prevState,
      [inputId]: value,
    }));
  };

  // const handleSelectMessImpChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   // Update the manager state here
  // };

  return (
    <React.Fragment>
      <h5>Please Update data for <span className='text-primary'>{messName}</span></h5>
      <div className="my-task">
        {formData.inputs.map((input: Input) => (
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
            {/* {input.type === 'file' && (
              <FileUploader
                icon="ri-upload-cloud-2-line"
                text="Drop files here or click to upload."
                additionalData={{
                  ModuleID: 'yourModuleID',
                  CreatedBy: 'yourUserID',
                  TaskCommonID: 3463,
                  Task_Number: 'yourTaskNumber',
                  ProcessInitiationID: 35635,
                  ProcessID: 'yourProcessID',
                  UpdatedBy: 'yourUpdatedBy',
                }}
                onFileUpload={(files) => {
                  // Handle file upload logic here
                  console.log('Files uploaded:', files);
                }}
              />
            )} */}

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
        ))}
      </div>
    </React.Fragment>
  );
};

export default TemplateTable;
