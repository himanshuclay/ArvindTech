import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row, Badge, CloseButton } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
import Select from 'react-select';
import CustomSuccessToast from '@/pages/other/Component/CustomSuccessToast';


interface Identifier {
    id: number;
    identifier: string;
    identifierValue: string;
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
    const [tags, setTags] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [identifiers, setIdentifiers] = useState<Identifier>({
        id: 0,
        identifier: '',
        identifierValue: '',
        source: 'Manual Creation',
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

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            if (!tags.includes(inputValue.trim())) {
                setTags([...tags, inputValue.trim()]);
            }
            setInputValue(''); // Clear input
            e.preventDefault(); // Prevent form submission
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const removeTag = (index: number) => {
        setTags(tags.filter((_, i) => i !== index));
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

    const clearAllTags = () => {
        setTags([]);
    };


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
            identifierValue: tags,
            createdBy: editMode ? identifiers.createdBy : empName,
            updatedBy: editMode ? empName : '',
        };
        console.log(payload)


        // try {
        //     await axios.post(`${config.API_URL_APPLICATION}/IdentifierMaster/InsertUpdateIdentifier`, payload);
        //     navigate('/pages/IdentifierMaster', {
        //         state: {
        //             showToast: true,
        //             toastMessage: editMode ? 'Identifier Updated Successfully! ' : 'Identifier Added Successfully!',
        //             toastVariant: "rgb(28 175 85)"
        //         }
        //     });
        // } catch (error: any) {
        //     setToastMessage(error || "Error Adding/Updating");
        //     setToastVariant("rgb(213 18 18)");
        //     setShowToast(true);
        //     console.error('Error submitting module:', error);
        // }
    };


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
                                <Form.Group controlId="identifier" className="mb-3">
                                    <Form.Label>Identifier Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="identifier"
                                        value={identifiers.identifier}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter identifier name'
                                    />
                                </Form.Group>
                            </Col>



                            <Col lg={6} className='position-relative'>
                                <Form.Label>Identifier Value</Form.Label>
                                <div style={{ border: '1px solid #ced4da', borderRadius: '4px' }}>

                                    <Form.Control
                                        type="text"
                                        name='inputValue'
                                        placeholder="Type and press Enter"
                                        value={inputValue}
                                        onChange={handleInputChange}
                                        onKeyDown={handleKeyDown}
                                        style={{ border: 'none', outline: 'none' }}
                                    />
                                </div>
                                <div onClick={clearAllTags}  style={{ position: 'absolute', top: '33px', right: '15px',cursor: 'pointer',}}>
                                    <i className="ri-close-line fs-18 "></i>
                                </div>

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '4px',marginTop:'4px' }}>
                                    {tags.map((tag, index) => (
                                        <Badge bg="primary" key={index} style={{ display: 'flex', alignItems: 'center' ,fontSize:'11px'}}>
                                            {tag}
                                            <CloseButton
                                                onClick={() => removeTag(index)}
                                                style={{ marginLeft: '8px',fontSize:"8px" ,}}
                                                variant="white"
                                            />
                                        </Badge>
                                    ))}
                                </div>
                            </Col>



                            <Col></Col>
                            <Col lg={4} className='align-items-end d-flex justify-content-end mb-3'>

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