// import axios from 'axios';
// import { useEffect, useState, ChangeEvent } from 'react';
// import { Button, Col, Form, Row } from 'react-bootstrap';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import config from '@/config';
// import Select from 'react-select';
// import { toast } from 'react-toastify';


// interface BTS_PAYMENT {
//     id: number,
//     tenderID: string,
//     clientID: string,
//     client_JVName: string,
//     contractType: string,
//     executionModel: string,
//     workName: string,
//     country: string,
//     state: string,
//     projectID: string,
//     projectName: string,
//     workStartDate: string,
//     contractualCompletionDate: string,
//     projectCoordinatorEmpID: string,
//     projectCoordinatorName: string,
//     projectCoordinatorNumber: string,
//     projectInchargeEmpID: string,
//     projectInchargeName: string,
//     projectInchargeNumber: string,
//     projectInchargeEmpID2: string,
//     projectInchargeName2: string,
//     projectInchargeNumber2: string,
//     decisionToMobilize: string,
//     expectedMobilizationDate: string,
//     expectedDateofKickofMeeting: string,
//     keyMobTeamDeployedTeam1: string,
//     keyMobTeamDeployedTeam1Date: string,
//     keyMobTeamDeployedTeam2: string,
//     keyMobTeamDeployedTeam2Date: string,
//     constructionProgramSubmitted: string,
//     constructionProgramSubmittedDate: string,
//     layoutPlanFinalized: string,
//     campConstructionCompleted: string,
//     electricalPlanFinalized: string,
//     electricalPlanFinalizationDate: string,
//     topographicReportShared: string,
//     alignmentReportShared: string,
//     hindranceListReviewed: string,
//     bankAccountOpened: string,
//     guestHouseFinalized: string,
//     labCommissioned: string,
//     labCommissioningDate: string,
//     campLandFinalized: string,
//     createdDate: string,
//     createdBy: string,
//     updatedDate: string,
//     updatedBy: string,
// }

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

// const MobilizationMasterAddEdit = () => {
//     const { id } = useParams<{ id: string }>();
//     // const navigate = useNavigate();
//     const [editMode, setEditMode] = useState<boolean>(false);
//     // const [empName, setEmpName] = useState<string | null>('')
//     // const [projectList, setProjectList] = useState<ProjectList[]>([])
//     // const [statusList, setStatusList] = useState<Status[]>([])
//     // const [employeeList, setEmployeeList] = useState<EmployeeList[]>([])
//     const [messes, setMesses] = useState<BTS_PAYMENT>({
//         id: 0,
//         tenderID: '',
//         clientID: '',
//         client_JVName: '',
//         contractType: '',
//         executionModel: '',
//         workName: '',
//         country: '',
//         state: '',
//         projectID: '',
//         projectName: '',
//         workStartDate: '',
//         contractualCompletionDate: '',
//         projectCoordinatorEmpID: '',
//         projectCoordinatorName: '',
//         projectCoordinatorNumber: '',
//         projectInchargeEmpID: '',
//         projectInchargeName: '',
//         projectInchargeNumber: '',
//         projectInchargeEmpID2: '',
//         projectInchargeName2: '',
//         projectInchargeNumber2: '',
//         decisionToMobilize: '',
//         expectedMobilizationDate: '',
//         expectedDateofKickofMeeting: '',
//         keyMobTeamDeployedTeam1: '',
//         keyMobTeamDeployedTeam1Date: '',
//         keyMobTeamDeployedTeam2: '',
//         keyMobTeamDeployedTeam2Date: '',
//         constructionProgramSubmitted: '',
//         constructionProgramSubmittedDate: '',
//         layoutPlanFinalized: '',
//         campConstructionCompleted: '',
//         electricalPlanFinalized: '',
//         electricalPlanFinalizationDate: '',
//         topographicReportShared: '',
//         alignmentReportShared: '',
//         hindranceListReviewed: '',
//         bankAccountOpened: '',
//         guestHouseFinalized: '',
//         labCommissioned: '',
//         labCommissioningDate: '',
//         campLandFinalized: '',
//         createdDate: '',
//         createdBy: '',
//         updatedDate: '',
//         updatedBy: '',
//     }
//     );

//     // const [isMobileVerified, setIsMobileVerified] = useState(false);
//     // const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

//     useEffect(() => {
//         toast.dismiss();

