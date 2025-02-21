import React from 'react';
import { Form } from 'react-bootstrap';
import { BASIC_FIELD, BLOCK_VALUE } from '../Constant/Interface';

interface Props {
    block: BASIC_FIELD;  
    handleChange: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void;
    validationErrors?: { [key: string]: string };  
    editMode?: boolean;  
    blockValue: BLOCK_VALUE;
}

const TextInput: React.FC<Props> = ({ block, handleChange, validationErrors = {}, editMode, blockValue }) => {
    const isRequired = block.property.required === "true";
    
    // Adding condition to disable based on editMode or block property
    const isDisabled = !!(block.property.disabled);

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
                    {isDisabled}
                    <Form.Control
                        type="text"
                        name={block.property.id}
                        value={blockValue[block.property.id] || ''}
                        onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>, block.property.id)}  
                        placeholder={block.property.placeholder}
                        disabled={isDisabled}
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
