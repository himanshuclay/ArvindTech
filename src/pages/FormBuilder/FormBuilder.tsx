import React, { useState } from 'react';
import Blocks from './Blocks/Blocks';
import Editor from './Editor';
import Property from './Property/Property';
import Action from './Action';
import Rule from './Property/Rule';
import { FIELD, PROPERTY } from './Constant/Interface';

interface FormBuilderProps { }

const FormBuilder: React.FC<FormBuilderProps> = () => {
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
    })


    const [showRule, setShowRule] = useState(false)
    const [blockValue, setBlockValue] = useState({})

    const removeFormBlock = (blockId: string) => {
        setForm((prevForm) => ({
            ...prevForm,
            blocks: prevForm.blocks.filter((block) => block.id !== blockId),
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
        }); 
    };

    return (
        <div className="row m-0">
            <div>
                <Action form={form} setForm={setForm} property={property} setProperty={setProperty} showRule={showRule} setShowRule={setShowRule} />
            </div>
            <div className="d-flex">
                {form.editMode && (
                    <div className="col-lg-3 col-md-3">
                        <Blocks form={form} setForm={setForm} />
                    </div>
                )}
                <div className="w-100">
                    <Editor form={form} setForm={setForm} property={property} setProperty={setProperty} blockValue={blockValue} setBlockValue={setBlockValue} />
                </div>
                {form.editMode && property.label && (
                    <div className="col-lg-3 col-md-3">
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
