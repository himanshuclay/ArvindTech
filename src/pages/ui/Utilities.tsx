import React from 'react'
import { Link } from 'react-router-dom'
import { Card, Col, Row } from 'react-bootstrap'

// image
import Img1 from '@/assets/images/small/small-1.jpg'
import Img2 from '@/assets/images/small/small-2.jpg'
import avatar2 from '@/assets/images/users/avatar-2.jpg'
import avatar4 from '@/assets/images/users/avatar-4.jpg'

// component
import { PageBreadcrumb } from '@/components'

interface DefaultVariant {
	variant: string
	color?: boolean
	isBG?: boolean
	noBG?: boolean
}

interface border {
	align: string
	size: number
}

const colors: DefaultVariant[] = [
	{
		variant: 'primary',
		color: false,
		isBG: false,
	},
	{
		variant: 'secondary',
		color: false,
		isBG: false,
	},
	{
		variant: 'success',
		color: false,
		isBG: false,
	},
	{
		variant: 'danger',
		color: false,
		isBG: false,
	},
	{
		variant: 'warning',
		color: true,
		isBG: true,
	},
	{
		variant: 'info',
		color: true,
		isBG: true,
	},
	{
		variant: 'pink',
		color: true,
		isBG: true,
	},
	{
		variant: 'purple',
		color: true,
		isBG: true,
	},
	{
		variant: 'light',
		color: true,
		isBG: true,
		noBG: true,
	},
	{
		variant: 'dark',
		color: false,
	},
	{
		variant: 'body',
		color: true,
	},
	{
		variant: 'body-secondary',
		color: true,
	},
	{
		variant: 'body-tertiary',
		color: true,
	},
	{
		variant: 'white',
		color: true,
	},
	{
		variant: 'black',
		color: false,
	},
	{
		variant: 'trasparent',
		color: true,
	},
]
const opacities: number[] = [100, 75, 50, 25]

const borders: border[] = [
	{
		align: 'top',
		size: 2,
	},
	{
		align: 'end',
		size: 3,
	},
	{
		align: 'bottom',
		size: 4,
	},
	{
		align: 'start',
		size: 5,
	},
]

const data: string[] = ['25', '50', '75', '100', 'auto']
const objectTypes: string[] = ['contain', 'cover', 'fill', 'scale', 'none']

