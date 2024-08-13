import React, { useState, useEffect } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/flatpickr.css';
// import { format } from 'date-fns';
import Select from 'react-select';
import axios from 'axios';
import { NavLink } from 'react-router-dom';





interface ProcessFormState {
	processId: string;
	processName: string;
	moduleId: string;
	moduleName: string;
	startDate: Date;
	createdBy: string;
}


const ProcessForm: React.FC = () => {
	const [formState, setFormState] = useState<ProcessFormState>({
		processId: '',
		processName: '',
		moduleId: '',
		moduleName: '',
		startDate: new Date(),
		createdBy: '',

	});
	const [processes, setProcesses] = useState<ProcessData[]>([]);
	const [projects, setProjects] = useState<{ id: string; projectName: string }[]>([]);
	const [showAddEditModal, setShowAddEditModal] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [MessMonthlyReconciliation, setMessMonthlyReconciliation] = useState([]);



	useEffect(() => {
		setProjects([
			{ id: '1', projectName: 'PNC_GWALIOR' },
		]);

		// projectlist fetched 
		const fetchProjects = async () => {
			try {
				const response = await fetch('https://localhost:7074/api/CommonDropdown/GetProjectList', {
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



	useEffect(() => {
		fetchVendors();
	}, []);


	const fetchVendors = async () => {
		setLoading(true);

		try {
			const response = await axios.get('https://localhost:7235/api/MessMonthlyReconciliation/GetProcessAccMonthlyList');

			if (response.data.isSuccess) {
				setMessMonthlyReconciliation(response.data.getProcessAccMonthlyLists);

			} else {
				console.error(response.data.message);
			}
		} catch (error) {
			console.error('Error fetching vendors:', error);
		}
		finally {
			setLoading(false); // End loading
		}
	};


	const [editingIndex, setEditingIndex] = useState<number | null>(null);



	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			
			// Construct the payload
			const payload = {
				processID: formState.processId || 'defaultProcessId',
				processName: formState.processName || 'defaultProcessName',
				moduleID: formState.moduleId || 'defaultModuleId',
				moduleName: formState.moduleName || 'defaultModuleName',
				startDate: formState.startDate.toISOString(), // Convert to ISO string for date-time
				createdBy: formState.createdBy || 'HimanshuPant',
			};

			console.log('Payload:', JSON.stringify(payload, null, 2)); // Pretty-print the payload

			// Post the payload to the API
			const response = await axios.post('https://localhost:7235/api/MessMonthlyReconciliation/InsertAccMonthlyProcess', payload, {
				headers: {
					'Accept': '*/*',
					'Content-Type': 'application/json',
				}
			});

			console.log('Data submitted successfully:', response.data);

			// Reset form state
			setFormState({
				processId: '',
				processName: '',
				moduleId: '',
				moduleName: '',
				startDate: new Date(), // This is now in date-time format
				createdBy: '',
			});

			setShowAddEditModal(false);
		} catch (error) {
			console.error('Error submitting form:', error);
			if (error.response) {
				console.error('API Response Error:', error.response.data);
			}
		}
	};


	const [modules, setModules] = useState([]);
	const [selectedModule, setSelectedModule] = useState('');
	const [selectedProcess, setSelectedProcess] = useState('');

	// Fetch module list on component mount
	useEffect(() => {
		axios.get('https://localhost:7074/api/CommonDropdown/GetModuleList')
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
			axios.get(`https://localhost:7074/api/CommonDropdown/GetProcessNameByModuleName?ModuleName=${selectedModule}`)
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




	return (
		<div>
			<div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center">
				<span><i className="ri-list-settings-line me-2"></i><span className='fw-bold'>Account Process List</span></span>
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
							processId: '',
							processName: '',
							moduleId: '',
							moduleName: '',
							startDate: new Date(),
							createdBy: '',
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

							<div className="form-group col-lg-12 col-md-6 col-sm-12 p-2">
								<label htmlFor="moduleName" className='text-dark'>Module Name</label>
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
							<div className="form-group col-lg-12 col-md-6 col-sm-12 p-2">
								<label htmlFor="processName" className='text-dark'>Process Name</label>
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

							<div className="form-group col-lg-12 col-md-6 col-sm-12 p-2">
								<label htmlFor="weekDate" className='text-dark'>Start Date</label>
								<Flatpickr
									className="form-control"
									options={{ enableTime: true, noCalendar: false, dateFormat: 'Y-m-d H:i' }}
									value={formState.startDate}
								// onChange={handleWeekDateChange}
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





			{loading ? (
				<div className='loader-container'>
					<div className="loader"></div>
					<div className='mt-2'>Please Wait!</div>
				</div>
			) : (
				<Table className='bg-white' striped bordered hover>
					<thead>
						<tr>
							<th>ID</th>
							<th>Module Name</th>
							<th>Process Name</th>
							<th>Start Date</th>
							<th>CreatedBy</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{MessMonthlyReconciliation.map((data, index) => (
							<tr key={index}>
								<td>{data.id}</td>
								<td>{data.moduleName}</td>
								<td>{data.processName}</td>
								<td>{new Date(data.startdate).toLocaleDateString()}</td>
								<td>Sumit Kumar</td>

								<td>

									<NavLink to={`/pages/Task/${data.id}`} >
										<Button variant="success" size="sm" className="me-2" >
											Create Task
										</Button>
									</NavLink>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			)}





		</div>

	);
};

export default ProcessForm;