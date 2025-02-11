import React, { useState } from 'react';
import Blocks from './Blocks/Blocks';
import Editor from './Editor';
import Property from './Property/Property';
import Action from './Action';
import { Modal } from 'react-bootstrap';
import Rule from './Property/Rule';

// Define the types for Option and PROPERTY
interface Option {
    label: string;
    value: string;
}

interface PROPERTY {
    label: string;
    id: string;
    placeholder: string;
    required: boolean;
    options: Option[];
}

interface BasicField {
    id: string;
    property: PROPERTY;
}

interface RULE {
    start1: string;
}

// Define the type for the form
interface FIELD {
    name: string;
    is: string;
    blocks: BasicField[];
    editMode: boolean;
    rules: RULE[];
    advance: ADVANCE;

}

// Define props types for FormBuilder (optional if used)
interface FormBuilderProps {}

const FormBuilder: React.FC<FormBuilderProps> = () => {
    // Initialize form state with appropriate type
    const [form, setForm] = useState<FIELD>({
        name: '',
        is: '',
        blocks: [],
        editMode: true,
        rules: [],
    });

    // Initialize property state with appropriate type
    const [property, setProperty] = useState<PROPERTY>({
        label: '',
        id: '',
        placeholder: '',
        required: false,
        options: [],  // Adding empty options array
    });

    const [showRule, setShowRule] = useState(false)
    const [blockValue, setBlockValue] = useState({})

    // Function to remove a block by its ID from the form's blocks array
    const removeFormBlock = (blockId: string) => {
        setForm((prevForm) => ({
            ...prevForm,
            blocks: prevForm.blocks.filter((block) => block.id !== blockId), // Remove block by ID
        }));
        setProperty({ label: '', id: '', placeholder: '', required: false, options: [] }); // Clear the property state
    };

    return (
        <div className="row m-0">
            <div>
                {/* Action component */}
                <Action form={form} setForm={setForm} property={property} setProperty={setProperty} showRule={showRule} setShowRule={setShowRule} />
            </div>
            <div className="d-flex">
                {form.editMode && (
                    <div className="col-lg-3 col-md-3">
                        <Blocks form={form} setForm={setForm} />
                    </div>
                )}
                <div className="w-100">
                    {/* Editor component */}
                    <Editor form={form} setForm={setForm} property={property} setProperty={setProperty} blockValue={blockValue} setBlockValue={setBlockValue} />
                </div>
                {form.editMode && property.label && (
                    <div className="col-lg-3 col-md-3">
                        {/* Property component */}
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
