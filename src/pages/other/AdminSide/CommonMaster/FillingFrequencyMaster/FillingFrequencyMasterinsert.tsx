import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
import Select from 'react-select';
import { toast } from 'react-toastify';



interface FrequencyFill {
    id: number;
    name: string;
    status: string;
    createdBy: string;
    updatedBy: string;
}



const ProjectTypeInsert = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [empName, setEmpName] = useState<string | null>('')
    const [projectTypes, setprojectTypes] = useState<FrequencyFill>({
        id: 0,
        name: '',
        status: '',
        createdBy: '',
        updatedBy: '',

    });
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        toast.dismiss();

        const storedEmpName = localStorage.getItem('EmpName');
        const storedEmpID = localStorage.getItem('EmpId');
        if (storedEmpName || storedEmpID) {
            setEmpName(`${storedEmpName} - ${storedEmpID}`);
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


    const handleChange = (e: ChangeEvent<any> | null, name?: string, value?: any) => {
        if (e) {
            const { name: eventName, type } = e.target;

            if (type === 'checkbox') {
                const checked = (e.target as HTMLInputElement).checked;
                setprojectTypes({
                    ...projectTypes,
                    [eventName]: checked
                });
            } else {
                const inputValue = (e.target as HTMLInputElement | HTMLSelectElement).value;
                setprojectTypes({
                    ...projectTypes,
                    [eventName]: inputValue
                });
            }
        } else if (name) {
            setprojectTypes({
                ...projectTypes,
                [name]: value
            });
        }
    };

    const validateFields = (): boolean => {
        const errors: { [key: string]: string } = {};

        if (!projectTypes.name) { errors.name = 'Filling Frequency Name is required'; }
        if (!projectTypes.status) { errors.status = 'Status is required'; }

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
                        successMessage: "Project Type Updated successfully!",
                    }
                });
            } else {
                await axios.post(`${config.API_URL_APPLICATION}/FillingFrequencyMaster/InsertorUpdateFillingFrequency`, payload);
                navigate('/pages/FillingFrequencyMaster', {
                    state: {
                        successMessage: "Project Type  Updated successfully!",
                    }
                });
            }
        } catch (error: any) {
            toast.dismiss()
            toast.error(error)
            console.error('Error submitting module:', error);
        }
    };

    const optionsAppAccess = [
        { value: 'Enabled', label: 'Enabled' },
        { value: 'Disabled', label: 'Disabled' }
    ];


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

                                        placeholder='Enter Project Type Name'
                                        className={validationErrors.name ? " input-border" : "  "}
                                    />
                                    {validationErrors.name && (
                                        <small className="text-danger">{validationErrors.name}</small>
                                    )}
                                </Form.Group>
                            </Col>


                            <Col lg={6}>
                                <Form.Group controlId="status" className="mb-3">
                                    <Form.Label>Status *</Form.Label>
                                    <Select
                                        name="status"
                                        options={optionsAppAccess}
                                        value={optionsAppAccess.find(option => option.value === projectTypes.status)}
                                        onChange={selectedOption => handleChange(null, 'status', selectedOption?.value)}
                                        placeholder="Select Status"
                                        className={validationErrors.status ? " input-border" : "  "}
                                    />
                                    {validationErrors.status && (
                                        <small className="text-danger">{validationErrors.status}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col className='align-items-end d-flex justify-content-end mb-3'>

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
        </div>
    );
};

export default ProjectTypeInsert;