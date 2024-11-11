import axios from 'axios';
import { useState, useEffect, ChangeEvent } from 'react';
import { Button, Pagination, Table, Container, Row, Col, Alert, Form, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import IconWithLetter from '@/pages/ui/IconWithLetter';
import config from '@/config';
import Select from 'react-select';
import CustomSuccessToast from '@/pages/other/Component/CustomSuccessToast';
import { useLocation, useNavigate } from 'react-router-dom';



interface Requirement {
    id: number;
    entryDate: string;
    enteredBy: string;
    project: string;
    department: string;
    coreDesignation: string;
    specializedDesignation: string;
    source: string;
    count: number;
    typeOfAppointment: string;
    recruiter: string;
    uploadJD: string;
    noOfCandidateIDsInterviewed: number;
    candidateIDsInterviewedWithNames: string;
    finalizedCandidateIDAndName: string;
    deployedCandidateIDAndName: string;
    dateOfJoining: string;
    transferEmployeeIDAndName: string;
    deployedTransferredEmployeeIDAndName: string;
    transferDate: string;
    statusOfEmployeeMasterUpdation: number;
    closureStatus: string;
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

interface DepartmentList {
    id: string;
    departmentName: string;
}
interface ProjectList {
    id: string;
    projectName: string;
}



const RequirementMaster = () => {
    const [requirements, setRequirements] = useState<Requirement[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');


    const [employeeList, setEmployeeList] = useState<EmployeeList[]>([]);
    const [projectList, setProjectList] = useState<ProjectList[]>([]);
    const [departmentList, setDepartmentList] = useState<DepartmentList[]>([]);


    const location = useLocation();
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastVariant, setToastVariant] = useState('');
    useEffect(() => {
        if (location.state && location.state.showToast) {
            setShowToast(true);
            setToastMessage(location.state.toastMessage);
            setToastVariant(location.state.toastVariant);

            setTimeout(() => {
                setShowToast(false);
                navigate(location.pathname, { replace: true });
            }, 5000);
        }
        return () => {
            setShowToast(false);
            setToastMessage('');
            setToastVariant('');
        };
    }, [location.state, navigate]);
    // both are required to make dragable column of table 
    const [columns, setColumns] = useState<Column[]>([
        { id: 'entryDate', label: 'Entry Date', visible: true },
        { id: 'enteredBy', label: 'Entered By', visible: true },
        { id: 'project', label: 'Project', visible: true },
        { id: 'department', label: 'Department', visible: true },
        { id: 'coreDesignation', label: 'Core Designation', visible: true },
        { id: 'specializedDesignation', label: 'Specialized Designation', visible: true },
        { id: 'source', label: 'Source', visible: true },
        { id: 'count', label: 'Count', visible: true },
        { id: 'typeOfAppointment', label: 'Type Of Appointment', visible: true },
        { id: 'recruiter', label: 'Recruiter', visible: true },
        { id: 'uploadJD', label: 'Upload JD', visible: true },
        { id: 'noOfCandidateIDsInterviewed', label: 'No Of Candidate IDs Interviewed', visible: true },
        { id: 'candidateIDsInterviewedWithNames', label: 'Candidate IDs Interviewed With Names', visible: true },
        { id: 'finalizedCandidateIDAndName', label: 'Finalized Candidate ID And Name', visible: true },
        { id: 'deployedCandidateIDAndName', label: 'Deployed Candidate ID And Name', visible: true },
        { id: 'dateOfJoining', label: 'Date Of Joining', visible: true },
        { id: 'transferEmployeeIDAndName', label: 'Transfer Employee ID And Name', visible: true },
        { id: 'deployedTransferredEmployeeIDAndName', label: 'Deployed Transferred Employee ID And Name', visible: true },
        { id: 'transferDate', label: 'Transfer Date', visible: true },
        { id: 'statusOfEmployeeMasterUpdation', label: 'Status Of Employee Master Updation', visible: true },
        { id: 'closureStatus', label: 'Closure Status', visible: true },
    ]);


    const handleOnDragEnd = (result: any) => {
        if (!result.destination) return;
        const reorderedColumns = Array.from(columns);
        const [movedColumn] = reorderedColumns.splice(result.source.index, 1);
        reorderedColumns.splice(result.destination.index, 0, movedColumn);
        setColumns(reorderedColumns);
    };
    // ==============================================================

    useEffect(() => {
        fetchStaffRequirements();
    }, [currentPage]);


    const [searchProject, setSearchProject] = useState('');
    const [searchRecruiterName, setSearchRecruiterName] = useState('');
    const [searchDeptName, setSearchDeptName] = useState('');


    const handleSearch = (e: any) => {
        e.preventDefault();

        let query = `?`;
        if (searchProject) query += `ProjectName=${searchProject}&`;
        if (searchRecruiterName) query += `RecruiterName=${searchRecruiterName}&`;
        if (searchDeptName) query += `Department=${searchDeptName}&`;

        query = query.endsWith('&') ? query.slice(0, -1) : query;
        const apiUrl = `${config.API_URL_APPLICATION}/StaffRequirementMaster/SearchStaffRequirement${query}`;

        console.log(apiUrl)
        axios.get(apiUrl, {
            headers: {
                'accept': '*/*'
            }
        })
            .then((response) => {
                console.log("search response ", response.data.staffRequirement);
                setRequirements(response.data.staffRequirement)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    };

    const fetchStaffRequirements = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/StaffRequirementMaster/GetStaffRequirement`, {
                params: { PageIndex: currentPage }
            });
            if (response.data.isSuccess) {
                setRequirements(response.data.staffRequirements);
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
        fetchData('CommonDropdown/GetDepartment', setDepartmentList, 'getDepartments');
        fetchData('CommonDropdown/GetProjectList', setProjectList, 'projectListResponses');

      
    }, []);







    const handleClear = () => {
        setSearchRecruiterName('');
        setSearchProject('');
        setSearchDeptName('');
        fetchStaffRequirements();
    };


    const convertToCSV = (data: Requirement[]) => {
        const csvRows = [
            ['ID', 'Entry Date',
                'Entered By',
                'Project',
                'Department',
                'Core Designation',
                'Specialized Designation',
                'Source', 'Count', 'Type Of Appointment',
                'Recruiter', 'Upload JD', 'No Of Candidate IDs Interviewed',
                'Candidate IDs Interviewed With Names', 'Finalized Candidate ID And Name',
                'Deployed Candidate ID And Name', 'Date Of Joining',
                'Transfer Employee ID And Name', 'Deployed Transferred Employee ID And Name',
                'Transfer Date', 'Status Of Employee Master Updation',
                'Closure Status', 'Created By', 'Updated By'],
            ...data.map(doer => [
                doer.id,
                doer.entryDate,
                doer.enteredBy,
                doer.project,
                doer.department,
                doer.coreDesignation,
                doer.specializedDesignation,
                doer.source,
                doer.count,
                doer.typeOfAppointment,
                doer.recruiter,
                doer.uploadJD,
                doer.noOfCandidateIDsInterviewed,
                doer.candidateIDsInterviewedWithNames,
                doer.finalizedCandidateIDAndName,
                doer.deployedCandidateIDAndName,
                doer.dateOfJoining,
                doer.transferEmployeeIDAndName,
                doer.deployedTransferredEmployeeIDAndName,
                doer.transferDate,
                doer.statusOfEmployeeMasterUpdation,
                doer.closureStatus,
                doer.createdBy,
                doer.updatedBy
            ])
        ];
        return csvRows.map(row => row.join(',')).join('\n');
    };


    const downloadCSV = () => {
        const csvData = convertToCSV(requirements);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'Doers.csv');
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

    const filteredRequirements = requirements.filter(requirement =>
        requirement.entryDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        requirement.enteredBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        requirement.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
        requirement.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        requirement.coreDesignation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        requirement.specializedDesignation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        requirement.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
        requirement.recruiter.toLowerCase().includes(searchQuery.toLowerCase()) ||
        requirement.candidateIDsInterviewedWithNames.toLowerCase().includes(searchQuery.toLowerCase()) ||
        requirement.finalizedCandidateIDAndName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        requirement.deployedCandidateIDAndName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        requirement.transferEmployeeIDAndName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        requirement.deployedTransferredEmployeeIDAndName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        requirement.closureStatus.toLowerCase().includes(searchQuery.toLowerCase()) 
    );
    
    return (
        <>
            <div className="container">
                <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center">
                    <span><i className="ri-file-list-line me-2 text-dark fs-16"></i><span className='fw-bold text-dark fs-15'>Staff Requirement List</span></span>
                    <div className="d-flex justify-content-end  ">

                        <Link to='/pages/RequirementMasterinsert'>
                            <Button variant="primary" className="me-2">
                                Add Requirement
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
                                   
                                    <Col lg={4}>
                                        <Form.Group controlId="searchProject">
                                            <Form.Label>Project Name</Form.Label>
                                            <Select
                                                name="searchProject"
                                                value={projectList.find(role => role.projectName === searchProject) || null} // handle null
                                                onChange={(selectedOption) => setSearchProject(selectedOption ? selectedOption.projectName : "")} // null check
                                                options={projectList}
                                                getOptionLabel={(role) => role.projectName}
                                                getOptionValue={(role) => role.projectName}
                                                isSearchable={true}
                                                placeholder="Search..."
                                                className="h45"
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col lg={4}>
                                        <Form.Group controlId="searchRecruiterName">
                                            <Form.Label>Recruiter Name</Form.Label>
                                            <Select
                                                name="searchRecruiterName"
                                                value={employeeList.find(emp => emp.employeeName === searchRecruiterName) || null} // handle null
                                                onChange={(selectedOption) => setSearchRecruiterName(selectedOption ? selectedOption.employeeName : "")} // null check
                                                options={employeeList}
                                                getOptionLabel={(emp) => emp.employeeName}
                                                getOptionValue={(emp) => emp.employeeName}
                                                isSearchable={true}
                                                placeholder="Search..."
                                                className="h45"
                                            />
                                        </Form.Group>
                                    </Col>


                                    <Col lg={4}>
                                        <Form.Group controlId="searchDeptName">
                                            <Form.Label>Deparment Name</Form.Label>
                                            <Select
                                                name="searchDeptName"
                                                value={departmentList.find(task => task.departmentName === searchDeptName) || null} 
                                                onChange={(selectedOption) => setSearchDeptName(selectedOption ? selectedOption.departmentName : "")} 
                                                options={departmentList}
                                                getOptionLabel={(task) => task.departmentName}
                                                getOptionValue={(task) => task.departmentName}
                                                isSearchable={true}
                                                placeholder="Select Deparment Name"
                                                className="h45"
                                            />
                                        </Form.Group>
                                    </Col>


                                    <Col lg={4} className="mt-2"></Col>
                                    <Col lg={4} className="mt-2"></Col>

                                    <Col lg={4} className="align-items-end d-flex justify-content-end mt-2">
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

                        <div className="overflow-auto text-nowrap">
                            {!filteredRequirements ? (
                                <Container className="mt-5">
                                    <Row className="justify-content-center">
                                        <Col xs={12} md={8} lg={6}>
                                            <Alert variant="info" className="text-center">
                                                <h4>No Task Found</h4>
                                                <p>You currently don't have Completed tasks</p>
                                            </Alert>
                                        </Col>
                                    </Row>
                                </Container>
                            ) : (
                                <DragDropContext onDragEnd={handleOnDragEnd}>
                                    <Table hover className='bg-white '>
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
                                                                            {column.id === 'entryDate' && (<i className="ri-calendar-line"></i>)}
                                                                            {column.id === 'project' && (<i className="ri-building-line"></i>)}
                                                                            {column.id === 'department' && (<i className="ri-group-fill"></i>)}
                                                                            {column.id === 'coreDesignation' && (<i className="ri-briefcase-fill"></i>)}
                                                                            {column.id === 'specializedDesignation' && (<i className="ri-award-fill"></i>)}
                                                                            {column.id === 'source' && (<i className="ri-database-line"></i>)}
                                                                            {column.id === 'typeOfAppointment' && (<i className="ri-handshake-line"></i>)}
                                                                            {column.id === 'recruiter' && (<i className="ri-user-search-line"></i>)}
                                                                            {column.id === 'uploadJD' && (<i className="ri-file-upload-line"></i>)}
                                                                            {column.id === 'noOfCandidateIDsInterviewed' && (<i className="ri-user-follow-fill"></i>)}
                                                                            {column.id === 'candidateIDsInterviewedWithNames' && (<i className="ri-team-fill"></i>)}
                                                                            {column.id === 'finalizedCandidateIDAndName' && (<i className="ri-check-fill"></i>)}
                                                                            {column.id === 'deployedCandidateIDAndName' && (<i className="ri-user-location-fill"></i>)}
                                                                            {column.id === 'dateOfJoining' && (<i className="ri-calendar-check-fill"></i>)}
                                                                            {column.id === 'transferEmployeeIDAndName' && (<i className="ri-user-transfer-fill"></i>)}
                                                                            {column.id === 'deployedTransferredEmployeeIDAndName' && (<i className="ri-user-location-fill"></i>)}
                                                                            {column.id === 'transferDate' && (<i className="ri-calendar-event-fill"></i>)}
                                                                            {column.id === 'statusOfEmployeeMasterUpdation' && (<i className="ri-pencil-fill"></i>)}
                                                                            {column.id === 'closureStatus' && (<i className="ri-lock-fill"></i>)}
                                                                            &nbsp; {column.label}
                                                                        </div>
                                                                    </th>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                        {provided.placeholder}
                                                        <th>Action</th>
                                                    </tr>
                                                )}
                                            </Droppable>
                                        </thead>
                                        <tbody>
                                            {filteredRequirements.length > 0 ? (
                                                filteredRequirements.slice(0, 10).map((item, index) => (
                                                    <tr key={item.id}>
                                                        <td>{(currentPage - 1) * 10 + index + 1}</td>
                                                        {columns.filter(col => col.visible).map((col) => (
                                                            <td key={col.id}
                                                                className={
                                                                    // Add class based on column id
                                                                    col.id === 'empID' ? 'fw-bold fs-13 text-dark' :
                                                                        col.id === 'taskID' ? 'fw-bold fs-13 text-dark' :
                                                                            col.id === 'project' ? 'fw-bold fs-13 text-dark' :
                                                                                // Add class based on value (e.g., expired tasks)
                                                                                // (col.id === 'taskID' && item[col.id] === 'ACC.01.T1') ? 'task1' :
                                                                                ''
                                                                }
                                                            >
                                                                <div>
                                                                    {col.id === 'enteredBy' ? (
                                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                            <IconWithLetter letter={item.enteredBy.charAt(0)} />
                                                                            {item.enteredBy.split('_')[0]}
                                                                        </div>
                                                                    ) : col.id === 'recruiter' ? (
                                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                            <IconWithLetter letter={item.recruiter.charAt(0)} />
                                                                            {item.recruiter.split('_')[0]}
                                                                        </div>
                                                                    ) : col.id === 'entryDate' || col.id === 'dateOfJoining' || col.id === 'transferDate' ? (
                                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                            {col.id === 'entryDate' ? item.entryDate.split(' ')[0] : col.id === 'dateOfJoining' ? item.dateOfJoining.split(' ')[0] : item.transferDate.split(' ')[0]}
                                                                        </div>
                                                                    ) : (
                                                                        <>
                                                                            {item[col.id as keyof Requirement]}
                                                                        </>
                                                                    )}


                                                                </div>
                                                            </td>
                                                        ))}

                                                        <td><Link to={`/pages/RequirementMasterinsert/${item.id}`}>
                                                            <Button variant='primary' className='p-0 text-white'>
                                                                <i className='btn ri-edit-line text-white' ></i>
                                                            </Button>
                                                        </Link>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={12}><Container className="mt-5">
                                                        <Row className="justify-content-center">
                                                            <Col xs={12} md={8} lg={6}>
                                                                <Alert variant="info" className="text-center">
                                                                    <h4>No Data Found</h4>
                                                                    <p>You currently don't have any Data</p>
                                                                </Alert>
                                                            </Col>
                                                        </Row>
                                                    </Container></td>
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


            </div >
            <CustomSuccessToast
                show={showToast}
                toastMessage={toastMessage}
                toastVariant={toastVariant}
                onClose={() => setShowToast(false)}
            />
        </>
    );
};

export default RequirementMaster;