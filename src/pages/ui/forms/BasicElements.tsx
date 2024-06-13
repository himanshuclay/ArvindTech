import {
	Button,
	Card,
	Col,
	Dropdown,
	DropdownButton,
	FloatingLabel,
	Form,
	InputGroup,
	Row,
} from 'react-bootstrap'
import { useForm } from 'react-hook-form'

// component
import { FormInput, PageBreadcrumb } from '@/components'

// constants
import { colorVariants } from '@/constants/colorVariants'

const BasicInputElements = () => {
	/*
	 * form methods
	 */
	const methods = useForm({
		defaultValues: {
			password: 'password',
			statictext: 'email@example.com',
			color: '#727cf5',
		},
	})
	const {
		handleSubmit,
		register,
		control,
		formState: { errors },
	} = methods
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Input Types</h4>
				<p className="text-muted mb-0">
					Most common form control, text-based input fields. Includes support
					for all HTML5 types: <code>text</code>, <code>password</code>,{' '}
					<code>datetime</code>, <code>datetime-local</code>, <code>date</code>,{' '}
					<code>month</code>, <code>time</code>, <code>week</code>,{' '}
					<code>number</code>, <code>email</code>, <code>url</code>,{' '}
					<code>search</code>, <code>tel</code>, and <code>color</code>.
				</p>
			</Card.Header>
			<Card.Body>
				<Row>
					<Col lg={6}>
						<form onSubmit={handleSubmit(() => {})}>
							<FormInput
								label="Text"
								type="text"
								name="text"
								containerClass="mb-3"
								register={register}
								key="text"
								errors={errors}
								control={control}
							/>
							<FormInput
								label="Email"
								type="email"
								name="email"
								placeholder="Email"
								containerClass="mb-3"
								register={register}
								key="email"
								errors={errors}
								control={control}
							/>

							<FormInput
								label="Password"
								type="password"
								name="password"
								containerClass="mb-3"
								register={register}
								key="password"
								errors={errors}
								control={control}
								defaultValue="password"
							/>

							<FormInput
								label="Show/Hide Password"
								type="password"
								name="password2"
								placeholder="Enter Your Password"
								containerClass="mb-3"
								register={register}
								key="password2"
								errors={errors}
								control={control}
							/>

							<FormInput
								label="Placeholder"
								type="text"
								name="placeholder"
								placeholder="placeholder"
								containerClass="mb-3"
								register={register}
								key="placeholder"
								errors={errors}
								control={control}
							/>

							<FormInput
								label="Text area"
								type="textarea"
								name="textarea"
								rows={5}
								containerClass="mb-3"
								register={register}
								key="textarea"
								errors={errors}
								control={control}
							/>

							<FormInput
								label="Read only"
								type="text"
								name="text1"
								id="text1"
								placeholder="Readonly value"
								readOnly
								containerClass="mb-3"
								register={register}
								key="text1"
								errors={errors}
								control={control}
							/>

							<FormInput
								label="Disabled"
								type="text"
								name="text2"
								id="text2"
								placeholder="Disabled value"
								disabled
								containerClass="mb-3"
								register={register}
								key="text2"
								errors={errors}
								control={control}
							/>

							<FormInput
								label="Static control"
								type="text"
								name="statictext"
								placeholder="Disabled"
								readOnly
								containerClass="mb-3"
								register={register}
								key="statictext"
								errors={errors}
								control={control}
							/>
							<Form.Group>
								<Form.Label htmlFor="text3" className="form-label">
									Helping text
								</Form.Label>
								<Form.Control
									type="text"
									name="text"
									id="text3"
									placeholder="Helping text"
								/>
								<Form.Text>
									A block of help text that breaks onto a new line and may
									extend beyond one line.
								</Form.Text>
							</Form.Group>
						</form>
					</Col>

					<Col lg={6}>
						<form onSubmit={handleSubmit(() => {})}>
							<FormInput
								name="select"
								label="Input Select"
								type="select"
								containerClass="mb-3"
								className="form-select"
								register={register}
								key="select"
								errors={errors}
								control={control}
							>
								<option defaultValue="selected">1</option>
								<option>2</option>
								<option>3</option>
								<option>4</option>
								<option>5</option>
							</FormInput>

							<FormInput
								name="selectMulti"
								label="Multiple Select"
								type="select"
								multiple
								containerClass="mb-3"
								className="form-select"
								register={register}
								key="selectMulti"
								errors={errors}
								control={control}
							>
								<option defaultValue="selected">1</option>
								<option>2</option>
								<option>3</option>
								<option>4</option>
								<option>5</option>
							</FormInput>

							<FormInput
								label="Default file input"
								type="file"
								name="file"
								containerClass="mb-3"
								register={register}
								key="file"
								errors={errors}
								control={control}
							/>
							<FormInput
								label="Date"
								type="date"
								name="date"
								containerClass="mb-3"
								register={register}
								key="date"
								errors={errors}
								control={control}
							/>

							<FormInput
								label="Month"
								type="month"
								name="month"
								containerClass="mb-3"
								register={register}
								key="month"
								errors={errors}
								control={control}
							/>

							<FormInput
								label="Time"
								type="time"
								name="time"
								containerClass="mb-3"
								register={register}
								key="time"
								errors={errors}
								control={control}
							/>

							<FormInput
								label="Week"
								type="week"
								name="week"
								containerClass="mb-3"
								register={register}
								key="week"
								errors={errors}
								control={control}
							/>

							<FormInput
								label="Number"
								type="number"
								name="number"
								placeholder="Number placeholder"
								containerClass="mb-3"
								register={register}
								key="number"
								errors={errors}
								control={control}
							/>

							<FormInput
								label="Color"
								type="color"
								name="color"
								className="w-100"
								placeholder="Color placeholder"
								containerClass="mb-3"
								register={register}
								key="color"
								errors={errors}
								control={control}
							/>

							<Form.Group className="mb-0">
								<Form.Label htmlFor="exampleRange" className="form-label">
									Range
								</Form.Label>
								<Form.Range />
							</Form.Group>
						</form>
					</Col>
				</Row>
			</Card.Body>
		</Card>
	)
}

