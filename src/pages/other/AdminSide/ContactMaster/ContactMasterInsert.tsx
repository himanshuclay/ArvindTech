import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
import { toast } from 'react-toastify';

interface Contact {
    contactID: number;
    contactName: string;
    contactMobileOfficial: string;
    contactMobilePersonal: string;
    contactEmailOfficial: string;
    contactEmailPersonal: string;
    createdBy: string;
    updatedBy: string;
}

const ContactMasterInsert = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [contact, setContact] = useState<Contact>({
        contactID: 0,
        contactName: '',
        contactMobileOfficial: '',
        contactMobilePersonal: '',
        contactEmailOfficial: '',
        contactEmailPersonal: '',
        createdBy: '',
        updatedBy: ''
    });

    useEffect(() => {
        if (id) {
            setEditMode(true);
            fetchContactById(id);
        } else {
            setEditMode(false);
        }
    }, [id]);

    const fetchContactById = async (contactID: string) => {
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/ContactMaster/GetContact`, {
                params: { ContactID: contactID }
            });
            if (response.data.isSuccess) {
                setContact(response.data.getContactMasters[0]);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching contact:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setContact({ ...contact, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const payload = {
                ...contact,
                createdBy: editMode ? contact.createdBy : 'Admin',
                updatedBy: editMode ? 'Admin' : ''
            };

            if (editMode) {
                await axios.post(`${config.API_URL_APPLICATION}/ContactMaster/InsertUpdateContact`, payload);
                navigate('/pages/ContactMaster', { state: { successMessage: "Contact Updated Successfully!" } });
            } else {
                await axios.post(`${config.API_URL_APPLICATION}/ContactMaster/InsertUpdateContact`, payload);
                navigate('/pages/ContactMaster', { state: { successMessage: "Contact Added Successfully!" } });
            }
        } catch (error) {
            toast.error('Error submitting form');
            console.error('Error submitting contact:', error);
        }
    };

    return (
        <div className="container">
            <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center">
                <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit Contact' : 'Add Contact'}</span></span>
            </div>
            <div className='bg-white p-2 rounded-3 border'>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col lg={6}>
                            <Form.Group controlId="contactName" className="mb-2">
                                <Form.Label>Contact Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="contactName"
                                    value={contact.contactName}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col lg={6}>
                            <Form.Group controlId="contactMobileOfficial" className="mb-2">
                                <Form.Label>Official Mobile</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="contactMobileOfficial"
                                    value={contact.contactMobileOfficial}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col lg={6}>
                            <Form.Group controlId="contactEmailOfficial" className="mb-2">
                                <Form.Label>Official Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="contactEmailOfficial"
                                    value={contact.contactEmailOfficial}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col className='d-flex justify-content-end mt-3'>
                            <Link to={'/pages/ContactMaster'}>
                                <Button variant="secondary" className="me-2">Back</Button>
                            </Link>
                            <Button variant="primary" type="submit">{editMode ? 'Update Contact' : 'Add Contact'}</Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        </div>
    );
};

export default ContactMasterInsert;
