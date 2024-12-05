import { Button, Col, Form, Row } from 'react-bootstrap'
import AuthLayout from '../AuthLayout'
import { Link, useNavigate } from 'react-router-dom'
import { FormInput, VerticalForm, PageBreadcrumb } from '@/components'
import { useEffect, useState } from 'react'
import config from '@/config';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_green.css';
import axios from 'axios';




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
	empID: string;
	fullname: string;
	mobileNumber: string;
	joiningDate: string;
	dob: string;
	password: string;
	confirmpassword: string;
	role: string;
}

const ForgotPassword = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [verifyDoj, setVerifyDoj] = useState(false);
	const [verifyDob, setVerifyDob] = useState(false);
	const [formData, setFormData] = useState<UserData>({
		empID: '',
		fullname: '',
		mobileNumber: '',
		joiningDate: '',
		dob: '',
		password: '',
		confirmpassword: '',
		role: 'EMPLOYEE',
	});



	const fetchEmployeeDetails = async (empID: string) => {
		if (!empID) return; // Prevent fetching if empID is empty
		try {
			const response = await axios.get(
				`${config.API_URL_APPLICATION}/Login/GetEmployeeDetailsbyEmpId?EmpID=${empID}`
			);
			if (response.data.isSuccess) {
				const details = response.data.fetchDetails[0];
				console.log(details)
				setFormData({
					...formData,
					fullname: details.employeeName,
					role: details.role,
				});
			}
		} catch (error) {
			console.error('Error fetching employee details:', error);
		}
	};


	const verifyDOJ = async (empID: string, joiningDate: string) => {
		if (!empID || !joiningDate) return; // Prevent API call if empID or joiningDate is empty

		try {
			const response = await axios.post(`${config.API_URL_APPLICATION}/Login/VerifyJoiningDate`, null, {
				params: { EmpID: empID, Input: joiningDate, }
			});
			if (response.data.isSuccess) {
				console.log('Date is verified:', response.data.message);
				setVerifyDoj(true);
			} else {
				console.warn('Verification failed:', response.data.message);
				setVerifyDoj(false);
				setFormData({
					...formData,
					joiningDate: '',
				});
				alert('Enter Valid Employee ID or Date of Joining')

			}
		} catch (error) {
			console.error('Error verifying the joining date:', error);
		}
	};

	const verifyDOB = async (empID: string, dob: string) => {
		if (!empID || !dob) return; // Prevent API call if empID or joiningDate is empty

		try {
			const response = await axios.post(`${config.API_URL_APPLICATION}/Login/VerifyDOB`, null, {
				params: { EmpID: empID, Input: dob, }
			});
			if (response.data.isSuccess) {
				console.log('Date od Birth is verified:', response.data.message);
				setVerifyDob(true);
			} else {
				console.warn('Verification failed:', response.data.message);
				setVerifyDob(false);
				setFormData({
					...formData,
					dob: '',
				});
				alert('Enter Valid Employee ID or Date of Birth')
			}
		} catch (error) {
			console.error('Error verifying the joining date:', error);
		}
	};



	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		setLoading(true);

		if (formData.password === formData.confirmpassword) {

			try {
				const postData = {
					empID: formData.empID,
					empName: formData.fullname,
					joiningDate: formData.joiningDate,
					dob: formData.dob,
					password: formData.password,
				};

				console.log(postData)

				const response = await axios.post(
					`${config.API_URL_APPLICATION}/Login/UpdateLoginData`,
					postData,
					{
						headers: {
							'Content-Type': 'application/json',
						},
					}
				);

				// Check the response
				if (response.status === 200) {
					console.log('Registration successful:', response.data);
					navigate('/auth/login');
				} else {
					console.error('Registration failed:', response);
				}
			} catch (error) {
				console.error('Error during registration:', error);
			} finally {
				setLoading(false);
			}
		}
		else{
			alert('Passwords do not match!');

		}
	};


	useEffect(() => {
		const delayDebounceFn = setTimeout(() => {
			if (formData.empID) {
				fetchEmployeeDetails(formData.empID);
			}
		}, 500);

		return () => clearTimeout(delayDebounceFn);
	}, [formData.empID]);


	return (
		<div>
			<PageBreadcrumb title="Forgot Password" />
			<AuthLayout
				authTitle="Forgot Password?"
				helpText="Enter your email address and we'll send you an email with instructions to reset your password."
				bottomLinks={<BottomLink />}
			>
				<VerticalForm<UserData> onSubmit={onSubmit}>

					<Row>
						<Col>
							<FormInput
								label="Employee ID"
								type="text"
								name="empID"
								placeholder="Enter your Employee ID"
								value={formData.empID}
								onChange={handleInputChange}
								containerClass="mb-3"
								required
							/>
						</Col>
						<Col>
							<FormInput
								label="Full Name"
								type="text"
								name="fullname"
								placeholder="Your name"
								value={formData.fullname}
								onChange={handleInputChange}
								containerClass="mb-3"
								readOnly
								disabled
							/>
						</Col>
					</Row>


					<Row>
						<Col lg={6} className="position-relative">
							<Form.Group controlId="joiningDate" className="mb-3">
								<Form.Label>Date of Joining</Form.Label>
								<Flatpickr
									value={formData.joiningDate || ''}
									onChange={([date]) => {
										if (date) {
											const formattedDate = date.toLocaleDateString('en-CA'); 
											setFormData({
												...formData,
												joiningDate: formattedDate,
											});
										}
									}}
									options={{
										enableTime: false,
										dateFormat: "Y-m-d", 
									}}
									placeholder="yyyy-MM-dd"
									className="form-control"
									required
								/>
							</Form.Group>


							{formData.joiningDate ?
								<div
									className="position-absolute signup-verify fs-11"
									onClick={() => {
										if (!formData.empID) {
											alert('Please enter Employee ID before verifying.');
										} else {
											verifyDOJ(formData.empID, formData.joiningDate);
										}
									}}
									style={{ borderLeft: 'none', cursor: 'pointer' }}
								>
									{verifyDoj ? <i className="ri-checkbox-circle-fill fs-15 text-success"></i> : 'Verify'}
								</div> : null
							}
						</Col>

						<Col lg={6} className='position-relative'>
							<Form.Group controlId="dob" className="mb-3">
								<Form.Label>Date of Birth</Form.Label>
								<Flatpickr
									value={formData.dob || ''}
									onChange={([date]) => {
										if (date) {
											const formattedDate =date.toLocaleDateString('en-CA'); 
											setFormData({
												...formData,
												dob: formattedDate,
											});
										}
									}}
									options={{
										enableTime: false,
										dateFormat: "Y-m-d",
										time_24hr: false,
									}}
									placeholder="yyyy-MM-dd"
									className="form-control"
									required
								/>
							</Form.Group>
							{formData.dob ?
								<div
									className="position-absolute signup-verify fs-11"
									onClick={() => {
										if (!formData.empID) {
											alert('Please enter Employee ID before verifying.');
										} else {
											verifyDOB(formData.empID, formData.dob);
										}
									}}
									style={{ borderLeft: 'none', cursor: 'pointer' }}
								>
									{verifyDob ? <i className="ri-checkbox-circle-fill fs-15 text-success"></i> : 'Verify'}
								</div> : null
							}
						</Col>
					</Row>


					<Row>
						<Col lg={6}>
							<Form.Group controlId="password" className="mb-3">
								<Form.Label>Password</Form.Label>
								<Form.Control
									type="password"
									name="password"
									value={formData.password}
									onChange={handleInputChange}
									required
									placeholder='Enter Password'
								/>
							</Form.Group>
						</Col>
						<Col lg={6}>
							<FormInput
								label="Confirm Password"
								type="text"
								name="confirmpassword"
								placeholder="Enter Confirm Password"
								value={formData.confirmpassword}
								onChange={handleInputChange}
								containerClass="mb-3"
							/>
						</Col>
					</Row>






					<div className="mb-0 d-grid text-center">
						{formData.empID &&
							formData.fullname &&
							formData.joiningDate &&
							formData.dob &&
							formData.password &&
							verifyDob &&
							verifyDoj ?

							<Button variant="primary" className="fw-semibold" type="submit" disabled={loading}>
								Reset Password
							</Button>
							:
							<Button variant="primary" className="fw-semibold" type="submit" disabled>
								Reset Password
							</Button>

						}
					</div>
				</VerticalForm>
			</AuthLayout>
		</div>
	)
}

export default ForgotPassword
