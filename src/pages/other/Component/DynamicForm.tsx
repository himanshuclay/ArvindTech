import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Col, Modal, Row, Form } from 'react-bootstrap'
// import { FileUploader } from '@/components/FileUploader'
// import { useNavigate } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom'
import config from '@/config'
import Select, { SingleValue, MultiValue } from 'react-select'
import MessCards from './Previous&Completed'
import { toast } from 'react-toastify'
import { useRef } from 'react';
import FileUploader, { FileUploaderHandle } from './FileUploader'


interface Option {
    id: string
    label: string
    color?: string
}

interface Input {
    inputId: any
    fieldId: string
    type: string
    label: string
    formName: string
    formId: string
    placeholder: string
    options?: Option[]
    required: boolean
    conditionalFieldId?: string
    value?: any
    selectedMaster?: string
    selectedHeader?: string
    visibility?: boolean
}

interface DynamicFormProps {
    formData: {
        formId: string // Add formId
        formName: string // Add formName
        approval_Console: string
        inputs: Input[]
    }
    taskNumber: any
    data: any
    show: boolean
    parsedCondition: any
    taskName: any
    setShow: any
    preData: any
    projectName: any
    taskCommonIDRow: any
    taskStatus: any
    processId: any
    moduleId: any
    ProcessInitiationID: any
    approval_Console: any
    problemSolver: any
    approvarActions: any
    fromComponent: string
    finishPoint: any
}


interface FormState {
    [key: string]: any
}

interface DropdownItem {
    name: string
}

