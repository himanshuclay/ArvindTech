import React, { useState, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import config from '@/config';

interface FileUploaderProps {
    additionalData: {
        ModuleID: string;
        CreatedBy: string;
        TaskCommonID: number;
        Task_Number: string;
        ProcessInitiationID: number;
        ProcessID: string;
        UpdatedBy: string;
    };
    onFileSelect: (files: File[]) => void;
    fileConfig: {
        fileType?: string; // e.g., '.png'
        fileSize?: string; // max file count e.g., '1' for one file
    };
}

export interface FileUploaderHandle {
    uploadFiles: () => Promise<void>;
}

const FileUploader = forwardRef<FileUploaderHandle, FileUploaderProps>(
    ({ additionalData, onFileSelect, fileConfig }, ref) => {
        console.log("bring him back0")
        console.log(additionalData)


        const [selectedFiles, setSelectedFiles] = useState<File[]>([]);


        const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            if (!event.target.files) return;

            const files = Array.from(event.target.files);

            const allowedExtension = fileConfig.fileType?.replace('.', '').toLowerCase();
            const maxFileCount = fileConfig.fileSize ? parseInt(fileConfig.fileSize, 10) : Infinity;

            const invalidFiles: string[] = [];

            const validFiles: File[] = files.filter(file => {
                const fileExtension = file.name.split('.').pop()?.toLowerCase();

                if (!allowedExtension) {
                    return true; // ✅ Allow any type if no fileType is specified
                }

                if (fileExtension !== allowedExtension) {
                    invalidFiles.push(`${file.name}: Invalid file type. Expected (${allowedExtension})`);
                    return false;
                }

                return true;
            });

            // Handle invalid file type
            if (invalidFiles.length > 0) {
                alert(`File validation failed:\n${invalidFiles.join('\n')}`);
                event.target.value = '';       // ✅ Reset the input
                setSelectedFiles([]);          // ✅ Clear files in state
                onFileSelect([]);              // ✅ Notify parent of empty selection
                return;
            }

            // Handle max file count validation
            if (validFiles.length > maxFileCount) {
                alert(`You can upload a maximum of ${maxFileCount} file(s).`);
                event.target.value = '';
                setSelectedFiles([]);
                onFileSelect([]);
                return;
            }

            // All good!
            setSelectedFiles(validFiles);
            onFileSelect(validFiles);
        };

        useImperativeHandle(ref, () => ({
            async uploadFiles() {
                console.log("bring him back")

                if (selectedFiles.length === 0) return;
                console.log("bring him back2")

                const formData = new FormData();
                selectedFiles.forEach((file) => {
                    formData.append('FileDetails', file);
                });

                formData.append('FileType', 'document');
                formData.append('fileUploadRequest.ModuleID', additionalData.ModuleID);
                formData.append('fileUploadRequest.ProcessID', additionalData.ProcessID);
                formData.append('fileUploadRequest.Task_Number', additionalData.Task_Number);
                formData.append('fileUploadRequest.ProcessInitiationID', additionalData.ProcessInitiationID.toString());
                formData.append('fileUploadRequest.TaskCommonID', additionalData.TaskCommonID.toString());
                formData.append('fileUploadRequest.CreatedBy', additionalData.CreatedBy);
                formData.append('fileUploadRequest.UpdatedBy', additionalData.UpdatedBy);

                try {
                    const response = await axios.post(
                        `${config.API_URL_ACCOUNT}/FileUpload/UploadFiles`,
                        formData,
                        {
                            headers: { 'Content-Type': 'multipart/form-data' },
                        }
                    );

                    if (response.status === 200) {
                        console.log('Files uploaded successfully');
                    } else {
                        console.error('File upload failed');
                    }
                } catch (error) {
                    console.error('Error uploading files:', error);
                }
            },
        }));

        return (
            <div className="flex flex-col items-center p-4 border-2 border-dashed rounded-2xl">
                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="mb-4"
                />

                {/* Optionally show file rules */}
                <div className="text-sm text-gray-600">
                    Allowed Type: {fileConfig.fileType || 'Any'} | Max Files: {fileConfig.fileSize || 'Unlimited'}
                </div>
            </div>
        );
    }
);

export default FileUploader;
