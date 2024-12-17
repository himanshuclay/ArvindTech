import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
import Select from 'react-select';
import { toast } from 'react-toastify';



interface Department {
    id: number;
    departmentName: string;
    status: string;
    createdBy: string;
    updatedBy: string;
}

const DepartmentMasterinsert = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [empName, setEmpName] = useState<string | null>()
    const [departments, setDepartments] = useState<Department>({
        id: 0,
        departmentName: '',
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
            fetchStaffRequirementsId(id);
        } else {
            setEditMode(false);
        }
    }, [id]);

    const fetchStaffRequirementsId = async (id: string) => {
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/DepartmentMaster/GetDepartment`, {
                params: { id: id }
            });
            if (response.data.isSuccess) {
                const fetchedModule = response.data.departments[0];
                setDepartments(fetchedModule);
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
                setDepartments({
                    ...departments,
                    [eventName]: checked
                });
            } else {
                const inputValue = (e.target as HTMLInputElement | HTMLSelectElement).value;
                setDepartments({
                    ...departments,
                    [eventName]: inputValue
                });
            }
        } else if (name) {
            setDepartments({
                ...departments,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const payload = {
            ...departments,
            createdBy: editMode ? departments.createdBy : empName,
            updatedBy: editMode ? empName : '',
        };
        console.log(payload)
        try {
            const apiUrl = `${config.API_URL_APPLICATION}/DepartmentMaster/${editMode ? 'InsertorUpdateDepartment' : 'InsertorUpdateDepartment'}`;
            const response = await axios.post(apiUrl, payload);
            if (response.status === 200) {
                navigate('/pages/ProjectMaster', {
                    state: {
                        successMessage: editMode ? "Deparment Updated successfully!" : "Deparment Added successfully!",
                    },
                });
            } else {
                toast.error(response.data.message || "Failed to process request")
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
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit Department' : 'Add Department'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col lg={6}>
                                <Form.Group controlId="departmentName" className="mb-3">
                                    <Form.Label>Department Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="departmentName"
                                        value={departments.departmentName}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter Core Designation'
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="status" className="mb-3">
                                    <Form.Label>Status *</Form.Label>
                                    <Select
                                        name="status"
                                        options={optionsAppAccess}
                                        value={optionsAppAccess.find(option => option.value === departments.status)}
                                        onChange={selectedOption => handleChange(null, 'status', selectedOption?.value)}
                                        placeholder="Select Status"
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col></Col>
                            <Col className='align-items-end d-flex justify-content-end mb-3'>
                                <div>
                                    <Link to={'/pages/DepartmentMaster'}>
                                        <Button variant="primary" >
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update Department' : 'Add Department'}
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

export default DepartmentMasterinsert;


