

import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
import Select from 'react-select';


interface Designation {
    id: number;
    department: string;
    coreDesignation: string;
    specializedDesignation: string;
    processType: string;
    uploadJD: string;
    createdBy: string;
    updatedBy: string;
}



interface DepartmentList {
    id: string;
    departmentName: string;
}



const DepartmentMasterinsert = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [departmentList, setDepartmentList] = useState<DepartmentList[]>([]);
    const [empName, setEmpName] = useState<string | null>()
    const [designations, setDesignations] = useState<Designation>({
        id: 0,
        department: '',
        coreDesignation: '',
        specializedDesignation: '',
        processType: '',
        uploadJD: '',
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
            const response = await axios.get(`${config.API_URL_APPLICATION}/DesignationMaster/GetDesignation`, {
                params: { id: id }
            });
            if (response.data.isSuccess) {
                const fetchedModule = response.data.designations[0];
                setDesignations(fetchedModule);
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

        fetchData('CommonDropdown/GetDepartment', setDepartmentList, 'getDepartments');
    }, []);






    const handleChange = (e: ChangeEvent<any>) => {
        const { name, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setDesignations({
                ...designations,
                [name]: checked
            });
        } else {
            const value = (e.target as HTMLInputElement | HTMLSelectElement).value;
            setDesignations({
                ...designations,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const payload = {
            ...designations,
            createdBy: editMode ? designations.createdBy : empName,
            updatedBy: editMode ? empName : '',
        };
        console.log(payload)
        try {
            if (editMode) {
                await axios.post(`${config.API_URL_APPLICATION}/DesignationMaster/InsertorUpdateDesignation`, payload);
            } else {
                await axios.post(`${config.API_URL_APPLICATION}/DesignationMaster/InsertorUpdateDesignation`, payload);
            }
            navigate('/pages/DesignationMaster');
        } catch (error) {
            console.error('Error submitting module:', error);
        }
    };


    return (
        <div>
            <div className="container">
                <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center fs-20 rounded-3 border">
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit Designation' : 'Add Designation'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>




                            <Col lg={6}>
                                <Form.Group controlId="department" className="mb-3">
                                    <Form.Label>Department Name</Form.Label>
                                    <Select
                                        name="department"
                                        value={departmentList.find((mod) => mod.departmentName === designations.department)}
                                        onChange={(selectedOption) => {
                                            setDesignations({
                                                ...designations,
                                                department: selectedOption?.departmentName || '',
                                            });
                                        }}
                                        getOptionLabel={(mod) => mod.departmentName}
                                        getOptionValue={(mod) => mod.departmentName}
                                        options={departmentList}
                                        isSearchable={true}
                                        placeholder="Select Department Name"
                                        required
                                    />
                                </Form.Group>
                            </Col>


                            <Col lg={6}>
                                <Form.Group controlId="coreDesignation" className="mb-3">
                                    <Form.Label>Core Designation</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="coreDesignation"
                                        value={designations.coreDesignation}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter Core Designation<'
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="specializedDesignation" className="mb-3">
                                    <Form.Label>Specialized Designation</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="specializedDesignation"
                                        value={designations.specializedDesignation}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter Specialized Designation'
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="processType" className="mb-3">
                                    <Form.Label>Process Type</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="processType"
                                        value={designations.processType}
                                        onChange={handleChange}
                                        required
                                        placeholder=' Enter Source'
                                    />
                                </Form.Group>
                            </Col>

                        

                            <Col lg={6}>
                                <Form.Group controlId="uploadJD" className="mb-3">
                                    <Form.Label>UploadJD</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="uploadJD"
                                        value={designations.uploadJD}
                                        onChange={handleChange}
                                        required
                                        placeholder='Upload JD'
                                    />
                                </Form.Group>
                            </Col>
                          
                       


                            <Col className='align-items-end d-flex justify-content-between mb-3'>
                                <div>
                                    <span className='fs-5 '>All fields are required *</span>
                                </div>
                                <div>
                                    <Link to={'/pages/DesignationMaster'}>
                                        <Button variant="primary" >
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update Designation' : 'Add Designation'}
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


