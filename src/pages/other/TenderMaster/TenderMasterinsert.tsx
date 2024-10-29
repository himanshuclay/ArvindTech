

import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import config from '@/config';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_green.css';


interface Tender {
    tenderID: number;
    tenderStatus: string;
    executorCompany: string;
    country: string;
    state: string;
    workName: string;
    notificationDate: string;
    tenderLink: string;
    deptPrincipleEmployerID: string;
    deptPrincipleEmployerName: string;
    contractType: string;
    estimatedCost: string;
    docPurchaseDeadline: string;
    initialBidSubmitDate: string;
    latestBidSubmissionDate: string;
    completionPeriod: string;
    notificationFilePath: string;
    notificationFileURL: string;
    referredBy: string;
    enteredByEmpID: string;
    enteredByEmpName: string;
    entryDate: string;
    handlingType: string;
    boqDeliveryDate: string;
    executionModel: string;
    client_JVID: string;
    client_JVName: string;
    ddcVendorCode: string;
    ddcVendorName: string;
    technicalBidResultDate: string;
    financialBidOpeningDate: string;
    statusLastUpdatedDate: string;
    atBid: string;
    l1BidderCode: string;
    l1BidderName: string;
    l1Bid: string;
    loiDate: string;
    loiStatus: string;
    agreementSigned: string;
    pbgSubmissionRequired: string;
    pbgSubmissionDate: string;
    lostTenderReviewRequired: string;
    tenderComparisionReportPath: string;
    tenderComparisionReportURL: string;
    createdBy: string;
    updatedBy: string;
}


// interface DepartmentList {
//     id: string;
//     departmentName: string;
// }

interface StateList {
    id: number;
    stateName: string;
}


interface EmployeeList {
    empId: string;
    employeeName: string;
}



