import {
	Button,
	Card,
	Col,
	Row,
	Offcanvas as BootstrapOffcanvas,
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useToggle } from '@/hooks'

// component
import { PageBreadcrumb } from '@/components'

interface BackdropOption {
	name: string
	scroll: boolean
	backdrop: boolean
}

interface PlacementOption {
	name: string
	placement?: 'start' | 'end' | 'top' | 'bottom'
}

const OffCanvasWithBackdrop = ({ name, ...props }: BackdropOption) => {
	const [isOpen, toggle] = useToggle()

	return (
		<>
			<Button variant="primary" onClick={toggle} className="mt-2 me-2 mt-md-0">
				{name}
			</Button>

			<BootstrapOffcanvas
				show={isOpen}
				onHide={toggle}
				{...props}
				className="offcanvas-start"
			>
				<BootstrapOffcanvas.Header closeButton>
					<BootstrapOffcanvas.Title as="h5">{name}</BootstrapOffcanvas.Title>
				</BootstrapOffcanvas.Header>
				<BootstrapOffcanvas.Body>
					<div>
						Some text as placeholder. In real life you can have the elements you
						have chosen. Like, text, images, lists, etc.
					</div>
					<h5 className="mt-3">List</h5>
					<ul className="ps-3">
						<li>Nemo enim ipsam voluptatem quia aspernatur</li>
						<li>Neque porro quisquam est, qui dolorem</li>
						<li>Quis autem vel eum iure qui in ea</li>
					</ul>

					<ul className="ps-3">
						<li>At vero eos et accusamus et iusto odio dignissimos</li>
						<li>Et harum quidem rerum facilis</li>
						<li>Temporibus autem quibusdam et aut officiis</li>
					</ul>
				</BootstrapOffcanvas.Body>
			</BootstrapOffcanvas>
		</>
	)
}

