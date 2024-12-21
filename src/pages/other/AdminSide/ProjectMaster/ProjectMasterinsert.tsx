import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_green.css';
import { toast } from 'react-toastify';


interface Project {
    id: number;
    projectName: string;
    projectID: string;
    stateId: number;
    projectType: number;
    managementContract: number;
    projectIncharge: string;
    projectInchargeName: string;
    projectCoordinator: string;
    projectCoordinatorName: string;
    completionStatus: number;
    completionStatusName: string;
    status: string;
    nameOfWork: string;
    createdBy: string;
    updatedBy: string;
    contractualWorkValue: string;
    executorCompany: string;
    nextValueofWorkItemForTeam: string;
    percentageofWorkDone: string;
    revisedContractualWorkValue: string;
    totalWorkDoneValueuptoPreviousMonth: string;
    valueofWorkDoneinthisMonth: string;
    valueofWorkDoneinthisFY: string;
    contractualStartDate: string;
    contractualCompletionDate: string;
    expectedDateofEarliestProjectCompletion: string;
    expectedDateofLatestProjectCompletion: string;
    refreshWorkDate: string;
    estimateCompletionDate: string;
    recordedMonth: string;
    recordedYear: string;
}


interface StateList {
    id: number;
    stateName: any;
}
interface CompletionStatus {
    id: number;
    name: any;
}

interface EmployeeList {
    empId: string;
    employeeName: string;
}
interface PorjectTypeList {
    id: number;
    name: string;
}


