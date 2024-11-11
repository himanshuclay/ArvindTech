import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
import CustomSuccessToast from '@/pages/other/Component/CustomSuccessToast';



interface FrequencyFill {
    id: number;
    name: string;
    createdBy: string;
    updatedBy: string;
}



const ProjectTypeInsert = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [empName, setEmpName] = useState<string | null>('')
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState('');
    const [projectTypes, setprojectTypes] = useState<FrequencyFill>({
        id: 0,
        name: '',
        createdBy: '',
        updatedBy: '',

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
            const response = await axios.get(`${config.API_URL_APPLICATION}/FillingFrequencyMaster/GetFillingFrequency`, {
                params: { id: id }
            });
            if (response.data.isSuccess) {
                const fetchedModule = response.data.fillingFrequencies[0];
                setprojectTypes(fetchedModule);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching module:', error);
        }
    };





    const handleChange = (e: ChangeEvent<any>) => {
        const { name, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setprojectTypes({
                ...projectTypes,
                [name]: checked
            });
        } else {
            const value = (e.target as HTMLInputElement | HTMLSelectElement).value;
            setprojectTypes({
                ...projectTypes,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const payload = {
            ...projectTypes,
            createdBy: editMode ? projectTypes.createdBy : empName,
            updatedBy: editMode ? empName : '',
        };
        console.log(payload)
        try {
            if (editMode) {
                await axios.post(`${config.API_URL_APPLICATION}/FillingFrequencyMaster/InsertorUpdateFillingFrequency`, payload);
                navigate('/pages/FillingFrequencyMaster', {
                    state: {
                        showToast: true,
                        toastMessage: "Project Type Updated successfully!",
                        toastVariant: "rgb(28 175 85)"
                    }
                });
            } else {
                await axios.post(`${config.API_URL_APPLICATION}/FillingFrequencyMaster/InsertorUpdateFillingFrequency`, payload);
                navigate('/pages/FillingFrequencyMaster', {
                    state: {
                        showToast: true,
                        toastMessage: "Project Type  Updated successfully!",
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
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit FillingFrequency' : 'Add FillingFrequency'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col lg={6}>
                                <Form.Group controlId="name" className="mb-3">
                                    <Form.Label>Filling Frequency:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={projectTypes.name}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter Project Type Name'
                                    />
                                </Form.Group>
                            </Col>
                            <Col className='align-items-end d-flex justify-content-between mb-3'>
                                <div>
                                    <span className='fs-5 '>This field is required*</span>
                                </div>
                                <div>
                                    <Link to={'/pages/FillingFrequencyMaster'}>
                                        <Button variant="primary" >
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update FillingFrequency' : 'Add FillingFrequency'}
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
            <CustomSuccessToast show={showToast} toastMessage={toastMessage} toastVariant={toastVariant} onClose={() => setShowToast(false)} />

        </div>
    );
};

export default ProjectTypeInsert;