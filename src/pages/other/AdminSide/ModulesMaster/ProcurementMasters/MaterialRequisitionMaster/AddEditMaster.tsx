import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
// import Select from 'react-select';
import { toast } from 'react-toastify';


interface BTS_PAYMENT {
    id: number,
    timeStamp: string,
    projectID: string,
    projectName: string,
    materialGroup: string,
    materialName: string,
    specification: string,
    otherSpecification: string,
    unit: string,
    requisitionQuantity: number,
    source: string,
    requesterEmpID: string,
    requesterEmpName: string,
    coreCategory: string,
    code: string,
    qty: number,
    prNo: string,
    uploadPR: string,
    acceptedQty: number,
    prQty: number,
    rejectQty: number,
    otherJV: number,
    stpR_Multiple: number,
    reconcileQtyPR_Reject_OtherJV_STPR: string,
    reconsileQtyPO_STPO_Local: string,
    reconsileScheduleLotQty: string,
    reconsileDispatchedLotQty: string,
    reconsileRejectQty: string,
    reconsileShortCloseQty: string,
    reconsileReorderQty: string,
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

const MaterialRequisitionMasterAddEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [empName, setEmpName] = useState<string | null>('')
    const [, setProjectList] = useState<ProjectList[]>([])
    const [, setStatusList] = useState<Status[]>([])
    const [, setEmployeeList] = useState<EmployeeList[]>([])
    const [messes, setMesses] = useState<BTS_PAYMENT>({
        id: 0,
        timeStamp: '',
        projectID: '',
        projectName: '',
        materialGroup: '',
        materialName: '',
        specification: '',
        otherSpecification: '',
        unit: '',
        requisitionQuantity: 0,
        source: '',
        requesterEmpID: '',
        requesterEmpName: '',
        coreCategory: '',
        code: '',
        qty: 0,
        prNo: '',
        uploadPR: '',
        acceptedQty: 0,
        prQty: 0,
        rejectQty: 0,
        otherJV: 0,
        stpR_Multiple: 0,
        reconcileQtyPR_Reject_OtherJV_STPR: '',
        reconsileQtyPO_STPO_Local: '',
        reconsileScheduleLotQty: '',
        reconsileDispatchedLotQty: '',
        reconsileRejectQty: '',
        reconsileShortCloseQty: '',
        reconsileReorderQty: '',
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
            const response = await axios.get(`${config.API_URL_APPLICATION1}/MaterialRequisitionMaster/GetMaterialRequisition/${id}`);
            console.log('response', response)
            if (response.data.isSuccess) {
                const fetchedModule = response.data.materialRequisitionMasters[0];
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


if(!messes.timeStamp) { errors.timeStamp = 'timeStamp is required'}
if(!messes.projectID) { errors.projectID = 'projectID is required'}
if(!messes.projectName) { errors.projectName = 'projectName is required'}
if(!messes.materialGroup) { errors.materialGroup = 'materialGroup is required'}
if(!messes.materialName) { errors.materialName = 'materialName is required'}
if(!messes.specification) { errors.specification = 'specification is required'}
if(!messes.otherSpecification) { errors.otherSpecification = 'otherSpecification is required'}
if(!messes.unit) { errors.unit = 'unit is required'}
if(!messes.requisitionQuantity) { errors.requisitionQuantity = 'requisitionQuantity is required'}
if(!messes.source) { errors.source = 'source is required'}
if(!messes.requesterEmpID) { errors.requesterEmpID = 'requesterEmpID is required'}
if(!messes.requesterEmpName) { errors.requesterEmpName = 'requesterEmpName is required'}
if(!messes.coreCategory) { errors.coreCategory = 'coreCategory is required'}
if(!messes.code) { errors.code = 'code is required'}
if(!messes.qty) { errors.qty = 'qty is required'}
if(!messes.prNo) { errors.prNo = 'prNo is required'}
if(!messes.uploadPR) { errors.uploadPR = 'uploadPR is required'}
if(!messes.acceptedQty) { errors.acceptedQty = 'acceptedQty is required'}
if(!messes.prQty) { errors.prQty = 'prQty is required'}
if(!messes.rejectQty) { errors.rejectQty = 'rejectQty is required'}
if(!messes.otherJV) { errors.otherJV = 'otherJV is required'}
if(!messes.stpR_Multiple) { errors.stpR_Multiple = 'stpR_Multiple is required'}
if(!messes.reconcileQtyPR_Reject_OtherJV_STPR) { errors.reconcileQtyPR_Reject_OtherJV_STPR = 'reconcileQtyPR_Reject_OtherJV_STPR is required'}
if(!messes.reconsileQtyPO_STPO_Local) { errors.reconsileQtyPO_STPO_Local = 'reconsileQtyPO_STPO_Local is required'}
if(!messes.reconsileScheduleLotQty) { errors.reconsileScheduleLotQty = 'reconsileScheduleLotQty is required'}
if(!messes.reconsileDispatchedLotQty) { errors.reconsileDispatchedLotQty = 'reconsileDispatchedLotQty is required'}
if(!messes.reconsileRejectQty) { errors.reconsileRejectQty = 'reconsileRejectQty is required'}
if(!messes.reconsileShortCloseQty) { errors.reconsileShortCloseQty = 'reconsileShortCloseQty is required'}
if(!messes.reconsileReorderQty) { errors.reconsileReorderQty = 'reconsileReorderQty is required'}

       



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
                await axios.put(`${config.API_URL_APPLICATION1}/MaterialRequisitionMaster/UpdateMaterialRequisition/${id}`, payload);
                navigate('/pages/MaterialRequisitionMaster', {
                    state: {
                        successMessage: "Challan Master Updated successfully!",
                    }
                });
            } else {
                await axios.post(`${config.API_URL_APPLICATION1}/MaterialRequisitionMaster/CreateMaterialRequisition`, payload);
                navigate('/pages/MaterialRequisitionMaster', {
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
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit MaterialRequisition Master' : 'Add MaterialRequisition Master'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>

                            <Col lg={6}>
                                <Form.Group controlId="timeStamp" className="mb-3">
                                    <Form.Label>timeStamp</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="timeStamp"
                                        value={messes.timeStamp}
                                        onChange={handleChange}
                                        placeholder='Enter timeStamp'
                                        disabled={editMode}
                                        className={validationErrors.timeStamp ? " input-border" : "  "}
                                    />
                                    {validationErrors.timeStamp && (
                                        <small className="text-danger">{validationErrors.timeStamp}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="projectID" className="mb-3">
                                    <Form.Label>projectID</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="projectID"
                                        value={messes.projectID}
                                        onChange={handleChange}
                                        placeholder='Enter projectID'
                                        disabled={editMode}
                                        className={validationErrors.projectID ? " input-border" : "  "}
                                    />
                                    {validationErrors.projectID && (
                                        <small className="text-danger">{validationErrors.projectID}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="projectName" className="mb-3">
                                    <Form.Label>projectName</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="projectName"
                                        value={messes.projectName}
                                        onChange={handleChange}
                                        placeholder='Enter projectName'
                                        disabled={editMode}
                                        className={validationErrors.projectName ? " input-border" : "  "}
                                    />
                                    {validationErrors.projectName && (
                                        <small className="text-danger">{validationErrors.projectName}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="materialGroup" className="mb-3">
                                    <Form.Label>materialGroup</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="materialGroup"
                                        value={messes.materialGroup}
                                        onChange={handleChange}
                                        placeholder='Enter materialGroup'
                                        disabled={editMode}
                                        className={validationErrors.materialGroup ? " input-border" : "  "}
                                    />
                                    {validationErrors.materialGroup && (
                                        <small className="text-danger">{validationErrors.materialGroup}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="materialName" className="mb-3">
                                    <Form.Label>materialName</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="materialName"
                                        value={messes.materialName}
                                        onChange={handleChange}
                                        placeholder='Enter Project ID'
                                        className={validationErrors.materialName ? " input-border" : "  "}
                                    />
                                    {validationErrors.materialName && (
                                        <small className="text-danger">{validationErrors.materialName}</small>
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
                                        placeholder='Enter Project Name'
                                        className={validationErrors.specification ? " input-border" : "  "}
                                    />
                                    {validationErrors.specification && (
                                        <small className="text-danger">{validationErrors.specification}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="otherSpecification" className="mb-3">
                                    <Form.Label>otherSpecification</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="otherSpecification"
                                        value={messes.otherSpecification}
                                        onChange={handleChange}
                                        className={validationErrors.otherSpecification ? "input-border" : ""}
                                    />

                                    {validationErrors.otherSpecification && (
                                        <small className="text-danger">{validationErrors.otherSpecification}</small>
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
                            <Col lg={6}>
                                <Form.Group controlId="requisitionQuantity" className="mb-3">
                                    <Form.Label>requisitionQuantity</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="requisitionQuantity"
                                        value={messes.requisitionQuantity}
                                        onChange={handleChange}
                                        placeholder='Enter requisitionQuantity'
                                        className={validationErrors.requisitionQuantity ? " input-border" : "  "}
                                    />
                                    {validationErrors.requisitionQuantity && (
                                        <small className="text-danger">{validationErrors.requisitionQuantity}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="source" className="mb-3">
                                    <Form.Label>source</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="source"
                                        value={messes.source}
                                        onChange={handleChange}
                                        placeholder='Enter source'
                                        className={validationErrors.source ? " input-border" : "  "}
                                    />
                                    {validationErrors.source && (
                                        <small className="text-danger">{validationErrors.source}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="requesterEmpID" className="mb-3">
                                    <Form.Label>requesterEmpID</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="requesterEmpID"
                                        value={messes.requesterEmpID}
                                        onChange={handleChange}
                                        placeholder='Enter requesterEmpID'
                                        className={validationErrors.requesterEmpID ? " input-border" : "  "}
                                    />
                                    {validationErrors.requesterEmpID && (
                                        <small className="text-danger">{validationErrors.requesterEmpID}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            
                            <Col lg={6}>
                                <Form.Group controlId="requesterEmpName" className="mb-3">
                                    <Form.Label>requesterEmpName</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="requesterEmpName"
                                        value={messes.requesterEmpName}
                                        onChange={handleChange}
                                        placeholder='Enter requesterEmpName'
                                        className={validationErrors.requesterEmpName ? " input-border" : "  "}
                                    />
                                    {validationErrors.requesterEmpName && (
                                        <small className="text-danger">{validationErrors.requesterEmpName}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="coreCategory" className="mb-3">
                                    <Form.Label>coreCategory</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="coreCategory"
                                        value={messes.coreCategory}
                                        onChange={handleChange}
                                        placeholder='Enter coreCategory'
                                        className={validationErrors.coreCategory ? " input-border" : "  "}
                                    />
                                    {validationErrors.coreCategory && (
                                        <small className="text-danger">{validationErrors.coreCategory}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="code" className="mb-3">
                                    <Form.Label>code</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="code"
                                        value={messes.code}
                                        onChange={handleChange}
                                        placeholder='Enter code'
                                        className={validationErrors.code ? " input-border" : "  "}
                                    />
                                    {validationErrors.code && (
                                        <small className="text-danger">{validationErrors.code}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="qty" className="mb-3">
                                    <Form.Label>qty</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="qty"
                                        value={messes.qty}
                                        onChange={handleChange}
                                        placeholder='Enter qty'
                                        className={validationErrors.qty ? " input-border" : "  "}
                                    />
                                    {validationErrors.qty && (
                                        <small className="text-danger">{validationErrors.qty}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="prNo" className="mb-3">
                                    <Form.Label>prNo</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="prNo"
                                        value={messes.prNo}
                                        onChange={handleChange}
                                        placeholder='Enter prNo'
                                        className={validationErrors.prNo ? " input-border" : "  "}
                                    />
                                    {validationErrors.prNo && (
                                        <small className="text-danger">{validationErrors.prNo}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="uploadPR" className="mb-3">
                                    <Form.Label>uploadPR</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="uploadPR"
                                        value={messes.uploadPR}
                                        onChange={handleChange}
                                        placeholder='Enter uploadPR'
                                        className={validationErrors.uploadPR ? " input-border" : "  "}
                                    />
                                    {validationErrors.uploadPR && (
                                        <small className="text-danger">{validationErrors.uploadPR}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            
                            <Col lg={6}>
                                <Form.Group controlId="acceptedQty" className="mb-3">
                                    <Form.Label>acceptedQty</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="acceptedQty"
                                        value={messes.acceptedQty}
                                        onChange={handleChange}
                                        placeholder='Enter acceptedQty'
                                        className={validationErrors.acceptedQty ? " input-border" : "  "}
                                    />
                                    {validationErrors.acceptedQty && (
                                        <small className="text-danger">{validationErrors.acceptedQty}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="prQty" className="mb-3">
                                    <Form.Label>prQty</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="prQty"
                                        value={messes.prQty}
                                        onChange={handleChange}
                                        placeholder='Enter prQty'
                                        className={validationErrors.prQty ? " input-border" : "  "}
                                    />
                                    {validationErrors.prQty && (
                                        <small className="text-danger">{validationErrors.prQty}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="rejectQty" className="mb-3">
                                    <Form.Label>rejectQty</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="rejectQty"
                                        value={messes.rejectQty}
                                        onChange={handleChange}
                                        placeholder='Enter rejectQty'
                                        className={validationErrors.rejectQty ? " input-border" : "  "}
                                    />
                                    {validationErrors.rejectQty && (
                                        <small className="text-danger">{validationErrors.rejectQty}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="otherJV" className="mb-3">
                                    <Form.Label>otherJV</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="otherJV"
                                        value={messes.otherJV}
                                        onChange={handleChange}
                                        placeholder='Enter otherJV'
                                        className={validationErrors.otherJV ? " input-border" : "  "}
                                    />
                                    {validationErrors.otherJV && (
                                        <small className="text-danger">{validationErrors.otherJV}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            
                            <Col lg={6}>
                                <Form.Group controlId="stpR_Multiple" className="mb-3">
                                    <Form.Label>stpR_Multiple</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="stpR_Multiple"
                                        value={messes.stpR_Multiple}
                                        onChange={handleChange}
                                        placeholder='Enter stpR_Multiple'
                                        className={validationErrors.stpR_Multiple ? " input-border" : "  "}
                                    />
                                    {validationErrors.stpR_Multiple && (
                                        <small className="text-danger">{validationErrors.stpR_Multiple}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="reconcileQtyPR_Reject_OtherJV_STPR" className="mb-3">
                                    <Form.Label>reconcileQtyPR_Reject_OtherJV_STPR</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="reconcileQtyPR_Reject_OtherJV_STPR"
                                        value={messes.reconcileQtyPR_Reject_OtherJV_STPR}
                                        onChange={handleChange}
                                        placeholder='Enter reconcileQtyPR_Reject_OtherJV_STPR'
                                        className={validationErrors.reconcileQtyPR_Reject_OtherJV_STPR ? " input-border" : "  "}
                                    />
                                    {validationErrors.reconcileQtyPR_Reject_OtherJV_STPR && (
                                        <small className="text-danger">{validationErrors.reconcileQtyPR_Reject_OtherJV_STPR}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            
                            <Col lg={6}>
                                <Form.Group controlId="reconsileQtyPO_STPO_Local" className="mb-3">
                                    <Form.Label>reconsileQtyPO_STPO_Local</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="reconsileQtyPO_STPO_Local"
                                        value={messes.reconsileQtyPO_STPO_Local}
                                        onChange={handleChange}
                                        placeholder='Enter reconsileQtyPO_STPO_Local'
                                        className={validationErrors.reconsileQtyPO_STPO_Local ? " input-border" : "  "}
                                    />
                                    {validationErrors.reconsileQtyPO_STPO_Local && (
                                        <small className="text-danger">{validationErrors.reconsileQtyPO_STPO_Local}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="reconsileScheduleLotQty" className="mb-3">
                                    <Form.Label>reconsileScheduleLotQty</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="reconsileScheduleLotQty"
                                        value={messes.reconsileScheduleLotQty}
                                        onChange={handleChange}
                                        placeholder='Enter reconsileScheduleLotQty'
                                        className={validationErrors.reconsileScheduleLotQty ? " input-border" : "  "}
                                    />
                                    {validationErrors.reconsileScheduleLotQty && (
                                        <small className="text-danger">{validationErrors.reconsileScheduleLotQty}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="reconsileDispatchedLotQty" className="mb-3">
                                    <Form.Label>reconsileDispatchedLotQty</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="reconsileDispatchedLotQty"
                                        value={messes.reconsileDispatchedLotQty}
                                        onChange={handleChange}
                                        placeholder='Enter reconsileDispatchedLotQty'
                                        className={validationErrors.reconsileDispatchedLotQty ? " input-border" : "  "}
                                    />
                                    {validationErrors.reconsileDispatchedLotQty && (
                                        <small className="text-danger">{validationErrors.reconsileDispatchedLotQty}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="reconsileRejectQty" className="mb-3">
                                    <Form.Label>reconsileRejectQty</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="reconsileRejectQty"
                                        value={messes.reconsileRejectQty}
                                        onChange={handleChange}
                                        placeholder='Enter reconsileRejectQty'
                                        className={validationErrors.reconsileRejectQty ? " input-border" : "  "}
                                    />
                                    {validationErrors.reconsileRejectQty && (
                                        <small className="text-danger">{validationErrors.reconsileRejectQty}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="reconsileShortCloseQty" className="mb-3">
                                    <Form.Label>reconsileShortCloseQty</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="reconsileShortCloseQty"
                                        value={messes.reconsileShortCloseQty}
                                        onChange={handleChange}
                                        placeholder='Enter reconsileShortCloseQty'
                                        className={validationErrors.reconsileShortCloseQty ? " input-border" : "  "}
                                    />
                                    {validationErrors.reconsileShortCloseQty && (
                                        <small className="text-danger">{validationErrors.reconsileShortCloseQty}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="reconsileReorderQty" className="mb-3">
                                    <Form.Label>reconsileReorderQty</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="reconsileReorderQty"
                                        value={messes.reconsileReorderQty}
                                        onChange={handleChange}
                                        placeholder='Enter reconsileReorderQty'
                                        className={validationErrors.reconsileReorderQty ? " input-border" : "  "}
                                    />
                                    {validationErrors.reconsileReorderQty && (
                                        <small className="text-danger">{validationErrors.reconsileReorderQty}</small>
                                    )}
                                </Form.Group>
                            </Col>
                           








                            <Col className='align-items-end d-flex justify-content-between mb-3'>
                                <div>
                                    <span className='fs-5 '>This field is required*</span>
                                </div>
                                <div>
                                    <Link to={'/pages/MaterialRequisitionMaster'}>
                                        <Button variant="primary" >
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update MaterialRequisition' : 'Add MaterialRequisition'}
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

export default MaterialRequisitionMasterAddEdit;