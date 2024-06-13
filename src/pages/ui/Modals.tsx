import { Button, Card, Col, Modal, Row } from 'react-bootstrap'
import { useModal, useToggle } from '@/hooks'
import { Link } from 'react-router-dom'

// component
import { PageBreadcrumb } from '@/components'

// images
import logo from '@/assets/images/logo.png'
import darkLogo from '@/assets/images/logo-dark.png'
import { useState } from 'react'

const ModalSizes = () => {
	const [isStandardOpen, toggleStandard] = useToggle()
	const {
		isOpen,
		size,
		className,
		scroll,
		toggleModal,
		openModalWithSize,
		openModalWithClass,
		openModalWithScroll,
	} = useModal()
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Bootstrap Modals</h4>
				<p className="text-muted mb-0">
					A rendered modal with header, body, and set of actions in the footer.
				</p>
			</Card.Header>
			<Card.Body className="d-flex flex-wrap gap-2">
				<Button variant="primary" onClick={toggleStandard}>
					Standard Modal
				</Button>
				<Button variant="info" onClick={() => openModalWithSize('lg')}>
					Large Modal
				</Button>
				<Button variant="success" onClick={() => openModalWithSize('sm')}>
					Small Modal
				</Button>
				<Button
					variant="primary"
					onClick={() => openModalWithClass('modal-full-width')}
				>
					Full Width Modal
				</Button>
				<Button variant="secondary" onClick={openModalWithScroll}>
					Scrollable Modal
				</Button>

				<Modal show={isStandardOpen} onHide={toggleStandard}>
					<Modal.Header onHide={toggleStandard} closeButton>
						<Modal.Title as="h4">Modal Heading</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<h5>Text in a modal</h5>
						<p>
							Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
						</p>
						<hr />
						<h5>Overflowing text to show scroll behavior</h5>
						<p>
							Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
							dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta
							ac consectetur ac, vestibulum at eros.
						</p>
						<p>
							Praesent commodo cursus magna, vel scelerisque nisl consectetur
							et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor
							auctor.
						</p>
						<p className="mb-0">
							Aenean lacinia bibendum nulla sed consectetur. Praesent commodo
							cursus magna, vel scelerisque nisl consectetur et. Donec sed odio
							dui. Donec ullamcorper nulla non metus auctor fringilla.
						</p>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="light" onClick={toggleStandard}>
							Close
						</Button>
						<Button variant="primary" onClick={toggleStandard}>
							Save changes
						</Button>
					</Modal.Footer>
				</Modal>

				<Modal
					className="fade"
					show={isOpen}
					onHide={toggleModal}
					dialogClassName={className}
					size={size}
					scrollable={scroll}
				>
					<Modal.Header onHide={toggleModal} closeButton>
						<h4 className="modal-title">Modal Heading</h4>
					</Modal.Header>
					<Modal.Body>
						...
						{scroll && (
							<>
								<p>
									Cras mattis consectetur purus sit amet fermentum. Cras justo
									odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
									risus, porta ac consectetur ac, vestibulum at eros.
								</p>
								<p>
									Praesent commodo cursus magna, vel scelerisque nisl
									consectetur et. Vivamus sagittis lacus vel augue laoreet
									rutrum faucibus dolor auctor.
								</p>
								<p>
									Cras mattis consectetur purus sit amet fermentum. Cras justo
									odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
									risus, porta ac consectetur ac, vestibulum at eros.
								</p>
								<p>
									Praesent commodo cursus magna, vel scelerisque nisl
									consectetur et. Vivamus sagittis lacus vel augue laoreet
									rutrum faucibus dolor auctor.
								</p>
								<p>
									Aenean lacinia bibendum nulla sed consectetur. Praesent
									commodo cursus magna, vel scelerisque nisl consectetur et.
									Donec sed odio dui. Donec ullamcorper nulla non metus auctor
									fringilla.
								</p>
								<p>
									Cras mattis consectetur purus sit amet fermentum. Cras justo
									odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
									risus, porta ac consectetur ac, vestibulum at eros.
								</p>
								<p>
									Praesent commodo cursus magna, vel scelerisque nisl
									consectetur et. Vivamus sagittis lacus vel augue laoreet
									rutrum faucibus dolor auctor.
								</p>
								<p>
									Aenean lacinia bibendum nulla sed consectetur. Praesent
									commodo cursus magna, vel scelerisque nisl consectetur et.
									Donec sed odio dui. Donec ullamcorper nulla non metus auctor
									fringilla.
								</p>
								<p>
									Cras mattis consectetur purus sit amet fermentum. Cras justo
									odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
									risus, porta ac consectetur ac, vestibulum at eros.
								</p>
								<p>
									Praesent commodo cursus magna, vel scelerisque nisl
									consectetur et. Vivamus sagittis lacus vel augue laoreet
									rutrum faucibus dolor auctor.
								</p>
								<p>
									Aenean lacinia bibendum nulla sed consectetur. Praesent
									commodo cursus magna, vel scelerisque nisl consectetur et.
									Donec sed odio dui. Donec ullamcorper nulla non metus auctor
									fringilla.
								</p>
								<p>
									Cras mattis consectetur purus sit amet fermentum. Cras justo
									odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
									risus, porta ac consectetur ac, vestibulum at eros.
								</p>
								<p>
									Praesent commodo cursus magna, vel scelerisque nisl
									consectetur et. Vivamus sagittis lacus vel augue laoreet
									rutrum faucibus dolor auctor.
								</p>
								<p>
									Aenean lacinia bibendum nulla sed consectetur. Praesent
									commodo cursus magna, vel scelerisque nisl consectetur et.
									Donec sed odio dui. Donec ullamcorper nulla non metus auctor
									fringilla.
								</p>
								<p>
									Cras mattis consectetur purus sit amet fermentum. Cras justo
									odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
									risus, porta ac consectetur ac, vestibulum at eros.
								</p>
								<p>
									Praesent commodo cursus magna, vel scelerisque nisl
									consectetur et. Vivamus sagittis lacus vel augue laoreet
									rutrum faucibus dolor auctor.
								</p>
								<p>
									Aenean lacinia bibendum nulla sed consectetur. Praesent
									commodo cursus magna, vel scelerisque nisl consectetur et.
									Donec sed odio dui. Donec ullamcorper nulla non metus auctor
									fringilla.
								</p>
								<p>
									Cras mattis consectetur purus sit amet fermentum. Cras justo
									odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
									risus, porta ac consectetur ac, vestibulum at eros.
								</p>
							</>
						)}
					</Modal.Body>
					<Modal.Footer>
						<Button variant="light" onClick={toggleModal}>
							Close
						</Button>{' '}
						<Button onClick={toggleModal}>Save changes</Button>
					</Modal.Footer>
				</Modal>
			</Card.Body>
		</Card>
	)
}

