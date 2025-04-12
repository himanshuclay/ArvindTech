import { Button, Card, Col, Form, Image, Row } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import config from '@/config';

import bgProfile from '@/assets/images/bg-profile.jpg';
import avatar1 from '@/assets/images/users/avatar-1.jpg';

interface EmployeeDetails {
    empID: string;
    password: string;
    confirmpassword: string;
    updatedBy: string;
}

const PasswordChangePage = () => {
    const storedEmpID = localStorage.getItem('EmpId')
    const storedEmpName = localStorage.getItem('EmpName')
    const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetails>({
        empID: storedEmpID || '',
        password: '',
        confirmpassword: '',
        updatedBy: '',
    });
    const [validationMessages, setValidationMessages] = useState<string[]>([]);
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showCPassword, setShowCPassword] = useState(false);

    // Validate password strength
    useEffect(() => {
        const password = employeeDetails.password;
        const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const isLengthValid = password.length >= 8 && password.length <= 16;

        const updatedMessages: string[] = [];
        if (!hasSpecialCharacter) updatedMessages.push("Include a special character.");
        if (!hasUppercase) updatedMessages.push("Include an uppercase letter.");
        if (!hasLowercase) updatedMessages.push("Include a lowercase letter.");
        if (!hasNumber) updatedMessages.push("Include a number.");
        if (!isLengthValid) updatedMessages.push("Length must be 8-16 characters.");

        setValidationMessages(updatedMessages);
    }, [employeeDetails.password]);

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleCPasswordVisibility = () => {
        setShowCPassword(!showCPassword);
    };

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEmployeeDetails((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        toast.dismiss();

        // Check if passwords match
        if (employeeDetails.password !== employeeDetails.confirmpassword) {
            setConfirmPasswordError('Passwords do not match.');
            toast.error('Passwords do not match.');
            return;
        }

        // If validation messages exist, show them
        if (validationMessages.length > 0) {
            toast.error('Please fix the password issues: ' + validationMessages.join(', '));
            return;
        }

        // Form submission logic
        const payload = {
            empID: storedEmpID,
            password: employeeDetails?.password, // Send the updated password
            updatedBy: employeeDetails?.updatedBy,
        };

        try {
            const response = await axios.post(`${config.API_URL_APPLICATION}/EmployeeMaster/UpdateProfilebyEmployeeID`, payload);
            if (response.data.isSuccess) {
                toast.success("Password updated successfully!");
            }
        } catch (error: any) {
            toast.error(error?.message || "Error updating password.");
            console.error('Error submitting password:', error);
        }
    };

    return (
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
                                <h4 className="mt-4 fs-20 ellipsis">{storedEmpName}</h4>
                                <p className="font-13">
                                    Employee ID - <span className="text-uppercase fw-bold">{storedEmpID}</span>
                                </p>
                                <p className="text-muted mb-0">
                                    <small>{storedEmpID}</small>
                                </p>
                            </div>
                        </Row>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col sm={12} className='container'>
                    <Card className="p-3">
                        <Card.Body className="p-0">
                            <div className="profile-content">
                                <div>
                                    <h4 className="fs-20 mb-4 text-center">Change Password</h4>
                                    <Form onSubmit={handleSubmit}>
                                        <Row className=''>

                                            <Col lg={6}>
                                                <Form.Group controlId="password" className="mb-3">
                                                    <Form.Label>Password</Form.Label>
                                                    <div className="input-group">
                                                        <Form.Control
                                                            type={showPassword ? "text" : "password"}
                                                            name="password"
                                                            value={employeeDetails.password}
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
                                                    {employeeDetails?.password?.length > 0 && validationMessages.length > 0 && (
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

                                            <Col lg={6} className='position-relative'>
                                                <Form.Group controlId="confirmpassword" className="mb-3">
                                                    <Form.Label>Confirm Password</Form.Label>
                                                    <div className="input-group">
                                                        <Form.Control
                                                            type={showCPassword ? "text" : "password"}
                                                            name="confirmpassword"
                                                            value={employeeDetails.confirmpassword}
                                                            onChange={handleInputChange}
                                                            required
                                                            placeholder="Confirm Password"
                                                        />
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-secondary"
                                                            onClick={toggleCPasswordVisibility}
                                                            style={{ border: "1px solid #ced4da", borderRadius: "0 .25rem .25rem 0" }}
                                                        >
                                                            {showCPassword ? <i className="ri-eye-off-line"></i> : <i className="ri-eye-line"></i>}
                                                        </button>
                                                    </div>
                                                    {confirmPasswordError && (
                                                        <small className="text-danger signup-error">{confirmPasswordError}</small>
                                                    )}
                                                </Form.Group>
                                            </Col>

                                            <Col className='align-items-end d-flex justify-content-end mb-3'>
                                                <Button variant="primary" type="submit">
                                                    Update Password
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default PasswordChangePage;
