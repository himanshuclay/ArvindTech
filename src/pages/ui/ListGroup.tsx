import {
	Card,
	Col,
	Row,
	ListGroup as BootstrapListGroup,
	Badge,
} from 'react-bootstrap'

// component
import { PageBreadcrumb } from '@/components'

const Basic = () => {
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Basic example</h4>
				<p className="text-muted mb-0">
					The most basic list group is an unordered list with list items and the
					proper classes. Build upon it with the options that follow, or with
					your own CSS as needed.
				</p>
			</Card.Header>
			<Card.Body>
				<BootstrapListGroup>
					<BootstrapListGroup.Item>
						<i className="ri-drive-line me-1" /> Google Drive
					</BootstrapListGroup.Item>
					<BootstrapListGroup.Item>
						<i className="ri-messenger-line me-1" /> Facebook Messenger
					</BootstrapListGroup.Item>
					<BootstrapListGroup.Item>
						<i className="ri-apple-line me-1" /> Apple Technology Company
					</BootstrapListGroup.Item>
					<BootstrapListGroup.Item>
						<i className="ri-lifebuoy-line me-1" /> Intercom Support System
					</BootstrapListGroup.Item>
					<BootstrapListGroup.Item>
						<i className="ri-paypal-line me-1" /> Paypal Payment Gateway
					</BootstrapListGroup.Item>
				</BootstrapListGroup>
			</Card.Body>
		</Card>
	)
}

const ActiveItems = () => {
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Active items</h4>
				<p className="text-muted mb-0">
					Add <code>.active</code> to a <code>.list-group-item</code> to
					indicate the current active selection.
				</p>
			</Card.Header>
			<Card.Body>
				<BootstrapListGroup>
					<BootstrapListGroup.Item className="active">
						<i className="ri-drive-line me-1" /> Google Drive
					</BootstrapListGroup.Item>
					<BootstrapListGroup.Item>
						<i className="ri-messenger-line me-1" /> Facebook Messenger
					</BootstrapListGroup.Item>
					<BootstrapListGroup.Item>
						<i className="ri-apple-line me-1" /> Apple Technology Company
					</BootstrapListGroup.Item>
					<BootstrapListGroup.Item>
						<i className="ri-lifebuoy-line me-1" /> Intercom Support System
					</BootstrapListGroup.Item>
					<BootstrapListGroup.Item>
						<i className="ri-paypal-line me-1" /> Paypal Payment Gateway
					</BootstrapListGroup.Item>
				</BootstrapListGroup>
			</Card.Body>
		</Card>
	)
}
const DisabledItems = () => {
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Disabled items</h4>
				<p>
					Add <code>.disabled</code> to a <code>.list-group-item</code> to make
					it
					<em> appear</em> disabled.
				</p>
			</Card.Header>
			<Card.Body>
				<BootstrapListGroup>
					<BootstrapListGroup.Item className="disabled" aria-disabled="true">
						<i className="ri-drive-line me-1" /> Google Drive
					</BootstrapListGroup.Item>
					<BootstrapListGroup.Item>
						<i className="ri-messenger-line me-1" /> Facebook Messenger
					</BootstrapListGroup.Item>
					<BootstrapListGroup.Item>
						<i className="ri-apple-line me-1" /> Apple Technology Company
					</BootstrapListGroup.Item>
					<BootstrapListGroup.Item>
						<i className="ri-lifebuoy-line me-1" /> Intercom Support System
					</BootstrapListGroup.Item>
					<BootstrapListGroup.Item>
						<i className="ri-paypal-line me-1" /> Paypal Payment Gateway
					</BootstrapListGroup.Item>
				</BootstrapListGroup>
			</Card.Body>
		</Card>
	)
}

const LinksButtons = () => {
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Links and Buttons</h4>
				<p className="text-muted mb-0">
					Use <code>&lt;a&gt;</code>s or <code>&lt;button&gt;</code>s to create{' '}
					<em>actionable</em> list group items with hover, disabled, and active
					states by adding <code>.list-group-item-action</code>.
				</p>
			</Card.Header>
			<Card.Body>
				<BootstrapListGroup>
					<BootstrapListGroup.Item href="#" action className="active">
						Paypal Payment Gateway
					</BootstrapListGroup.Item>
					<BootstrapListGroup.Item href="#" action>
						Google Drive
					</BootstrapListGroup.Item>
					<BootstrapListGroup.Item as="button" action>
						Facebook Messenger
					</BootstrapListGroup.Item>
					<BootstrapListGroup.Item as="button" action>
						Apple Technology Company
					</BootstrapListGroup.Item>
					<BootstrapListGroup.Item href="#" action disabled>
						Intercom Support System
					</BootstrapListGroup.Item>
				</BootstrapListGroup>
			</Card.Body>
		</Card>
	)
}

