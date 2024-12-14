import axios, { AxiosError } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '@/config';



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
      const response = await axios.post(`${config.API_URL_APPLICATION}/Login/GetLogin`, {
        email,
        password,
      });

      const { isSuccess, message, loginData, getEmployeeDetailsbyEmpId, token } = response.data;

      console.log(response.data);

      if (isSuccess) {
        let user;
        if (loginData) {
          user = loginData;
        } else if (getEmployeeDetailsbyEmpId) {
          user = getEmployeeDetailsbyEmpId;
        }

        localStorage.setItem('EmpId', user.email || user.empID);
        localStorage.setItem('role', user.role);
        localStorage.setItem('EmpName', user.employeeName);
        localStorage.setItem('token', token);

        const userWithToken = {
          ...user,
          token: TOKEN,
        };

        localStorage.clear();
        return { status: 200, data: userWithToken };
      } else {
        toast.error(message || 'Email or password is incorrect');
        return Promise.reject({ status: 401, message: message || 'Email or password is incorrect' });
      }
    } catch (error: any) {
      localStorage.setItem('errorMessage', error);
      // toast.error(error); 
      console.error('Login error:', error);
      return Promise.reject({ status: 500, message: 'Something went wrong. Please try again later.' });
    }
  }

  // Mock API call handling
  mock.onPost('/login').reply(async function (config) {
    try {
      const params = JSON.parse(config.data);
      const { email, password } = params;

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


