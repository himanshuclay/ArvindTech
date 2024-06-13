import React from 'react'
import { Card, Col, Row, Dropdown, ButtonGroup, Button } from 'react-bootstrap'

// components
import { PageBreadcrumb } from '@/components'

// constants
import { extendedColorVariants } from '@/constants/colorVariants'

const SingleButtonDropdown = () => {
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Single button dropdowns</h4>
				<p className="text-muted mb-0">
					Any single <code>.btn</code> can be turned into a dropdown toggle with
					some markup changes. Here&apos;s how you can put them to work with
					either <code>&lt;button&gt;</code> elements:
				</p>
			</Card.Header>
			<Card.Body>
				<Row>
					<Col xs="auto">
						<Dropdown>
							<Dropdown.Toggle variant="light">Dropdown button</Dropdown.Toggle>
							<Dropdown.Menu>
								<Dropdown.Item href="#">Action</Dropdown.Item>
								<Dropdown.Item href="#">Another action</Dropdown.Item>
								<Dropdown.Item href="#">Something else here</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
					</Col>

					<Col xs="auto">
						<Dropdown>
							<Dropdown.Toggle variant="secondary">
								Dropdown link
							</Dropdown.Toggle>
							<Dropdown.Menu>
								<Dropdown.Item href="#">Action</Dropdown.Item>
								<Dropdown.Item href="#">Another action</Dropdown.Item>
								<Dropdown.Item href="#">Something else here</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
					</Col>
				</Row>
			</Card.Body>
		</Card>
	)
}

const DropdownVariant = () => {
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Variant</h4>
				<p className="text-muted mb-0">
					The best part is you can do this with any button variant, too:
				</p>
			</Card.Header>
			<Card.Body>
				{(extendedColorVariants || []).map((color, idx) => {
					return (
						<Dropdown key={idx} as={ButtonGroup} className="mb-2 me-1">
							<Dropdown.Toggle variant={color}>
								{color.charAt(0).toUpperCase() + color.slice(1)}
							</Dropdown.Toggle>
							<Dropdown.Menu>
								<Dropdown.Item href="#">Action</Dropdown.Item>
								<Dropdown.Item href="#">Another action</Dropdown.Item>
								<Dropdown.Item href="#">Something else here</Dropdown.Item>
								<Dropdown.Divider />
								<Dropdown.Item href="#">Separated link</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
					)
				})}
			</Card.Body>
		</Card>
	)
}

const AnimatedDropdown = () => {
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Animated Dropdown</h4>
				<p className="text-muted mb-0">
					Add <code>.dropdown-menu-animated</code>to a{' '}
					<code>.dropdown-menu</code> to have animated dropdown menu.
				</p>
			</Card.Header>
			<Card.Body>
				<Dropdown as={ButtonGroup}>
					<Dropdown.Toggle variant="light">Animated Dropdown</Dropdown.Toggle>
					<Dropdown.Menu className="dropdown-menu-animated">
						<Dropdown.Item href="#">Action</Dropdown.Item>
						<Dropdown.Item href="#">Another action</Dropdown.Item>
						<Dropdown.Item href="#">Something else here</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</Card.Body>
		</Card>
	)
}

const DropupVariationDropdowns = () => {
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Dropup variation</h4>
				<p className="text-muted mb-0">
					Trigger dropdown menus above elements by adding <code>.dropup</code>{' '}
					to the parent element.
				</p>
			</Card.Header>
			<Card.Body>
				<Dropdown as={ButtonGroup} className="me-1" drop="up">
					<Dropdown.Toggle variant="light">Dropup</Dropdown.Toggle>
					<Dropdown.Menu>
						<Dropdown.Item href="#">Action</Dropdown.Item>
						<Dropdown.Item href="#">Another action</Dropdown.Item>
						<Dropdown.Item href="#">Something else here</Dropdown.Item>
						<Dropdown.Divider />
						<Dropdown.Item href="#">Separated link</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
				<Dropdown as={ButtonGroup} drop="up">
					<Button variant="light">Split dropup</Button>
					<Dropdown.Toggle variant="light" className="dropdown-toggle-split">
						<span className="visually-hidden">Toggle Dropdown</span>
					</Dropdown.Toggle>
					<Dropdown.Menu>
						<Dropdown.Item href="#">Action</Dropdown.Item>
						<Dropdown.Item href="#">Another action</Dropdown.Item>
						<Dropdown.Item href="#">Something else here</Dropdown.Item>
						<Dropdown.Divider></Dropdown.Divider>
						<Dropdown.Item href="#">Separated link</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</Card.Body>
		</Card>
	)
}

