import { Button, Col, Row } from 'react-bootstrap'
import { Navigate, Link } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import AuthLayout from '../AuthLayout'
import useLogin from './useLogin'
import { toast } from 'react-toastify';
// components
import { VerticalForm, FormInput, PageBreadcrumb } from '@/components'
import { useEffect, useState } from 'react'
import config from '@/config'
import axios from 'axios'
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
	const [employeeError, setEmployeeError] = useState<string>('')
	const [verifyEmpID, setVerifyEmpID] = useState(false);
	const { loading, login, redirectUrl, isAuthenticated } = useLogin()

	useEffect(() => {
		localStorage.removeItem('errorMessage');
	}, []);


	const blurfunction = async (emp: any) => {
		if (emp.length > 0) {
			try {
				const response = await axios.get(
					`${config.API_URL_APPLICATION}/Login/GetEmployeeDetailsbyEmpId?Flag=2&EmpID=${emp}`
				);
				if (response.data.isSuccess) {
					setVerifyEmpID(true)
					setEmployeeError('')
				} else {
					setEmployeeError(response.data.message || 'Entered Wrong Emploee ID')
					setVerifyEmpID(false)
				}
			} catch (error: any) {
				toast.dismiss()
				setEmployeeError(error || 'Something went wrong please try again')
				console.error(error)
			}
		} else {
			setEmployeeError('Please Enter Employee ID')
			setVerifyEmpID(false)
		}

	}


	return (
		<>
			<PageBreadcrumb title="Log In" />

			{isAuthenticated && <Navigate to={redirectUrl} replace />}

			<AuthLayout
				authTitle="Sign In"
				helpText="Enter your Employee ID, and then enter Password to access account"
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
						required
						onBlur={(e) => blurfunction(e.target.value)}
						containerClass={!employeeError ? "mb-3 " : "mb-3 input-border"}

					/>
					<FormInput
						label="Password"
						name="password"
						type="password"
						required
						id="password"
						placeholder="Enter your password"
						containerClass="mb-3 position-relative"
					>
						<small className='text-danger  login-error'>{employeeError ? <div className="error-text fs-11">{employeeError}</div> : null} </small>
						<Link to="/auth/forgot-password" className="text-muted float-end">
							<small className='text-danger'>Forgot your Password?</small>
						</Link>
						<p className='password-error'>

							{localStorage.getItem('errorMessage')}
						</p>
					</FormInput>

					<Row className='d-flex jusify-content-between'>
						<Col className='d-flex justify-content-end mb-1 mt-0'>
							<div className='login-help'>
								Help ?
							</div>
						</Col>


					</Row>
					{verifyEmpID ?
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
						</div> :
						<div className="mb-0 text-start">
							<Button
								variant="soft-primary"
								className="w-100"
								disabled={loading}
							>
								<i className="ri-login-circle-fill me-1" />{' '}
								<span className="fw-bold">Log In</span>{' '}
							</Button>
						</div>
					}
				</VerticalForm>
				<div className="position-absolute signup-login-verify fs-11" style={{ borderLeft: 'none', cursor: 'pointer' }} >
					{verifyEmpID ? <i className="ri-checkbox-circle-fill fs-15 text-success "></i> : null}
				</div>
			</AuthLayout>

		</>
	)
}

export default Login
