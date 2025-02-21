import React from 'react';
import { Form } from 'react-bootstrap';
import { BASIC_FIELD, BLOCK_VALUE } from '../Constant/Interface';


interface Props {
    block: BASIC_FIELD;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void;
    validationErrors?: { [key: string]: string };
    editMode?: boolean;
    blockValue: BLOCK_VALUE;
    setBlockValue: React.Dispatch<React.SetStateAction<BLOCK_VALUE>>;
}

const Select: React.FC<Props> = ({ block, handleChange, validationErrors = {}, editMode, blockValue, setBlockValue }) => {
    const isRequired = block.property.required === "true";

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        setBlockValue((prevState) => ({
            ...prevState,
            [block.property.id]: value,
        }));
        handleChange(e as unknown as React.ChangeEvent<HTMLInputElement>, block.property.id);
    };

    // useEffect(() => {
    //     console.log('11111111111111111111block', block)
    // })

    return (
        <div>
            {(block.property.isShow || editMode) && (
            <Form.Group controlId={block.property.id} className="mb-3">
                <Form.Label>
                    {block.property.label}
                    {isRequired && (
                        <span className='text-danger'>*</span>
                    )}
                </Form.Label>
                <Form.Select
                    name={block.property.id}
                    value={blockValue[block.property.id] || ''}
                    onChange={handleSelectChange}
                    disabled={editMode}
                    className={validationErrors[block.property.id] ? "is-invalid" : ""}
                >
                    <option value="">Please select</option>
                    {block.property.options.map((option, index) => (
                        <option key={index} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </Form.Select>

                {/* Display validation error if it exists */}
                {validationErrors[block.property.id] && (
                    <Form.Text className="text-danger">{validationErrors[block.property.id]}</Form.Text>
                )}

                {(block.property.options as any[]).length === 0 && (
                    <div className="cursor-pointer" style={{ pointerEvents: 'all' }}>
                        <a data-tooltip-id="tooltip" data-tooltip-content="Add Option First!">
                            <i className="ri-information-line" style={{ color: '#ff0000' }}></i>
                        </a>
                    </div>
                )}
            </Form.Group>
            )}
        </div>
    );
};

export default Select;
