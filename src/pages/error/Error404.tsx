import { Link } from 'react-router-dom'
import { Col, Container, Image, Row } from 'react-bootstrap'
// components
import { PageBreadcrumb } from '@/components'
import { useEffect } from 'react'

//images
import authImg from '@/assets/images/auth-img.jpg'
import logo from '@/assets/images/logo.png'
import logoDark from '@/assets/images/logonew.png'
import errorImg from '@/assets/images/svg/404.svg'

const Error404 = () => {
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
			<PageBreadcrumb title="Error 404" />
			<div className="account-pages pt-2 pt-sm-5 pb-4 pb-sm-5 position-relative">
				<Container>
					<Row className="justify-content-center">
						<div className="col-xxl-8 col-lg-10">
							<div className="card overflow-hidden">
								<Row className="g-0">
									<Col lg={6} className="d-none d-lg-block p-2">
										<Image src={authImg} fluid className="rounded h-100" />
									</Col>
									<div className="col-lg-6">
										<div className="d-flex flex-column h-100">
											<div className="auth-brand p-4">
												<Link to="/" className="logo-light">
													<Image src={logo} alt="logo" height={22} />
												</Link>
												<Link to="index.html" className="logo-dark">
													<img src={logoDark} alt="dark logo" height={22} />
												</Link>
											</div>
											<div className="p-4 my-auto">
												<div className="d-flex justify-content-center mb-5">
													<Image src={errorImg} className="img-fluid" />
												</div>
												<div className="text-center">
													<h1 className="mb-3">404</h1>
													<h4 className="fs-20">Page not found</h4>
													<p className="text-muted mb-3">
														{' '}
														It's looking like you may have taken a wrong turn.
														Don't worry... it happens to the best of us.
													</p>
												</div>
												<Link to="/" className="btn btn-soft-primary w-100">
													<i className="ri-home-4-line me-1" /> Back to Home
												</Link>
											</div>
										</div>
									</div>
								</Row>
							</div>
						</div>
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

export default Error404
