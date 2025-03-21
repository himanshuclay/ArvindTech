import React, { useEffect } from "react";
// import Select from "react-select";
import { BASIC_FIELD, BLOCK_VALUE, FIELD } from "../Constant/Interface";
// import TextInput from "./TextInput";
// import NumberInput from "./NumberInput";
// import EmailInput from "./EmailInput";
// import PhoneInput from "./PhoneInput";
// import Password from "./Password";
// import Select from "./Select";
// import DateRange from "./DateRange";
// import FileUpload from "./FileUpload";
// import DateInput from "./DateInput";
// import MultiSelectDropdown from "./MultiSelect";
// import AmountInput from "./AmountInput";
// import FloatInput from "./FloatInput";


interface Props {
    block: BASIC_FIELD;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void;
    validationErrors?: { [key: string]: string };
    editMode?: boolean;
    blockValue: BLOCK_VALUE;
    setBlockValue: React.Dispatch<React.SetStateAction<BLOCK_VALUE>>;
    form: FIELD;
    setForm: React.Dispatch<React.SetStateAction<FIELD>>;
}
// const componentsMap = {
//     TextInput,
//     NumberInput,
//     EmailInput,
//     PhoneInput,
//     Password,
//     Select,
//     DateRange,
//     FileUpload,
//     DateInput,
//     MultiSelectDropdown,
//     AmountInput,
//     FloatInput,
// };

// interface DynamicComponentProps {
//     componentType: keyof typeof componentsMap;
//     block: BASIC_FIELD;
//     form: FIELD;
//     setForm: React.Dispatch<React.SetStateAction<FIELD>>;
//     handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, id: string) => void;
//     validationErrors: { [key: string]: string };
//     blockValue: BLOCK_VALUE;
//     setBlockValue: React.Dispatch<React.SetStateAction<BLOCK_VALUE>>;
// }

