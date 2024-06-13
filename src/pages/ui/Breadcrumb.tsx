import {
	Row,
	Col,
	Card,
	Breadcrumb as BreadcrumbBootstrap,
} from 'react-bootstrap'
import { Link } from 'react-router-dom'

// component
import { PageBreadcrumb } from '@/components'

const Breadcrumb = () => {
	return (
		<>
			<PageBreadcrumb title="Breadcrumb" subName="Base UI" />
			<Row>
				<Col xl={12}>
					<Card>
						<Card.Header>
							<h4 className="header-title">Example</h4>
							<p className="text-muted mb-0">
								Indicate the current page&apos;s location within a navigational
								hierarchy that automatically adds separators via CSS. Please
								read the official{' '}
								<Link
									target="_blank"
									to="https://getbootstrap.com/docs/5.3/components/breadcrumb/"
								>
									Bootstrap
								</Link>{' '}
								documentation for more options.
							</p>
						</Card.Header>
						<Card.Body>
							<nav aria-label="breadcrumb">
								<ol className="breadcrumb mb-0 py-2">
									<BreadcrumbBootstrap.Item className="active">
										Home
									</BreadcrumbBootstrap.Item>
								</ol>
							</nav>

							<nav aria-label="breadcrumb">
								<ol className="breadcrumb mb-0 py-2">
									<BreadcrumbBootstrap.Item href="#">
										Home
									</BreadcrumbBootstrap.Item>
									<li className="breadcrumb-item active" aria-current="page">
										Library
									</li>
								</ol>
							</nav>

							<nav aria-label="breadcrumb">
								<ol className="breadcrumb mb-0 py-2">
									<BreadcrumbBootstrap.Item href="#">
										Home
									</BreadcrumbBootstrap.Item>
									<BreadcrumbBootstrap.Item href="#">
										Library
									</BreadcrumbBootstrap.Item>
									<li className="breadcrumb-item active" aria-current="page">
										Data
									</li>
								</ol>
							</nav>
						</Card.Body>
					</Card>
				</Col>
				<Col xl={12}>
					<Card>
						<Card.Header>
							<h4 className="header-title">With Icons</h4>
							<p className="text-muted mb-0">
								Optionally you can also specify the icon with your breadcrumb
								item.
							</p>
						</Card.Header>
						<Card.Body>
							<nav aria-label="breadcrumb">
								<ol className="breadcrumb mb-1 p-2 bg-light-subtle">
									<li className="breadcrumb-item active" aria-current="page">
										<i className="ri-home-4-line me-1" />
										Home
									</li>
								</ol>
							</nav>

							<nav aria-label="breadcrumb">
								<ol className="breadcrumb mb-1 p-2 bg-light-subtle">
									<BreadcrumbBootstrap.Item href="#">
										<i className="ri-home-4-line" /> Home
									</BreadcrumbBootstrap.Item>
									<li className="breadcrumb-item active" aria-current="page">
										Library
									</li>
								</ol>
							</nav>

							<nav aria-label="breadcrumb">
								<ol className="breadcrumb mb-0 p-2 bg-light-subtle">
									<BreadcrumbBootstrap.Item href="#">
										<i className="ri-home-4-line" /> Home
									</BreadcrumbBootstrap.Item>
									<BreadcrumbBootstrap.Item href="#">
										Library
									</BreadcrumbBootstrap.Item>
									<li className="breadcrumb-item active" aria-current="page">
										Data
									</li>
								</ol>
							</nav>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	)
}

export default Breadcrumb
