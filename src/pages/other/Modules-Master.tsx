import React, { useState, useEffect } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import { Button, Form, Modal, ListGroup, Card } from 'react-bootstrap';

type FormField = {
  id: string;
  type: string;
  label: string;
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
  { id: '1', type: 'text', label: 'Text Box', placeholder: 'Enter text' },
  { id: '2', type: 'checkbox', label: 'Checkbox' },
  { id: '3', type: 'select', label: 'Select', options: ['Option 1', 'Option 2'] },
  { id: '4', type: 'file', label: 'File Upload' },
  { id: '5', type: 'radio', label: 'Radio', options: ['Option 1', 'Option 2'] },
  { id: '6', type: 'multiselect', label: 'Multi Select', options: ['Option 1', 'Option 2'] },
  { id: '7', type: 'status', label: 'Task Status', options: ['completed', 'pending'] },
  { id: '8', type: 'date', label: 'Actual Date' },
  { id: '9', type: 'date', label: 'Planned Date' },
  { id: '10', type: 'date', label: 'Extended Date' },
  { id: '11', type: 'text', label: 'Successor Task', placeholder: 'Enter successor task ID' },
];

type TransformedField = {
  textbox: { labeltext: string; value: string | undefined }[];
  date: { labeldate: string; value: string | undefined }[];
  options: { labeltext: string; options: string }[];
  status?: string;
  successorTaskId?: string;
};

const transformTaskData = (tasks: FormField[][]): TransformedField[] => {
  return tasks.map((task, taskIndex) => {
    const transformedFields = task.reduce<TransformedField>((acc, field) => {
      switch (field.type) {
        case 'text':
          acc.textbox.push({ labeltext: field.label, value: field.placeholder });
          break;
        case 'date':
          acc.date.push({ labeldate: field.label, value: field.actualDate || field.plannedDate || field.extendedDate });
          break;
        case 'select':
        case 'radio':
        case 'multiselect':
          acc.options.push({ labeltext: field.label, options: field.options?.join(', ') || '' });
          break;
        case 'status':
          acc.status = field.status;
          break;
        case 'successorTask':
          acc.successorTaskId = field.successorTaskId;
          break;
        default:
          break;
      }
      return acc;
    }, { textbox: [], date: [], options: [] });

    return {
      id: taskIndex,
      ...transformedFields,
    };
  });
};

