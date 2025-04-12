import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
// import Select from 'react-select';
import { toast } from 'react-toastify';
import Flatpickr from 'react-flatpickr';

interface BTS_PAYMENT {
    id: number,
    assetCode: string,
    dateOfDeployment: string,
    assetCategory: string,
    assetGroup: string,
    assetName: string,
    specification: string,
    assetMake: string,
    currentProject: string,
    assetOwnership: string,
    currentStatusATProject: string,
    transferredTo: string,
    forHSD: string,
    imsSpareInventory: string,
    assetServiceSchedule: string,
    rtoCompliance: string,
    preventiveMaintainance: string,
    preventiveMaintainanceFrequency: string,
    triggerValue: string,
    nextPMDate: string,
    operatorDriver: string,
    engineNo: string,
    chasisNo: string,
    dateOfRegistration: string,
    roadTaxValidTill: string,
    nationalPermitValidTill: string,
    statePermitValidTill: string,
    nationalPermitGoodsValidTill: string,
    fitnessValidTill: string,
    insuranceValidTill: string,
    pollutionValidTill: string,
    assetStatus: string,
    assetStatusUpdatedOn: string,
    updatedByTaskID: string,
    modifiedBy: string,
    editBy: string,
    latestServicingDate: string,
    pmChecklist: string,
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

const AssetTrackingMasterAddEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [empName, setEmpName] = useState<string | null>('')
    const [, setProjectList] = useState<ProjectList[]>([])
    const [, setStatusList] = useState<Status[]>([])
    const [, setEmployeeList] = useState<EmployeeList[]>([])
    const [messes, setMesses] = useState<BTS_PAYMENT>({
        id: 0,
        assetCode: '',
        dateOfDeployment: '',
        assetCategory: '',
        assetGroup: '',
        assetName: '',
        specification: '',
        assetMake: '',
        currentProject: '',
        assetOwnership: '',
        currentStatusATProject: '',
        transferredTo: '',
        forHSD: '',
        imsSpareInventory: '',
        assetServiceSchedule: '',
        rtoCompliance: '',
        preventiveMaintainance: '',
        preventiveMaintainanceFrequency: '',
        triggerValue: '',
        nextPMDate: '',
        operatorDriver: '',
        engineNo: '',
        chasisNo: '',
        dateOfRegistration: '',
        roadTaxValidTill: '',
        nationalPermitValidTill: '',
        statePermitValidTill: '',
        nationalPermitGoodsValidTill: '',
        fitnessValidTill: '',
        insuranceValidTill: '',
        pollutionValidTill: '',
        assetStatus: '',
        assetStatusUpdatedOn: '',
        updatedByTaskID: '',
        modifiedBy: '',
        editBy: '',
        latestServicingDate: '',
        pmChecklist: '',
        createdDate: '',
        createdBy: '',
        updatedDate: '',
        updatedBy: '',
    }
    );

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
            const response = await axios.get(`${config.API_URL_APPLICATION1}/AssetTrackingMaster/GetAssetTracking/${id}`);
            console.log('response', response)
            if (response.data.isSuccess) {
                const fetchedModule = response.data.assetTrackingMasters[0];
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


        if (!messes.assetCode) { errors.assetCode = 'Asset Code is required' }
        if (!messes.dateOfDeployment) { errors.dateOfDeployment = 'Date Of Deployment is required' }
        if (!messes.assetCategory) { errors.assetCategory = 'Asset Category is required' }
        if (!messes.assetGroup) { errors.assetGroup = 'Asset Group is required' }
        if (!messes.assetName) { errors.assetName = 'Asset Name is required' }
        if (!messes.specification) { errors.specification = 'Specification is required' }
        if (!messes.assetMake) { errors.assetMake = 'Asset Make is required' }
        if (!messes.currentProject) { errors.currentProject = 'Current Project is required' }
        if (!messes.assetOwnership) { errors.assetOwnership = 'Asset Ownership is required' }
        if (!messes.currentStatusATProject) { errors.currentStatusATProject = 'Current Status AT Project is required' }
        if (!messes.transferredTo) { errors.transferredTo = 'Transferred To is required' }
        if (!messes.forHSD) { errors.forHSD = 'For HSD is required' }
        if (!messes.imsSpareInventory) { errors.imsSpareInventory = 'Ims Spare Inventory is required' }
        if (!messes.assetServiceSchedule) { errors.assetServiceSchedule = 'Asset Service Schedule is required' }
        if (!messes.rtoCompliance) { errors.rtoCompliance = 'Rto Compliance is required' }
        if (!messes.preventiveMaintainance) { errors.preventiveMaintainance = 'Preventive Maintainance is required' }
        if (!messes.preventiveMaintainanceFrequency) { errors.preventiveMaintainanceFrequency = 'Preventive Maintainance Frequency is required' }
        if (!messes.triggerValue) { errors.triggerValue = 'Trigger Value is required' }
        if (!messes.nextPMDate) { errors.nextPMDate = 'Next PM Date is required' }
        if (!messes.operatorDriver) { errors.operatorDriver = 'Operator Driver is required' }
        if (!messes.engineNo) { errors.engineNo = 'Engine No is required' }
        if (!messes.chasisNo) { errors.chasisNo = 'Chasis No is required' }
        if (!messes.dateOfRegistration) { errors.dateOfRegistration = 'Date Of Registration is required' }
        if (!messes.roadTaxValidTill) { errors.roadTaxValidTill = 'Road Tax Valid Till is required' }
        if (!messes.nationalPermitValidTill) { errors.nationalPermitValidTill = 'National Permit Valid Till is required' }
        if (!messes.statePermitValidTill) { errors.statePermitValidTill = 'State Permit Valid Till is required' }
        if (!messes.nationalPermitGoodsValidTill) { errors.nationalPermitGoodsValidTill = 'National Permit Goods Valid Till is required' }
        if (!messes.fitnessValidTill) { errors.fitnessValidTill = 'Fitness Valid Till is required' }
        if (!messes.insuranceValidTill) { errors.insuranceValidTill = 'Insurance Valid Till is required' }
        if (!messes.pollutionValidTill) { errors.pollutionValidTill = 'Pollution Valid Till is required' }
        if (!messes.assetStatus) { errors.assetStatus = 'Asset Status is required' }
        if (!messes.assetStatusUpdatedOn) { errors.assetStatusUpdatedOn = 'Asset Status Updated On is required' }
        if (!messes.updatedByTaskID) { errors.updatedByTaskID = 'Updated By Task ID is required' }
        if (!messes.modifiedBy) { errors.modifiedBy = 'Modified By is required' }
        if (!messes.editBy) { errors.editBy = 'Edit By is required' }
        if (!messes.latestServicingDate) { errors.latestServicingDate = 'Latest Servicing Date is required' }
        if (!messes.pmChecklist) { errors.pmChecklist = 'Pm Checklist is required' }








        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };


