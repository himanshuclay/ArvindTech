import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
import Select from 'react-select';


interface Project {
    id: number;
    projectName: string;
    projectID: string;
    stateId: number;
    projectType: number;
    managementContract: number;
    projectIncharge: number;
    projectCoordinator: number;
    completionStatus: number;
    nameOfWork: string;
    createdBy: string;
    updatedBy: string;


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


const ProjectInsert = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [empName, setEmpName] = useState<string | null>()
    const [stateList, setStateList] = useState<StateList[]>([]);
    const [completionStatus, setCompletionStatus] = useState<CompletionStatus[]>([]);
    const [employeeList, setEmployeeList] = useState<EmployeeList[]>([]);


    const [project, setProject] = useState<Project>({
        id: 0,
        projectName: '',
        projectID: '',
        stateId: 0,
        projectType: 0,
        managementContract: 0,
        projectIncharge: 0,
        projectCoordinator: 0,
        completionStatus: 0,
        nameOfWork: '',
        createdBy: '',
        updatedBy: ''
    });


    useEffect(() => {
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

    }, []);



    const handleChange = (e: ChangeEvent<any>) => {
        const { name, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setProject({
                ...project,
                [name]: checked
            });
        } else {
            const value = (e.target as HTMLInputElement | HTMLSelectElement).value;
            setProject({
                ...project,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const payload = {
            ...project,
            createdBy: editMode ? project.createdBy : empName,
            updatedBy: editMode ? empName : '',
        };
        console.log(payload)

        // try {
        //     if (editMode) {
        //         await axios.post(`${config.API_URL_APPLICATION}/ProjectMaster/UpdateProject`, payload);
        //     } else {
        //         await axios.post(`${config.API_URL_APPLICATION}/ProjectMaster/InsertProject`, payload);
        //     }
        //     navigate('/pages/DoerMaster');
        // } catch (error) {
        //     console.error('Error submitting module:', error);
        // }
    };


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
                                <Form.Group controlId="projectName" className="mb-3">
                                    <Form.Label>Project Name *:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="projectName"
                                        value={project.projectName}
                                        onChange={handleChange}
                                        required
                                        
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="stateName" className="mb-3">
                                    <Form.Label>State Name *:</Form.Label>
                                    <Select
                                        name="stateName"
                                        value={stateList.find((mod) => mod.stateName === project.id)}
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
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="projectType" className="mb-3">
                                    <Form.Label>Project Type *:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="projectType"
                                        value={project.projectType}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="managementContract" className="mb-3">
                                    <Form.Label>Management Contract *:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="managementContract"
                                        value={project.managementContract}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="incharge" className="mb-3">
                                    <Form.Label>Project Incharge *:</Form.Label>
                                    <Select
                                        name="incharge"
                                        // value={employeeList.find((emp) => emp.employeeName === project.incharge)}
                                        // onChange={(selectedOption) => {
                                        //     setProject({
                                        //         ...project,
                                        //         incharge: selectedOption?.employeeName || "",
                                        //     });
                                        // }}
                                        getOptionLabel={(emp) => emp.employeeName}
                                        getOptionValue={(emp) => emp.employeeName}
                                        options={employeeList}
                                        isSearchable={true}
                                        placeholder="Select Project Incharge"
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="coordinator" className="mb-3">
                                    <Form.Label>Project Coordinator *:</Form.Label>
                                    <Select
                                        name="coordinator"
                                        // value={employeeList.find((emp) => emp.employeeName === project.coordinator)}
                                        // onChange={(selectedOption) => {
                                        //     setProject({
                                        //         ...project,
                                        //         coordinator: selectedOption?.employeeName || "",
                                        //     });
                                        // }}
                                        getOptionLabel={(emp) => emp.employeeName}
                                        getOptionValue={(emp) => emp.employeeName}
                                        options={employeeList}
                                        isSearchable={true}
                                        placeholder="Select Project Coordinator"
                                        required
                                    />
                                </Form.Group>
                            </Col>



                            <Col lg={6}>
                                <Form.Group controlId="completionStatus" className="mb-3">
                                    <Form.Label>Completion Status *:</Form.Label>
                                    <Select
                                        name="completionStatus"
                                        value={completionStatus.find((mod) => mod.name === project.id)}
                                        onChange={(selectedOption) => {
                                            setProject({
                                                ...project,
                                                completionStatus: selectedOption?.id || 0,
                                            });
                                        }}
                                        getOptionLabel={(mod) => mod.id == 1 ? "Ongoing" : "Completed"}
                                        getOptionValue={(mod) => mod.id == 1 ? "Ongoing" : "Completed"}
                                        options={completionStatus}
                                        isSearchable={true}
                                        placeholder="Select State Name"
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            {id && <>
                              

                                <Col lg={6}>
                                    <Form.Group controlId="contractualWorkVAlue" className="mb-3">
                                        <Form.Label>Contractual Work Value :</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="contractualWorkVAlue"
                                            // value={project.contractualWorkVAlue}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col lg={6}>
                                    <Form.Group controlId="executorCompany" className="mb-3">
                                        <Form.Label>Executor Company :</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="executorCompany"
                                            // value={project.executorCompany}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col lg={6}>
                                    <Form.Group controlId="nextValueOfWorkItemForTeam" className="mb-3">
                                        <Form.Label>Next Value Of Work Item For Team :</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="nextValueOfWorkItemForTeam"
                                            // value={project.nextValueOfWorkItemForTeam}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col lg={6}>
                                    <Form.Group controlId="percentageOfWorkDone" className="mb-3">
                                        <Form.Label>Percentage Of Work Done :</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="percentageOfWorkDone"
                                            // value={project.percentageOfWorkDone}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col lg={6}>
                                    <Form.Group controlId="revisedContractualWorkValue" className="mb-3">
                                        <Form.Label>Revised Contractual Work Value:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="revisedContractualWorkValue"
                                            // value={project.revisedContractualWorkValue}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>


                                <Col lg={6}>
                                    <Form.Group controlId="totalWorkDoneValueUptoPreviousMonth" className="mb-3">
                                        <Form.Label>Total Work Done Value Upto Previous Month:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="totalWorkDoneValueUptoPreviousMonth"
                                            // value={project.totalWorkDoneValueUptoPreviousMonth}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col lg={6}>
                                    <Form.Group controlId="valueOfWorkDoneInThisMonth" className="mb-3">
                                        <Form.Label>Value Of Work Done In This Month:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="valueOfWorkDoneInThisMonth"
                                            // value={project.valueOfWorkDoneInThisMonth}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col lg={6}>
                                    <Form.Group controlId="valueOfWorkDoneInThisFY" className="mb-3">
                                        <Form.Label>Value Of Work Done In This FY:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="valueOfWorkDoneInThisFY"
                                            // value={project.valueOfWorkDoneInThisFY}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col lg={6}>
                                    <Form.Group controlId="contractualStartDate" className="mb-3">
                                        <Form.Label>Contractual Start Date:</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="contractualStartDate"
                                            // value={project.contractualStartDate}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col lg={6}>
                                    <Form.Group controlId="contractualCompletionDate" className="mb-3">
                                        <Form.Label>Contractual Completion Date:</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="contractualCompletionDate"
                                            // value={project.contractualCompletionDate}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col lg={6}>
                                    <Form.Group controlId="expectedDateOfEarliestProjectCompletion" className="mb-3">
                                        <Form.Label>Expected Date Of Earliest Project Completion:</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="expectedDateOfEarliestProjectCompletion"
                                            // value={project.expectedDateOfEarliestProjectCompletion}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col lg={6}>
                                    <Form.Group controlId="expectedDateOfLatestProjectCompletion" className="mb-3">
                                        <Form.Label>Expected Date Of Latest Project Completion:</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="expectedDateOfLatestProjectCompletion"
                                            // value={project.expectedDateOfLatestProjectCompletion}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col lg={6}>
                                    <Form.Group controlId="refreshWorkDate" className="mb-3">
                                        <Form.Label>Refresh Work Date:</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="refreshWorkDate"
                                            // value={project.refreshWorkDate}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col lg={6}>
                                    <Form.Group controlId="estimateCompletionDate" className="mb-3">
                                        <Form.Label>Estimate Completion Date:</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="estimateCompletionDate"
                                            // value={project.estimateCompletionDate}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col lg={6}>
                                    <Form.Group controlId="recordedMonth" className="mb-3">
                                        <Form.Label>Recorded Month:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="recordedMonth"
                                            // value={project.recordedMonth}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col lg={6}>
                                    <Form.Group controlId="recordedYear" className="mb-3">
                                        <Form.Label>Recorded Year:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="recordedYear"
                                            // value={project.recordedYear}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>




                            </>}



                            <Col lg={6}>
                                <Form.Group controlId="nameOfWork" className="mb-3">
                                    <Form.Label>nameOfWork:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="nameOfWork"
                                        value={project.nameOfWork}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>





                            <Col className='align-items-end d-flex justify-content-between mb-3'>
                                <div>
                                    <span className='fs-5 '>All fields are required*</span>
                                </div>
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