const DropendVariationDropdowns = () => {
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Dropend variation</h4>
				<p className="text-muted mb-0">
					Trigger dropdown menus at the right of the elements by adding{' '}
					<code>.dropend</code> to the parent element.
				</p>
			</Card.Header>
			<Card.Body>
				<Dropdown as={ButtonGroup} drop="end" className="mb-2 me-1">
					<Dropdown.Toggle variant="primary" type="button">
						Dropend
					</Dropdown.Toggle>
					<Dropdown.Menu>
						<Dropdown.Item href="#">Action</Dropdown.Item>
						<Dropdown.Item href="#">Another action</Dropdown.Item>
						<Dropdown.Item href="#">Something else here</Dropdown.Item>
						<Dropdown.Divider></Dropdown.Divider>
						<Dropdown.Item href="#">Separated link</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
				<Dropdown as={ButtonGroup} drop="end" className="mb-2">
					<Button variant="primary">Split Dropend</Button>
					<Dropdown.Toggle variant="primary" className="dropdown-toggle-split">
						<span className="visually-hidden">Toggle Dropright</span>
					</Dropdown.Toggle>
					<Dropdown.Menu>
						<Dropdown.Item href="#">Action</Dropdown.Item>
						<Dropdown.Item href="#">Another action</Dropdown.Item>
						<Dropdown.Item href="#">Something else here</Dropdown.Item>
						<Dropdown.Divider></Dropdown.Divider>
						<Dropdown.Item href="#">Separated link</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</Card.Body>
		</Card>
	)
}

const DisabledItemDropdown = () => {
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Disabled Item</h4>
				<p className="text-muted mb-0">
					Add <code>.disabled</code> to items in the dropdown to{' '}
					<strong>style them as disabled</strong>.
				</p>
			</Card.Header>
			<Card.Body>
				<Dropdown as={ButtonGroup}>
					<Dropdown.Toggle variant="primary">Disabled</Dropdown.Toggle>
					<Dropdown.Menu className="dropdown-menu">
						<Dropdown.Item href="#">Regular link</Dropdown.Item>
						<Dropdown.Item disabled href="#">
							Disabled link
						</Dropdown.Item>
						<Dropdown.Item href="#">Another link</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</Card.Body>
		</Card>
	)
}

const Darkdropdowns = () => {
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Dark dropdowns</h4>
				<p className="text-muted mb-0">
					Opt into darker dropdowns to match a dark navbar or custom style by
					adding <code>.dropdown-menu-dark</code> onto an existing{' '}
					<code>.dropdown-menu</code>. No changes are required to the dropdown
					items.
				</p>
			</Card.Header>
			<Card.Body>
				<Dropdown>
					<Dropdown.Toggle variant="secondary">Dropdown button</Dropdown.Toggle>
					<Dropdown.Menu as="ul" variant="dark">
						<li>
							<Dropdown.Item active href="#">
								Action
							</Dropdown.Item>
						</li>
						<li>
							<Dropdown.Item href="#">Another action</Dropdown.Item>
						</li>
						<li>
							<Dropdown.Item href="#">Something else here</Dropdown.Item>
						</li>
						<li>
							<Dropdown.Divider />
						</li>
						<li>
							<Dropdown.Item href="#">Separated link</Dropdown.Item>
						</li>
					</Dropdown.Menu>
				</Dropdown>
			</Card.Body>
		</Card>
	)
}

