import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
import Select from 'react-select';
import { toast } from 'react-toastify';


interface BTS_PAYMENT {
    id: number
    BillEntryDate: string;
    BTSID: string;
    ProjectID : string;
    ProjectName: string;
    PaymentRequestedFor: string;
    ReceiptType: string;
    No: string;
    Amount: string;
    Date: string;
    PaymentDueDate: string;
    GSTHoldAmount: string;
    RetentionHoldAmount: string;
    RoyaltyDeduction: string;
    OtherDeductionAmount: string;
    NetPayableAmount: string;
    PendingAmount: string;
    CourierDispatchDate: string;
    FRorIOMNumber: string;
    FRAmount: string;
    ApprovedAmount: string;
    CreatedDate: string;
    CreatedBy: string;
    UpdatedDate: string;
    UpdatedBy: string;
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

const BTSPaymentMasterAddEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [empName, setEmpName] = useState<string | null>('')
    const [projectList, setProjectList] = useState<ProjectList[]>([])
    const [statusList, setStatusList] = useState<Status[]>([])
    const [employeeList, setEmployeeList] = useState<EmployeeList[]>([])
    const [messes, setMesses] = useState<BTS_PAYMENT>({
        id: 0,
        BillEntryDate: '',
        BTSID: '',
        ProjectID : '',
        ProjectName: '',
        PaymentRequestedFor: '',
        ReceiptType: '',
        No: '',
        Amount: '',
        Date: '',
        PaymentDueDate: '',
        GSTHoldAmount: '',
        RetentionHoldAmount: '',
        RoyaltyDeduction: '',
        OtherDeductionAmount: '',
        NetPayableAmount: '',
        PendingAmount: '',
        CourierDispatchDate: '',
        FRorIOMNumber: '',
        FRAmount: '',
        ApprovedAmount: '',
        CreatedDate: '',
        CreatedBy: '',
        UpdatedDate: '',
        UpdatedBy: '',
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
            const response = await axios.get(`${config.API_URL_APPLICATION}/MessMaster/GetMess`, {
                params: { id: id }
            });
            if (response.data.isSuccess) {
                const fetchedModule = response.data.messMasterList[0];
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

        if (!messes.BillEntryDate) { errors.BillEntryDate = 'Bill Entry Date is required'; }
        if (!messes.BTSID) { errors.BTSID = 'BTS ID is required'; }
        if (!messes.ProjectID ) { errors.ProjectID  = 'Project ID is required'; }
        if (!messes.PaymentRequestedFor) { errors.PaymentRequestedFor = 'Payment Requested For is required'; }
        if (!messes.No) { errors.No = 'No is required'; }
        if (!messes.ReceiptType) { errors.ReceiptType = 'Receipt Type is required'; }


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
            createdBy: editMode ? messes.CreatedBy : empName,
            updatedBy: editMode ? empName : '',
        };
        try {
            if (editMode) {
                await axios.post(`${config.API_URL_APPLICATION}/MessMaster/UpdateMess`, payload);
                navigate('/pages/MessMaster', {
                    state: {
                        successMessage: "Doer Updated successfully!",
                    }
                });
            } else {
                await axios.post(`${config.API_URL_APPLICATION}/MessMaster/InsertMess`, payload);
                navigate('/pages/MessMaster', {
                    state: {
                        successMessage: "Doer Added successfully!",
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
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit BTS Payment' : 'Add BTS Payment'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col lg={6}>
                                <Form.Group controlId="BTSID" className="mb-3">
                                    <Form.Label>BTS ID</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="BTSID"
                                        value={messes.BTSID}
                                        onChange={handleChange}
                                        placeholder='Enter BTS ID'
                                        disabled={editMode}
                                        className={validationErrors.BTSID ? " input-border" : "  "}
                                    />
                                    {validationErrors.BTSID && (
                                        <small className="text-danger">{validationErrors.BTSID}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="BillEntryDate" className="mb-3">
                                    <Form.Label>Bill Entry Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="BillEntryDate"
                                        value={messes.BillEntryDate}
                                        onChange={handleChange}
                                        placeholder='Enter Bill Entry Date'
                                        disabled={editMode}
                                        className={validationErrors.BillEntryDate ? " input-border" : "  "}
                                    />
                                    {validationErrors.BillEntryDate && (
                                        <small className="text-danger">{validationErrors.BillEntryDate}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="ProjectID " className="mb-3">
                                    <Form.Label>Project ID</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="ProjectID "
                                        value={messes.ProjectID }
                                        onChange={handleChange}
                                        placeholder='Enter Project ID'
                                        className={validationErrors.ProjectID  ? " input-border" : "  "}
                                    />
                                    {validationErrors.ProjectID  && (
                                        <small className="text-danger">{validationErrors.ProjectID }</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="ProjectName" className="mb-3">
                                    <Form.Label>Project Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="ProjectName"
                                        value={messes.ProjectName}
                                        onChange={handleChange}
                                        placeholder='Enter Project Name'
                                        className={validationErrors.ProjectName ? " input-border" : "  "}
                                    />
                                    {validationErrors.ProjectName && (
                                        <small className="text-danger">{validationErrors.ProjectName}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="PaymentRequestedFor" className="mb-3">
                                    <Form.Label>Payment Requested For</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="PaymentRequestedFor"
                                        value={messes.PaymentRequestedFor}
                                        onChange={handleChange}
                                        placeholder='Enter Payment Requested For'
                                        className={validationErrors.PaymentRequestedFor ? " input-border" : "  "}
                                    />
                                    {validationErrors.PaymentRequestedFor && (
                                        <small className="text-danger">{validationErrors.PaymentRequestedFor}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="ReceiptType" className="mb-3">
                                    <Form.Label>Receipt Type</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="ReceiptType"
                                        value={messes.ReceiptType}
                                        onChange={handleChange}
                                        placeholder='Enter ReceiptType'
                                        className={validationErrors.ReceiptType ? " input-border" : "  "}
                                    />
                                    {validationErrors.ReceiptType && (
                                        <small className="text-danger">{validationErrors.ReceiptType}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="No" className="mb-3">
                                    <Form.Label>Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="No"
                                        value={messes.No}
                                        onChange={handleChange}
                                        placeholder='Enter Number'
                                        className={validationErrors.No ? " input-border" : "  "}
                                    />
                                    {validationErrors.No && (
                                        <small className="text-danger">{validationErrors.No}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="Amount" className="mb-3">
                                    <Form.Label>Amount</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="Amount"
                                        value={messes.Amount}
                                        onChange={handleChange}
                                        placeholder='Enter Amount'
                                        className={validationErrors.Amount ? " input-border" : "  "}
                                    />
                                    {validationErrors.Amount && (
                                        <small className="text-danger">{validationErrors.Amount}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="Date" className="mb-3">
                                    <Form.Label>Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="Date"
                                        value={messes.Date}
                                        onChange={handleChange}
                                        placeholder='Enter Date'
                                        className={validationErrors.Date ? " input-border" : "  "}
                                    />
                                    {validationErrors.Date && (
                                        <small className="text-danger">{validationErrors.Date}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="PaymentDueDate" className="mb-3">
                                    <Form.Label>PaymentDueDate</Form.Label>
                                    <Form.Control
                                       type="date"
                                        name="PaymentDueDate"
                                        value={messes.PaymentDueDate}
                                        onChange={handleChange}
                                        placeholder='Enter Payment Due Date'
                                        className={validationErrors.PaymentDueDate ? " input-border" : "  "}
                                    />
                                    {validationErrors.PaymentDueDate && (
                                        <small className="text-danger">{validationErrors.PaymentDueDate}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="GSTHoldAmount" className="mb-3">
                                    <Form.Label>GSTHoldAmount</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="GSTHoldAmount"
                                        value={messes.GSTHoldAmount}
                                        onChange={handleChange}
                                        placeholder='Enter GST Hold Amount'
                                        className={validationErrors.GSTHoldAmount ? " input-border" : "  "}
                                    />
                                    {validationErrors.GSTHoldAmount && (
                                        <small className="text-danger">{validationErrors.GSTHoldAmount}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="RetentionHoldAmount" className="mb-3">
                                    <Form.Label>RetentionHoldAmount</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="RetentionHoldAmount"
                                        value={messes.RetentionHoldAmount}
                                        onChange={handleChange}
                                        placeholder='Enter Retention Hold Amount'
                                        className={validationErrors.RetentionHoldAmount ? " input-border" : "  "}
                                    />
                                    {validationErrors.RetentionHoldAmount && (
                                        <small className="text-danger">{validationErrors.RetentionHoldAmount}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="RoyaltyDeduction" className="mb-3">
                                    <Form.Label>RoyaltyDeduction</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="RoyaltyDeduction"
                                        value={messes.RoyaltyDeduction}
                                        onChange={handleChange}
                                        placeholder='Enter Royalty Deduction'
                                        className={validationErrors.RoyaltyDeduction ? " input-border" : "  "}
                                    />
                                    {validationErrors.RoyaltyDeduction && (
                                        <small className="text-danger">{validationErrors.RoyaltyDeduction}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="OtherDeductionAmount" className="mb-3">
                                    <Form.Label>OtherDeductionAmount</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="OtherDeductionAmount"
                                        value={messes.OtherDeductionAmount}
                                        onChange={handleChange}
                                        placeholder='Enter Other Deduction Amount'
                                        className={validationErrors.OtherDeductionAmount ? " input-border" : "  "}
                                    />
                                    {validationErrors.OtherDeductionAmount && (
                                        <small className="text-danger">{validationErrors.OtherDeductionAmount}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="NetPayableAmount" className="mb-3">
                                    <Form.Label>NetPayableAmount</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="NetPayableAmount"
                                        value={messes.NetPayableAmount}
                                        onChange={handleChange}
                                        placeholder='Enter Net Payable Amount'
                                        className={validationErrors.NetPayableAmount ? " input-border" : "  "}
                                    />
                                    {validationErrors.NetPayableAmount && (
                                        <small className="text-danger">{validationErrors.NetPayableAmount}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="PendingAmount" className="mb-3">
                                    <Form.Label>PendingAmount</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="PendingAmount"
                                        value={messes.PendingAmount}
                                        onChange={handleChange}
                                        placeholder='Enter Pending Amount'
                                        className={validationErrors.PendingAmount ? " input-border" : "  "}
                                    />
                                    {validationErrors.PendingAmount && (
                                        <small className="text-danger">{validationErrors.PendingAmount}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="CourierDispatchDate" className="mb-3">
                                    <Form.Label>CourierDispatchDate</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="CourierDispatchDate"
                                        value={messes.CourierDispatchDate}
                                        onChange={handleChange}
                                        placeholder='Enter Courier Dispatch Date'
                                        className={validationErrors.CourierDispatchDate ? " input-border" : "  "}
                                    />
                                    {validationErrors.CourierDispatchDate && (
                                        <small className="text-danger">{validationErrors.CourierDispatchDate}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="FRorIOMNumber" className="mb-3">
                                    <Form.Label>FRorIOMNumber</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="FRorIOMNumber"
                                        value={messes.FRorIOMNumber}
                                        onChange={handleChange}
                                        placeholder='Enter FRor IOM Number'
                                        className={validationErrors.FRorIOMNumber ? " input-border" : "  "}
                                    />
                                    {validationErrors.FRorIOMNumber && (
                                        <small className="text-danger">{validationErrors.FRorIOMNumber}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="FRAmount" className="mb-3">
                                    <Form.Label>FRAmount</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="FRAmount"
                                        value={messes.FRAmount}
                                        onChange={handleChange}
                                        placeholder='Enter FR Amount'
                                        className={validationErrors.FRAmount ? " input-border" : "  "}
                                    />
                                    {validationErrors.FRAmount && (
                                        <small className="text-danger">{validationErrors.FRAmount}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="ApprovedAmount" className="mb-3">
                                    <Form.Label>ApprovedAmount</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="ApprovedAmount"
                                        value={messes.ApprovedAmount}
                                        onChange={handleChange}
                                        placeholder='Enter Approved Amount'
                                        className={validationErrors.ApprovedAmount ? " input-border" : "  "}
                                    />
                                    {validationErrors.ApprovedAmount && (
                                        <small className="text-danger">{validationErrors.ApprovedAmount}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col className='align-items-end d-flex justify-content-between mb-3'>
                                <div>
                                    <span className='fs-5 '>This field is required*</span>
                                </div>
                                <div>
                                    <Link to={'/pages/BTSPaymentMaster'}>
                                        <Button variant="primary" >
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update BTS Payment' : 'Add BTS Payment'}
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

export default BTSPaymentMasterAddEdit;