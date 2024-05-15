import axios from 'axios';
import { CookieService } from '@/shared/lib/cookie/CookieService';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

export let context = {} as { token?: string; cookie?: ReadonlyRequestCookies };

export const setContext = (_context: { token?: string; cookie?: ReadonlyRequestCookies }) => {
    context = _context;
};
export const axiosInstance = axios.create({
    maxBodyLength: 8388608,
    maxContentLength: 8388608,
    withCredentials: false,
    timeout: 360000,
    baseURL: '/api',
    responseType: 'json',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,Route,POST,PUT',
        'Access-Control-Allow-Header': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
    },
});

axiosInstance.interceptors.request.use((config) => {
    let token = CookieService.get('token');
    if (!token) {
        token = context?.token || context?.cookie?.get?.('token')?.value;
    }

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});
export const $api = axios.create({
    maxBodyLength: 8388608,
    maxContentLength: 8388608,
    withCredentials: false,
    timeout: 360000,
    baseURL: 'http://77.222.53.231:8080/',
    responseType: 'json',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,Route,POST,PUT',
        'Access-Control-Allow-Header': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
    },
});

$api.interceptors.request.use((config) => {
    let token = CookieService.get('token') || context.token;
    console.log({ token1: token });
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});
