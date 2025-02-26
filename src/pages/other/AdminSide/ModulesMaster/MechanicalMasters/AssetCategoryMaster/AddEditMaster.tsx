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
    coreCategory: string,
    assetGroup: string,
    preventiveAndChecklist: boolean,
    dailyChecklist: boolean,
    weeklyChecklist: boolean,
    monthlyChecklist: boolean,
    condition: boolean,
    service: boolean,
    assetCustodian: string,
    sparePartsInventoryApplicable: string,
    createdDate: string,
    createdBy: string,
    updatedDate: string,
    updatedBy: string
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

const AssetCategoryMasterAddEdit = () => {
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
        coreCategory: '',
        assetGroup: '',
        preventiveAndChecklist: false,
        dailyChecklist: false,
        weeklyChecklist: false,
        monthlyChecklist: false,
        condition: false,
        service: false,
        assetCustodian: '',
        sparePartsInventoryApplicable: '',
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
            const response = await axios.get(`${config.API_URL_APPLICATION1}/AssetCategoryMaster/GetAssetCategory/${id}`);
            console.log('response', response)
            if (response.data.isSuccess) {
                const fetchedModule = response.data.assetCategoryMasters[0];
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
        if (!messes.coreCategory) { errors.coreCategory = 'coreCategory is required' }
        if (!messes.assetGroup) { errors.assetGroup = 'assetGroup is required' }
        if (!messes.preventiveAndChecklist) { errors.preventiveAndChecklist = 'preventiveAndChecklist is required' }
        if (!messes.dailyChecklist) { errors.dailyChecklist = 'dailyChecklist is required' }
        if (!messes.weeklyChecklist) { errors.weeklyChecklist = 'weeklyChecklist is required' }
        if (!messes.monthlyChecklist) { errors.monthlyChecklist = 'monthlyChecklist is required' }
        if (!messes.condition) { errors.condition = 'condition is required' }
        if (!messes.service) { errors.service = 'service is required' }
        if (!messes.assetCustodian) { errors.assetCustodian = 'assetCustodian is required' }
        if (!messes.sparePartsInventoryApplicable) { errors.sparePartsInventoryApplicable = 'sparePartsInventoryApplicable is required' }






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
                await axios.put(`${config.API_URL_APPLICATION1}/AssetCategoryMaster/UpdateAssetCategory/${id}`, payload);
                navigate('/pages/AssetCategoryMaster', {
                    state: {
                        successMessage: "Challan Master Updated successfully!",
                    }
                });
            } else {
                await axios.post(`${config.API_URL_APPLICATION1}/AssetCategoryMaster/CreateAssetCategory`, payload);
                navigate('/pages/AssetCategoryMaster', {
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
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit AssetCategory Master' : 'Add AssetCategory Master'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>

                            <Col lg={6}>
                                <Form.Group controlId="assetGroupCode" className="mb-3">
                                    <Form.Label>Project ID</Form.Label>
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
                                <Form.Group controlId="coreCategory" className="mb-3">
                                    <Form.Label>Project Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="coreCategory"
                                        value={messes.coreCategory}
                                        onChange={handleChange}
                                        placeholder='Enter Project ID'
                                        className={validationErrors.coreCategory ? " input-border" : "  "}
                                    />
                                    {validationErrors.coreCategory && (
                                        <small className="text-danger">{validationErrors.coreCategory}</small>
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
                                <Form.Group controlId="preventiveAndChecklist" className="mb-3">
                                    <Form.Label>preventiveAndChecklist</Form.Label>
                                    <Form.Check
                                        type="checkbox"
                                        name="preventiveAndChecklist"
                                        checked={messes.preventiveAndChecklist}  // ✅ Use checked instead of value
                                        onChange={handleChange}
                                        className={validationErrors.preventiveAndChecklist ? "input-border" : ""}
                                        label="Enable Preventive & Checklist"  // Optional label
                                    />

                                    {validationErrors.preventiveAndChecklist && (
                                        <small className="text-danger">{validationErrors.preventiveAndChecklist}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="dailyChecklist" className="mb-3">
                                    <Form.Label>dailyChecklist</Form.Label>
                                    <Form.Check
                                        type="checkbox"
                                        name="dailyChecklist"
                                        checked={messes.dailyChecklist}
                                        onChange={handleChange}
                                        placeholder='Enter dailyChecklist'
                                        className={validationErrors.dailyChecklist ? " input-border" : "  "}
                                    />
                                    {validationErrors.dailyChecklist && (
                                        <small className="text-danger">{validationErrors.dailyChecklist}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="weeklyChecklist" className="mb-3">
                                    <Form.Label>weeklyChecklist</Form.Label>
                                    <Form.Check
                                        type="checkbox"
                                        name="weeklyChecklist"
                                        checked={messes.weeklyChecklist}
                                        onChange={handleChange}
                                        placeholder='Enter Number'
                                        className={validationErrors.weeklyChecklist ? " input-border" : "  "}
                                    />
                                    {validationErrors.weeklyChecklist && (
                                        <small className="text-danger">{validationErrors.weeklyChecklist}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="monthlyChecklist" className="mb-3">
                                    <Form.Label>monthlyChecklist</Form.Label>
                                    <Form.Check
                                        type="checkbox"
                                        name="monthlyChecklist"
                                        checked={messes.monthlyChecklist}
                                        onChange={handleChange}
                                        placeholder='Enter monthlyChecklist'
                                        className={validationErrors.monthlyChecklist ? " input-border" : "  "}
                                    />
                                    {validationErrors.monthlyChecklist && (
                                        <small className="text-danger">{validationErrors.monthlyChecklist}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="condition" className="mb-3">
                                    <Form.Label>condition</Form.Label>
                                    <Form.Check
                                        type="checkbox"
                                        name="condition"
                                        checked={messes.condition}
                                        onChange={handleChange}
                                        placeholder='Enter condition'
                                        className={validationErrors.condition ? " input-border" : "  "}
                                    />
                                    {validationErrors.condition && (
                                        <small className="text-danger">{validationErrors.condition}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="service" className="mb-3">
                                    <Form.Label>service</Form.Label>
                                    <Form.Check
                                        type="checkbox"
                                        name="service"
                                        checked={messes.service}
                                        onChange={handleChange}
                                        placeholder='Enter service'
                                        className={validationErrors.service ? " input-border" : "  "}
                                    />
                                    {validationErrors.service && (
                                        <small className="text-danger">{validationErrors.service}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="assetCustodian" className="mb-3">
                                    <Form.Label>assetCustodian</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="assetCustodian"
                                        value={messes.assetCustodian}
                                        onChange={handleChange}
                                        placeholder='Enter assetCustodian'
                                        className={validationErrors.assetCustodian ? " input-border" : "  "}
                                    />
                                    {validationErrors.assetCustodian && (
                                        <small className="text-danger">{validationErrors.assetCustodian}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="sparePartsInventoryApplicable" className="mb-3">
                                    <Form.Label>sparePartsInventoryApplicable</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="sparePartsInventoryApplicable"
                                        value={messes.sparePartsInventoryApplicable}
                                        onChange={handleChange}
                                        placeholder='Enter sparePartsInventoryApplicable'
                                        className={validationErrors.sparePartsInventoryApplicable ? " input-border" : "  "}
                                    />
                                    {validationErrors.sparePartsInventoryApplicable && (
                                        <small className="text-danger">{validationErrors.sparePartsInventoryApplicable}</small>
                                    )}
                                </Form.Group>
                            </Col>





                            <Col className='align-items-end d-flex justify-content-between mb-3'>
                                <div>
                                    <span className='fs-5 '>This field is required*</span>
                                </div>
                                <div>
                                    <Link to={'/pages/AssetCategoryMaster'}>
                                        <Button variant="primary" >
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update AssetCategory' : 'Add AssetCategory'}
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

export default AssetCategoryMasterAddEdit;