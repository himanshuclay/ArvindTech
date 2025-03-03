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
    projectID: string,
    projectName: string,
    vendorCodeName: string,
    billDate: string,
    gstHoldAmount: string,
    gstMonth: string,
    gstR2AFiling: string,
    filingFrequency: string,
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

const MisMatchMasterAddEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [empName, setEmpName] = useState<string | null>('')
    const [, setProjectList] = useState<ProjectList[]>([])
    const [, setStatusList] = useState<Status[]>([])
    const [, setEmployeeList] = useState<EmployeeList[]>([])
    const [messes, setMesses] = useState<BTS_PAYMENT>({
        id: 0,
        projectID: '',
        projectName: '',
        vendorCodeName: '',
        billDate: '',
        gstHoldAmount: '',
        gstMonth: '',
        gstR2AFiling: '',
        filingFrequency: '',
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
            const response = await axios.get(`${config.API_URL_APPLICATION1}/MisMatchMaster/GetMisMatch/${id}`);
            console.log('response', response)
            if (response.data.isSuccess) {
                const fetchedModule = response.data.misMatchMasters[0];
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


        if (!messes.projectID) { errors.projectID = 'Project ID is required' }
        if (!messes.projectName) { errors.projectName = 'Project Name is required' }
        if (!messes.vendorCodeName) { errors.vendorCodeName = 'Vendor Code Name is required' }
        if (!messes.billDate) { errors.billDate = 'Bill Date is required' }
        if (!messes.gstHoldAmount) { errors.gstHoldAmount = 'GST Hold Amount is required' }
        if (!messes.gstMonth) { errors.gstMonth = 'GST Month is required' }
        if (!messes.gstR2AFiling) { errors.gstR2AFiling = 'GST R2A Filing is required' }
        if (!messes.filingFrequency) { errors.filingFrequency = 'Filing Frequency is required' }




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
                await axios.put(`${config.API_URL_APPLICATION1}/MisMatchMaster/UpdateMisMatch/${id}`, payload);
                navigate('/pages/MismatchMaster', {
                    state: {
                        successMessage: "Mis Match Master Updated successfully!",
                    }
                });
            } else {
                await axios.post(`${config.API_URL_APPLICATION1}/MisMatchMaster/CreateMisMatch`, payload);
                navigate('/pages/MismatchMaster', {
                    state: {
                        successMessage: "Mis Match Master Added successfully!",
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
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit Mis Match Master' : 'Add Mis Match Master'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                           
                            <Col lg={6}>
                                <Form.Group controlId="projectID" className="mb-3">
                                    <Form.Label>Project ID*</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="projectID"
                                        value={messes.projectID}
                                        onChange={handleChange}
                                        placeholder='Enter Project ID'
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
                                <Form.Group controlId="vendorCodeName" className="mb-3">
                                    <Form.Label>Vendor Code Name*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="vendorCodeName"
                                        value={messes.vendorCodeName}
                                        onChange={handleChange}
                                        placeholder='Enter Vendor Code Name'
                                        className={validationErrors.vendorCodeName ? " input-border" : "  "}
                                    />
                                    {validationErrors.vendorCodeName && (
                                        <small className="text-danger">{validationErrors.vendorCodeName}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="billDate" className="mb-3">
                                    <Form.Label>Bill Date*</Form.Label>
                                    <Flatpickr
                                        type="date"
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
                                <Form.Group controlId="gstHoldAmount" className="mb-3">
                                    <Form.Label>GST Hold Amount*</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="gstHoldAmount"
                                        value={messes.gstHoldAmount}
                                        onChange={handleChange}
                                        placeholder='Enter GST Hold Amount'
                                        className={validationErrors.gstHoldAmount ? " input-border" : "  "}
                                    />
                                    {validationErrors.gstHoldAmount && (
                                        <small className="text-danger">{validationErrors.gstHoldAmount}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="gstMonth" className="mb-3">
                                    <Form.Label>GST Month*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="gstMonth"
                                        value={messes.gstMonth}
                                        onChange={handleChange}
                                        placeholder='Enter GST Month'
                                        className={validationErrors.gstMonth ? " input-border" : "  "}
                                    />
                                    {validationErrors.gstMonth && (
                                        <small className="text-danger">{validationErrors.gstMonth}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="gstR2AFiling" className="mb-3">
                                    <Form.Label>GST R2A Filing*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="gstR2AFiling"
                                        value={messes.gstR2AFiling}
                                        onChange={handleChange}
                                        placeholder='Enter GST R2A Filing'
                                        className={validationErrors.gstR2AFiling ? " input-border" : "  "}
                                    />
                                    {validationErrors.gstR2AFiling && (
                                        <small className="text-danger">{validationErrors.gstR2AFiling}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="filingFrequency" className="mb-3">
                                    <Form.Label>Filing Frequency*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="filingFrequency"
                                        value={messes.filingFrequency}
                                        onChange={handleChange}
                                        placeholder='Enter Filing Frequency'
                                        className={validationErrors.filingFrequency ? " input-border" : "  "}
                                    />
                                    {validationErrors.filingFrequency && (
                                        <small className="text-danger">{validationErrors.filingFrequency}</small>
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

export default MisMatchMasterAddEdit;