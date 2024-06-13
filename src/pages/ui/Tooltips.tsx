import {
	Button,
	Card,
	Col,
	OverlayProps,
	OverlayTrigger,
	Row,
	Tooltip,
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
// component
import { PageBreadcrumb } from '@/components'

// constants
import { colorVariants } from '@/constants/colorVariants'

interface PopoverDirection {
	placement: OverlayProps['placement']
}

const Basic = () => {
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Examples</h4>
				<p className="text-muted mb-0">
					Hover over the links below to see tooltips.
				</p>
			</Card.Header>
			<Card.Body>
				<p className="muted mb-0">
					Tight pants next level keffiyeh{' '}
					<OverlayTrigger
						placement="top"
						overlay={<Tooltip id="overlay-example"> Default tooltip </Tooltip>}
					>
						<Link to="#">you probably</Link>
					</OverlayTrigger>{' '}
					haven't heard of them. Photo booth beard raw denim letterpress vegan
					messenger bag stumptown. Farm-to-table Photo booth beard seitan,
					mcsweeney's fixie sustainable quinoa 8-bit american apparel
					<OverlayTrigger
						placement="top"
						overlay={<Tooltip id="overlay-example"> Another one </Tooltip>}
					>
						<Link to="#"> have a</Link>
					</OverlayTrigger>{' '}
					terry richardson vinyl chambray. Beard stumptown, cardigans banh mi
					lomo thundercats. Tofu biodiesel williamsburg marfa, four loko
					mcsweeney's cleanse vegan chambray. A really ironic artisan
					<OverlayTrigger
						placement="top"
						overlay={
							<Tooltip id="overlay-example"> Another one here too</Tooltip>
						}
					>
						<Link to="#"> whatever </Link>
					</OverlayTrigger>
					keytar, scenester farm-to-table banksy Austin
					<OverlayTrigger
						placement="top"
						overlay={<Tooltip id="overlay-example"> The last tip!</Tooltip>}
					>
						<Link to="#"> twitter handle </Link>
					</OverlayTrigger>
					freegan cred raw denim single-origin coffee viral.
				</p>
			</Card.Body>
		</Card>
	)
}

const DisabledElements = () => {
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Disabled elements</h4>
				<p className="text-muted mb-0">
					Elements with the <code>disabled</code> attribute aren&apos;t
					interactive, meaning users cannot focus, hover, or click them to
					trigger a tooltip (or popover). As a workaround, you&apos;ll want to
					trigger the tooltip from a wrapper <code>&lt;div&gt;</code> or{' '}
					<code>&lt;span&gt;</code>, ideally made keyboard-focusable using{' '}
					<code>tabindex={`"0"`}</code>, and override the{' '}
					<code>pointer-events</code> on the disabled element.
				</p>
			</Card.Header>
			<Card.Body>
				<div>
					<OverlayTrigger
						overlay={<Tooltip id="tooltip-disabled">Disabled Tooltip!</Tooltip>}
					>
						<span className="d-inline-block">
							<Button variant="primary" className="pe-none" disabled>
								Disabled button
							</Button>
						</span>
					</OverlayTrigger>
				</div>
			</Card.Body>
		</Card>
	)
}

const Direction = () => {
	const directions: PopoverDirection[] = [
		{ placement: 'top' },
		{ placement: 'bottom' },
		{ placement: 'left' },
		{ placement: 'right' },
	]
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Four Directions</h4>
				<p className="text-muted mb-0">
					Hover over the buttons below to see the four tooltips directions: top,
					right, bottom, and left.
				</p>
			</Card.Header>
			<Card.Body>
				<div className="d-flex flex-wrap gap-2">
					{(directions || []).map((direction, idx) => (
						<OverlayTrigger
							key={idx}
							placement={direction.placement}
							overlay={
								<Tooltip id={`tooltip-${direction.placement}`}>
									Tooltip on <strong>{direction.placement}</strong>.
								</Tooltip>
							}
						>
							<Button variant="info">Tooltip on {direction.placement}</Button>
						</OverlayTrigger>
					))}
				</div>
			</Card.Body>
		</Card>
	)
}

const HtmlContent = () => {
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">HTML Tags</h4>
				<p className="text-muted mb-0">And with custom HTML added:</p>
			</Card.Header>
			<Card.Body>
				<OverlayTrigger
					placement="top"
					overlay={
						<Tooltip>
							<em>Tooltip</em> <u>with</u> <b>HTML</b>
						</Tooltip>
					}
				>
					<Button variant="secondary">Tooltip with HTML</Button>
				</OverlayTrigger>
			</Card.Body>
		</Card>
	)
}

const ColorTooltip = () => {
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Color Tooltips</h4>
				<p className="text-muted mb-0">
					We set a custom class with ex.{' '}
					<code>data-bs-custom-class="primary-tooltip"</code> to scope our
					background-color primary appearance and use it to override a local CSS
					variable.
				</p>
			</Card.Header>
			<Card.Body>
				<div className="d-flex flex-wrap gap-2">
					{(colorVariants || []).map((color, idx) => (
						<OverlayTrigger
							key={idx}
							overlay={
								<Tooltip className={`${color}-tooltip`}>
									This top tooltip is themed via CSS variables.
								</Tooltip>
							}
						>
							<Button variant={color}>
								{color.charAt(0).toUpperCase() + color.slice(1)} tooltip
							</Button>
						</OverlayTrigger>
					))}
				</div>
			</Card.Body>
		</Card>
	)
}

const Tooltips = () => {
	return (
		<>
			<PageBreadcrumb title="Tooltips" subName="Base UI" />
			<Row>
				<Col xl={12}>
					<Basic />
					<DisabledElements />
				</Col>
				<Col xl={12}>
					<Direction />
					<HtmlContent />
					<ColorTooltip />
				</Col>
			</Row>
		</>
	)
}

export default Tooltips
