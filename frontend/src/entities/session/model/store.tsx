type IAuthContextType = {
    user: any;
    isLogged?: boolean;
};
// export const {} = createContext<IAuthContextType, { initialUser: any }>((data) => {
//     const user = axiosInstance.get<UserType>('/current');
// });