const Dropdownoptions = () => {
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Dropdown options</h4>
				<p className="text-muted mb-0">
					Use <code>data-bs-offset</code> or <code>data-bs-reference</code> to
					change the location of the dropdown.
				</p>
			</Card.Header>
			<Card.Body>
				<div className="d-flex">
					<Dropdown className="me-1">
						<Dropdown.Toggle variant="secondary">Offset</Dropdown.Toggle>
						<Dropdown.Menu as="ul">
							<li>
								<Dropdown.Item href="#">Action</Dropdown.Item>
							</li>
							<li>
								<Dropdown.Item href="#">Another action</Dropdown.Item>
							</li>
							<li>
								<Dropdown.Item href="#">Something else here</Dropdown.Item>
							</li>
						</Dropdown.Menu>
					</Dropdown>
					<Dropdown as={ButtonGroup}>
						<Button variant="secondary">Reference</Button>
						<Dropdown.Toggle
							variant="secondary"
							className="dropdown-toggle-split"
						>
							<span className="visually-hidden">Toggle Dropdown</span>
						</Dropdown.Toggle>
						<Dropdown.Menu as="ul" className="dropdown-menu">
							<li>
								<Dropdown.Item href="#">Action</Dropdown.Item>
							</li>
							<li>
								<Dropdown.Item href="#">Another action</Dropdown.Item>
							</li>
							<li>
								<Dropdown.Item href="#">Something else here</Dropdown.Item>
							</li>
							<li>
								<Dropdown.Divider />
							</li>
							<li>
								<Dropdown.Item href="#">Separated link</Dropdown.Item>
							</li>
						</Dropdown.Menu>
					</Dropdown>
				</div>
			</Card.Body>
		</Card>
	)
}

const DropdownWithText = () => {
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Text</h4>
				<p className="text-muted mb-0">
					Place any freeform text within a dropdown menu with text and use
					spacing utilities. Note that you’ll likely need additional sizing
					styles to constrain the menu width.
				</p>
			</Card.Header>
			<Card.Body>
				<Dropdown as={ButtonGroup}>
					<Dropdown.Toggle>Text Dropdown</Dropdown.Toggle>
					<Dropdown.Menu className="p-3 text-muted" style={{ maxWidth: 200 }}>
						<p>
							Some example text that's free-flowing within the dropdown menu.
						</p>
						<p className="mb-0">And this is more example text.</p>
					</Dropdown.Menu>
				</Dropdown>
			</Card.Body>
		</Card>
	)
}

const DropdownMenuAlignment = () => {
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Menu alignment</h4>
				<p className="text-muted mb-0">
					Add <code>.dropdown-menu-end</code> to a <code>.dropdown-menu</code>{' '}
					to right align the dropdown menu.
				</p>
			</Card.Header>
			<Card.Body>
				<Dropdown>
					<Dropdown.Toggle variant="light">Right-aligned menu</Dropdown.Toggle>
					<Dropdown.Menu align="end">
						<Dropdown.Item href="#">Action</Dropdown.Item>
						<Dropdown.Item href="#">Another action</Dropdown.Item>
						<Dropdown.Item href="#">Something else here</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</Card.Body>
		</Card>
	)
}

const SplitColorVariantButtonDropdown = () => {
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Split button dropdowns</h4>
				<p className="text-muted mb-0">
					Similarly, create split button dropdowns with virtually the same
					markup as single button dropdowns, but with the addition of{' '}
					<code>.dropdown-toggle-split</code> for proper spacing around the
					dropdown caret.
				</p>
			</Card.Header>
			<Card.Body>
				{(extendedColorVariants || []).map((color, idx) => {
					return (
						<Dropdown key={idx} as={ButtonGroup} className="mb-2 me-1">
							<Button variant={color}>
								{color.charAt(0).toUpperCase() + color.slice(1)}
							</Button>
							<Dropdown.Toggle
								variant={color}
								className="dropdown-toggle-split"
							>
								<span className="visually-hidden">Toggle Dropdown</span>
							</Dropdown.Toggle>
							<Dropdown.Menu>
								<Dropdown.Item href="#">Action</Dropdown.Item>
								<Dropdown.Item href="#">Another action</Dropdown.Item>
								<Dropdown.Item href="#">Something else here</Dropdown.Item>
								<Dropdown.Divider></Dropdown.Divider>
								<Dropdown.Item href="#">Separated link</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
					)
				})}
			</Card.Body>
		</Card>
	)
}

