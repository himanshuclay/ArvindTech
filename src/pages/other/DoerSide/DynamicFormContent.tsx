import config from "@/config";
import axios from "axios";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

interface Input {
    inputId: any;
    type: string;
    label: string;
    formName: string;
    formId: string;
    placeholder: string;
    options?: Option[];
    required: boolean;
    conditionalFieldId?: string;
    value?: any;
    selectedMaster?: string;
    selectedHeader?: string;
}
interface Option {
    id: string;
    label: string;
    color?: string;
}


interface ProcessCanvasProps {
    show: boolean;
    setShow: (show: boolean) => void;
    taskCommonId: number;
}
interface ApiResponse {
    isSuccess: boolean;
    message: string;
    getFilterTasks: any;


}
const DynamicFormContent: React.FC<ProcessCanvasProps> = ({ show, setShow, taskCommonId }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [formData, setFormData] = useState<boolean>(true);


    useEffect(() => {
        if (show && taskCommonId) {
            const fetchProject = async () => {
                await fetchSingleDataById(taskCommonId);
            };
            fetchProject();
        }
    }, [show, taskCommonId]);

    const handleClose = () => {
        setShow(false);
    };


    const fetchSingleDataById = async (taskCommonId: number) => {
        try {
            const response = await axios.get<ApiResponse>(
                `${config.API_URL_ACCOUNT}/ProcessInitiation/GetFilterTask?TaskCommonId=${taskCommonId}&Flag=5}`
            );
            if (response.data && response.data.isSuccess) {
                const singledatabyID = response.data.getFilterTasks;

                if (typeof singledatabyID === 'string') {
                    console.log('fetch single Data:', JSON.parse(singledatabyID));
                    setFormData(JSON.parse(singledatabyID));
                } else {
                    console.error('task_Json is not a valid string:', singledatabyID);
                }
            } else {
                console.error('API Response Error:', response.data?.message || 'Unknown error');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Axios Error Response:', error.response?.data || 'No response data');
                console.error('Axios Error Message:', error.message);
            } else {
                console.error('Unexpected Error:', error);
            }
        } finally {
            setLoading(false);
        }
    };


    console.log(formData)


    return (
        <div>
            {loading ? (
                <div className='loader-container'>
                    <div className="loader"></div>
                    <div className='mt-2'>Please Wait!</div>
                </div>
            ) : (
                <>
                    <Modal size='lg' className="p-3" show={show} placement="end" onHide={handleClose} >
                        <Modal.Header closeButton className=' '>
                            <Modal.Title className='text-dark'>Task Details</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>








                        </Modal.Body>
                    </Modal>

                </>)
            }
        </div>
    );
};

export default DynamicFormContent;
