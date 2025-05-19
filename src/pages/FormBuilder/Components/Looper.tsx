
import React, { useEffect, useState } from "react";
import {
    BASIC_FIELD,
    BLOCK_VALUE,
    FIELD,
    PROPERTY,
    RULE,
} from "../Constant/Interface";

interface Props {
    block: BASIC_FIELD;
    handleChange: (
        e: React.ChangeEvent<HTMLInputElement>,
        id: string
    ) => void;
    validationErrors?: { [key: string]: string };
    editMode?: boolean;
    blockValue: BLOCK_VALUE;
    setBlockValue: React.Dispatch<React.SetStateAction<BLOCK_VALUE>>;
    form: FIELD;
    setForm: React.Dispatch<React.SetStateAction<FIELD>>;
    setProperty: React.Dispatch<React.SetStateAction<PROPERTY>>;
    property: PROPERTY;
}


import TextInput from "./TextInput";
import NumberInput from "./NumberInput";
import EmailInput from "./EmailInput";
import PhoneInput from "./PhoneInput";
import Password from "./Password";
import Select from "./Select";
import DateRange from "./DateRange";
import FileUpload from "./FileUpload";
import DateInput from "./DateInput";
import MultiSelectDropdown from "./MultiSelect";
import AmountInput from "./AmountInput";
import Paragraph from './Paragraph';
import FloatInput from "./FloatInput";
import { speak } from "@/utils/speak";
import CheckboxInput from "./CheckboxInput";
import TableInput from "./TableInput";
import TextArea from "./TextArea";
import Modal from './Modal';

// import Blocks from "../Blocks/Blocks";

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
    Paragraph,
    CheckboxInput,
    TableInput,
    TextArea,
    Modal,
};

interface DynamicComponentProps {
    componentType: keyof typeof componentsMap;
    block: BASIC_FIELD;
    form: FIELD;
    setForm: React.Dispatch<React.SetStateAction<FIELD>>;
    handleChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
        id: string
    ) => void;
    validationErrors: { [key: string]: string };
    blockValue: BLOCK_VALUE;
    setBlockValue: React.Dispatch<React.SetStateAction<BLOCK_VALUE>>;
}

const DynamicComponentRenderer: React.FC<DynamicComponentProps> = ({
    componentType,
    block,
    form,
    setForm,
    handleChange,
    validationErrors,
    blockValue,
    setBlockValue,
}) => {
    const ComponentToRender = componentsMap[componentType];

    if (!ComponentToRender) return <p>Component not found</p>;

    return (
        <ComponentToRender
            block={block}
            handleChange={handleChange}
            validationErrors={validationErrors}
            editMode={form.editMode}
            blockValue={blockValue}
            setBlockValue={setBlockValue}
            form={form}
            setForm={setForm}
        />
    );
};


