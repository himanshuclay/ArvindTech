import { Col, Form, Image, Row } from 'react-bootstrap'
import { ThemeSettings } from '@/common/context'

import layOutlight from '@/assets/images/layouts/light.png'
import layoutHorizontal from '@/assets/images/layouts/horizontal.png'
type LayoutTypeProps = {
	handleChangeLayoutType: (value: string) => void
	layoutType: string
	layoutConstants: typeof ThemeSettings.layout.type
}
const LayoutType = ({
	handleChangeLayoutType,
	layoutConstants,
	layoutType,
}: LayoutTypeProps) => {
	return (
		<>
			<h5 className="mb-3 fs-16 fw-bold">Choose Layout</h5>
			<Row>
				<Col xs={4}>
					<Form.Check className="form-switch card-switch mb-1">
						<Form.Check.Input
							className="form-check-input"
							type="radio"
							name="data-layout"
							id="customizer-layout01"
							value={layoutConstants.vertical}
							onChange={(e) => handleChangeLayoutType(e.target.value)}
							checked={layoutType === layoutConstants.vertical}
						/>
						<Form.Check.Label
							className="form-check-label"
							htmlFor="customizer-layout01"
						>
							<Image src={layOutlight} alt="" className="img-fluid" />
						</Form.Check.Label>
					</Form.Check>
					<h5 className="font-14 text-center text-muted mt-2">Vertical</h5>
				</Col>

				<Col xs={4}>
					<Form.Check className="form-switch card-switch mb-1">
						<Form.Check.Input
							className="form-check-input"
							type="checkbox"
							name="data-layout"
							id="customizer-layout02"
							value={layoutConstants.horizontal}
							onChange={(e) => handleChangeLayoutType(e.target.value)}
							checked={layoutType === layoutConstants.horizontal}
						/>
						<Form.Check.Label htmlFor="customizer-layout02">
							<Image src={layoutHorizontal} alt="" className="img-fluid" />
						</Form.Check.Label>
					</Form.Check>
					<h5 className="font-14 text-center text-muted mt-2">Horizontal</h5>
				</Col>
			</Row>
		</>
	)
}

export default LayoutType
