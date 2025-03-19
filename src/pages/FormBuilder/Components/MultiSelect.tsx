import React, { useEffect } from "react";
import Select from "react-select";
import { BASIC_FIELD, BLOCK_VALUE } from "../Constant/Interface";

interface Props {
    block: BASIC_FIELD;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void;
    validationErrors?: { [key: string]: string };
    editMode?: boolean;
    blockValue: BLOCK_VALUE;
    setBlockValue: React.Dispatch<React.SetStateAction<BLOCK_VALUE>>;
}

const MultiSelectDropdown: React.FC<Props> = ({
    block,
    handleChange,
    validationErrors = {},
    editMode,
    blockValue,
    setBlockValue
}) => {
    const isRequired = block.property.required === "true";

    // Convert block options into react-select format
    const options = block.property.options?.map((option) => ({
        value: option.value,
        label: option.label
    }));

    const selectedValues = blockValue[block.property.id] || [];

    // Convert selectedValues into react-select format
    const selectedOptions = options?.filter((opt) => selectedValues.includes(opt.value)) || [];

    const handleMultiSelectChange = (selected: any) => {
        const selectedValues = selected ? selected.map((opt: any) => opt.value) : [];

        setBlockValue((prevState) => ({
            ...prevState,
            [block.property.id]: selectedValues
        }));

        handleChange(selectedValues, block.property.id);
    };

    useEffect(() => {
        if (block.property.value) {
            const initialValues = Array.isArray(block.property.value)
                ? block.property.value
                : [block.property.value];

            setBlockValue((prevState) => ({
                ...prevState,
                [block.property.id]: initialValues
            }));
        }
    }, []);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropZoneId: string) => {
        e.preventDefault();
        e.stopPropagation();

        // setDraggingOver(prevState => ({ ...prevState, [dropZoneId]: false })); // Reset dragging over state

        const fieldData = e.dataTransfer.getData('application/json');
        const dropZone = e.currentTarget.getAttribute('id');

        if (!fieldData || !dropZone) return;

        // const droppedField: BASIC_FIELD = JSON.parse(fieldData);

        // Check if dropped in main MultiSelect area
        if (dropZone === "MultiSelect") {
            // droppedField.property.id = `Block_${form.blockCount + 1}`;

            // setForm(prevForm => ({
            //     ...prevForm,
            //     blocks: [...prevForm.blocks, droppedField],
            //     blockCount: prevForm.blockCount + 1,
            // }));

            // Check if dropped in a specific block area
        } else if (dropZone.startsWith("TopBlock_") || dropZone.startsWith("BottomBlock_")) {
            // Extract block index or any other logic you want
            const blockIndex = parseInt(dropZone.split("_")[1], 10);

            if (!isNaN(blockIndex)) {
                // Example: Insert droppedField after this index
                // droppedField.property.id = `Block_${form.blockCount + 1}`;

                // setForm(prevForm => {
                //     const updatedBlocks = [...prevForm.blocks];
                //     updatedBlocks.splice(blockIndex, 0, droppedField);

                //     return {
                //         ...prevForm,
                //         blocks: updatedBlocks,
                //         blockCount: prevForm.blockCount + 1,
                //     };
                // });
            }
        }

        handleDragLeave(e, dropZoneId);
    };
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, dropZoneId: string) => {
        e.preventDefault();
        e.stopPropagation();
        // setDraggingOver(prevState => ({ ...prevState, [dropZoneId]: true })); // Set dragging over state to true

        const dropZone = e.currentTarget.getAttribute('id');
        document.getElementById(`${dropZone}`)?.classList.add('border-green');
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>, dropZoneId: string) => {
        e.preventDefault();
        e.stopPropagation();
        // setDraggingOver(prevState => ({ ...prevState, [dropZoneId]: false })); // Reset dragging over state

        const dropZone = e.currentTarget.getAttribute('id');
        document.getElementById(`${dropZone}`)?.classList.remove('border-green');
    };

    return (
        <div>
            {(block.property.isShow || editMode) && (
                <div className="mb-3">
                    <label>
                        {block.property.label}
                        {isRequired && <span className="text-danger">*</span>}
                    </label>

                    <Select
                        isMulti
                        options={options}
                        value={selectedOptions}
                        onChange={handleMultiSelectChange}
                        isDisabled={editMode}
                        className={validationErrors[block.property.id] ? "is-invalid" : ""}
                    />

                    {validationErrors[block.property.id] && (
                        <small className="text-danger">{validationErrors[block.property.id]}</small>
                    )}
                    {block.property.isLooping  === "true" && (
                        <div
                            className='bg-white p-4 border rounded min-h-40 overflow-y-auto'
                            id='MultiSelect'
                            onDrop={(e) => handleDrop(e, 'MultiSelect')}
                            onDragOver={(e) => handleDragOver(e, 'MultiSelect')}
                            onDragLeave={(e) => handleDragLeave(e, 'MultiSelect')}
                        >
                            <div className='d-flex flex-wrap'>


                                {block.property.loopBlocks && block.property.loopBlocks.length === 0 ? (
                                    <p className="text-gray-400">Drag fields here...</p>
                                ) : (
                                    // form.blocks.map((block, index) => (
                                    //     <div className={`col-lg-${block.property.size ? block.property.size : '12'}`}>
                                    //         <div
                                    //             id={`TopBlock_${index}`}
                                    //             className={`drop-zone ${draggingOver[`TopBlock_${index}`] ? 'border-green' : ''}`}
                                    //             onDrop={(e) => handleDrop(e, `TopBlock_${index}`)}
                                    //             onDragOver={(e) => handleDragOver(e, `TopBlock_${index}`)}
                                    //             onDragLeave={(e) => handleDragLeave(e, `TopBlock_${index}`)}
                                    //         >
                                    //             {draggingOver[`TopBlock_${index}`] && (
                                    //                 <p className="text-center text-gray-400">Drag it here</p>
                                    //             )}
                                    //         </div>

                                    //         <div
                                    //             id={block.property.id}
                                    //             key={index}
                                    //             className={`col-lg-12 p-2 rounded bg-gray-100 ${form.editMode ? 'border cursor-pointer' : ''} ${block.property.id === property.id ? 'border-green' : ''}`}
                                    //             onClick={() => handleProperty(block)}
                                    //             style={block.property.advance}
                                    //         >
                                    //             <DynamicComponentRenderer
                                    //                 form={form}
                                    //                 componentType={block.is}
                                    //                 block={block}
                                    //                 handleChange={handleChange}
                                    //                 validationErrors={validationErrors}
                                    //                 blockValue={blockValue}
                                    //                 setBlockValue={setBlockValue}
                                    //             />
                                    //         </div>
                                    //         <div
                                    //             id={`BottomBlock_${index + 1}`}
                                    //             className={`drop-zone ${draggingOver[`BottomBlock_${index + 1}`] ? 'border-green' : ''}`}
                                    //             onDrop={(e) => handleDrop(e, `BottomBlock_${index + 1}`)}
                                    //             onDragOver={(e) => handleDragOver(e, `BottomBlock_${index + 1}`)}
                                    //             onDragLeave={(e) => handleDragLeave(e, `BottomBlock_${index + 1}`)}
                                    //         >
                                    //             {draggingOver[`BottomBlock_${index + 1}`] && (
                                    //                 <p className="text-center text-gray-400">Drag it here</p>
                                    //             )}
                                    //         </div>
                                    //     </div>
                                    // ))
                                    <></>
                                )}
                            </div>

                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MultiSelectDropdown;
