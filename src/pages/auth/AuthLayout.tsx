import React, { ReactNode, useEffect } from 'react'

//images
// import authImg from '@/assets/images/auth-img.jpg'
import logo from '@/assets/images/Clayimage.png'
import logoDark from '@/assets/images/Clayimage.png'

import { Card, Col, Container, Image, Row } from 'react-bootstrap'
// import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom';

interface AccountLayoutProps {
	pageImage?: string
	authTitle?: string
	helpText?: string
	bottomLinks?: ReactNode
	isCombineForm?: boolean
	children?: ReactNode
	hasForm?: boolean
	hasThirdPartyLogin?: boolean
	userImage?: string
	starterClass?: boolean
}

const AuthLayout = ({
	authTitle,
	helpText,
	bottomLinks,
	children,
	hasThirdPartyLogin,
	userImage,
	starterClass,
}: AccountLayoutProps) => {
	const location = useLocation();
	const isRegisterRoute = location.pathname === '/auth/register';
	const isforgotpasswordRoute = location.pathname === '/auth/forgot-password';
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
		<div className="authentication-bg position-relative">
			<div className="account-pages pt-2 pt-sm-5 pb-4 pb-sm-5 position-relative">
				<Container>
					<Row className="justify-content-center">
						<Col
							xxl={isRegisterRoute || isforgotpasswordRoute ? 6 : 4}
							lg={isRegisterRoute || isforgotpasswordRoute ? 6 : 4}
						>

							<Card className="overflow-hidden">
								<Row className="g-0">
									{/* <Col lg={6} className="d-none d-lg-block p-2">
										<Image
											src={authImg}
											alt=""
											className="img-fluid rounded h-100"
										/>
									</Col> */}
									<Col lg={12}>
										<div className="d-flex flex-column h-100">
											<div className="auth-brand px-4 pt-2 d-flex justify-content-center">
												<a href="index.html" className="logo-light">
													<Image src={logo} alt="logo" height="62" />
												</a>
												<a href="index.html" className="logo-dark">
													<Image src={logoDark} alt="dark logo" height="62" />
												</a>
											</div>
											<div
												className={`p-4 my-auto ${starterClass ? 'text-center' : ''
													}`}
											>
												{userImage ? (
													<div className="text-center w-75 m-auto">
														<Image
															src={userImage}
															height={64}
															alt="user-image"
															className="rounded-circle img-fluid img-thumbnail avatar-xl"
														/>
														<h4 className="text-center mt-3 fw-bold fs-20">
															{authTitle}{' '}
														</h4>
														<p className="text-muted mb-4">{helpText}</p>
													</div>
												) : (
													<React.Fragment>
														<h4 className="fs-20">{authTitle}</h4>
														<p className="text-muted mb-3">{helpText}</p>
													</React.Fragment>
												)}

												{children}
											</div>
										</div>
									</Col>
								</Row>
							</Card>
						</Col>
					</Row>
					{bottomLinks}
				</Container>
			</div>
			<footer className="footer footer-alt fw-medium">
				<span className="text-dark">
					{new Date().getFullYear()} ©  Clay TechSystem
				</span>
			</footer>
		</div>
	)
}

export default AuthLayout
