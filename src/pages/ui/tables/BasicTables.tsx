import React from 'react'
import { Card, Col, Row, Table, ProgressBar } from 'react-bootstrap'
import { Link } from 'react-router-dom'

// dummy data
import { records, expandablerecords, nestedrecords } from './data'

// Components
import { PageBreadcrumb } from '@/components'

const BasicTable = () => {
	return (
		<>
			<Card>
				<Card.Header>
					<h4 className="header-title">Basic example</h4>
					<p className="text-muted mb-0">
						For basic styling—light padding and only horizontal dividers—add the
						base class <code>.table</code> to any <code>&lt;table&gt;</code>.
					</p>
				</Card.Header>
				<Card.Body>
					<div className="table-responsive-sm">
						<Table className="table-centered mb-0">
							<thead>
								<tr>
									<th>Name</th>
									<th>Phone Number</th>
									<th>Date of Birth</th>
									<th>Country</th>
								</tr>
							</thead>
							<tbody>
								{(records || []).map((record, idx) => {
									return (
										<tr key={idx}>
											<td>{record.name}</td>
											<td>{record.phoneNo}</td>
											<td>{record.dob}</td>
											<td>{record.country}</td>
										</tr>
									)
								})}
							</tbody>
						</Table>
					</div>
				</Card.Body>
			</Card>
		</>
	)
}

const InverseTable = () => {
	return (
		<>
			<Card>
				<Card.Header>
					<h4 className="header-title">Inverse table</h4>
					<p className="text-muted mb-0">
						You can also invert the colors—with light text on dark
						backgrounds—with <code>.table-dark</code>.
					</p>
				</Card.Header>
				<Card.Body>
					<div className="table-responsive-sm">
						<Table className="table table-dark mb-0">
							<thead>
								<tr>
									<th>Name</th>
									<th>Phone Number</th>
									<th>Date of Birth</th>
									<th>Country</th>
								</tr>
							</thead>
							<tbody>
								{(records || []).map((record, idx) => {
									return (
										<tr key={idx}>
											<td>{record.name}</td>
											<td>{record.phoneNo}</td>
											<td>{record.dob}</td>
											<td>{record.country}</td>
										</tr>
									)
								})}
							</tbody>
						</Table>
					</div>
				</Card.Body>
			</Card>
		</>
	)
}

const StripedRows = () => {
	return (
		<>
			<Card>
				<Card.Header>
					<h4 className="header-title">Striped rows</h4>
					<p className="text-muted mb-0">
						Use <code>.table-striped</code> to add zebra-striping to any table
						row within the <code>&lt;tbody&gt;</code>.
					</p>
				</Card.Header>
				<Card.Body>
					<div className="table-responsive-sm">
						<Table className="table-striped table-centered mb-0">
							<thead>
								<tr>
									<th>User</th>
									<th>Account No.</th>
									<th>Balance</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								{(records || []).map((record, idx) => {
									return (
										<tr key={idx}>
											<td className="table-user">
												<img
													src={record.image}
													alt="table-user"
													className="me-2 rounded-circle"
												/>
												&nbsp;{record.name}
											</td>
											<td>{record.accountNo}</td>
											<td>{record.dob}</td>
											<td>
												<Link to="#" className="text-reset fs-16 px-1">
													{' '}
													<i className="ri-settings-3-line" />
												</Link>
												<Link to="#" className="text-reset fs-16 px-1">
													{' '}
													<i className="ri-delete-bin-2-line" />
												</Link>
											</td>
										</tr>
									)
								})}
							</tbody>
						</Table>
					</div>
				</Card.Body>
			</Card>
		</>
	)
}

const TableHeadOptions = () => {
	return (
		<>
			<Card>
				<Card.Header>
					<h4 className="header-title">Table head options</h4>
					<p className="text-muted mb-0">
						Use one of two modifier classes to make <code>&lt;thead&gt;</code>s
						appear light or dark gray.
					</p>
				</Card.Header>
				<Card.Body>
					<div className="table-responsive-sm">
						<Table className="table-centered mb-0">
							<thead className="table-dark">
								<tr>
									<th>Product</th>
									<th>Courier</th>
									<th>Process</th>
									<th>Status</th>
								</tr>
							</thead>
							<tbody>
								{(expandablerecords || []).slice(0, 5).map((record, idx) => {
									return (
										<tr key={idx}>
											<td>{record.product}</td>
											<td>{record.courier}</td>
											<td>
												<ProgressBar
													now={record.now}
													variant={record.variant}
													className="progress-sm"
												/>
											</td>
											<td>{record.status}</td>
										</tr>
									)
								})}
							</tbody>
						</Table>
					</div>
				</Card.Body>
			</Card>
		</>
	)
}

