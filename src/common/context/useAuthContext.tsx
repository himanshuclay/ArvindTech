import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import axios, { AxiosError } from 'axios';
import config from '@/config';

// Define the User type based on API response
type User = {
	empID: string;
	employeeName: string;
	mobileNumber?: string;
	dateOfBirth: string;
	dateOfJoining: string;
	roles: string;
	token: string;
};

// Define the shape of the AuthContext
interface AuthContextType {
	user?: User;
	isAuthenticated: boolean;
	login: (email: string, password: string) => Promise<{ status: number; message?: string }>;
	logout: () => void;
	saveSession: (user: User) => void;
	removeSession: () => void;
	updateRole: (newRole: string) => void; // Function to update role dynamically
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook for using AuthContext
export function useAuthContext() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuthContext must be used within an AuthProvider');
	}
	return context;
}

// Storage keys
const authSessionKey = '_AUTH_SESSION_ARVIND';
const authTokenKey = '_AUTH_TOKEN_ARVIND_KEY';

// AuthProvider component
export function AuthProvider({ children }: { children: ReactNode }) {
	// Load session from localStorage


	const TOKEN =
		'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJjb2RlcnRoZW1lcyIsImlhdCI6MTU4NzM1NjY0OSwiZXhwIjoxOTAyODg5NDQ5LCJhdWQiOiJjb2RlcnRoZW1lcy5jb20iLCJzdWIiOiJzdXBwb3J0QGNvZGVydGhlbWVzLmNvbSIsImxhc3ROYW1lIjoiVGVzdCIsIkVtYWlsIjoic3VwcG9ydEBjb2RlcnRoZW1lcy5jb20iLCJSb2xlIjoiQWRtaW4iLCJmaXJzdE5hbWUiOiJIeXBlciJ9.P27f7JNBF-vOaJFpkn-upfEh3zSprYfyhTOYhijykdI';

	const [user, setUser] = useState<User | undefined>(
		localStorage.getItem(authSessionKey)
			? JSON.parse(localStorage.getItem(authSessionKey) || '{}')
			: undefined
	);

	// Save session in localStorage and state
	const saveSession = useCallback((user: User) => {
		localStorage.setItem(authSessionKey, JSON.stringify(user));
		localStorage.setItem(authTokenKey, user.token || '');
		setUser(user);
	}, []);

	// Remove session from localStorage
	const removeSession = useCallback(() => {
		localStorage.removeItem(authSessionKey);
		localStorage.removeItem(authTokenKey);
		setUser(undefined);
	}, []);

	// Login function with API call
	const login = async (email: string, password: string): Promise<{ status: number; message?: string }> => {
		try {
			const response = await axios.post(`${config.API_URL_APPLICATION}/Login/GetLogin`, { email, password });
			const data = response.data;

			if (data.isSuccess && data.getEmployeeDetailsbyEmpId) {
				const userDetails = data.getEmployeeDetailsbyEmpId;
				const userData: User = {
					empID: userDetails.empID,
					employeeName: userDetails.employeeName,
					mobileNumber: userDetails.mobileNumber,
					dateOfBirth: userDetails.dateOfBirth,
					dateOfJoining: userDetails.dateOfJoining,
					roles: userDetails.role,
					token: TOKEN,
				};

				saveSession(userData);
				return { status: 200, message: data.message };
			}

			return { status: 400, message: data.message || 'Login failed. Invalid response.' };
		} catch (error: unknown) {
			const axiosError = error as AxiosError;
			console.error('Login failed:', axiosError);

			return {
				status: axiosError.response?.status || 500,
				message: axiosError.response?.data?.message || 'Login failed. Please try again.',
			};
		}
	};

	// Logout function
	const logout = useCallback(() => {
		removeSession();
	}, [removeSession]);

	// Function to update role dynamically
	const updateRole = (newRole: string) => {
		if (user) {
			const updatedUser = { ...user, roles: newRole, roleName: newRole };
			setUser(updatedUser);
			localStorage.setItem(authSessionKey, JSON.stringify(updatedUser)); // Persist updated role
		}
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated: Boolean(user),
				login,
				logout,
				saveSession,
				removeSession,
				updateRole, // Provide updateRole function in context
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