const ModalsWithPages = () => {
	const [signUpModal, toggleSignUp] = useToggle()
	const [signInModal, toggleSignIn] = useToggle()

	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Modal with Pages</h4>
				<p className="text-muted mb-0">Examples of custom modals.</p>
			</Card.Header>
			<Card.Body>
				<div className="d-flex flex-wrap gap-2">
					<Button variant="primary" onClick={toggleSignUp}>
						Sign Up Modal
					</Button>
					<Button variant="info" onClick={toggleSignIn}>
						Log In Modal
					</Button>
				</div>
				<Modal show={signUpModal} onHide={toggleSignUp}>
					<Modal.Body>
						<div className="auth-brand text-center mt-2 mb-4 position-relative top-0">
							<Link to="#" className="logo-dark">
								<span>
									<img src={darkLogo} alt="dark logo" height="22" />
								</span>
							</Link>
							<Link to="#" className="logo-light">
								<span>
									<img src={logo} alt="logo" height="22" />
								</span>
							</Link>
						</div>

						<form className="ps-3 pe-3" action="#">
							<div className="mb-3">
								<label htmlFor="username" className="form-label">
									Name
								</label>
								<input
									className="form-control"
									type="email"
									id="username"
									required
									placeholder="Michael Zenaty"
								/>
							</div>
							<div className="mb-3">
								<label htmlFor="emailaddress" className="form-label">
									Email address
								</label>
								<input
									className="form-control"
									type="email"
									id="emailaddress"
									required
									placeholder="john@deo.com"
								/>
							</div>
							<div className="mb-3">
								<label htmlFor="password" className="form-label">
									Password
								</label>
								<input
									className="form-control"
									type="password"
									required
									id="password"
									placeholder="Enter your password"
								/>
							</div>
							<div className="mb-3">
								<div className="form-check">
									<input
										type="checkbox"
										className="form-check-input"
										id="customCheck1"
									/>
									<label className="form-check-label" htmlFor="customCheck1">
										I accept <Link to="#">Terms and Conditions</Link>
									</label>
								</div>
							</div>
							<div className="mb-3 text-center">
								<Button variant="primary" type="submit">
									Sign Up Free
								</Button>
							</div>
						</form>
					</Modal.Body>
				</Modal>

				<Modal className="fade" show={signInModal} onHide={toggleSignIn}>
					<Modal.Body>
						<div className="auth-brand text-center mt-2 mb-4 position-relative top-0">
							<Link to="#" className="logo-dark">
								<span>
									<img src={darkLogo} alt="dark logo" height="22" />
								</span>
							</Link>
							<Link to="#" className="logo-light">
								<span>
									<img src={logo} alt="logo" height="22" />
								</span>
							</Link>
						</div>
						<form action="#" className="ps-3 pe-3">
							<div className="mb-3">
								<label htmlFor="emailaddress1" className="form-label">
									Email address
								</label>
								<input
									className="form-control"
									type="email"
									id="emailaddress1"
									required
									placeholder="john@deo.com"
								/>
							</div>

							<div className="mb-3">
								<label htmlFor="password1" className="form-label">
									Password
								</label>
								<input
									className="form-control"
									type="password"
									required
									id="password1"
									placeholder="Enter your password"
								/>
							</div>

							<div className="mb-3">
								<div className="form-check">
									<input
										type="checkbox"
										className="form-check-input"
										id="customCheck2"
									/>
									<label className="form-check-label" htmlFor="customCheck2">
										Remember me
									</label>
								</div>
							</div>

							<div className="mb-3 text-center">
								<button className="btn rounded-pill btn-primary" type="submit">
									Sign In
								</button>
							</div>
						</form>
					</Modal.Body>
				</Modal>
			</Card.Body>
		</Card>
	)
}