const HoverableRows = () => {
	return (
		<>
			<Card>
				<Card.Header>
					<h4 className="header-title">Hoverable rows</h4>
					<p className="text-muted mb-0">
						Add <code>.table-hover</code> to enable a hover state on table rows
						within a <code>&lt;tbody&gt;</code>.
					</p>
				</Card.Header>
				<Card.Body>
					<div className="table-responsive-sm">
						<Table className="table-hover table-centered mb-0">
							<thead>
								<tr>
									<th>Product</th>
									<th>Price</th>
									<th>Quantity</th>
									<th>Amount</th>
								</tr>
							</thead>
							<tbody>
								{(expandablerecords || []).slice(0, 4).map((record, idx) => {
									return (
										<tr key={idx}>
											<td>{record.product}</td>
											<td>{record.price}</td>
											<td>
												<span className="badge bg-primary">
													{record.Quantity} Pcs
												</span>
											</td>
											<td>${record.Amount}</td>
										</tr>
									)
								})}
							</tbody>
						</Table>
					</div>
				</Card.Body>
			</Card>
		</>
	)
}

const SmallTable = () => {
	return (
		<>
			<Card>
				<Card.Header>
					<h4 className="header-title">Small table</h4>
					<p className="text-muted mb-0">
						Add <code>.table-sm</code> to make tables more compact by cutting
						cell padding in half.
					</p>
				</Card.Header>
				<Card.Body>
					<div className="table-responsive-sm">
						<Table className="table-sm table-centered mb-0">
							<thead>
								<tr>
									<th>Product</th>
									<th>Price</th>
									<th>Quantity</th>
									<th>Amount</th>
								</tr>
							</thead>
							<tbody>
								{(expandablerecords || []).map((record, idx) => {
									return (
										<tr key={idx}>
											<td>{record.product}</td>
											<td>{record.price}</td>
											<td>
												<span className="badge bg-primary">
													{record.Quantity} Pcs
												</span>
											</td>
											<td>${record.Amount}</td>
										</tr>
									)
								})}
							</tbody>
						</Table>
					</div>
				</Card.Body>
			</Card>
		</>
	)
}

const BorderedTable = () => {
	return (
		<>
			<Card>
				<Card.Header>
					<h4 className="header-title">Bordered table</h4>
					<p className="text-muted mb-0">
						Add <code>.table-bordered</code> for borders on all sides of the
						table and cells.
					</p>
				</Card.Header>
				<Card.Body>
					<div className="table-responsive-sm">
						<Table className="table-bordered table-centered mb-0">
							<thead>
								<tr>
									<th>User</th>
									<th>Account No.</th>
									<th>Balance</th>
									<th className="text-center">Action</th>
								</tr>
							</thead>
							<tbody>
								{(records || []).map((record, idx) => {
									return (
										<tr key={idx}>
											<td className="table-user">
												<img
													src={record.image}
													alt="table-user"
													className="me-2 rounded-circle"
												/>
												&nbsp;{record.name}
											</td>
											<td>{record.accountNo}</td>
											<td>{record.dob}</td>
											<td align="center">
												<Link to="#" className="text-reset fs-16 px-1">
													{' '}
													<i className="ri-delete-bin-2-line" />
												</Link>
											</td>
										</tr>
									)
								})}
							</tbody>
						</Table>
					</div>
				</Card.Body>
			</Card>
		</>
	)
}

