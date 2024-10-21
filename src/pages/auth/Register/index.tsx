import { Button, Col, Row } from 'react-bootstrap';
import AuthLayout from '../AuthLayout';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { VerticalForm, FormInput, PageBreadcrumb } from '@/components';

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
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState<UserData>({
		empID: '',
		fullname: '',
		mobileNumber: '',
		joiningDate: '', // Keep the date as string from the input
		dob: '', // Keep the date as string from the input
		password: '', // User will manually input the password
		role: 'EMPLOYEE',
	});

	// Fetch employee details by empID
	const fetchEmployeeDetails = async (empID: string) => {
		if (!empID) return; // Prevent fetching if empID is empty
		try {
			const response = await axios.get(
				`https://arvindo-api2.clay.in/api/Login/GetEmployeeDetailsbyEmpId?EmpID=${empID}`
			);
			if (response.data.isSuccess) {
				const details = response.data.getEmployeeDetailsbyEmpId;
				setFormData({
					...formData,
					empID: details.empID,
					fullname: details.employeeName,
					mobileNumber: details.mobileNumber,
					joiningDate: details.dateOfJoining, // Keep date as string
					dob: details.dateOfBirth, // Keep date as string
					role: details.role,
				});
			}
		} catch (error) {
			console.error('Error fetching employee details:', error);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		const { name, value } = e.target;

		console.log('Field being changed:', name);
		console.log('New value:', value);

		setFormData((prevData) => ({
			...prevData,
			[name]: value, // Dynamically update the field based on its "name"
		}));
	};

	useEffect(() => {
		console.log('Form Data Updated:', formData); // Log form data whenever it updates
	}, [formData]);

	// Handle form submission
	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		setLoading(true);

		try {
			// Prepare the data for the POST request without modifying date format
			const postData = {
				empID: formData.empID,
				empName: formData.fullname,
				mobileNumber: formData.mobileNumber,
				joiningDate: formData.joiningDate, // Directly use the string value
				dob: formData.dob, // Directly use the string value
				password: formData.password, // Ensure the password field is filled by the user
				role: formData.role,
				status: 'active', // Hardcoded for now
				createdBy: 'admin', // Adjust accordingly
				updatedBy: 'admin', // Adjust accordingly
			};

			console.log(formData.password);
			console.log(postData);

			// Send the POST request
			const response = await axios.post(
				'https://arvindo-api2.clay.in/api/Login/InsertLoginData',
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
			} else {
				console.error('Registration failed:', response);
			}
		} catch (error) {
			console.error('Error during registration:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<PageBreadcrumb title="Register" />
			<AuthLayout
				authTitle="Free Sign Up"
				helpText="Enter your details to sign up."
				bottomLinks={<BottomLink />}
				hasThirdPartyLogin
			>
				<VerticalForm<UserData> onSubmit={onSubmit}>
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

					<Button
						variant="secondary"
						className="mb-3"
						onClick={(e) => {
							e.preventDefault(); // Prevent form submission
							fetchEmployeeDetails(formData.empID);
						}}
					>
						Fetch Employee Details
					</Button>

					<FormInput
						label="Full Name"
						type="text"
						name="fullname"
						placeholder="Enter your name"
						value={formData.fullname}
						onChange={handleInputChange}
						containerClass="mb-3"
					/>

					<FormInput
						label="Mobile Number"
						type="text"
						name="mobileNumber"
						placeholder="Enter your mobile number"
						value={formData.mobileNumber}
						onChange={handleInputChange}
						containerClass="mb-3"
					/>

					<FormInput
						label="Password"
						type="text" // Change to password type
						name="password"
						placeholder="Enter your password" // Adjust placeholder
						value={formData.password}
						onChange={handleInputChange}
						containerClass="mb-3"
						required
					/>

					<FormInput
						label="Joining Date"
						type="text"
						name="joiningDate"
						value={formData.joiningDate} // Unchanged date format
						onChange={handleInputChange}
						containerClass="mb-3"
						readOnly
					/>

					<FormInput
						label="Date of Birth"
						type="text"
						name="dob"
						value={formData.dob} // Unchanged date format
						onChange={handleInputChange}
						containerClass="mb-3"
						readOnly
					/>

					<FormInput
						label="Role"
						type="text"
						name="role"
						value={formData.role}
						onChange={handleInputChange}
						containerClass="mb-3"
						readOnly
					/>

					<div className="mb-0 d-grid text-center">
						<Button variant="primary" className="fw-semibold" type="submit" disabled={loading}>
							Sign Up
						</Button>
					</div>
				</VerticalForm>
			</AuthLayout>
		</>
	);
};

export default Register;