//         const storedEmpName = localStorage.getItem('EmpName');
//         const storedEmpID = localStorage.getItem('EmpId');
//         if (storedEmpName || storedEmpID) {
//             // setEmpName(`${storedEmpName} - ${storedEmpID}`);
//         }
//     }, []);



//     useEffect(() => {
//         if (id) {
//             setEditMode(true);
//             fetchDoerById(id);
//         } else {
//             setEditMode(false);
//         }
//     }, [id]);

//     const fetchDoerById = async (id: string) => {
//         try {
//             const response = await axios.get(`${config.API_URL_APPLICATION1}/MobilizationMaster/GetMobilization/${id}`);
//             console.log('response', response)
//             if (response.data.isSuccess) {
//                 const fetchedModule = response.data.mobilizationMasters[0];
//                 setMesses(fetchedModule);
//             } else {
//                 console.error(response.data.message);
//             }
//         } catch (error) {
//             console.error('Error fetching module:', error);
//         }
//     };


//     useEffect(() => {
//         // const fetchData = async (endpoint: string, setter: Function, listName: string) => {
//         //     try {
//         //         const response = await axios.get(`${config.API_URL_APPLICATION}/${endpoint}`);
//         //         if (response.data.isSuccess) {
//         //             setter(response.data[listName]);
//         //         } else {
//         //             console.error(response.data.message);
//         //         }
//         //     } catch (error) {
//         //         console.error(`Error fetching data from ${endpoint}:`, error);
//         //     }
//         // };
//         // fetchData('CommonDropdown/GetProjectList', setProjectList, 'projectListResponses');
//         // fetchData('CommonDropdown/GetStatus', setStatusList, 'statusListResponses');
//         // fetchData('CommonDropdown/GetEmployeeListWithId', setEmployeeList, 'employeeLists');
//     }, []);



//     const validateFields = (): boolean => {
//         const errors: { [key: string]: string } = {};


//         if (!messes.tenderID) { errors.tenderID = 'tenderID is required' }
//         if (!messes.clientID) { errors.clientID = 'clientID is required' }
//         if (!messes.client_JVName) { errors.client_JVName = 'client_JVName is required' }
//         if (!messes.contractType) { errors.contractType = 'contractType is required' }
//         if (!messes.executionModel) { errors.executionModel = 'executionModel is required' }
//         if (!messes.workName) { errors.workName = 'workName is required' }
//         if (!messes.country) { errors.country = 'country is required' }
//         if (!messes.state) { errors.state = 'state is required' }
//         if (!messes.projectID) { errors.projectID = 'projectID is required' }
//         if (!messes.projectName) { errors.projectName = 'projectName is required' }
//         if (!messes.workStartDate) { errors.workStartDate = 'workStartDate is required' }
//         if (!messes.contractualCompletionDate) { errors.contractualCompletionDate = 'contractualCompletionDate is required' }
//         if (!messes.projectCoordinatorEmpID) { errors.projectCoordinatorEmpID = 'projectCoordinatorEmpID is required' }
//         if (!messes.projectCoordinatorName) { errors.projectCoordinatorName = 'projectCoordinatorName is required' }
//         if (!messes.projectCoordinatorNumber) { errors.projectCoordinatorNumber = 'projectCoordinatorNumber is required' }
//         if (!messes.projectInchargeEmpID) { errors.projectInchargeEmpID = 'projectInchargeEmpID is required' }
//         if (!messes.projectInchargeName) { errors.projectInchargeName = 'projectInchargeName is required' }
//         if (!messes.projectInchargeNumber) { errors.projectInchargeNumber = 'projectInchargeNumber is required' }
//         if (!messes.projectInchargeEmpID2) { errors.projectInchargeEmpID2 = 'projectInchargeEmpID2 is required' }
//         if (!messes.projectInchargeName2) { errors.projectInchargeName2 = 'projectInchargeName2 is required' }
//         if (!messes.projectInchargeNumber2) { errors.projectInchargeNumber2 = 'projectInchargeNumber2 is required' }
//         if (!messes.decisionToMobilize) { errors.decisionToMobilize = 'decisionToMobilize is required' }
//         if (!messes.expectedMobilizationDate) { errors.expectedMobilizationDate = 'expectedMobilizationDate is required' }
//         if (!messes.expectedDateofKickofMeeting) { errors.expectedDateofKickofMeeting = 'expectedDateofKickofMeeting is required' }
//         if (!messes.keyMobTeamDeployedTeam1) { errors.keyMobTeamDeployedTeam1 = 'keyMobTeamDeployedTeam1 is required' }
//         if (!messes.keyMobTeamDeployedTeam1Date) { errors.keyMobTeamDeployedTeam1Date = 'keyMobTeamDeployedTeam1Date is required' }
//         if (!messes.keyMobTeamDeployedTeam2) { errors.keyMobTeamDeployedTeam2 = 'keyMobTeamDeployedTeam2 is required' }
//         if (!messes.keyMobTeamDeployedTeam2Date) { errors.keyMobTeamDeployedTeam2Date = 'keyMobTeamDeployedTeam2Date is required' }
//         if (!messes.constructionProgramSubmitted) { errors.constructionProgramSubmitted = 'constructionProgramSubmitted is required' }
//         if (!messes.constructionProgramSubmittedDate) { errors.constructionProgramSubmittedDate = 'constructionProgramSubmittedDate is required' }
//         if (!messes.layoutPlanFinalized) { errors.layoutPlanFinalized = 'layoutPlanFinalized is required' }
//         if (!messes.campConstructionCompleted) { errors.campConstructionCompleted = 'campConstructionCompleted is required' }
//         if (!messes.electricalPlanFinalized) { errors.electricalPlanFinalized = 'electricalPlanFinalized is required' }
//         if (!messes.electricalPlanFinalizationDate) { errors.electricalPlanFinalizationDate = 'electricalPlanFinalizationDate is required' }
//         if (!messes.topographicReportShared) { errors.topographicReportShared = 'topographicReportShared is required' }
//         if (!messes.alignmentReportShared) { errors.alignmentReportShared = 'alignmentReportShared is required' }
//         if (!messes.hindranceListReviewed) { errors.hindranceListReviewed = 'hindranceListReviewed is required' }
//         if (!messes.bankAccountOpened) { errors.bankAccountOpened = 'bankAccountOpened is required' }
//         if (!messes.guestHouseFinalized) { errors.guestHouseFinalized = 'guestHouseFinalized is required' }
//         if (!messes.labCommissioned) { errors.labCommissioned = 'labCommissioned is required' }
//         if (!messes.labCommissioningDate) { errors.labCommissioningDate = 'labCommissioningDate is required' }
//         if (!messes.campLandFinalized) { errors.campLandFinalized = 'campLandFinalized is required' }
//         if (!messes.createdDate) { errors.createdDate = 'createdDate is required' }
//         if (!messes.createdBy) { errors.createdBy = 'createdBy is required' }
//         if (!messes.updatedDate) { errors.updatedDate = 'updatedDate is required' }
//         if (!messes.updatedBy) { errors.updatedBy = 'updatedBy is required' }








