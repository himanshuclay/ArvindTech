import React from 'react';
import { Form } from 'react-bootstrap';

interface Props {
    block: BasicField;  // Single block with name and properties
    handleChange: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void;
    validationErrors?: { [key: string]: string };  // Optional validation errors
    editMode?: boolean;  // Optional prop to disable input
}

interface PROPERTY {
    label: string;
    id: string;
    placeholder: string;
    value: string;
    required: string;  // 'true' or 'false' as string
}

interface BasicField {
    name: string;
    property: PROPERTY;
}

const TextInput: React.FC<Props> = ({ block, handleChange, validationErrors = {}, editMode = false }) => {
    const isRequired = block.property.required === "true";

    return (
        <div>
            <Form.Group controlId={block.property.id} className="mb-3">
                <Form.Label>
                    {block.property.label}
                    {isRequired && (
                        <span className='text-danger'>*</span>
                    )}
                </Form.Label>
                <Form.Control
                    type="email"
                    name={block.property.id}
                    value={block.property.value}
                    onChange={(e) => handleChange(e, block.property.id)}  // Handle change with ID
                    placeholder={block.property.placeholder}
                    disabled={editMode}  // Disable input if in edit mode
                    className={validationErrors[block.property.id] ? "is-invalid" : ""}
                />

                {/* Display validation error if it exists */}
                {validationErrors[block.property.id] && (
                    <Form.Text className="text-danger">{validationErrors[block.property.id]}</Form.Text>
                )}
            </Form.Group>
        </div>
    );
};

export default TextInput;
