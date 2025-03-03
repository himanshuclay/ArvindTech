import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
// import Select from 'react-select';
import { toast } from 'react-toastify';


interface BTS_PAYMENT {
    id: number,
projectID: string,
projectName: string,
month: string,
type: string,
materialCategory: string,
declaredQuantity: string,
materialOwner: string,
finalInspectedQuantity: string,
finalInspectionDateTime: string,
quantityPicked: string,
balanceQuantity: string,
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

const ScrapMasterAddEdit = () => {
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
        month: '',
        type: '',
        materialCategory: '',
        declaredQuantity: '',
        materialOwner: '',
        finalInspectedQuantity: '',
        finalInspectionDateTime: '',
        quantityPicked: '',
        balanceQuantity: '',
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
            const response = await axios.get(`${config.API_URL_APPLICATION1}/ScrapMaster/GetScrap/${id}`);
            console.log('response', response)
            if (response.data.isSuccess) {
                const fetchedModule = response.data.scrapMasters[0];
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

  
if(!messes.projectID) { errors.projectID = 'projectID is required'}
if(!messes.projectName) { errors.projectName = 'projectName is required'}
if(!messes.month) { errors.month = 'month is required'}
if(!messes.type) { errors.type = 'type is required'}
if(!messes.materialCategory) { errors.materialCategory = 'materialCategory is required'}
if(!messes.declaredQuantity) { errors.declaredQuantity = 'declaredQuantity is required'}
if(!messes.materialOwner) { errors.materialOwner = 'materialOwner is required'}
if(!messes.finalInspectedQuantity) { errors.finalInspectedQuantity = 'finalInspectedQuantity is required'}
if(!messes.finalInspectionDateTime) { errors.finalInspectionDateTime = 'finalInspectionDateTime is required'}
if(!messes.quantityPicked) { errors.quantityPicked = 'quantityPicked is required'}
if(!messes.balanceQuantity) { errors.balanceQuantity = 'balanceQuantity is required'}








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
                await axios.put(`${config.API_URL_APPLICATION1}/ScrapMaster/UpdateScrap/${id}`, payload);
                navigate('/pages/ScrapMaster', {
                    state: {
                        successMessage: "Challan Master Updated successfully!",
                    }
                });
            } else {
                await axios.post(`${config.API_URL_APPLICATION1}/ScrapMaster/CreateScrap`, payload);
                navigate('/pages/ScrapMaster', {
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
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit Scrap Master' : 'Add Scrap Master'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>

                            <Col lg={6}>
                                <Form.Group controlId="projectID" className="mb-3">
                                    <Form.Label>projectID</Form.Label>
                                    <Form.Control
                                        type="text"
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
                                        type="date"
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
                                <Form.Group controlId="month" className="mb-3">
                                    <Form.Label>month</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="month"
                                        value={messes.month}
                                        onChange={handleChange}
                                        placeholder='Enter month'
                                        disabled={editMode}
                                        className={validationErrors.month ? " input-border" : "  "}
                                    />
                                    {validationErrors.month && (
                                        <small className="text-danger">{validationErrors.month}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="type" className="mb-3">
                                    <Form.Label>type</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="type"
                                        value={messes.type}
                                        onChange={handleChange}
                                        placeholder='Enter Project ID'
                                        className={validationErrors.type ? " input-border" : "  "}
                                    />
                                    {validationErrors.type && (
                                        <small className="text-danger">{validationErrors.type}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="materialCategory" className="mb-3">
                                    <Form.Label>materialCategory</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="materialCategory"
                                        value={messes.materialCategory}
                                        onChange={handleChange}
                                        placeholder='Enter Project Name'
                                        className={validationErrors.materialCategory ? " input-border" : "  "}
                                    />
                                    {validationErrors.materialCategory && (
                                        <small className="text-danger">{validationErrors.materialCategory}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="declaredQuantity" className="mb-3">
                                    <Form.Label>declaredQuantity</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="declaredQuantity"
                                        value={messes.declaredQuantity}
                                        onChange={handleChange}
                                        className={validationErrors.declaredQuantity ? "input-border" : ""}
                                    />

                                    {validationErrors.declaredQuantity && (
                                        <small className="text-danger">{validationErrors.declaredQuantity}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="materialOwner" className="mb-3">
                                    <Form.Label>materialOwner</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="materialOwner"
                                        value={messes.materialOwner}
                                        onChange={handleChange}
                                        className={validationErrors.materialOwner ? "input-border" : ""}
                                    />

                                    {validationErrors.materialOwner && (
                                        <small className="text-danger">{validationErrors.materialOwner}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="finalInspectedQuantity" className="mb-3">
                                    <Form.Label>finalInspectedQuantity</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="finalInspectedQuantity"
                                        value={messes.finalInspectedQuantity}
                                        onChange={handleChange}
                                        className={validationErrors.finalInspectedQuantity ? "input-border" : ""}
                                    />

                                    {validationErrors.finalInspectedQuantity && (
                                        <small className="text-danger">{validationErrors.finalInspectedQuantity}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="finalInspectionDateTime" className="mb-3">
                                    <Form.Label>finalInspectionDateTime</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="finalInspectionDateTime"
                                        value={messes.finalInspectionDateTime}
                                        onChange={handleChange}
                                        className={validationErrors.finalInspectionDateTime ? "input-border" : ""}
                                    />

                                    {validationErrors.finalInspectionDateTime && (
                                        <small className="text-danger">{validationErrors.finalInspectionDateTime}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="quantityPicked" className="mb-3">
                                    <Form.Label>quantityPicked</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="quantityPicked"
                                        value={messes.quantityPicked}
                                        onChange={handleChange}
                                        className={validationErrors.quantityPicked ? "input-border" : ""}
                                    />

                                    {validationErrors.quantityPicked && (
                                        <small className="text-danger">{validationErrors.quantityPicked}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="balanceQuantity" className="mb-3">
                                    <Form.Label>balanceQuantity</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="balanceQuantity"
                                        value={messes.balanceQuantity}
                                        onChange={handleChange}
                                        className={validationErrors.balanceQuantity ? "input-border" : ""}
                                    />

                                    {validationErrors.balanceQuantity && (
                                        <small className="text-danger">{validationErrors.balanceQuantity}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            
                            
                            














                            <Col className='align-items-end d-flex justify-content-between mb-3'>
                                <div>
                                    <span className='fs-5 '>This field is required*</span>
                                </div>
                                <div>
                                    <Link to={'/pages/ScrapMaster'}>
                                        <Button variant="primary" >
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update Scrap' : 'Add Scrap'}
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

export default ScrapMasterAddEdit;