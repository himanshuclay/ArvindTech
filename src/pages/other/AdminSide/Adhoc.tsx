import React, { useState, useEffect } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import { FileUploader } from '@/components/FileUploader'
import config from '@/config';
import FormBuilder from '@/pages/FormBuilder/FormBuilder';
import { toast } from 'react-toastify';
import { FIELD, PROPERTY } from '@/pages/FormBuilder/Constant/Interface';
import Editor from '@/pages/FormBuilder/Editor';



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
    processID: string, nodeID: string, formID: string, blockID: string, nodesID: string[]
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
    const [activeForm, setActiveForm] = useState<Template>();
    // const [selectedManager, setSelectedManager] = useState<string>(''); // Manager select state
    const navigate = useNavigate();

    // Placeholder for mess managers

    const [form, setForm] = useState<FIELD>({
        name: '',
        blocks: [],
        blockCount: 0,
        editMode: false,
        rules: [],
        configureSelectionLogics: [],
        advance: {
            backgroundColor: '',
            color: '',
        }
    });
    const [property, setProperty] = useState<PROPERTY>({
        label: '',
        id: '',
        placeholder: '',
        value: '',
        type: '',
        required: "false",
        options: [{ label: '', value: '' }],
        advance: {
            backgroundColor: '',
            color: '',
        },
        isShow: false,
        disabled: "false",
    })
    const [blockValue, setBlockValue] = useState({})



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
        setActiveForm(form);
        const response = await axios.get(`${config.API_URL_ACCOUNT}/ProcessTaskMaster/GetTemplateJson?id=${form.formID}`);
        console.log(response)
        if (response.data.isSuccess) {
            setForm({
                ...JSON.parse(response.data.getTemplateJsons[0].templateJson),
                editMode: false,
            });
        }

    }




    const handleClose = () => {
        setFormDetails(null);
        fetchTemplates();
        setForm({
            name: '',
            blocks: [],
            blockCount: 0,
            editMode: false,
            rules: [],
            configureSelectionLogics: [],
            advance: {
                backgroundColor: '',
                color: '',
            }
        })
    }

    const handleAdhocForm = async () => {
        if (activeForm) {
            const payload = {
                moduleName: activeForm.processID.split('.')[0],
                taskNumber: activeForm.processID,
                nodeId: activeForm.nodeID,
                adhoc: {
                    blockValue: JSON.stringify(blockValue),
                    form: JSON.stringify(form),
                },
                nodesId: activeForm.nodesID,
                blockId: activeForm.blockID,
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

            <Modal
                size="xl"
                className="p-3"
                show={!!form?.blocks?.length}
                placement="end"
                onHide={handleClose}>
                <Modal.Header closeButton className=" ">
                    <Modal.Title className="text-dark">Task Details11</Modal.Title>
                </Modal.Header>

                <div>
                    {JSON.stringify(blockValue)}
                    <Editor form={form} setForm={setForm} property={property} setProperty={setProperty} blockValue={blockValue} setBlockValue={setBlockValue} isShowSave={false} />
                    <div className="my-2 d-flex justify-content-end px-2">
                        <button className='btn btn-primary' type='button' onClick={(event) => handleAdhocForm()}>Save</button>
                    </div>
                </div>

            </Modal>
        </>
    );
};



export default Adhoc;
