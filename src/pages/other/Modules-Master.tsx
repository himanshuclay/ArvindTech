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
  { id: '1', type: 'text', labeltext: 'Text Box', placeholder: 'Enter text' },
  { id: '2', type: 'checkbox', labeltext: 'Checkbox' },
  { id: '3', type: 'select', labeltext: 'Select', options: ['Option 1', 'Option 2'] },
  { id: '4', type: 'file', labeltext: 'File Upload' },
  { id: '5', type: 'radio', labeltext: 'Radio', options: ['Option 1', 'Option 2'] },
  { id: '6', type: 'multiselect', labeltext: 'Multi Select', options: ['Option 1', 'Option 2'] },
  { id: '7', type: 'status', labeltext: 'Task Status', options: ['completed', 'pending'] },
  { id: '8', type: 'date', labeltext: 'Actual Date' },
  { id: '9', type: 'date', labeltext: 'Planned Date' },
  { id: '10', type: 'date', labeltext: 'Extended Date' },
  { id: '11', type: 'text', labeltext: 'Successor Task', placeholder: 'Enter successor task ID' },
  { id: '12', type: 'custom', labeltext: 'Custom Field', placeholder: 'Enter text' },
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

const saveTasksToServer = async (tasks: FormField[][]) => {
  const transformedData = transformTaskData(tasks);

  try {
    const response = await fetch('https://votlvqv4xbzjwjfgncyfiew5uu0sxfaa.lambda-url.ap-south-1.on.aws/api/Authentication/createtask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tasks: transformedData }),
    });

    if (!response.ok) {
      throw new Error('Failed to save tasks');
    }
    console.log('Payload being sent:', JSON.stringify({ tasks: transformedData }));
    console.log('Tasks saved successfully');
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
};

const fetchTasksFromServer = async () => {
  try {
    const response = await fetch('https://votlvqv4xbzjwjfgncyfiew5uu0sxfaa.lambda-url.ap-south-1.on.aws/api/Authentication/gettask');
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
              <div>Placeholder: {field.placeholder}</div>
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
            className="mr-2"
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
        <h1 className="mb-4">Dynamic Form Builder</h1>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="row">
            <div className="col-md-6">
              <h3>Available Fields</h3>
              <Droppable droppableId="inventory">
                {(provided: DroppableProvided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="list-group mb-4">
                    {inventory.map((field, index) => (
                      <Draggable key={field.id} draggableId={field.id} index={index}>
                        {(provided: DraggableProvided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="list-group-item"
                          >
                            {field.labeltext}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
            <div className="col-md-6">
              <h3>Build Your Task</h3>
              <Droppable droppableId="taskFields">
                {(provided: DroppableProvided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="list-group mb-4">
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
        <Button variant="primary" onClick={handleSaveTask}>
          Save Task
        </Button>
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
            <Card key={taskIndex} className="mb-4">
              <Card.Header>
                Task {taskIndex + 1}
                <Button
                  variant="danger"
                  size="sm"
                  className="float-right"
                  onClick={() => handleDeleteTask(taskIndex)}
                >
                  Delete Task
                </Button>
              </Card.Header>
              <ListGroup variant="flush">
                {task.map((field, fieldIndex) => renderField(field, taskIndex, fieldIndex))}
              </ListGroup>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