const Flush = () => {
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Flush</h4>
				<p className="text-muted mb-0">
					Add <code>.list-group-flush</code> to remove some borders and rounded
					corners to render list group items edge-to-edge in a parent container
					(e.g., cards).
				</p>
			</Card.Header>
			<Card.Body>
				<BootstrapListGroup variant="flush">
					<BootstrapListGroup.Item>Google Drive</BootstrapListGroup.Item>
					<BootstrapListGroup.Item>Facebook Messenger</BootstrapListGroup.Item>
					<BootstrapListGroup.Item>
						Apple Technology Company
					</BootstrapListGroup.Item>
					<BootstrapListGroup.Item>
						Intercom Support System
					</BootstrapListGroup.Item>
					<BootstrapListGroup.Item>
						Paypal Payment Gateway
					</BootstrapListGroup.Item>
				</BootstrapListGroup>
			</Card.Body>
		</Card>
	)
}

const Horizontal = () => {
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Horizontal</h4>
				<p className="text-muted mb-0">
					Add <code>.list-group-horizontal</code> to change the layout of list
					group items from vertical to horizontal across all breakpoints.
					Alternatively, choose a responsive variant{' '}
					<code>.list-group-horizontal-{`{sm|md|lg|xl}`}</code> to make a list
					group horizontal starting at that breakpoint&apos;s{' '}
					<code>min-width</code>.
				</p>
			</Card.Header>
			<Card.Body>
				<BootstrapListGroup horizontal className="mb-3">
					<BootstrapListGroup.Item>Google</BootstrapListGroup.Item>
					<BootstrapListGroup.Item>Whatsapp</BootstrapListGroup.Item>
					<BootstrapListGroup.Item>Facebook</BootstrapListGroup.Item>
				</BootstrapListGroup>

				<BootstrapListGroup horizontal="sm" className="mb-3">
					<BootstrapListGroup.Item>Apple</BootstrapListGroup.Item>
					<BootstrapListGroup.Item>PayPal</BootstrapListGroup.Item>
					<BootstrapListGroup.Item>Intercom</BootstrapListGroup.Item>
				</BootstrapListGroup>

				<BootstrapListGroup horizontal="md">
					<BootstrapListGroup.Item>Google</BootstrapListGroup.Item>
					<BootstrapListGroup.Item>Whatsapp</BootstrapListGroup.Item>
					<BootstrapListGroup.Item>Facebook</BootstrapListGroup.Item>
				</BootstrapListGroup>
			</Card.Body>
		</Card>
	)
}

const Contextual = () => {
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Contextual classes</h4>
				<p className="text-muted mb-0">
					Use contextual classes to style list items with a stateful background
					and color.
				</p>
			</Card.Header>
			<Card.Body>
				<BootstrapListGroup>
					<BootstrapListGroup.Item>
						Dapibus ac facilisis in
					</BootstrapListGroup.Item>
					<BootstrapListGroup.Item variant="primary">
						A simple primary list group item
					</BootstrapListGroup.Item>
					<BootstrapListGroup.Item variant="secondary">
						A simple secondary list group item
					</BootstrapListGroup.Item>
					<BootstrapListGroup.Item variant="success">
						A simple success list group item
					</BootstrapListGroup.Item>
					<BootstrapListGroup.Item variant="danger">
						A simple danger list group item
					</BootstrapListGroup.Item>
					<BootstrapListGroup.Item variant="warning">
						A simple warning list group item
					</BootstrapListGroup.Item>
					<BootstrapListGroup.Item variant="info">
						A simple info list group item
					</BootstrapListGroup.Item>
					<BootstrapListGroup.Item variant="light">
						A simple light list group item
					</BootstrapListGroup.Item>
					<BootstrapListGroup.Item variant="dark">
						A simple dark list group item
					</BootstrapListGroup.Item>
				</BootstrapListGroup>
			</Card.Body>
		</Card>
	)
}