//         // setValidationErrors(errors);
//         return Object.keys(errors).length === 0;
//     };


//     // const handleChange = (e: ChangeEvent<any> | null, name?: string, value?: any) => {
//     //     const validateMobileNumber = (fieldName: string, fieldValue: string) => {
//     //         if (!/^\d{0,10}$/.test(fieldValue)) {
//     //             return false;
//     //         }

//     //         setMesses((prevData) => ({
//     //             ...prevData,
//     //             [fieldName]: fieldValue,
//     //         }));

//     //         if (fieldValue.length === 10) {
//     //             if (!/^[6-9]/.test(fieldValue)) {
//     //                 toast.error("Mobile number should start with a digit between 6 and 9.");
//     //                 setIsMobileVerified(true);
//     //                 return false;
//     //             }
//     //         } else {
//     //             setIsMobileVerified(false);
//     //         }
//     //         return true;
//     //     };
//     //     if (e) {
//     //         const { name: eventName, type } = e.target;
//     //         if (type === 'checkbox') {
//     //             const checked = (e.target as HTMLInputElement).checked;
//     //             setMesses((prevData) => ({
//     //                 ...prevData,
//     //                 [eventName]: checked,
//     //             }));
//     //         } else {
//     //             const inputValue = (e.target as HTMLInputElement | HTMLSelectElement).value;
//     //             if (eventName === "mobileNumber") {
//     //                 validateMobileNumber(eventName, inputValue);
//     //             } else {
//     //                 setMesses((prevData) => {
//     //                     const updatedData = { ...prevData, [eventName]: inputValue };
//     //                     return updatedData;
//     //                 });
//     //             }
//     //         }
//     //     }

//     // };




//     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//         // e.preventDefault();
//         // console.log(messes)
//         // if (!validateFields()) {
//         //     toast.dismiss()
//         //     toast.error('Please fill in all required fields.');
//         //     return;
//         // }




