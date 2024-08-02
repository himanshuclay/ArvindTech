import React, { useState, useEffect } from 'react';
import { Modal, Button, } from 'react-bootstrap';
import EmployeeForm from './Employee-Master';
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/flatpickr.css';
import { format } from 'date-fns';
import Select from 'react-select';
import { ChangeEvent } from 'react';
import axios from 'axios';



interface AccountMessWeeklyPaymentsMessRequest {
	id: number;
	projectId: string;
	moduleId: string;
	processId: string;
	messId: string;
	messName: string;
	messManagerEmpId: string;
	messManagerEmpName: string;
	createdDate: Date;
	createdBy: string;
	updatedDate: Date;
	updatedBy: string;
}

interface ProcessFormState {
	employeeId: string;
	employeeName: string;
	processId: string;
	processName: string;
	moduleId: string;
	moduleName: string;
	projectId: string;
	projectName: string;
	periodDate: Date;
	weekDate: Date;
	sourceId: number;
	createdBy: string;
	accountMesses: AccountMessWeeklyPaymentsMessRequest[];
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

interface ProjectOption {
	value: string;
	label: string;
}

const ProcessForm: React.FC = () => {
	const [formState, setFormState] = useState<ProcessFormState>({
		employeeId: '',
		employeeName: '',
		processId: '',
		processName: '',
		moduleId: '',
		moduleName: '',
		projectId: '',
		projectName: '',
		periodDate: new Date(),
		weekDate: new Date(),
		sourceId: 0,
		createdBy: '',
		accountMesses: []
	});
	const [processes, setProcesses] = useState<ProcessData[]>([]);
	const [projects, setProjects] = useState<{ id: string; projectName: string }[]>([]);
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
		setProjects([
			{ id: '1', projectName: 'PNC_GWALIOR' },
		]);
		const savedProcesses = localStorage.getItem('processes');
		if (savedProcesses) {
			setProcesses(JSON.parse(savedProcesses));
		}
		const storedEmployees = localStorage.getItem('employees');
		if (storedEmployees) {
			setEmployees(JSON.parse(storedEmployees));
		}
		const fetchProjects = async () => {
			try {
				const response = await fetch('https://localhost:44306/api/CommonDropdown/GetProjectList', {
					method: 'GET',
					headers: {
						'accept': '*/*'
					}
				});
				const data = await response.json();
				if (data.isSuccess) {
					setProjects(data.projectListResponses);
				} else {
					console.error('Failed to fetch projects:', data.message);
				}
			} catch (error) {
				console.error('Error fetching projects:', error);
			}
		};

		fetchProjects();

	}, []);


	// const handleEmployeeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
	// 	const selectedEmployeeName = event.target.value;
	// 	setTaskFormData(prevFormData => ({
	// 	  ...prevFormData,
	// 	  doerName: selectedEmployeeName
	// 	}));
	//   };


	// const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
	// 	const { name, value } = e.target;
	// 	setFormState({
	// 		...formState,
	// 		[name]: value,
	// 	});
	// };

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
					employeeId: '',
					employeeName: '',
					processId: '',
					processName: '',
					moduleId: '',
					moduleName: '',
					projectId: '',
					projectName: '',
					periodDate: new Date(),
					weekDate: new Date(),
					sourceId: 0,
					createdBy: '',
					accountMesses: []
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
				employeeId: '',
				employeeName: '',
				processId: '',
				processName: '',
				moduleId: '',
				moduleName: '',
				projectId: '',
				projectName: '',
				periodDate: new Date(),
				weekDate: new Date(),
				sourceId: 0,
				createdBy: '',
				accountMesses: []
			});
			setShowAddEditModal(false);
		} catch (error) {
			console.error('Error submitting form:', error);
		}
	};

	const handleDateChange = (date: Date[]) => {
		setFormState(prevState => ({
			...prevState,
			periodDate: date[0]
		}));
	};


	interface Project {
		id: string;
		projectName: string;
	}

	interface SelectOption {
		value: string;
		label: string;
	}

	const [modules, setModules] = useState([]);
	const [selectedModule, setSelectedModule] = useState('');
	const [selectedProcess, setSelectedProcess] = useState('');

	// Fetch module list on component mount
	useEffect(() => {
		axios.get('https://localhost:44306/api/CommonDropdown/GetModuleList')
			.then(response => {
				const moduleOptions = response.data.moduleNameListResponses.map(module => ({
					value: module.moduleName,
					label: module.moduleName,
				}));
				setModules(moduleOptions);
			})
			.catch(error => console.error('Error fetching modules:', error));
	}, []);

	// Fetch process list when selectedModule changes
	useEffect(() => {
		if (selectedModule) {
			axios.get(`https://localhost:44306/api/CommonDropdown/GetProcessNameByModuleName?ModuleName=${selectedModule}`)
				.then(response => {
					const processOptions = response.data.processListResponses.map(process => ({
						value: process.processName,
						label: process.processName,
					}));
					setProcesses(processOptions);
				})
				.catch(error => console.error('Error fetching processes:', error));
		}
	}, [selectedModule]);

	const handleModuleChange = (selectedOption) => {
		setSelectedModule(selectedOption ? selectedOption.value : '');
		setSelectedProcess(''); // Clear selected process when module changes
	};

	// Handle process change
	const handleProcessChange = (selectedOption) => {
		setSelectedProcess(selectedOption ? selectedOption.value : '');
	};


	const handleWeekDateChange = (date: Date[]) => {
		setFormState(prevState => ({
			...prevState,
			weekDay: format(date[0], 'EEEE'),
			weekTime: format(date[0], 'HH:mm')
		}));
	};
	interface ApiResponse {
		isSuccess: boolean;
		message: string;
		messProjectListResponses: {
			messID: string;
			messName: string;
			managerEmpID: string;
			managerName: string;
		}[];
	}
	interface MessProjectListResponse {
		messID: string;
		messName: string;
		managerEmpID: string;
		managerName: string;
	}

	const [messOptions, setMessOptions] = useState<{ value: string; label: string }[]>([]);
	const [managerOptions, setManagerOptions] = useState<{ value: string; label: string }[]>([]);

	const handleInputChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormState(prevState => ({ ...prevState, [name]: value }));

		if (name === 'projectId') {
			console.log(`Selected project ID from select element: ${value}`);

			// Convert value to number for matching, if necessary
			const projectId = Number(value);

			// Check if projects array is populated correctly
			console.log('Projects array:', projects);

			// Find the project in the array
			const project = projects.find(project => project.id === projectId);
			console.log(`Found project: ${JSON.stringify(project)}`);

			if (project) {
				const projectName = project.projectName;
				console.log(`Project Name: ${projectName}`);

				try {
					const response = await fetch(`https://localhost:44306/api/CommonDropdown/GetMessandManagerListByProjectName?ProjectName=${projectName}`);
					console.log('API Response:', response);

					const data: ApiResponse = await response.json();
					console.log('API Data:', data);

					if (data.isSuccess) {
						const messOptions = data.messProjectListResponses.map(mess => ({
							value: mess.messID,
							label: mess.messName,
						}));

						const managerOptions = data.messProjectListResponses.map(manager => ({
							value: manager.managerEmpID,
							label: manager.managerName,
						}));

						setMessOptions(messOptions);
						setManagerOptions(managerOptions);

						data.messProjectListResponses.forEach(response => {
							console.log(`Mess Name: ${response.messName}, Manager Name: ${response.managerName}`);
						});
					}
				} catch (error) {
					console.error('Error fetching mess and manager list:', error);
				}
			} else {
				console.log('Project not found');
			}
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

	const payload = {
		employeeID: formState.employeeId, // Adjust as needed
		employeeName: formState.employeeName, // Adjust as needed
		processID: formState.processId, // Ensure this matches your API
		processName: formState.processName,
		moduleID: formState.moduleId, // Ensure this matches your API
		moduleName: formState.moduleName,
		projectId: formState.projectId,
		projectName: formState.projectName, // Adjust as needed
		periodDate: formState.periodDate.toISOString(), // Convert to ISO string if needed
		weekDate: formState.weekDate.toISOString(), // Convert to ISO string if needed
		sourceId: formState.sourceId,
		createdBy: formState.createdBy, // Adjust as needed
		accountMesses: formState.accountMesses.map(mess => ({
			projectId: mess.projectId,
			moduleID: mess.moduleId,
			processID: mess.processId,
			messId: mess.messId,
			messName: mess.messName,
			messManagerEmpId: mess.messManagerEmpId,
			messManagerEmpName: mess.messManagerEmpName,
			createdBy: mess.createdBy, // Adjust as needed
		}))
	};

	axios.post('https://localhost:7235/api/MessWeeklyPayments/CreateInitiation', payload, {
		headers: {
			'Accept': '*/*',
			'Content-Type': 'application/json',
		}
	}
	)
		.then(response => {
			console.log('Data submitted successfully:', response.data);
		})
		.catch(error => console.error('Error submitting data:', error));
	console.log(payload)

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
							employeeId: '',
							employeeName: '',
							processId: '',
							processName: '',
							moduleId: '',
							moduleName: '',
							projectId: '',
							projectName: '',
							periodDate: new Date(),
							weekDate: new Date(),
							sourceId: 0,
							createdBy: '',
							accountMesses: []
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
								<label htmlFor="projectId">Project Name</label>
								<select
									className="form-control"
									id="projectId"
									name="projectId"
									value={formState.projectId}
									onChange={handleInputChange}
									required
								>
									<option value="">Select Project Name</option>
									{projects.map(project => (
										<option key={project.id} value={project.id}>
											{project.projectName}
										</option>
									))}
								</select>
							</div>
							<div className="form-group col-lg-6 col-md-6 col-sm-12 p-2">
								<label htmlFor="moduleName">Module Name</label>
								<Select
									className="basic-single"
									classNamePrefix="select"
									name="moduleName"
									options={modules}
									onChange={handleModuleChange}
									placeholder="Select Module"
									value={modules.find(option => option.value === selectedModule) || null}
									isClearable
								/>
							</div>
							<div className="form-group col-lg-6 col-md-6 col-sm-12 p-2">
								<label htmlFor="processName">Process Name</label>
								<Select
									className="basic-single"
									classNamePrefix="select"
									name="processName"
									options={processes}
									onChange={handleProcessChange}
									placeholder="Select Process Name"
									value={processes.find(option => option.value === selectedProcess) || null}
									isClearable
									isDisabled={!selectedModule} // Disable if no module is selected
								/>
							</div>
							{selectedModule === 'Accounts' && (
								<div className="form-group col-lg-6 col-md-6 col-sm-12 p-2">
									<label htmlFor="messName">Mess Name</label>
									<Select
										className="basic-single"
										classNamePrefix="select"
										name="messName"
										options={messOptions}
										onChange={handleInputChange}
										placeholder="Select"
										isClearable
									/>
									{/* <select
									  className="form-control"
									  id="messName"
									  name="messName"
									  value={formState.moduleName}
									  onChange={handleInputChange}
									  required
								  >
									  <option value="">Select</option>
									  {messOptions.map(mess => (
										  <option key={mess.value} value={mess.value}>
											  {mess.label}
										  </option>
									  ))}
								  </select> */}
								</div>
							)}
							{selectedModule === 'Accounts' && (
								<div className="form-group col-lg-6 col-md-6 col-sm-12 p-2">
									<label htmlFor="managerName">Mess Manager Name</label>
									{/* <select
									className="form-control"
									id="managerName"
									name="managerName"
									value={formState.moduleName}
									onChange={handleInputChange}
									required
								>
									<option value="">Select</option>
									{managerOptions.map(manager => (
										<option key={manager.value} value={manager.value}>
											{manager.label}
										</option>
									))}
								</select> */}
									<Select
										className="basic-single"
										classNamePrefix="select"
										name="managerName"
										options={managerOptions}
										onChange={handleInputChange}
										placeholder="Select"
										isClearable
									/>
								</div>)}
							<div className="form-group col-lg-6 col-md-6 col-sm-12 p-2">
								<label htmlFor="sourceId">Source</label>
								<input type="text" className='form-control' name="Source" id="" />
							</div>
							<div className="form-group col-lg-6 col-md-6 col-sm-12 p-2">
								<label htmlFor="periodDate">Period Date</label>
								<Flatpickr
									className="form-control"
									options={{ dateFormat: 'Y-m-d' }}
									value={[formState.periodDate]}
									onChange={handleDateChange}
								/>
							</div>
							<div className="form-group col-lg-6 col-md-6 col-sm-12 p-2">
								<label htmlFor="weekDate">Week Date</label>
								<Flatpickr
									className="form-control"
									options={{ enableTime: true, noCalendar: false, dateFormat: 'Y-m-d H:i' }}
									value={[formState.weekDate]}
									onChange={handleWeekDateChange}
								/>
							</div>
						</div>
						<div className="d-flex justify-content-end col-12 py-2">
							<button type="submit" className="btn btn-primary">
								Save Process
							</button>
						</div>
					</form>


				</Modal.Body>
			</Modal>
			{/* <div className="row">
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
										<td>{process.processId}</td>
										<td>{process.processName}</td>
										<td>{process.moduleId}</td>
										<td>{process.projectId}</td>
										<td>{process.projectName}</td>
										<td>{process.periodDate ? new Date(process.periodDate).toLocaleDateString() : 'N/A'}</td>
										<td>{process.weekDate ? new Date(process.weekDate).toLocaleDateString() : 'N/A'}</td>
										<td>{process.sourceId}</td>
										<td>{process.createdBy}</td>
										<td>
											<button
												className='btn btn-primary'
												type="button"
												onClick={() => handleCreateTask(index)}
											>
												<i className="ri-add-line text-light"></i> Task
											</button>
											<button
												className='btn btn-outline-primary'
												type="button"
												onClick={() => startEditing(index)}
											>
												<i className="ri-edit-line"></i>
											</button>
											<button
												className='btn btn-outline-danger'
												type="button"
												onClick={() => handleDeleteProcess(index)}
											>
												<i className="ri-delete-bin-line"></i>
											</button>

										</td>
									</tr>
								))}
							</tbody>

						</table>
					</div>
				) :
					(
						<div></div>
					)
				}
			</div> */}
			{/* {selectedProcessIndex !== null && (
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
							</div>
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
								<select className='form-control' id="problemSolver" name="problemSolver">
									{employees.map((emp, index) => (
										<option key={index} value={emp.name}>{emp.name}</option>
									))}
								</select>
							</div>
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
			)} */}
			{/* {selectedProcessIndex !== null && processes[selectedProcessIndex].tasks && (
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
										</tr>
									))}
								</tbody>
							</table>
						) : (
							<p>No tasks available.</p>
						)}
					</div>
				</div>
			)} */}
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
