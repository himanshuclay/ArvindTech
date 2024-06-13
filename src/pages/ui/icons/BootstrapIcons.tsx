import { Card, Col, Row } from 'react-bootstrap'

// data
import { bootstrapIconsList } from './data'

// component
import { PageBreadcrumb } from '@/components'

const BootstrapIcons = () => {
	return (
		<>
			<PageBreadcrumb title="Bootstrap Icons" subName="Icons" />
			<Row>
				<Col>
					<Card>
						<Card.Body>
							<Card.Title as="h5">Icons</Card.Title>
							<p className="text-muted mb-2">
								Use class{' '}
								<code>&lt;i class=&quot;bi bi-123&quot;&gt;&lt;/i&gt;</code>
							</p>
							<Row className="icons-list-demo" id="bootstrap-icons">
								{(bootstrapIconsList || []).map((icon, idx) => {
									return (
										<Col key={idx} sm={6} md={4} lg={3}>
											<div className="icon-item d-flex align-items-center">
												<i className={`bi bi-${icon} fs-20 me-3`} />{' '}
												<span>{icon}</span>
											</div>
										</Col>
									)
								})}
							</Row>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	)
}

export default BootstrapIcons
