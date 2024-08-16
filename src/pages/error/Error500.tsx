import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, Col, Container, Image, Row } from 'react-bootstrap'

// components
import { PageBreadcrumb } from '@/components'

//images
import authImg from '@/assets/images/auth-img.jpg'
import logo from '@/assets/images/logo.png'
import logoDark from '@/assets/images/logonew.png'
import errorImg from '@/assets/images/svg/500.svg'

const Error500 = () => {
	useEffect(() => {
		if (document.body) {
			document.body.classList.add('authentication-bg', 'position-relative')
		}
		return () => {
			if (document.body) {
				document.body.classList.remove('authentication-bg', 'position-relative')
			}
		}
	}, [])

	return (
		<>
			<PageBreadcrumb title="Error 500" />
			<div className="account-pages pt-2 pt-sm-5 pb-4 pb-sm-5 position-relative">
				<Container>
					<Row className="justify-content-center">
						<Col xxl={8} lg={10}>
							<Card className="overflow-hidden">
								<Row className="g-0">
									<Col lg={6} className="d-none d-lg-block p-2">
										<Image
											fluid
											src={authImg}
											alt="auth"
											className="rounded h-100"
										/>
									</Col>
									<Col lg={6}>
										<div className="d-flex flex-column h-100">
											<div className="auth-brand p-4">
												<Link to="#" className="logo-light">
													<Image src={logo} alt="logo" height={22} />
												</Link>
												<Link to="#" className="logo-dark">
													<Image src={logoDark} alt="dark logo" height={22} />
												</Link>
											</div>
											<div className="p-4 my-auto">
												<div className="d-flex justify-content-center mb-5">
													<Image fluid src={errorImg} alt="logo" />
												</div>
												<div className="text-center">
													<h1 className="mb-3">500</h1>
													<h4 className="fs-20">Internal server error</h4>
													<p className="text-muted mb-3">
														{' '}
														Why not try refreshing your page? or you can contact{' '}
														<Link to="#" className="text-primary">
															<b>Support</b>
														</Link>
													</p>
												</div>
												<Link to="/" className="btn btn-soft-primary w-100">
													<i className="ri-home-4-line me-1" /> Back to Home
												</Link>
											</div>
										</div>
									</Col>
								</Row>
							</Card>
						</Col>
					</Row>
				</Container>
			</div>
			<footer className="footer footer-alt fw-medium">
				<span className="text-dark-emphasis">
					{new Date().getFullYear()} © Arvindtechno
				</span>
			</footer>
		</>
	)
}

export default Error500
