import { Card, Col, Row, Badge, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

// components
import { PageBreadcrumb } from '@/components'

// constants
import { colorVariants, extendedColorVariants } from '@/constants/colorVariants'

const DefaultBadges = () => {
	return (
		<>
			<Card>
				<Card.Header>
					<h4 className="header-title">Default</h4>
					<p className="text-muted mb-0">
						A simple labeling component. Badges scale to match the size of the
						immediate parent element by using relative font sizing and{' '}
						<code>em</code> units.
					</p>
				</Card.Header>
				<Card.Body>
					<h1>
						h1.Example heading{' '}
						<Badge bg="secondary" className="text-light">
							New
						</Badge>
					</h1>
					<h2>
						h2.Example heading{' '}
						<Badge bg="success" className="bg-success-subtle text-success">
							New
						</Badge>
					</h2>
					<h3>
						h2.Example heading <Badge bg="primary">New</Badge>
					</h3>
					<h4>
						h4.Example heading{' '}
						<Link to="#" className="badge bg-info-subtle text-info">
							Info Link
						</Link>
					</h4>
					<h5>
						h5.Example heading{' '}
						<Badge bg="" className="badge-outline-warning">
							New
						</Badge>
					</h5>
					<h6>
						h6.Example heading <Badge bg="danger">New</Badge>
					</h6>
				</Card.Body>
			</Card>
		</>
	)
}

const PillBadges = () => {
	return (
		<>
			<Card>
				<Card.Header>
					<h4 className="header-title">Pill Badges</h4>
					<p className="text-muted mb-0">
						Use the <code>.rounded-pill</code> modifier class to make badges
						more rounded.
					</p>
				</Card.Header>
				<Card.Body>
					<div className="d-flex flex-wrap gap-1">
						{(colorVariants || []).map((color, idx) => {
							return (
								<Badge
									key={idx}
									pill
									bg={color}
									className={color === 'light' ? 'text-black' : 'text-white'}
								>
									{color.charAt(0).toUpperCase() + color.slice(1)}
								</Badge>
							)
						})}
					</div>

					<h5 className="mt-4">Lighten Badges</h5>
					<p className="text-muted fs-14 mb-3">
						Use the <code>.bg-*-subtle text-*</code> modifier class to make
						badges lighten.
					</p>
					<div className="d-flex flex-wrap gap-1">
						{(colorVariants || []).map((color, idx) => {
							return (
								<Badge
									key={idx}
									pill
									className={`bg-${color}-subtle text-${color} ${
										color === 'light' ? 'text-black' : ''
									}`}
								>
									{color.charAt(0).toUpperCase() + color.slice(1)}
								</Badge>
							)
						})}
					</div>
					<h5 className="mt-4">Outline Badges</h5>
					<p className="text-muted fs-14 mb-3">
						Using the <code>.badge-outline-*</code> to quickly create a bordered
						badges.
					</p>
					<div className="d-flex flex-wrap gap-1">
						{(colorVariants || []).map((color, idx) => {
							return (
								<Badge
									key={idx}
									pill
									bg=""
									className={`badge-outline-${color} ${
										color === 'light' ? 'text-black ' : ''
									}`}
								>
									{color.charAt(0).toUpperCase() + color.slice(1)}
								</Badge>
							)
						})}
					</div>
				</Card.Body>
			</Card>
		</>
	)
}

const ContextualVariations = () => {
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Contextual variations</h4>
				<p className="text-muted mb-0">
					Add any of the below mentioned modifier classes to change the
					appearance of a badge. Badge can be more contextual as well. Just use
					regular convention e.g. <code>badge-*color</code>,{' '}
					<code>bg-primary</code>
					&nbsp;to have badge with different background.
				</p>
			</Card.Header>
			<Card.Body>
				<div className="d-flex flex-wrap gap-1">
					{(extendedColorVariants || []).map((color, idx) => {
						return (
							<Badge
								key={idx}
								bg={color}
								className={color === 'light' ? 'text-black' : 'text-white'}
							>
								{color.charAt(0).toUpperCase() + color.slice(1)}
							</Badge>
						)
					})}
				</div>

				<h5 className="mt-4">Lighten Badges</h5>
				<p className="text-muted fs-14 mb-3">
					Using the <code>.bg-*-subtle text-*</code> modifier class, you can
					have more soften variation.
				</p>
				<div className="d-flex flex-wrap gap-1">
					{(extendedColorVariants || []).map((color, idx) => {
						return (
							<Badge
								key={idx}
								className={`bg-${color}-subtle text-${color}  ${
									color === 'light' ? 'text-black ' : ''
								}`}
							>
								{color}
							</Badge>
						)
					})}
				</div>

				<h5 className="mt-4">Outline Badges</h5>
				<p className="text-muted fs-14 mb-3">
					Using the <code>.badge-outline-*</code> to quickly create a bordered
					badges.
				</p>
				<div className="d-flex flex-wrap gap-1">
					{(colorVariants || []).map((color, idx) => {
						return (
							<Badge
								key={idx}
								bg=""
								className={`badge-outline-${color} ${
									color === 'light' ? 'text-black ' : ''
								}`}
							>
								{color}
							</Badge>
						)
					})}
				</div>
			</Card.Body>
		</Card>
	)
}

const BadgePositioned = () => {
	return (
		<>
			<Card>
				<Card.Header>
					<h4 className="header-title">Badge Positioned</h4>
					<p className="text-muted mb-0">
						Use utilities to modify a <code>.badge</code> and position it in the
						corner of a link or button.
					</p>
				</Card.Header>
				<Card.Body>
					<Row>
						<Col xs={6}>
							<Button variant="primary" className="position-relative">
								Inbox
								<span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
									99+
									<span className="visually-hidden">unread messages</span>
								</span>
							</Button>
						</Col>
						<Col xs={6}>
							<Button variant="primary" className="position-relative">
								Profile
								<span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
									<span className="visually-hidden">New alerts</span>
								</span>
							</Button>
						</Col>
						<Col xs={6}>
							<Button variant="success" className="mt-4">
								Notifications{' '}
								<Badge className="bg-light text-dark ms-1">4</Badge>
							</Button>
						</Col>
					</Row>
				</Card.Body>
			</Card>
		</>
	)
}

const Badges = () => {
	return (
		<>
			<PageBreadcrumb title="Badges" subName="Base UI" />
			<Row>
				<Col xl={12}>
					<DefaultBadges />
					<PillBadges />
				</Col>
				<Col xl={12}>
					<ContextualVariations />

					<BadgePositioned />
				</Col>
			</Row>
		</>
	)
}

export default Badges
