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
    structureID: string,
    structureType: string,
    typeofDesign: string,
    pier_Span_ChainageNo: string,
    drawingBroadCategory: string,
    completionDate: string,
    dtnNo: string,
    initiationType: string,
    reconcileQtyPR: string,
    reconcileQtyPO: string,
    reconsileShortCloseQty: string,
    reconsileDespatchedQty: string,
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

const ProcurementBBEJMasterAddEdit = () => {
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
structureID: '',
structureType: '',
typeofDesign: '',
pier_Span_ChainageNo: '',
drawingBroadCategory: '',
completionDate: '',
dtnNo: '',
initiationType: '',
reconcileQtyPR: '',
reconcileQtyPO: '',
reconsileShortCloseQty: '',
reconsileDespatchedQty: '',
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
            const response = await axios.get(`${config.API_URL_APPLICATION1}/ProcurementBBEJMaster/GetProcurementBBEJ/${id}`);
            console.log('response', response)
            if (response.data.isSuccess) {
                const fetchedModule = response.data.procurementBBEJMasters[0];
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



if(!messes.entryDate) { errors.entryDate = 'entryDate is required'}
if(!messes.projectID) { errors.projectID = 'projectID is required'}
if(!messes.projectName) { errors.projectName = 'projectName is required'}
if(!messes.structureID) { errors.structureID = 'structureID is required'}
if(!messes.structureType) { errors.structureType = 'structureType is required'}
if(!messes.typeofDesign) { errors.typeofDesign = 'typeofDesign is required'}
if(!messes.pier_Span_ChainageNo) { errors.pier_Span_ChainageNo = 'pier_Span_ChainageNo is required'}
if(!messes.drawingBroadCategory) { errors.drawingBroadCategory = 'drawingBroadCategory is required'}
if(!messes.completionDate) { errors.completionDate = 'completionDate is required'}
if(!messes.dtnNo) { errors.dtnNo = 'dtnNo is required'}
if(!messes.initiationType) { errors.initiationType = 'initiationType is required'}
if(!messes.reconcileQtyPR) { errors.reconcileQtyPR = 'reconcileQtyPR is required'}
if(!messes.reconcileQtyPO) { errors.reconcileQtyPO = 'reconcileQtyPO is required'}
if(!messes.reconsileShortCloseQty) { errors.reconsileShortCloseQty = 'reconsileShortCloseQty is required'}
if(!messes.reconsileDespatchedQty) { errors.reconsileDespatchedQty = 'reconsileDespatchedQty is required'}





       



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
                await axios.put(`${config.API_URL_APPLICATION1}/ProcurementBBEJMaster/UpdateProcurementBBEJ/${id}`, payload);
                navigate('/pages/ProcurementBBEJMaster', {
                    state: {
                        successMessage: "Challan Master Updated successfully!",
                    }
                });
            } else {
                await axios.post(`${config.API_URL_APPLICATION1}/ProcurementBBEJMaster/CreateProcurementBBEJ`, payload);
                navigate('/pages/ProcurementBBEJMaster', {
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
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit ProcurementBBEJ Master' : 'Add ProcurementBBEJ Master'}</span></span>
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
                                        placeholder='Enter entryDate'
                                        disabled={editMode}
                                        className={validationErrors.entryDate ? " input-border" : "  "}
                                    />
                                    {validationErrors.entryDate && (
                                        <small className="text-danger">{validationErrors.entryDate}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="projectID" className="mb-3">
                                    <Form.Label>projectID</Form.Label>
                                    <Form.Control
                                        type="number"
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
                                    <Form.Label>projectName</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="projectName"
                                        value={messes.projectName}
                                        onChange={handleChange}
                                        placeholder='Enter projectName'
                                        disabled={editMode}
                                        className={validationErrors.projectName ? " input-border" : "  "}
                                    />
                                    {validationErrors.projectName && (
                                        <small className="text-danger">{validationErrors.projectName}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="structureID" className="mb-3">
                                    <Form.Label>structureID</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="structureID"
                                        value={messes.structureID}
                                        onChange={handleChange}
                                        placeholder='Enter structureID'
                                        disabled={editMode}
                                        className={validationErrors.structureID ? " input-border" : "  "}
                                    />
                                    {validationErrors.structureID && (
                                        <small className="text-danger">{validationErrors.structureID}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="structureType" className="mb-3">
                                    <Form.Label>structureType</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="structureType"
                                        value={messes.structureType}
                                        onChange={handleChange}
                                        placeholder='Enter Project ID'
                                        className={validationErrors.structureType ? " input-border" : "  "}
                                    />
                                    {validationErrors.structureType && (
                                        <small className="text-danger">{validationErrors.structureType}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="typeofDesign" className="mb-3">
                                    <Form.Label>typeofDesign</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="typeofDesign"
                                        value={messes.typeofDesign}
                                        onChange={handleChange}
                                        placeholder='Enter Project Name'
                                        className={validationErrors.typeofDesign ? " input-border" : "  "}
                                    />
                                    {validationErrors.typeofDesign && (
                                        <small className="text-danger">{validationErrors.typeofDesign}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="pier_Span_ChainageNo" className="mb-3">
                                    <Form.Label>pier_Span_ChainageNo</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="pier_Span_ChainageNo"
                                        value={messes.pier_Span_ChainageNo}
                                        onChange={handleChange}
                                        className={validationErrors.pier_Span_ChainageNo ? "input-border" : ""}
                                    />

                                    {validationErrors.pier_Span_ChainageNo && (
                                        <small className="text-danger">{validationErrors.pier_Span_ChainageNo}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="drawingBroadCategory" className="mb-3">
                                    <Form.Label>drawingBroadCategory</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="drawingBroadCategory"
                                        value={messes.drawingBroadCategory}
                                        onChange={handleChange}
                                        className={validationErrors.drawingBroadCategory ? "input-border" : ""}
                                    />

                                    {validationErrors.drawingBroadCategory && (
                                        <small className="text-danger">{validationErrors.drawingBroadCategory}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="completionDate" className="mb-3">
                                    <Form.Label>completionDate</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="completionDate"
                                        value={messes.completionDate}
                                        onChange={handleChange}
                                        className={validationErrors.completionDate ? "input-border" : ""}
                                    />

                                    {validationErrors.completionDate && (
                                        <small className="text-danger">{validationErrors.completionDate}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="dtnNo" className="mb-3">
                                    <Form.Label>dtnNo</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="dtnNo"
                                        value={messes.dtnNo}
                                        onChange={handleChange}
                                        className={validationErrors.dtnNo ? "input-border" : ""}
                                    />

                                    {validationErrors.dtnNo && (
                                        <small className="text-danger">{validationErrors.dtnNo}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="initiationType" className="mb-3">
                                    <Form.Label>initiationType</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="initiationType"
                                        value={messes.initiationType}
                                        onChange={handleChange}
                                        className={validationErrors.initiationType ? "input-border" : ""}
                                    />

                                    {validationErrors.initiationType && (
                                        <small className="text-danger">{validationErrors.initiationType}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="reconcileQtyPR" className="mb-3">
                                    <Form.Label>reconcileQtyPR</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="reconcileQtyPR"
                                        value={messes.reconcileQtyPR}
                                        onChange={handleChange}
                                        className={validationErrors.reconcileQtyPR ? "input-border" : ""}
                                    />

                                    {validationErrors.reconcileQtyPR && (
                                        <small className="text-danger">{validationErrors.reconcileQtyPR}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="reconcileQtyPO" className="mb-3">
                                    <Form.Label>reconcileQtyPO</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="reconcileQtyPO"
                                        value={messes.reconcileQtyPO}
                                        onChange={handleChange}
                                        className={validationErrors.reconcileQtyPO ? "input-border" : ""}
                                    />

                                    {validationErrors.reconcileQtyPO && (
                                        <small className="text-danger">{validationErrors.reconcileQtyPO}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="reconsileShortCloseQty" className="mb-3">
                                    <Form.Label>reconsileShortCloseQty</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="reconsileShortCloseQty"
                                        value={messes.reconsileShortCloseQty}
                                        onChange={handleChange}
                                        className={validationErrors.reconsileShortCloseQty ? "input-border" : ""}
                                    />

                                    {validationErrors.reconsileShortCloseQty && (
                                        <small className="text-danger">{validationErrors.reconsileShortCloseQty}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="reconsileDespatchedQty" className="mb-3">
                                    <Form.Label>reconsileDespatchedQty</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="reconsileDespatchedQty"
                                        value={messes.reconsileDespatchedQty}
                                        onChange={handleChange}
                                        className={validationErrors.reconsileDespatchedQty ? "input-border" : ""}
                                    />

                                    {validationErrors.reconsileDespatchedQty && (
                                        <small className="text-danger">{validationErrors.reconsileDespatchedQty}</small>
                                    )}
                                </Form.Group>
                            </Col>
                           
                            
                            
                            
                           
                           








                            <Col className='align-items-end d-flex justify-content-between mb-3'>
                                <div>
                                    <span className='fs-5 '>This field is required*</span>
                                </div>
                                <div>
                                    <Link to={'/pages/ProcurementBBEJMaster'}>
                                        <Button variant="primary" >
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update ProcurementBBEJ' : 'Add ProcurementBBEJ'}
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

export default ProcurementBBEJMasterAddEdit;