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

interface FillingFrequencyList {
    id: number;
    name: string;
}


interface EmployeeList {
    empId: string;
    employeeName: string;
}

interface District {
    district: string;
    state: string;
}

interface AreaData {
    areaName: string;
}

const DepartmentMasterinsert = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [employeeList, setEmployeeList] = useState<EmployeeList[]>([]);
    const [fillingFrequencyList, setFillingFrequencyList] = useState<FillingFrequencyList[]>([]);
    const [venders, setVenders] = useState<Vender>({
        id: 0,
        vendorCode: '',
        category: '',
        name: '',
        addressLine1: '',
        district: '',
        area: '',
        state: '',
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

    const [districts, setDistricts] = useState<District[]>([]);
    const [areaData, setAreaData] = useState<AreaData[]>([]);
    const [searchPin, setSearchPin] = useState('');
    const [searchDistrict, setSearchDistrict] = useState('');

    useEffect(() => {
        toast.dismiss()

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




    useEffect(() => {
        const fetchDistricts = async () => {
            try {
                const response = await axios.get(`${config.API_URL_APPLICATION}/AddressMaster/GetAddressData?PinCode=${searchPin}`);
                const fetchedDistricts = response.data.addresses;
                setDistricts(fetchedDistricts);
                if (fetchedDistricts.length > 0) {
                    const firstDistrict = fetchedDistricts[0].district;
                    // Use functional updates to avoid intermediate rendering issues
                    setSearchDistrict(firstDistrict);
                    setVenders(prev => ({ ...prev, district: firstDistrict }));
                }
            } catch (error) {
                console.error('Error fetching districts:', error);
                setDistricts([]);
            }
        };

        if (searchPin.length === 6) {
            fetchDistricts();
        } else {
            setDistricts([]);
            setSearchDistrict('');
            setAreaData([]);
        }
    }, [searchPin]);

    useEffect(() => {
        const fetchAreaData = async () => {
            try {
                const response = await axios.get(`${config.API_URL_APPLICATION}/AddressMaster/GetAddressData?PinCode=${searchPin}&District=${searchDistrict}`);
                const fetchedAreas = response.data.addresses;
                setAreaData(fetchedAreas);
                if (fetchedAreas.length > 0) {
                    const firstArea = fetchedAreas[0].areaName;
                    const fetchedState = fetchedAreas[0]?.state || '';
                    setVenders(prev => ({
                        ...prev,
                        area: firstArea,
                        state: fetchedState,
                    }));
                }
            } catch (error) {
                console.error('Error fetching area data:', error);
                setAreaData([]);
            }
        };

        if (searchPin.length === 6 && searchDistrict) {
            fetchAreaData();
        }
    }, [searchPin, searchDistrict]);



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


        } catch (error: any) {
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
                                <Form.Group controlId="pin" className="mb-3">
                                    <Form.Label>Pincode:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="pin"
                                        value={venders.pin}
                                        onChange={(e) => {
                                            setSearchPin(e.target.value);
                                            setVenders(prev => ({ ...prev, pin: e.target.value })); // Update pin in employee
                                        }}
                                        required
                                        placeholder="Enter Pincode"
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="state" className="mb-3">
                                    <Form.Label>State:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="state"
                                        value={venders.state}
                                        onChange={handleChange}
                                        placeholder='Enter State Name'
                                        readOnly
                                        disabled={!searchPin}
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="district" className="mb-3">
                                    <Form.Label>District:</Form.Label>
                                    <Select
                                        name="district"
                                        value={districts.find(item => item.district === venders.district) || null}
                                        onChange={(selectedOption) => {
                                            const district = selectedOption ? selectedOption.district : '';
                                            setSearchDistrict(district);
                                            setVenders(prev => ({ ...prev, district })); // Update district in employee
                                        }}
                                        options={districts || []}
                                        getOptionLabel={(item) => item.district}
                                        getOptionValue={(item) => item.district}
                                        isSearchable={true}
                                        placeholder="Select District"
                                        className="h45"
                                        isDisabled={!searchPin}
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="area" className="mb-3">
                                    <Form.Label>Area:</Form.Label>
                                    <Select
                                        name="area"
                                        value={areaData.find(item => item.areaName === venders.area) || null}
                                        onChange={(selectedOption) => {
                                            const areaName = selectedOption ? selectedOption.areaName : '';
                                            setVenders(prev => ({ ...prev, area: areaName })); // Update area in employee
                                        }}
                                        options={areaData || []}
                                        getOptionLabel={(item) => item?.areaName || ''}
                                        getOptionValue={(item) => item?.areaName || ''}
                                        isSearchable={true}
                                        placeholder="Select Area"
                                        className="h45"
                                        isDisabled={!searchDistrict}
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="addressLine1" className="mb-3">
                                    <Form.Label>Address:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="addressLine1"
                                        value={venders.addressLine1}
                                        onChange={handleChange}
                                        placeholder='Enter Your Full Address'
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


