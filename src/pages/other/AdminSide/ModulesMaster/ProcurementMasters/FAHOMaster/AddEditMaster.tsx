import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
// import Select from 'react-select';
import { toast } from 'react-toastify';


interface BTS_PAYMENT {
    id: number,
asset_Group_Code: string,
assetCode: string,
assetType: string,
assetName: string,
systemName: string,
model: string,
workingStatus: string,
empid: string,
userName: string,
department: string,
location: string,
qrCode: string,
serialNumber_IMEINumber: string,
processor: string,
ram: string,
harddisk: string,
warrantyExpired: string,
microsoftIDWindows: string,
operatingSystem: string,
operatingtype: string,
microsoftIDOffice: string,
msOffice: string,
antivirus: string,
antivirusExpiredDate: string,
antivirusKey: string,
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

const FAHOMasterAddEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [empName, setEmpName] = useState<string | null>('')
    const [, setProjectList] = useState<ProjectList[]>([])
    const [, setStatusList] = useState<Status[]>([])
    const [, setEmployeeList] = useState<EmployeeList[]>([])
    const [messes, setMesses] = useState<BTS_PAYMENT>({
        id: 0,
        asset_Group_Code: '',
        assetCode: '',
        assetType: '',
        assetName: '',
        systemName: '',
        model: '',
        workingStatus: '',
        empid: '',
        userName: '',
        department: '',
        location: '',
        qrCode: '',
        serialNumber_IMEINumber: '',
        processor: '',
        ram: '',
        harddisk: '',
        warrantyExpired: '',
        microsoftIDWindows: '',
        operatingSystem: '',
        operatingtype: '',
        microsoftIDOffice: '',
        msOffice: '',
        antivirus: '',
        antivirusExpiredDate: '',
        antivirusKey: '',
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
            const response = await axios.get(`${config.API_URL_APPLICATION1}/FAHOMaster/GetFAHO/${id}`);
            console.log('response', response)
            if (response.data.isSuccess) {
                const fetchedModule = response.data.fahoMasters[0];
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


if(!messes.asset_Group_Code) { errors.asset_Group_Code = 'asset_Group_Code is required'}
if(!messes.assetCode) { errors.assetCode = 'assetCode is required'}
if(!messes.assetType) { errors.assetType = 'assetType is required'}
if(!messes.assetName) { errors.assetName = 'assetName is required'}
if(!messes.systemName) { errors.systemName = 'systemName is required'}
if(!messes.model) { errors.model = 'model is required'}
if(!messes.workingStatus) { errors.workingStatus = 'workingStatus is required'}
if(!messes.empid) { errors.empid = 'empid is required'}
if(!messes.userName) { errors.userName = 'userName is required'}
if(!messes.department) { errors.department = 'department is required'}
if(!messes.location) { errors.location = 'location is required'}
if(!messes.qrCode) { errors.qrCode = 'qrCode is required'}
if(!messes.serialNumber_IMEINumber) { errors.serialNumber_IMEINumber = 'serialNumber_IMEINumber is required'}
if(!messes.processor) { errors.processor = 'processor is required'}
if(!messes.ram) { errors.ram = 'ram is required'}
if(!messes.harddisk) { errors.harddisk = 'harddisk is required'}
if(!messes.warrantyExpired) { errors.warrantyExpired = 'warrantyExpired is required'}
if(!messes.microsoftIDWindows) { errors.microsoftIDWindows = 'microsoftIDWindows is required'}
if(!messes.operatingSystem) { errors.operatingSystem = 'operatingSystem is required'}
if(!messes.operatingtype) { errors.operatingtype = 'operatingtype is required'}
if(!messes.microsoftIDOffice) { errors.microsoftIDOffice = 'microsoftIDOffice is required'}
if(!messes.msOffice) { errors.msOffice = 'msOffice is required'}
if(!messes.antivirus) { errors.antivirus = 'antivirus is required'}
if(!messes.antivirusExpiredDate) { errors.antivirusExpiredDate = 'antivirusExpiredDate is required'}
if(!messes.antivirusKey) { errors.antivirusKey = 'antivirusKey is required'}




       



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
                await axios.put(`${config.API_URL_APPLICATION1}/FAHOMaster/UpdateFAHO/${id}`, payload);
                navigate('/pages/FAHOMaster', {
                    state: {
                        successMessage: "Challan Master Updated successfully!",
                    }
                });
            } else {
                await axios.post(`${config.API_URL_APPLICATION1}/FAHOMaster/CreateFAHO`, payload);
                navigate('/pages/FAHOMaster', {
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
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit FAHO Master' : 'Add FAHO Master'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>

                            <Col lg={6}>
                                <Form.Group controlId="asset_Group_Code" className="mb-3">
                                    <Form.Label>asset_Group_Code</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="asset_Group_Code"
                                        value={messes.asset_Group_Code}
                                        onChange={handleChange}
                                        placeholder='Enter asset_Group_Code'
                                        disabled={editMode}
                                        className={validationErrors.asset_Group_Code ? " input-border" : "  "}
                                    />
                                    {validationErrors.asset_Group_Code && (
                                        <small className="text-danger">{validationErrors.asset_Group_Code}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="assetCode" className="mb-3">
                                    <Form.Label>assetCode</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="assetCode"
                                        value={messes.assetCode}
                                        onChange={handleChange}
                                        placeholder='Enter assetCode'
                                        disabled={editMode}
                                        className={validationErrors.assetCode ? " input-border" : "  "}
                                    />
                                    {validationErrors.assetCode && (
                                        <small className="text-danger">{validationErrors.assetCode}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="assetType" className="mb-3">
                                    <Form.Label>assetType</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="assetType"
                                        value={messes.assetType}
                                        onChange={handleChange}
                                        placeholder='Enter assetType'
                                        disabled={editMode}
                                        className={validationErrors.assetType ? " input-border" : "  "}
                                    />
                                    {validationErrors.assetType && (
                                        <small className="text-danger">{validationErrors.assetType}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="assetName" className="mb-3">
                                    <Form.Label>assetName</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="assetName"
                                        value={messes.assetName}
                                        onChange={handleChange}
                                        placeholder='Enter assetName'
                                        disabled={editMode}
                                        className={validationErrors.assetName ? " input-border" : "  "}
                                    />
                                    {validationErrors.assetName && (
                                        <small className="text-danger">{validationErrors.assetName}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="systemName" className="mb-3">
                                    <Form.Label>systemName</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="systemName"
                                        value={messes.systemName}
                                        onChange={handleChange}
                                        placeholder='Enter Project ID'
                                        className={validationErrors.systemName ? " input-border" : "  "}
                                    />
                                    {validationErrors.systemName && (
                                        <small className="text-danger">{validationErrors.systemName}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="model" className="mb-3">
                                    <Form.Label>model</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="model"
                                        value={messes.model}
                                        onChange={handleChange}
                                        placeholder='Enter Project Name'
                                        className={validationErrors.model ? " input-border" : "  "}
                                    />
                                    {validationErrors.model && (
                                        <small className="text-danger">{validationErrors.model}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="workingStatus" className="mb-3">
                                    <Form.Label>workingStatus</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="workingStatus"
                                        value={messes.workingStatus}
                                        onChange={handleChange}
                                        className={validationErrors.workingStatus ? "input-border" : ""}
                                    />

                                    {validationErrors.workingStatus && (
                                        <small className="text-danger">{validationErrors.workingStatus}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="empid" className="mb-3">
                                    <Form.Label>empid</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="empid"
                                        value={messes.empid}
                                        onChange={handleChange}
                                        className={validationErrors.empid ? "input-border" : ""}
                                    />

                                    {validationErrors.empid && (
                                        <small className="text-danger">{validationErrors.empid}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="userName" className="mb-3">
                                    <Form.Label>userName</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="userName"
                                        value={messes.userName}
                                        onChange={handleChange}
                                        className={validationErrors.userName ? "input-border" : ""}
                                    />

                                    {validationErrors.userName && (
                                        <small className="text-danger">{validationErrors.userName}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="department" className="mb-3">
                                    <Form.Label>department</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="department"
                                        value={messes.department}
                                        onChange={handleChange}
                                        className={validationErrors.department ? "input-border" : ""}
                                    />

                                    {validationErrors.department && (
                                        <small className="text-danger">{validationErrors.department}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="location" className="mb-3">
                                    <Form.Label>location</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="location"
                                        value={messes.location}
                                        onChange={handleChange}
                                        className={validationErrors.location ? "input-border" : ""}
                                    />

                                    {validationErrors.location && (
                                        <small className="text-danger">{validationErrors.location}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="qrCode" className="mb-3">
                                    <Form.Label>qrCode</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="qrCode"
                                        value={messes.qrCode}
                                        onChange={handleChange}
                                        className={validationErrors.qrCode ? "input-border" : ""}
                                    />

                                    {validationErrors.qrCode && (
                                        <small className="text-danger">{validationErrors.qrCode}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="serialNumber_IMEINumber" className="mb-3">
                                    <Form.Label>serialNumber_IMEINumber</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="serialNumber_IMEINumber"
                                        value={messes.serialNumber_IMEINumber}
                                        onChange={handleChange}
                                        className={validationErrors.serialNumber_IMEINumber ? "input-border" : ""}
                                    />

                                    {validationErrors.serialNumber_IMEINumber && (
                                        <small className="text-danger">{validationErrors.serialNumber_IMEINumber}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="processor" className="mb-3">
                                    <Form.Label>processor</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="processor"
                                        value={messes.processor}
                                        onChange={handleChange}
                                        className={validationErrors.processor ? "input-border" : ""}
                                    />

                                    {validationErrors.processor && (
                                        <small className="text-danger">{validationErrors.processor}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="ram" className="mb-3">
                                    <Form.Label>ram</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="ram"
                                        value={messes.ram}
                                        onChange={handleChange}
                                        className={validationErrors.ram ? "input-border" : ""}
                                    />

                                    {validationErrors.ram && (
                                        <small className="text-danger">{validationErrors.ram}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="harddisk" className="mb-3">
                                    <Form.Label>harddisk</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="harddisk"
                                        value={messes.harddisk}
                                        onChange={handleChange}
                                        className={validationErrors.harddisk ? "input-border" : ""}
                                    />

                                    {validationErrors.harddisk && (
                                        <small className="text-danger">{validationErrors.harddisk}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="warrantyExpired" className="mb-3">
                                    <Form.Label>warrantyExpired</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="warrantyExpired"
                                        value={messes.warrantyExpired}
                                        onChange={handleChange}
                                        className={validationErrors.warrantyExpired ? "input-border" : ""}
                                    />

                                    {validationErrors.warrantyExpired && (
                                        <small className="text-danger">{validationErrors.warrantyExpired}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="microsoftIDWindows" className="mb-3">
                                    <Form.Label>microsoftIDWindows</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="microsoftIDWindows"
                                        value={messes.microsoftIDWindows}
                                        onChange={handleChange}
                                        className={validationErrors.microsoftIDWindows ? "input-border" : ""}
                                    />

                                    {validationErrors.microsoftIDWindows && (
                                        <small className="text-danger">{validationErrors.microsoftIDWindows}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="operatingSystem" className="mb-3">
                                    <Form.Label>operatingSystem</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="operatingSystem"
                                        value={messes.operatingSystem}
                                        onChange={handleChange}
                                        className={validationErrors.operatingSystem ? "input-border" : ""}
                                    />

                                    {validationErrors.operatingSystem && (
                                        <small className="text-danger">{validationErrors.operatingSystem}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="operatingtype" className="mb-3">
                                    <Form.Label>operatingtype</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="operatingtype"
                                        value={messes.operatingtype}
                                        onChange={handleChange}
                                        className={validationErrors.operatingtype ? "input-border" : ""}
                                    />

                                    {validationErrors.operatingtype && (
                                        <small className="text-danger">{validationErrors.operatingtype}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="microsoftIDOffice" className="mb-3">
                                    <Form.Label>microsoftIDOffice</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="microsoftIDOffice"
                                        value={messes.microsoftIDOffice}
                                        onChange={handleChange}
                                        className={validationErrors.microsoftIDOffice ? "input-border" : ""}
                                    />

                                    {validationErrors.microsoftIDOffice && (
                                        <small className="text-danger">{validationErrors.microsoftIDOffice}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="msOffice" className="mb-3">
                                    <Form.Label>msOffice</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="msOffice"
                                        value={messes.msOffice}
                                        onChange={handleChange}
                                        className={validationErrors.msOffice ? "input-border" : ""}
                                    />

                                    {validationErrors.msOffice && (
                                        <small className="text-danger">{validationErrors.msOffice}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="antivirus" className="mb-3">
                                    <Form.Label>antivirus</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="antivirus"
                                        value={messes.antivirus}
                                        onChange={handleChange}
                                        className={validationErrors.antivirus ? "input-border" : ""}
                                    />

                                    {validationErrors.antivirus && (
                                        <small className="text-danger">{validationErrors.antivirus}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="antivirusExpiredDate" className="mb-3">
                                    <Form.Label>antivirusExpiredDate</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="antivirusExpiredDate"
                                        value={messes.antivirusExpiredDate}
                                        onChange={handleChange}
                                        className={validationErrors.antivirusExpiredDate ? "input-border" : ""}
                                    />

                                    {validationErrors.antivirusExpiredDate && (
                                        <small className="text-danger">{validationErrors.antivirusExpiredDate}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="antivirusKey" className="mb-3">
                                    <Form.Label>antivirusKey</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="antivirusKey"
                                        value={messes.antivirusKey}
                                        onChange={handleChange}
                                        className={validationErrors.antivirusKey ? "input-border" : ""}
                                    />

                                    {validationErrors.antivirusKey && (
                                        <small className="text-danger">{validationErrors.antivirusKey}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            
                            
                            
                           
                           








                            <Col className='align-items-end d-flex justify-content-between mb-3'>
                                <div>
                                    <span className='fs-5 '>This field is required*</span>
                                </div>
                                <div>
                                    <Link to={'/pages/FAHOMaster'}>
                                        <Button variant="primary" >
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update FAHO' : 'Add FAHO'}
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

export default FAHOMasterAddEdit;