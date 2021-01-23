import axios from 'axios'
import router from './router'
import {SERVER_URL} from "./config";
import {ToastProgrammatic as Toast} from 'buefy'

const instance = axios.create({
  baseURL: SERVER_URL,
  timeout: 1000
});

// instance.interceptors.response.use(function (response) {
//   return response;
// }, function (error) {
//   if (error.response.status === 401) { // Unauthorized
//     Toast.open({
//       message: 'Your session is expired, please login again',
//       type: 'is-danger',
//     });
//     router.push({name: 'login'})
//   } else if (error.response.status === 403) { // Forbidden
//     Toast.open({
//       message: 'You don\'t have permissions to do this action',
//       type: 'is-danger',
//     })
//   } else if (error.response.status === 404) { // Page not found
//     Toast.open({
//       message: 'Page does not exist!',
//       type: 'is-danger',
//     });
//     router.push({name: 'error'})
//   } else if (error.response.status === 412) { // Precondition failed
//     Toast.open({
//       duration: 5000,
//       message: 'Looks like your data is outdated, please refresh the page before continuing',
//       type: 'is-warning',
//     })
//   }
//   return Promise.reject(error);
//
// });

export default {

  saveToken: (token) => {
    instance.defaults.headers.common["X-Authorization"] = token
  },

  removeToken: () => delete instance.defaults.headers.common["X-Authorization"],

  signup: (payload) => instance.post('/users/register', payload),

  login: (payload) => instance.post('/users/login', payload),

  logout: () => instance.post('/users/logout', null, {
    headers: {
      'X-Authorization': sessionStorage.getItem('token')
    }
  }),

  editUserProfile: (userId, payload) => instance.patch(`/users/${userId}`, payload, {
    headers: {
      'X-Authorization': sessionStorage.getItem('token')
    }
  }),


  getProfileById: (userId) => instance.get(`/users/${userId}`, {
    headers: {
      "X-Authorization": sessionStorage.getItem('token'),
    }
  }),

  getUserPicture: (userId) => instance.get(`/users/${userId}/photo`),

  postUserPicture:(userId, payload, imageType) => instance.put(`/users/${userId}/photo`, payload, {
    headers: {
      "X-Authorization": sessionStorage.getItem('token'),
      "Content-Type": imageType
    }
  }),

  deleteUserPicture:(userId) => instance.delete(`/users/${userId}/photo`, {
    headers: {
      "X-Authorization": sessionStorage.getItem('token')
    }
  }),

  postPetitionPhoto:(petitionId, payload, imageType) => instance.put(`/petitions/${petitionId}/photo`, payload, {
    headers: {
      "X-Authorization": sessionStorage.getItem('token'),
      "Content-Type": imageType
    }
  }),

  signPetition:(petitionId) => instance.post(`/petitions/${petitionId}/signatures`, null, {
    headers: {
      "X-Authorization": sessionStorage.getItem('token')
    }
  }),

  editUserPetition:(petitionId, payload) => instance.patch(`/petitions/${petitionId}`, payload, {
    headers: {
      "X-Authorization": sessionStorage.getItem('token')
    }
  }),

  getMyPetitions: (searchParams) => instance.get(`/petitions`, { params: searchParams }),

  getSinglePetition: (petitionId) => instance.get(`/petitions/${petitionId}`),

  deleteAPetition: (petitionId) => instance.delete(`/petitions/${petitionId}`, {
    headers: {
      "X-Authorization": sessionStorage.getItem('token')
    }
  }),

  getSinglePetitionPhoto: (petitionId) => instance.get(`/petitions/${petitionId}/photo`),

  getAllPetitions: () => instance.get('/petitions'),

  createAPetition: (payload) => instance.post('/petitions', payload, {
    headers: {
      "X-Authorization": sessionStorage.getItem('token')
    }
  }),

  signAPetition: (petitionId) => instance.post(`/petitions/${petitionId}/signatures`, null, {
    headers: {
      "X-Authorization": sessionStorage.getItem('token')
    }
  }),

  deleteSignaturePetition: (petitionId) => instance.delete(`/petitions/${petitionId}/signatures`, {
    headers: {
      "X-Authorization": sessionStorage.getItem('token')
    }
  }),

  getAllSignaturesPetition: (petitionId) => instance.get(`/petitions/${petitionId}/signatures`, {
    headers: {
      "X-Authorization": sessionStorage.getItem('token')
    }
  }),

  getAllCategories: () => instance.get('/petitions/categories')
}
