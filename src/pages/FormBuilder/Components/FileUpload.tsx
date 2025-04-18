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

const FileUpload: React.FC<Props> = ({
    block,
    handleChange,
    validationErrors = {},
    editMode,
    blockValue,
    setBlockValue
}) => {

    const isRequired = block.property.validation === "required";
    const isDisabled = !!(block.property.disabled);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setBlockValue((prevState) => ({
                ...prevState,
                [block.property.id]: file.name, // only the file name gets stored
            }));

            handleChange(e as unknown as React.ChangeEvent<HTMLInputElement>, block.property.id);
        }
    };


    const getFileName = () => {
        const file: any = blockValue[block.property.id];

        if (file instanceof File) {
            return file.name;
        }

        return file || '';
    };


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
                        type="file"
                        name={block.property.id}
                        onChange={handleFileChange}
                        disabled={isDisabled}
                        className={validationErrors[block.property.id] ? "is-invalid" : ""}
                    />

                    {getFileName() && (
                        <Form.Text className="d-block mt-2">
                            Selected file: <strong>{getFileName()}</strong>
                        </Form.Text>
                    )}

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

export default FileUpload;
