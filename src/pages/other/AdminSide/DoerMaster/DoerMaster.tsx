import axios from 'axios'
import { useState, useEffect } from 'react'
import {
	Button,
	Pagination,
	Table,
	Container,
	Row,
	Col,
	Alert,
	Form,
	ButtonGroup,
	Modal,
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import config from '@/config'
import Select from 'react-select'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

interface Doer {
	id: number
	taskID: string
	identifier: string
	input: string
	inputValue: string
	doerRole: string
	empID: string
	status: string
	empName: any
	createdBy: string
	updatedBy: string
}

interface Column {
	id: string
	label: string
	visible: boolean
}
interface EmployeeList {
	empId: string
	employeeName: string
	empName: string
}

interface TaskList {
	id: string
	taskID: string
}
interface Identifier {
	id: string
	identifier: string
}

const ModuleMaster = () => {
	const role = localStorage.getItem('role')
	const [doers, setDoers] = useState<Doer[]>([])
	const [loading, setLoading] = useState(false)
	const [currentPage, setCurrentPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)
	const [downloadCsv, setDownloadCsv] = useState<Doer[]>([])

	const [showModal, setShowModal] = useState(false)
	const [selectedEmpId, setSelectedEmpId] = useState('')
	const [selectedEmpName, setSelectedEmpName] = useState('')
    const [selectedApprovalId, setSelectedApprovalId] = useState('')
	const [selectedApprovalName, setSelectedApprovalName] = useState('')
	const [doerStatus, setDoerStatus] = useState('')
	const [currentId, setCurrentId] = useState<number | null>(null)

	const [employeeList, setEmployeeList] = useState<EmployeeList[]>([])
	const [doerList, setdoerList] = useState<EmployeeList[]>([])
	const [taskList, setTaskList] = useState<TaskList[]>([])
	const [identifierList, setIdentifierList] = useState<Identifier[]>([])
	// const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

	const location = useLocation()
	const navigate = useNavigate()
	useEffect(() => {
		if (location.state?.successMessage) {
			toast.dismiss()
			toast.success(location.state.successMessage)
			navigate(location.pathname, { replace: true })
		}
	}, [location.state, navigate])

	// both are required to make dragable column of table
	const [columns, setColumns] = useState<Column[]>([
		{ id: 'taskID', label: 'Task ID', visible: true },
		{ id: 'identifier', label: 'First Identifier', visible: true },
		{ id: 'inputValue', label: 'Input Value one', visible: true },
		{ id: 'identifier1', label: 'Second Identifier', visible: true },
		{ id: 'inputValue1', label: 'Input Value two', visible: true },
		{ id: 'empName', label: 'Employee Name', visible: true },
		{ id: 'approvalConsoleDoerName', label: 'Approval Name', visible: true },
		{ id: 'status', label: 'Status', visible: true },
	])

	const handleOnDragEnd = (result: any) => {
		if (!result.destination) return
		const reorderedColumns = Array.from(columns)
		const [movedColumn] = reorderedColumns.splice(result.source.index, 1)
		reorderedColumns.splice(result.destination.index, 0, movedColumn)
		setColumns(reorderedColumns)
	}
	// ==============================================================

	useEffect(() => {
		fetchDoers()
		fetchRolesCsv()
	}, [currentPage])

	const storedEmpName = localStorage.getItem('EmpName')

	// Close modal
	const handleCloseModal = () => {
		setShowModal(false)
		setCurrentId(null)
		setSelectedEmpId('')
		setSelectedEmpName('')
	}

	const handleSubmit = async () => {
		// if (!validateFields()) {
		//     toast.dismiss()
		//     toast.error('Please fill in all required fields.');
		//     return;
		// }

		try {
			const payload = {
				id: currentId,
				empID: selectedEmpId,
				empName: selectedEmpName,
                ApprovalConsoleDoerId: selectedApprovalId,
                ApprovalConsoleDoerName: selectedApprovalName,
				status: doerStatus,
				updatedBy: storedEmpName,
			}
			console.log(payload)

			const response = await axios.post(
				`${config.API_URL_APPLICATION}/DoerMaster/AssignDoer`,
				payload
			)
			if (response.data.isSuccess) {
				handleCloseModal()
				await fetchDoers() // Refresh the data without reloading the page
			} else {
				console.error(response.data.message)
			}
		} catch (error) {
			console.error('Error updating doer:', error)
		}
	}

	const [searchTriggered, setSearchTriggered] = useState(false)
	const [searchEmployeeName, setSearchEmployeeName] = useState('')
	const [searchTaskId, setSearchTaskId] = useState('')
	const [searchIdentifier, setSearchIdentifier] = useState('')
	const [searchStatus, setSearchStatus] = useState('')

	useEffect(() => {
		if (searchTriggered) {
			handleSearch()
		} else {
			fetchDoers()
		}
	}, [currentPage, searchTriggered])

	const handleSearch = (e?: React.FormEvent) => {
		if (e) e.preventDefault()

		let query = `?`
		if (searchEmployeeName) query += `DoerName=${searchEmployeeName}&`
		if (searchTaskId) query += `TaskID=${searchTaskId}&`
		if (searchIdentifier) query += `Identifier=${searchIdentifier}&`
		if (searchStatus) query += `Identifier=${searchStatus}&`
		query += `PageIndex=${currentPage}`

		query = query.endsWith('&') ? query.slice(0, -1) : query

		const apiUrl = `${config.API_URL_APPLICATION}/DoerMaster/SearchDoer${query}`

		console.log(apiUrl)
		axios
			.get(apiUrl, {
				headers: {
					accept: '*/*',
				},
			})
			.then((response) => {
				console.log('search response ', response.data.doerMasterListResponses)
				setDoers(response.data.doerMasterListResponses)
				setTotalPages(Math.ceil(response.data.totalCount / 10))
			})
			.catch((error) => {
				console.error('Error fetching data:', error)
			})
	}

	const fetchDoers = async () => {
		setLoading(true)
		try {
			const response = await axios.get(
				`${config.API_URL_APPLICATION}/DoerMaster/GetDoer`,
				{
					params: { PageIndex: currentPage },
				}
			)
			if (response.data.isSuccess) {
				setDoers(response.data.doerMasterList)
				setTotalPages(Math.ceil(response.data.totalCount / 10))
			} else {
				console.error(response.data.message)
			}
		} catch (error) {
			console.error('Error fetching doers:', error)
		} finally {
			setLoading(false)
		}
	}

	console.log(doers)

	const fetchRolesCsv = async () => {
		try {
			const response = await axios.get(
				`${config.API_URL_APPLICATION}/IdentifierMaster/GetIdentifier`
			)
			if (response.data.isSuccess) {
				setDownloadCsv(response.data.identifierLists)
			} else {
				console.error(response.data.message)
			}
		} catch (error) {
			console.error('Error fetching doers:', error)
		}
	}

	useEffect(() => {
		const fetchData = async (
			endpoint: string,
			setter: Function,
			listName: string
		) => {
			try {
				const response = await axios.get(
					`${config.API_URL_APPLICATION}/${endpoint}`
				)
				if (response.data.isSuccess) {
					setter(response.data[listName])
				} else {
					console.error(response.data.message)
				}
			} catch (error) {
				console.error(`Error fetching data from ${endpoint}:`, error)
			}
		}

		fetchData(
			'CommonDropdown/GetDoerFromDoerMaster',
			setdoerList,
			'doerListResponses'
		)
		fetchData(
			'CommonDropdown/GetEmployeeListWithId',
			setEmployeeList,
			'employeeLists'
		)
		fetchData('CommonDropdown/GetTaskList', setTaskList, 'taskList')
		fetchData(
			'CommonDropdown/GetIdentifier?Flag=2',
			setIdentifierList,
			'identifierList'
		)
	}, [])

	const handleClear = async () => {
		setCurrentPage(1)
		setSearchEmployeeName('')
		setSearchIdentifier('')
		setSearchTaskId('')
		setSearchStatus('')
		setSearchTriggered(false)
		await fetchDoers()
	}

	const convertToCSV = (data: Doer[]) => {
		const csvRows = [
			[
				'Task ID',
				'Identifier',
				'Input',
				'Input Value',
				'Doer Role',
				'Status',
				'Emp ID',
				'Emp Name',
			],
			...data.map((doer) => [
				doer.taskID,
				doer.identifier,
				doer.input,
				doer.inputValue,
				doer.doerRole,
				doer.status,
				doer.empID,
				doer.empName,
			]),
		]
		return csvRows.map((row) => row.join(',')).join('\n')
	}

	const downloadCSV = () => {
		const csvData = convertToCSV(downloadCsv)
		const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
		const link = document.createElement('a')
		if (link.download !== undefined) {
			const url = URL.createObjectURL(blob)
			link.setAttribute('href', url)
			link.setAttribute('download', 'Doers.csv')
			link.style.visibility = 'hidden'
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
		}
	}

	const handleEditClick = (id: number) => {
		setCurrentId(id)
		setShowModal(true)
	}

	const optionsAppAccess = [
		{ value: 'Enabled', label: 'Enabled' },
		{ value: 'Disabled', label: 'Disabled' },
	]

	const optionsTaskNumber = [
		{ value: 'No Doer Assigned', label: 'No Doer Assigned' },
	]

	const formattedTasks = employeeList.map((employee: EmployeeList) => ({
		empId: employee.empId,
		employeeName: employee.employeeName,
		empName: employee.employeeName,
	}))

	const formattedOptionsTaskNumber = optionsTaskNumber.map((option) => ({
		empId: option.value,
		employeeName: option.label,
		empName: option.label,
	}))

	const combinedOptions: EmployeeList[] = [
		...formattedOptionsTaskNumber,
		...formattedTasks,
	]

	// const validateFields = (): boolean => {
	//     const errors: { [key: string]: string } = {};

	//     if (!doers.empName) { errors.projectID = 'Project Id is required'; }
	//     if (!doers.status) { errors.status = 'Status is required'; }

	//     setValidationErrors(errors);
	//     return Object.keys(errors).length === 0;
	// };

	return (
		<>
			<div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center">
				<span>
					<i className="ri-file-list-line me-2 text-dark fs-16"></i>
					<span className="fw-bold text-dark fs-15">Doers List</span>
				</span>
				<div className="d-flex justify-content-end  ">
					<Button variant="primary" onClick={downloadCSV} className="me-2">
						Download CSV
					</Button>
					{role === 'Admin' && (
						<Link to="/pages/DoerMasterinsert">
							<Button variant="primary" className="me-2">
								Add Doer
							</Button>
						</Link>
					)}
				</div>
			</div>

			{loading ? (
				<div className="loader-container">
					<div className="loader"></div>
					<div className="mt-2">Please Wait!</div>
				</div>
			) : (
				<>
					<div className="bg-white p-2 pb-2">
						<Form
							onSubmit={(e) => {
								e.preventDefault()
								setCurrentPage(1)
								setSearchTriggered(true)
							}}>
							<Row>
								<Col lg={6}>
									<Form.Group controlId="searchEmployeeName">
										<Form.Label>Doer Name</Form.Label>
										<Select
											name="searchEmployeeName"
											value={
												doerList.find(
													(emp) => emp.empName === searchEmployeeName
												) || null
											} // handle null
											onChange={(selectedOption) =>
												setSearchEmployeeName(
													selectedOption ? selectedOption.empName : ''
												)
											} // null check
											options={doerList}
											getOptionLabel={(emp) => emp.empName}
											getOptionValue={(emp) => emp.empName}
											isSearchable={true}
											placeholder="Select Doer Name"
											className="h45"
										/>
									</Form.Group>
								</Col>

								<Col lg={6}>
									<Form.Group controlId="searchTaskId">
										<Form.Label>Task Number</Form.Label>
										<Select
											name="searchTaskId"
											value={
												taskList.find((task) => task.taskID === searchTaskId) ||
												null
											} // handle null
											onChange={(selectedOption) =>
												setSearchTaskId(
													selectedOption ? selectedOption.taskID : ''
												)
											} // null check
											options={taskList}
											getOptionLabel={(task) => task.taskID}
											getOptionValue={(task) => task.taskID}
											isSearchable={true}
											placeholder="Select Task Number"
											className="h45"
										/>
									</Form.Group>
								</Col>

								<Col lg={6} className="mt-2">
									<Form.Group controlId="searchIdentifier">
										<Form.Label>Identifier Name</Form.Label>
										<Select
											name="searchIdentifier"
											value={
												identifierList.find(
													(item) => item.identifier === searchIdentifier
												) || null
											} // handle null
											onChange={(selectedOption) =>
												setSearchIdentifier(
													selectedOption ? selectedOption.identifier : ''
												)
											} // null check
											options={identifierList}
											getOptionLabel={(item) => item.identifier}
											getOptionValue={(item) => item.identifier}
											isSearchable={true}
											placeholder="Select Identifier Name"
											className="h45"
										/>
									</Form.Group>
								</Col>
								<Col lg={6} className="mt-2">
									<Form.Group controlId="searchStatus">
										<Form.Label>Status</Form.Label>
										<Select
											name="searchStatus"
											options={optionsAppAccess}
											value={
												optionsAppAccess.find(
													(option) => option.value === searchStatus
												) || null
											}
											onChange={(selectedOption) =>
												setSearchStatus(selectedOption?.value || '')
											}
											placeholder="Select Status"
										/>
									</Form.Group>
								</Col>
								<Col></Col>

								<Col
									lg={4}
									className="align-items-end d-flex justify-content-end mt-2">
									<ButtonGroup aria-label="Basic example" className="w-100">
										<Button
											type="button"
											variant="primary"
											onClick={handleClear}>
											<i className="ri-loop-left-line"></i>
										</Button>
										&nbsp;
										<Button type="submit" variant="primary">
											Search
										</Button>
									</ButtonGroup>
								</Col>
							</Row>
						</Form>

						<Modal show={showModal} onHide={handleCloseModal} size="lg">
							<Modal.Header closeButton>
								<Modal.Title>Edit Doer</Modal.Title>
							</Modal.Header>
							<Modal.Body>
								<Form>
									<Row>
										<Col lg={4}>
											<Form.Group>
												<Form.Label>
													Employee <span className="text-danger">*</span>
												</Form.Label>
												<Select
													name="employeeName"
													// value={combinedOptions.find((item) => item.employeeName === doers.empName) || null}
													onChange={(selectedOption) => {
														if (selectedOption) {
															setSelectedEmpId(selectedOption.empId)
															setSelectedEmpName(selectedOption.employeeName)
														} else {
															setSelectedEmpId('')
															setSelectedEmpName('')
														}
													}}
													options={combinedOptions}
													getOptionLabel={(item) => item.employeeName}
													getOptionValue={(item) => item.empId}
													isSearchable={true}
													placeholder="Select Employee"
													// className={validationErrors.employeeName ? " input-border h45" : "   h45"}
												/>
												{/* {validationErrors.employeeName && (
                                                    <small className="text-danger">{validationErrors.employeeName}</small>
                                                )} */}
											</Form.Group>
										</Col>
                                        <Col lg={4}>
											<Form.Group>
												<Form.Label>
													Approval Name <span className="text-danger">*</span>
												</Form.Label>
												<Select
													name="employeeName"
													// value={combinedOptions.find((item) => item.employeeName === doers.empName) || null}
													onChange={(selectedOption) => {
														if (selectedOption) {
															setSelectedApprovalId(selectedOption.empId)
															setSelectedApprovalName(selectedOption.employeeName)
														} else {
															setSelectedApprovalId('')
															setSelectedApprovalName('')
														}
													}}
													options={combinedOptions}
													getOptionLabel={(item) => item.employeeName}
													getOptionValue={(item) => item.empId}
													isSearchable={true}
													placeholder="Select Approval Name"
													// className={validationErrors.employeeName ? " input-border h45" : "   h45"}
												/>
												{/* {validationErrors.employeeName && (
                                                    <small className="text-danger">{validationErrors.employeeName}</small>
                                                )} */}
											</Form.Group>
										</Col>

										<Col lg={4}>
											<Form.Group controlId="status" className="mb-3">
												<Form.Label>
													Status <span className="text-danger">*</span>
												</Form.Label>
												<Select
													name="status"
													options={optionsAppAccess}
													// value={optionsAppAccess.find(option => option.value === doers.status)}
													onChange={(selectedOption) => {
														if (selectedOption) {
															setDoerStatus(selectedOption.value)
														} else {
															setDoerStatus('')
														}
													}}
													placeholder="Select Status"
													// className={validationErrors.status ? " input-border h45" : "   h45"}
												/>
												{/* {validationErrors.status && (
                                                    <small className="text-danger">{validationErrors.status}</small>
                                                )} */}
											</Form.Group>
										</Col>
									</Row>
								</Form>
							</Modal.Body>
							<Modal.Footer>
								<Button variant="secondary" onClick={handleCloseModal}>
									Close
								</Button>
								<Button variant="primary" onClick={handleSubmit}>
									Save Changes
								</Button>
							</Modal.Footer>
						</Modal>

						<Row className="mt-3">
							<div className="d-flex justify-content-end bg-light p-1">
								<div className="app-search d-none d-lg-block me-4"></div>
							</div>
						</Row>
					</div>

					<div className="overflow-auto text-nowrap">
						{!doers ? (
							<Container className="mt-5">
								<Row className="justify-content-center">
									<Col xs={12} md={8} lg={6}>
										<Alert variant="info" className="text-center">
											<h4>No Task Found</h4>
											<p>You currently don't have Completed tasks</p>
										</Alert>
									</Col>
								</Row>
							</Container>
						) : (
							<DragDropContext onDragEnd={handleOnDragEnd}>
								<Table hover className="bg-white ">
									<thead>
										<Droppable droppableId="columns" direction="horizontal">
											{(provided) => (
												<tr
													{...provided.droppableProps}
													ref={
														provided.innerRef as React.Ref<HTMLTableRowElement>
													}>
													<th>
														<i className="ri-list-ordered-2"></i> Sr. No
													</th>
													{columns
														.filter((col) => col.visible)
														.map((column, index) => (
															<Draggable
																key={column.id}
																draggableId={column.id}
																index={index}>
																{(provided) => (
																	<th>
																		<div
																			ref={provided.innerRef}
																			{...provided.draggableProps}
																			{...provided.dragHandleProps}>
																			{column.id === 'inputValue' && (
																				<i className="ri-keyboard-line"></i>
																			)}
																			{column.id === 'inputValue1' && (
																				<i className="ri-keyboard-line"></i>
																			)}
																			{column.id === 'taskID' && (
																				<i className="ri-settings-2-fill"></i>
																			)}
																			{column.id === 'status' && (
																				<i className="ri-flag-fill"></i>
																			)}
																			{column.id === 'empName' && (
																				<i className="ri-user-fill"></i>
																			)}
																			{column.id === 'identifier' && (
																				<i className="ri-price-tag-3-fill"></i>
																			)}
																			{column.id === 'identifier1' && (
																				<i className="ri-price-tag-3-fill"></i>
																			)}
																			{column.id === 'empID' && (
																				<i className="ri-user-follow-fill"></i>
																			)}
																			&nbsp; {column.label}
																		</div>
																	</th>
																)}
															</Draggable>
														))}
													{provided.placeholder}
													{role === 'Admin' && <th>Action</th>}
												</tr>
											)}
										</Droppable>
									</thead>
									<tbody>
										{doers.length > 0 ? (
											doers.slice(0, 10).map((item, index) => (
												<tr key={item.id}>
													<td>{(currentPage - 1) * 10 + index + 1}</td>
													{columns
														.filter((col) => col.visible)
														.map((col) => (
															<td
																key={col.id}
																className={
																	// Add class based on column id
																	col.id === 'taskID'
																		? 'fw-bold text-dark'
																		: col.id === 'status' &&
																		  item[col.id] === 'Enabled'
																		? 'task1'
																		: col.id === 'status' &&
																		  item[col.id] === 'Disabled'
																		? 'task4'
																		: ''
																}>
																<div>
																	{col.id === 'empName' ? (
																		<div
																			style={{
																				display: 'flex',
																				alignItems: 'center',
																			}}>
																			{item.empName ? (
																				<>{item.empName} </>
																			) : (
																				<span>
																					<i className="ri-user-search-fill text-secondary fs-16 me-2"></i>
																					No Doer Assigned
																				</span>
																			)}
																		</div>
																	) : (
																		<>{item[col.id as keyof Doer]}</>
																	)}
																</div>
															</td>
														))}

													{role === 'Admin' && (
														<td>
															<Button
																variant="primary"
																className="p-0 text-white"
																onClick={() => handleEditClick(item.id)}>
																<i className="btn ri-edit-line text-white"></i>
															</Button>
														</td>
													)}
												</tr>
											))
										) : (
											<tr>
												<td colSpan={12}>
													<Container className="mt-5">
														<Row className="justify-content-center">
															<Col xs={12} md={8} lg={6}>
																<Alert variant="info" className="text-center">
																	<h4>No Data Found</h4>
																	<p>You currently don't have Data</p>
																</Alert>
															</Col>
														</Row>
													</Container>
												</td>
											</tr>
										)}
									</tbody>
								</Table>
							</DragDropContext>
						)}
					</div>
				</>
			)}

			<div className="d-flex justify-content-center align-items-center bg-white w-20 rounded-5 m-auto py-1 pb-1 my-2 pagination-rounded">
				<Pagination>
					<Pagination.First
						onClick={() => setCurrentPage(1)}
						disabled={currentPage === 1}
					/>
					<Pagination.Prev
						onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
						disabled={currentPage === 1}
					/>
					<Pagination.Item active>{currentPage}</Pagination.Item>
					<Pagination.Next
						onClick={() =>
							setCurrentPage((prev) => Math.min(prev + 1, totalPages))
						}
						disabled={currentPage === totalPages}
					/>
					<Pagination.Last
						onClick={() => setCurrentPage(totalPages)}
						disabled={currentPage === totalPages}
					/>
				</Pagination>
			</div>
		</>
	)
}

export default ModuleMaster
