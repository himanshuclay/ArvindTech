import axios from 'axios';
import { useState, useEffect, ChangeEvent } from 'react';
import { Button, Pagination, Table, Container, Row, Col, Alert, Form, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import config from '@/config';
import EmployeeBankPopup from './EmployeeBankPopup';
import Select from 'react-select';
import IconWithLetter from '@/pages/ui/IconWithLetter';
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
    const [employee, setEmployee] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [showView, setShowView] = useState(false);
    const [manageId, setManageID] = useState<number>();
    const [employeeList, setEmployeeList] = useState<EmployeeList[]>([]);
    const [downloadCsv, setDownloadCsv] = useState<Employee[]>([]);
    const [projectList, setProjectList] = useState<ModuleProjectList[]>([])


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
        { id: 'currentProjectName', label: 'Current Project Name', visible: true },
        { id: 'dataAccessLevel', label: 'Data Access Level', visible: true },
        { id: 'appAccessLevel', label: 'App Access Level', visible: true },
        { id: 'appAccess', label: 'App Access', visible: true },
        { id: 'empStatus', label: 'Employee Status', visible: true },
        { id: 'isRegistered', label: 'Is Registered', visible: true },
        { id: 'registrationDate', label: 'Registration Date', visible: true },
        { id: 'daL_Module', label: 'DAL Module', visible: true },
        { id: 'daL_Project', label: 'DAL Project', visible: true },
        { id: 'designation', label: 'Designation', visible: true },
        { id: 'dateOfJoining', label: 'Date Of Joining', visible: true },
        { id: 'dateOfLeaving', label: 'Date Of Leaving', visible: true },

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
        fetchEmployee();
        fetchRolesCsv();
    }, [currentPage]);

    const handleSearch = (e: any) => {
        e.preventDefault();

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

        console.log(apiUrl)
        axios.get(apiUrl, {
            headers: {
                'accept': '*/*'
            }
        })
            .then((response) => {
                console.log("search response ", response.data.employeeMasterList);
                setEmployee(response.data.employeeMasterList)
                setTotalPages(Math.ceil(response.data.totalCount / 10));
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    };

    const handleClear = () => {
        setSearchEmployee('');
        setSearchProject('');
        setSearchAppAccessLevel('');
        setSearchDataAccessLevel('');
        setSearchAppAccess('');
        setSearchEmpstatus('');
        fetchEmployee();
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

    }, []);


    const fetchRolesCsv = async () => {
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/EmployeeMaster/GetEmployee`);
            if (response.data.isSuccess) {
                setDownloadCsv(response.data.employeeMasterList);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching doers:', error);
        }

    };

    const convertToCSV = (data: Employee[]) => {
        const csvRows = [
            [
                'ID',
                'Employee ID', 'Employee Name',
                'Father Name', 'Email',
             'Data Access Level',
                'Employee Status', 'HR Updated Mobile No',
                'User Updated Mobile No', 'State',
                'District', 'Area', 'Pin', 'Address',
                'Photo', 'Gender', 'Date of Birth',
                'Date of Joining', 'Date of Leaving',
                'Department Name', 'Designation',
                'App Exempt', 'Is Performance Review',
                'App Access Level', 'App Access',
                'Current Project Name', 'Salary Bank Account Type',
                'Salary Bank Account Number', 'Salary Bank Name',
                'Salary Bank IFSC', 'Salary Branch Name',
                'Reimbursement Bank Account Type',
                'Reimbursement Bank Account Number',
                'Reimbursement Bank Name', 'Reimbursement Bank IFSC',
                'Reimbursement Branch Name', 'Expense Bank Account Type',
                'Expense Bank Account Number', 'Expense Bank Name',
                'Expense Bank IFSC', 'Expense Branch Name',
                'Excel DOB Value', 'Excel DOJ Value',
                'Excel DOL Value', 'Is Registered', 'DAL Module', 'DAL Project',
                'Registration Date', 'Created By', 'Updated By'
            ],
            ...data.map(employee => [
                employee.id,
                employee.empID,
                employee.employeeName,
                employee.fatherName,
                employee.email,
                employee.dataAccessLevel,
                employee.empStatus,
                employee.hrUpdatedMobileNo,
                employee.userUpdatedMobileNo,
                employee.state,
                employee.district,
                employee.area,
                employee.pin,
                employee.address,
                employee.photo,
                employee.gender,
                employee.dateOfBirth,
                employee.dateOfJoining,
                employee.dateOfLeaving,
                employee.departmentName,
                employee.designation,
                employee.appExempt,
                employee.isPerformanceReview,
                employee.appAccessLevel,
                employee.appAccess,
                employee.currentProjectName,
                employee.salaryBankAccountType,
                employee.salaryBankAccountNumber,
                employee.salaryBankName,
                employee.salaryBankIfsc,
                employee.salaryBranchName,
                employee.reimbursementBankAccountType,
                employee.reimbursementBankAccountNumber,
                employee.reimbursementBankName,
                employee.reimbursementBankIfsc,
                employee.reimbursementBranchName,
                employee.expenseBankAccountType,
                employee.expenseBankAccountNumber,
                employee.expenseBankName,
                employee.expenseBankIfsc,
                employee.expenseBranchName,
                employee.excelDobValue,
                employee.excelDojValue,
                employee.excelDolValue,
                employee.isRegistered,
                employee.daL_Module,
                employee.daL_Project,
                employee.registrationDate,
                employee.createdBy,
                employee.updatedBy
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

    const handleSearchcurrent = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };



    
    const filteredEmployees = employee.filter(item =>
        item.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.empID.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.empStatus.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.hrUpdatedMobileNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.userUpdatedMobileNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.departmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.currentProjectName.toLowerCase().includes(searchQuery.toLowerCase()) 
    );
    

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
        { value: 'Formar', label: 'Formar' },
        { value: 'Absconding', label: 'Absconding' },
    ];

    const optionsAppAccesLevel = [
        { value: 'Admin', label: 'Admin' },
        { value: 'Employee', label: 'Employee' },
        { value: 'Management', label: 'Management' },
        { value: 'PC', label: 'PC' },
        { value: 'DME', label: 'DME' },
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
            <div className="container">
                <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center">
                    <span><i className="ri-file-list-line me-2 text-dark fs-16"></i><span className='fw-bold text-dark fs-15'>Employee List</span></span>
                    <div className="d-flex justify-content-end  ">

                        <Link to='/pages/EmployeeMasterinsert'>
                            <Button variant="primary" className="me-2">
                                Add Employee
                            </Button>
                        </Link>
                    </div>
                </div>


                {loading ? (
                    <div className='loader-container'>
                        <div className="loader"></div>
                        <div className='mt-2'>Please Wait!</div>
                    </div>
                ) : (
                    <>
                        <div className='bg-white p-2 pb-2'>
                            <Form onSubmit={handleSearch}>
                                <Row>


                                    <Col lg={4} className="mt-2">
                                        <Form.Group controlId="searchEmployee">
                                            <Form.Label>Employee Name:</Form.Label>
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
                                                placeholder="Select App Access"
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
                                                placeholder="Select App Access"
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
                                            <Button type="submit" variant="primary">
                                                Search
                                            </Button>
                                        </ButtonGroup>
                                    </Col>
                                </Row>
                            </Form>

                            <Row className='mt-3'>
                                <div className="d-flex justify-content-end bg-light p-1">
                                    <div className="app-search d-none d-lg-block me-4">
                                        <form>
                                            <div className="input-group px300 ">
                                                <input
                                                    type="search"
                                                    className=" bg-white"
                                                    placeholder="Search..."
                                                    value={searchQuery}
                                                    onChange={handleSearchcurrent}
                                                />
                                                <span className="ri-search-line search-icon text-muted" />
                                            </div>
                                        </form>
                                    </div>

                                    <Button variant="primary" onClick={downloadCSV} className="">
                                        Download CSV
                                    </Button>
                                </div>
                            </Row>
                        </div>
                        <div className="overflow-auto text-nowrap ">
                            {!filteredEmployees ? (
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
                                                        <th>Action</th>
                                                    </tr>
                                                )}
                                            </Droppable>
                                        </thead>
                                        <tbody>
                                            {filteredEmployees.length > 0 ? (
                                                filteredEmployees.slice(0, 10).map((item, index) => (
                                                    <tr key={item.id}>
                                                        <td>{(currentPage - 1) * 10 + index + 1}</td>
                                                        {columns.filter(col => col.visible).map((col) => (
                                                            <td key={col.id}
                                                                className={
                                                                    col.id === 'employeeName' ? 'fw-bold fs-13 text-dark' : ''
                                                                }
                                                            >
                                                                {col.id === 'daL_Project' ? (
                                                                    <td>
                                                                        {item.daL_Project.split(",")
                                                                            .map((incharge: any, index: any) => (
                                                                                <div key={index}>{incharge.trim()} 
                                                                                </div>// Display each on a new line
                                                                            ))}
                                                                    </td>
                                                                ) : col.id === 'employeeName' ? (
                                                                    <td>
                                                                        <div className='d-flex align-items-center'>
                                                                            <IconWithLetter letter={item.employeeName.charAt(0)} />
                                                                            {item.employeeName.split('_')[0]}
                                                                        </div>
                                                                        {item.userUpdatedMobileNo ?
                                                                            <p className='phone_user fw-normal m-0'><a href={`tel:${item.userUpdatedMobileNo}`}> <i className="ri-phone-fill"></i> {item.userUpdatedMobileNo}</a></p> : ""
                                                                        }
                                                                    </td>
                                                                ) : (<>{item[col.id as keyof Employee]}</>
                                                                )}
                                                            </td>
                                                        ))}
                                                        {/* Action Button */}
                                                        <td><Button variant='primary' className='text-white icon-padding' onClick={() => handleViewEdit(item.id)}>  <i className="ri-eye-line fs-18"></i></Button></td>
                                                        <td><Link to={`/pages/EmployeeMasterinsert/${item.id}`}>
                                                            <Button variant='primary' className='icon-padding text-white'>
                                                                <i className='fs-18 ri-edit-line text-white' ></i>
                                                            </Button>
                                                        </Link>
                                                        </td>
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
            </div>
        </>
    );
};

export default EmployeeMaster;