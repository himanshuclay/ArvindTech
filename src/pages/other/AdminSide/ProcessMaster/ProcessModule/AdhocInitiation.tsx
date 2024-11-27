import { Modal, Button, Table } from "react-bootstrap";
import axios from "axios";
import config from "@/config";
import { useEffect, useState } from "react";

interface ProcessCanvasProps {
    show: boolean;
    setShow: (show: boolean) => void;
}

interface AdhocList {
    id: number;
    formName: string;
}

const AdhocInitiation: React.FC<ProcessCanvasProps> = ({ show, setShow }) => {
    const [adhocLlist, setAdhocLlist] = useState<AdhocList[]>([]);

    useEffect(() => {
        if (show) {
            const fetchAdhocList = async () => {
                try {
                    const response = await axios.get(`${config.API_URL_ACCOUNT}/ProcessTaskMaster/GetTemplateJson`);
                    if (response.data.isSuccess) {
                        setAdhocLlist(response.data.getTemplateJsons);
                    } else {
                        console.error(response.data.message);
                    }
                } catch (error) {
                    console.error("Error fetching Adhoc list:", error);
                }
            };
            fetchAdhocList();
        }
    }, [show]);

    const handleClose = () => {
        setShow(false);
    };

    const handleSelectAdhoc = (id: number) => {
        console.log(`Selected Adhoc Form ID: ${id}`);
    };

    return (
        <div>
            <Modal className="p-2" show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title className="text-dark">Select Adhoc Form</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {adhocLlist.length > 0 ? (
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Form Name</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {adhocLlist.map((adhoc, index) => (
                                    <tr key={adhoc.id}>
                                        <td>{index + 1}</td>
                                        <td>{adhoc.formName}</td>
                                        <td>
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => handleSelectAdhoc(adhoc.id)}
                                            >
                                                Select
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <p>No Adhoc Forms Available</p>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default AdhocInitiation;
