import { Col, Form, Image, Row } from 'react-bootstrap'
import { ThemeSettings } from '@/common/context'

import layoutLight from '@/assets/images/layouts/light.png'
import sideBarLight from '@/assets/images/layouts/sidebar-light.png'

type SideBarThemeProps = {
	handleChangeSideBarTheme: (value: any) => void
	sideBarTheme?: string
	layoutConstants: typeof ThemeSettings.sidebar.theme
}
const SideBarTheme = ({
	handleChangeSideBarTheme,
	sideBarTheme,
	layoutConstants,
}: SideBarThemeProps) => {
	return (
		<>
			<h5 className="my-3 fs-16 fw-bold">Menu Color</h5>

			<Row>
				<Col xs={4}>
					<Form.Check className="form-switch card-switch mb-1">
						<Form.Check.Input
							className="form-check-input"
							type="radio"
							name="data-menu-color"
							id="leftbar-color-light"
							value={layoutConstants.light}
							onChange={(e) => handleChangeSideBarTheme(e.target.value)}
							checked={sideBarTheme === layoutConstants.light}
						/>
						<Form.Check.Label
							className="form-check-label"
							htmlFor="leftbar-color-light"
						>
							<Image fluid src={layoutLight} alt="" />
						</Form.Check.Label>
					</Form.Check>
					<h5 className="font-14 text-center text-muted mt-2">Light</h5>
				</Col>

				<Col xs={4}>
					<Form.Check className="form-switch card-switch mb-1">
						<Form.Check.Input
							className="form-check-input"
							type="radio"
							name="data-menu-color"
							id="leftbar-color-dark"
							value={layoutConstants.dark}
							onChange={(e) => handleChangeSideBarTheme(e.target.value)}
							checked={sideBarTheme === layoutConstants.dark}
						/>
						<Form.Check.Label
							className="form-check-label"
							htmlFor="leftbar-color-dark"
						>
							<Image fluid src={sideBarLight} alt="" />
						</Form.Check.Label>
					</Form.Check>
					<h5 className="font-14 text-center text-muted mt-2">Dark</h5>
				</Col>
			</Row>
		</>
	)
}

export default SideBarTheme
