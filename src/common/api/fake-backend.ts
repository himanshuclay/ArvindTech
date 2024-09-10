import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

type User = {
  id: number;
  email?: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  EmpId: string;
  role: string;
  token: string;
};

const TOKEN =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJjb2RlcnRoZW1lcyIsImlhdCI6MTU4NzM1NjY0OSwiZXhwIjoxOTAyODg5NDQ5LCJhdWQiOiJjb2RlcnRoZW1lcy5jb20iLCJzdWIiOiJzdXBwb3J0QGNvZGVydGhlbWVzLmNvbSIsImxhc3ROYW1lIjoiVGVzdCIsIkVtYWlsIjoic3VwcG9ydEBjb2RlcnRoZW1lcy5jb20iLCJSb2xlIjoiQWRtaW4iLCJmaXJzdE5hbWUiOiJIeXBlciJ9.P27f7JNBF-vOaJFpkn-upfEh3zSprYfyhTOYhijykdI';

const mock = new MockAdapter(axios, { onNoMatch: 'passthrough' });

const users: User[] = [
  {
    id: 1,
    email: 'shikar@arvind.com',
    username: 'Velonic',
    password: 'Admin',
    firstName: 'Velonic',
    lastName: 'Techzaa',
    EmpId: 'LLP02430',
    role: 'Admin',
    token: TOKEN,
  },
  {
    id: 2,
    email: 'LLP02556',
    username: 'Doer',
    password: 'Admin',
    firstName: 'Admin',
    lastName: 'One',
    EmpId: 'LLP02556',
    role: 'User',
    token: TOKEN,
  },
  {
    id: 3,
    email: 'LLP01878',
    username: 'Doer',
    password: 'Admin',
    firstName: 'Admin',
    lastName: 'One',
    EmpId: 'LLP01878',
    role: 'User',
    token: TOKEN,
  },
  {
    id: 4,
    email: 'LLP06278',
    username: 'Doer',
    password: 'Admin',
    firstName: 'Admin',
    lastName: 'One',
    EmpId: 'LLP06278',
    role: 'User',
    token: TOKEN,
  },
  {
    id: 5,
    email: 'LLP04462',
    username: 'Doer',
    password: 'Admin',
    firstName: 'Admin',
    lastName: 'One',
    EmpId: 'LLP04462',
    role: 'User',
    token: TOKEN,
  },
  {
    id: 6,
    email: 'LLP02556',
    username: 'Doer',
    password: 'Admin',
    firstName: 'Admin',
    lastName: 'One',
    EmpId: 'LLP02556',
    role: 'User',
    token: TOKEN,
  },
  {
    id: 7,
    email: 'LLP05575',
    username: 'Doer',
    password: 'Admin',
    firstName: 'Admin',
    lastName: 'One',
    EmpId: 'LLP05575',
    role: 'User',
    token: TOKEN,
  },
];

export default function configureFakeBackend() {
  mock.onPost('/login').reply(function (config) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        // get parameters from post request
        const params = JSON.parse(config.data);

        // find if any user matches login credentials
        const filteredUsers = users.filter((user) => {
          return user.email === params.email && user.password === params.password;
        });

        if (filteredUsers.length) {
          // if login details are valid, return user details and fake jwt token
          const user = filteredUsers[0];

          // Store token and EmpId in local storage
          localStorage.setItem('token', user.token);
          localStorage.setItem('EmpId', user.EmpId);

          resolve([200, user]);
        } else {
          // else return error
          resolve([401, { message: 'Email or password is incorrect' }]);
        }
      }, 1000);
    });
  });

  mock.onPost('/register').reply(function (config) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        // get parameters from post request
        const params = JSON.parse(config.data);

        // add new users
        const [firstName, lastName] = params.fullname.split(' ');
        const newUser: User = {
          id: users.length + 1,
          email: params.email,
          username: firstName,
          password: params.password,
          firstName: firstName,
          lastName: lastName,
          EmpId: params.EmpId,
          role: 'Admin',
          token: TOKEN,
        };
        users.push(newUser);

        resolve([200, newUser]);
      }, 1000);
    });
  });

  mock.onPost('/forget-password').reply(function (config) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        // get parameters from post request
        const params = JSON.parse(config.data);

        // find if any user matches login credentials
        const filteredUsers = users.filter((user) => {
          return user.email === params.email;
        });

        if (filteredUsers.length) {
          // if login details are valid return a success message
          const responseJson = {
            message: "We've sent you a link to reset your password to your registered email.",
          };
          resolve([200, responseJson]);
        } else {
          // else return error
          resolve([401, { message: 'Sorry, we could not find any registered user with the entered email.' }]);
        }
      }, 1000);
    });
  });
}