const Looper: React.FC<Props> = ({
    block,
    handleChange,
    validationErrors = {},
    editMode,
    blockValue,
    setBlockValue,
    form,
    setForm,
    setProperty,
    property,
}) => {
    const [, setValidationErrors] = useState<{ [key: string]: string }>({});




    useEffect(() => {
        if (block.property.value) {
            const initialValues = Array.isArray(block.property.value)
                ? block.property.value
                : [block.property.value];

            setBlockValue((prev) => ({
                ...prev,
                [block.property.id]: initialValues,
            }));
        }
        console.log(block.property.blocks?.length)
        if (!block.property.blocks || block.property.blocks?.length < 1) {
            handleLoopBlocks('ADD')
        }
    }, [, editMode]);

    const handleDrop = (
        e: React.DragEvent<HTMLDivElement>,
        dropZoneId: string
    ) => {
        e.stopPropagation();
        e.preventDefault();
        const fieldData = e.dataTransfer.getData("application/json");
        const dropZone = e.currentTarget.getAttribute("id");

        if (!fieldData || !dropZone) return;

        const droppedField: BASIC_FIELD = JSON.parse(fieldData);
        droppedField.property.id = `${block.property.id}_Looper${block.property.blockCount ?? 1}`;

        const updatedLoopBlocks: BASIC_FIELD[] = [
            ...(block.property.loopBlocks || []),
            droppedField,
        ];

        const updatedBlocks = form.blocks.map((b) =>
            b.property.id === block.property.id
                ? {
                    ...b,
                    property: {
                        ...b.property,
                        loopBlocks: updatedLoopBlocks,
                        blockCount: b.property.blockCount ? b.property.blockCount + 1 : 1,

                    },
                }
                : b
        );
        speak(`${droppedField.is} dropped successfully`);


        setForm((prevForm) => ({
            ...prevForm,
            blocks: updatedBlocks,
        }));

        handleDragLeave(e, dropZoneId);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, id: string) => {
        e.preventDefault();
        document.getElementById(id)?.classList.add("border-green");
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>, id: string) => {
        e.preventDefault();
        document.getElementById(id)?.classList.remove("border-green");
    };

    const handleInnerChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
        id: string
    ) => {
        const value = e.target.value;
        setForm((prev) => ({
            ...prev,
            blocks: prev.blocks.map((b) =>
                b.property.id === id
                    ? { ...b, property: { ...b.property, value } }
                    : b
            ),
        }));

        const field = form.blocks.find((b) => b.property.id === id);
        if (field?.property.required === "true" && value.trim() === "") {
            setValidationErrors((prev) => ({
                ...prev,
                [id]: `${field.property.label} is required`,
            }));
        } else {
            setValidationErrors((prev) => {
                const { [id]: _, ...rest } = prev;
                return rest;
            });
        }
    };

    const handlePropertyClick = (
        e: React.MouseEvent,
        loopBlock: BASIC_FIELD
    ) => {
        e.stopPropagation();
        if (form.editMode) {
            setProperty({ ...loopBlock.property });
        }
    };

    const handleLoopBlocks = (action: string, groupIndex?: number) => {
        const loopBlockCount = block.property.loopBlocks?.length || 1;

        if (action === "ADD") {
            const existingValue = localStorage.getItem('ifLoop');
            const newValue = existingValue == 'true' ? 'false' : 'true';
            localStorage.setItem('ifLoop', newValue);

            if (block.property.loopBlocks?.length) {

                const updatedRules: RULE[] = [];
                const originalRules = [...form.rules]; // snapshot of original rules

                const nextIndex = block.property.blocks?.length ?? 0;

                const newBlocks = block.property.loopBlocks.map((loopBlock, idx) => {
                    const newId = `${loopBlock.property.id}_${nextIndex + idx}`;

                    // Always check from the original rules snapshot
                    originalRules
                        .filter(rule => rule.start2 === loopBlock.property.id)
                        .forEach(rule => {
                            updatedRules.push({ ...rule, start2: newId });
                        });

                    return {
                        ...loopBlock,
                        property: {
                            ...loopBlock.property,
                            id: newId,
                        },
                    };
                });

                setForm(prev => ({
                    ...prev,
                    blocks: prev.blocks.map(b =>
                        b.property.id === block.property.id
                            ? {
                                ...b,
                                property: {
                                    ...b.property,
                                    blocks: [...(b.property.blocks || []), ...newBlocks],
                                },
                            }
                            : b
                    ),
                    rules: [...prev.rules, ...updatedRules], // 👈 Append to existing rules
                }));



            }
        }

        if (action === "REMOVE_GROUP" && typeof groupIndex === "number") {
            const start = groupIndex * loopBlockCount;

            setForm(prev => ({
                ...prev,
                blocks: prev.blocks.map(b =>
                    b.property.id === block.property.id
                        ? {
                            ...b,
                            property: {
                                ...b.property,
                                blocks: (b.property.blocks || []).filter(
                                    (_, idx) => idx < start || idx >= start + loopBlockCount
                                ),
                            },
                        }
                        : b
                ),
            }));
        }
    };


    return (
        <div>
            {(block.property.isShow || editMode) && (
                <>
                    <div className={`${editMode ? "cursor-not-allowed" : ""}`}>
                        <fieldset
                            className={`${editMode ? "pointer-events-none select-none" : ""}`}
                        >
                            <button type="button" onClick={() => handleLoopBlocks('ADD')} className="btn btn-sm btn-success">Add Group</button>
                        </fieldset>
                    </div>

                    {block.property.isLooping === "true" && (
                        <>
                            {editMode ? (
                                <div
                                    className="bg-white p-4 border rounded min-h-40 overflow-y-auto"
                                    id="Looper"
                                    onDrop={(e) => handleDrop(e, "Looper")}
                                    onDragOver={(e) => handleDragOver(e, "Looper")}
                                    onDragLeave={(e) => handleDragLeave(e, "Looper")}
                                >
                                    <div className="d-flex flex-wrap">
                                        {block.property.loopBlocks?.length === 0 ? (
                                            <p className="text-gray-400">Drag fields here...</p>
                                        ) : (
                                            block.property.loopBlocks?.map((loopBlock, index) => (
                                                <div
                                                    className={`col-lg-${loopBlock.property.size || "12"}`}
                                                    key={loopBlock.property.id || index}
                                                >
                                                    <div
                                                        className={`col-lg-12 p-2 rounded bg-gray-100 ${form.editMode ? 'border cursor-pointer' : ''} ${loopBlock.property.id === property.id ? 'border-green' : ''}`}

                                                        onClick={(e) => handlePropertyClick(e, loopBlock)}
                                                        style={loopBlock.property.advance}
                                                    >
                                                        <DynamicComponentRenderer
                                                            form={form}
                                                            setForm={setForm}
                                                            componentType={loopBlock.is}
                                                            block={loopBlock}
                                                            handleChange={handleInnerChange}
                                                            validationErrors={validationErrors}
                                                            blockValue={blockValue}
                                                            setBlockValue={setBlockValue}
                                                        />
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className="bg-white p-4 border rounded min-h-40 overflow-y-auto"
                                    id="Looper"
                                    onDrop={(e) => handleDrop(e, "Looper")}
                                    onDragOver={(e) => handleDragOver(e, "Looper")}
                                    onDragLeave={(e) => handleDragLeave(e, "Looper")}
                                >
                                    {JSON.stringify(block.property.blocks)}
                                    <div className="d-flex flex-wrap flex-column gap-3 ">
                                        {(block.property.blocks?.length ?? 0) === 0 ? (
                                            <p className="text-gray-400">Drag fields here...</p>
                                        ) : (
                                            block.property.blocks?.map((loopBlock, index) => (
                                                <>
                                                    {index % (block.property.loopBlocks?.length || 1) == 0 && (
                                                        <button type="button" onClick={() => handleLoopBlocks('REMOVE_GROUP', index)} className="btn btn-sm btn-success">-</button>
                                                    )}
                                                    <div
                                                        className={`col-lg-${loopBlock.property.size || "12"}`}
                                                        key={loopBlock.property.id || index}
                                                    >
                                                        <div
                                                            className={`col-lg-12 p-2 rounded bg-gray-100 ${form.editMode ? "border cursor-pointer" : ""
                                                                }`}
                                                            onClick={(e) => handlePropertyClick(e, loopBlock)}
                                                            style={loopBlock.property.advance}
                                                        >
                                                            <DynamicComponentRenderer
                                                                form={form}
                                                                setForm={setForm}
                                                                componentType={loopBlock.is}
                                                                block={loopBlock}
                                                                handleChange={handleInnerChange}
                                                                validationErrors={validationErrors}
                                                                blockValue={blockValue}
                                                                setBlockValue={setBlockValue}
                                                            />
                                                        </div>
                                                    </div>


                                                </>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default Looper;