const FloatingLabels = () => {
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Floating labels</h4>
				<p className="text-muted mb-0">
					Wrap a pair of <code>&lt;input class="form-control"&gt;</code> and{' '}
					<code>&lt;label&gt;</code> elements in <code>.form-floating</code> to
					enable floating labels with Bootstrap&apos;s textual form fields. A{' '}
					<code>placeholder</code> is required on each{' '}
					<code>&lt;input&gt;</code> as our method of CSS-only floating labels
					uses the <code>:placeholder-shown</code> pseudo-element. Also note
					that the <code>&lt;input&gt;</code> must come first so we can utilize
					a sibling selector (e.g., <code>~</code>).
				</p>
			</Card.Header>
			<Card.Body>
				<Row>
					<Col lg={6}>
						<h5 className="mb-3">Example</h5>
						<FloatingLabel
							controlId="floatingInput"
							label="Email address"
							className="mb-3"
						>
							<Form.Control type="email" placeholder="name@example.com" />
						</FloatingLabel>
						<FloatingLabel
							controlId="floatingPassword"
							label="Password"
							className="mb-3"
						>
							<Form.Control type="password" placeholder="Password" />
						</FloatingLabel>
						<h5 className="mb-3">Textareas</h5>
						<FloatingLabel controlId="floatingTextarea2" label="Comments">
							<Form.Control
								as="textarea"
								placeholder="Leave a comment here"
								style={{ height: '100px' }}
							/>
						</FloatingLabel>
					</Col>

					<Col lg={6}>
						<h5 className="mb-3">Selects</h5>
						<FloatingLabel
							controlId="floatingSelect"
							label="Works with selects"
							className="mb-3"
						>
							<Form.Select aria-label="Floating label select example">
								<option defaultValue="selected">Open this select menu</option>
								<option defaultValue="1">One</option>
								<option defaultValue="2">Two</option>
								<option defaultValue="3">Three</option>
							</Form.Select>
						</FloatingLabel>

						<h5 className="mb-3 mt-4">Layout</h5>
						<div className="row g-2">
							<Col md>
								<FloatingLabel
									controlId="floatingInputGrid"
									label="Email address"
								>
									<Form.Control
										type="email"
										placeholder="name@example.com"
										defaultValue="name@example.com"
									/>
								</FloatingLabel>
							</Col>
							<Col md>
								<FloatingLabel
									controlId="floatingSelectGrid"
									label="Works with selects"
								>
									<Form.Select aria-label="Floating label select example">
										<option defaultValue="selected">
											Open this select menu
										</option>
										<option defaultValue="1">One</option>
										<option defaultValue="2">Two</option>
										<option defaultValue="3">Three</option>
									</Form.Select>
								</FloatingLabel>
							</Col>
						</div>
					</Col>
				</Row>
			</Card.Body>
		</Card>
	)
}

