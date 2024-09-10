import React, { ChangeEvent, useState, useEffect } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DraggableProvided,
  DroppableProvided,
} from 'react-beautiful-dnd';
import { Button, Form, Modal, ListGroup, Toast } from 'react-bootstrap';
import axios from 'axios';
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

interface FormFieldOption {
  id: string;
  label: string;
  color: string;
}

interface Module {
  id: number;
  moduleID: string;
  moduleName: string;
}

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

interface ProcessOption {
  processName: string;
  processID: string;
}

type Option = {
  label: string;
  color: string;
};

// Helper function to generate unique incremental IDs
// Global counter to keep track of unique IDs
let formFieldCounter = 1;

// Function to generate unique form field ID
const generateFormFieldId = (): string => `${formFieldCounter++}`;

// Function to generate unique option ID based on parent field ID
const generateOptionId = (parentId: string, index: number): string => `${parentId}-${index + 1}`;


// Define initial inventory with unique IDs
const initialInventory: FormField[] = [
  { inputId: generateFormFieldId(), type: 'text', labeltext: 'Label text', placeholder: 'Enter text' },
  { inputId: generateFormFieldId(), type: 'checkbox', labeltext: 'Checkbox' },
  {
    inputId: generateFormFieldId(),
    type: 'select',
    labeltext: 'Select',
    options: [

    ],
    conditionalField: false,
    conditionalFieldId: 'someid'
  },
  {
    inputId: generateFormFieldId(),
    type: 'file',
    labeltext: 'File Upload',
    conditionalField: false,
    conditionalFieldId: 'someid'
  },
  {
    inputId: generateFormFieldId(),
    type: 'radio',
    labeltext: 'Radio',
    options: [
    ],
    conditionalField: false,
    conditionalFieldId: 'someid'
  },
  {
    inputId: generateFormFieldId(),
    type: 'multiselect',
    labeltext: 'Multi Select',
    options: [
    ],
    conditionalField: false,
    conditionalFieldId: 'someid'
  },
  { inputId: generateFormFieldId(), type: 'date', labeltext: 'Date' },
  { inputId: generateFormFieldId(), type: 'custom', labeltext: 'Custom Field', placeholder: 'Enter text', conditionalField: false, conditionalFieldId: 'someid' },
  { inputId: generateFormFieldId(), type: 'paragraph', labeltext: 'Paragraph', conditionalField: false, conditionalFieldId: 'someid' },
  {
    inputId: generateFormFieldId(),
    type: 'CustomSelect',
    labeltext: 'CustomSelect',
    placeholder: 'Enter text',
    options: [
    ],
    conditionalField: false,
    conditionalFieldId: 'someid'
  },
];


console.log(initialInventory);