const DepartmentMasterinsert = () => {
    const { id } = useParams<{ id: string }>();
    // const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    // const [departmentList, setDepartmentList] = useState<DepartmentList[]>([]);
    const [stateList, setStateList] = useState<StateList[]>([]);
    const [employeeList, setEmployeeList] = useState<EmployeeList[]>([]);
    const [empName, setEmpName] = useState<string | null>()
    const [tenders, setTenders] = useState<Tender>({
        tenderID: 0,
        tenderStatus: '',
        executorCompany: '',
        country: '',
        state: '',
        workName: '',
        notificationDate: '',
        tenderLink: '',
        deptPrincipleEmployerID: '',
        deptPrincipleEmployerName: '',
        contractType: '',
        estimatedCost: '',
        docPurchaseDeadline: '',
        initialBidSubmitDate: '',
        latestBidSubmissionDate: '',
        completionPeriod: '',
        notificationFilePath: '',
        notificationFileURL: '',
        referredBy: '',
        enteredByEmpID: '',
        enteredByEmpName: '',
        entryDate: '',
        handlingType: '',
        boqDeliveryDate: '',
        executionModel: '',
        client_JVID: '',
        client_JVName: '',
        ddcVendorCode: '',
        ddcVendorName: '',
        technicalBidResultDate: '',
        financialBidOpeningDate: '',
        statusLastUpdatedDate: '',
        atBid: '',
        l1BidderCode: '',
        l1BidderName: '',
        l1Bid: '',
        loiDate: '',
        loiStatus: '',
        agreementSigned: '',
        pbgSubmissionRequired: '',
        pbgSubmissionDate: '',
        lostTenderReviewRequired: '',
        tenderComparisionReportPath: '',
        tenderComparisionReportURL: '',
        createdBy: '',
        updatedBy: '',
    });

    useEffect(() => {
        const storedEmpName = localStorage.getItem('EmpName');
        if (storedEmpName) {
            setEmpName(storedEmpName);
        }
    }, []);


    useEffect(() => {
        if (id) {
            setEditMode(true);
            fetchStaffRequirementsId(id);
        } else {
            setEditMode(false);
        }
    }, [id]);

    const fetchStaffRequirementsId = async (id: string) => {
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/DesignationMaster/GetDesignation`, {
                params: { id: id }
            });
            if (response.data.isSuccess) {
                const fetchedModule = response.data.designations[0];
                setTenders(fetchedModule);
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

        // fetchData('CommonDropdown/GetDepartment', setDepartmentList, 'getDepartments');
        fetchData('CommonDropdown/GetStateList', setStateList, 'stateListResponses');
        fetchData('CommonDropdown/GetEmployeeListWithId', setEmployeeList, 'employeeLists');
    }, []);






    const handleChange = (e: ChangeEvent<any>) => {
        const { name, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setTenders({
                ...tenders,
                [name]: checked
            });
        } else {
            const value = (e.target as HTMLInputElement | HTMLSelectElement).value;
            setTenders({
                ...tenders,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const payload = {
            ...tenders,
            createdBy: editMode ? tenders.createdBy : empName,
            updatedBy: editMode ? empName : '',
        };
        console.log(payload)
        // try {
        //     if (editMode) {
        //         await axios.post(`${config.API_URL_APPLICATION}/DesignationMaster/InsertorUpdateDesignation`, payload);
        //     } else {
        //         await axios.post(`${config.API_URL_APPLICATION}/DesignationMaster/InsertorUpdateDesignation`, payload);
        //     }
        //     navigate('/pages/DesignationMaster');
        // } catch (error) {
        //     console.error('Error submitting module:', error);
        // }
    };


    return (
        <div>
            <div className="container">
                <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center fs-20 rounded-3 border">
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit Tender' : 'Add Tender'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>




                            {/* <Col lg={6}>
                                <Form.Group controlId="department" className="mb-3">
                                    <Form.Label>Department Name</Form.Label>
                                    <Select
                                        name="department"
                                        value={departmentList.find((mod) => mod.departmentName === tenders.department)}
                                        onChange={(selectedOption) => {
                                            setDesignations({
                                                ...tenders,
                                                department: selectedOption?.departmentName || '',
                                            });
                                        }}
                                        getOptionLabel={(mod) => mod.departmentName}
                                        getOptionValue={(mod) => mod.departmentName}
                                        options={departmentList}
                                        isSearchable={true}
                                        placeholder="Select Department Name"
                                        required
                                    />
                                </Form.Group>
                            </Col> */}

                            <Col lg={6}>
                                <Form.Group controlId="tenderStatus" className="mb-3">
                                    <Form.Label>Tender Status</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="tenderStatus"
                                        value={tenders.tenderStatus}
                                        onChange={handleChange}
                                        required
                                        placeholder="Tender Status"
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="executorCompany" className="mb-3">
                                    <Form.Label>Executor Company</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="executorCompany"
                                        value={tenders.executorCompany}
                                        onChange={handleChange}
                                        required
                                        placeholder="Executor Company"
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="country" className="mb-3">
                                    <Form.Label>Country</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="country"
                                        value={tenders.country}
                                        onChange={handleChange}
                                        required
                                        placeholder="Country"
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="state" className="mb-3">
                                    <Form.Label>State</Form.Label>
                                    <Select
                                        name="department"
                                        value={stateList.find((mod) => mod.stateName === tenders.state)}
                                        onChange={(selectedOption) => {
                                            setTenders({
                                                ...tenders,
                                                state: selectedOption?.stateName || '',
                                            });
                                        }}
                                        getOptionLabel={(mod) => mod.stateName}
                                        getOptionValue={(mod) => mod.stateName}
                                        options={stateList}
                                        isSearchable={true}
                                        placeholder="Select State Name"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="workName" className="mb-3">
                                    <Form.Label>Work Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="workName"
                                        value={tenders.workName}
                                        onChange={handleChange}
                                        required
                                        placeholder="Work Name"
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="notificationDate" className="mb-3">
                                    <Form.Label>Notification Date</Form.Label>

                                    <Flatpickr
                                        value={tenders.notificationDate}
                                        onChange={([date]) => setTenders({
                                            ...tenders,
                                            notificationDate: date.toISOString()
                                        })}
                                        options={{
                                            enableTime: false,
                                            dateFormat: "Y-m-d",
                                            time_24hr: false,
                                        }}
                                        placeholder="Enter Notification Date"
                                        className="form-control"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="tenderLink" className="mb-3">
                                    <Form.Label>Tender Link</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="tenderLink"
                                        value={tenders.tenderLink}
                                        onChange={handleChange}
                                        required
                                        placeholder="Tender Link"
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="deptPrincipleEmployerName" className="mb-3">
                                    <Form.Label>Department Principal Employer Name</Form.Label>
                                    {/* <Form.Control
                                        type="text"
                                        name="deptPrincipleEmployerName"
                                        value={tenders.deptPrincipleEmployerName}
                                        onChange={handleChange}
                                        required
                                        placeholder="Department Principal Employer Name"
                                    /> */}
                                    <Select
                                        name="deptPrincipleEmployerName"
                                        value={employeeList.find((mod) => mod.employeeName === tenders.deptPrincipleEmployerName)}
                                        onChange={(selectedOption) => {
                                            setTenders({
                                                ...tenders,
                                                deptPrincipleEmployerName: selectedOption?.employeeName || '',
                                                deptPrincipleEmployerID: selectedOption?.empId || '',
                                            });
                                        }}
                                        getOptionLabel={(mod) => mod.employeeName}
                                        getOptionValue={(mod) => mod.employeeName}
                                        options={employeeList}
                                        isSearchable={true}
                                        placeholder="Select Entered By Employee Name"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="contractType" className="mb-3">
                                    <Form.Label>Contract Type</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="contractType"
                                        value={tenders.contractType}
                                        onChange={handleChange}
                                        required
                                        placeholder="Contract Type"
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="estimatedCost" className="mb-3">
                                    <Form.Label>Estimated Cost</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="estimatedCost"
                                        value={tenders.estimatedCost}
                                        onChange={handleChange}
                                        required
                                        placeholder="Estimated Cost"
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="docPurchaseDeadline" className="mb-3">
                                    <Form.Label>Document Purchase Deadline</Form.Label>
                                    <Flatpickr
                                        value={tenders.docPurchaseDeadline}
                                        onChange={([date]) => setTenders({
                                            ...tenders,
                                            docPurchaseDeadline: date.toISOString()
                                        })}
                                        options={{
                                            enableTime: false,
                                            dateFormat: "Y-m-d",
                                            time_24hr: false,
                                        }}
                                        placeholder="Enter Document Purchase Deadline"
                                        className="form-control"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="initialBidSubmitDate" className="mb-3">
                                    <Form.Label>Initial Bid Submit Date</Form.Label>

                                    <Flatpickr
                                        value={tenders.initialBidSubmitDate}
                                        onChange={([date]) => setTenders({
                                            ...tenders,
                                            initialBidSubmitDate: date.toISOString()
                                        })}
                                        options={{
                                            enableTime: false,
                                            dateFormat: "Y-m-d",
                                            time_24hr: false,
                                        }}
                                        placeholder="Enter Initial Bid Submit Date"
                                        className="form-control"
                                        required
                                    />

                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="latestBidSubmissionDate" className="mb-3">
                                    <Form.Label>Latest Bid Submission Date</Form.Label>

                                    <Flatpickr
                                        value={tenders.latestBidSubmissionDate}
                                        onChange={([date]) => setTenders({
                                            ...tenders,
                                            latestBidSubmissionDate: date.toISOString()
                                        })}
                                        options={{
                                            enableTime: false,
                                            dateFormat: "Y-m-d",
                                            time_24hr: false,
                                        }}
                                        placeholder="Enter Latest Bid Submission Date"
                                        className="form-control"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="completionPeriod" className="mb-3">
                                    <Form.Label>Completion Period</Form.Label>

                                    <Flatpickr
                                        value={tenders.completionPeriod}
                                        onChange={([date]) => setTenders({
                                            ...tenders,
                                            completionPeriod: date.toISOString()
                                        })}
                                        options={{
                                            enableTime: false,
                                            dateFormat: "Y-m-d",
                                            time_24hr: false,
                                        }}
                                        placeholder="Enter Completion Period"
                                        className="form-control"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="notificationFilePath" className="mb-3">
                                    <Form.Label>Notification File Path</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="notificationFilePath"
                                        value={tenders.notificationFilePath}
                                        onChange={handleChange}
                                        required
                                        placeholder="Notification File Path"
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="notificationFileURL" className="mb-3">
                                    <Form.Label>Notification File URL</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="notificationFileURL"
                                        value={tenders.notificationFileURL}
                                        onChange={handleChange}
                                        required
                                        placeholder="Notification File URL"
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="referredBy" className="mb-3">
                                    <Form.Label>Referred By</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="referredBy"
                                        value={tenders.referredBy}
                                        onChange={handleChange}
                                        required
                                        placeholder="Referred By"
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="enteredByEmpName" className="mb-3">
                                    <Form.Label>Entered By Employee Name</Form.Label>
                                    <Select
                                        name="enteredByEmpName"
                                        value={employeeList.find((mod) => mod.employeeName === tenders.enteredByEmpName)}
                                        onChange={(selectedOption) => {
                                            setTenders({
                                                ...tenders,
                                                enteredByEmpName: selectedOption?.employeeName || '',
                                                enteredByEmpID: selectedOption?.empId || '',
                                            });
                                        }}
                                        getOptionLabel={(mod) => mod.employeeName}
                                        getOptionValue={(mod) => mod.employeeName}
                                        options={employeeList}
                                        isSearchable={true}
                                        placeholder="Select Entered By Employee Name"
                                        required
                                    />
                                </Form.Group>
                            </Col>


                            <Col lg={6}>
                                <Form.Group controlId="entryDate" className="mb-3">
                                    <Form.Label>Entry Date</Form.Label>

                                    <Flatpickr
                                        value={tenders.entryDate}
                                        onChange={([date]) => setTenders({
                                            ...tenders,
                                            entryDate: date.toISOString()
                                        })}
                                        options={{
                                            enableTime: false,
                                            dateFormat: "Y-m-d",
                                            time_24hr: false,
                                        }}
                                        placeholder="Enter Entry Date"
                                        className="form-control"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="handlingType" className="mb-3">
                                    <Form.Label>Handling Type</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="handlingType"
                                        value={tenders.handlingType}
                                        onChange={handleChange}
                                        required
                                        placeholder="Handling Type"
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="boqDeliveryDate" className="mb-3">
                                    <Form.Label>BOQ Delivery Date</Form.Label>

                                    <Flatpickr
                                        value={tenders.boqDeliveryDate}
                                        onChange={([date]) => setTenders({
                                            ...tenders,
                                            boqDeliveryDate: date.toISOString()
                                        })}
                                        options={{
                                            enableTime: false,
                                            dateFormat: "Y-m-d",
                                            time_24hr: false,
                                        }}
                                        placeholder="Enter BOQ Delivery Date"
                                        className="form-control"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="executionModel" className="mb-3">
                                    <Form.Label>Execution Model</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="executionModel"
                                        value={tenders.executionModel}
                                        onChange={handleChange}
                                        required
                                        placeholder="Execution Model"
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="client_JVID" className="mb-3">
                                    <Form.Label>Client JVID</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="client_JVID"
                                        value={tenders.client_JVID}
                                        onChange={handleChange}
                                        required
                                        placeholder="Client JVID"
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="client_JVName" className="mb-3">
                                    <Form.Label>Client JV Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="client_JVName"
                                        value={tenders.client_JVName}
                                        onChange={handleChange}
                                        required
                                        placeholder="Client JV Name"
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="ddcVendorCode" className="mb-3">
                                    <Form.Label>DDC Vendor Code</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="ddcVendorCode"
                                        value={tenders.ddcVendorCode}
                                        onChange={handleChange}
                                        required
                                        placeholder="DDC Vendor Code"
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="ddcVendorName" className="mb-3">
                                    <Form.Label>DDC Vendor Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="ddcVendorName"
                                        value={tenders.ddcVendorName}
                                        onChange={handleChange}
                                        required
                                        placeholder="DDC Vendor Name"
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="technicalBidResultDate" className="mb-3">
                                    <Form.Label>Technical Bid Result Date</Form.Label>

                                    <Flatpickr
                                        value={tenders.technicalBidResultDate}
                                        onChange={([date]) => setTenders({
                                            ...tenders,
                                            technicalBidResultDate: date.toISOString()
                                        })}
                                        options={{
                                            enableTime: false,
                                            dateFormat: "Y-m-d",
                                            time_24hr: false,
                                        }}
                                        placeholder="Enter Technical Bid Result Date"
                                        className="form-control"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="financialBidOpeningDate" className="mb-3">
                                    <Form.Label>Financial Bid Opening Date</Form.Label>

                                    <Flatpickr
                                        value={tenders.financialBidOpeningDate}
                                        onChange={([date]) => setTenders({
                                            ...tenders,
                                            financialBidOpeningDate: date.toISOString()
                                        })}
                                        options={{
                                            enableTime: false,
                                            dateFormat: "Y-m-d",
                                            time_24hr: false,
                                        }}
                                        placeholder="Enter Financial Bid Opening Date"
                                        className="form-control"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="statusLastUpdatedDate" className="mb-3">
                                    <Form.Label>Status Last Updated Date</Form.Label>
                                    <Flatpickr
                                        value={tenders.statusLastUpdatedDate}
                                        onChange={([date]) => setTenders({
                                            ...tenders,
                                            statusLastUpdatedDate: date.toISOString()
                                        })}
                                        options={{
                                            enableTime: false,
                                            dateFormat: "Y-m-d",
                                            time_24hr: false,
                                        }}
                                        placeholder="Enter EStatus Last Updated Date"
                                        className="form-control"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="atBid" className="mb-3">
                                    <Form.Label>AT Bid</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="atBid"
                                        value={tenders.atBid}
                                        onChange={handleChange}
                                        required
                                        placeholder="AT Bid"
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="l1BidderCode" className="mb-3">
                                    <Form.Label>L1 Bidder Code</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="l1BidderCode"
                                        value={tenders.l1BidderCode}
                                        onChange={handleChange}
                                        required
                                        placeholder="L1 Bidder Code"
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="l1BidderName" className="mb-3">
                                    <Form.Label>L1 Bidder Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="l1BidderName"
                                        value={tenders.l1BidderName}
                                        onChange={handleChange}
                                        required
                                        placeholder="L1 Bidder Name"
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="l1Bid" className="mb-3">
                                    <Form.Label>L1 Bid</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="l1Bid"
                                        value={tenders.l1Bid}
                                        onChange={handleChange}
                                        required
                                        placeholder="L1 Bid"
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="loiDate" className="mb-3">
                                    <Form.Label>LOI Date</Form.Label>

                                    <Flatpickr
                                        value={tenders.loiDate}
                                        onChange={([date]) => setTenders({
                                            ...tenders,
                                            loiDate: date.toISOString()
                                        })}
                                        options={{
                                            enableTime: false,
                                            dateFormat: "Y-m-d",
                                            time_24hr: false,
                                        }}
                                        placeholder="Enter LOI Date"
                                        className="form-control"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="loiStatus" className="mb-3">
                                    <Form.Label>LOI Status</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="loiStatus"
                                        value={tenders.loiStatus}
                                        onChange={handleChange}
                                        required
                                        placeholder="LOI Status"
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="agreementSigned" className="mb-3">
                                    <Form.Label>Agreement Signed</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="agreementSigned"
                                        value={tenders.agreementSigned}
                                        onChange={handleChange}
                                        required
                                        placeholder="Agreement Signed"
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="pbgSubmissionRequired" className="mb-3">
                                    <Form.Label>PBG Submission Required</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="pbgSubmissionRequired"
                                        value={tenders.pbgSubmissionRequired}
                                        onChange={handleChange}
                                        required
                                        placeholder="PBG Submission Required"
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="pbgSubmissionDate" className="mb-3">
                                    <Form.Label>PBG Submission Date</Form.Label>

                                    <Flatpickr
                                        value={tenders.pbgSubmissionDate}
                                        onChange={([date]) => setTenders({
                                            ...tenders,
                                            pbgSubmissionDate: date.toISOString()
                                        })}
                                        options={{
                                            enableTime: false,
                                            dateFormat: "Y-m-d",
                                            time_24hr: false,
                                        }}
                                        placeholder="Enter PBG Submission Date"
                                        className="form-control"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="lostTenderReviewRequired" className="mb-3">
                                    <Form.Label>Lost Tender Review Required</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="lostTenderReviewRequired"
                                        value={tenders.lostTenderReviewRequired}
                                        onChange={handleChange}
                                        required
                                        placeholder="Lost Tender Review Required"
                                    />
                                </Form.Group>
                            </Col>


                            <Col className='align-items-end d-flex justify-content-between mb-3'>
                                <div>
                                    <span className='fs-5 '>All fields are required *</span>
                                </div>
                                <div>
                                    <Link to={'/pages/DesignationMaster'}>
                                        <Button variant="primary" >
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update Tender' : 'Add Tender'}
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

export default DepartmentMasterinsert;


