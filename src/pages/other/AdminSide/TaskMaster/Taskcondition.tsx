import { Form, Modal, Col, Row, Button, Card } from 'react-bootstrap'
import axios from 'axios'
import config from '@/config'
import { useEffect, useState } from 'react'
import Select from 'react-select'
import { toast } from 'react-toastify'
// import { json } from 'stream/consumers'

interface ProcessCanvasProps {
	show: boolean
	setShow: (show: boolean) => void
	taskID: number
	taskNumber: string
}

interface TaskData {
	id: number
	moduleID: string
	moduleName: string
	processID: string
	processName: string
	roleId: string
	roleName: string
	task_Json: string // JSON string
	task_Number: string
	task_Status: number
	problem_Solver: string
	finishPoint: string
	condition_Json: string // JSON string
	isExpired: number
	template_Json: string // JSON string
	condition_Template_Json: string // JSON string
	approval_Console: string
	approvalConsoleDoerID: string
	approvalConsoleDoerName: string
	approvalConsoleInputID: number
	createdBy: string
	createdDate: string // ISO 8601 date string
	updatedBy: string
	updatedDate: string // ISO 8601 date string
	task_Name: string
}

interface TaskOption {
	value?: string;
	label?: string;
	task_Number?: string;
	task_Label?: string;
}
interface GetTypeDayTimeList {
	id: number
	name: string
}

interface Option {
	id: string
	inputId: string
	optionId?: string
	label?: string
	color?: string
	taskNumber?: string
	taskTiming?: string
	taskType?: string
	Days?: string
	WeekDay?: string
	time?: string
}

interface FormData {
	isExpirable: any // 0 or 1
	expiryLogic: any // 0 or 1
	expirationTime: any // 0 or 1
	expirationDate: string | null // ISO 8601 string or null
	sundayLogic: string | null // Selected value for Sunday logic
	taskSelections: {
		taskNumber?: string
		taskType?: string
		taskTiming?: string
		Hours?: string
		Days?: string
		WeekDay?: string
		time?: string
	}
}
interface TaskSelections {
	optionId?: string
	inputId?: string
	color?: string
	label?: string
	taskNumber?: string
	taskType?: string
	taskTiming?: string
	Days?: string
	Hours?: string
	WeekDay?: string
	time?: string
}

