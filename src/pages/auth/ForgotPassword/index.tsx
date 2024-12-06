import { Button, Col, Form, Row } from 'react-bootstrap'
import AuthLayout from '../AuthLayout'
import { Link, useNavigate } from 'react-router-dom'
import { FormInput, VerticalForm, PageBreadcrumb } from '@/components'
import { useEffect, useState } from 'react'
import config from '@/config';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_green.css';
import axios from 'axios';
import CustomSuccessToast from '@/pages/other/Component/CustomSuccessToast';




const BottomLink = () => {
	return (
		<Row>
			<Col xs={12} className="text-center">
				<p className="text-dark-emphasis">
					Back To{' '}
					<Link to="/auth/login" className="text-dark fw-bold ms-1 link-offset-3 text-decoration-underline" >
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
	const [showToast, setShowToast] = useState(false);
	const [toastMessage, setToastMessage] = useState("");
	const [toastVariant, setToastVariant] = useState('');
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
				setToastMessage("Enter Valid Date Of Joning");
				setToastVariant("rgb(213 18 18)");
				setShowToast(true);
				setVerifyDoj(false);
				setFormData({
					...formData,
					joiningDate: '',
				});


				// alert('Enter Valid Employee ID or Date of Joining')

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
				setToastMessage("Enter Valid Date of Birth");
				setToastVariant("rgb(213 18 18)");
				setShowToast(true);
				setVerifyDob(false);
				setFormData({
					...formData,
					dob: '',
				});
			}
		} catch (error) {
			console.error('Error verifying the joining date:', error);
		}
	};


	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		if (name === "mobileNumber") {
			if (!/^\d{0,10}$/.test(value)) return; // Restrict non-numeric input and limit to 10 digits
			setFormData((prevData) => ({ ...prevData, mobileNumber: value }));
			if (value.length === 10) {
				setToastMessage(""); // Clear any error message
				setShowToast(false);
			} else {
				setToastMessage("Enter a valid 10-digit mobile number");
				setToastVariant("rgb(213 18 18)");
				setShowToast(true);
			}
		} else {
			setFormData((prevData) => ({ ...prevData, [name]: value }));
		}
	};

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		setLoading(true);



		const { password } = formData;

		// Validation checks
		const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password);
		const hasUppercase = /[A-Z]/.test(password);
		const hasLowercase = /[a-z]/.test(password);
		const hasNumber = /[0-9]/.test(password);
		const isLengthValid = password.length >= 8 && password.length <= 16;

		let validationMessages: string[] = [
			"Password must contain at least one special character.",
			"Password must contain at least one uppercase letter.",
			"Password must contain at least one lowercase letter.",
			"Password must contain at least one number.",
			'Password must be between 8 and 16 characters long.'
		];

		// Remove messages if the condition is met
		if (hasSpecialCharacter) {
			validationMessages = validationMessages.filter(message => !message.includes("special character"));
		}
		if (hasUppercase) {
			validationMessages = validationMessages.filter(message => !message.includes("uppercase letter"));
		}
		if (hasLowercase) {
			validationMessages = validationMessages.filter(message => !message.includes("lowercase letter"));
		}
		if (hasNumber) {
			validationMessages = validationMessages.filter(message => !message.includes("number"));
		}
		if (!isLengthValid) {
			validationMessages = validationMessages.filter(message => !message.includes("characters long"));
		}
		if (validationMessages.length > 0) {
			setToastMessage(validationMessages.join(" "));
			setToastVariant("rgb(213 18 18)"); // Red color for error
			setShowToast(true);
			setLoading(false); // Stop loading if validation fails
			return; // Prevent form submission and API call
		}

		if ((formData.password === formData.confirmpassword) && (!hasSpecialCharacter || !hasUppercase || !hasLowercase || !hasNumber)) {

			try {
				const postData = {
					empID: formData.empID,
					empName: formData.fullname,
					mobileNumber: formData.mobileNumber,
					joiningDate: formData.joiningDate,
					dob: formData.dob,
					password: formData.password,
					role: formData.role,
					status: 'active',
					createdBy: 'admin',
					updatedBy: 'admin',
				};


				// Send the POST request
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
					console.log('Password Updated Successfully!', response.data);
					navigate('/auth/login', {
						state: {
							showToast: true,
							toastMessage: 'Registration successful !',
							toastVariant: "rgb(28 175 85)"
						}
					});
				} else {
					console.error('Registration failed:', response);

				}
			} catch (error: any) {
				setToastMessage(error);
				setToastVariant("rgb(213 18 18)");
				setShowToast(true);
				console.error('Error during registration:', error);
			} finally {
				setLoading(false);
			}
		}
		else {
			setToastMessage("Password Do not Match");
			setToastVariant("rgb(213 18 18)");
			setShowToast(true);
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
										dateFormat: "Y-m-d ",
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
											setToastMessage("Please enter Employee ID before verifying");
											setToastVariant("rgb(213 18 18)");
											setShowToast(true);
										} else {
											verifyDOJ(formData.empID, formData.joiningDate);
										}
									}}
									style={{ borderLeft: 'none', cursor: 'pointer' }}
								>
									{verifyDoj ? <i className="ri-checkbox-circle-fill fs-15 text-success "></i> : 'Verify'}
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
											const formattedDate = date.toLocaleDateString('en-CA');
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
											setToastMessage("Please enter Employee ID before verifying");
											setToastVariant("rgb(213 18 18)");
											setShowToast(true);
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
									onChange={(e) => {
										const { name, value } = e.target;

										// Validation checks
										const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(value);
										const hasUppercase = /[A-Z]/.test(value);
										const hasLowercase = /[a-z]/.test(value);
										const hasNumber = /[0-9]/.test(value);

										let validationMessage = "";
										if (!hasSpecialCharacter) {
											validationMessage = "Password must contain at least one special character.";
										} else if (!hasUppercase) {
											validationMessage = "Password must contain at least one uppercase letter.";
										} else if (!hasLowercase) {
											validationMessage = "Password must contain at least one lowercase letter.";
										} else if (!hasNumber) {
											validationMessage = "Password must contain at least one number.";
										}

										if (validationMessage) {
											setToastMessage(validationMessage);
											setToastVariant("rgb(213 18 18)");
											setShowToast(true);
										} else {
											setShowToast(false); // Hide toast when valid
										}

										setFormData((prevData) => ({
											...prevData,
											[name]: value,
										}));
									}}
									required
									placeholder="Enter Password"
								/>
							</Form.Group>
						</Col>
						<Col lg={6}>
							<Form.Group controlId="confirmpassword" className="mb-3">
								<Form.Label>Confirm Password </Form.Label>
								<Form.Control
									type="password"
									name="confirmpassword"
									value={formData.confirmpassword}
									onChange={(e) => {
										const { name, value } = e.target;

										// Validation checks
										const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(value);
										const hasUppercase = /[A-Z]/.test(value);
										const hasLowercase = /[a-z]/.test(value);
										const hasNumber = /[0-9]/.test(value);

										let validationMessage = "";
										if (!hasSpecialCharacter) {
											validationMessage = "Password must contain at least one special character.";
										} else if (!hasUppercase) {
											validationMessage = "Password must contain at least one uppercase letter.";
										} else if (!hasLowercase) {
											validationMessage = "Password must contain at least one lowercase letter.";
										} else if (!hasNumber) {
											validationMessage = "Password must contain at least one number.";
										}

										if (validationMessage) {
											setToastMessage(validationMessage);
											setToastVariant("rgb(213 18 18)");
											setShowToast(true);
										} else {
											setShowToast(false); // Hide toast when valid
										}

										setFormData((prevData) => ({
											...prevData,
											[name]: value,
										}));
									}}
									required
									placeholder="Enter Password"
								/>
							</Form.Group>
						</Col>


					</Row>







					<div className="mb-0 d-grid text-center">
						{formData.empID &&
							formData.fullname &&
							formData.joiningDate &&
							formData.dob &&
							formData.password &&
							formData.confirmpassword &&
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
			<CustomSuccessToast show={showToast} toastMessage={toastMessage} toastVariant={toastVariant} onClose={() => setShowToast(false)} />

		</div>
	)
}

export default ForgotPassword
