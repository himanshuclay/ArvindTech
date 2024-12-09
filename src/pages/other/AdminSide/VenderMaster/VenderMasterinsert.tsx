import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import config from '@/config';
import Select from 'react-select';
import { toast } from 'react-toastify';


interface Vender {
    id: number;
    vendorCode: string;
    category: string;
    name: string;
    addressLine1: string;
    district: string;
    state: string;
    area: string;
    pin: string;
    email: string;
    contactNo: string;
    bankAccountNumber: string;
    bankName: string;
    ifsc: string;
    branch: string;
    gstin: string;
    fillingFrequency: string;
    vendorContactPerson: string;
    creatorEmpId: string;
    creatorName: string;
    creatorEmail: string;
}



interface StateList {
    id: number;
    stateName: string;
}


interface FillingFrequencyList {
    id: number;
    name: string;
}


interface EmployeeList {
    empId: string;
    employeeName: string;
}


const DepartmentMasterinsert = () => {
    toast.dismiss()
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [employeeList, setEmployeeList] = useState<EmployeeList[]>([]);
    const [stateList, setStateList] = useState<StateList[]>([]);
    const [fillingFrequencyList, setFillingFrequencyList] = useState<FillingFrequencyList[]>([]);
    const [venders, setVenders] = useState<Vender>({
        id:0,
        vendorCode: '',
        category: '',
        name: '',
        addressLine1: '',
        district: '',
        area: '',
        state:'',
        pin: '',
        email: '',
        contactNo: '',
        bankAccountNumber: '',
        bankName: '',
        ifsc: '',
        branch: '',
        gstin: '',
        fillingFrequency: '',
        vendorContactPerson: '',
        creatorEmpId: '',
        creatorName: '',
        creatorEmail: ''
    });



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
            const response = await axios.get(`${config.API_URL_APPLICATION}/VendorMaster/GetVendor`, {
                params: { id: id }
            });
            if (response.data.isSuccess) {
                const fetchedModule = response.data.vendorMasterList[0];
                setVenders(fetchedModule);
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

        fetchData('CommonDropdown/GetFillingFrequency', setFillingFrequencyList, 'fillingFrequencyListResponses');
        fetchData('CommonDropdown/GetStateList', setStateList, 'stateListResponses');
        fetchData('CommonDropdown/GetEmployeeListWithId', setEmployeeList, 'employeeLists');

    }, []);



   
    const fetchbankByIFSC = async (ifsc: string) => {
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/BankMaster/GetBank`, {
                params: { ifsc }
            });
            if (response.data.isSuccess && response.data.bankMasterListResponses.length > 0) {
                const fetchedBankDetails = response.data.bankMasterListResponses[0];
                setVenders((prevState) => ({
                    ...prevState,
                    bankName: fetchedBankDetails.bank,
                    branch: fetchedBankDetails.branch,
                }));
            } else {
                console.error(response.data.message || "Bank details not found.");
            }
        } catch (error) {
            console.error('Error fetching bank details:', error);
        }
    };


    const handleifscChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setVenders((prevState) => ({
            ...prevState,
            [name]: value
        }));

        if (name === 'ifsc' && value.length === 11) {
            fetchbankByIFSC(value);
        }
    };

    const handleChange = (e: ChangeEvent<any> | null, name?: string, value?: any) => {
        if (e) {
            const { name: eventName, type } = e.target;

            if (type === 'checkbox') {
                const checked = (e.target as HTMLInputElement).checked;
                setVenders({
                    ...venders,
                    [eventName]: checked
                });
            } else {
                const inputValue = (e.target as HTMLInputElement | HTMLSelectElement).value;
                setVenders({
                    ...venders,
                    [eventName]: inputValue
                });
            }
        } else if (name) {
            // For react-select, where we directly pass the name and value
            setVenders({
                ...venders,
                [name]: value
            });
        }
    };
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const payload = {
            ...venders,
        };
        console.log(payload)
        try {
            if (editMode) {
                await axios.post(`${config.API_URL_APPLICATION}/VendorMaster/UpdateVendor`, payload);
                navigate('/pages/VenderMaster', {
                    state: {
                        successMessage: "Vender Updated successfully!",
                    }
                });
            } else {
                await axios.post(`${config.API_URL_APPLICATION}/VendorMaster/InsertVendor`, payload);
                navigate('/pages/VenderMaster', {
                    state: {
                        successMessage: "Vender Added successfully!",
                    }
                });
            }


        } catch (error:any) {
            toast.error(error || "Error Adding/Updating");
            console.error('Error submitting module:', error);
        }
    };

 

    return (
        <div>
            <div className="container">
                <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center fs-20 rounded-3 border">
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit Vender' : 'Add Vender'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col lg={6}>
                                <Form.Group controlId="vendorCode" className="mb-3">
                                    <Form.Label>Vendor Code</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="vendorCode"
                                        value={venders.vendorCode}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter Vendor Code"
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="category" className="mb-3">
                                    <Form.Label>Category</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="category"
                                        value={venders.category}
                                        onChange={handleChange}
                                        required
                                        placeholder="Category"
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="name" className="mb-3">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={venders.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Name"
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="addressLine1" className="mb-3">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="addressLine1"
                                        value={venders.addressLine1}
                                        onChange={handleChange}
                                        required
                                        placeholder="Address"
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="district" className="mb-3">
                                    <Form.Label>District</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="district"
                                        value={venders.district}
                                        onChange={handleChange}
                                        required
                                        placeholder="District"
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="state" className="mb-3">
                                    <Form.Label>State</Form.Label>
                                    <Select
                                        name="state"
                                        value={stateList.find((mod) => mod.stateName === venders.state)}
                                        onChange={(selectedOption) => {
                                            setVenders({
                                                ...venders,
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
                                <Form.Group controlId="area" className="mb-3">
                                    <Form.Label>Area Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="area"
                                        value={venders.area}
                                        onChange={handleChange}
                                        required
                                        placeholder="Area Name"
                                    />
                                </Form.Group>
                            </Col>
                           
                            <Col lg={6}>
                                <Form.Group controlId="pin" className="mb-3">
                                    <Form.Label>Pin Code</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="pin"
                                        value={venders.pin}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter Pin Code"
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="email" className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={venders.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter Email"
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="contactNo" className="mb-3">
                                    <Form.Label>contactNo</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="contactNo"
                                        value={venders.contactNo}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter Contact No"
                                    />
                                </Form.Group>
                            </Col>

                            

                            <Col lg={6}>
                                <Form.Group controlId="ifsc" className="mb-3">
                                    <Form.Label>IFSC Code:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="ifsc"
                                        value={venders.ifsc}
                                        onChange={handleifscChange}
                                        placeholder='Enter IFSC Code'
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="bankName" className="mb-3">
                                    <Form.Label>Bank Name:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="bankName"
                                        value={venders.bankName}
                                        onChange={handleChange}
                                        placeholder=' Bank Name'
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="branch" className="mb-3">
                                    <Form.Label>Branch  Name:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="branch"
                                        value={venders.branch}
                                        onChange={handleChange}
                                        placeholder=' Branch  Name'
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="bankAccountNumber" className="mb-3">
                                    <Form.Label>Estimated Cost</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="bankAccountNumber"
                                        value={venders.bankAccountNumber}
                                        onChange={handleChange}
                                        required
                                        placeholder="Estimated Cost"
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="gstin" className="mb-3">
                                    <Form.Label>GSTIN</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="gstin"
                                        value={venders.gstin}
                                        onChange={handleChange}
                                        required
                                        placeholder="GSTIN"
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="vendorContactPerson" className="mb-3">
                                    <Form.Label>Vendor Contact Person</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="vendorContactPerson"
                                        value={venders.vendorContactPerson}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter Vendor Contact Person"
                                    />
                                </Form.Group>
                            </Col>

                           <Col lg={6}>
                                <Form.Group controlId="fillingFrequency" className="mb-3">
                                    <Form.Label>Filling Frequency</Form.Label>
                                    <Select
                                        name="fillingFrequency"
                                        value={fillingFrequencyList.find((mod) => mod.name === venders.fillingFrequency)}
                                        onChange={(selectedOption) => {
                                            setVenders({
                                                ...venders,
                                                fillingFrequency: selectedOption?.name || '',
                                            });
                                        }}
                                        getOptionLabel={(mod) => mod.name}
                                        getOptionValue={(mod) => mod.name}
                                        options={fillingFrequencyList}
                                        isSearchable={true}
                                        placeholder="Select Filling Frequency"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                           <Col lg={6}>
                                <Form.Group controlId="creatorName" className="mb-3">
                                    <Form.Label>Creator Name</Form.Label>
                                    <Select
                                        name="creatorName"
                                        value={employeeList.find((emp) => emp.employeeName === venders.creatorName)}
                                        onChange={(selectedOption) => {
                                            setVenders({
                                                ...venders,
                                                creatorName: selectedOption?.employeeName || "",
                                                creatorEmpId: selectedOption?.empId || "",
                                            });
                                        }}
                                        getOptionLabel={(emp) => emp.employeeName}
                                        getOptionValue={(emp) => emp.employeeName}
                                        options={employeeList}
                                        isSearchable={true}
                                        placeholder="Select Project Incharge"
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="creatorEmail" className="mb-3">
                                    <Form.Label>Creator Email</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="creatorEmail"
                                        value={venders.creatorEmail}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter Creator Email"
                                    />
                                </Form.Group>
                            </Col>

                            <Col className='align-items-end d-flex justify-content-between mb-3'>
                                <div>
                                    <span className='fs-5 '>All fields are required *</span>
                                </div>
                                <div>
                                    <Link to={'/pages/VenderMaster'}>
                                        <Button variant="primary" >
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update Vender' : 'Add Vender'}
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


