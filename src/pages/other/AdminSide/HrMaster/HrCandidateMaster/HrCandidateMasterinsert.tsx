import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row, ButtonGroup } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
import Select from 'react-select';
import CustomSuccessToast from '@/pages/other/Component/CustomSuccessToast';



interface HrCandidate {
    id: number;
    candidateID: string;
    name: string;
    mobileNumber: string;
    resume: string;
    timesInterviewed: number;
    timesFinalized: number;
    status: string;
    createdBy: string;
    updatedBy: string;
}

interface Status {
    id: number;
    name: string;
}


const HrInputMasterinsert = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState('');
    const [editMode, setEditMode] = useState<boolean>(false);
    const [empName, setEmpName] = useState<string | null>('')
    const [status, setStatus] = useState<Status[]>([]);
    const [hrCandidates, setHrCandidates] = useState<HrCandidate>({
        id: 0,
        candidateID: '',
        name: '',
        mobileNumber: '',
        resume: '',
        timesInterviewed: 0,
        timesFinalized: 0,
        status: '',
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
            fetchModuleById(id);
        } else {
            setEditMode(false);
        }
    }, [id]);

    const fetchModuleById = async (id: string) => {
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/CandidateMaster/GetCandidate`, {
                params: { id: id }
            });
            if (response.data.isSuccess) {
                const fetchedModule = response.data.candidates[0];
                setHrCandidates(fetchedModule);
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

        fetchData('CommonDropdown/GetStatus', setStatus, 'statusListResponses');
    }, []);


    // Handle form field changes
    const handleChange = (e: ChangeEvent<any>) => {
        const { name, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setHrCandidates({
                ...hrCandidates,
                [name]: checked
            });
        } else {
            const value = (e.target as HTMLInputElement | HTMLSelectElement).value;
            setHrCandidates({
                ...hrCandidates,
                [name]: value
            });
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        const payload = {
            ...hrCandidates,
            createdBy: editMode ? hrCandidates.createdBy : empName,
            updatedBy: editMode ? empName : '',
        };
        // console.log(payload)
        e.preventDefault();
        try {
            if (editMode) {
                await axios.post(`${config.API_URL_APPLICATION}/CandidateMaster/InsertorUpdateCandidate`, payload);
                navigate('/pages/HrCandidateMaster', {
                    state: {
                        showToast: true,
                        toastMessage: "HrResume Updated successfully!",
                        toastVariant: "rgb(28 175 85)"
                    }
                });
            } else {
                await axios.post(`${config.API_URL_APPLICATION}/CandidateMaster/InsertorUpdateCandidate`, payload);
                navigate('/pages/HrCandidateMaster', {
                    state: {
                        showToast: true,
                        toastMessage: "HrResume Added successfully!",
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


    return (
        <div>
            <div className="container">
                <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center fs-20 rounded-3 border">
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit Hr Candidate' : 'Add Hr Candidate'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>




                            <Col lg={6}>
                                <Form.Group controlId="candidateID" className="mb-3">
                                    <Form.Label>Candidate ID</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="candidateID"
                                        value={hrCandidates.candidateID}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter Candidate ID '
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="name" className="mb-3">
                                    <Form.Label>Candidate Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={hrCandidates.name}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter  Name '
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="mobileNumber" className="mb-3">
                                    <Form.Label>Mobile Number</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="mobileNumber"
                                        value={hrCandidates.mobileNumber}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter Mobile Number'

                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="resume" className="mb-3">
                                    <Form.Label>Resume</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="resume"
                                        value={hrCandidates.resume}
                                        onChange={handleChange}
                                        // required
                                        placeholder='Enter Resume'

                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="timesInterviewed" className="mb-3">
                                    <Form.Label>Times Interviewed</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="timesInterviewed"
                                        value={hrCandidates.timesInterviewed}
                                        onChange={handleChange}
                                        placeholder='Enter Times Interviewed'
                                    />
                                </Form.Group>
                            </Col>


                            <Col lg={6}>
                                <Form.Group controlId="timesFinalized" className="mb-3">
                                    <Form.Label>Times Interviewed</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="timesFinalized"
                                        value={hrCandidates.timesFinalized}
                                        onChange={handleChange}
                                        placeholder='Enter Times Finalized'
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="taskID" className="mb-3">
                                    <Form.Label>Task Number</Form.Label>
                                    <Select
                                        name="taskID"
                                        value={status.find((mod) => mod.name === hrCandidates.status)}
                                        onChange={(selectedOption) => {
                                            setHrCandidates({
                                                ...hrCandidates,
                                                status: selectedOption?.name || '',
                                            });
                                        }}
                                        getOptionLabel={(mod) => mod.name}
                                        getOptionValue={(mod) => mod.name}
                                        options={status}
                                        isSearchable={true}
                                        placeholder="Select Task Number"
                                        required
                                    />
                                </Form.Group>
                            </Col>



                            <Col></Col>
                            <Col lg={3} className='align-items-end d-flex justify-content-end mb-3'>
                                <ButtonGroup aria-label="Basic example" className='w-100'>
                                    <Link to={'/pages/HrCandidateMaster'} className="btn btn-primary">
                                        Back
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update Hr Candidate' : 'Add Hr Candidate'}
                                    </Button>
                                </ButtonGroup>
                            </Col>

                        </Row>

                    </Form>
                </div>
            </div>
            <CustomSuccessToast show={showToast} toastMessage={toastMessage} toastVariant={toastVariant} onClose={() => setShowToast(false)} />

        </div >
    );
};

export default HrInputMasterinsert;