const ModalWithAlerts = () => {
	const { isOpen, className, toggleModal, openModalWithClass } = useModal()

	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Modal based Alerts</h4>
				<p className="text-muted mb-0">
					Show different contexual alert messages using modal component
				</p>
			</Card.Header>

			<Card.Body className="d-flex flex-wrap gap-2">
				<Button variant="success" onClick={() => openModalWithClass('success')}>
					Success Alert
				</Button>
				<Button variant="info" onClick={() => openModalWithClass('info')}>
					Info Alert
				</Button>
				<Button variant="warning" onClick={() => openModalWithClass('warning')}>
					Warning Alert
				</Button>
				<Button variant="danger" onClick={() => openModalWithClass('danger')}>
					Danger Alert
				</Button>
				<Button variant="pink" onClick={() => openModalWithClass('pink')}>
					Pink Alert
				</Button>
				<Button variant="purple" onClick={() => openModalWithClass('purple')}>
					Purple Alert
				</Button>
				<Modal className="fade" show={isOpen} onHide={toggleModal} size="sm">
					<div className={`modal-filled bg-${className}`}>
						<Modal.Body className="p-4">
							<div className="text-center">
								<i className="ri-check-line h1" />
								<h4 className="mt-2">Well Done!</h4>
								<p className="mt-3">
									Cras mattis consectetur purus sit amet fermentum. Cras justo
									odio, dapibus ac facilisis in, egestas eget quam.
								</p>
								<Button variant="light" className="my-2" onClick={toggleModal}>
									Continue
								</Button>
							</div>
						</Modal.Body>
					</div>
				</Modal>
			</Card.Body>
		</Card>
	)
}

