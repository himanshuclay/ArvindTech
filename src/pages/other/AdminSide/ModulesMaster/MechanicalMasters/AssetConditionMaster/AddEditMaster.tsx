import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
// import Select from 'react-select';
import { toast } from 'react-toastify';


interface BTS_PAYMENT {
    id: number,
    assetCode: string,
    assetName: string,
    currentProject: string,
    assetOwnership: string,
    assetCondition: string,
    working_HSDorNonHSD: string,
    expectedAssetRelease_ResolutionDate: string,
    reasonofBreakdown: string,
    warrantyStatus: string,
    insuranceStatus: string,
    timeofBreakdown: string,
    openingTankBalance: string,
    hsdReceived: string,
    closingTankBalance: string,
    openingReading: string,
    closingReading: string,
    workingHrs_RunningKM: string,
    cummulativeWorkingHrs_RunningKMs: string,
    assetisWorking: string,
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

const AssetConditionMasterAddEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [empName, setEmpName] = useState<string | null>('')
    const [, setProjectList] = useState<ProjectList[]>([])
    const [, setStatusList] = useState<Status[]>([])
    const [, setEmployeeList] = useState<EmployeeList[]>([])
    const [messes, setMesses] = useState<BTS_PAYMENT>({
        id: 0,
        assetCode: "",
        assetName: "",
        currentProject: "",
        assetOwnership: "",
        assetCondition: "",
        working_HSDorNonHSD: "",
        expectedAssetRelease_ResolutionDate: "",
        reasonofBreakdown: "",
        warrantyStatus: "",
        insuranceStatus: "",
        timeofBreakdown: "",
        openingTankBalance: "",
        hsdReceived: "",
        closingTankBalance: "",
        openingReading: "",
        closingReading: "",
        workingHrs_RunningKM: "",
        cummulativeWorkingHrs_RunningKMs: "",
        assetisWorking: "",
        createdDate: "",
        createdBy: "",
        updatedDate: "",
        updatedBy: "",
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
            const response = await axios.get(`${config.API_URL_APPLICATION1}/AssetConditionMaster/GetAssetCondition/${id}`);
            console.log('response', response)
            if (response.data.isSuccess) {
                const fetchedModule = response.data.assetConditionMasters[0];
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


       
        if(!messes.assetCode) {errors.assetCode = 'Asset Code is required'}
        if(!messes.assetName) {errors.assetName = 'Asset Name is required'}
        if(!messes.currentProject) {errors.currentProject = 'Current Project is required'}
        if(!messes.assetOwnership) {errors.assetOwnership = 'Asset Ownership is required'}
        if(!messes.assetCondition) {errors.assetCondition = 'Asset Condition is required'}
        if(!messes.working_HSDorNonHSD) {errors.working_HSDorNonHSD = 'Working HS Dor Non HSD is required'}
        if(!messes.expectedAssetRelease_ResolutionDate) {errors.expectedAssetRelease_ResolutionDate = 'Expected Asset Release Resolution Date is required'}
        if(!messes.reasonofBreakdown) {errors.reasonofBreakdown = 'Reason of Breakdown is required'}
        if(!messes.warrantyStatus) {errors.warrantyStatus = 'Warranty Status is required'}
        if(!messes.insuranceStatus) {errors.insuranceStatus = 'Insurance Status is required'}
        if(!messes.timeofBreakdown) {errors.timeofBreakdown = 'Time of Breakdown is required'}
        if(!messes.openingTankBalance) {errors.openingTankBalance = 'Opening Tank Balance is required'}
        if(!messes.hsdReceived) {errors.hsdReceived = 'Hsd Received is required'}
        if(!messes.closingTankBalance) {errors.closingTankBalance = 'Closing Tank Balance is required'}
        if(!messes.openingReading) {errors.openingReading = 'Opening Reading is required'}
        if(!messes.closingReading) {errors.closingReading = 'Closing Reading is required'}
        if(!messes.workingHrs_RunningKM) {errors.workingHrs_RunningKM = 'Working Hrs Running KM is required'}
        if(!messes.cummulativeWorkingHrs_RunningKMs) {errors.cummulativeWorkingHrs_RunningKMs = 'Cummulative Working Hrs Running KMs is required'}
        if(!messes.assetisWorking) {errors.assetisWorking = 'Assetis Working is required'}









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
                await axios.put(`${config.API_URL_APPLICATION1}/AssetConditionMaster/UpdateAssetCondition/${id}`, payload);
                navigate('/pages/AssetConditionMaster', {
                    state: {
                        successMessage: "Challan Master Updated successfully!",
                    }
                });
            } else {
                await axios.post(`${config.API_URL_APPLICATION1}/AssetConditionMaster/CreateAssetCondition`, payload);
                navigate('/pages/AssetConditionMaster', {
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
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit AssetCondition Master' : 'Add AssetCondition Master'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>

                            <Col lg={6}>
                                <Form.Group controlId="assetCode" className="mb-3">
                                    <Form.Label>Asset Code</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="assetCode"
                                        value={messes.assetCode}
                                        onChange={handleChange}
                                        placeholder='Enter Asset Code'
                                        disabled={editMode}
                                        className={validationErrors.assetCode ? " input-border" : "  "}
                                    />
                                    {validationErrors.assetCode && (
                                        <small className="text-danger">{validationErrors.assetCode}</small>
                                    )}
                                </Form.Group>
                            </Col>
                           
                            <Col lg={6}>
                                <Form.Group controlId="assetName" className="mb-3">
                                    <Form.Label>Asset Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="assetName"
                                        placeholder='Enter Asset Name'
                                        value={messes.assetName}  // ✅ Use checked instead of value
                                        onChange={handleChange}
                                        className={validationErrors.assetName ? "input-border" : ""}
                                    />

                                    {validationErrors.assetName && (
                                        <small className="text-danger">{validationErrors.assetName}</small>
                                    )}
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="currentProject" className="mb-3">
                                    <Form.Label>Current Project</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="currentProject"
                                        value={messes.currentProject}
                                        onChange={handleChange}
                                        placeholder='Enter Current Project'
                                        className={validationErrors.currentProject ? " input-border" : "  "}
                                    />
                                    {validationErrors.currentProject && (
                                        <small className="text-danger">{validationErrors.currentProject}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="assetOwnership" className="mb-3">
                                    <Form.Label>Asset Ownership</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="assetOwnership"
                                        value={messes.assetOwnership}
                                        onChange={handleChange}
                                        placeholder='Enter Asset Ownership'
                                        className={validationErrors.assetOwnership ? " input-border" : "  "}
                                    />
                                    {validationErrors.assetOwnership && (
                                        <small className="text-danger">{validationErrors.assetOwnership}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="assetCondition" className="mb-3">
                                    <Form.Label>Asset Condition</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="assetCondition"
                                        value={messes.assetCondition}
                                        onChange={handleChange}
                                        placeholder='Enter Asset Condition'
                                        className={validationErrors.assetCondition ? " input-border" : "  "}
                                    />
                                    {validationErrors.assetCondition && (
                                        <small className="text-danger">{validationErrors.assetCondition}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="working_HSDorNonHSD" className="mb-3">
                                    <Form.Label>Working HSDorNonHSD</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="working_HSDorNonHSD"
                                        value={messes.working_HSDorNonHSD}
                                        onChange={handleChange}
                                        placeholder='Enter Working HSDorNonHSD'
                                        className={validationErrors.working_HSDorNonHSD ? " input-border" : "  "}
                                    />
                                    {validationErrors.working_HSDorNonHSD && (
                                        <small className="text-danger">{validationErrors.working_HSDorNonHSD}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="expectedAssetRelease_ResolutionDate" className="mb-3">
                                    <Form.Label>Expected Asset Release Resolution Date</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="expectedAssetRelease_ResolutionDate"
                                        value={messes.expectedAssetRelease_ResolutionDate}
                                        onChange={handleChange}
                                        placeholder='Enter Expected Asset Release Resolution Date'
                                        className={validationErrors.expectedAssetRelease_ResolutionDate ? " input-border" : "  "}
                                    />
                                    {validationErrors.expectedAssetRelease_ResolutionDate && (
                                        <small className="text-danger">{validationErrors.expectedAssetRelease_ResolutionDate}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="reasonofBreakdown" className="mb-3">
                                    <Form.Label>Reason of Breakdown</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="reasonofBreakdown"
                                        value={messes.reasonofBreakdown}
                                        onChange={handleChange}
                                        placeholder='Enter Reason of Breakdown'
                                        className={validationErrors.reasonofBreakdown ? " input-border" : "  "}
                                    />
                                    {validationErrors.reasonofBreakdown && (
                                        <small className="text-danger">{validationErrors.reasonofBreakdown}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="warrantyStatus" className="mb-3">
                                    <Form.Label>Warranty Status</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="warrantyStatus"
                                        value={messes.warrantyStatus}
                                        onChange={handleChange}
                                        placeholder='Enter Warranty Status'
                                        className={validationErrors.warrantyStatus ? " input-border" : "  "}
                                    />
                                    {validationErrors.warrantyStatus && (
                                        <small className="text-danger">{validationErrors.warrantyStatus}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="insuranceStatus" className="mb-3">
                                    <Form.Label>Insurance Status</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="insuranceStatus"
                                        value={messes.insuranceStatus}
                                        onChange={handleChange}
                                        placeholder='Enter Insurance Status'
                                        className={validationErrors.insuranceStatus ? " input-border" : "  "}
                                    />
                                    {validationErrors.insuranceStatus && (
                                        <small className="text-danger">{validationErrors.insuranceStatus}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="timeofBreakdown" className="mb-3">
                                    <Form.Label>Timeof Breakdown</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="timeofBreakdown"
                                        value={messes.timeofBreakdown}
                                        onChange={handleChange}
                                        placeholder='Enter Timeof Breakdown'
                                        className={validationErrors.timeofBreakdown ? " input-border" : "  "}
                                    />
                                    {validationErrors.timeofBreakdown && (
                                        <small className="text-danger">{validationErrors.timeofBreakdown}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="openingTankBalance" className="mb-3">
                                    <Form.Label>Opening Tank Balance</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="openingTankBalance"
                                        value={messes.openingTankBalance}
                                        onChange={handleChange}
                                        placeholder='Enter Opening Tank Balance'
                                        className={validationErrors.openingTankBalance ? " input-border" : "  "}
                                    />
                                    {validationErrors.openingTankBalance && (
                                        <small className="text-danger">{validationErrors.openingTankBalance}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="hsdReceived" className="mb-3">
                                    <Form.Label>Hsd Received</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="hsdReceived"
                                        value={messes.hsdReceived}
                                        onChange={handleChange}
                                        placeholder='Enter Hsd Received'
                                        className={validationErrors.hsdReceived ? " input-border" : "  "}
                                    />
                                    {validationErrors.hsdReceived && (
                                        <small className="text-danger">{validationErrors.hsdReceived}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="closingTankBalance" className="mb-3">
                                    <Form.Label>Closing Tank Balance</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="closingTankBalance"
                                        value={messes.closingTankBalance}
                                        onChange={handleChange}
                                        placeholder='Enter Closing Tank Balance'
                                        className={validationErrors.closingTankBalance ? " input-border" : "  "}
                                    />
                                    {validationErrors.closingTankBalance && (
                                        <small className="text-danger">{validationErrors.closingTankBalance}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="openingReading" className="mb-3">
                                    <Form.Label>Opening Reading</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="openingReading"
                                        value={messes.openingReading}
                                        onChange={handleChange}
                                        placeholder='Enter Opening Reading'
                                        className={validationErrors.openingReading ? " input-border" : "  "}
                                    />
                                    {validationErrors.openingReading && (
                                        <small className="text-danger">{validationErrors.openingReading}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="closingReading" className="mb-3">
                                    <Form.Label>Closing Reading</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="closingReading"
                                        value={messes.closingReading}
                                        onChange={handleChange}
                                        placeholder='Enter Closing Reading'
                                        className={validationErrors.closingReading ? " input-border" : "  "}
                                    />
                                    {validationErrors.closingReading && (
                                        <small className="text-danger">{validationErrors.closingReading}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="workingHrs_RunningKM" className="mb-3">
                                    <Form.Label>Working Hrs RunningKM</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="workingHrs_RunningKM"
                                        value={messes.workingHrs_RunningKM}
                                        onChange={handleChange}
                                        placeholder='Enter Working Hrs RunningKM'
                                        className={validationErrors.workingHrs_RunningKM ? " input-border" : "  "}
                                    />
                                    {validationErrors.workingHrs_RunningKM && (
                                        <small className="text-danger">{validationErrors.workingHrs_RunningKM}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="cummulativeWorkingHrs_RunningKMs" className="mb-3">
                                    <Form.Label>Cummulative Working Hrs RunningKMs</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="cummulativeWorkingHrs_RunningKMs"
                                        value={messes.cummulativeWorkingHrs_RunningKMs}
                                        onChange={handleChange}
                                        placeholder='Enter Cummulative Working Hrs RunningKMs'
                                        className={validationErrors.cummulativeWorkingHrs_RunningKMs ? " input-border" : "  "}
                                    />
                                    {validationErrors.cummulativeWorkingHrs_RunningKMs && (
                                        <small className="text-danger">{validationErrors.cummulativeWorkingHrs_RunningKMs}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="assetisWorking" className="mb-3">
                                    <Form.Label>Assetis Working</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="assetisWorking"
                                        value={messes.assetisWorking}
                                        onChange={handleChange}
                                        placeholder='Enter Assetis Working'
                                        className={validationErrors.assetisWorking ? " input-border" : "  "}
                                    />
                                    {validationErrors.assetisWorking && (
                                        <small className="text-danger">{validationErrors.assetisWorking}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            






                            <Col className='align-items-end d-flex justify-content-between mb-3'>
                                <div>
                                    <span className='fs-5 '>This field is required*</span>
                                </div>
                                <div>
                                    <Link to={'/pages/AssetConditionMaster'}>
                                        <Button variant="primary" >
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update AssetCondition' : 'Add AssetCondition'}
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

export default AssetConditionMasterAddEdit;