import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { BASIC_FIELD, BLOCK_VALUE } from '../Constant/Interface';

interface Props {
    block: BASIC_FIELD;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void;
    validationErrors?: { [key: string]: string };
    editMode?: boolean;
    blockValue: BLOCK_VALUE;
    setBlockValue: React.Dispatch<React.SetStateAction<BLOCK_VALUE>>;
}


const AmountInput: React.FC<Props> = ({
    block,
    handleChange,
    validationErrors = {},
    editMode,
    blockValue,
    setBlockValue
}) => {
    const isRequired = block.property.required === 'true';

    // Only allow numbers with optional 2 decimal places
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        setBlockValue((prevState) => ({
            ...prevState,
            [block.property.id]: value,
        }));

        handleChange(e, block.property.id);
    };

    return (
        <div>
            {(block.property.isShow || editMode) && (
                <Form.Group controlId={block.property.id} className="mb-3">
                    <Form.Label>
                        {block.property.label}
                        {isRequired && <span className="text-danger">*</span>}
                    </Form.Label>

                    <InputGroup>
                        <InputGroup.Text>{block.property.currencySymbol}</InputGroup.Text>
                        <Form.Control
                            type="text"
                            name={block.property.id}
                            value={blockValue[block.property.id] || ''}
                            onChange={handleInputChange}
                            placeholder={block.property.placeholder || 'Enter amount'}
                            disabled={editMode}
                            className={validationErrors[block.property.id] ? 'is-invalid' : ''}
                            inputMode="decimal" // Mobile numeric keypad
                            pattern="^\d*\.?\d{0,2}$" // HTML5 validation
                        />
                    </InputGroup>

                    {validationErrors[block.property.id] && (
                        <Form.Text className="text-danger">
                            {validationErrors[block.property.id]}
                        </Form.Text>
                    )}
                </Form.Group>
            )}
        </div>
    );
};

export default AmountInput;