const OffcanvasPlacement = ({ name, ...props }: PlacementOption) => {
	const [isOpen, toggle] = useToggle()

	return (
		<>
			<Button variant="primary" onClick={toggle} className="mt-2 me-2 mt-md-0">
				{' '}
				Toggle {name} offcanvas
			</Button>
			<BootstrapOffcanvas show={isOpen} onHide={toggle} {...props}>
				<BootstrapOffcanvas.Header closeButton>
					<BootstrapOffcanvas.Title>Offcanvas {name}</BootstrapOffcanvas.Title>
				</BootstrapOffcanvas.Header>

				<BootstrapOffcanvas.Body className="offcanvas-body">
					<div>
						Some text as placeholder. In real life you can have the elements you
						have chosen. Like, text, images, lists, etc.
					</div>
					<h5 className="mt-3">List</h5>
					<ul className="ps-3">
						<li>Nemo enim ipsam voluptatem quia aspernatur</li>
						<li>Neque porro quisquam est, qui dolorem</li>
						<li>Quis autem vel eum iure qui in ea</li>
					</ul>
				</BootstrapOffcanvas.Body>
			</BootstrapOffcanvas>
		</>
	)
}
const LinkAndButtonOffcanvas = () => {
	const [isOpen, toggle] = useToggle()

	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Offcanvas</h4>
				<p className="text-muted mb-0">
					You can use a link with the <code>href</code> attribute, or a button
					with the <code>data-bs-target</code> attribute. In both cases, the{' '}
					<code>data-bs-toggle="offcanvas"</code> is required.
				</p>
			</Card.Header>
			<Card.Body>
				<div className="d-flex flex-wrap gap-2">
					<Link
						className="btn btn-primary"
						onClick={toggle}
						to="#"
						role="button"
					>
						Link with href
					</Link>
					<Button variant="primary" onClick={toggle}>
						Button with data-bs-target
					</Button>
				</div>

				<BootstrapOffcanvas
					show={isOpen}
					onHide={toggle}
					className="offcanvas-start"
					tabIndex={-1}
				>
					<BootstrapOffcanvas.Header closeButton>
						<BootstrapOffcanvas.Title as="h5">
							Offcanvas
						</BootstrapOffcanvas.Title>
					</BootstrapOffcanvas.Header>
					<BootstrapOffcanvas.Body className="offcanvas-body">
						<div>
							Some text as placeholder. In real life you can have the elements
							you have chosen. Like, text, images, lists, etc.
						</div>
						<h5 className="mt-3">List</h5>
						<ul className="ps-3">
							<li>Nemo enim ipsam voluptatem quia aspernatur</li>
							<li>Neque porro quisquam est, qui dolorem</li>
							<li>Quis autem vel eum iure qui in ea</li>
						</ul>

						<ul className="ps-3">
							<li>At vero eos et accusamus et iusto odio dignissimos</li>
							<li>Et harum quidem rerum facilis</li>
							<li>Temporibus autem quibusdam et aut officiis</li>
						</ul>
					</BootstrapOffcanvas.Body>
				</BootstrapOffcanvas>
			</Card.Body>
		</Card>
	)
}
const DarkOffcanvas = () => {
	const [isOpen, toggle] = useToggle()

	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Dark Offcanvas</h4>
				<p className="text-muted mb-0">
					Change the appearance of offcanvases with utilities to better match
					them to different contexts like dark navbars. Here we add{' '}
					<code>.text-bg-dark</code> to the <code>.offcanvas</code> and{' '}
					<code>.btn-close-white</code> to <code>.btn-close</code> for proper
					styling with a dark offcanvas. If you have dropdowns within, consider
					also adding <code>.dropdown-menu-dark</code> to{' '}
					<code>.dropdown-menu</code>.
				</p>
			</Card.Header>
			<Card.Body>
				<Button variant="primary" onClick={toggle} className="mt-2 mt-md-0">
					Dark offcanvas
				</Button>

				<BootstrapOffcanvas
					show={isOpen}
					onHide={toggle}
					className="offcanvas-start text-bg-dark"
				>
					<BootstrapOffcanvas.Header closeButton>
						<BootstrapOffcanvas.Title as="h5">
							Dark Offcanvas
						</BootstrapOffcanvas.Title>
					</BootstrapOffcanvas.Header>

					<BootstrapOffcanvas.Body>
						<div>
							Some text as placeholder. In real life you can have the elements
							you have chosen. Like, text, images, lists, etc.
						</div>
						<h5 className="mt-3">List</h5>
						<ul className="ps-3">
							<li>Nemo enim ipsam voluptatem quia aspernatur</li>
							<li>Neque porro quisquam est, qui dolorem</li>
							<li>Quis autem vel eum iure qui in ea</li>
						</ul>
					</BootstrapOffcanvas.Body>
				</BootstrapOffcanvas>
			</Card.Body>
		</Card>
	)
}
const Offcanvas = () => {
	const options: BackdropOption[] = [
		{
			name: 'Enable body scrolling',
			scroll: true,
			backdrop: false,
		},
		{
			name: 'Enable backdrop (default)',
			scroll: false,
			backdrop: true,
		},
		{
			name: 'Enable both scrolling & backdrop',
			scroll: true,
			backdrop: true,
		},
	]
	const placementOptions: PlacementOption[] = [
		{
			name: 'Top',
			placement: 'top',
		},
		{
			name: 'right',
			placement: 'end',
		},
		{
			name: 'bottom',
			placement: 'bottom',
		},
		{
			name: 'Left',
			placement: 'start',
		},
	]
	return (
		<>
			<PageBreadcrumb title="Offcanvas" subName="Base UI" />
			<Row>
				<Col xl={12}>
					<LinkAndButtonOffcanvas />
					<Card>
						<Card.Header>
							<h4 className="header-title">Offcanvas Backdrop</h4>
							<p className="text-muted mb-0">
								Scrolling the <code>&lt;body&gt;</code> element is disabled when
								an offcanvas and its backdrop are visible. Use the{' '}
								<code>data-bs-scroll</code> attribute to toggle{' '}
								<code>&lt;body&gt;</code> scrolling and{' '}
								<code>data-bs-backdrop</code> to toggle the backdrop.
							</p>
						</Card.Header>
						<Card.Body>
							{(options || []).map((props, idx) => (
								<OffCanvasWithBackdrop key={idx} {...props} />
							))}
						</Card.Body>
					</Card>
				</Col>

				<Col xl={12}>
					<Card>
						<Card.Header>
							<h4 className="header-title">Offcanvas Placement</h4>
							<p className="text-muted mb-0">
								Try the right and bottom examples out below.
							</p>
						</Card.Header>
						<Card.Body>
							<ul className="text-muted ">
								<li>
									<code>.offcanvas-start</code> places offcanvas on the left of
									the viewport (shown above)
								</li>
								<li>
									<code>.offcanvas-end</code> places offcanvas on the right of
									the viewport
								</li>
								<li>
									<code>.offcanvas-top</code> places offcanvas on the top of the
									viewport
								</li>
								<li>
									<code>.offcanvas-bottom</code> places offcanvas on the bottom
									of the viewport
								</li>
							</ul>
							<div>
								{placementOptions.map((option, idx) => (
									<OffcanvasPlacement
										key={idx}
										placement={option.placement}
										name={option.name}
									/>
								))}
							</div>
						</Card.Body>
					</Card>
					<DarkOffcanvas />
				</Col>
			</Row>
		</>
	)
}

export default Offcanvas
