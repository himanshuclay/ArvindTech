import { useState } from 'react'
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap'

// component
import { PageBreadcrumb } from '@/components'

const CustomStyles = () => {
	const [validated, setValidated] = useState(false)

	const handleSubmit = (event: any) => {
		const form = event.currentTarget
		if (form.checkValidity() === false) {
			event.preventDefault()
			event.stopPropagation()
		}
		setValidated(true)
	}

	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Custom styles</h4>
				<p className="text-muted mb-0">
					Custom feedback styles apply custom colors, borders, focus styles, and
					background icons to better communicate feedback. Background icons
					for&nbsp;
					<code>&lt;select&gt;</code>s are only available with&nbsp;
					<code>.form-select</code>, and not <code>.form-control</code>.
				</p>
			</Card.Header>
			<Card.Body>
				<Form noValidate validated={validated} onSubmit={handleSubmit}>
					<Form.Group className="mb-3">
						<Form.Label>First name</Form.Label>
						<Form.Control
							type="text"
							id="validationCustom01"
							placeholder="First name"
							defaultValue="Mark"
							required
						/>
						<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label>Last name</Form.Label>
						<Form.Control
							type="text"
							id="validationCustom02"
							placeholder="Last name"
							defaultValue="Otto"
							required
						/>
						<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label>Username</Form.Label>
						<InputGroup>
							<InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
							<Form.Control
								type="text"
								id="validationCustomUsername"
								placeholder="Username"
								required
							/>
							<Form.Control.Feedback type="invalid">
								Please choose a username.
							</Form.Control.Feedback>
						</InputGroup>
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label>City</Form.Label>
						<Form.Control
							type="text"
							id="validationCustom03"
							placeholder="City"
							required
						/>
						<Form.Control.Feedback type="invalid">
							Please provide a valid city.
						</Form.Control.Feedback>
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label>State</Form.Label>
						<Form.Control
							type="text"
							id="validationCustom04"
							placeholder="State"
							required
						/>
						<Form.Control.Feedback type="invalid">
							Please provide a valid state.
						</Form.Control.Feedback>
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label>Zip</Form.Label>
						<Form.Control
							type="text"
							id="validationCustom05"
							placeholder="Zip"
							required
						/>
						<Form.Control.Feedback type="invalid">
							Please provide a valid zip.
						</Form.Control.Feedback>
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Check
							id="invalidCheck"
							required
							label="Agree to terms and conditions"
							feedback="You must agree before submitting."
							feedbackType="invalid"
						/>
					</Form.Group>
					<Button variant="primary" type="submit">
						Submit form
					</Button>
				</Form>
			</Card.Body>
		</Card>
	)
}

const Tooltips = () => {
	const [validated, setValidated] = useState(false)

	const handleSubmit = (event: any) => {
		const form = event.currentTarget
		if (form.checkValidity() === false) {
			event.preventDefault()
			event.stopPropagation()
		}
		setValidated(true)
	}

	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Tooltips</h4>
				<p className="text-muted mb-0">
					If your form layout allows it, you can swap the&nbsp;
					<code>.{`{valid|invalid}`}-feedback</code> classes for&nbsp;
					<code>.{`{valid|invalid}`}-tooltip</code> classes to display
					validation feedback in a styled tooltip. Be sure to have a parent with{' '}
					<code>position: relative</code> on it for tooltip positioning. In the
					example below, our column classes have this already, but your project
					may require an alternative setup.
				</p>
			</Card.Header>
			<Card.Body>
				<Form noValidate validated={validated} onSubmit={handleSubmit}>
					<Form.Group className="position-relative mb-3">
						<Form.Label>First name</Form.Label>
						<Form.Control
							type="text"
							id="validationTooltip01"
							placeholder="First name"
							defaultValue="Mark"
							required
						/>
						<Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback>
						<Form.Control.Feedback type="invalid" tooltip>
							Please enter first name.
						</Form.Control.Feedback>
					</Form.Group>
					<Form.Group className="position-relative mb-3">
						<Form.Label>Last name</Form.Label>
						<Form.Control
							type="text"
							id="validationTooltip02"
							placeholder="Last name"
							defaultValue="Otto"
							required
						/>
						<Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback>
						<Form.Control.Feedback type="invalid" tooltip>
							Please enter last name.
						</Form.Control.Feedback>
					</Form.Group>
					<Form.Group className="position-relative mb-3">
						<Form.Label>Username</Form.Label>
						<InputGroup>
							<InputGroup.Text id="validationTooltipUsernamePrepend">
								@
							</InputGroup.Text>
							<Form.Control
								type="text"
								id="validationTooltipUsername"
								placeholder="Username"
								required
							/>
							<Form.Control.Feedback type="invalid" tooltip>
								Please choose a unique and valid username.
							</Form.Control.Feedback>
						</InputGroup>
					</Form.Group>
					<Form.Group className="position-relative mb-3">
						<Form.Label>City</Form.Label>
						<Form.Control
							type="text"
							id="validationTooltip03"
							placeholder="City"
							required
						/>
						<Form.Control.Feedback type="invalid" tooltip>
							Please provide a valid city.
						</Form.Control.Feedback>
					</Form.Group>
					<Form.Group className="position-relative mb-3">
						<Form.Label>State</Form.Label>
						<Form.Control
							type="text"
							id="validationTooltip04"
							placeholder="State"
							required
						/>
						<Form.Control.Feedback type="invalid" tooltip>
							Please provide a valid state.
						</Form.Control.Feedback>
					</Form.Group>
					<Form.Group className="position-relative mb-3">
						<Form.Label>Zip</Form.Label>
						<Form.Control
							type="text"
							id="validationTooltip05"
							placeholder="Zip"
							required
						/>
						<Form.Control.Feedback type="invalid" tooltip>
							Please provide a valid zip.
						</Form.Control.Feedback>
					</Form.Group>
					<Button variant="primary" type="submit">
						Submit form
					</Button>
				</Form>
			</Card.Body>
		</Card>
	)
}

const Validation = () => {
	return (
		<>
			<PageBreadcrumb title="Form Validation" subName="Forms" />
			<Row>
				<Col lg={6}>
					<CustomStyles />
				</Col>

				<Col lg={6}>
					<Tooltips />
				</Col>
			</Row>
		</>
	)
}

export default Validation