const Utilities = () => {
	return (
		<>
			<PageBreadcrumb title="Utilities" subName="Base UI" />
			<Row>
				<Col xl={12}>
					<Card>
						<Card.Header>
							<h4 className="header-title">Background Color</h4>
							<p className="text-muted mb-0">
								Similar to the contextual text color classes, set the background
								of an element to any contextual class. Background utilities{' '}
								<strong>
									do not set <code>color</code>
								</strong>
								, so in some cases you’ll want to use <code>.text-*</code>color
								utilities.
							</p>
						</Card.Header>
						<Card.Body>
							{(colors || []).map((color, idx) => {
								return (
									<div
										key={idx}
										className={`bg-${color.variant} ${
											colors[idx].color ? 'text-black' : 'text-white'
										}  p-2 mb-2`}
									>
										.bg-{color.variant}
									</div>
								)
							})}
						</Card.Body>
					</Card>
				</Col>

				<Col xl={12}>
					<Card>
						<Card.Header>
							<h4 className="header-title">Background Gradient Color</h4>
							<p className="text-muted mb-0">
								By adding a <code>.bg-gradient</code> class, a linear gradient
								is added as background image to the backgrounds. This gradient
								starts with a semi-transparent white which fades out to the
								bottom.
							</p>
						</Card.Header>
						<Card.Body>
							{(colors || []).slice(0, 8).map((color, idx) => {
								return (
									<div
										key={idx}
										className={`bg-gradient bg-${color.variant} ${
											colors[idx].color ? 'text-black' : 'text-white'
										}  p-2 mb-2`}
									>
										.bg-{color.variant}.bg-gradient
									</div>
								)
							})}
							<div className="p-2 mb-2 bg-black bg-gradient text-white">
								.bg-black.bg-gradient
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xl={12}>
					<Card>
						<Card.Header>
							<h4 className="header-title">Soft background</h4>
							<p className="text-muted mb-0">
								Similar to the contextual text color classes, set the background
								of an element to any contextual class. Background utilities do
								not set <code>color</code>, so in some cases you’ll want to use{' '}
								<code>.text-*</code>{' '}
								<a
									href="https://getbootstrap.com/docs/5.3/utilities/colors/"
									target="_blank"
									rel="noreferrer"
								>
									color utilities
								</a>
								.
							</p>
						</Card.Header>
						<Card.Body>
							<Row>
								<Col xs={12}>
									<div className="d-flex flex-column gap-2">
										{(colors || []).slice(0, 8).map((color, idx) => {
											return (
												<div
													key={idx}
													className={`bg-${color.variant}-subtle p-2`}
												>
													<code className={`text-${color.variant}-emphasis`}>
														.bg-{color.variant}-subtle
													</code>
												</div>
											)
										})}
									</div>
								</Col>
							</Row>
						</Card.Body>
					</Card>
				</Col>

				<Col xl={12}>
					<Card>
						<Card.Header>
							<h4 className="header-title">Color & background</h4>
							<p className="text-muted mb-0">
								Color and background helpers combine the power of our{' '}
								<code>.text-*</code> utilities and <code>.bg-*</code> utilities
								in one class. Using our Sass <code>color-contrast()</code>{' '}
								function, we automatically determine a contrasting{' '}
								<code>color</code> for a particular{' '}
								<code>background-color</code>.
							</p>
						</Card.Header>
						<Card.Body>
							<div className="d-flex flex-column gap-2">
								{(colors || []).slice(0, 8).map((color, idx) => {
									return (
										<div key={idx} className={`text-bg-${color.variant} p-2`}>
											{color.variant.charAt(0).toUpperCase() +
												color.variant.slice(1)}{' '}
											with contrasting color (.text-bg-{color.variant})
										</div>
									)
								})}
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xl={12}>
					<Card>
						<Card.Header>
							<h4 className="header-title">Background Opacity</h4>
							<p className="text-muted mb-0">
								<code>background-color</code> utilities are generated with Sass
								using CSS variables. This allows for real-time color changes
								without compilation and dynamic alpha transparency changes.
							</p>
						</Card.Header>
						<Card.Body>
							<div className="text-bg-primary p-2">
								This is default primary background
							</div>
							<div className="text-bg-primary p-2 bg-opacity-75">
								This is 75% opacity primary background
							</div>
							<div className="bg-primary p-2 text-dark bg-opacity-50">
								This is 50% opacity primary background
							</div>
							<div className="bg-primary p-2 text-dark bg-opacity-25">
								This is 25% opacity primary background
							</div>
							<div className="bg-primary p-2 text-dark bg-opacity-10">
								This is 10% opacity success background
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xl={12}>
					<Card>
						<Card.Header>
							<h4 className="header-title">Text Color</h4>
							<p className="text-muted mb-0">
								Colorize text with color utilities. If you want to colorize
								links, you can use the <code>.link-*</code> helper classes which
								have <code>:hover</code>
								&nbsp;and <code>:focus</code> states.
							</p>
						</Card.Header>
						<Card.Body>
							<Row>
								<Col md={6}>
									{(colors || []).slice(0, 7).map((color, idx) => {
										return (
											<React.Fragment key={idx}>
												<p
													className={`text-${color.variant} ${
														colors[idx].isBG ? 'bg-dark' : ''
													}`}
												>
													.text-{color.variant}
												</p>
												<p className={`text-${color.variant}-emphasis`}>
													.text-{color.variant}-emphasis
												</p>
											</React.Fragment>
										)
									})}
								</Col>
								<Col md={6}>
									<p className="text-dark">.text-dark</p>
									<p className="text-dark-emphasis">.text-dark-emphasis</p>
									<p className="text-muted">.text-muted</p>
									<p className="text-body">.text-body</p>
									<p className="text-body-emphasis">.text-body-emphasis</p>
									<p className="text-body-secondary">.text-body-secondary</p>
									<p className="text-body-tertiary">.text-body-tertiary</p>
									<p className="text-black">.text-black</p>
									<p className="text-white bg-dark">.text-white</p>
									<p className="text-black-50">.text-black-50</p>
									<p className="text-white-50 bg-dark">.text-white-50</p>
								</Col>
							</Row>
						</Card.Body>
					</Card>
				</Col>

				<Row>
					<Col xl={12}>
						<Card>
							<Card.Header>
								<h4 className="header-title">Text Opacity Color</h4>
								<p className="text-muted mb-0">
									text color utilities are generated with Sass using CSS
									variables. This allows for real-time color changes without
									compilation and dynamic alpha transparency changes.
								</p>
							</Card.Header>
							<Card.Body>
								{(opacities || []).map((opacity, idx) => {
									return (
										<div
											key={idx}
											className={`text-primary text-opacity-${opacity}`}
										>
											This is {opacity}% opacity primary text
										</div>
									)
								})}
							</Card.Body>
						</Card>
					</Col>

					<Col xl={12}>
						<Card>
							<Card.Header>
								<h4 className="header-title">Opacity</h4>
								<p className="text-muted mb-0">
									The <code>opacity</code> property sets the opacity level for
									an element. The opacity level describes the transparency
									level, where <code>1</code> is not transparent at all,{' '}
									<code>.5</code> is 50% visible, and <code>0</code> is
									completely transparent. Set the <code>opacity</code> of an
									element using <code>{`.opacity-{value}`}</code> utilities.
								</p>
							</Card.Header>
							<Card.Body>
								<div className="d-flex flex-wrap gap-2">
									{(opacities || []).map((opacity, idx) => {
										return (
											<div
												key={idx}
												className={`opacity-${opacity} p-2 bg-primary text-light fw-bold rounded`}
											>
												{opacity}%
											</div>
										)
									})}
								</div>
							</Card.Body>
						</Card>
					</Col>
				</Row>

				<Row>
					<Col xl={12}>
						<Card>
							<Card.Header>
								<h4 className="header-title">Additive(Add) Border</h4>
								<p className="text-muted mb-0">
									Use border utilities to <b>add</b> an element’s borders.
									Choose from all borders or one at a time.
								</p>
							</Card.Header>
							<Card.Body>
								<div className="d-flex align-items-start flex-wrap gap-4">
									<div className="text-center">
										<div className="border avatar-md bg-light bg-opacity-50"></div>
									</div>
									{(borders || []).map((border, idx) => {
										return (
											<div key={idx} className="text-center">
												<div
													className={`border-${border.align} avatar-md bg-light bg-opacity-50`}
												></div>
											</div>
										)
									})}
								</div>
							</Card.Body>
						</Card>
					</Col>

					<Col xl={12}>
						<Card>
							<Card.Header>
								<h4 className="header-title">Subtractive(Remove) Border</h4>
								<p className="text-muted mb-0">
									Use border utilities to <b>remove</b> an element’s borders.
									Choose from all borders or one at a time.
								</p>
							</Card.Header>
							<Card.Body>
								<div className="d-flex align-items-start flex-wrap gap-4">
									<div className="text-center">
										<div className="border border-0 avatar-md bg-light bg-opacity-50"></div>
									</div>
									{(borders || []).map((border, idx) => {
										return (
											<div key={idx} className="text-center">
												<div
													className={`border border-${border.align}-0 avatar-md bg-light bg-opacity-50`}
												></div>
											</div>
										)
									})}
								</div>
							</Card.Body>
						</Card>
					</Col>
				</Row>

				<Row>
					<Col xl={12}>
						<Card>
							<Card.Header>
								<h4 className="header-title">Border Color</h4>
								<p className="text-muted mb-0">
									Change the border color using utilities built on our theme
									colors.
								</p>
							</Card.Header>
							<Card.Body>
								<div className="d-flex align-items-start flex-wrap gap-2">
									{(colors || []).slice(0, 8).map((color, idx) => {
										return (
											<div className="text-center" key={idx}>
												<div
													className={`border border-${color.variant} ${
														colors[idx].noBG ? '' : 'bg-light'
													} avatar-md  bg-opacity-50`}
												></div>
											</div>
										)
									})}
								</div>
							</Card.Body>
						</Card>

						<Card>
							<Card.Header>
								<h4 className="header-title">Border Width Size</h4>
							</Card.Header>
							<Card.Body>
								<div className="d-flex align-items-start flex-wrap gap-2">
									<div className="text-center">
										<div className="border avatar-md bg-light bg-opacity-50"></div>
									</div>
									{(borders || []).map((border, idx) => {
										return (
											<div key={idx} className="text-center">
												<div
													className={`border border-${border.size} bg-light avatar-md bg-opacity-50`}
												></div>
											</div>
										)
									})}
								</div>
							</Card.Body>
						</Card>
					</Col>

					<Col xl={12}>
						<Card>
							<Card.Header>
								<h4 className="header-title">Border Opacity</h4>
								<p className="text-muted mb-0">
									choose from any of the <code>.border-opacity</code> utilities:
								</p>
							</Card.Header>
							<Card.Body>
								{(opacities || []).map((opacity, idx) => {
									return (
										<div
											key={idx}
											className={`border border-success p-2 mb-2 border-opacity-${opacity}`}
										>
											This is {opacity}% opacity success border
										</div>
									)
								})}
								<div className="border border-success p-2 border-opacity-10">
									This is 10% opacity success border
								</div>
							</Card.Body>
						</Card>
					</Col>
				</Row>

				<Row>
					<Col xl={12}>
						<Card>
							<Card.Header>
								<h4 className="header-title">Border subtle Color</h4>
								<p className="text-muted mb-0">
									Change the border color using utilities built on our theme
									colors.
								</p>
							</Card.Header>
							<Card.Body>
								<div className="d-flex align-items-start flex-wrap gap-2">
									{(colors || []).slice(0, 8).map((color, idx) => {
										return (
											<div className="text-center" key={idx}>
												<div
													className={`border border-${color.variant}-subtle ${
														colors[idx].noBG ? '' : 'bg-light'
													}  avatar-md bg-opacity-50`}
												></div>
											</div>
										)
									})}
								</div>
							</Card.Body>
						</Card>
					</Col>
				</Row>

				<Row>
					<Col xl={12}>
						<Card>
							<Card.Header>
								<h4 className="header-title">Border Radius</h4>
								<p className="text-muted mb-0">
									Add classes to an element to easily round its corners.
								</p>
							</Card.Header>
							<Card.Body>
								<div className="d-flex align-items-start flex-wrap gap-2">
									<img
										src={avatar2}
										className="avatar-lg rounded"
										alt="rounded"
									/>
									{(borders || []).map((round, idx) => {
										return (
											<img
												key={idx}
												src={avatar2}
												className={`avatar-lg rounded-${round.align}`}
												alt={`rounded-${round.align}`}
											/>
										)
									})}
									<img
										src={avatar2}
										className="avatar-lg rounded-circle"
										alt="rounded-circle"
									/>
									<img
										src={Img2}
										className="avatar-lg w-auto rounded-pill"
										alt="rounded-pill"
									/>
								</div>
							</Card.Body>
						</Card>
					</Col>

					<Col xl={12}>
						<Card>
							<Card.Header>
								<h4 className="header-title">Border Radius Size</h4>
								<p className="text-muted mb-0">
									Use the scaling classes for larger or smaller rounded corners.
									Sizes range from <code>0</code> to <code>5</code>.
								</p>
							</Card.Header>
							<Card.Body>
								<div className="d-flex align-items-start flex-wrap gap-2">
									<img
										src={avatar4}
										className="avatar-lg rounded-0"
										alt="rounded-0"
									/>

									{(data || []).map((border, idx) => {
										return (
											<img
												key={idx}
												src={avatar4}
												className={`avatar-lg rounded-${idx + 1}`}
												alt="rounded-0"
											/>
										)
									})}
								</div>
							</Card.Body>
						</Card>
					</Col>
				</Row>

				<Row>
					<Col xl={12}>
						<Card>
							<Card.Header>
								<h4 className="header-title">Text Selection</h4>
								<p className="text-muted mb-0">
									Use <code>user-select-all</code>,{' '}
									<code>user-select-auto</code>, or&nbsp;
									<code>user-select-none</code> class to the content which is
									selected when the user interacts with it.
								</p>
							</Card.Header>
							<Card.Body>
								<p className="user-select-all">
									This paragraph will be entirely selected when clicked by the
									user.
								</p>
								<p className="user-select-auto">
									This paragraph has default select behavior.
								</p>
								<p className="user-select-none mb-0">
									This paragraph will not be selectable when clicked by the
									user.
								</p>
							</Card.Body>
						</Card>
					</Col>

					<Col xl={12}>
						<Card>
							<Card.Header>
								<h4 className="header-title">Pointer Events</h4>
								<p className="text-muted mb-0">
									Bootstrap provides <code>.pe-none</code> and{' '}
									<code>.pe-auto</code> classes to prevent or add element
									interactions.
								</p>
							</Card.Header>
							<Card.Body>
								<p>
									<Link
										to="#"
										className="pe-none"
										tabIndex={-1}
										aria-disabled="true"
									>
										This link
									</Link>{' '}
									can not be clicked.
								</p>
								<p>
									<Link to="#" className="pe-auto">
										This link
									</Link>{' '}
									can be clicked (this is default behavior).
								</p>
								<p className="pe-none">
									<Link to="#" tabIndex={-1} aria-disabled="true">
										This link
									</Link>{' '}
									can not be clicked because the&nbsp;
									<code>pointer-events</code> property is inherited from its
									parent. However,{' '}
									<Link to="#" className="pe-auto">
										this link
									</Link>{' '}
									has a <code>pe-auto</code> class and can be clicked.
								</p>
							</Card.Body>
						</Card>
					</Col>
				</Row>

				<Row>
					<Col xl={12}>
						<Card>
							<Card.Header>
								<h4 className="header-title">Overflow</h4>
								<p className="text-muted mb-0">
									Adjust the <code>overflow</code> property on the fly with four
									default values and classes. These classes are not responsive
									by default.
								</p>
							</Card.Header>
							<Card.Body>
								<div className="d-flex flex-wrap gap-4">
									<div
										className="overflow-auto p-3 bg-light"
										style={{ maxWidth: 260, maxHeight: 100 }}
									>
										This is an example of using <code>.overflow-auto</code> on
										an element with set width and height dimensions. By design,
										this content will vertically scroll.
									</div>
									<div
										className="overflow-hidden p-3 bg-light"
										style={{ maxWidth: 260, maxHeight: 100 }}
									>
										This is an example of using <code>.overflow-hidden</code> on
										an element with set width and height dimensions.
									</div>
									<div
										className="overflow-visible p-3 bg-light"
										style={{ maxWidth: 260, maxHeight: 100 }}
									>
										This is an example of using <code>.overflow-visible</code>{' '}
										on an element with set width and height dimensions.
									</div>
									<div
										className="overflow-scroll p-3 bg-light"
										style={{ maxWidth: 260, maxHeight: 100 }}
									>
										This is an example of using <code>.overflow-scroll</code> on
										an element with set width and height dimensions.
									</div>
								</div>
							</Card.Body>
						</Card>
					</Col>
				</Row>

				<Row>
					<Col xl={12}>
						<Card>
							<Card.Header>
								<h4 className="header-title">Position in Arrange</h4>
								<p className="text-muted mb-0">
									Arrange elements easily with the edge positioning utilities.
									The format is <code>{`{property}-{position}`}</code>.
								</p>
							</Card.Header>
							<Card.Body>
								<div
									className="position-relative p-5 bg-light bg-opacity-50 m-3 border rounded"
									style={{ height: 180 }}
								>
									<div className="position-absolute top-0 start-0 avatar-xs bg-dark rounded"></div>
									<div className="position-absolute top-0 end-0 avatar-xs bg-dark rounded"></div>
									<div className="position-absolute top-50 start-50 avatar-xs bg-dark rounded"></div>
									<div className="position-absolute bottom-50 end-50 avatar-xs bg-dark rounded"></div>
									<div className="position-absolute bottom-0 start-0 avatar-xs bg-dark rounded"></div>
									<div className="position-absolute bottom-0 end-0 avatar-xs bg-dark rounded"></div>
								</div>
							</Card.Body>
						</Card>
					</Col>

					<Col xl={12}>
						<Card>
							<Card.Header>
								<h4 className="header-title">Position in Center</h4>
								<p className="text-muted mb-0">
									In addition, you can also center the elements with the
									transform utility class <code>.translate-middle</code>.
								</p>
							</Card.Header>
							<Card.Body>
								<div
									className="position-relative m-3 bg-light bg-opacity-50 border rounded"
									style={{ height: 180 }}
								>
									<div className="position-absolute top-0 start-0 translate-middle avatar-xs bg-dark rounded"></div>
									<div className="position-absolute top-0 start-50 translate-middle avatar-xs bg-dark rounded"></div>
									<div className="position-absolute top-0 start-100 translate-middle avatar-xs bg-dark rounded"></div>

									<div className="position-absolute top-50 start-0 translate-middle avatar-xs bg-dark rounded"></div>
									<div className="position-absolute top-50 start-50 translate-middle avatar-xs bg-dark rounded"></div>
									<div className="position-absolute top-50 start-100 translate-middle avatar-xs bg-dark rounded"></div>

									<div className="position-absolute top-100 start-0 translate-middle avatar-xs bg-dark rounded"></div>
									<div className="position-absolute top-100 start-50 translate-middle avatar-xs bg-dark rounded"></div>
									<div className="position-absolute top-100 start-100 translate-middle avatar-xs bg-dark rounded"></div>
								</div>
							</Card.Body>
						</Card>
					</Col>
				</Row>

				<Row>
					<Col xl={12}>
						<Card>
							<Card.Header>
								<h4 className="header-title">Position in Axis</h4>
								<p className="text-muted mb-0">
									By adding <code>.translate-middle-x</code> or{' '}
									<code>.translate-middle-y</code> classes, elements can be
									positioned only in horizontal or vertical direction.
								</p>
							</Card.Header>
							<Card.Body>
								<div
									className="position-relative m-3 bg-light border rounded"
									style={{ height: 180 }}
								>
									<div className="position-absolute top-0 start-0 avatar-xs bg-dark rounded "></div>
									<div className="position-absolute top-0 start-50 translate-middle-x avatar-xs bg-dark rounded"></div>
									<div className="position-absolute top-0 end-0 avatar-xs bg-dark rounded"></div>

									<div className="position-absolute top-50 start-0 translate-middle-y avatar-xs bg-dark rounded"></div>
									<div className="position-absolute top-50 start-50 translate-middle avatar-xs bg-dark rounded"></div>
									<div className="position-absolute top-50 end-0 translate-middle-y avatar-xs bg-dark rounded"></div>

									<div className="position-absolute bottom-0 start-0 avatar-xs bg-dark rounded"></div>
									<div className="position-absolute bottom-0 start-50 translate-middle-x avatar-xs bg-dark rounded"></div>
									<div className="position-absolute bottom-0 end-0 avatar-xs bg-dark rounded"></div>
								</div>
							</Card.Body>
						</Card>
					</Col>

					<Col xl={12}>
						<Card>
							<Card.Header>
								<h4 className="header-title">Shadows</h4>
								<p className="text-muted mb-0">
									While shadows on components are disabled by default in
									Bootstrap and can be enabled via&nbsp;
									<code>$enable-shadows</code>, you can also quickly add or
									remove a shadow with our <code>box-shadow</code> utility
									classes. Includes support for <code>.shadow-none</code> and
									three default sizes (which have associated variables to
									match).
								</p>
							</Card.Header>
							<Card.Body>
								<div className="shadow-none p-2 mb-2 bg-light rounded">
									No shadow
								</div>
								<div className="shadow-sm p-2 mb-2 rounded">Small shadow</div>
								<div className="shadow p-2 mb-2 rounded">Regular shadow</div>
								<div className="shadow-lg p-2 mb-2 rounded">Larger shadow</div>
							</Card.Body>
						</Card>
					</Col>
				</Row>

				<Row>
					<Col xl={12}>
						<Card>
							<Card.Header>
								<h4 className="header-title">Width</h4>
								<p className="text-muted mb-0">
									Width utilities are generated from the utility API in{' '}
									<code>_utilities.scss</code>. Includes support for
									<code>25%</code>, <code>50%</code>, <code>75%</code>,{' '}
									<code>100%</code>, and <code>auto</code> by default. Modify
									those values as you need to generate different utilities here.
								</p>
							</Card.Header>
							<Card.Body>
								{(data || []).map((width, idx) => {
									return (
										<div key={idx} className={`w-${width} p-2 bg-light`}>
											Width {width}%
										</div>
									)
								})}
							</Card.Body>
						</Card>
					</Col>

					<Col xl={12}>
						<Card>
							<Card.Header>
								<h4 className="header-title">Height</h4>
								<p className="text-muted mb-0">
									Height utilities are generated from the utility API in{' '}
									<code>_utilities.scss</code>. Includes support for&nbsp;
									<code>25%</code>, <code>50%</code>, <code>75%</code>,{' '}
									<code>100%</code>, and <code>auto</code> by default. Modify
									those values as you need to generate different utilities here.
								</p>
							</Card.Header>
							<Card.Body>
								<div
									className="d-flex flex-wrap gap-3 align-items-start"
									style={{ height: 255 }}
								>
									{(data || []).map((height, idx) => {
										return (
											<div key={idx} className={`h-${height} p-2 bg-light`}>
												Height {height}%
											</div>
										)
									})}
								</div>
							</Card.Body>
						</Card>
					</Col>
				</Row>

				<Row>
					<Col xl={12}>
						<Card>
							<Card.Header>
								<h4 className="header-title">Object fit</h4>
								<p className="text-muted mb-0">
									Change the value of the{' '}
									<a
										href="https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit"
										target="_blank"
										rel="noreferrer"
									>
										<code>object-fit</code> property
									</a>{' '}
									with our responsive <code>object-fit</code> utility classes.
									This property tells the content to fill the parent container
									in a variety of ways, such as preserving the aspect ratio or
									stretching to take up as much space as possible.
								</p>
							</Card.Header>
							<Card.Body>
								<div className="d-flex align-items-start flex-wrap gap-3 text-center">
									{(objectTypes || []).map((type, idx) => {
										return (
											<div key={idx}>
												<img
													src={Img1}
													className={`object-fit-${type} border rounded avatar-xl`}
													alt="..."
												/>
												<p className="mt-1 mb-0">
													<code className="user-select-all">
														.object-fit-{type}
													</code>
												</p>
											</div>
										)
									})}
								</div>
							</Card.Body>
						</Card>
					</Col>
				</Row>

				<Row>
					<Col xl={12}>
						<Card.Header>
							<h4 className="header-title">Object fit</h4>
							<p className="text-muted mb-0">
								Change the value of the{' '}
								<a
									href="https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit"
									target="_blank"
									rel="noreferrer"
								>
									<code>object-fit</code> property
								</a>{' '}
								with our responsive <code>object-fit</code> utility classes.
								This property tells the content to fill the parent container in
								a variety of ways, such as preserving the aspect ratio or
								stretching to take up as much space as possible.
							</p>
						</Card.Header>
						<Card>
							<Card.Body>
								<div
									className="position-relative"
									style={{ height: 220, zIndex: 1 }}
								>
									<div className="z-3 position-absolute p-5 rounded-3 bg-primary-subtle"></div>
									<div className="z-2 position-absolute p-5 m-2 rounded-3 bg-success-subtle"></div>
									<div className="z-1 position-absolute p-5 m-3 rounded-3 bg-secondary-subtle"></div>
									<div className="z-0 position-absolute p-5 m-4 rounded-3 bg-danger-subtle"></div>
									<div className="z-n1 position-absolute p-5 m-5 rounded-3 bg-info-subtle"></div>
								</div>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</Row>
		</>
	)
}

export default Utilities