const SelectInput = () => {
	return (
		<>
			<h4 className="header-title">Select</h4>
			<p className="text-muted fs-14">
				<code>&lt;select&gt;</code> menus need only a custom class,{' '}
				<code>.form-select</code> to trigger the custom styles.
			</p>
			<Form.Select className="mb-3">
				<option defaultValue="selected">Open this select menu</option>
				<option defaultValue="1">One</option>
				<option defaultValue="2">Two</option>
				<option defaultValue="3">Three</option>
			</Form.Select>
			<Form.Select size="lg" className="mb-3">
				<option defaultValue="selected">Open this select menu</option>
				<option defaultValue="1">One</option>
				<option defaultValue="2">Two</option>
				<option defaultValue="3">Three</option>
			</Form.Select>
			<Form.Select size="sm" className="mb-3">
				<option defaultValue="selected">Open this select menu</option>
				<option defaultValue="1">One</option>
				<option defaultValue="2">Two</option>
				<option defaultValue="3">Three</option>
			</Form.Select>
			<div className="input-group mb-3">
				<label className="input-group-text" htmlFor="inputGroupSelect01">
					Options
				</label>
				<Form.Select>
					<option defaultValue="selected">Choose...</option>
					<option defaultValue="1">One</option>
					<option defaultValue="2">Two</option>
					<option defaultValue="3">Three</option>
				</Form.Select>
			</div>
			<div className="input-group">
				<Form.Select
					id="inputGroupSelect04"
					aria-label="Example select with button addon"
				>
					<option defaultValue="selected">Choose...</option>
					<option defaultValue="1">One</option>
					<option defaultValue="2">Two</option>
					<option defaultValue="3">Three</option>
				</Form.Select>
				<Button className="btn-outline-secondary" type="button">
					Button
				</Button>
			</div>
		</>
	)
}

const Switches = () => {
	return (
		<>
			<h4 className="header-title mt-5 mt-lg-0">Switches</h4>
			<p className="text-muted fs-14">
				A switch has the markup of a custom checkbox but uses the{' '}
				<code>.form-switch</code> class to render a toggle switch. Switches also
				support the <code>disabled</code> attribute.
			</p>
			<Form>
				<Form.Check
					type="switch"
					id="custom-switch"
					label="Toggle this switch element"
				></Form.Check>
				<Form.Check
					disabled
					type="switch"
					label="Disabled switch element"
					id="disabled-custom-switch"
					className="mt-1"
				/>
			</Form>
		</>
	)
}

