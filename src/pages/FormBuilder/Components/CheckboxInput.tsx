import React from 'react';
import { Form } from 'react-bootstrap';
import { BASIC_FIELD, BLOCK_VALUE } from '../Constant/Interface';

interface Props {
    block: BASIC_FIELD;
    blockValue: BLOCK_VALUE;
    setBlockValue: React.Dispatch<React.SetStateAction<BLOCK_VALUE>>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void;
    validationErrors?: { [key: string]: string };
    editMode?: boolean;
}

const CheckboxInput: React.FC<Props> = ({
    block,
    blockValue,
    setBlockValue,
    handleChange,
    validationErrors = {},
    editMode = false,
}) => {

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;

        setBlockValue((prevState) => ({
            ...prevState,
            [name]: checked ? 'true' : 'false',
          }));
          

        handleChange(e, block.property.id);
    };

    const isVisible = block.property.isShow || editMode;

    return (
        <>
            {isVisible && (
                <Form.Group controlId={block.property.id} className="mb-3">
                    <Form.Check
                        type="checkbox"
                        id={block.property.id}
                        name={block.property.id}
                        label={block.property.label}
                        checked={!!blockValue[block.property.id]}
                        onChange={handleInputChange}
                        disabled={editMode || block.property.disabled === 'true' ? true : false}
                        className={validationErrors[block.property.id] ? 'is-invalid' : ''}
                    />
                    {validationErrors[block.property.id] && (
                        <Form.Text className="text-danger">
                            {validationErrors[block.property.id]}
                        </Form.Text>
                    )}
                </Form.Group>
            )}
        </>
    );
};

export default CheckboxInput;
