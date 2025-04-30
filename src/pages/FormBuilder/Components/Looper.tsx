
import React, { useEffect, useState } from "react";
import {
    BASIC_FIELD,
    BLOCK_VALUE,
    FIELD,
    PROPERTY,
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
    CheckboxInput
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
        handleLoopBlocks('ADD')
    }, []);

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
        droppedField.property.id = `Looper${block.property.blockCount ?? 1}`;

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
            if (block.property.loopBlocks?.length) {
                const newBlocks = block.property.loopBlocks.map(loopBlock => ({
                    ...loopBlock,
                    property: {
                        ...loopBlock.property,
                        id: `${block.property.id}_${loopBlock.property.id}_${Date.now()}`, // ensure unique ID
                    }
                }));

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
                            <button type="button" onClick={() => handleLoopBlocks('ADD')}>+</button>
                            <button type="button" onClick={() => handleLoopBlocks('REMOVE')}>-</button>
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
                                    <div className="d-flex flex-wrap flex-column gap-3 ">
                                        {(block.property.blocks?.length ?? 0) === 0 ? (
                                            <p className="text-gray-400">Drag fields here...</p>
                                        ) : (
                                            Array.from({
                                                length: Math.ceil((block.property.blocks?.length ?? 0) / (block.property.loopBlocks?.length || 1)),
                                            }).map((_, groupIndex) => {
                                                const groupSize = block.property.loopBlocks?.length || 1;
                                                const start = groupIndex * groupSize;
                                                const end = start + groupSize;
                                                const group = (block.property.blocks || []).slice(start, end);

                                                return (
                                                    <div key={groupIndex} className="border border-dashed border-blue-400 rounded p-2 mb-2 shadow-up">
                                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                                            <span className="text-sm font-semibold">Group {groupIndex + 1}</span>
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-danger"
                                                                disabled={
                                                                    Math.ceil((block.property.blocks?.length || 0) / (block.property.loopBlocks?.length || 1)) === 1
                                                                }
                                                                onClick={() => handleLoopBlocks("REMOVE_GROUP", groupIndex)}
                                                            >
                                                                Remove Group
                                                            </button>
                                                        </div>
                                                        <div className="d-flex flex-wrap">
                                                            {group.map((loopBlock, index) => (
                                                                <div
                                                                    className={`col-lg-${loopBlock.property.size || "12"}`}
                                                                    key={loopBlock.property.id || index}
                                                                >
                                                                    <div
                                                                        className={`col-lg-12 p-2 rounded bg-gray-100 ${form.editMode ? "border cursor-pointer" : ""}`}
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
                                                            ))}
                                                        </div>
                                                    </div>


                                                );
                                            })
                                        )}
                                    </div>


                                    Select Output Labels                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default Looper;