const ContextualLinks = () => {
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Contextual classes with Link</h4>
				<p className="text-muted mb-0">
					Use contextual classes to style list items with a stateful background
					and color.
				</p>
			</Card.Header>
			<Card.Body>
				<BootstrapListGroup>
					<BootstrapListGroup.Item variant="link" as="a" href="#" action>
						Dapibus ac facilisis in
					</BootstrapListGroup.Item>
					<BootstrapListGroup.Item variant="primary" as="a" href="#" action>
						A simple primary list group item
					</BootstrapListGroup.Item>
					<BootstrapListGroup.Item variant="secondary" as="a" href="#" action>
						A simple secondary list group item
					</BootstrapListGroup.Item>
					<BootstrapListGroup.Item variant="success" as="a" href="#" action>
						A simple success list group item
					</BootstrapListGroup.Item>
					<BootstrapListGroup.Item variant="danger" as="a" href="#" action>
						A simple danger list group item
					</BootstrapListGroup.Item>
					<BootstrapListGroup.Item variant="warning" as="a" href="#" action>
						A simple warning list group item
					</BootstrapListGroup.Item>
					<BootstrapListGroup.Item variant="info" as="a" href="#" action>
						A simple info list group item
					</BootstrapListGroup.Item>
					<BootstrapListGroup.Item variant="light" as="a" href="#" action>
						A simple light list group item
					</BootstrapListGroup.Item>
					<BootstrapListGroup.Item variant="dark" as="a" href="#" action>
						A simple dark list group item
					</BootstrapListGroup.Item>
				</BootstrapListGroup>
			</Card.Body>
		</Card>
	)
}

const CustomContent = () => {
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Custom content</h4>
				<p className="text-muted mb-0">
					Add nearly any HTML within, even for linked list groups like the one
					below, with the help of flexbox utilities.
				</p>
			</Card.Header>
			<Card.Body>
				<BootstrapListGroup>
					<BootstrapListGroup.Item as="a" href="#" className="active" action>
						<div className="d-flex w-100 justify-content-between">
							<h5 className="mb-1">List group item heading</h5>
							<small>3 days ago</small>
						</div>
						<p className="mb-1">
							Donec id elit non mi porta gravida at eget metus. Maecenas sed
							diam eget risus varius blandit.
						</p>
						<small>Donec id elit non mi porta.</small>
					</BootstrapListGroup.Item>
					<BootstrapListGroup.Item as="a" href="#" action>
						<div className="d-flex w-100 justify-content-between">
							<h5 className="mb-1">List group item heading</h5>
							<small className="text-muted">3 days ago</small>
						</div>
						<p className="mb-1">
							Donec id elit non mi porta gravida at eget metus. Maecenas sed
							diam eget risus varius blandit.
						</p>
						<small className="text-muted">Donec id elit non mi porta.</small>
					</BootstrapListGroup.Item>
					<BootstrapListGroup.Item href="#" action>
						<div className="d-flex w-100 justify-content-between">
							<h5 className="mb-1">List group item heading</h5>
							<small className="text-muted">3 days ago</small>
						</div>
						<p className="mb-1">
							Donec id elit non mi porta gravida at eget metus. Maecenas sed
							diam eget risus varius blandit.
						</p>
						<small className="text-muted">Donec id elit non mi porta.</small>
					</BootstrapListGroup.Item>
				</BootstrapListGroup>
			</Card.Body>
		</Card>
	)
}
const Badges = () => {
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">With badges</h4>
				<p className="text-muted mb-0">
					Add badges to any list group item to show unread counts, activity, and
					more with the help of some utilities.
				</p>
			</Card.Header>
			<Card.Body>
				<BootstrapListGroup>
					<BootstrapListGroup.Item className="d-flex justify-content-between align-items-center">
						Gmail Emails
						<Badge bg="primary" pill>
							14
						</Badge>
					</BootstrapListGroup.Item>
					<BootstrapListGroup.Item className="d-flex justify-content-between align-items-center">
						Pending Payments
						<Badge bg="success" pill>
							2
						</Badge>
					</BootstrapListGroup.Item>
					<BootstrapListGroup.Item className="d-flex justify-content-between align-items-center">
						Action Needed
						<Badge bg="danger" pill>
							99+
						</Badge>
					</BootstrapListGroup.Item>
					<BootstrapListGroup.Item className="d-flex justify-content-between align-items-center">
						Payments Done
						<Badge bg="success" pill>
							20+
						</Badge>
					</BootstrapListGroup.Item>
					<BootstrapListGroup.Item className="d-flex justify-content-between align-items-center">
						Pending Payments
						<Badge bg="warning" pill>
							12
						</Badge>
					</BootstrapListGroup.Item>
				</BootstrapListGroup>
			</Card.Body>
		</Card>
	)
}

