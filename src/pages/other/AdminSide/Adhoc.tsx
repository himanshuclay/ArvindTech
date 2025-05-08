import React, { useState, useEffect } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import { FileUploader } from '@/components/FileUploader'
import config from '@/config';
import FormBuilder from '@/pages/FormBuilder/FormBuilder';
import { toast } from 'react-toastify';



// Define interface for form options
// interface Option {
//     id: string;
//     label: string;
// }
// interface Option {
//     id: string;
//     label: string;
// }

// Define interface for form inputs
// interface Input {
//     inputId: string;
//     label: string;
//     placeholder?: string;
//     type: string;
//     options?: Option[];
// }

// Interface for form data containing form inputs
// interface FormData {
//     inputs: Input[];
// }

// Interface for mess manager dropdown options

// Interface for API response structure
interface Template {
    processID: string, nodeID: string, formID: string,
}

interface ApiResponse {
    isSuccess: boolean;
    message: string;
    matchedConfigs: Template[];
}

// Main component
const Adhoc: React.FC = () => {
    const [data, setData] = useState<Template[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [formDetails, setFormDetails] = useState<any>();
    // const [selectedManager, setSelectedManager] = useState<string>(''); // Manager select state
    const navigate = useNavigate();

    // Placeholder for mess managers




    // Fetch API data
    const fetchTemplates = async () => {
        try {
            const response = await axios.get<ApiResponse>(`${config.API_URL_ACCOUNT}/ProcessInitiation/GetConfiguration?DoerID=${localStorage.getItem("EmpId")}`);
            console.log('response', response)
            if (response.data.isSuccess) {
                setData(response.data.matchedConfigs);
            } else {
                setError('Failed to fetch templates');
            }
        } catch (err) {
            setError('An error occurred while fetching templates');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {

        fetchTemplates();
    }, []);



    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    const initiation = async (form: any) => {
        console.log(form)
        const payload = {
                    moduleName: form.processID.split('.')[0],
                    taskNumber: form.processID,
                    nodeId: form.nodeID,
                    createdBy: localStorage.getItem("EmpId"),
                };
                console.log(payload)
                try {
                    await axios.post(`${config.API_URL_ACCOUNT}/ProcessInitiation/ManualProcessTaskInitiation`, payload);
                    navigate('/pages/ProcessInitiation', {
                        state: {
                            successMessage: "Process Initiated successfully!",
                        }
                    });
        
                } catch (error: any) {
                    toast.error(error);
                    console.error('Error submitting module:', error);
                }

    }




    const handleClose = () => {
        setFormDetails(null);
        fetchTemplates();
    }

    return (
        <>
            <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center fs-20">
                <span><i className="ri-file-list-line me-2"></i><span className='fw-bold test-nowrap'>Adhoc</span></span>
                <div className="d-flex">
                    {/* <Link className='me-2' to='/pages/FormBuilder'>
                        <Button variant="primary" className="">
                            Adhoc
                        </Button>
                    </Link>
                    <Link to='/pages/AdhocConfig'>
                        <Button variant="primary" className="">
                            Configuration
                        </Button>
                    </Link> */}
                </div>
            </div>
            <Table className='bg-white mt-3' striped bordered hover>
                <thead>
                    <tr>
                        <th>Sr.no</th>
                        <th>Process</th>
                        <th>Form</th>
                        <th>Node</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <React.Fragment key={index}>
                            <tr>
                                <td>{index + 1}</td>
                                <td>{item.processID}</td>
                                <td>{item.formID}</td>
                                <td>{item.nodeID}</td>
                                <td>
                                    <Button onClick={() => initiation(item)} className='me-2'>
                                        <i className="ri-presentation-line"></i>
                                    </Button>
                                </td>
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </Table>
            

            {formDetails && (
                <Modal show={true} onHide={handleClose} size="xl">
                    <Modal.Header closeButton>
                        <Modal.Title className="col-6">Conditions Form</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FormBuilder formDetails={formDetails} handleClose={handleClose} />
                    </Modal.Body>
                </Modal>
            )}
        </>
    );
};



export default Adhoc;