const TaskCondition: React.FC<ProcessCanvasProps> = ({
	show,
	setShow,
	taskID,
	taskNumber,
}) => {
	const [ModuleId, setModuleId] = useState<string>('')
	const [ProcessId, setProcessId] = useState<string>('')
	const [parseData, setParseData] = useState<any>('') // Use `any` or the appropriate type here
	const [parseDataForSingle, setParseDataForsingle] = useState<any>('') // Use `any` or the appropriate type here
	const [sundayLogic, setSundayLogic] = useState<any>('') // Use `any` or the appropriate type here
	const [expiryLogic, setExpiryLogic] = useState<any>('') // Use `any` or the appropriate type here
	const [expirationTime, setExpirationTime] = useState<any>('') // Use `any` or the appropriate type here
	const [isExpirable, setIsExpirable] = useState(0) // Default to 0 (No)
	const [tasks, setTasks] = useState<TaskData[]>([])
	const [singleData, setSignleData] = useState<TaskData[]>([]) // Use an array of TaskData
	const [parseConditionData, setParseConditionData] = useState<FormData[]>([])
	const [showNestedModal, setShowNestedModal] = useState(false)

	const [taskSelections, setTaskSelections] = useState(
		parseData?.options?.map((option: Option) => ({
			inputId: option.inputId,
			optionId: option.optionId || '',
			taskNumber: option.taskNumber || '',
			taskTiming: option.taskTiming || '',
			taskType: option.taskType || '',
			WeekDay: option.WeekDay || '',
			Days: option.Days || '',
			time: option.time || '',
			isExpirable: '',
		})) || []
	)

	useEffect(() => {
		if (parseData?.options && !parseDataForSingle) {
			const initialTaskSelections = parseData.options.map((option: Option) => ({
				inputId: option.id,
				optionId: option.id,
				color: option.color,
				label: option.label,
				taskNumber: '',
				taskType: '',
				taskTiming: '',
				Days: '',
				Hours: '',
				WeekDay: '',
				time: '',
			}))

			setTaskSelections(initialTaskSelections)
		}
	}, [parseData?.options, parseDataForSingle])

	console.log("this i have to update", parseData);

	const [dropdownValuesFlag2, setDropdownValuesFlag2] = useState<
		GetTypeDayTimeList[]
	>([])
	const [dropdownValuesFlag3, setDropdownValuesFlag3] = useState<
		GetTypeDayTimeList[]
	>([])
	// const [dropdownValuesFlag4, setDropdownValuesFlag4] = useState<GetTypeDayTimeList[]>([]);

	const [taskRows, setTaskRows] = useState<TaskSelections[]>([])
	const [approvalTaskRow, setApprovalTaskRow] = useState<TaskSelections>({
		taskType: '',
		taskTiming: '',
		Hours: '',
		Days: '',
		WeekDay: '',
		time: '',
	});


	const handleAddTaskRow = () => {
		// setTaskRows([
		// 	...taskRows,
		// 	{
		// 		inputId: '',
		// 		optionId: '',
		// 		color: '',
		// 		label: '',
		// 		taskNumber: '',
		// 		taskType: '',
		// 		taskTiming: '',
		// 		Days: '',
		// 		Hours: '',
		// 		WeekDay: '',
		// 		time: '',
		// 	},
		// ])
		setParseData([
			...parseData,
			{

				inputId: "",
				type: "",
				label: "",
				placeholder: "",
				options: [
				],
				required: false,
				conditionalFieldId: "",
				value: "",
				visibility: false
			}

		])
	}

	const handleTaskFieldChange = (index: number, field: keyof TaskSelections, value: string | undefined) => {
		const updatedRows = [...taskRows];  // Assuming you're using taskRows for managing row data

		updatedRows[index] = {
			...updatedRows[index],
			[field]: value // Update the field (taskTiming in this case)
		};

		setTaskRows(updatedRows);  // Make sure the rows are updated properly
	};


	const handleRemoveTaskRow = (index: number) => {
		const updatedRows = taskRows.filter((_, i) => i !== index) // Remove the specific row
		setTaskRows(updatedRows)
	}

	useEffect(() => {
		if (show && taskID) {
			const fetchProject = async () => {
				await fetchSingleDataById(taskID)
			}
			fetchProject()
		}
	}, [show, taskID])

	const fetchSingleDataById = async (taskID: number) => {
		try {
			const response = await axios.get(
				`${config.API_URL_ACCOUNT}/ProcessTaskMaster/GetProcessTaskByIds`,
				{
					params: { id: taskID, flag: 3 },
				}
			)
			if (response.data.isSuccess) {
				const fetchedModule = response.data.getProcessTaskByIds
				console.log(fetchedModule)
				setSignleData(
					Array.isArray(fetchedModule) ? fetchedModule : [fetchedModule]
				)
				if (fetchedModule.length > 0) {
					setProcessId(fetchedModule[0].processID)
					setModuleId(fetchedModule[0].moduleID)
				}
			} else {
				console.error(response.data.message)
			}
		} catch (error) {
			console.error('Error fetching module:', error)
		}
	}

	// const [parseDataForsingle, setParseDataForsingle] = useState<any[]>([]);  // State is an array

	useEffect(() => {
		if (singleData.length > 0 && singleData[0].task_Json) {
			const inputs = JSON.parse(singleData[0].task_Json).inputs || [];

			console.log("this is it", singleData[0]?.finishPoint);

			if (Array.isArray(inputs) && singleData[0]?.finishPoint) {
				// Convert finishPoint to an array (split by commas if it's a string)
				const finishPoints = Array.isArray(singleData[0]?.finishPoint)
					? singleData[0]?.finishPoint
					: singleData[0]?.finishPoint?.toString().split(',').map(point => point.trim());

				console.log('finishPoints:', finishPoints); // Debugging the finishPoints array

				// Check if all finishPoints match inputId and the type is 'select'
				const resultOptionSelect = inputs.filter((input: any) => {
					// Convert inputId to string and trim any spaces
					const inputId = input.inputId?.toString().trim();

					// Ensure the type is 'select' and the inputId matches at least one finishPoint
					return finishPoints.some(finishPoint => finishPoint === inputId) && input.type === 'select';
				});

				console.log('Filtered resultOptionSelect:', resultOptionSelect); // Log resultOptionSelect before state update

				setParseData(resultOptionSelect);

				console.log(parseData);

				// Check for other input types like 'not select', 'radio', 'multiselect'
				const resultOptionNonSelect = inputs.filter((input: any) => {
					const inputId = input.inputId?.toString().trim();
					return finishPoints.every(finishPoint => finishPoint === inputId) &&
						input.type !== 'select' &&
						input.type !== 'radio' &&
						input.type !== 'multiselect';
				});

				setParseDataForsingle(resultOptionNonSelect.length > 0 ? resultOptionNonSelect : []);
				console.log(parseDataForSingle)
			} else {
				if (!Array.isArray(inputs)) {
					console.error('inputs is not an array or is undefined');
				}
				if (!singleData[0]?.finishPoint) {
					console.error('singleData.finishPoint is undefined or null');
				}
			}
		}
	}, [singleData]);


	const parseConditionJson = (singleData: TaskData[]) => {
		if (singleData.length > 0 && singleData[0].condition_Json) {
			const conditionJson = JSON.parse(singleData[0].condition_Json) || []
			return conditionJson
		}
		return []
	}

	useEffect(() => {
		const conditionData = parseConditionJson(singleData)
		console.log('conditionData', conditionData);
		setParseConditionData(conditionData)
	}, [show, taskID, singleData])

	useEffect(() => {
		const fetchProcessName = async () => {
			try {
				const response = await axios.get(
					`${config.API_URL_ACCOUNT}/ProcessTaskMaster/GetProcessTaskByIds?Flag=4&ModuleId=${ModuleId}&ProcessId=${ProcessId}`
				)
				if (response.data.isSuccess) {
					setTasks(response.data.getProcessTaskByIds)
				} else {
					console.error(response.data.message)
				}
			} catch (error) {
				console.error('Error fetching modules:', error)
			}
		}
		if (ModuleId && ProcessId) {
			fetchProcessName()
		}
	}, [ModuleId, ProcessId])

	useEffect(() => {
		GetTypeDayTimeList(2, setDropdownValuesFlag2)
		GetTypeDayTimeList(3, setDropdownValuesFlag3)
		// GetTypeDayTimeList(4, setDropdownValuesFlag4);
	}, [])

	const GetTypeDayTimeList = async (flag: any, setStateCallback: any) => {
		try {
			const response = await axios.get(
				`${config.API_URL_APPLICATION}/CommonDropdown/GetTypeDayTimeList?flag=${flag}`
			)
			if (response.data.isSuccess) {
				setStateCallback(response.data.typeListResponses)
			} else {
				console.error(response.data.message)
			}
		} catch (error) {
			console.error('Error fetching modules:', error)
		}
	}

	const [previousTask, setPreviousTask] = useState<string | null>(null)

	const [desiredTaskOptions, setDesiredTaskOptions] = useState<
		{ value: string; label: string }[]
	>([])

	useEffect(() => {
		if (taskNumber) {
			// Fetch data from the API whenever a task is selected
			fetchDesiredTaskOptions(taskNumber)
		}
	}, [taskNumber])

	const fetchDesiredTaskOptions = async (taskNumber: string) => {
		try {
			const response = await axios.get(
				`${config.API_URL_ACCOUNT}/DynamicDoerAllocation/GetTaskListfromTaskNumber`,
				{ params: { TaskNumber: taskNumber } }
			)
			console.log(response)
			if (response.data.isSuccess && response.data.getTaskListfromTaskNumbers) {
				const options = response.data.getTaskListfromTaskNumbers.map(
					(item: { taskID: string }) => ({
						value: item.taskID,
						label: item.taskID,
					})
				)
				setDesiredTaskOptions(options)
				console.log(desiredTaskOptions)
			}
		} catch (error) {
			console.error('Error fetching desired task options:', error)
		}
	}
	type SelectOption = {
		label: string
		value: string
	}
	const [selectedInputField, setSelectedInputField] =
		useState<SelectOption | null>(null)
	const [inputFieldOptions, setInputFieldOptions] = useState([])
	const handleSelectedInputFieldChange = (selectedOption1: any) => {
		setSelectedInputField(selectedOption1)
	}
	useEffect(() => {
		const fetchInputFieldOptions = async () => {
			try {
				const response = await axios.get(
					`${config.API_URL_ACCOUNT}/DynamicDoerAllocation/GetLabelFromType?Flag=2`,
					{
						params: { PreviousTaskNumber: previousTask },
					}
				)

				const dataResponse = response.data.getLabelFromSelects

				console.log('Fetched Data:', dataResponse) // Log the response data to verify
				console.log('Fetched Data:', response) // Log the response data to verify

				if (dataResponse && dataResponse.length > 0) {
					// Only extract the label values into the options array
					const options = dataResponse.map(
						(item: { label: string }) => item.label
					)
					setInputFieldOptions(options) // Set the options state
					console.log('Options:', options) // Log the options to verify
				} else {
					console.log('No labels found in the response.')
					setInputFieldOptions([])
				}
			} catch (error) {
				console.error('Error fetching input field options:', error)
			}
		}

		fetchInputFieldOptions()
	}, [previousTask])

	const handleClose = () => {
		setShow(false)
		setShowNestedModal(false)
	}

	const handleTaskNumberChange = (selectedOption: any) => {
		setPreviousTask(selectedOption?.value ?? null)
	}

	const handleChange = (index: number | null, { name, value }: { name: string, value: any }) => {
		const updatedSelections = [...taskSelections];

		console.log("yha dekh bhai", index, value, name);

		if (index !== null) {
			updatedSelections[index] = {
				...updatedSelections[index],
				[name]: value,  // Dynamically set the property based on `name`
			};
		} else {
			updatedSelections[0] = {
				...updatedSelections[0],
				[name]: value,  // Dynamically set the property based on `name`
			};
		}

		setTaskSelections(updatedSelections);
		console.log(updateTaskSelection);
	};



	const updateTaskSelection = (field: keyof TaskSelections, value: any) => {
		setTaskSelections((prevSelections: TaskSelections[]) => {
			const newSelections = prevSelections.length > 0 ? [...prevSelections] : []

			if (newSelections.length > 0) {
				newSelections[0] = {
					...newSelections[0],
					inputId: singleData[0]?.finishPoint?.toString(),
					optionId: '',
					[field]: value,
				}
			} else {
				newSelections.push({
					inputId: singleData[0]?.finishPoint?.toString(),
					optionId: '',
					[field]: value,
				})
			}
			return [...newSelections]
		})
		console.log(taskSelections);
	}

	const handleChangeExpirable = (value: number) => {
		setIsExpirable(value)

		// If isExpirable is 0, clear expirationDate
		if (value === 0) {
			setExpiryLogic('') // Set expirationDate to an empty string
			setExpirationTime('') // Set expirationDate to an empty string
		}
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const conditionJsonFormatted = [
			{
				sundayLogic,
				isExpirable,
				expiryLogic,
				expirationTime,
				taskSelections,
				approvalTaskRow,
			},
		]

		console.log(conditionJsonFormatted);

		const updatedConditionJsonFormatted = conditionJsonFormatted.map((item) => {
			const updatedTaskSelections = [
				...item.taskSelections,
				...taskRows.map((taskRow, index) => ({
					inputId: `task-${index + 1}`,
					optionId: `task-${index + 1}`,
					color: '#000000',
					label: `Task ${index + 1}`,
					...taskRow,
				})),
			]

			return {
				...item,
				taskSelections: updatedTaskSelections,
			}
		})
		console.log(updatedConditionJsonFormatted)
		const transformData = (data: any) => {
			const result: any[] = [];
			// let approvalTaskRow = {};

			// Iterate over each object in the array
			data.forEach((obj: any) => {
				let taskObject: any = {};
				let approvalObject: any = {};

				// Loop through all keys of the current object
				Object.keys(obj).forEach((key) => {
					const match = key.match(/^(.+?)_(\d+)$/); // Match task keys like 'taskNumber_0', 'taskType_1'

					if (match) {
						const [_, field, index] = match; // Extract field and index (e.g. taskNumber, taskType, etc.)
						const newKey = field; // We will use this as the property key in our final object

						// If this index doesn't exist in our result array yet, create it
						if (!taskObject[index]) {
							taskObject[index] = {};
						}

						// Set the value in the correct task object at the specified index
						taskObject[index][newKey] = obj[key];
					} else if (key === 'approvalTaskRow') {
						// If the key is 'approvalTaskRow', save the approval row for later
						approvalObject = obj[key];
					}
				});

				// Combine task objects into the final result
				Object.keys(taskObject).forEach((index) => {
					result.push({
						...taskObject[index], // Spread the task object for this index
					});
				});

				// Add the approval task row at the end
				if (approvalObject && Object.keys(approvalObject).length > 0) {
					result.push({ approvalTaskRow: approvalObject });
				}
			});

			return result;
		};



		// Apply transformation
		const transformedData = transformData(updatedConditionJsonFormatted[0].taskSelections);
		//   console.log(JSON.stringify(transformedData, null, 2));
		updatedConditionJsonFormatted[0].taskSelections = transformedData;


		const payload = {
			...singleData[0],
			condition_Json: JSON.stringify(updatedConditionJsonFormatted),
		}
		console.log(payload)

		toast.dismiss()
		toast.warn(
			({ closeToast }) => (
				<div>
					<p>This update will be applicable for the next cycle. Confirm?</p>
					<button
						onClick={async () => {
							closeToast()
							await submitPayload(payload)
						}}
						style={{
							marginRight: '10px',
							backgroundColor: 'green',
							color: 'white',
							border: 'none',
							padding: '5px 10px',
							cursor: 'pointer',
						}}>
						Confirm
					</button>
					<button
						onClick={closeToast}
						style={{
							backgroundColor: 'red',
							color: 'white',
							border: 'none',
							padding: '5px 10px',
							cursor: 'pointer',
						}}>
						Cancel
					</button>
				</div>
			),
			{ autoClose: false }
		)
	}

	const submitPayload = async (payload: any) => {
		try {
			const apiUrl = `${config.API_URL_ACCOUNT}/ProcessTaskMaster/InsertUpdateProcessTaskandDoer`
			const response = await axios.post(apiUrl, payload)
			console.log(payload);
			if (response.status === 200) {
				fetchSingleDataById(taskID)
				toast.success('Condition is set successfully!')
			} else {
				toast.error(response.data.message || 'Failed to process request')
			}
		} catch (error: any) {
			const errorMessage =
				error.response?.data?.message || 'An unexpected error occurred'
			toast.error(errorMessage)
			console.error('Error submitting process task:', error)
		}
	}

	const optionssundayLogic = [
		{
			value: 'Increase Planned day by 1 Day ',
			label: 'Increase Planned day by 1 Day ',
		},
		{
			value: 'Keep making task as per logic ',
			label: 'Keep making task as per logic ',
		},
		{ value: 'Skip Creating task', label: 'Skip Creating task' },
	]
	const ExpiryLogic = [
		{
			value: 'Expire On Next Task Initiation',
			label: 'Expire On Next Task Initiation',
		},
		{ value: 'Expire On Defined Time', label: 'Expire On Defined Time' },
	]
	const optionstaskType = [
		{ value: 'Actual', label: 'Actual' },
		{ value: 'Planned', label: 'Planned' },
	]
	const optionsTaskNumber = [
		{ value: 'Update Master', label: 'Update Master' },
		{ value: 'End', label: 'End Process' },
	]
	const optionsTaskTiming = [
		{ value: 'Days', label: 'Days' },
		{ value: 'Hours', label: 'Hours' },
		{ value: 'WeekDay', label: 'Week Day' },
		{ value: 'FromTask', label: 'From other Task input' },
	]

	const formattedTasks = tasks.map((task: TaskData) => ({
		task_Number: task.task_Number,
		task_Label: task.task_Number,
	}));
	const formattedOptionsTaskNumber = optionsTaskNumber.map((option) => ({
		task_Number: option.value,
		task_Label: option.label,
	}));

	const combinedOptions: TaskOption[] = [
		...desiredTaskOptions, // Merge existing task options
		...formattedTasks, // Add formatted tasks
		...formattedOptionsTaskNumber // Add formatted options from task numbers
	];

	// Ensure TypeScript knows that either `value` or `task_Label` exists
	const extractedValues: string[] = combinedOptions
		.map((option) => option.value ?? option.task_Label) // Use nullish coalescing to avoid undefined
		.filter((item): item is string => Boolean(item)); // Type-safe filtering to remove empty values

	// Convert extractedValues (array of strings) into an array of objects for <Select>
	const extractedOptions = extractedValues.map((item) => ({
		value: item,
		label: item
	}));

	const setHandleInputBlock = () => {
		console.log(parseData);
		console.log(taskSelections);
		const result = parseData.map((field: any) => {
			let optionsObj: { [key: string]: any } = {}; // Define an object to store options by index

			field.options.forEach((option: any, index: number) => {
				// Assuming you want to store the `label` value of each option based on index
				optionsObj[`label_${index}`] = option.label; // or use `option.value` if that's the field you need
				optionsObj[`inputId_${index}`] = option.id; // or use `option.value` if that's the field you need
				optionsObj[`color_${index}`] = option.color; // or use `option.value` if that's the field you need
			});

			return {
				// [`inputid_${field.inputId}`]: parseInt(field.inputId),
				...optionsObj,
			};
		});

		console.log(result);


		console.log(result);
		setTaskSelections(result);
	}


	return (
		<div>
			<Modal
				size="xl"
				className="p-2"
				show={show}
				placement="end"
				onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title className="text-dark d-flex justify-content-between w-100">
						Condition Data Overview for {taskNumber}
						<Button
							variant="primary"
							className=" mr-2"
							onClick={() => {
								setShowNestedModal((prev) => !prev);
								setHandleInputBlock();
							}}>

							{parseConditionData ? 'Edit Conditions' : 'Set Conditions'}
						</Button>
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Col lg={12} className="">
						<Card.Body>
							<ul className="list-group">
								<li className="list-group-item py-1 d-flex justify-content-between align-items-center w-100">
									<span>
										<strong>Is Expirable:</strong>{' '}
										{parseConditionData &&
											parseConditionData[0]?.isExpirable === 1
											? 'Yes'
											: 'No'}
									</span>
								</li>
								{/* {parseConditionData[0]?.isExpirable === 1 && ( */}
								<li className="list-group-item">
									<strong>Expiration Time:</strong>{' '}
									{parseConditionData[0]?.expiryLogic ===
										'Expire On Defined Time'
										? `${parseConditionData[0]?.expirationTime} hr`
										: parseConditionData[0]?.expiryLogic
											? 'Expire On Next Task Initiation'
											: 'N/A'}
								</li>
								{/* )} */}
								<li className="list-group-item">
									<strong>Sunday Logic:</strong>{' '}
									{parseConditionData[0]?.sundayLogic || 'N/A'}
								</li>
								{parseConditionData[0]?.taskSelections && (
									<li className="list-group-item">
										<strong>Task Selections:</strong>
										<Row className=" mt-2">
											{(Array.isArray(parseConditionData[0]?.taskSelections)
												? parseConditionData[0]?.taskSelections
												: [parseConditionData[0]?.taskSelections]
											).map((task: any, index: number) => (
												<div
													key={index}
													className="card p-1 m-1 "
													style={{
														width: '32%',
														border: '1px solid #ccc',
														borderRadius: '5px',
													}}>
													<h5 className="text-primary my-1">
														{task.label ? (
															<span
																style={{
																	color: task.color,
																	textTransform: 'uppercase',
																}}>
																{task.label}
															</span>
														) : (
															'Task'
														)}
													</h5>

													<span>
														<strong>Task Number:</strong>{' '}
														{task.taskNumber || 'N/A'}
													</span>
													<span>
														<strong>Type:</strong> {task.taskType || 'N/A'}
													</span>
													<span>
														<strong>Timing:</strong> {task.taskTiming || 'N/A'}
													</span>
													{task.taskTiming === 'Hours' && (
														<span>
															<strong>Hours:</strong> {task.Hours || 'N/A'}
														</span>
													)}
													{task.taskTiming === 'WeekDay' && (
														<>
															<span>
																<strong>WeekDay:</strong>{' '}
																{task.WeekDay || 'N/A'}
															</span>
															<span>
																<strong>Time:</strong> {task.time || 'N/A'}
															</span>
														</>
													)}
													{task.taskTiming === 'Days' && (
														<>
															<span>
																<strong>Days:</strong>{' '}
																After {task.Days || 'N/A'} {Number(task.Days) > 1 ? 'Days' : 'Day'}{' '}
																<strong>Time:</strong> {task.time || 'N/A'}
															</span>
														</>
													)}
													{task.taskTiming === 'FromTask' && (
														<>
															<span>
																<strong>Days:</strong>{' '}
																After {task.Days || 'N/A'} {Number(task.Days) > 1 ? 'Days' : 'Day'}{' '}
																<strong>Time:</strong> {task.time || 'N/A'}
															</span>
														</>
													)}

												</div>
											))}
										</Row>
									</li>
								)}
							</ul>
						</Card.Body>
					</Col>

					{showNestedModal && (
						<Form
							onSubmit={handleSubmit}
							className="mt-3"
							style={{ border: '1px solid #ccc', borderRadius: '5px' }}>
							<Row className=" mx-1 ">
								{/* Is Expirable Radio Buttons */}
								<Col lg={2}>
									<Form.Group controlId="isExpirable" className="mb-3 mt-1">
										<Form.Label className="fs-16">Is Expirable</Form.Label>
										<div className="d-flex">
											<Form.Check
												inline
												type="radio"
												id="statusDeactive"
												name="isExpirable"
												value={0}
												label="No"
												checked={isExpirable === 0}
												onChange={() => handleChangeExpirable(0)}
											/>
											<Form.Check
												inline
												type="radio"
												id="statusActive"
												name="isExpirable"
												value={1}
												label="Yes"
												checked={isExpirable === 1}
												onChange={() => handleChangeExpirable(1)}
											/>
										</div>
									</Form.Group>
								</Col>
								{isExpirable === 1 && (
									<Col lg={8} className="d-flex flex-row mt-2">
										<Form.Group className="mx-2">
											<Form.Label>Expiration Logic</Form.Label>
											<Select
												name="sundayLogic"
												options={ExpiryLogic}
												value={
													ExpiryLogic.find(
														(opt) => opt.value === expiryLogic
													) || null
												}
												onChange={(selectedOption) => {
													setExpiryLogic(selectedOption?.value)
													setExpirationTime('')
												}}
												placeholder="Select expiry Logic"
												required
											/>
										</Form.Group>
										{expiryLogic === `Expire On Defined Time` && (
											<Form.Group className="ms-2">
												<Form.Label>Expiration Time (hr)</Form.Label>
												<Form.Control
													type="number"
													name="expirationTime"
													value={expirationTime}
													onChange={(e) => setExpirationTime(e.target.value)}
													placeholder="Enter Time in Hours"
													required
												/>
											</Form.Group>
										)}
									</Col>
								)}
							</Row>
							<Col lg={4} className=" mx-2 ">
								<Form.Group controlId="sundayLogic" className="mb-3">
									<Form.Label>Sunday Logic</Form.Label>
									<Select
										name="sundayLogic"
										options={optionssundayLogic}
										value={
											optionssundayLogic.find(
												(opt) => opt.value === sundayLogic
											) || null
										}
										onChange={(selectedOption) =>
											setSundayLogic(selectedOption?.value)
										}
										placeholder="Select Sunday Logic"
										required
									/>
								</Form.Group>
							</Col>
							{/* {JSON.stringify(taskSelections)} */}
							{parseData?.map((input: any, index: number) => {
								return (
									<div key={index}>
										<div className='ms-2'><span className='fw-bold'>Finish Point</span> - {input.label}</div>
										{input.options?.map((option: any, optionIndex: number) => (
											<Row key={optionIndex} className="bg-light m-2 p-2">
												<Col lg={4}>
													<Form.Group controlId="taskNumber" className="mb-3">
														<Form.Label>
															Select Successor Task For{' '}
															<span style={{ color: option.color }}>
																{' '}
																{option.label}
															</span>
														</Form.Label>

														<Select
															name={`taskNumber_${optionIndex}`}  // Pass name dynamically
															value={
																extractedOptions.find(
																	(item) => item.value === taskSelections[index]?.[`taskNumber_${optionIndex}`]  // Dynamically check key
																) || null
															}
															onChange={(selectedOption) =>
																handleChange(index, { name: `taskNumber_${optionIndex}`, value: selectedOption?.value })
															}
															options={extractedOptions} // Use the converted array
															getOptionLabel={(item) => item.label} // Extract label
															getOptionValue={(item) => item.value} // Extract value
															isSearchable={true}
															placeholder="Select Option"
															className="h45"
														/>



													</Form.Group>
												</Col>

												<Col lg={4}>
													<Form.Group controlId="taskType" className="mb-3">
														<Form.Label>Task Type</Form.Label>
														<Select
															name={`taskType_${optionIndex}`}
															options={optionstaskType}
															value={optionstaskType.find(
																(option) =>
																	option.value === taskSelections[index]?.[`taskType_${optionIndex}`]
															)}
															onChange={(selectedOption) =>
																handleChange(
																	index,
																	{
																		name: `taskType_${optionIndex}`, value:
																			selectedOption?.value
																	}
																)
															}
															placeholder="Select Task Type"
														/>
													</Form.Group>
												</Col>

												<Col lg={4}>
													<Form.Group controlId="taskTiming" className="mb-3">
														<Form.Label>Task Timing</Form.Label>
														<Select
															name={`taskTiming_${optionIndex}`}
															options={optionsTaskTiming}
															value={optionsTaskTiming.find(
																(option) =>
																	option.value === taskSelections[index]?.[`taskTiming_${optionIndex}`]
															)}
															onChange={(selectedOption) =>
																handleChange(
																	index,
																	{
																		name: `taskTiming_${optionIndex}`, value:
																			selectedOption?.value
																	}
																)
															}
															placeholder="Select Task Type"
														/>
													</Form.Group>
												</Col>

												{taskSelections[index]?.[`taskTiming_${optionIndex}`] === 'Hours' && (
													<>
														<Col lg={4}>
															<Form.Group controlId="Hours" className="mb-3">
																<Form.Label>Hours:</Form.Label>
																<Form.Control
																	type="number"
																	name={`Hours_${optionIndex}`}
																	value={taskSelections[index]?.[`Hours_${optionIndex}`]}
																	onChange={(e) =>
																		handleChange(
																			index,
																			{ name: `Hours_${optionIndex}`, value: String(e.target.value) }

																		)
																	}
																	placeholder="Enter Task Hours"
																/>
															</Form.Group>
														</Col>
													</>
												)}
												{taskSelections[index]?.[`taskTiming_${optionIndex}`] === 'FromTask' && (
													<>
														<Col md={4}>
															<Form.Group controlId="previousTask" className="mb-2">
																<Form.Label>Previous Task Number</Form.Label>
																<Select
																	options={desiredTaskOptions}
																	value={
																		previousTask
																			? desiredTaskOptions.find(
																				(option) => option.value === previousTask
																			)
																			: null
																	}
																	onChange={(selectedOption) => {
																		handleTaskNumberChange(selectedOption)
																		handleChange(
																			optionIndex,
																			{
																				name: 'PreviousTask',
																				value: selectedOption?.value
																			}
																		)
																	}}
																	placeholder="Select Previous Task Number"
																/>
															</Form.Group>
														</Col>
														<Col md={6}>
															<Form.Group controlId="inputFields" className="mb-2">
																<Form.Label>Input Field</Form.Label>
																<Select
																	options={inputFieldOptions.map((option) => ({
																		label: option, // Label for display
																		value: option, // Value for internal use
																	}))}
																	value={selectedInputField} // Bind selected value
																	onChange={(selectedOption1) => {
																		handleSelectedInputFieldChange(selectedOption1)
																		handleChange(
																			index,
																			{
																				name: 'FromDate',
																				value: selectedOption1?.value
																			}

																		)
																	}}
																	placeholder="Select Input Field"
																/>
															</Form.Group>
														</Col>
													</>
												)}

												{taskSelections[index]?.[`taskTiming_${optionIndex}`] === 'Days' && (
													<>
														<Col lg={4}>
															<Form.Group controlId="Days" className="mb-3">
																<Form.Label>Days:</Form.Label>
																<Form.Control
																	type="number"
																	name={`Days_${optionIndex}`}
																	value={taskSelections[index]?.[`Days_${optionIndex}`] || ''}
																	onChange={(e) =>
																		handleChange(
																			index,
																			{
																				name: `Days_${optionIndex}`,
																				value: String(e.target.value)
																			}

																		)
																	}
																	placeholder="Enter Days"
																/>
															</Form.Group>
														</Col>
														<Col lg={4}>
															<Form.Group controlId="time" className="mb-3">
																<Form.Label>Time</Form.Label>
																<Select
																	name={`time_${optionIndex}`}
																	options={dropdownValuesFlag3}
																	value={
																		dropdownValuesFlag3.find(
																			(option) =>
																				option.name === taskSelections[index]?.[`time_${optionIndex}`]
																		) || null
																	}
																	onChange={(selectedOption) => {
																		if (selectedOption) {
																			handleChange(
																				index,
																				{
																					name: `time_${optionIndex}`,
																					value: selectedOption.name
																				}

																			)
																		} else {
																			handleChange(index, { name: 'time', value: '' })
																		}
																	}}
																	getOptionLabel={(item) => item.name}
																	getOptionValue={(item) => item.name}
																	placeholder="Select Time"
																/>
															</Form.Group>
														</Col>
													</>
												)}

												{taskSelections[index]?.[`taskTiming_${optionIndex}`] === 'WeekDay' && (
													<>
														<Col lg={4}>
															<Form.Group controlId="WeekDay" className="mb-3">
																<Form.Label>Date:</Form.Label>
																<Select
																	name={`WeekDay_${optionIndex}`}
																	options={dropdownValuesFlag2}
																	value={
																		dropdownValuesFlag2.find(
																			(option) =>
																				option.name ===
																				taskSelections[index]?.WeekDay
																		) || null
																	}
																	onChange={(selectedOption) =>
																		handleChange(
																			index,
																			{
																				name: 'WeekDay',
																				value: selectedOption?.name ?? null
																			}

																		)
																	}
																	getOptionLabel={(item) => item.name}
																	getOptionValue={(item) => item.name}
																	placeholder="Select WeekDay"
																/>
															</Form.Group>
														</Col>

														<Col lg={4}>
															<Form.Group controlId="time" className="mb-3">
																<Form.Label>Time</Form.Label>
																<Select
																	name={`time_${optionIndex}`}
																	options={dropdownValuesFlag3}
																	value={
																		dropdownValuesFlag3.find(
																			(option) =>
																				option.name === taskSelections[index]?.[`time_${optionIndex}`]
																		) || null
																	}
																	onChange={(selectedOption) => {
																		if (selectedOption) {
																			handleChange(
																				index,
																				{
																					name: `time_${optionIndex}`,
																					value: selectedOption?.name ?? null
																				}

																			)
																		} else {
																			handleChange(index, { name: `time_${optionIndex}`, value: '' })
																		}
																	}}
																	getOptionLabel={(item) => item.name}
																	getOptionValue={(item) => item.name}
																	placeholder="Select Time"
																/>
															</Form.Group>
														</Col>
													</>
												)}
											</Row>
										))}
									</div>
								)
							})}

							{parseDataForSingle?.length > 0 ? (
								<Row className="bg-light m-2 p-2">
									<Col lg={4}>
										<Form.Group controlId="taskNumber" className="mb-3">
											<Form.Label>Select Successor Task For</Form.Label>
											<Select
												name="taskNumber_0"
												value={extractedOptions.find(
													(item) => item.value === taskSelections[0]?.['taskNumber_0']
												) || null}
												onChange={(selectedOption) =>
													handleChange(0, { name: 'taskNumber_0', value: selectedOption?.value })
												}
												options={extractedOptions} // Use the converted array
												getOptionLabel={(item) => item.label} // Extract label
												getOptionValue={(item) => item.value} // Extract value
												isSearchable={true}
												placeholder="Select Option"
												className="h45"
											/>
										</Form.Group>
									</Col>

									<Col lg={4}>
										<Form.Group controlId="taskType" className="mb-3">
											<Form.Label>Task Type</Form.Label>
											<Select
												name="taskType_0"
												options={optionstaskType}
												value={optionstaskType.find(
													(option) =>
														option.value === taskSelections[0]?.['taskType_0']
												)}
												onChange={(selectedOption) =>
													handleChange(0, {name: 'taskType_0', value: selectedOption?.value})
												}
												placeholder="Select Task Type"
											/>
										</Form.Group>
									</Col>

									<Col lg={4}>
										<Form.Group controlId="taskTiming" className="mb-3">
											<Form.Label>Task Timing</Form.Label>
											<Select
												name="taskTiming_0"
												options={optionsTaskTiming}
												value={optionsTaskTiming.find(
													(option) =>
														option.value === taskSelections[0]?.['taskTiming_0']
												)}
												onChange={(selectedOption) =>
													// updateTaskSelection(
													// 	'taskTiming',
													// 	selectedOption?.value
													// )
													handleChange(0, {name: 'taskTiming', value: selectedOption?.value})
												}
												placeholder="Select Task Timing"
											/>
										</Form.Group>
									</Col>

									{taskSelections[0]?.taskTiming === 'Hours' && (
										<Col lg={4}>
											<Form.Group controlId="Hours" className="mb-3">
												<Form.Label>Hours</Form.Label>
												<Form.Control
													type="text"
													name="Hours_0"
													value={taskSelections[0]?.['Hours_0'] || ''}
													onChange={(e) =>
														handleChange(0, {name: 'Hours_0', value: e.target.value})
													}
													placeholder="Enter Task Day"
												/>
											</Form.Group>
										</Col>
									)}
									{taskSelections[0]?.taskTiming === 'Days' && (
										<>
											<Col lg={4}>
												<Form.Group controlId="Days" className="mb-3">
													<Form.Label>Days:</Form.Label>
													<Form.Control
														type="number"
														name="Days_0"
														value={taskSelections[0]?.['Days_0'] || ''}
														onChange={(e) =>
															handleChange(0, {name: 'Days_0', value: e.target.value})
														}
														placeholder="Enter Days"
													/>
												</Form.Group>
											</Col>
											<Col lg={4}>
												<Form.Group controlId="time" className="mb-3">
													<Form.Label>Time</Form.Label>
													<Select
														name="time_0"
														options={dropdownValuesFlag3}
														value={
															dropdownValuesFlag3.find(
																(option) =>
																	option.name === taskSelections[0]?.['time_0']
															) || null
														}
														onChange={(selectedOption) => {
															if (selectedOption) {
																handleChange(0,{name: 'time_0', value: selectedOption.name})
															} else {
																handleChange(0,{name: 'time_0', value: ''})
															}
														}}
														getOptionLabel={(item) => item.name}
														getOptionValue={(item) => item.name}
														placeholder="Select Time"
													/>
												</Form.Group>
											</Col>
										</>
									)}

									{taskSelections[0]?.taskTiming === 'WeekDay' && (
										<>
											<Col lg={4}>
												<Form.Group controlId="WeekDay" className="mb-3">
													<Form.Label>Date:</Form.Label>
													<Select
														name="WeekDay_0"
														options={dropdownValuesFlag2}
														value={
															dropdownValuesFlag2.find(
																(option) =>
																	option.name === taskSelections[0]?.['WeekDay_0']
															) || null
														}
														onChange={(selectedOption) =>
															handleChange(0,
																{name: 'WeekDay_0', value: selectedOption?.name}
															)
														}
														getOptionLabel={(item) => item.name}
														getOptionValue={(item) => item.name}
														placeholder="Select WeekDay"
													/>
												</Form.Group>
											</Col>

											<Col lg={4}>
												<Form.Group controlId="time" className="mb-3">
													<Form.Label>Time</Form.Label>
													<Select
														name="time_0"
														options={dropdownValuesFlag3}
														value={
															dropdownValuesFlag3.find(
																(option) =>
																	option.name === taskSelections[0]?.['time_0']
															) || null
														}
														onChange={(selectedOption) =>
															handleChange(0,
																{name: 'time_0', value: selectedOption?.name}
															)
														}
														getOptionLabel={(item) => item.name}
														getOptionValue={(item) => item.name}
														placeholder="Select Time"
													/>
												</Form.Group>
											</Col>
										</>
									)}
									{taskSelections[0]?.taskTiming === 'FromTask' && (
										<>
											<Col md={4}>
												<Form.Group controlId="previousTask" className="mb-2">
													<Form.Label>Previous Task Number</Form.Label>
													<Select
														options={desiredTaskOptions}
														value={
															previousTask
																? desiredTaskOptions.find(
																	(option) => option.value === previousTask
																)
																: null
														}
														onChange={(selectedOption) => {
															handleTaskNumberChange(selectedOption)
															handleChange(
																0,
																{
																	name: 'PreviousTask', value:
																		selectedOption?.value || ''
																}
															)
														}}
														placeholder="Select Previous Task Number"
													/>
												</Form.Group>
											</Col>
											<Col md={6}>
												<Form.Group controlId="inputFields" className="mb-2">
													<Form.Label>Input Field</Form.Label>
													<Select
														options={inputFieldOptions.map((option) => ({
															label: option, // Label for display
															value: option, // Value for internal use
														}))}
														value={selectedInputField} // Bind selected value
														onChange={(selectedOption1) => {
															handleSelectedInputFieldChange(selectedOption1)
															handleChange(
																0,

																{
																	name: 'FromDate', value:
																		selectedOption1?.value || ''
																}
															)
														}}
														placeholder="Select Input Field"
													/>
												</Form.Group>
											</Col>
										</>
									)}
								</Row>
							) : null}

							{taskRows.map((taskRow, index) => (
								<Row key={index} className="bg-light m-2 p-2 ">
									<Col lg={4}>
										<Form.Group
											controlId={`taskNumber-${index}`}
											className="mb-3">
											<Form.Label>Select Successor Task For</Form.Label>
											<Select
												name="taskNumber"
												value={
													extractedOptions.find(
														(item) => item.value === taskRow.taskNumber
													) || null
												}
												onChange={(selectedOption) =>
													handleTaskFieldChange(
														index,
														'taskNumber',
														selectedOption?.value // Use `value` since we're now using `extractedOptions`
													)
												}
												options={extractedOptions} // Use the cleaned-up `extractedOptions`
												getOptionLabel={(item) => item.label} // Use `label` instead of `task_Label`
												getOptionValue={(item) => item.value} // Use `value` instead of `task_Number`
												isSearchable={true}
												placeholder="Select Option"
												className="h45"
											/>

										</Form.Group>
									</Col>

									<Col lg={4}>
										<Form.Group
											controlId={`taskType-${index}`}
											className="mb-3">
											<Form.Label>Task Type</Form.Label>
											<Select
												name="taskType"
												options={optionstaskType}
												value={optionstaskType.find(
													(option) => option.value === taskRow.taskType
												)}
												onChange={(selectedOption) =>
													handleTaskFieldChange(
														index,
														'taskType',
														selectedOption?.value
													)
												}
												placeholder="Select Task Type"
											/>
										</Form.Group>
									</Col>

									<Col lg={4}>
										<Form.Group
											controlId={`taskTiming-${index}`}
											className="mb-3">
											<Form.Label>Task Timing</Form.Label>
											<Select
												name="taskTiming"
												options={optionsTaskTiming}
												value={optionsTaskTiming.find(
													(option) => option.value === taskRow.taskTiming
												)}
												onChange={(selectedOption) =>
													handleTaskFieldChange(
														index,
														'taskTiming',
														selectedOption?.value
													)
												}
												placeholder="Select Task Timing"
											/>
										</Form.Group>
									</Col>

									{taskRow.taskTiming === 'Hours' && (
										<>
											<Col lg={4}>
												<Form.Group
													controlId={`Hours-${index}`}
													className="mb-3">
													<Form.Label>Day:</Form.Label>
													<Form.Control
														type="number"
														name="Day"
														value={taskRow.Hours || ''}
														onChange={(e) =>
															handleTaskFieldChange(
																index,
																'Hours',
																String(e.target.value)
															)
														}
														placeholder="Enter Task Day"
													/>
												</Form.Group>
											</Col>
										</>
									)}

									{taskRow.taskTiming === 'Days' && (
										<>
											<Col lg={4}>
												<Form.Group controlId="Days" className="mb-3">
													<Form.Label>Days:</Form.Label>
													<Form.Control
														type="number"
														name="Days"
														value={taskRow.Days || ''}
														onChange={(e) =>
															handleTaskFieldChange(
																index,
																'Days',
																String(e.target.value)
															)
														}
														placeholder="Enter Days"
													/>
												</Form.Group>
											</Col>
											<Col lg={4}>
												<Form.Group
													controlId={`time-${index}`}
													className="mb-3">
													<Form.Label>Time</Form.Label>
													<Select
														name="time"
														options={dropdownValuesFlag3}
														value={dropdownValuesFlag3.find(
															(option) => option.name === taskRow.time
														)}
														onChange={(selectedOption) =>
															handleTaskFieldChange(
																index,
																'time',
																selectedOption?.name || ''
															)
														}
														getOptionLabel={(item) => item.name}
														getOptionValue={(item) => item.name}
														placeholder="Select Time"
													/>
												</Form.Group>
											</Col>
										</>
									)}

									{taskRow.taskTiming === 'WeekDay' && (
										<>
											<Col lg={4}>
												<Form.Group
													controlId={`WeekDay-${index}`}
													className="mb-3">
													<Form.Label>Date:</Form.Label>
													<Select
														name="WeekDay"
														options={dropdownValuesFlag2}
														value={dropdownValuesFlag2.find(
															(option) => option.name === taskRow.WeekDay
														)}
														onChange={(selectedOption) =>
															handleTaskFieldChange(
																index,
																'WeekDay',
																selectedOption?.name
															)
														}
														getOptionLabel={(item) => item.name}
														getOptionValue={(item) => item.name}
														placeholder="Select WeekDay"
													/>
												</Form.Group>
											</Col>

											<Col lg={4}>
												<Form.Group
													controlId={`time-${index}`}
													className="mb-3">
													<Form.Label>Time</Form.Label>
													<Select
														name="time"
														options={dropdownValuesFlag3}
														value={dropdownValuesFlag3.find(
															(option) => option.name === taskRow.time
														)}
														onChange={(selectedOption) =>
															handleTaskFieldChange(
																index,
																'time',
																selectedOption?.name || ''
															)
														}
														getOptionLabel={(item) => item.name}
														getOptionValue={(item) => item.name}
														placeholder="Select Time"
													/>
												</Form.Group>
											</Col>
										</>
									)}
									{taskRow.taskTiming === 'FromTask' && (
										<>
											<Col md={4}>

												<Form.Group controlId="previousTask" className="mb-2">
													<Form.Label>Previous Task Number</Form.Label>
													<Select
														options={desiredTaskOptions}
														value={
															previousTask
																? desiredTaskOptions.find(
																	(option) => option.value === previousTask
																)
																: null
														}
														onChange={(selectedOption) => {
															handleTaskNumberChange(selectedOption)
															handleChange(
																index,
																{
																	name: 'PreviousTask', value:
																		selectedOption?.value || ''
																}
															)
														}}
														placeholder="Select Previous Task Number"
													/>
												</Form.Group>
											</Col>
											<Col md={6}>
												<Form.Group controlId="inputFields" className="mb-2">
													<Form.Label>Input Field</Form.Label>
													<Select
														options={inputFieldOptions.map((option) => ({
															label: option, // Label for display
															value: option, // Value for internal use
														}))}
														value={selectedInputField} // Bind selected value
														onChange={(selectedOption1) => {
															handleSelectedInputFieldChange(selectedOption1)
															handleChange(
																index,

																{
																	name: 'FromDate', value:
																		selectedOption1?.value || ''
																}
															)
														}}
														placeholder="Select Input Field"
													/>
												</Form.Group>
											</Col>
										</>
									)}
									<div className=" d-flex justify-content-end align-items-center">
										<button
											onClick={() => handleRemoveTaskRow(index)}
											className="btn border-danger text-danger"
											style={{ top: '10px', right: '10px', width: '100px' }}>
											Remove
										</button>
									</div>
								</Row>
							))}
							{singleData.find(task => task.approval_Console === "Select Approval_Console") && (
								<Row className="bg-light m-2 p-2">
									<h5 className="text-primary my-1">Approval Console Task</h5>
									{/* Task Type */}
									<Col lg={4}>
										<Form.Group controlId="approvalTaskType" className="mb-3">
											<Form.Label>Task Type</Form.Label>
											<Select
												name="taskType"
												options={optionstaskType}
												value={optionstaskType.find(option => option.value === approvalTaskRow.taskType)}
												onChange={(selectedOption) => setApprovalTaskRow(prev => ({
													...prev, taskType: selectedOption?.value || ''
												}))}
												placeholder="Select Task Type"
											/>
										</Form.Group>
									</Col>

									{/* Task Timing */}
									<Col lg={4}>
										<Form.Group controlId="approvalTaskTiming" className="mb-3">
											<Form.Label>Task Timing</Form.Label>
											<Select
												name="taskTiming"
												options={optionsTaskTiming}
												value={optionsTaskTiming.find(option => option.value === approvalTaskRow.taskTiming)}
												onChange={(selectedOption) => setApprovalTaskRow(prev => ({
													...prev, taskTiming: selectedOption?.value || ''
												}))}
												placeholder="Select Task Timing"
											/>
										</Form.Group>
									</Col>

									{/* Conditional Fields Based on Task Timing */}
									{approvalTaskRow.taskTiming === 'Hours' && (
										<Col lg={4}>
											<Form.Group controlId="approvalHours" className="mb-3">
												<Form.Label>Hours</Form.Label>
												<Form.Control
													type="number"
													name="Hours"
													value={approvalTaskRow.Hours || ''}
													onChange={(e) => setApprovalTaskRow(prev => ({
														...prev, Hours: e.target.value
													}))}
													placeholder="Enter Hours"
												/>
											</Form.Group>
										</Col>
									)}

									{approvalTaskRow.taskTiming === 'Days' && (
										<>
											<Col lg={4}>
												<Form.Group controlId="approvalDays" className="mb-3">
													<Form.Label>Days</Form.Label>
													<Form.Control
														type="number"
														name="Days"
														value={approvalTaskRow.Days || ''}
														onChange={(e) => setApprovalTaskRow(prev => ({
															...prev, Days: e.target.value
														}))}
														placeholder="Enter Days"
													/>
												</Form.Group>
											</Col>
											<Col lg={4}>
												<Form.Group controlId="approvalTime" className="mb-3">
													<Form.Label>Time</Form.Label>
													<Select
														name="time"
														options={dropdownValuesFlag3}
														value={dropdownValuesFlag3.find(option => option.name === approvalTaskRow.time) || null}
														onChange={(selectedOption) => setApprovalTaskRow(prev => ({
															...prev, time: selectedOption?.name || ''
														}))}
														getOptionLabel={item => item.name}
														getOptionValue={item => item.name}
														placeholder="Select Time"
													/>
												</Form.Group>
											</Col>
										</>
									)}

									{approvalTaskRow.taskTiming === 'WeekDay' && (
										<>
											<Col lg={4}>
												<Form.Group controlId="approvalWeekDay" className="mb-3">
													<Form.Label>WeekDay</Form.Label>
													<Select
														name="WeekDay"
														options={dropdownValuesFlag2}
														value={dropdownValuesFlag2.find(option => option.name === approvalTaskRow.WeekDay) || null}
														onChange={(selectedOption) => setApprovalTaskRow(prev => ({
															...prev, WeekDay: selectedOption?.name || ''
														}))}
														getOptionLabel={item => item.name}
														getOptionValue={item => item.name}
														placeholder="Select WeekDay"
													/>
												</Form.Group>
											</Col>
											<Col lg={4}>
												<Form.Group controlId="approvalTime" className="mb-3">
													<Form.Label>Time</Form.Label>
													<Select
														name="time"
														options={dropdownValuesFlag3}
														value={dropdownValuesFlag3.find(option => option.name === approvalTaskRow.time) || null}
														onChange={(selectedOption) => setApprovalTaskRow(prev => ({
															...prev, time: selectedOption?.name || ''
														}))}
														getOptionLabel={item => item.name}
														getOptionValue={item => item.name}
														placeholder="Select Time"
													/>
												</Form.Group>
											</Col>
										</>
									)}

								</Row>
							)}


							<Button onClick={handleAddTaskRow} className="ml-1">
								Add Successor
							</Button>
							<Button type="submit" className="m-2">
								Submit
							</Button>
						</Form>
					)}
				</Modal.Body>
			</Modal>
		</div>
	)
}

export default TaskCondition

