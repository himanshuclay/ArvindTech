import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
// import Select from 'react-select';
import { toast } from 'react-toastify';


interface BTS_PAYMENT {
    id: number,
    searchTeamMemberName: string,
    searchTeamMemberEmployeeID: string,
    billedProject: string,
    bundleBilledAmount: string,
    bundleID: string,
    dateHandedtoPRWTeam: string,
    recommendedAmountByAsst_Manager_Commercial: string,
    passedAmountByAGM_HO: string,
    reasonForDeduction: string,
    passedAmount: string,
    actualDateOfDispatchOfTABillstoSite: string,
    passedAmountByProject_Incharge: string,
    reimbursementOfCashbackToHeadOffice: string,
    confirmationOfReceiptOfReimbursement: string,
    createdBy: string,
    createdDate: string,
    updatedBy: string,
    updatedDate: string,
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

const TABillMasterAddEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [empName, setEmpName] = useState<string | null>('')
    const [, setProjectList] = useState<ProjectList[]>([])
    const [, setStatusList] = useState<Status[]>([])
    const [, setEmployeeList] = useState<EmployeeList[]>([])
    const [messes, setMesses] = useState<BTS_PAYMENT>({
        id: 0,
        searchTeamMemberName: '',
        searchTeamMemberEmployeeID: '',
        billedProject: '',
        bundleBilledAmount: '',
        bundleID: '',
        dateHandedtoPRWTeam: '',
        recommendedAmountByAsst_Manager_Commercial: '',
        passedAmountByAGM_HO: '',
        reasonForDeduction: '',
        passedAmount: '',
        actualDateOfDispatchOfTABillstoSite: '',
        passedAmountByProject_Incharge: '',
        reimbursementOfCashbackToHeadOffice: '',
        confirmationOfReceiptOfReimbursement: '',
        createdBy: '',
        createdDate: '',
        updatedBy: '',
        updatedDate: '',
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
            const response = await axios.get(`${config.API_URL_APPLICATION1}/TABillMaster/GetTABill/${id}`);
            console.log('response', response)
            if (response.data.isSuccess) {
                const fetchedModule = response.data.taBillMasters[0];
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

        if (!messes.searchTeamMemberName) { errors.searchTeamMemberName = 'searchTeamMemberName is required'}
        if (!messes.searchTeamMemberEmployeeID) { errors.searchTeamMemberEmployeeID = 'searchTeamMemberEmployeeID is required'}
        if (!messes.billedProject) { errors.billedProject = 'billedProject is required'}
        if (!messes.bundleBilledAmount) { errors.bundleBilledAmount = 'bundleBilledAmount is required'}
        if (!messes.bundleID) { errors.bundleID = 'bundleID is required'}
        if (!messes.dateHandedtoPRWTeam) { errors.dateHandedtoPRWTeam = 'dateHandedtoPRWTeam is required'}
        if (!messes.recommendedAmountByAsst_Manager_Commercial) { errors.recommendedAmountByAsst_Manager_Commercial = 'recommendedAmountByAsst_Manager_Commercial is required'}
        if (!messes.passedAmountByAGM_HO) { errors.passedAmountByAGM_HO = 'passedAmountByAGM_HO is required'}
        if (!messes.reasonForDeduction) { errors.reasonForDeduction = 'reasonForDeduction is required'}
        if (!messes.passedAmount) { errors.passedAmount = 'passedAmount is required'}
        if (!messes.actualDateOfDispatchOfTABillstoSite) { errors.actualDateOfDispatchOfTABillstoSite = 'actualDateOfDispatchOfTABillstoSite is required'}
        if (!messes.passedAmountByProject_Incharge) { errors.passedAmountByProject_Incharge = 'passedAmountByProject_Incharge is required'}
        if (!messes.reimbursementOfCashbackToHeadOffice) { errors.reimbursementOfCashbackToHeadOffice = 'reimbursementOfCashbackToHeadOffice is required'}
        if (!messes.confirmationOfReceiptOfReimbursement) { errors.confirmationOfReceiptOfReimbursement = 'confirmationOfReceiptOfReimbursement is required'}
  







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
                await axios.put(`${config.API_URL_APPLICATION1}/TABillMaster/UpdateTABill/${id}`, payload);
                navigate('/pages/TABillMaster', {
                    state: {
                        successMessage: "Challan Master Updated successfully!",
                    }
                });
            } else {
                await axios.post(`${config.API_URL_APPLICATION1}/TABillMaster/CreateTABill`, payload);
                navigate('/pages/TABillMaster', {
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
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit TABill Master' : 'Add TABill Master'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>

                            <Col lg={6}>
                                <Form.Group controlId="searchTeamMemberName" className="mb-3">
                                    <Form.Label>searchTeamMemberName</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="searchTeamMemberName"
                                        value={messes.searchTeamMemberName}
                                        onChange={handleChange}
                                        placeholder='Enter searchTeamMemberName'
                                        disabled={editMode}
                                        className={validationErrors.searchTeamMemberName ? " input-border" : "  "}
                                    />
                                    {validationErrors.searchTeamMemberName && (
                                        <small className="text-danger">{validationErrors.searchTeamMemberName}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="searchTeamMemberEmployeeID" className="mb-3">
                                    <Form.Label>searchTeamMemberEmployeeID</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="searchTeamMemberEmployeeID"
                                        value={messes.searchTeamMemberEmployeeID}
                                        onChange={handleChange}
                                        placeholder='Enter searchTeamMemberEmployeeID'
                                        disabled={editMode}
                                        className={validationErrors.searchTeamMemberEmployeeID ? " input-border" : "  "}
                                    />
                                    {validationErrors.searchTeamMemberEmployeeID && (
                                        <small className="text-danger">{validationErrors.searchTeamMemberEmployeeID}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="billedProject" className="mb-3">
                                    <Form.Label>billedProject</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="billedProject"
                                        value={messes.billedProject}
                                        onChange={handleChange}
                                        placeholder='Enter billedProject'
                                        disabled={editMode}
                                        className={validationErrors.billedProject ? " input-border" : "  "}
                                    />
                                    {validationErrors.billedProject && (
                                        <small className="text-danger">{validationErrors.billedProject}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="bundleBilledAmount" className="mb-3">
                                    <Form.Label>bundleBilledAmount</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="bundleBilledAmount"
                                        value={messes.bundleBilledAmount}
                                        onChange={handleChange}
                                        placeholder='Enter bundleBilledAmount'
                                        disabled={editMode}
                                        className={validationErrors.bundleBilledAmount ? " input-border" : "  "}
                                    />
                                    {validationErrors.bundleBilledAmount && (
                                        <small className="text-danger">{validationErrors.bundleBilledAmount}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="bundleID" className="mb-3">
                                    <Form.Label>bundleID</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="bundleID"
                                        value={messes.bundleID}
                                        onChange={handleChange}
                                        placeholder='Enter Project ID'
                                        className={validationErrors.bundleID ? " input-border" : "  "}
                                    />
                                    {validationErrors.bundleID && (
                                        <small className="text-danger">{validationErrors.bundleID}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="dateHandedtoPRWTeam" className="mb-3">
                                    <Form.Label>dateHandedtoPRWTeam</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="dateHandedtoPRWTeam"
                                        value={messes.dateHandedtoPRWTeam}
                                        onChange={handleChange}
                                        placeholder='Enter Project Name'
                                        className={validationErrors.dateHandedtoPRWTeam ? " input-border" : "  "}
                                    />
                                    {validationErrors.dateHandedtoPRWTeam && (
                                        <small className="text-danger">{validationErrors.dateHandedtoPRWTeam}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="recommendedAmountByAsst_Manager_Commercial" className="mb-3">
                                    <Form.Label>recommendedAmountByAsst_Manager_Commercial</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="recommendedAmountByAsst_Manager_Commercial"
                                        value={messes.recommendedAmountByAsst_Manager_Commercial}
                                        onChange={handleChange}
                                        className={validationErrors.recommendedAmountByAsst_Manager_Commercial ? "input-border" : ""}
                                    />

                                    {validationErrors.recommendedAmountByAsst_Manager_Commercial && (
                                        <small className="text-danger">{validationErrors.recommendedAmountByAsst_Manager_Commercial}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="passedAmountByAGM_HO" className="mb-3">
                                    <Form.Label>passedAmountByAGM_HO</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="passedAmountByAGM_HO"
                                        value={messes.passedAmountByAGM_HO}
                                        onChange={handleChange}
                                        className={validationErrors.passedAmountByAGM_HO ? "input-border" : ""}
                                    />

                                    {validationErrors.passedAmountByAGM_HO && (
                                        <small className="text-danger">{validationErrors.passedAmountByAGM_HO}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="reasonForDeduction" className="mb-3">
                                    <Form.Label>reasonForDeduction</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="reasonForDeduction"
                                        value={messes.reasonForDeduction}
                                        onChange={handleChange}
                                        className={validationErrors.reasonForDeduction ? "input-border" : ""}
                                    />

                                    {validationErrors.reasonForDeduction && (
                                        <small className="text-danger">{validationErrors.reasonForDeduction}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="passedAmount" className="mb-3">
                                    <Form.Label>passedAmount</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="passedAmount"
                                        value={messes.passedAmount}
                                        onChange={handleChange}
                                        className={validationErrors.passedAmount ? "input-border" : ""}
                                    />

                                    {validationErrors.passedAmount && (
                                        <small className="text-danger">{validationErrors.passedAmount}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="actualDateOfDispatchOfTABillstoSite" className="mb-3">
                                    <Form.Label>actualDateOfDispatchOfTABillstoSite</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="actualDateOfDispatchOfTABillstoSite"
                                        value={messes.actualDateOfDispatchOfTABillstoSite}
                                        onChange={handleChange}
                                        className={validationErrors.actualDateOfDispatchOfTABillstoSite ? "input-border" : ""}
                                    />

                                    {validationErrors.actualDateOfDispatchOfTABillstoSite && (
                                        <small className="text-danger">{validationErrors.actualDateOfDispatchOfTABillstoSite}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="passedAmountByProject_Incharge" className="mb-3">
                                    <Form.Label>passedAmountByProject_Incharge</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="passedAmountByProject_Incharge"
                                        value={messes.passedAmountByProject_Incharge}
                                        onChange={handleChange}
                                        className={validationErrors.passedAmountByProject_Incharge ? "input-border" : ""}
                                    />

                                    {validationErrors.passedAmountByProject_Incharge && (
                                        <small className="text-danger">{validationErrors.passedAmountByProject_Incharge}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="reimbursementOfCashbackToHeadOffice" className="mb-3">
                                    <Form.Label>reimbursementOfCashbackToHeadOffice</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="reimbursementOfCashbackToHeadOffice"
                                        value={messes.reimbursementOfCashbackToHeadOffice}
                                        onChange={handleChange}
                                        className={validationErrors.reimbursementOfCashbackToHeadOffice ? "input-border" : ""}
                                    />

                                    {validationErrors.reimbursementOfCashbackToHeadOffice && (
                                        <small className="text-danger">{validationErrors.reimbursementOfCashbackToHeadOffice}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="confirmationOfReceiptOfReimbursement" className="mb-3">
                                    <Form.Label>confirmationOfReceiptOfReimbursement</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="confirmationOfReceiptOfReimbursement"
                                        value={messes.confirmationOfReceiptOfReimbursement}
                                        onChange={handleChange}
                                        className={validationErrors.confirmationOfReceiptOfReimbursement ? "input-border" : ""}
                                    />

                                    {validationErrors.confirmationOfReceiptOfReimbursement && (
                                        <small className="text-danger">{validationErrors.confirmationOfReceiptOfReimbursement}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            













                            <Col className='align-items-end d-flex justify-content-between mb-3'>
                                <div>
                                    <span className='fs-5 '>This field is required*</span>
                                </div>
                                <div>
                                    <Link to={'/pages/TABillMaster'}>
                                        <Button variant="primary" >
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update TABill' : 'Add TABill'}
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

export default TABillMasterAddEdit;