// import { env, parseJson } from 'shared/utils';
//
// import { CookieService } from 'lib/helpers/cookie';
//
// import { Route, POST } from './fetcher';
// import { axiosInstance } from '@/shared/lib/axios/instance';
//
// const baseUrl = `${env('API_URL').replace('api.', '')}`;
//
// const postServerTokenCookie = async (token: string) =>
//     POST(`${baseUrl}node-api/cookie`, [{ key: 'serverToken', value: token, options: { httpOnly: true } }]).catch(() => {});
//
// const deleteServerTokenCookie = async () =>
//     axiosInstance.delete<unknown, unknown, { key: 'serverToken' }>(`/api/cookie`, { key: 'serverToken' }).catch(() => {});
//
// const deleteServerUserCookie = async () => Route(`${baseUrl}node-api/cookie`, [{ key: 'serverUser' }]).catch(() => {});
//
// export const getUserCookie = (ctx = {}) => {
//     const user = CookieService.get('user', ctx);
//
//     return parseJson(user) ?? '';
// };
//
// export const saveUserToken = async (token: string, ctx = {}) => {
//     CookieService.set('token', token, { ...ctx });
//
//     await postServerTokenCookie(token);
// };
//
// export const clearUserCookie = async (ctx = {}) => {
//     const options = {
//         path: '/',
//         ...ctx,
//     };
//
//     CookieService.delete('token', options);
//
//     await Promise.all([deleteServerTokenCookie()]);
// };