const ModalPositions = () => {
	const { isOpen, className, toggleModal, openModalWithClass } = useModal()

	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Modal Position</h4>
				<p className="text-muted mb-0">
					Specify the position for the modal. You can display modal at top,
					bottom, center or right of page by specifying classes{' '}
					<code>modal-top</code>, <code>modal-bottom</code>,{' '}
					<code>modal-dialog-centered</code> and <code>modal-right</code>
					respectively.
				</p>
			</Card.Header>
			<Card.Body>
				<div className="d-flex flex-wrap gap-2">
					<Button
						variant="secondary"
						onClick={() => openModalWithClass('modal-top')}
					>
						Top Modal
					</Button>
					<Button
						variant="secondary"
						onClick={() => openModalWithClass('modal-bottom')}
					>
						Bottom Modal
					</Button>
					<Button
						variant="secondary"
						onClick={() => openModalWithClass('modal-dialog-centered')}
					>
						Center modal
					</Button>
					<Button
						variant="secondary"
						onClick={() => openModalWithClass('modal-right')}
					>
						Rightbar Modal
					</Button>
				</div>
				<Modal show={isOpen} onHide={toggleModal} dialogClassName={className}>
					<Modal.Header onHide={toggleModal} closeButton>
						<h4 className="modal-title">Modal Heading</h4>
					</Modal.Header>
					<Modal.Body>
						<h5>Text in a modal</h5>
						<p>
							Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
						</p>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="light" onClick={toggleModal}>
							Close
						</Button>
						<Button variant="primary" onClick={toggleModal}>
							Save changes
						</Button>
					</Modal.Footer>
				</Modal>
			</Card.Body>
		</Card>
	)
}

const ModalWithColoredHeader = () => {
	const { isOpen, className, toggleModal, openModalWithClass } = useModal()

	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Colored Header Modals</h4>
				<p className="text-muted mb-0">
					A rendered modal with header having contexual background color.
				</p>
			</Card.Header>
			<Card.Body>
				<Modal className="fade" show={isOpen} onHide={toggleModal}>
					<Modal.Header className={`modal-colored-header bg-${className}`}>
						<h4 className="modal-title" id="primary-header-modalLabel">
							Modal Heading
						</h4>
						<button
							type="button"
							className="btn-close btn-close-white"
							data-bs-dismiss="modal"
							aria-label="Close"
						></button>
					</Modal.Header>
					<Modal.Body>
						<h5 className="mt-0">{className} Background</h5>
						<p>
							Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
							dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta
							ac consectetur ac, vestibulum at eros.
						</p>
						<p>
							Praesent commodo cursus magna, vel scelerisque nisl consectetur
							et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor
							auctor.
						</p>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="light" onClick={toggleModal}>
							Close
						</Button>
						<Button variant={className}>Save changes</Button>
					</Modal.Footer>
				</Modal>
				<div className="d-flex flex-wrap gap-2">
					<Button
						variant="primary"
						onClick={() => openModalWithClass('primary')}
					>
						Primary Header
					</Button>
					<Button
						variant="success"
						onClick={() => openModalWithClass('success')}
					>
						Success Header
					</Button>
					<Button variant="info" onClick={() => openModalWithClass('info')}>
						Info Header
					</Button>
					<Button
						variant="warning"
						onClick={() => openModalWithClass('warning')}
					>
						Warning Header
					</Button>
					<Button variant="danger" onClick={() => openModalWithClass('danger')}>
						Danger Header
					</Button>
					<Button variant="pink" onClick={() => openModalWithClass('pink')}>
						Pink Header
					</Button>
					<Button variant="purple" onClick={() => openModalWithClass('purple')}>
						Purple Header
					</Button>
					<Button variant="dark" onClick={() => openModalWithClass('dark')}>
						Dark Header
					</Button>
				</div>
			</Card.Body>
		</Card>
	)
}

