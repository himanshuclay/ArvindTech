import React from 'react';
import { Form } from 'react-bootstrap';
import { BASIC_FIELD, BLOCK_VALUE } from '../Constant/Interface';
import axios from 'axios';
import config from '@/config';

interface Props {
    block: BASIC_FIELD;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void;
    validationErrors?: { [key: string]: string };
    editMode?: boolean;
    blockValue: BLOCK_VALUE;
    setBlockValue: React.Dispatch<React.SetStateAction<BLOCK_VALUE>>;
    pId?: number;
}

const FileUpload: React.FC<Props> = ({
    block,
    handleChange,
    validationErrors = {},
    editMode,
    blockValue,
    setBlockValue,
    pId,
}) => {
    const isRequired = block.property.validation === "required";
    const isDisabled = !!(block.property.disabled);
    const isMultiple = !!block.property.multiple; // add `multiple` flag in block.property if not already

    const handleFileChange = (e: React.ChangeEvent<any>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const fileNames = Array.from(files as File[]).map(file => file.name);

        setBlockValue((prevState) => ({
            ...prevState,
            [block.property.id]: isMultiple ? fileNames : fileNames[0],
        }));

        handleChange(e, block.property.id);
    };

    const uploadFiles = async (e: React.ChangeEvent<any>) => {
        const { files } = e.target as HTMLInputElement;
        if (!files || files.length === 0) return;

        console.log("Uploading files...");

        const formData = new FormData();
        Array.from(files).forEach((file: File) => {
            formData.append('FileDetails', file);
        });

        formData.append('ProcessInitiationID', JSON.stringify(pId));

        try {
            const response = await axios.post(
                `${config.API_URL_ACCOUNT}/FileUpload/UploadFiles`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );
            console.log(response)
        } catch (error) {
            console.error('Error uploading files:', error);
        }
    };

    const getFileName = () => {
        const fileData = blockValue[block.property.id];
        if (Array.isArray(fileData)) {
            return fileData.join(', ');
        }
        return fileData || '';
    };

    return (
        <div>
            {(block.property.isShow || editMode) && (
                <Form.Group controlId={block.property.id} className="mb-3">
                    <Form.Label>
                        {block.property.label}
                        {isRequired && <span className="text-danger">*</span>}
                    </Form.Label>

                    <Form.Control
                        type="file"
                        name={block.property.id}
                        multiple={isMultiple}
                        onChange={(e) => {
                            handleFileChange(e);
                            uploadFiles(e);
                        }}
                        disabled={isDisabled}
                        className={validationErrors[block.property.id] ? "is-invalid" : ""}
                    />

                    {getFileName() && (
                        <Form.Text className="d-block mt-2">
                            Selected file{isMultiple ? 's' : ''}: <strong>{getFileName()}</strong>
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
