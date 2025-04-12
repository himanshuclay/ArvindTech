import { useState } from 'react';
import { FileType } from './index';

export default function useFileUploader(showPreview: boolean = true) {
	const [selectedFiles, setSelectedFiles] = useState<FileType[]>([]);

	/**
	 * Handles the accepted files and shows the preview
	 */
	const handleAcceptedFiles = (
		files: FileType[],
		callback?: (files: FileType[]) => void
	) => {
		let allFiles = files;

		if (showPreview) {
			files.forEach((file) =>
				Object.assign(file, {
					preview: file['type'].split('/')[0] === 'image'
						? URL.createObjectURL(file)
						: null,
					formattedSize: formatBytes(file.size),
				})
			);

			allFiles = [...selectedFiles, ...files]; // Combine existing and new files
			setSelectedFiles(allFiles);
		}

		if (callback) callback(allFiles);
	};

	/**
	 * Formats the size
	 */
	const formatBytes = (bytes: number, decimals: number = 2) => {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const dm = decimals < 0 ? 0 : decimals;
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
	};

	/**
	 * Removes the selected file
	 */
	const removeFile = (file: FileType) => {
		const newFiles = selectedFiles.filter(selectedFile => selectedFile.name !== file.name); // Filter out the file to remove
		setSelectedFiles(newFiles);
	};

	/**
	 * Clears all selected files
	 */
	const clearFiles = () => {
		setSelectedFiles([]); // Reset the state to an empty array
	};

	return {
		selectedFiles,
		handleAcceptedFiles,
		removeFile,
		clearFiles, // Return clearFiles to be used in the component
	};
}
