import { Button, Card, Col, Form, Image, Nav, Row, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ChangeEvent, useEffect, useState } from 'react';
import axios from 'axios';
import config from '@/config';
import Select from 'react-select';
// images
import bgProfile from '@/assets/images/bg-profile.jpg';
import avatar1 from '@/assets/images/users/avatar-1.jpg';
import { toast } from 'react-toastify';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_green.css';
// components


interface EmployeeDetails {
	id: number;
	empID: string;
	employeeName: string;
	fatherName: string;
	email: string;
	dataAccessLevel: string;
	empStatus: string;
	hrUpdatedMobileNo: string;
	userUpdatedMobileNo: string;
	state: string;
	district: string;
	area: string;
	pin: string;
	address: string;
	photo: string;
	gender: string;
	dateOfBirth: string;
	dateOfJoining: string;
	dateOfLeaving: string;
	departmentName: string;
	designation: string;
	appExempt: string;
	isPerformanceReview: string;
	appAccessLevel: string;
	appAccess: string;
	currentProjectName: string;
	salaryBankAccountType: string;
	salaryBankAccountNumber: string;
	salaryBankName: string;
	salaryBankIfsc: string;
	salaryBranchName: string;
	reimbursementBankAccountType: string;
	reimbursementBankAccountNumber: string;
	reimbursementBankName: string;
	reimbursementBankIfsc: string;
	reimbursementBranchName: string;
	expenseBankAccountType: string;
	expenseBankAccountNumber: string;
	expenseBankName: string;
	expenseBankIfsc: string;
	expenseBranchName: string;
	excelDobValue: string;
	excelDojValue: string;
	excelDolValue: string;
	isRegistered: string;
	daL_Module: string | string[];
	daL_Project: string | string[];
	registrationDate: string;
	createdBy: string;
	updatedBy: string;
	role: string;
}


interface District {
	district: string;
	state: string;
}