    const handleChange = (e: ChangeEvent<any> | null, name?: string, value?: any) => {
        const validateMobileNumber = (fieldName: string, fieldValue: string) => {
            const errors: { [key: string]: string } = {};
            if (!/^\d{0,10}$/.test(fieldValue)) {
                return false;
            }

            setMesses((prevData) => ({
                ...prevData,
                [fieldName]: fieldValue,
            }));

            if (fieldValue.length === 10) {
                if (!/^[6-9]/.test(fieldValue)) {
                    errors.no = "Mobile number should start with a digit between 6 and 9.";
                    return false;
                }
            } else {
                errors.no = "Mobile number should be 10 digits only"
                setValidationErrors(errors);
                return false;
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




      
        const payload = {
            ...messes,
            createdDate: new Date(),
            createdBy: editMode ? messes.createdBy : empName,
            updatedBy: editMode ? empName : '',
            updatedDate: new Date(),
        };
        try {
            if (editMode) {
                await axios.put(`${config.API_URL_APPLICATION1}/AssetTrackingMaster/UpdateAssetTracking/${id}`, payload);
                navigate('/pages/AssetTrackingMaster', {
                    state: {
                        successMessage: "Challan Master Updated successfully!",
                    }
                });
            } else {
                await axios.post(`${config.API_URL_APPLICATION1}/AssetTrackingMaster/CreateAssetTracking`, payload);
                navigate('/pages/AssetTrackingMaster', {
                    state: {
                        successMessage: "Challan Master Added successfully!",
                    }
                });
            }
        } catch (error: any) {
            toast.error(error || 'Error Adding/Updating');
        }

    };
    const handleDateChange = (fieldName: string, selectedDates: Date[]) => {
        if (selectedDates.length > 0) {
            setMesses((prevData) => ({
                ...prevData,
                [fieldName]: selectedDates[0].toISOString().split("T")[0], // ✅ Store as YYYY-MM-DD
            }));
        }
    };
 const dateOptions = {
        enableTime: false,
        dateFormat: 'Y-m-d',
    }
    return (
        <div>
            <div className="container">
                <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center fs-20 rounded-3 border">
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit AssetTracking Master' : 'Add AssetTracking Master'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>

                            <Col lg={6}>
                                <Form.Group controlId="assetCode" className="mb-3">
                                    <Form.Label>Asset Code*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="assetCode"
                                        value={messes.assetCode}
                                        onChange={handleChange}
                                        placeholder='Enter Asset Code'
                                        disabled={editMode}
                                        className={validationErrors.assetCode ? " input-border" : "  "}
                                    />
                                    {validationErrors.assetCode && (
                                        <small className="text-danger">{validationErrors.assetCode}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="dateOfDeployment" className="mb-3">
                                    <Form.Label>Date Of Deployment*</Form.Label>
                                    <Flatpickr
                                        type="date"
                                        name="dateOfDeployment"
                                        value={messes.dateOfDeployment}
                                        onChange={(selectedDates) => handleDateChange("dateOfDeployment", selectedDates)}
                                        placeholder='Enter Date Of Deployment'
                                        disabled={editMode}
                                        options={dateOptions}
                                        className={validationErrors.dateOfDeployment ? "form-control input-border" : "form-control"}
                                    />
                                    {validationErrors.dateOfDeployment && (
                                        <small className="text-danger">{validationErrors.dateOfDeployment}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="assetCategory" className="mb-3">
                                    <Form.Label>Asset Category*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="assetCategory"
                                        value={messes.assetCategory}
                                        onChange={handleChange}
                                        placeholder='Enter Asset Category'
                                        className={validationErrors.assetCategory ? " input-border" : "  "}
                                    />
                                    {validationErrors.assetCategory && (
                                        <small className="text-danger">{validationErrors.assetCategory}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="assetGroup" className="mb-3">
                                    <Form.Label>Asset Group*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="assetGroup"
                                        value={messes.assetGroup}
                                        onChange={handleChange}
                                        placeholder='Enter Asset Group'
                                        className={validationErrors.assetGroup ? " input-border" : "  "}
                                    />
                                    {validationErrors.assetGroup && (
                                        <small className="text-danger">{validationErrors.assetGroup}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="assetName" className="mb-3">
                                    <Form.Label>Asset Name*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="assetName"
                                        placeholder='Enter Asset Name'
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
                                    <Form.Label>Specification*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="specification"
                                        value={messes.specification}
                                        onChange={handleChange}
                                        placeholder='Enter Specification'
                                        className={validationErrors.specification ? " input-border" : "  "}
                                    />
                                    {validationErrors.specification && (
                                        <small className="text-danger">{validationErrors.specification}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="assetMake" className="mb-3">
                                    <Form.Label>Asset Make*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="assetMake"
                                        value={messes.assetMake}
                                        onChange={handleChange}
                                        placeholder='Enter Asset Make'
                                        className={validationErrors.assetMake ? " input-border" : "  "}
                                    />
                                    {validationErrors.assetMake && (
                                        <small className="text-danger">{validationErrors.assetMake}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="currentProject" className="mb-3">
                                    <Form.Label>Current Project*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="currentProject"
                                        value={messes.currentProject}
                                        onChange={handleChange}
                                        placeholder='Enter Current Project'
                                        className={validationErrors.currentProject ? " input-border" : "  "}
                                    />
                                    {validationErrors.currentProject && (
                                        <small className="text-danger">{validationErrors.currentProject}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="assetOwnership" className="mb-3">
                                    <Form.Label>Asset Ownership*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="assetOwnership"
                                        value={messes.assetOwnership}
                                        onChange={handleChange}
                                        placeholder='Enter Asset Ownership'
                                        className={validationErrors.assetOwnership ? " input-border" : "  "}
                                    />
                                    {validationErrors.assetOwnership && (
                                        <small className="text-danger">{validationErrors.assetOwnership}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="currentStatusATProject" className="mb-3">
                                    <Form.Label>Current Status AT Project*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="currentStatusATProject"
                                        value={messes.currentStatusATProject}
                                        onChange={handleChange}
                                        placeholder='Enter Current Status AT Project'
                                        className={validationErrors.currentStatusATProject ? " input-border" : "  "}
                                    />
                                    {validationErrors.currentStatusATProject && (
                                        <small className="text-danger">{validationErrors.currentStatusATProject}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="transferredTo" className="mb-3">
                                    <Form.Label>Transferred To*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="transferredTo"
                                        value={messes.transferredTo}
                                        onChange={handleChange}
                                        placeholder='Enter Transferred To'
                                        className={validationErrors.transferredTo ? " input-border" : "  "}
                                    />
                                    {validationErrors.transferredTo && (
                                        <small className="text-danger">{validationErrors.transferredTo}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="forHSD" className="mb-3">
                                    <Form.Label>For HSD*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="forHSD"
                                        value={messes.forHSD}
                                        onChange={handleChange}
                                        placeholder='Enter For HSD'
                                        className={validationErrors.forHSD ? " input-border" : "  "}
                                    />
                                    {validationErrors.forHSD && (
                                        <small className="text-danger">{validationErrors.forHSD}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="imsSpareInventory" className="mb-3">
                                    <Form.Label>Ims Spare Inventory*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="imsSpareInventory"
                                        value={messes.imsSpareInventory}
                                        onChange={handleChange}
                                        placeholder='Enter Ims Spare Inventory'
                                        className={validationErrors.imsSpareInventory ? " input-border" : "  "}
                                    />
                                    {validationErrors.imsSpareInventory && (
                                        <small className="text-danger">{validationErrors.imsSpareInventory}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="assetServiceSchedule" className="mb-3">
                                    <Form.Label>Asset Service Schedule*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="assetServiceSchedule"
                                        value={messes.assetServiceSchedule}
                                        onChange={handleChange}
                                        placeholder='Enter Asset Service Schedule'
                                        className={validationErrors.assetServiceSchedule ? " input-border" : "  "}
                                    />
                                    {validationErrors.assetServiceSchedule && (
                                        <small className="text-danger">{validationErrors.assetServiceSchedule}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="rtoCompliance" className="mb-3">
                                    <Form.Label>Rto Compliance*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="rtoCompliance"
                                        value={messes.rtoCompliance}
                                        onChange={handleChange}
                                        placeholder='Enter Rto Compliance'
                                        className={validationErrors.rtoCompliance ? " input-border" : "  "}
                                    />
                                    {validationErrors.rtoCompliance && (
                                        <small className="text-danger">{validationErrors.rtoCompliance}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="preventiveMaintainance" className="mb-3">
                                    <Form.Label>Preventive Maintainance*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="preventiveMaintainance"
                                        value={messes.preventiveMaintainance}
                                        onChange={handleChange}
                                        placeholder='Enter Preventive Maintainance'
                                        className={validationErrors.preventiveMaintainance ? " input-border" : "  "}
                                    />
                                    {validationErrors.preventiveMaintainance && (
                                        <small className="text-danger">{validationErrors.preventiveMaintainance}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="preventiveMaintainanceFrequency" className="mb-3">
                                    <Form.Label>Preventive Maintainance Frequency*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="preventiveMaintainanceFrequency"
                                        value={messes.preventiveMaintainanceFrequency}
                                        onChange={handleChange}
                                        placeholder='Enter Preventive Maintainance Frequency'
                                        className={validationErrors.preventiveMaintainanceFrequency ? " input-border" : "  "}
                                    />
                                    {validationErrors.preventiveMaintainanceFrequency && (
                                        <small className="text-danger">{validationErrors.preventiveMaintainanceFrequency}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="triggerValue" className="mb-3">
                                    <Form.Label>Trigger Value*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="triggerValue"
                                        value={messes.triggerValue}
                                        onChange={handleChange}
                                        placeholder='Enter Trigger Value'
                                        className={validationErrors.triggerValue ? " input-border" : "  "}
                                    />
                                    {validationErrors.triggerValue && (
                                        <small className="text-danger">{validationErrors.triggerValue}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="nextPMDate" className="mb-3">
                                    <Form.Label>Next PM Date*</Form.Label>
                                    <Flatpickr
                                        type="text"
                                        name="nextPMDate"
                                        value={messes.nextPMDate}
                                        onChange={(selectedDates) => handleDateChange("nextPMDate", selectedDates)}
                                        options={dateOptions}
                                        placeholder='Enter Next PM Date'
                                        className={validationErrors.nextPMDate ? "form-control input-border" : "form-control"}
                                    />
                                    {validationErrors.nextPMDate && (
                                        <small className="text-danger">{validationErrors.nextPMDate}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="operatorDriver" className="mb-3">
                                    <Form.Label>Operator Driver*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="operatorDriver"
                                        value={messes.operatorDriver}
                                        onChange={handleChange}
                                        placeholder='Enter Operator Driver'
                                        className={validationErrors.operatorDriver ? " input-border" : "  "}
                                    />
                                    {validationErrors.operatorDriver && (
                                        <small className="text-danger">{validationErrors.operatorDriver}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="engineNo" className="mb-3">
                                    <Form.Label>Engine No*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="engineNo"
                                        value={messes.engineNo}
                                        onChange={handleChange}
                                        placeholder='Enter Engine No'
                                        className={validationErrors.engineNo ? " input-border" : "  "}
                                    />
                                    {validationErrors.engineNo && (
                                        <small className="text-danger">{validationErrors.engineNo}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="chasisNo" className="mb-3">
                                    <Form.Label>Chasis No*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="chasisNo"
                                        value={messes.chasisNo}
                                        onChange={handleChange}
                                        placeholder='Enter Chasis No'
                                        className={validationErrors.chasisNo ? " input-border" : "  "}
                                    />
                                    {validationErrors.chasisNo && (
                                        <small className="text-danger">{validationErrors.chasisNo}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="dateOfRegistration" className="mb-3">
                                    <Form.Label>Date Of Registration*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="dateOfRegistration"
                                        value={messes.dateOfRegistration}
                                        onChange={handleChange}
                                        placeholder='Enter Date Of Registration'
                                        className={validationErrors.dateOfRegistration ? " input-border" : "  "}
                                    />
                                    {validationErrors.dateOfRegistration && (
                                        <small className="text-danger">{validationErrors.dateOfRegistration}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="roadTaxValidTill" className="mb-3">
                                    <Form.Label>Road Tax Valid Till*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="roadTaxValidTill"
                                        value={messes.roadTaxValidTill}
                                        onChange={handleChange}
                                        placeholder='Enter Road Tax Valid Till'
                                        className={validationErrors.roadTaxValidTill ? " input-border" : "  "}
                                    />
                                    {validationErrors.roadTaxValidTill && (
                                        <small className="text-danger">{validationErrors.roadTaxValidTill}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="nationalPermitValidTill" className="mb-3">
                                    <Form.Label>National Permit Valid Till*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="nationalPermitValidTill"
                                        value={messes.nationalPermitValidTill}
                                        onChange={handleChange}
                                        placeholder='Enter National Permit Valid Till'
                                        className={validationErrors.nationalPermitValidTill ? " input-border" : "  "}
                                    />
                                    {validationErrors.nationalPermitValidTill && (
                                        <small className="text-danger">{validationErrors.nationalPermitValidTill}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="statePermitValidTill" className="mb-3">
                                    <Form.Label>State Permit Valid Till*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="statePermitValidTill"
                                        value={messes.statePermitValidTill}
                                        onChange={handleChange}
                                        placeholder='Enter State Permit Valid Till'
                                        className={validationErrors.statePermitValidTill ? " input-border" : "  "}
                                    />
                                    {validationErrors.statePermitValidTill && (
                                        <small className="text-danger">{validationErrors.statePermitValidTill}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="nationalPermitGoodsValidTill" className="mb-3">
                                    <Form.Label>National Permit Goods Valid Till*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="nationalPermitGoodsValidTill"
                                        value={messes.nationalPermitGoodsValidTill}
                                        onChange={handleChange}
                                        placeholder='Enter National Permit Goods Valid Till'
                                        className={validationErrors.nationalPermitGoodsValidTill ? " input-border" : "  "}
                                    />
                                    {validationErrors.nationalPermitGoodsValidTill && (
                                        <small className="text-danger">{validationErrors.nationalPermitGoodsValidTill}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="fitnessValidTill" className="mb-3">
                                    <Form.Label>Fitness Valid Till*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="fitnessValidTill"
                                        value={messes.fitnessValidTill}
                                        onChange={handleChange}
                                        placeholder='Enter Fitness Valid Till'
                                        className={validationErrors.fitnessValidTill ? " input-border" : "  "}
                                    />
                                    {validationErrors.fitnessValidTill && (
                                        <small className="text-danger">{validationErrors.fitnessValidTill}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="insuranceValidTill" className="mb-3">
                                    <Form.Label>Insurance Valid Till*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="insuranceValidTill"
                                        value={messes.insuranceValidTill}
                                        onChange={handleChange}
                                        placeholder='Enter Insurance Valid Till'
                                        className={validationErrors.insuranceValidTill ? " input-border" : "  "}
                                    />
                                    {validationErrors.insuranceValidTill && (
                                        <small className="text-danger">{validationErrors.insuranceValidTill}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="pollutionValidTill" className="mb-3">
                                    <Form.Label>Pollution Valid Till*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="pollutionValidTill"
                                        value={messes.pollutionValidTill}
                                        onChange={handleChange}
                                        placeholder='Enter Pollution Valid Till'
                                        className={validationErrors.pollutionValidTill ? " input-border" : "  "}
                                    />
                                    {validationErrors.pollutionValidTill && (
                                        <small className="text-danger">{validationErrors.pollutionValidTill}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="assetStatus" className="mb-3">
                                    <Form.Label>Asset Status*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="assetStatus"
                                        value={messes.assetStatus}
                                        onChange={handleChange}
                                        placeholder='Enter Asset Status'
                                        className={validationErrors.assetStatus ? " input-border" : "  "}
                                    />
                                    {validationErrors.assetStatus && (
                                        <small className="text-danger">{validationErrors.assetStatus}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="assetStatusUpdatedOn" className="mb-3">
                                    <Form.Label>Asset Status Updated On*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="assetStatusUpdatedOn"
                                        value={messes.assetStatusUpdatedOn}
                                        onChange={handleChange}
                                        placeholder='Enter Asset Status Updated On'
                                        className={validationErrors.assetStatusUpdatedOn ? " input-border" : "  "}
                                    />
                                    {validationErrors.assetStatusUpdatedOn && (
                                        <small className="text-danger">{validationErrors.assetStatusUpdatedOn}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="updatedByTaskID" className="mb-3">
                                    <Form.Label>Updated By Task ID*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="updatedByTaskID"
                                        value={messes.updatedByTaskID}
                                        onChange={handleChange}
                                        placeholder='Enter Updated By Task ID'
                                        className={validationErrors.updatedByTaskID ? " input-border" : "  "}
                                    />
                                    {validationErrors.updatedByTaskID && (
                                        <small className="text-danger">{validationErrors.updatedByTaskID}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="modifiedBy" className="mb-3">
                                    <Form.Label>ModifiedBy*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="modifiedBy"
                                        value={messes.modifiedBy}
                                        onChange={handleChange}
                                        placeholder='Enter ModifiedBy'
                                        className={validationErrors.modifiedBy ? " input-border" : "  "}
                                    />
                                    {validationErrors.modifiedBy && (
                                        <small className="text-danger">{validationErrors.modifiedBy}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="editBy" className="mb-3">
                                    <Form.Label>Edit By*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="editBy"
                                        value={messes.editBy}
                                        onChange={handleChange}
                                        placeholder='Enter Edit By'
                                        className={validationErrors.editBy ? " input-border" : "  "}
                                    />
                                    {validationErrors.editBy && (
                                        <small className="text-danger">{validationErrors.editBy}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="latestServicingDate" className="mb-3">
                                    <Form.Label>Latest Servicing Date*</Form.Label>
                                    <Flatpickr
                                        type="text"
                                        name="latestServicingDate"
                                        value={messes.latestServicingDate}
                                        onChange={(selectedDates) => handleDateChange("latestServicingDate", selectedDates)}
                                        options={dateOptions}
                                        placeholder='Enter Latest Servicing Date'
                                        className={validationErrors.latestServicingDate ? "form-control input-border" : "form-control"}
                                    />
                                    {validationErrors.latestServicingDate && (
                                        <small className="text-danger">{validationErrors.latestServicingDate}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="pmChecklist" className="mb-3">
                                    <Form.Label>Pm Checklist*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="pmChecklist"
                                        value={messes.pmChecklist}
                                        onChange={handleChange}
                                        placeholder='Enter Pm Checklist'
                                        className={validationErrors.pmChecklist ? " input-border" : "  "}
                                    />
                                    {validationErrors.pmChecklist && (
                                        <small className="text-danger">{validationErrors.pmChecklist}</small>
                                    )}
                                </Form.Group>
                            </Col>






                            <Col className='align-items-end d-flex justify-content-between mb-3'>
                                <div>
                                    <span className='fs-5 '>This field is required*</span>
                                </div>
                                <div>
                                    <Link to={'/pages/AssetTrackingMaster'}>
                                        <Button variant="primary" >
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update AssetTracking' : 'Add AssetTracking'}
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

export default AssetTrackingMasterAddEdit;