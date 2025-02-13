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
import { useParams } from 'react-router-dom';

interface FormBuilderProps { }

const FormBuilder: React.FC<FormBuilderProps> = () => {
    const { id } = useParams<{ id: string }>();

    const [form, setForm] = useState<FIELD>({
        name: '',
        blocks: [],
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
    const [formSize, setFormSize] = useState(3);


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
            if (!form.name) {
                toast.info("Please Fill Form Name");
                return;
            }
            console.log('form', form)
            const response = await axios.post(
                `${config.API_URL_APPLICATION}/FormBuilder/InsertUpdateForm`, form,
                { params: { id: id || ''}}
            );
            if (response.data.isSuccess) {
                toast.success(response.data.message);
            }else{
                toast.error(response.data.message)
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
        // setFormSize,
    }

    const fetchFormById = async(id: string) => {
        const response = await axios.get(`${config.API_URL_APPLICATION}/FormBuilder/GetForm`, {
            params: { id: id }
        });
        setForm(response.data.getForms[0]);
    }
    useEffect(() => {
        if (id) {
            fetchFormById(id);
        } 
    }, [id]);


    return (
        <div className="row m-0">
            <div>
                <Action actionProps={actionProps} />
            </div>
            <div className="d-flex">
                {form.editMode && (
                    <div className="col-lg-3 col-md-3 rounded mr-1">
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
