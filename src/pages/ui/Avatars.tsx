import { Card, Col, Image, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

// component
import { PageBreadcrumb } from '@/components'

// images
import avatar1 from '@/assets/images/users/avatar-1.jpg'
import avatar2 from '@/assets/images/users/avatar-2.jpg'
import avatar3 from '@/assets/images/users/avatar-3.jpg'
import avatar4 from '@/assets/images/users/avatar-4.jpg'
import avatar5 from '@/assets/images/users/avatar-5.jpg'
import avatar6 from '@/assets/images/users/avatar-6.jpg'
import avatar8 from '@/assets/images/users/avatar-8.jpg'
import avatar7 from '@/assets/images/users/avatar-7.jpg'
import img1 from '@/assets/images/small/small-2.jpg'
import img2 from '@/assets/images/small/small-3.jpg'

const RoundedCircle = ({ size }: { size: string }) => {
	return (
		<>
			<Col md={4}>
				<Image
					fluid
					src={avatar3}
					alt=""
					className={`rounded-circle avatar-${size}`}
				/>
				<p>
					<code>.avatar-{size} .rounded-circle</code>
				</p>
			</Col>
		</>
	)
}
const Avatars = () => {
	return (
		<>
			<PageBreadcrumb title="Avatars" subName="Base UI" />
			<Row>
				<Col xxl={12}>
					<Card>
						<Card.Header>
							<h4 className="header-title">Sizing - Images</h4>
							<p className="text-muted mb-0">
								Create and group avatars of different sizes and shapes with the
								css classes. Using Bootstrap's naming convention, you can
								control size of avatar including standard avatar, or scale it up
								to different sizes.
							</p>
						</Card.Header>
						<Card.Body>
							<Row>
								<Col md={3}>
									<Image
										src={avatar2}
										alt="avatar"
										className="avatar-xs rounded"
										fluid
									/>
									<p>
										<code>.avatar-xs</code>
									</p>
									<Image
										src={avatar3}
										alt="avatar"
										className="avatar-sm rounded mt-2"
										fluid
									/>{' '}
									<p className="mb-2 mb-sm-0">
										<code>.avatar-sm</code>
									</p>
								</Col>
								<Col md={3}>
									<Image
										src={avatar4}
										alt="avatar"
										className="avatar-md rounded"
										fluid
									/>
									<p>
										<code>.avatar-md</code>
									</p>
								</Col>

								<Col md={3}>
									<Image
										src={avatar5}
										alt="avatar"
										className="img-fluid avatar-lg rounded"
									/>
									<p>
										<code>.avatar-lg</code>
									</p>
								</Col>

								<Col md={3}>
									<Image
										src={avatar6}
										alt="avatar"
										className="img-fluid avatar-xl rounded"
									/>
									<p className="mb-0">
										<code>.avatar-xl</code>
									</p>
								</Col>
							</Row>
						</Card.Body>
					</Card>
				</Col>
				<Col xxl={12}>
					<Card>
						<Card.Header>
							<h4 className="header-title">Rounded Circle</h4>
							<p className="text-muted mb-0">
								Using an additional class <code>.rounded-circle</code> in{' '}
								<code>&lt;img&gt;</code> element creates the rounded avatar.
							</p>
						</Card.Header>
						<Card.Body>
							<Row>
								{['md', 'lg', 'xl'].map((size, idx) => {
									return <RoundedCircle key={idx} size={size} />
								})}
							</Row>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xxl={12}>
					<Card>
						<Card.Header>
							<h4 className="header-title">Sizing - Background Color</h4>
							<p className="text-muted mb-0">
								Using utilities classes of background e.g. <code>bg-*</code>{' '}
								allows you to have any background color as well.
							</p>
						</Card.Header>
						<Card.Body>
							<Row>
								<Col md={3}>
									<div className="avatar-xs">
										<span className="avatar-title rounded">xs</span>
									</div>
									<p className="mb-2 fs-14 mt-1">
										Using <code>.avatar-xs</code>
									</p>

									<div className="avatar-sm mt-3">
										<span className="avatar-title bg-success rounded">sm</span>
									</div>

									<p className="mb-0 fs-14 mt-1">
										Using <code>.avatar-sm</code>
									</p>
								</Col>
								<Col md={3}>
									<div className="avatar-md">
										<span className="avatar-title bg-info-subtle text-info fs-20 rounded">
											MD
										</span>
									</div>

									<p className="mb-0 fs-14 mt-1">
										Using <code>.avatar-md</code>
									</p>
								</Col>

								<Col md={3}>
									<div className="avatar-lg">
										<span className="avatar-title bg-danger fs-22 rounded">
											LG
										</span>
									</div>

									<p className="mb-0 fs-14 mt-1">
										Using <code>.avatar-lg</code>
									</p>
								</Col>

								<Col md={3}>
									<div className="avatar-xl">
										<span className="avatar-title bg-warning-subtle text-warning fs-24 rounded">
											XL
										</span>
									</div>

									<p className="mb-0 fs-14 mt-1">
										Using <code>.avatar-xl</code>
									</p>
								</Col>
							</Row>
						</Card.Body>
					</Card>
				</Col>
				<Col xxl={12}>
					<Card>
						<Card.Header>
							<h4 className="header-title">Rounded Circle Background</h4>
							<p className="text-muted mb-0">
								Using an additional class <code>.rounded-circle</code> in{' '}
								<code>&lt;img&gt;</code> element creates the rounded avatar.
							</p>
						</Card.Header>
						<Card.Body>
							<Row>
								<Col md={4}>
									<div className="avatar-md">
										<span className="avatar-title bg-secondary-subtle text-secondary fs-20 rounded-circle">
											MD
										</span>
									</div>

									<p className="mb-0 fs-14 mt-1">
										Using <code>.avatar-md .rounded-circle</code>
									</p>
								</Col>

								<Col md={4}>
									<div className="avatar-lg">
										<span className="avatar-title bg-light text-dark fs-22 rounded-circle">
											LG
										</span>
									</div>

									<p className="mb-0 fs-14 mt-1">
										Using <code>.avatar-lg .rounded-circle</code>
									</p>
								</Col>

								<Col md={4}>
									<div className="avatar-xl">
										<span className="avatar-title bg-primary-subtle text-primary fs-24 rounded-circle">
											XL
										</span>
									</div>

									<p className="mb-0 fs-14 mt-1">
										Using <code>.avatar-xl .rounded-circle</code>
									</p>
								</Col>
							</Row>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xs={12}>
					<Card>
						<Card.Header>
							<h4 className="header-title">Images Shapes</h4>
							<p className="text-muted mb-0">
								Avatars with different sizes and shapes.
							</p>
						</Card.Header>
						<Card.Body>
							<Row>
								<Col sm={2}>
									<Image
										src={img1}
										alt="avatar"
										className="rounded"
										width="200"
										fluid
									/>
									<p className="mb-0">
										<code>.rounded</code>
									</p>
								</Col>
								<Col sm={2} className="text-center">
									<Image
										src={avatar6}
										alt="avatar"
										className="rounded"
										width="120"
										fluid
									/>
									<p className="mb-0">
										<code>.rounded</code>
									</p>
								</Col>
								<Col sm={2} className="text-center">
									<Image
										src={avatar7}
										alt="avatar"
										className="rounded-circle"
										width="120"
										fluid
									/>
									<p className="mb-0">
										<code>.rounded-circle</code>
									</p>
								</Col>
								<Col sm={2}>
									<Image
										src={img2}
										alt="avatar"
										className="img-thumbnail"
										width="200"
										fluid
									/>
									<p className="mb-0">
										<code>.img-thumbnail</code>
									</p>
								</Col>
								<Col sm={2}>
									<Image
										src={avatar8}
										alt="avatar"
										className="rounded-circle img-thumbnail"
										width="120"
										fluid
									/>
									<p className="mb-0">
										<code>.rounded-circle .img-thumbnail</code>
									</p>
								</Col>
							</Row>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col lg={12}>
					<Card>
						<Card.Header>
							<h4 className="header-title">Avatar Group</h4>
							<p className="text-muted  mb-0">
								Use <code>avatar-group</code> class to show avatar images with
								the group. Use <code>avatar-group</code> class with&nbsp;
								<code>data-bs-toggle="tooltip"</code> to show avatar group
								images with tooltip.
							</p>
						</Card.Header>
						<Card.Body>
							<Row>
								<Col lg={6}>
									<div className="mt-lg-0 mt-3">
										<div className="avatar-group">
											<div className="avatar-group-item">
												<Image
													src={avatar4}
													alt=""
													className="rounded-circle avatar-xs"
												/>
											</div>
											<div className="avatar-group-item">
												<Image
													src={avatar5}
													alt=""
													className="rounded-circle avatar-xs"
												/>
											</div>
											<div className="avatar-group-item">
												<div className="avatar-xs">
													<div className="avatar-title rounded-circle text-bg-info">
														A
													</div>
												</div>
											</div>
											<div className="avatar-group-item">
												<Image
													src={avatar2}
													alt=""
													className="rounded-circle avatar-xs"
												/>
											</div>
										</div>
									</div>
								</Col>

								<Col lg={6}>
									<div className="mt-lg-0 mt-3">
										<div className="avatar-group">
											<Link
												to="#"
												className="avatar-group-item"
												data-bs-toggle="tooltip"
												data-bs-placement="top"
												title="Tosha"
											>
												<Image
													src={avatar1}
													alt=""
													className="rounded-circle avatar-sm"
												/>
											</Link>
											<Link
												to="#"
												className="avatar-group-item"
												data-bs-toggle="tooltip"
												data-bs-placement="top"
												title="Brain"
											>
												<Image
													src={avatar3}
													alt=""
													className="rounded-circle avatar-sm"
												/>
											</Link>
											<Link
												to="#"
												className="avatar-group-item"
												data-bs-toggle="tooltip"
												data-bs-placement="top"
												title="Hooker"
											>
												<div className="avatar-sm">
													<div className="avatar-title rounded-circle bg-light text-primary">
														K
													</div>
												</div>
											</Link>
											<Link
												to="#"
												className="avatar-group-item"
												data-bs-toggle="tooltip"
												data-bs-placement="top"
												title="More +"
											>
												<div className="avatar-sm">
													<div className="avatar-title rounded-circle">9+</div>
												</div>
											</Link>
										</div>
									</div>
								</Col>
							</Row>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	)
}

export default Avatars