const Checkboxes = () => {
	return (
		<>
			<Card>
				<Card.Header>
					<h4 className="header-title mt-5 mt-lg-0">Checkboxes </h4>
					<p className="text-muted mb-0">
						Each checkbox and radio <code>&lt;input&gt;</code> and{' '}
						<code>&lt;label&gt;</code> pairing is wrapped in a{' '}
						<code>&lt;div&gt;</code> to create our custom control. Structurally,
						this is the same approach as our default <code>.form-check</code>.
					</p>
				</Card.Header>
				<Card.Body>
					<h6 className="fs-15">Checkboxes</h6>
					<div className="mt-3">
						<Form.Check id="customCheck1" label="Check this custom checkbox" />
						<Form.Check id="customCheck2" label="Check this custom checkbox" />
					</div>
					<h6 className="fs-15 mt-3">Inline</h6>
					<div className="mt-2">
						<Form.Check
							className="form-check-inline"
							id="customCheck3"
							label="Check this custom checkbox"
						/>
						<Form.Check
							className="form-check-inline"
							id="customCheck4"
							label="Check this custom checkbox"
						/>
					</div>

					<h6 className="fs-15 mt-3">Disabled</h6>

					<div className="mt-2">
						<Form.Check
							defaultChecked
							disabled
							className="form-check-inline"
							id="customCheck5"
							label="Check this custom checkbox"
						/>
						<Form.Check
							disabled
							className="form-check-inline"
							id="customCheck6"
							label="Check this custom checkbox"
						/>
					</div>

					<h6 className="fs-15 mt-3">Colors</h6>
					{(colorVariants || []).map((item, idx) => {
						return (
							<Form.Check
								key={idx}
								label={`${
									item.charAt(0).toUpperCase() + item.slice(1)
								} Checkbox`}
								type="checkbox"
								id={`basic-checkbox-${idx}`}
								className={`mb-2 form-checkbox-${item}`}
								aria-label="option 1"
								defaultChecked
							/>
						)
					})}
				</Card.Body>
			</Card>
		</>
	)
}
const Radios = () => {
	return (
		<>
			<Card>
				<Card.Header>
					<h4 className="header-title mt-5 mt-lg-0">Radios</h4>
					<p className="text-muted mb-0">
						Each checkbox and radio <code>&lt;input&gt;</code> and{' '}
						<code>&lt;label&gt;</code> pairing is wrapped in a{' '}
						<code>&lt;div&gt;</code> to create our custom control. Structurally,
						this is the same approach as our default <code>.form-check</code>.
					</p>
				</Card.Header>
				<Card.Body>
					<h6 className="fs-15 mt-3">Radios</h6>
					<div className="mt-3">
						<Form.Check
							type="radio"
							id="customRadio1"
							name="customradio1"
							label="Toggle this custom radio"
						/>
						<Form.Check
							type="radio"
							id="customRadio2"
							name="customradio1"
							label="Or toggle this other custom radio"
						/>
					</div>

					<h6 className="fs-15 mt-3">Inline</h6>

					<div className="mt-2">
						<Form.Check
							inline
							type="radio"
							id="customRadio3"
							name="customradio2"
							label="Toggle this custom radio"
						/>
						<Form.Check
							inline
							type="radio"
							id="customRadio4"
							name="customradio2"
							label="Or toggle this other custom radio"
						/>
					</div>

					<h6 className="fs-15 mt-3">Disabled</h6>

					<div className="mt-2">
						<Form.Check
							inline
							type="radio"
							id="customRadio5"
							name="customradio3"
							label="Toggle this custom radio"
							disabled
						/>
						<Form.Check
							inline
							defaultChecked
							type="radio"
							id="customRadio6"
							name="customradio3"
							label="Or toggle this other custom radio"
							disabled
						/>
					</div>

					<h6 className="fs-15 mt-3">Colors</h6>
					{(colorVariants || []).map((item, idx) => {
						return (
							<Form.Check
								key={idx}
								label={`${item.charAt(0).toUpperCase() + item.slice(1)} Radio`}
								type="radio"
								id={`basic-radio-${idx}`}
								className={`mb-2 form-radio-${item}`}
								aria-label="option 1"
								defaultChecked
							/>
						)
					})}
				</Card.Body>
			</Card>
		</>
	)
}
const InputSizes = () => {
	return (
		<>
			<Card>
				<Card.Header>
					<h4 className="header-title">Input Sizes</h4>
					<p className="text-muted mb-0">
						Set heights using classes like <code>.input-lg</code>, and set
						widths using grid column classes like <code>.col-lg-*</code>.
					</p>
				</Card.Header>
				<Card.Body>
					<Form>
						<Form.Group className="mb-3">
							<Form.Label htmlFor="small">Small</Form.Label>
							<Form.Control
								type="text"
								name="small"
								id="small1"
								placeholder=".input-sm"
								size="sm"
							/>
						</Form.Group>

						<Form.Group className="mb-3">
							<Form.Label htmlFor="small">Normal</Form.Label>
							<Form.Control
								type="text"
								name="Normal"
								id="Normal"
								placeholder="Normal"
							/>
						</Form.Group>

						<Form.Group className="mb-3">
							<Form.Label htmlFor="small">Large</Form.Label>
							<Form.Control
								type="text"
								name="Large"
								id="Large"
								placeholder=".input-lg"
								size="lg"
							/>
						</Form.Group>

						<div className="mb-2">
							<label htmlFor="example-gridsize" className="form-label">
								Grid Sizes
							</label>
							<Row>
								<Col sm={4}>
									<Form.Control
										type="text"
										name="text"
										id="Large1"
										placeholder=".col-sm-4"
									/>
								</Col>
							</Row>
						</div>
					</Form>
				</Card.Body>
			</Card>
		</>
	)
}

