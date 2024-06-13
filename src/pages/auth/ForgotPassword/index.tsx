import { Button, Col, Row } from 'react-bootstrap'
import AuthLayout from '../AuthLayout'
import { Link } from 'react-router-dom'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import useRecoverPassword from './useRecoverPassword'

// components
import { FormInput, VerticalForm, PageBreadcrumb } from '@/components'

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
interface UserData {
	email: string
}

const ForgotPassword = () => {
	/*
	 * form validation schema
	 */
	const schemaResolver = yupResolver(
		yup.object().shape({
			email: yup
				.string()
				.email('Please enter a valid email')
				.required('Please enter email'),
		})
	)

	/*
	 * handle form submission
	 */
	const { loading, onSubmit } = useRecoverPassword()
	return (
		<div>
			<PageBreadcrumb title="Forgot Password" />
			<AuthLayout
				authTitle="Forgot Password?"
				helpText="Enter your email address and we'll send you an email with instructions to reset your password."
				bottomLinks={<BottomLink />}
			>
				<VerticalForm<UserData> onSubmit={onSubmit} resolver={schemaResolver}>
					<FormInput
						label="Email address"
						type="email"
						name="email"
						placeholder="Enter your email"
						containerClass="mb-3"
						required
					/>
					<div className="mb-0 text-start">
						<Button
							variant="soft-primary"
							className="w-100"
							type="submit"
							disabled={loading}
						>
							<i className="ri-loop-left-line me-1 fw-bold" />{' '}
							<span className="fw-bold">Reset Password</span>{' '}
						</Button>
					</div>
				</VerticalForm>
			</AuthLayout>
		</div>
	)
}

export default ForgotPassword
