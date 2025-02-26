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
    vendorID: string,
    vendorNameAndCode: string,
    item: string,
    specification: string,
    assetGroupCode: string,
    assetCategory: string,
    assetGroup: string,
    assetMake: string,
    assetOwnership: string,
    dateOfDeployment: string,
    receiptType: string,
    billAgainst: string,
    billStatus: string,
    source: string,
    no: string,
    rate: string,
    date: string,
    billStartMonth: string,
    billMonth: string,
    billNo: string,
    billDate: string,
    billAmount: string,
    billingRequiredGivenPeriod: string,
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

const RecurringBillMasterAddEdit = () => {
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
        vendorID: '',
        vendorNameAndCode: '',
        item: '',
        specification: '',
        assetGroupCode: '',
        assetCategory: '',
        assetGroup: '',
        assetMake: '',
        assetOwnership: '',
        dateOfDeployment: '',
        receiptType: '',
        billAgainst: '',
        billStatus: '',
        source: '',
        no: '',
        rate: '',
        date: '',
        billStartMonth: '',
        billMonth: '',
        billNo: '',
        billDate: '',
        billAmount: '',
        billingRequiredGivenPeriod: '',
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
            const response = await axios.get(`${config.API_URL_APPLICATION1}/RecurringBillMaster/GetRecurringBill/${id}`);
            console.log('response', response)
            if (response.data.isSuccess) {
                const fetchedModule = response.data.recurringBillMasters[0];
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

        if (!messes.entryDate) { errors.entryDate = 'entryDate is required' }
        if (!messes.projectID) { errors.projectID = 'projectID is required' }
        if (!messes.projectName) { errors.projectName = 'projectName is required' }
        if (!messes.vendorID) { errors.vendorID = 'vendorID is required' }
        if (!messes.vendorNameAndCode) { errors.vendorNameAndCode = 'vendorNameAndCode is required' }
        if (!messes.item) { errors.item = 'item is required' }
        if (!messes.specification) { errors.specification = 'specification is required' }
        if (!messes.assetGroupCode) { errors.assetGroupCode = 'assetGroupCode is required' }
        if (!messes.assetCategory) { errors.assetCategory = 'assetCategory is required' }
        if (!messes.assetGroup) { errors.assetGroup = 'assetGroup is required' }
        if (!messes.assetMake) { errors.assetMake = 'assetMake is required' }
        if (!messes.assetOwnership) { errors.assetOwnership = 'assetOwnership is required' }
        if (!messes.dateOfDeployment) { errors.dateOfDeployment = 'dateOfDeployment is required' }
        if (!messes.receiptType) { errors.receiptType = 'receiptType is required' }
        if (!messes.billAgainst) { errors.billAgainst = 'billAgainst is required' }
        if (!messes.billStatus) { errors.billStatus = 'billStatus is required' }
        if (!messes.source) { errors.source = 'source is required' }
        if (!messes.no) { errors.no = 'no is required' }
        if (!messes.rate) { errors.rate = 'rate is required' }
        if (!messes.date) { errors.date = 'date is required' }
        if (!messes.billStartMonth) { errors.billStartMonth = 'billStartMonth is required' }
        if (!messes.billMonth) { errors.billMonth = 'billMonth is required' }
        if (!messes.billNo) { errors.billNo = 'billNo is required' }
        if (!messes.billDate) { errors.billDate = 'billDate is required' }
        if (!messes.billAmount) { errors.billAmount = 'billAmount is required' }
        if (!messes.billingRequiredGivenPeriod) { errors.billingRequiredGivenPeriod = 'billingRequiredGivenPeriod is required' }




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
            createdDate: new Date(),
            createdBy: editMode ? messes.createdBy : empName,
            updatedBy: editMode ? empName : '',
            updatedDate: new Date(),
        };
        try {
            if (editMode) {
                await axios.put(`${config.API_URL_APPLICATION1}/RecurringBillMaster/UpdateRecurringBill/${id}`, payload);
                navigate('/pages/RecurringBillMaster', {
                    state: {
                        successMessage: "Recurring Bill Master Updated successfully!",
                    }
                });
            } else {
                await axios.post(`${config.API_URL_APPLICATION1}/RecurringBillMaster/CreateRecurringBill`, payload);
                navigate('/pages/RecurringBillMaster', {
                    state: {
                        successMessage: "Recurring Bill Master Added successfully!",
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
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit Recurring Bill Master' : 'Add Recurring Bill Master'}</span></span>
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
                                        placeholder='Enter Entry Date'
                                        // disabled={editMode}
                                        className={validationErrors.entryDate ? " input-border" : "  "}
                                    />
                                    {validationErrors.entryDate && (
                                        <small className="text-danger">{validationErrors.entryDate}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            
                            <Col lg={6}>
                                <Form.Group controlId="projectID" className="mb-3">
                                    <Form.Label>Project ID</Form.Label>
                                    <Form.Control
                                        type="text"
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
                                <Form.Group controlId="vendorID" className="mb-3">
                                    <Form.Label>vendorID</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="vendorID"
                                        value={messes.vendorID}
                                        onChange={handleChange}
                                        placeholder='Enter Project Name'
                                        className={validationErrors.vendorID ? " input-border" : "  "}
                                    />
                                    {validationErrors.vendorID && (
                                        <small className="text-danger">{validationErrors.vendorID}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="vendorNameAndCode" className="mb-3">
                                    <Form.Label>vendorNameAndCode</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="vendorNameAndCode"
                                        value={messes.vendorNameAndCode}
                                        onChange={handleChange}
                                        placeholder='Enter Payment Requested For'
                                        className={validationErrors.vendorNameAndCode ? " input-border" : "  "}
                                    />
                                    {validationErrors.vendorNameAndCode && (
                                        <small className="text-danger">{validationErrors.vendorNameAndCode}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="item" className="mb-3">
                                    <Form.Label>item</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="item"
                                        value={messes.item}
                                        onChange={handleChange}
                                        placeholder='Enter item'
                                        className={validationErrors.item ? " input-border" : "  "}
                                    />
                                    {validationErrors.item && (
                                        <small className="text-danger">{validationErrors.item}</small>
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
                                        placeholder='Enter Number'
                                        className={validationErrors.specification ? " input-border" : "  "}
                                    />
                                    {validationErrors.specification && (
                                        <small className="text-danger">{validationErrors.specification}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="assetGroupCode" className="mb-3">
                                    <Form.Label>assetGroupCode</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="assetGroupCode"
                                        value={messes.assetGroupCode}
                                        onChange={handleChange}
                                        placeholder='Enter assetGroupCode'
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
                                        placeholder='Enter assetCategory'
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
                                        placeholder='Enter assetGroup'
                                        className={validationErrors.assetGroup ? " input-border" : "  "}
                                    />
                                    {validationErrors.assetGroup && (
                                        <small className="text-danger">{validationErrors.assetGroup}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="assetMake" className="mb-3">
                                    <Form.Label>assetMake</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="assetMake"
                                        value={messes.assetMake}
                                        onChange={handleChange}
                                        placeholder='Enter assetMake'
                                        className={validationErrors.assetMake ? " input-border" : "  "}
                                    />
                                    {validationErrors.assetMake && (
                                        <small className="text-danger">{validationErrors.assetMake}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="assetOwnership" className="mb-3">
                                    <Form.Label>assetOwnership</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="assetOwnership"
                                        value={messes.assetOwnership}
                                        onChange={handleChange}
                                        placeholder='Enter assetOwnership'
                                        className={validationErrors.assetOwnership ? " input-border" : "  "}
                                    />
                                    {validationErrors.assetOwnership && (
                                        <small className="text-danger">{validationErrors.assetOwnership}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="dateOfDeployment" className="mb-3">
                                    <Form.Label>dateOfDeployment</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="dateOfDeployment"
                                        value={messes.dateOfDeployment}
                                        onChange={handleChange}
                                        placeholder='Enter dateOfDeployment'
                                        className={validationErrors.dateOfDeployment ? " input-border" : "  "}
                                    />
                                    {validationErrors.dateOfDeployment && (
                                        <small className="text-danger">{validationErrors.dateOfDeployment}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="receiptType" className="mb-3">
                                    <Form.Label>receiptType</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="receiptType"
                                        value={messes.receiptType}
                                        onChange={handleChange}
                                        placeholder='Enter receiptType'
                                        className={validationErrors.receiptType ? " input-border" : "  "}
                                    />
                                    {validationErrors.receiptType && (
                                        <small className="text-danger">{validationErrors.receiptType}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="billAgainst" className="mb-3">
                                    <Form.Label>billAgainst</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="billAgainst"
                                        value={messes.billAgainst}
                                        onChange={handleChange}
                                        placeholder='Enter billAgainst'
                                        className={validationErrors.billAgainst ? " input-border" : "  "}
                                    />
                                    {validationErrors.billAgainst && (
                                        <small className="text-danger">{validationErrors.billAgainst}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="billStatus" className="mb-3">
                                    <Form.Label>billStatus</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="billStatus"
                                        value={messes.billStatus}
                                        onChange={handleChange}
                                        placeholder='Enter billStatus'
                                        className={validationErrors.billStatus ? " input-border" : "  "}
                                    />
                                    {validationErrors.billStatus && (
                                        <small className="text-danger">{validationErrors.billStatus}</small>
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
                                <Form.Group controlId="no" className="mb-3">
                                    <Form.Label>no</Form.Label>
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
                                <Form.Group controlId="rate" className="mb-3">
                                    <Form.Label>rate</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="rate"
                                        value={messes.rate}
                                        onChange={handleChange}
                                        placeholder='Enter rate'
                                        className={validationErrors.rate ? " input-border" : "  "}
                                    />
                                    {validationErrors.rate && (
                                        <small className="text-danger">{validationErrors.rate}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="date" className="mb-3">
                                    <Form.Label>date</Form.Label>
                                    <Form.Control
                                        type="date"
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
                                <Form.Group controlId="billStartMonth" className="mb-3">
                                    <Form.Label>billStartMonth</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="billStartMonth"
                                        value={messes.billStartMonth}
                                        onChange={handleChange}
                                        placeholder='Enter billStartMonth'
                                        className={validationErrors.billStartMonth ? " input-border" : "  "}
                                    />
                                    {validationErrors.billStartMonth && (
                                        <small className="text-danger">{validationErrors.billStartMonth}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="billMonth" className="mb-3">
                                    <Form.Label>billMonth</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="billMonth"
                                        value={messes.billMonth}
                                        onChange={handleChange}
                                        placeholder='Enter billMonth'
                                        className={validationErrors.billMonth ? " input-border" : "  "}
                                    />
                                    {validationErrors.billMonth && (
                                        <small className="text-danger">{validationErrors.billMonth}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="billNo" className="mb-3">
                                    <Form.Label>billNo</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="billNo"
                                        value={messes.billNo}
                                        onChange={handleChange}
                                        placeholder='Enter billNo'
                                        className={validationErrors.billNo ? " input-border" : "  "}
                                    />
                                    {validationErrors.billNo && (
                                        <small className="text-danger">{validationErrors.billNo}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="billDate" className="mb-3">
                                    <Form.Label>billDate</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="billDate"
                                        value={messes.billDate}
                                        onChange={handleChange}
                                        placeholder='Enter billDate'
                                        className={validationErrors.billDate ? " input-border" : "  "}
                                    />
                                    {validationErrors.billDate && (
                                        <small className="text-danger">{validationErrors.billDate}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="billAmount" className="mb-3">
                                    <Form.Label>billAmount</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="billAmount"
                                        value={messes.billAmount}
                                        onChange={handleChange}
                                        placeholder='Enter billAmount'
                                        className={validationErrors.billAmount ? " input-border" : "  "}
                                    />
                                    {validationErrors.billAmount && (
                                        <small className="text-danger">{validationErrors.billAmount}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="billingRequiredGivenPeriod" className="mb-3">
                                    <Form.Label>billingRequiredGivenPeriod</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="billingRequiredGivenPeriod"
                                        value={messes.billingRequiredGivenPeriod}
                                        onChange={handleChange}
                                        placeholder='Enter billingRequiredGivenPeriod'
                                        className={validationErrors.billingRequiredGivenPeriod ? " input-border" : "  "}
                                    />
                                    {validationErrors.billingRequiredGivenPeriod && (
                                        <small className="text-danger">{validationErrors.billingRequiredGivenPeriod}</small>
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

export default RecurringBillMasterAddEdit;