const InputGroups = () => {
	return (
		<>
			<Card>
				<Card.Header>
					<h4 className="header-title">Input Group</h4>
					<p className="text-muted mb-0">
						Easily extend form controls by adding text, buttons, or button
						groups on either side of textual inputs, custom selects, and custom
						file inputs
					</p>
				</Card.Header>
				<Card.Body>
					<Form>
						<div className="mb-3">
							<Form.Label className="form-label">Static</Form.Label>
							<div className="input-group flex-nowrap">
								<span className="input-group-text" id="basic-addon1">
									@
								</span>
								<Form.Control
									type="text"
									name="username"
									id="small"
									placeholder="Username"
								/>
							</div>
						</div>

						<Form.Group className="mb-3">
							<Form.Label htmlFor="Dropdown">Dropdowns</Form.Label>
							<InputGroup className="mb-3">
								<DropdownButton
									variant="primary"
									title="Dropdown"
									id="input-group-dropdown-1"
								>
									<Dropdown.Item href="#">Action</Dropdown.Item>
									<Dropdown.Item href="#">Another action</Dropdown.Item>
									<Dropdown.Item href="#">Something else here</Dropdown.Item>
									<Dropdown.Divider />
									<Dropdown.Item href="#">Separated link</Dropdown.Item>
								</DropdownButton>
								<Form.Control aria-label="Text input with dropdown button" />
							</InputGroup>
						</Form.Group>

						<Form.Group>
							<Form.Label htmlFor="Button">Buttons</Form.Label>
							<InputGroup className="mb-3">
								<Form.Control
									placeholder="Recipient's username"
									aria-label="Recipient's username"
									aria-describedby="basic-addon2"
								/>
								<Button variant="dark" id="button-addon2">
									Button
								</Button>
							</InputGroup>
						</Form.Group>
						<Row className="g-2">
							<Col sm={6}>
								<Form.Group>
									<Form.Label htmlFor="file">File input</Form.Label>
									<Form.Control type="file" />
								</Form.Group>
							</Col>
							<Col sm={6}>
								<Form.Group>
									<Form.Label htmlFor="formFileMultiple01">
										Multiple files input
									</Form.Label>
									<Form.Control type="file" multiple />
								</Form.Group>
							</Col>
						</Row>
					</Form>
				</Card.Body>
			</Card>
		</>
	)
}

