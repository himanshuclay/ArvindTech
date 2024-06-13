import React, { useState, useEffect } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableProvided,
  DroppableProvided
} from 'react-beautiful-dnd';
import { Button, Form, Modal, ListGroup, Card } from 'react-bootstrap';

// Extended types for form fields
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

// Initial inventory of form fields
const initialInventory: FormField[] = [
  { id: '1', type: 'text', label: 'Text Box', placeholder: 'Enter text' },
  { id: '2', type: 'checkbox', label: 'Checkbox' },
  { id: '3', type: 'select', label: 'Select', options: ['Option 1', 'Option 2'] },
  { id: '4', type: 'file', label: 'File Upload' },
  { id: '5', type: 'radio', label: 'Radio', options: ['Option 1', 'Option 2'] },
  { id: '6', type: 'multiselect', label: 'Multi Select', options: ['Option 1', 'Option 2'] },
  { id: '7', type: 'status', label: 'Task Status', options: ['completed', 'pending'] }, // Status field with predefined options
  { id: '8', type: 'date', label: 'Actual Date' },
  { id: '9', type: 'date', label: 'Planned Date' },
  { id: '10', type: 'date', label: 'Extended Date' },
  { id: '11', type: 'text', label: 'Successor Task', placeholder: 'Enter successor task ID' }
];

