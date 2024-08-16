import React, { useState, useEffect } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableProvided,
  DroppableProvided,
} from 'react-beautiful-dnd';
import { Button, Form, Modal, ListGroup, Card, FormGroup, Toast } from 'react-bootstrap';
import axios from 'axios';
import Select from 'react-select'
import CustomFlatpickr from '@/components/CustomFlatpickr';


type FormField = {
  inputId: string;
  // id: string;             // Unique identifier for each field
  labeltext?: string;     // Label for the field
  textbox?: string;       // Textbox input
  number?: number;        // Number input
  type?: string;
  email?: string;         // Email input
  selection?: string;     // Dropdown selection input
  radio?: number;         // Radio button input
  file?: string;          // File upload input
  labeldate?: string;     // Label for date input
  conditionalField?: boolean;
  conditionalFieldId?: string;
  date?: string;          // Date input
  labelsubtask?: string;  // Label for a subtask
  subtask?: string;       // Subtask input
  paragraph?: string;     // Paragraph input
  CustomSelect?: string;  // Custom select input
  required?: boolean;     // Indicates if the field is required
  placeholder?: string;   // Placeholder for inputs
  options?: FormFieldOption[];     // Options for select, multiselect, or radio inputs
  conditions?: TransformedField[]; // Conditions or subtasks linked to this field
  value?: string;         // The value of the input
};

const projectOptions = [
  { value: 'PNC_Gwalior', label: 'PNC_Gwalior' },
  { value: 'UPSC_Gujrat', label: 'UPSC_Gujrat' },
  { value: 'PNC_Lucknow', label: 'PNC_Lucknow' },
  { value: 'PNC_Kanpur', label: 'PNC_Kanpur' },
  { value: 'PNC_Delhi', label: 'PNC_Delhi' }
];

interface FormFieldOption {
  id: string;
  label: string;
  color?: string;
}



const initialInventory: FormField[] = [
  { inputId: '5', type: 'text', labeltext: 'Label text', placeholder: 'Enter text' },
  { inputId: '6', type: 'checkbox', labeltext: 'Checkbox' },
  {
    inputId: '7',
    type: 'select',
    labeltext: 'Select',
    options: [
      { id: '7-1', label: 'Option 1' },
      { id: '7-2', label: 'Option 2' }
    ],
    conditionalField: false,
    conditionalFieldId: 'someid'
  },
  {
    inputId: '8',
    type: 'file',
    labeltext: 'File Upload',
    conditionalField: false,
    conditionalFieldId: 'someid'
  },
  {
    inputId: '9',
    type: 'radio',
    labeltext: 'Radio',
    options: [
      { id: '9-1', label: 'Option 1' },
      { id: '9-2', label: 'Option 2' }
    ],
    conditionalField: false,
    conditionalFieldId: 'someid'
  },
  {
    inputId: '10',
    type: 'multiselect',
    labeltext: 'Multi Select',
    options: [
      { id: '10-1', label: 'Option 1' },
      { id: '10-2', label: 'Option 2' }
    ],
    conditionalField: false,
    conditionalFieldId: 'someid'
  },
  { inputId: '14', type: 'date', labeltext: 'Date' },
  { inputId: '15', type: 'text', labeltext: 'Successor Task', placeholder: 'Enter successor task ID', conditionalField: false, conditionalFieldId: 'someid' },
  { inputId: '16', type: 'custom', labeltext: 'Custom Field', placeholder: 'Enter text', conditionalField: false, conditionalFieldId: 'someid' },
  { inputId: '17', type: 'paragraph', labeltext: 'Paragraph', conditionalField: false, conditionalFieldId: 'someid' },
  {
    inputId: '18',
    type: 'CustomSelect',
    labeltext: 'CustomSelect',
    placeholder: 'Enter text',
    options: [
      { id: '18-1', label: 'Option 1' },
      { id: '18-2', label: 'Option 2' }
    ],
    conditionalField: false,
    conditionalFieldId: 'someid'
  },
];

type TransformedField = {
  inputId: string;
  id: number;             // Unique identifier for each field
  labeltext?: string;     // Label for the field
  textbox?: string;       // Textbox input
  number?: number;        // Number input
  email?: string;         // Email input
  selection?: string;     // Dropdown selection input
  radio?: number;         // Radio button input
  file?: string;          // File upload input
  labeldate?: string;     // Label for date input
  date?: string;          // Date input
  labelsubtask?: string;  // Label for a subtask
  subtask?: string;       // Subtask input
  paragraph?: string;     // Paragraph input
  CustomSelect?: string;  // Custom select input
  required?: boolean;     // Indicates if the field is required
  placeholder?: string;   // Placeholder for inputs
  options?: FormFieldOption[];     // Options for select, multiselect, or radio inputs
  conditions?: TransformedField[]; // Conditions or subtasks linked to this field
  value?: string;         // The value of the input
};


