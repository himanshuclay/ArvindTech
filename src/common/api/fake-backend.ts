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

      console.log(response.data)

      if (isSuccess && loginData && loginData.length) {
        const user = loginData[0];

        // Store token and role in localStorage (adjust as necessary)
        localStorage.setItem('token', TOKEN); // Use actual token if available in response
        localStorage.setItem('EmpId', user.email);
        localStorage.setItem('role', user.role);
        localStorage.setItem('EmpName', user.employeeName);

        const userWithToken = {
          ...user,
          token: user.token || 'fake-token-for-dev',
        };


        // window.location.href = '/dashboard';
       
        return { status: 200, data: userWithToken };
      } else {
        return { status: 401, message: 'Email or password is incorrect' };
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('You have entered incorrect credentials')
      return { status: 500, message: 'Something went wrong. Please try again later.' };
    }
  }




  mock.onPost('/login').reply(async function (config) {
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
  });


  // mock.onPost('/login').reply(function (config) {
  //   return new Promise(function (resolve, reject) {
  //     setTimeout(function () {
  //       const params = JSON.parse(config.data);

  //       const filteredUsers = users.filter((user) => {
  //         return user.email === params.email && user.password === params.password;
  //       });

  //       if (filteredUsers.length) {
  //         const user = filteredUsers[0];

  //         // Store token and role in localStorage
  //         localStorage.setItem('token', user.token);
  //         localStorage.setItem('EmpId', user.EmpId);
  //         localStorage.setItem('role', user.role);
  //         localStorage.setItem('EmpName', user.EmpName);

  //         resolve([200, user]);
  //       } else {
  //         resolve([401, { message: 'Email or password is incorrect' }]);
  //       }
  //     }, 1000);
  //   });
  // });

  // mock.onPost('/register').reply(function (config) {
  //   return new Promise(function (resolve, reject) {
  //     setTimeout(function () {
  //       const params = JSON.parse(config.data);

  //       const [firstName, lastName] = params.fullname.split(' ');
  //       const newUser: User = {
  //         id: users.length + 1,
  //         email: params.email,
  //         username: firstName,
  //         password: params.password,
  //         firstName: firstName,
  //         lastName: lastName,
  //         EmpId: params.EmpId,
  //         EmpName:params.EmpName,
  //         role: params.role,
  //         token: TOKEN,
  //       };
  //       users.push(newUser);

  //       resolve([200, newUser]);
  //     }, 1000);
  //   });
  // });

  // mock.onPost('/forget-password').reply(function (config) {
  //   return new Promise(function (resolve, reject) {
  //     setTimeout(function () {
  //       const params = JSON.parse(config.data);

  //       const filteredUsers = users.filter((user) => {
  //         return user.email === params.email;
  //       });

  //       if (filteredUsers.length) {
  //         const responseJson = {
  //           message: "We've sent you a link to reset your password to your registered email.",
  //         };
  //         resolve([200, responseJson]);
  //       } else {
  //         resolve([401, { message: 'Sorry, we could not find any registered user with the entered email.' }]);
  //       }
  //     }, 1000);
  //   });
  // });
}
