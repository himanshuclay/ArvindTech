import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
import { toast } from 'react-toastify';
import Select from 'react-select';

interface Role {
    id: number;
    roleName: string;
    status: string;
    createdBy: string;
    updatedBy: string;
}



const EmployeeInsert = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [empName, setEmpName] = useState<string | null>('')
    const [roles, setRoles] = useState<Role>({
        id: 0,
        roleName: '',
        status: '',
        createdBy: '',
        updatedBy: '',

    });

    useEffect(() => {
        toast.dismiss();

        const storedEmpName = localStorage.getItem('EmpName');
        const storedEmpID = localStorage.getItem('EmpId');
        if (storedEmpName || storedEmpID) {
            setEmpName(`${storedEmpName} - ${storedEmpID}`);
        }
    }, []);


    console.log(empName)

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
            const response = await axios.get(`${config.API_URL_APPLICATION}/RoleMaster/GetRole`, {
                params: { id: id }
            });
            if (response.data.isSuccess) {
                const fetchedModule = response.data.roleMasterListResponses[0];
                setRoles(fetchedModule);
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
                setRoles({
                    ...roles,
                    [eventName]: checked
                });
            } else {
                const inputValue = (e.target as HTMLInputElement | HTMLSelectElement).value;
                setRoles({
                    ...roles,
                    [eventName]: inputValue
                });
            }
        } else if (name) {
            setRoles({
                ...roles,
                [name]: value
            });
        }
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const payload = {
            ...roles,
            createdBy: editMode ? roles.createdBy : empName,
            updatedBy: editMode ? empName : '',
        };
        console.log(payload)

        try {
            const apiUrl = `${config.API_URL_APPLICATION}/RoleMaster/${editMode ? 'UpdateRole' : 'InsertRole'}`;
            const response = await axios.post(apiUrl, payload);

            if (response.status === 200) {
                navigate('/pages/RoleMaster', {
                    state: {
                        successMessage: editMode ? `Record updated successfully!` : `Record  added successfully!`,
                    },
                });
            } else {
                toast.error(response.data.message || "Failed to process request");
            }
        } catch (error: any) {
            toast.dismiss()
            toast.error(error);
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
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit Role' : 'Add Role'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col lg={6}>
                                <Form.Group controlId="roleName" className="mb-3">
                                    <Form.Label>Role Name:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="roleName"
                                        value={roles.roleName}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter Role Name'
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="status" className="mb-3">
                                    <Form.Label>Status *</Form.Label>
                                    <Select
                                        name="status"
                                        options={optionsAppAccess}
                                        value={optionsAppAccess.find(option => option.value === roles.status)}
                                        onChange={selectedOption => handleChange(null, 'status', selectedOption?.value)}
                                        placeholder="Select Status"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col className='align-items-end d-flex justify-content-end mb-3'>

                                <div>
                                    <Link to={'/pages/RoleMaster'}>
                                        <Button variant="primary" >
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update Role' : 'Add Role'}
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

export default EmployeeInsert;