const saveTasksToServer = async (tasks: FormField[][]) => {
  const transformedData = transformTaskData(tasks);
  try {
    const response = await fetch('https://n6enuz2bzvjizpqpmojfdy54hu0kanhl.lambda-url.ap-south-1.on.aws/api/Lead/createtask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tasks: transformedData }),
    });

    if (!response.ok) {
      throw new Error('Failed to save tasks');
    }

    console.log('Tasks saved successfully');
  } catch (error) {
    console.error('Error saving tasks:', error);
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
    const savedTasks = localStorage.getItem('savedTasks');
    if (savedTasks) {
      setSavedTasks(JSON.parse(savedTasks));
    }
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
    localStorage.setItem('savedTasks', JSON.stringify(updatedTasks));
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
        localStorage.setItem('savedTasks', JSON.stringify(updatedTasks));
      } else {
        console.error(`Invalid taskIndex (${taskIndex}) or fieldIndex (${fieldIndex})`);
      }
    }
  };

  const handleDeleteTask = (taskIndex: number) => {
    const updatedTasks = savedTasks.filter((_, idx) => idx !== taskIndex);
    setSavedTasks(updatedTasks);
    localStorage.setItem('savedTasks', JSON.stringify(updatedTasks));
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
        localStorage.setItem('savedTasks', JSON.stringify(updatedTasks));
      }
      setIsModalOpen(false);
      setEditField(null);
      setSelectedTaskIdx(null);
      setSelectedFieldIdx(null);
    }
  };

  const handleEditCancel = () => {
    setEditField(null);
    setSelectedTaskIdx(null);
    setSelectedFieldIdx(null);
    setIsModalOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (editField) {
      const { name, value } = e.target;
      setEditField(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <div className="App">
      <h1>Task Management System</h1>
      <Button onClick={() => setIsModalOpen(true)}>Create Task</Button>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="inventory">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              <h2>Form Field Inventory</h2>
              <ListGroup>
                {inventory.map((field, index) => (
                  <Draggable key={field.id} draggableId={field.id} index={index}>
                    {(provided) => (
                      <ListGroup.Item ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        {field.label}
                      </ListGroup.Item>
                    )}
                  </Draggable>
                ))}
              </ListGroup>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <Droppable droppableId="taskFields">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              <h2>Task Form</h2>
              <ListGroup>
                {taskFields.map((field, index) => (
                  <Draggable key={field.id} draggableId={field.id} index={index}>
                    {(provided) => (
                      <ListGroup.Item ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <Card>
                          <Card.Body>
                            <Card.Title>{field.label}</Card.Title>
                            {field.type === 'text' && <Form.Control type="text" placeholder={field.placeholder} />}
                            {field.type === 'checkbox' && <Form.Check type="checkbox" label={field.label} />}
                            {field.type === 'select' && (
                              <Form.Control as="select">
                                {field.options?.map(option => (
                                  <option key={option}>{option}</option>
                                ))}
                              </Form.Control>
                            )}
                            {field.type === 'file' && <Form.File label={field.label} />}
                            {field.type === 'radio' && (
                              <div>
                                {field.options?.map(option => (
                                  <Form.Check key={option} type="radio" label={option} name={field.label} />
                                ))}
                              </div>
                            )}
                            {field.type === 'multiselect' && (
                              <Form.Control as="select" multiple>
                                {field.options?.map(option => (
                                  <option key={option}>{option}</option>
                                ))}
                              </Form.Control>
                            )}
                            {field.type === 'status' && (
                              <Form.Control as="select">
                                {field.options?.map(option => (
                                  <option key={option}>{option}</option>
                                ))}
                              </Form.Control>
                            )}
                            {field.type === 'date' && <Form.Control type="date" />}
                            <Button onClick={() => handleDeleteField(-1, index)}>Delete</Button>
                            <Button onClick={() => handleEditField(field, -1, index)}>Edit</Button>
                          </Card.Body>
                        </Card>
                      </ListGroup.Item>
                    )}
                  </Draggable>
                ))}
              </ListGroup>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <Button onClick={handleSaveTask}>Save Task</Button>
      <h2>Saved Tasks</h2>
      {savedTasks.map((task, taskIndex) => (
        <Card key={taskIndex} className="mb-3">
          <Card.Body>
            <Card.Title>Task {taskIndex + 1}</Card.Title>
            <ListGroup>
              {task.map((field, fieldIndex) => (
                <ListGroup.Item key={field.id}>
                  <div>
                    <strong>{field.label}</strong>: {field.placeholder}
                    <Button onClick={() => handleDeleteField(taskIndex, fieldIndex)}>Delete</Button>
                    <Button onClick={() => handleEditField(field, taskIndex, fieldIndex)}>Edit</Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <Button onClick={() => handleDeleteTask(taskIndex)}>Delete Task</Button>
          </Card.Body>
        </Card>
      ))}
      <Modal show={isModalOpen} onHide={handleEditCancel}>
        <Modal.Header closeButton>
          <Modal.Title>{editField ? 'Edit Field' : 'Add Field'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editField && (
            <>
              <Form.Group controlId="formLabel">
                <Form.Label>Label</Form.Label>
                <Form.Control
                  type="text"
                  name="label"
                  value={editField.label}
                  onChange={handleChange}
                />
              </Form.Group>
              {editField.type === 'text' && (
                <Form.Group controlId="formPlaceholder">
                  <Form.Label>Placeholder</Form.Label>
                  <Form.Control
                    type="text"
                    name="placeholder"
                    value={editField.placeholder}
                    onChange={handleChange}
                  />
                </Form.Group>
              )}
              {['select', 'radio', 'multiselect'].includes(editField.type) && (
                <Form.Group controlId="formOptions">
                  <Form.Label>Options (comma separated)</Form.Label>
                  <Form.Control
                    type="text"
                    name="options"
                    value={editField.options?.join(', ') || ''}
                    onChange={(e) => handleChange({
                      target: {
                        name: 'options',
                        value: e.target.value.split(',').map(option => option.trim()),
                      }
                    } as React.ChangeEvent<HTMLInputElement>)}
                  />
                </Form.Group>
              )}
              {editField.type === 'status' && (
                <Form.Group controlId="formStatus">
                  <Form.Label>Status</Form.Label>
                  <Form.Control
                    as="select"
                    name="status"
                    value={editField.status}
                    onChange={handleChange}
                  >
                    {editField.options?.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              )}
              {['date', 'actualDate', 'plannedDate', 'extendedDate'].includes(editField.type) && (
                <Form.Group controlId="formDate">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    name={editField.type}
                    value={editField.actualDate || editField.plannedDate || editField.extendedDate}
                    onChange={handleChange}
                  />
                </Form.Group>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEditCancel}>Cancel</Button>
          <Button variant="primary" onClick={handleEditSave}>{editField ? 'Save Changes' : 'Add Field'}</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default App;
