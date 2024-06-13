import React, { useState, useEffect } from 'react';
import { Modal, Button, } from 'react-bootstrap';
import EmployeeForm from './Employee-Master';


interface ProcessFormState {
	processName: string;
	processOwner: string;
	moduleName: string;
	processOutput: string;
	processId: string;

}

interface ProcessData extends ProcessFormState {
	createdAt: string;
	tasks: TaskFormState[];
}

interface TaskFormState {
	taskId: string;
	taskDisplayName: string;
	taskName: string;
	doerName: string;
	description: string;
	roleResponsible: string;
	plannedDate: string;
	predecessorTasks: string;
	successorTasks: string;
	generationType: string;
	misExempt: string;
	status1: string;
	problemSolver: string;
	sundayLogic: string;
	specificConditions: string;
	initiationDetails: string;
	tenderMasterDetails: string;
	fileUploads: File[];
}

const ProcessForm: React.FC = () => {
	const [formState, setFormState] = useState<ProcessFormState>({
		processName: '',
		processOwner: '',
		moduleName: '',
		processOutput: '',
		processId: '',
	});
	const [processes, setProcesses] = useState<ProcessData[]>([]);
	const [employees, setEmployees] = useState<any[]>([]);
	const [showAddEditModal, setShowAddEditModal] = useState<boolean>(false);
	const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
	const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
	const [selectedProcessIndex, setSelectedProcessIndex] = useState<number | null>(null);
	const [taskFormData, setTaskFormData] = useState<TaskFormState>({
		taskId: '',
		taskDisplayName: '',
		taskName: '',
		doerName: '',
		description: '',
		roleResponsible: '',
		plannedDate: '',
		predecessorTasks: '',
		successorTasks: '',
		generationType: 'Automated',
		misExempt: 'No',
		status1: 'ACTIVE',
		problemSolver: '',
		sundayLogic: '',
		specificConditions: '',
		initiationDetails: '',
		tenderMasterDetails: '',
		fileUploads: []
	});
	const [showTable, setShowTable] = useState(true);

	useEffect(() => {
		const savedProcesses = localStorage.getItem('processes');
		if (savedProcesses) {
			setProcesses(JSON.parse(savedProcesses));
		}
		const storedEmployees = localStorage.getItem('employees');
		if (storedEmployees) {
			setEmployees(JSON.parse(storedEmployees));
		}
	}, []);

	const handleEmployeeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedEmployeeName = event.target.value;
		setTaskFormData(prevFormData => ({
		  ...prevFormData,
		  doerName: selectedEmployeeName
		}));
	  };


	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormState({
			...formState,
			[name]: value,
		});
	};

	const handleTaskInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value, type, files } = e.target as HTMLInputElement;
		if (type === 'file') {
			setTaskFormData({
				...taskFormData,
				[name]: files ? Array.from(files) : []
			});
		} else {
			setTaskFormData({
				...taskFormData,
				[name]: value,
			});
		}
	};

	const handleDeleteProcess = (index: number) => {
		setDeleteIndex(index);
		setShowDeleteModal(true);
	};

	const [editingIndex, setEditingIndex] = useState<number | null>(null);

	const startEditing = (index: number) => {
		setEditingIndex(index);
		setFormState(currentState => ({
			...currentState,
			...processes[index]
		}));
		setShowAddEditModal(true);
	};

	const saveEdits = () => {
		try {
			if (editingIndex !== null) {
				const updatedProcesses = [...processes];
				const currentTasks = updatedProcesses[editingIndex].tasks;
				updatedProcesses[editingIndex] = {
					...formState,
					createdAt: updatedProcesses[editingIndex].createdAt,
					tasks: currentTasks // Preserve the existing tasks
				};
				localStorage.setItem('processes', JSON.stringify(updatedProcesses));
				setProcesses(updatedProcesses);
				setEditingIndex(null);
				setShowAddEditModal(false);
				setFormState({
					processName: '',
					processOwner: '',
					moduleName: '',
					processOutput: '',
					processId: '',
				});
			}
		} catch (error) {
			console.error('Error saving edits:', error);
		}
	};

	const deleteProcess = () => {
		if (deleteIndex !== null) {
			const updatedProcesses = processes.filter((_, index) => index !== deleteIndex);
			localStorage.setItem('processes', JSON.stringify(updatedProcesses));
			setProcesses(updatedProcesses);
		}
		setShowDeleteModal(false);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const createdAt = new Date().toISOString();
			const newProcess: ProcessData = {
				...formState,
				createdAt,
				tasks: [] // Initialize an empty tasks array for the new process
			};
			const updatedProcesses = [...processes, newProcess];
			localStorage.setItem('processes', JSON.stringify(updatedProcesses));
			setProcesses(updatedProcesses);
			setFormState({
				processName: '',
				processOwner: '',
				moduleName: '',
				processOutput: '',
				processId: '',
			});
			setShowAddEditModal(false);
		} catch (error) {
			console.error('Error submitting form:', error);
		}
	};

	const handleCreateTask = (processIndex: number) => {
		setSelectedProcessIndex(processIndex);
		setShowTable(false);
	};

	const handleTaskFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (selectedProcessIndex !== null) {
			// Assuming each process has a unique 'processId' property
			const processId = processes[selectedProcessIndex].processId;
			const newTaskIndex = processes[selectedProcessIndex].tasks.length + 1;
			const newTaskId = `${processId}.T${newTaskIndex - 1}`;

			// Create a new task object with the auto-generated task ID
			const newTask: TaskFormState = {
				...taskFormData,
				taskId: newTaskId, // Set the auto-generated task ID here
				// ... (rest of the task properties)
			};
			console.log('taskId')

			// Add the new task to the tasks array of the selected process
			const updatedProcesses = [...processes];
			updatedProcesses[selectedProcessIndex].tasks.push(newTask);

			// Save the updated processes array to the state and local storage
			setProcesses(updatedProcesses);
			localStorage.setItem('processes', JSON.stringify(updatedProcesses));

			// Reset the task form state and close the task form
			setTaskFormData({
				taskId: '',
				taskDisplayName: '',
				taskName: '',
				doerName: '',
				description: '',
				roleResponsible: '',
				plannedDate: '',
				predecessorTasks: '',
				successorTasks: '',
				generationType: 'Automated',
				misExempt: 'No',
				status1: 'ACTIVE',
				problemSolver: '',
				sundayLogic: '',
				specificConditions: '',
				initiationDetails: '',
				tenderMasterDetails: '',
				fileUploads: []
			});
			setSelectedProcessIndex(null);
			setShowTable(true);
		}
	};

	const closeTaskForm = () => {
		setSelectedProcessIndex(null);
		setTaskFormData({
			taskId: '',
			taskDisplayName: '',
			taskName: '',
			doerName: '',
			description: '',
			roleResponsible: '',
			plannedDate: '',
			predecessorTasks: '',
			successorTasks: '',
			generationType: 'Automated',
			misExempt: 'No',
			status1: 'ACTIVE',
			problemSolver: '',
			sundayLogic: '',
			specificConditions: '',
			initiationDetails: '',
			tenderMasterDetails: '',
			fileUploads: []
		});
		setShowTable(true);
	};

	return (
		<div>
			<div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center">
				<span><i className="ri-list-settings-line me-2"></i><span className='fw-bold'>Process List</span></span>
				<div className="d-flex">
					<div className="app-search d-none d-lg-block me-4">
						<form>
							<div className="input-group">
								<input
									type="search"
									className="form-control"
									placeholder="Search Process..."
								/>
								<span className="ri-search-line search-icon text-muted" />
							</div>
						</form>
					</div>
					<Button variant="primary" onClick={() => {
						setEditingIndex(null);
						setFormState({
							processName: '',
							processOwner: '',
							moduleName: '',
							processOutput: '',
							processId: '',
						});
						setShowAddEditModal(true);
					}}>
						Add Process
					</Button>
				</div>
			</div>

			<Modal show={showAddEditModal} onHide={() => setShowAddEditModal(false)} size="lg">
				<Modal.Header closeButton>
					<Modal.Title>{editingIndex !== null ? 'Edit Process' : 'Add Process'}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<form onSubmit={editingIndex !== null ? saveEdits : handleSubmit}>
						<div className="row">
							<div className="form-group col-lg-6 col-md-6 col-sm-12 p-2">
								<label htmlFor="moduleName">Module Name</label>
								<input
									type="text"
									className="form-control"
									id="moduleName"
									name="moduleName"
									value={formState.moduleName}
									onChange={handleInputChange}
									required
								/>
							</div>
							<div className="form-group col-lg-6 col-md-6 col-sm-12 p-2">
								<label htmlFor="processName">Process Id</label>
								<input
									type="text"
									className="form-control"
									id="processId"
									name="processId"
									value={formState.processId}
									onChange={handleInputChange}
									required
								/>
							</div>
							<div className="form-group col-lg-6 col-md-6 col-sm-12 p-2">
								<label htmlFor="processName">Process Name</label>
								<input
									type="text"
									className="form-control"
									id="processName"
									name="processName"
									value={formState.processName}
									onChange={handleInputChange}
									required
								/>
							</div>
							<div className="form-group col-lg-6 col-md-6 col-sm-12 p-2">
								<label htmlFor="processOwner">Process Owner Name</label>
								<input
									type="text"
									className="form-control"
									id="processOwner"
									name="processOwner"
									value={formState.processOwner}
									onChange={handleInputChange}
									required
								/>
							</div>
							<div className="form-group col-lg-6 col-md-6 col-sm-12 p-2">
								<label htmlFor="processOutput">Process Output</label>
								<input
									type="text"
									className="form-control"
									id="processOutput"
									name="processOutput"
									value={formState.processOutput}
									onChange={handleInputChange}
									required
								/>
							</div>

						</div>
						<div className="d-flex justify-content-end col-12 py-2">
							<button type="submit" className="btn btn-primary">
								{editingIndex !== null ? 'Save Changes' : 'Save Process'}
							</button>
						</div>

					</form>
				</Modal.Body>
			</Modal>
			<div className="row">
				{showTable && processes.length > 0 ? (
					<div className="table-responsive">
						<table className='table-centered mb-0 table bg-white'>
							<thead>
								<tr>
									<th>Module</th>
									<th>Process Name</th>
									<th>Owner</th>
									<th>Output</th>
									<th>Created On</th>
									<th style={{ width: 250 }}>Actions</th>
								</tr>
							</thead>
							<tbody>
								{processes.map((process, index) => (
									<tr key={index}>
										<td>{process.moduleName}</td>
										<td>{process.processId}{process.processName}</td>
										<td>{process.processOwner}</td>
										<td>{process.processOutput}</td>
										<td>{new Date(process.createdAt).toLocaleString()}</td>
										<td>
											<button className='btn btn-primary'
												type="button"

												onClick={() => handleCreateTask(index)}
											>
												<span><i className="ri-add-line text-light"></i></span> Task
											</button>
											<button className='btn' type="button" onClick={() => startEditing(index)}>
												<i className="ri-edit-line text-primary"></i>
											</button>
											<button className='btn' type="button" onClick={() => handleDeleteProcess(index)}>
												<i className="ri-delete-bin-line text-danger"></i>
											</button>
											{/* <button className='btn' type="button" onClick={() => handleViewProcess(index)}>
												<i className="ri-eye-line text-danger"></i>
											</button> */}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				) :
					(
						<div></div>
						// <div className="no-data-container" style={{ textAlign: 'center', margin: '2rem' }}>
						// 	<i className="ri-file-info-line" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
						// 	<h5 style={{ color: '#6c757d' }}>No Data Found</h5>
						// </div>
					)
				}
			</div>
			{selectedProcessIndex !== null && (
				<div className="task-form-container bg-white p-3 mt-3">
					<div className="d-flex justify-content-between align-items-center">
						<h4>Process Name: <span className='text-primary'>{processes[selectedProcessIndex].processName}</span></h4>
						<button className='btn btn-close' onClick={closeTaskForm}></button>
					</div>
					<form onSubmit={handleTaskFormSubmit}>
						<div className='row'>
							<div className="form-group col-lg-4 col-md-4 col-sm-12 p-2">
								<label htmlFor="taskName">Task Name</label>
								<input
									type="text"
									id="taskName"
									name="taskName"
									value={taskFormData.taskName}
									onChange={handleTaskInputChange}
									className="form-control"
									required
								/>
							</div>
							<div className="form-group col-lg-4 col-md-4 col-sm-12 p-2">
								<label htmlFor="doerName">Doer Name:</label>
								<select className='form-control' id="employeeSelect" name="employeeSelect">
									{employees.map((emp, index) => (
										<option key={index} value={emp.name}>{emp.name}</option>
									))}
								</select>
								{/* <label htmlFor="doerName">Doer Name</label>
								<input
									type="text"
									id="doerName"
									name="doerName"
									value={taskFormData.doerName}
									onChange={handleTaskInputChange}
									className="form-control"
									required
								/> */}
							</div>
							{/* <div className="form-group col-lg-4 col-md-4 col-sm-12 p-2">
								<label htmlFor="description">Description</label>
								<textarea
									id="description"
									name="description"
									value={taskFormData.description}
									onChange={handleTaskInputChange}
									className="form-control"
									required
								></textarea>
							</div> */}
							<div className="form-group col-lg-4 col-md-4 col-sm-12 p-2">
								<label htmlFor="roleResponsible">Role Responsible for the Task</label>
								<input
									type="text"
									id="roleResponsible"
									name="roleResponsible"
									value={taskFormData.roleResponsible}
									onChange={handleTaskInputChange}
									className="form-control"
									required
								/>
							</div>
							<div className="form-group col-lg-4 col-md-4 col-sm-12 p-2">
								<label htmlFor="plannedDate">Planned Date Calculation</label>
								<input
									type="datetime-local"
									id="plannedDate"
									name="plannedDate"
									value={taskFormData.plannedDate}
									onChange={handleTaskInputChange}
									className="form-control"
									required
								/>
							</div>
							<div className="form-group col-lg-4 col-md-4 col-sm-12 p-2">
								<label htmlFor="predecessorTasks">Predecessor Tasks</label>
								<input
									type="text"
									id="predecessorTasks"
									name="predecessorTasks"
									value={taskFormData.predecessorTasks}
									onChange={handleTaskInputChange}
									className="form-control"
								/>
							</div>
							<div className="form-group col-lg-4 col-md-4 col-sm-12 p-2">
								<label htmlFor="successorTasks">Successor Tasks</label>
								<input
									type="text"
									id="successorTasks"
									name="successorTasks"
									value={taskFormData.successorTasks}
									onChange={handleTaskInputChange}
									className="form-control"
								/>
							</div>
							<div className="form-group col-lg-4 col-md-4 col-sm-12 p-2">
								<label htmlFor="generationType">Generation Type</label>
								<select
									id="generationType"
									name="generationType"
									value={taskFormData.generationType}
									onChange={handleTaskInputChange}
									className="form-control"
								>
									<option value="Automated">Automated</option>
									<option value="Manual">Manual</option>
								</select>
							</div>
							<div className="form-group col-lg-4 col-md-4 col-sm-12 p-2">
								<label htmlFor="misExempt">MIS Exempt</label>
								<select
									id="misExempt"
									name="misExempt"
									value={taskFormData.misExempt}
									onChange={handleTaskInputChange}
									className="form-control"
								>
									<option value="Yes">Yes</option>
									<option value="No">No</option>
								</select>
							</div>
							<div className="form-group col-lg-4 col-md-4 col-sm-12 p-2">
								<label htmlFor="status1">Status</label>
								<select
									id="status1"
									name="status"

									onChange={handleTaskInputChange}
									className="form-select form-control"
								>
									<option value="ACTIVE">ACTIVE</option>
									<option value="PENDING">PENDING</option>
									<option value="COMPLETED">COMPLETED</option>
								</select>
							</div>
							<div className="form-group col-lg-4 col-md-4 col-sm-12 p-2">
								<label htmlFor="problemSolver">Problem Solver</label>
								{/* <input
									type="text"
									id="problemSolver"
									name="problemSolver"
									value={taskFormData.problemSolver}
									onChange={handleTaskInputChange}
									className="form-control"
								/> */}
								<select className='form-control' id="problemSolver" name="problemSolver">
									{employees.map((emp, index) => (
										<option key={index} value={emp.name}>{emp.name}</option>
									))}
								</select>
							</div>
							{/* <div className="form-group col-lg-4 col-md-4 col-sm-12 p-2">
								<label htmlFor="sundayLogic">Sunday Logic</label>
								<textarea
									id="sundayLogic"
									name="sundayLogic"
									value={taskFormData.sundayLogic}
									onChange={handleTaskInputChange}
									className="form-control"
								></textarea>
							</div>
							<div className="form-group col-lg-4 col-md-4 col-sm-12 p-2">
								<label htmlFor="specificConditions">Specific Conditions and Logic</label>
								<textarea
									id="specificConditions"
									name="specificConditions"
									value={taskFormData.specificConditions}
									onChange={handleTaskInputChange}
									className="form-control"
								></textarea>
							</div> */}
							<div className="form-group col-lg-4 col-md-4 col-sm-12 p-2">
								<label htmlFor="initiationDetails">Initiation Details</label>
								<textarea
									id="initiationDetails"
									name="initiationDetails"
									value={taskFormData.initiationDetails}
									onChange={handleTaskInputChange}
									className="form-control"
								></textarea>
							</div>
							<div className="form-group col-lg-4 col-md-4 col-sm-12 p-2">
								<label htmlFor="tenderMasterDetails">Tender Master Details</label>
								<textarea
									id="tenderMasterDetails"
									name="tenderMasterDetails"
									value={taskFormData.tenderMasterDetails}
									onChange={handleTaskInputChange}
									className="form-control"
								></textarea>
							</div>
							<div className="form-group col-lg-4 col-md-4 col-sm-12 p-2">
								<label htmlFor="fileUploads">File Uploads</label>
								<input
									type="file"
									id="fileUploads"
									name="fileUploads"
									multiple
									onChange={handleTaskInputChange}
									className="form-control"
									accept="application/pdf"
								/>
							</div>
						</div>
						<div className="d-flex justify-content-end">
							<div className="d-flex">
								<button type="submit" className="btn btn-primary mx-2">Submit Task</button>
								<button type="button" className="btn btn-secondary ms-2" onClick={closeTaskForm}>Close</button>
							</div>
						</div>

					</form>
				</div>
			)}
			{selectedProcessIndex !== null && processes[selectedProcessIndex].tasks && (
				<div>
					<h5 className='py-3 ps-2 my-2 bg-white'>Tasks list for : <span className='text-primary'>{processes[selectedProcessIndex].processName}</span></h5>
					<div className='overflow-x-auto'>
						{processes[selectedProcessIndex].tasks.length > 0 ? (
							<table className='table-centered mb-0 table bg-white'>
								<thead>
									<tr>
										<th>Task ID</th>
										<th>Display Name</th>
										<th>Task Name</th>
										<th>Doer Name</th>
										<th>Description</th>
										<th>Role Responsible</th>
										<th>Planned Date</th>
										<th>Predecessor Tasks</th>
										<th>Successor Tasks</th>
										<th>Generation Type</th>
										<th>MIS Exempt</th>
										<th>Status</th>
										<th>Problem Solver</th>
										{/* <th>Sunday Logic</th>
										<th>Specific Conditions</th>
										<th>Initiation Details</th>
										<th>Tender Master Details</th>
										<th>File Uploads</th> */}
									</tr>
								</thead>
								<tbody>
									{processes[selectedProcessIndex].tasks.map((task, index) => (
										<tr key={index}>
											<td>{task.taskId}</td>
											<td>{task.taskDisplayName}</td>
											<td>{task.taskName}</td>
											<td>{task.doerName}</td>
											<td>{task.description}</td>
											<td>{task.roleResponsible}</td>
											<td>{task.plannedDate}</td>
											<td>{task.predecessorTasks}</td>
											<td>{task.successorTasks}</td>
											<td>{task.generationType}</td>
											<td>{task.misExempt}</td>
											<td>{task.status1}</td>
											<td>{task.problemSolver}</td>
											{/* <td>{task.sundayLogic}</td>
											<td>{task.specificConditions}</td>
											<td>{task.initiationDetails}</td>
											<td>{task.tenderMasterDetails}</td>
											<td>
												{task.fileUploads.map((file, fileIndex) => (
													<div key={fileIndex}>{file.name}</div>
												))}
											</td> */}
										</tr>
									))}
								</tbody>
							</table>
						) : (
							<p>No tasks available.</p>
						)}
					</div>
				</div>
			)}
			<Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Delete Process</Modal.Title>
				</Modal.Header>
				<Modal.Body>Are you sure you want to delete this process?</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
						Cancel
					</Button>
					<Button variant="danger" onClick={deleteProcess}>
						Delete
					</Button>
				</Modal.Footer>
			</Modal>
		</div>

	);
};

export default ProcessForm;
