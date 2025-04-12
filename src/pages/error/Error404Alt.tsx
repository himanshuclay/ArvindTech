import { Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

// components
import { PageBreadcrumb } from '@/components'

const Error404Alt = () => {
	return (
		<>
			<PageBreadcrumb title="Error 404 Alt" subName="Pages" />
			<Row className="justify-content-center items">
				<Col xs={12}>
					<div className="d-flex flex-column h-100">
						<Row className="justify-content-center">
							<Col lg={4}>
								<div className="text-center">
									<h1 className="text-error mb-4">404</h1>
									<h2 className="text-uppercase text-danger mt-3">
										Page Not Found
									</h2>
									<p className="text-muted mt-3">
										It's looking like you may have taken a wrong turn. Don't
										worry... it happens to the best of us. Here's a little tip
										that might help you get back on track.
									</p>

									<Link className="btn btn-soft-danger mt-3" to="/">
										<i className="ri-home-4-line me-1"></i> Back to Home
									</Link>
								</div>
							</Col>
						</Row>
					</div>
				</Col>
			</Row>
		</>
	)
}

export default Error404Alt
