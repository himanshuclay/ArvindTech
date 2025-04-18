import { Container, Image, Row } from 'react-bootstrap'

//images
import maintainance from '@/assets/images/svg/under_maintenance.png'
import { useEffect } from 'react'

const Maintenance = () => {
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
		<div>
			<div className="account-pages pt-2 pt-sm-5 pb-4 pb-sm-5 position-relative">
				<Container>
					<Row className="justify-content-center">
						<div className="col-lg-5 col-md-6 col-12">
							<div className="mb-4">
								<Image fluid src={maintainance} />
							</div>
							<div className="text-center">
								<h2 className="mb-3 text-muted">
									Sorry we are under maintenance
								</h2>
								<p className="text-dark-emphasis fs-15 mb-1">
									Our website currently undergoing maintenance.
								</p>
								<p className="text-dark-emphasis fs-15 mb-4">
									We should be a back shotly. thankyou for patience.
								</p>
							</div>
						</div>
					</Row>
				</Container>
			</div>
			<footer className="footer footer-alt fw-medium">
				<span className="text-dark-emphasis">
					{new Date().getFullYear()} © Clay TechSystem
				</span>
			</footer>
		</div>
	)
}

export default Maintenance