interface AreaData {
	areaName: string;
}
const ProfilePages = () => {
	const [loading, setLoading] = useState(false);
	const storedEmpID = localStorage.getItem('EmpId');
	const [errorMessage, setErrorMessage] = useState('');
	// const [genderList, setGenderList] = useState<GenderList[]>([])
	const [districts, setDistricts] = useState<District[]>([]);
	const [areaData, setAreaData] = useState<AreaData[]>([]);
	const [searchPin, setSearchPin] = useState('');
	// const [searchDistrict, setSearchDistrict] = useState('');
	const [isMobileVerified, setIsMobileVerified] = useState(false);
	const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
	const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetails>({
		id: 0,
		empID: '',
		employeeName: '',
		fatherName: '',
		email: '',
		dataAccessLevel: '',
		empStatus: '',
		hrUpdatedMobileNo: '',
		userUpdatedMobileNo: '',
		state: '',
		district: '',
		area: '',
		pin: '',
		address: '',
		photo: '',
		gender: '',
		dateOfBirth: '',
		dateOfJoining: '',
		dateOfLeaving: '',
		departmentName: '',
		designation: '',
		appExempt: '',
		isPerformanceReview: '',
		appAccessLevel: '',
		appAccess: '',
		currentProjectName: '',
		salaryBankAccountType: '',
		salaryBankAccountNumber: '',
		salaryBankName: '',
		salaryBankIfsc: '',
		salaryBranchName: '',
		reimbursementBankAccountType: '',
		reimbursementBankAccountNumber: '',
		reimbursementBankName: '',
		reimbursementBankIfsc: '',
		reimbursementBranchName: '',
		expenseBankAccountType: '',
		expenseBankAccountNumber: '',
		expenseBankName: '',
		expenseBankIfsc: '',
		expenseBranchName: '',
		excelDobValue: '',
		excelDojValue: '',
		excelDolValue: '',
		isRegistered: '',
		daL_Module: [],
		daL_Project: [],
		registrationDate: '',
		createdBy: '',
		updatedBy: '',
		role: '',
	});




	useEffect(() => {
		const fetchEmployeeDetails = async () => {
			setLoading(true);
			try {
				const response = await axios.get(`${config.API_URL_APPLICATION}/EmployeeMaster/GetProfileDetailByEmployeeID`, {
					params: { EmpID: storedEmpID }
				});
				if (response.data.isSuccess) {
					setEmployeeDetails(response.data.employeeMasterList[0]);
				} else {
					console.error(response.data.message);
				}
			} catch (error) {
				console.error('Error fetching employeeDetails details:', error);
			} finally {
				setLoading(false);
			}
		};

		// Only fetch employeeDetails details if empID is not null
		if (storedEmpID) {
			fetchEmployeeDetails();
		}
	}, [storedEmpID]);


	const fetchDistricts = async () => {
		try {
			// Clear previous errors
			setErrorMessage('');
			if (!searchPin.trim()) {
				setDistricts([]);
				// setSearchDistrict('');
				setAreaData([]);
				setEmployeeDetails(prev => ({ ...prev, district: '', area: '', state: '' }));
				return; // Stop execution if the pincode is blank
			}

			const response = await axios.get(`${config.API_URL_APPLICATION}/AddressMaster/GetAddressData?PinCode=${searchPin}`);
			const fetchedDistricts = response.data.addresses;

			if (fetchedDistricts.length > 0) {
				setDistricts(fetchedDistricts);
				const firstDistrict = fetchedDistricts[0].district;
				const fetchedState = fetchedDistricts[0]?.state || '';
				console.log('hi')
				// setSearchDistrict(firstDistrict);
				setEmployeeDetails(prev => ({
					...prev,
					district: firstDistrict,
					state: fetchedState,
				}));

				await fetchAreaData(searchPin, firstDistrict);
			} else {
				setDistricts([]);
				// setSearchDistrict('');
				setAreaData([]);
				setEmployeeDetails(prev => ({ ...prev, district: '', area: '', state: '' }));

				setErrorMessage('Invalid Pincode. Please try again.');
			}
		} catch (error) {
			console.error('Error fetching districts:', error);
			setDistricts([]);
			// setSearchDistrict('');
			setAreaData([]);
			setEmployeeDetails(prev => ({ ...prev, district: '', area: '', state: '' }));

			setErrorMessage('Invalid Pincode. Please try again.');
		}
	};

	const fetchAreaData = async (pin: string, district: string) => {
		try {
			const response = await axios.get(`${config.API_URL_APPLICATION}/AddressMaster/GetAddressData?PinCode=${pin}&District=${district}`);
			const fetchedAreas = response.data.addresses;

			if (fetchedAreas.length > 0) {
				setAreaData(fetchedAreas);

				const firstArea = fetchedAreas[0].areaName;
				const fetchedState = fetchedAreas[0]?.state || '';
				setEmployeeDetails(prev => ({
					...prev,
					area: firstArea,
					state: fetchedState,
				}));
			} else {
				// Handle invalid pincode or no areas found
				setAreaData([]);
				setEmployeeDetails(prev => ({ ...prev, area: '', state: '' }));
				toast.error("Invalid Pincode or no areas found. Please try again.");
			}
		} catch (error) {
			console.error('Error fetching area data:', error);
			setAreaData([]);
			setEmployeeDetails(prev => ({ ...prev, area: '', state: '' }));
			toast.error("Invalid Pincode or no areas found. Please try again.");
		}
	};



	const handleChange = (e: ChangeEvent<any> | null, name?: string, value?: any) => {
		const validateMobileNumber = (fieldName: string, fieldValue: string) => {
			if (!/^\d{0,10}$/.test(fieldValue)) {
				return false;
			}

			setEmployeeDetails((prevData) => ({
				...prevData,
				[fieldName]: fieldValue,
			}));

			if (fieldValue.length === 10) {
				if (!/^[6-9]/.test(fieldValue)) {
					toast.error("Mobile number should start with a digit between 6 and 9.");
					setIsMobileVerified(true);
					return false;
				}
			} else {
				setIsMobileVerified(false);
			}
			return true;
		};

		if (e) {
			const { name: eventName, type } = e.target;

			if (type === 'checkbox') {
				const checked = (e.target as HTMLInputElement).checked;
				setEmployeeDetails((prevData) => ({
					...prevData,
					[eventName]: checked,
				}));
			} else {
				const inputValue = (e.target as HTMLInputElement | HTMLSelectElement).value;

				if (eventName === "userUpdatedMobileNo" || eventName === "hrUpdatedMobileNo") {
					validateMobileNumber(eventName, inputValue);
				} else {
					setEmployeeDetails((prevData) => {
						const updatedData = { ...prevData, [eventName]: inputValue };

						// Clear corresponding fields based on dataAccessLevel
						if (eventName === "dataAccessLevel") {
							if (inputValue === "Module") {
								updatedData.daL_Project = [];
							} else if (inputValue === "Project") {
								updatedData.daL_Module = [];
							} else if (inputValue === "ProjectModule") {
								if (!updatedData.daL_Project?.length || !updatedData.daL_Module?.length) {
									// toast.error("Both DAL Project and DAL Module are required for ProjectModule.");
								}
							} else {
								updatedData.daL_Module = [];
								updatedData.daL_Project = [];
							}
						}
						if (name === 'empStatus') {
							if (value !== 'Former') {
								updatedData.dateOfLeaving = '';
							}
						}

						return updatedData;
					});
				}
			}
		} else if (name) {
			setEmployeeDetails((prevData) => {
				const updatedData = { ...prevData, [name]: value };

				if (name === "dataAccessLevel") {
					if (value === "Module") {
						updatedData.daL_Project = [];
					} else if (value === "Project") {
						updatedData.daL_Module = [];
					} else if (value === "ProjectModule") {
						if (!updatedData.daL_Project?.length || !updatedData.daL_Module?.length) {
							// toast.error("Both DAL Project and DAL Module are required for ProjectModule.");
						}
					} else {
						updatedData.daL_Module = [];
						updatedData.daL_Project = [];
					}
				}

				if (name === 'empStatus') {
					if (value !== 'Former') {
						updatedData.dateOfLeaving = '';
					}
				}

				return updatedData;
			});
		}

	};

	const validateFields = (): boolean => {
		const errors: { [key: string]: string } = {};
		if (!employeeDetails?.employeeName) { errors.employeeName = 'Employee Name is required'; }
		if (!employeeDetails?.fatherName) { errors.fatherName = 'Father Name is required'; }
		if (!employeeDetails?.hrUpdatedMobileNo) { errors.hrUpdatedMobileNo = 'Mobile No is required'; }
		if (!employeeDetails.pin) { errors.pin = 'Pin is required'; }
		if (!employeeDetails.state) { errors.state = 'State is required'; }
		if (!employeeDetails.area) { errors.area = 'Area is required'; }
		if (!employeeDetails.district) { errors.district = 'District is required'; }
		if (!employeeDetails.address) { errors.address = 'Address is required'; }
		if (!employeeDetails.gender) { errors.gender = 'Gender is required'; }
		if (!employeeDetails.dateOfBirth) { errors.dateOfBirth = 'Date of Birth is required'; }


		console.log(errors)
		setValidationErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		toast.dismiss()

		// setIsSubmitted(true);

		if (!validateFields()) {
			toast.dismiss()
			toast.error('Please fill in all required fields.');
			return;
		}
		if (employeeDetails?.hrUpdatedMobileNo.length !== 10) {
			toast.dismiss()
			toast.error("Mobile number should be exactly 10 digits long.");
			setIsMobileVerified(true);
			return false;
		}
		if (isMobileVerified) {
			toast.dismiss()
			toast.error("Please verify your mobile number before submitting the form.");
			return;
		}
		if (errorMessage) {
			toast.dismiss()
			toast.error("Please vErify Pin Code.");
			return;
		}


		const payload = {
			empID: employeeDetails?.empID,
			employeeName: employeeDetails?.employeeName,
			fatherName: employeeDetails?.fatherName,
			email: employeeDetails?.email,
			hrUpdatedMobileNo: employeeDetails?.hrUpdatedMobileNo,
			userUpdatedMobileNo: employeeDetails?.userUpdatedMobileNo,
			state: employeeDetails?.state,
			district: employeeDetails?.district,
			area: employeeDetails?.area,
			pin: employeeDetails?.pin,
			address: employeeDetails?.address,
			gender: employeeDetails?.gender,
			dateOfBirth: employeeDetails?.dateOfBirth,
			updatedBy: employeeDetails?.updatedBy,
		};

		console.log(payload)
		try {
			const response = await axios.post(`${config.API_URL_APPLICATION}/EmployeeMaster/UpdateProfilebyEmployeeID`, payload);

			if (response.data.isSuccess) {
				toast.success("Profile updated successfully!");
			}

		} catch (error: any) {
			toast.error(error?.message || "Error Adding/Updating");
			console.error('Error submitting module:', error);
		}

	};


	// Display loading state
	if (loading) {
		return <div>Loading...</div>;
	}


	return (
		<>
			<div>
				<Row>
					<Col sm={12} className="text-center">
						<div className="profile-bg-picture" style={{ backgroundImage: `url(${bgProfile})` }}>
							<span className="picture-bg-overlay" />
						</div>
						<div className="profile-user-box">
							<Row>
								<div className="position-absolute profile_top start-50 translate-middle-x">
									<Image src={avatar1} className="avatar-lg rounded-circle" alt="user" />
								</div>
								<div>
									<h4 className="mt-4 fs-20 ellipsis">{employeeDetails?.employeeName}</h4>
									<p className="font-13">
										Employee ID - <span className="text-uppercase fw-bold">{employeeDetails?.empID}</span>
									</p>
									<p className="text-muted mb-0">
										<small>{employeeDetails?.role}</small>
									</p>
								</div>
							</Row>
						</div>
					</Col>
				</Row>
				<Row>
					<Col sm={12}>
						<Card className="p-0">
							<Card.Body className="p-0">
								<div className="profile-content">
									<Tab.Container defaultActiveKey="About">
										<div>
											<div className="d-flex justify-content-center">
												<Nav as="ul" className="m-3">
													<Nav.Item as="li">
														<Nav.Link as={Link} to="#" eventKey="About" type="button">
															About
														</Nav.Link>
													</Nav.Item>
													<Nav.Item>
														<Nav.Link as={Link} to="#" eventKey="Settings" type="button">
															Settings
														</Nav.Link>
													</Nav.Item>
												</Nav>
											</div>
											<div>
												<Tab.Content className="m-0 p-4">
													<Tab.Pane eventKey="About" id="aboutme" tabIndex={0}>
														<div className="profile-desk container">
															{/* <h5 className="text-uppercase fs-17 text-dark">{employeeDetails?.employeeName}</h5>
															<div className="designation mb-4">{employeeDetails?.role}</div> */}

															<div className=' border p-3 rounded my-2'>
																<h5 className="mt-2 fs-17 text-dark">Contact Information</h5>
																<Row className="contact-info">
																	<Col sm={12} md={6}>
																		<div className="info-item fs-16 p-2 bg-light rounded my-1">
																			<strong>Employee ID</strong>: {employeeDetails?.empID}
																		</div>
																	</Col>
																	<Col sm={12} md={6}>
																		<div className="info-item fs-16 p-2 bg-light my-1 rounded">
																			<strong>Email</strong>:   {employeeDetails?.email}
																			{/* <Link to={`mailto:${employeeDetails?.email}`} className="text-primary"> */}
																			{/* </Link> */}
																		</div>
																	</Col>
																	<Col sm={12} md={6}>
																		<div className="info-item fs-16 p-2 bg-light my-1 rounded">
																			<strong>Phone</strong>: {employeeDetails?.hrUpdatedMobileNo}
																		</div>
																	</Col>
																	<Col sm={12} md={6}>
																		<div className="info-item fs-16 p-2 bg-light my-1 rounded">
																			<strong>Mob</strong>: {employeeDetails?.userUpdatedMobileNo}
																		</div>
																	</Col>
																	<Col sm={12} md={6}>
																		<div className="info-item fs-16 p-2 bg-light my-1 rounded">
																			<strong>Address</strong>: {employeeDetails?.address}, {employeeDetails?.area}
																		</div>
																	</Col>
																	<Col sm={12} md={6}>
																		<div className="info-item fs-16 p-2 bg-light my-1 rounded">
																			<strong>District</strong>:  {employeeDetails?.district}, {employeeDetails?.state} , {employeeDetails?.pin}
																		</div>
																	</Col>

																</Row>
															</div>

															<div className=' border p-3 rounded my-2'>
																<h5 className="mt-2 fs-17 text-dark">Offical Details</h5>
																<Row className="contact-info">
																	<Col sm={12} md={6}>
																		<div className="info-item fs-16 p-2 bg-light rounded my-1">
																			<strong>Current Project</strong>: {employeeDetails?.currentProjectName}
																		</div>
																	</Col>
																	<Col sm={12} md={6}>
																		<div className="info-item fs-16 p-2 bg-light my-1 rounded">
																			<strong>Department Name</strong>:{employeeDetails?.departmentName}
																		</div>
																	</Col>

																	<Col sm={12} md={6}>
																		<div className="info-item fs-16 p-2 bg-light my-1 rounded">
																			<strong>Employee Status</strong>: {employeeDetails?.empStatus}
																		</div>
																	</Col>
																	<Col sm={12} md={6}>
																		<div className="info-item fs-16 p-2 bg-light my-1 rounded">
																			<strong>Date of Joining</strong>: {employeeDetails?.dateOfJoining}
																		</div>
																	</Col>
																	<Col sm={12} md={6}>
																		<div className="info-item fs-16 p-2 bg-light my-1 rounded">
																			<strong>Department Name</strong>: {employeeDetails?.departmentName}
																		</div>
																	</Col>
																	<Col sm={12} md={6}>
																		<div className="info-item fs-16 p-2 bg-light my-1 rounded">
																			<strong>Designation</strong>: {employeeDetails?.designation}
																		</div>
																	</Col>
																</Row>
															</div>
														</div>
													</Tab.Pane>
													<Tab.Pane eventKey="Settings" id="edit-profile">
														<div className="user-profile-content container">
															<Form onSubmit={handleSubmit}>
																<Row>
																	<Col lg={6}>
																		<Form.Group controlId="employeeName" className="mb-3">
																			<Form.Label>Employee Name <span className='text-danger'>*</span></Form.Label>
																			<Form.Control
																				type="text"
																				name="employeeName"
																				value={employeeDetails.employeeName}
																				onChange={handleChange}
																				placeholder='Enter Employee Name'
																				className={validationErrors.employeeName ? " input-border" : "  "}
																			/>
																			{validationErrors.employeeName && (
																				<small className="text-danger">{validationErrors.employeeName}</small>
																			)}
																		</Form.Group>
																	</Col>
																	{/* <Col lg={6}>
																		<Form.Group controlId="gender" className="mb-3">
																			<Form.Label>Gender  <span className='text-danger'>*</span></Form.Label>
																			<Select
																				name="gender"
																				value={genderList.find((emp) => emp.name === employeeDetails.gender)}
																				onChange={(selectedOption) => {
																					setEmployeeDetails({
																						...employeeDetails,
																						gender: selectedOption?.name || "",
																					});
																				}}
																				getOptionLabel={(emp) => emp.name}
																				getOptionValue={(emp) => emp.name}
																				options={genderList}
																				isSearchable={true}
																				placeholder="Select Gender"
																				className={validationErrors.gender ? " input-border" : "  "}
																			/>
																			{validationErrors.gender && (
																				<small className="text-danger">{validationErrors.gender}</small>
																			)}
																		</Form.Group>
																	</Col> */}
																	<Col lg={6}>
																		<Form.Group controlId="fatherName" className="mb-3">
																			<Form.Label>Father Name  <span className='text-danger'>*</span></Form.Label>
																			<Form.Control
																				type="text"
																				name="fatherName"
																				value={employeeDetails.fatherName}
																				onChange={handleChange}
																				placeholder='Father Name'
																				className={validationErrors.fatherName ? " input-border" : "  "}
																			/>
																			{validationErrors.fatherName && (
																				<small className="text-danger">{validationErrors.fatherName}</small>
																			)}
																		</Form.Group>
																	</Col>
																	<Col lg={6}>
																		<Form.Group controlId="email" className="mb-3">
																			<Form.Label>Email  <span className='text-danger'>*</span></Form.Label>
																			<Form.Control
																				type="email"
																				name="email"
																				value={employeeDetails.email}
																				onChange={handleChange}
																				placeholder='Email'
																				className={validationErrors.email ? " input-border" : "  "}
																			/>
																			{validationErrors.email && (
																				<small className="text-danger">{validationErrors.email}</small>
																			)}
																		</Form.Group>
																	</Col>
																	<Col lg={6}>
																		<Form.Group controlId="dateOfBirth" className="mb-3">
																			<Form.Label> Date of Birth <span className='text-danger'>*</span></Form.Label>
																			<Flatpickr
																				value={employeeDetails.dateOfBirth}
																				onChange={([date]) => {
																					if (date) {
																						const formattedDate = date.toLocaleDateString('en-CA');
																						setEmployeeDetails({
																							...employeeDetails,
																							dateOfBirth: formattedDate,
																						});
																					}
																				}}
																				options={{
																					enableTime: false,
																					dateFormat: "Y-m-d",
																					time_24hr: false,
																				}}
																				placeholder=" Date of Birth "
																				className={validationErrors.dateOfBirth ? " input-border form-control" : " form-control "}
																			/>
																			{validationErrors.dateOfBirth && (
																				<small className="text-danger">{validationErrors.dateOfBirth}</small>
																			)}
																		</Form.Group>
																	</Col>

																	<Col lg={6}>
																		<Form.Group controlId="hrUpdatedMobileNo" className="mb-3">
																			<Form.Label>HR Update Mobile Number  <span className='text-danger'>*</span></Form.Label>
																			<Form.Control
																				type="text"
																				name="hrUpdatedMobileNo"
																				value={employeeDetails.hrUpdatedMobileNo}
																				onChange={handleChange}
																				placeholder='Enter Mobile Number'

																				className={validationErrors.hrUpdatedMobileNo ? " input-border" : "  "}
																			/>
																			{validationErrors.hrUpdatedMobileNo && (
																				<small className="text-danger">{validationErrors.hrUpdatedMobileNo}</small>
																			)}
																		</Form.Group>
																	</Col>
																	<Col lg={6}>
																		<Form.Group controlId="userUpdatedMobileNo" className="mb-3">
																			<Form.Label>User Updated Mobile Number </Form.Label>
																			<Form.Control
																				type="text"
																				name="userUpdatedMobileNo"
																				onChange={handleChange}
																				value={employeeDetails.userUpdatedMobileNo}
																				placeholder='User Updated Mobile Number'
																			/>
																		</Form.Group>
																	</Col>
																	<Col lg={6}>
																		<Form.Group controlId="pin" className="mb-3">
																			<Form.Label>Pincode *</Form.Label>
																			<Form.Control
																				type="text"
																				name="pin"
																				value={employeeDetails.pin}
																				onChange={(e) => {
																					setSearchPin(e.target.value || employeeDetails.pin);
																					setEmployeeDetails(prev => ({ ...prev, pin: e.target.value }));
																				}}
																				onBlur={fetchDistricts}
																				maxLength={6}
																				placeholder="Enter Pincode"
																				className={validationErrors.pin ? " input-border" : "  "}
																			/>
																			{errorMessage && <div className="text-danger mt-1">{errorMessage}</div>}



																			{validationErrors.pin && (
																				<small className="text-danger">{validationErrors.pin}</small>
																			)}
																		</Form.Group>
																	</Col>
																	<Col lg={6}>
																		<Form.Group controlId="state" className="mb-3">
																			<Form.Label>State </Form.Label>
																			<Form.Control
																				type="text"
																				name="state"
																				value={employeeDetails.state}
																				onChange={handleChange}
																				placeholder='Enter State Name'
																				readOnly
																				className={validationErrors.state ? " input-border" : "  "}

																			/>
																			{validationErrors.state && (
																				<small className="text-danger">{validationErrors.state}</small>
																			)}
																		</Form.Group>
																	</Col>
																	<Col lg={6}>
																		<Form.Group controlId="district" className="mb-3">
																			<Form.Label>District </Form.Label>
																			<Select
																				name="district"
																				value={
																					districts.find(item => item.district === employeeDetails.district) ||
																					(employeeDetails.district && { district: employeeDetails.district }) ||
																					null
																				}
																				onChange={(selectedOption) => {
																					const district = selectedOption ? selectedOption.district : '';
																					// setSearchDistrict(district);
																					setEmployeeDetails(prev => ({ ...prev, district })); // Update district in employeeDetails
																					fetchAreaData(searchPin, district);
																				}}
																				options={districts || []}
																				getOptionLabel={(item) => item.district}
																				getOptionValue={(item) => item.district}
																				isSearchable={true}
																				placeholder="Select District"
																				className={validationErrors.district ? " input-border" : "  "}

																			/>
																			{validationErrors.district && (
																				<small className="text-danger">{validationErrors.district}</small>
																			)}
																		</Form.Group>
																	</Col>
																	<Col lg={6}>
																		<Form.Group controlId="area" className="mb-3">
																			<Form.Label>Area </Form.Label>
																			<Select
																				name="area"
																				value={
																					areaData.find(item => item.areaName === employeeDetails.area) ||
																					(employeeDetails.area && { areaName: employeeDetails.area }) ||
																					null
																				}
																				onChange={(selectedOption) => {
																					const areaName = selectedOption ? selectedOption.areaName : '';
																					setEmployeeDetails(prev => ({ ...prev, area: areaName })); // Update area in employeeDetails
																				}}
																				options={areaData || []}
																				getOptionLabel={(item) => item?.areaName || ''}
																				getOptionValue={(item) => item?.areaName || ''}
																				isSearchable={true}
																				placeholder="Select Area"
																				className={validationErrors.area ? " input-border" : "  "}
																			/>
																			{validationErrors.area && (
																				<small className="text-danger">{validationErrors.area}</small>
																			)}
																		</Form.Group>
																	</Col>
																	<Col lg={12}>
																		<Form.Group controlId="address" className="mb-3">
																			<Form.Label>Address *</Form.Label>
																			<Form.Control
																				as="textarea"
																				name="address"
																				value={employeeDetails.address}
																				rows={3}
																				onChange={handleChange}
																				placeholder='Enter Your Full Address'
																			/>
																		</Form.Group>
																	</Col>
																	<Col className='align-items-end d-flex justify-content-end mb-3'>
																		<div>
																			<Link to={'/pages/EmployeeMaster'}>
																				<Button variant="primary" >
																					Back
																				</Button>
																			</Link>
																			&nbsp;
																			<Button variant="primary" type="submit">
																				Update Details
																			</Button>
																		</div>

																	</Col>
																</Row>
															</Form>
														</div>
													</Tab.Pane>
												</Tab.Content>
											</div>
										</div>
									</Tab.Container>
								</div>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</div>
		</>
	);
};

export default ProfilePages;