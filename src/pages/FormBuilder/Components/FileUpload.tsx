import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { BASIC_FIELD, BLOCK_VALUE } from '../Constant/Interface';
import axios from 'axios';
import config from '@/config';
import { toast } from 'react-toastify';

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
    const [files, setFiles] = useState<string[]>([]);

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

        const formData = new FormData();

        Array.from(files).forEach((file: File) => {
            console.log('file', file.name);
            formData.append('FileDetails', file);
        });


        // ✅ Append other fields
        formData.append('ProcessInitiationID', String(pId)); // no need to stringify a number
        formData.append('TaskCommonID', '0'); // if always 0 or dynamically passed, use String(...)


        try {
            const response = await axios.post(
                `${config.API_URL_ACCOUNT}/FileUpload/UploadFiles`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );
            if (response.data.isSuccess) {
                toast.success(response.data.message);
                block.property['uploadFile'] = JSON.stringify(response.data.files);
                setFiles(response.data.files);
                setBlockValue((prevState) => ({
                    ...prevState,
                    [block.property.id]: isMultiple ? response.data.files : response.data.files[0],
                }));
        
                handleChange(e, block.property.id);
            }
        } catch (error) {
            console.error('Error uploading files:', error);
        }
    };

    useEffect(() => {
        const fileData = blockValue[block.property.id];
        if (Array.isArray(fileData)) {
            setFiles(fileData);
        } else if (fileData) {
            setFiles([fileData]);
        } else {
            setFiles([]);
        }
    }, [blockValue[block.property.id]]);
    

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
                    {files.length && files.map((url: string, idx: number) => (
                        <div key={idx}>
                            <a href={url} target="_blank" rel="noopener noreferrer" download>
                                Download File {idx + 1}
                            </a>
                        </div>
                    ))}


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
