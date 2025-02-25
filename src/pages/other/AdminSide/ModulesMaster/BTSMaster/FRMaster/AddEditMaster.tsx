import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
import Select from 'react-select';
import { toast } from 'react-toastify';


interface BTS_PAYMENT {
    ID: number,
    EntryDate: string,
    ProjectID: string,
    ProjectName: string,
    ItemSpecification: string,
    ReceiptType: string,
    ChallanNo: string,
    ChallanAmount: string,
    ChallanDate: string,
    BillAgainst: string,
    No: string,
    Amount: string,
    Date: string,
    VendorCode: string,
    VendorName: string,
    BillNo: string,
    BillAmount: string,
    Source: string,
    CreatedDate: string,
    CreatedBy: string,
    UpdatedDate: string,
    UpdatedBy: string,
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

const FRMasterAddEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [empName, setEmpName] = useState<string | null>('')
    const [projectList, setProjectList] = useState<ProjectList[]>([])
    const [statusList, setStatusList] = useState<Status[]>([])
    const [employeeList, setEmployeeList] = useState<EmployeeList[]>([])
    const [messes, setMesses] = useState<BTS_PAYMENT>({
        ID: 0,
        EntryDate: '',
        ProjectID: '',
        ProjectName: '',
        ItemSpecification: '',
        ReceiptType: '',
        ChallanNo: '',
        ChallanAmount: '',
        ChallanDate: '',
        BillAgainst: '',
        No: '',
        Amount: '',
        Date: '',
        VendorCode: '',
        VendorName: '',
        BillNo: '',
        BillAmount: '',
        Source: '',
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

        // if (!messes.BillEntryDate) { errors.BillEntryDate = 'Bill Entry Date is required'; }
        // if (!messes.BTSID) { errors.BTSID = 'BTS ID is required'; }
        // if (!messes.ProjectID) { errors.ProjectID = 'Project ID is required'; }
        // if (!messes.PaymentRequestedFor) { errors.PaymentRequestedFor = 'Payment Requested For is required'; }
        // if (!messes.No) { errors.No = 'No is required'; }
        // if (!messes.ReceiptType) { errors.ReceiptType = 'Receipt Type is required'; }


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
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit FR Master' : 'Add FR Master'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col lg={6}>
                                <Form.Group controlId="EntryDate" className="mb-3">
                                    <Form.Label>BTS ID</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="EntryDate"
                                        value={messes.EntryDate}
                                        onChange={handleChange}
                                        placeholder='Enter BTS ID'
                                        disabled={editMode}
                                        className={validationErrors.EntryDate ? " input-border" : "  "}
                                    />
                                    {validationErrors.EntryDate && (
                                        <small className="text-danger">{validationErrors.EntryDate}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="ProjectID" className="mb-3">
                                    <Form.Label>Bill Entry Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="ProjectID"
                                        value={messes.ProjectID}
                                        onChange={handleChange}
                                        placeholder='Enter Bill Entry Date'
                                        disabled={editMode}
                                        className={validationErrors.ProjectID ? " input-border" : "  "}
                                    />
                                    {validationErrors.ProjectID && (
                                        <small className="text-danger">{validationErrors.ProjectID}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="ProjectName " className="mb-3">
                                    <Form.Label>Project ID</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="ProjectName "
                                        value={messes.ProjectName}
                                        onChange={handleChange}
                                        placeholder='Enter Project ID'
                                        className={validationErrors.ProjectName ? " input-border" : "  "}
                                    />
                                    {validationErrors.ProjectName && (
                                        <small className="text-danger">{validationErrors.ProjectName}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="ItemSpecification" className="mb-3">
                                    <Form.Label>Project Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="ItemSpecification"
                                        value={messes.ItemSpecification}
                                        onChange={handleChange}
                                        placeholder='Enter Project Name'
                                        className={validationErrors.ItemSpecification ? " input-border" : "  "}
                                    />
                                    {validationErrors.ItemSpecification && (
                                        <small className="text-danger">{validationErrors.ItemSpecification}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="ReceiptType" className="mb-3">
                                    <Form.Label>Payment Requested For</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="ReceiptType"
                                        value={messes.ReceiptType}
                                        onChange={handleChange}
                                        placeholder='Enter Payment Requested For'
                                        className={validationErrors.ReceiptType ? " input-border" : "  "}
                                    />
                                    {validationErrors.ReceiptType && (
                                        <small className="text-danger">{validationErrors.ReceiptType}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="ChallanNo" className="mb-3">
                                    <Form.Label>Receipt Type</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="ChallanNo"
                                        value={messes.ChallanNo}
                                        onChange={handleChange}
                                        placeholder='Enter ChallanNo'
                                        className={validationErrors.ChallanNo ? " input-border" : "  "}
                                    />
                                    {validationErrors.ChallanNo && (
                                        <small className="text-danger">{validationErrors.ChallanNo}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="ChallanAmount" className="mb-3">
                                    <Form.Label>Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="ChallanAmount"
                                        value={messes.ChallanAmount}
                                        onChange={handleChange}
                                        placeholder='Enter Number'
                                        className={validationErrors.ChallanAmount ? " input-border" : "  "}
                                    />
                                    {validationErrors.ChallanAmount && (
                                        <small className="text-danger">{validationErrors.ChallanAmount}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="ChallanDate" className="mb-3">
                                    <Form.Label>ChallanDate</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="ChallanDate"
                                        value={messes.ChallanDate}
                                        onChange={handleChange}
                                        placeholder='Enter ChallanDate'
                                        className={validationErrors.ChallanDate ? " input-border" : "  "}
                                    />
                                    {validationErrors.ChallanDate && (
                                        <small className="text-danger">{validationErrors.ChallanDate}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="BillAgainst" className="mb-3">
                                    <Form.Label>BillAgainst</Form.Label>
                                    <Form.Control
                                        type="BillAgainst"
                                        name="BillAgainst"
                                        value={messes.BillAgainst}
                                        onChange={handleChange}
                                        placeholder='Enter BillAgainst'
                                        className={validationErrors.BillAgainst ? " input-border" : "  "}
                                    />
                                    {validationErrors.BillAgainst && (
                                        <small className="text-danger">{validationErrors.BillAgainst}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="No" className="mb-3">
                                    <Form.Label>No</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="No"
                                        value={messes.No}
                                        onChange={handleChange}
                                        placeholder='Enter Payment Due Date'
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
                                        placeholder='Enter GST Hold Amount'
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
                                        type="text"
                                        name="Date"
                                        value={messes.Date}
                                        onChange={handleChange}
                                        placeholder='Enter Retention Hold Amount'
                                        className={validationErrors.Date ? " input-border" : "  "}
                                    />
                                    {validationErrors.Date && (
                                        <small className="text-danger">{validationErrors.Date}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="VendorCode" className="mb-3">
                                    <Form.Label>VendorCode</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="VendorCode"
                                        value={messes.VendorCode}
                                        onChange={handleChange}
                                        placeholder='Enter Royalty Deduction'
                                        className={validationErrors.VendorCode ? " input-border" : "  "}
                                    />
                                    {validationErrors.VendorCode && (
                                        <small className="text-danger">{validationErrors.VendorCode}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="VendorName" className="mb-3">
                                    <Form.Label>VendorName</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="VendorName"
                                        value={messes.VendorName}
                                        onChange={handleChange}
                                        placeholder='Enter Other Deduction Amount'
                                        className={validationErrors.VendorName ? " input-border" : "  "}
                                    />
                                    {validationErrors.VendorName && (
                                        <small className="text-danger">{validationErrors.VendorName}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="BillNo" className="mb-3">
                                    <Form.Label>BillNo</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="BillNo"
                                        value={messes.BillNo}
                                        onChange={handleChange}
                                        placeholder='Enter Net Payable Amount'
                                        className={validationErrors.BillNo ? " input-border" : "  "}
                                    />
                                    {validationErrors.BillNo && (
                                        <small className="text-danger">{validationErrors.BillNo}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="BillAmount" className="mb-3">
                                    <Form.Label>BillAmount</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="BillAmount"
                                        value={messes.BillAmount}
                                        onChange={handleChange}
                                        placeholder='Enter Pending Amount'
                                        className={validationErrors.BillAmount ? " input-border" : "  "}
                                    />
                                    {validationErrors.BillAmount && (
                                        <small className="text-danger">{validationErrors.BillAmount}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="Source" className="mb-3">
                                    <Form.Label>Source</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="Source"
                                        value={messes.Source}
                                        onChange={handleChange}
                                        placeholder='Enter Courier Dispatch Date'
                                        className={validationErrors.Source ? " input-border" : "  "}
                                    />
                                    {validationErrors.Source && (
                                        <small className="text-danger">{validationErrors.Source}</small>
                                    )}
                                </Form.Group>
                            </Col>

                            <Col className='align-items-end d-flex justify-content-between mb-3'>
                                <div>
                                    <span className='fs-5 '>This field is required*</span>
                                </div>
                                <div>
                                    <Link to={'/pages/FRMaster'}>
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

export default FRMasterAddEdit;