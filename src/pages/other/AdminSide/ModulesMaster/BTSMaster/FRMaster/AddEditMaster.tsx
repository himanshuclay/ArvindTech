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
    btsid: string,
    billEntryDate: string,
    projectID: string,
    projectName: string,
    clientJVName: string,
    vendorName: string,
    receiptType: string,
    fRorIOMNumber: string,
    frAmount: string,
    paidAmount: string,
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

const FRMasterAddEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [empName, setEmpName] = useState<string | null>('')
    const [, setProjectList] = useState<ProjectList[]>([])
    const [, setStatusList] = useState<Status[]>([])
    const [, setEmployeeList] = useState<EmployeeList[]>([])
    const [messes, setMesses] = useState<BTS_PAYMENT>({
        id: 0,
        btsid: '',
        billEntryDate: '',
        projectID: '',
        projectName: '',
        clientJVName: '',
        vendorName: '',
        receiptType: '',
        fRorIOMNumber: '',
        frAmount: '',
        paidAmount: '',
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
            const response = await axios.get(`${config.API_URL_APPLICATION1}/FRMaster/GetFR/${id}`);
            console.log('response', response)
            if (response.data.isSuccess) {
                const fetchedModule = response.data.fRMasters[0];
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

        if (!messes.btsid) { errors.btsid = 'BTS Id is required' }
        if (!messes.billEntryDate) { errors.billEntryDate = 'Bill Entry Date is required' }
        if (!messes.projectID) { errors.projectID = 'Project ID is required' }
        if (!messes.projectName) { errors.projectName = 'Project Name is required' }
        if (!messes.clientJVName) { errors.clientJVName = 'Client JV Name is required' }
        if (!messes.vendorName) { errors.vendorName = 'Vendor Name is required' }
        if (!messes.receiptType) { errors.receiptType = 'Receipt Type is required' }
        if (!messes.fRorIOMNumber) { errors.fRorIOMNumber = 'FR or IOM Number is required' }
        if (!messes.frAmount) { errors.frAmount = 'FR Amount is required' }
        if (!messes.paidAmount) { errors.paidAmount = 'Paid Amount is required' }



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
                await axios.put(`${config.API_URL_APPLICATION1}/FRMaster/UpdateFR/${id}`, payload);
                navigate('/pages/FRMaster', {
                    state: {
                        successMessage: "Challan Master Updated successfully!",
                    }
                });
            } else {
                await axios.post(`${config.API_URL_APPLICATION1}/FRMaster/CreateFR`, payload);
                navigate('/pages/FRMaster', {
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
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit FR Master' : 'Add FR Master'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col lg={6}>
                                <Form.Group controlId="btsid" className="mb-3">
                                    <Form.Label>BTS ID*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="btsid"
                                        value={messes.btsid}
                                        onChange={handleChange}
                                        placeholder='Enter BTS ID'
                                        // disabled={editMode}
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
                                    <Flatpickr
                                        type="text"
                                        value={messes.billEntryDate}
                                        onChange={(selectedDates) => handleDateChange("billEntryDate", selectedDates)}
                                        options={dateOptions}
                                        placeholder='Enter Bill Entry Date'
                                        // disabled={editMode}
                                        className={validationErrors.billEntryDate ? "form-control input-border" : "form-control"}
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
                                        type="text"
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
                                <Form.Group controlId="clientJVName" className="mb-3">
                                    <Form.Label>Client JV Name*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="clientJVName"
                                        value={messes.clientJVName}
                                        onChange={handleChange}
                                        placeholder='Enter Client JV Name'
                                        className={validationErrors.clientJVName ? " input-border" : "  "}
                                    />
                                    {validationErrors.clientJVName && (
                                        <small className="text-danger">{validationErrors.clientJVName}</small>
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
                                <Form.Group controlId="receiptType" className="mb-3">
                                    <Form.Label>receipt Type*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="receiptType"
                                        value={messes.receiptType}
                                        onChange={handleChange}
                                        placeholder='Enter receipt Type'
                                        className={validationErrors.receiptType ? " input-border" : "  "}
                                    />
                                    {validationErrors.receiptType && (
                                        <small className="text-danger">{validationErrors.receiptType}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="fRorIOMNumber" className="mb-3">
                                    <Form.Label>FR or IOM Number*</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="fRorIOMNumber"
                                        value={messes.fRorIOMNumber}
                                        onChange={handleChange}
                                        placeholder='Enter FR or IOM Number'
                                        className={validationErrors.fRorIOMNumber ? " input-border" : "  "}
                                    />
                                    {validationErrors.fRorIOMNumber && (
                                        <small className="text-danger">{validationErrors.fRorIOMNumber}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="frAmount" className="mb-3">
                                    <Form.Label>FR Amount*</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="frAmount"
                                        value={messes.frAmount}
                                        onChange={handleChange}
                                        placeholder='Enter FR Amount'
                                        className={validationErrors.frAmount ? " input-border" : "  "}
                                    />
                                    {validationErrors.frAmount && (
                                        <small className="text-danger">{validationErrors.frAmount}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="paidAmount" className="mb-3">
                                    <Form.Label>Paid Amount*</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="paidAmount"
                                        value={messes.paidAmount}
                                        onChange={handleChange}
                                        placeholder='Enter Paid Amount'
                                        className={validationErrors.paidAmount ? " input-border" : "  "}
                                    />
                                    {validationErrors.paidAmount && (
                                        <small className="text-danger">{validationErrors.paidAmount}</small>
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

export default FRMasterAddEdit;