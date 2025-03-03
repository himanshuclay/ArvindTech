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

        if (!messes.entryDate) { errors.entryDate = 'Entry Date is required' }
        if (!messes.projectID) { errors.projectID = 'Project ID is required' }
        if (!messes.projectName) { errors.projectName = 'Project Name is required' }
        if (!messes.vendorID) { errors.vendorID = 'Vendor ID is required' }
        if (!messes.vendorNameAndCode) { errors.vendorNameAndCode = 'Vendor Name And Code is required' }
        if (!messes.item) { errors.item = 'Item is required' }
        if (!messes.specification) { errors.specification = 'Specification is required' }
        if (!messes.assetGroupCode) { errors.assetGroupCode = 'Asset Group Code is required' }
        if (!messes.assetCategory) { errors.assetCategory = 'Asset Category is required' }
        if (!messes.assetGroup) { errors.assetGroup = 'Asset Group is required' }
        if (!messes.assetMake) { errors.assetMake = 'Asset Make is required' }
        if (!messes.assetOwnership) { errors.assetOwnership = 'Asset Ownership is required' }
        if (!messes.dateOfDeployment) { errors.dateOfDeployment = 'Date Of Deployment is required' }
        if (!messes.receiptType) { errors.receiptType = 'Receipt Type is required' }
        if (!messes.billAgainst) { errors.billAgainst = 'Bill Against is required' }
        if (!messes.billStatus) { errors.billStatus = 'Bill Status is required' }
        if (!messes.source) { errors.source = 'Source is required' }
        if (!messes.no) { errors.no = 'No is required' }
        if (!messes.rate) { errors.rate = 'Rate is required' }
        if (!messes.date) { errors.date = 'Date is required' }
        if (!messes.billStartMonth) { errors.billStartMonth = 'Bill Start Month is required' }
        if (!messes.billMonth) { errors.billMonth = 'Bill Month is required' }
        if (!messes.billNo) { errors.billNo = 'Bill No is required' }
        if (!messes.billDate) { errors.billDate = 'Bill Date is required' }
        if (!messes.billAmount) { errors.billAmount = 'Bill Amount is required' }
        if (!messes.billingRequiredGivenPeriod) { errors.billingRequiredGivenPeriod = 'Billing Required Given Period is required' }




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
                if (eventName === "no") {
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
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit Recurring Bill Master' : 'Add Recurring Bill Master'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col lg={6}>
                                <Form.Group controlId="entryDate" className="mb-3">
                                    <Form.Label>Entry Date*</Form.Label>
                                    <Flatpickr
                                        type="date"
                                        value={messes.entryDate}
                                        onChange={(selectedDates) => handleDateChange("entryDate", selectedDates)}
                                        options={dateOptions}
                                        placeholder='Enter Entry Date'
                                        // disabled={editMode}
                                        className={validationErrors.entryDate ? "form-control input-border" : "form-control"}
                                    />
                                    {validationErrors.entryDate && (
                                        <small className="text-danger">{validationErrors.entryDate}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            
                            <Col lg={6}>
                                <Form.Group controlId="projectID" className="mb-3">
                                    <Form.Label>Project ID*</Form.Label>
                                    <Form.Control
                                        type="Number"
                                        name="projectID"
                                        value={messes.projectID}
                                        onChange={handleChange}
                                        placeholder='Enter Project ID'
                                        // disabled={editMode}
                                        className={validationErrors.projectID ? " input-border" : "  "}
                                    />
                                    {validationErrors.projectID && (
                                        <small className="text-danger">{validationErrors.projectID}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="projectName" className="mb-3">
                                    <Form.Label>Project Name*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="projectName"
                                        value={messes.projectName}
                                        onChange={handleChange}
                                        placeholder='Enter Project Name'
                                        className={validationErrors.projectName ? " input-border" : "  "}
                                    />
                                    {validationErrors.projectName && (
                                        <small className="text-danger">{validationErrors.projectName}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="vendorID" className="mb-3">
                                    <Form.Label>Vendor ID*</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="vendorID"
                                        value={messes.vendorID}
                                        onChange={handleChange}
                                        placeholder='Enter Vendor ID'
                                        className={validationErrors.vendorID ? " input-border" : "  "}
                                    />
                                    {validationErrors.vendorID && (
                                        <small className="text-danger">{validationErrors.vendorID}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="vendorNameAndCode" className="mb-3">
                                    <Form.Label>Vendor Name And Code*</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="vendorNameAndCode"
                                        value={messes.vendorNameAndCode}
                                        onChange={handleChange}
                                        placeholder='Enter Vendor Name And Code'
                                        className={validationErrors.vendorNameAndCode ? " input-border" : "  "}
                                    />
                                    {validationErrors.vendorNameAndCode && (
                                        <small className="text-danger">{validationErrors.vendorNameAndCode}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="item" className="mb-3">
                                    <Form.Label>Item*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="item"
                                        value={messes.item}
                                        onChange={handleChange}
                                        placeholder='Enter Item'
                                        className={validationErrors.item ? " input-border" : "  "}
                                    />
                                    {validationErrors.item && (
                                        <small className="text-danger">{validationErrors.item}</small>
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
                                <Form.Group controlId="assetGroupCode" className="mb-3">
                                    <Form.Label>Asset Group Code*</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="assetGroupCode"
                                        value={messes.assetGroupCode}
                                        onChange={handleChange}
                                        placeholder='Enter Asset Group Code'
                                        className={validationErrors.assetGroupCode ? " input-border" : "  "}
                                    />
                                    {validationErrors.assetGroupCode && (
                                        <small className="text-danger">{validationErrors.assetGroupCode}</small>
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
                                <Form.Group controlId="dateOfDeployment" className="mb-3">
                                    <Form.Label>Date Of Deployment*</Form.Label>
                                    <Flatpickr
                                        type="text"
                                        value={messes.dateOfDeployment}
                                        onChange={(selectedDates) => handleDateChange("dateOfDeployment", selectedDates)}
                                        options={dateOptions}
                                        placeholder='Enter Date Of Deployment'
                                        className={validationErrors.dateOfDeployment ?"form-control input-border" : "form-control"}
                                    />
                                    {validationErrors.dateOfDeployment && (
                                        <small className="text-danger">{validationErrors.dateOfDeployment}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="receiptType" className="mb-3">
                                    <Form.Label>Receipt Type*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="receiptType"
                                        value={messes.receiptType}
                                        onChange={handleChange}
                                        placeholder='Enter Receipt Type'
                                        className={validationErrors.receiptType ? " input-border" : "  "}
                                    />
                                    {validationErrors.receiptType && (
                                        <small className="text-danger">{validationErrors.receiptType}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="billAgainst" className="mb-3">
                                    <Form.Label>Bill Against*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="billAgainst"
                                        value={messes.billAgainst}
                                        onChange={handleChange}
                                        placeholder='Enter Bill Against'
                                        className={validationErrors.billAgainst ? " input-border" : "  "}
                                    />
                                    {validationErrors.billAgainst && (
                                        <small className="text-danger">{validationErrors.billAgainst}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="billStatus" className="mb-3">
                                    <Form.Label>Bill Status*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="billStatus"
                                        value={messes.billStatus}
                                        onChange={handleChange}
                                        placeholder='Enter Bill Status'
                                        className={validationErrors.billStatus ? " input-border" : "  "}
                                    />
                                    {validationErrors.billStatus && (
                                        <small className="text-danger">{validationErrors.billStatus}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="source" className="mb-3">
                                    <Form.Label>Source*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="source"
                                        value={messes.source}
                                        onChange={handleChange}
                                        placeholder='Enter Source'
                                        className={validationErrors.source ? " input-border" : "  "}
                                    />
                                    {validationErrors.source && (
                                        <small className="text-danger">{validationErrors.source}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="no" className="mb-3">
                                    <Form.Label>No*</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="no"
                                        value={messes.no}
                                        onChange={handleChange}
                                        placeholder='Enter No'
                                        className={validationErrors.no ? " input-border" : "  "}
                                    />
                                    {validationErrors.no && (
                                        <small className="text-danger">{validationErrors.no}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="rate" className="mb-3">
                                    <Form.Label>Rate*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="rate"
                                        value={messes.rate}
                                        onChange={handleChange}
                                        placeholder='Enter Rate'
                                        className={validationErrors.rate ? " input-border" : "  "}
                                    />
                                    {validationErrors.rate && (
                                        <small className="text-danger">{validationErrors.rate}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="date" className="mb-3">
                                    <Form.Label>Date*</Form.Label>
                                    <Flatpickr
                                        type="date"
                                        value={messes.date}
                                        onChange={(selectedDates) => handleDateChange("date", selectedDates)}
                                        placeholder='Enter Date'
                                        className={validationErrors.date ? "form-control input-border" : "form-control"}
                                    />
                                    {validationErrors.date && (
                                        <small className="text-danger">{validationErrors.date}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="billStartMonth" className="mb-3">
                                    <Form.Label>Bill Start Month*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="billStartMonth"
                                        value={messes.billStartMonth}
                                        onChange={handleChange}
                                        placeholder='Enter Bill Start Month'
                                        className={validationErrors.billStartMonth ? " input-border" : "  "}
                                    />
                                    {validationErrors.billStartMonth && (
                                        <small className="text-danger">{validationErrors.billStartMonth}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="billMonth" className="mb-3">
                                    <Form.Label>Bill Month*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="billMonth"
                                        value={messes.billMonth}
                                        onChange={handleChange}
                                        placeholder='Enter Bill Month'
                                        className={validationErrors.billMonth ? " input-border" : "  "}
                                    />
                                    {validationErrors.billMonth && (
                                        <small className="text-danger">{validationErrors.billMonth}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="billNo" className="mb-3">
                                    <Form.Label>Bill No*</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="billNo"
                                        value={messes.billNo}
                                        onChange={handleChange}
                                        placeholder='Enter Bill No'
                                        className={validationErrors.billNo ? " input-border" : "  "}
                                    />
                                    {validationErrors.billNo && (
                                        <small className="text-danger">{validationErrors.billNo}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="billDate" className="mb-3">
                                    <Form.Label>Bill Date*</Form.Label>
                                    <Flatpickr
                                        type="text"
                                        value={messes.billDate}
                                        onChange={(selectedDates) => handleDateChange("billDate", selectedDates)}
                                        options={dateOptions}
                                        placeholder='Enter Bill Date'
                                        className={validationErrors.billDate ? "form-control input-border" : "form-control"}
                                    />
                                    {validationErrors.billDate && (
                                        <small className="text-danger">{validationErrors.billDate}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="billAmount" className="mb-3">
                                    <Form.Label>Bill Amount*</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="billAmount"
                                        value={messes.billAmount}
                                        onChange={handleChange}
                                        placeholder='Enter Bill Amount'
                                        className={validationErrors.billAmount ? " input-border" : "  "}
                                    />
                                    {validationErrors.billAmount && (
                                        <small className="text-danger">{validationErrors.billAmount}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="billingRequiredGivenPeriod" className="mb-3">
                                    <Form.Label>Billing Required Given Period*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="billingRequiredGivenPeriod"
                                        value={messes.billingRequiredGivenPeriod}
                                        onChange={handleChange}
                                        placeholder='Enter Billing Required Given Period'
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