const ModalWithFilled = () => {
	const { isOpen, className, toggleModal, openModalWithClass } = useModal()

	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Filled Modals</h4>
				<p className="text-muted mb-0">
					A rendered modal with header, body and footer having contexual
					background color.
				</p>
			</Card.Header>
			<Card.Body>
				<Modal show={isOpen} onHide={toggleModal} className="fade">
					<div className={`modal-filled bg-${className}`}>
						<Modal.Header onHide={toggleModal} closeButton>
							<h4 className="modal-title">{className} Filled Modal</h4>
						</Modal.Header>
						<Modal.Body>
							<p>
								Cras mattis consectetur purus sit amet fermentum. Cras justo
								odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
								risus, porta ac consectetur ac, vestibulum at eros.
							</p>
							<p>
								Praesent commodo cursus magna, vel scelerisque nisl consectetur
								et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus
								dolor auctor.
							</p>
						</Modal.Body>
						<Modal.Footer>
							<Button variant="light" onClick={toggleModal}>
								Close
							</Button>
							<Button variant="outline-light" onClick={toggleModal}>
								Save changes
							</Button>
						</Modal.Footer>
					</div>
				</Modal>
				<div className="d-flex flex-wrap gap-2">
					<Button
						variant="primary"
						onClick={() => openModalWithClass('primary')}
					>
						Primary Filled
					</Button>
					<Button
						variant="success"
						onClick={() => openModalWithClass('success')}
					>
						Success Filled
					</Button>
					<Button variant="info" onClick={() => openModalWithClass('info')}>
						Info Filled
					</Button>
					<Button
						variant="warning"
						onClick={() => openModalWithClass('warning')}
					>
						Warning Filled
					</Button>
					<Button variant="danger" onClick={() => openModalWithClass('danger')}>
						Danger Filled
					</Button>
					<Button variant="pink" onClick={() => openModalWithClass('pink')}>
						Pink Header
					</Button>
					<Button variant="purple" onClick={() => openModalWithClass('purple')}>
						Purple Header
					</Button>
					<Button variant="dark" onClick={() => openModalWithClass('dark')}>
						Dark Filled
					</Button>
				</div>
			</Card.Body>
		</Card>
	)
}

const MultipleModal = () => {
	const [isOpen, toggleModal] = useToggle()
	const [isNextOpen, toggleNextModal] = useToggle()
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Multiple Modal</h4>
				<p className="text-muted mb-0">
					Display a series of modals one by one to guide your users on multiple
					aspects or take step wise input.
				</p>
			</Card.Header>
			<Card.Body>
				<Modal show={isOpen} onHide={toggleModal}>
					<Modal.Header closeButton>
						<h4 className="modal-title" id="multiple-oneModalLabel">
							Modal Heading
						</h4>
					</Modal.Header>
					<Modal.Body>
						<h5 className="mt-0">Text in a modal</h5>
						<p>
							Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
						</p>
					</Modal.Body>
					<Modal.Footer>
						<Button
							variant="primary"
							onClick={() => {
								toggleModal()
								toggleNextModal()
							}}
						>
							Next
						</Button>
					</Modal.Footer>
				</Modal>
				<Modal className="fade" show={isNextOpen} onHide={toggleNextModal}>
					<Modal.Header closeButton>
						<h4 className="modal-title" id="multiple-twoModalLabel">
							Modal Heading
						</h4>
					</Modal.Header>
					<Modal.Body>
						<h5 className="mt-0">Text in a modal</h5>
						<p>
							Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
						</p>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="primary" onClick={toggleNextModal}>
							Close
						</Button>
					</Modal.Footer>
				</Modal>
				<div className="d-flex flex-wrap gap-2">
					<Button variant="primary" onClick={toggleModal}>
						Multiple Modal
					</Button>
				</div>
			</Card.Body>
		</Card>
	)
}

