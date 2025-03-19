import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
// import Select from 'react-select';
import { toast } from 'react-toastify';


interface BTS_PAYMENT {
    id: number,
    entryDate: string,
    projectID: string,
    projectName: string,
    assetName: string,
    specification: string,
    otherSpecification: string,
    requisitionQuantity: string,
    unit: string,
    source: string,
    requesterEmpID: string,
    requesterEmpName: string,
    coreCategory: string,
    acceptedQty: string,
    code: string,
    reconcileQtyPR_Local: string,
    reconsileQtyPO_STPO_Local: string,
    reconsileScheduleLotQty: string,
    reconsileDispatchedLotQty: string,
    reconsileRejectQty: string,
    reconsileShortCloseQty: string,
    reconsileReOrderQty: string,
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

const PMRequisitionMasterAddEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [empName, setEmpName] = useState<string | null>('')
    const [, setProjectList] = useState<ProjectList[]>([])
    const [, setStatusList] = useState<Status[]>([])
    const [, setEmployeeList] = useState<EmployeeList[]>([])
    const [messes, setMesses] = useState<BTS_PAYMENT>({
        id: 0,
        entryDate: '',
        projectID: '',
        projectName: '',
        assetName: '',
        specification: '',
        otherSpecification: '',
        requisitionQuantity: '',
        unit: '',
        source: '',
        requesterEmpID: '',
        requesterEmpName: '',
        coreCategory: '',
        acceptedQty: '',
        code: '',
        reconcileQtyPR_Local: '',
        reconsileQtyPO_STPO_Local: '',
        reconsileScheduleLotQty: '',
        reconsileDispatchedLotQty: '',
        reconsileRejectQty: '',
        reconsileShortCloseQty: '',
        reconsileReOrderQty: '',
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
            const response = await axios.get(`${config.API_URL_APPLICATION1}/PMRequisitionMaster/GetPMRequisition/${id}`);
            console.log('response', response)
            if (response.data.isSuccess) {
                const fetchedModule = response.data.pmRequisitionMasters[0];
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


if(!messes.entryDate) { errors.entryDate = 'entryDate is required'}
if(!messes.projectID) { errors.projectID = 'projectID is required'}
if(!messes.projectName) { errors.projectName = 'projectName is required'}
if(!messes.assetName) { errors.assetName = 'assetName is required'}
if(!messes.specification) { errors.specification = 'specification is required'}
if(!messes.otherSpecification) { errors.otherSpecification = 'otherSpecification is required'}
if(!messes.requisitionQuantity) { errors.requisitionQuantity = 'requisitionQuantity is required'}
if(!messes.unit) { errors.unit = 'unit is required'}
if(!messes.source) { errors.source = 'source is required'}
if(!messes.requesterEmpID) { errors.requesterEmpID = 'requesterEmpID is required'}
if(!messes.requesterEmpName) { errors.requesterEmpName = 'requesterEmpName is required'}
if(!messes.coreCategory) { errors.coreCategory = 'coreCategory is required'}
if(!messes.acceptedQty) { errors.acceptedQty = 'acceptedQty is required'}
if(!messes.code) { errors.code = 'code is required'}
if(!messes.reconcileQtyPR_Local) { errors.reconcileQtyPR_Local = 'reconcileQtyPR_Local is required'}
if(!messes.reconsileQtyPO_STPO_Local) { errors.reconsileQtyPO_STPO_Local = 'reconsileQtyPO_STPO_Local is required'}
if(!messes.reconsileScheduleLotQty) { errors.reconsileScheduleLotQty = 'reconsileScheduleLotQty is required'}
if(!messes.reconsileDispatchedLotQty) { errors.reconsileDispatchedLotQty = 'reconsileDispatchedLotQty is required'}
if(!messes.reconsileRejectQty) { errors.reconsileRejectQty = 'reconsileRejectQty is required'}
if(!messes.reconsileShortCloseQty) { errors.reconsileShortCloseQty = 'reconsileShortCloseQty is required'}
if(!messes.reconsileReOrderQty) { errors.reconsileReOrderQty = 'reconsileReOrderQty is required'}



       



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
                await axios.put(`${config.API_URL_APPLICATION1}/PMRequisitionMaster/UpdatePMRequisition/${id}`, payload);
                navigate('/pages/PMRequisitionMaster', {
                    state: {
                        successMessage: "Challan Master Updated successfully!",
                    }
                });
            } else {
                await axios.post(`${config.API_URL_APPLICATION1}/PMRequisitionMaster/CreatePMRequisition`, payload);
                navigate('/pages/PMRequisitionMaster', {
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
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit PMRequisition Master' : 'Add PMRequisition Master'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>

                            <Col lg={6}>
                                <Form.Group controlId="entryDate" className="mb-3">
                                    <Form.Label>entryDate</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="entryDate"
                                        value={messes.entryDate}
                                        onChange={handleChange}
                                        placeholder='Enter entryDate'
                                        disabled={editMode}
                                        className={validationErrors.entryDate ? " input-border" : "  "}
                                    />
                                    {validationErrors.entryDate && (
                                        <small className="text-danger">{validationErrors.entryDate}</small>
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
                                <Form.Group controlId="assetName" className="mb-3">
                                    <Form.Label>assetName</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="assetName"
                                        value={messes.assetName}
                                        onChange={handleChange}
                                        placeholder='Enter assetName'
                                        disabled={editMode}
                                        className={validationErrors.assetName ? " input-border" : "  "}
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
                                        placeholder='Enter Project ID'
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
                                        placeholder='Enter Project Name'
                                        className={validationErrors.otherSpecification ? " input-border" : "  "}
                                    />
                                    {validationErrors.otherSpecification && (
                                        <small className="text-danger">{validationErrors.otherSpecification}</small>
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
                                        className={validationErrors.requisitionQuantity ? "input-border" : ""}
                                    />

                                    {validationErrors.requisitionQuantity && (
                                        <small className="text-danger">{validationErrors.requisitionQuantity}</small>
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
                                        type="number"
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
                                <Form.Group controlId="reconcileQtyPR_Local" className="mb-3">
                                    <Form.Label>reconcileQtyPR_Local</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="reconcileQtyPR_Local"
                                        value={messes.reconcileQtyPR_Local}
                                        onChange={handleChange}
                                        placeholder='Enter reconcileQtyPR_Local'
                                        className={validationErrors.reconcileQtyPR_Local ? " input-border" : "  "}
                                    />
                                    {validationErrors.reconcileQtyPR_Local && (
                                        <small className="text-danger">{validationErrors.reconcileQtyPR_Local}</small>
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
                                <Form.Group controlId="reconsileReOrderQty" className="mb-3">
                                    <Form.Label>reconsileReOrderQty</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="reconsileReOrderQty"
                                        value={messes.reconsileReOrderQty}
                                        onChange={handleChange}
                                        placeholder='Enter reconsileReOrderQty'
                                        className={validationErrors.reconsileReOrderQty ? " input-border" : "  "}
                                    />
                                    {validationErrors.reconsileReOrderQty && (
                                        <small className="text-danger">{validationErrors.reconsileReOrderQty}</small>
                                    )}
                                </Form.Group>
                            </Col>
                           
                           








                            <Col className='align-items-end d-flex justify-content-between mb-3'>
                                <div>
                                    <span className='fs-5 '>This field is required*</span>
                                </div>
                                <div>
                                    <Link to={'/pages/PMRequisitionMaster'}>
                                        <Button variant="primary" >
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update PMRequisition' : 'Add PMRequisition'}
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

export default PMRequisitionMasterAddEdit;