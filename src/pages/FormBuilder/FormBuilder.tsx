import React, { useEffect, useState } from 'react';
import Blocks from './Blocks/Blocks';
import Editor from './Editor';
import Property from './Property/Property';
import Action from './Action';
import Rule from './Property/Rule';
import { FIELD, PROPERTY } from './Constant/Interface';
import axios from 'axios';
import config from '@/config';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

interface FormBuilderProps {
    formDetails?: {
        templateJson?: string;
        id?: number;
    },
    handleClose?: () => void;
    formBuilder?: FIELD;
    setFormBuilder?: React.Dispatch<React.SetStateAction<FIELD>>;
}

const FormBuilder: React.FC<FormBuilderProps> = ({ formDetails, handleClose, formBuilder, setFormBuilder }) => {
    const { id } = useParams<{ id: string }>();

    const [showWorkflowBuilder,] = useState(formBuilder ? true : false)

    const [form, setForm] = useState<FIELD>(formBuilder ? formBuilder : {
        name: '',
        blocks: [],
        blockCount: 0,
        editMode: true,
        rules: [],
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
        required: "false",
        options: [{ label: '', value: '' }],
        advance: {
            backgroundColor: '',
            color: '',
        },
        isShow: false,
        disabled: false,
    })


    const [showRule, setShowRule] = useState(false)
    const [blockValue, setBlockValue] = useState({})
    const navigate = useNavigate();


    const removeFormBlock = (blockId: string) => {
        setForm((prevForm) => ({
            ...prevForm,
            blocks: prevForm.blocks.filter((block) => block.property.id !== blockId),
        }));
        setProperty({
            label: '',
            id: '',
            placeholder: '',
            required: "false",
            value: '',
            options: [{ label: '', value: '' }],
            advance: {
                backgroundColor: '',
                color: '',
            },
            isShow: false,
            disabled: false,
        });
    };

    const handleSaveForm = async () => {
        try {
            if (formBuilder && setFormBuilder) {
                setFormBuilder(form);
                
                return;
            }
            if (!form.name) {
                toast.info("Please Fill Form Name");
                return;
            }
            console.log('form', form)
            const response = await axios.post(
                `${config.API_URL_APPLICATION}/FormBuilder/InsertUpdateForm`, form,
                { params: { id: id || '' } }
            );
            if (response.data.isSuccess) {
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.error(error)
        }
    }
    const handleAdhocSaveForm = async () => {
        try {
            if (!form.name) {
                toast.info("Please Fill Form Name");
                return;
            }
            const payload = {
                formName: form.name,
                templateJson: JSON.stringify(form),
                createdBy: "HimanshuPant",
                id: formDetails?.id,
            };
            console.log(payload)
            const response = await fetch(`${config.API_URL_ACCOUNT}/ProcessTaskMaster/InsertTemplateJson`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                },
                body: JSON.stringify(payload),
            });
            const responseText = await response.text();

            if (responseText) {
                const data = JSON.parse(responseText);
                console.log(data)
                if (data.isSuccess) {
                    toast.success(data.message);
                    navigate('/pages/AdhocMaster');
                    handleClose?.();
                }
            }
        } catch (error) {
            console.error(error)
        }
    }
    const actionProps = {
        form,
        setForm,
        property,
        setProperty,
        showRule,
        setShowRule,
        handleSaveForm,
        handleAdhocSaveForm,
        showWorkflowBuilder,
        // setFormSize,
    }

    const fetchFormById = async (id: string) => {
        const response = await axios.get(`${config.API_URL_APPLICATION}/FormBuilder/GetForm`, {
            params: { id: id }
        });
        setForm(response.data.getForms[0]);
    }
    useEffect(() => {
        if (id) {
            fetchFormById(id);
        } else if (formDetails?.templateJson) {
            setForm(JSON.parse(formDetails.templateJson));
        }
    }, [id]);


    return (
        <div className="row m-0">
            <div>
                <Action actionProps={actionProps} />
            </div>
            <div className="d-flex">
                {form.editMode && (
                    <div className="col-lg-2 col-md-2 rounded mr-1">
                        <Blocks form={form} setForm={setForm} />
                    </div>
                )}
                <div className="w-100">
                    <Editor form={form} setForm={setForm} property={property} setProperty={setProperty} blockValue={blockValue} setBlockValue={setBlockValue} />
                </div>
                {form.editMode && property.id && (
                    <div className="col-lg-3 col-md-3 ml-1">
                        <Property form={form} setForm={setForm} property={property} setProperty={setProperty} removeFormBlock={removeFormBlock} />
                    </div>
                )}
                <div>
                    <Rule form={form} setForm={setForm} showRule={showRule} setShowRule={setShowRule} />
                </div>
            </div>
        </div>
    );
};

export default FormBuilder;
