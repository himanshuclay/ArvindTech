import { Col, Form, Image, Row } from 'react-bootstrap'
import { ThemeSettings } from '@/common/context'

import layoutLight from '@/assets/images/layouts/light.png'
import layoutCompact from '@/assets/images/layouts/compact.png'
import layoutSm from '@/assets/images/layouts/sm.png'
import layoutFull from '@/assets/images/layouts/full.png'

type LayoutTypeProps = {
	handleChangeSideBarType: (value: string) => void
	sideBarType: string
	layoutConstants: typeof ThemeSettings.sidebar.size
}

const SideBarType = ({
	handleChangeSideBarType,
	sideBarType,
	layoutConstants,
}: LayoutTypeProps) => {
	return (
		<div id="sidebar-size">
			<h5 className="my-3 fs-16 fw-bold">Sidebar Size</h5>

			<Row>
				<Col xs={4}>
					<Form.Check className="form-switch card-switch mb-1">
						<Form.Check.Input
							className="form-check-input"
							type="radio"
							name="data-sidenav-size"
							id="leftbar-size-default"
							value={layoutConstants.default}
							onChange={(e) => handleChangeSideBarType(e.target.value)}
							checked={sideBarType === layoutConstants.default}
						/>
						<Form.Check.Label
							className="form-check-label"
							htmlFor="leftbar-size-default"
						>
							<Image fluid src={layoutLight} alt="" />
						</Form.Check.Label>
					</Form.Check>
					<h5 className="font-14 text-center text-muted mt-2">Default</h5>
				</Col>

				<Col xs={4}>
					<Form.Check className="form-switch card-switch mb-1">
						<Form.Check.Input
							className="form-check-input"
							type="checkbox"
							name="data-sidenav-size"
							id="leftbar-size-compact"
							value={layoutConstants.compact}
							onChange={(e) => handleChangeSideBarType(e.target.value)}
							checked={sideBarType === layoutConstants.compact}
						/>
						<Form.Check.Label
							className="form-check-label"
							htmlFor="leftbar-size-compact"
						>
							<Image fluid src={layoutCompact} alt="" className="img-fluid" />
						</Form.Check.Label>
					</Form.Check>
					<h5 className="font-14 text-center text-muted mt-2">Compact</h5>
				</Col>

				<Col xs={4}>
					<Form.Check className="form-switch card-switch mb-1">
						<Form.Check.Input
							className="form-check-input"
							type="checkbox"
							name="data-sidenav-size"
							id="leftbar-size-small"
							value={layoutConstants.condensed}
							onChange={(e) => handleChangeSideBarType(e.target.value)}
							checked={sideBarType === layoutConstants.condensed}
						/>
						<Form.Check.Label
							className="form-check-label"
							htmlFor="leftbar-size-small"
						>
							<Image fluid src={layoutSm} alt="" className="img-fluid" />
						</Form.Check.Label>
					</Form.Check>
					<h5 className="font-14 text-center text-muted mt-2">Condensed</h5>
				</Col>

				<Col xs={4}>
					<Form.Check className="form-switch card-switch mb-1">
						<Form.Check.Input
							className="form-check-input"
							type="checkbox"
							name="data-sidenav-size"
							id="leftbar-size-full"
							value={layoutConstants.full}
							onChange={(e) => handleChangeSideBarType(e.target.value)}
							checked={sideBarType === layoutConstants.full}
						/>
						<Form.Check.Label
							className="form-check-label"
							htmlFor="leftbar-size-full"
						>
							<Image fluid src={layoutFull} alt="" className="img-fluid" />
						</Form.Check.Label>
					</Form.Check>
					<h5 className="font-14 text-center text-muted mt-2">Full Layout</h5>
				</Col>
			</Row>
		</div>
	)
}

export default SideBarType
