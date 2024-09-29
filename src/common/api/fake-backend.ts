import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';


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


export default function configureFakeBackend() {

  async function loginUser(email: string, password: string) {
    try {
      // Make real API call to login
      const response = await axios.post('https://arvindo-api2.clay.in/api/Login/Login', {
        email,
        password,
      });

      const { isSuccess, message, loginData } = response.data;

      console.log(response.data);

      if (isSuccess && loginData) {
        const user = loginData;

        // Store token and role in localStorage (adjust as necessary)
        localStorage.setItem('EmpId', user.email);
        localStorage.setItem('role', user.role);
        localStorage.setItem('EmpName', user.employeeName);

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

  mock.onPost('/login').reply(async function (config) {
    try {
      const params = JSON.parse(config.data);
      const { email, password } = params;

      // Call the loginUser function to handle real API login
      const result = await loginUser(email, password);

      // Return the response from the real API
      if (result.status === 200) {
        return [200, result.data];
      } else {
        return [result.status, { message: result.message }];
      }
    } catch (error) {
      // Handle the error inside the mock handler
      console.error('Mock login error:', error);
      return [error.status || 500, { message: error.message || 'Unknown error occurred' }];
    }
  });
}

