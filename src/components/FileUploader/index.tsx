import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Alert } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import useFileUploader from './useFileUploader';

export interface FileType extends File {
	preview?: string;
	formattedSize?: string;
}

interface FileUploaderProps extends ChildrenProps {
	onFileUpload?: (files: FileType[]) => void;
	showPreview?: boolean;
	additionalData: {
		ModuleID: string;
		CreatedBy: string;
		TaskCommonID: number;
		Task_Number: string;
		ProcessInitiationID: number;
		ProcessID: string;
		UpdatedBy: string;
	};
}

type ChildrenProps = {
	icon?: string;
	text?: string;
	textClass?: string;
	extraText?: string;
};

const FileUploader = ({
	showPreview = true,
	onFileUpload,
	icon,
	extraText,
	text,
	additionalData,
}: FileUploaderProps) => {
	const { selectedFiles, handleAcceptedFiles, removeFile } = useFileUploader(showPreview);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	// Generate a preview URL for the files (only if showPreview is enabled)
	const generatePreview = (file: FileType) => {
		if (showPreview && file.type.startsWith('image/')) {
			file.preview = URL.createObjectURL(file);
		}
		return file;
	};

	// Define the uploadFiles function
	const uploadFiles = async (files: FileType[], additionalData: object) => {
		const formData = new FormData();

		// Append each file to FormData
		files.forEach((file) => {
			formData.append('FileDetails', file);
		});

		// Append additional data to FormData
		Object.entries(additionalData).forEach(([key, value]) => {
			formData.append(`fileUploadRequest.${key}`, value);
		});

		formData.append('FileType', 'pdf');

		try {
			const response = await fetch('https://arvindo-api.clay.in/api/FileUpload/UploadFiles', {
				method: 'POST',
				body: formData,
			});

			if (!response.ok) {
				throw new Error(`File upload failed: ${response.statusText}`);
			}

			const result = await response.json();
			console.log('Upload successful:', result);

			setSuccessMessage('Files uploaded successfully!');

			if (selectedFiles.length > 0) {
				selectedFiles.forEach((file) => removeFile(file)); // Remove files after successful upload
			}

			if (onFileUpload) {
				onFileUpload(files);
			}
		} catch (error) {
			console.error('File upload error:', error);
		}
	};

	// Update the file upload function
	const handleFileUpload = (acceptedFiles: FileType[]) => {
		// Generate preview URLs for files (for image files only)
		const filesWithPreviews = acceptedFiles.map((file) => generatePreview(file));

		if (onFileUpload) {
			onFileUpload(filesWithPreviews);
		}
		uploadFiles(filesWithPreviews, additionalData);
	};

	return (
		<>
			<Dropzone onDrop={(acceptedFiles) => handleAcceptedFiles(acceptedFiles, handleFileUpload)}>
				{({ getRootProps, getInputProps }) => (
					<div className="dropzone">
						<div className="dz-message needsclick" {...getRootProps()}>
							<input {...getInputProps()} />
							<i className={`text-muted h1 ${icon}`} />
							<h3>{text}</h3>
							<span className="text-muted fs-13">{extraText}</span>
						</div>
					</div>
				)}
			</Dropzone>

			{successMessage && (
				<Alert variant="success" className="mt-3">
					{successMessage}
					<button onClick={() => setSuccessMessage(null)} className="btn-close" aria-label="Close"></button>
				</Alert>
			)}

			<div className="dropzone-previews mt-3">
				{(selectedFiles || []).map((file, idx) => (
					<Card className="mt-1 mb-0 shadow-none border" key={idx + '-file'}>
						<div className="p-2">
							<Row className="align-items-center">
								{file.preview && (
									<Col className="col-auto">
										<img
											data-dz-thumbnail=""
											className="avatar-sm rounded bg-light"
											alt={file.name}
											src={file.preview}
										/>
									</Col>
								)}
								{!file.preview && (
									<Col className="col-auto">
										<div className="avatar-sm">
											<span className="avatar-title bg-primary rounded">
												{file.type.split('/')[0].toUpperCase()}
											</span>
										</div>
									</Col>
								)}
								<Col className="ps-0">
									<Link to="#" className="text-muted fw-bold">
										{file.name}
									</Link>
									<p className="mb-0">
										<strong>{file.formattedSize}</strong>
									</p>
								</Col>
								<Col className="text-end">
									<Link
										to="#"
										className="btn btn-link btn-lg text-muted shadow-none"
									>
										<i
											className="ri-close-line text-danger"
											onClick={() => removeFile(file)}
										/>
									</Link>
								</Col>
							</Row>
						</div>
					</Card>
				))}
			</div>
		</>
	);
};

export { FileUploader };
