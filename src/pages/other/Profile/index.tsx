import { Button, Card, Col, Image, Nav, Row, Tab } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { profileActivity } from './data'
import React from 'react'

// images
import bgProfile from '@/assets/images/bg-profile.jpg'
import avatar1 from '@/assets/images/users/avatar-1.jpg'

// components
import { FormInput } from '@/components'

const ProfilePages = () => {
	return (
		<>
			<div>
				<Row>
					<Col sm={12}>
						<div
							className="profile-bg-picture"
							style={{ backgroundImage: `url(${bgProfile})` }}
						>
							<span className="picture-bg-overlay" />
						</div>
						<div className="profile-user-box">
							<Row>
								<Col sm={6}>
									<div className="profile-user-img">
										<Image
											src={avatar1}
											className="avatar-lg rounded-circle"
											alt="user"
										/>
									</div>
									<div>
										<h4 className="mt-4 fs-17 ellipsis">Michael A. Franklin</h4>
										<p className="font-13"> User Experience Specialist</p>
										<p className="text-muted mb-0">
											<small>California, United States</small>
										</p>
									</div>
								</Col>
								<Col sm={6}>
									<div className="d-flex justify-content-end align-items-center gap-2">
										<Button type="button" variant="soft-danger">
											<i className="ri-settings-2-line align-text-bottom me-1 fs-16 lh-1" />{' '}
											Edit Profile
										</Button>
										<Button variant="soft-info">
											{' '}
											<i className="ri-check-double-fill fs-18 me-1 lh-1" />{' '}
											Following
										</Button>
									</div>
								</Col>
							</Row>
						</div>
					</Col>
				</Row>
				<Row>
					<Col sm={12}>
						<Card className="p-0">
							<Card.Body className="p-0">
								<div className="profile-content">
									<Tab.Container defaultActiveKey="About">
										<Nav as="ul" justify className="nav-underline gap-0">
											<Nav.Item as="li">
												<Nav.Link
													as={Link}
													to="#"
													eventKey="About"
													type="button"
												>
													About
												</Nav.Link>
											</Nav.Item>
											<Nav.Item>
												<Nav.Link
													eventKey="Activities"
													to="#"
													as={Link}
													type="button"
												>
													Activities
												</Nav.Link>
											</Nav.Item>
											<Nav.Item>
												<Nav.Link
													as={Link}
													type="button"
													to="#"
													eventKey="Settings"
												>
													Settings
												</Nav.Link>
											</Nav.Item>
											<Nav.Item>
												<Nav.Link
													type="button"
													as={Link}
													to="#"
													eventKey="Projects"
												>
													Projects
												</Nav.Link>
											</Nav.Item>
										</Nav>
										<Tab.Content className="m-0 p-4">
											<Tab.Pane eventKey="About" id="aboutme" tabIndex={0}>
												<div className="profile-desk">
													<h5 className="text-uppercase fs-17 text-dark">
														Johnathan Deo
													</h5>
													<div className="designation mb-4">
														PRODUCT DESIGNER (UX / UI / Visual Interaction)
													</div>
													<p className="text-muted fs-16">
														I have 10 years of experience designing for the web,
														and specialize in the areas of user interface
														design, interaction design, visual design and
														prototyping. I’ve worked with notable startups
														including Pearl Street Software.
													</p>
													<h5 className="mt-4 fs-17 text-dark">
														Contact Information
													</h5>
													<table className="table table-condensed mb-0 border-top">
														<tbody>
															<tr>
																<th scope="row">Url</th>
																<td>
																	<Link to="" className="ng-binding">
																		www.example.com
																	</Link>
																</td>
															</tr>
															<tr>
																<th scope="row">Email</th>
																<td>
																	<Link to="" className="ng-binding">
																		jonathandeo@example.com
																	</Link>
																</td>
															</tr>
															<tr>
																<th scope="row">Phone</th>
																<td className="ng-binding">(123)-456-7890</td>
															</tr>
															<tr>
																<th scope="row">Skype</th>
																<td>
																	<Link to="" className="ng-binding">
																		jonathandeo123
																	</Link>
																</td>
															</tr>
														</tbody>
													</table>
												</div>
											</Tab.Pane>
											<Tab.Pane eventKey="Activities" id="user-activities">
												<div className="timeline-2">
													{(profileActivity || []).map((activity, idx) => {
														return (
															<div key={idx} className="time-item">
																<div className="item-info ms-3 mb-3">
																	<div className="text-muted">
																		{activity.time}
																	</div>
																	<p>
																		<Link to="#" className="text-info">
																			{activity.name}
																		</Link>{' '}
																		{activity.title}
																		{activity.subName && (
																			<React.Fragment>
																				<Link to="#" className="text-success">
																					John Doe
																				</Link>
																				.
																			</React.Fragment>
																		)}
																	</p>
																	{activity.image &&
																		(activity.image || []).map((image, idx) => {
																			return (
																				<Image
																					key={idx}
																					src={image}
																					height={40}
																					width={60}
																					className="rounded-1 me-1"
																				/>
																			)
																		})}
																	{!activity.image && (
																		<p>
																			<em>
																				"Lorem ipsum dolor sit amet, consectetur
																				adipiscing elit. Aliquam laoreet tellus
																				ut tincidunt euismod. "
																			</em>
																		</p>
																	)}
																</div>
															</div>
														)
													})}
												</div>
											</Tab.Pane>
											<Tab.Pane eventKey="Settings" id="edit-profile">
												<div className="user-profile-content">
													<form>
														<Row className="row-cols-sm-2 row-cols-1">
															<FormInput
																name="fullName"
																label="Full Name"
																type="text"
																containerClass="mb-2"
																defaultValue="John Doe"
															/>
															<FormInput
																name="email"
																label="Email"
																type="text"
																containerClass="mb-3"
																defaultValue="first.last@example.com"
															/>
															<FormInput
																name="WebUrl"
																label="Website"
																type="text"
																containerClass="mb-3"
																defaultValue="Enter website url"
															/>
															<FormInput
																name="UserName"
																label="Username"
																type="text"
																containerClass="mb-3"
																defaultValue="john"
															/>
															<FormInput
																name="Password"
																label="Password"
																type="password"
																containerClass="mb-3"
																placeholder="6 - 15 Characters"
															/>
															<FormInput
																name="Password2"
																label="Re-Password"
																type="password"
																containerClass="mb-3"
																placeholder="6 - 15 Characters"
															/>
															<FormInput
																style={{ height: 125 }}
																name="About"
																label="About Me"
																type="textarea"
																containerClass="col-sm-12 mb-3"
																defaultValue={
																	'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.'
																}
															/>
														</Row>
														<Button variant="primary" type="submit">
															<i className="ri-save-line me-1 fs-16 lh-1" />{' '}
															Save
														</Button>
													</form>
												</div>
											</Tab.Pane>
											<Tab.Pane eventKey="Projects" id="projects">
												<Row className="m-t-10">
													<Col md={12}>
														<div className="table-responsive">
															<table className="table table-bordered mb-0">
																<thead>
																	<tr>
																		<th>#</th>
																		<th>Project Name</th>
																		<th>Start Date</th>
																		<th>Due Date</th>
																		<th>Status</th>
																		<th>Assign</th>
																	</tr>
																</thead>
																<tbody>
																	<tr>
																		<td>1</td>
																		<td>Velonic Admin</td>
																		<td>01/01/2015</td>
																		<td>07/05/2015</td>
																		<td>
																			<span className="badge bg-info">
																				Work in Progress
																			</span>
																		</td>
																		<td>Techzaa</td>
																	</tr>
																	<tr>
																		<td>2</td>
																		<td>Velonic Frontend</td>
																		<td>01/01/2015</td>
																		<td>07/05/2015</td>
																		<td>
																			<span className="badge bg-success">
																				Pending
																			</span>
																		</td>
																		<td>Techzaa</td>
																	</tr>
																	<tr>
																		<td>3</td>
																		<td>Velonic Admin</td>
																		<td>01/01/2015</td>
																		<td>07/05/2015</td>
																		<td>
																			<span className="badge bg-pink">
																				Done
																			</span>
																		</td>
																		<td>Techzaa</td>
																	</tr>
																	<tr>
																		<td>4</td>
																		<td>Velonic Frontend</td>
																		<td>01/01/2015</td>
																		<td>07/05/2015</td>
																		<td>
																			<span className="badge bg-purple">
																				Work in Progress
																			</span>
																		</td>
																		<td>Techzaa</td>
																	</tr>
																	<tr>
																		<td>5</td>
																		<td>Velonic Admin</td>
																		<td>01/01/2015</td>
																		<td>07/05/2015</td>
																		<td>
																			<span className="badge bg-warning">
																				Coming soon
																			</span>
																		</td>
																		<td>Techzaa</td>
																	</tr>
																</tbody>
															</table>
														</div>
													</Col>
												</Row>
											</Tab.Pane>
										</Tab.Content>
									</Tab.Container>
								</div>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</div>
		</>
	)
}

export default ProfilePages
