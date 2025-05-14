import React, { useEffect, useRef, useState, } from 'react';
import config from '@/config';
import axios from 'axios';
import { getBlockById, manageBind, manageShowHide } from './Constant/Functions';
import { BASIC_FIELD, BLOCK_VALUE, FIELD, PROPERTY, RULE, TRIGGER_ACTION } from './Constant/Interface';
import TextInput from './Components/TextInput';
import Paragraph from './Components/Paragraph';
import NumberInput from './Components/NumberInput';
import EmailInput from './Components/EmailInput';
import PhoneInput from './Components/PhoneInput';
import Password from './Components/Password';
import Select from './Components/Select';
import { Button } from 'react-bootstrap';
import DateRange from './Components/DateRange';
import FileUpload from './Components/FileUpload';
import DateInput from './Components/DateInput';
import MultiSelectDropdown from './Components/MultiSelect';
import AmountInput from './Components/AmountInput';
import FloatInput from './Components/FloatInput';
import Looper from './Components/Looper';
import RadioInput from './Components/RadioInput';
import CheckboxInput from './Components/CheckboxInput';
import TableInput from './Components/TableInput';
import { updateIsPermanentRecursively } from '../WorkflowBuilder/Constant/function';
import TextArea from './Components/TextArea';
// import { speak } from '@/utils/speak';



interface EditorProps {
    form: FIELD;
    setForm: React.Dispatch<React.SetStateAction<FIELD>>;
    property: PROPERTY;
    setProperty: React.Dispatch<React.SetStateAction<PROPERTY>>;
    blockValue: BLOCK_VALUE;
    setBlockValue: React.Dispatch<React.SetStateAction<BLOCK_VALUE>>;
    expandedRow?: number | null;
    isShowSave?: boolean;
    isPreview?: boolean;
    validationErrorsList?: { [key: string]: string };
    pId?: number;
}

interface DynamicComponentProps {
    componentType: keyof typeof componentsMap;
    block: BASIC_FIELD;
    form: FIELD;
    setForm: React.Dispatch<React.SetStateAction<FIELD>>;
    setProperty: React.Dispatch<React.SetStateAction<PROPERTY>>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, id: string) => void;
    validationErrors: { [key: string]: string };
    blockValue: BLOCK_VALUE;
    setBlockValue: React.Dispatch<React.SetStateAction<BLOCK_VALUE>>;
    pId?: number
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
    MultiSelectDropdown,
    AmountInput,
    FloatInput,
    Looper,
    RadioInput,
    Paragraph,
    CheckboxInput,
    TableInput,
    TextArea,
};

const DynamicComponentRenderer: React.FC<DynamicComponentProps> = ({ form, setForm, componentType, block, handleChange, validationErrors, blockValue, setBlockValue, setProperty, pId }) => {
    const ComponentToRender = componentsMap[componentType];
    if (!ComponentToRender) {
        return <p>Component not found!</p>;
    }
    console.log('validationErrors', validationErrors)

    return (
        // <div className={`${form.editMode ? 'cursor-not-allowed' : ''}`}>
        //     <fieldset className={`${form.editMode ? 'pointer-events-none select-none' : ''}`}>
        <ComponentToRender
            block={block}
            handleChange={handleChange}
            validationErrors={validationErrors}
            editMode={form.editMode}
            blockValue={blockValue}
            setBlockValue={setBlockValue}
            form={form}
            setForm={setForm}
            setProperty={setProperty}
            pId={pId}
        />
        //     </fieldset>
        // </div>
    );
};

