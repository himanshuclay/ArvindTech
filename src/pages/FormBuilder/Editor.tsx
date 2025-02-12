import React, { useEffect, useState } from 'react';

import config from '@/config';
import axios from 'axios';
import { getBlockById, manageShowHide } from './Constant/Functions';
import { BASIC_FIELD, FIELD, PROPERTY} from './Constant/Interface';
import TextInput from './Components/TextInput';
import NumberInput from './Components/NumberInput';
import EmailInput from './Components/EmailInput';
import PhoneInput from './Components/PhoneInput';
import Password from './Components/Password';
import Select from './Components/Select';


type FormControlElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;





interface BLOCK_VALUE {
    [key: string]: string;
}



interface EditorProps {
    form: FIELD;
    setForm: React.Dispatch<React.SetStateAction<FIELD>>;
    property: PROPERTY;
    setProperty: React.Dispatch<React.SetStateAction<PROPERTY>>;
    blockValue: BLOCK_VALUE;
    setBlockValue: React.Dispatch<React.SetStateAction<BLOCK_VALUE>>;
}


interface DynamicComponentProps {
    componentType: keyof typeof componentsMap;
    block: BASIC_FIELD;
    form: FIELD;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void;
    validationErrors: { [key: string]: string };
    blockValue: BLOCK_VALUE;
    setBlockValue: React.Dispatch<React.SetStateAction<BLOCK_VALUE>>;
}

const componentsMap = {
    TextInput,
    NumberInput,
    EmailInput,
    PhoneInput,
    Password,
    Select,
};

const DynamicComponentRenderer: React.FC<DynamicComponentProps> = ({ form, componentType, block, handleChange, validationErrors, blockValue, setBlockValue }) => {
    const ComponentToRender = componentsMap[componentType];

    if (!ComponentToRender) {
        return <p>Component not found!</p>;
    }

    return (
        <div className={`${form.editMode ? 'cursor-not-allowed' : ''}`}>
            <fieldset className={`${form.editMode ? 'pointer-events-none select-none' : ''}`}>
                <ComponentToRender
                    block={block}
                    handleChange={handleChange}
                    validationErrors={validationErrors}  // Pass validation errors
                    editMode={form.editMode}
                    blockValue={blockValue} setBlockValue={setBlockValue}
                />
            </fieldset>
        </div>
    );
};

const Editor: React.FC<EditorProps> = ({ form, setForm, property, setProperty, blockValue, setBlockValue }) => {
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (e: React.ChangeEvent<FormControlElement>, id: string) => {
        const newValue = e.target.value;

        setForm(prevForm => ({
            ...prevForm,
            blocks: prevForm.blocks.map(block =>
                block.id === id ? { ...block, property: { ...block.property, value: newValue } } : block
            )
        }));

        // Validation Logic
        const currentField = form.blocks.find(block => block.id === id);
        if (currentField?.property.required === "true" && newValue.trim() === "") {
            setValidationErrors(prevErrors => ({
                ...prevErrors,
                [id]: `${currentField.property.label} is required`
            }));
        } else {
            setValidationErrors(prevErrors => {
                const { [id]: _, ...rest } = prevErrors;  // Remove error if input is valid
                return rest;
            });
        }
    };

    const handleSave = () => {
        let errors: { [key: string]: string } = {};

        form.blocks.forEach(block => {
            if (block.property.required === "true" && (!block.property.value || block.property.value.trim() === "")) {
                errors[block.id] = `${block.property.label} is required`;
            }
        });

        setValidationErrors(errors);

        if (Object.keys(errors).length === 0) {
            console.log('Form Data:', form);  // Submit form if no validation errors
        } else {
            console.log('Validation Errors:', errors);  // Show errors if validation fails
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();

        const fieldData = e.dataTransfer.getData('application/json');
        if (fieldData) {
            const droppedField: BASIC_FIELD = JSON.parse(fieldData);
            droppedField.id = `Block_${form.blocks.length}`;
            setForm(prevForm => ({
                ...prevForm,
                blocks: [...prevForm.blocks, droppedField],
            }));
        }
        handleDragLeave();
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const editor = document.getElementById("Editor");
        if (editor) {
            editor.classList.add('border-green');
        }
    };

    const handleDragLeave = () => {
        const editor = document.getElementById("Editor");
        if (editor) {
            editor.classList.remove('border-green');
        }
    };

    const handleProperty = (block: BASIC_FIELD, index: number) => {
        if (form.editMode) {
            setProperty({ ...block.property, id: `Block_${index}` });
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {

                const response = await axios.post(
                    `${config.API_URL_APPLICATION}/FormBuilder/GetTenderID`, form.rules);
                console.log('response', response)

                if (response.data.isSuccess) {
                    response.data.rules.map((rule: any) => {
                        console.log('rule.action', rule.action)
                        switch (rule.action) {
                            case 'show_hide':
                                rule.rule = JSON.parse(rule.rule);
                                let block = getBlockById(form, rule.rule.end3);
                                if (block) {

                                    let newBlock = manageShowHide(block, rule.rule, blockValue);

                                    newBlock = newBlock as BASIC_FIELD;

                                    console.log('newBlock', newBlock);

                                    setForm((prevForm) => ({
                                        ...prevForm,
                                        blocks: prevForm.blocks.map((block) =>
                                            block.id === newBlock.id ? (newBlock as BASIC_FIELD) : block
                                        ) // Replace the block with the matching ID with newBlock
                                    }));
                                }

                                break;
                            case 'bind':
                                // Handle BIND action
                                break;
                            default:
                                // Optionally handle unexpected actions
                                break;
                        }
                    });
                }

            } catch (error) {
                console.error('FormBuilder/Editor', error);
            }
        };

        fetchData(); // Call the async function

    }, [form.editMode, blockValue]); // Re-run when form.editMode changes


    return (
        <div
            className='bg-white editor p-4 border rounded min-h-40'
            id='Editor'
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
        >
            {form.blocks.length === 0 ? (
                <p className="text-gray-400">Drag fields here...</p>
            ) : (
                form.blocks.map((block, index) => (
                    <div
                        id={`Block_${index}`}
                        key={index}
                        className={`p-2 m-1 rounded bg-gray-100 ${form.editMode ? 'border cursor-pointer' : ''} ${block.id === property.id ? 'border-green' : ''}`}
                        onClick={() => handleProperty(block, index)}
                        style={block.property.advance}
                    >
                        <DynamicComponentRenderer
                            form={form}
                            componentType={block.is}
                            block={block}
                            handleChange={handleChange}
                            validationErrors={validationErrors}
                            blockValue={blockValue} setBlockValue={setBlockValue}
                        />
                    </div>
                ))
            )}
            {form.editMode ? '' :
                <button
                    type='button'
                    onClick={handleSave}
                    className='mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition'
                >
                    Save
                </button>
            }
        </div>
    );
};

export default Editor;