const BorderedColorTable = () => {
	return (
		<>
			<Card>
				<Card.Header>
					<h4 className="header-title">Bordered color table</h4>
					<p className="text-muted mb-0">
						Add <code>.table-bordered</code> & <code>.border-primary</code> can
						be added to change colors.
					</p>
				</Card.Header>
				<Card.Body>
					<div className="table-responsive-sm">
						<Table className="table-bordered border-primary table-centered mb-0">
							<thead>
								<tr>
									<th>User</th>
									<th>Account No.</th>
									<th>Balance</th>
									<th className="text-center">Action</th>
								</tr>
							</thead>
							<tbody>
								{(records || []).map((record, idx) => {
									return (
										<tr key={idx}>
											<td className="table-user">
												<img
													src={record.image}
													alt="table-user"
													className="me-2 rounded-circle"
												/>
												&nbsp;{record.name}
											</td>
											<td>{record.accountNo}</td>
											<td>{record.dob}</td>
											<td align="center">
												<Link to="#" className="text-reset fs-16 px-1">
													{' '}
													<i className="ri-delete-bin-2-line" />
												</Link>
											</td>
										</tr>
									)
								})}
							</tbody>
						</Table>
					</div>
				</Card.Body>
			</Card>
		</>
	)
}

const ResponsiveTable = () => {
	return (
		<>
			<Card>
				<Card.Header>
					<h4 className="header-title">Always responsive</h4>
					<p className="text-muted mb-0">
						Across every breakpoint, use&nbsp;
						<code>.table-responsive</code> for horizontally scrolling tables.
						Use&nbsp;
						<code>{`.table-responsive{-sm|-md|-lg|-xl}`}</code> as needed to
						create responsive tables up to a particular breakpoint. From that
						breakpoint and up, the table will behave normally and not scroll
						horizontally.
					</p>
				</Card.Header>
				<Card.Body>
					<Table responsive className="mb-0">
						<thead>
							<tr>
								<th scope="col">#</th>
								<th scope="col">Heading</th>
								<th scope="col">Heading</th>
								<th scope="col">Heading</th>
								<th scope="col">Heading</th>
								<th scope="col">Heading</th>
								<th scope="col">Heading</th>
								<th scope="col">Heading</th>
								<th scope="col">Heading</th>
								<th scope="col">Heading</th>
							</tr>
						</thead>
						<tbody>
							{(records || []).slice(0, 3).map((record, idx) => {
								return (
									<tr key={idx}>
										<td>{record.id}</td>
										<td>{record.cell}</td>
										<td>{record.cell}</td>
										<td>{record.cell}</td>
										<td>{record.cell}</td>
										<td>{record.cell}</td>
										<td>{record.cell}</td>
										<td>{record.cell}</td>
										<td>{record.cell}</td>
										<td>{record.cell}</td>
									</tr>
								)
							})}
						</tbody>
					</Table>
				</Card.Body>
			</Card>
		</>
	)
}

const BorderlessTable = () => {
	return (
		<>
			<Card>
				<Card.Header>
					<h4 className="header-title">Basic Borderless Example</h4>
					<p className="text-muted mb-0">
						Add <code>.table-borderless</code> for a table without borders.
					</p>
				</Card.Header>
				<Card.Body>
					<div className="table-responsive-sm">
						<Table borderless className="table-centered mb-0">
							<thead>
								<tr>
									<th>Name</th>
									<th>Phone Number</th>
									<th>Date of Birth</th>
									<th>Country</th>
								</tr>
							</thead>
							<tbody>
								{(records || []).map((record, idx) => {
									return (
										<tr key={idx}>
											<td>{record.name}</td>
											<td>{record.phoneNo}</td>
											<td>{record.dob}</td>
											<td>{record.country}</td>
										</tr>
									)
								})}
							</tbody>
						</Table>
					</div>
				</Card.Body>
			</Card>
		</>
	)
}

const BorderlessInverseTable = () => {
	return (
		<>
			<Card>
				<Card.Header>
					<h4 className="header-title">Inverse Borderless table</h4>
					<p className="text-muted mb-0">
						Add <code>.table-borderless</code> for a table without borders.
					</p>
				</Card.Header>
				<Card.Body>
					<div className="table-responsive-sm">
						<Table variant="dark" borderless className="mb-0">
							<thead>
								<tr>
									<th>Name</th>
									<th>Phone Number</th>
									<th>Date of Birth</th>
									<th>Country</th>
								</tr>
							</thead>
							<tbody>
								{(records || []).map((record, idx) => {
									return (
										<tr key={idx}>
											<td>{record.name}</td>
											<td>{record.phoneNo}</td>
											<td>{record.dob}</td>
											<td>{record.country}</td>
										</tr>
									)
								})}
							</tbody>
						</Table>
					</div>
				</Card.Body>
			</Card>
		</>
	)
}

