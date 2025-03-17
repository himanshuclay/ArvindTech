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
                </div>
            )}
        </div>
    );
};

export default MultiSelectDropdown;
