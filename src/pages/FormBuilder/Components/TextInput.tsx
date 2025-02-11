import React from 'react';
import { Form } from 'react-bootstrap';
import { BASIC_FIELD } from '../Constant/Interface';

interface Props {
    block: BASIC_FIELD;  
    handleChange: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void;
    validationErrors?: { [key: string]: string };  
    editMode?: boolean;  
}

const TextInput: React.FC<Props> = ({ block, handleChange, validationErrors = {}, editMode }) => {
    const isRequired = block.property.required === "true";

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
                <Form.Control
                    type="text"
                    name={block.property.id}
                    value={block.property.value}
                    onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>, block.property.id)}  
                    placeholder={block.property.placeholder}
                    disabled={editMode}  
                    className={validationErrors[block.property.id] ? "is-invalid" : ""}
                />

                {validationErrors[block.property.id] && (
                    <Form.Text className="text-danger">{validationErrors[block.property.id]}</Form.Text>
                )}
            </Form.Group>
            )}
        </div>
    );
};

export default TextInput;
