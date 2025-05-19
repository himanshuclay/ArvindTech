import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { PROPERTY } from '../Constant/Interface';
import axios from 'axios';
import config from '@/config';

// Interfaces for the props
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

const FloatInput: React.FC<Props> = ({
    block,
    handleChange,
    validationErrors = {},
    editMode = false,
}) => {

    // Destructure block.property for cleaner code
    const {
        id,
        label,
        value,
        placeholder = 'Enter value',
        prefix = '',
        isShow = false,
        validation = 'false',
        decimalLimit = 2, // Default decimal limit
    } = block.property;

    const isRequired = validation === 'required';

    const handleFloatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        const regex = new RegExp(`^\\d*\\.?\\d{0,${decimalLimit}}$`);

        if (val === '' || regex.test(val)) {
            handleChange(e, id);
        }
    };

    const handleDublicacyCheker = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (block.property.validation === "duplicacyChecker") {
            const { value } = e.target;
            const response = await axios.get(
                `${config.API_URL_ACCOUNT}/ProcessInitiation/CheckData?MasterID=${block.property.masterID}&ColumnName=${block.property.ColumnID}&Value=${value}`);
            console.log(response)
            if(response.data.isSuccess){
                validationErrors[id] = `${block.property.label} is ${response.data.message}`;
            }
        }
    }

    const validationError = validationErrors[id];
    const disabled = editMode || block.property.disabled === 'true' ? true : false;

    if (!isShow && !editMode) return null;

    return (
        <Form.Group controlId={id} className="mb-3">
            <Form.Label>
                {label} {isRequired && <span className="text-danger">*</span>}
            </Form.Label>
            <InputGroup>
                {prefix && <InputGroup.Text>{prefix}</InputGroup.Text>}
                <Form.Control
                    type="text"
                    name={id}
                    value={value}
                    onChange={(e: React.ChangeEvent<any>) => {
                        handleFloatChange(e);
                        handleDublicacyCheker(e);
                    }}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={validationError ? 'is-invalid' : ''}
                    inputMode="decimal"
                    pattern={`^\\d*\\.?\\d{0,${decimalLimit}}$`}
                />
            </InputGroup>

            {validationError && (
                <Form.Text className="text-danger">{validationError}</Form.Text>
            )}
        </Form.Group>
    );
};

export default FloatInput;
