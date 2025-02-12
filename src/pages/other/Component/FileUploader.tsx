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
}

export interface FileUploaderHandle {
    uploadFiles: () => Promise<void>;
}

const FileUploader = forwardRef<FileUploaderHandle, FileUploaderProps>(({ additionalData, onFileSelect }, ref) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const files = Array.from(event.target.files);
            setSelectedFiles(files);
            onFileSelect(files);
        }
    };

    useImperativeHandle(ref, () => ({
        async uploadFiles() {
            if (selectedFiles.length === 0) return;

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
                const response = await axios.post(`${config.API_URL_APPLICATION}/FileUpload/UploadFiles`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                if (response.status === 200) {
                    console.log('Files uploaded successfully');
                } else {
                    console.error('File upload failed');
                }
            } catch (error) {
                console.error('Error uploading files:', error);
            }
        }
    }));

    return (
        <div className="flex flex-col items-center p-4 border-2 border-dashed rounded-2xl">
            <input type="file" multiple onChange={handleFileChange} className="mb-4" />
        </div>
    );
});

export default FileUploader;