const Looper: React.FC<Props> = ({
    block,
    handleChange,
    validationErrors = {},
    editMode,
    blockValue,
    setBlockValue,
    form,
    setForm,
}) => {
    // const isRequired = block.property.required === "true";

    // Convert block options into react-select format
    // const options = block.property.options?.map((option) => ({
    //     value: option.value,
    //     label: option.label
    // }));

    // const selectedValues = blockValue[block.property.id] || [];

    // Convert selectedValues into react-select format
    // const selectedOptions = options?.filter((opt) => selectedValues.includes(opt.value)) || [];

    // const handleMultiSelectChange = (selected: any) => {
    //     const selectedValues = selected ? selected.map((opt: any) => opt.value) : [];

    //     setBlockValue((prevState) => ({
    //         ...prevState,
    //         [block.property.id]: selectedValues
    //     }));

    //     handleChange(selectedValues, block.property.id);
    // };

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

        const fieldData = e.dataTransfer.getData('application/json');
        const dropZone = e.currentTarget.getAttribute('id');

        if (!fieldData || !dropZone) return;

        const droppedField: BASIC_FIELD = JSON.parse(fieldData);

        // Check if dropped in main MultiSelect area (Looper)
        if (dropZone === "Looper") {
            // Ensure `droppedField` has the correct `id` and matches the `FIELD` structure
            droppedField.property.id = `Looper${block.property.blockCount ? block.property.blockCount + 1 : 1}`;

            // Manually create a FIELD object by adding required properties to droppedField
            const droppedFieldAsField: FIELD = {
                ...droppedField, // Spread BASIC_FIELD properties
                blocks: [], // Add default blocks
                blockCount: 0, // Default block count
                editMode: false, // Set default edit mode
                rules: [], // Empty rules
                advance: {
                    backgroundColor: '',
                    color: ''
                } // Empty advance (or use a default value)
            };

            // Ensure `loopBlocks` is an array (falling back to an empty array if undefined)
            const loopBlocks: FIELD[] = [
                ...(block.property.loopBlocks || []),  // Ensure it's an array
                droppedFieldAsField  // Add the new droppedField with the correct structure
            ];

            // Update the block with the new loopBlocks
            const updatedBlocks = form.blocks?.map(b =>
                b.property.id === block.property.id
                    ? { ...b, property: { ...b.property, loopBlocks } } // Update the block's loopBlocks with the new array
                    : b
            ) || [];  // Fallback to an empty array if form.blocks is undefined

            console.log('updatedBlocks', updatedBlocks);

            // Assuming you want to update the form state with the new `updatedBlocks` array
            setForm(prevForm => ({
                ...prevForm,
                blocks: updatedBlocks, // Correctly update the blocks in form state
            }));
        }

        else if (dropZone.startsWith("TopBlock_") || dropZone.startsWith("BottomBlock_")) {
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

    // const DynamicComponentRenderer: React.FC<DynamicComponentProps> = ({ form, setForm, componentType, block, handleChange, validationErrors, blockValue, setBlockValue }) => {
    //     const ComponentToRender = componentsMap[componentType];

    //     if (!ComponentToRender) {
    //         return <p>Component not found!</p>;
    //     }

    //     return (
    //         // <div className={`${form.editMode ? 'cursor-not-allowed' : ''}`}>
    //         //     <fieldset className={`${form.editMode ? 'pointer-events-none select-none' : ''}`}>
    //         <ComponentToRender
    //             block={block}
    //             handleChange={handleChange}
    //             validationErrors={validationErrors}
    //             editMode={form.editMode}
    //             blockValue={blockValue}
    //             setBlockValue={setBlockValue}
    //             form={form}
    //             setForm={setForm}
    //         />
    //         //     </fieldset>
    //         // </div>
    //     );
    // };

    return (
        <div>
            {(block.property.isShow || editMode) && (
                <>
                    <div className={`${editMode ? 'cursor-not-allowed' : ''}`}>
                        <fieldset className={`${editMode ? 'pointer-events-none select-none' : ''}`}>
                            <button type="button">+</button>
                        </fieldset>
                    </div>
                    {block.property.isLooping === "true" && (
                        <div
                            className='bg-white p-4 border rounded min-h-40 overflow-y-auto'
                            id='Looper'
                            onDrop={(e) => handleDrop(e, 'Looper')}
                            onDragOver={(e) => handleDragOver(e, 'Looper')}
                            onDragLeave={(e) => handleDragLeave(e, 'Looper')}
                        >
                            <div className='d-flex flex-wrap'>

                                {block.property.loopBlocks && block.property.loopBlocks.length === 0 ? (
                                    <p className="text-gray-400">Drag fields here...</p>
                                ) : (
                                    block.property.loopBlocks && block.property.loopBlocks.map((loopBlock, index) => {
                                        // Assuming loopBlock is a JSON string, parse it
                                        // const parsedLoopBlock = JSON.parse(loopBlock);
                                        console.log(loopBlock);

                                        return (<></>
                                        //     <div key={index}>
                                        //         {/* Render your parsed loopBlock here */}
                                        //         {parsedLoopBlock} {/* Or however you'd like to display parsedLoopBlock */}
                                        //     </div>
                                        );
                                    })

                                    // block.property.loopBlocks && block.property.loopBlocks.map((JSON.parse(loopBlock), index) => (
                                    // <>{JSON.stringify(JSON.parse(loopBlock).property)}</>
                                    // <div className={`col-lg-${loopBlock.property.size ? loopBlock.property.size : '12'}`}>
                                    //     {/* <div
                                    //         id={`TopBlock_${index}`}
                                    //         className={`drop-zone ${draggingOver[`TopBlock_${index}`] ? 'border-green' : ''}`}
                                    //         onDrop={(e) => handleDrop(e, `TopBlock_${index}`)}
                                    //         onDragOver={(e) => handleDragOver(e, `TopBlock_${index}`)}
                                    //         onDragLeave={(e) => handleDragLeave(e, `TopBlock_${index}`)}
                                    //     >
                                    //         {draggingOver[`TopBlock_${index}`] && (
                                    //             <p className="text-center text-gray-400">Drag it here</p>
                                    //         )}
                                    //     </div> */}

                                    //     <div
                                    //         id={loopBlock.property.id}
                                    //         key={index}
                                    //         className={`col-lg-12 p-2 rounded bg-gray-100 ${form.editMode ? 'border cursor-pointer' : ''} ${loopBlock.property.id === property.id ? 'border-green' : ''}`}
                                    //         onClick={() => handleProperty(loopBlock)}
                                    //         style={loopBlock.property.advance}
                                    //     >
                                    //         <DynamicComponentRenderer
                                    //             form={form}
                                    //             componentType={loopBlock.is}
                                    //             block={loopBlock}
                                    //             handleChange={handleChange}
                                    //             validationErrors={validationErrors}
                                    //             blockValue={blockValue}
                                    //             setBlockValue={setBlockValue}
                                    //         />
                                    //     </div>
                                    //     {/* <div
                                    //         id={`BottomBlock_${index + 1}`}
                                    //         className={`drop-zone ${draggingOver[`BottomBlock_${index + 1}`] ? 'border-green' : ''}`}
                                    //         onDrop={(e) => handleDrop(e, `BottomBlock_${index + 1}`)}
                                    //         onDragOver={(e) => handleDragOver(e, `BottomBlock_${index + 1}`)}
                                    //         onDragLeave={(e) => handleDragLeave(e, `BottomBlock_${index + 1}`)}
                                    //     >
                                    //         {draggingOver[`BottomBlock_${index + 1}`] && (
                                    //             <p className="text-center text-gray-400">Drag it here</p>
                                    //         )}
                                    //     </div> */}
                                    // </div>
                                    // ))
                                    // <></>
                                )}
                            </div>

                        </div>
                    )}
                </>

            )}
        </div>
    );
};

export default Looper;
