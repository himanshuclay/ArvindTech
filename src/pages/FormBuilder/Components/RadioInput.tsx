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


const RadioInput: React.FC<Props> = ({
    block,
    handleChange,
    validationErrors = {},
    editMode,
    blockValue,
    setBlockValue
}) => {
    // Only allow numbers with optional 2 decimal places
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = e.target;
    
        setBlockValue((prevState: any) => ({
            ...prevState,
            [name]: value, // name will be block.property.groupName or block.property.id
        }));
    
        handleChange(e, block.property.id);
    };
    

    return (
        <div>
            {(block.property.isShow || editMode) && (
                <Form.Group controlId={block.property.id} className="mb-3">
                    <Form.Check
                        type="radio"
                        name={block.property.groupName || block.property.id}
                        value={block.property.value}
                        label={block.property.label}
                        checked={blockValue[block.property.groupName || ''] === block.property.value}
                        onChange={handleInputChange}
                        disabled={editMode || block.property.disabled}
                        className={validationErrors[block.property.id] ? 'is-invalid' : ''}
                    />
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

export default RadioInput;
