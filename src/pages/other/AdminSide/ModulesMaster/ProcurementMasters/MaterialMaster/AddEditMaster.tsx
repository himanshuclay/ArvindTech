import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
// import Select from 'react-select';
import { toast } from 'react-toastify';


interface BTS_PAYMENT {
    id: number,
    materialCode: string,
    coreCategory: string,
    materialName: string,
    materialCategoryName: string,
    materialGroupName: string,
    unit: string,
    speC1: string,
    speC2: string,
    speC3: string,
    speC4: string,
    speC5: string,
    rcRequired: string,
    rcAvailable: string,
    material_Custodian: string,
    lowInventoryTracking: string,
    materialProcurement: string,
    materialStock: string,
    materialDelivery: string,
    nvdItemGroup: string,
    leadTime: number,
    safetyFactor: number,
    technicalSpecification: string,
    inspectionCategory: string,
    inspectionInHouse: string,
    inspection3rdParty: string,
    deliveryTime_InDays: number,
    prApprovalBy: string,
    inventoryType: string,
    deliveryTime: number,
    hoHandler: string,
    amp: string,
    inputType: string,
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

const MaterialMasterAddEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [empName, setEmpName] = useState<string | null>('')
    const [, setProjectList] = useState<ProjectList[]>([])
    const [, setStatusList] = useState<Status[]>([])
    const [, setEmployeeList] = useState<EmployeeList[]>([])
    const [messes, setMesses] = useState<BTS_PAYMENT>({
        id: 0,
        materialCode: '',
        coreCategory: '',
        materialName: '',
        materialCategoryName: '',
        materialGroupName: '',
        unit: '',
        speC1: '',
        speC2: '',
        speC3: '',
        speC4: '',
        speC5: '',
        rcRequired: '',
        rcAvailable: '',
        material_Custodian: '',
        lowInventoryTracking: '',
        materialProcurement: '',
        materialStock: '',
        materialDelivery: '',
        nvdItemGroup: '',
        leadTime: 0,
        safetyFactor: 0,
        technicalSpecification: '',
        inspectionCategory: '',
        inspectionInHouse: '',
        inspection3rdParty: '',
        deliveryTime_InDays: 0,
        prApprovalBy: '',
        inventoryType: '',
        deliveryTime: 0,
        hoHandler: '',
        amp: '',
        inputType: '',
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
            const response = await axios.get(`${config.API_URL_APPLICATION1}/MaterialMaster/GetMaterial/${id}`);
            console.log('response', response)
            if (response.data.isSuccess) {
                const fetchedModule = response.data.materialMasters[0];
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


        if(!messes.materialCode) { errors.materialCode = 'materialCode is required'}
        if(!messes.coreCategory) { errors.coreCategory = 'coreCategory is required'}
        if(!messes.materialName) { errors.materialName = 'materialName is required'}
        if(!messes.materialCategoryName) { errors.materialCategoryName = 'materialCategoryName is required'}
        if(!messes.materialGroupName) { errors.materialGroupName = 'materialGroupName is required'}
        if(!messes.unit) { errors.unit = 'unit is required'}
        if(!messes.speC1) { errors.speC1 = 'speC1 is required'}
        if(!messes.speC2) { errors.speC2 = 'speC2 is required'}
        if(!messes.speC3) { errors.speC3 = 'speC3 is required'}
        if(!messes.speC4) { errors.speC4 = 'speC4 is required'}
        if(!messes.speC5) { errors.speC5 = 'speC5 is required'}
        if(!messes.rcRequired) { errors.rcRequired = 'rcRequired is required'}
        if(!messes.rcAvailable) { errors.rcAvailable = 'rcAvailable is required'}
        if(!messes.material_Custodian) { errors.material_Custodian = 'material_Custodian is required'}
        if(!messes.lowInventoryTracking) { errors.lowInventoryTracking = 'lowInventoryTracking is required'}
        if(!messes.materialProcurement) { errors.materialProcurement = 'materialProcurement is required'}
        if(!messes.materialStock) { errors.materialStock = 'materialStock is required'}
        if(!messes.materialDelivery) { errors.materialDelivery = 'materialDelivery is required'}
        if(!messes.nvdItemGroup) { errors.nvdItemGroup = 'nvdItemGroup is required'}
        if(!messes.leadTime) { errors.leadTime = 'leadTime is required'}
        if(!messes.safetyFactor) { errors.safetyFactor = 'safetyFactor is required'}
        if(!messes.technicalSpecification) { errors.technicalSpecification = 'technicalSpecification is required'}
        if(!messes.inspectionCategory) { errors.inspectionCategory = 'inspectionCategory is required'}
        if(!messes.inspectionInHouse) { errors.inspectionInHouse = 'inspectionInHouse is required'}
        if(!messes.inspection3rdParty) { errors.inspection3rdParty = 'inspection3rdParty is required'}
        if(!messes.deliveryTime_InDays) { errors.deliveryTime_InDays = 'deliveryTime_InDays is required'}
        if(!messes.prApprovalBy) { errors.prApprovalBy = 'prApprovalBy is required'}
        if(!messes.inventoryType) { errors.inventoryType = 'inventoryType is required'}
        if(!messes.deliveryTime) { errors.deliveryTime = 'deliveryTime is required'}
        if(!messes.hoHandler) { errors.hoHandler = 'hoHandler is required'}
        if(!messes.amp) { errors.amp = 'amp is required'}
        if(!messes.inputType) { errors.inputType = 'inputType is required'}
       



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
                await axios.put(`${config.API_URL_APPLICATION1}/MaterialMaster/UpdateMaterial/${id}`, payload);
                navigate('/pages/MaterialMaster', {
                    state: {
                        successMessage: "Challan Master Updated successfully!",
                    }
                });
            } else {
                await axios.post(`${config.API_URL_APPLICATION1}/MaterialMaster/CreateMaterial`, payload);
                navigate('/pages/MaterialMaster', {
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
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit Material Master' : 'Add Material Master'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>

                            <Col lg={6}>
                                <Form.Group controlId="materialCode" className="mb-3">
                                    <Form.Label>materialCode</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="materialCode"
                                        value={messes.materialCode}
                                        onChange={handleChange}
                                        placeholder='Enter materialCode'
                                        disabled={editMode}
                                        className={validationErrors.materialCode ? " input-border" : "  "}
                                    />
                                    {validationErrors.materialCode && (
                                        <small className="text-danger">{validationErrors.materialCode}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="coreCategory" className="mb-3">
                                    <Form.Label>coreCategory</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="coreCategory"
                                        value={messes.coreCategory}
                                        onChange={handleChange}
                                        placeholder='Enter coreCategory'
                                        disabled={editMode}
                                        className={validationErrors.coreCategory ? " input-border" : "  "}
                                    />
                                    {validationErrors.coreCategory && (
                                        <small className="text-danger">{validationErrors.coreCategory}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="materialName" className="mb-3">
                                    <Form.Label>materialName</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="materialName"
                                        value={messes.materialName}
                                        onChange={handleChange}
                                        placeholder='Enter materialName'
                                        disabled={editMode}
                                        className={validationErrors.materialName ? " input-border" : "  "}
                                    />
                                    {validationErrors.materialName && (
                                        <small className="text-danger">{validationErrors.materialName}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="materialCategoryName" className="mb-3">
                                    <Form.Label>materialCategoryName</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="materialCategoryName"
                                        value={messes.materialCategoryName}
                                        onChange={handleChange}
                                        placeholder='Enter materialCategoryName'
                                        disabled={editMode}
                                        className={validationErrors.materialCategoryName ? " input-border" : "  "}
                                    />
                                    {validationErrors.materialCategoryName && (
                                        <small className="text-danger">{validationErrors.materialCategoryName}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="materialGroupName" className="mb-3">
                                    <Form.Label>materialGroupName</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="materialGroupName"
                                        value={messes.materialGroupName}
                                        onChange={handleChange}
                                        placeholder='Enter Project ID'
                                        className={validationErrors.materialGroupName ? " input-border" : "  "}
                                    />
                                    {validationErrors.materialGroupName && (
                                        <small className="text-danger">{validationErrors.materialGroupName}</small>
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
                                        placeholder='Enter Project Name'
                                        className={validationErrors.unit ? " input-border" : "  "}
                                    />
                                    {validationErrors.unit && (
                                        <small className="text-danger">{validationErrors.unit}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="speC1" className="mb-3">
                                    <Form.Label>speC1</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="speC1"
                                        value={messes.speC1}
                                        onChange={handleChange}
                                        className={validationErrors.speC1 ? "input-border" : ""}
                                    />

                                    {validationErrors.speC1 && (
                                        <small className="text-danger">{validationErrors.speC1}</small>
                                    )}
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="speC2" className="mb-3">
                                    <Form.Label>speC2</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="speC2"
                                        value={messes.speC2}
                                        onChange={handleChange}
                                        placeholder='Enter speC2'
                                        className={validationErrors.speC2 ? " input-border" : "  "}
                                    />
                                    {validationErrors.speC2 && (
                                        <small className="text-danger">{validationErrors.speC2}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="speC3" className="mb-3">
                                    <Form.Label>speC3</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="speC3"
                                        value={messes.speC3}
                                        onChange={handleChange}
                                        placeholder='Enter speC3'
                                        className={validationErrors.speC3 ? " input-border" : "  "}
                                    />
                                    {validationErrors.speC3 && (
                                        <small className="text-danger">{validationErrors.speC3}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="speC4" className="mb-3">
                                    <Form.Label>speC4</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="speC4"
                                        value={messes.speC4}
                                        onChange={handleChange}
                                        placeholder='Enter speC4'
                                        className={validationErrors.speC4 ? " input-border" : "  "}
                                    />
                                    {validationErrors.speC4 && (
                                        <small className="text-danger">{validationErrors.speC4}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="speC5" className="mb-3">
                                    <Form.Label>speC5</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="speC5"
                                        value={messes.speC5}
                                        onChange={handleChange}
                                        placeholder='Enter speC5'
                                        className={validationErrors.speC5 ? " input-border" : "  "}
                                    />
                                    {validationErrors.speC5 && (
                                        <small className="text-danger">{validationErrors.speC5}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="rcRequired" className="mb-3">
                                    <Form.Label>rcRequired</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="rcRequired"
                                        value={messes.rcRequired}
                                        onChange={handleChange}
                                        placeholder='Enter rcRequired'
                                        className={validationErrors.rcRequired ? " input-border" : "  "}
                                    >
                                        <option value="">please select</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </Form.Control>
                                    {validationErrors.rcRequired && (
                                        <small className="text-danger">{validationErrors.rcRequired}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="rcAvailable" className="mb-3">
                                    <Form.Label>rcAvailable</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="rcAvailable"
                                        value={messes.rcAvailable}
                                        onChange={handleChange}
                                        placeholder='Enter rcAvailable'
                                        className={validationErrors.rcAvailable ? " input-border" : "  "}
                                        >
                                        <option value="">please select</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </Form.Control>
                                    {validationErrors.rcAvailable && (
                                        <small className="text-danger">{validationErrors.rcAvailable}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="material_Custodian" className="mb-3">
                                    <Form.Label>material_Custodian</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="material_Custodian"
                                        value={messes.material_Custodian}
                                        onChange={handleChange}
                                        placeholder='Enter material_Custodian'
                                        className={validationErrors.material_Custodian ? " input-border" : "  "}
                                    />
                                    {validationErrors.material_Custodian && (
                                        <small className="text-danger">{validationErrors.material_Custodian}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="lowInventoryTracking" className="mb-3">
                                    <Form.Label>lowInventoryTracking</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="lowInventoryTracking"
                                        value={messes.lowInventoryTracking}
                                        onChange={handleChange}
                                        placeholder='Enter lowInventoryTracking'
                                        className={validationErrors.lowInventoryTracking ? " input-border" : "  "}
                                    />
                                    {validationErrors.lowInventoryTracking && (
                                        <small className="text-danger">{validationErrors.lowInventoryTracking}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="materialProcurement" className="mb-3">
                                    <Form.Label>materialProcurement</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="materialProcurement"
                                        value={messes.materialProcurement}
                                        onChange={handleChange}
                                        placeholder='Enter materialProcurement'
                                        className={validationErrors.materialProcurement ? " input-border" : "  "}
                                    />
                                    {validationErrors.materialProcurement && (
                                        <small className="text-danger">{validationErrors.materialProcurement}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="materialStock" className="mb-3">
                                    <Form.Label>materialStock</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="materialStock"
                                        value={messes.materialStock}
                                        onChange={handleChange}
                                        placeholder='Enter materialStock'
                                        className={validationErrors.materialStock ? " input-border" : "  "}
                                    />
                                    {validationErrors.materialStock && (
                                        <small className="text-danger">{validationErrors.materialStock}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="materialDelivery" className="mb-3">
                                    <Form.Label>materialDelivery</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="materialDelivery"
                                        value={messes.materialDelivery}
                                        onChange={handleChange}
                                        placeholder='Enter materialDelivery'
                                        className={validationErrors.materialDelivery ? " input-border" : "  "}
                                    />
                                    {validationErrors.materialDelivery && (
                                        <small className="text-danger">{validationErrors.materialDelivery}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="nvdItemGroup" className="mb-3">
                                    <Form.Label>nvdItemGroup</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="nvdItemGroup"
                                        value={messes.nvdItemGroup}
                                        onChange={handleChange}
                                        placeholder='Enter nvdItemGroup'
                                        className={validationErrors.nvdItemGroup ? " input-border" : "  "}
                                    />
                                    {validationErrors.nvdItemGroup && (
                                        <small className="text-danger">{validationErrors.nvdItemGroup}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="leadTime" className="mb-3">
                                    <Form.Label>leadTime</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="leadTime"
                                        value={messes.leadTime}
                                        onChange={handleChange}
                                        placeholder='Enter leadTime'
                                        className={validationErrors.leadTime ? " input-border" : "  "}
                                    />
                                    {validationErrors.leadTime && (
                                        <small className="text-danger">{validationErrors.leadTime}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="safetyFactor" className="mb-3">
                                    <Form.Label>safetyFactor</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="safetyFactor"
                                        value={messes.safetyFactor}
                                        onChange={handleChange}
                                        placeholder='Enter safetyFactor'
                                        className={validationErrors.safetyFactor ? " input-border" : "  "}
                                    />
                                    {validationErrors.safetyFactor && (
                                        <small className="text-danger">{validationErrors.safetyFactor}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="technicalSpecification" className="mb-3">
                                    <Form.Label>technicalSpecification</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="technicalSpecification"
                                        value={messes.technicalSpecification}
                                        onChange={handleChange}
                                        placeholder='Enter technicalSpecification'
                                        className={validationErrors.technicalSpecification ? " input-border" : "  "}
                                    />
                                    {validationErrors.technicalSpecification && (
                                        <small className="text-danger">{validationErrors.technicalSpecification}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="inspectionCategory" className="mb-3">
                                    <Form.Label>inspectionCategory</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="inspectionCategory"
                                        value={messes.inspectionCategory}
                                        onChange={handleChange}
                                        placeholder='Enter inspectionCategory'
                                        className={validationErrors.inspectionCategory ? " input-border" : "  "}
                                    />
                                    {validationErrors.inspectionCategory && (
                                        <small className="text-danger">{validationErrors.inspectionCategory}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="inspectionInHouse" className="mb-3">
                                    <Form.Label>inspectionInHouse</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="inspectionInHouse"
                                        value={messes.inspectionInHouse}
                                        onChange={handleChange}
                                        placeholder='Enter inspectionInHouse'
                                        className={validationErrors.inspectionInHouse ? " input-border" : "  "}
                                    />
                                    {validationErrors.inspectionInHouse && (
                                        <small className="text-danger">{validationErrors.inspectionInHouse}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="inspection3rdParty" className="mb-3">
                                    <Form.Label>inspection3rdParty</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="inspection3rdParty"
                                        value={messes.inspection3rdParty}
                                        onChange={handleChange}
                                        placeholder='Enter inspection3rdParty'
                                        className={validationErrors.inspection3rdParty ? " input-border" : "  "}
                                    />
                                    {validationErrors.inspection3rdParty && (
                                        <small className="text-danger">{validationErrors.inspection3rdParty}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="deliveryTime_InDays" className="mb-3">
                                    <Form.Label>deliveryTime_InDays</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="deliveryTime_InDays"
                                        value={messes.deliveryTime_InDays}
                                        onChange={handleChange}
                                        placeholder='Enter deliveryTime_InDays'
                                        className={validationErrors.deliveryTime_InDays ? " input-border" : "  "}
                                    />
                                    {validationErrors.deliveryTime_InDays && (
                                        <small className="text-danger">{validationErrors.deliveryTime_InDays}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="prApprovalBy" className="mb-3">
                                    <Form.Label>prApprovalBy</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="prApprovalBy"
                                        value={messes.prApprovalBy}
                                        onChange={handleChange}
                                        placeholder='Enter prApprovalBy'
                                        className={validationErrors.prApprovalBy ? " input-border" : "  "}
                                    />
                                    {validationErrors.prApprovalBy && (
                                        <small className="text-danger">{validationErrors.prApprovalBy}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="inventoryType" className="mb-3">
                                    <Form.Label>inventoryType</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="inventoryType"
                                        value={messes.inventoryType}
                                        onChange={handleChange}
                                        placeholder='Enter inventoryType'
                                        className={validationErrors.inventoryType ? " input-border" : "  "}
                                    />
                                    {validationErrors.inventoryType && (
                                        <small className="text-danger">{validationErrors.inventoryType}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="deliveryTime" className="mb-3">
                                    <Form.Label>deliveryTime</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="deliveryTime"
                                        value={messes.deliveryTime}
                                        onChange={handleChange}
                                        placeholder='Enter deliveryTime'
                                        className={validationErrors.deliveryTime ? " input-border" : "  "}
                                    />
                                    {validationErrors.deliveryTime && (
                                        <small className="text-danger">{validationErrors.deliveryTime}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="hoHandler" className="mb-3">
                                    <Form.Label>hoHandler</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="hoHandler"
                                        value={messes.hoHandler}
                                        onChange={handleChange}
                                        placeholder='Enter hoHandler'
                                        className={validationErrors.hoHandler ? " input-border" : "  "}
                                    />
                                    {validationErrors.hoHandler && (
                                        <small className="text-danger">{validationErrors.hoHandler}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="amp" className="mb-3">
                                    <Form.Label>amp</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="amp"
                                        value={messes.amp}
                                        onChange={handleChange}
                                        placeholder='Enter amp'
                                        className={validationErrors.amp ? " input-border" : "  "}
                                    />
                                    {validationErrors.amp && (
                                        <small className="text-danger">{validationErrors.amp}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="inputType" className="mb-3">
                                    <Form.Label>inputType</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="inputType"
                                        value={messes.inputType}
                                        onChange={handleChange}
                                        placeholder='Enter inputType'
                                        className={validationErrors.inputType ? " input-border" : "  "}
                                    />
                                    {validationErrors.inputType && (
                                        <small className="text-danger">{validationErrors.inputType}</small>
                                    )}
                                </Form.Group>
                            </Col>








                            <Col className='align-items-end d-flex justify-content-between mb-3'>
                                <div>
                                    <span className='fs-5 '>This field is required*</span>
                                </div>
                                <div>
                                    <Link to={'/pages/MaterialMaster'}>
                                        <Button variant="primary" >
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update Material' : 'Add Material'}
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

export default MaterialMasterAddEdit;