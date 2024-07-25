import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Form, Button } from 'react-bootstrap';

const YourComponent = () => {
  const [formData, setFormData] = useState({
    ModuleName: '',
    processes: '',
    taskName: ''
  });

  const [inventory, setInventory] = useState([
    { id: '1', labeltext: 'Field 1' },
    { id: '2', labeltext: 'Field 2' },
    { id: '3', labeltext: 'Field 3' },
    // Add more fields as needed
  ]);

  const [taskFields, setTaskFields] = useState([
    {
      id: 'task1',
      labeltext: 'Task 1',
      children: []
    },
    // Add initial tasks as needed
  ]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic
  };

  const handleDragEnd = (result) => {
    // Handle drag end logic
  };

  const handleSaveTask = () => {
    // Handle save task logic
  };

  const addInputField = (taskId) => {
    setTaskFields((prevFields) =>
      prevFields.map((task) =>
        task.id === taskId
          ? {
              ...task,
              children: [
                ...task.children,
                { id: `${taskId}-${task.children.length + 1}`, labeltext: 'New Field' }
              ]
            }
          : task
      )
    );
  };

  const renderField = (field, parentIndex, index) => {
    return (
      <div>
        {field.labeltext}
        <Button variant="link" onClick={() => addInputField(field.id)}>
          Add
        </Button>
        {field.children && field.children.length > 0 && (
          <Droppable droppableId={`${field.id}-children`} type="child">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {field.children.map((child, childIndex) => (
                  <Draggable key={child.id} draggableId={child.id} index={childIndex}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="list-group-item col-md-6 col-sm-12 border-none my-1 p-1"
                      >
                        {renderField(child, index, childIndex)}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        )}
      </div>
    );
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className='row m-0'>
        <Form className='row col-md-12 p-2 bg-white rounded align-items-end m-0' onSubmit={handleFormSubmit}>
          <Form.Group className='col-md-3 my-1'>
            <Form.Label>Select Module</Form.Label>
            <Form.Control
              as="select"
              name="ModuleName"
              value={formData.ModuleName}
              onChange={handleFormChange}
              required
            >
              <option value="">Select Modules</option>
              {['Accounts', 'Procurement', 'Business Development', 'Mechanical', 'Mobilization'].map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group className='col-md-3 my-1'>
            <Form.Label>Select Process</Form.Label>
            <Form.Control
              as="select"
              name="processes"
              value={formData.processes}
              onChange={handleFormChange}
              required
            >
              <option value="">Select Process</option>
              {['Mess Weekly Payments', 'Mess Monthly Reconciliation', 'Monthly Budget FR [PNC]', 'Credit and Debit balance resolution', 'Bill Processing at HO'].map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </Form.Control>
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
          <div className="d-flex col-md-3 justify-content-end">
            <Button variant="primary" type="submit" style={{ height: 'max-content' }}>
              Add Task Details
            </Button>
          </div>
        </Form>

        <div className="col-md-12 p-2 bg-white my-1">
          <h4>Available Fields</h4>
          <Droppable droppableId="inventory">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="row">
                {inventory.map((field, index) => (
                  <Draggable key={field.id} draggableId={field.id} index={index}>
                    {(provided) => (
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

        <div className="row bg-white p-2 rounded m-0">
          <div className='col-12'>
            <h4>Build Your Task</h4>
            <Droppable droppableId="taskFields">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="list-group row flex-row m-0">
                  {taskFields.map((field, index) => (
                    <Draggable key={field.id} draggableId={field.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="list-group-item col-md-6 col-sm-12 border-none my-1 p-1"
                          style={{ border: '1px' }}
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
              {taskFields.map((field, index) => (
                <option key={index} value={field.labeltext}>
                  {field.labeltext}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </div>
      </div>
      <div className="d-flex justify-content-end p-2 col-12">
        <Button variant="primary" onClick={handleSaveTask}>
          Save Task
        </Button>
      </div>
    </DragDropContext>
  );
};

export default YourComponent;
