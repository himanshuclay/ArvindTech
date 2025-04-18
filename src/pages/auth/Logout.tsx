import { Col, Image, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthContext } from '@/common'
import AuthLayout from './AuthLayout'

// images
import shield from '@/assets/images/svg/shield.gif'

// components
import { PageBreadcrumb } from '@/components'

const Logout = () => {
	const { removeSession } = useAuthContext()

	useEffect(() => {
		removeSession()
	}, [removeSession])

	const BottomLink = () => {
		return (
			<Row>
				<Col xs={12} className="text-center">
					<p className="text-dark-emphasis mt-2">
						Back To{' '}
						<Link
							to="/auth/login"
							className="text-dark fw-bold ms-1 link-offset-3 text-decoration-underline"
						>
							<b>Log In</b>
						</Link>
					</p>
				</Col>
			</Row>
		)
	}

	return (
		<>
			<PageBreadcrumb title="Logout" />
			<AuthLayout
				authTitle="See You Again !"
				helpText="You are now successfully sign out."
				bottomLinks={<BottomLink />}
				starterClass
			>
				<div className="logout-icon m-auto">
					<Image fluid src={shield} alt="" className='w-50' />
				</div>
			</AuthLayout>
		</>
	)
}

export default Logout
