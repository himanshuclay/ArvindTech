import { Button, Col, Offcanvas, Row } from 'react-bootstrap'
import { ThemeSettings, useThemeContext } from '../common/context'
import useThemeCustomizer from '../components/ThemeCustomizer/useThemeCustomizer'
import { ThemeCustomizer } from '../components/ThemeCustomizer'
import SimpleBar from 'simplebar-react'
import { Link } from 'react-router-dom'

const RightSidebar = () => {
	const { updateSettings, settings } = useThemeContext()

	const { reset } = useThemeCustomizer()

	const isOpenRightSideBar = settings.rightSidebar
	/**
	 * Toggles the right sidebar
	 */
	const handleRightSideBar = () => {
		updateSettings({ rightSidebar: ThemeSettings.rightSidebar.hidden })
	}
	return (
		<Offcanvas
			show={isOpenRightSideBar}
			onHide={handleRightSideBar}
			placement="end"
			id="theme-settings-offcanvas"
		>
			<Offcanvas.Header
				className="d-flex align-items-center bg-primary p-3"
				closeVariant="white"
				closeButton
			>
				<h5 className="text-white m-0">Theme Settings</h5>
			</Offcanvas.Header>

			<Offcanvas.Body className="p-0">
				<SimpleBar scrollbarMaxSize={320} className="h-100">
					<ThemeCustomizer />
				</SimpleBar>
			</Offcanvas.Body>

			<div className="offcanvas-footer border-top p-3 text-center">
				<Row>
					<Col xs={6}>
						<Button
							type="button"
							variant="light"
							className="w-100"
							id="reset-layout"
							onClick={reset}
						>
							Reset
						</Button>
					</Col>
					<div className="col-6">
						<Link
							to="https://themes.getbootstrap.com/product/hyper-responsive-admin-dashboard-template/"
							target="_blank"
							role="button"
							className="btn btn-primary w-100"
						>
							Buy Now
						</Link>
					</div>
				</Row>
			</div>
		</Offcanvas>
	)
}

export default RightSidebar
