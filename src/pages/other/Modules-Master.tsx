import React, { useState, useEffect } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableProvided,
  DroppableProvided,
} from 'react-beautiful-dnd';
import { Button, Form, Modal, ListGroup, Card } from 'react-bootstrap';

type FormField = {
  id: string;
  type: string;
  labeltext: string;
  placeholder?: string;
  options?: string[];
  subtasks?: FormField[];
  status?: string;
  actualDate?: string;
  plannedDate?: string;
  extendedDate?: string;
  successorTaskId?: string;
};

const initialInventory: FormField[] = [
  { id: '5', type: 'text', labeltext: 'Text Box', placeholder: 'Enter text' },
  { id: '6', type: 'checkbox', labeltext: 'Checkbox' },
  { id: '7', type: 'select', labeltext: 'Select', options: ['Option 1', 'Option 2'] },
  { id: '8', type: 'file', labeltext: 'File Upload' },
  { id: '9', type: 'radio', labeltext: 'Radio', options: ['Option 1', 'Option 2'] },
  { id: '10', type: 'multiselect', labeltext: 'Multi Select', options: ['Option 1', 'Option 2'] },
  { id: '11', type: 'status', labeltext: 'Task Status', options: ['completed', 'pending'] },
  { id: '12', type: 'date', labeltext: 'Actual Date' },
  { id: '13', type: 'date', labeltext: 'Planned Date' },
  { id: '14', type: 'date', labeltext: 'Extended Date' },
  { id: '15', type: 'text', labeltext: 'Successor Task', placeholder: 'Enter successor task ID' },
  { id: '16', type: 'custom', labeltext: 'Custom Field', placeholder: 'Enter text' },
];

type TransformedField = {
  id: number;
  labeltext?: string;
  textbox?: string;
  number?: number;
  email?: string;
  selection?: string;
  radio?: number;
  file?: string;
  labeldate?: string;
  date?: string;
  labelsubtask?: string;
  subtask?: string;
};



const transformTaskData = (tasks: FormField[][]): TransformedField[] => {
  return tasks.map((task, taskIndex) => {
    const transformedFields: TransformedField = { id: taskIndex + 1 };

    task.forEach((field) => {
      switch (field.type) {
        case 'text':
          transformedFields.textbox = field.placeholder || '';
          break;
        case 'checkbox':
          transformedFields.selection = field.labeltext;
          break;
        case 'select':
        case 'radio':
        case 'multiselect':
          transformedFields.selection = field.options?.join(', ') || '';
          transformedFields.radio = parseInt(field.options?.[0] || '0', 10);
          break;
        case 'file':
          transformedFields.file = field.labeltext;
          break;
        case 'date':
          transformedFields.labeldate = field.labeltext;
          transformedFields.date = field.actualDate || field.plannedDate || field.extendedDate || '';
          break;
        case 'status':
          transformedFields.selection = field.status;
          break;
        case 'successorTask':
          transformedFields.subtask = field.successorTaskId;
          break;
        case 'custom':
          transformedFields.textbox = field.placeholder || '';
          break;
        default:
          break;
      }
    });

    return transformedFields;
  });
};



type APIError = {
  type: string;
  title: string;
  status: number;
  errors: {
    [key: string]: string[];
  };
  traceId: string;
};

const saveTasksToServer = async (tasks: FormField[][]) => {
  const transformedData = transformTaskData(tasks);
  console.log('Transformed Data:', JSON.stringify(transformedData, null, 2));

  try {
    const response = await fetch('https://n6enuz2bzvjizpqpmojfdy54hu0kanhl.lambda-url.ap-south-1.on.aws/api/Lead/createtask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tasks: transformedData }),
    });

    if (!response.ok) {
      const errors: APIError = await response.json();
      let errorMessage = `Error: ${errors.title}\n`;

      if (errors.errors) {
        for (const [key, value] of Object.entries(errors.errors)) {
          errorMessage += `${key}: ${value.join(', ')}\n`;
        }
      }

      alert(errorMessage);
      throw new Error(errorMessage);
    }

    console.log('Payload being sent:', JSON.stringify({ tasks: transformedData }));
    console.log('Tasks saved successfully');
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
};





