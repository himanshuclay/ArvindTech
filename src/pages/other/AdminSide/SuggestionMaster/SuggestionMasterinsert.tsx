import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
import { toast } from 'react-toastify';

interface Suggestion {
    id: number;
    doerID: string;
    doerName: string;
    suggestion: string;
    createdBy: string;
    updatedBy: string;
    createdDate?: string;
    updatedDate?: string;
}

const SuggestionMasterInsert = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [empName, setEmpName] = useState<string | null>('');
    const [suggestionData, setSuggestionData] = useState<Suggestion>({
        id: 0,
        doerID: '',
        doerName: '',
        suggestion: '',
        createdBy: '',
        updatedBy: '',
    });

    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

    const storedEmpName = localStorage.getItem('EmpName');
    const storedEmpID = localStorage.getItem('EmpId');
    useEffect(() => {
        toast.dismiss();


        if (storedEmpName || storedEmpID) {
            setEmpName(`${storedEmpName} - ${storedEmpID}`);
        }
    }, []);

    useEffect(() => {
        if (id) {
            setEditMode(true);
            fetchSuggestionById(id);
        } else {
            setEditMode(false);
        }
    }, [id]);

    const fetchSuggestionById = async (id: string) => {
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/SuggestionMaster/GetSuggestionMaster`, {
                params: { id: id }
            });

            if (response.data.isSuccess) {
                const fetchedSuggestion = response.data.suggestionMasterResponses[0];
                setSuggestionData({
                    ...fetchedSuggestion,
                    updatedDate: new Date().toISOString()
                });
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching suggestion:', error);
        }
    };

    const handleChange = (e: ChangeEvent<any> | null, name?: string, value?: any) => {
        if (e) {
            const { name: eventName } = e.target;
            const inputValue = (e.target as HTMLInputElement | HTMLSelectElement).value;

            setSuggestionData({
                ...suggestionData,
                [eventName]: inputValue
            });
        } else if (name) {
            setSuggestionData({
                ...suggestionData,
                [name]: value
            });
        }
    };

    const validateFields = (): boolean => {
        const errors: { [key: string]: string } = {};
        if (!suggestionData.suggestion) { errors.suggestion = 'Suggestion is required'; }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateFields()) {
            toast.dismiss();
            toast.error('Please fill in all required fields.');
            return;
        }

        const payload = {
            ...suggestionData,
            doerID: storedEmpID,
            doerName: storedEmpName,
            createdBy: editMode ? suggestionData.createdBy : empName,
            updatedBy: empName,
        };

        console.log(payload);

        try {
            const apiUrl = `${config.API_URL_APPLICATION1}/SuggestionMaster/${editMode ? 'UpdateSuggestionMaster' : 'CreateSuggestionMaster'}`;
            const response = await axios.post(apiUrl, payload);

            if (response.status === 200) {
                navigate('/', {
                    state: {
                        successMessage: editMode ? `Suggestion updated successfully!` : `Suggestion added successfully!`,
                    },
                });
            } else {
                toast.error(response.data.message || "Failed to process request");
            }
        } catch (error: any) {
            toast.dismiss();
            toast.error(error.message || 'Error processing request');
            console.error('Error submitting suggestion:', error);
        }
    };

    return (
        <div>
            <div className="container">
                <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center fs-20 rounded-3 border">
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit Suggestion' : 'Add Suggestion'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col lg={12}>
                                <Form.Group controlId="suggestion" className="mb-3">
                                    <Form.Label>Suggestion <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        name="suggestion"
                                        value={suggestionData.suggestion}
                                        onChange={handleChange}
                                        placeholder='Describe Your Suggestion'
                                        className={validationErrors.suggestion ? "input-border" : ""}
                                    />
                                    {validationErrors.suggestion && (
                                        <small className="text-danger">{validationErrors.suggestion}</small>
                                    )}
                                </Form.Group>
                            </Col>

                            <Col className='align-items-end d-flex justify-content-end mb-3'>
                                <div>
                                    <Link to={'/pages/SuggestionMaster'}>
                                        <Button variant="primary">Back</Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update Suggestion' : 'Add Suggestion'}
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

export default SuggestionMasterInsert;