const ButtonDropdownSizes = () => {
	const sizes = [
		{
			size: 'lg',
			name: 'Large button',
		},
		{
			size: 'sm',
			name: 'Small button',
		},
	]

	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Sizing</h4>
				<p className="text-muted mb-0">
					Button dropdowns work with buttons of all sizes, including default and
					split dropdown buttons.
				</p>
			</Card.Header>
			<Card.Body>
				{(sizes || []).map((item, idx) => {
					return (
						<React.Fragment key={idx}>
							<Dropdown as={ButtonGroup} className="me-1" size={item.size}>
								<Dropdown.Toggle variant="light">{item.name}</Dropdown.Toggle>
								<Dropdown.Menu>
									<Dropdown.Item href="#">Action</Dropdown.Item>
									<Dropdown.Item href="#">Another action</Dropdown.Item>
									<Dropdown.Item href="#">Something else here</Dropdown.Item>
									<Dropdown.Divider></Dropdown.Divider>
									<Dropdown.Item href="#">Separated link</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
							<Dropdown
								as={ButtonGroup}
								className="me-1"
								size={item.size}
								key={idx}
							>
								<Button variant="light">{item.name}</Button>
								<Dropdown.Toggle
									variant="light"
									className="dropdown-toggle-split"
								>
									<span className="visually-hidden">Toggle Dropdown</span>
								</Dropdown.Toggle>
								<Dropdown.Menu>
									<Dropdown.Item href="#">Action</Dropdown.Item>
									<Dropdown.Item href="#">Another action</Dropdown.Item>
									<Dropdown.Item href="#">Something else here</Dropdown.Item>
									<Dropdown.Divider></Dropdown.Divider>
									<Dropdown.Item href="#">Separated link</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
						</React.Fragment>
					)
				})}
			</Card.Body>
		</Card>
	)
}

const DropstartVariation = () => {
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Dropstart variation</h4>
				<p className="text-muted mb-0">
					Trigger dropdown menus at the right of the elements by adding{' '}
					<code>.dropleft</code> to the parent element.
				</p>
			</Card.Header>
			<Card.Body>
				<Dropdown as={ButtonGroup} drop="start" className="me-1">
					<Dropdown.Toggle variant="secondary">Dropstart</Dropdown.Toggle>
					<Dropdown.Menu>
						<Dropdown.Item href="#">Action</Dropdown.Item>
						<Dropdown.Item href="#">Another action</Dropdown.Item>
						<Dropdown.Item href="#">Something else here</Dropdown.Item>
						<Dropdown.Divider></Dropdown.Divider>
						<Dropdown.Item href="#">Separated link</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
				<Dropdown as={ButtonGroup}>
					<Dropdown as={ButtonGroup} drop="start">
						<Dropdown.Toggle variant="secondary">
							<span className="visually-hidden">Toggle Dropstart</span>
						</Dropdown.Toggle>
						<Dropdown.Menu>
							<Dropdown.Item href="#">Action</Dropdown.Item>
							<Dropdown.Item href="#">Another action</Dropdown.Item>
							<Dropdown.Item href="#">Something else here</Dropdown.Item>
							<Dropdown.Divider></Dropdown.Divider>
							<Dropdown.Item href="#">Separated link</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
					<Button variant="secondary">Split dropstart</Button>
				</Dropdown>
			</Card.Body>
		</Card>
	)
}

