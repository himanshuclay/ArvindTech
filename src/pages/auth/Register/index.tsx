import { Button, Col, Form, Row } from 'react-bootstrap';
import AuthLayout from '../AuthLayout';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { VerticalForm, FormInput, PageBreadcrumb } from '@/components';
import config from '@/config';
import Flatpickr from 'react-flatpickr';
import { toast } from 'react-toastify';
import 'flatpickr/dist/themes/material_green.css';
import 'react-toastify/dist/ReactToastify.css';

interface UserData {
	empID: string;
	fullname: string;
	mobileNumber: string;
	joiningDate: string;
	dob: string;
	password: string;
	role: string;
}

const BottomLink = () => (
	<Row>
		<Col xs={12} className="text-center">
			<p className="text-dark-emphasis">
				Already have an account?{' '}
				<Link to="/auth/login" className="text-dark fw-bold ms-1 link-offset-3 text-decoration-underline">
					<b>Log In</b>
				</Link>
			</p>
		</Col>
	</Row>
);

const Register = () => {
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [verifyDoj, setVerifyDoj] = useState(false);
	const [verifyDob, setVerifyDob] = useState(false);
	const [verifyEmpID, setVerifyEmpID] = useState(false);
	const [formData, setFormData] = useState<UserData>({
		empID: '',
		fullname: '',
		mobileNumber: '',
		joiningDate: '',
		dob: '',
		password: '',
		role: 'EMPLOYEE',
	});

	const [isMobileVerified, setIsMobileVerified] = useState(false);
	const [isErrorShown, setIsErrorShown] = useState(false);
	const [dateOBError, setDateOBError] = useState('');
	const [dateOJError, setDateOJError] = useState('');
	const [empIdError, setEmpIdError] = useState('');
	const [mobileError, setMobileError] = useState('');
	const [submitMobileError, setSubmitMobileError] = useState('');

	const fetchEmployeeDetails = async (empID: string) => {
		try {
			const response = await axios.get(
				`${config.API_URL_APPLICATION}/Login/GetEmployeeDetailsbyEmpId?Flag=1&EmpID=${empID}`
			);
			if (response.data.isSuccess) {
				const details = response.data.fetchDetails[0];
				setFormData({
					...formData,
					fullname: details.employeeName,
					role: details.role,
				});
				setVerifyEmpID(true)
				setEmpIdError('')

			} else {
				setEmpIdError(
					response.data.message === "Employee is already registered"
						? (
							<>Employee is already registered <Link to="/auth/login" className='fw-bold text-success'>Login <i className="ri-arrow-right-line"></i></Link></>
						)
						: response.data.message || 'Entered Wrong Employee ID'
				);


			}
		} catch (error: any) {
			setEmpIdError(error || 'Entered Wrong Emploee ID');
			console.error(error)
		}
	};

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};



	const verifyDOJ = async (empID: string, joiningDate: string) => {
		try {
			const response = await axios.post(
				`${config.API_URL_APPLICATION}/Login/VerifyJoiningDate`,
				null,
				{ params: { EmpID: empID, Input: joiningDate } }
			);

			if (response.data.isSuccess) {
				console.log('Date is verified:', response.data.message);
				setVerifyDoj(true);
				setDateOJError('');
			} else {
				setDateOJError('Enter a valid Date of Joining');
				setVerifyDoj(false);

			}
		} catch (error) {
			console.error('Error verifying the joining date:', error);
			setDateOJError('Unable to verify Date of Joining. Please try again later.');
			setVerifyDoj(false);
		}
	};


	const verifyDOB = async (empID: string, dob: string) => {
		try {
			const response = await axios.post(`${config.API_URL_APPLICATION}/Login/VerifyDOB`, null, {
				params: { EmpID: empID, Input: dob, }
			});
			if (response.data.isSuccess) {
				console.log('Date od Birth is verified:', response.data.message);
				setVerifyDob(true);
				setDateOBError('')
			} else {
				setDateOBError("Enter Valid Date of Birth");
				setVerifyDob(false);
			}
		} catch (error) {
			console.error('Error verifying the joining date:', error);
			setDateOBError('Unable to verify Date of Birth. Please try again later.');
		}
	};

	const [validationMessages, setValidationMessages] = useState([
		"Include a special character.",
		"Include an uppercase letter.",
		"Include a lowercase letter.",
		"Include a number.",
		"Length must be 8-16 characters.",
	]);

	useEffect(() => {
		const password = formData.password;
		const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password);
		const hasUppercase = /[A-Z]/.test(password);
		const hasLowercase = /[a-z]/.test(password);
		const hasNumber = /\d/.test(password);
		const isLengthValid = password.length >= 8 && password.length <= 16;

		const updatedMessages = [];
		if (!hasSpecialCharacter) updatedMessages.push("Include a special character.");
		if (!hasUppercase) updatedMessages.push("Include an uppercase letter.");
		if (!hasLowercase) updatedMessages.push("Include a lowercase letter.");
		if (!hasNumber) updatedMessages.push("Include a number.");
		if (!isLengthValid) updatedMessages.push("Length must be 8-16 characters.");

		setValidationMessages(updatedMessages);
	}, [formData.password]);


	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		setLoading(false)
		const { name, value } = e.target;
		if (name === "password") {
			setFormData((prevData) => ({ ...prevData, password: value }));

		} else if (name === "empID") {
			toast.dismiss()
			setDateOJError('')
			setDateOBError('')
			setEmpIdError('')
			setFormData((prevData) => ({
				...prevData,
				empID: value,
				fullname: "",
				dob: "",
				joiningDate: "",
			}));
			setVerifyEmpID(false);
		} else if (name === "mobileNumber") {
			setMobileError('')
			setSubmitMobileError('')
			if (!/^\d{0,10}$/.test(value)) return;
			setFormData((prevData) => ({ ...prevData, mobileNumber: value }));

			if (value.length === 10) {
				if (/^[6-9]/.test(value)) {
					setIsMobileVerified(true);
					setIsErrorShown(false);
				} else {
					if (!isErrorShown) {
						setMobileError("Mobile number must start with 6-9");
						setIsErrorShown(true);
					}
					setIsMobileVerified(false);
				}
			} else {
				setIsErrorShown(false);
				setIsMobileVerified(false);
			}
		} else {
			setFormData((prevData) => ({ ...prevData, [name]: value }));
		}
	};

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		setLoading(true);

		if (!isMobileVerified) {
			setMobileError("Please verify your mobile number before submitting the form.");
			return;
		}
		if (validationMessages.length > 0) {
			setLoading(false); // Stop loading spinner if password is not valid
			return;
		}

		try {
			const postData = {
				empID: formData.empID,
				empName: formData.fullname,
				mobileNumber: formData.mobileNumber,
				joiningDate: formData.joiningDate,
				dob: formData.dob,
				password: formData.password,
				role: formData.role,
				status: 'Current',
				createdBy: 'admin',
				updatedBy: 'admin',
			};

			const response = await axios.post(
				`${config.API_URL_APPLICATION}/Login/InsertLoginData`,
				postData,
				{
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);

			if (response.status === 200) {
				setTimeout(() => {
					navigate('/auth/login');
				}, 11000);

				toast.dismiss()
				toast.success(
					<>Employee Registration successfully! <br />
						Redirecting to Login...
					</>
				);
				setVerifyDoj(false)
				setVerifyDob(false)
				setVerifyEmpID(false)
				setFormData((prevData) => ({
					...prevData,
					empID: "",
					fullname: "",
					dob: "",
					joiningDate: "",
					mobileNumber: "",
					password: "",
				}));

			} else {
				console.error('Registration failed:', response);
			}
		} catch (error: any) {
			setSubmitMobileError(error);
		} finally {
			setLoading(false);
		}
	};


	return (
		<>
			<PageBreadcrumb title="Register" />
			<AuthLayout
				authTitle="Sign Up"
				helpText="Enter your Employee ID, Verify and then enter Password to Sign Up."
				bottomLinks={<BottomLink />}
				hasThirdPartyLogin
			>
				<VerticalForm<UserData> onSubmit={onSubmit}>

					<Row>
						<Col className='position-relative'>
							<FormInput
								label="Employee ID"
								type="text"
								name="empID"
								placeholder="Enter your Employee ID"
								value={formData.empID}
								onChange={handleInputChange}
								onBlur={() => {
									toast.dismiss();
									if (formData.empID) {
										fetchEmployeeDetails(formData.empID);
									}
								}}
								className={empIdError ? "mb-3 input-border" : " mb-3  "}
								required
							/>

							<div className="position-absolute signup-verify fs-11" style={{ borderLeft: 'none', cursor: 'pointer' }} >
								{verifyEmpID ? <i className="ri-checkbox-circle-fill fs-15 text-success "></i> : null}
							</div>
							<small className="text-danger signup-error">{empIdError}</small>


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
											setFormData({ ...formData, joiningDate: formattedDate });
											if (formData.empID) {
												verifyDOJ(formData.empID, formattedDate);
											} else {
												setDateOJError('Please enter Employee ID before verifying');
											}
										}
									}}
									options={{
										enableTime: false,
										dateFormat: 'Y-m-d',
									}}
									placeholder="yyyy-MM-dd"
									className={dateOJError ? "form-control input-border" : " form-control  "}
									required
								/>
							</Form.Group>


							<div className="position-absolute signup-verify fs-11" style={{ borderLeft: 'none', cursor: 'pointer' }} >
								{verifyDoj ? (
									<i className="ri-checkbox-circle-fill fs-15 text-success"></i>
								) : null}
							</div>
							<small className="text-danger signup-error">{dateOJError}</small>
						</Col>


						<Col lg={6} className='position-relative'>
							<Form.Group controlId="dob" className="mb-3">
								<Form.Label>Date of Birth</Form.Label>
								<Flatpickr
									value={formData.dob || ''}
									onChange={([date]) => {
										if (date) {
											const formattedDate = date.toLocaleDateString('en-CA');
											setFormData({
												...formData,
												dob: formattedDate,
											});

											if (formData.empID) {
												verifyDOB(formData.empID, formattedDate);
											} else {
												setDateOBError('Please enter Employee ID before verifying');
											}
										}
									}}

									options={{
										enableTime: false,
										dateFormat: 'Y-m-d',
									}}
									placeholder="yyyy-MM-dd"
									className={dateOBError ? "form-control input-border" : " form-control  "}
									required
								/>
							</Form.Group>

							<div className="position-absolute signup-verify fs-11" style={{ borderLeft: 'none', cursor: 'pointer' }} >
								{verifyDob ? (
									<i className="ri-checkbox-circle-fill fs-15 text-success"></i>
								) : null}
							</div>
							<small className="text-danger signup-error">{dateOBError}</small>
						</Col>
					</Row>


					<Row>
						<Col lg={6} className='position-relative'>
							<Form.Group controlId="mobileNumber" className="mb-3">
								<Form.Label>Mobile Number</Form.Label>
								<Form.Control
									type="text"
									name="mobileNumber"
									value={formData.mobileNumber}
									onChange={handleInputChange}
									required
									placeholder="Enter your mobile number"
									maxLength={10}
									minLength={10}
									className={mobileError || submitMobileError ? "mb-3 input-border" : " mb-3  "}
								/>
								<small className="text-danger signup-error">{mobileError || submitMobileError}</small>
							</Form.Group>
						</Col>

						<Col lg={6} >
							<Form.Group controlId="password" className="mb-3">
								<Form.Label>Password</Form.Label>
								<div className="input-group">
									<Form.Control
										type={showPassword ? "text" : "password"}
										name="password"
										value={formData.password}
										onChange={handleInputChange}
										required
										placeholder="Enter Password"
									/>
									<button
										type="button"
										className="btn btn-outline-secondary"
										onClick={togglePasswordVisibility}
										style={{ border: "1px solid #ced4da", borderRadius: "0 .25rem .25rem 0" }}
									>
										{showPassword ? <i className="ri-eye-off-line"></i> : <i className="ri-eye-line"></i>}
									</button>
								</div>
								{formData.password.length > 0 && validationMessages.length > 0 && (
									<ul>
										{validationMessages.map((msg, index) => (
											<li key={index} className="text-danger">
												{msg}
											</li>
										))}
									</ul>
								)}

							</Form.Group>
						</Col>
					</Row>


					<div className="mb-0 d-grid text-center">
						{formData.empID &&
							formData.fullname &&
							formData.mobileNumber.length === 10 &&
							formData.joiningDate &&
							formData.dob &&
							formData.password &&
							verifyDob &&
							!isErrorShown &&
							verifyEmpID &&
							isMobileVerified &&
							verifyDoj ?

							<Button variant="primary" className="fw-semibold" type="submit" disabled={loading}>
								Sign Up
							</Button>
							:
							<Button variant="primary" className="fw-semibold" type="submit" disabled>
								Sign Up
							</Button>

						}
					</div>
				</VerticalForm>
			</AuthLayout>

		</>
	);
};

export default Register;
