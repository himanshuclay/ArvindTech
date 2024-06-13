import { Col, Form, Row } from 'react-bootstrap'
import { ThemeSettings } from '@/common/context'

// images
import layoutLight from '@/assets/images/layouts/light.png'
import layoutBox from '@/assets/images/layouts/boxed.png'

interface LayoutWidthProps {
	handleChangeLayoutWidth: (value: any) => void
	layoutWidth?: string
	layoutConstants: typeof ThemeSettings.layout.mode
}
const LayoutWidth = ({
	handleChangeLayoutWidth,
	layoutWidth,
	layoutConstants,
}: LayoutWidthProps) => {
	return (
		<div id="layout-width">
			<h5 className="my-3 fs-16 fw-bold">Layout Mode</h5>

			<Row>
				<Col xs={4}>
					<Form.Check className="form-check form-switch card-switch mb-1">
						<Form.Check.Input
							className="form-check-input"
							type="radio"
							name="data-layout-mode"
							id="layout-mode-fluid"
							value={layoutConstants.fluid}
							onChange={(e) => handleChangeLayoutWidth(e.target.value)}
						/>
						<label className="form-check-label" htmlFor="layout-mode-fluid">
							<img src={layoutLight} alt="" className="img-fluid" />
						</label>
					</Form.Check>
					<h5 className="font-14 text-center text-muted mt-2">Fluid</h5>
				</Col>

				<Col xs={4}>
					<div id="layout-boxed">
						<Form.Check className="form-switch card-switch mb-1">
							<Form.Check.Input
								className="form-check-input"
								type="radio"
								name="data-layout-mode"
								id="layout-mode-boxed"
								value={layoutConstants.boxed}
								onChange={(e) => handleChangeLayoutWidth(e.target.value)}
								checked={layoutWidth === layoutConstants.boxed}
							/>
							<label className="form-check-label" htmlFor="layout-mode-boxed">
								<img src={layoutBox} alt="" className="img-fluid" />
							</label>
						</Form.Check>
						<h5 className="font-14 text-center text-muted mt-2">Boxed</h5>
					</div>
				</Col>
			</Row>
		</div>
	)
}

export default LayoutWidth
