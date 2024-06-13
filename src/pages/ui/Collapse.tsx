import { useState } from 'react'
import {
	Button,
	Card,
	Col,
	Row,
	Collapse as BootstrapCollapse,
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useToggle } from '@/hooks'

// component
import { PageBreadcrumb } from '@/components'

const BasicCollapse = () => {
	const [isOpen, setIsOpen] = useState<boolean>(true)
	const toggle = () => setIsOpen(!isOpen)
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Collapse</h4>
				<p className="text-muted mb-0">
					Bootstrap's collapse provides the way to toggle the visibility of any
					content or element. Please read the official{' '}
					<Link
						to="https://getbootstrap.com/docs/5.2/components/collapse/"
						target="_blank"
					>
						Bootstrap
					</Link>{' '}
					documentation for a full list of options.
				</p>
			</Card.Header>
			<Card.Body>
				<p className="d-flex flex-wrap gap-1">
					<Link className="btn btn-primary" to="#" onClick={toggle}>
						Link with href
					</Link>
					<Button variant="primary" className="ms-1" onClick={toggle}>
						Button with data-bs-target
					</Button>
				</p>
				<BootstrapCollapse in={isOpen}>
					<div>
						<Card className="mb-0">
							<Card.Body>
								Anim pariatur cliche reprehenderit, enim eiusmod high life
								accusamus terry richardson ad squid. Nihil anim keffiyeh
								helvetica, craft beer labore wes anderson cred nesciunt sapiente
								ea proident.
							</Card.Body>
						</Card>
					</div>
				</BootstrapCollapse>
			</Card.Body>
		</Card>
	)
}

const HorizontalCollapse = () => {
	const [open, setOpen] = useState<boolean>(false)
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Collapse Horizontal</h4>
				<p className="text-muted mb-0">
					The collapse plugin also supports horizontal collapsing. Add the{' '}
					<code>.collapse-horizontal</code> modifier class to transition the{' '}
					<code>width</code> instead of <code>height</code> and set a{' '}
					<code>width</code> on the immediate child element.
				</p>
			</Card.Header>
			<Card.Body>
				<p>
					<Button
						onClick={() => setOpen(!open)}
						variant="primary"
						aria-expanded={open}
					>
						Toggle width collapse
					</Button>
				</p>
				<div style={{ minHeight: 112 }}>
					<BootstrapCollapse in={open} dimension="width">
						<div>
							<Card className="mb-0" style={{ width: 300 }}>
								<Card.Body>
									This is some placeholder content for a horizontal collapse.
									It's hidden by default and shown when triggered.
								</Card.Body>
							</Card>
						</div>
					</BootstrapCollapse>
				</div>
			</Card.Body>
		</Card>
	)
}

const MultipleTargetsCollapse = () => {
	const [isOpenFirst, toggleFirst] = useToggle(false)
	const [isOpenSecond, toggleSecond] = useToggle(false)
	const toggleBoth = () => {
		toggleFirst()
		toggleSecond()
	}

	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Multiple Targets</h4>
				<p className="text-muted mb-0">
					Multiple <code>&lt;button&gt;</code> or <code>&lt;a&gt;</code> can
					show and hide an element if they each reference it with their{' '}
					<code>href</code> or <code>data-bs-target</code> attribute
				</p>
			</Card.Header>
			<Card.Body>
				<p className="d-flex flex-wrap gap-1">
					<Link to="#" className="btn btn-primary" onClick={toggleFirst}>
						Toggle first element
					</Link>
					<Button variant="primary" type="button" onClick={toggleSecond}>
						Toggle second element
					</Button>
					<Button variant="primary" type="button" onClick={toggleBoth}>
						Toggle both elements
					</Button>
				</p>
				<Row>
					<Col>
						<BootstrapCollapse in={isOpenFirst}>
							<div>
								<Card className="mb-0">
									<Card.Body>
										Anim pariatur cliche reprehenderit, enim eiusmod high life
										accusamus terry richardson ad squid. Nihil anim keffiyeh
										helvetica, craft beer labore wes anderson cred nesciunt
										sapiente ea proident.
									</Card.Body>
								</Card>
							</div>
						</BootstrapCollapse>
					</Col>
					<Col>
						<BootstrapCollapse in={isOpenSecond}>
							<div>
								<Card className="mb-0">
									<Card.Body>
										Anim pariatur cliche reprehenderit, enim eiusmod high life
										accusamus terry richardson ad squid. Nihil anim keffiyeh
										helvetica, craft beer labore wes anderson cred nesciunt
										sapiente ea proident.
									</Card.Body>
								</Card>
							</div>
						</BootstrapCollapse>
					</Col>
				</Row>
			</Card.Body>
		</Card>
	)
}
const Collapse = () => {
	return (
		<>
			<PageBreadcrumb title="Collapse" subName="Base UI" />
			<Row>
				<Col xl={6}>
					<BasicCollapse />
				</Col>
				<Col xl={6}>
					<HorizontalCollapse />
				</Col>
			</Row>

			<Row>
				<Col xl={6}>
					<MultipleTargetsCollapse />
				</Col>
			</Row>
		</>
	)
}

export default Collapse
