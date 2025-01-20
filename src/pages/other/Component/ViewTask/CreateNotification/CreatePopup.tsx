// import { Form, Button, Modal, Row, Col, ButtonGroup, Container, Alert } from "react-bootstrap";
// import axios from "axios";
// import config from "@/config";
// import { useEffect, useState } from "react";
// import Select from 'react-select';
// import { toast } from "react-toastify";

// interface ProcessCanvasProps {
//     show: boolean;
//     setShow: (show: boolean) => void;
// }

// interface AssignProjecttoProcess {
//     id: number;
//     moduleName: string;
//     processId: string;
//     type: string;
//     projects: Array<{
//         projectID: string;
//         projectName: string;
//     }>;
//     createdBy: string;
//     updatedBy: string;
// }


// const CreatePopup: React.FC<ProcessCanvasProps> = ({ show, setShow }) => {

//     const [empName, setEmpName] = useState<string | null>('');
//     const [notification, setNotification] = useState<AssignProjecttoProcess>({
//         id: 0,
//         moduleName: '',
//         processId: '',
//         type: '',
//         projects: [],
//         createdBy: '',
//         updatedBy: empName || '',
//     });



//     useEffect(() => {
//         toast.dismiss();

//         const storedEmpName = localStorage.getItem('EmpName');
//         const storedEmpID = localStorage.getItem('EmpId');
//         if (storedEmpName || storedEmpID) {
//             setEmpName(`${storedEmpName} - ${storedEmpID}`);
//         }
//     }, []);

//     useEffect(() => {
//         // const fetchData = async () => {

//         // };
//         // fetchData();


//     }, [show]);



//     // useEffect(() => {
//     //     const fetchData = async (endpoint: string, setter: Function, listName: string) => {
//     //         try {
//     //             const response = await axios.get(`${config.API_URL_APPLICATION}/${endpoint}`);
//     //             if (response.data.isSuccess) {
//     //                 setter(response.data[listName]);
//     //             } else {
//     //                 console.error(response.data.message);
//     //             }
//     //         } catch (error) {
//     //             console.error(`Error fetching data from ${endpoint}:`, error);
//     //         }
//     //     };
//     //     fetchData('CommonDropdown/GetProjectList', setProjectList, 'projectListResponses');
//     //     fetchData('CommonDropdown/GetSubProjectList', setSubProjectList, 'subProjectLists');
//     // }, []);




//     // const fetchProcessByid = async (id: string) => {
//     //     setLoading(true);
//     //     try {
//     //         const response = await axios.get(`${config.API_URL_APPLICATION}/ProcessMaster/GetProcess`, {
//     //             params: { id: id }
//     //         });
//     //         if (response.data.isSuccess) {
//     //             const fetchedModule = response.data.processMasterList[0];
//     //             setProcess(fetchedModule);
//     //         } else {
//     //             console.error(response.data.message);
//     //         }
//     //     } catch (error) {
//     //         console.error('Error fetching module:', error);
//     //     }
//     //     finally {
//     //         setLoading(false);
//     //     }
//     // };


//     const handleClose = () => {
//         setShow(false);
//     };




//     // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     //     e.preventDefault();

//     //     const payload = {
//     //         ...assignProject,
//     //         type: activeButton,
//     //     };
//     //     console.log("Initial Payload:", payload);

//     //     try {
//     //         const apiUrl = `${config.API_URL_APPLICATION}/AssignProjecttoProcess/AssignProjecttoProcess`;
//     //         const response = await axios.post(apiUrl, payload);

//     //         if (response.data.isSuccess) {
//     //             toast.dismiss();
//     //             toast.success("Project assigned successfully!");


//     //         } else {
//     //             toast.dismiss();
//     //             toast.error(response.data.message || "Failed to assign project.");
//     //         }
//     //     } catch (error: any) {
//     //         toast.error(error.response?.data?.message || "An error occurred.");
//     //         console.error("Error in handleSubmit:", error);
//     //     }
//     // };




//     return (
//         <div>
//             <Modal className="p-2" show={show} placement="end" onHide={handleClose} size="lg">
//                 <Modal.Header closeButton>
//                     <Modal.Title className="text-dark">Assign Project to Process</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>



//                 </Modal.Body>
//             </Modal>
//         </div>
//     );
// };

// export default CreatePopup;
