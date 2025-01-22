import { Form, Button, Modal, Row, Col, ButtonGroup } from "react-bootstrap";
import { useEffect, useState } from "react";
import Select from 'react-select';
import { toast } from "react-toastify";

interface ProcessCanvasProps {
    showView: boolean;
    setShowView: (show: boolean) => void;
    id: any;

}

interface AssignProjecttoProcess {
    id: number;
    moduleName: string;
    processId: string;
    type: string;
    projects: Array<{
        projectID: string;
        projectName: string;
    }>;
    createdBy: string;
    updatedBy: string;
}


const PushNotification: React.FC<ProcessCanvasProps> = ({ showView, setShowView, id }) => {
    const role = localStorage.getItem('role');

    const [empName, setEmpName] = useState<string | null>('');
    const [activeButton, setActiveButton] = useState('project');
    const [assignProject, setAssignProject] = useState<AssignProjecttoProcess>({
        id: 0,
        moduleName: '',
        processId: '',
        type: '',
        projects: [],
        createdBy: '',
        updatedBy: empName || '',
    });


    useEffect(() => {
        toast.dismiss();

        const storedEmpName = localStorage.getItem('EmpName');
        const storedEmpID = localStorage.getItem('EmpId');
        if (storedEmpName || storedEmpID) {
            setEmpName(`${storedEmpName} - ${storedEmpID}`);
        }
    }, []);


    const handleClose = () => {
        setShowView(false);
    };


    const handleButtonClick = (buttonName: string) => {
        setActiveButton(buttonName);

        setAssignProject({
            id: 0,
            moduleName: assignProject.moduleName,
            processId: assignProject.processId,
            type: activeButton,
            projects: [],
            createdBy: '',
            updatedBy: empName || '',
        });
    };

    const optionsAppAccesLevel = [
        { value: 'Admin', label: 'Admin' },
        { value: 'DME', label: 'DME' },
        { value: 'ProcessCoordinator', label: 'ProcessCoordinator' },
        { value: 'Management', label: 'Management' },
        { value: 'Employee', label: 'Employee' },
    ];


    return (
        <div>
            <Modal className="p-2" show={showView} placement="end" onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title className="text-dark">Publish Notification</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {role === 'Admin' && (
                        <>
                            <Col lg={6} className='align-items-end d-flex justify-content-end' >
                                <ButtonGroup aria-label="Basic example" className='w-100'>
                                    <Button type="button"
                                        variant={activeButton === 'project' ? 'primary' : 'outline-primary'}
                                        onClick={() => handleButtonClick('project')}
                                    // disabled={assignedProject[0]?.type === 'subProject'}
                                    >
                                        Group Level
                                    </Button>
                                    <Button type="button"
                                        variant={activeButton === 'subProject' ? 'primary' : 'outline-primary'}
                                        onClick={() => handleButtonClick('subProject')}
                                    // disabled={assignedProject[0]?.type === 'project'}
                                    >Employee level</Button>
                                </ButtonGroup>
                            </Col>


                            <Form >
                                <Row>
                                    {activeButton === 'project' && (
                                        <Col lg={12}>
                                            <Form.Group controlId="status" className="mb-3 mt-2">
                                                <Form.Label>Group Wise</Form.Label>
                                                <Select
                                                    name="status"
                                                    options={optionsAppAccesLevel}
                                                    // value={optionsAppAccess.find(option => option.value === departments.status)}
                                                    // onChange={selectedOption => handleChange(null, 'status', selectedOption?.value)}
                                                    placeholder="Select Status"
                                                />

                                            </Form.Group>
                                        </Col>
                                    )}
                                    {activeButton === 'subProject' && (
                                        <Col lg={12}>
                                            <Form.Group controlId="Employee" className="mb-3 mt-2">
                                                <Form.Label>Employee</Form.Label>
                                                <Select
                                                    name="Employee"
                                                    // value={subProjectList.filter(subProject =>
                                                    //     assignProject.projects.some(ap => ap.projectID === subProject.id)
                                                    // )}

                                                    // onChange={(selectedOptions) => {
                                                    //     const selectedSubProjects = (selectedOptions || []) as SubProject[];
                                                    //     const newSubProjectArray = selectedSubProjects.map(subProject => ({
                                                    //         projectID: subProject.id,
                                                    //         projectName: subProject.name,
                                                    //     }));

                                                    //     setAssignProject({
                                                    //         ...assignProject,
                                                    //         projects: newSubProjectArray,
                                                    //     });
                                                    // }}
                                                    // getOptionLabel={(subProject) => subProject.name}
                                                    // getOptionValue={(subProject) => subProject.id}
                                                    // options={subProjectList}
                                                    isSearchable={true}
                                                    isMulti={true}
                                                    placeholder="Select Employee"
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    )}
                                </Row>


                                <Button variant="primary" type="submit" className="mt-2">
                                    Submit
                                </Button>
                            </Form>
                        </>
                    )}

                </Modal.Body>
            </Modal>
        </div>
    );
};

export default PushNotification;