const ActiveItemDropdown = () => {
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Active Item</h4>
				<p className="text-muted mb-0">
					Add <code>.active</code> to item in the dropdown to{' '}
					<strong>style them as active</strong>.
				</p>
			</Card.Header>
			<Card.Body>
				<Dropdown as={ButtonGroup}>
					<Dropdown.Toggle variant="secondary">Active Item</Dropdown.Toggle>
					<Dropdown.Menu>
						<Dropdown.Item href="#">Regular link</Dropdown.Item>
						<Dropdown.Item active href="#">
							Active link
						</Dropdown.Item>
						<Dropdown.Item href="#">Another link</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</Card.Body>
		</Card>
	)
}

const Headersdropdown = () => {
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Headers</h4>
				<p className="text-muted mb-0">
					Add a header to label sections of actions in any dropdown menu.
				</p>
			</Card.Header>
			<Card.Body>
				<Dropdown as={ButtonGroup}>
					<Dropdown.Toggle variant="secondary">Header</Dropdown.Toggle>
					<Dropdown.Menu>
						<Dropdown.Header as="h5">Dropdown header</Dropdown.Header>
						<Dropdown.Item href="#">Action</Dropdown.Item>
						<Dropdown.Item href="#">Another action</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</Card.Body>
		</Card>
	)
}

const Centereddropdowns = () => {
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Centered dropdowns</h4>
				<p className="text-muted mb-0">
					Make the dropdown menu centered below the toggle with{' '}
					<code>.dropdown-center</code> on the parent element.
				</p>
			</Card.Header>
			<Card.Body>
				<div className="hstack gap-2">
					<Dropdown className="dropdown-center">
						<Dropdown.Toggle variant="secondary">
							Centered dropdown
						</Dropdown.Toggle>
						<Dropdown.Menu as="ul">
							<li>
								<Dropdown.Item href="#">Action</Dropdown.Item>
							</li>
							<li>
								<Dropdown.Item href="#">Action two</Dropdown.Item>
							</li>
							<li>
								<Dropdown.Item href="#">Action three</Dropdown.Item>
							</li>
						</Dropdown.Menu>
					</Dropdown>

					<Dropdown className="dropup-cented" drop="up">
						<Dropdown.Toggle variant="secondary">
							Centered dropup
						</Dropdown.Toggle>
						<Dropdown.Menu as="ul">
							<li>
								<Dropdown.Item href="#">Action</Dropdown.Item>
							</li>
							<li>
								<Dropdown.Item href="#">Action two</Dropdown.Item>
							</li>
							<li>
								<Dropdown.Item href="#">Action three</Dropdown.Item>
							</li>
						</Dropdown.Menu>
					</Dropdown>
				</div>
			</Card.Body>
		</Card>
	)
}

