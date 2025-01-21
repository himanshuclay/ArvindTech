import { Form, Button, Modal, Col, ButtonGroup } from "react-bootstrap";
import axios from "axios";
import config from "@/config";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface ProcessCanvasProps {
    show: boolean;
    setShow: (show: boolean) => void;
}

interface AssignProjecttoProcess {
    id: number;
    title: string;
    subject: string;
    content: string;
    createdBy: string;
    updatedBy: string;
}

const CreatePopup: React.FC<ProcessCanvasProps> = ({ show, setShow }) => {

    const [empName, setEmpName] = useState<string | null>('');
    const [wordCount, setWordCount] = useState(0);
    const [notification, setNotification] = useState<AssignProjecttoProcess>({
        id: 0,
        title: '',
        subject: '',
        content: '',
        createdBy: '',
        updatedBy: empName || '',
    });

    // Set employee name on component mount
    useEffect(() => {
        const storedEmpName = localStorage.getItem('EmpName');
        const storedEmpID = localStorage.getItem('EmpId');
        if (storedEmpName || storedEmpID) {
            setEmpName(`${storedEmpName} - ${storedEmpID}`);
        }
    }, []);

    // Handle form field change
    const handleChange = (e: ChangeEvent<any> | null, name?: string, value?: any) => {
        if (e) {
            const { name: eventName, type, value: inputValue } = e.target;

            if (type === 'textarea' || type === 'text') {
                const words = inputValue.trim().split(/\s+/).filter((word: string) => word.length > 0);
                const wordLimit = 500;

                // Only update if word count is less than or equal to limit
                if (words.length <= wordLimit) {
                    setNotification({
                        ...notification,
                        [eventName]: inputValue
                    });
                    setWordCount(words.length);
                }
            }
        } else if (name) {
            setNotification({
                ...notification,
                [name]: value
            });
        }
    };

    // Close modal
    const handleClose = () => {
        setShow(false);
    };

    // Handle form submission (just logging data for now)
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const payload = { ...notification };
            console.log("Notification Payload:", payload);

            const apiUrl = `${config.API_URL_APPLICATION}/Notification/CreateNotification`;
            const response = await axios.post(apiUrl, payload);

            if (response.data.isSuccess) {
                toast.success("Notification created successfully!");
                setShow(false);
            } else {
                toast.error(response.data.message || "Failed to create notification.");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "An error occurred.");
            console.error("Error in handleSubmit:", error);
        }
    };

    return (
        <div>
            <Modal className="p-2" show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title className="text-dark">Create Notification</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Col lg={12}>
                            <Form.Group controlId="title" className="mb-3">
                                <Form.Label>Title <span className='text-danger'>*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    value={notification.title}
                                    onChange={handleChange}
                                    placeholder="Enter title"
                                />
                            </Form.Group>
                        </Col>
                        <Col lg={12}>
                            <Form.Group controlId="subject" className="mb-3">
                                <Form.Label>Subject <span className='text-danger'>*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="subject"
                                    value={notification.subject}
                                    onChange={handleChange}
                                    placeholder="Enter subject"
                                />
                            </Form.Group>
                        </Col>
                        <Col lg={12}>
                            <Form.Group controlId="content" className="mb-3">
                                <Form.Label>Content <span className='text-danger'>*</span></Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="content"
                                    value={notification.content}
                                    onChange={handleChange}
                                    placeholder="Enter content"
                                    rows={5}
                                />
                                <div className="word-count mt-2">
                                    {wordCount} / 500 words
                                </div>
                            </Form.Group>
                        </Col>
                        <ButtonGroup className="mt-3">
                            <Button onClick={handleClose} className="me-1" >
                                Cancel
                            </Button>
                            <Button type="submit" variant="primary">
                                Save Notification
                            </Button>
                        </ButtonGroup>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default CreatePopup;
