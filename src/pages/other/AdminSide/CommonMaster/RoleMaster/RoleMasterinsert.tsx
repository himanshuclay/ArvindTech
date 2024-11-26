import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
import CustomSuccessToast from '@/pages/other/Component/CustomSuccessToast';



interface Role {
    id: number;
    roleName: string;
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
        createdBy: '',
        updatedBy: '',

    });
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState<string>('');
    const [toastVariant, setToastVariant] = useState('');

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





    const handleChange = (e: ChangeEvent<any>) => {
        const { name, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setRoles({
                ...roles,
                [name]: checked
            });
        } else {
            const value = (e.target as HTMLInputElement | HTMLSelectElement).value;
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

    
        try {
            const apiUrl = `${config.API_URL_APPLICATION}/RoleMaster/${editMode ? 'UpdateRole' : 'InsertRole'}`;
            const response = await axios.post(apiUrl, payload);

            if (response.status === 200) {
                navigate('/pages/RoleMaster', {
                    state: {
                        showToast: true,
                        toastMessage: editMode ? "Module updated successfully!" : "Module added successfully!",
                        toastVariant: "rgb(28 175 85)",
                    },
                });
            } else {
                setToastMessage(response.data.message || "Failed to process request");
            }
        } catch (error: any) {
            setToastMessage(error);
            setToastVariant("rgb(213 18 18)");
            setShowToast(true);
            console.error('Error submitting module:', error);
        }
    };


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
                            <Col className='align-items-end d-flex justify-content-between mb-3'>
                                <div>
                                    <span className='fs-5 '>This field is required*</span>
                                </div>
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
            <CustomSuccessToast show={showToast} toastMessage={toastMessage} toastVariant={toastVariant} onClose={() => setShowToast(false)} />

        </div>
    );
};

export default EmployeeInsert;