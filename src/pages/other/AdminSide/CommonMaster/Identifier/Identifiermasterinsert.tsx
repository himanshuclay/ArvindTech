import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
import Select from 'react-select';
import CustomSuccessToast from '@/pages/other/Component/CustomSuccessToast';



interface Identifier {
    id: number;
    identifierName: string;
    identifierValue: string;
    selectmaster: string;
    source: string;
    createdBy: string;
    updatedBy: string;
}

interface ProjectList {
    projectName: string;

}



const EmployeeInsert = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [empName, setEmpName] = useState<string | null>('')
    const [projectList, setProjectList] = useState<ProjectList[]>([])
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState('');
    const [identifiers, setIdentifiers] = useState<Identifier>({
        id: 0,
        identifierName: '',
        identifierValue: '',
        source: '',
        selectmaster: '',
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
            const response = await axios.get(`${config.API_URL_APPLICATION}/IdentifierMaster/GetIdentifier`, {
                params: { id: id }
            });
            if (response.data.isSuccess) {
                const fetchedModule = response.data.identifierLists[0];
                setIdentifiers(fetchedModule);
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

        fetchData('CommonDropdown/GetProjectList', setProjectList, 'projectListResponses');
    }, []);




    const handleChange = (e: ChangeEvent<any> | null, name?: string, value?: any) => {
        if (e) {
            const { name: eventName, type } = e.target;

            if (type === 'checkbox') {
                const checked = (e.target as HTMLInputElement).checked;
                setIdentifiers({
                    ...identifiers,
                    [eventName]: checked
                });
            } else {
                const inputValue = (e.target as HTMLInputElement | HTMLSelectElement).value;
                setIdentifiers({
                    ...identifiers,
                    [eventName]: inputValue
                });
            }
        } else if (name) {
            setIdentifiers({
                ...identifiers,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const payload = {
            ...identifiers,
            createdBy: editMode ? identifiers.createdBy : empName,
            updatedBy: editMode ? empName : '',
        };
        console.log(payload)

        try {
            await axios.post(`${config.API_URL_APPLICATION}/IdentifierMaster/InsertUpdateIdentifier`, payload);
            navigate('/pages/IdentifierMaster', {
                state: {
                    showToast: true,
                    toastMessage: editMode ? 'Identifier Updated Successfully! ' : 'Identifier Added Successfully!',
                    toastVariant: "rgb(28 175 85)"
                }
            });
        } catch (error: any) {
            setToastMessage(error || "Error Adding/Updating");
            setToastVariant("rgb(213 18 18)");
            setShowToast(true);
            console.error('Error submitting module:', error);
        }
    };


    const options = [
        { value: 'Master', label: 'Master' },
        { value: 'Manual Creation', label: 'Manual Creation' }
    ];
    const optionsValue = [
        { value: 'Project Master', label: 'Project Master' },
        { value: 'SubProject Master', label: 'SubProject Master' }
    ];

    return (
        <div>
            <div className="container">
                <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center fs-20 rounded-3 border">
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit Identifier' : 'Add Identifier'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>



                            <Col lg={6}>
                                <Form.Group controlId="identifierName" className="mb-3">
                                    <Form.Label>Identifier Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="identifierName"
                                        value={identifiers.identifierName}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter identifier name'
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="source" className="mb-3">
                                    <Form.Label>Source</Form.Label>
                                    <Select
                                        name="source"
                                        options={options}
                                        value={options.find(option => option.value === identifiers.source)}
                                        onChange={selectedOption => handleChange(null, 'source', selectedOption?.value)}
                                        placeholder="Source Type"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            {identifiers.source === "Manual Creation" ?
                                <Col lg={6}>
                                    <Form.Group controlId="identifierValue" className="mb-3">
                                        <Form.Label>Identifier Value</Form.Label>

                                        <Form.Control
                                            type="text"
                                            name="identifierValue"
                                            value={identifiers.identifierValue}
                                            onChange={handleChange}
                                            required
                                            placeholder='Enter identifier name'
                                        />
                                    </Form.Group>
                                </Col>
                                :
                                <Col lg={6}>
                                    <Form.Group controlId="selectmaster" className="mb-3">
                                        <Form.Label>Identifier Value</Form.Label>
                                        <Select
                                            name="selectmaster"
                                            value={optionsValue.find((mod) => mod.label === identifiers.selectmaster)}
                                            onChange={(selectedOption) => {
                                                setIdentifiers({
                                                    ...identifiers,
                                                    selectmaster: selectedOption?.label || '',
                                                });
                                            }}
                                            getOptionLabel={(mod) => mod.label}
                                            getOptionValue={(mod) => mod.value}
                                            options={optionsValue}
                                            isSearchable={true}
                                            placeholder="Select Identifier Value"
                                            required
                                        />

                                    </Form.Group>
                                </Col>
                            }


                            { identifiers.source === "Master" ? (identifiers.selectmaster === 'Project Master' ?

                                <Col lg={6}>
                                    <Form.Group controlId="identifierValue" className="mb-3">
                                        <Form.Label>Identifier Value</Form.Label>
                                        <Select
                                            name="identifierValue"
                                            value={projectList.find((mod) => mod.projectName === identifiers.identifierValue)}
                                            onChange={(selectedOption) => {
                                                setIdentifiers({
                                                    ...identifiers,
                                                    identifierValue: selectedOption?.projectName || '',
                                                });
                                            }}
                                            getOptionLabel={(mod) => mod.projectName}
                                            getOptionValue={(mod) => mod.projectName}
                                            options={projectList}
                                            isSearchable={true}
                                            placeholder="Select Identifier Value"
                                            required
                                        />

                                    </Form.Group>
                                </Col>

                                : <Col lg={6}>
                                    <Form.Group controlId="identifierValue" className="mb-3">
                                        <Form.Label>Identifier Value</Form.Label>
                                        <Select
                                            name="identifierValue"
                                            value={projectList.find((mod) => mod.projectName === identifiers.identifierValue)}
                                            onChange={(selectedOption) => {
                                                setIdentifiers({
                                                    ...identifiers,
                                                    identifierValue: selectedOption?.projectName || '',
                                                });
                                            }}
                                            getOptionLabel={(mod) => mod.projectName}
                                            getOptionValue={(mod) => mod.projectName}
                                            options={projectList}
                                            isSearchable={true}
                                            placeholder="Select Identifier Value"
                                            required
                                        />

                                    </Form.Group>
                                </Col>

                            )
                            :null



                            }

                            <Col className='align-items-end d-flex justify-content-between mb-3'>
                                <div>
                                    <span className='fs-5 '>This field is required*</span>
                                </div>
                                <div>
                                    <Link to={'/pages/IdentifierMaster'}>
                                        <Button variant="primary" >
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update Identifier' : 'Add Identifier'}
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