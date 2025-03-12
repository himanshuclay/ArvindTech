import React, { useEffect, useRef, useState, } from 'react';
import config from '@/config';
import axios from 'axios';
import { getBlockById, manageBind, manageShowHide } from './Constant/Functions';
import { BASIC_FIELD, BLOCK_VALUE, FIELD, PROPERTY, RULE, TRIGGER_ACTION } from './Constant/Interface';
import TextInput from './Components/TextInput';
import NumberInput from './Components/NumberInput';
import EmailInput from './Components/EmailInput';
import PhoneInput from './Components/PhoneInput';
import Password from './Components/Password';
import Select from './Components/Select';
import { Button } from 'react-bootstrap';
import DateRange from './Components/DateRange';
import FileUpload from './Components/FileUpload';
import DateInput from './Components/DateInput';



interface EditorProps {
    form: FIELD;
    setForm: React.Dispatch<React.SetStateAction<FIELD>>;
    property: PROPERTY;
    setProperty: React.Dispatch<React.SetStateAction<PROPERTY>>;
    blockValue: BLOCK_VALUE;
    setBlockValue: React.Dispatch<React.SetStateAction<BLOCK_VALUE>>;
    expandedRow?: number | null;
    isShowSave?: boolean;
}

interface DynamicComponentProps {
    componentType: keyof typeof componentsMap;
    block: BASIC_FIELD;
    form: FIELD;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, id: string) => void;
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
    DateRange,
    FileUpload,
    DateInput,
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
                    validationErrors={validationErrors}
                    editMode={form.editMode}
                    blockValue={blockValue}
                    setBlockValue={setBlockValue}
                />
            </fieldset>
        </div>
    );
};

