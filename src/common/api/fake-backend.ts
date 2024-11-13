import axios, { AxiosError } from 'axios';
import MockAdapter from 'axios-mock-adapter';
// import { Message } from 'rsuite';
// import config from '@/config';


// type User = {
//   id: number;
//   email?: string;
//   username: string;
//   password: string;
//   firstName: string;
//   lastName: string;
//   EmpId: string;
//   role: string;
//   EmpName:string;
//   token: string;
// };

const TOKEN =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJjb2RlcnRoZW1lcyIsImlhdCI6MTU4NzM1NjY0OSwiZXhwIjoxOTAyODg5NDQ5LCJhdWQiOiJjb2RlcnRoZW1lcy5jb20iLCJzdWIiOiJzdXBwb3J0QGNvZGVydGhlbWVzLmNvbSIsImxhc3ROYW1lIjoiVGVzdCIsIkVtYWlsIjoic3VwcG9ydEBjb2RlcnRoZW1lcy5jb20iLCJSb2xlIjoiQWRtaW4iLCJmaXJzdE5hbWUiOiJIeXBlciJ9.P27f7JNBF-vOaJFpkn-upfEh3zSprYfyhTOYhijykdI';

  const mock = new MockAdapter(axios, { onNoMatch: 'passthrough' });

  interface ErrorResponse {
    message: string;
    // Add any other properties if your error response contains more details
  }

  export default function configureFakeBackend() {
    async function loginUser(email: string, password: string) {
      try {
        // Make the API call to login
        const response = await axios.post('https://arvindo-api2.clay.in/api/Login/GetLogin', {
          email,
          password,
        });
  
        const { isSuccess, message, loginData, getEmployeeDetailsbyEmpId ,token} = response.data;
  
        console.log(response.data);
  
        if (isSuccess) {
          let user;
          if (loginData) {
            // For previous response structure
            user = loginData;
          } else if (getEmployeeDetailsbyEmpId) {
            // For current response structure
            user = getEmployeeDetailsbyEmpId;
          }
  
          // Store the token and role in localStorage (adjust as necessary)
          localStorage.setItem('EmpId', user.email || user.empID);
          localStorage.setItem('role', user.role);
          localStorage.setItem('EmpName', user.employeeName);
          localStorage.setItem('token', token);
  
          // Assuming token is still a static value for dev purposes
          const userWithToken = {
            ...user,
            token: TOKEN, // Replace with actual token if provided
          };
  
          // Navigate to the dashboard if needed
          // window.location.href = '/dashboard';
  
          return { status: 200, data: userWithToken };
        } else {
          return Promise.reject({ status: 401, message: message || 'Email or password is incorrect' });
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('You have entered incorrect credentials');
        return Promise.reject({ status: 500, message: 'Something went wrong. Please try again later.' });
      }
    }
  
    // Mock API call handling
    mock.onPost('/login').reply(async function (config) {
      try {
        const params = JSON.parse(config.data);
        const { email, password } = params;
  
        // Call the loginUser function to handle the actual API login
        const result = await loginUser(email, password);
  
        if (result && result.status === 200) {
          return [200, result.data]; // Return success response
        } else {
          return [result.status || 400, { message: 'Login failed' }]; // Return error response
        }
      } catch (error) {
        console.error('Mock login error:', error);
        const axiosError = error as AxiosError;
        const status = axiosError.response?.status || 500;
        const message = (axiosError.response?.data as ErrorResponse)?.message || 'Login failed. Please try again.';
  
        return [status, { message }];
      }
    });
  }
  