const ProjectInsert = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [empName, setEmpName] = useState<string | null>()
    const [stateList, setStateList] = useState<StateList[]>([]);
    const [completionStatus, setCompletionStatus] = useState<CompletionStatus[]>([]);
    const [employeeList, setEmployeeList] = useState<EmployeeList[]>([]);
    const [projectTypeList, setProjectTypeList] = useState<PorjectTypeList[]>([]);
    const [managementContractList, setManagementContractList] = useState<PorjectTypeList[]>([]);


    const [project, setProject] = useState<Project>({
        id: 0,
        projectID: '',
        projectName: '',
        stateId: 0,
        projectType: 0,
        managementContract: 0,
        projectIncharge: '',
        projectInchargeName: '',
        projectCoordinator: '',
        projectCoordinatorName: '',
        completionStatus: 0,
        completionStatusName: '',
        status: '',
        nameOfWork: '',
        createdBy: '',
        updatedBy: '',
        contractualWorkValue: '',
        executorCompany: '',
        nextValueofWorkItemForTeam: '',
        percentageofWorkDone: '',
        revisedContractualWorkValue: '',
        totalWorkDoneValueuptoPreviousMonth: '',
        valueofWorkDoneinthisMonth: '',
        valueofWorkDoneinthisFY: '',
        contractualStartDate: '',
        contractualCompletionDate: '',
        expectedDateofEarliestProjectCompletion: '',
        expectedDateofLatestProjectCompletion: '',
        refreshWorkDate: '',
        estimateCompletionDate: '',
        recordedMonth: '',
        recordedYear: '',
    });
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        toast.dismiss()

        const storedEmpName = localStorage.getItem('EmpName');
        if (storedEmpName) {
            setEmpName(storedEmpName);
        }
    }, []);


    useEffect(() => {
        if (id) {
            setEditMode(true);
            fetchDoerById(id);
        } else {
            setEditMode(false);
        }
    }, [id]);



    const fetchDoerById = async (id: string) => {
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/ProjectMaster/GetProject`, {
                params: { id: id }
            });
            if (response.data.isSuccess) {
                const fetchedModule = response.data.projectMasterList[0];
                setProject(fetchedModule);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching module:', error);
        }
    };




    useEffect(() => {
        const fetchData = async (endpoint: string, setter: Function, listName: string) => {
            try {
                const response = await axios.get(`${config.API_URL_APPLICATION}/${endpoint}`);
                if (response.data.isSuccess) {
                    setter(response.data[listName]);
                } else {
                    console.error(response.data.message);
                }
            } catch (error) {
                console.error(`Error fetching data from ${endpoint}:`, error);
            }
        };
        fetchData('CommonDropdown/GetStateList', setStateList, 'stateListResponses');
        fetchData('CommonDropdown/GetCompletionStatus', setCompletionStatus, 'completionStatusListResponses');
        fetchData('CommonDropdown/GetEmployeeListWithId', setEmployeeList, 'employeeLists');
        fetchData('CommonDropdown/GetCommonList?flag=4', setProjectTypeList, 'commonLists');
        fetchData('CommonDropdown/GetCommonList?flag=3', setManagementContractList, 'commonLists');

    }, []);



    const handleChange = (e: ChangeEvent<any> | null, name?: string, value?: any) => {
        if (e) {
            const { name: eventName, type } = e.target;

            if (type === 'checkbox') {
                const checked = (e.target as HTMLInputElement).checked;
                setProject({
                    ...project,
                    [eventName]: checked
                });
            } else {
                const inputValue = (e.target as HTMLInputElement | HTMLSelectElement).value;
                setProject({
                    ...project,
                    [eventName]: inputValue
                });
            }
        } else if (name) {
            setProject({
                ...project,
                [name]: value
            });
        }
    };

    const validateFields = (): boolean => {
        const errors: { [key: string]: string } = {};

        if (!project.projectID) { errors.projectID = 'Project Id is required'; }
        if (!project.projectName) { errors.projectName = 'Project Name is required'; }
        if (!project.stateId) { errors.stateId = 'State is required'; }
        if (!project.projectType) { errors.projectType = 'Project Type is required'; }
        if (!project.managementContract) { errors.managementContract = 'Management Contract is required'; }
        if (!project.completionStatus) { errors.completionStatus = 'Completion Status is required'; }
        if (!project.status) { errors.status = 'Status is required'; }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateFields()) {
            toast.dismiss()
            toast.error('Please fill in all required fields.');
            return;
        }

        const payload = {
            ...project,
            createdBy: editMode ? project.createdBy : empName,
            updatedBy: editMode ? empName : '',
            projectIncharge: Array.isArray(project.projectIncharge) ? project.projectIncharge.join(',') : project.projectIncharge,
            projectInchargeName: Array.isArray(project.projectInchargeName) ? project.projectInchargeName.join(',') : project.projectInchargeName,
        };
        console.log(payload)
        try {
            const apiUrl = `${config.API_URL_APPLICATION}/ProjectMaster/${editMode ? 'UpdateProject' : 'InsertProject'}`;
            const response = await axios.post(apiUrl, payload);
            if (response.status === 200) {
                navigate('/pages/ProjectMaster', {
                    state: {
                        successMessage: editMode ? "Project Updated successfully!" : "Project Added successfully!",
                    },
                });
            } else {
                toast.error(response.data.message || "Failed to process request")
            }
        } catch (error: any) {
            toast.error(error)
        }
    };


    const optionsAppAccess = [
        { value: 'Enabled', label: 'Enabled' },
        { value: 'Disabled', label: 'Disabled' }
    ];


    return (
        <div>
            <div className="container ">
                <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center fs-20 rounded-3 border">
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit Project' : 'Add Project'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col lg={6}>
                                <Form.Group controlId="projectID" className="mb-3">
                                    <Form.Label>Project ID  <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="projectID"
                                        value={project.projectID}
                                        onChange={handleChange}
                                        placeholder='Enter Project ID'
                                        disabled={editMode}
                                        className={validationErrors.projectID ? " input-border" : "  "}
                                    />
                                    {validationErrors.projectID && (
                                        <small className="text-danger">{validationErrors.projectID}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="projectName" className="mb-3">
                                    <Form.Label>Project Name  <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="projectName"
                                        value={project.projectName}
                                        onChange={handleChange}
                                        placeholder='Enter Project Name'
                                        className={validationErrors.projectName ? " input-border" : "  "}
                                    />
                                    {validationErrors.projectName && (
                                        <small className="text-danger">{validationErrors.projectName}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="stateName" className="mb-3">
                                    <Form.Label>State Name  <span className='text-danger'>*</span></Form.Label>
                                    <Select
                                        name="stateName"
                                        value={stateList.find((mod) => mod.id === project.stateId)}
                                        onChange={(selectedOption) => {
                                            setProject({
                                                ...project,
                                                stateId: selectedOption?.id || 0,
                                            });
                                        }}
                                        getOptionLabel={(mod) => mod.stateName}
                                        getOptionValue={(mod) => mod.stateName}
                                        options={stateList}
                                        isSearchable={true}
                                        placeholder="Select State Name"
                                        className={validationErrors.stateId ? " input-border" : "  "}
                                    />
                                    {validationErrors.stateId && (
                                        <small className="text-danger">{validationErrors.stateId}</small>
                                    )}
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="projectTypeList" className="mb-3">
                                    <Form.Label>Project Type  <span className='text-danger'>*</span></Form.Label>
                                    <Select
                                        name="projectTypeList"
                                        value={projectTypeList.find((mod) => mod.id === project.projectType)}
                                        onChange={(selectedOption) => {
                                            setProject({
                                                ...project,
                                                projectType: selectedOption?.id || 0,
                                            });
                                        }}
                                        getOptionLabel={(mod) => mod.name}
                                        getOptionValue={(mod) => mod.name}
                                        options={projectTypeList}
                                        isSearchable={true}
                                        placeholder="Select Project Type"
                                        className={validationErrors.projectType ? " input-border" : "  "}
                                    />
                                    {validationErrors.projectType && (
                                        <small className="text-danger">{validationErrors.projectType}</small>
                                    )}
                                </Form.Group>
                            </Col>


                            <Col lg={6}>
                                <Form.Group controlId="managementContractList" className="mb-3">
                                    <Form.Label>Management Contract  <span className='text-danger'>*</span></Form.Label>
                                    <Select
                                        name="managementContractList"
                                        value={managementContractList.find((mod) => mod.id === project.managementContract)}
                                        onChange={(selectedOption) => {
                                            setProject({
                                                ...project,
                                                managementContract: selectedOption?.id || 0,
                                            });
                                        }}
                                        getOptionLabel={(mod) => mod.name}
                                        getOptionValue={(mod) => mod.name}
                                        options={managementContractList}
                                        isSearchable={true}
                                        placeholder="Select Management Contract"
                                        className={validationErrors.managementContract ? " input-border" : "  "}
                                    />
                                    {validationErrors.managementContract && (
                                        <small className="text-danger">{validationErrors.managementContract}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="completionStatus" className="mb-3">
                                    <Form.Label>
                                        Completion Status <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Select
                                        name="completionStatus"
                                        value={completionStatus.find((mod) => mod.id === project.completionStatus) || null}
                                        onChange={(selectedOption) => {
                                            setProject({
                                                ...project,
                                                completionStatus: selectedOption?.id || 0,
                                            });
                                        }}
                                        getOptionLabel={(mod) => mod.name}
                                        getOptionValue={(mod) => mod.id.toString()} // Convert id to string
                                        options={completionStatus}
                                        isSearchable={true}
                                        placeholder="Select Completion Status"
                                        className={validationErrors.completionStatus ? " input-border" : ""}
                                    />
                                    {validationErrors.completionStatus && (
                                        <small className="text-danger">{validationErrors.completionStatus}</small>
                                    )}
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="status" className="mb-3">
                                    <Form.Label>Project Status  <span className='text-danger'>*</span></Form.Label>
                                    <Select
                                        name="status"
                                        options={optionsAppAccess}
                                        value={optionsAppAccess.find(option => option.value === project.status)}
                                        onChange={selectedOption => handleChange(null, 'status', selectedOption?.value)}
                                        placeholder="Select Project Status"
                                        className={validationErrors.status ? " input-border" : "  "}
                                    />
                                    {validationErrors.status && (
                                        <small className="text-danger">{validationErrors.status}</small>
                                    )}
                                </Form.Group>
                            </Col>



                            <Col lg={6}>
                                <Form.Group controlId="incharges" className="mb-3">
                                    <Form.Label>Project Incharge</Form.Label>
                                    <Select
                                        name="incharges"
                                        value={employeeList.find((emp) => emp.employeeName === project.projectInchargeName)}
                                        onChange={(selectedOption) => {
                                            setProject({
                                                ...project,
                                                projectIncharge: selectedOption?.empId || '',
                                                projectInchargeName: selectedOption?.employeeName || '',
                                            });
                                        }}
                                        getOptionLabel={(emp) => emp.employeeName}
                                        getOptionValue={(emp) => emp.empId}
                                        options={employeeList}
                                        isSearchable
                                        placeholder="Select Employee"
                                    />

                                </Form.Group>
                            </Col>


                            <Col lg={6}>
                                <Form.Group controlId="coordinator" className="mb-3">
                                    <Form.Label>Project Coordinator </Form.Label>
                                    <Select
                                        name="coordinator"
                                        value={employeeList.find((emp) => emp.employeeName === project.projectCoordinatorName)}
                                        onChange={(selectedOption) => {
                                            setProject({
                                                ...project,
                                                projectCoordinator: selectedOption?.empId || '',
                                                projectCoordinatorName: selectedOption?.employeeName || '',
                                            });
                                        }}
                                        getOptionLabel={(emp) => emp.employeeName}
                                        getOptionValue={(emp) => emp.empId}
                                        options={employeeList}
                                        isSearchable={true}
                                        placeholder="Select Employee"
                                    />
                                </Form.Group>
                            </Col>



                            {id && <>

                                <Col lg={6}>
                                    <Form.Group controlId="contractualWorkValue" className="mb-3">
                                        <Form.Label>Contractual Work Value </Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="contractualWorkValue"
                                            value={project.contractualWorkValue}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col lg={6}>
                                    <Form.Group controlId="executorCompany" className="mb-3">
                                        <Form.Label>Executor Company </Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="executorCompany"
                                            value={project.executorCompany}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col lg={6}>
                                    <Form.Group controlId="nextValueofWorkItemForTeam" className="mb-3">
                                        <Form.Label>Next Value Of Work Item For Team </Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="nextValueofWorkItemForTeam"
                                            value={project.nextValueofWorkItemForTeam}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col lg={6}>
                                    <Form.Group controlId="percentageofWorkDone" className="mb-3">
                                        <Form.Label>Percentage Of Work Done </Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="percentageofWorkDone"
                                            value={project.percentageofWorkDone}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col lg={6}>
                                    <Form.Group controlId="revisedContractualWorkValue" className="mb-3">
                                        <Form.Label>Revised Contractual Work Value</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="revisedContractualWorkValue"
                                            value={project.revisedContractualWorkValue}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>


                                <Col lg={6}>
                                    <Form.Group controlId="totalWorkDoneValueuptoPreviousMonth" className="mb-3">
                                        <Form.Label>Total Work Done Value Upto Previous Month</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="totalWorkDoneValueuptoPreviousMonth"
                                            value={project.totalWorkDoneValueuptoPreviousMonth}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col lg={6}>
                                    <Form.Group controlId="valueofWorkDoneinthisMonth" className="mb-3">
                                        <Form.Label>Value Of Work Done In This Month</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="valueofWorkDoneinthisMonth"
                                            value={project.valueofWorkDoneinthisMonth}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col lg={6}>
                                    <Form.Group controlId="valueofWorkDoneinthisFY" className="mb-3">
                                        <Form.Label>Value Of Work Done In This FY</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="valueofWorkDoneinthisFY"
                                            value={project.valueofWorkDoneinthisFY}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col lg={6}>
                                    <Form.Group controlId="contractualStartDate" className="mb-3">
                                        <Form.Label>Contractual Start Date</Form.Label>
                                        <Flatpickr
                                            value={project.contractualStartDate}
                                            onChange={([date]) => setProject({
                                                ...project,
                                                contractualStartDate: date.toLocaleDateString('en-CA')
                                            })}
                                            options={{
                                                enableTime: false,
                                                dateFormat: "Y-m-d",
                                                time_24hr: false,
                                            }}
                                            placeholder="Contractual Start Date"
                                            className="form-control"
                                            required
                                        />
                                    </Form.Group>
                                </Col>


                                <Col lg={6}>
                                    <Form.Group controlId="contractualCompletionDate" className="mb-3">
                                        <Form.Label>Contractual Completion Date</Form.Label>
                                        <Flatpickr
                                            value={project.contractualCompletionDate}
                                            onChange={([date]) => setProject({
                                                ...project,
                                                contractualCompletionDate: date.toLocaleDateString('en-CA')
                                            })}
                                            options={{
                                                enableTime: false,
                                                dateFormat: "Y-m-d",
                                                time_24hr: false,
                                            }}
                                            placeholder="Contractual Completion Date"
                                            className="form-control"
                                            required
                                        />
                                    </Form.Group>
                                </Col>

                                <Col lg={6}>
                                    <Form.Group controlId="expectedDateofEarliestProjectCompletion" className="mb-3">
                                        <Form.Label>Expected Date Of Earliest Project Completion</Form.Label>
                                        <Flatpickr
                                            value={project.expectedDateofEarliestProjectCompletion}
                                            onChange={([date]) => setProject({
                                                ...project,
                                                expectedDateofEarliestProjectCompletion: date.toISOString()
                                            })}
                                            options={{
                                                enableTime: false,
                                                dateFormat: "Y-m-d",
                                                time_24hr: false,
                                            }}
                                            placeholder="Expected Date Of Earliest Project Completion"
                                            className="form-control"
                                            required
                                        />
                                    </Form.Group>
                                </Col>

                                <Col lg={6}>
                                    <Form.Group controlId="expectedDateofLatestProjectCompletion" className="mb-3">
                                        <Form.Label>Expected Date Of Latest Project Completion</Form.Label>

                                        <Flatpickr
                                            value={project.expectedDateofLatestProjectCompletion}
                                            onChange={([date]) => setProject({
                                                ...project,
                                                expectedDateofLatestProjectCompletion: date.toLocaleDateString('en-CA')
                                            })}
                                            options={{
                                                enableTime: false,
                                                dateFormat: "Y-m-d",
                                                time_24hr: false,
                                            }}
                                            placeholder="Expected Date Of Latest Project Completion"
                                            className="form-control"
                                            required
                                        />
                                    </Form.Group>
                                </Col>

                                <Col lg={6}>
                                    <Form.Group controlId="refreshWorkDate" className="mb-3">
                                        <Form.Label>Refresh Work Date</Form.Label>
                                        <Flatpickr
                                            value={project.refreshWorkDate}
                                            onChange={([date]) => setProject({
                                                ...project,
                                                refreshWorkDate: date.toLocaleDateString('en-CA')
                                            })}
                                            options={{
                                                enableTime: false,
                                                dateFormat: "Y-m-d",
                                                time_24hr: false,
                                            }}
                                            placeholder="Refresh Work Date"
                                            className="form-control"
                                            required
                                        />
                                    </Form.Group>
                                </Col>

                                <Col lg={6}>
                                    <Form.Group controlId="estimateCompletionDate" className="mb-3">
                                        <Form.Label>Estimate Completion Date</Form.Label>
                                        <Flatpickr
                                            value={project.estimateCompletionDate}
                                            onChange={([date]) => setProject({
                                                ...project,
                                                estimateCompletionDate: date.toLocaleDateString('en-CA')
                                            })}
                                            options={{
                                                enableTime: false,
                                                dateFormat: "Y-m-d",
                                                time_24hr: false,
                                            }}
                                            placeholder="Estimate Completion Date"
                                            className="form-control"
                                            required
                                        />
                                    </Form.Group>
                                </Col>

                                <Col lg={6}>
                                    <Form.Group controlId="recordedMonth" className="mb-3">
                                        <Form.Label>Recorded Month</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="recordedMonth"
                                            value={project.recordedMonth}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col lg={6}>
                                    <Form.Group controlId="recordedYear" className="mb-3">
                                        <Form.Label>Recorded Year</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="recordedYear"
                                            value={project.recordedYear}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>

                            </>}

                            <Col lg={6}>
                                <Form.Group controlId="nameOfWork" className="mb-3">
                                    <Form.Label>Name Of Work</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="nameOfWork"
                                        value={project.nameOfWork}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>


                            <Col className='align-items-end d-flex justify-content-end mb-3'>
                                <div>
                                    <Link to={'/pages/ProjectMaster'}>
                                        <Button variant="primary" >
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update Project' : 'Add Project'}
                                    </Button>
                                </div>

                            </Col>

                        </Row>

                    </Form>
                </div>

            </div>

        </div>
    );
};

export default ProjectInsert;