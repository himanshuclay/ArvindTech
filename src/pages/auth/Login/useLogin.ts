import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/common';
// import type { User } from '@/types'
import config from '@/config';

const TOKEN =
	'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJjb2RlcnRoZW1lcyIsImlhdCI6MTU4NzM1NjY0OSwiZXhwIjoxOTAyODg5NDQ5LCJhdWQiOiJjb2RlcnRoZW1lcy5jb20iLCJzdWIiOiJzdXBwb3J0QGNvZGVydGhlbWVzLmNvbSIsImxhc3ROYW1lIjoiVGVzdCIsIkVtYWlsIjoic3VwcG9ydEBjb2RlcnRoZW1lcy5jb20iLCJSb2xlIjoiQWRtaW4iLCJmaXJzdE5hbWUiOiJIeXBlciJ9.P27f7JNBF-vOaJFpkn-upfEh3zSprYfyhTOYhijykdI';


export default function useLogin() {
	const [loading, setLoading] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();

	const { isAuthenticated, saveSession } = useAuthContext();

	const redirectUrl = useMemo(
		() => (location.state && location.state.from ? location.state.from.pathname : '/'),
		[location.state]
	);

	// Login function
	const login = async ({ email, password }: { email: string; password: string }) => {
		setLoading(true);
		try {
			// Call API for login
			const res = await fetch(`${config.API_URL_APPLICATION}/Login/GetLogin`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			});

			if (!res.ok) {
				throw new Error('Failed to connect to the API');
			}

			const data = await res.json();
			console.log(data)

			// Ensure API response is valid
			if (data.isSuccess && data.getEmployeeDetailsbyEmpId) {
				const userDetails = data.getEmployeeDetailsbyEmpId;
				console.log(userDetails)

				// Validate required properties before saving session
				if (!userDetails.empID) {
					throw new Error('Invalid login response: Missing required fields');
				}

				localStorage.setItem('EmpId', userDetails.empID);
				localStorage.setItem('role', userDetails.role);
				localStorage.setItem('EmpName', userDetails.employeeName);
				localStorage.setItem('token', TOKEN);

				// Save session in authentication context
				saveSession({
					empID: userDetails.empID,
					employeeName: userDetails.employeeName,
					mobileNumber: userDetails.mobileNumber,
					dateOfBirth: userDetails.dateOfBirth,
					dateOfJoining: userDetails.dateOfJoining,
					roles: userDetails.role,
					token: TOKEN,
				});

				// Store token securely (localStorage or sessionStorage)
				localStorage.setItem('authToken', TOKEN);

				// Redirect user after successful login
				navigate(redirectUrl);
			} else {
				throw new Error(data.message || 'Login failed');
			}

		} catch (error: any) {
			console.error('Login Error:', error.message);
			alert(error.message); // Replace with your UI error-handling mechanism
		} finally {
			setLoading(false);
		}
	};

	return { loading, login, redirectUrl, isAuthenticated };
}