const DefaultForm = () => {
	return (
		<>
			<Card>
				<Card.Header>
					<h4 className="header-title">Basic Example</h4>
					<p className="text-muted mb-0">
						Here&apos;s a quick example to demonstrate Bootstrap&apos;s form
						styles. Keep reading for documentation on required classes, form
						layout, and more.
					</p>
				</Card.Header>
				<Card.Body>
					<Form>
						<Form.Group className="mb-3">
							<Form.Label htmlFor="exampleEmail2">Email address</Form.Label>
							<Form.Control
								type="email"
								name="email"
								id="exampleEmail2"
								placeholder="Enter email"
							/>
							<Form.Text>
								We'll never share your email with anyone else.
							</Form.Text>
						</Form.Group>

						<Form.Group className="mb-3">
							<Form.Label htmlFor="examplePassword2">Password</Form.Label>
							<Form.Control
								type="password"
								name="password"
								id="examplePassword2"
								placeholder="Password"
							/>
						</Form.Group>

						<Form.Group className="mb-3">
							<Form.Check
								type="checkbox"
								id="formGridCheckbox"
								label="Check me out !"
							/>
						</Form.Group>

						<Button variant="primary" type="submit">
							Submit
						</Button>
					</Form>
				</Card.Body>
			</Card>
		</>
	)
}

const HorizontalForm = () => {
	return (
		<>
			<Card>
				<Card.Header>
					<h4 className="header-title">Horizontal form</h4>
					<p className="text-muted mb-0">
						Create horizontal forms with the grid by adding the{' '}
						<code>.row</code> class to form groups and using the{' '}
						<code>.col-*-*</code> classes to specify the width of your labels
						and controls. Be sure to add <code>.col-form-label</code> to your{' '}
						<code>&lt;label&gt;</code>s as well so they&apos;re vertically
						centered with their associated form controls.
					</p>
				</Card.Header>
				<Card.Body>
					<Form>
						<Form.Group as={Row} className="mb-3">
							<Form.Label htmlFor="exampleEmail3" column sm={3}>
								Email
							</Form.Label>
							<Col sm={9}>
								<Form.Control
									type="email"
									name="email"
									id="exampleEmail3"
									placeholder="Email"
								/>
							</Col>
						</Form.Group>

						<Form.Group as={Row} className="mb-3">
							<Form.Label htmlFor="examplePassword3" column sm={3}>
								Password
							</Form.Label>
							<Col sm={9}>
								<Form.Control
									type="password"
									name="password"
									id="examplePassword3"
									placeholder="Password"
								/>
							</Col>
						</Form.Group>

						<Form.Group as={Row} className="mb-3">
							<Form.Label htmlFor="examplePassword4" column sm={3}>
								Re-Password
							</Form.Label>
							<Col sm={9}>
								<Form.Control
									type="password"
									name="password"
									id="examplePassword4"
									placeholder="Retype Password"
								/>
							</Col>
						</Form.Group>

						<Form.Group
							as={Row}
							className="mb-3"
							controlId="formHorizontalCheck"
						>
							<Col sm={{ span: 9, offset: 3 }}>
								<Form.Check label="Check me out !" id="checkmeout" />
							</Col>
						</Form.Group>

						<Form.Group
							as={Row}
							className="mb-0"
							controlId="formHorizontalCheck"
						>
							<Col sm={{ span: 9, offset: 3 }}>
								<Button variant="info" type="submit">
									Sign in
								</Button>
							</Col>
						</Form.Group>
					</Form>
				</Card.Body>
			</Card>
		</>
	)
}

