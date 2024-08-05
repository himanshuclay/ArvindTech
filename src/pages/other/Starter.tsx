import React, { useState, useEffect } from 'react';
import { Modal, Button, } from 'react-bootstrap';
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/flatpickr.css';
import { format } from 'date-fns';
import Select from 'react-select';
import axios from 'axios';



interface AccountMessWeeklyPaymentsMessRequest {
	projectId: string,
	moduleID: string,
	processID: string,
	messId: string,
	messName: string,
	messManagerEmpId: string,
	messManagerEmpName: string,
	createdBy: string
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
	sourceId: string;
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
		sourceId: '',
		createdBy: '',
		accountMesses: [{
			projectId: '',
			moduleID: '',
			processID: '',
			messId: '',
			messName: '',
			messManagerEmpId: '',
			messManagerEmpName: '',
			createdBy: '',
		}]
	});
	const [processes, setProcesses] = useState<ProcessData[]>([]);
	const [projects, setProjects] = useState<{ id: string; projectName: string }[]>([]);
	const [employees, setEmployees] = useState<any[]>([]);
	const [showAddEditModal, setShowAddEditModal] = useState<boolean>(false);


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



	const [editingIndex, setEditingIndex] = useState<number | null>(null);


	// const saveEdits = () => {
	// 	try {
	// 		if (editingIndex !== null) {
	// 			const updatedProcesses = [...processes];
	// 			const currentTasks = updatedProcesses[editingIndex].tasks;
	// 			updatedProcesses[editingIndex] = {
	// 				...formState,
	// 				createdAt: updatedProcesses[editingIndex].createdAt,
	// 				tasks: currentTasks // Preserve the existing tasks
	// 			};
	// 			localStorage.setItem('processes', JSON.stringify(updatedProcesses));
	// 			setProcesses(updatedProcesses);
	// 			setEditingIndex(null);
	// 			setShowAddEditModal(false);
	// 			setFormState({
	// 				employeeId: '',
	// 				employeeName: '',
	// 				processId: '',
	// 				processName: '',
	// 				moduleId: '',
	// 				moduleName: '',
	// 				projectId: '',
	// 				projectName: '',
	// 				periodDate: new Date(),
	// 				weekDate: new Date(),
	// 				sourceId: '',
	// 				createdBy: '',
	// 				accountMesses: [{
	// 					projectId: '',
	// 					moduleId: '',
	// 					processId: '',
	// 					messId: '',
	// 					messName: '',
	// 					messManagerEmpId: '',
	// 					messManagerEmpName: '',
	// 					createdBy: '',
	// 				}]
	// 			});
	// 		}
	// 	} catch (error) {
	// 		console.error('Error saving edits:', error);
	// 	}
	// };

	const handleSubmit = async (e: React.FormEvent) => {
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

			// Construct the payload
			const payload = {
				employeeID: formState.employeeId || 'Him00123',
				employeeName: formState.employeeName || 'HimanshuPant',
				processID: formState.processId || 'defaultProcessId',
				processName: formState.processName || 'defaultProcessName',
				moduleID: formState.moduleId || 'defaultModuleId',
				moduleName: formState.moduleName || 'defaultModuleName',
				projectId: formState.projectId || 'defaultProjectId',
				projectName: formState.projectName || 'defaultProjectName',
				periodDate: formState.periodDate.toISOString(), // Convert to ISO string
				weekDate: formState.weekDate.toISOString(), // Convert to ISO string for date-time
				sourceId: formState.sourceId || 'defaultSourceId',
				createdBy: formState.createdBy || 'HimanshuPant',
				accountMesses: formState.accountMesses.map(mess => ({
					projectId: formState.projectId || 'defaultProjectId',
					moduleID: formState.moduleId || 'defaultModuleId',
					processID: formState.processId || 'defaultProcessId',
					messId: mess.messId || 'defaultMessId',
					messName: mess.messName || 'defaultMessName',
					messManagerEmpId: mess.messManagerEmpId || 'defaultMessManagerEmpId',
					messManagerEmpName: mess.messManagerEmpName || 'defaultMessManagerEmpName',
					createdBy: mess.createdBy || 'HimanshuPant'
				}))
			};

			console.log('Payload:', JSON.stringify(payload, null, 2)); // Pretty-print the payload

			// Post the payload to the API
			const response = await axios.post('https://localhost:7235/api/MessWeeklyPayments/CreateInitiation', payload, {
				headers: {
					'Accept': '*/*',
					'Content-Type': 'application/json',
				}
			});

			console.log('Data submitted successfully:', response.data);

			// Reset form state
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
				weekDate: new Date(), // This is now in date-time format
				sourceId: '',
				createdBy: '',
				accountMesses: [{
					projectId: '',
					moduleID: '',
					processID: '',
					messId: '',
					messName: '',
					messManagerEmpId: '',
					messManagerEmpName: '',
					createdBy: ''
				}]
			});

			setShowAddEditModal(false);
		} catch (error) {
			console.error('Error submitting form:', error);
			if (error.response) {
				console.error('API Response Error:', error.response.data);
			}
		}
	};

	const handleDateChange = (date: Date[]) => {
		setFormState(prevState => ({
			...prevState,
			periodDate: date[0]
		}));
	};

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
						processID: process.processID,
						processName: process.processName,
						moduleId: process.moduleId, // This should be "ACC"
						moduleName: process.moduleName, // This should be "Accounts"
						value: process.processID, // Use processID as the value for the Select component
						label: process.processName, // Use processName as the label for the Select component
					}));
					setProcesses(processOptions);
				})
				.catch(error => console.error('Error fetching processes:', error));
		}
	}, [selectedModule]);

    interface OptionType {
		value: string;
		label: string;
	  }

	const handleModuleChange = (selectedOption: OptionType | null) => {
		const moduleName = selectedOption ? selectedOption.label : '';
		const moduleId = selectedOption ? selectedOption.value : '';
		setFormState(prevState => ({ ...prevState, moduleName, moduleId }));
		setSelectedModule(moduleId);
		setSelectedProcess(''); // Clear selected process when module changes
	  };
	
	  const handleProcessChange = (selectedOption: any) => {
		if (selectedOption) {
			const { processID, processName, moduleId, moduleName } = selectedOption;
			setSelectedProcess(processID);
			setFormState(prevState => ({
				...prevState,
				processId: processID,
				processName: processName,
				moduleId: moduleId, // This should be "ACC"
				moduleName: moduleName, // This should be "Accounts"
			}));
		}
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

	const [messOptions, setMessOptions] = useState<{ value: string; label: string }[]>([]);
	const [managerOptions, setManagerOptions] = useState<{ value: string; label: string }[]>([]);


	const handleInputChange = async (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormState(prevState => ({ ...prevState, [name]: value }));

		if (name === 'projectId') {
			const projectId = Number(value);
			const project = projects.find(project => project.id === projectId);

			if (project) {
				const projectName = project.projectName;
				setFormState(prevState => ({ ...prevState, projectName }));

				try {
					const response = await fetch(`https://localhost:44306/api/CommonDropdown/GetMessandManagerListByProjectName?ProjectName=${projectName}`);
					const data: ApiResponse = await response.json();

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

						const accountMesses = data.messProjectListResponses.map(response => ({
							projectId: value,
							moduleID: formState.moduleId,
							processID: formState.processName,
							messId: response.messID,
							messName: response.messName,
							messManagerEmpId: response.managerEmpID,
							messManagerEmpName: response.managerName,
							createdBy: 'Himanshu Pant',
						}));

						setFormState(prevState => ({
							...prevState,
							accountMesses: accountMesses,
						}));
					}
				} catch (error) {
					console.error('Error fetching mess and manager list:', error);
				}
			}
		}
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
							sourceId: '',
							createdBy: '',
							accountMesses: [{
								projectId: '',
								moduleID: '',
								processId: '',
								messId: '',
								messName: '',
								messManagerEmpId: '',
								messManagerEmpName: '',
								createdBy: '',
							}]
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
					<form onSubmit={handleSubmit}>
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
								<>
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
									</div>
									<div className="form-group col-lg-6 col-md-6 col-sm-12 p-2">
										<label htmlFor="managerName">Mess Manager Name</label>
										<Select
											className="basic-single"
											classNamePrefix="select"
											name="managerName"
											options={managerOptions}
											onChange={handleInputChange}
											placeholder="Select"
											isClearable
										/>
									</div>
								</>
							)}
							<div className="form-group col-lg-6 col-md-6 col-sm-12 p-2">
								<label htmlFor="sourceId">Source</label>
								<input
									type="text"
									className="form-control"
									name="sourceId"
									value={formState.sourceId}
									onChange={handleInputChange}
								/>
							</div>
							<div className="form-group col-lg-6 col-md-6 col-sm-12 p-2">
								<label htmlFor="periodDate">Period Date</label>
								<Flatpickr
									className="form-control"
									options={{ enableTime: true, noCalendar: false, dateFormat: 'Y-m-d H:i' }}
									value={formState.periodDate}
									onChange={handleDateChange}
								/>
							</div>
							<div className="form-group col-lg-6 col-md-6 col-sm-12 p-2">
								<label htmlFor="weekDate">Week Date</label>
								<Flatpickr
									className="form-control"
									options={{ enableTime: true, noCalendar: false, dateFormat: 'Y-m-d H:i' }}
									value={formState.weekDate}
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
		</div>

	);
};

export default ProcessForm;