const fetchTasksFromServer = async () => {
  try {
    const response = await fetch('https://n6enuz2bzvjizpqpmojfdy54hu0kanhl.lambda-url.ap-south-1.on.aws/api/Lead/gettask');
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    const data = await response.json();
    console.log('Full response data:', data);
    return data.tasks || [];
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
};

const App: React.FC = () => {
  const [inventory, setInventory] = useState<FormField[]>(initialInventory);
  const [taskFields, setTaskFields] = useState<FormField[]>([]);
  const [savedTasks, setSavedTasks] = useState<FormField[][]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editField, setEditField] = useState<FormField | null>(null);
  const [selectedTaskIdx, setSelectedTaskIdx] = useState<number | null>(null);
  const [selectedFieldIdx, setSelectedFieldIdx] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    taskName: '',
    taskOwnerName: '',
    projectName: '',
    problemSolver: '',
  });

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
      { id: `${taskFields.length + 1}`, type: 'text', labeltext: `Task Name - ${formData.taskName}` },
      { id: `${taskFields.length + 2}`, type: 'text', labeltext: `Task owner Name - ${formData.taskOwnerName}` },
      { id: `${taskFields.length + 3}`, type: 'text', labeltext: `Project Name - ${formData.projectName}` },
      { id: `${taskFields.length + 4}`, type: 'text', labeltext: `Problem Solver - ${formData.problemSolver}` },
    ];
     

    setTaskFields(newTaskFields);

  }


  useEffect(() => {
    const loadTasks = async () => {
      const fetchedTasks = await fetchTasksFromServer();
      console.log('Fetched tasks:', fetchedTasks);
      setSavedTasks(fetchedTasks);
    };

    loadTasks();
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
      const draggedField = inventory.find(field => field.id === result.draggableId);
      if (draggedField) {
        const newField: FormField = {
          ...draggedField,
          id: `${draggedField.id}-${Date.now()}`,
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


  const handleSaveTask = () => {
    const updatedTasks = [...savedTasks, taskFields];
    setSavedTasks(updatedTasks);
    saveTasksToServer(updatedTasks);
    setTaskFields([]);
    setIsModalOpen(false);
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

  const handleEditField = (field: FormField, taskIndex: number, fieldIndex: number) => {
    setEditField(field);
    setSelectedTaskIdx(taskIndex);
    setSelectedFieldIdx(fieldIndex);
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

  const renderField = (field: FormField, taskIndex: number, fieldIndex: number) => {
    const renderFieldContent = () => {
      switch (field.type) {
        case 'text':
          return (
            <>
              <div>{field.labeltext}</div>
              {/* <div>Placeholder: {field.placeholder}</div> */}
            </>
          );
        case 'checkbox':
          return <div>{field.labeltext}</div>;
        case 'select':
        case 'radio':
        case 'multiselect':
          return (
            <>
              <div>{field.labeltext}</div>
              <div>Options: {field.options?.join(', ')}</div>
            </>
          );
        case 'file':
          return <div>{field.labeltext}</div>;
        case 'status':
          return (
            <>
              <div>{field.labeltext}</div>
              <div>Status: {field.status}</div>
            </>
          );
        case 'date':
          return (
            <>
              <div>{field.labeltext}</div>
              <div>Date: {field.actualDate || field.plannedDate || field.extendedDate}</div>
            </>
          );
        case 'successorTask':
          return (
            <>
              <div>{field.labeltext}</div>
              <div>Successor Task ID: {field.successorTaskId}</div>
            </>
          );
        case 'custom':
          return (
            <>
              <div>{field.labeltext}</div>
              <div>Custom Placeholder: {field.placeholder}</div>
            </>
          );
        default:
          return null;
      }
    };

    return (
      <ListGroup.Item key={field.id} className="d-flex justify-content-between align-items-center">
        {renderFieldContent()}
        <div>
          <Button
            variant="primary"
            size="sm"
            className="me-2"
            onClick={() => handleEditField(field, taskIndex, fieldIndex)}
          >
            Edit
          </Button>
          <Button variant="danger" size="sm" onClick={() => handleDeleteField(taskIndex, fieldIndex)}>
            Delete
          </Button>
        </div>
      </ListGroup.Item>
    );
  };

  return (
    <div className="App">
      <div className="container mt-4">
        <div className="d-flex p-2 bg-white mt-2 mb-2">Create Task</div>
        <Form className='row mt-2 mb-3 p-2 bg-white rounded' onSubmit={handleFormSubmit}>
          <Form.Group className='col-6 my-1'>
            <Form.Label>Task Name</Form.Label>
            <Form.Control
              type="text"
              name="taskName"
              value={formData.taskName}
              onChange={handleFormChange}
              required
            />
          </Form.Group>
          <Form.Group className='col-6 my-1'>
            <Form.Label>Task owner Name</Form.Label>
            <Form.Control
              type="text"
              name="taskOwnerName"
              value={formData.taskOwnerName}
              onChange={handleFormChange}
              required
            />
          </Form.Group>
          <Form.Group className='col-6 my-1'>
            <Form.Label>Project Name</Form.Label>
            <Form.Control
              type="text"
              name="projectName"
              value={formData.projectName}
              onChange={handleFormChange}
              required
            />
          </Form.Group>
          <Form.Group className='col-6 my-1'>
            <Form.Label>Select Process</Form.Label>
            <Form.Control
              type="text"
              name="problemSolver"
              value={formData.problemSolver}
              onChange={handleFormChange}
              required
            />
          </Form.Group>
          <div className="d-flex col-12 justify-content-end my-2">
            <Button variant="primary" type="submit">
              Add Task Details
            </Button>
          </div>
        </Form>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="row">
            <div className="col-md-6 p-2">
              <h4>Available Fields</h4>
              <Droppable droppableId="inventory">
                {(provided: DroppableProvided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="row mb-4">
                    {inventory.map((field, index) => (
                      <Draggable key={field.id} draggableId={field.id} index={index}>
                        {(provided: DraggableProvided) => (
                          <div className='col-6'>
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="card p-2 m-1"
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
            <div className="col-md-6 bg-white p-2 rounded">
              <h4>Build Your Task</h4>
              <Droppable droppableId="taskFields">
                {(provided: DroppableProvided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="list-group h-100">
                    {taskFields.map((field, index) => (
                      <Draggable key={field.id} draggableId={field.id} index={index}>
                        {(provided: DraggableProvided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="list-group-item"
                          >
                            {renderField(field, -1, index)}
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
        </DragDropContext>
        <div className="d-flex justify-content-end p-2 col-12">
          <Button variant="primary" onClick={handleSaveTask}>
            Save Task
          </Button>
        </div>

        <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)}>
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
                    onChange={e => setEditField({ ...editField, labeltext: e.target.value })}
                  />
                </Form.Group>
                {(editField.type === 'text' || editField.type === 'custom') && (
                  <Form.Group>
                    <Form.Label>Placeholder</Form.Label>
                    <Form.Control
                      type="text"
                      value={editField.placeholder}
                      onChange={e => setEditField({ ...editField, placeholder: e.target.value })}
                    />
                  </Form.Group>
                )}
                {(editField.type === 'select' ||
                  editField.type === 'radio' ||
                  editField.type === 'multiselect') && (
                    <Form.Group>
                      <Form.Label>Options</Form.Label>
                      <Form.Control
                        type="text"
                        value={editField.options?.join(', ')}
                        onChange={e => setEditField({ ...editField, options: e.target.value.split(', ') })}
                      />
                    </Form.Group>
                  )}
                {editField.type === 'status' && (
                  <Form.Group>
                    <Form.Label>Status</Form.Label>
                    <Form.Control
                      type="text"
                      value={editField.status}
                      onChange={e => setEditField({ ...editField, status: e.target.value })}
                    />
                  </Form.Group>
                )}
                {editField.type === 'date' && (
                  <Form.Group>
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={editField.actualDate || editField.plannedDate || editField.extendedDate}
                      onChange={e =>
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
                      onChange={e => setEditField({ ...editField, successorTaskId: e.target.value })}
                    />
                  </Form.Group>
                )}
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
        <div className="mt-4">
          <h3>Saved Tasks</h3>

          {savedTasks.map((task, taskIndex) => (
            <div className='col-6'>
              <Card key={taskIndex} className="mb-4">
                <Card.Header>
                  <div className="d-flex justify-content-between align-items-center">
                  </div>
                </Card.Header>
                <ListGroup variant="flush">
                  {task.map((field, fieldIndex) => renderField(field, taskIndex, fieldIndex))}
                </ListGroup>
                <div className="d-flex justify-content-end col-12 p-2">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteTask(taskIndex)}
                  >
                    Delete Task
                  </Button>
                </div>
              </Card>
            </div>

          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