const InlineForm = () => {
	return (
		<>
			<Card>
				<Card.Header>
					<h4 className="header-title">Inline Form</h4>
					<p className="text-muted mb-0">
						Use the <code>.row-cols-lg-auto</code>, <code>.g-3</code> &{' '}
						<code>.align-items-center</code> class to display a series of
						labels, form controls, and buttons on a single horizontal row. Form
						controls within inline forms vary slightly from their default
						states. Controls only appear inline in viewports that are at least
						576px wide to account for narrow viewports on mobile devices.
					</p>
				</Card.Header>
				<Card.Body>
					<Form className="row row-cols-lg-auto g-3 align-items-center">
						<Col>
							<Form.Group className="mb-2 me-sm-2 mb-sm-0">
								<Form.Control
									readOnly
									type="email"
									name="email"
									id="exampleEmail4"
									bsPrefix="form-control-plaintext"
									placeholder="email@example.com"
								/>
							</Form.Group>
						</Col>

						<Col>
							<Form.Group className="mb-2 me-sm-2 mb-sm-0">
								<Form.Control
									type="password"
									name="password"
									id="examplePassword5"
									placeholder="Password"
								/>
							</Form.Group>
						</Col>

						<Col>
							<Button color="primary" type="submit">
								Confirm identity
							</Button>
						</Col>
					</Form>

					<h6 className="fs-13 mt-3">Auto-sizing</h6>
					<Form>
						<Row className="align-items-center">
							<Col xs="auto">
								<Form.Label htmlFor="inlineFormInput" visuallyHidden>
									Name
								</Form.Label>
								<Form.Control
									className="mb-2"
									id="inlineFormInput"
									placeholder="Jane Doe"
								/>
							</Col>
							<Col xs="auto">
								<Form.Label htmlFor="inlineFormInputGroup" visuallyHidden>
									Username
								</Form.Label>
								<InputGroup className="mb-2">
									<InputGroup.Text>@</InputGroup.Text>
									<Form.Control
										id="inlineFormInputGroup"
										placeholder="Username"
									/>
								</InputGroup>
							</Col>
							<Col xs="auto">
								<Form.Check
									type="checkbox"
									id="autoSizingCheck"
									className="mb-2"
									label="Remember me"
								/>
							</Col>
							<Col xs="auto">
								<Button type="submit" className="mb-2">
									Submit
								</Button>
							</Col>
						</Row>
					</Form>
				</Card.Body>
			</Card>
		</>
	)
}

