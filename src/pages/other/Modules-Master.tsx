import React, { ChangeEvent, useState, useEffect, useMemo } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DraggableProvided,
  DroppableProvided,
} from 'react-beautiful-dnd';
import Select from 'react-select';
import { Button, Form, Modal, ListGroup, Toast, Popover, OverlayTrigger } from 'react-bootstrap';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import config from '@/config';
import CustomFlatpickr from '@/components/CustomFlatpickr';
import { toast } from 'react-toastify';

type FormField = {
  inputId: string;
  // id: string;             // Unique identifier for each field
  labeltext?: string;
  fieldId?: string;     // Label for the field
  textbox?: string;       // Textbox input
  number?: number;// Number input
  selectedMaster?: string;
  selectedHeader?: string;
  type?: string;
  email?: string;         // Email input
  selection?: string;     // Dropdown selection input
  radio?: number;         // Radio button input
  file?: string;
  checkbox?: string;         // File upload input
  labeldate?: string;     // Label for date input
  conditionalField?: boolean;
  conditionalFieldId?: string;
  date?: string;          // Date input
  labelsubtask?: string;  // Label for a subtask
  subtask?: string;       // Subtask input
  paragraph?: string;     // Paragraph input
  CustomSelect?: string;
  hyperlink?: string;  // Custom select input
  required?: boolean;     // Indicates if the field is required
  placeholder?: string;   // Placeholder for inputs
  options?: FormFieldOption[];     // Options for select, multiselect, or radio inputs
  conditions?: TransformedField[]; // Conditions or subtasks linked to this field
  value?: string;
  fileType?: string;        // The value of the input
  fileSize?: string;
  visibility: boolean;
  condition?: number;
};

interface FormFieldOption {
  id: string;
  label: string;
  color: string;
}

