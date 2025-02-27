// import axios from 'axios';
// import { useEffect, useState, ChangeEvent } from 'react';
// import { Button, Col, Form, Row } from 'react-bootstrap';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import config from '@/config';
// // import Select from 'react-select';
// import { toast } from 'react-toastify';


// interface BTS_PAYMENT {
//     id: number,
// prNumber: string,
// entryDate: string,
// requirementDeliveryDate: string,
// projectRequirementDeliveryDate: string,
// comparativeRequired: string,
// selection: string,
// frcVendor: string,
// vendorID1: string,
// rate1: string,
// unit1: string,
// vendorID2: string,
// rate2: string,
// unit2: string,
// vendorID3: string,
// rate3: string,
// unit3: string,
// createdDate: string,
// createdBy: string,
// updatedDate: string,
// updatedBy: string,
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

// const ComparativeMasterAddEdit = () => {
//     const { id } = useParams<{ id: string }>();
//     const navigate = useNavigate();
//     const [editMode, setEditMode] = useState<boolean>(false);
//     const [empName, setEmpName] = useState<string | null>('')
//     const [, setProjectList] = useState<ProjectList[]>([])
//     const [, setStatusList] = useState<Status[]>([])
//     const [, setEmployeeList] = useState<EmployeeList[]>([])
//     const [messes, setMesses] = useState<BTS_PAYMENT>({
//         id: 0,
// prNumber: '',
// entryDate: '',
// requirementDeliveryDate: '',
// projectRequirementDeliveryDate: '',
// comparativeRequired: '',
// selection: '',
// frcVendor: '',
// vendorID1: '',
// rate1: '',
// unit1: '',
// vendorID2: '',
// rate2: '',
// unit2: '',
// vendorID3: '',
// rate3: '',
// unit3: '',
// createdDate: '',
// createdBy: '',
// updatedDate: '',
// updatedBy: '',
//     }
//     );

//     const [isMobileVerified, setIsMobileVerified] = useState(false);
//     const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

//     useEffect(() => {
//         toast.dismiss();

//         const storedEmpName = localStorage.getItem('EmpName');
//         const storedEmpID = localStorage.getItem('EmpId');
//         if (storedEmpName || storedEmpID) {
//             setEmpName(`${storedEmpName} - ${storedEmpID}`);
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
//             const response = await axios.get(`${config.API_URL_APPLICATION1}/ComparativeMaster/GetComparative/${id}`);
//             console.log('response', response)
//             if (response.data.isSuccess) {
//                 const fetchedModule = response.data.comparativeMasters[0];
//                 setMesses(fetchedModule);
//             } else {
//                 console.error(response.data.message);
//             }
//         } catch (error) {
//             console.error('Error fetching module:', error);
//         }
//     };


//     useEffect(() => {
//         const fetchData = async (endpoint: string, setter: Function, listName: string) => {
//             try {
//                 const response = await axios.get(`${config.API_URL_APPLICATION}/${endpoint}`);
//                 if (response.data.isSuccess) {
//                     setter(response.data[listName]);
//                 } else {
//                     console.error(response.data.message);
//                 }
//             } catch (error) {
//                 console.error(`Error fetching data from ${endpoint}:`, error);
//             }
//         };
//         fetchData('CommonDropdown/GetProjectList', setProjectList, 'projectListResponses');
//         fetchData('CommonDropdown/GetStatus', setStatusList, 'statusListResponses');
//         fetchData('CommonDropdown/GetEmployeeListWithId', setEmployeeList, 'employeeLists');
//     }, []);



//     const validateFields = (): boolean => {
//         const errors: { [key: string]: string } = {};


