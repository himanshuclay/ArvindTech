

import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_green.css';
import CustomSuccessToast from '@/pages/other/Component/CustomSuccessToast';



interface Requirement {
    id: number;
    entryDate: string;
    enteredBy: string;
    project: string;
    department: string;
    coreDesignation: string;
    specializedDesignation: string;
    source: string;
    count: number;
    typeOfAppointment: string;
    recruiter: string;
    uploadJD: string;
    noOfCandidateIDsInterviewed: 0;
    candidateIDsInterviewedWithNames: string;
    finalizedCandidateIDAndName: string;
    deployedCandidateIDAndName: string;
    dateOfJoining: string;
    transferEmployeeIDAndName: string;
    deployedTransferredEmployeeIDAndName: string;
    transferDate: string;
    statusOfEmployeeMasterUpdation: number;
    closureStatus: string;
    createdBy: string;
    updatedBy: string;
}



interface DepartmentList {
    id: string;
    departmentName: string;
}
interface ProjectList {
    id: number;
    projectName: string;
}


interface EmployeeList {
    empId: string;
    employeeName: string;
}

const RequirementMasterinsert = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [departmentList, setDepartmentList] = useState<DepartmentList[]>([]);
    const [employeeList, setEmployeeList] = useState<EmployeeList[]>([]);
    const [empName, setEmpName] = useState<string | null>()
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState('');
    const [projectList, setProjectList] = useState<ProjectList[]>([]);
    const [requirements, setRequirements] = useState<Requirement>({
        id: 0,
        entryDate: '',
        enteredBy: '',
        project: '',
        department: '',
        coreDesignation: '',
        specializedDesignation: '',
        source: '',
        count: 0,
        typeOfAppointment: '',
        recruiter: '',
        uploadJD: '',
        noOfCandidateIDsInterviewed: 0,
        candidateIDsInterviewedWithNames: '',
        finalizedCandidateIDAndName: '',
        deployedCandidateIDAndName: '',
        dateOfJoining: '',
        transferEmployeeIDAndName: '',
        deployedTransferredEmployeeIDAndName: '',
        transferDate: '',
        statusOfEmployeeMasterUpdation: 0,
        closureStatus: '',
        createdBy: '',
        updatedBy: ''
    });


    const [files, setFiles] = useState<File[]>([]);
    const [error, setError] = useState('');


    useEffect(() => {
        const storedEmpName = localStorage.getItem('EmpName');
        if (storedEmpName) {
            setEmpName(storedEmpName);
        }
    }, []);


    useEffect(() => {
        if (id) {
            setEditMode(true);
            fetchStaffRequirementsId(id);
        } else {
            setEditMode(false);
        }
    }, [id]);

    const fetchStaffRequirementsId = async (id: string) => {
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/StaffRequirementMaster/GetStaffRequirement`, {
                params: { id: id }
            });
            if (response.data.isSuccess) {
                const fetchedModule = response.data.staffRequirements[0];
                setRequirements(fetchedModule);
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

        fetchData('CommonDropdown/GetDepartment', setDepartmentList, 'getDepartments');
        fetchData('CommonDropdown/GetProjectList', setProjectList, 'projectListResponses');
        fetchData('CommonDropdown/GetEmployeeListWithId', setEmployeeList, 'employeeLists');
    }, []);






    const handleChange = (e: ChangeEvent<any>) => {
        const { name, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setRequirements({
                ...requirements,
                [name]: checked
            });
        } else {
            const value = (e.target as HTMLInputElement | HTMLSelectElement).value;
            setRequirements({
                ...requirements,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const payload = {
            ...requirements,
            createdBy: editMode ? requirements.createdBy : empName,
            updatedBy: editMode ? empName : '',
        };
        console.log(payload)

        try {
            if (editMode) {
                await axios.post(`${config.API_URL_APPLICATION}/StaffRequirementMaster/InsertorUpdateStaffRequirement`, payload);
                navigate('/pages/RequirementMaster', {
                    state: {
                        showToast: true,
                        toastMessage: "Staff Requirement Updated successfully!",
                        toastVariant: "rgb(28 175 85)"
                    }
                });
            } else {
                await axios.post(`${config.API_URL_APPLICATION}/StaffRequirementMaster/InsertorUpdateStaffRequirement`, payload);
                navigate('/pages/RequirementMaster', {
                    state: {
                        showToast: true,
                        toastMessage: "Staff Requirement Added successfully!",
                        toastVariant: "rgb(28 175 85)"
                    }
                });
            }


        } catch (error) {
            setToastMessage("Error Adding/Updating");
            setToastVariant("rgb(213 18 18)");
            setShowToast(true);
            console.error('Error submitting module:', error);
        }
    };


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(event.target.files || []);
        let newFiles: File[] = [];
        let errorMessage = '';

        // Validation for file count
        if (selectedFiles.length > 5) {
            errorMessage = 'You can only upload up to 5 files.';
        } else {
            // Validation for file size
            newFiles = selectedFiles.filter(file => {
                if (file.size > 10 * 1024 * 1024) {
                    errorMessage = 'Each file must be less than 10MB.';
                    return false;
                }
                return true;
            });
        }

        // Set error message or selected files
        if (errorMessage) {
            setError(errorMessage);
            setFiles([]);
        } else {
            setError('');
            setFiles(newFiles);
        }
    };


    return (
        <div>
            <div className="container">
                <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center fs-20 rounded-3 border">
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit Staff Requirement' : 'Add Staff Requirement'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>


                            <Col lg={6}>
                                <Form.Group controlId="entryDate" className="mb-3">
                                    <Form.Label>Entry Date</Form.Label>

                                    <Flatpickr
                                        value={requirements.entryDate}
                                        onChange={([date]) => setRequirements({
                                            ...requirements,
                                            entryDate: date.toISOString().split('T')[0] // Convert to ISO string
                                        })}
                                        options={{
                                            enableTime: false,
                                            dateFormat: "Y-m-d",
                                            time_24hr: false,
                                        }}
                                        placeholder="Select Entry Date"
                                        className="form-control"
                                        required
                                    />
                                </Form.Group>
                            </Col>


                            <Col lg={6}>
                                <Form.Group controlId="enteredBy" className="mb-3">
                                    <Form.Label>Entered By</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="enteredBy"
                                        value={requirements.enteredBy}
                                        onChange={handleChange}
                                        required
                                        placeholder='Fill EnteredBy'
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="project" className="mb-3">
                                    <Form.Label>Project Name</Form.Label>
                                    <Select
                                        name="project"
                                        value={projectList.find((mod) => mod.projectName === requirements.project)}
                                        onChange={(selectedOption) => {
                                            setRequirements({
                                                ...requirements,
                                                project: selectedOption?.projectName || '',
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
                                <Form.Group controlId="department" className="mb-3">
                                    <Form.Label>Department Name</Form.Label>
                                    <Select
                                        name="department"
                                        value={departmentList.find((mod) => mod.departmentName === requirements.department)}
                                        onChange={(selectedOption) => {
                                            setRequirements({
                                                ...requirements,
                                                department: selectedOption?.departmentName || '',
                                            });
                                        }}
                                        getOptionLabel={(mod) => mod.departmentName}
                                        getOptionValue={(mod) => mod.departmentName}
                                        options={departmentList}
                                        isSearchable={true}
                                        placeholder="Select Department Name"
                                        required
                                    />
                                </Form.Group>
                            </Col>


                            <Col lg={6}>
                                <Form.Group controlId="coreDesignation" className="mb-3">
                                    <Form.Label>Core Designation</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="coreDesignation"
                                        value={requirements.coreDesignation}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter Core Designation<'
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="specializedDesignation" className="mb-3">
                                    <Form.Label>Specialized Designation</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="specializedDesignation"
                                        value={requirements.specializedDesignation}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter Specialized Designation'
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="source" className="mb-3">
                                    <Form.Label>Source</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="source"
                                        value={requirements.source}
                                        onChange={handleChange}
                                        required
                                        placeholder=' Enter Source'
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="count" className="mb-3">
                                    <Form.Label>Count</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="count"
                                        value={requirements.count}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter Count'
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="typeOfAppointment" className="mb-3">
                                    <Form.Label>Type Of Appointment</Form.Label>
                                    <Select
                                        name="typeOfAppointment"
                                        value={{ value: requirements.typeOfAppointment, label: requirements.typeOfAppointment }}
                                        options={[
                                            { value: 'Full Time', label: 'Full Time' },
                                            { value: 'Part Time', label: 'Part Time' }
                                        ]}
                                        isSearchable={true}
                                        placeholder="Select Type Of Appointment"
                                        onChange={(selectedOption) => {
                                            setRequirements({
                                                ...requirements,
                                                typeOfAppointment: selectedOption?.value || '',
                                            });
                                        }}
                                        required
                                    />
                                </Form.Group>
                            </Col>



                            <Col lg={6}>
                                <Form.Group controlId="recruiter" className="mb-3">
                                    <Form.Label>Recruiter</Form.Label>
                                    <Select
                                        name="recruiter"
                                        value={employeeList.find((emp) => emp.employeeName === requirements.recruiter)}
                                        onChange={(selectedOption) => {
                                            setRequirements({
                                                ...requirements,
                                                recruiter: selectedOption?.employeeName || "",
                                            });
                                        }}
                                        getOptionLabel={(emp) => emp.employeeName}
                                        getOptionValue={(emp) => emp.employeeName}
                                        options={employeeList}
                                        isSearchable={true}
                                        placeholder="Select  Recruiter Name"
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="uploadJD" className="mb-3">
                                    <Form.Label>UploadJD</Form.Label>
                                    <div className='input-file-custom'>
                                        <label htmlFor="uploadJD" className="file-upload w-100">
                                            <div className='d-flex justify-content-between align-items-center'>
                                                <i className="ri-upload-cloud-2-line h1 text-muted m-0"></i>
                                                <div>
                                                    <h4>Drop files here or click to upload.</h4>
                                                    <span className='fs-13 text-muted'>(.jpeg, .jpg, .png, .pdf Note: You can only select up to 5 files, each up to 10MB.)</span>
                                                </div>
                                            </div>
                                        </label>
                                        <input
                                            id="uploadJD    "
                                            type="file"
                                            multiple
                                            onChange={handleFileChange}
                                            accept=".png,.jpeg,.jpg,.pdf"
                                            style={{ display: 'none' }}
                                        />
                                        {error && <p style={{ color: 'red' }}>{error}</p>}
                                        <ul>
                                            {files.map((file, index) => (
                                                <li key={index}>{file.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </Form.Group>
                            </Col>


                            <Col lg={6}>
                                <Form.Group controlId="noOfCandidateIDsInterviewed" className="mb-3">
                                    <Form.Label>No Of Candidate IDs Interviewed</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="noOfCandidateIDsInterviewed"
                                        value={requirements.noOfCandidateIDsInterviewed}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter No Of Candidate IDs Interviewed'
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="candidateIDsInterviewedWithNames" className="mb-3">
                                    <Form.Label>Candidate IDs Interviewed With Names</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="candidateIDsInterviewedWithNames"
                                        value={requirements.candidateIDsInterviewedWithNames}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter Candidate IDs Interviewed With Names'
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="finalizedCandidateIDAndName" className="mb-3">
                                    <Form.Label>Finalized Candidate ID And Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="finalizedCandidateIDAndName"
                                        value={requirements.finalizedCandidateIDAndName}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter Finalized Candidate ID And Name'
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="deployedCandidateIDAndName" className="mb-3">
                                    <Form.Label>Deployed Candidate ID And Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="deployedCandidateIDAndName"
                                        value={requirements.deployedCandidateIDAndName}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter Deployed Candidate ID And Name'
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="dateOfJoining" className="mb-3">
                                    <Form.Label>Date Of Joining</Form.Label>

                                    <Flatpickr
                                        value={requirements.dateOfJoining}
                                        onChange={([date]) => setRequirements({
                                            ...requirements,
                                            dateOfJoining: date.toISOString().split('T')[0] // Convert to ISO string
                                        })}
                                        options={{
                                            enableTime: false,
                                            dateFormat: "Y-m-d",
                                            time_24hr: false,
                                        }}
                                        placeholder="Select  Date Of Joining"
                                        className="form-control"
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="transferEmployeeIDAndName" className="mb-3">
                                    <Form.Label>Transfer Employee ID And Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="transferEmployeeIDAndName"
                                        value={requirements.transferEmployeeIDAndName}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter Transfer Employee ID And Name'
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="deployedTransferredEmployeeIDAndName" className="mb-3">
                                    <Form.Label>Deployed Transferred Employee ID And Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="deployedTransferredEmployeeIDAndName"
                                        value={requirements.deployedTransferredEmployeeIDAndName}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter Deployed Transferred Employee ID And Name'
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="transferDate" className="mb-3">
                                    <Form.Label>Transfer Date</Form.Label>
                                    <Flatpickr
                                        value={requirements.transferDate}
                                        onChange={([date]) => setRequirements({
                                            ...requirements,
                                            transferDate: date.toISOString().split('T')[0] // Convert to ISO string
                                        })}
                                        options={{
                                            enableTime: false,
                                            dateFormat: "Y-m-d ",
                                            time_24hr: false,
                                        }}
                                        placeholder="Select Transfer Date "
                                        className="form-control"
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="statusOfEmployeeMasterUpdation" className="mb-3">
                                    <Form.Label>Status Of Employee Master Updation</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="statusOfEmployeeMasterUpdation"
                                        value={requirements.statusOfEmployeeMasterUpdation}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter Status Of Employee Master Updation'
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="closureStatus" className="mb-3">
                                    <Form.Label>ClosureStatus</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="closureStatus"
                                        value={requirements.closureStatus}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter Closure Status'
                                    />
                                </Form.Group>
                            </Col>




                            <Col className='align-items-end d-flex justify-content-between mb-3'>
                                <div>
                                    <span className='fs-5 '>All fields are required*</span>
                                </div>
                                <div>
                                    <Link to={'/pages/RequirementMaster'}>
                                        <Button variant="primary" >
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update Staff Requirement' : 'Add Staff Requirement'}
                                    </Button>
                                </div>

                            </Col>

                        </Row>

                    </Form>
                </div>

            </div>
            <CustomSuccessToast
                show={showToast}
                toastMessage={toastMessage}
                toastVariant={toastVariant}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
};

export default RequirementMasterinsert;


