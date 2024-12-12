import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
import Select from 'react-select';
import { toast } from 'react-toastify';

interface Addresses {
    id: number;
    pinCode: string;
    areaName: string;
    district: string;
    state: string;
    status: string;
    createdBy: string;
    updatedBy: string;
}

interface StateList {
    id: number;
    stateName: any;
}
const AddressMasterinsert = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [empName, setEmpName] = useState<string | null>()
    const [pinCodeError, setPinCodeError] = useState<string | null>(null);
    const [stateList, setStateList] = useState<StateList[]>([]);
    const [address, setAddress] = useState<Addresses>({
        id: 0,
        pinCode: '',
        areaName: '',
        district: '',
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
            const response = await axios.get(`${config.API_URL_APPLICATION}/AddressMaster/GetAddress`, {
                params: { id: id }
            });
            if (response.data.isSuccess) {
                const fetchedModule = response.data.addresses[0];
                setAddress(fetchedModule);
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

    const handleBankAccountNumberChange = (e: ChangeEvent<any>) => {
        const { value } = e.target as HTMLInputElement;

        // Keep only numeric characters
        const validValue = value.replace(/[^0-9]/g, "");

        if (validValue.length > 6) {
            setPinCodeError("Invalid pincode. Pincode cannot exceed 6 digits.");
        } else {
            setPinCodeError(null); // Clear the error if the value is valid
        }

        setAddress((prevState) => ({
            ...prevState,
            pinCode: (validValue)
        }));
    };


    const handleChange = (e: ChangeEvent<any> | null, name?: string, value?: any) => {
        if (e) {
            const { name: eventName, type } = e.target;

            if (type === 'checkbox') {
                const checked = (e.target as HTMLInputElement).checked;
                setAddress({
                    ...address,
                    [eventName]: checked
                });
            } else {
                const inputValue = (e.target as HTMLInputElement | HTMLSelectElement).value;
                setAddress({
                    ...address,
                    [eventName]: inputValue
                });
            }
        } else if (name) {
            setAddress({
                ...address,
                [name]: value
            });
        }
    };




    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const payload = {
            ...address,
            createdBy: editMode ? address.createdBy : empName,
            updatedBy: editMode ? empName : '',
        };
        console.log(payload)
        try {
            if (editMode) {
                await axios.post(`${config.API_URL_APPLICATION}/AddressMaster/InsertorUpdateAddress`, payload);
                navigate('/pages/AddressMaster', {
                    state: {
                        successMessage: "Address Updated successfully!",
                    }
                });
            } else {
                await axios.post(`${config.API_URL_APPLICATION}/AddressMaster/InsertorUpdateAddress`, payload);
                navigate('/pages/AddressMaster', {
                    state: {
                        successMessage: "Address Updated successfully!",
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
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit Address' : 'Add Address'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col lg={6}>
                                <Form.Group controlId="pinCode" className="mb-3">
                                    <Form.Label>Pincode</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="pinCode"
                                        value={address.pinCode}
                                        onChange={handleBankAccountNumberChange}
                                        required
                                        placeholder='Enter Pincode'
                                    />
                                    {pinCodeError && (
                                        <Form.Text className="text-danger">
                                            {pinCodeError}
                                        </Form.Text>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="areaName" className="mb-3">
                                    <Form.Label>Area Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="areaName"
                                        value={address.areaName}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter Area Name'
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="district" className="mb-3">
                                    <Form.Label>District Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="district"
                                        value={address.district}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter district Name'
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="stateName" className="mb-3">
                                    <Form.Label>State Name *:</Form.Label>
                                    <Select
                                        name="stateName"
                                        value={stateList.find((mod) => mod.stateName === address.state)}
                                        onChange={(selectedOption) => {
                                            setAddress({
                                                ...address,
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
                                        value={optionsAppAccess.find(option => option.value === address.status)}
                                        onChange={selectedOption => handleChange(null, 'status', selectedOption?.value)}
                                        placeholder="Select Status"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col></Col>
                            <Col className='align-items-end d-flex justify-content-end mb-3'>
                                <div>
                                    <Link to={'/pages/AddressMaster'}>
                                        <Button variant="primary" >
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update Address' : 'Add Address'}
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


