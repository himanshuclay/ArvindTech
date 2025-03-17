import { Form, Button, Modal, Col, ButtonGroup } from "react-bootstrap";
import axios from "axios";
import config from "@/config";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import ReactQuill from 'react-quill'

import 'react-quill/dist/quill.snow.css'

interface ProcessCanvasProps {
    show: boolean;
    setShow: (show: boolean) => void;
    onSuccess?: () => void;
    editData?: Designation | null; // Use meaningful names
}



interface Designation {
    id: number;
    subject: string;
    content: string;
    attachment: string;
    doerIDs: string[];
    roleNames: string[];
    createdBy: string;
    updatedBy: string;
}

const CreatePopup: React.FC<ProcessCanvasProps> = ({
    show,
    setShow,
    onSuccess,
    editData,
}) => {
    const [empName, setEmpName] = useState<string>('');
    const [wordCount, setWordCount] = useState(0);
    const [notification, setNotification] = useState<Designation>({
        id: 0,
        subject: '',
        content: '',
        attachment: '',
        doerIDs: [],
        roleNames: [],
        createdBy: '',
        updatedBy: '',
    });

    console.log(notification.subject)
    const modules = {
        toolbar: [
            [{ font: [] }, { size: [] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ color: [] }, { background: [] }],
            [{ script: 'super' }, { script: 'sub' }],
            [{ header: [false, 1, 2, 3, 4, 5, 6] }, 'blockquote', 'code-block'],
            [
                { list: 'ordered' },
                { list: 'bullet' },
                { indent: '-1' },
                { indent: '+1' },
            ],
            ['direction', { align: [] }],
            ['link', 'image', 'video'],
            ['clean'],
        ],
    };
    // 1. Get Employee name/ID on mount
    useEffect(() => {
        const storedEmpName = localStorage.getItem('EmpName');
        const storedEmpID = localStorage.getItem('EmpId');
        const fullEmpName = `${storedEmpName || ''} - ${storedEmpID || ''}`.trim();
        setEmpName(fullEmpName);
    }, []);

    useEffect(() => {
        if (!editData) {
            setNotification((prev) => ({
                ...prev,
                createdBy: empName,
                updatedBy: empName,
            }));
        }
    }, [empName]);

    useEffect(() => {
        if (editData) {
            setNotification({
                ...editData,
                updatedBy: empName,
            });

            const plainText = editData.content.replace(/<[^>]+>/g, '');
            const wordLength = plainText.trim().length;

            setWordCount(wordLength);
        }
    }, [editData]);


    const handleChange = (e: ChangeEvent<any> | null, name?: string, value?: any) => {
        if (e) {
            const { name: eventName, type, value: inputValue } = e.target;

            if (type === 'textarea' || type === 'text') {
                const charLimit = 500;
                if (inputValue.length <= charLimit) {
                    setNotification({
                        ...notification,
                        [eventName]: inputValue,
                    });
                    setWordCount(inputValue.length);
                }
            }
        } else if (name === 'content') {
            setNotification({
                ...notification,
                [name]: value,
            });

            const plainText = value.replace(/<[^>]+>/g, '');
            const wordLength = plainText.trim().length; // or use word count instead
            setWordCount(wordLength);
        } else if (name) {
            setNotification({
                ...notification,
                [name]: value,
            });
        }
    };



    // 4. Modal close handler
    const handleClose = () => {
        setShow(false);
    };

    // 5. Submit handler
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const payload = {
                id: notification.id,
                subject: notification.subject,
                content: notification.content,
                attachment: notification.attachment || '', // handle if you implement file uploads later
                getDoerDetails: notification.doerIDs.map((id) => ({
                    doerID: id,
                    isRead: 0,
                    readAt: '',
                })),
                roleNames: notification.roleNames,
                createdBy: notification.createdBy || empName || '',
                updatedBy: notification.updatedBy || empName || '',
            };

            console.log('Notification Payload:', payload);

            const apiUrl = `${config.API_URL_APPLICATION}/Notificationmaster/InsertorUpdateNotification`;
            const response = await axios.post(apiUrl, payload);

            if (response.data.isSuccess) {
                toast.success(notification.id > 0 ? 'Notification updated successfully!' : 'Notification created successfully!');
                setShow(false);

                if (onSuccess) {
                    onSuccess(); // refresh the list in parent
                }
            } else {
                toast.error(response.data.message || 'Failed to create/update notification.');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'An error occurred.');
            console.error('Error in handleSubmit:', error);
        }
    };

    return (
        <div>
            <Modal className="p-2" show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title className="text-dark">
                        {notification.id > 0 ? 'Edit Notification' : 'Create Notification'}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Col lg={12}>
                            <Form.Group controlId="subject" className="mb-3">
                                <Form.Label>
                                    Subject <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="subject"
                                    value={notification.subject}
                                    onChange={handleChange}
                                    placeholder="Enter subject"
                                    required
                                />

                            </Form.Group>
                        </Col>

                        <Col lg={12}>
                            <Form.Group controlId="content" className="mb-3">
                                <Form.Label>
                                    Content <span className="text-danger">*</span>
                                </Form.Label>

                                <ReactQuill
                                    modules={modules}
                                    value={notification.content}
                                    onChange={(value) => handleChange(null, 'content', value)}
                                    theme="snow"
                                    style={{ height: 300 }}
                                    className="pb-4"
                                />

                                <div className="word-count mt-2">
                                    {wordCount} / 500 characters
                                </div>
                            </Form.Group>
                        </Col>

                        <ButtonGroup className="mt-3">
                            <Button onClick={handleClose} className="me-1">
                                Cancel
                            </Button>
                            <Button type="submit" variant="primary">
                                {notification.id > 0 ? 'Update Notification' : 'Save Notification'}
                            </Button>
                        </ButtonGroup>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default CreatePopup;
