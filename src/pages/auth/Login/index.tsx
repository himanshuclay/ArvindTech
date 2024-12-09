import { Button, Col, Row } from 'react-bootstrap'
import { Navigate, Link, useLocation } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import AuthLayout from '../AuthLayout'
import useLogin from './useLogin'
import { toast } from 'react-toastify';
// components
import { VerticalForm, FormInput, PageBreadcrumb } from '@/components'
import { useEffect } from 'react'
// import CustomSuccessToast from '@/pages/other/Component/CustomSuccessToast'

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


	const location = useLocation();
	useEffect(() => {
		if (location.state?.successMessage) {
		  toast.success(location.state.successMessage); 
		}
	  }, [location.state]);


	return (
		<>
			<PageBreadcrumb title="Log In" />

			{isAuthenticated && <Navigate to={redirectUrl} replace />}

			<AuthLayout
				authTitle="Sign In"
				helpText="Enter your Employee ID and Password to access account."
				bottomLinks={<BottomLinks />}
				hasThirdPartyLogin
			>
				<VerticalForm<UserData>
					onSubmit={login}
					resolver={schemaResolver}
					defaultValues={{ email: '', password: '' }}
				>
					<FormInput
						label="Employee ID"
						type="text"
						name="email"
						placeholder="Enter Your Employee ID"
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
							<small className='text-danger'>Forgot your Password?</small>
						</Link>
					</FormInput>

					<Row className='d-flex jusify-content-between'>

						<Col>
							<FormInput
								label="Remember me"
								type="checkbox"
								name="checkbox"
								containerClass={'mb-3'}
							/>
						</Col>
						<Col className='d-flex justify-content-end '>
							<div className='login-help'>
								Help ?
							</div>
						</Col>


					</Row>
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
		</>
	)
}

export default Login
