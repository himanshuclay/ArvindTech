import { Offcanvas } from "react-bootstrap"
import axios from "axios";
import config from "@/config";
import { useEffect, useState } from "react";

interface Process {
    id: number;
    moduleName: string;
    processID: string;
    processDisplayName: string;
    misExempt: string;
    processObjective: string;
    processFlowchart: string;
    processOwnerID: string;
    processOwnerName: string;
    intervalType: string;
    day: string;
    time: string;
    periodFrom: string;
    periodTo: string;
    createdBy: string;
    updatedBy: string;
}


interface ProcessCanvasProps {
    show: boolean;
    setShow: any;
    manageId: any
}

const ProcessCanvas: React.FC<ProcessCanvasProps> = ({ show, setShow, manageId }) => {


    const [process, setProcess] = useState<Process>({
        id: 0,
        moduleName: '',
        processID: '',
        processDisplayName: '',
        misExempt: '',
        processObjective: '',
        processFlowchart: '',
        processOwnerID: '',
        processOwnerName: '',
        intervalType: '',
        day: '',
        time: '',
        periodFrom: '',
        periodTo: '',
        createdBy: '',
        updatedBy: ''
    });
    const [project, setProject] = useState<Process>({});
    const [moduleName, setModuleName] = useState<Process>({});
    const [processId, setProcessId] = useState<Process>({});

    useEffect(() => {
        fetchModuleById(manageId);
    }, [manageId])


    const fetchModuleById = async (id: string) => {
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/ProcessMaster/GetProcess`, {
                params: { id: id }
            });
            if (response.data.isSuccess) {
                const fetchedModule = response.data.processMasterList[0];
                setProcess(fetchedModule);
                setProcessId(fetchedModule.proceesID)
                setModuleName(fetchedModule.moduleName)
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching module:', error);
        }
    };

    useEffect(() => {
        const fetchGetProject = async ({moduleName ,processId}) => {
            try {
                const response = await axios.get(`${config.API_URL_APPLICATION}/AssignProjecttoProcess/GetProjectAssignListbyIDs?ModuleName=Accounts&ProcessId=Acc.01`, {
                    params: {
                        ModuleName: moduleName,
                        ProcessId: processId,
                    }
                });
                if (response.data.isSuccess) {
                    const fetchedModule = response.data.getProjectAssignListbyIDs[0];
                    setProject(fetchedModule);
                } else {
                    console.error(response.data.message);
                }
            } catch (error) {
                console.error('Error fetching module:', error);
            }
        };

        fetchGetProject({moduleName, processId});
    }, [process])




    const handleClose = () => {
        setShow(false);
    };


    return (
        <div>


            <Offcanvas className="p-3" show={show} placement="end" onHide={handleClose} >
                <Offcanvas.Header closeButton className=' '>
                    <Offcanvas.Title className='text-dark'>Task Details</Offcanvas.Title>
                </Offcanvas.Header>
                {manageId}
                <br />
                {project.projectID}
                <br />
                {project.projectName}






            </Offcanvas>
        </div>
    )
}

export default ProcessCanvas