const Editor: React.FC<EditorProps> = ({ form, setForm, property, setProperty, blockValue, setBlockValue, expandedRow, isShowSave=true }) => {
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
    const [triggeredActions, setTriggeredActions] = useState<TRIGGER_ACTION[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, id: string) => {
        const newValue = e.target.value;

        setForm(prevForm => ({
            ...prevForm,
            blocks: prevForm.blocks.map(block =>
                block.property.id === id ? { ...block, property: { ...block.property, value: newValue } } : block
            )
        }));

        const currentField = form.blocks.find(block => block.property.id === id);
        if (currentField?.property.required === "true" && newValue.trim() === "") {
            setValidationErrors(prevErrors => ({
                ...prevErrors,
                [id]: `${currentField.property.label} is required`
            }));
        } else {
            setValidationErrors(prevErrors => {
                const { [id]: _, ...rest } = prevErrors;
                return rest;
            });
        }
    };

    const handleSave = () => {
        const errors: { [key: string]: string } = {};

        form.blocks.forEach(block => {
            if (block.property.required === "true" && (!block.property.value || block.property.value.trim() === "")) {
                errors[block.property.id] = `${block.property.label} is required`;
            }
        });

        setValidationErrors(errors);

        if (Object.keys(errors).length === 0) {
            console.log('Form Data:', form);
            console.log('blockValue Data:', blockValue);
        } else {
            console.log('Validation Errors:', errors);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();

        const fieldData = e.dataTransfer.getData('application/json');
        if (fieldData) {
            const droppedField: BASIC_FIELD = JSON.parse(fieldData);
            droppedField.property.id = `Block_${form.blocks.length}`;
            setForm(prevForm => ({
                ...prevForm,
                blocks: [...prevForm.blocks, droppedField],
            }));
        }
        handleDragLeave();
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        document.getElementById("Editor")?.classList.add('border-green');
    };

    const handleDragLeave = () => {
        document.getElementById("Editor")?.classList.remove('border-green');
    };

    const handleProperty = (block: BASIC_FIELD) => {
        if (form.editMode) {
            console.log('block.property', block.property)
            setProperty({ ...block.property });
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!form.editMode) {
                    const response = await axios.post(
                        `${config.API_URL_APPLICATION}/FormBuilder/GetValue`,
                        form.rules
                    );
                    if (response.data.isSuccess) {
                        const updatedActions = response.data.rules.map((rule: any) => {
                            rule.rule = JSON.parse(rule.rule);
                            return {
                                type: rule.action,
                                key: rule.rule.start2,
                                block: getBlockById(form, rule.rule.end3),
                                bindBlock: getBlockById(form, rule.rule.start2),
                                rule: rule
                            };
                        });
                        setTriggeredActions(updatedActions);
                    }
                }
            } catch (error) {
                console.error('FormBuilder/Editor', error);
            }
        };
        fetchData();
    }, [form.editMode]);


    const [prevBlockValue, setPrevBlockValue] = useState<any>({});
    const isFirstRun = useRef(true);

    const managePartiallyBind = async (blockValue: BLOCK_VALUE, rule: RULE) => {
        const query = {
            ...rule,
            partiallyBind: blockValue[rule.end3]
        }
        console.log(blockValue, query)
        if (query.partiallyBind) {
            const response = await axios.post(
                `${config.API_URL_APPLICATION}/FormBuilder/GetPartiallyBindValue`,
                query
            );
            response.data.rules.map((rule: any) => {
                rule.rule = JSON.parse(rule.rule);
                const bindBlock = getBlockById(form, rule.rule.start2);
                const updatedBlockValue = manageBind(bindBlock as BASIC_FIELD, blockValue, rule);
                if (bindBlock && bindBlock.is === 'Select') {
                    setForm(prevForm => ({
                        ...prevForm,
                        blocks: prevForm.blocks.map(block =>
                            block.property.id === bindBlock.property.id ? updatedBlockValue as BASIC_FIELD : block
                        )
                    }));
                } else {
                    setBlockValue(updatedBlockValue as BLOCK_VALUE);
                }
            });
            isFirstRun.current = true;
            // setTriggeredActions(updatedActions);
        }
    };
    const someRule = () => {
        console.log(triggeredActions)
        triggeredActions.forEach(action => {
            if (action.type === 'show_hide' && action.block) {
                const updatedBlock = manageShowHide(action.block, action.rule.rule, blockValue) as BASIC_FIELD;
                setForm(prevForm => ({
                    ...prevForm,
                    blocks: prevForm.blocks.map(block =>
                        block.property.id === updatedBlock.property.id ? updatedBlock : block
                    )
                }));
            } else if (action.type === 'bind' && action.bindBlock) {
                const updatedBlockValue = manageBind(action.bindBlock, blockValue, action.rule);
                if (action.bindBlock.is === 'Select') {
                    setForm(prevForm => ({
                        ...prevForm,
                        blocks: prevForm.blocks.map(block =>
                            block.property.id === action.bindBlock.property.id ? updatedBlockValue as BASIC_FIELD : block
                        )
                    }));
                } else {
                    setBlockValue(updatedBlockValue as BLOCK_VALUE);
                }
            } else if (action.type === 'partially_bind' && action.bindBlock) {
                managePartiallyBind(blockValue, action.rule.rule);
            }
        });
    }

    useEffect(() => {
        if (!form.editMode) {
            if (isFirstRun.current) {
                console.log('isFirstRun')
                someRule();
                isFirstRun.current = false;
            } else {
                const changedKeys = Object.keys(blockValue).filter(
                    key => blockValue[key] !== prevBlockValue[key]
                );
                
                if (changedKeys.length === 0) return;
                setPrevBlockValue(blockValue);
                someRule();
            }
        }
    }, [blockValue, triggeredActions]);


    return (
        <div
            className='bg-white editor p-4 border rounded min-h-40 overflow-y-auto'
            id='Editor'
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
        >
            <div className='d-flex flex-wrap'>


                {form.blocks.length === 0 ? (
                    <p className="text-gray-400">Drag fields here...</p>
                ) : (
                    form.blocks.map((block, index) => (
                        <div
                            id={block.property.id}
                            key={index}
                            className={`col-lg-${block.property.size ? block.property.size : '12'} p-2 rounded bg-gray-100 ${form.editMode ? 'border cursor-pointer' : ''} ${block.property.id === property.id ? 'border-green' : ''}`}
                            onClick={() => handleProperty(block)}
                            style={block.property.advance}
                        >
                            <DynamicComponentRenderer
                                form={form}
                                componentType={block.is}
                                block={block}
                                handleChange={handleChange}
                                validationErrors={validationErrors}
                                blockValue={blockValue}
                                setBlockValue={setBlockValue}
                            />
                        </div>
                    ))
                )}
            </div>
            {!form.editMode && isShowSave && (
                <Button
                    type='button'
                    onClick={handleSave}
                    className='mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition'
                >
                    Save
                </Button>
            )}
        </div>
    );
};

export default Editor;
