import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

// components
import AuthLayout from '../AuthLayout'
import { VerticalForm, FormInput, PageBreadcrumb } from '@/components'

// images
import { User } from '@/types'

interface UserData {
	password: string
}
const BottomLink = () => {
	return (
		<Row>
			<Col xs={12} className="text-center">
				<p className="text-dark-emphasis">
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
const LockScreen = () => {
	/*
	 * form validation schema
	 */
	const schemaResolver = yupResolver(
		yup.object().shape({
			password: yup.string().required('Please enter Password'),
		})
	)

	/*
	 * handle form submission
	 */
	const onSubmit = ({ data }: any) => {
		const user: User = data
		console.log(user)
	}
	return (
		<>
			<PageBreadcrumb title="Lock Screen" />
			<AuthLayout
				authTitle="Hi ! Thomson"
				helpText="Enter your password to access the admin."
				starterClass
				bottomLinks={<BottomLink />}
				hasThirdPartyLogin
			>
				<VerticalForm<UserData> onSubmit={onSubmit} resolver={schemaResolver}>
					<FormInput
						label="Password"
						type="password"
						name="password"
						labelContainerClassName="text-start"
						placeholder="Enter your password"
						containerClass="mb-3"
					/>
					<div className="mb-0 text-start">
						<Button variant="soft-primary" className="w-100" type="submit">
							<i className="ri-login-circle-fill me-1" />{' '}
							<span className="fw-bold">Log In</span>{' '}
						</Button>
					</div>
				</VerticalForm>
			</AuthLayout>
		</>
	)
}

export default LockScreen