// if(!messes.prNumber) { errors.prNumber = 'prNumber is required'}
// if(!messes.entryDate) { errors.entryDate = 'entryDate is required'}
// if(!messes.requirementDeliveryDate) { errors.requirementDeliveryDate = 'requirementDeliveryDate is required'}
// if(!messes.projectRequirementDeliveryDate) { errors.projectRequirementDeliveryDate = 'projectRequirementDeliveryDate is required'}
// if(!messes.comparativeRequired) { errors.comparativeRequired = 'comparativeRequired is required'}
// if(!messes.selection) { errors.selection = 'selection is required'}
// if(!messes.frcVendor) { errors.frcVendor = 'frcVendor is required'}
// if(!messes.vendorID1) { errors.vendorID1 = 'vendorID1 is required'}
// if(!messes.rate1) { errors.rate1 = 'rate1 is required'}
// if(!messes.unit1) { errors.unit1 = 'unit1 is required'}
// if(!messes.vendorID2) { errors.vendorID2 = 'vendorID2 is required'}
// if(!messes.rate2) { errors.rate2 = 'rate2 is required'}
// if(!messes.unit2) { errors.unit2 = 'unit2 is required'}
// if(!messes.vendorID3) { errors.vendorID3 = 'vendorID3 is required'}
// if(!messes.rate3) { errors.rate3 = 'rate3 is required'}
// if(!messes.unit3) { errors.unit3 = 'unit3 is required'}


       



//         setValidationErrors(errors);
//         return Object.keys(errors).length === 0;
//     };


//     const handleChange = (e: ChangeEvent<any> | null, name?: string, value?: any) => {
//         const validateMobileNumber = (fieldName: string, fieldValue: string) => {
//             if (!/^\d{0,10}$/.test(fieldValue)) {
//                 return false;
//             }

//             setMesses((prevData) => ({
//                 ...prevData,
//                 [fieldName]: fieldValue,
//             }));

//             if (fieldValue.length === 10) {
//                 if (!/^[6-9]/.test(fieldValue)) {
//                     toast.error("Mobile number should start with a digit between 6 and 9.");
//                     setIsMobileVerified(true);
//                     return false;
//                 }
//             } else {
//                 setIsMobileVerified(false);
//             }
//             return true;
//         };
//         if (e) {
//             const { name: eventName, type } = e.target;
//             if (type === 'checkbox') {
//                 const checked = (e.target as HTMLInputElement).checked;
//                 setMesses((prevData) => ({
//                     ...prevData,
//                     [eventName]: checked,
//                 }));
//             } else {
//                 const inputValue = (e.target as HTMLInputElement | HTMLSelectElement).value;
//                 if (eventName === "mobileNumber") {
//                     validateMobileNumber(eventName, inputValue);
//                 } else {
//                     setMesses((prevData) => {
//                         const updatedData = { ...prevData, [eventName]: inputValue };
//                         return updatedData;
//                     });
//                 }
//             }
//         }

//     };




//     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         console.log(messes)
//         if (!validateFields()) {
//             toast.dismiss()
//             toast.error('Please fill in all required fields.');
//             return;
//         }




//         if (isMobileVerified) {
//             toast.dismiss()
//             toast.error("Please verify your mobile number before submitting the form.");
//             return;
//         }
//         const payload = {
//             ...messes,
//             createdDate: new Date(),
//             createdBy: editMode ? messes.createdBy : empName,
//             updatedBy: editMode ? empName : '',
//             updatedDate: new Date(),
//         };
//         try {
//             if (editMode) {
//                 await axios.put(`${config.API_URL_APPLICATION1}/ComparativeMaster/UpdateComparative/${id}`, payload);
//                 navigate('/pages/ComparativeMaster', {
//                     state: {
//                         successMessage: "Challan Master Updated successfully!",
//                     }
//                 });
//             } else {
//                 await axios.post(`${config.API_URL_APPLICATION1}/ComparativeMaster/CreateComparative`, payload);
//                 navigate('/pages/ComparativeMaster', {
//                     state: {
//                         successMessage: "Challan Master Added successfully!",
//                     }
//                 });
//             }
//         } catch (error: any) {
//             toast.error(error || 'Error Adding/Updating');
//         }

//     };
//     return (
//         <div>
//             <div className="container">
//                 <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center fs-20 rounded-3 border">
//                     <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit Comparative Master' : 'Add Comparative Master'}</span></span>
//                 </div>
//                 <div className='bg-white p-2 rounded-3 border'>
//                     <Form onSubmit={handleSubmit}>
//                         <Row>

