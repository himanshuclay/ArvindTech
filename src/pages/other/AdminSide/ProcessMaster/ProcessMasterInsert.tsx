import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row, ButtonGroup, Modal } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
import Select from 'react-select';
import { FileUploader } from '@/components/FileUploader';
import { toast } from 'react-toastify';
// import FileUploader from './FileUploader';

interface Process {
    id: number;
    moduleName: string;
    moduleID: string;
    processID: string;
    processDisplayName: string;
    misExempt: string;
    processObjective: string;
    processFlowchart: string;
    processOwnerID: string;
    processOwnerName: string;
    link: string;
    status: string;
    createdBy: string;
    updatedBy: string;
}


interface MISExempt {
    id: number;
    name: string;
}


interface ModuleDisplayName {
    id: number;
    moduleID: string;
    moduleName: string;
}
interface ModuleOwnerName {
    empId: string;
    employeeName: string;
}


const EmployeeInsert = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [showLink, setShowLink] = useState(false);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [misExempt, setMisExempt] = useState<MISExempt[]>([]);
    const [moduleDisplayName, setModuleDisplayName] = useState<ModuleDisplayName[]>([]);
    const [processOwnerName, setProcessOwnerName] = useState<ModuleOwnerName[]>([]);
    const [empName, setEmpName] = useState<string>('')
    const [urlError, setUrlError] = useState("");
    const [iframeUrl, setIframeUrl] = useState("");
    const [process, setProcess] = useState<Process>({
        id: 0,
        moduleName: '',
        processID: '',
        moduleID: '',
        processDisplayName: '',
        misExempt: '',
        processObjective: '',
        processFlowchart: '',
        processOwnerID: '',
        processOwnerName: '',
        link: '',
        status: '',
        createdBy: '',
        updatedBy: ''
    });
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
            fetchModuleById(id);
        } else {
            setEditMode(false);
        }
    }, [id]);



    const fetchModuleById = async (id: string) => {
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/ProcessMaster/GetProcess`, {
                params: { id: id }
            });
            if (response.data.isSuccess) {
                const fetchedModule = response.data.processMasterList[0];
                setProcess(fetchedModule);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching module:', error);
        }
    };


    useEffect(() => {
        const fetchMISExempt = async () => {
            try {
                const response = await axios.get(`${config.API_URL_APPLICATION}/CommonDropdown/GetMISExempt`);
                if (response.data.isSuccess) {
                    setMisExempt(response.data.mISExemptListResponses);
                } else {
                    console.error(response.data.message);
                }
            } catch (error) {
                console.error('Error fetching MIS Exempt list:', error);
            }
        };
        fetchMISExempt();
    }, []);




    useEffect(() => {
        const fetchModuleDisplayName = async () => {
            try {
                const response = await axios.get(`${config.API_URL_APPLICATION}/CommonDropdown/GetModuleList`);
                if (response.data.isSuccess) {
                    setModuleDisplayName(response.data.moduleNameListResponses);
                } else {
                    console.error(response.data.message);
                }
            } catch (error) {
                console.error('Error fetching MIS Exempt list:', error);
            }
        };
        fetchModuleDisplayName();
    }, []);


    useEffect(() => {
        const fetchModuleOwnerName = async () => {
            try {
                const response = await axios.get(`${config.API_URL_APPLICATION}/CommonDropdown/GetEmployeeListWithId`);
                if (response.data.isSuccess) {
                    setProcessOwnerName(response.data.employeeLists);
                } else {
                    console.error(response.data.message);
                }
            } catch (error) {
                console.error('Error fetching MIS Exempt list:', error);
            }
        };
        fetchModuleOwnerName();
    }, []);


    const validateFields = (): boolean => {
        const errors: { [key: string]: string } = {};

        if (!process.moduleName) { errors.moduleName = 'Module Name is required'; }
        if (!process.processID) { errors.processID = 'Process ID is required'; }
        if (!process.processDisplayName) { errors.processDisplayName = 'Process Display Name is required'; }
        if (!process.misExempt) { errors.misExempt = 'MIS Exempt is required'; }
        if (!process.processObjective) { errors.processObjective = 'Process Objective is required'; }
        if (!process.processOwnerName) { errors.processOwnerName = 'Process Owner Name is required'; }
        if (!process.status) { errors.status = 'Status is required'; }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };


    const handleChange = (e: ChangeEvent<any> | null, name?: string, value?: any) => {
        if (e) {
            const { name: eventName, type } = e.target;

            if (type === 'link') {
                if (value && !isValidUrl(value)) {
                    setUrlError("Please enter a valid URL.");
                } else {
                    setUrlError("");
                }
            } else {
                const inputValue = (e.target as HTMLInputElement | HTMLSelectElement).value;
                setProcess({
                    ...process,
                    [eventName]: inputValue
                });
            }
        } else if (name) {
            setProcess({
                ...process,
                [name]: value
            });
        }
    };


    const isValidUrl = (url: string) => {
        const urlPattern = /^(https?:\/\/)[\w.-]+(\.[\w.-]+)+[/#?]?.*$/;
        return urlPattern.test(url);
    };

    const handleOpenLink = () => {
        setShowLink(true)

        if (process.link.includes("youtube.com") || process.link.includes("youtu.be")) {
            const videoId = getYouTubeVideoId(process.link);
            if (videoId) {
                setIframeUrl(`https://www.youtube.com/embed/${videoId}`);
            } else {
                setUrlError("Invalid YouTube video link.");
            }
        } else {
            setUrlError("Only YouTube links are supported for embedding.");
        }
    };
    const getYouTubeVideoId = (url: string) => {
        const regex = /(?:youtube\.com.*(?:\?v=|\/embed\/|\/v\/|\/.*\/)|youtu\.be\/)([^#&?]*).*/;
        const match = url.match(regex);
        return match && match[1] ? match[1] : null;
    };

    const handleClose = () => {
        setShowLink(false)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateFields()) {
            toast.dismiss()
            toast.error('Please fill in all required fields.');
            return;
        }

        const payload = {
            ...process,
            createdBy: editMode ? process.createdBy : empName,
            updatedBy: editMode ? empName : '',
        };

        try {
            const apiUrl = `${config.API_URL_APPLICATION}/ProcessMaster/${editMode ? 'UpdateProcess' : 'InsertProcess'}`;
            const response = await axios.post(apiUrl, payload);

            if (response.status === 200) {
                navigate('/pages/ProcessMaster', {
                    state: {
                        successMessage: editMode ? "Process updated successfully!" : "Process added successfully!",
                    },
                });
            } else {
                toast.error(response.data.message || "Failed to process request");
            }
        } catch (error: any) {
            toast.error(error)
            console.error('Error submitting module:', error);
        }
    };

    const optionsAppAccess = [
        { value: 'Enabled', label: 'Enabled' },
        { value: 'Disabled', label: 'Disabled' }
    ];


    const downloadZipFile = async (moduleName: string, processName: string): Promise<void> => {
        try {
            const url = `${config.API_URL_APPLICATION}/FileUpload/GetFileByID?ModuleName=${encodeURIComponent(moduleName)}&ProcessName=${encodeURIComponent(processName)}`;

            const response = await axios.get<Blob>(url, {
                responseType: 'blob',
            });

            const blob = new Blob([response.data], { type: 'files/zip' });

            const fileUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = fileUrl;
            link.setAttribute('download', `${moduleName}-${processName}.zip`); // Set the file name dynamically
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(fileUrl);
        } catch (error: any) {
            console.error(error);
        }
    };

    // Example usage
    const handleDownload = (): void => {
        const moduleName = process.moduleName;
        const processName = process.processDisplayName;
        downloadZipFile(moduleName, processName);
    };

    return (
        <div>
            <div className="container">
                <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center fs-20 rounded-3 border">
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit Process' : 'Add Process'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col lg={6}>
                                <Form.Group controlId="moduleName" className="mb-3">
                                    <Form.Label>Module Name  <span className='text-danger'>*</span></Form.Label>
                                    <Select
                                        name="moduleName"
                                        value={moduleDisplayName.find((mod) => mod.moduleName === process.moduleName)}
                                        onChange={(selectedOption) => {
                                            setProcess({
                                                ...process,
                                                moduleName: selectedOption?.moduleName || '',
                                                moduleID: selectedOption?.moduleID || '',
                                            });
                                        }}
                                        getOptionLabel={(mod) => mod.moduleName}
                                        getOptionValue={(mod) => mod.moduleName}
                                        options={moduleDisplayName}
                                        isSearchable={true}
                                        placeholder="Select Module Name"
                                        isDisabled={editMode}
                                        className={validationErrors.moduleName ? " input-border" : "  "}
                                    />
                                    {validationErrors.moduleName && (
                                        <small className="text-danger">{validationErrors.moduleName}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="processID" className="mb-3">
                                    <Form.Label>Process  Id  <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="processID"
                                        value={process.processID.toLocaleUpperCase()}
                                        onChange={handleChange}
                                        placeholder='Enter Process Id'
                                        disabled={editMode}
                                        className={validationErrors.processID ? " input-border" : "  "}
                                    />
                                    {validationErrors.processID && (
                                        <small className="text-danger">{validationErrors.processID}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="processDisplayName" className="mb-3">
                                    <Form.Label>Process  Name  <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="processDisplayName"
                                        value={process.processDisplayName}
                                        onChange={handleChange}
                                        placeholder='Enter Process Name'
                                        className={validationErrors.processDisplayName ? " input-border" : "  "}

                                    />
                                    {validationErrors.processDisplayName && (
                                        <small className="text-danger">{validationErrors.processDisplayName}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="processObjective" className="mb-3">
                                    <Form.Label>Process Objective  <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        type="textarea"
                                        name="processObjective"
                                        value={process.processObjective}
                                        onChange={handleChange}
                                        placeholder='Enter Process Objective'
                                        className={validationErrors.processObjective ? " input-border" : "  "}
                                    />
                                    {validationErrors.processObjective && (
                                        <small className="text-danger">{validationErrors.processObjective}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="misExempt" className="mb-3">
                                    <Form.Label>MIS Exempt  <span className='text-danger'>*</span></Form.Label>
                                    <Select
                                        name="misExempt"
                                        value={misExempt.find((exempt) => exempt.name === process.misExempt)}
                                        onChange={(selectedOption) => {
                                            setProcess({
                                                ...process,
                                                misExempt: selectedOption?.name || '',
                                            });
                                        }}
                                        getOptionLabel={(exempt) => exempt.name}
                                        getOptionValue={(exempt) => exempt.name}
                                        options={misExempt}
                                        isSearchable={true}
                                        placeholder="Select MIS Exempt"
                                        className={validationErrors.misExempt ? " input-border" : "  "}
                                    />
                                    {validationErrors.misExempt && (
                                        <small className="text-danger">{validationErrors.misExempt}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="status" className="mb-3">
                                    <Form.Label>Status  <span className='text-danger'>*</span></Form.Label>
                                    <Select
                                        name="status"
                                        options={optionsAppAccess}
                                        value={optionsAppAccess.find(option => option.value === process.status)}
                                        onChange={selectedOption => handleChange(null, 'status', selectedOption?.value)}
                                        placeholder="Select Status"
                                        className={validationErrors.status ? " input-border" : "  "}
                                    />
                                    {validationErrors.status && (
                                        <small className="text-danger">{validationErrors.status}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="processOwnerName" className="mb-3">
                                    <Form.Label>Process Owner Name  <span className='text-danger'>*</span></Form.Label>
                                    <Select
                                        name="processOwnerName"
                                        value={processOwnerName.find(
                                            (mod) => mod.employeeName === process.processOwnerName
                                        )}
                                        onChange={(selectedOption) => {
                                            setProcess({
                                                ...process,
                                                processOwnerName: selectedOption?.employeeName || '',
                                                processOwnerID: selectedOption?.empId || '',
                                            });
                                        }}
                                        getOptionLabel={(mod) => mod.employeeName}
                                        getOptionValue={(mod) => mod.employeeName}
                                        options={processOwnerName}
                                        isSearchable={true}
                                        placeholder="Select Process Owner Name"
                                        className={validationErrors.processOwnerName ? " input-border" : "  "}
                                    />
                                    {validationErrors.processOwnerName && (
                                        <small className="text-danger">{validationErrors.processOwnerName}</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="link" className="mb-3 position-relative">
                                    <Form.Label>Youtube Link</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="link"
                                        value={process.link}
                                        onChange={handleChange}
                                        placeholder="e.g., https://www.example.com"
                                        isInvalid={!!urlError}
                                    />
                                    <Form.Control.Feedback type="invalid">{urlError}</Form.Control.Feedback>
                                    {process.link && isValidUrl(process.link) && (
                                        <div onClick={handleOpenLink} className="mt-2 link-btn p-1"><i className="ri-eye-fill"></i></div>
                                    )}


                                </Form.Group>
                            </Col>
                            <Col lg={12}>
                                <Form.Group controlId="processFlowchart" className="mb-3">
                                    <Form.Label>Process Flowchart</Form.Label>
                                    <FileUploader
                                        icon="ri-upload-cloud-2-line"
                                        text="Drop files here or click to upload."
                                        endPoint={`${config.API_URL_APPLICATION}/FileUpload/UploadFiles`}
                                        additionalData={{
                                            moduleName: process.moduleName,
                                            processName: process.processDisplayName,
                                            CreatedBy: empName,
                                            UpdatedBy: empName,
                                        }}
                                        onFileUpload={(files) => {
                                            console.log('Files uploaded:', files);
                                        }}
                                    />
                                </Form.Group>
                            </Col>


                            <Col> <Button onClick={handleDownload}>Download Files</Button></Col>

                            <Col lg={3} className='align-items-end d-flex justify-content-end mb-3'>
                                <ButtonGroup aria-label="Basic example" className='w-100'>
                                    <Link to={'/pages/ProcessMaster'} className="btn btn-primary">
                                        Back
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update Process' : 'Add Process'}
                                    </Button>
                                </ButtonGroup>
                            </Col>

                        </Row>

                    </Form>
                </div>
            </div>

            <Modal className="p-0" show={showLink} onHide={handleClose} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Link Preview</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {iframeUrl ? (
                        <div className="p-0 m-0">
                            <iframe
                                width="100%"
                                height="550"
                                src={iframeUrl}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    ) :
                        urlError}
                </Modal.Body>
            </Modal>






        </div >
    );
};

export default EmployeeInsert;