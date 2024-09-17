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
  EmpName:string;
  token: string;
};

const TOKEN =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJjb2RlcnRoZW1lcyIsImlhdCI6MTU4NzM1NjY0OSwiZXhwIjoxOTAyODg5NDQ5LCJhdWQiOiJjb2RlcnRoZW1lcy5jb20iLCJzdWIiOiJzdXBwb3J0QGNvZGVydGhlbWVzLmNvbSIsImxhc3ROYW1lIjoiVGVzdCIsIkVtYWlsIjoic3VwcG9ydEBjb2RlcnRoZW1lcy5jb20iLCJSb2xlIjoiQWRtaW4iLCJmaXJzdE5hbWUiOiJIeXBlciJ9.P27f7JNBF-vOaJFpkn-upfEh3zSprYfyhTOYhijykdI';

const mock = new MockAdapter(axios, { onNoMatch: 'passthrough' });

const users: User[] = [
  // Predefined users
  {
    id: 1,
    email: 'shikar@arvind.com',
    username: 'Velonic',
    password: 'Admin',
    firstName: 'Velonic',
    lastName: 'Techzaa',
    EmpId: 'LLP02430',
    EmpName:'Shikar',
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
    EmpName:'Pamula',
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
    EmpName:'Lovel',
    role: 'User',
    token: TOKEN,
  },
  {
    id: 4,
    email: 'LLP05575',
    username: 'Doer',
    password: 'Admin',
    firstName: 'Admin',
    lastName: 'One',
    EmpId: 'LLP05575',
    EmpName:'Mohd.Sameer',
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
    EmpName:'Aushutosh',
    role: 'User',
    token: TOKEN,
  },
  {
    id: 6,
    email: 'LLP06279',
    username: 'Doer',
    password: 'Admin',
    firstName: 'Admin',
    lastName: 'One',
    EmpId: 'LLP06279',
    EmpName:'Nitiesh',
    role: 'User',
    token: TOKEN,
  },
  {
    id: 7,
    email: 'LLP03087',
    username: 'Doer',
    password: 'Admin',
    firstName: 'Admin',
    lastName: 'One',
    EmpId: 'LLP03087',
    EmpName:'Himanshu',
    role: 'User',
    token: TOKEN,
  },
  {
    id: 8,
    email: 'ID1234',
    username: 'Doer',
    password: 'Admin',
    firstName: 'Admin',
    lastName: 'One',
    EmpId: 'ID1234',
    EmpName:'Hemant',
    role: 'User',
    token: TOKEN,
  },
  {
    id: 8,
    email: 'ID1234',
    username: 'Doer',
    password: 'Admin',
    firstName: 'Admin',
    lastName: 'One',
    EmpId: 'ID1234',
    EmpName:'Hemant',
    role: 'User',
    token: TOKEN,
  },
  // Other users...

];

export default function configureFakeBackend() {
  mock.onPost('/login').reply(function (config) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        const params = JSON.parse(config.data);

        const filteredUsers = users.filter((user) => {
          return user.email === params.email && user.password === params.password;
        });

        if (filteredUsers.length) {
          const user = filteredUsers[0];

          // Store token and role in localStorage
          localStorage.setItem('token', user.token);
          localStorage.setItem('EmpId', user.EmpId);
          localStorage.setItem('role', user.role);
          localStorage.setItem('EmpName', user.EmpName);

          resolve([200, user]);
        } else {
          resolve([401, { message: 'Email or password is incorrect' }]);
        }
      }, 1000);
    });
  });

  mock.onPost('/register').reply(function (config) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        const params = JSON.parse(config.data);

        const [firstName, lastName] = params.fullname.split(' ');
        const newUser: User = {
          id: users.length + 1,
          email: params.email,
          username: firstName,
          password: params.password,
          firstName: firstName,
          lastName: lastName,
          EmpId: params.EmpId,
          EmpName:params.EmpName,
          role: params.role,
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
        const params = JSON.parse(config.data);

        const filteredUsers = users.filter((user) => {
          return user.email === params.email;
        });

        if (filteredUsers.length) {
          const responseJson = {
            message: "We've sent you a link to reset your password to your registered email.",
          };
          resolve([200, responseJson]);
        } else {
          resolve([401, { message: 'Sorry, we could not find any registered user with the entered email.' }]);
        }
      }, 1000);
    });
  });
}