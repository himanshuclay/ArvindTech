import { Button, Col, Row } from 'react-bootstrap'
import { Navigate, Link } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import AuthLayout from '../AuthLayout'
import useLogin from './useLogin'

// components
import { VerticalForm, FormInput, PageBreadcrumb } from '@/components'

interface UserData {
	email: string
	password: string
}

const BottomLinks = () => {
	return (
		<Row>
			<Col xs={12} className="text-center">
				<p className="text-dark-emphasis">
					Don't have an account?{' '}
					<Link
						to="/auth/register"
						className="text-dark fw-bold ms-1 link-offset-3 text-decoration-underline"
					>
						<b>Sign up</b>
					</Link>
				</p>
			</Col>
		</Row>
	)
}

const schemaResolver = yupResolver(
	yup.object().shape({
		email: yup.string().required('Please enter Username'),
		password: yup.string().required('Please enter Password'),
	})
)
const Login = () => {
	const { loading, login, redirectUrl, isAuthenticated } = useLogin()
	return (
		<>
			<PageBreadcrumb title="Log In" />

			{isAuthenticated && <Navigate to={redirectUrl} replace />}

			<AuthLayout
				authTitle="Sign In"
				helpText="Enter your email address and password to access account."
				bottomLinks={<BottomLinks />}
				hasThirdPartyLogin
			>
				<VerticalForm<UserData>
					onSubmit={login}
					resolver={schemaResolver}
					defaultValues={{ email: 'LLP03223', password: '3223ATELLP' }}
				>
					<FormInput
						label="Employee ID"
						type="text"
						name="email"
						placeholder="Enter Your Email Id"
						containerClass="mb-3"
						required
					/>
					<FormInput
						label="Password"
						name="password"
						type="password"
						required
						id="password"
						placeholder="Enter your password"
						containerClass="mb-3"
					>
						<Link to="/auth/forgot-password" className="text-muted float-end">
							<small>Forgot your password?</small>
						</Link>
					</FormInput>
					<FormInput
						label="Remember me"
						type="checkbox"
						name="checkbox"
						containerClass={'mb-3'}
					/>
					<div className="mb-0 text-start">
						<Button
							variant="soft-primary"
							className="w-100"
							type="submit"
							disabled={loading}
						>
							<i className="ri-login-circle-fill me-1" />{' '}
							<span className="fw-bold">Log In</span>{' '}
						</Button>
					</div>
				</VerticalForm>
			</AuthLayout>
			<BottomLinks></BottomLinks>
		</>
	)
}

export default Login
