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
    status: string;
    trade: string;
    gstin: string;
    fillingFrequency: string;
    vendorContactPerson: string;
    creatorEmpId: string;
    creatorName: string;
    creatorEmail: string;
    createdDate: string;
    updatedDate: string;
}

interface FillingFrequencyList {
    id: number;
    name: string;
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
        trade: '',
        branch: '',
        gstin: '',
        status: '',
        fillingFrequency: '',
        vendorContactPerson: '',
        creatorEmpId: '',
        creatorName: '',
        creatorEmail: '',
        createdDate: '',
        updatedDate: ''
    });



    const [ifscError, setIfscError] = useState('');
    const [districts, setDistricts] = useState<District[]>([]);
    const [areaData, setAreaData] = useState<AreaData[]>([]);
    const [searchPin, setSearchPin] = useState('');
    const [searchDistrict, setSearchDistrict] = useState('');
    const [gstin, setGstin] = useState('');
    const [gstinError, setGstinError] = useState<string | null>(null);

    const [errorMessage, setErrorMessage] = useState('');
    const [isMobileVerified, setIsMobileVerified] = useState(false);

    useEffect(() => {
        toast.dismiss();
        const storedEmpName = localStorage.getItem('EmpName');
        const storedEmpID = localStorage.getItem('EmpId');
        if (storedEmpName && storedEmpName.trim().length > 0 || storedEmpID) {
            setVenders((prevState) => ({
                ...prevState,
                creatorName: `${storedEmpName} - ${storedEmpID}`,
            }));
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

    }, []);



    const fetchBankByIFSC = async (ifsc: string) => {
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/BankMaster/GetBank`, {
                params: { ifsc },
            });

            if (response.data.isSuccess && response.data.bankMasterListResponses.length > 0) {
                const fetchedBankDetails = response.data.bankMasterListResponses[0];
                setVenders((prevState) => ({
                    ...prevState,
                    bankName: fetchedBankDetails.bank,
                    branch: fetchedBankDetails.branch,
                }));
            } else {
                setIfscError('Bank details not found for the given IFSC code.');
                setVenders((prevState) => ({
                    ...prevState,
                    bankName: '',
                    branch: '',
                }));
            }
        } catch (error) {
            console.error('Error fetching bank details:', error);
            setIfscError('Error fetching bank details.');
        }
    };



    const handleIfscBlur = async () => {
        const { ifsc } = venders;

        if (!ifsc || ifsc.length !== 11) {
            setIfscError(ifsc ? 'Invalid IFSC code. Please enter an 11-character code.' : 'IFSC code is required.');
            setVenders((prevState) => ({
                ...prevState,
                bankName: '',
                branch: '',
            }));
            return;
        }

        // Clear error and fetch bank details
        setIfscError('');
        await fetchBankByIFSC(ifsc);
    };

    const handleIfscChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);

        setVenders((prevState) => ({ ...prevState, ifsc: capitalizedValue, }));
        setIfscError('');
    };



    const handleChange = (e: ChangeEvent<any> | null, name?: string, value?: any) => {
        const validateMobileNumber = (fieldName: string, fieldValue: string) => {
            if (!/^\d{0,10}$/.test(fieldValue)) {
                return false;
            }

            setVenders((prevData) => ({
                ...prevData,
                [fieldName]: fieldValue,
            }));

            if (fieldValue.length === 10) {
                if (!/^[6-9]/.test(fieldValue)) {
                    toast.error("Mobile number should start with a digit between 6 and 9.");
                    setIsMobileVerified(true);
                    return false;
                }
            } else {
                setIsMobileVerified(false);
            }
            return true;
        };


        if (e) {
            const { name: eventName, type } = e.target;

            if (type === 'checkbox') {
                const checked = (e.target as HTMLInputElement).checked;
                setVenders({ ...venders, [eventName]: checked });
            } else {
                const inputValue = (e.target as HTMLInputElement | HTMLSelectElement).value;
                // setVenders({ ...venders, [eventName]: inputValue });
                if (eventName === "contactNo") {
                    validateMobileNumber(eventName, inputValue);
                } else {
                    setVenders((prevData) => {
                        const updatedData = { ...prevData, [eventName]: inputValue };
                        return updatedData;
                    });
                }
            }
        } else if (name) {
            setVenders({
                ...venders,
                [name]: value
            });
        }
    };




    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9]{1}$/;

    const handleGSTINChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        setGstin(value);
        setVenders((prevVenders) => ({
            ...prevVenders,
            gstin: value,
        }));
        setGstinError(null);
    };
    const handleGSTINBlur = () => {
        if (!gstinRegex.test(gstin)) {
            setGstinError('Please enter a valid GSTIN.');
        }
    };

    console.log(searchDistrict)


    const fetchDistricts = async () => {
        try {
            setErrorMessage('');
            if (!searchPin.trim()) {
                setDistricts([]);
                setSearchDistrict('');
                setAreaData([]);
                setVenders(prev => ({ ...prev, district: '', area: '', state: '' }));
                return;
            }

            const response = await axios.get(`${config.API_URL_APPLICATION}/AddressMaster/GetAddressData?PinCode=${searchPin}`);
            const fetchedDistricts = response.data.addresses;

            if (fetchedDistricts.length > 0) {
                setDistricts(fetchedDistricts);

                const firstDistrict = fetchedDistricts[0].district;
                const fetchedState = fetchedDistricts[0]?.state || '';

                setSearchDistrict(firstDistrict);
                setVenders(prev => ({
                    ...prev,
                    district: firstDistrict,
                    state: fetchedState,
                }));

                // Fetch area data for the default district
                await fetchAreaData(searchPin, firstDistrict);
            } else {
                // Handle invalid pincode
                setDistricts([]);
                setSearchDistrict('');
                setAreaData([]);
                setVenders(prev => ({ ...prev, district: '', area: '', state: '' }));

                setErrorMessage('Invalid Pincode. Please try again.');
            }
        } catch (error) {
            console.error('Error fetching districts:', error);
            setDistricts([]);
            setSearchDistrict('');
            setAreaData([]);
            setVenders(prev => ({ ...prev, district: '', area: '', state: '' }));

            setErrorMessage('Invalid Pincode. Please try again.');
        }
    };


    const fetchAreaData = async (pin: string, district: string) => {
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/AddressMaster/GetAddressData?PinCode=${pin}&District=${district}`);
            const fetchedAreas = response.data.addresses;

            if (fetchedAreas.length > 0) {
                setAreaData(fetchedAreas);

                const firstArea = fetchedAreas[0].areaName;
                const fetchedState = fetchedAreas[0]?.state || '';
                setVenders(prev => ({
                    ...prev,
                    area: firstArea,
                    state: fetchedState,
                }));
            } else {
                // Handle invalid pincode or no areas found
                setAreaData([]);
                setVenders(prev => ({ ...prev, area: '', state: '' }));
                toast.error("Invalid Pincode or no areas found. Please try again.");
            }
        } catch (error) {
            console.error('Error fetching area data:', error);
            setAreaData([]);
            setVenders(prev => ({ ...prev, area: '', state: '' }));
            toast.error("Invalid Pincode or no areas found. Please try again.");
        }
    };



    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (venders.contactNo.length !== 10) {
            toast.dismiss()
            toast.error("Mobile number should be exactly 10 digits long.");
            setIsMobileVerified(true);
            return false;
        }

        if (isMobileVerified) {
            toast.dismiss()
            toast.error("Please verify your mobile number before submitting the form.");
            return;
        }

        if (!gstinRegex.test(gstin)) {
            setGstinError('Please enter a valid GSTIN.');
            return;
        }

        const payload = {
            ...venders,
        };
        console.log(payload)
        try {
            if (editMode) {
                await axios.post(`${config.API_URL_APPLICATION}/VendorMaster/UpdateVendor`, payload);
                navigate('/pages/VendorMaster', {
                    state: {
                        successMessage: "Vendor Updated successfully!",
                    }
                });
            } else {
                await axios.post(`${config.API_URL_APPLICATION}/VendorMaster/InsertVendor`, payload);
                navigate('/pages/VendorMaster', {
                    state: {
                        successMessage: "Vendor Added successfully!",
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
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit Vendor' : 'Add Vendor'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col lg={6}>
                                <Form.Group controlId="category" className="mb-3">
                                    <Form.Label>Category</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="category"
                                        value={venders.category}
                                        onChange={handleChange}
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
                                            setVenders(prev => ({ ...prev, pin: e.target.value }));
                                        }}
                                        onBlur={fetchDistricts}
                                        placeholder="Enter Pincode"
                                    />
                                    {errorMessage && <div className="text-danger mt-1">{errorMessage}</div>}

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
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="district" className="mb-3">
                                    <Form.Label>District:</Form.Label>
                                    <Select
                                        name="district"
                                        value={
                                            districts.find(item => item.district === venders.district) ||
                                            (venders.district && { district: venders.district }) ||
                                            null
                                        }
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
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="area" className="mb-3">
                                    <Form.Label>Area:</Form.Label>
                                    <Select
                                        name="area"
                                        value={
                                            areaData.find(item => item.areaName === venders.area) ||
                                            (venders.area && { areaName: venders.area }) ||
                                            null
                                        }
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
                                        placeholder="Enter Vendor Email"
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
                                        onChange={handleIfscChange}
                                        onBlur={handleIfscBlur}
                                        placeholder='Enter IFSC Code'
                                    />
                                    {ifscError && <div className="text-danger mt-1">{ifscError}</div>}

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
                                        onChange={handleGSTINChange}
                                        onBlur={handleGSTINBlur}
                                        placeholder="Enter GSTIN"
                                    />
                                    {gstinError && <div className="text-danger mt-2">{gstinError}</div>}
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
                                        placeholder="Enter Vendor Contact Person"
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="contactNo" className="mb-3">
                                    <Form.Label>Vendor Contact No.</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="contactNo"
                                        value={venders.contactNo}
                                        onChange={handleChange}
                                        placeholder="Enter Vendor Contact No."
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="trade" className="mb-3">
                                    <Form.Label>Trade</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="trade"
                                        value={venders.trade}
                                        onChange={handleChange}
                                        placeholder="Enter Trade"
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
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="creatorName" className="mb-3">
                                    <Form.Label>Creator Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="creatorName"
                                        value={venders.creatorName || ''}
                                        placeholder="Enter Creator Name"
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="creatorEmail" className="mb-3">
                                    <Form.Label>Creator Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="creatorEmail"
                                        value={venders.creatorEmail}
                                        onChange={handleChange}
                                        placeholder="Enter Creator Email"
                                    />
                                </Form.Group>
                            </Col>

                            {editMode ?
                                <>
                                    <Col lg={6}>
                                        <Form.Group controlId="createdDate" className="mb-3">
                                            <Form.Label>Created Date</Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="createdDate"
                                                value={venders.createdDate}
                                                disabled
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col lg={6}>
                                        <Form.Group controlId="updatedDate" className="mb-3">
                                            <Form.Label>Updated Date</Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="updatedDate"
                                                value={venders.updatedDate}
                                                disabled
                                            />
                                        </Form.Group>
                                    </Col>
                                </> : null
                            }

                            <Col lg={6}>
                                <Form.Group controlId="status" className="mb-3">
                                    <Form.Label>Status</Form.Label>
                                    <Select
                                        name="status"
                                        options={optionsAppAccess}
                                        value={optionsAppAccess.find(option => option.value === venders.status)}
                                        onChange={selectedOption => handleChange(null, 'status', selectedOption?.value)}
                                        placeholder="Select Status"
                                    />
                                </Form.Group>
                            </Col>

                            <Col className='align-items-end d-flex justify-content-between mb-3'>
                                <div>
                                    <span className='fs-5 '>All fields are required *</span>
                                </div>
                                <div>
                                    <Link to={'/pages/VendorMaster'}>
                                        <Button variant="primary" >
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update Vendor' : 'Add Vendor'}
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


