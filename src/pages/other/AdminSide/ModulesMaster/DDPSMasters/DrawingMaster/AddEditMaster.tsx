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
    structureID: string,
    structureType: string,
    pmsStartDate: string,
    typeofDesign: string,
    pierorSpanorChainageNo: string,
    drawingBoardCategory: string,
    dtni: number,
    drawingStatus: string,
    expectedIssuanceDate: string,
    drawingTitle: string,
    drawingNumber: string,
    numberofSheet: number,
    revisionNumbe: number,
    subjectofEmail: string,
    dateofEmail: string,
    gfcDate: string,
    piReview: string,
    jvReview: string,
    pC1Review: string,
    pC2Review: string,
    ddcReview: string,
    gfcSigned: string,
    signedGFCShared: string,
    completionDate: string,
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

const DrawingMasterAddEdit = () => {
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
        structureID: '',
        structureType: '',
        pmsStartDate: '',
        typeofDesign: '',
        pierorSpanorChainageNo: '',
        drawingBoardCategory: '',
        dtni: 0,
        drawingStatus: '',
        expectedIssuanceDate: '',
        drawingTitle: '',
        drawingNumber: '',
        numberofSheet: 0,
        revisionNumbe: 0,
        subjectofEmail: '',
        dateofEmail: '',
        gfcDate: '',
        piReview: '',
        jvReview: '',
        pC1Review: '',
        pC2Review: '',
        ddcReview: '',
        gfcSigned: '',
        signedGFCShared: '',
        completionDate: '',
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
            const response = await axios.get(`${config.API_URL_APPLICATION1}/DrawingMaster/GetDrawing/${id}`);
            console.log('response', response)
            if (response.data.isSuccess) {
                const fetchedModule = response.data.drawingMasters[0];
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

        if (!messes.projectID) { errors.projectID = 'Project ID is required'}
        if (!messes.projectName) { errors.projectName = 'Project Name is required'}
        if (!messes.structureID) { errors.structureID = 'Structure ID is required'}
        if (!messes.structureType) { errors.structureType = 'Structure Type is required'}
        if (!messes.pmsStartDate) { errors.pmsStartDate = 'PMS Start Date is required'}
        if (!messes.typeofDesign) { errors.typeofDesign = 'Type of Design is required'}
        if (!messes.pierorSpanorChainageNo) { errors.pierorSpanorChainageNo = 'Pieror Spanor Chainage No is required'}
        if (!messes.drawingBoardCategory) { errors.drawingBoardCategory = 'Drawing Board Category is required'}
        if (!messes.dtni) { errors.dtni = 'DTNI is required'}
        if (!messes.drawingStatus) { errors.drawingStatus = 'Drawing Status is required'}
        if (!messes.expectedIssuanceDate) { errors.expectedIssuanceDate = 'Expected Issuance Date is required'}
        if (!messes.drawingTitle) { errors.drawingTitle = 'Drawing Title is required'}
        if (!messes.drawingNumber) { errors.drawingNumber = 'Drawing Number is required'}
        if (!messes.numberofSheet) { errors.numberofSheet = 'Number of Sheet is required'}
        if (!messes.revisionNumbe) { errors.revisionNumbe = 'Revision Numbe is required'}
        if (!messes.subjectofEmail) { errors.subjectofEmail = 'Subject of Email is required'}
        if (!messes.dateofEmail) { errors.dateofEmail = 'Date of Email is required'}
        if (!messes.gfcDate) { errors.gfcDate = 'GFC Date is required'}
        if (!messes.piReview) { errors.piReview = 'PI Review is required'}
        if (!messes.jvReview) { errors.jvReview = 'JV Review is required'}
        if (!messes.pC1Review) { errors.pC1Review = 'P C1 Review is required'}
        if (!messes.pC2Review) { errors.pC2Review = 'P C2 Review is required'}
        if (!messes.ddcReview) { errors.ddcReview = 'DDC Review is required'}
        if (!messes.gfcSigned) { errors.gfcSigned = 'GFC Signed is required'}
        if (!messes.signedGFCShared) { errors.signedGFCShared = 'Signed GFC Shared is required'}
        if (!messes.completionDate) { errors.completionDate = 'Completion Date is required'}
    



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
                await axios.put(`${config.API_URL_APPLICATION1}/DrawingMaster/UpdateDrawing/${id}`, payload);
                navigate('/pages/DrawingMaster', {
                    state: {
                        successMessage: "Challan Master Updated successfully!",
                    }
                });
            } else {
                await axios.post(`${config.API_URL_APPLICATION1}/DrawingMaster/CreateDrawing`, payload);
                navigate('/pages/DrawingMaster', {
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
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit Drawing Master' : 'Add Drawing Master'}</span></span>
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
                                <Form.Group controlId="structureID" className="mb-3">
                                    <Form.Label>Structure ID*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="structureID"
                                        value={messes.structureID}
                                        onChange={handleChange}
                                        placeholder='Enter Structure Id'
                                        className={validationErrors.structureID ? " input-border" : "  "}
                                    />
                                    {validationErrors.structureID && (
                                        <small className="text-danger">{validationErrors.structureID}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="structureType" className="mb-3">
                                    <Form.Label>Structure Type*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="structureType"
                                        value={messes.structureType}
                                        onChange={handleChange}
                                        placeholder='Enter Structure Type'
                                        className={validationErrors.structureType ? " input-border" : "  "}
                                    />
                                    {validationErrors.structureType && (
                                        <small className="text-danger">{validationErrors.structureType}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="pmsStartDate" className="mb-3">
                                    <Form.Label>PMS Start Date*</Form.Label>
                                    <Flatpickr
                                        type="text"
                                        value={messes.pmsStartDate}
                                        onChange={(selectedDates) => handleDateChange("pmsStartDate", selectedDates)}
                                        options={dateOptions}
                                        placeholder='Enter PMS Start Date'
                                        className={validationErrors.pmsStartDate ? "form-control input-border" : "form-control"}
                                    />
                                    {validationErrors.pmsStartDate && (
                                        <small className="text-danger">{validationErrors.pmsStartDate}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="typeofDesign" className="mb-3">
                                    <Form.Label>Type of Design*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="typeofDesign"
                                        value={messes.typeofDesign}
                                        onChange={handleChange}
                                        placeholder='Enter Type of Design'
                                        className={validationErrors.typeofDesign ? " input-border" : "  "}
                                    />
                                    {validationErrors.typeofDesign && (
                                        <small className="text-danger">{validationErrors.typeofDesign}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="pierorSpanorChainageNo" className="mb-3">
                                    <Form.Label>Pieror Spanor Chainage No*</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="pierorSpanorChainageNo"
                                        value={messes.pierorSpanorChainageNo}
                                        onChange={handleChange}
                                        placeholder='Enter Pieror Spanor Chainage No'
                                        className={validationErrors.pierorSpanorChainageNo ? " input-border" : "  "}
                                    />
                                    {validationErrors.pierorSpanorChainageNo && (
                                        <small className="text-danger">{validationErrors.pierorSpanorChainageNo}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="drawingBoardCategory" className="mb-3">
                                    <Form.Label>Drawing Board Category*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="drawingBoardCategory"
                                        value={messes.drawingBoardCategory}
                                        onChange={handleChange}
                                        placeholder='Enter Drawing Board Category'
                                        className={validationErrors.drawingBoardCategory ? " input-border" : "  "}
                                    />
                                    {validationErrors.drawingBoardCategory && (
                                        <small className="text-danger">{validationErrors.drawingBoardCategory}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="dtni" className="mb-3">
                                    <Form.Label>DTNI*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="dtni"
                                        value={messes.dtni}
                                        onChange={handleChange}
                                        placeholder='Enter DTNI'
                                        className={validationErrors.dtni ? " input-border" : "  "}
                                    />
                                    {validationErrors.dtni && (
                                        <small className="text-danger">{validationErrors.dtni}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="drawingStatus" className="mb-3">
                                    <Form.Label>Drawing Status*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="drawingStatus"
                                        value={messes.drawingStatus}
                                        onChange={handleChange}
                                        placeholder='Enter Drawing Status'
                                        className={validationErrors.drawingStatus ? " input-border" : "  "}
                                    />
                                    {validationErrors.drawingStatus && (
                                        <small className="text-danger">{validationErrors.drawingStatus}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="expectedIssuanceDate" className="mb-3">
                                    <Form.Label>Expected Issuance Date*</Form.Label>
                                    <Flatpickr
                                        type="text"
                                        value={messes.expectedIssuanceDate}
                                        options={dateOptions}
                                        onChange={(selectedDates) => handleDateChange("expectedIssuanceDate", selectedDates)}
                                        placeholder='Enter Expected Issuance Date'
                                        className={validationErrors.expectedIssuanceDate ? "form-control input-border" : "form-control"}
                                    />
                                    {validationErrors.expectedIssuanceDate && (
                                        <small className="text-danger">{validationErrors.expectedIssuanceDate}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="drawingTitle" className="mb-3">
                                    <Form.Label>Drawing Title*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="drawingTitle"
                                        value={messes.drawingTitle}
                                        onChange={handleChange}
                                        placeholder='Enter Drawing Title'
                                        className={validationErrors.drawingTitle ? " input-border" : "  "}
                                    />
                                    {validationErrors.drawingTitle && (
                                        <small className="text-danger">{validationErrors.drawingTitle}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="drawingNumber" className="mb-3">
                                    <Form.Label>Drawing Number*</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="drawingNumber"
                                        value={messes.drawingNumber}
                                        onChange={handleChange}
                                        placeholder='Enter Drawing Number'
                                        className={validationErrors.drawingNumber ? " input-border" : "  "}
                                    />
                                    {validationErrors.drawingNumber && (
                                        <small className="text-danger">{validationErrors.drawingNumber}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="numberofSheet" className="mb-3">
                                    <Form.Label>Number of Sheet*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="numberofSheet"
                                        value={messes.numberofSheet}
                                        onChange={handleChange}
                                        placeholder='Enter Number of Sheet'
                                        className={validationErrors.numberofSheet ? " input-border" : "  "}
                                    />
                                    {validationErrors.numberofSheet && (
                                        <small className="text-danger">{validationErrors.numberofSheet}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="revisionNumbe" className="mb-3">
                                    <Form.Label>Revision Numbe*</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="revisionNumbe"
                                        value={messes.revisionNumbe}
                                        onChange={handleChange}
                                        placeholder='Enter Revision Numbe'
                                        className={validationErrors.revisionNumbe ? " input-border" : "  "}
                                    />
                                    {validationErrors.revisionNumbe && (
                                        <small className="text-danger">{validationErrors.revisionNumbe}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="subjectofEmail" className="mb-3">
                                    <Form.Label>Subject of Email*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="subjectofEmail"
                                        value={messes.subjectofEmail}
                                        onChange={handleChange}
                                        placeholder='Enter Subject of Email'
                                        className={validationErrors.subjectofEmail ? " input-border" : "  "}
                                    />
                                    {validationErrors.subjectofEmail && (
                                        <small className="text-danger">{validationErrors.subjectofEmail}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="dateofEmail" className="mb-3">
                                    <Form.Label>Date of Email*</Form.Label>
                                    <Flatpickr
                                        type="text"
                                        value={messes.dateofEmail}
                                        onChange={(selectedDates) => handleDateChange("dateofEmail", selectedDates)}
                                        options={dateOptions}
                                        placeholder='Enter Date of Email'
                                        className={validationErrors.dateofEmail ? "form-control input-border" : "form-control"}
                                    />
                                    {validationErrors.dateofEmail && (
                                        <small className="text-danger">{validationErrors.dateofEmail}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="gfcDate" className="mb-3">
                                    <Form.Label>GFC Date*</Form.Label>
                                    <Flatpickr
                                        type="text"
                                        value={messes.gfcDate}
                                        onChange={(selectedDates) => handleDateChange("gfcDate", selectedDates)}
                                        placeholder='Enter GFC Date'
                                        options={dateOptions}
                                        className={validationErrors.gfcDate ? "form-control input-border" : "form-control"}
                                    />
                                    {validationErrors.gfcDate && (
                                        <small className="text-danger">{validationErrors.gfcDate}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="piReview" className="mb-3">
                                    <Form.Label>PI Review*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="piReview"
                                        value={messes.piReview}
                                        onChange={handleChange}
                                        placeholder='Enter PI Review'
                                        className={validationErrors.piReview ? " input-border" : "  "}
                                    />
                                    {validationErrors.piReview && (
                                        <small className="text-danger">{validationErrors.piReview}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="jvReview" className="mb-3">
                                    <Form.Label>JV Review*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="jvReview"
                                        value={messes.jvReview}
                                        onChange={handleChange}
                                        placeholder='Enter JV Review'
                                        className={validationErrors.jvReview ? " input-border" : "  "}
                                    />
                                    {validationErrors.jvReview && (
                                        <small className="text-danger">{validationErrors.jvReview}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="pC1Review" className="mb-3">
                                    <Form.Label>P C1 Review*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="pC1Review"
                                        value={messes.pC1Review}
                                        onChange={handleChange}
                                        placeholder='Enter P C1 Review'
                                        className={validationErrors.pC1Review ? " input-border" : "  "}
                                    />
                                    {validationErrors.pC1Review && (
                                        <small className="text-danger">{validationErrors.pC1Review}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="pC2Review" className="mb-3">
                                    <Form.Label>P C2 Review*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="pC2Review"
                                        value={messes.pC2Review}
                                        onChange={handleChange}
                                        placeholder='Enter P C2 Review'
                                        className={validationErrors.pC2Review ? " input-border" : "  "}
                                    />
                                    {validationErrors.pC2Review && (
                                        <small className="text-danger">{validationErrors.pC2Review}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="ddcReview" className="mb-3">
                                    <Form.Label>DDC Review*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="ddcReview"
                                        value={messes.ddcReview}
                                        onChange={handleChange}
                                        placeholder='Enter DDC Review'
                                        className={validationErrors.ddcReview ? " input-border" : "  "}
                                    />
                                    {validationErrors.ddcReview && (
                                        <small className="text-danger">{validationErrors.ddcReview}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="gfcSigned" className="mb-3">
                                    <Form.Label>GFC Signed*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="gfcSigned"
                                        value={messes.gfcSigned}
                                        onChange={handleChange}
                                        placeholder='Enter GFC Signed'
                                        className={validationErrors.gfcSigned ? " input-border" : "  "}
                                    />
                                    {validationErrors.gfcSigned && (
                                        <small className="text-danger">{validationErrors.gfcSigned}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="signedGFCShared" className="mb-3">
                                    <Form.Label>Signed GFC Shared*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="signedGFCShared"
                                        value={messes.signedGFCShared}
                                        onChange={handleChange}
                                        placeholder='Enter Signed GFC Shared'
                                        className={validationErrors.signedGFCShared ? " input-border" : "  "}
                                    />
                                    {validationErrors.signedGFCShared && (
                                        <small className="text-danger">{validationErrors.signedGFCShared}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="completionDate" className="mb-3">
                                    <Form.Label>Completion Date*</Form.Label>
                                    <Flatpickr
                                        type="text"
                                        value={messes.completionDate}
                                        onChange={(selectedDates) => handleDateChange("completionDate", selectedDates)}
                                        options={dateOptions}
                                        placeholder='Enter Completion Date'
                                        className={validationErrors.completionDate ? "form-control input-border" : "form-control"}
                                    />
                                    {validationErrors.completionDate && (
                                        <small className="text-danger">{validationErrors.completionDate}</small>
                                    )}
                                </Form.Group>
                            </Col>


                            <Col className='align-items-end d-flex justify-content-between mb-3'>
                                <div>
                                    <span className='fs-5 '>This field is required*</span>
                                </div>
                                <div>
                                    <Link to={'/pages/DrawingMaster'}>
                                        <Button variant="primary" >
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update Drawing' : 'Add Drawing'}
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

export default DrawingMasterAddEdit;