//         // if (isMobileVerified) {
//         //     toast.dismiss()
//         //     toast.error("Please verify your mobile number before submitting the form.");
//         //     return;
//         // }
//         // const payload = {
//         //     ...messes,
//         //     createdDate: new Date(),
//         //     createdBy: editMode ? messes.createdBy : empName,
//         //     updatedBy: editMode ? empName : '',
//         //     updatedDate: new Date(),
//         // };
//         // try {
//         //     if (editMode) {
//         //         await axios.put(`${config.API_URL_APPLICATION1}/MobilizationMaster/UpdateMobilization/${id}`, payload);
//         //         navigate('/pages/MobilizationMaster', {
//         //             state: {
//         //                 successMessage: "Challan Master Updated successfully!",
//         //             }
//         //         });
//         //     } else {
//         //         await axios.post(`${config.API_URL_APPLICATION1}/MobilizationMaster/CreateMobilization`, payload);
//         //         navigate('/pages/MobilizationMaster', {
//         //             state: {
//         //                 successMessage: "Challan Master Added successfully!",
//         //             }
//         //         });
//         //     }
//         // } catch (error: any) {
//         //     toast.error(error || 'Error Adding/Updating');
//         // }

//     };
//     return (
//         <div>
//             <div className="container">
//                 <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center fs-20 rounded-3 border">
//                     <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit Mobilization Master' : 'Add Mobilization Master'}</span></span>
//                 </div>
//                 <div className='bg-white p-2 rounded-3 border'>
//                     <Form onSubmit={handleSubmit}>
//                         {/* <Row>

//                             <Col lg={6}>
//                                 <Form.Group controlId="assetCode" className="mb-3">
//                                     <Form.Label>assetCode</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="assetCode"
//                                         value={messes.assetCode}
//                                         onChange={handleChange}
//                                         placeholder='Enter assetCode'
//                                         disabled={editMode}
//                                         className={validationErrors.assetCode ? " input-border" : "  "}
//                                     />
//                                     {validationErrors.assetCode && (
//                                         <small className="text-danger">{validationErrors.assetCode}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>
//                             <Col lg={6}>
//                                 <Form.Group controlId="dateOfDeployment" className="mb-3">
//                                     <Form.Label>dateOfDeployment</Form.Label>
//                                     <Form.Control
//                                         type="date"
//                                         name="dateOfDeployment"
//                                         value={messes.dateOfDeployment}
//                                         onChange={handleChange}
//                                         placeholder='Enter dateOfDeployment'
//                                         disabled={editMode}
//                                         className={validationErrors.dateOfDeployment ? " input-border" : "  "}
//                                     />
//                                     {validationErrors.dateOfDeployment && (
//                                         <small className="text-danger">{validationErrors.dateOfDeployment}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>
//                             <Col lg={6}>
//                                 <Form.Group controlId="assetCategory" className="mb-3">
//                                     <Form.Label>assetCategory</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="assetCategory"
//                                         value={messes.assetCategory}
//                                         onChange={handleChange}
//                                         placeholder='Enter Project ID'
//                                         className={validationErrors.assetCategory ? " input-border" : "  "}
//                                     />
//                                     {validationErrors.assetCategory && (
//                                         <small className="text-danger">{validationErrors.assetCategory}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>
//                             <Col lg={6}>
//                                 <Form.Group controlId="assetGroup" className="mb-3">
//                                     <Form.Label>assetGroup</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="assetGroup"
//                                         value={messes.assetGroup}
//                                         onChange={handleChange}
//                                         placeholder='Enter Project Name'
//                                         className={validationErrors.assetGroup ? " input-border" : "  "}
//                                     />
//                                     {validationErrors.assetGroup && (
//                                         <small className="text-danger">{validationErrors.assetGroup}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>
//                             <Col lg={6}>
//                                 <Form.Group controlId="assetName" className="mb-3">
//                                     <Form.Label>assetName</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="assetName"
//                                         value={messes.assetName}  // ✅ Use checked instead of value
//                                         onChange={handleChange}
//                                         className={validationErrors.assetName ? "input-border" : ""}
//                                     />

//                                     {validationErrors.assetName && (
//                                         <small className="text-danger">{validationErrors.assetName}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>

