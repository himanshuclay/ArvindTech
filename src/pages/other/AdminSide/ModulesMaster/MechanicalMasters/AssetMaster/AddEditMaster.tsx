import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
// import Select from 'react-select';
import { toast } from 'react-toastify';


interface BTS_PAYMENT {
    id: number,
    assetGroupCode: string,
    assetCategory: string,
    assetGroup: string,
    assetName: string,
    specification: string,
    applicableServices: string,
    wHrsorKMorDays: string,
    measureType: string,
    unit: string,
    createdDate: string,
    createdBy: string,
    updatedDate: string,
    updatedBy: string,
}

interface ProjectList {
    id: string;
    BillEntryDate: string
}
interface Status {
    id: string;
    name: string
}
interface EmployeeList {
    empId: string;
    employeeName: string
}

const AssetMasterAddEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [empName, setEmpName] = useState<string | null>('')
    const [, setProjectList] = useState<ProjectList[]>([])
    const [, setStatusList] = useState<Status[]>([])
    const [, setEmployeeList] = useState<EmployeeList[]>([])
    const [messes, setMesses] = useState<BTS_PAYMENT>({
        id: 0,
        assetGroupCode: '',
        assetCategory: '',
        assetGroup: '',
        assetName: '',
        specification: '',
        applicableServices: '',
        wHrsorKMorDays: '',
        measureType: '',
        unit: '',
        createdDate: '',
        createdBy: '',
        updatedDate: '',
        updatedBy: '',
    }
    );

    const [isMobileVerified, setIsMobileVerified] = useState(false);
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        toast.dismiss();

        const storedEmpName = localStorage.getItem('EmpName');
        const storedEmpID = localStorage.getItem('EmpId');
        if (storedEmpName || storedEmpID) {
            setEmpName(`${storedEmpName} - ${storedEmpID}`);
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
            const response = await axios.get(`${config.API_URL_APPLICATION1}/AssetMaster/GetAsset/${id}`);
            console.log('response', response)
            if (response.data.isSuccess) {
                const fetchedModule = response.data.assetMasters[0];
                setMesses(fetchedModule);
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
        fetchData('CommonDropdown/GetStatus', setStatusList, 'statusListResponses');
        fetchData('CommonDropdown/GetEmployeeListWithId', setEmployeeList, 'employeeLists');
    }, []);



    const validateFields = (): boolean => {
        const errors: { [key: string]: string } = {};


        if (!messes.assetGroupCode) { errors.assetGroupCode = 'assetGroupCode is required' }
        if (!messes.assetCategory) { errors.assetCategory = 'assetCategory is required' }
        if (!messes.assetGroup) { errors.assetGroup = 'assetGroup is required' }
        if (!messes.assetName) { errors.assetName = 'assetName is required' }
        if (!messes.specification) { errors.specification = 'specification is required' }
        if (!messes.applicableServices) { errors.applicableServices = 'applicableServices is required' }
        if (!messes.wHrsorKMorDays) { errors.wHrsorKMorDays = 'wHrsorKMorDays is required' }
        if (!messes.measureType) { errors.measureType = 'measureType is required' }
        if (!messes.unit) { errors.unit = 'unit is required' }
        






        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };


    const handleChange = (e: ChangeEvent<any> | null, name?: string, value?: any) => {
        const validateMobileNumber = (fieldName: string, fieldValue: string) => {
            if (!/^\d{0,10}$/.test(fieldValue)) {
                return false;
            }

            setMesses((prevData) => ({
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
                setMesses((prevData) => ({
                    ...prevData,
                    [eventName]: checked,
                }));
            } else {
                const inputValue = (e.target as HTMLInputElement | HTMLSelectElement).value;
                if (eventName === "mobileNumber") {
                    validateMobileNumber(eventName, inputValue);
                } else {
                    setMesses((prevData) => {
                        const updatedData = { ...prevData, [eventName]: inputValue };
                        return updatedData;
                    });
                }
            }
        }

    };




    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(messes)
        if (!validateFields()) {
            toast.dismiss()
            toast.error('Please fill in all required fields.');
            return;
        }




        if (isMobileVerified) {
            toast.dismiss()
            toast.error("Please verify your mobile number before submitting the form.");
            return;
        }
        const payload = {
            ...messes,
            createdDate: new Date(),
            createdBy: editMode ? messes.createdBy : empName,
            updatedBy: editMode ? empName : '',
            updatedDate: new Date(),
        };
        try {
            if (editMode) {
                await axios.put(`${config.API_URL_APPLICATION1}/AssetMaster/UpdateAsset/${id}`, payload);
                navigate('/pages/AssetMaster', {
                    state: {
                        successMessage: "Challan Master Updated successfully!",
                    }
                });
            } else {
                await axios.post(`${config.API_URL_APPLICATION1}/AssetMaster/CreateAsset`, payload);
                navigate('/pages/AssetMaster', {
                    state: {
                        successMessage: "Challan Master Added successfully!",
                    }
                });
            }
        } catch (error: any) {
            toast.error(error || 'Error Adding/Updating');
        }

    };
    return (
        <div>
            <div className="container">
                <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center fs-20 rounded-3 border">
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit Asset Master' : 'Add Asset Master'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>

                            <Col lg={6}>
                                <Form.Group controlId="assetGroupCode" className="mb-3">
                                    <Form.Label>assetGroupCode</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="assetGroupCode"
                                        value={messes.assetGroupCode}
                                        onChange={handleChange}
                                        placeholder='Enter assetGroupCode'
                                        disabled={editMode}
                                        className={validationErrors.assetGroupCode ? " input-border" : "  "}
                                    />
                                    {validationErrors.assetGroupCode && (
                                        <small className="text-danger">{validationErrors.assetGroupCode}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="assetCategory" className="mb-3">
                                    <Form.Label>assetCategory</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="assetCategory"
                                        value={messes.assetCategory}
                                        onChange={handleChange}
                                        placeholder='Enter Project ID'
                                        className={validationErrors.assetCategory ? " input-border" : "  "}
                                    />
                                    {validationErrors.assetCategory && (
                                        <small className="text-danger">{validationErrors.assetCategory}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="assetGroup" className="mb-3">
                                    <Form.Label>assetGroup</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="assetGroup"
                                        value={messes.assetGroup}
                                        onChange={handleChange}
                                        placeholder='Enter Project Name'
                                        className={validationErrors.assetGroup ? " input-border" : "  "}
                                    />
                                    {validationErrors.assetGroup && (
                                        <small className="text-danger">{validationErrors.assetGroup}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="assetName" className="mb-3">
                                    <Form.Label>assetName</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="assetName"
                                        value={messes.assetName}  // ✅ Use checked instead of value
                                        onChange={handleChange}
                                        className={validationErrors.assetName ? "input-border" : ""}
                                    />

                                    {validationErrors.assetName && (
                                        <small className="text-danger">{validationErrors.assetName}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            
                            <Col lg={6}>
                                <Form.Group controlId="specification" className="mb-3">
                                    <Form.Label>specification</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="specification"
                                        value={messes.specification}
                                        onChange={handleChange}
                                        placeholder='Enter specification'
                                        className={validationErrors.specification ? " input-border" : "  "}
                                    />
                                    {validationErrors.specification && (
                                        <small className="text-danger">{validationErrors.specification}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="applicableServices" className="mb-3">
                                    <Form.Label>applicableServices</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="applicableServices"
                                        value={messes.applicableServices}
                                        onChange={handleChange}
                                        placeholder='Enter applicableServices'
                                        className={validationErrors.applicableServices ? " input-border" : "  "}
                                    />
                                    {validationErrors.applicableServices && (
                                        <small className="text-danger">{validationErrors.applicableServices}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="wHrsorKMorDays" className="mb-3">
                                    <Form.Label>wHrsorKMorDays</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="wHrsorKMorDays"
                                        value={messes.wHrsorKMorDays}
                                        onChange={handleChange}
                                        placeholder='Enter wHrsorKMorDays'
                                        className={validationErrors.wHrsorKMorDays ? " input-border" : "  "}
                                    />
                                    {validationErrors.wHrsorKMorDays && (
                                        <small className="text-danger">{validationErrors.wHrsorKMorDays}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="measureType" className="mb-3">
                                    <Form.Label>measureType</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="measureType"
                                        value={messes.measureType}
                                        onChange={handleChange}
                                        placeholder='Enter measureType'
                                        className={validationErrors.measureType ? " input-border" : "  "}
                                    />
                                    {validationErrors.measureType && (
                                        <small className="text-danger">{validationErrors.measureType}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="unit" className="mb-3">
                                    <Form.Label>unit</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="unit"
                                        value={messes.unit}
                                        onChange={handleChange}
                                        placeholder='Enter unit'
                                        className={validationErrors.unit ? " input-border" : "  "}
                                    />
                                    {validationErrors.unit && (
                                        <small className="text-danger">{validationErrors.unit}</small>
                                    )}
                                </Form.Group>
                            </Col>
                           





                            <Col className='align-items-end d-flex justify-content-between mb-3'>
                                <div>
                                    <span className='fs-5 '>This field is required*</span>
                                </div>
                                <div>
                                    <Link to={'/pages/AssetMaster'}>
                                        <Button variant="primary" >
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update Asset' : 'Add Asset'}
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

export default AssetMasterAddEdit;