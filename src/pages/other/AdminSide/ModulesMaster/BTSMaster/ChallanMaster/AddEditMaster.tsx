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
    itemSpecification: string,
    receiptType: string,
    challanNo: string,
    challanAmount: string,
    challanDate: string,
    billAgainst: string,
    no: string,
    amount: string,
    date: string,
    vendorCode: string,
    vendorName: string,
    billNo: string,
    billAmount: string,
    source: string,
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

const ChallanMasterAddEdit = () => {
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
        itemSpecification: '',
        receiptType: '',
        challanNo: '',
        challanAmount: '',
        challanDate: '',
        billAgainst: '',
        no: '',
        amount: '',
        date: '',
        vendorCode: '',
        vendorName: '',
        billNo: '',
        billAmount: '',
        source: '',
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
            const response = await axios.get(`${config.API_URL_APPLICATION1}/ChallanMaster/GetChallan/${id}`);
            console.log('response', response)
            if (response.data.isSuccess) {
                const fetchedModule = response.data.challanMasters[0];
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
        if (!messes.entryDate) { errors.entryDate = 'Entry Date is required'; }
        if (!messes.projectID) { errors.projectID = 'Project ID is required'; }
        if (!messes.projectName) { errors.projectName = 'Project Name is required'; }
        if (!messes.itemSpecification) { errors.itemSpecification = 'Item Specification is required'; }
        if (!messes.receiptType) { errors.receiptType = 'Receipt Type is required'; }
        if (!messes.challanNo) { errors.challanNo = 'Challan No is required'; }
        if (!messes.challanAmount) { errors.challanAmount = 'Challan Amount is required'; }
        if (!messes.challanDate) { errors.challanDate = 'Challan Date is required'; }
        if (!messes.billAgainst) { errors.billAgainst = 'Bill Against is required'; }
        if (!messes.no) { errors.no = 'No is required'; }
        if (!messes.amount) { errors.amount = 'Amount is required'; }
        if (!messes.date) { errors.date = 'Date is required'; }
        if (!messes.vendorCode) { errors.vendorCode = 'Vendor Code is required'; }
        if (!messes.vendorName) { errors.vendorName = 'Vendor Name is required'; }
        if (!messes.billNo) { errors.billNo = 'Bill No is required'; }
        if (!messes.billAmount) { errors.billAmount = 'Bill Amount is required'; }
        if (!messes.source) { errors.source = 'Source is required'; }
        if (!messes.createdDate) { errors.createdDate = 'Created Date is required'; }
        if (!messes.createdBy) { errors.createdBy = 'Created By is required'; }
        if (!messes.updatedDate) { errors.updatedDate = 'Updated Date is required'; }
        if (!messes.updatedBy) { errors.updatedBy = 'Updated By is required'; }


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

    const handleDateChange = (fieldName: string, selectedDates: Date[]) => {
        if (selectedDates.length > 0) {
            setMesses((prevData) => ({
                ...prevData,
                [fieldName]: selectedDates[0].toISOString().split("T")[0], // ✅ Store as YYYY-MM-DD
            }));
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
                await axios.put(`${config.API_URL_APPLICATION1}/ChallanMaster/UpdateChallan/${id}`, payload);
                navigate('/pages/ChallanMaster', {
                    state: {
                        successMessage: "Challan Master Updated successfully!",
                    }
                });
            } else {
                await axios.post(`${config.API_URL_APPLICATION1}/ChallanMaster/CreateChallan`, payload);
                navigate('/pages/ChallanMaster', {
                    state: {
                        successMessage: "Challan Master Added successfully!",
                    }
                });
            }
        } catch (error: any) {
            toast.error(error || 'Error Adding/Updating');
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
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit Challan Master' : 'Add Challan Master'}</span></span>
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
                                        placeholder='Enter Entry Date'
                                        options={dateOptions}
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
                                        type="number"
                                        name="projectID"
                                        value={messes.projectID}
                                        onChange={handleChange}
                                        placeholder='Enter project ID'
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
                                <Form.Group controlId="itemSpecification" className="mb-3">
                                    <Form.Label>Item Specification*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="itemSpecification"
                                        value={messes.itemSpecification}
                                        onChange={handleChange}
                                        placeholder='Enter Item Specification'
                                        className={validationErrors.itemSpecification ? " input-border" : "  "}
                                    />
                                    {validationErrors.itemSpecification && (
                                        <small className="text-danger">{validationErrors.itemSpecification}</small>
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
                                <Form.Group controlId="challanNo" className="mb-3">
                                    <Form.Label>Challan No*</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="challanNo"
                                        value={messes.challanNo}
                                        onChange={handleChange}
                                        placeholder='Enter Challan No'
                                        className={validationErrors.challanNo ? " input-border" : "  "}
                                    />
                                    {validationErrors.challanNo && (
                                        <small className="text-danger">{validationErrors.challanNo}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="challanAmount" className="mb-3">
                                    <Form.Label>Challan Amount*</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="challanAmount"
                                        value={messes.challanAmount}
                                        onChange={handleChange}
                                        placeholder='Enter Challan Amount'
                                        className={validationErrors.challanAmount ? " input-border" : "  "}
                                    />
                                    {validationErrors.challanAmount && (
                                        <small className="text-danger">{validationErrors.challanAmount}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="challanDate" className="mb-3">
                                    <Form.Label>Challan Date*</Form.Label>
                                    <Flatpickr
                                        type="date"
                                        value={messes.challanDate}
                                        onChange={(selectedDates) => handleDateChange("challanDate", selectedDates)}
                                        placeholder='Enter Challan Date'
                                        options={dateOptions}
                                        className={validationErrors.challanDate ? "form-control input-border" : "form-control"}
                                    />
                                    {validationErrors.challanDate && (
                                        <small className="text-danger">{validationErrors.challanDate}</small>
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
                                <Form.Group controlId="amount" className="mb-3">
                                    <Form.Label>Amount*</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="amount"
                                        value={messes.amount}
                                        onChange={handleChange}
                                        placeholder='Enter Amount'
                                        className={validationErrors.amount ? " input-border" : "  "}
                                    />
                                    {validationErrors.amount && (
                                        <small className="text-danger">{validationErrors.amount}</small>
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
                                        options={dateOptions}
                                        className={validationErrors.date ? "form-control input-border" : "form-control"}
                                    />
                                    {validationErrors.date && (
                                        <small className="text-danger">{validationErrors.date}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="vendorCode" className="mb-3">
                                    <Form.Label>Vendor Code*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="vendorCode"
                                        value={messes.vendorCode}
                                        onChange={handleChange}
                                        placeholder='Enter Vendor Code'
                                        className={validationErrors.vendorCode ? " input-border" : "  "}
                                    />
                                    {validationErrors.vendorCode && (
                                        <small className="text-danger">{validationErrors.vendorCode}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="vendorName" className="mb-3">
                                    <Form.Label>Vendor Name*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="vendorName"
                                        value={messes.vendorName}
                                        onChange={handleChange}
                                        placeholder='Enter Vendor Name'
                                        className={validationErrors.vendorName ? " input-border" : "  "}
                                    />
                                    {validationErrors.vendorName && (
                                        <small className="text-danger">{validationErrors.vendorName}</small>
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

export default ChallanMasterAddEdit;