const ToggleBetweenModals = () => {
	const [isOpen, toggleModal] = useToggle()
	const [isNextOpen, toggleNextModal] = useToggle()
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Toggle Between Modals</h4>
				<p className="text-muted mb-0">
					Toggle between multiple modals with some clever placement of the{' '}
					<code>data-bs-target</code> and <code>data-bs-toggle</code>{' '}
					attributes.
				</p>
			</Card.Header>
			<Card.Body>
				<Modal className="fade" show={isOpen} onHide={toggleModal} centered>
					<Modal.Header closeButton>
						<h5 className="modal-title">Modal 1</h5>
					</Modal.Header>
					<Modal.Body className="modal-body">
						Show a second modal and hide this one with the button below.
					</Modal.Body>
					<Modal.Footer>
						<Button
							variant="primary"
							onClick={() => {
								toggleModal()
								toggleNextModal()
							}}
						>
							Open second modal
						</Button>
					</Modal.Footer>
				</Modal>
				<Modal
					className="fade"
					show={isNextOpen}
					onHide={toggleNextModal}
					centered
				>
					<Modal.Header closeButton>
						<h5 className="modal-title">Modal 2</h5>
					</Modal.Header>
					<Modal.Body>
						Hide this modal and show the first with the button below.
					</Modal.Body>
					<Modal.Footer>
						<Button
							variant="primary"
							onClick={() => {
								toggleModal()
								toggleNextModal()
							}}
						>
							Back to first
						</Button>
					</Modal.Footer>
				</Modal>
				<Button variant="secondary" onClick={toggleModal}>
					Open first modal
				</Button>
			</Card.Body>
		</Card>
	)
}
const FullscreenModal = () => {
	const sizes: string[] = [
		'sm-down',
		'md-down',
		'lg-down',
		'xl-down',
		'xxl-down',
	]
	const [fullscreen, setFullscreen] = useState<undefined | string>(undefined)
	const [show, setShow] = useState(false)

	const handleShow = (breakpoint: string) => {
		setFullscreen(breakpoint)
		setShow(true)
	}

	return (
		<>
			<Card>
				<Card.Header>
					<h4 className="header-title">Fullscreen Modal</h4>
					<p className="text-muted mb-0">
						Another override is the option to pop up a modal that covers the
						user viewport, available via modifier classes that are placed on a{' '}
						<code>.modal-dialog</code>
					</p>
				</Card.Header>
				<Card.Body>
					<div className="d-flex flex-wrap gap-2">
						<Button
							type="button"
							variant="primary"
							onClick={() => setShow(true)}
						>
							Fullscreen Modal
						</Button>

						{(sizes || []).map((size, idx) => (
							<Button key={idx} onClick={() => handleShow(size)}>
								Full Screen
								{typeof size === 'string' && ` Below ${size.split('-')[0]}`}
							</Button>
						))}
					</div>

					<Modal
						show={show}
						fullscreen={fullscreen ?? true}
						onHide={() => setShow(false)}
					>
						<Modal.Header closeButton>
							<Modal.Title>Modal</Modal.Title>
						</Modal.Header>
						<Modal.Body>...</Modal.Body>
						<Modal.Footer>
							<Link
								to="#"
								className="btn btn-light waves-effect"
								onClick={() => setShow(false)}
							>
								Close
							</Link>
							<Button
								type="button"
								variant="primary"
								onClick={() => setShow(false)}
							>
								Save Changes
							</Button>
						</Modal.Footer>
					</Modal>
				</Card.Body>
			</Card>
		</>
	)
}
const StaticBackdropModal = () => {
	const [isOpen, toggleModal] = useToggle()
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Static Backdrop</h4>
				<p className="text-muted mb-0">
					When backdrop is set to static, the modal will not close when clicking
					outside it. Click the button below to try it.
				</p>
			</Card.Header>
			<Card.Body>
				<div className="d-flex flex-wrap gap-2">
					<Button variant="info" onClick={toggleModal}>
						Static Backdrop
					</Button>
				</div>
				<Modal
					className="fade"
					show={isOpen}
					onHide={toggleModal}
					backdrop="static"
					keyboard={false}
				>
					<Modal.Header closeButton>
						<Modal.Title as="h5">Modal title</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<p className="m-0">
							I will not close if you click outside me. Don't even try to press
							escape key.
						</p>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={toggleModal}>
							Close
						</Button>
						<Button variant="primary">Understood</Button>
					</Modal.Footer>
				</Modal>
			</Card.Body>
		</Card>
	)
}