const HorizontalFormLabelSizing = () => {
	return (
		<>
			<Card>
				<Card.Header>
					<h4 className="header-title">Horizontal form label sizing</h4>
					<p className="text-muted mb-0">
						Be sure to use <code>.col-form-label-sm</code> or{' '}
						<code>.col-form-label-lg</code> to your <code>&lt;label&gt;</code>s
						or <code>&lt;legend&gt;</code>s to correctly follow the size of{' '}
						<code>.form-control-lg</code> and <code>.form-control-sm</code>.
					</p>
				</Card.Header>
				<Card.Body>
					<Form>
						<Row className="mb-2">
							<label
								htmlFor="colFormLabelSm"
								className="col-sm-2 col-form-label col-form-label-sm"
							>
								Email
							</label>
							<Col sm={10}>
								<Form.Control
									type="email"
									id="colFormLabelSm"
									placeholder="col-form-label-sm"
									size="sm"
								/>
							</Col>
						</Row>
						<div className="mb-2 row">
							<label htmlFor="colFormLabel" className="col-sm-2 col-form-label">
								Email
							</label>
							<Col sm={10}>
								<Form.Control
									type="email"
									id="colFormLabel"
									placeholder="col-form-label"
								/>
							</Col>
						</div>
						<Row>
							<label
								htmlFor="colFormLabelLg"
								className="col-sm-2 col-form-label col-form-label-lg"
							>
								Email
							</label>
							<Col sm={10}>
								<Form.Control
									type="email"
									id="colFormLabellg"
									placeholder="col-form-label-lg"
									size="lg"
								/>
							</Col>
						</Row>
					</Form>
				</Card.Body>
			</Card>
		</>
	)
}
const FormRow = () => {
	return (
		<>
			<Card>
				<Card.Header>
					<h4 className="header-title">Form Row</h4>
					<p className="text-muted mb-0">
						By adding <code>.row</code> & <code>.g-2</code>, you can have
						control over the gutter width in as well the inline as block
						direction.
					</p>
				</Card.Header>
				<Card.Body>
					<Form>
						<Row className="g-2">
							<Form.Group
								as={Col}
								md={6}
								className="mb-3"
								controlId="formGridEmail"
							>
								<Form.Label>Email</Form.Label>
								<Form.Control type="email" placeholder="Email" />
							</Form.Group>
							<Form.Group
								as={Col}
								md={6}
								className="mb-3"
								controlId="formGridPassword"
							>
								<Form.Label>Password</Form.Label>
								<Form.Control type="password" placeholder="Password" />
							</Form.Group>
						</Row>
						<Form.Group className="mb-3" controlId="formGridAddress1">
							<Form.Label>Address</Form.Label>
							<Form.Control placeholder="1234 Main St" />
						</Form.Group>

						<Form.Group className="mb-3" controlId="formGridAddress2">
							<Form.Label>Address 2</Form.Label>
							<Form.Control placeholder="Apartment, studio, or floor" />
						</Form.Group>

						<Row className="g-2">
							<Form.Group
								as={Col}
								md={6}
								className="mb-3"
								controlId="formGridCity"
							>
								<Form.Label>City</Form.Label>
								<Form.Control />
							</Form.Group>
							<Form.Group
								as={Col}
								md={4}
								className="mb-3"
								controlId="formGridState"
							>
								<Form.Label>State</Form.Label>
								<Form.Select defaultValue="Choose...">
									<option defaultValue="selected">Choose...</option>
									<option>...</option>
								</Form.Select>
							</Form.Group>
							<Form.Group
								as={Col}
								md={2}
								className="mb-3"
								controlId="formGridZip"
							>
								<Form.Label>Zip</Form.Label>
								<Form.Control />
							</Form.Group>
						</Row>
						<Form.Group className="mb-2" id="formGridCheckbox">
							<Form.Check
								type="checkbox"
								label="Check this custom checkbox"
								id="customcheckbox-1"
							/>
						</Form.Group>
						<Button
							variant="primary"
							type="submit"
							className="waves-effect waves-light"
						>
							Sign in
						</Button>
					</Form>
				</Card.Body>
			</Card>
		</>
	)
}
const BasicElements = () => {
	return (
		<>
			<PageBreadcrumb title="Form Elements" subName="Forms" />
			<Row>
				<Col>
					<BasicInputElements />
				</Col>
			</Row>

			<Row>
				<Col>
					<FloatingLabels />
				</Col>
			</Row>

			<Row>
				<Col>
					<Card>
						<Card.Header>
							<h4 className="header-title mb-0">Select &amp; Switches</h4>
						</Card.Header>
						<Card.Body>
							<Row>
								<Col lg={6}>
									<SelectInput />
								</Col>
								<Col lg={6}>
									<Switches />
								</Col>
							</Row>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col lg={6}>
					<Checkboxes />
				</Col>
				<Col lg={6}>
					<Radios />
				</Col>
			</Row>

			<Row>
				<Col lg={6}>
					<InputSizes />
				</Col>
				<Col lg={6}>
					<InputGroups />
				</Col>
			</Row>

			<Row>
				<Col lg={6}>
					<DefaultForm />
				</Col>

				<Col lg={6}>
					<HorizontalForm />
				</Col>
			</Row>

			<Row>
				<Col md={12}>
					<InlineForm />
				</Col>
			</Row>

			<Row>
				<Col>
					<HorizontalFormLabelSizing />
				</Col>
			</Row>

			<Row>
				<Col>
					<FormRow />
				</Col>
			</Row>
		</>
	)
}

export default BasicElements