const Editor: React.FC<EditorProps> = ({ form, setForm, property, setProperty, blockValue, setBlockValue, expandedRow, isShowSave = true, isPreview = false, validationErrorsList, pId }) => {
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
    const [triggeredActions, setTriggeredActions] = useState<TRIGGER_ACTION[]>([]);
    const [draggingOver, setDraggingOver] = useState<{ [key: string]: boolean }>({});  // Track if drag is over a zone

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
            const { validation, value, label, id } = block.property;

            // Trimmed value for consistency
            const trimmedValue = value?.toString().trim() || "";

            if (validation === "required" && trimmedValue === "") {
                errors[id] = `${label} is required`;
            }

            if (validation === "nonNegativeInteger" && !/^\d+$/.test(trimmedValue)) {
                errors[id] = `${label} must be a non-negative integer`;
            }

            if (validation === "positiveIntegerGreaterZero" && !/^[1-9]\d*$/.test(trimmedValue)) {
                errors[id] = `${label} must be a positive integer greater than zero`;
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

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropZoneId: string) => {
        e.preventDefault();
        e.stopPropagation();

        setDraggingOver(prevState => ({ ...prevState, [dropZoneId]: false })); // Reset dragging over state

        const fieldData = e.dataTransfer.getData('application/json');
        const dropZone = e.currentTarget.getAttribute('id');

        if (!fieldData || !dropZone) return;

        const droppedField: BASIC_FIELD = JSON.parse(fieldData);

        // Check if dropped in main editor area
        if (dropZone === "Editor") {
            droppedField.property.id = `Block_${form.blockCount + 1}`;
            // speak(`${droppedField.is} dropped successfully`);

            setForm(prevForm => ({
                ...prevForm,
                blocks: [...prevForm.blocks, droppedField],
                blockCount: prevForm.blockCount + 1,
            }));

            // Check if dropped in a specific block area
        } else if (dropZone.startsWith("TopBlock_") || dropZone.startsWith("BottomBlock_")) {
            // Extract block index or any other logic you want
            const blockIndex = parseInt(dropZone.split("_")[1], 10);

            if (!isNaN(blockIndex)) {
                // Example: Insert droppedField after this index
                droppedField.property.id = `Block_${form.blockCount + 1}`;

                setForm(prevForm => {
                    const updatedBlocks = [...prevForm.blocks];
                    updatedBlocks.splice(blockIndex, 0, droppedField);

                    return {
                        ...prevForm,
                        blocks: updatedBlocks,
                        blockCount: prevForm.blockCount + 1,
                    };
                });
            }
        }

        handleDragLeave(e, dropZoneId);
    };


    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, dropZoneId: string) => {
        e.preventDefault();
        e.stopPropagation();
        setDraggingOver(prevState => ({ ...prevState, [dropZoneId]: true })); // Set dragging over state to true

        const dropZone = e.currentTarget.getAttribute('id');
        document.getElementById(`${dropZone}`)?.classList.add('border-green');
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>, dropZoneId: string) => {
        e.preventDefault();
        e.stopPropagation();
        setDraggingOver(prevState => ({ ...prevState, [dropZoneId]: false })); // Reset dragging over state

        const dropZone = e.currentTarget.getAttribute('id');
        document.getElementById(`${dropZone}`)?.classList.remove('border-green');
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
                        console.log(updatedActions);
                        setTriggeredActions(updatedActions);
                    }
                }
            } catch (error) {
                console.error('FormBuilder/Editor', error);
            }
        };
        isFirstRun.current = true;
        fetchData();
    }, [form.editMode, localStorage.getItem('ifLoop')]);


    const [prevBlockValue, setPrevBlockValue] = useState<any>({});
    const isFirstRun = useRef(true);

    const managePartiallyBind = async (blockValue: BLOCK_VALUE, rule: RULE) => {
        const query = {
            ...rule,
            partiallyBind: blockValue[rule.end3]
        }
        // console.log(blockValue, query)
        if (query.partiallyBind) {
            const response = await axios.post(
                `${config.API_URL_APPLICATION}/FormBuilder/GetPartiallyBindValue`,
                query
            );
            console.log(response);
            response.data.rules.map((rule: any) => {
                rule.rule = JSON.parse(rule.rule);
                const bindBlock = getBlockById(form, rule.rule.start2);
                const updatedBlockValue = manageBind(bindBlock as BASIC_FIELD, blockValue, rule);
                if (bindBlock && bindBlock.is === 'Select') {
                    setForm(prevForm => ({
                        ...prevForm,
                        // blocks: prevForm.blocks.map(block =>
                        //     block.property.id === bindBlock.property.id ? updatedBlockValue as BASIC_FIELD : block
                        // )
                        blocks: prevForm.blocks.map(block => {
                            if (block.property.blocks?.length) {
                                const updatedLoopBlocks = block.property.blocks.map(loopBlock => {
                                    if (loopBlock.property.id.includes(bindBlock.property.id)) {
                                        return updatedBlockValue as BASIC_FIELD;
                                    }
                                    return loopBlock;
                                });
    
                                return {
                                    ...block,
                                    property: {
                                        ...block.property,
                                        blocks: updatedLoopBlocks
                                    }
                                };
                            }
    
                            if (block.property.id === bindBlock.property.id) {
                                return updatedBlockValue as BASIC_FIELD;
                            }
    
                            return block;
                        })
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
        console.log('triggeredActions', triggeredActions)
        let formBlock = updateIsPermanentRecursively(triggeredActions);
        // if(formBlock.length){
        //     setForm(prevForm => ({
        //         ...prevForm,
        //         blocks: formBlock,
        //     }));
        // }
        console.log('triggeredActions', formBlock)
        formBlock.forEach(action => {
            console.log(action);
            if (action.type === 'show_hide' && (action.block || action.bindBlock)) {
                const updatedBlock = manageShowHide(action.block ?? action.bindBlock, action.rule.rule, blockValue) as BASIC_FIELD;
                setForm(prevForm => ({
                    ...prevForm,
                    blocks: prevForm.blocks.map(block => {
                        if (block.property.blocks?.length) {
                            const updatedLoopBlocks = block.property.blocks.map(loopBlock => {
                                if (loopBlock.property.id.includes(action.block.property.id)) {
                                    return updatedBlock as BASIC_FIELD;
                                }
                                return loopBlock;
                            });

                            return {
                                ...block,
                                property: {
                                    ...block.property,
                                    blocks: updatedLoopBlocks
                                }
                            };
                        }

                        if (action.block && block.property.id === action.block.property.id) {
                            return updatedBlock as BASIC_FIELD;
                        }

                        else if (action.bindBlock && block.property.id === action.bindBlock.property.id) {
                            return updatedBlock as BASIC_FIELD;
                        }

                        return block;
                    })
                }));

            } else if (action.type === 'bind' && action.bindBlock) {
                const updatedBlockValue = manageBind(action.bindBlock, blockValue, action.rule);
                console.log(updatedBlockValue)
                if (['Select', 'MultiSelectDropdown'].includes(action.bindBlock.is)) {
                    setForm(prevForm => ({
                        ...prevForm,
                        blocks: prevForm.blocks.map(block => {
                            if (block.property.blocks?.length) {
                                const updatedLoopBlocks = block.property.blocks.map(loopBlock => {
                                    if (loopBlock.property.id.includes(action.bindBlock.property.id)) {
                                        return updatedBlockValue as BASIC_FIELD;
                                    }
                                    return loopBlock;
                                });

                                return {
                                    ...block,
                                    property: {
                                        ...block.property,
                                        blocks: updatedLoopBlocks
                                    }
                                };
                            }

                            if (block.property.id === action.bindBlock.property.id) {
                                return updatedBlockValue as BASIC_FIELD;
                            }

                            return block;
                        })
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
        // alert('yeyeyehye')
        someRule();

    }, [localStorage.getItem('ifLoop')])

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

    useEffect(() => {
        if (validationErrorsList) {
            setValidationErrors(validationErrorsList);
        }
    }, [validationErrorsList])


    return (
        <div
            className='bg-white editor p-4 border rounded min-h-40 overflow-y-auto'
            id='Editor'
            onDrop={(e) => handleDrop(e, 'Editor')}
            onDragOver={(e) => handleDragOver(e, 'Editor')}
            onDragLeave={(e) => handleDragLeave(e, 'Editor')}
        >
            {/* {JSON.stringify(blockValue)} */}
            <fieldset disabled={isPreview}>
                <div className='d-flex flex-wrap'>
                    {form.blocks.length === 0 ? (
                        <p className="text-gray-400">Drag fields here...</p>
                    ) : (
                        form.blocks.map((block, index) => (
                            <div className={`col-lg-${block.property.size ? block.property.size : '12'}`}>
                                {form.editMode && (
                                    <div
                                        id={`TopBlock_${index}`}
                                        className={`drop-zone ${draggingOver[`TopBlock_${index}`] ? 'border-green' : ''}`}
                                        onDrop={(e) => handleDrop(e, `TopBlock_${index}`)}
                                        onDragOver={(e) => handleDragOver(e, `TopBlock_${index}`)}
                                        onDragLeave={(e) => handleDragLeave(e, `TopBlock_${index}`)}
                                    >
                                        {draggingOver[`TopBlock_${index}`] && (
                                            <p className="text-center text-gray-400">Drag it here</p>
                                        )}
                                    </div>
                                )}
                                <div
                                    id={block.property.id}
                                    key={index}
                                    className={`col-lg-12 p-2 rounded bg-gray-100 ${form.editMode ? 'border cursor-pointer' : ''} ${block.property.id === property.id ? 'border-green' : ''}`}
                                    onClick={() => handleProperty(block)}
                                    style={block.property.advance}
                                >
                                    <DynamicComponentRenderer
                                        form={form}
                                        setForm={setForm}
                                        setProperty={setProperty}
                                        componentType={block.is}
                                        block={block}
                                        handleChange={handleChange}
                                        validationErrors={validationErrors}
                                        blockValue={blockValue}
                                        setBlockValue={setBlockValue}
                                        pId={pId}
                                    />
                                </div>
                                {form.editMode && (
                                    <div
                                        id={`BottomBlock_${index + 1}`}
                                        className={`drop-zone ${draggingOver[`BottomBlock_${index + 1}`] ? 'border-green' : ''}`}
                                        onDrop={(e) => handleDrop(e, `BottomBlock_${index + 1}`)}
                                        onDragOver={(e) => handleDragOver(e, `BottomBlock_${index + 1}`)}
                                        onDragLeave={(e) => handleDragLeave(e, `BottomBlock_${index + 1}`)}
                                    >
                                        {draggingOver[`BottomBlock_${index + 1}`] && (
                                            <p className="text-center text-gray-400">Drag it here</p>
                                        )}
                                    </div>
                                )}
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
            </fieldset>
        </div>
    );
};

export default Editor;
