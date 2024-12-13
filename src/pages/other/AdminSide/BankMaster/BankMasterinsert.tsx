import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
import Select from 'react-select';
import { toast } from 'react-toastify';

interface Bank {
    id: number;
    bank: string;
    ifsc: string;
    branch: string;
    city1: string;
    city2: string;
    state: string;
    status: string;
    createdBy: string;
    updatedBy: string;
}

interface StateList {
    id: number;
    stateName: any;
}
const BankMasterinsert = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [empName, setEmpName] = useState<string | null>()
    const [stateList, setStateList] = useState<StateList[]>([]);
    const [banks, setBanks] = useState<Bank>({
        id: 0,
        bank: '',
        ifsc: '',
        branch: '',
        city1: '',
        city2: '',
        state: '',
        status: '',
        createdBy: '',
        updatedBy: ''
    });


    useEffect(() => {
        toast.dismiss()

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
            const response = await axios.get(`${config.API_URL_APPLICATION}/BankMaster/GetBankList`, {
                params: { id: id }
            });
            if (response.data.isSuccess) {
                const fetchedModule = response.data.bankMasterListResponses[0];
                setBanks(fetchedModule);
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

        fetchData('CommonDropdown/GetStateList', setStateList, 'stateListResponses');
    }, []);



    const handleChange = (e: ChangeEvent<any> | null, name?: string, value?: any) => {
        if (e) {
            const { name: eventName, type } = e.target;

            if (type === 'checkbox') {
                const checked = (e.target as HTMLInputElement).checked;
                setBanks({
                    ...banks,
                    [eventName]: checked
                });
            } else {
                const inputValue = (e.target as HTMLInputElement | HTMLSelectElement).value;
                setBanks({
                    ...banks,
                    [eventName]: inputValue
                });
            }
        } else if (name) {
            setBanks({
                ...banks,
                [name]: value
            });
        }
    };




    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const payload = {
            ...banks,
            createdBy: editMode ? banks.createdBy : empName,
            updatedBy: editMode ? empName : '',
        };
        console.log(payload)
        try {
            if (editMode) {
                await axios.post(`${config.API_URL_APPLICATION}/BankMaster/UpdateBank`, payload);
                navigate('/pages/BankMaster', {
                    state: {
                        successMessage: "Bank Updated successfully!",
                    }
                });
            } else {
                await axios.post(`${config.API_URL_APPLICATION}/BankMaster/InsertBank`, payload);
                navigate('/pages/BankMaster', {
                    state: {
                        successMessage: "Bank Added successfully!",
                    }
                });
            }
        } catch (error: any) {
            toast.error(error || "Error Adding/Updating");
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
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit Bank' : 'Add Bank'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col lg={6}>
                                <Form.Group controlId="bank" className="mb-2">
                                    <Form.Label>Bank Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="bank"
                                        value={banks.bank}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter bank'
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="ifsc" className="mb-2">
                                    <Form.Label>IFSC Code</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="ifsc"
                                        value={banks.ifsc}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter IFSC code'
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="branch" className="mb-2">
                                    <Form.Label>Branch Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="branch"
                                        value={banks.branch}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter branch Name'
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="city1" className="mb-2">
                                    <Form.Label>City1</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="city1"
                                        value={banks.city1}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter City1 '
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="city2" className="mb-2">
                                    <Form.Label>City2 </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="city2"
                                        value={banks.city2}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter City2'
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="stateName" className="mb-2">
                                    <Form.Label>State Name *:</Form.Label>
                                    <Select
                                        name="stateName"
                                        value={stateList.find((mod) => mod.stateName === banks.state)}
                                        onChange={(selectedOption) => {
                                            setBanks({
                                                ...banks,
                                                state: selectedOption?.stateName || '',
                                            });
                                        }}
                                        getOptionLabel={(mod) => mod.stateName}
                                        getOptionValue={(mod) => mod.stateName}
                                        options={stateList}
                                        isSearchable={true}
                                        placeholder="Select State Name"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="status" className="mb-3">
                                    <Form.Label>Status *</Form.Label>
                                    <Select
                                        name="status"
                                        options={optionsAppAccess}
                                        value={optionsAppAccess.find(option => option.value === banks.status)}
                                        onChange={selectedOption => handleChange(null, 'status', selectedOption?.value)}
                                        placeholder="Select Status"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col></Col>
                            <Col className='align-items-end d-flex justify-content-end mb-3'>
                                <div>
                                    <Link to={'/pages/BankMaster'}>
                                        <Button variant="primary" >
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update Bank' : 'Add Bank'}
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

export default BankMasterinsert;