interface Role {
  id: number;
  roleName: string;
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
  fieldId?: string;
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

interface Employee {
  empId: string;
  employeeName: string;
}

type Option = {
  label: string;
  color: string;
};

// Helper function to generate unique incremental IDs
// Global counter to keep track of unique IDs
let formFieldCounter = 1;

const generateFormFieldId = (): string => `${formFieldCounter++}`;


// Define initial inventory with unique IDs
const initialInventory: FormField[] = [
  { inputId: generateFormFieldId(), type: 'text', labeltext: 'Label text', placeholder: 'Enter text', visibility: true },
  { inputId: generateFormFieldId(), type: 'checkbox', labeltext: 'Checkbox', visibility: true },
  {
    inputId: generateFormFieldId(),
    type: 'select',
    labeltext: 'Select',
    visibility: true,
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
    conditionalFieldId: 'someid',
    visibility: true
  },
  {
    inputId: generateFormFieldId(),
    type: 'radio',
    labeltext: 'Radio',
    options: [
    ],
    conditionalField: false,
    conditionalFieldId: 'someid',
    visibility: true
  },
  {
    inputId: generateFormFieldId(),
    type: 'hyperlink',
    labeltext: 'Link',
    options: [
    ],
    conditionalField: false,
    conditionalFieldId: 'someid',
    visibility: true
  },
  {
    inputId: generateFormFieldId(),
    type: 'multiselect',
    labeltext: 'Multi Select',
    options: [
    ],
    conditionalField: false,
    conditionalFieldId: 'someid',
    visibility: true
  },
  { inputId: generateFormFieldId(), type: 'date', labeltext: 'Date', visibility: true },
  { inputId: generateFormFieldId(), type: 'custom', labeltext: 'Custom Field', placeholder: 'Enter text', conditionalField: false, conditionalFieldId: 'someid', visibility: true },
  { inputId: generateFormFieldId(), type: 'paragraph', labeltext: 'Paragraph', conditionalField: false, conditionalFieldId: 'someid', visibility: true },
  {
    inputId: generateFormFieldId(),
    type: 'CustomSelect',
    labeltext: 'CustomSelect',
    placeholder: 'Enter text',
    options: [
    ],
    conditionalField: false,
    conditionalFieldId: 'someid',
    visibility: true
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
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [editField, setEditField] = useState<FormField>({
    inputId: 'example',
    options: [],
    visibility: true
  });
  const [dateSelection, setDateSelection] = useState<FormField>({
    inputId: 'example',
    options: [],
    visibility: true
  });
  const [selectedTaskIdx, setSelectedTaskIdx] = useState<number | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [isApprovalConsoleActive, setApprovalConsoleActive] = useState(false);
  // const [approvalSelectedEmployee, setApprovalSelectedEmployee] = useState<string>('');  // For approval field
  const [selectedFieldIdx, setSelectedFieldIdx] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [formData, setFormData] = useState({
    taskName: '',
    ModuleName: '',
    ModuleId: '',
    projectName: '',
    processName: '',
    RoleName: '',
    processID: '',
    finishID: '',
    approvalConsoleId: 0,
    Date: new Date(),
    processOptions: [] as ProcessOption[], // Add processOptions to store the list of processes
  });
  const [conditionalField, setConditionalField] = useState(false);
  const [selectedApprovalActions, setSelectedApprovalActions] = useState<string[]>([]);
  // const [customSelectFields, setCustomSelectFields] = useState<Record<string, { selectedMaster: string, selectedHeader: string, headersList: HeaderItem[] }>>({});


  const location = useLocation();

  // const handleApprovalEmployeeSelect = (selectedOption: any) => {
  //   setApprovalSelectedEmployee(selectedOption?.value || null); // Handle employee selection
  // };


  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConditionalField(event.target.checked);
  };
  const handleApprovalActionChange = (action: string) => {
    setSelectedApprovalActions((prev) =>
      prev.includes(action) ? prev.filter((a) => a !== action) : [...prev, action]
    );
  };
  const handleApprovalCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApprovalConsoleActive(event.target.checked); // Toggle the Approval Console based on checkbox
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${config.API_URL_APPLICATION}/CommonDropdown/GetEmployeeListWithId`);
        if (response.data.isSuccess) {
          setEmployees(response.data.employeeLists);
        } else {
          console.error("Failed to fetch employees");
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);


  const handleSelectChange = (e: ChangeEvent<any>) => {
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

  interface MasterItem {
    id: number;
    mastersName: string;
  }

  const approvalOptions = [
    { id: 'approve', label: 'Approve' },
    { id: 'reject', label: 'Reject' },
    { id: 'approve_with_amendment', label: 'Approve with Amendment' }
  ];

  const [mastersList, setMastersList] = useState<MasterItem[]>([]); // State to store the fetched options
  // const [selectedMaster, setSelectedMaster] = useState(''); // State to track selected option
  const [headersList, setHeadersList] = useState<{ headerName: string }[]>([]);

  // const [selectedHeader, setSelectedHeader] = useState('');


  const storedEmpName = localStorage.getItem('EmpName');


  useEffect(() => {
    // Fetch the master list data from the API when the component loads
    const fetchMastersList = async () => {
      try {
        const response = await axios.get(`${config.API_URL_APPLICATION}/CommonDropdown/GetMastersList`);
        if (response.data.isSuccess) {
          setMastersList(response.data.mastersLists);
        } else {
          console.error('Failed to fetch master list');
        }
      } catch (error) {
        console.error('Error fetching masters list:', error);
      }
    };

    fetchMastersList();
  }, []);

  const handleMasterChange = async (masterId: string, mastersName: string) => {
    setEditField((prevField) => {
      if (!prevField) return prevField;

      return {
        ...prevField,
        selectedMaster: mastersName,
      };
    });

    console.log(masterId, mastersName)

    if (masterId) {
      try {
        const response = await axios.get(
          `${config.API_URL_APPLICATION}/CommonDropdown/GettableHeaderName?ID=${masterId}`
        );
        console.log(response)
        if (response.data.isSuccess) {
          setHeadersList(response.data.gettableHeaderNames);
        } else {
          console.error('Failed to fetch headers for the selected master');
        }
      } catch (error) {
        console.error('Error fetching headers:', error);
      }
    } else {
      setHeadersList([]);
    }
  };

  const handleHeaderChange = (header: string) => {
    setEditField((prevField) => {
      if (!prevField) return prevField;

      return {
        ...prevField,
        selectedHeader: header,
      };
    });
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Save form data
    const newTaskFields: FormField[] = [
      { inputId: '99', type: 'text', labeltext: `${formData.taskName}`, visibility: true },
      { inputId: '100', type: 'text', labeltext: `${formData.ModuleName}`, visibility: true },
      { inputId: '102', type: 'text', labeltext: `${formData.processName}`, visibility: true },
      { inputId: '103', type: 'text', labeltext: `${selectedRole?.roleName}`, visibility: true },
    ];


    setTaskFields(newTaskFields);
    localStorage.setItem('taskFields', JSON.stringify(newTaskFields));

  }

  const removeNonSpecialFields = () => {
    setTaskFields((prevFields) => prevFields.filter((field) => specialFields.includes(field.inputId)));
  };


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

  const specialFields = ['99', '100', '102', '103'];
  const specialFieldsLabels: { [key: string]: string } = {
    "99": "Task Name",
    "100": "Module Name",
    "102": "Process Name",
    "103": "Role Name",
  };

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await axios.get(`${config.API_URL_APPLICATION}/CommonDropdown/GetModuleList`);
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

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(`${config.API_URL_APPLICATION}/CommonDropdown/GetRoleMasterList`);
        if (response.data.isSuccess) {
          setRoles(response.data.roleMasterLists); // roleMasterLists is an array of Role objects
        } else {
          console.error('Error fetching roles:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchRoles();
  }, []);


  console.log(formData)

  const handleRoleSelect = (selectedOption: { id: number; roleName: string } | null) => {
    if (selectedOption) {
      const selectedId = selectedOption.id;
      const selected = roles.find((role) => role.id === selectedId) || null;
      setSelectedRole(selected);
    } else {
      setSelectedRole(null);
    }
  };

  interface CustomOption {
    value: string;
    label: string;
    className?: string; // Optional property for custom class
  }


  const handleFormChange = (e: { target: { name: string; value: string; } }) => {
    const { name, value } = e.target as HTMLSelectElement | HTMLInputElement;

    // Update form data
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // If the ModuleName is selected, fetch related processes
    if (name === 'ModuleName') {
      const selectedModule = modules.find((module) => module.moduleName === value);
      const moduleNameStr = String(value)
      console.log(moduleNameStr);
      if (selectedModule) {
        setSelectedModule(selectedModule);
        localStorage.setItem('selectedModuleId', selectedModule.moduleID); // Save selectedModuleId to localStorage
        localStorage.setItem('selectedModuleName', selectedModule.moduleName); // Save selectedModuleName to localStorage

        fetch(`${config.API_URL_APPLICATION}/CommonDropdown/GetProcessNameByModuleName?ModuleName=${encodeURIComponent(
          moduleNameStr
        )}`)
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

  // const handleApprovalConsoleId = (e: ChangeEvent<any>) => {
  //   const { name, value } = e.target as HTMLSelectElement | HTMLInputElement;

  //   // Update the form data state
  //   setFormData(prevFormData => ({
  //     ...prevFormData,
  //     [name]: value
  //   }));

  //   // Store the selected approvalConsoleId in localStorage
  //   if (name === 'approvalConsoleId') {
  //     localStorage.setItem('selectedApprovalConsoleId', value);
  //     console.log(value); // You can remove this log later
  //   }
  // };

  const handlefinishID = (e: ChangeEvent<any>) => {
    const { name, value } = e.target as HTMLSelectElement | HTMLInputElement;

    // Update the form data state
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));

    // Store the selected finishID in localStorage
    if (name === 'finishID') {
      localStorage.setItem('selectedFinishID', value);
      console.log(value)
    }
  };

  const [condition, setCondition] = React.useState<number>(3);






  const handleSaveTask = async () => {
    // Retrieve processID, processName, and finishID from formData
    const { processID, processName, finishID } = formData; // Add finishID

    // Ensure selectedModule, processID, processName, and finishID are available
    if (!selectedModule || !processID || !processName || !finishID) {
      console.error('Module, process, or finish point information is missing');
      toast.error('Module, Process, problem Solver or finish point information is missing');
      return;
    }

    const transformedFields = taskFields.map((field) => {
      const inputId = field.inputId; // Use the existing inputId from the field
      const options = field.options?.map((option, optIndex) => ({
        id: `${inputId}-${optIndex + 1}`, // Maintain consistency with option ID
        label: option.label || "", // Ensure label is used if available
        color: option.color || "" // Include color if available
      })) || [];

      if (field.type === 'file') {
        return {
          inputId,
          type: field.type,
          label: field.labeltext || "Default Label",
          fieldId: field.fieldId,
          placeholder: field.placeholder || "",
          options,
          required: field.required || false,
          conditionalFieldId: field.conditionalFieldId || "", // Use existing conditionalFieldId if any
          value: field.value || "",
          fileType: fileType || "", // Add fileType if available
          fileSize: fileSize || "", // Add fileSize if available
          visibility: field.visibility,
        };
      }
      if (field.type === 'CustomSelect') {
        return {
          inputId,
          type: field.type,
          label: field.labeltext || "Default Label",
          fieldId: field.fieldId || "", // Default to an empty string if fieldId is undefined
          required: !!field.required, // Convert to boolean, defaulting to false
          conditionalFieldId: field.conditionalFieldId || "", // Use existing conditionalFieldId or default to an empty string
          value: field.value || "", // Default to an empty string if value is undefined
          selectedMaster: field.selectedMaster || "", // Default to an empty string if not provided
          selectedHeader: field.selectedHeader || "", // Default to an empty string if not provided
          visibility: field.visibility ?? true, // Default to true if visibility is undefined
        };
      }
      if (field.type === 'date') {
        console.log(field.condition)
        return {
          inputId,
          type: field.type,
          label: field.labeltext || "Default Label",
          fieldId: field.fieldId || "", // Default to an empty string if fieldId is undefined
          required: !!field.required, // Convert to boolean, defaulting to false
          conditionalFieldId: field.conditionalFieldId || "", // Use existing conditionalFieldId or default to an empty string
          value: field.value || "", // Default to an empty string if value is undefined
          condition: field.condition,
          visibility: field.visibility ?? true, // Default to true if visibility is undefined
        };
      }


      // Default return for other input types
      return {
        inputId,
        type: field.type,
        label: field.labeltext || "Default Label",
        fieldId: field.fieldId,
        placeholder: field.placeholder || "",
        options,
        required: field.required || false,
        conditionalFieldId: field.conditionalFieldId || "", // Use existing conditionalFieldId if any
        value: field.value || "",
        visibility: field.visibility,
      };
    });

    const formJSON = {
      formId: processID,
      formName: processName,
      inputs: transformedFields,
    };

    const selectedEmployeeObj = employees.find(emp => emp.empId === selectedEmployee)
    // const selectedapprovalEmployee = employees.find(emp => emp.empId === approvalSelectedEmployee);

    // Include finishID (finishPoint) in the payload
    const payload = {
      id: 0, // Adjust as needed
      moduleID: selectedModule.moduleID,
      moduleName: selectedModule.moduleName,
      processID,
      roleId: selectedRole ? String(selectedRole.id) : '', // Ensure roleId is a string
      roleName: selectedRole?.roleName || '', // Ensure roleName is present or empty string
      processName,
      condition_Template_Json: "",
      doerID: "",
      doerName: "",
      task_Number: "",
      condition_Json: "",
      isExpired: 0,
      task_Status: 1,
      template_Json: selectedTemplateJson,
      problem_Solver: selectedEmployeeObj?.employeeName,
      task_Json: JSON.stringify(formJSON),
      createdBy: storedEmpName, // Replace with actual username or dynamic value
      finishPoint: parseFloat(finishID), // Convert finishID to float before sending
      approval_Console: isApprovalConsoleActive ? "Select Approval_Console" : '',
      approvalConsoleDoerID: '',
      approvalConsoleDoerName: '',
      approvalConsoleInputID: selectedApprovalActions.join(',')
    };


    console.log('Payload:', payload);

    // Set loading to true before starting the save operation
    setLoading(true);

    try {
      const response = await fetch(`${config.API_URL_ACCOUNT}/ProcessTaskMaster/InsertUpdateProcessTaskandDoer`, {
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

        // Update saved tasks and reset form fields except processID, processName, and finishID
        setTaskFields([]); // Clear the task fields
        setIsModalOpen(false); // Close modal

        // Optionally reset other form fields, including finishID
        setFormData((prevData) => ({
          ...prevData,
          taskName: '', // Reset taskName or other fields if needed
          Date: new Date(), // Reset Date or other fields if needed
          finishID: '', // Reset finishID after submission
        }));

        // Remove finishID from localStorage after submission
        localStorage.removeItem('selectedFinishID');
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

  const handleSaveTemplate = async () => {
    const { processID, processName } = formData;

    // Ensure required fields are available
    // if (!selectedModule || !processID || !processName) {
    //   console.error('Module or process information is missing');
    //   return;
    // }

    const templateField = taskFields.map((field) => {
      const inputId = field.inputId;
      const options = field.options?.map((option, optIndex) => ({
        id: `${inputId}-${optIndex + 1}`,
        label: option.label || "",
        color: option.color || "",
      })) || [];

      return {
        inputId,
        type: field.type,
        label: field.labeltext || "Default Label",
        fieldId: field.fieldId,
        placeholder: field.placeholder || "",
        options,
        required: field.required || false,
        conditionalFieldId: field.conditionalFieldId || "",
        value: field.value || "",
      };
    });

    // Find the input with inputId: "99" and extract its label, renamed as FromLabel
    const adhocFormField = templateField.find((field) => field.inputId === "99");
    const FromLabel = adhocFormField ? adhocFormField.label : "Adhoc Form";

    // Create the template JSON
    const templateJSON = {
      formId: processID,
      formName: processName,
      inputs: templateField,
    };

    // Prepare payload
    const payload = {
      formName: FromLabel,
      templateJson: JSON.stringify(templateJSON),
      createdBy: "HimanshuPant",
    };

    console.log('Template Payload:', payload);

    // Set loading to true before starting the save operation
    setLoading(true);

    try {
      const response = await fetch(`${config.API_URL_ACCOUNT}/ProcessTaskMaster/InsertTemplateJson`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
        },
        body: JSON.stringify(payload),
      });

      // Check if response has a body to parse
      const responseText = await response.text();

      // Parse JSON only if responseText is not empty
      if (responseText) {
        const data = JSON.parse(responseText);
        console.log('Template saved successfully:', data);

        // Reset form fields
        setTaskFields([]);
        setIsModalOpen(false);

        setFormData((prevData) => ({
          ...prevData,
          taskName: '',
          Date: new Date(),
        }));
      } else {
        console.warn('No content in the response');
      }
    } catch (error) {
      console.error('Error saving template:', error);
    } finally {
      setLoading(false);
      setShowToast(true); // Show notification if needed
    }
  };

  const [selectedTemplateJson, setSelectedTemplateJson] = useState(''); // Store the selected templateJson


  useEffect(() => {
    const fetchTemplateData = async () => {
      try {
        const response = await axios.get(`${config.API_URL_ACCOUNT}/ProcessTaskMaster/GetTemplateJson`);
        if (response.data.isSuccess) {
          const templates = response.data.getTemplateJsons;

          // Set the templates in state (includes formName and templateJson)
          setTemplates(templates);
        } else {
          console.error('Failed to fetch template data:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching template data:', error);
      }
    };

    fetchTemplateData();
  }, []);



  const handleSelectTemplateChange = (e: ChangeEvent<any>) => {
    const selectedFormName = e.target.value;

    // Use type assertion to tell TypeScript that the object has a `formName` property
    const selectedTemplate = templates.find(
      template => (template as { formName: string; templateJson: any }).formName === selectedFormName
    );

    if (selectedTemplate) {
      setSelectedTemplateJson((selectedTemplate as { formName: string; templateJson: any }).templateJson);
    }
  };



  const handleDeleteOption = (index: number) => {
    if (editField && editField.options) {
      const updatedOptions = editField.options.filter((_, i) => i !== index);
      setEditField({ ...editField, options: updatedOptions });
    }
  };

  const [fileType, setFileType] = useState('');
  const [fileSize, setFileSize] = useState('');

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
      if (!prevField) return prevField;

      const newOptions = prevField.options?.map((option, i) =>
        i === index ? { ...option, color: value } : option
      );

      return { ...prevField, options: newOptions };
    });
  };

  const handleEmployeeChange = (selectedOption: any) => {
    setSelectedEmployee(selectedOption ? selectedOption.value : null);
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

  type Template = {
    id: number;
    formName: string;
    templateJson: any;  // Adjust this based on the actual structure of templateJson
  };

  const [templates, setTemplates] = useState<Template[]>([]);


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
        case 'number':
          return (
            <div className='col-6 col-new'>
              <div>{field.labeltext}</div>
            </div>
          );
        case 'email':
          return (
            <div className='col-6 col-new'>
              <div>{field.labeltext}</div>
            </div>
          );
        case 'tel':
          return (
            <div className='col-6 col-new'>
              <div>{field.labeltext}</div>
            </div>
          );
        case 'hyperlink':
          return (
            <div className='col-6 col-new'>
              <div>{field.labeltext}</div>
            </div>
          );
        case 'checkbox':
          return (
            <div>{field.labeltext}</div>
          );
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
        case 'decimal':
          return (
            <div className='col-6'>
              <div>{field.labeltext}</div>
            </div>
          );
        case 'Positive-integer-greater-zero':
          return (
            <div className='col-6'>
              <div>{field.labeltext}</div>
            </div>
          );
        case 'Non Negative Integer':
          return (
            <div className='col-6'>
              <div>{field.labeltext}</div>
            </div>
          );
        case 'positive-integer':
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
            <div className='col-8'>
              <Form.Group className='mt-2'>
                <Form.Label>{field.labeltext}</Form.Label>
                <div className='d-flex justify-content-between'>
                  <div className='d-flex flex-column'>
                    <div>Selected Master</div>
                    <span className='fw-bold'>{field.selectedMaster}</span>
                  </div>
                  <div className='d-flex flex-column'>
                    <div>Selected Header</div>
                    <span className='fw-bold'>{field.selectedHeader}</span>
                  </div>
                </div>
              </Form.Group>
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

  const minDate = () => {
    let minDate = undefined;
    if (condition === 1 || condition === 2) {
      minDate = 'today'
    } else if (condition === 5) {
      minDate = new Date();
    } else if (condition === 6) {
      minDate = dateSelection.date;
    } else if (condition === 7) {
      minDate = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    }
    return minDate;
  }

  const maxDate = () => {
    let maxDate = undefined;
    if (condition === 2) {
      maxDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    } else if (condition === 4 || condition === 6) {
      maxDate = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    } else if (condition === 5) {
      maxDate = new Date()
    } else if (condition === 7) {
      maxDate = dateSelection.date;
    }
    return maxDate;
  }
  const dateOptions = useMemo(() => ({
    enableTime: false,
    dateFormat: 'Y-m-d',
    minDate: minDate(),  // Dynamically computed minDate
    maxDate: maxDate(),  // Dynamically computed maxDate
    disable: [
      function (date: any) {
        const today = new Date();
        // Disable only today's date
        if (condition === 8) {
          return date.toDateString() === today.toDateString();
        } else if (condition === 9) {
          return date.toDateString() === new Date(dateSelection.date || '').toDateString();
        } else if (condition === 10 && dateSelection.date) {
          const selectedDate = new Date(dateSelection.date);

          // Get start and end of the week (assuming week starts on Sunday)
          const startOfWeek = new Date(selectedDate);
          startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());

          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);

          // Disable if the date is within the selected week
          return date >= startOfWeek && date <= endOfWeek;
        } else if (condition === 11 && dateSelection.date) {
          const selectedDate = new Date(dateSelection.date);
          const selectedMonth = selectedDate.getMonth();
          const selectedYear = selectedDate.getFullYear();

          // Disable if the date is in the same month and year as the selected date
          return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
        } else if (condition === 12 && dateSelection.date) {
          const selectedYear = new Date(dateSelection.date).getFullYear();

          // Disable if the date is in the same year as the selected date
          return date.getFullYear() === selectedYear;
        } else if (condition === 13 && dateSelection.date) {
          const selectedDate = new Date(dateSelection.date);
          const startOfWeek = new Date(selectedDate);
          startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());  // Start on Sunday
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);  // End on Saturday

          const allowedDays = [1, 3];  // 1 = Monday, 3 = Wednesday

          // If the date is within the same week but not on an allowed day, disable it
          if (date >= startOfWeek && date <= endOfWeek) {
            return !allowedDays.includes(date.getDay());
          }

          // Disable dates outside the current week
          return true;
        }

      }
    ],
  }), [condition, dateSelection]);  // Recompute options on these changes

  return (
    <div className="App" id="taskTop">
      <div className="container mt-4">
        <div className="d-flex p-2 bg-white mt-2 mb-2 fw-bold text-dark fs-5">
          {(location.pathname === '/pages/CreateTemplates' ? '  Create Templates' : '  Create Task')}
        </div>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className='row m-0'>
            <Form className='row col-md-12 p-2 bg-white rounded align-items-end m-0' onSubmit={handleFormSubmit}>
              <Form.Group className="col-md-3 my-1">
                <Form.Label>Module Name</Form.Label>

                <Select
                  name="ModuleName"
                  value={modules.find((module) => module.moduleName === formData.ModuleName) || null}
                  onChange={(selectedOption) => {
                    handleFormChange({
                      target: {
                        name: 'ModuleName',
                        value: selectedOption?.moduleName || '',
                      },
                    });
                  }}
                  getOptionLabel={(module) => module.moduleName}
                  getOptionValue={(module) => module.moduleName}
                  options={modules}
                  isSearchable={true}
                  placeholder="Select Module"
                  className="h45"
                  required
                />
              </Form.Group>

              <Form.Group className="col-md-3 my-1">
                <Form.Label>Process Name</Form.Label>
                <Select
                  name="processes"
                  value={formData.processOptions?.find((process) => process.processName === formData.processName) || null}
                  onChange={(selectedOption) => {
                    handleFormChange({
                      target: {
                        name: 'processes',
                        value: selectedOption?.processName || '',
                      },
                    });
                  }}
                  getOptionLabel={(process) => process.processName}
                  getOptionValue={(process) => process.processName}
                  options={formData.processOptions || []}
                  isSearchable={true}
                  placeholder="Select Process"
                  className="h45"
                  required
                />
              </Form.Group>
              {location.pathname != '/pages/CreateTemplates' &&
                (
                  <Form.Group className="col-md-3 my-1">
                    <Form.Label>Role Name</Form.Label>
                    <Select
                      name="RoleName"
                      value={roles.find((role) => role.id === selectedRole?.id) || null}
                      onChange={(selectedOption) => handleRoleSelect(selectedOption)}
                      getOptionLabel={(role) => role.roleName}
                      getOptionValue={(role) => String(role.id)}
                      options={roles}
                      isSearchable={true}
                      placeholder="Select Role"
                      className="h45"
                    />
                  </Form.Group>
                )
              }
              <Form.Group className='col-md-3 my-1'>
                <Form.Label>{(location.pathname === '/pages/CreateTemplates' ? 'Template Name' : 'Task Name')}</Form.Label>
                <Form.Control
                  type="text"
                  name="taskName"
                  value={formData.taskName}
                  onChange={handleFormChange}
                  required
                  placeholder={(location.pathname === '/pages/CreateTemplates' ? 'Enter Template Name' : 'Enter Task Name')}
                />
              </Form.Group>

              <div className="d-flex col-md-12 justify-content-end mt-2">
                <Button variant="primary" type="submit" style={{
                  height: 'max-content'
                }}>


                  {location.pathname === '/pages/CreateTemplates' ? "Create Templates" : "Add Task Details"}



                </Button>
              </div>
            </Form>
          </div>
          {taskFields.some((field) => specialFields.includes(field.inputId)) && (
          <Droppable droppableId="specialFields">
              {(provided) => (
                <div className='bg-white mt-1 p-1 special-fields-container d-flex col-12 justify-content-between px-2' ref={provided.innerRef} {...provided.droppableProps}>
                  {taskFields
                    .filter((field) => specialFields.includes(field.inputId))
                    .map((field, index) => (
                      <Draggable key={field.inputId} draggableId={field.inputId} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className=""
                          >
                            {/* 🔹 Dynamic Label Mapping */}
                            <label className="fs-6">
                              {specialFieldsLabels[field.inputId] || `Task ${field.inputId}`}:
                            </label>

                            {/* 🔹 Display the Value */}
                            <div className="fs-5">{field.labeltext || "No Value"}</div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
          </Droppable> )}   
          <div className='d-flex'>
            <div className="col-md-3 p-2 bg-white my-1 border">
              <h4>Available Fields</h4>
              <Droppable droppableId="inventory">
                {(provided: DroppableProvided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="row">
                    {inventory.map((field, index) => (
                      <Draggable key={field.inputId} draggableId={field.inputId} index={index}>
                        {(provided: DraggableProvided) => (
                          <div className=''>
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="card drag-field border m-1"
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
            <div className="col-md-6 p-2 bg-white my-1 border">
              <div className='col-12 h-100'>
                <div className='d-flex justify-content-between align-items-center p-1'>
                  <h4>Build Your Task</h4>
                  <i className="ri-delete-bin-6-fill cursor-pointer text-danger col-1" onClick={removeNonSpecialFields} title='Clear Form'></i>
                </div>
                <Droppable droppableId="taskFields">
                  {(provided: DroppableProvided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="list-group position-relative m-0 w-100 vh-100 overflow-auto border"
                    >
                      {taskFields.length === 0 && (
                        <div className='col-12 align-items-center justify-content-center d-flex flex-column' style={{ height: '200px' }}>
                          <i className="ri-arrow-turn-back-line fs-1"></i>
                          <span>Please Select Task Fields</span>
                        </div>
                      )}
                      {taskFields
                        .filter(field => !specialFields.includes(field.inputId))
                        .map((field, index) => (
                          <Draggable key={field.inputId} draggableId={field.inputId} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="list-group-item col-md-12 col-sm-12 border-none my-1 p-1 timeliner d-flex"
                              >
                                {renderField(field, -1, index)}
                                <div className="top-round"></div>
                                <div className="bottom-round"></div>
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
            <div className='col-md-3 p-2 bg-white my-1 border'>

              <Form.Group className="col-12 my-1">
                <Form.Label>Problem Solver</Form.Label>
                <Select
                  value={[
                    { value: "ProjectCoordinator", label: "Project Coordinator", className: "special-option" },
                    { value: "ProjectIncharge", label: "Project Incharge", className: "special-option" },
                    ...employees.map(employee => ({ value: employee.empId, label: employee.employeeName })),
                  ].find(option => option.value === selectedEmployee) as CustomOption}
                  onChange={handleEmployeeChange}
                  options={[
                    { value: "ProjectCoordinator", label: "Project Coordinator", className: "special-option" },
                    { value: "ProjectIncharge", label: "Project Incharge", className: "special-option" },
                    ...employees.map(employee => ({ value: employee.empId, label: employee.employeeName })),
                  ] as CustomOption[]}
                  placeholder="Select an employee"
                  isSearchable
                  classNames={{
                    option: (state) => state.data.className || "",
                  }}
                />
              </Form.Group>



              <Form.Group className="col-12 my-1">
                <Form.Label>Set Finish Point</Form.Label>
                <Form.Control
                  as="select"
                  name="finishID"  // Changed from processID to finishID
                  value={formData.finishID}  // Updated to finishID
                  onChange={handlefinishID}
                  required
                >
                  <option value="">Select Field</option>
                  {taskFields
                    .filter(field => !['99', '100', '102', '103'].includes(field.inputId))
                    .map((field) => (
                      <option key={field.inputId} value={field.inputId}>
                        {field.labeltext}
                      </option>
                    ))}
                </Form.Control>
              </Form.Group>
              <div className="col-12 my-1">
                <div className="row col-12 position-relative">
                  {/* Approval console checkbox */}
                  <Form.Group className="my-1">
                    {/* <Form.Label>Is approval applicable?</Form.Label> */}
                    <Form.Check
                      type="checkbox"
                      label="Activate Approval Console"
                      checked={isApprovalConsoleActive}
                      onChange={handleApprovalCheckboxChange}
                    />
                  </Form.Group>

                  {/* Button to toggle popover */}
                  {isApprovalConsoleActive && (
                    <OverlayTrigger
                      trigger="click"
                      placement="top"
                      overlay={
                        <Popover id="approval-popover">
                          <Popover.Header as="h3">Select Approval Actions</Popover.Header>
                          <Popover.Body>
                            <Form.Group className="mb-2">
                              {approvalOptions.map((option) => (
                                <Form.Check
                                  key={option.id}
                                  type="checkbox"
                                  label={option.label}
                                  checked={selectedApprovalActions.includes(option.id)}
                                  onChange={() => handleApprovalActionChange(option.id)}
                                />
                              ))}
                            </Form.Group>
                          </Popover.Body>
                        </Popover>
                      }
                      rootClose
                    >
                      <Button variant="primary" className="my-2">
                        Configure Approval
                      </Button>
                    </OverlayTrigger>
                  )}
                </div>
              </div>

              {location.pathname != '/pages/CreateTemplates' &&

                (
                  <Form.Group className="col-12 my-1">
                    <Form.Label>Select Template</Form.Label>
                    <Form.Control
                      as="select"
                      name="templateName"  // Name for the select input
                      onChange={handleSelectTemplateChange}  // On change handler
                      required
                    >
                      <option value="">Select Template</option>
                      {templates.map((template) => (
                        <option key={template.id} value={template.formName}>
                          {template.formName}
                        </option>
                      ))}
                    </Form.Control>

                    {/* For debugging, showing selected templateJson */}
                    <div>
                      <h5>Selected Template JSON:</h5>
                      <pre>{selectedTemplateJson}</pre>
                    </div>
                  </Form.Group>
                )

              }

            </div>
          </div>
        </DragDropContext>
        <div className="d-flex justify-content-end p-2 col-12">


          {(location.pathname === '/pages/CreateTemplates' ? <Button className='me-2' variant="primary" onClick={handleSaveTemplate}>
            Save As Template
          </Button> : <Button variant="primary" onClick={handleSaveTask}>
            Save Task
          </Button>)
          }
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
                  <Form.Label>Field Id</Form.Label>
                  <Form.Control
                    type="text"
                    value={editField.fieldId}
                    onChange={(e) => setEditField({ ...editField, fieldId: e.target.value })}
                  />
                </Form.Group>
                {(editField.type === 'text' || editField.type === 'custom' ||
                  editField.type === 'number' || editField.type === 'email' ||
                  editField.type === 'tel' || editField.type === 'decimal' ||
                  editField.type === 'Non Negative Integer' || editField.type === 'Positive-integer-greater-zero') && (
                    <Form.Group>
                      {/* Dropdown to select input type */}
                      <Form.Label>Select Input Type</Form.Label>
                      <Form.Control
                        as="select"
                        value={editField.type} // Select the current type
                        onChange={(e) => setEditField({ ...editField, type: e.target.value })} // Update the type dynamically
                      >
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="email">Email</option>
                        <option value="tel">Telephone</option>
                        <option value="custom">Custom</option>
                        <option value="decimal">Decimal</option>
                        <option value="Non Negative Integer">Non Negative Integer</option>
                        <option value="Positive-integer-greater-zero">positive-integer-greater-zero</option>
                      </Form.Control>
                      <Form.Label>Placeholder</Form.Label>
                      <Form.Control
                        type="text"  // Use the dynamic type for the input field
                        placeholder={editField.placeholder}
                        value={editField.placeholder || ''}
                        onChange={(e) => setEditField({ ...editField, placeholder: e.target.value })}
                      />

                      {/* Input field depending on the selected type */}
                      {editField.type === 'text' && (
                        <>
                          <Form.Label>Enter Text</Form.Label>
                          <Form.Control
                            type="text"
                            value={editField.value || ''}
                            placeholder="Enter text"
                            onChange={(e) => setEditField({ ...editField, value: e.target.value })}
                          />
                        </>
                      )}

                      {editField.type === 'number' && (
                        <>
                          <Form.Label>Enter Number</Form.Label>
                          <Form.Control
                            type="number"
                            value={editField.value || ''}
                            placeholder="Enter a number"
                            onChange={(e) => setEditField({ ...editField, value: e.target.value })}
                          />
                        </>
                      )}

                      {editField.type === 'email' && (
                        <>
                          <Form.Label>Enter Email</Form.Label>
                          <Form.Control
                            type="email"
                            value={editField.value || ''}
                            placeholder="Enter a valid email"
                            onChange={(e) => setEditField({ ...editField, value: e.target.value })}
                            onBlur={() => {
                              const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                              if (!regex.test(editField.value || '')) {
                                alert('Enter a valid email address.');
                              }
                            }}
                          />
                        </>
                      )}

                      {editField.type === 'tel' && (
                        <>
                          <Form.Label>Enter Phone Number (10 digits, Indian Standard)</Form.Label>
                          <Form.Control
                            type="tel"
                            value={editField.value || ''}
                            placeholder="Enter 10-digit phone number"
                            maxLength={10}
                            onChange={(e) => {
                              let value = e.target.value.replace(/[^0-9]/g, ''); // Only numeric characters
                              if (value.startsWith('91') && value.length > 10) {
                                value = value.slice(2); // Remove country code if included
                              } else if (value.startsWith('0') && value.length > 10) {
                                value = value.slice(1); // Remove leading zero if included
                              }
                              if (value.length <= 10) {
                                setEditField({ ...editField, value }); // Update the value
                              }
                            }}
                            onBlur={() => {
                              if (editField.value?.length !== 10) {
                                alert('Invalid phone number. Must be 10 digits.');
                              }
                            }}
                          />
                        </>
                      )}

                      {editField.type === 'decimal' && (
                        <>
                          <Form.Label>Enter Decimal Value (0 or greater, up to 2 decimals)</Form.Label>
                          <Form.Control
                            type="number"
                            step="0.01"
                            value={editField.value || ''}
                            placeholder="0.00"
                            onChange={(e) => {
                              let value = e.target.value;

                              // Validation: Only numbers with up to 2 decimals and >= 0
                              const regex = /^(\d+(\.\d{0,2})?)?$/;
                              if (regex.test(value) && parseFloat(value) >= 0) {
                                setEditField({ ...editField, value });
                              }
                            }}
                            onBlur={() => {
                              const value = parseFloat(editField.value || '0');
                              if (isNaN(value) || value < 0) {
                                alert('Enter a valid decimal value (0 or greater, up to 2 decimals).');
                                setEditField({ ...editField, value: '0.00' }); // Reset to default
                              }
                            }}
                          />
                        </>
                      )}

                      {editField.type === 'Non Negative Integer' && (
                        <>
                          <Form.Label>Enter Positive Integer</Form.Label>
                          <Form.Control
                            type="number"
                            step="1"
                            value={editField.value || ''}
                            placeholder="Enter a positive integer"
                            onChange={(e) => {
                              let value = e.target.value;

                              // Validation: Positive integers only
                              const regex = /^[0-9]*$/;
                              if (regex.test(value) && parseInt(value) >= 0) {
                                setEditField({ ...editField, value });
                              }
                            }}
                            onBlur={() => {
                              const value = parseInt(editField.value || '0');
                              if (isNaN(value) || value < 0) {
                                alert('Enter a valid Non Negative Integer.');
                                setEditField({ ...editField, value: '0' }); // Reset to default
                              }
                            }}
                          />
                        </>
                      )}
                      {editField.type === 'Positive-integer-greater-zero' && (
                        <>
                          <Form.Label>Enter Positive Integer (&gt; 0)</Form.Label>
                          <Form.Control
                            type="number"
                            step="1"
                            value={editField.value || ''} // Show empty string if value is undefined or null
                            placeholder="Enter a positive integer greater than 0"
                            onChange={(e) => {
                              const value = e.target.value;

                              // Prevent entering 0
                              if (value === '0') {
                                setEditField({ ...editField, value: undefined }); // Reset to undefined if 0 is entered
                                return;
                              }

                              // Allow only positive integers greater than 0
                              const regex = /^[1-9][0-9]*$/;
                              if (regex.test(value) || value === '') {
                                setEditField({ ...editField, value: value === '' ? undefined : value });
                              }
                            }}
                            onBlur={() => {
                              const value = parseInt(editField.value || '0', 10);
                              if (isNaN(value) || value <= 0) {
                                alert('Enter a valid positive integer greater than 0.');
                                setEditField({ ...editField, value: undefined }); // Reset to undefined if invalid
                              }
                            }}
                          />
                        </>
                      )}


                      {editField.type === 'custom' && (
                        <>
                          <Form.Label>Enter Custom Value</Form.Label>
                          <Form.Control
                            type="text"
                            value={editField.value || ''}
                            placeholder="Enter a custom value"
                            onChange={(e) => setEditField({ ...editField, value: e.target.value })}
                          />
                        </>
                      )}

                      {/* Conditional Checkbox */}
                      <div className='form-group mt-2'>
                        <label className="form-label">
                          <input
                            className='me-1'
                            type="checkbox"
                            checked={conditionalField}
                            onChange={handleCheckboxChange}
                          />
                          Is Conditionally bound?
                        </label>
                      </div>

                      {/* Conditional Select Dropdown */}
                      {conditionalField && (
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
                      )}
                    </Form.Group>

                  )}

                {editField.type === 'checkbox' && (
                  <Form.Group key={editField.inputId}>

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



                {(editField.type === 'file') && (
                  <Form.Group className='mt-2'>
                    <Form.Control
                      type='file'
                    />

                    {/* Select for File Type */}
                    <Form.Group className='mt-2'>
                      <Form.Label>File Type</Form.Label>
                      <Form.Select
                        value={fileType} // Replace with your state variable for file type
                        onChange={(e) => setFileType(e.target.value)} // Update the file type state
                      >
                        <option value="">Select File Type</option>
                        <option value=".jpg">JPG</option>
                        <option value=".jpeg">JPEG</option>
                        <option value=".png">PNG</option>
                        <option value=".pdf">PDF</option>
                        <option value=".docx">DOCX (Word Document)</option>
                        <option value=".xlsx">XLSX (Excel Spreadsheet)</option>
                        {/* Add more options as needed */}
                      </Form.Select>
                    </Form.Group>

                    {/* Select for File Size */}
                    <Form.Group className='mt-2'>
                      <Form.Label>File Size</Form.Label>
                      <Form.Select
                        value={fileSize} // Replace with your state variable for file size
                        onChange={(e) => setFileSize(e.target.value)} // Update the file size state
                      >
                        <option value="">Select maximum file limit</option>
                        <option value="1">1</option>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        {/* Add more options as needed */}
                      </Form.Select>
                    </Form.Group>
                    {/* Conditional Checkbox */}
                    <div className='form-group mt-2'>
                      <label className="form-label">
                        <input
                          className='me-1'
                          type="checkbox"
                          checked={conditionalField}
                          onChange={handleCheckboxChange}
                        />
                        Is Conditionally bound?
                      </label>
                    </div>

                    {/* Conditional Select Dropdown */}
                    {conditionalField && (
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
                    )}
                  </Form.Group>
                )}

                {editField.type === 'CustomSelect' && (
                  <Form.Group key={editField.inputId}>
                    {/* Select Master */}
                    <Form.Group className="mt-2">
                      <Form.Label>Select Master</Form.Label>
                      <Form.Select
                        value={editField.selectedMaster || ""}
                        onChange={(e) => {
                          const selectedId = e.target.value;
                          const selectedMasterObj = mastersList.find(
                            (master) => master.id.toString() === selectedId
                          );
                          if (selectedMasterObj) {
                            handleMasterChange(
                              selectedMasterObj.id.toString(),
                              selectedMasterObj.mastersName
                            );
                          }
                        }}
                      >
                        <option value="">Select a Master</option>
                        {mastersList.map((master) => (
                          <option key={master.id} value={master.id.toString()}>
                            <div>{master.mastersName}</div>
                          </option>
                        ))}
                      </Form.Select>
                      <div className='badge bg-success-subtle text-success rounded-pill'>{editField.selectedMaster}</div>
                    </Form.Group>

                    {/* Select Header */}
                    <Form.Group className="mt-2">
                      <Form.Label>Select Header</Form.Label>
                      <Form.Select
                        value={editField?.selectedHeader || ""}
                        onChange={(e) => handleHeaderChange(e.target.value)}
                      >
                        <option value="">Select a Header</option>
                        {headersList.map((header) => (
                          <option key={header.headerName} value={header.headerName}>
                            {header.headerName}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>

                    {/* Conditional Checkbox */}
                    <div className="form-group mt-2">
                      <label className="form-label">
                        <input
                          className="me-1"
                          type="checkbox"
                          checked={editField.conditionalField || false}
                          onChange={(e) =>
                            setEditField((prevField) => ({
                              ...prevField,
                              conditionalField: e.target.checked,
                            }))
                          }
                        />
                        Is Conditionally bound?
                      </label>
                    </div>

                    {/* Conditional Select Dropdown */}
                    {editField.conditionalField && (
                      <Form.Control
                        as="select"
                        className="mt-2"
                        value={editField.conditionalFieldId || ""}
                        onChange={(e) =>
                          setEditField((prevField) => ({
                            ...prevField,
                            conditionalFieldId: e.target.value,
                          }))
                        }
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
                    )}
                  </Form.Group>
                )}
                {editField.type === 'hyperlink' && (
                  <Form.Group key={editField.inputId}>

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
                {editField.type === 'paragraph' && (
                  <Form.Group key={editField.inputId}>

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

                {(editField?.type === 'select' || editField?.type === 'multiselect' || editField?.type === 'radio') && (
                  <Form.Group>
                    <Form.Label>Placeholder</Form.Label>
                    <Form.Control
                      type="text"  // Use the dynamic type for the input field
                      placeholder={editField.placeholder}
                      value={editField.placeholder || ''}
                      onChange={(e) => setEditField({ ...editField, placeholder: e.target.value })}
                    />
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

                {editField.type === 'date' && (
                  <Form.Group>
                    {/* Date Field */}
                    <Form.Label>Date</Form.Label>
                    <Form.Select
                      className="mb-3"
                      value={editField.condition}
                      onChange={(e) => setCondition(Number(e.target.value))}
                    >
                      <option value={1}>Future Date Only (Including Today)</option>
                      <option value={2}>Future Date Only (Max 15 Days)</option>
                      <option value={3}>Simple Date Selection</option>
                      <option value={4}>Any past date selection</option>
                      <option value={5}>Only today</option>
                      <option value={6}>Any past date with a not beyond past date</option>
                      <option value={7}>Any future date wit a not beyond future date</option>
                      <option value={8}>Not today</option>
                      <option value={9}>Not this date</option>
                      <option value={10}>Block week</option>
                      <option value={11}>Block month</option>
                      <option value={12}>Block Year</option>
                    </Form.Select>
                    {(condition === 6 || condition === 7 || condition === 9 || condition === 10 || condition === 11 || condition === 12) && (<CustomFlatpickr className='form-control' options={{ enableTime: false, dateFormat: 'Y-m-d', minDate: undefined, maxDate: undefined }}
                      value={dateSelection.date ? new Date(dateSelection.date) : undefined}
                      onChange={(selectedDates) => {
                        if (selectedDates && selectedDates.length > 0) {
                          // Update the date only if a valid selection is made
                          setDateSelection({
                            ...dateSelection,
                            date: selectedDates[0].toISOString().split('T')[0], // Format as 'YYYY-MM-DD'
                          });
                        }
                      }} />)}
                    <CustomFlatpickr
                      className='form-control'
                      options={dateOptions}  // Use memoized options
                      value={editField.date ? new Date(editField.date) : undefined} // Ensure the value is a valid Date object
                      onChange={(selectedDates) => {
                        if (selectedDates && selectedDates.length > 0) {
                          // Update the date only if a valid selection is made
                          setEditField({
                            ...editField,
                            date: selectedDates[0].toISOString().split('T')[0], // Format as 'YYYY-MM-DD'
                          });
                        }
                      }}
                    />

                    {/* Conditional Checkbox */}
                    <div className="form-group mt-2">
                      <label className="form-label">
                        <input
                          className="me-1"
                          type="checkbox"
                          checked={conditionalField}
                          onChange={handleCheckboxChange}
                        />
                        Is Conditionally bound?
                      </label>
                    </div>

                    {/* Conditional Dropdown */}
                    {conditionalField && (
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
                                data-color={option.color || ''}
                                style={{ color: option.color || 'inherit' }}
                              >
                                {option.label}
                              </option>
                            ))}
                          </React.Fragment>
                        ))}
                      </Form.Control>
                    )}
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