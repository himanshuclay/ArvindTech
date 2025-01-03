import axios from 'axios';
import { useState, useEffect } from 'react';
import { Button, Pagination, Table, Container, Row, Col, Alert, Form, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import config from '@/config';
import EmployeeBankPopup from './EmployeeBankPopup';
import Select from 'react-select';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


interface Employee {
    id: number;
    empID: string;
    employeeName: string;
    fatherName: string;
    email: string;
    role: string;
    dataAccessLevel: string;
    empStatus: string;
    hrUpdatedMobileNo: string;
    userUpdatedMobileNo: string;
    state: string;
    district: string;
    area: string;
    pin: string;
    address: string;
    photo: string;
    gender: string;
    dateOfBirth: string;
    dateOfJoining: string;
    dateOfLeaving: string;
    departmentName: string;
    designation: string;
    appExempt: string;
    isPerformanceReview: string;
    appAccessLevel: string;
    appAccess: string;
    currentProjectName: string;
    salaryBankAccountType: string;
    salaryBankAccountNumber: string;
    salaryBankName: string;
    salaryBankIfsc: string;
    salaryBranchName: string;
    reimbursementBankAccountType: string;
    reimbursementBankAccountNumber: string;
    reimbursementBankName: string;
    reimbursementBankIfsc: string;
    reimbursementBranchName: string;
    expenseBankAccountType: string;
    expenseBankAccountNumber: string;
    expenseBankName: string;
    expenseBankIfsc: string;
    expenseBranchName: string;
    excelDobValue: string;
    excelDojValue: string;
    excelDolValue: string;
    isRegistered: string;
    daL_Module: string;
    daL_Project: string;
    registrationDate: string;
    createdBy: string;
    updatedBy: string;
    updatedDate: string;
    createdDate: string;

}

interface Column {
    id: string;
    label: string;
    visible: boolean;
}

interface EmployeeList {
    empId: string;
    employeeName: string;
}

interface ModuleProjectList {
    id: string;
    projectName: string
    moduleName: string
}


const EmployeeMaster = () => {
    const role = localStorage.getItem('role');
    const [employee, setEmployee] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showView, setShowView] = useState(false);
    const [manageId, setManageID] = useState<number>();
    const [employeeList, setEmployeeList] = useState<EmployeeList[]>([]);
    const [downloadCsv, setDownloadCsv] = useState<Employee[]>([]);
    const [projectList, setProjectList] = useState<ModuleProjectList[]>([])
    const [searchTriggered, setSearchTriggered] = useState(false);


    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        if (location.state?.successMessage) {
            toast.dismiss()
            toast.success(location.state.successMessage);
            navigate(location.pathname, { replace: true });
        }
    }, [location.state, navigate]);



    // both are required to make dragable column of table 
    const [columns, setColumns] = useState<Column[]>([
        { id: 'empID', label: 'Employee ID ', visible: true },
        { id: 'employeeName', label: 'Employee Name ', visible: true },
        { id: 'appAccessLevel', label: 'App Access Level', visible: true },
        { id: 'appAccess', label: 'App Access', visible: true },
        { id: 'empStatus', label: 'Employee Status', visible: true },
        { id: 'dataAccessLevel', label: 'Data Access Level', visible: true },
        { id: 'isRegistered', label: 'Is Registered', visible: true },
        { id: 'registrationDate', label: 'Registration Date', visible: true },
        { id: 'dateOfJoining', label: 'Date Of Joining', visible: true },
        { id: 'dateOfLeaving', label: 'Date Of Leaving', visible: true },
        { id: 'departmentName', label: 'Department Name', visible: true },
        { id: 'designation', label: 'Designation', visible: true },
        { id: 'currentProjectName', label: 'Current Project Name', visible: true },
        { id: 'daL_Module', label: 'DAL Module', visible: true },
        { id: 'daL_Project', label: 'DAL Project', visible: true },

    ]);

    const handleOnDragEnd = (result: any) => {
        if (!result.destination) return;
        const reorderedColumns = Array.from(columns);
        const [movedColumn] = reorderedColumns.splice(result.source.index, 1);
        reorderedColumns.splice(result.destination.index, 0, movedColumn);
        setColumns(reorderedColumns);
    };
    // ==============================================================



    const [searchEmployee, setSearchEmployee] = useState('');
    const [searchProject, setSearchProject] = useState('');
    const [searchAppAccessLevel, setSearchAppAccessLevel] = useState('');
    const [searchDataAccessLevel, setSearchDataAccessLevel] = useState('');
    const [searchAppAccess, setSearchAppAccess] = useState('');
    const [searchEmpstatus, setSearchEmpstatus] = useState('');



    useEffect(() => {
        if (!searchTriggered) {
            fetchEmployee();
        }
    }, [currentPage]);

    useEffect(() => {
        if (searchTriggered) {
            if (searchEmployee || searchProject || searchAppAccessLevel || searchDataAccessLevel || searchAppAccess || searchEmpstatus) {
                (async () => {
                    await handleSearch();
                })();
            } else {
                fetchEmployee();
            }
        }
    }, [searchTriggered, currentPage]);


    const handleSearch = async () => {
        try {
            let query = `?`;

            if (searchEmployee) query += `EmployeeName=${searchEmployee}&`;
            if (searchProject) query += `CurrentProjectName=${searchProject}&`;
            if (searchAppAccessLevel) query += `AppAccessLevel=${searchAppAccessLevel}&`;
            if (searchDataAccessLevel) query += `DataAccessLevel=${searchDataAccessLevel}&`;
            if (searchAppAccess) query += `AppAccess=${searchAppAccess}&`;
            if (searchEmpstatus) query += `EmpStatus=${searchEmpstatus}&`;
            query += `PageIndex=${currentPage}`;
            query = query.endsWith('&') ? query.slice(0, -1) : query;

            const apiUrl = `${config.API_URL_APPLICATION}/EmployeeMaster/SearchEmployee${query}`;
            console.log("API URL:", apiUrl);

            setLoading(true);

            const { data } = await axios.get(apiUrl, { headers: { accept: '*/*' } });

            if (data.isSuccess) {  // Ensure successful response
                setEmployee(data.employeeMasterList);
                setTotalPages(Math.ceil(data.totalCount / 10));
                console.log("Search Response:", data.employeeMasterList);
            } else {
                console.log("Error in API response:", data.message);  // Handle error message if needed
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };



    const handleClear = async () => {
        setCurrentPage(1);
        setSearchEmployee('');
        setSearchProject('');
        setSearchAppAccessLevel('');
        setSearchDataAccessLevel('');
        setSearchAppAccess('');
        setSearchEmpstatus('');
        setSearchTriggered(false);
        await new Promise(resolve => setTimeout(resolve, 200));
        await fetchEmployee();
    };


    const fetchEmployee = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/EmployeeMaster/GetEmployee`, {
                params: { PageIndex: currentPage }
            });
            if (response.data.isSuccess) {
                setEmployee(response.data.employeeMasterList);
                setTotalPages(Math.ceil(response.data.totalCount / 10));
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching doers:', error);
        }
        finally {
            setLoading(false);
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

        fetchData('CommonDropdown/GetEmployeeListWithId', setEmployeeList, 'employeeLists');
        fetchData('CommonDropdown/GetProjectList', setProjectList, 'projectListResponses');
        fetchData('EmployeeMaster/GetEmployee', setDownloadCsv, 'employeeMasterList');

    }, []);



    const convertToCSV = (data: Employee[]) => {
        const csvRows = [
            // Column headers
            [
                'ID',
                'Employee ID',
                'Employee Name',
                'Father Name',
                'Gender',
                'Date of Birth',
                'Date of Joining',
                'Date of Leaving',
                'Email',
                'HR Updated Mobile No',
                'User Updated Mobile No',
                'State',
                'District',
                'Area',
                'Pin',
                'Address',
                'Photo',
                'Employee Status',
                'Data Access Level',
                'App Access Level',
                'App Access',
                'App Exempt',
                'Is Performance Review',
                'Is Registered',
                'DAL Module',
                'DAL Project',
                'Registration Date',
                'Department Name',
                'Designation',
                'Current Project Name',
                'Salary Bank Account Number',
                'Salary Bank Name',
                'Salary Bank IFSC',
                'Salary Branch Name',
                'Reimbursement Bank Account Number',
                'Reimbursement Bank Name',
                'Reimbursement Bank IFSC',
                'Reimbursement Branch Name',
                'Expense Bank Account Number',
                'Expense Bank Name',
                'Expense Bank IFSC',
                'Expense Branch Name',
                'Excel DOB Value',
                'Excel DOJ Value',
                'Excel DOL Value',
                'Created By',
                'Updated By',
                'Created Date',
                'Updated Date'
            ],
            // Data rows
            ...data.map(employee => [
                employee.id,
                employee.empID,
                employee.employeeName,
                employee.fatherName,
                employee.gender,
                employee.dateOfBirth,
                employee.dateOfJoining,
                employee.dateOfLeaving,
                employee.email,
                employee.hrUpdatedMobileNo,
                employee.userUpdatedMobileNo,
                employee.state,
                employee.district,
                employee.area,
                employee.pin,
                employee.address,
                employee.photo,
                employee.empStatus,
                employee.dataAccessLevel,
                employee.appAccessLevel,
                employee.appAccess,
                employee.appExempt,
                employee.isPerformanceReview,
                employee.isRegistered,
                `"${employee.daL_Module}"`,
                `"${employee.daL_Project}"`,
                employee.registrationDate,
                employee.departmentName,
                employee.designation,
                employee.currentProjectName,
                `"'${employee.salaryBankAccountNumber}"`,
                employee.salaryBankName,
                employee.salaryBankIfsc,
                `"${employee.salaryBranchName}"`,
                `"'${employee.reimbursementBankAccountNumber}"`,
                employee.reimbursementBankName,
                employee.reimbursementBankIfsc,
                `"${employee.reimbursementBranchName}"`,
                `"'${employee.expenseBankAccountNumber}"`,
                employee.expenseBankName,
                employee.expenseBankIfsc,
                `"${employee.expenseBranchName}"`,
                employee.excelDobValue,
                employee.excelDojValue,
                employee.excelDolValue,
                employee.createdBy,
                employee.updatedBy,
                employee.createdDate,
                employee.updatedDate
            ])
        ];

        return csvRows.map(row => row.join(',')).join('\n');
    };


    const downloadCSV = () => {
        const csvData = convertToCSV(downloadCsv);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'Employee Master.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };



    const handleShowview = () => setShowView(true);


    const handleViewEdit = (id: number) => {
        handleShowview();
        setManageID(id)

    };


    const optionsAppAccess = [
        { value: 'Enabled', label: 'Enabled' },
        { value: 'Disabled', label: 'Disabled' }
    ];

    const optionsEmpStatus = [
        { value: 'Current', label: 'Current' },
        { value: 'Former', label: 'Former' },
        { value: 'Absconding', label: 'Absconding' },
    ];

    const optionsAppAccesLevel = [
        { value: 'Admin', label: 'Admin' },
        { value: 'DME', label: 'DME' },
        { value: 'ProcessCoordinator', label: 'ProcessCoordinator' },
        { value: 'Management', label: 'Management' },
        { value: 'Employee', label: 'Employee' },
    ];
    const optionsDataAccesLevel = [
        { value: 'All', label: 'All' },
        { value: 'OnlySelf', label: 'OnlySelf' },
        { value: 'ProjectModule', label: 'ProjectModule' },
        { value: 'Module', label: 'Module' },
        { value: 'Project', label: 'Project' }
    ];

    return (
        <>
            <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center">
                <span><i className="ri-file-list-line me-2 text-dark fs-16"></i><span className='fw-bold text-dark fs-15'>Employee List</span></span>
                <div className="d-flex justify-content-end  ">
                    <div >
                        <Button variant="primary" onClick={downloadCSV} className="me-2">
                            Download CSV
                        </Button>
                        {(role === 'Admin' || role === 'DME') && (

                            <Link to='/pages/EmployeeMasterinsert'>
                                <Button variant="primary" className="me-2">
                                    Add Employee
                                </Button>
                            </Link>
                        )}
                    </div>

                </div>
            </div>
            <div className='bg-white p-2 pb-2'>

                <Form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        setSearchTriggered(true);
                        await setCurrentPage(1);

                    }}
                >
                    <Row>
                        <Col lg={4} className="mt-2">
                            <Form.Group controlId="searchEmployee">
                                <Form.Label>Employee Name</Form.Label>
                                <Select
                                    name="searchEmployee"
                                    value={employeeList.find(emp => emp.employeeName === searchEmployee) || null} // handle null
                                    onChange={(selectedOption) => setSearchEmployee(selectedOption ? selectedOption.employeeName : "")} // null check
                                    options={employeeList}
                                    getOptionLabel={(emp) => emp.employeeName}
                                    getOptionValue={(emp) => emp.employeeName.split('-')[0].trim()}
                                    isSearchable={true}
                                    placeholder="Select Employee Name"
                                    className="h45"
                                />
                            </Form.Group>
                        </Col>



                        <Col lg={4} className="mt-2">
                            <Form.Group controlId="searchProject">
                                <Form.Label>Project Name</Form.Label>
                                <Select
                                    name="searchProject"
                                    value={projectList.find(item => item.projectName === searchProject)}
                                    onChange={(selectedOption) => setSearchProject(selectedOption ? selectedOption.projectName : '')}
                                    options={projectList}
                                    getOptionLabel={(task) => task.projectName}
                                    getOptionValue={(task) => task.projectName}
                                    isSearchable={true}
                                    placeholder="Select Project Name"
                                    className="h45"
                                />
                            </Form.Group>
                        </Col>
                        <Col lg={4} className="mt-2">
                            <Form.Group controlId="searchAppAccessLevel">
                                <Form.Label>App Access Level</Form.Label>
                                <Select
                                    name="searchAppAccessLevel"
                                    options={optionsAppAccesLevel}
                                    value={optionsAppAccesLevel.find(option => option.value === searchAppAccessLevel) || null}
                                    onChange={(selectedOption) => setSearchAppAccessLevel(selectedOption?.value || '')}
                                    placeholder="Select App Access Level"
                                />
                            </Form.Group>
                        </Col>
                        <Col lg={4} className="mt-2">
                            <Form.Group controlId="searchDataAccessLevel">
                                <Form.Label>Data Access Level</Form.Label>
                                <Select
                                    name="searchDataAccessLevel"
                                    options={optionsDataAccesLevel}
                                    value={optionsDataAccesLevel.find(option => option.value === searchDataAccessLevel) || null}
                                    onChange={(selectedOption) => setSearchDataAccessLevel(selectedOption?.value || '')}
                                    placeholder="Select Data Access Level"
                                />
                            </Form.Group>
                        </Col>
                        <Col lg={4} className="mt-2">
                            <Form.Group controlId="searchAppAccess">
                                <Form.Label>App Access</Form.Label>
                                <Select
                                    name="searchAppAccess"
                                    options={optionsAppAccess}
                                    value={optionsAppAccess.find(option => option.value === searchAppAccess) || null}
                                    onChange={(selectedOption) => setSearchAppAccess(selectedOption?.value || '')}
                                    placeholder="Select App Access"
                                />
                            </Form.Group>
                        </Col>

                        <Col lg={4} className="mt-2">
                            <Form.Group controlId="searchEmpstatus">
                                <Form.Label>Employee Status</Form.Label>
                                <Select
                                    name="searchEmpstatus"
                                    options={optionsEmpStatus}
                                    value={optionsEmpStatus.find(option => option.value === searchEmpstatus) || null}
                                    onChange={(selectedOption) => setSearchEmpstatus(selectedOption?.value || '')}
                                    placeholder="Select Employee Status"
                                />
                            </Form.Group>
                        </Col>

                        <Col></Col>

                        <Col lg={4} className="align-items-end d-flex justify-content-end mt-3">
                            <ButtonGroup aria-label="Basic example" className="w-100">
                                <Button type="button" variant="primary" onClick={handleClear}>
                                    <i className="ri-loop-left-line"></i>
                                </Button>
                                &nbsp;
                                <Button type="submit" variant="primary"

                                >
                                    Search
                                </Button>
                            </ButtonGroup>
                        </Col>
                    </Row>
                </Form>

                <Row className='mt-3'>
                    <div className="d-flex justify-content-end bg-light p-1">
                        <div className="app-search d-none d-lg-block me-4">
                        </div>
                    </div>
                </Row>
            </div>

            {loading ? (
                <div className='loader-container'>
                    <div className="loader"></div>
                    <div className='mt-2'>Please Wait!</div>
                </div>
            ) : (
                <>

                    <div className="overflow-auto text-nowrap ">
                        {!employee ? (
                            <Container className="mt-5">
                                <Row className="justify-content-center">
                                    <Col xs={12} md={8} lg={6}>
                                        <Alert variant="info" className="text-center">
                                            <h4>No Data Found</h4>
                                            <p>You currently don't have any Data</p>
                                        </Alert>
                                    </Col>
                                </Row>
                            </Container>
                        ) : (
                            <DragDropContext onDragEnd={handleOnDragEnd}>
                                <Table hover className='bg-white'>
                                    <thead>
                                        <Droppable droppableId="columns" direction="horizontal">
                                            {(provided) => (
                                                <tr {...provided.droppableProps} ref={provided.innerRef as React.Ref<HTMLTableRowElement>}>
                                                    <th><i className="ri-list-ordered-2"></i>  Sr. No</th>
                                                    {columns.filter(col => col.visible).map((column, index) => (
                                                        <Draggable key={column.id} draggableId={column.id} index={index}>
                                                            {(provided) => (
                                                                <th>
                                                                    <div ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}>


                                                                        {column.id === 'employeeName' && (<i className="ri-user-line"></i>)}
                                                                        {column.id === 'projectID' && (<i className="ri-barcode-box-line"></i>)}
                                                                        {column.id === 'stateName' && (<i className="ri-map-pin-line"></i>)}
                                                                        {column.id === 'projectTypeName' && (<i className="ri-treasure-map-line"></i>)}
                                                                        {column.id === 'managementContractName' && (<i className="ri-briefcase-line"></i>)}
                                                                        {column.id === 'projectInchargeName' && (<i className="ri-user-settings-line"></i>)}
                                                                        {column.id === 'projectCoordinatorName' && (<i className="ri-group-line"></i>)}
                                                                        {column.id === 'completionStatusName' && (<i className="ri-check-line"></i>)}
                                                                        {column.id === 'nameOfWork' && (<i className="ri-pencil-ruler-2-line"></i>)}


                                                                        &nbsp; {column.label}
                                                                    </div>
                                                                </th>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    <th>Bank Details</th>
                                                    {(role === 'Admin' || role === 'DME') && (

                                                        <th>Action</th>
                                                    )}
                                                </tr>
                                            )}
                                        </Droppable>
                                    </thead>
                                    <tbody>
                                        {employee.length > 0 ? (
                                            employee.slice(0, 10).map((item, index) => (
                                                <tr key={item.id}>
                                                    <td>{(currentPage - 1) * 10 + index + 1}</td>
                                                    {columns.filter(col => col.visible).map((col) => (
                                                        <td key={col.id}
                                                            className={
                                                                // col.id === 'employeeName' ? 'fw-bold text-dark' :
                                                                (col.id === 'appAccess' && item[col.id] === "Enabled") ? 'task1' :
                                                                    (col.id === 'appAccess' && item[col.id] === "Disabled") ? 'task4' :
                                                                        (col.id === 'empStatus' && item[col.id] === "Current") ? 'task1' :
                                                                            (col.id === 'empStatus' && item[col.id] === "Absconding") ? 'task2' :
                                                                                (col.id === 'empStatus' && item[col.id] === "Former") ? 'task3' :
                                                                                    ''
                                                            }
                                                        >
                                                            {

                                                                col.id === 'daL_Project' ? (
                                                                    <td>
                                                                        {item.daL_Project.split(",")
                                                                            .map((incharge: any, index: any) => (
                                                                                <div key={index}>{incharge.trim()}
                                                                                </div>
                                                                            ))}
                                                                    </td>
                                                                ) : col.id === 'daL_Module' ? (
                                                                    <td>
                                                                        {item.daL_Module.split(",")
                                                                            .map((incharge: any, index: any) => (
                                                                                <div key={index}>{incharge.trim()}
                                                                                </div>
                                                                            ))}
                                                                    </td>
                                                                ) : col.id === 'employeeName' ? (
                                                                    <td>
                                                                        <div className='d-flex align-items-center'>
                                                                            {item.employeeName.split('_')[0]}
                                                                        </div>
                                                                        {item.userUpdatedMobileNo ?
                                                                            <p className='fw-normal m-0'><a href={`tel:${item.userUpdatedMobileNo}`}> <i className="ri-phone-fill"></i> {item.userUpdatedMobileNo}</a></p> : ""
                                                                        }
                                                                    </td>
                                                                ) : (<div>{item[col.id as keyof Employee]}</div>
                                                                )}
                                                        </td>
                                                    ))}
                                                    <td><Button variant='primary' className='text-white icon-padding' onClick={() => handleViewEdit(item.id)}>  <i className="ri-eye-line fs-18"></i></Button></td>

                                                    {(role === 'Admin' || role === 'DME') && (
                                                        <td><Link to={`/pages/EmployeeMasterinsert/${item.id}`}>
                                                            <Button variant='primary' className='icon-padding text-white'>
                                                                <i className='fs-18 ri-edit-line text-white' ></i>
                                                            </Button>
                                                        </Link>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={12}>
                                                    <Container className="mt-5">
                                                        <Row className="justify-content-center">
                                                            <Col xs={12} md={8} lg={6}>
                                                                <Alert variant="info" className="text-center">
                                                                    <h4>No Data  Found</h4>
                                                                    <p>You currently don't have any Data</p>
                                                                </Alert>
                                                            </Col>
                                                        </Row>
                                                    </Container>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </DragDropContext>
                        )}
                    </div>
                </>

            )}

            <div className="d-flex justify-content-center align-items-center bg-white w-20 rounded-5 m-auto py-1 pb-1 my-2 pagination-rounded">
                <Pagination >
                    <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                    <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
                    <Pagination.Item active>{currentPage}</Pagination.Item>
                    <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
                    <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
                </Pagination>
            </div>
            <EmployeeBankPopup showView={showView} setShowView={setShowView} id={manageId} />
        </>
    );
};

export default EmployeeMaster;