import faker from 'faker';
// utils
import fakeRequest from '../utils/fakeRequest';
import { verify, sign } from '../utils/jwt';
import { auth, provider } from '../adapter/firebase';
//
import mock from './mock';
import axios from 'axios';
// ----------------------------------------------------------------------

const JWT_SECRET = 'minimal-secret-key';
const JWT_EXPIRES_IN = '5 days';

const users = [
   {
      id: '8864c717-587d-472a-929a-8e5f298024da-0',
      displayName: 'Jaydon Frankie',
      email: 'demo@minimals.cc',
      password: 'demo1234',
      photoURL: '/static/mock-images/avatars/avatar_default.jpg',
      phoneNumber: '+40 777666555',
      country: 'United States',
      address: '90210 Broadway Blvd',
      state: 'California',
      city: 'San Francisco',
      zipCode: '94116',
      about: faker.lorem.paragraphs(),
      role: 'admin',
      isPublic: true
   }
];

// ----------------------------------------------------------------------

mock.onPost('/api/account/login').reply(async () => {
   try {
      const authData = await auth.signInWithPopup(provider)

         .then(async (result) => {
            var token = result.user.multiFactor.user.accessToken;
            var mail = result.user.email;
            var postData = {
               token: token,
               mail: mail,
            };
            let axiosConfig = {
               headers: {
                  'Content-Type': 'application/json;charset=UTF-8',
                  "Access-Control-Allow-Origin": "*",
               }
            };
            const axiosData = axios.post('https://api.pimo.studio/api/v1/auth', postData, axiosConfig)
               .then((res) => {
                  const user = {
                     id: '8864c717-587d-472a-929a-8e5f298024da-0',
                     displayName: 'Jaydon Frankie',
                     email: 'demo@minimals.cc',
                     // password: 'demo1234',
                     photoURL: '/static/mock-images/avatars/avatar_default.jpg',
                     phoneNumber: '+40 777666555',
                     // country: 'United States',
                     address: '90210 Broadway Blvd',
                     // state: 'California',
                     // city: 'San Francisco',
                     // zipCode: '94116',
                     about: faker.lorem.paragraphs(),
                     role: 'admin',
                     isPublic: true
                  }
                  const accessToken = res.data.jwt;
                  return [{ accessToken, user }];

               })
            return await axiosData;
         })
         .catch(function (error) {
            console.log(error);
         });
      const accessToken = authData[0].accessToken
      const user = authData[0].user
      return [200, { accessToken, user }];
   } catch (error) {
      return [500, { message: 'Internal server error' }];
   }
});

// ----------------------------------------------------------------------

mock.onPost('/api/account/register').reply(async (config) => {
   try {
      await fakeRequest(1000);

      const { email, password, firstName, lastName } = JSON.parse(config.data);
      let user = users.find((_user) => _user.email === email);

      if (user) {
         return [400, { message: 'There already exists an account with the given email address.' }];
      }

      user = {
         id: faker.datatype.uuid(),
         displayName: `${firstName} ${lastName}`,
         email,
         password,
         photoURL: null,
         phoneNumber: null,
         country: null,
         address: null,
         state: null,
         city: null,
         zipCode: null,
         about: null,
         role: 'user',
         isPublic: true
      };

      const accessToken = sign({ userId: user.id }, JWT_SECRET, {
         expiresIn: JWT_EXPIRES_IN
      });

      return [200, { accessToken, user }];
   } catch (error) {
      console.error(error);
      return [500, { message: 'Internal server error' }];
   }
});

// ----------------------------------------------------------------------

mock.onGet('/api/account/my-account').reply((config) => {
   try {
      const { Authorization } = config.headers;

      if (!Authorization) {
         return [401, { message: 'Authorization token missing' }];
      }

      const accessToken = Authorization.split(' ')[1];
      const { userId } = verify(accessToken, JWT_SECRET);
      const user = users.find((_user) => _user.id === userId);

      if (!user) {
         return [401, { message: 'Invalid authorization token' }];
      }

      return [200, { user }];
   } catch (error) {
      console.error(error);
      return [500, { message: 'Internal server error' }];
   }
});
