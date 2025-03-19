import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { PROPERTY } from '../Constant/Interface';

interface Props {
    block: BasicField;  // Field with name and properties
    handleChange: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void;
    validationErrors?: { [key: string]: string };  // Optional validation errors
    editMode?: boolean;  // Disable input if true
}

interface BasicField {
    name: string;
    property: PROPERTY;
}

const AmountInput: React.FC<Props> = ({
    block,
    handleChange,
    validationErrors = {},
    editMode = false,
}) => {
    const isRequired = block.property.required === 'true';

    // Only allow numbers with optional 2 decimal places
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        // Regular expression for a number with up to 2 decimal places
        const regex = /^\d*\.?\d{0,2}$/;

        if (value === '' || regex.test(value)) {
            handleChange(e, block.property.id);
        }
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
                            value={block.property.value}
                            onChange={handleAmountChange}
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