const CheckboxesandRadios = () => {
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Checkboxes and radios</h4>
				<p className="text-muted mb-0">
					Place Bootstrap&apos;s checkboxes and radios within list group items
					and customize as needed. You can use them without{' '}
					<code>&lt;label&gt;</code>s, but please remember to include an{' '}
					<code>aria-label</code> attribute and value for accessibility.
				</p>
			</Card.Header>
			<Card.Body>
				<BootstrapListGroup>
					<BootstrapListGroup.Item>
						<input
							className="form-check-input me-1"
							type="checkbox"
							id="firstCheckbox"
							value=""
						/>{' '}
						<label className="form-check-label" htmlFor="firstCheckbox">
							First checkbox
						</label>
					</BootstrapListGroup.Item>
					<BootstrapListGroup.Item>
						<input
							className="form-check-input me-1"
							type="checkbox"
							value=""
							id="secondCheckbox"
						/>{' '}
						<label className="form-check-label" htmlFor="secondCheckbox">
							Second checkbox
						</label>
					</BootstrapListGroup.Item>
				</BootstrapListGroup>

				<ul className="list-group mt-2">
					<BootstrapListGroup.Item>
						<input
							className="form-check-input me-1"
							type="radio"
							name="listGroupRadio"
							value=""
							defaultChecked
						/>{' '}
						<label className="form-check-label" htmlFor="firstRadio">
							First radio
						</label>
					</BootstrapListGroup.Item>
					<BootstrapListGroup.Item>
						<input
							className="form-check-input me-1"
							type="radio"
							name="listGroupRadio"
							value=""
						/>{' '}
						<label className="form-check-label" htmlFor="secondRadio">
							Second radio
						</label>
					</BootstrapListGroup.Item>
				</ul>
			</Card.Body>
		</Card>
	)
}

const Numbered = () => {
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Numbered</h4>
				<p className="text-muted mb-0">
					Numbers are generated by <code>counter-reset</code> on the{' '}
					<code>&lt;ol&gt;</code>, and then styled and placed with a{' '}
					<code>::before</code> psuedo-element on the <code>&lt;li&gt;</code>{' '}
					with <code>counter-increment</code> and <code>content</code>.
				</p>
			</Card.Header>
			<Card.Body>
				<BootstrapListGroup as="ol" className="list-group-numbered">
					<BootstrapListGroup.Item
						as="li"
						className="d-flex justify-content-between align-items-start"
					>
						<div className="ms-2 me-auto">
							<div className="fw-bold">Velonic Admin</div>
							Velonic Admin
						</div>
						<Badge bg="primary" pill>
							865
						</Badge>
					</BootstrapListGroup.Item>
					<BootstrapListGroup.Item
						as="li"
						className="d-flex justify-content-between align-items-start"
					>
						<div className="ms-2 me-auto">
							<div className="fw-bold">Velonic React Admin</div>
							Velonic React Admin
						</div>
						<Badge bg="primary" pill>
							140
						</Badge>
					</BootstrapListGroup.Item>
					<BootstrapListGroup.Item
						as="li"
						className="list-group-item d-flex justify-content-between align-items-start"
					>
						<div className="ms-2 me-auto">
							<div className="fw-bold">Angular Version</div>
							Angular Version
						</div>
						<Badge bg="primary" pill>
							85
						</Badge>
					</BootstrapListGroup.Item>
				</BootstrapListGroup>
			</Card.Body>
		</Card>
	)
}

const ListGroup = () => {
	return (
		<>
			<PageBreadcrumb title="List  Group" subName="Base UI" />
			<Row>
				<Col xl={4}>
					<Basic />
				</Col>
				<Col xl={4}>
					<ActiveItems />
				</Col>
				<Col xl={4}>
					<DisabledItems />
				</Col>
			</Row>

			<Row>
				<Col xl={4}>
					<LinksButtons />
				</Col>
				<Col xl={4}>
					<Flush />
				</Col>

				<Col xl={4}>
					<Horizontal />
				</Col>
			</Row>

			<Row>
				<Col xl={4}>
					<Contextual />
				</Col>

				<Col xl={4}>
					<ContextualLinks />
				</Col>

				<Col xl={4}>
					<CustomContent />
				</Col>
			</Row>

			<Row>
				<Col xl={4}>
					<Badges />
				</Col>

				<Col xl={4}>
					<CheckboxesandRadios />
				</Col>

				<Col xl={4}>
					<Numbered />
				</Col>
			</Row>
		</>
	)
}

export default ListGroup
