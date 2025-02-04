import { Card, Col, Row } from 'react-bootstrap'

// components
// import { FileUploader } from '@/components/FileUploader'
import { PageBreadcrumb } from '@/components'

const FileUploads = () => {
	// Define additionalData according to the expected structure in FileUploaderProps
	
	// const additionalData = {
	// 	ModuleID: '',
	// 	CreatedBy: '',
	// 	TaskCommonID: 0,
	// 	Task_Number: '',
	// 	ProcessInitiationID: 0,
	// 	ProcessID: '',
	// 	UpdatedBy: '', // replace with actual data
	// };

	return (
		<>
			<PageBreadcrumb title="File Uploads" subName="Forms" />
			<Row>
				<Col xs={12}>
					<Card>
						<Card.Header>
							<h4 className="header-title">Dropzone File Upload</h4>
							<p className="text-muted mb-0">
								DropzoneJS is an open-source library that provides drag’n’drop
								file uploads with image previews.
							</p>
						</Card.Header>
						<Card.Body>
							{/* <FileUploader
								icon="ri-upload-cloud-2-line"
								text="Drop files here or click to upload."
								extraText="(This is just a demo dropzone. Selected files are not actually uploaded.)"
                                additionalData={additionalData} // Pass the additionalData prop here
							/> */}
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	)
}

export default FileUploads;
