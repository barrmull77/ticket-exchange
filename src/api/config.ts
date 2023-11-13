import axios from 'axios';
const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const BASE_LOGIN_URL = process.env.REACT_APP_API_LOGIN_URL;


export const axiosLoginInstance = axios.create({
    baseURL: BASE_LOGIN_URL,
    headers: { 'Content-Type': 'application/json' }
});

export const axiosCommonInstance = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});

export const axiosPatchInstance = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/merge-patch+json' }
});
