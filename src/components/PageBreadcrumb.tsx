import { ReactNode } from 'react'
import { Breadcrumb, Col, Row } from 'react-bootstrap'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'

interface PageTitleProps {
	subName?: string
	title: string
	addedChild?: ReactNode
}
const PageBreadcrumb = ({ subName, title, addedChild }: PageTitleProps) => {
	return (
		<>
			<Helmet>
				<title>
					{title} | Velonic React - Bootstrap 5 Admin & Dashboard Template
				</title>
			</Helmet>
			{subName && (
				<Row>
					<Col xs={12}>
						<div className="page-title-box">
							<div className="page-title-right">
								<ol className="breadcrumb m-0 ">
									<Link
										to="/"
										style={{ color: '#6C757D' }}
										className="breadcrumb-item"
									>
										Velonic
									</Link>
									<Breadcrumb.Item>{subName}</Breadcrumb.Item>
									<Breadcrumb.Item active>{title}</Breadcrumb.Item>
								</ol>
							</div>
							<h4 className="page-title">{title}</h4>
							{addedChild}
						</div>
					</Col>
				</Row>
			)}
		</>
	)
}

export default PageBreadcrumb