//                             <Col lg={6}>
//                                 <Form.Group controlId="prNumber" className="mb-3">
//                                     <Form.Label>prNumber</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="prNumber"
//                                         value={messes.prNumber}
//                                         onChange={handleChange}
//                                         placeholder='Enter prNumber'
//                                         disabled={editMode}
//                                         className={validationErrors.prNumber ? " input-border" : "  "}
//                                     />
//                                     {validationErrors.prNumber && (
//                                         <small className="text-danger">{validationErrors.prNumber}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>
//                             <Col lg={6}>
//                                 <Form.Group controlId="entryDate" className="mb-3">
//                                     <Form.Label>entryDate</Form.Label>
//                                     <Form.Control
//                                         type="number"
//                                         name="entryDate"
//                                         value={messes.entryDate}
//                                         onChange={handleChange}
//                                         placeholder='Enter entryDate'
//                                         disabled={editMode}
//                                         className={validationErrors.entryDate ? " input-border" : "  "}
//                                     />
//                                     {validationErrors.entryDate && (
//                                         <small className="text-danger">{validationErrors.entryDate}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>
//                             <Col lg={6}>
//                                 <Form.Group controlId="requirementDeliveryDate" className="mb-3">
//                                     <Form.Label>requirementDeliveryDate</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="requirementDeliveryDate"
//                                         value={messes.requirementDeliveryDate}
//                                         onChange={handleChange}
//                                         placeholder='Enter requirementDeliveryDate'
//                                         disabled={editMode}
//                                         className={validationErrors.requirementDeliveryDate ? " input-border" : "  "}
//                                     />
//                                     {validationErrors.requirementDeliveryDate && (
//                                         <small className="text-danger">{validationErrors.requirementDeliveryDate}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>
//                             <Col lg={6}>
//                                 <Form.Group controlId="projectRequirementDeliveryDate" className="mb-3">
//                                     <Form.Label>projectRequirementDeliveryDate</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="projectRequirementDeliveryDate"
//                                         value={messes.projectRequirementDeliveryDate}
//                                         onChange={handleChange}
//                                         placeholder='Enter projectRequirementDeliveryDate'
//                                         disabled={editMode}
//                                         className={validationErrors.projectRequirementDeliveryDate ? " input-border" : "  "}
//                                     />
//                                     {validationErrors.projectRequirementDeliveryDate && (
//                                         <small className="text-danger">{validationErrors.projectRequirementDeliveryDate}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>
//                             <Col lg={6}>
//                                 <Form.Group controlId="comparativeRequired" className="mb-3">
//                                     <Form.Label>comparativeRequired</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="comparativeRequired"
//                                         value={messes.comparativeRequired}
//                                         onChange={handleChange}
//                                         placeholder='Enter Project ID'
//                                         className={validationErrors.comparativeRequired ? " input-border" : "  "}
//                                     />
//                                     {validationErrors.comparativeRequired && (
//                                         <small className="text-danger">{validationErrors.comparativeRequired}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>
//                             <Col lg={6}>
//                                 <Form.Group controlId="selection" className="mb-3">
//                                     <Form.Label>selection</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="selection"
//                                         value={messes.selection}
//                                         onChange={handleChange}
//                                         placeholder='Enter Project Name'
//                                         className={validationErrors.selection ? " input-border" : "  "}
//                                     />
//                                     {validationErrors.selection && (
//                                         <small className="text-danger">{validationErrors.selection}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>
//                             <Col lg={6}>
//                                 <Form.Group controlId="frcVendor" className="mb-3">
//                                     <Form.Label>frcVendor</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="frcVendor"
//                                         value={messes.frcVendor}
//                                         onChange={handleChange}
//                                         className={validationErrors.frcVendor ? "input-border" : ""}
//                                     />

//                                     {validationErrors.frcVendor && (
//                                         <small className="text-danger">{validationErrors.frcVendor}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>

