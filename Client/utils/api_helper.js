import axios from 'axios';
import Cookies from 'js-cookie';
// import { error } from "toastr"
// import accessToken from "./jwt-token-access/accessToken"

const token =
  typeof window !== 'undefined' &&
  Cookies.get('token') &&
  Cookies.get('token') != undefined
    ? JSON.parse(Cookies.get('token') ?? '""') || ''
    : '';

//apply base url for axios
const API_URL = process.env.NEXT_PUBLIC_BASE_URL + '/api/';
console.log('base url == ', API_URL);
const axiosApi = axios.create({
  baseURL: API_URL,
});

axiosApi.defaults.headers.common['Authorization'] = 'Bearer ' + token;

axiosApi.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export async function get(url, config = {}) {
  console.log('getting', url);
  return await axiosApi
    .get(url, { ...config })
    .then((response) => response.data);
}

export async function post(url, data, config = {}) {
  return await axiosApi
    .post(url, { ...data }, { ...config })
    .then((response) => {
      return response;
    })
    .catch((e) => {
      console.log(e);
      throw e;
    });
}

export async function put(url, data, config = {}) {
  return axiosApi
    .put(url, { ...data }, { ...config })
    .then((response) => response);
}

export async function del(url, config = {}) {
  return await axiosApi.delete(url, { ...config }).then((response) => response);
}
