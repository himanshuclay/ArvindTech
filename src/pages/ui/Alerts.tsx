import { useState } from 'react'
import { Alert, Button, Card, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

// Components
import { PageBreadcrumb } from '@/components'

// constants
import { colorVariants, extendedColorVariants } from '@/constants/colorVariants'

interface IconAlertVariant {
	variant: string
	icon: string
}

const DefaultAlerts = () => {
	return (
		<Card>
			<Card.Body>
				<h4 className="header-title">Default Alert</h4>
				<p className="text-muted fs-14 mb-3">
					Provide contextual feedback messages for typical user actions with the
					handful of available and flexible alert messages. Alerts are available
					for any length of text, as well as an optional dismiss button.
				</p>
				{(extendedColorVariants || []).map((color, idx) => {
					return (
						<Alert
							variant={color}
							key={idx}
							className={`${
								idx > 4 ? 'border-0 text-bg-' + extendedColorVariants[idx] : ''
							}`}
						>
							<strong>
								{extendedColorVariants[idx].charAt(0).toUpperCase() +
									color.slice(1)}{' '}
								-{' '}
							</strong>{' '}
							A simple {color} alert—check it out!
						</Alert>
					)
				})}
			</Card.Body>
		</Card>
	)
}

const DismissibleAlerts = () => {
	const [colors, setColors] = useState<string[]>([...extendedColorVariants])

	/*
	 * handle close
	 */
	const handleClose = (index: number) => {
		const list = [...colors]
		list.splice(index, 1)
		setColors(list)
	}
	return (
		<Card>
			<Card.Body>
				<h4 className="header-title">Dismissing Alerts</h4>
				<p className="text-muted fs-14 mb-3">
					Add a dismiss button and the <code>.alert-dismissible</code> class,
					which adds extra padding to the right of the alert and positions the{' '}
					<code>.btn-close</code> button.
				</p>

				{(extendedColorVariants || []).map((color, idx) => {
					return (
						<Alert
							variant={color}
							key={idx}
							onClose={() => handleClose(idx)}
							dismissible
							closeVariant={idx < 5 ? 'white' : undefined}
							className={`${
								idx < 5 ? 'border-0 text-bg-' + extendedColorVariants[idx] : ''
							}`}
						>
							<strong>
								{extendedColorVariants[idx].charAt(0).toUpperCase() +
									color.slice(1)}{' '}
								-{' '}
							</strong>{' '}
							A simple {color} alert—check it out!
						</Alert>
					)
				})}
			</Card.Body>
		</Card>
	)
}

const CustomAlert = () => {
	return (
		<>
			<Card>
				<Card.Body>
					<h4 className="header-title">Custom Alerts</h4>
					<p className="text-muted fs-14 mb-3">
						Display alert with transparent background and with contextual text
						color. Use classes <code>.bg-transparent</code>, and{' '}
						<code>.text-*</code>. E.g. <code>bg-transparent text-primary</code>.
					</p>
					{(extendedColorVariants || []).map((color, idx) => {
						return (
							<Alert
								variant={color}
								key={idx}
								className="bg-transparent"
								role="alert"
							>
								This is a <strong>{color}</strong> alert—check it out!
							</Alert>
						)
					})}
				</Card.Body>
			</Card>
		</>
	)
}

const LinkColor = () => {
	return (
		<>
			<Card>
				<Card.Body>
					<h4 className="header-title">Link Color</h4>
					<p className="text-muted fs-14 mb-3">
						Use the <code>.alert-link</code> utility class to quickly provide
						matching colored links within any alert.
					</p>
					{(extendedColorVariants || []).map((color, idx) => {
						return (
							<Alert variant={color} key={idx} role="alert">
								A simple {color} alert with{' '}
								<Link to="#" className="alert-link">
									an example link
								</Link>
								. Give it a click if you like.
							</Alert>
						)
					})}
				</Card.Body>
			</Card>
		</>
	)
}

const IconWithAlert = () => {
	const iconAlertVariants: IconAlertVariant[] = [
		{
			variant: 'primary',
			icon: 'ri-check-line',
		},
		{
			variant: 'secondary',
			icon: 'ri-close-circle-line',
		},
		{
			variant: 'success',
			icon: 'ri-alert-line',
		},
		{
			variant: 'danger',
			icon: 'ri-information-line',
		},
	]

	return (
		<>
			<Card>
				<Card.Body>
					<h4 className="header-title">Icons with Alerts</h4>
					<p className="text-muted fs-14 mb-3">
						You can also include additional elements like icons, heading, etc
						along side the actual message.
					</p>
					{(colorVariants || []).slice(0, 4).map((color, idx) => {
						return (
							<Alert variant={color} key={idx} role="alert">
								<i
									className={`${iconAlertVariants[idx].icon} me-1 align-middle fs-16`}
								/>
								This is a <strong>{color}</strong> alert - check it out!
							</Alert>
						)
					})}
				</Card.Body>
			</Card>
		</>
	)
}

const AdditionalContent = () => {
	return (
		<>
			<Card>
				<Card.Body>
					<h4 className="header-title">Additional content</h4>
					<p className="text-muted fs-14 mb-3">
						Alerts can also contain additional HTML elements like headings,
						paragraphs and dividers.
					</p>
					<Alert variant="info" className="text-center mb-0" role="alert">
						<div className="avatar-sm mb-2 mx-auto">
							<span className="avatar-title bg-info rounded-circle">
								<i className="ri-check-line align-middle fs-22" />
							</span>
						</div>
						<Alert.Heading as="h4" className="alert-heading">
							Well done!
						</Alert.Heading>
						<p>
							Aww yeah, you successfully read this important alert message. This
							example text is going to run a bit longer so that you can see how
							spacing within an alert works with this kind of content.
						</p>
						<hr className="border-info border-opacity-25" />
						<p className="mb-0">
							Whenever you need to, be sure to use margin utilities to keep
							things nice and tidy.
						</p>
					</Alert>
				</Card.Body>
			</Card>
		</>
	)
}

const LiveAlert = () => {
	const [showAlert, setShowAlert] = useState<boolean>(false)

	return (
		<>
			<Card>
				<Card.Body>
					<h4 className="header-title">Live Alert</h4>
					<p className="text-muted fs-14 mb-3">
						Click the button below to show an alert (hidden with inline styles
						to start), then dismiss (and destroy) it with the built-in close
						button.
					</p>

					<div className="tab-pane show active">
						<Alert
							show={showAlert}
							variant="success"
							onClose={() => setShowAlert(!showAlert)}
							dismissible
						>
							<div>Nice, you triggered this alert message!</div>
						</Alert>
						<Button
							variant="primary"
							type="button"
							onClick={() => setShowAlert(!showAlert)}
						>
							Show live alert
						</Button>
					</div>
				</Card.Body>
			</Card>
		</>
	)
}

const Alerts = () => {
	return (
		<>
			<PageBreadcrumb title="Alerts" subName="Base UI" />
			<Row>
				<Col xl={12}>
					<DefaultAlerts />
				</Col>

				<Col xl={12}>
					<DismissibleAlerts />
				</Col>
			</Row>

			<Row>
				<Col xl={12}>
					<CustomAlert />
				</Col>

				<Col xl={12}>
					<LinkColor />
				</Col>
			</Row>

			<Row>
				<Col xl={12}>
					<IconWithAlert />
				</Col>

				<Col xl={12}>
					<AdditionalContent />
				</Col>
			</Row>

			<Row>
				<Col xl={12}>
					<LiveAlert />
				</Col>
			</Row>
		</>
	)
}

export default Alerts
