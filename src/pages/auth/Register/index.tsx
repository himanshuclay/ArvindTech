import { Button, Col, Form, Row } from 'react-bootstrap';
import AuthLayout from '../AuthLayout';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
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
	const [formData, setFormData] = useState<UserData>({
		empID: '',
		fullname: '',
		mobileNumber: '',
		joiningDate: '',
		dob: '',
		password: '',
		role: 'EMPLOYEE',
	});

	const [isErrorShown, setIsErrorShown] = useState(false);

	const fetchEmployeeDetails = async (empID: string) => {
		try {
			const response = await axios.get(
				`${config.API_URL_APPLICATION}/Login/GetEmployeeDetailsbyEmpId?Flag=2&EmpID=${empID}`
			);
			if (response.data.isSuccess) {
				const details = response.data.fetchDetails[0];
				setFormData({
					...formData,
					fullname: details.employeeName,
					role: details.role,
				});
			}else{
				toast.error(
					<>
						<div style={{ marginBottom: "10px" }}>{response.data.message}</div>
						<div style={{ display: "flex", gap: "10px" }}>
							<button
								onClick={() => navigate("/auth/forgot-password")}
								style={{
									backgroundColor: "#007bff",
									color: "#fff",
									border: "none",
									padding: "5px 10px",
									borderRadius: "5px",
									fontSize: "11px",
									fontWeight: "bold",
									cursor: "pointer",
									transition: "all 0.3s ease",
								}}
								onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
								onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
							>
								Update Password <i className="ri-arrow-right-line"></i>
							</button>
							<button
								onClick={() => navigate("/auth/login")}
								style={{
									backgroundColor: "#28a745",
									color: "#fff",
									border: "none",
									padding: "5px 10px",
									borderRadius: "5px",
									fontSize: "11px",
									fontWeight: "bold",
									cursor: "pointer",
									transition: "all 0.3s ease",
								}}
								onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1c7430")}
								onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#28a745")}
							>
								Go to Login <i className="ri-arrow-right-line"></i>
							</button>
						</div>
					</>,
					{ autoClose: 30000 }
				);
			}
		} catch (error: any) {
			toast.dismiss()
			toast.error(
				<>
					<div style={{ marginBottom: "10px" }}>{error}</div>
					<div style={{ display: "flex", gap: "10px" }}>
						<button
							onClick={() => navigate("/auth/forgot-password")}
							style={{
								backgroundColor: "#007bff",
								color: "#fff",
								border: "none",
								padding: "5px 10px",
								borderRadius: "5px",
								fontSize: "11px",
								fontWeight: "bold",
								cursor: "pointer",
								transition: "all 0.3s ease",
							}}
							onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
							onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
						>
							Update Password <i className="ri-arrow-right-line"></i>
						</button>
						<button
							onClick={() => navigate("/auth/login")}
							style={{
								backgroundColor: "#28a745",
								color: "#fff",
								border: "none",
								padding: "5px 10px",
								borderRadius: "5px",
								fontSize: "11px",
								fontWeight: "bold",
								cursor: "pointer",
								transition: "all 0.3s ease",
							}}
							onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1c7430")}
							onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#28a745")}
						>
							Go to Login <i className="ri-arrow-right-line"></i>
						</button>
					</div>
				</>,
				{ autoClose: 30000 }
			);
			console.error(error)
		}
	};

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
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


				toast.error("Enter Valid Date Of Joning");
				setVerifyDoj(false);
				setFormData({
					...formData,
					joiningDate: '',
				});
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
				toast.error("Enter Valid Date of Birth");
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
		e.preventDefault();
		const { name, value } = e.target;

		if (name === "empID") {
			setFormData((prevData) => ({
				...prevData,
				empID: value,
				fullname: "", // Clear fullname
			}));
		} else if (name === "mobileNumber") {
			if (!/^\d{0,10}$/.test(value)) return;
			setFormData((prevData) => ({ ...prevData, mobileNumber: value }));

			if (value.length === 10) {
				if (!/^[6-9]/.test(value) && !isErrorShown) {
					toast.error("Mobile number should start with a digit between 6 and 9.");
					setIsErrorShown(true);
				}
			} else {
				setIsErrorShown(false);
			}
		} else {
			setFormData((prevData) => ({ ...prevData, [name]: value }));
		}
	};

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		setLoading(true);

		const { password } = formData;

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
		if (isLengthValid) { // Corrected logic
			validationMessages = validationMessages.filter(
				(message) => !message.includes("between 8 and 16 characters long")
			);
		}

		if (validationMessages.length > 0) {
			toast.error(validationMessages.join(" "));
			setLoading(false);
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
				status: 'active',
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
				}, 20000);

				toast.dismiss()
				toast.success(
					<>Employee Registration successfully!
						<button
							onClick={() => navigate('/auth/login')}
							style={{
								backgroundColor: "#007bff",
								color: "#fff",
								border: "none",
								padding: "5px 10px",
								borderRadius: "5px",
								fontSize: "11px",
								fontWeight: "bold",
								cursor: "pointer",
								transition: "all 0.3s ease",
							}}
						>
							Go to Login
						</button>
					</>,
					{ autoClose: 19000 }
				);


			} else {
				console.error('Registration failed:', response);
			}
		} catch (error: any) {
			toast.error(error);
		} finally {
			setLoading(false);
		}
	};



	const handleBlur = () => {
		if (formData.empID) {
			fetchEmployeeDetails(formData.empID);
		}
	};

	return (
		<>
			<PageBreadcrumb title="Register" />
			<AuthLayout
				authTitle="Sign Up"
				helpText="Enter your details to sign up."
				bottomLinks={<BottomLink />}
				hasThirdPartyLogin
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
								onBlur={handleBlur}
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
										toast.dismiss();
										if (!formData.empID) {
											toast.error("Please enter Employee ID before verifying");
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
										toast.dismiss();
										if (!formData.empID) {
											toast.error("Please enter Employee ID before verifying");
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
							<FormInput
								label="Mobile Number"
								type="text"
								name="mobileNumber"
								placeholder="Enter your mobile number"
								value={formData.mobileNumber}
								onChange={handleInputChange}
								maxLength={10}
								minLength={10}
								containerClass="mb-3"
								required
							/>
						</Col>
						<Col lg={6}>
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
