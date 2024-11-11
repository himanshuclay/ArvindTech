import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row, ButtonGroup } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
import CustomSuccessToast from '@/pages/other/Component/CustomSuccessToast';

interface HrResume {
    id: number;
    candidateName: string;
    mobileNumber: string;
    emailID: string;
    uploadResume: string;
    createdBy: string;
    updatedBy: string;
}


const HrInputMasterinsert = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState('');
    const [editMode, setEditMode] = useState<boolean>(false);
    const [empName, setEmpName] = useState<string | null>('')
    const [hrResumes, setHrResumes] = useState<HrResume>({
        id: 0,
        candidateName: '',
        mobileNumber: '',
        emailID: '',
        uploadResume: '',
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
            const response = await axios.get(`${config.API_URL_APPLICATION}/ResumeMaster/GetResume`, {
                params: { id: id }
            });
            if (response.data.isSuccess) {
                const fetchedModule = response.data.resumes[0];
                setHrResumes(fetchedModule);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching module:', error);
        }
    };




    // Handle form field changes
    const handleChange = (e: ChangeEvent<any>) => {
        const { name, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setHrResumes({
                ...hrResumes,
                [name]: checked
            });
        } else {
            const value = (e.target as HTMLInputElement | HTMLSelectElement).value;
            setHrResumes({
                ...hrResumes,
                [name]: value
            });
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        const payload = {
            ...hrResumes,
            createdBy: editMode ? hrResumes.createdBy : empName,
            updatedBy: editMode ? empName : '',
        };
        console.log(payload)
        e.preventDefault();
        try {
            if (editMode) {
                await axios.post(`${config.API_URL_APPLICATION}/ResumeMaster/InsertorUpdateResume`, payload);
                navigate('/pages/HrResumeMaster', { state: { 
                    showToast: true,
                    toastMessage:"HrResume Updated successfully!",
                    toastVariant:"rgb(28 175 85)"
                   } });
            } else {
                await axios.post(`${config.API_URL_APPLICATION}/ResumeMaster/InsertorUpdateResume`, payload);
                navigate('/pages/HrResumeMaster', { state: { 
                    showToast: true,
                    toastMessage:"HrResume Added successfully!",
                    toastVariant:"rgb(28 175 85)"
                   } });
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
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit Hr Resume' : 'Add Hr Resume'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            
                        

                          
                            <Col lg={6}>
                                <Form.Group controlId="candidateName" className="mb-3">
                                    <Form.Label>Candidate Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="candidateName"
                                        value={hrResumes.candidateName}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter Candidate Name '
                                    />
                                </Form.Group>
                            </Col>
                            
                            <Col lg={6}>
                                <Form.Group controlId="mobileNumber" className="mb-3">
                                    <Form.Label>Mobile Number</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="mobileNumber"
                                        value={hrResumes.mobileNumber}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter Mobile Number'

                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="emailID" className="mb-3">
                                    <Form.Label>Email ID</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="emailID"
                                        value={hrResumes.emailID}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter Email ID'

                                    />
                                </Form.Group>
                            </Col>
                           
                            <Col lg={6}>
                                <Form.Group controlId="uploadResume" className="mb-3">
                                    <Form.Label>Upload Resume</Form.Label>
                                    <Form.Control
                                        type="file"
                                        name="uploadResume"
                                        value={hrResumes.uploadResume}
                                        onChange={handleChange}
                                        placeholder='Enter upload Resume'
                                    />
                                </Form.Group>
                            </Col>
                           
                         
                          

                            <Col></Col>
                            <Col lg={3} className='align-items-end d-flex justify-content-end mb-3'>
                                <ButtonGroup aria-label="Basic example" className='w-100'>
                                    <Link to={'/pages/HrResumeMaster'} className="btn btn-primary">
                                        Back
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update Hr Resume' : 'Add Hr Resume'}
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