interface Option {
  text: string;
  color: string;
}




type APIError = {
  type: string;
  title: string;
  status: number;
  errors: {
    [key: string]: string[];
  };
  traceId: string;
};

const saveTasksToServer = (tasks: any[]) => {
  try {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    console.log('Tasks saved to local storage successfully.');
  } catch (error) {
    console.error('Error saving tasks to local storage:', error);
  }
};

const fetchTasksFromServer = (): any[] => {
  try {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    if (tasks) {
      console.log('Tasks fetched from local storage successfully.');
      return tasks;
    } else {
      console.log('No tasks found in local storage.');
      return [];
    }
  } catch (error) {
    console.error('Error fetching tasks from local storage:', error);
    return [];
  }
};

interface EmployeeName {
  employeeName: string;
}





const App: React.FC = () => {
  const [inventory, setInventory] = useState<FormField[]>(initialInventory);
  const [taskFields, setTaskFields] = useState<FormField[]>([]);
  const [savedTasks, setSavedTasks] = useState<FormField[][]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isapplyModalOpen, setIsapplyModalOpen] = useState(false);
  const [editField, setEditField] = useState<FormField | null>(null);
  const [subFields, setSubFields] = useState<{ [key: string]: boolean }>({});
  const [selectedTaskIdx, setSelectedTaskIdx] = useState<number | null>(null);
  const [selectedFieldIdx, setSelectedFieldIdx] = useState<number | null>(null);
  const [employeeNames, setEmployeeNames] = useState<EmployeeName[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [formData, setFormData] = useState({
    taskName: '',
    ModuleName: '',
    projectName: '',
    processes: '',
    Date: '',
  });


  const [conditionalField, setConditionalField] = useState(false);
  const [conditionalFieldId, setConditionalFieldId] = useState('');

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConditionalField(event.target.checked);
  };


  const [options, setOptions] = useState<Option[]>([
    { text: 'Red Option', color: '#FF0000' },
    { text: 'Green Option', color: '#00FF00' },
    { text: 'Blue Option', color: '#0000FF' },
  ]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const color = selectedOption.getAttribute('data-color');
    const label = selectedOption.textContent; // Fetch the label/text of the selected option
    const value = selectedOption.value; // This is the id of the option

    console.log(`Selected Label: ${label}, ID: ${value}, Color: ${color}`);
    setConditionalFieldId(value);
  };

  const fetchEmployeeNames = async (): Promise<EmployeeName[]> => {
    try {
      const response = await axios.get('https://localhost:44306/api/EmployeeMaster/GetEmployee?PageIndex=1', {
        headers: {
          'accept': '*/*',
        },
      });

      if (response.data.isSuccess) {
        // Map the response to only get the employee names
        return response.data.employeeMasterList.map((employee: any) => ({
          employeeName: employee.employeeName,
        }));
      } else {
        console.error(response.data.message);
        return [];
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
      return [];
    }
  };


  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Save form data
    const newTaskFields: FormField[] = [
      { inputId: '99', type: 'text', labeltext: `Task Name - ${formData.taskName}` },
      { inputId: '100', type: 'text', labeltext: `Module Name - ${formData.ModuleName}` },
      // { id: '101', type: 'text', labeltext: `Project Name - ${formData.projectName}` },
      { inputId: '102', type: 'text', labeltext: `Process - ${formData.processes}` },
      // { id: '103', type: 'date', labeltext: `Date&Time - ${formData.Date}` },
    ];


    setTaskFields(newTaskFields);
    localStorage.setItem('taskFields', JSON.stringify(newTaskFields));

  }


  useEffect(() => {
    const loadTasks = async () => {
      const fetchedTasks = await fetchTasksFromServer();
      console.log('Fetched tasks:', fetchedTasks);
      setSavedTasks(fetchedTasks);
    };

    const getEmployeeNames = async () => {
      const employeeNameData = await fetchEmployeeNames();
      setEmployeeNames(employeeNameData);
    };

    getEmployeeNames();

    loadTasks();
    const initialSubFields = initialInventory.reduce((acc, field) => {
      acc[field.inputId] = true;
      return acc;
    }, {} as { [key: string]: boolean });
    setSubFields(initialSubFields);
  }, []);


  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        source.droppableId === 'inventory' ? inventory : taskFields,
        source.index,
        destination.index
      );

      if (source.droppableId === 'inventory') {
        setInventory(items);
      } else {
        setTaskFields(items);
      }
    } else {
      const draggedField = inventory.find(field => field.inputId === result.draggableId);
      if (draggedField) {
        const newField: FormField = {
          ...draggedField,
          inputId: `${draggedField.inputId}-${Date.now()}`,
        };
        setTaskFields(prev => [...prev, newField]);
      }
    }
  };



  const reorder = (list: FormField[], startIndex: number, endIndex: number): FormField[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const [visibility, setVisibility] = useState<Record<number, boolean>>(
    savedTasks.reduce((acc, _, index) => ({ ...acc, [index]: true }), {})
  );

  const toggleVisibility = (taskIndex: number) => {
    setVisibility(prev => ({ ...prev, [taskIndex]: !prev[taskIndex] }));
  };


  const handleSaveTask = async () => {
    const moduleID = "your_module_id"; // Replace with actual module ID
    const moduleName = "your_module_name"; // Replace with actual module name
    const processID = "your_process_id"; // Replace with actual process ID
    const processName = formData.taskName;
    const startDate = new Date().toISOString(); // Capture current date/time or replace with your actual start date
    
    // Transform taskFields into the desired JSON structure
    const transformedFields = taskFields.map((field, index) => {
      // Generate a unique inputId for the field
      const inputId = `${index + 1}`;
  
      // Map options to include unique ids
      const options = field.options?.map((option, optIndex) => ({
        id: `${inputId}-${optIndex + 1}`, // Unique ID for each option
        label: option.label || option, // Use option label or the string itself if it's a simple option
      })) || [];
  
      // Create a string that contains inputId and all options ids
      const selectedValue = editField?.options || "";
  
      // Create a string that contains inputId, all options ids, and the selected value
      const conditionalFieldId = [
        inputId,
        ...options.map(option => option.id),
        selectedValue // Include selectedValue in the IDs
      ].join(",");
  
      return {
        inputId,
        type: field.type,
        label: field.labeltext,
        placeholder: field.placeholder || "",
        options,
        required: field.required || false,
        conditionalField: field.conditionalField || "",
        conditionalFieldId, // Set to the concatenated string of IDs
        value: field.value || "",
      };
    });
  
    // Create the final JSON object
    const formJSON = {
      formId: processID,  // Use processID as formId
      formName: processName,
      inputs: transformedFields,
    };
  
    // Prepare the payload to be sent to the API
    const payload = {
      id: 2, // Assuming you want to use "0" as per the API's example
      moduleID,
      moduleName,
      processID,
      processName,
      startDate,
      task_Json: JSON.stringify(formJSON),
      createdBy: "HimanshuPant", // Replace with actual username or dynamic value
    };
  
    // Print the payload to the console
    console.log('Payload:', payload);
  
    // Post the formJSON to the server
    try {
      const response = await fetch('https://localhost:7235/api/MessWeeklyPayments/InsertAccountWeeklyTask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*',
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Task saved successfully:', data);
  
        // Update the saved tasks with the new form JSON
        const updatedTasks = [...savedTasks, formJSON];
        setSavedTasks(updatedTasks);
  
        // Reset the task fields and close the modal
        setTaskFields([]);
        setIsModalOpen(false);
      } else {
        const errorData = await response.json();
        console.error('Error saving task:', errorData);
      }
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };
  
  




  const handleDeleteField = (taskIndex: number, fieldIndex: number) => {
    if (taskIndex === -1) {
      const updatedTaskFields = taskFields.filter((_, idx) => idx !== fieldIndex);
      setTaskFields(updatedTaskFields);
    } else {
      const updatedTasks = [...savedTasks];
      if (taskIndex >= 0 && taskIndex < updatedTasks.length) {
        updatedTasks[taskIndex] = updatedTasks[taskIndex].filter((_, idx) => idx !== fieldIndex);
        setSavedTasks(updatedTasks);
      } else {
        console.error(`Invalid taskIndex (${taskIndex}) or fieldIndex (${fieldIndex})`);
      }
    }
  };

  const handleDeleteTask = (taskIndex: number) => {
    const updatedTasks = savedTasks.filter((_, idx) => idx !== taskIndex);
    setSavedTasks(updatedTasks);
  };

  const handleTextChange = (index: number, value: string) => {
    console.log(`Changing text of option at index ${index} to ${value}`);
    const newOptions = editField.options?.map((option, i) =>
      i === index ? { ...option, label: value } : option
    );
    setEditField((prevField) => ({ ...prevField, options: newOptions }));
  };

  const handleColorChange = (index: number, value: string) => {
    console.log(`Changing color of option at index ${index} to ${value}`);
    const newOptions = editField.options?.map((option, i) =>
      i === index ? { ...option, color: value } : option
    );
    setEditField((prevField) => ({ ...prevField, options: newOptions }));
  };




  const applyprocess = () => {

    setIsapplyModalOpen(true);
  };

  const showTaskData = () => {
    setIsTaskModalOpen(true);
    setIsapplyModalOpen(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 9000);
  }

  const handleEditField = (field: FormField, taskIndex: number, fieldIndex: number) => {
    setEditField(field);
    setSelectedTaskIdx(taskIndex);
    setSelectedFieldIdx(fieldIndex);
    console.log('taskname is unique', selectedFieldIdx)
    setIsModalOpen(true);
  };

  const handleEditSave = () => {
    if (editField !== null && selectedTaskIdx !== null && selectedFieldIdx !== null) {
      if (selectedTaskIdx === -1) {
        const updatedTaskFields = taskFields.map((field, index) =>
          index === selectedFieldIdx ? { ...field, ...editField } : field
        );
        setTaskFields(updatedTaskFields);
      } else {
        const updatedTasks = savedTasks.map((task, taskIndex) => {
          if (taskIndex === selectedTaskIdx) {
            return task.map((field, fieldIndex) =>
              fieldIndex === selectedFieldIdx ? { ...field, ...editField } : field
            );
          }
          return task;
        });
        setSavedTasks(updatedTasks);
      }
      setIsModalOpen(false);
    }
  };

  const [taskData, setTaskData] = useState<FormField[]>([]);

  const handleInputChange = (inputId: string, value: string) => {
    setTaskData((prevData) =>
      prevData.map((field) =>
        field.inputId === inputId ? { ...field, value } : field
      )
    );
  };

  const renderFormField = (field: FormField) => {
    switch (field.type) {
      case 'text':
        return (
          <Form.Group key={field.inputId}>
            <Form.Label>{field.label}</Form.Label>
            <Form.Control
              type="text"
              placeholder={field.placeholder}
              value={field.value || ''}
              required={field.required || false}
              onChange={(e) => handleInputChange(field.inputId, e.target.value)}
            />
          </Form.Group>
        );
      case 'select':
        return (
          <Form.Group key={field.inputId}>
            <Form.Label>{field.label}</Form.Label>
            <Form.Control
              as="select"
              value={field.value || ''}
              required={field.required || false}
              onChange={(e) => handleInputChange(field.inputId, e.target.value)}
            >
              <option value="">Select an option</option>
              {field.options?.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        );
      case 'CustomSelect':
        return (
          <Form.Group key={field.inputId}>
            <Form.Label>{field.label}</Form.Label>
            <Form.Control
              as="select"
              value={field.value || ''}
              required={field.required || false}
              onChange={(e) => handleInputChange(field.inputId, e.target.value)}
            >
              <option value="">Select an option</option>
              {field.options?.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        );
      default:
        return null;
    }
  };


  const SuccessToast: React.FC<{ show: boolean; onClose: () => void }> = ({ show, onClose }) => {
    return (
      <Toast
        show={show}
        onClose={onClose}
        delay={9000} // Toast will auto-hide after 3 seconds
        autohide
        style={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 105000,
        }}
      >
        <Toast.Header className='col-12 d-flex justify-content-between'>
          <i className="ri-thumb-up-fill text-primary fs-2"></i>
          <div onClick={onClose}></div>
        </Toast.Header>
        <Toast.Body className='bg-primary text-white fs-4'>Process has been successfully applied for selected projects</Toast.Body>
      </Toast>
    );
  };

  const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFF5', '#F5FF33', '#FF8633', '#FF33F5', '#33FFA5'];

  // Utility function to ensure option is an object
  const ensureOptionIsObject = (option: string | Option, index: number): Option => {
    if (typeof option === 'string') {
      return { text: option, color: colors[index % colors.length] };
    }
    return option;
  };

  const renderField = (field: FormField, taskIndex: number, fieldIndex: number) => {
    const renderFieldContent = () => {
      switch (field.type) {
        case 'text':
          return (
            <div className='col-6 col-new'>
              <div>{field.labeltext}</div>
              {/* <div>Placeholder: {field.placeholder}</div> */}
            </div>
          );
        case 'checkbox':
          return <div>{field.labeltext}</div>;
        case 'select':
        case 'radio':
        case 'multiselect':
          return (
            <div className='col-6'>
              <div>{field.labeltext}</div>
              <div>
                Options:
                {field.options?.map((option, index) => {
                  const optionObject = ensureOptionIsObject(option, index);
                  return (
                    <span key={index} style={{ display: 'flex', alignItems: 'center' }}>
                      <div
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          backgroundColor: optionObject.color,
                          marginRight: '8px'
                        }}
                      ></div>
                      {option.label}
                      {/* (Color Code: {optionObject.color}) */}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        case 'file':
          return <div className='col-6'>{field.labeltext}</div>;
        case 'status':
          return (
            <div className='col-6'>
              <div>{field.labeltext}</div>
              <div>Status: {field.status}</div>
            </div>
          );
        case 'date':
          return (
            <div className='col-6'>
              <div>{field.labeltext}</div>
              <div>Date: {field.actualDate || field.plannedDate || field.extendedDate}</div>
            </div>
          );
        case 'successorTask':
          return (
            <div className='col-6'>
              <div>{field.labeltext}</div>
              <div>Successor Task ID: {field.successorTaskId}</div>
            </div>
          );
        case 'custom':
          return (
            <div className='col-6'>
              <div>{field.labeltext}</div>
              <div>Custom Placeholder: {field.placeholder}</div>
            </div>
          );

        case 'taskName':
          return (

            <div>{formData.taskName}</div>
          );
        case 'CustomSelect':
          return (
            <div className='col-6'>
              {/* <div>{field.labeltext}</div> */}
              {/* <div>Custom Placeholder: {field.placeholder}</div> */}
              <div className='form-group'>
                <div className='label mb-1'>{field.labeltext}</div>
                {/* <select className='form-control' style={{ width: '200px' }} name="" id="">
                  <option value="">Role Master</option>
                  <option value="">Employee Master</option>
                  <option value="">Project Master</option>
                  <option value="">Mess Master</option>
                  <option value="">Tender Master</option>
                </select> */}
                <select className='form-control' id="employee-select" style={{ width: '200px' }}>
                  {employeeNames.map((employee, index) => (
                    <option key={index} value={employee.employeeName}>
                      {employee.employeeName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          );

        default:
          return null;
      }
    };

    return (
      <ListGroup.Item key={field.id} className="row m-0 justify-content-between align-items-center d-flex custom-shadow position-relative" id='task-area'>
        <div className='ri-add-circle-fill cursor-pointer text-primary add-more'></div>
        {renderFieldContent()}
        <div className='col-sm-12 col-md-4 justify-content-end d-flex action'>
          <i
            className="me-2 ri-pencil-fill text-primary cursor-pointer fs-4"
            onClick={() => handleEditField(field, taskIndex, fieldIndex)}
          >
          </i>
          <i className='ri-delete-bin-fill text-danger cursor-pointer fs-4' onClick={() => handleDeleteField(taskIndex, fieldIndex)}>
          </i>
        </div>
      </ListGroup.Item>
    );
  };

  return (
    <div className="App" id="taskTop">
      <div className="container mt-4">
        <div className="d-flex p-2 bg-white mt-2 mb-2">Create Task</div>


        <DragDropContext onDragEnd={handleDragEnd}>
          <div className='row m-0'>
            <Form className='row col-md-12 p-2 bg-white rounded align-items-end m-0' onSubmit={handleFormSubmit}>
              {/* <Form.Group className='col-4 my-1'>
                <Form.Label>Select Project</Form.Label>
                <Form.Control
                  as="select"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Select Project</option>
                  {['Godhara Bridge(M.P)', 'Kaveri Side Road(U.P)', 'Nagina Dam(UK)', 'Credit and Debit balance resolution', 'Bill Processing at HO'].map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group> */}
              <Form.Group className='col-md-3 my-1'>
                <Form.Label>Module Name</Form.Label>
                <Form.Control
                  as="select"
                  name="ModuleName"
                  value={formData.ModuleName}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Select Modules</option>
                  {['Accounts', 'Procurement', 'Business Development', 'Finance', 'Mobilization'].map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group className='col-md-3 my-1'>
                <Form.Label>Process Name</Form.Label>
                <Form.Control
                  as="select"
                  name="processes"
                  value={formData.processes}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Process</option>
                  {['Mess Weekly Payments', 'Mess Monthly Reconciliation', 'Petty Cash Management', 'Credit and Debit balance resolution', 'Bill Processing at HO'].map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group className='col-md-3 my-1'>
                <Form.Label>Start Date</Form.Label>
                <CustomFlatpickr
                  className="form-control"
                  placeholder="Date & Time"
                  value={formData.Date}
                  onChange={handleFormChange}
                  options={{
                    enableTime: true,
                    dateFormat: 'Y-m-d H:i',
                  }}
                />
              </Form.Group>
              <Form.Group className='col-md-3 my-1'>
                <Form.Label>Task Name</Form.Label>
                <Form.Control
                  type="text"
                  name="taskName"
                  value={formData.taskName}
                  onChange={handleFormChange}
                  required
                  placeholder='Enter Task Name'
                />
              </Form.Group>

              <div className="d-flex col-md-12 justify-content-end mt-2">
                <Button variant="primary" type="submit" style={{
                  height: 'max-content'
                }}>
                  Add Task Details
                </Button>
              </div>
            </Form>
            <div className="col-md-12 p-2 bg-white my-1">
              <h4>Available Fields</h4>
              <Droppable droppableId="inventory">
                {(provided: DroppableProvided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="row">
                    {inventory.map((field, index) => (
                      <Draggable key={field.inputId} draggableId={field.inputId} index={index}>
                        {(provided: DraggableProvided) => (
                          <div className='' style={{ width: 'max-content' }}>
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="card my-1 drag-field"
                            >
                              {field.labeltext}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
          <div className="row bg-white p-2 rounded m-0">
            <div className='col-12'>
              <h4 style={{ height: '40px' }}>Build Your Task</h4>
              <Droppable droppableId="taskFields">
                {(provided: DroppableProvided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="list-group position-relative  m-0">
                    {taskFields.length === 0 && (
                      <div className='col-12 align-items-center justify-content-center d-flex flex-column' style={{ height: '200px' }}>
                        <i className="ri-arrow-turn-back-line fs-1"></i>
                        <span>Please Select Task Fields</span>
                      </div>
                    )}
                    {taskFields.map((field, index) => (
                      <Draggable key={field.inputId} draggableId={field.inputId} index={index}>
                        {(provided: DraggableProvided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={
                              ['99', '100', '102', '103'].includes(field.inputId)
                                ? 'custom-details list-group-item col-md-12 col-sm-12 border-none my-1 p-0 timeliner d-flex'
                                : 'list-group-item col-md-12 col-sm-12 border-none my-1 p-1 timeliner d-flex'
                            }
                          >
                            {renderField(field, -1, index)}
                            <div className='top-round'></div>
                            <div className='bottom-round'></div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>

                )}
              </Droppable>
            </div>
            <Form.Group className='col-6 my-1'>
              <Form.Label>Set Finish Point</Form.Label>
              <Form.Control
                as="select"
                name="processes"
                value={formData.processes}
                onChange={handleFormChange}
                required
              >
                <option value="">Select Field</option>
                {taskFields
                  .filter(field => !['99', '100', '102', '103'].includes(field.id))
                  .map((field, index) => (
                    <option key={index} value={field.labeltext}>
                      {field.labeltext}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>
          </div>
        </DragDropContext>
        <div className="d-flex justify-content-end p-2 col-12">
          <Button variant="primary" onClick={handleSaveTask}>
            Save Task
          </Button>
        </div>

        <Modal size='lg' show={isModalOpen} onHide={() => setIsModalOpen(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Field</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {editField && (
              <Form>
                <Form.Group>
                  <Form.Label>Label Text</Form.Label>
                  <Form.Control
                    type="text"
                    value={editField.labeltext}
                    onChange={(e) => setEditField({ ...editField, labeltext: e.target.value })}
                  />
                </Form.Group>
                {(editField.type === 'text' || editField.type === 'custom') && (
                  <Form.Group>
                    <Form.Label>Placeholder</Form.Label>
                    <Form.Control
                      type="text"
                      value={editField.placeholder}
                      onChange={(e) => setEditField({ ...editField, placeholder: e.target.value })}
                    />
                    <div className='form-group mt-2'>
                      <label className="form-label">
                        <input className='me-1' type="checkbox"
                          checked={conditionalField}
                          onChange={handleCheckboxChange} />
                        Is Conditionally bound?
                      </label>
                    </div>
                    {conditionalField && (
                      <Form.Control
                        as="select"
                        className="mt-2"
                        value={conditionalFieldId}
                        onChange={handleSelectChange}
                      >
                        <option value="">Select an option</option>
                        {taskFields.map((field) => (
                          <React.Fragment key={field.id}>
                            <option value={field.id}>{field.labeltext}</option>
                            {field.options?.map((option) => (
                              <option
                                key={option.id}
                                value={option.id} // ID as the value
                                data-color={option.color || ""} // Color attribute
                                style={{ color: option.color || "inherit" }} // Apply color if available
                              >
                                {option.label} {/* Label is displayed here */}
                              </option>
                            ))}
                          </React.Fragment>
                        ))}
                      </Form.Control>
                    )}
                  </Form.Group>
                )}

                {(editField.type === 'file') &&
                  (<Form.Group className='mt-2'>
                    <Form.Control
                      type='file'
                    />
                  </Form.Group>)
                }

                {editField.type === 'CustomSelect' && (
                  <Form.Group key={editField.inputId}>
                    <Form.Label>{editField.labeltext}</Form.Label>
                    <select className='form-control' style={{ width: '200px' }} name="" id="">
                      <option value="">Accounts_Officer</option>
                      <option value="">Accounts_Officer[HO]</option>
                      <option value="">Financial_Advisor[HO]</option>
                      <option value="">Computer_Operator[HO]</option>
                      <option value="">Cashier[HO]</option>
                    </select>
                  </Form.Group>
                )}

                {(editField.type === 'select' || editField.type === 'multiselect') && (
                  <Form.Group>
                    <Form.Label className='mt-2'>Options</Form.Label>
                    {editField.options?.map((option, index) => (
                      <div key={option.id} className="d-flex mb-2 row align-items-center">
                        <div className='col-12 d-flex'>
                          <div
                            style={{
                              width: '5px',
                              height: 'auto',
                              backgroundColor: option.color,
                            }}
                          ></div>
                          <Form.Control
                            type="text"
                            required
                            className='form-checkbox-success form-check'
                            value={option.label}  // Use `label` for the value
                            onChange={(e) => handleTextChange(index, e.target.value)}
                          />
                          <Form.Control
                            type="color"
                            value={option.color}
                            required
                            onChange={(e) => handleColorChange(index, e.target.value)}
                            style={{ marginLeft: '8px', width: '40px' }}
                          />
                          <Button
                            variant="danger"
                            size="sm"
                            className="ms-2"
                            onClick={() => {
                              const newOptions = editField.options?.filter((_, i) => i !== index);
                              setEditField((prevField) => ({ ...prevField, options: newOptions }));
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        const newOption = { id: `${editField.type}-${(editField.options?.length || 0) + 1}`, label: 'Option', color: '#000000' };
                        setEditField((prevField) => ({ ...prevField, options: [...(prevField.options || []), newOption] }));
                      }}
                    >
                      Add Option
                    </Button>
                  </Form.Group>
                )}

                {editField.type === 'radio' && (
                  <Form.Group>
                    <Form.Label>Options</Form.Label>
                    {[0, 1].map((_, index) => (
                      <div key={index} className="d-flex mb-2">
                        <Form.Control
                          type="text"
                          value={editField.options ? editField.options[index] : ''}
                          onChange={(e) => {
                            const newOptions = editField.options ? [...editField.options] : ['', ''];
                            newOptions[index] = e.target.value;
                            setEditField({ ...editField, options: newOptions });
                          }}
                        />
                      </div>
                    ))}
                  </Form.Group>
                )}

                {editField.type === 'status' && (
                  <Form.Group>
                    <Form.Label>Status</Form.Label>
                    <Form.Control
                      type="text"
                      value={editField.status}
                      onChange={(e) => setEditField({ ...editField, status: e.target.value })}
                    />
                  </Form.Group>
                )}

                {editField.type === 'date' && (
                  <Form.Group>
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={editField.actualDate || editField.plannedDate || editField.extendedDate}
                      onChange={(e) =>
                        setEditField({
                          ...editField,
                          actualDate: editField.actualDate ? e.target.value : undefined,
                          plannedDate: editField.plannedDate ? e.target.value : undefined,
                          extendedDate: editField.extendedDate ? e.target.value : undefined,
                        })
                      }
                    />
                  </Form.Group>
                )}

                {editField.type === 'successorTask' && (
                  <Form.Group>
                    <Form.Label>Successor Task ID</Form.Label>
                    <Form.Control
                      type="text"
                      value={editField.successorTaskId}
                      onChange={(e) => setEditField({ ...editField, successorTaskId: e.target.value })}
                    />
                  </Form.Group>
                )}

                {/* New Form.Group for 'Required' Checkbox */}
                <Form.Group>
                  <Form.Check
                    type="switch"
                    label="Required"
                    checked={editField.required || false}
                    onChange={(e) => setEditField({ ...editField, required: e.target.checked })}
                  />
                </Form.Group>
              </Form>
            )}

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleEditSave}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>



        <div className="mt-4 row m-0">
          <h3>Saved Tasks</h3>
          <div></div>
          <div className="d-flex p-2 bg-white mt-2 mb-2 justify-content-between align-items-center"><span className='text-primary ms-1'>Process Name - {formData.processes}</span> <a href="#taskTop" className='btn btn-primary'> add task</a> </div>
          {savedTasks.map((task, taskIndex) => (
            <div className='col-md-6 col-sm-12'>
              <Card key={taskIndex} className="mb-4 row m-1">
                <Card.Header>
                  <div className="d-flex justify-content-between align-items-center">
                    <span>ACC.01.T{taskIndex + 1}.{ }</span>
                    <Button
                      size="sm"
                      onClick={() => toggleVisibility(taskIndex)}
                      className='bg-white border-light rounded-circle'
                    >
                      {visibility[taskIndex] ? (
                        <i className="ri-arrow-down-double-line text-primary fs-3"></i>
                      ) : (
                        <i className="ri-arrow-up-double-line text-primary fs-3"></i>
                      )}
                    </Button>
                  </div>
                </Card.Header>
                {visibility[taskIndex] && (
                  <>
                    <ListGroup variant="flush">
                      {task.map((field, fieldIndex) => renderField(field, taskIndex, fieldIndex))}
                    </ListGroup>
                    <div className="d-flex justify-content-end col-12 p-2">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteTask(taskIndex)}
                        className=''
                      >
                        Delete Task
                      </Button>
                    </div>
                  </>
                )}
              </Card>
            </div>

          ))}
          <div className="d-flex justify-content-end p-2 col-12">
            <Button variant="primary" onClick={applyprocess}>
              Apply Process
            </Button>
          </div>
        </div>
      </div>

      <SuccessToast show={showToast} onClose={() => setShowToast(false)} />

      <Modal size='lg' show={isTaskModalOpen} onHide={() => setIsTaskModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Applied Tasks Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div role="alert" className="fade alert alert-primary">Process Has been Applied Successfully For Selected Project</div>

          {savedTasks.map((task, taskIndex) => (
            <div className='col-md-6 col-sm-12'>
              <Card key={taskIndex} className="mb-4 row m-1 timeliner" style={{ boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px' }}>
                <Card.Header>
                  <div className="d-flex justify-content-between align-items-center">
                    <span>ACC.01.T{taskIndex + 1}.{ }</span>
                    {/* <Button
                      size="sm"
                      onClick={() => toggleVisibility(taskIndex)}
                      className='bg-white border-light rounded-circle'
                    >
                      {visibility[taskIndex] ? (
                        <i className="ri-arrow-down-double-line text-primary fs-3"></i>
                      ) : (
                        <i className="ri-arrow-up-double-line text-primary fs-3"></i>
                      )}
                    </Button> */}
                  </div>
                </Card.Header>
                {visibility[taskIndex] && (
                  <>
                    <ListGroup variant="flush">
                      {task.map((field, fieldIndex) => renderField(field, taskIndex, fieldIndex))}
                    </ListGroup>
                    {/* <div className="d-flex justify-content-end col-12 p-2">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteTask(taskIndex)}
                        className=''
                      >
                        Delete Task
                      </Button>
                    </div> */}
                  </>
                )}
              </Card>
            </div>

          ))}

        </Modal.Body>
        <Modal.Footer>
          <Button className='btn-primary' variant="Primary" onClick={() => setIsTaskModalOpen(false)}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal size='lg' show={isapplyModalOpen} onHide={() => setIsapplyModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Field</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <Form.Group className=' my-1'>
            <Form.Label>Select Projects</Form.Label>
            {/* <Form.Control
                  as="select"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Select Projects</option>
                  {['PNC_Gwalior', 'UPSC_Gujrat', 'PNC_lucknow', 'PNC_Kanpur', 'PNC_Delhi'].map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Control> */}
            <Select
              className="select2 select2-multiple z-3 col-6"
              options={projectOptions}
              isMulti={true}
              placeholder="Select Projects"
            />

            <div className="mb-3 col-6 mt-3">
              <label className="form-label">Date & Time</label>
              <CustomFlatpickr
                className="form-control"
                placeholder="Date & Time"
                options={{
                  enableTime: true,
                  dateFormat: 'Y-m-d H:i',
                }}
              />
            </div>
          </Form.Group>

        </Modal.Body>
        <Modal.Footer>
          <Button className='btn-primary' variant="Primary" onClick={showTaskData}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default App;