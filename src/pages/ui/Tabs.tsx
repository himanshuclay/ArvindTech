import { Card, Col, Nav, Row, Tab } from 'react-bootstrap'
import { Link } from 'react-router-dom'

// component
import { PageBreadcrumb } from '@/components'

interface TabContentItem {
	id: string
	// icon: string;
	title: string
	text: string
	text2: string
}
const Tabs = () => {
	const tabContents: TabContentItem[] = [
		{
			id: '1',
			title: 'Home',
			text: 'Home-Food truck quinoa dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.',
			text2:
				'Home-Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt.Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim.',
		},
		{
			id: '2',
			title: 'Profile',
			text: 'Profile-Food truck quinoa dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.',
			text2:
				'Profile-Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt.Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim.',
		},
		{
			id: '3',
			title: 'Settings',
			text: 'Setting-Food truck quinoa dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.',
			text2:
				'Setting-Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt.Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim.',
		},
	]
	return (
		<>
			<PageBreadcrumb title="Tabs" subName="Base UI" />
			<Row>
				<Col xl={6}>
					<Card>
						<Card.Header>
							<h4 className="header-title">Default Tabs</h4>
							<p className="text-muted mb-0">
								Simple widget of tabbable panes of local content.
							</p>
						</Card.Header>
						<Card.Body>
							<Tab.Container defaultActiveKey="Profile">
								<Nav variant="tabs" role="tablist" className="mb-3">
									{(tabContents || []).map((tab, idx) => {
										return (
											<Nav.Item as="li" role="presentation" key={idx}>
												<Nav.Link as={Link} to="#" eventKey={tab.title}>
													<span className="d-none d-md-block">{tab.title}</span>
												</Nav.Link>
											</Nav.Item>
										)
									})}
								</Nav>
								<Tab.Content>
									{(tabContents || []).map((tab, idx) => {
										return (
											<Tab.Pane eventKey={tab.title} id={tab.id} key={idx}>
												<Row>
													<Col sm="12">
														<p>{tab.text}</p>
														<p className="mb-0">{tab.text2}</p>
													</Col>
												</Row>
											</Tab.Pane>
										)
									})}
								</Tab.Content>
							</Tab.Container>
						</Card.Body>
					</Card>
				</Col>

				<Col xl={6}>
					<Card>
						<Card.Header>
							<h4 className="header-title">Tabs Justified</h4>
							<p className="text-muted mb-0">
								Using class <code>.nav-justified</code>, you can force your{' '}
								<code>tab menu items</code> to use the full available width.
							</p>
						</Card.Header>
						<Card.Body>
							<Tab.Container defaultActiveKey="Profile">
								<Nav variant="pills" justify className="bg-nav-pills mb-3">
									{(tabContents || []).map((tab, idx) => {
										return (
											<Nav.Item as="li" key={idx}>
												<Nav.Link as={Link} to="#" eventKey={tab.title}>
													{tab.title}
												</Nav.Link>
											</Nav.Item>
										)
									})}
								</Nav>

								<Tab.Content>
									{(tabContents || []).map((tab, idx) => {
										return (
											<Tab.Pane eventKey={tab.title} id={tab.id} key={idx}>
												<Row>
													<Col sm="12">
														<p>{tab.text}</p>
														<p className="mb-0">{tab.text2}</p>
													</Col>
												</Row>
											</Tab.Pane>
										)
									})}
								</Tab.Content>
							</Tab.Container>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xl={6}>
					<Card>
						<Card.Header>
							<h4 className="header-title">Tabs Vertical Left</h4>
							<p className="text-muted mb-0">
								You can stack your navigation by changing the flex item
								direction with the <code>.flex-column</code> utility.
							</p>
						</Card.Header>
						<Card.Body>
							<Row>
								<Tab.Container defaultActiveKey="Profile">
									<Col sm={3} mb={2} className="mb-sm-0">
										<Nav variant="pills" className="flex-column">
											{(tabContents || []).map((tab, idx) => {
												return (
													<Nav.Item as="li" key={idx}>
														<Nav.Link as={Link} to="#" eventKey={tab.title}>
															{tab.title}
														</Nav.Link>
													</Nav.Item>
												)
											})}
										</Nav>
									</Col>

									<Col sm={9}>
										<Tab.Content>
											{(tabContents || []).map((tab, idx) => {
												return (
													<Tab.Pane eventKey={tab.title} id={tab.id} key={idx}>
														<Row>
															<Col sm="12">
																<p className="mb-0">{tab.text}</p>
															</Col>
														</Row>
													</Tab.Pane>
												)
											})}
										</Tab.Content>
									</Col>
								</Tab.Container>
							</Row>
						</Card.Body>
					</Card>
				</Col>

				<Col xl={6}>
					<Card>
						<Card.Header>
							<h4 className="header-title">Tabs Vertical Right</h4>
							<p className="text-muted mb-0">
								You can stack your navigation by changing the flex item
								direction with the <code>.flex-column</code> utility.
							</p>
						</Card.Header>
						<Card.Body>
							<Row>
								<Tab.Container defaultActiveKey="Profile">
									<Col sm={9}>
										<Tab.Content>
											{(tabContents || []).map((tab, idx) => {
												return (
													<Tab.Pane eventKey={tab.title} id={tab.id} key={idx}>
														<Row>
															<Col sm="12">
																<p className="mb-0">{tab.text2}</p>
															</Col>
														</Row>
													</Tab.Pane>
												)
											})}
										</Tab.Content>
									</Col>

									<Col sm={3} mb={2} className="mb-sm-0">
										<Nav variant="pills" className="flex-column">
											{(tabContents || []).map((tab, idx) => {
												return (
													<Nav.Item as="li" key={idx}>
														<Nav.Link as={Link} to="#" eventKey={tab.title}>
															{tab.title}
														</Nav.Link>
													</Nav.Item>
												)
											})}
										</Nav>
									</Col>
								</Tab.Container>
							</Row>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xl={6}>
					<Card>
						<Card.Header>
							<h4 className="header-title">Tabs Bordered</h4>
							<p className="text-muted mb-0">
								The navigation item can have a simple bottom border as well.
								Just specify the class <code>.nav-bordered</code>.
							</p>
						</Card.Header>
						<Card.Body>
							<Tab.Container defaultActiveKey="Profile">
								<Nav variant="tabs" className="nav-bordered" as="ul">
									{(tabContents || []).map((tab, idx) => {
										return (
											<Nav.Item key={idx} as="li">
												<Nav.Link as={Link} to="#" eventKey={tab.title}>
													<span className="d-none d-md-block">{tab.title}</span>
												</Nav.Link>
											</Nav.Item>
										)
									})}
								</Nav>

								<Tab.Content>
									{(tabContents || []).map((tab, idx) => {
										return (
											<Tab.Pane eventKey={tab.title} id={tab.id} key={idx}>
												<Row>
													<p className="mt-3">{tab.text}</p>
													<p className="mb-0">{tab.text2}</p>
												</Row>
											</Tab.Pane>
										)
									})}
								</Tab.Content>
							</Tab.Container>
						</Card.Body>
					</Card>
				</Col>

				<Col xl={6}>
					<Card>
						<Card.Header>
							<h4 className="header-title">Tabs Bordered Justified</h4>
							<p className="text-muted mb-0">
								The navigation item with a simple bottom border and justified
							</p>
						</Card.Header>
						<Card.Body>
							<Tab.Container defaultActiveKey="Profile">
								<Nav variant="tabs" justify className="nav-bordered" as="ul">
									{(tabContents || []).map((tab, idx) => {
										return (
											<Nav.Item key={idx} as="li">
												<Nav.Link as={Link} to="#" eventKey={tab.title}>
													<span className="d-none d-md-block">{tab.title}</span>
												</Nav.Link>
											</Nav.Item>
										)
									})}
								</Nav>

								<Tab.Content>
									{(tabContents || []).map((tab, idx) => {
										return (
											<Tab.Pane eventKey={tab.title} id={tab.id} key={idx}>
												<Row>
													<Col sm="12">
														<p className="mt-3">{tab.text}</p>
														<p className="mb-0">{tab.text2}</p>
													</Col>
												</Row>
											</Tab.Pane>
										)
									})}
								</Tab.Content>
							</Tab.Container>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	)
}

export default Tabs
