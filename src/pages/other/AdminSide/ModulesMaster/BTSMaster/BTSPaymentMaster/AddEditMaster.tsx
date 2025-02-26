import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
// import Select from 'react-select';
import { toast } from 'react-toastify';


interface BTS_PAYMENT {
    id: number,
    btsid: string,
    billEntryDate: string,
    projectID: string,
    projectName: string,
    paymentRequestedFor: string,
    receiptType: string,
    no: string,
    amount: string,
    date: string,
    paymentDueDate: string,
    gstHoldAmount: string,
    retentionHoldAmount: string,
    royaltyDeduction: string,
    otherDeductionAmount: string,
    netPayableAmount: string,
    pendingAmount: string,
    courierDispatchDate: string,
    fRorIOMNumber: string,
    frAmount: string,
    approvedAmount: string,
    createdDate: string,
    createdBy: string,
    updatedDate: string,
    updatedBy: string,
}

// interface ProjectList {
//     id: string;
//     BillEntryDate: string
// }
// interface Status {
//     id: string;
//     name: string
// }
// interface EmployeeList {
//     empId: string;
//     employeeName: string
// }

const BTSPaymentMasterAddEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [empName, setEmpName] = useState<string | null>('')
    // const [projectList, setProjectList] = useState<ProjectList[]>([])
    // const [statusList, setStatusList] = useState<Status[]>([])
    // const [employeeList, setEmployeeList] = useState<EmployeeList[]>([])
    const [messes, setMesses] = useState<BTS_PAYMENT>({
        id: 0,
        btsid: '',
        billEntryDate: '',
        projectID: '',
        projectName: '',
        paymentRequestedFor: '',
        receiptType: '',
        no: '',
        amount: '',
        date: '',
        paymentDueDate: '',
        gstHoldAmount: '',
        retentionHoldAmount: '',
        royaltyDeduction: '',
        otherDeductionAmount: '',
        netPayableAmount: '',
        pendingAmount: '',
        courierDispatchDate: '',
        fRorIOMNumber: '',
        frAmount: '',
        approvedAmount: '',
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
            const response = await axios.get(`${config.API_URL_APPLICATION1}/BTSPaymentMaster/GetBTSPayment/${id}`);
            console.log('response', response)
            if (response.data.isSuccess) {
                const fetchedModule = response.data.bTSPaymentMasters[0];
                setMesses(fetchedModule);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching module:', error);
        }
    };


    useEffect(() => {
        // const fetchData = async (endpoint: string, setter: Function, listName: string) => {
        //     try {
        //         const response = await axios.get(`${config.API_URL_APPLICATION}/${endpoint}`);
        //         if (response.data.isSuccess) {
        //             setter(response.data[listName]);
        //         } else {
        //             console.error(response.data.message);
        //         }
        //     } catch (error) {
        //         console.error(`Error fetching data from ${endpoint}:`, error);
        //     }
        // };
        // fetchData('CommonDropdown/GetProjectList', setProjectList, 'projectListResponses');
        // fetchData('CommonDropdown/GetStatus', setStatusList, 'statusListResponses');
        // fetchData('CommonDropdown/GetEmployeeListWithId', setEmployeeList, 'employeeLists');
    }, []);



    const validateFields = (): boolean => {
        const errors: { [key: string]: string } = {};
        if (!messes.btsid) { errors.btsid = 'BTS Id is required' }
        if (!messes.billEntryDate) { errors.billEntryDate = 'Bill Entry Date is required' }
        if (!messes.projectID) { errors.projectID = 'Project ID is required' }
        if (!messes.projectName) { errors.projectName = 'Project Name is required' }
        if (!messes.paymentRequestedFor) { errors.paymentRequestedFor = 'Payment Requested For is required' }
        if (!messes.receiptType) { errors.receiptType = 'Receipt Type is required' }
        if (!messes.no) { errors.no = 'No is required' }
        if (!messes.amount) { errors.amount = 'Amount is required' }
        if (!messes.date) { errors.date = 'Date is required' }
        if (!messes.paymentDueDate) { errors.paymentDueDate = 'Payment Due Date is required' }
        if (!messes.gstHoldAmount) { errors.gstHoldAmount = 'Gst Hold Amount is required' }
        if (!messes.retentionHoldAmount) { errors.retentionHoldAmount = 'Retention Hold Amount is required' }
        if (!messes.royaltyDeduction) { errors.royaltyDeduction = 'Royalty Deduction is required' }
        if (!messes.otherDeductionAmount) { errors.otherDeductionAmount = 'Other Deduction Amount is required' }
        if (!messes.netPayableAmount) { errors.netPayableAmount = 'Net Payable Amount is required' }
        if (!messes.pendingAmount) { errors.pendingAmount = 'Pending Amount is required' }
        if (!messes.courierDispatchDate) { errors.courierDispatchDate = 'Courier Dispatch Date is required' }
        if (!messes.fRorIOMNumber) { errors.fRorIOMNumber = 'FR Or IOM Number is required' }
        if (!messes.frAmount) { errors.frAmount = 'FR Amount is required' }
        if (!messes.approvedAmount) { errors.approvedAmount = 'Approved Amount is required' }



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
            console.log(messes)
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
                await axios.put(`${config.API_URL_APPLICATION1}/BTSPaymentMaster/UpdateBTSPayment/${id}`, payload);
                navigate('/pages/BTSPaymentMaster', {
                    state: {
                        successMessage: "Challan Master Updated successfully!",
                    }
                });
            } else {
                await axios.post(`${config.API_URL_APPLICATION1}/BTSPaymentMaster/CreateBTSPayment`, payload);
                navigate('/pages/BTSPaymentMaster', {
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
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit BTS Payment Master' : 'Add BTS Payment Master'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col lg={6}>
                                <Form.Group controlId="btsid" className="mb-3">
                                    <Form.Label>BTS Id*</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="btsid"
                                        value={messes.btsid}
                                        onChange={handleChange}
                                        placeholder='Enter BTS Id'
                                        disabled={editMode}
                                        className={validationErrors.btsid ? " input-border" : "  "}
                                    />
                                    {validationErrors.btsid && (
                                        <small className="text-danger">{validationErrors.btsid}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="billEntryDate" className="mb-3">
                                    <Form.Label>Bill Entry Date*</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="billEntryDate"
                                        value={messes.billEntryDate}
                                        onChange={handleChange}
                                        placeholder='Enter billEntryDate'
                                        className={validationErrors.billEntryDate ? " input-border" : "  "}
                                    />
                                    {validationErrors.billEntryDate && (
                                        <small className="text-danger">{validationErrors.billEntryDate}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="projectID" className="mb-3">
                                    <Form.Label>Project ID*</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="projectID"
                                        value={messes.projectID}
                                        onChange={handleChange}
                                        placeholder='Enter Project ID'
                                        className={validationErrors.projectID ? " input-border" : "  "}
                                    />
                                    {validationErrors.projectID && (
                                        <small className="text-danger">{validationErrors.projectID}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="projectName" className="mb-3">
                                    <Form.Label>Project Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="projectName"
                                        value={messes.projectName}
                                        onChange={handleChange}
                                        placeholder='Enter Project ID'
                                        className={validationErrors.projectName ? " input-border" : "  "}
                                    />
                                    {validationErrors.projectName && (
                                        <small className="text-danger">{validationErrors.projectName}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="paymentRequestedFor" className="mb-3">
                                    <Form.Label>paymentRequestedFor</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="paymentRequestedFor"
                                        value={messes.paymentRequestedFor}
                                        onChange={handleChange}
                                        placeholder='Enter Project Name'
                                        className={validationErrors.paymentRequestedFor ? " input-border" : "  "}
                                    />
                                    {validationErrors.paymentRequestedFor && (
                                        <small className="text-danger">{validationErrors.paymentRequestedFor}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="receiptType" className="mb-3">
                                    <Form.Label>Receipt Type</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="receiptType"
                                        value={messes.receiptType}
                                        onChange={handleChange}
                                        placeholder='Enter Payment Requested For'
                                        className={validationErrors.receiptType ? " input-border" : "  "}
                                    />
                                    {validationErrors.receiptType && (
                                        <small className="text-danger">{validationErrors.receiptType}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="no" className="mb-3">
                                    <Form.Label>No</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="no"
                                        value={messes.no}
                                        onChange={handleChange}
                                        placeholder='Enter no'
                                        className={validationErrors.no ? " input-border" : "  "}
                                    />
                                    {validationErrors.no && (
                                        <small className="text-danger">{validationErrors.no}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="amount" className="mb-3">
                                    <Form.Label>Amount</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="amount"
                                        value={messes.amount}
                                        onChange={handleChange}
                                        placeholder='Enter Number'
                                        className={validationErrors.amount ? " input-border" : "  "}
                                    />
                                    {validationErrors.amount && (
                                        <small className="text-danger">{validationErrors.amount}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="date" className="mb-3">
                                    <Form.Label>Date</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="date"
                                        value={messes.date}
                                        onChange={handleChange}
                                        placeholder='Enter date'
                                        className={validationErrors.date ? " input-border" : "  "}
                                    />
                                    {validationErrors.date && (
                                        <small className="text-danger">{validationErrors.date}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="paymentDueDate" className="mb-3">
                                    <Form.Label>paymentDueDate</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="paymentDueDate"
                                        value={messes.paymentDueDate}
                                        onChange={handleChange}
                                        placeholder='Enter paymentDueDate'
                                        className={validationErrors.paymentDueDate ? " input-border" : "  "}
                                    />
                                    {validationErrors.paymentDueDate && (
                                        <small className="text-danger">{validationErrors.paymentDueDate}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="gstHoldAmount" className="mb-3">
                                    <Form.Label>gstHoldAmount</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="gstHoldAmount"
                                        value={messes.gstHoldAmount}
                                        onChange={handleChange}
                                        placeholder='Enter Payment Due Date'
                                        className={validationErrors.gstHoldAmount ? " input-border" : "  "}
                                    />
                                    {validationErrors.gstHoldAmount && (
                                        <small className="text-danger">{validationErrors.gstHoldAmount}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="retentionHoldAmount" className="mb-3">
                                    <Form.Label>retentionHoldAmount</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="retentionHoldAmount"
                                        value={messes.retentionHoldAmount}
                                        onChange={handleChange}
                                        placeholder='Enter GST Hold retentionHoldAmount'
                                        className={validationErrors.retentionHoldAmount ? " input-border" : "  "}
                                    />
                                    {validationErrors.retentionHoldAmount && (
                                        <small className="text-danger">{validationErrors.retentionHoldAmount}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="royaltyDeduction" className="mb-3">
                                    <Form.Label>royaltyDeduction</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="royaltyDeduction"
                                        value={messes.royaltyDeduction}
                                        onChange={handleChange}
                                        placeholder='Enter Retention Hold Amount'
                                        className={validationErrors.royaltyDeduction ? " input-border" : "  "}
                                    />
                                    {validationErrors.royaltyDeduction && (
                                        <small className="text-danger">{validationErrors.royaltyDeduction}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="otherDeductionAmount" className="mb-3">
                                    <Form.Label>otherDeductionAmount</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="otherDeductionAmount"
                                        value={messes.otherDeductionAmount}
                                        onChange={handleChange}
                                        placeholder='Enter Royalty Deduction'
                                        className={validationErrors.otherDeductionAmount ? " input-border" : "  "}
                                    />
                                    {validationErrors.otherDeductionAmount && (
                                        <small className="text-danger">{validationErrors.otherDeductionAmount}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="netPayableAmount" className="mb-3">
                                    <Form.Label>netPayableAmount</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="netPayableAmount"
                                        value={messes.netPayableAmount}
                                        onChange={handleChange}
                                        placeholder='Enter Other Deduction Amount'
                                        className={validationErrors.netPayableAmount ? " input-border" : "  "}
                                    />
                                    {validationErrors.netPayableAmount && (
                                        <small className="text-danger">{validationErrors.netPayableAmount}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="pendingAmount" className="mb-3">
                                    <Form.Label>pendingAmount</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="pendingAmount"
                                        value={messes.pendingAmount}
                                        onChange={handleChange}
                                        placeholder='Enter Net Payable Amount'
                                        className={validationErrors.pendingAmount ? " input-border" : "  "}
                                    />
                                    {validationErrors.pendingAmount && (
                                        <small className="text-danger">{validationErrors.pendingAmount}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="courierDispatchDate" className="mb-3">
                                    <Form.Label>courierDispatchDate</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="courierDispatchDate"
                                        value={messes.courierDispatchDate}
                                        onChange={handleChange}
                                        placeholder='Enter Pending Amount'
                                        className={validationErrors.courierDispatchDate ? " input-border" : "  "}
                                    />
                                    {validationErrors.courierDispatchDate && (
                                        <small className="text-danger">{validationErrors.courierDispatchDate}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="fRorIOMNumber" className="mb-3">
                                    <Form.Label>fRorIOMNumber</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="fRorIOMNumber"
                                        value={messes.fRorIOMNumber}
                                        onChange={handleChange}
                                        placeholder='Enter Courier Dispatch Date'
                                        className={validationErrors.fRorIOMNumber ? " input-border" : "  "}
                                    />
                                    {validationErrors.fRorIOMNumber && (
                                        <small className="text-danger">{validationErrors.fRorIOMNumber}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="frAmount" className="mb-3">
                                    <Form.Label>frAmount</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="frAmount"
                                        value={messes.frAmount}
                                        onChange={handleChange}
                                        placeholder='Enter Courier Dispatch Date'
                                        className={validationErrors.frAmount ? " input-border" : "  "}
                                    />
                                    {validationErrors.frAmount && (
                                        <small className="text-danger">{validationErrors.frAmount}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="approvedAmount" className="mb-3">
                                    <Form.Label>approvedAmount</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="approvedAmount"
                                        value={messes.approvedAmount}
                                        onChange={handleChange}
                                        placeholder='Enter Courier Dispatch Date'
                                        className={validationErrors.approvedAmount ? " input-border" : "  "}
                                    />
                                    {validationErrors.approvedAmount && (
                                        <small className="text-danger">{validationErrors.approvedAmount}</small>
                                    )}
                                </Form.Group>
                            </Col>

                            <Col className='align-items-end d-flex justify-content-between mb-3'>
                                <div>
                                    <span className='fs-5 '>This field is required*</span>
                                </div>
                                <div>
                                    <Link to={'/pages/ChallanMaster'}>
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