//                             <Col lg={6}>
//                                 <Form.Group controlId="vendorID1" className="mb-3">
//                                     <Form.Label>vendorID1</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="vendorID1"
//                                         value={messes.vendorID1}
//                                         onChange={handleChange}
//                                         placeholder='Enter vendorID1'
//                                         className={validationErrors.vendorID1 ? " input-border" : "  "}
//                                     />
//                                     {validationErrors.vendorID1 && (
//                                         <small className="text-danger">{validationErrors.vendorID1}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>
//                             <Col lg={6}>
//                                 <Form.Group controlId="rate1" className="mb-3">
//                                     <Form.Label>rate1</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="rate1"
//                                         value={messes.rate1}
//                                         onChange={handleChange}
//                                         placeholder='Enter rate1'
//                                         className={validationErrors.rate1 ? " input-border" : "  "}
//                                     />
//                                     {validationErrors.rate1 && (
//                                         <small className="text-danger">{validationErrors.rate1}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>
//                             <Col lg={6}>
//                                 <Form.Group controlId="unit1" className="mb-3">
//                                     <Form.Label>unit1</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="unit1"
//                                         value={messes.unit1}
//                                         onChange={handleChange}
//                                         placeholder='Enter unit1'
//                                         className={validationErrors.unit1 ? " input-border" : "  "}
//                                     />
//                                     {validationErrors.unit1 && (
//                                         <small className="text-danger">{validationErrors.unit1}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>
//                             <Col lg={6}>
//                                 <Form.Group controlId="vendorID2" className="mb-3">
//                                     <Form.Label>vendorID2</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="vendorID2"
//                                         value={messes.vendorID2}
//                                         onChange={handleChange}
//                                         placeholder='Enter vendorID2'
//                                         className={validationErrors.vendorID2 ? " input-border" : "  "}
//                                     />
//                                     {validationErrors.vendorID2 && (
//                                         <small className="text-danger">{validationErrors.vendorID2}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>
                            
//                             <Col lg={6}>
//                                 <Form.Group controlId="rate2" className="mb-3">
//                                     <Form.Label>rate2</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="rate2"
//                                         value={messes.rate2}
//                                         onChange={handleChange}
//                                         placeholder='Enter rate2'
//                                         className={validationErrors.rate2 ? " input-border" : "  "}
//                                     />
//                                     {validationErrors.rate2 && (
//                                         <small className="text-danger">{validationErrors.rate2}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>
//                             <Col lg={6}>
//                                 <Form.Group controlId="unit2" className="mb-3">
//                                     <Form.Label>unit2</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="unit2"
//                                         value={messes.unit2}
//                                         onChange={handleChange}
//                                         placeholder='Enter unit2'
//                                         className={validationErrors.unit2 ? " input-border" : "  "}
//                                     />
//                                     {validationErrors.unit2 && (
//                                         <small className="text-danger">{validationErrors.unit2}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>
//                             <Col lg={6}>
//                                 <Form.Group controlId="vendorID3" className="mb-3">
//                                     <Form.Label>vendorID3</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="vendorID3"
//                                         value={messes.vendorID3}
//                                         onChange={handleChange}
//                                         placeholder='Enter vendorID3'
//                                         className={validationErrors.vendorID3 ? " input-border" : "  "}
//                                     />
//                                     {validationErrors.vendorID3 && (
//                                         <small className="text-danger">{validationErrors.vendorID3}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>
//                             <Col lg={6}>
//                                 <Form.Group controlId="rate3" className="mb-3">
//                                     <Form.Label>rate3</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="rate3"
//                                         value={messes.rate3}
//                                         onChange={handleChange}
//                                         placeholder='Enter rate3'
//                                         className={validationErrors.rate3 ? " input-border" : "  "}
//                                     />
//                                     {validationErrors.rate3 && (
//                                         <small className="text-danger">{validationErrors.rate3}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>
//                             <Col lg={6}>
//                                 <Form.Group controlId="unit3" className="mb-3">
//                                     <Form.Label>unit3</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="unit3"
//                                         value={messes.unit3}
//                                         onChange={handleChange}
//                                         placeholder='Enter unit3'
//                                         className={validationErrors.unit3 ? " input-border" : "  "}
//                                     />
//                                     {validationErrors.unit3 && (
//                                         <small className="text-danger">{validationErrors.unit3}</small>
//                                     )}
//                                 </Form.Group>
//                             </Col>
                           
                           








//                             <Col className='align-items-end d-flex justify-content-between mb-3'>
//                                 <div>
//                                     <span className='fs-5 '>This field is required*</span>
//                                 </div>
//                                 <div>
//                                     <Link to={'/pages/ComparativeMaster'}>
//                                         <Button variant="primary" >
//                                             Back
//                                         </Button>
//                                     </Link>
//                                     &nbsp;
//                                     <Button variant="primary" type="submit">
//                                         {editMode ? 'Update Comparative' : 'Add Comparative'}
//                                     </Button>
//                                 </div>
//                             </Col>
//                         </Row>
//                     </Form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ComparativeMasterAddEdit;