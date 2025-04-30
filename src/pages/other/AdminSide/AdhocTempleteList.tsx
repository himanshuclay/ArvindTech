import React, { useState, useEffect } from 'react';
import { Table, Button, Collapse } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
// import { FileUploader } from '@/components/FileUploader'
import config from '@/config';
import Editor from '@/pages/FormBuilder/Editor';
import { FIELD, PROPERTY } from '@/pages/FormBuilder/Constant/Interface';


// Define interface for form options
// interface Option {
//   id: string;
//   label: string;
// }

// Define interface for form inputs
// interface Input {
//   inputId: string;
//   label: string;
//   placeholder?: string;
//   type: string;
//   options?: Option[];
// }

// Interface for form data containing form inputs
// interface FormData {
//   inputs: Input[];
// }

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
  formData: FIELD;
  messName: string;
  showMessManagerSelect: boolean;
  messManagers: MessManager[];
}

const DynamicForm: React.FC<DynamicFormProps> = ({ formData, messName, showMessManagerSelect, messManagers }) => {
  // const [formState, setFormState] = useState<{ [key: string]: any }>({});

  // const handleChange = (inputId: string, value: any) => {
  //   setFormState(prevState => ({
  //     ...prevState,
  //     [inputId]: value,
  //   }));
  // };

  // const handleSelectMessImpChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   // Update the manager state here
  // };

  const [form, setForm] = useState<FIELD>(formData);

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
    disabled: "false",
})
    const [blockValue, setBlockValue] = useState({})

  return (
    <React.Fragment>
      <h5>Please Update data for <span className='text-primary'>{messName}</span></h5>
      <div className="my-task">
      <Editor form={form} setForm={setForm} property={property} setProperty={setProperty} blockValue={blockValue} setBlockValue={setBlockValue} />

       
      </div>
    </React.Fragment>
  );
};

export default TemplateTable;