type InputConfig = {
    inputId: string
    type?: string
    label?: string
    placeholder?: string
    options?: any[]
    required?: boolean
    conditionalFieldId?: string
    fieldId?: string
}
const DynamicForm: React.FC<DynamicFormProps> = ({
    taskNumber,
    processId,
    taskName,
    moduleId,
    data,
    show,
    projectName,
    finishPoint,
    setShow,
    parsedCondition,
    preData,
    formData,
    taskCommonIDRow,
    approval_Console,
    taskStatus,
    fromComponent,
    problemSolver,
    approvarActions,
    ProcessInitiationID,
}) => {
    const [formState, setFormState] = useState<FormState>({})
    const [summary, setSummary] = useState('')
    const [globalTaskJson, setglobalTaskJson] = useState<any>(
        JSON.stringify(formData)
    )
    const [messManagers, setMessManagers] = useState<
        { value: string; label: string }[]
    >([])
    const [selectedManager, setSelectedManager] = useState<string>(
        'Avisineni Pavan Kumar_LLP05337'
    ) // Initialize with default value
    const [showMessManagerSelect, setShowMessManagerSelect] = useState(false)
    const [messList, setMessList] = useState<
        {
            messID: string
            messName: string
            managerEmpID: string
            managerName: string
            mobileNumber: string
        }[]
    >([])

    const [selectedCondition, setSelectedCondition] = useState<any[]>([])
    const [ifscError, setIfscError] = useState('')

    const [currentStep, setCurrentStep] = useState<number>(0) // Track the current step
    const [messForbank, setMessForbank] = useState('') // Track the current step

    // const [isTenderMaster, setIsTenderMaster] = useState(false);

    const location = useLocation()

    const navigate = useNavigate()


    const fileUploaderRef = useRef<FileUploaderHandle>(null);



    const saveDataToLocalStorage = () => {
        const savedData = JSON.parse(localStorage.getItem(localStorageKey) || '[]')
        const updatedData = [...savedData]

        const currentMessID = messList[currentStep]?.messID
        const currentMessName = messList[currentStep]?.messName
        const currentMessManagerName = messList[currentStep]?.managerName
        const currentMessManagerId = messList[currentStep]?.managerEmpID
        const currentMessManagerNumber = messList[currentStep]?.mobileNumber
        const messTaskNumber = taskNumber

        const taskJson = {
            approvalStatus: approval_Console,
            inputs: Object.keys(formState)
                .filter((inputId) => inputId !== 'formId' && inputId !== 'formName')
                .map((inputId) => {
                    const inputConfig =
                        formData?.inputs?.find((config) => config.inputId === inputId) ||
                        ({} as InputConfig)
                    return {
                        inputId,
                        value: formState[inputId],
                        type: inputConfig.type || 'text',
                        label: inputConfig.label || '',
                        fieldId: inputConfig.fieldId,
                        placeholder: inputConfig.placeholder || '',
                        options: inputConfig.options || [],
                        required: inputConfig.required || false,
                        conditionalFieldId: inputConfig.conditionalFieldId || '',
                    }
                }),
        }

        const messStatus = formState['11'] === '11-2' ? false : true

        const existingIndex = updatedData.findIndex(
            (data) => data.messID === currentMessID
        )
        if (existingIndex >= 0) {
            updatedData[existingIndex] = {
                messID: currentMessID,
                messTaskNumber: messTaskNumber,
                messName: currentMessName,
                messManager: currentMessManagerName,
                messManagerId: currentMessManagerId,
                mobileNumber: currentMessManagerNumber,
                formId: formData.formId,
                formName: formData.formName,
                taskJson,
                comments: summary,
                taskName: taskName,
                messStatus: messStatus,
            }
        } else {
            updatedData.push({
                messID: currentMessID,
                messName: currentMessName,
                messTaskNumber: messTaskNumber,
                messManager: currentMessManagerName,
                messManagerId: currentMessManagerId,
                mobileNumber: currentMessManagerNumber,
                formId: formData.formId,
                formName: formData.formName,
                taskJson,
                comments: summary,
                taskName: taskName,
                messStatus: messStatus,
            })
        }

        localStorage.setItem(localStorageKey, JSON.stringify(updatedData))
    }

    useEffect(() => {
        // Ensure messList and currentStep are valid before accessing messID
        if (
            messList &&
            messList.length > 0 &&
            currentStep >= 0 &&
            currentStep < messList.length
        ) {
            const savedDataString = localStorage.getItem(localStorageKey)
            const savedData: SavedData[] = JSON.parse(savedDataString || '[]')

            // Find the saved data for the current messID
            const currentData = savedData.find(
                (data) => data.messID === messList[currentStep]?.messID
            )

            // Reset modals before checking for the new state
            setShowBankModal(false) // Reset Bank Modal
            setShowMessManagerSelect(false) // Reset Mess Manager Select
            // setIsTenderMaster(false);

            if (currentData) {
                const taskJson = currentData.taskJson || {}

                // Convert taskJson inputs into formState
                const loadedFormState = taskJson.inputs?.reduce(
                    (acc: { [key: string]: string }, input: Input) => {
                        acc[input.inputId] = input.value || '' // Set default value if no value is found

                        // Check if input.inputId is 11 and input.value is '11-1'
                        // console.log('ss',input.inputId)
                        if (input.inputId === '11' && input.value === '11-1') {
                            setShowBankModal(true) // Trigger the Bank Modal
                            setShowMessManagerSelect(true) // Trigger the Mess Manager Select
                        }

                        return acc
                    },
                    {}
                )

                // Update form state with the loaded data or set to an empty object
                setFormState(loadedFormState || {})
                setSummary(currentData.comments || '')
            } else {
                // If no saved data is found, reset the form state and summary
                setFormState({})
                setSummary('')
            }
        } else {
            // Handle the case when messList or currentStep is invalid
            setFormState({})
            setSummary('')
        }
    }, [currentStep, messList])

    useEffect(() => {
        const messName = messList[currentStep]?.messName
        if (!messName) return

        setMessForbank(messName)

        axios
            .get(
                `${config.API_URL_APPLICATION}/CommonDropdown/GetMessManagerNameByMessName`,
                {
                    params: { MessName: messName },
                }
            )
            .then((response) => {
                if (
                    response.data.isSuccess &&
                    response.data.messManagerNameByMessName
                ) {
                    setSelectedManager(response.data.messManagerNameByMessName.id)
                    // console.log(response.data.messManagerNameByMessName.id);
                } else {
                    console.error('Failed to fetch manager details')
                }
            })
            .catch((error) => {
                console.error('Error fetching manager details:', error)
            })
    }, [messList[currentStep]?.messName])

    const [vendorsMap, setVendorsMap] = useState<Record<string, DropdownItem[]>>(
        {}
    )

    useEffect(() => {
        const fetchVendorsForInputs = async () => {
            const customSelectInputs = formData.inputs?.filter(
                (input) => input.type === 'CustomSelect'
            )

            if (customSelectInputs?.length) {
                const newVendorsMap: Record<string, DropdownItem[]> = {}

                await Promise.all(
                    customSelectInputs.map(async (input) => {
                        if (input.selectedMaster && input.selectedHeader) {
                            try {
                                const response = await axios.get(
                                    `${config.API_URL_APPLICATION}/CommonDropdown/GetData`,
                                    {
                                        params: {
                                            MasterName: input.selectedMaster,
                                            HeaderName: input.selectedHeader,
                                        },
                                    }
                                )

                                if (response.data.isSuccess) {
                                    newVendorsMap[input.inputId] = response.data.dropDownLists
                                } else {
                                    console.error(
                                        `Failed to fetch vendors for ${input.inputId}:`,
                                        response.data.message
                                    )
                                }
                            } catch (error) {
                                console.error(
                                    `Error fetching vendor data for ${input.inputId}:`,
                                    error
                                )
                            }
                        }
                    })
                )

                setVendorsMap(newVendorsMap)
            } else {
                console.warn(
                    'No CustomSelect inputs with valid MasterName and HeaderName found.'
                )
            }
        }

        fetchVendorsForInputs()
    }, [formData])


    type TaskJson = {
        inputs: Input[]
    }

    type SavedData = {
        messID: string
        messName: string
        messManager: string
        messManagerId: string
        mobileNumber: string
        taskJson: TaskJson
        messStatus: boolean
        comments?: string
    }

    const handleNextStep = () => {
        saveDataToLocalStorage()

        // Retrieve saved data from localStorage
        const savedData: SavedData[] = JSON.parse(
            localStorage.getItem(localStorageKey) || '[]'
        )
        const currentMessID = messList[currentStep].messID
        const currentData = savedData.find(
            (data: SavedData) => data.messID === currentMessID
        )

        if (currentData && currentData.taskJson) {
            const { taskJson } = currentData

            if (taskJson.inputs && Array.isArray(taskJson.inputs)) {
                const finishPointInput = taskJson.inputs.find(
                    (input) => input.inputId === String(finishPoint) // Ensure finishPoint is a string for comparison
                )
                console.log(finishPointInput)
                console.log(taskJson.inputs)

                if (!finishPointInput) {
                    console.error('No matching input found for finishPoint:', finishPoint)
                    console.log(
                        'Available inputIds:',
                        taskJson.inputs.map((input) => input.inputId)
                    )
                    toast.dismiss()
                    toast.error(`Please fill the required field`)
                    return // Prevent moving to the next step
                }

                // Ensure the value is checked properly
                if (!finishPointInput.value || finishPointInput.value.trim() === '') {
                    toast.dismiss()
                    toast.error(
                        `Please fill the required field: ${finishPointInput.label}`
                    )
                    return // Prevent moving to the next step
                }
            }
        }

        if (currentStep < messList.length - 1) {
            const nextStep = currentStep + 1
            setCurrentStep(nextStep)

            const nextMessID = messList[nextStep].messID

            // Find saved data for the next step
            const nextData = savedData.find(
                (data: SavedData) => data.messID === nextMessID
            )

            if (nextData && nextData.taskJson) {
                const { taskJson } = nextData

                if (taskJson.inputs && Array.isArray(taskJson.inputs)) {
                    // Update formState with the saved taskJson
                    const newFormState = taskJson.inputs.reduce(
                        (acc: { [key: string]: string }, input: Input) => {
                            acc[input.inputId] = input.value || '' // Safely handle missing values
                            return acc
                        },
                        {}
                    )

                    setFormState(newFormState) // Set the formState with loaded values
                } else {
                    console.error('Invalid taskJson inputs structure:', taskJson.inputs)
                }
            } else {
                console.warn('No saved data found for messID:', nextMessID)
            }

            // Optionally load the comments for the next step
            if (nextData && nextData.comments) {
                setSummary(nextData.comments)
            } else {
                setSummary('') // Clear the summary if no comments exist
            }

            setShowBankModal(false)
            setShowMessManagerSelect(false)
        }
    }

    const handlePreviousStep = () => {
        saveDataToLocalStorage() // Save data before moving to the previous step

        if (currentStep > 0) {
            const prevStep = currentStep - 1
            setCurrentStep(prevStep)

            // Load saved data for the previous step
            const savedData: SavedData[] = JSON.parse(
                localStorage.getItem(localStorageKey) || '[]'
            )
            const prevMessID = messList[prevStep].messID

            // Find saved data for the previous step
            const prevData = savedData.find(
                (data: SavedData) => data.messID === prevMessID
            )

            if (prevData && prevData.taskJson) {
                const { taskJson } = prevData

                if (taskJson.inputs && Array.isArray(taskJson.inputs)) {
                    const newFormState = taskJson.inputs.reduce(
                        (acc: { [key: string]: string }, input: Input) => {
                            acc[input.inputId] = input.value || ''
                            return acc
                        },
                        {}
                    )

                    setFormState(newFormState)
                }
            } else {
                setFormState({})
                setSummary('')
            }
        }
    }

    interface Option {
        value: string;
        label: string;
    }

    const handleClose = () => {
        setShow(false)
    }

    const projectNames = projectName

    const approvalLabels: Record<string, string> = {
        approve: "Approved",
        reject: "Rejected",
        approvewithamendment: "Approve with Amendment"
    };

    const options: OptionType[] = typeof approvarActions === 'string'
        ? approvarActions.split(",").map((action: any) => ({
            value: action,
            label: approvalLabels[action] || action,
        }))
        : [];

    console.log("46356356356", approvarActions);

    type OptionType = { value: string; label: string }

    // const options: OptionType[] = [
    //     { value: 'approved', label: 'Approved' },
    //     { value: 'rejected', label: 'Rejected' },
    //     { value: 'approvalWithAmid', label: 'approvalWithAmid' },
    // ]

    const handleSelectChange = (selectedOption: SingleValue<OptionType>) => {
        console.log('Selected Option:', selectedOption) // Debugging
        setApprovalStatus(selectedOption)
    }

    useEffect(() => {
        const fetchMessData = async () => {
            try {
                const response = await axios.get(
                    `${config.API_URL_APPLICATION}/CommonDropdown/GetMessandManagerListByProjectName?ProjectName=${projectNames}`
                )
                if (response.data.isSuccess) {
                    const fetchedMessList = response.data.messProjectListResponses // Store fetched list
                    setMessList(fetchedMessList)
                    // console.log("Fetched mess list:", fetchedMessList); // Log the fetched list directly
                } else {
                    console.error('Failed to fetch mess data')
                }
            } catch (error) {
                console.error('Error fetching mess data:', error)
            }
        }

        if (projectNames) {
            fetchMessData()
        }
    }, [projectNames])

    const localStorageKey = 'messFormData' // Key for localStorage

    const [approvalStatus, setApprovalStatus] = useState<OptionType | null>(null)
    console.log(approvalStatus?.value)

    const submitMessData = async (event: React.FormEvent) => {
        event.preventDefault() // Prevent page refresh
        console.log('hi')

        const payload = {
            messName: messForbank,
            managerName: bankDetails.managerName,
            reimbursementBankName: bankDetails.reimbursementBankName,
            reimbursementBankAccountNumber:
                bankDetails.reimbursementBankAccountNumber,
            reimbursementBankIfsc: bankDetails.reimbursementBankIfsc,
            reimbursementBranchName: bankDetails.reimbursementBranchName,
            userUpdatedMobileNumber: bankDetails.userUpdateMobileNumber,
            empID: selectedManager,
        }

        console.log('Payload:', payload)

        try {
            const response = await fetch(
                `${config.API_URL_ACCOUNT}/ProcessInitiation/UpdateMessData`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: '*/*',
                    },
                    body: JSON.stringify(payload),
                }
            )

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`)
            }

            const data = await response.json()
            console.log('Response Data:', data)
            // toast.success('Mess Data submitted successfully!');
        } catch (error) {
            console.error('Error submitting data:', error)
        }
    }

    const [fileNames, setFileNames] = useState<string[]>([]);

    const handleChange = (
        inputId: string,
        value: string | boolean | string[]
    ) => {
        const excludedInputIds = ['99', '100', '102', '103']
        const input = formData.inputs.find(
            (input) => String(input.inputId) === String(inputId)
        )

        let updatedValue = value
        let selectedLabel: any = input ? input.label : undefined
        console.log(`Selected label: ${selectedLabel}`)
        console.log(input)

        console.log(updatedValue)

        if (input) {
            // Decimal input validation
            if (input.type === 'decimal') {
                const regex = /^(\d+(\.\d{0,2})?)?$/
                if (regex.test(value as string) && parseFloat(value as string) >= 0) {
                    updatedValue = value as string
                } else {
                    console.warn(
                        'Invalid decimal value. Value must be 0 or greater with up to 2 decimals.'
                    )
                    return
                }
            }

            // Handle select and CustomSelect input types
            if (input.type === 'select' || input.type === 'CustomSelect') {
                console.log('I am inside');

                const selectedOption = input.options?.find((option) => option.id === value);
                console.log('Parsed Condition:', parsedCondition);
                console.log('Selected Option:', selectedOption, 'Value:', value);

                if (selectedOption) {
                    updatedValue = selectedOption.id;
                    selectedLabel = selectedOption.label;

                    // Ensure parsedCondition is parsed correctly and handled as an array
                    const conditionsArray = Array.isArray(parsedCondition) ? parsedCondition : [parsedCondition];

                    console.log('Conditions Array:', conditionsArray);

                    conditionsArray.forEach((condition) => {
                        condition = JSON.parse(condition);
                        console.log(typeof condition)

                        if (Array.isArray(condition[0].taskSelections)) {
                            const filteredTaskSelections = condition[0].taskSelections.filter(
                                (taskSelection: any) => (String(taskSelection.inputId) === String(updatedValue) || String(taskSelection.inputId) === '')
                            );
                            console.log(filteredTaskSelections);

                            const copyCondition = condition;
                            copyCondition[0].taskSelections = filteredTaskSelections;

                            if (filteredTaskSelections.length > 0) {
                                setSelectedCondition(copyCondition);

                                console.log('selectedCondition', selectedCondition);

                            } else {
                                console.warn('No matching task found for updatedValue:', updatedValue);
                            }
                        } else {
                            console.warn('taskSelections is not an array or undefined:', condition.taskSelections);
                        }
                    });
                } else {
                    console.warn(`No option found for the value: ${value}`);
                }
            }
            // Handle multiselect input type
            if (input.type === 'multiselect') {
                if (Array.isArray(value)) {
                    updatedValue = value.map((selectedItem) => {
                        const selectedOption = input.options?.find(
                            (option) => option.label === selectedItem || option.id === selectedItem
                        );
                        return selectedOption ? selectedOption.id : selectedItem;  // Return ID if found, else fallback to the original value
                    });
                } else {
                    console.warn('Expected an array for multiselect input, but received:', value);
                    updatedValue = [];  // Fallback to an empty array if value is not an array
                }
            }


            // Handle other input types
            switch (input.type) {
                case 'text':
                case 'textarea':
                case 'checkbox':
                case 'radio':
                case 'date':
                    updatedValue = value
                    selectedLabel = input.label
                    break
                case 'file':
                    // Handle file separately
                    break
                default:
                    break
            }

            // Update formState
            setFormState((prevState) => {
                const newState = {
                    ...prevState,
                    ...(excludedInputIds.includes(inputId)
                        ? {}
                        : { [inputId]: updatedValue }),
                }

                if (!excludedInputIds.includes(inputId)) {
                    const updatedTaskJson = {
                        ...formData,
                        inputs: formData.inputs.map((input) => ({
                            ...input,
                            value:
                                newState[input.inputId] !== undefined
                                    ? newState[input.inputId]
                                    : input.value,
                        })),
                    }
                    setglobalTaskJson(updatedTaskJson)
                }

                reEvaluateConditions(newState) // Re-evaluate conditions with updated state
                console.log(newState)

                setShowMessManagerSelect(Object.values(newState).includes('11-1'))
                setShowBankModal(Object.values(newState).includes('11-1'))
                // setIsTenderMaster(Object.values(newState).includes('11-1'))

                return newState
            })
        }
    }

    const handleSubmit = async (event: React.FormEvent, taskNumber: string) => {
        console.log('found')


        // if (fileUploaderRef.current) {
        //     await fileUploaderRef.current.uploadFiles();
        // }

        event.preventDefault()
        {
            processId === 'ACC.01' && saveDataToLocalStorage()
        }

        const finalData = JSON.parse(localStorage.getItem(localStorageKey) ?? '[]')
        localStorage.removeItem(localStorageKey)
        console.log('Final Submitted Data:', finalData)
        const role = localStorage.getItem('EmpId') || ''

        let found = false
        finalData.forEach((mess: any) => {
            mess.taskJson.inputs.forEach((input: any) => {
                if (input.value === '11-1') {
                    found = true
                }
            })
        })
        console.log(found)




        if (fromComponent === 'AccountProcess') {
            const adhocRequestedData = {
                projectName: projectNames,
                moduleID: moduleId,
                processID: processId,
                taskCommonID: 1, // need to re work for this
                adhocJson: JSON.stringify(globalTaskJson),
                createdBy: role,
            }

            try {
                const apiUrl = `${config.API_URL_ACCOUNT}/AdhocForm/InsertAdhocJsonMaster`
                const response = await axios.post(apiUrl, adhocRequestedData)
                console.log(response)

                if (response.status >= 200 && response.status < 300) {
                    console.log('ADHOC submitted successfully:', response.data)
                    navigate('/pages/ProcessMaster')
                } else {
                    console.error(
                        'Error submitting module:',
                        response.status,
                        response.statusText
                    )
                }
            } catch (error: any) {
                console.error('Error submitting module:', error.message || error)
            }
        }
        if (fromComponent === 'PendingTask' || 'ApprovalConsole') {
            console.log(approval_Console)

            const requestData = {
                id: ProcessInitiationID || 0,
                doerID: role || '',
                task_Json:
                    processId === 'ACC.01'
                        ? typeof finalData === 'string' ? finalData : JSON.stringify(finalData)
                        : typeof globalTaskJson === 'string' ? globalTaskJson : JSON.stringify(globalTaskJson),
                isExpired: 0,
                isCompleted: (() => {
                    console.log('approval_Console:', approval_Console)
                    console.log('taskStatus:', taskStatus)
                    console.log('approvalStatus?.value:', approvalStatus?.value)

                    const currentStatus =
                        typeof taskStatus === 'string' && taskStatus.trim() !== ''
                            ? taskStatus.trim()
                            : 'Pending'

                    console.log('Current Status:', currentStatus)

                    if (
                        approval_Console === 'Select Approval_Console' &&
                        approvalStatus?.value === undefined
                    )
                        return 'Waiting for Approval'

                    const approvalValue =
                        approvalStatus?.value?.trim().toLowerCase() || ''
                    if (currentStatus === 'Waiting for Approval') {
                        if (approvalValue === 'reject') return 'Pending'
                        if (['approvewithamendment', 'approve'].includes(approvalValue))
                            return 'Completed'
                    }
                    if (approval_Console === '' &&
                        approvalStatus?.value === undefined) {
                        return 'Completed'
                    }

                    return currentStatus
                })(),
                task_Number: taskNumber,
                summary: formState['summary'] || 'Task Summary',
                condition_Json: fromComponent === 'PendingTask' && processId !== 'ACC.01'
                    ? JSON.stringify(selectedCondition)
                    : parsedCondition,
                taskCommonId: taskCommonIDRow,
                taskStatus: taskStatus,
                taskName: taskName,
                rejectedJson:
                    approvalStatus?.value?.trim().toLowerCase() === 'rejected'
                        ? globalTaskJson
                        : '',

                endprocessStatus: 'string',
                // file: '',
                updatedBy: role,
                problemSolver: problemSolver,
                projectName: projectName,
            }

            console.log(requestData)

            try {

                const parsedGlobalTaskJson = typeof globalTaskJson === "string" ? JSON.parse(globalTaskJson) : globalTaskJson;

                if (!parsedGlobalTaskJson?.inputs?.length) {
                    console.error("Invalid globalTaskJson structure or 'inputs' is missing:", parsedGlobalTaskJson);
                    return;
                }

                // const finishPointInput = parsedGlobalTaskJson.inputs.find((input: any) => String(input.inputId) === String(finishPoint));
                // console.log(finishPoint)
                // console.log(parsedGlobalTaskJson);

                // if (processId !== "ACC.01") {
                //     if(Array.isArray(finishPointInput.value)){
                //         if(!finishPointInput.value.length){
                //             toast.dismiss();
                //             toast.error(`Please fill the required field: ${finishPointInput?.label || "Unknown Field"}`);
                //             return;
                //         }
                //     }else if(!finishPointInput?.value?.trim()){
                //         toast.dismiss();
                //         toast.error(`Please fill the required field: ${finishPointInput?.label || "Unknown Field"}`);
                //         return;
                //     }
                // }
                const response = await fetch(
                    `${config.API_URL_ACCOUNT}/ProcessInitiation/UpdateDoerTask`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(requestData),
                    }
                )

                console.log(response);

                if (response.ok) {
                    const responseData = await response.json();

                    const statusMessageMap: { [key: string]: string } = {
                        'approval_pending': 'Task has been sent for approval',
                        'approval_rejected': 'Task has been rejected',
                        'task_completed': 'Task Completed'
                    };

                    const messageKey =
                        approval_Console === 'Select Approval_Console' && approvalStatus?.value === undefined
                            ? 'approval_pending'
                            : approval_Console === 'Select Approval_Console' && approvalStatus?.value === 'rejected'
                                ? 'approval_rejected'
                                : approval_Console === '' && approvalStatus?.value === undefined
                                    ? 'task_completed'
                                    : '';

                    if (messageKey === 'task_completed') {
                        toast.success(statusMessageMap[messageKey]);
                        navigate('/pages/Notification');
                    } else if (messageKey) {
                        toast.warning(statusMessageMap[messageKey]);
                    }

                    setShow(false);
                    console.log('Task updated successfully:', responseData);
                } else {
                    console.error('Failed to update the task:', response.statusText);
                }

            } catch (error) {
                console.error('Error occurred while updating task:', error)
            } finally {
            }
        }
    }


    // Function to re-evaluate conditions for showing/hiding fields
    const reEvaluateConditions = (newState: { [key: string]: any }) => {
        const updatedState = { ...newState }

        formData.inputs.forEach((input) => {
            if (input.conditionalFieldId) {
                const conditionValue = newState[input.conditionalFieldId]
                const shouldDisplay = conditionValue === input.conditionalFieldId

                if (shouldDisplay) {
                    // Ensure the input is displayed if condition is met
                    updatedState[input.inputId] = newState[input.inputId] || ''
                } else {
                    // Optionally reset value if condition is not met
                    // updatedState[input.inputId] = ''; // or keep existing value
                }
            }
        })

        setFormState(updatedState)
    }

    const shouldDisplayInput = (input: Input): boolean => {
        // If there's no conditional field, show the input
        if (!input.conditionalFieldId) return true

        const conditionValue = input.conditionalFieldId

        // If the condition matches a specific value, show the input
        if (conditionValue === 'someid') return true

        // Find the input with the conditionalFieldId and check its value
        for (const otherInput of formData.inputs) {
            if (otherInput.inputId === conditionValue) {
                // Return true if the value is not empty
                return formState[otherInput.inputId] !== ''
            }

            // If the input has options, check if the selected option matches the condition
            if (
                otherInput.options &&
                otherInput.options.some((option) => option.id === conditionValue)
            ) {
                return formState[otherInput.inputId] === conditionValue
            }
        }

        // Return false if no condition is met
        return false
    }

    const [showBankModal, setShowBankModal] = useState(false)

    const [bankDetails, setBankDetails] = useState({
        reimbursementBankAccountNumber: '',
        reimbursementBankName: '',
        reimbursementBranchName: '',
        reimbursementBankIfsc: '',
        managerName: '',
        messName: '',
        userUpdateMobileNumber: '',
    })



    useEffect(() => {
        const fetchBankDetails = async () => {
            try {
                const response = await axios.get(
                    `${config.API_URL_ACCOUNT}/ProcessInitiation/GetMessDataByMessManagerEmpID?EmpID=${selectedManager}`
                )
                const data = response.data?.getMessDataByMessManagerEmpID?.[0]

                if (data) {
                    console.log(data)

                    setBankDetails({
                        reimbursementBankAccountNumber:
                            data.reimbursementBankAccountNumber || '',
                        reimbursementBankName: data.reimbursementBankName || '',
                        reimbursementBranchName: data.reimbursementBranchName || '',
                        reimbursementBankIfsc: data.reimbursementBankIfsc || '',
                        managerName: data.managerName || '',
                        messName: messForbank || '',
                        userUpdateMobileNumber: data.userUpdateMobileNumber || '',
                    })
                } else {
                    console.warn('Data is null, clearing all fields.')

                    setBankDetails({
                        reimbursementBankAccountNumber: '',
                        reimbursementBankName: '',
                        reimbursementBranchName: '',
                        reimbursementBankIfsc: '',
                        managerName: '',
                        messName: messForbank || '',
                        userUpdateMobileNumber: '',
                    })
                }
            } catch (error) {
                console.error('Error fetching bank details:', error)

                setBankDetails({
                    reimbursementBankAccountNumber: '',
                    reimbursementBankName: '',
                    reimbursementBranchName: '',
                    reimbursementBankIfsc: '',
                    managerName: '',
                    messName: messForbank || '',
                    userUpdateMobileNumber: '',
                })
            }
        }

        if (selectedManager) {
            fetchBankDetails()
        }
    }, [selectedManager])

    const fetchBankByIFSC = async (ifsc: string) => {
        try {
            const response = await axios.get(
                `${config.API_URL_APPLICATION}/BankMaster/GetBank`,
                {
                    params: { ifsc },
                }
            )

            if (
                response.data.isSuccess &&
                response.data.bankMasterListResponses.length > 0
            ) {
                const fetchedBankDetails = response.data.bankMasterListResponses[0]
                console.log(fetchedBankDetails)
                setBankDetails((prevState) => ({
                    ...prevState,
                    reimbursementBankName: fetchedBankDetails.bank,
                    reimbursementBranchName: fetchedBankDetails.branch,
                }))
            } else {
                setIfscError('Bank details not found for the given IFSC code.')
                setBankDetails((prevState) => ({
                    ...prevState,
                    reimbursementBankName: '',
                    reimbursementBranchName: '',
                }))
            }
        } catch (error) {
            console.error('Error fetching bank details:', error)
            setIfscError('Error fetching bank details.')
        }
    }

    const handleIfscBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
        const ifsc = e.target.value.trim()

        if (!ifsc || ifsc.length !== 11) {
            setIfscError(
                ifsc
                    ? 'Invalid IFSC code. Please enter an 11-character code.'
                    : 'IFSC code is required.'
            )
            setBankDetails((prevState) => ({
                ...prevState,
                reimbursementBankName: '',
                reimbursementBranchName: '',
            }))
            return
        }

        setIfscError('')
        await fetchBankByIFSC(ifsc)
    }

    const handleClose2 = () => setShowBankModal(false)

    const handleSelectMessImpChange = (selectedValue: string) => {
        setSelectedManager(selectedValue)
    }


    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get(
                    `${config.API_URL_APPLICATION}/CommonDropdown/GetEmployeeListWithId`
                )
                const data = response.data.employeeLists

                // Map the response data to the format required for the <select> component
                const formattedData = data.map(
                    (employee: { empId: string; employeeName: string }) => ({
                        value: employee.empId,
                        label: employee.employeeName,
                    })
                )

                setMessManagers(formattedData)
            } catch (error) {
                console.error('Error fetching employee list:', error)
            }
        }

        fetchEmployees()
    }, [])

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        setBankDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }))
    }


    return (
        <>
            <Modal
                size="xl"
                className="p-3"
                show={show}
                placement="end"
                onHide={handleClose}>
                <Modal.Header closeButton className=" ">
                    <Modal.Title className="text-dark">Task Details</Modal.Title>
                </Modal.Header>

                {location.pathname != '/pages/ApprovalConsole' && (
                    <div className="px-3">
                        {location.pathname !== '/pages/ApprovalConsole' && (
                            <div className="d-flex flex-wrap mx-3">
                                {preData && preData.length > 0 && <MessCards data={preData} />}
                            </div>
                        )}
                    </div>
                )}
                {/* {location.pathname === '/pages/ApprovalConsole' && 
                    ( */}
                <div>
                    {formData && formData.inputs && (
                        <form
                            className="side-scroll"
                            onSubmit={(event) => handleSubmit(event, taskNumber)}>
                            <Modal.Body className=" p-4">
                                <div
                                    className="stepper-vertical"
                                    style={{
                                        width: '100%',
                                        paddingRight: '10px',
                                        position: 'relative',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        marginBottom: '20px',
                                    }}>
                                    {processId === 'ACC.01' && (
                                        <div className="stepper-container position-relative">
                                            {/* Active Mess Name */}
                                            <div className="active-mess text-center">
                                                <strong>Current Mess:</strong>{' '}
                                                {messList[currentStep]?.messName || 'N/A'}
                                            </div>

                                            {/* Stepper */}
                                            <div
                                                className="stepper-wrapper"
                                                style={{
                                                    ['--progress' as string]: `${currentStep / (messList.length - 1)
                                                        }`,
                                                }}>
                                                <div className="stepper-line"></div>{' '}
                                                {/* Background line */}
                                                <div className="stepper-line-filled"></div>{' '}
                                                {/* Filled line */}
                                                <div className="stepper d-flex justify-content-between">
                                                    {messList.map((mess, index) => {
                                                        const isCompleted = index < currentStep
                                                        const isActive = index === currentStep
                                                        return (
                                                            <div
                                                                key={mess.messID}
                                                                className={`stepper-item text-center ${isCompleted
                                                                    ? 'completed'
                                                                    : isActive
                                                                        ? 'active'
                                                                        : 'pending'
                                                                    }`}>
                                                                <div
                                                                    className={`step-circle ${isCompleted
                                                                        ? 'bg-success'
                                                                        : isActive
                                                                            ? 'bg-primary'
                                                                            : 'bg-light'
                                                                        }`}>
                                                                    {isCompleted ? (
                                                                        <i className="ri-check-line text-white"></i>
                                                                    ) : (
                                                                        <span className="step-number">
                                                                            {index + 1}
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                <div
                                                                    className={`step-label ${isActive ? 'text-primary' : 'text-muted'
                                                                        }`}
                                                                    title={mess.messName} // Tooltip for longer names
                                                                >
                                                                    {mess.messName}
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                </div>
                                <div
                                    className="form-section"
                                    style={{ width: '90%', padding: '0px 20px' }}>
                                    <div className="my-task">
                                        {formData.inputs.map(
                                            (input: Input) =>
                                                ((fromComponent === 'TaskMaster' && 'PendingTask') ||
                                                    shouldDisplayInput(input)) && (
                                                    <div
                                                        className={`${!input.visibility ? 'd-none' : 'form-group'
                                                            } 
                                                ${fromComponent ===
                                                            'ApprovalConsole' &&
                                                            (approval_Console ===
                                                                'Select Approval_Console'
                                                                ? approvalStatus?.value ===
                                                                    'approvewithamendment'
                                                                    ? 'cursor-pointer'
                                                                    : 'cursor-not-allowed'
                                                                : '')
                                                            }`}
                                                        key={input.inputId}
                                                        style={{ marginBottom: '1rem' }}>
                                                        <label className="label">{input.label}</label>
                                                        {input.type === 'text' && (
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder={input.placeholder}
                                                                value={
                                                                    formState[input.inputId] ?? input.value ?? ''
                                                                }
                                                                onChange={(e) =>
                                                                    handleChange(input.inputId, e.target.value)
                                                                }
                                                            />
                                                        )}
                                                        {input.type === 'number' && (
                                                            //  input.visibility !== false &&
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                placeholder={input.placeholder}
                                                                value={formState[input.inputId]}
                                                                onChange={(e) =>
                                                                    handleChange(input.inputId, e.target.value)
                                                                }
                                                            />
                                                        )}
                                                        {input.type === 'hyperlink' && (
                                                            //  input.visibility !== false &&
                                                            <div className="flex flex-col gap-2">
                                                                {/* Input field for hyperlink */}
                                                                <input
                                                                    type="url"
                                                                    className="form-control p-2 border rounded"
                                                                    placeholder={input.placeholder || "Enter hyperlink"}
                                                                    value={formState[input.inputId] || ""}
                                                                    onChange={(e) => handleChange(input.inputId, e.target.value)}
                                                                />

                                                                {/* Display hyperlink if input is not empty */}
                                                                {formState[input.inputId] && (
                                                                    <a
                                                                        href={formState[input.inputId]}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-blue-500 underline hover:text-blue-700"
                                                                    >
                                                                        {formState[input.inputId]}
                                                                    </a>
                                                                )}
                                                            </div>
                                                        )}
                                                        {input.type === 'decimal' && (
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder={input.placeholder || '0.00'}
                                                                value={
                                                                    input.value !== ''
                                                                        ? input.value
                                                                        : formState[input.inputId] || ''
                                                                }
                                                                onChange={(e) => {
                                                                    const value = e.target.value
                                                                    const regex = /^(\d+(\.\d{0,2})?)?$/

                                                                    // Validate the input value for decimals with up to 2 places
                                                                    if (
                                                                        regex.test(value) &&
                                                                        (parseFloat(value) >= 0 || value === '')
                                                                    ) {
                                                                        handleChange(input.inputId, value)
                                                                    } else {
                                                                        console.warn(
                                                                            'Invalid decimal input. Must be 0 or greater with up to 2 decimal places.'
                                                                        )
                                                                    }
                                                                }}
                                                                onBlur={() => {
                                                                    // Ensure the value is properly formatted or reset on blur
                                                                    const formattedValue = parseFloat(
                                                                        formState[input.inputId] || '0'
                                                                    ).toFixed(2)
                                                                    if (
                                                                        !isNaN(Number(formattedValue)) &&
                                                                        Number(formattedValue) >= 0
                                                                    ) {
                                                                        handleChange(input.inputId, formattedValue)
                                                                    } else {
                                                                        alert(
                                                                            'Enter a valid decimal value (0 or greater, up to 2 decimals).'
                                                                        )
                                                                        handleChange(input.inputId, '0.00')
                                                                    }
                                                                }}
                                                            />
                                                        )}
                                                        {input.type === 'Non Negative Integer' && (
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder={
                                                                    input.placeholder ||
                                                                    'Enter a positive integer'
                                                                }
                                                                value={
                                                                    input.value !== ''
                                                                        ? input.value
                                                                        : formState[input.inputId] || ''
                                                                }
                                                                onChange={(e) => {
                                                                    const value = e.target.value

                                                                    // Validation: Positive integers only
                                                                    const regex = /^[0-9]*$/
                                                                    if (
                                                                        regex.test(value) &&
                                                                        (parseInt(value, 10) >= 0 || value === '')
                                                                    ) {
                                                                        handleChange(input.inputId, value)
                                                                    } else {
                                                                        console.warn(
                                                                            'Invalid input. Only positive integers are allowed.'
                                                                        )
                                                                    }
                                                                }}
                                                                onBlur={() => {
                                                                    // Ensure the value is properly formatted or reset on blur
                                                                    const parsedValue = parseInt(
                                                                        formState[input.inputId] || '0',
                                                                        10
                                                                    )
                                                                    if (!isNaN(parsedValue) && parsedValue >= 0) {
                                                                        handleChange(
                                                                            input.inputId,
                                                                            parsedValue.toString()
                                                                        )
                                                                    } else {
                                                                        alert('Enter a valid positive integer.')
                                                                        handleChange(input.inputId, '0')
                                                                    }
                                                                }}
                                                            />
                                                        )}
                                                        {input.type === 'Positive-integer-greater-zero' && (
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder={
                                                                    input.placeholder ||
                                                                    'Enter a positive integer greater than 0'
                                                                }
                                                                value={
                                                                    input.value !== ''
                                                                        ? input.value
                                                                        : formState[input.inputId] || ''
                                                                }
                                                                onChange={(e) => {
                                                                    const value = e.target.value

                                                                    // Prevent entering 0
                                                                    if (value === '0') {
                                                                        handleChange(input.inputId, '') // Reset to empty string instead of undefined
                                                                        return
                                                                    }

                                                                    // Allow only positive integers greater than 0
                                                                    const regex = /^[1-9][0-9]*$/
                                                                    if (regex.test(value) || value === '') {
                                                                        handleChange(
                                                                            input.inputId,
                                                                            value === '' ? '' : value
                                                                        )
                                                                    }
                                                                }}
                                                                onBlur={() => {
                                                                    const value = parseInt(
                                                                        formState[input.inputId] || '0',
                                                                        10
                                                                    )
                                                                    if (isNaN(value) || value <= 0) {
                                                                        alert(
                                                                            'Enter a valid positive integer greater than 0.'
                                                                        )
                                                                        handleChange(input.inputId, '') // Reset to undefined if invalid
                                                                    }
                                                                }}
                                                            />
                                                        )}
                                                        {input.type === 'email' && (
                                                            <input
                                                                type="email"
                                                                className="form-control"
                                                                placeholder={input.placeholder}
                                                                value={
                                                                    input.value !== ''
                                                                        ? input.value
                                                                        : formState[input.inputId] || ''
                                                                }
                                                                onChange={(e) =>
                                                                    handleChange(input.inputId, e.target.value)
                                                                }
                                                            />
                                                        )}
                                                        {input.type === 'tel' && (
                                                            <>
                                                                <input
                                                                    type="tel"
                                                                    className="form-control"
                                                                    placeholder={input.placeholder}
                                                                    value={
                                                                        input.value !== ''
                                                                            ? input.value
                                                                            : formState[input.inputId] || ''
                                                                    }
                                                                    onChange={(e) => {
                                                                        let inputValue = e.target.value;
                                                                        const regex = /^[6-9][0-9]{0,9}$/; // Allows only numbers starting with 6-9 and up to 10 digits

                                                                        if (regex.test(inputValue)) {
                                                                            handleChange(input.inputId, inputValue);
                                                                        }
                                                                    }}
                                                                    onBlur={(e) => {
                                                                        const inputValue = e.target.value;
                                                                        if (!/^[6-9][0-9]{9}$/.test(inputValue)) {
                                                                            toast.error('Please enter a valid 10-digit mobile number starting with 6-9.');
                                                                            handleChange(input.inputId, '');
                                                                        }
                                                                    }}
                                                                />
                                                                {formState[input.inputId] &&
                                                                    !/^[6-9][0-9]{9}$/.test(formState[input.inputId]) && (
                                                                        <span className="text-danger">
                                                                            Please enter a valid 10-digit Indian mobile number.
                                                                        </span>
                                                                    )}
                                                            </>
                                                        )}


                                                        {input.type === 'custom' && (
                                                            <input
                                                                type="text"
                                                                placeholder={input.placeholder}
                                                                value={formState[input.inputId]}
                                                                onChange={(e) =>
                                                                    handleChange(input.inputId, e.target.value)
                                                                }
                                                                style={{
                                                                    display: 'block',
                                                                    width: '100%',
                                                                    padding: '0.5rem',
                                                                }}
                                                            />
                                                        )}
                                                        {input.type === 'select' && (
                                                            <select
                                                                id={input.inputId}
                                                                className="form-select form-control"
                                                                value={
                                                                    input.value !== ''
                                                                        ? input.value
                                                                        : formState[input.inputId] || ''
                                                                }
                                                                onChange={(e) =>
                                                                    handleChange(input.inputId, e.target.value)
                                                                } // Passing the id to handleChange
                                                                style={{
                                                                    display: 'block',
                                                                    width: '100%',
                                                                    padding: '0.5rem',
                                                                }}>
                                                                <option value="" disabled>
                                                                    Select an option
                                                                </option>
                                                                {input.options?.map((option) => (
                                                                    <option key={option.id} value={option.id}>
                                                                        {' '}
                                                                        {/* Set value to option.id */}
                                                                        {option.label}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        )}


                                                        {input.type === 'multiselect' && (
                                                            <Select<Option, true> // <Option, true> indicates multi-select with flat options
                                                                isMulti
                                                                id={input.inputId}
                                                                className="form-select"
                                                                value={
                                                                    input.value && input.value.length > 0
                                                                        ? (input.options || []).filter(option => input.value.includes(option.id)).map(option => ({
                                                                            value: option.id,
                                                                            label: option.label,
                                                                        }))
                                                                        : (input.options || []).filter(option => (formState[input.inputId] || []).includes(option.id)).map(option => ({
                                                                            value: option.id,
                                                                            label: option.label,
                                                                        }))
                                                                }
                                                                onChange={(selectedOptions: MultiValue<Option>) => {
                                                                    const selectedValues = selectedOptions.map(option => option.value);
                                                                    handleChange(input.inputId, selectedValues); // Save array of selected option IDs
                                                                }}
                                                                options={(input.options || []).map(option => ({
                                                                    value: option.id,
                                                                    label: option.label,
                                                                }))}
                                                                placeholder="Select options"
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        padding: '0.5rem',
                                                                        width: '100%',
                                                                    }),
                                                                }}
                                                            />
                                                        )}
                                                        {input.type === 'CustomSelect' && (
                                                            <select
                                                                key={input.inputId}
                                                                className="form-control"
                                                                value={
                                                                    input.value !== ''
                                                                        ? input.value
                                                                        : formState[input.inputId] || ''
                                                                }
                                                                onChange={(e) =>
                                                                    handleChange(input.inputId, e.target.value)
                                                                }
                                                                style={{
                                                                    display: 'block',
                                                                    width: '100%',
                                                                    padding: '0.5rem',
                                                                }}>
                                                                <option value="" disabled>
                                                                    Select an option
                                                                </option>
                                                                {(vendorsMap[input.inputId] || []).map(
                                                                    (vendor, index) => (
                                                                        <option key={index} value={vendor.name}>
                                                                            {vendor.name}
                                                                        </option>
                                                                    )
                                                                )}
                                                            </select>
                                                        )}
                                                        {input.type === 'file' && (
                                                            <div>
                                                                <FileUploader
                                                                    ref={fileUploaderRef}
                                                                    additionalData={{
                                                                        ModuleID: moduleId,
                                                                        CreatedBy: 'yourUserID',
                                                                        TaskCommonID: taskCommonIDRow,
                                                                        Task_Number: taskNumber,
                                                                        ProcessInitiationID: ProcessInitiationID,
                                                                        ProcessID: processId,
                                                                        UpdatedBy: 'yourUpdatedBy'
                                                                    }}
                                                                    onFileSelect={(files) => {
                                                                        if (files.length > 0) {
                                                                            setFileNames(files.map(file => file.name)); // Store multiple file names
                                                                        }
                                                                    }}
                                                                />
                                                                <input type="text"
                                                                    value={fileNames}
                                                                />

                                                                {/* Display selected file names */}
                                                                {fileNames.length > 0 && (
                                                                    <div className="mt-2">
                                                                        <p>Selected Files:</p>
                                                                        <ul>
                                                                            {fileNames.map((name, index) => (
                                                                                <li key={index}>{name}</li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}

                                                        {input.type === 'checkbox' && (
                                                            <span className="form-check">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    checked={formState[input.inputId]}
                                                                    onChange={(e) =>
                                                                        handleChange(
                                                                            input.inputId,
                                                                            e.target.checked
                                                                        )
                                                                    }
                                                                />
                                                            </span>
                                                        )}
                                                        {input.type === "radio" && input.visibility && (
                                                            <Form.Group className="mb-3">
                                                                {/* <Form.Label className="d-block mb-2">{input.label}</Form.Label>  */}
                                                                {input.options?.map((option) => (
                                                                    <Form.Check
                                                                        key={option.id}
                                                                        type="radio"
                                                                        id={`${input.inputId}-${option.id}`}
                                                                        name={input.inputId}
                                                                        value={option.id}
                                                                        checked={formState[input.inputId] === option.id}
                                                                        onChange={(e) => handleChange(input.inputId, e.target.value)}
                                                                        required={input.required}
                                                                        className="my-2" // Adds spacing between options
                                                                        label={option.label}
                                                                        style={{ color: option.color || "#000000" }}
                                                                    />
                                                                ))}
                                                            </Form.Group>
                                                        )}
                                                        {input.type === 'status' && (
                                                            <input
                                                                type="text"
                                                                checked={formState[input.inputId]}
                                                                onChange={(e) =>
                                                                    handleChange(input.inputId, e.target.checked)
                                                                }
                                                            />
                                                        )}
                                                        {input.type === 'successorTask' && (
                                                            <input
                                                                type="text"
                                                                checked={formState[input.inputId]}
                                                                onChange={(e) =>
                                                                    handleChange(input.inputId, e.target.checked)
                                                                }
                                                            />
                                                        )}
                                                        {input.type === 'date' && (
                                                            <input
                                                                type="date"
                                                                value={
                                                                    input.value !== ''
                                                                        ? input.value
                                                                        : formState[input.inputId] || ''
                                                                }
                                                                onChange={(e) =>
                                                                    handleChange(input.inputId, e.target.value)
                                                                }
                                                                style={{
                                                                    display: 'block',
                                                                    width: '100%',
                                                                    padding: '0.5rem',
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                )
                                        )}
                                        {processId === 'ACC.01' && (
                                            <>
                                                {showMessManagerSelect && (
                                                    <div className="form-group my-2 position-relative">
                                                        <label>Select Mess Manager</label>
                                                        <Select
                                                            className="react-select-container"
                                                            classNamePrefix="react-select"
                                                            options={messManagers}
                                                            value={
                                                                messManagers.find(
                                                                    (manager) =>
                                                                        manager.value === selectedManager
                                                                ) || null
                                                            }
                                                            onChange={(selectedOption) =>
                                                                handleSelectMessImpChange(
                                                                    selectedOption?.value || ''
                                                                )
                                                            }
                                                            placeholder="Select an Employee"
                                                        />
                                                    </div>
                                                )}
                                                {showBankModal && (
                                                    <div className="modal-overlay">
                                                        <div className="modal-content">
                                                            <h4>Bank Details</h4>
                                                            <form>
                                                                <Row>
                                                                    <Col lg={6}>
                                                                        {' '}
                                                                        <div className="mt-3">
                                                                            <label>Reimbursement IFSC Code</label>
                                                                            <input
                                                                                className="form-control"
                                                                                type="text"
                                                                                name="reimbursementBankIfsc"
                                                                                value={bankDetails.reimbursementBankIfsc}
                                                                                placeholder="Enter IFSC code"
                                                                                onChange={handleInputChange}
                                                                                onBlur={handleIfscBlur}
                                                                            />
                                                                        </div>
                                                                        {ifscError && (
                                                                            <div className="text-danger mt-1">
                                                                                {ifscError}
                                                                            </div>
                                                                        )}
                                                                    </Col>
                                                                    <Col lg={6}>
                                                                        <div className="mt-3">
                                                                            <label>Reimbursement Account</label>
                                                                            <input
                                                                                className="form-control"
                                                                                type="text"
                                                                                name="reimbursementBankAccountNumber"
                                                                                value={
                                                                                    bankDetails.reimbursementBankAccountNumber
                                                                                }
                                                                                placeholder="Enter account number"
                                                                                onChange={handleInputChange}
                                                                            />
                                                                        </div>
                                                                    </Col>
                                                                    <Col lg={6}>
                                                                        {' '}
                                                                        <div className="mt-3 ">
                                                                            <label>Reimbursement Bank</label>
                                                                            <input
                                                                                className="form-control"
                                                                                type="text"
                                                                                name="reimbursementBankName"
                                                                                value={bankDetails.reimbursementBankName}
                                                                                placeholder="Enter bank name"
                                                                                onChange={handleInputChange}
                                                                            />
                                                                        </div>
                                                                    </Col>
                                                                    <Col lg={6}>
                                                                        <div className="mt-3 ">
                                                                            <label>Reimbursement Bank Branch</label>
                                                                            <input
                                                                                className="form-control"
                                                                                type="text"
                                                                                name="reimbursementBranchName"
                                                                                value={bankDetails.reimbursementBranchName}
                                                                                placeholder="Enter branch name"
                                                                                onChange={handleInputChange}
                                                                            />
                                                                        </div>
                                                                    </Col>
                                                                    <Col lg={6}>
                                                                        <div className="mt-3 ">
                                                                            <label>Mess Manager</label>
                                                                            <input
                                                                                className="form-control"
                                                                                type="text"
                                                                                name="managerName"
                                                                                value={bankDetails.managerName}
                                                                                placeholder="Enter manager name"
                                                                                onChange={handleInputChange}
                                                                            />
                                                                        </div>
                                                                    </Col>
                                                                    <Col lg={6}>
                                                                        <div className="mt-3 ">
                                                                            <label>Mess Manager Mobile Number</label>
                                                                            <input
                                                                                className="form-control"
                                                                                type="text"
                                                                                name="userUpdateMobileNumber"
                                                                                value={bankDetails.userUpdateMobileNumber}
                                                                                placeholder="Enter mobile number"
                                                                                onChange={handleInputChange}
                                                                            />
                                                                        </div>
                                                                    </Col>
                                                                </Row>

                                                                <div className="modal-buttons mt-3 d-flex justify-content-end">
                                                                    <button
                                                                        className="btn btn-secondary"
                                                                        type="button"
                                                                        onClick={handleClose2}>
                                                                        Close
                                                                    </button>
                                                                </div>
                                                            </form>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                        {fromComponent === 'ApprovalConsole' && (
                                            <div>
                                                <label>Is Approved</label>
                                                <Select
                                                    styles={{
                                                        menu: (provided) => ({
                                                            ...provided,
                                                            zIndex: 9999 // Ensures dropdown appears above everything
                                                        }),
                                                        menuPortal: (base) => ({ ...base, zIndex: 9999 }) // Moves dropdown to top layer
                                                    }}
                                                    menuPortalTarget={document.body} // Render dropdown outside modal
                                                    options={options} // Dynamically generated options
                                                    value={approvalStatus} // Bind the selected option
                                                    onChange={handleSelectChange} // Update state on selection
                                                    placeholder="Select Approval Status" // Placeholder text
                                                />
                                            </div>
                                        )}

                                    </div>
                                    <div>
                                        {processId === 'ACC.01' ? (
                                            <div className="d-flex justify-content-end align-items-center mt-2 gap-2">
                                                {/* Previous Button */}
                                                {currentStep > 0 && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-secondary"
                                                        onClick={handlePreviousStep}
                                                        title="Previous">
                                                        <i className="ri-arrow-left-line"></i>
                                                    </button>
                                                )}

                                                {/* Refresh Button */}
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary"
                                                    onClick={() => {
                                                        setFormState({})
                                                        setSummary('')
                                                        setShowBankModal(false)
                                                        setShowMessManagerSelect(false)
                                                    }}
                                                    title="Refresh Form">
                                                    <i className="ri-refresh-line"></i>
                                                </button>

                                                {/* Next Button */}
                                                {currentStep < messList.length - 1 && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-primary"
                                                        onClick={(e) => {
                                                            handleNextStep()
                                                            if (processId === 'ACC.01') {
                                                                submitMessData(e)
                                                            }
                                                        }}
                                                        title="Next">
                                                        <i className="ri-arrow-right-line"></i>
                                                    </button>
                                                )}

                                                {/* Submit Button */}
                                                {currentStep === messList.length - 1 && (
                                                    <button
                                                        type="submit"
                                                        className="btn btn-outline-success"
                                                        onClick={(e) => {
                                                            if (processId === 'ACC.01') {
                                                                submitMessData(e)
                                                            }
                                                            handleSubmit(e, taskNumber)
                                                        }}
                                                        title="Submit">
                                                        <i className="ri-check-line"></i>
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            <>
                                                {fromComponent !== 'TaskMaster' && (
                                                    <button
                                                        type="submit" // This button will submit the form
                                                        className="btn btn-success mt-2">
                                                        Submit
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </Modal.Body>
                        </form>
                    )}
                </div>
                {/* )


                } */}
            </Modal>
        </>
    )
}

export default DynamicForm