const AutoCloseBehaviordropdown = () => {
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Auto close behavior</h4>
				<p className="text-muted mb-0">
					By default, the dropdown menu is closed when clicking inside or
					outside the dropdown menu. You can use the <code>autoClose</code>{' '}
					option to change this behavior of the dropdown.
				</p>
			</Card.Header>
			<Card.Body>
				<div className="hstack gap-2">
					<Dropdown autoClose as={ButtonGroup}>
						<Dropdown.Toggle variant="secondary">
							Default dropdown
						</Dropdown.Toggle>
						<Dropdown.Menu as="ul">
							<li>
								<Dropdown.Item href="#">Menu item</Dropdown.Item>
							</li>
							<li>
								<Dropdown.Item href="#">Menu item</Dropdown.Item>
							</li>
							<li>
								<Dropdown.Item href="#">Menu item</Dropdown.Item>
							</li>
						</Dropdown.Menu>
					</Dropdown>

					<Dropdown autoClose="inside" as={ButtonGroup}>
						<Dropdown.Toggle variant="secondary">
							Clickable inside
						</Dropdown.Toggle>
						<Dropdown.Menu as="ul">
							<li>
								<Dropdown.Item href="#">Menu item</Dropdown.Item>
							</li>
							<li>
								<Dropdown.Item href="#">Menu item</Dropdown.Item>
							</li>
							<li>
								<Dropdown.Item href="#">Menu item</Dropdown.Item>
							</li>
						</Dropdown.Menu>
					</Dropdown>

					<Dropdown autoClose="outside" as={ButtonGroup}>
						<Dropdown.Toggle variant="secondary">
							Clickable outside
						</Dropdown.Toggle>
						<Dropdown.Menu as="ul">
							<li>
								<Dropdown.Item href="#">Menu item</Dropdown.Item>
							</li>
							<li>
								<Dropdown.Item href="#">Menu item</Dropdown.Item>
							</li>
							<li>
								<Dropdown.Item href="#">Menu item</Dropdown.Item>
							</li>
						</Dropdown.Menu>
					</Dropdown>

					<Dropdown autoClose="inside" as={ButtonGroup}>
						<Dropdown.Toggle
							variant="secondary"
							className="btn btn-secondary"
							type="button"
						>
							Manual close
						</Dropdown.Toggle>
						<Dropdown.Menu as="ul">
							<li>
								<Dropdown.Item href="#">Menu item</Dropdown.Item>
							</li>
							<li>
								<Dropdown.Item href="#">Menu item</Dropdown.Item>
							</li>
							<li>
								<Dropdown.Item href="#">Menu item</Dropdown.Item>
							</li>
						</Dropdown.Menu>
					</Dropdown>
				</div>
			</Card.Body>
		</Card>
	)
}

const CustomDropdown = () => {
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Forms</h4>
				<p className="text-muted mb-0">
					Put a form within a dropdown menu, or make it into a dropdown menu,
					and use margin or padding utilities to give it the negative space you
					require.
				</p>
			</Card.Header>
			<Card.Body>
				<Dropdown>
					<Dropdown.Toggle variant="secondary">Form</Dropdown.Toggle>
					<Dropdown.Menu>
						<form className="px-4 py-3">
							<div className="mb-3">
								<label
									htmlFor="exampleDropdownFormEmail1"
									className="form-label"
								>
									Email address
								</label>
								<input
									type="email"
									className="form-control"
									id="exampleDropdownFormEmail1"
									placeholder="email@example.com"
								/>
							</div>
							<div className="mb-3">
								<label
									htmlFor="exampleDropdownFormPassword1"
									className="form-label"
								>
									Password
								</label>
								<input
									type="password"
									className="form-control"
									id="exampleDropdownFormPassword1"
									placeholder="Password"
								/>
							</div>
							<div className="mb-2">
								<div className="form-check">
									<input
										type="checkbox"
										className="form-check-input"
										id="dropdownCheck"
									/>
									<label className="form-check-label" htmlFor="dropdownCheck">
										Remember me
									</label>
								</div>
							</div>
							<Button variant="primary">Sign in</Button>
						</form>
						<Dropdown.Divider></Dropdown.Divider>
						<Dropdown.Item href="#">New around here? Sign up</Dropdown.Item>
						<Dropdown.Item href="#">Forgot password?</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</Card.Body>
		</Card>
	)
}

const Dropdowns = () => {
	return (
		<>
			<PageBreadcrumb title="Dropdowns" subName="Base UI" />
			<Row>
				<Col xl={12}>
					<SingleButtonDropdown />
					<DropdownVariant />
					<AnimatedDropdown />
					<DropupVariationDropdowns />
					<DropendVariationDropdowns />
					<DisabledItemDropdown />
					<Darkdropdowns />
					<Dropdownoptions />
					<DropdownWithText />
				</Col>

				<Col xl={12}>
					<DropdownMenuAlignment />
					<SplitColorVariantButtonDropdown />
					<ButtonDropdownSizes />
					<DropstartVariation />
					<ActiveItemDropdown />
					<Headersdropdown />
					<Centereddropdowns />
					<AutoCloseBehaviordropdown />
					<CustomDropdown />
				</Col>
			</Row>
		</>
	)
}

export default Dropdowns
