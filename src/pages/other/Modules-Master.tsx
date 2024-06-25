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
          acc.textbox.push({ labeltext: field.labeltext, value: field.placeholder });
          break;
        case 'date':
          acc.date.push({ labeldate: field.labeltext, value: field.actualDate || field.plannedDate || field.extendedDate });
          break;
        case 'select':
        case 'radio':
        case 'multiselect':
          acc.options.push({ labeltext: field.labeltext, options: field.options?.join(', ') || '' });
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
      setEditField(null);
      setSelectedTaskIdx(null);
      setSelectedFieldIdx(null);
    }
  };

  const renderField = (field: FormField, taskIndex: number, fieldIndex: number) => {
    return (
      <Form.Group>
        <Form.Label>{field.labeltext}</Form.Label>
        {(() => {
          switch (field.type) {
            case 'text':
              return <Form.Control type="text" placeholder={field.placeholder} />;
            case 'checkbox':
              return <Form.Check type="checkbox" label={field.labeltext} />;
            case 'select':
              return (
                <div>
                  <Form.Control as="select">
                    {field.options?.map((option, idx) => (
                      <option key={idx}>{option}</option>
                    ))}
                  </Form.Control>
                </div>
              );
            case 'file':
              return <Form.File label={field.labeltext as any} />;
            case 'radio':
              return (
                <>
                  {field.options?.map((option, idx) => (
                    <Form.Check key={idx} type="radio" label={option} name={field.id} />
                  ))}
                </>
              );
            case 'multiselect':
              return (
                <Form.Control as="select" multiple>
                  {field.options?.map((option, idx) => (
                    <option key={idx}>{option}</option>
                  ))}
                </Form.Control>
              );
            case 'status':
              return (
                <Form.Control as="select" value={field.status}>
                  {field.options?.map((option, idx) => (
                    <option key={idx} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Control>
              );
            case 'date':
              return <Form.Control type="date" value={field.actualDate || field.plannedDate || field.extendedDate} />;
            case 'successorTask':
              return <Form.Control type="text" placeholder={field.placeholder} />;
            case 'custom':
              return (
                <Form.Group>
                  <Form.Label>Custom </Form.Label>
                  <Form.Control className='my-2' type="date" value={field.actualDate || field.plannedDate || field.extendedDate} />
                  <Form.Label>{field.labeltext}</Form.Label>
                  <Form.Control className='my-1' as="select">
                    <option value="select"></option>
                    {field.options?.map((option, idx) => (
                      <option key={idx}>{option}</option>
                    ))}
                  </Form.Control>
                  <>
                    {field.options?.map((option, idx) => (
                      <Form.Check key={idx} type="radio" label={option} name={field.id} />
                    ))}
                  </>
                </Form.Group>
              );
            default:
              return null;
          }
        })()}
      </Form.Group>
    );
  };



  return (
    <div className="container">
      <div className="d-flex p-2 bg-white align-items-center my-2">
        Task Builder
      </div>
      <div className="row">
        <div className="col-md-12 row">
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
                              <div className="row align-items-end">
                                <div className='col-8'>{renderField(field, -1, index)}</div>
                                <div className="col-4">
                                  <div className='me-2 btn' size="sm" onClick={() => handleEditField(field, -1, index)}>
                                    <i className='ri-pencil-fill text-primary'></i>
                                  </div>
                                  <div className='btn' size="sm" onClick={() => handleDeleteField(-1, index)}>
                                  <i className='ri-delete-bin-fill text-danger'></i>
                                  </div>
                                </div>
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
          </DragDropContext>
        </div>
        <div className="col-md-6">
          <h3>Saved Tasks</h3>
          {savedTasks.map((task, taskIndex) => (
            <Card key={taskIndex} className="p-3 mb-3">
              <h4>Task {taskIndex + 1}</h4>
              {task.map((field, fieldIndex) => (
                <div key={field.id} className="mb-3">
                  <div className="d-flex justify-content-between align-items-center">

                    {renderField(field, taskIndex, fieldIndex)}
                    <div>
                      <Button variant="outline-primary" size="sm" onClick={() => handleEditField(field, taskIndex, fieldIndex)}>
                        Edit
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDeleteField(taskIndex, fieldIndex)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline-danger" size="sm" onClick={() => handleDeleteTask(taskIndex)}>
                Delete Task
              </Button>
            </Card>
          ))}
        </div>
      </div>
      <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Field</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editField && (
            <Form>
              <Form.Group>
                <Form.Label>Label</Form.Label>
                <Form.Control
                  type="text"
                  value={editField.labeltext}
                  onChange={(e) => setEditField({ ...editField, labeltext: e.target.value })}
                />
              </Form.Group>
              {(editField.type === 'text' || editField.type === 'successorTask') && (
                <Form.Group>
                  <Form.Label>Placeholder</Form.Label>
                  <Form.Control
                    type="text"
                    value={editField.placeholder}
                    onChange={(e) => setEditField({ ...editField, placeholder: e.target.value })}
                  />
                </Form.Group>
              )}
              {editField.type === 'date' && (
                <Form.Group>
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={editField.actualDate || editField.plannedDate || editField.extendedDate}
                    onChange={(e) => {
                      const newDate = e.target.value;
                      setEditField({
                        ...editField,
                        actualDate: newDate,
                        plannedDate: newDate,
                        extendedDate: newDate,
                      });
                    }}
                  />
                </Form.Group>
              )}
              {(editField.type === 'select' || editField.type === 'radio' || editField.type === 'multiselect') && (
                <Form.Group>
                  <Form.Label>Options</Form.Label>
                  <Form.Control
                    type="text"
                    value={editField.options?.join(', ')}
                    onChange={(e) => setEditField({ ...editField, options: e.target.value.split(',').map(option => option.trim()) })}
                  />
                </Form.Group>
              )}
              {editField.type === 'status' && (
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Control
                    as="select"
                    value={editField.status}
                    onChange={(e) => setEditField({ ...editField, status: e.target.value })}
                  >
                    {editField.options?.map((option, idx) => (
                      <option key={idx} value={option}>
                        {option}
                      </option>
                    ))}
                  </Form.Control>
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
    </div>
  );
};

export default App;
