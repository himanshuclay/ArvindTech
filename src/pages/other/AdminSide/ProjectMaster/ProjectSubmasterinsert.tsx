import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import config from '@/config';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_green.css'; // You can choose other themes as well
import { toast } from 'react-toastify';


interface SubProject {
    id: number;
    projectName: string;
    subProjectID: string;
    subProjectName: string;
    projectIncharge: {};
    projectCoordinator: string;
    completionStatus: number;
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


interface CompletionStatus {
    id: number;
    name: any;
}


interface PorjectList {
    id: string;
    projectName: string;
}


const ProjectInsert = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [empName, setEmpName] = useState<string | null>()
    const [completionStatus, setCompletionStatus] = useState<CompletionStatus[]>([]);
    const [projectList, setProjectList] = useState<PorjectList[]>([]);


    const [subProject, setSubProject] = useState<SubProject>({
        id: 0,
        projectName: '',
        subProjectID: '',
        subProjectName: '',
        projectIncharge: {},
        projectCoordinator: '',
        completionStatus: 0,
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
            fetchdubProjectById(id);
        } else {
            setEditMode(false);
        }
    }, [id]);



    const fetchdubProjectById = async (id: string) => {
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/SubProjectMaster/GetSubProject`, {
                params: { id: id }
            });
            if (response.data.isSuccess) {
                const fetchedModule = response.data.subProjects[0];
                console.log(fetchedModule)
                setSubProject(fetchedModule);
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

        fetchData('CommonDropdown/GetCompletionStatus', setCompletionStatus, 'completionStatusListResponses');
        fetchData('CommonDropdown/GetProjectList', setProjectList, 'projectListResponses');

    }, []);



    const handleChange = (e: ChangeEvent<any>) => {
        const { name, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setSubProject({
                ...subProject,
                [name]: checked
            });
        } else {
            const value = (e.target as HTMLInputElement | HTMLSelectElement).value;
            setSubProject({
                ...subProject,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        const payloadInsert = {
            subProjectID: subProject.subProjectID,
            completionStatus: subProject.completionStatus,
            subProjectName: subProject.subProjectName,
            projectName: subProject.projectName,
            createdBy: editMode ? subProject.createdBy : empName,
        };
        const payloadUpdate = {
            ...subProject,
            createdBy: editMode ? subProject.createdBy : empName,
            updatedBy: editMode ? empName : '',
        };
        console.log(payloadUpdate)
        console.log(payloadInsert)
        e.preventDefault();

        try {
            if (editMode) {
                await axios.post(`${config.API_URL_APPLICATION}/SubProjectMaster/UpdateSubProject`, payloadUpdate);
                console.log('SubProjectMaster/UpdateSubProject')
            } else {
                await axios.post(`${config.API_URL_APPLICATION}/SubProjectMaster/InsertSubProject`, payloadInsert);
                console.log('SubProjectMaster/InsertSubProject')

            }
            navigate('/pages/ProjectMaster', {
                state: {
                    successMessage: editMode ? "Sub Project Updated successfully!" : "Sub Project Added successfully!",
                },
            });

        } catch (error: any) {
            toast.dismiss()
            toast.error(error)
        }


    };


    return (
        <div>
            <div className="container ">
                <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center fs-20 rounded-3 border">
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit Sub Project' : 'Add Sub Project'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            {editMode ?
                                <Col lg={6}>
                                    <Form.Group controlId="subProjectID" className="mb-3">
                                        <Form.Label>Sub Project ID </Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="subProjectID"
                                            value={subProject.subProjectID}
                                            placeholder='Sub Project ID'
                                            disabled
                                        />
                                    </Form.Group>
                                </Col>
                                : null
                            }

                            <Col lg={6}>
                                <Form.Group controlId="projectName" className="mb-3">
                                    <Form.Label>Project Name *</Form.Label>
                                    <Select
                                        name="projectName"
                                        value={projectList.find((mod) => mod.projectName === subProject.projectName)}
                                        onChange={(selectedOption) => {
                                            setSubProject({
                                                ...subProject,
                                                projectName: selectedOption?.projectName || '',
                                            });
                                        }}
                                        getOptionLabel={(mod) => mod.projectName}
                                        getOptionValue={(mod) => mod.projectName}
                                        options={projectList}
                                        isSearchable={true}
                                        placeholder="Select Project Name"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="subProjectName" className="mb-3">
                                    <Form.Label>Sub Project Name *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="subProjectName"
                                        value={subProject.subProjectName}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter Sub Project Name'
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="completionStatus" className="mb-3">
                                    <Form.Label>Completion Status *</Form.Label>
                                    <Select
                                        name="completionStatus"
                                        value={completionStatus.find((mod) => mod.name === subProject.completionStatus)}
                                        onChange={(selectedOption) => {
                                            setSubProject({
                                                ...subProject,
                                                completionStatus: selectedOption?.name || '',
                                            });
                                        }}
                                        getOptionLabel={(mod) => mod.name}
                                        getOptionValue={(mod) => mod.name}
                                        options={completionStatus}
                                        isSearchable={true}
                                        placeholder="Select Completion Status"
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            {id && <>
                                <Col lg={6}>
                                    <Form.Group controlId="contractualWorkValue" className="mb-3">
                                        <Form.Label>Contractual Work Value :</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="contractualWorkValue"
                                            value={subProject.contractualWorkValue}
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
                                            value={subProject.executorCompany}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col lg={6}>
                                    <Form.Group controlId="nextValueofWorkItemForTeam" className="mb-3">
                                        <Form.Label>Next Value Of Work Item For Team :</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="nextValueofWorkItemForTeam"
                                            value={subProject.nextValueofWorkItemForTeam}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col lg={6}>
                                    <Form.Group controlId="percentageofWorkDone" className="mb-3">
                                        <Form.Label>Percentage Of Work Done :</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="percentageofWorkDone"
                                            value={subProject.percentageofWorkDone}
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
                                            value={subProject.revisedContractualWorkValue}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>


                                <Col lg={6}>
                                    <Form.Group controlId="totalWorkDoneValueuptoPreviousMonth" className="mb-3">
                                        <Form.Label>Total Work Done Value Upto Previous Month:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="totalWorkDoneValueuptoPreviousMonth"
                                            value={subProject.totalWorkDoneValueuptoPreviousMonth}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col lg={6}>
                                    <Form.Group controlId="valueofWorkDoneinthisMonth" className="mb-3">
                                        <Form.Label>Value Of Work Done In This Month:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="valueofWorkDoneinthisMonth"
                                            value={subProject.valueofWorkDoneinthisMonth}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col lg={6}>
                                    <Form.Group controlId="valueofWorkDoneinthisFY" className="mb-3">
                                        <Form.Label>Value Of Work Done In This FY:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="valueofWorkDoneinthisFY"
                                            value={subProject.valueofWorkDoneinthisFY}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col lg={6}>
                                    <Form.Group controlId="contractualStartDate" className="mb-3">
                                        <Form.Label>Contractual Start Date:</Form.Label>
                                        <Flatpickr
                                            value={subProject.contractualStartDate}
                                            onChange={([date]) => setSubProject({
                                                ...subProject,
                                                contractualStartDate: date.toISOString()
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
                                        <Form.Label>Contractual Completion Date:</Form.Label>
                                        <Flatpickr
                                            value={subProject.contractualCompletionDate}
                                            onChange={([date]) => setSubProject({
                                                ...subProject,
                                                contractualCompletionDate: date.toISOString()
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
                                        <Form.Label>Expected Date Of Earliest Project Completion:</Form.Label>
                                        <Flatpickr
                                            value={subProject.expectedDateofEarliestProjectCompletion}
                                            onChange={([date]) => setSubProject({
                                                ...subProject,
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
                                        <Form.Label>Expected Date Of Latest Project Completion:</Form.Label>

                                        <Flatpickr
                                            value={subProject.expectedDateofLatestProjectCompletion}
                                            onChange={([date]) => setSubProject({
                                                ...subProject,
                                                expectedDateofLatestProjectCompletion: date.toISOString()
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
                                        <Form.Label>Refresh Work Date:</Form.Label>
                                        <Flatpickr
                                            value={subProject.refreshWorkDate}
                                            onChange={([date]) => setSubProject({
                                                ...subProject,
                                                refreshWorkDate: date.toISOString()
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
                                        <Form.Label>Estimate Completion Date:</Form.Label>
                                        <Flatpickr
                                            value={subProject.estimateCompletionDate}
                                            onChange={([date]) => setSubProject({
                                                ...subProject,
                                                estimateCompletionDate: date.toISOString()
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
                                        <Form.Label>Recorded Month:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="recordedMonth"
                                            value={subProject.recordedMonth}
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
                                            value={subProject.recordedYear}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>

                            </>}


                            <Col className='align-items-end d-flex justify-content-end mb-3'>

                                <div>
                                    <Link to={'/pages/ProjectMaster'}>
                                        <Button variant="primary" >
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update Sub Project' : 'Add Sub Project'}
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