//                             <Col lg={6}>
//                                 <Form.Group controlId="specification" className="mb-3">
//                                     <Form.Label>specification</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="specification"
//                                         value={messes.specification}
//                                         onChange={handleChange}
//                                         placeholder='Enter specification'
//                                         className={validationErrors.specification ? " input-border" : "  "}
//                                     />
//                                     {validationErrors.specification && (
//                                         <small className="text-danger">{validationErrors.specification}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>
//                             <Col lg={6}>
//                                 <Form.Group controlId="assetMake" className="mb-3">
//                                     <Form.Label>assetMake</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="assetMake"
//                                         value={messes.assetMake}
//                                         onChange={handleChange}
//                                         placeholder='Enter assetMake'
//                                         className={validationErrors.assetMake ? " input-border" : "  "}
//                                     />
//                                     {validationErrors.assetMake && (
//                                         <small className="text-danger">{validationErrors.assetMake}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>
//                             <Col lg={6}>
//                                 <Form.Group controlId="currentProject" className="mb-3">
//                                     <Form.Label>currentProject</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="currentProject"
//                                         value={messes.currentProject}
//                                         onChange={handleChange}
//                                         placeholder='Enter currentProject'
//                                         className={validationErrors.currentProject ? " input-border" : "  "}
//                                     />
//                                     {validationErrors.currentProject && (
//                                         <small className="text-danger">{validationErrors.currentProject}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>
//                             <Col lg={6}>
//                                 <Form.Group controlId="assetOwnership" className="mb-3">
//                                     <Form.Label>assetOwnership</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="assetOwnership"
//                                         value={messes.assetOwnership}
//                                         onChange={handleChange}
//                                         placeholder='Enter assetOwnership'
//                                         className={validationErrors.assetOwnership ? " input-border" : "  "}
//                                     />
//                                     {validationErrors.assetOwnership && (
//                                         <small className="text-danger">{validationErrors.assetOwnership}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>
//                             <Col lg={6}>
//                                 <Form.Group controlId="currentStatusATProject" className="mb-3">
//                                     <Form.Label>currentStatusATProject</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="currentStatusATProject"
//                                         value={messes.currentStatusATProject}
//                                         onChange={handleChange}
//                                         placeholder='Enter currentStatusATProject'
//                                         className={validationErrors.currentStatusATProject ? " input-border" : "  "}
//                                     />
//                                     {validationErrors.currentStatusATProject && (
//                                         <small className="text-danger">{validationErrors.currentStatusATProject}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>
//                             <Col lg={6}>
//                                 <Form.Group controlId="transferredTo" className="mb-3">
//                                     <Form.Label>transferredTo</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="transferredTo"
//                                         value={messes.transferredTo}
//                                         onChange={handleChange}
//                                         placeholder='Enter transferredTo'
//                                         className={validationErrors.transferredTo ? " input-border" : "  "}
//                                     />
//                                     {validationErrors.transferredTo && (
//                                         <small className="text-danger">{validationErrors.transferredTo}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>
//                             <Col lg={6}>
//                                 <Form.Group controlId="forHSD" className="mb-3">
//                                     <Form.Label>forHSD</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="forHSD"
//                                         value={messes.forHSD}
//                                         onChange={handleChange}
//                                         placeholder='Enter forHSD'
//                                         className={validationErrors.forHSD ? " input-border" : "  "}
//                                     />
//                                     {validationErrors.forHSD && (
//                                         <small className="text-danger">{validationErrors.forHSD}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>
//                             <Col lg={6}>
//                                 <Form.Group controlId="imsSpareInventory" className="mb-3">
//                                     <Form.Label>imsSpareInventory</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="imsSpareInventory"
//                                         value={messes.imsSpareInventory}
//                                         onChange={handleChange}
//                                         placeholder='Enter imsSpareInventory'
//                                         className={validationErrors.imsSpareInventory ? " input-border" : "  "}
//                                     />
//                                     {validationErrors.imsSpareInventory && (
//                                         <small className="text-danger">{validationErrors.imsSpareInventory}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>
//                             <Col lg={6}>
//                                 <Form.Group controlId="assetServiceSchedule" className="mb-3">
//                                     <Form.Label>assetServiceSchedule</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="assetServiceSchedule"
//                                         value={messes.assetServiceSchedule}
//                                         onChange={handleChange}
//                                         placeholder='Enter assetServiceSchedule'
//                                         className={validationErrors.assetServiceSchedule ? " input-border" : "  "}
//                                     />
//                                     {validationErrors.assetServiceSchedule && (
//                                         <small className="text-danger">{validationErrors.assetServiceSchedule}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>
//                             <Col lg={6}>
//                                 <Form.Group controlId="rtoCompliance" className="mb-3">
//                                     <Form.Label>rtoCompliance</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="rtoCompliance"
//                                         value={messes.rtoCompliance}
//                                         onChange={handleChange}
//                                         placeholder='Enter rtoCompliance'
//                                         className={validationErrors.rtoCompliance ? " input-border" : "  "}
//                                     />
//                                     {validationErrors.rtoCompliance && (
//                                         <small className="text-danger">{validationErrors.rtoCompliance}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>
//                             <Col lg={6}>
//                                 <Form.Group controlId="preventiveMaintainance" className="mb-3">
//                                     <Form.Label>preventiveMaintainance</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="preventiveMaintainance"
//                                         value={messes.preventiveMaintainance}
//                                         onChange={handleChange}
//                                         placeholder='Enter preventiveMaintainance'
//                                         className={validationErrors.preventiveMaintainance ? " input-border" : "  "}
//                                     />
//                                     {validationErrors.preventiveMaintainance && (
//                                         <small className="text-danger">{validationErrors.preventiveMaintainance}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>
//                             <Col lg={6}>
//                                 <Form.Group controlId="preventiveMaintainanceFrequency" className="mb-3">
//                                     <Form.Label>preventiveMaintainanceFrequency</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="preventiveMaintainanceFrequency"
//                                         value={messes.preventiveMaintainanceFrequency}
//                                         onChange={handleChange}
//                                         placeholder='Enter preventiveMaintainanceFrequency'
//                                         className={validationErrors.preventiveMaintainanceFrequency ? " input-border" : "  "}
//                                     />
//                                     {validationErrors.preventiveMaintainanceFrequency && (
//                                         <small className="text-danger">{validationErrors.preventiveMaintainanceFrequency}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>
//                             <Col lg={6}>
//                                 <Form.Group controlId="triggerValue" className="mb-3">
//                                     <Form.Label>triggerValue</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="triggerValue"
//                                         value={messes.triggerValue}
//                                         onChange={handleChange}
//                                         placeholder='Enter triggerValue'
//                                         className={validationErrors.triggerValue ? " input-border" : "  "}
//                                     />
//                                     {validationErrors.triggerValue && (
//                                         <small className="text-danger">{validationErrors.triggerValue}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>
//                             <Col lg={6}>
//                                 <Form.Group controlId="nextPMDate" className="mb-3">
//                                     <Form.Label>nextPMDate</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="nextPMDate"
//                                         value={messes.nextPMDate}
//                                         onChange={handleChange}
//                                         placeholder='Enter nextPMDate'
//                                         className={validationErrors.nextPMDate ? " input-border" : "  "}
//                                     />
//                                     {validationErrors.nextPMDate && (
//                                         <small className="text-danger">{validationErrors.nextPMDate}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>
//                             <Col lg={6}>
//                                 <Form.Group controlId="operatorDriver" className="mb-3">
//                                     <Form.Label>operatorDriver</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="operatorDriver"
//                                         value={messes.operatorDriver}
//                                         onChange={handleChange}
//                                         placeholder='Enter operatorDriver'
//                                         className={validationErrors.operatorDriver ? " input-border" : "  "}
//                                     />
//                                     {validationErrors.operatorDriver && (
//                                         <small className="text-danger">{validationErrors.operatorDriver}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>
//                             <Col lg={6}>
//                                 <Form.Group controlId="engineNo" className="mb-3">
//                                     <Form.Label>engineNo</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="engineNo"
//                                         value={messes.engineNo}
//                                         onChange={handleChange}
//                                         placeholder='Enter engineNo'
//                                         className={validationErrors.engineNo ? " input-border" : "  "}
//                                     />
//                                     {validationErrors.engineNo && (
//                                         <small className="text-danger">{validationErrors.engineNo}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>
//                             <Col lg={6}>
//                                 <Form.Group controlId="chasisNo" className="mb-3">
//                                     <Form.Label>chasisNo</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="chasisNo"
//                                         value={messes.chasisNo}
//                                         onChange={handleChange}
//                                         placeholder='Enter chasisNo'
//                                         className={validationErrors.chasisNo ? " input-border" : "  "}
//                                     />
//                                     {validationErrors.chasisNo && (
//                                         <small className="text-danger">{validationErrors.chasisNo}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>
//                             <Col lg={6}>
//                                 <Form.Group controlId="dateOfRegistration" className="mb-3">
//                                     <Form.Label>dateOfRegistration</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="dateOfRegistration"
//                                         value={messes.dateOfRegistration}
//                                         onChange={handleChange}
//                                         placeholder='Enter dateOfRegistration'
//                                         className={validationErrors.dateOfRegistration ? " input-border" : "  "}
//                                     />
//                                     {validationErrors.dateOfRegistration && (
//                                         <small className="text-danger">{validationErrors.dateOfRegistration}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>
//                             <Col lg={6}>
//                                 <Form.Group controlId="roadTaxValidTill" className="mb-3">
//                                     <Form.Label>roadTaxValidTill</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="roadTaxValidTill"
//                                         value={messes.roadTaxValidTill}
//                                         onChange={handleChange}
//                                         placeholder='Enter roadTaxValidTill'
//                                         className={validationErrors.roadTaxValidTill ? " input-border" : "  "}
//                                     />
//                                     {validationErrors.roadTaxValidTill && (
//                                         <small className="text-danger">{validationErrors.roadTaxValidTill}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>
//                             <Col lg={6}>
//                                 <Form.Group controlId="nationalPermitValidTill" className="mb-3">
//                                     <Form.Label>nationalPermitValidTill</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="nationalPermitValidTill"
//                                         value={messes.nationalPermitValidTill}
//                                         onChange={handleChange}
//                                         placeholder='Enter nationalPermitValidTill'
//                                         className={validationErrors.nationalPermitValidTill ? " input-border" : "  "}
//                                     />
//                                     {validationErrors.nationalPermitValidTill && (
//                                         <small className="text-danger">{validationErrors.nationalPermitValidTill}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>
//                             <Col lg={6}>
//                                 <Form.Group controlId="statePermitValidTill" className="mb-3">
//                                     <Form.Label>statePermitValidTill</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="statePermitValidTill"
//                                         value={messes.statePermitValidTill}
//                                         onChange={handleChange}
//                                         placeholder='Enter statePermitValidTill'
//                                         className={validationErrors.statePermitValidTill ? " input-border" : "  "}
//                                     />
//                                     {validationErrors.statePermitValidTill && (
//                                         <small className="text-danger">{validationErrors.statePermitValidTill}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>
//                             <Col lg={6}>
//                                 <Form.Group controlId="nationalPermitGoodsValidTill" className="mb-3">
//                                     <Form.Label>nationalPermitGoodsValidTill</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="nationalPermitGoodsValidTill"
//                                         value={messes.nationalPermitGoodsValidTill}
//                                         onChange={handleChange}
//                                         placeholder='Enter nationalPermitGoodsValidTill'
//                                         className={validationErrors.nationalPermitGoodsValidTill ? " input-border" : "  "}
//                                     />
//                                     {validationErrors.nationalPermitGoodsValidTill && (
//                                         <small className="text-danger">{validationErrors.nationalPermitGoodsValidTill}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>
//                             <Col lg={6}>
//                                 <Form.Group controlId="fitnessValidTill" className="mb-3">
//                                     <Form.Label>fitnessValidTill</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="fitnessValidTill"
//                                         value={messes.fitnessValidTill}
//                                         onChange={handleChange}
//                                         placeholder='Enter fitnessValidTill'
//                                         className={validationErrors.fitnessValidTill ? " input-border" : "  "}
//                                     />
//                                     {validationErrors.fitnessValidTill && (
//                                         <small className="text-danger">{validationErrors.fitnessValidTill}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>
//                             <Col lg={6}>
//                                 <Form.Group controlId="insuranceValidTill" className="mb-3">
//                                     <Form.Label>insuranceValidTill</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="insuranceValidTill"
//                                         value={messes.insuranceValidTill}
//                                         onChange={handleChange}
//                                         placeholder='Enter insuranceValidTill'
//                                         className={validationErrors.insuranceValidTill ? " input-border" : "  "}
//                                     />
//                                     {validationErrors.insuranceValidTill && (
//                                         <small className="text-danger">{validationErrors.insuranceValidTill}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>
//                             <Col lg={6}>
//                                 <Form.Group controlId="pollutionValidTill" className="mb-3">
//                                     <Form.Label>pollutionValidTill</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="pollutionValidTill"
//                                         value={messes.pollutionValidTill}
//                                         onChange={handleChange}
//                                         placeholder='Enter pollutionValidTill'
//                                         className={validationErrors.pollutionValidTill ? " input-border" : "  "}
//                                     />
//                                     {validationErrors.pollutionValidTill && (
//                                         <small className="text-danger">{validationErrors.pollutionValidTill}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>
//                             <Col lg={6}>
//                                 <Form.Group controlId="assetStatus" className="mb-3">
//                                     <Form.Label>assetStatus</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="assetStatus"
//                                         value={messes.assetStatus}
//                                         onChange={handleChange}
//                                         placeholder='Enter assetStatus'
//                                         className={validationErrors.assetStatus ? " input-border" : "  "}
//                                     />
//                                     {validationErrors.assetStatus && (
//                                         <small className="text-danger">{validationErrors.assetStatus}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>
//                             <Col lg={6}>
//                                 <Form.Group controlId="assetStatusUpdatedOn" className="mb-3">
//                                     <Form.Label>assetStatusUpdatedOn</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="assetStatusUpdatedOn"
//                                         value={messes.assetStatusUpdatedOn}
//                                         onChange={handleChange}
//                                         placeholder='Enter assetStatusUpdatedOn'
//                                         className={validationErrors.assetStatusUpdatedOn ? " input-border" : "  "}
//                                     />
//                                     {validationErrors.assetStatusUpdatedOn && (
//                                         <small className="text-danger">{validationErrors.assetStatusUpdatedOn}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>
//                             <Col lg={6}>
//                                 <Form.Group controlId="updatedByTaskID" className="mb-3">
//                                     <Form.Label>updatedByTaskID</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="updatedByTaskID"
//                                         value={messes.updatedByTaskID}
//                                         onChange={handleChange}
//                                         placeholder='Enter updatedByTaskID'
//                                         className={validationErrors.updatedByTaskID ? " input-border" : "  "}
//                                     />
//                                     {validationErrors.updatedByTaskID && (
//                                         <small className="text-danger">{validationErrors.updatedByTaskID}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>
//                             <Col lg={6}>
//                                 <Form.Group controlId="modifiedBy" className="mb-3">
//                                     <Form.Label>modifiedBy</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="modifiedBy"
//                                         value={messes.modifiedBy}
//                                         onChange={handleChange}
//                                         placeholder='Enter modifiedBy'
//                                         className={validationErrors.modifiedBy ? " input-border" : "  "}
//                                     />
//                                     {validationErrors.modifiedBy && (
//                                         <small className="text-danger">{validationErrors.modifiedBy}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>
//                             <Col lg={6}>
//                                 <Form.Group controlId="editBy" className="mb-3">
//                                     <Form.Label>editBy</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="editBy"
//                                         value={messes.editBy}
//                                         onChange={handleChange}
//                                         placeholder='Enter editBy'
//                                         className={validationErrors.editBy ? " input-border" : "  "}
//                                     />
//                                     {validationErrors.editBy && (
//                                         <small className="text-danger">{validationErrors.editBy}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>
//                             <Col lg={6}>
//                                 <Form.Group controlId="latestServicingDate" className="mb-3">
//                                     <Form.Label>latestServicingDate</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="latestServicingDate"
//                                         value={messes.latestServicingDate}
//                                         onChange={handleChange}
//                                         placeholder='Enter latestServicingDate'
//                                         className={validationErrors.latestServicingDate ? " input-border" : "  "}
//                                     />
//                                     {validationErrors.latestServicingDate && (
//                                         <small className="text-danger">{validationErrors.latestServicingDate}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>
//                             <Col lg={6}>
//                                 <Form.Group controlId="pmChecklist" className="mb-3">
//                                     <Form.Label>pmChecklist</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="pmChecklist"
//                                         value={messes.pmChecklist}
//                                         onChange={handleChange}
//                                         placeholder='Enter pmChecklist'
//                                         className={validationErrors.pmChecklist ? " input-border" : "  "}
//                                     />
//                                     {validationErrors.pmChecklist && (
//                                         <small className="text-danger">{validationErrors.pmChecklist}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>






//                             <Col className='align-items-end d-flex justify-content-between mb-3'>
//                                 <div>
//                                     <span className='fs-5 '>This field is required*</span>
//                                 </div>
//                                 <div>
//                                     <Link to={'/pages/MobilizationMaster'}>
//                                         <Button variant="primary" >
//                                             Back
//                                         </Button>
//                                     </Link>
//                                     &nbsp;
//                                     <Button variant="primary" type="submit">
//                                         {editMode ? 'Update Mobilization' : 'Add Mobilization'}
//                                     </Button>
//                                 </div>
//                             </Col>
//                         </Row> */}
//                     </Form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MobilizationMasterAddEdit;