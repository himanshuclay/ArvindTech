import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
import { toast } from 'react-toastify';

interface ContactMaster {
    contactID: number;
    contactName: string;
    contactMobileOfficial: string;
    contactMobilePersonal: string;
    contactEmailOfficial: string;
    contactEmailPersonal: string;
    createdBy: string;
    updatedBy: string;
    updatedDate: string;
    createdDate: string;
}


const AddressMasterinsert = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [empName, setEmpName] = useState<string | null>()
    const [contact, setContact] = useState<ContactMaster>({
        contactID: 0,
        contactName: '',
        contactMobileOfficial: '',
        contactMobilePersonal: '',
        contactEmailOfficial: '',
        contactEmailPersonal: '',
        createdBy: '',
        updatedBy: '',
        createdDate: '',
        updatedDate: ''
    });



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
            fetchStaffRequirementsId(id);
        } else {
            setEditMode(false);
        }
    }, [id]);

    const fetchStaffRequirementsId = async (id: string) => {
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/ContactMaster/GetContact`, {
                params: { id: id }
            });
            if (response.data.isSuccess) {
                const fetchedModule = response.data.getContactMasters[0];
                setContact(fetchedModule);
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
                setContact({
                    ...contact,
                    [eventName]: checked
                });
            } else {
                const inputValue = (e.target as HTMLInputElement | HTMLSelectElement).value;

                setContact({
                    ...contact,
                    [eventName]: inputValue
                });
            }
        } else if (name) {
            setContact({
                ...contact,
                [name]: value
            });
        }
    };




    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        toast.dismiss()

        const payload = {
            ...contact,
            createdBy: editMode ? contact.createdBy : empName,
            updatedBy: editMode ? empName : '',
        };
        console.log(payload)
        try {
            if (editMode) {
                await axios.post(`${config.API_URL_APPLICATION}/ContactMaster/InsertUpdateContact`, payload);
                navigate('/pages/ContactMaster', {
                    state: {
                        successMessage: "Contact Updated successfully!",
                    }
                });
            } else {
                await axios.post(`${config.API_URL_APPLICATION}/ContactMaster/InsertUpdateContact`, payload);
                navigate('/pages/ContactMaster', {
                    state: {
                        successMessage: "Contact Updated successfully!",
                    }
                });
            }
        } catch (error: any) {
            toast.error(error || "Error Adding/Updating");
            console.error('Error submitting module:', error);
        }
    };





    return (
        <div>
            <div className="container">
                <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center fs-20 rounded-3 border">
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit ' : 'Add '} Contact</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col lg={6}>
                                <Form.Group controlId="contactName" className="mb-3">
                                    <Form.Label>Contact Name *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="contactName"
                                        value={contact.contactName}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter Contact Name'
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="contactMobileOfficial" className="mb-3">
                                    <Form.Label>Official Mobile *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="contactMobileOfficial"
                                        value={contact.contactMobileOfficial}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter Official Mobile Number'
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="contactMobilePersonal" className="mb-3">
                                    <Form.Label>Personal Mobile</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="contactMobilePersonal"
                                        value={contact.contactMobilePersonal}
                                        onChange={handleChange}
                                        placeholder='Enter Personal Mobile Number'
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="contactEmailOfficial" className="mb-3">
                                    <Form.Label>Official Email *</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="contactEmailOfficial"
                                        value={contact.contactEmailOfficial}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter Official Email'
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="contactEmailPersonal" className="mb-3">
                                    <Form.Label>Personal Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="contactEmailPersonal"
                                        value={contact.contactEmailPersonal}
                                        onChange={handleChange}
                                        placeholder='Enter Personal Email'
                                    />
                                </Form.Group>
                            </Col>

                            <Col></Col>
                            <Col className='align-items-end d-flex justify-content-end mb-3'>
                                <div>
                                    <Link to={'/pages/ContactMaster'}>
                                        <Button variant="primary">
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update Contact' : 'Add Contact'}
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

export default AddressMasterinsert;


