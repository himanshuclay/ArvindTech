import { Button, Card, Col, Image, Row } from 'react-bootstrap'
import Cropper, { ReactCropperElement } from 'react-cropper'

// components
import { PageBreadcrumb } from '@/components'

// styles
import 'cropperjs/dist/cropper.css'
import { useRef, useState } from 'react'

const ImageCrop = () => {
	const [cropData, setCropData] = useState('#')
	const [cropData1, setCropData1] = useState<number | undefined>(0)
	const [cropY, setCropY] = useState<number | undefined>(0)
	const [imageWidth, setImageWidth] = useState<number | undefined>(0)
	const [imageHeight, setImageHeight] = useState<number | undefined>(0)
	const [imageRotate, setImageRotate] = useState<number | undefined>(0)
	const [scaleX, setScaleX] = useState<number | undefined>(0)
	const [scaleY, setScaleY] = useState<number | undefined>(0)

	const cropperRef = useRef<ReactCropperElement>(null)

	const onCrop = () => {
		const cropper = cropperRef.current?.cropper
		// console.log(cropper.getCroppedCanvas().toDataURL());
		const ImageData = Math.ceil(cropper?.getData().x ?? 0)
		const ImageY = Math.ceil(cropper?.getData().y ?? 0)
		const ImageWidth = Math.ceil(cropper?.getImageData().width ?? 0)
		const ImageHeight = Math.ceil(cropper?.getImageData().height ?? 0)
		const ImageRotate = Math.ceil(cropper?.getImageData().rotate ?? 0)
		const ScaleX = Math.ceil(cropper?.getImageData().scaleX ?? 0)
		const ScaleY = Math.ceil(cropper?.getImageData().scaleY ?? 0)

		setCropData1(ImageData)
		setCropY(ImageY)
		setImageWidth(ImageWidth)
		setImageHeight(ImageHeight)
		setImageRotate(ImageRotate)
		setScaleX(ScaleX)
		setScaleY(ScaleY)
	}

	const getCropData = () => {
		if (typeof cropperRef.current?.cropper !== 'undefined') {
			setCropData(cropperRef.current?.cropper.getCroppedCanvas().toDataURL())
		}
	}
	return (
		<>
			<PageBreadcrumb title="Image Crop" subName="Forms" />
			<Row>
				<Col xs={12}>
					<Card>
						<Card.Body>
							<Row>
								<Col lg={9}>
									<div className="img-container">
										<Cropper
											src="https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg"
											style={{ height: 784, width: '100%' }}
											initialAspectRatio={16 / 9}
											dragMode="move"
											preview=".img-preview"
											guides={false}
											crop={onCrop}
											ref={cropperRef}
											rotatable
										/>
									</div>
								</Col>
								<Col lg={3}>
									<div className="image-crop-preview clearfix">
										<div className="img-preview preview-lg rounded" />
										<div className="img-preview preview-md rounded" />
										<div className="img-preview preview-sm rounded" />
										<div className="img-preview preview-xs rounded" />
									</div>
									<div className="docs-data">
										<div className="input-group mt-2">
											<span className="input-group-text">X</span>
											<input
												type="text"
												className="form-control"
												id="dataX"
												placeholder="x"
												onChange={() => cropData1}
												value={cropData1}
											/>
											<span className="input-group-text">px</span>
										</div>
										<div className="input-group mt-2">
											<span className="input-group-text">Y</span>
											<input
												type="text"
												className="form-control"
												id="dataY"
												placeholder="y"
												onChange={() => cropY}
												value={cropY}
											/>
											<span className="input-group-text">px</span>
										</div>
										<div className="input-group mt-2">
											<span className="input-group-text">Width</span>
											<input
												type="text"
												className="form-control"
												id="dataWidth"
												placeholder="width"
												onChange={() => imageWidth}
												value={imageWidth}
											/>
											<span className="input-group-text">px</span>
										</div>
										<div className="input-group mt-2">
											<span className="input-group-text">Height</span>
											<input
												type="text"
												className="form-control"
												id="dataHeight"
												placeholder="height"
												onChange={() => imageHeight}
												value={imageHeight}
											/>
											<span className="input-group-text">px</span>
										</div>
										<div className="input-group mt-2">
											<span className="input-group-text">Rotate</span>
											<input
												type="text"
												className="form-control"
												id="dataRotate"
												placeholder="rotate"
												onChange={() => imageRotate}
												value={imageRotate}
											/>
											<span className="input-group-text">deg</span>
										</div>
										<div className="input-group mt-2">
											<span className="input-group-text">ScaleX</span>
											<input
												type="text"
												className="form-control"
												id="dataScaleX"
												placeholder="scaleX"
												onChange={() => scaleX}
												value={scaleX}
											/>
										</div>
										<div className="input-group mt-2">
											<span className="input-group-text">ScaleY</span>
											<input
												type="text"
												className="form-control"
												id="dataScaleY"
												placeholder="scaleY"
												onChange={() => scaleY}
												value={scaleY}
											/>
										</div>
										<div className="d-flex justify-content-center mt-2">
											<Button onClick={getCropData}>Crop Image</Button>
										</div>
									</div>
								</Col>
							</Row>
						</Card.Body>
					</Card>
				</Col>
			</Row>
			<Row>
				<h1>Preview</h1>
				<div className="d-inline p-2 mb-5" style={{ maxWidth: '300px' }}>
					<Image
						src={cropData}
						alt="cropped"
						fluid
						style={{ maxHeight: '300px' }}
					/>
				</div>
			</Row>
		</>
	)
}
export default ImageCrop