const VaryingModalContent = () => {
	const [recipient, setReceipt] = useState<string>('')
	const { isOpen, toggleModal, className, openModalWithSize } = useModal()

	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Varying Modal Content</h4>
				<p className="text-muted mb-0">
					Have a bunch of buttons that all trigger the same modal with slightly
					different contents? Use
					<code>event.relatedTarget</code> and{' '}
					<Link
						to="https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes"
						target="_blank"
					>
						HTML <code>data-bs-*</code>
						attributes
					</Link>{' '}
					to vary the contents of the modal depending on which button was
					clicked.
				</p>
			</Card.Header>
			<Card.Body>
				<div className="hstack gap-2 flex-wrap">
					<Button
						type="button"
						variant="primary"
						onClick={() => {
							openModalWithSize('lg')
							setReceipt('@mdo')
						}}
					>
						Open modal for @mdo
					</Button>
					<Button
						type="button"
						variant="primary"
						onClick={() => {
							openModalWithSize('lg')
							setReceipt('@fat')
						}}
					>
						Open modal for @fat
					</Button>
					<Button
						type="button"
						variant="primary"
						onClick={() => {
							openModalWithSize('lg')
							setReceipt('@getbootstrap')
						}}
					>
						Open modal for @getbootstrap
					</Button>
				</div>

				<Modal
					className="fade"
					tabIndex={-1}
					show={isOpen}
					onHide={toggleModal}
					dialogClassName={className}
				>
					<Modal.Header onHide={toggleModal} closeButton>
						<Modal.Title as="h5">New message to {recipient}</Modal.Title>
					</Modal.Header>
					<div className="modal-body">
						<form>
							<div className="mb-3">
								<label htmlFor="recipient-name" className="col-form-label">
									Recipient:
								</label>
								<input
									type="text"
									className="form-control"
									id="recipient-name"
									placeholder={recipient}
								/>
							</div>
							<div className="mb-3">
								<label htmlFor="message-text" className="col-form-label">
									Message:
								</label>
								<textarea className="form-control" id="message-text"></textarea>
							</div>
						</form>
					</div>
					<Modal.Footer>
						<Button type="button" variant="secondary" onClick={toggleModal}>
							Close
						</Button>
						<Button type="button" variant="primary">
							Send message
						</Button>
					</Modal.Footer>
				</Modal>
			</Card.Body>
		</Card>
	)
}
const Modals = () => {
	return (
		<>
			<PageBreadcrumb title="Modals" subName="Base UI" />
			<Row>
				<Col xl={12}>
					<ModalSizes />
				</Col>
				<Col xl={12}>
					<ModalsWithPages />
				</Col>
			</Row>

			<Row>
				<Col xl={12}>
					<ModalWithAlerts />
				</Col>
				<Col xl={12}>
					<ModalPositions />
				</Col>
			</Row>

			<Row>
				<Col xl={12}>
					<ModalWithColoredHeader />
				</Col>
				<Col xl={12}>
					<ModalWithFilled />
				</Col>
			</Row>

			<Row>
				<Col xl={12}>
					<MultipleModal />
				</Col>
				<Col xl={12}>
					<ToggleBetweenModals />
				</Col>
			</Row>

			<Row>
				<Col xl={12}>
					<FullscreenModal />
				</Col>
				<Col xl={12}>
					<StaticBackdropModal />
				</Col>
			</Row>

			<Row>
				<Col xl={12}>
					<VaryingModalContent />
				</Col>
			</Row>
		</>
	)
}

export default Modals
