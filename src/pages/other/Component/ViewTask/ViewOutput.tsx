import { Alert, Modal } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import config from '@/config';
import axios from 'axios';
import Editor from '@/pages/FormBuilder/Editor';
import { PROPERTY } from '@/pages/FormBuilder/Constant/Interface';

interface ProcessCanvasProps {
    showViewOutput: boolean;
    setShowViewOutput: (show: boolean) => void;
    preData: any;
    editOutput?: any;
}

const ViewOutput: React.FC<ProcessCanvasProps> = ({ showViewOutput, setShowViewOutput, preData, editOutput }) => {
    const [formandBlockValue, setFormandBlockValue] = useState<any[]>([]);

    const fetchData = async () => {
        try {
            const response = await axios.get(
                `${config.API_URL_ACCOUNT}/ProcessInitiation/GetFormandBlockValue?ID=${editOutput}`
            );
            if (response.data.isSuccess) {
                setFormandBlockValue(JSON.parse(response.data.formandBlockValue));
            } else {
                setFormandBlockValue([]);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        if (editOutput) {
            fetchData();
        }
    }, [editOutput]);

    const handleClose = () => {
        setShowViewOutput(false);
    };

    const [property, setProperty] = useState<PROPERTY>({
        label: '',
        id: '',
        placeholder: '',
        value: '',
        required: "false",
        type: '',
        options: [{ label: '', value: '' }],
        advance: {
            backgroundColor: '',
            color: '',
        },
        isShow: false,
        disabled: 'false',
    });

    return (
        <Modal size="xl" show={showViewOutput} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title className="text-dark">Tasks Output</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {formandBlockValue.length > 0 ? (
                    formandBlockValue.map((completeNode: any, index: number) => (
                        <div key={index} className="mb-4">
                            {completeNode?.form?.blocks?.length > 0 ? (
                                <Editor
                                    form={completeNode.form}
                                    setForm={() => { }} // Add actual setter if needed
                                    property={property}
                                    setProperty={setProperty}
                                    blockValue={completeNode.blockValue}
                                    setBlockValue={() => { }} // Add actual setter if needed
                                    isShowSave={false}
                                    isPreview={true}
                                />
                            ) : (
                                <Alert variant="warning">No form blocks to display for task #{index + 1}.</Alert>
                            )}
                        </div>
                    ))
                ) : (
                    <Alert variant="info">No output found for this task.</Alert>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default ViewOutput;