const App: React.FC = () => {
  const [inventory, setInventory] = useState<FormField[]>(initialInventory);
  const [taskFields, setTaskFields] = useState<FormField[]>([]);
  const [savedTasks, setSavedTasks] = useState<FormField[][]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editField, setEditField] = useState<FormField | null>(null);
  const [selectedTaskIdx, setSelectedTaskIdx] = useState<number | null>(null);
  const [selectedFieldIdx, setSelectedFieldIdx] = useState<number | null>(null);
  const [subtaskFields, setSubtaskFields] = useState<FormField[]>([]);

  // Load saved tasks from local storage on component mount
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
          id: `${draggedField.id}-${Date.now()}` // Ensure unique ID
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
    setTaskFields([]);
    setIsModalOpen(false);
  };

  const handleDeleteField = (taskIndex: number, fieldIndex: number) => {
    if (taskIndex === -1) {
      // Deleting from taskFields (current task being edited)
      const updatedTaskFields = taskFields.filter((_, idx) => idx !== fieldIndex);
      setTaskFields(updatedTaskFields);
    } else {
      // Deleting from savedTasks (previously saved tasks)
      const updatedTasks = [...savedTasks];

      // Check if taskIndex and fieldIndex are valid
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
        // Editing a field in the current task
        const updatedTaskFields = taskFields.map((field, index) =>
          index === selectedFieldIdx ? { ...field, ...editField } : field
        );
        setTaskFields(updatedTaskFields);
      } else {
        // Editing a field in a saved task
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
        ...prev!,
        [name]: value
      }));
    }
  };

  const getFieldValue = (field: FormField): string => {
    if (field.type === 'select' || field.type === 'radio' || field.type === 'multiselect') {
      return field.options?.join(', ') || '';
    } else {
      return field.placeholder || '';
    }
  };

  const handleAddSubtask = (taskIndex: number) => {
    const updatedTasks = savedTasks.map((task, idx) => {
      if (idx === taskIndex) {
        const newSubtask: FormField = {
          id: `subtask-${Date.now()}`,
          type: 'text',
          label: 'New Subtask',
          placeholder: 'Enter subtask details'
        };
        return [...task, newSubtask];
      }
      return task;
    });

    setSavedTasks(updatedTasks);
    localStorage.setItem('savedTasks', JSON.stringify(updatedTasks));
  };

  const handleTaskClick = (taskIndex: number) => {
    setSelectedTaskIdx(selectedTaskIdx === taskIndex ? null : taskIndex);
  };

  const handleFieldLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEditField(prev => ({
      ...prev!,
      label: value
    }));
  };

  const handleAddOption = () => {
    setEditField(prev => ({
      ...prev!,
      options: [...(prev?.options || []), '']
    }));
  };

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const { value } = e.target;
    setEditField(prev => {
      if (!prev || !prev.options) return prev;
      const updatedOptions = [...prev.options];
      updatedOptions[idx] = value;
      return {
        ...prev,
        options: updatedOptions
      };
    });
  };

  const handleRemoveOption = (idx: number) => {
    setEditField(prev => {
      if (!prev || !prev.options) return prev;
      const updatedOptions = prev.options.filter((_, index) => index !== idx);
      return {
        ...prev,
        options: updatedOptions
      };
    });
  };

  return (
    
    <div className="container">
      <div className="d-flex p-2 my-2 justify-content-between align-items-center">
        <span><i className="ri-team-line me-2"></i><span className='fw-bold'>Task Creation</span></span>
        <div className="d-flex">
          <div className="app-search d-none d-lg-block me-4">
            <form>
              <div className="input-group">
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search employee..."
                />
                <span className="ri-search-line search-icon text-muted" />
              </div>
            </form>
          </div>
        </div>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="d-flex justify-content-between row">
          <Droppable droppableId="inventory">
            {(provided: DroppableProvided) => (
              <div
                className="inventory p-3 border col-4"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <h4>Inventory</h4>
                {inventory.map((field, index) => (
                  <Draggable key={field.id} draggableId={field.id} index={index}>
                    {(provided: DraggableProvided) => (
                      <div
                        className="p-2 mb-2 bg-light border"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {field.label}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <Droppable droppableId="taskFields">
            {(provided: DroppableProvided) => (
              <div
                className="task-fields p-3 border col-8"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <h4>Task Fields</h4>
                {taskFields.map((field, index) => (
                  <Draggable key={field.id} draggableId={field.id} index={index}>
                    {(provided: DraggableProvided) => (
                      <div
                        className="p-2 mb-2 bg-light border d-flex justify-content-between align-items-center"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <span>{field.label}</span>
                        <div>
                          <Button variant="link" onClick={() => handleEditField(field, -1, index)}>
                            <i className="ri-edit-fill text-primary"></i>
                          </Button>
                          <Button variant="link" onClick={() => handleDeleteField(-1, index)}>
                            <i className="ri-delete-bin-fill text-danger"></i>
                          </Button>
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
      </DragDropContext>
      <Button variant="primary" className="mt-3" onClick={handleSaveTask}>
        Save Task
      </Button>

      <Modal show={isModalOpen} onHide={handleEditCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Field</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="editLabel">
              <Form.Label>Label</Form.Label>
              <Form.Control
                type="text"
                name="label"
                value={editField?.label || ''}
                onChange={handleFieldLabelChange}
              />
            </Form.Group>

            {editField?.type === 'text' && (
              <Form.Group controlId="editPlaceholder">
                <Form.Label>Placeholder</Form.Label>
                <Form.Control
                  type="text"
                  name="placeholder"
                  value={editField?.placeholder || ''}
                  onChange={handleChange}
                />
              </Form.Group>
            )}

            {editField?.type === 'select' && (
              <Form.Group controlId="editOptions">
                <Form.Label>Options</Form.Label>
                <ListGroup>
                  {editField.options?.map((option, idx) => (
                    <ListGroup.Item key={idx} className="d-flex justify-content-between align-items-center">
                      <Form.Control
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(e, idx)}
                      />
                      <Button
                        variant="link"
                        onClick={() => handleRemoveOption(idx)}
                      >
                        Remove
                      </Button>
                    </ListGroup.Item>
                  ))}
                  <Button
                    variant="link"
                    onClick={handleAddOption}
                  >
                    Add Option
                  </Button>
                </ListGroup>
              </Form.Group>
            )}

            {editField?.type === 'status' && (
              <Form.Group controlId="editStatus">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  as="select"
                  name="status"
                  value={editField?.status || 'pending'}
                  onChange={handleChange}
                >
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                </Form.Control>
              </Form.Group>
            )}

            {editField?.type === 'date' && (
              <>
                <Form.Group controlId="editActualDate">
                  <Form.Label>Actual Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="actualDate"
                    value={editField?.actualDate || ''}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="editPlannedDate">
                  <Form.Label>Planned Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="plannedDate"
                    value={editField?.plannedDate || ''}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="editExtendedDate">
                  <Form.Label>Extended Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="extendedDate"
                    value={editField?.extendedDate || ''}
                    onChange={handleChange}
                  />
                </Form.Group>
              </>
            )}

            {editField?.type === 'successorTask' && (
              <Form.Group controlId="editSuccessorTask">
                <Form.Label>Successor Task</Form.Label>
                <Form.Control
                  type="text"
                  name="successorTaskId"
                  value={editField?.successorTaskId || ''}
                  onChange={handleChange}
                />
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEditCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>


      {savedTasks.length > 0 && (
        <div className="mt-5">
          <h2>Saved Tasks</h2>
          <div className="row">
            {savedTasks.map((task, taskIdx) => (
              <div key={taskIdx} className="col-md-4 mb-3">
                <Card>
                  <Card.Body onClick={() => handleTaskClick(taskIdx)}>
                    <Card.Title>Task {taskIdx + 1}</Card.Title>
                    <ul className="list-unstyled">
                      {task.map((field, fieldIdx) => (
                        <li key={fieldIdx} className='d-flex justify-content-between align-items-center'>
                          <span><strong>{field.label}: </strong> {getFieldValue(field)}</span>
                          <div>
                            <Button variant="link" onClick={() => handleEditField(field, taskIdx, fieldIdx)}>
                              <i className="ri-edit-fill"></i>
                            </Button>
                            <Button variant="link" onClick={() => handleDeleteField(taskIdx, fieldIdx)}>
                              <i className="ri-delete-bin-fill text-danger"></i>
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                    {selectedTaskIdx === taskIdx && (
                      <div>
                        <Button variant="link" onClick={() => handleAddSubtask(taskIdx)}>
                          Add Subtask
                        </Button>
                        {task.map((field, fieldIdx) =>
                          field.subtasks?.map((subtask, subtaskIdx) => (
                            <div key={subtaskIdx} className="mt-2">
                              <strong>{subtask.label}:</strong> {getFieldValue(subtask)}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </Card.Body>
                  <Card.Footer>
                    <Button variant="danger" onClick={() => handleDeleteTask(taskIdx)}>
                      Delete Task
                    </Button>
                  </Card.Footer>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )
      }
    </div >
  );
};

export default App;