const App: React.FC = () => {
  const [loading, setLoading] = useState(false); // Add loading state
  const [inventory, setInventory] = useState<FormField[]>(initialInventory);
  const [taskFields, setTaskFields] = useState<FormField[]>([]);
  const [savedTasks, setSavedTasks] = useState<FormField[][]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [editField, setEditField] = useState<FormField>({
    inputId: 'example', // or an appropriate default value
    options: [], // Initialize options as an empty array
  });
  const [selectedTaskIdx, setSelectedTaskIdx] = useState<number | null>(null);
  const [selectedFieldIdx, setSelectedFieldIdx] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [formData, setFormData] = useState({
    taskName: '',
    ModuleName: '',
    ModuleId: '',
    projectName: '',
    processName: '',
    processID: '',
    Date: new Date(),
    processOptions: [] as ProcessOption[], // Add processOptions to store the list of processes
  });
  const [conditionalField, setConditionalField] = useState(false);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConditionalField(event.target.checked);
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedIndex = e.target.selectedIndex;
    const selectedOption = e.target.options[selectedIndex];

    const color = selectedOption.getAttribute('data-color') || 'defaultColor';
    const label = selectedOption.textContent || '';
    const value = selectedOption.value;

    if (editField) {
      setEditField((prevField) => ({
        ...prevField,
        conditionalFieldId: value
      }));
    }

    console.log(`Selected Label: ${label}, ID: ${value}, Color: ${color}`);
  };


  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Save form data
    const newTaskFields: FormField[] = [
      { inputId: '99', type: 'text', labeltext: `${formData.taskName}` },
      { inputId: '100', type: 'text', labeltext: `${formData.ModuleName}` },
      { inputId: '102', type: 'text', labeltext: `${formData.processName}` },
      // { id: '103', type: 'date', labeltext: `Date&Time - ${formData.Date}` },
    ];


    setTaskFields(newTaskFields);
    localStorage.setItem('taskFields', JSON.stringify(newTaskFields));

  }


  const handleDragEnd = (result: any) => {
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
                inputId: generateFormFieldId(),
                options: draggedField.options?.map((option) => ({
                    ...option,
                    id: newField.inputId // Replace option ID with newField inputId
                }))
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

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await axios.get('https://localhost:44307/api/CommonDropdown/GetModuleList');
        if (response.data.isSuccess) {
          setModules(response.data.moduleNameListResponses);
        } else {
          console.error('Error fetching modules:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchModules();
  }, []);

  const handleFormChange = (e: ChangeEvent<any>) => {
    const { name, value } = e.target as HTMLSelectElement | HTMLInputElement;

    // Update form data
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // If the ModuleName is selected, fetch related processes
    if (name === 'ModuleName') {
      const selectedModule = modules.find((module) => module.moduleName === value);

      if (selectedModule) {
        setSelectedModule(selectedModule);
        localStorage.setItem('selectedModuleId', selectedModule.moduleID); // Save selectedModuleId to localStorage
        localStorage.setItem('selectedModuleName', selectedModule.moduleName); // Save selectedModuleName to localStorage

        fetch(`https://localhost:44307/api/CommonDropdown/GetProcessNameByModuleName?ModuleName=${value}`)
          .then((response) => response.json())
          .then((data) => {
            if (data.isSuccess) {
              setFormData((prevData) => ({
                ...prevData,
                ModuleId: selectedModule.moduleID,
                processOptions: data.processListResponses, // Save process options to state
              }));
            } else {
              console.error('Error fetching processes:', data.message);
            }
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
          });
      } else {
        setSelectedModule(null);
        localStorage.removeItem('selectedModuleId');
        localStorage.removeItem('selectedModuleName');
        console.error('No module selected');
      }
    }

    // Handle process selection
    if (name === 'processes') {
      const selectedProcess = formData.processOptions.find((process) => process.processName === value);
      if (selectedProcess) {
        setFormData((prevData) => ({
          ...prevData,
          processName: selectedProcess.processName,
          processID: selectedProcess.processID,
        }));
      }
    }
  };

  const handleDateChange = (date: Date | Date[]) => {
    setFormData((prevData) => ({
      ...prevData,
      Date: date instanceof Date ? date : date[0] // Ensure `Date` is of type `Date`
    }));
  };




  const handleSaveTask = async () => {
    // Retrieve processID and processName from formData
    const { processID, processName } = formData;

    // Ensure selectedModule and processID are available
    if (!selectedModule || !processID || !processName) {
      console.error('Module or process information is missing');
      return;
    }

    const startDate = new Date().toISOString();

    // Create the final JSON object for the form
    const transformedFields = taskFields.map((field) => {
      const inputId = field.inputId; // Use the existing inputId from the field
      const options = field.options?.map((option, optIndex) => ({
          id: `${inputId}-${optIndex + 1}`, // Maintain consistency with option ID
          label: option.label || "", // Ensure label is used if available
          color: option.color || "" // Include color if available
      })) || [];
  
      return {
          inputId,
          type: field.type,
          label: field.labeltext || "Default Label",
          placeholder: field.placeholder || "",
          options,
          required: field.required || false,
          conditionalFieldId: field.conditionalFieldId || "", // Use existing conditionalFieldId if any
          value: field.value || "",
      };
  });
  

    const formJSON = {
      formId: processID,
      formName: processName,
      inputs: transformedFields,
    };

    const payload = {
      id: 0, // Adjust as needed
      moduleID: selectedModule.moduleID,
      moduleName: selectedModule.moduleName,
      processID,
      processName,
      startDate,
      task_Json: JSON.stringify(formJSON),
      createdBy: "HimanshuPant", // Replace with actual username or dynamic value
    };

    console.log('Payload:', payload);

    // Set loading to true before starting the save operation
    setLoading(true);

    try {
      const response = await fetch('https://localhost:5078/api/AccountModule/InsertAccountProcessTask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Task saved successfully:', data);

        // Update saved tasks and reset form fields except processID and processName
        // const updatedTasks = [...savedTasks, ...transformedFields]; // If needed, update saved tasks
        setTaskFields([]); // Clear the task fields
        setIsModalOpen(false); // Close modal

        // Optionally reset other form fields, but keep processID and processName
        setFormData((prevData) => ({
          ...prevData,
          taskName: '', // Reset taskName or other fields if needed
          Date: new Date(), // Reset Date or other fields if needed
          // Do not reset processID or processName
        }));
      } else {
        const errorData = await response.json();
        console.error('Error saving task:', errorData);
      }
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      // Set loading to false when the operation completes
      setLoading(false);
      setShowToast(true); // Show toast or notification if needed
    }
  };


  const handleDeleteOption = (index: number) => {
    if (editField && editField.options) {
      const updatedOptions = editField.options.filter((_, i) => i !== index);
      setEditField({ ...editField, options: updatedOptions });
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

  const handleTextChange = (index: number, value: string) => {
    console.log(`Changing text of option at index ${index} to ${value}`);

    setEditField((prevField) => {
      if (!prevField) return prevField; // If prevField is null, return it unchanged

      const newOptions = prevField.options?.map((option, i) =>
        i === index ? { ...option, label: value } : option
      );

      return { ...prevField, options: newOptions };
    });
  };

  const handleColorChange = (index: number, value: string) => {
    console.log(`Changing color of option at index ${index} to ${value}`);

    setEditField((prevField) => {
      if (!prevField) return prevField; // If prevField is null, return it unchanged

      const newOptions = prevField.options?.map((option, i) =>
        i === index ? { ...option, color: value } : option
      );

      return { ...prevField, options: newOptions };
    });
  };

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
        <Toast.Body className='bg-primary text-white fs-4'>Tasks has been saved for {formData.processName}</Toast.Body>
      </Toast>
    );
  };

  const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFF5', '#F5FF33', '#FF8633', '#FF33F5', '#33FFA5'];

  // Utility function to ensure option is an object
  const ensureOptionIsObject = (option: string | FormFieldOption, index: number): Option => {
    if (typeof option === 'string') {
      return {
        label: option,
        color: colors[index % colors.length], // Provide a default color
      };
    }
    return {
      label: option.label,
      color: option.color ?? colors[index % colors.length], // Use default if color is undefined
    };
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
        case 'date':
          return (
            <div className='col-6'>
              <div>{field.labeltext}</div>
              <div>Date: {field.date}</div>
            </div>
          );
        case 'custom':
          return (
            <div className='col-6'>
              <div>{field.labeltext}</div>
              <div>Custom Placeholder: {field.placeholder}</div>
            </div>
          );
        case 'paragraph':
          return (
            <div className='col-6'>
              <div>{field.labeltext}</div>
            </div>
          );

        case 'taskName':
          return (

            <div>{formData.taskName}</div>
          );
        case 'CustomSelect':
          return (
            <div className='col-6'>
              <div className='form-group'>
                <div className='label mb-1'>{field.labeltext}</div>
                <select className='form-control' id="employee-select" style={{ width: '200px' }}>
                </select>
              </div>
            </div>
          );

        default:
          return null;
      }
    };

    return (
      <ListGroup.Item className="row m-0 justify-content-between align-items-center d-flex custom-shadow position-relative" id='task-area'>
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
              <Form.Group className="col-md-3 my-1">
                <Form.Label>Module Name</Form.Label>
                <Form.Control
                  as="select"
                  name="ModuleName"
                  value={formData.ModuleName}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Select Modules</option>
                  {modules.map((module) => (
                    <option key={module.moduleID} value={module.moduleName}>
                      {module.moduleName}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group className="col-md-3 my-1">
                <Form.Label>Process Name</Form.Label>
                <Form.Control
                  as="select"
                  name="processes"
                  value={formData.processName}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Select Process</option>
                  {formData.processOptions?.map((process) => (
                    <option key={process.processID} value={process.processName}>
                      {process.processName}
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
                  onChange={handleDateChange} // Use date-specific handler
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
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="list-group position-relative m-0"
                  >
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
                name="processID" // Name should correspond to the field storing the selected process ID
                value={formData.processID} // Set value to the selected process ID
                onChange={handleFormChange} // Handle change to update the selected process ID
                required
              >
                <option value="">Select Field</option>
                {taskFields
                  .filter(field => !['99', '100', '102', '103'].includes(field.inputId))
                  .map((field) => (
                    <option key={field.inputId} value={field.inputId}> {/* Use field.id as value */}
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
                {conditionalField == true && 
                    <Form.Control
                      as="select"
                      className="mt-2"
                      value={editField.conditionalFieldId || ''}
                      onChange={handleSelectChange}
                    >
                      <option value="">Select an option</option>
                      {taskFields.map((field) => (
                        <React.Fragment key={field.inputId}>
                          <option value={field.inputId}>{field.labeltext}</option>
                          {field.options?.map((option) => (
                            <option
                              key={option.id}
                              value={option.id}
                              data-color={option.color || ""}
                              style={{ color: option.color || "inherit" }}
                            >
                              {option.label}
                            </option>
                          ))}
                        </React.Fragment>
                      ))}
                    </Form.Control>

                     }
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
                  </Form.Group>
                )}
                {editField.type === 'paragraph' && (
                  <Form.Group key={editField.inputId}>

                  </Form.Group>
                )}

                {(editField?.type === 'select' || editField?.type === 'multiselect' || editField?.type === 'radio') && (
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
                            onClick={() => handleDeleteOption(index)}
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
                        if (!editField) return;

                        const newOptionId = `${editField.inputId}-${(editField.options?.length || 0) + 1}`;
                        const newOption = {
                          id: newOptionId,
                          label: 'Option',
                          color: '#000000',
                        };

                        setEditField((prevField) => ({
                          ...prevField,
                          options: [...(prevField?.options || []), newOption],
                        }));
                      }}
                    >
                      Add Option
                    </Button>

                  </Form.Group>
                )}

                {editField.type === 'date' && (
                  <Form.Group>
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={editField.date}
                      onChange={(e) =>
                        setEditField({
                          ...editField,
                          date: editField.date ? e.target.value : undefined
                        })
                      }
                    />
                  </Form.Group>
                )}
                <Form.Group className='mt-2'>
                  <Form.Check
                    type="switch"
                    label="Compulsory Field"
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
      </div>

      <SuccessToast show={showToast} onClose={() => setShowToast(false)} />

      {loading && (
        <div className="loader-fixed">
          <div className="loader"></div>
          <div className="mt-2">Please Wait!</div>
        </div>
      )
      };

    </div>
  );
};

export default App;