const ActiveTable = () => {
	return (
		<>
			<Card>
				<Card.Header>
					<h4 className="header-title">Active tables</h4>
					<p className="text-muted mb-0">
						Highlight a table row or cell by adding a <code>.table-active</code>{' '}
						class.
					</p>
				</Card.Header>
				<Card.Body>
					<div className="table-responsive-sm">
						<Table className="mb-0">
							<thead>
								<tr>
									<th>Name</th>
									<th>Phone Number</th>
									<th>Date of Birth</th>
									<th>Country</th>
								</tr>
							</thead>
							<tbody>
								{(records || []).map((record, idx) => {
									return (
										<tr
											className={record.activeClass ? record.activeClass : ''}
											key={idx}
										>
											<td>{record.name}</td>
											<td>{record.phoneNo}</td>
											<td>{record.dob}</td>
											<td>{record.country}</td>
										</tr>
									)
								})}
								<tr>
									<td>Risa D. Pearson</td>
									<td>336-508-2157</td>
									<td>July 24, 1950</td>
									<td>Belgium</td>
								</tr>
							</tbody>
						</Table>
					</div>
				</Card.Body>
			</Card>
		</>
	)
}

const NestedTable = () => {
	return (
		<>
			<Card>
				<Card.Header>
					<h4 className="header-title">Nesting</h4>
					<p className="text-muted mb-0">
						Border styles, active styles, and table variants are not inherited
						by nested tables.
					</p>
				</Card.Header>
				<Card.Body>
					<div className="table-responsive-sm">
						<Table striped className="mb-0">
							<thead>
								<tr>
									<th>Name</th>
									<th>Phone Number</th>
									<th>Date of Birth</th>
									<th>Country</th>
								</tr>
							</thead>
							<tbody>
								{(nestedrecords || []).map((record, idx) => {
									return record.children ? (
										<React.Fragment key={idx}>
											<tr>
												<td>{record.name}</td>
												<td>{record.phoneNo}</td>
												<td>{record.dob}</td>
												<td>{record.country}</td>
											</tr>
											<tr key={idx}>
												<td colSpan={4}>
													<Table className="table-sm mb-0">
														<thead>
															<tr>
																<th>Name</th>
																<th>Phone Number</th>
																<th>Date of Birth</th>
																<th>Country</th>
															</tr>
														</thead>
														<tbody>
															{(record.children || []).map((record, idx) => {
																return (
																	<tr key={idx}>
																		<td>{record.name}</td>
																		<td>{record.phoneNo}</td>
																		<td>{record.dob}</td>
																		<td>{record.country}</td>
																	</tr>
																)
															})}
														</tbody>
													</Table>
												</td>
											</tr>
										</React.Fragment>
									) : (
										<tr key={idx}>
											<td>{record.name}</td>
											<td>{record.phoneNo}</td>
											<td>{record.dob}</td>
											<td>{record.country}</td>
										</tr>
									)
								})}
							</tbody>
						</Table>
					</div>
				</Card.Body>
			</Card>
		</>
	)
}

const BasicTables = () => {
	return (
		<>
			<PageBreadcrumb title="Basic Tables" subName="Tables" />
			<Row>
				<Col xl={6}>
					<BasicTable />
				</Col>
				<Col xl={6}>
					<InverseTable />
				</Col>
			</Row>

			<Row>
				<Col xl={6}>
					<StripedRows />
				</Col>
				<Col xl={6}>
					<TableHeadOptions />
				</Col>
			</Row>

			<Row>
				<Col xl={6}>
					<HoverableRows />
				</Col>
				<Col xl={6}>
					<SmallTable />
				</Col>
			</Row>

			<Row>
				<Col xl={6}>
					<BorderedTable />
				</Col>
				<Col xl={6}>
					<BorderedColorTable />
				</Col>
			</Row>

			<Row>
				<Col xs={12}>
					<ResponsiveTable />
				</Col>
			</Row>

			<Row>
				<Col xl={6}>
					<BorderlessTable />
				</Col>
				<Col xl={6}>
					<BorderlessInverseTable />
				</Col>
			</Row>

			<Row>
				<Col xl={6}>
					<ActiveTable />
				</Col>
				<Col xl={6}>
					<NestedTable />
				</Col>
			</Row>
		</>
	)
}

export default BasicTables
