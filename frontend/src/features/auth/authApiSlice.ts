import { apiSlice } from "../../app/api/apiSlice";
import { logOut, setCredentials } from "./authSlice";
export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        sendLogout: builder.mutation<any, void>({
            query: () => ({
                url: '/auth/logout',
                method: 'GET',
                credentials: 'include',
                withCredentials: true,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled
                    dispatch(logOut())
                    dispatch(apiSlice.util.resetApiState())
                } catch (err) {
                    console.log(err)
                }
            }
        }),
        googleLogin: builder.mutation({
            query: codeFromGoogle => ({
                url: `${import.meta.env.VITE_API_URL}/auth/google?code=${codeFromGoogle}&redirect_uri=${import.meta.env.VITE_BASE_URL}/auth/google`,
                method: 'GET',
                credentials: 'include',
                withCredentials: true,
            }),
        }),
        getUserInfo: builder.query<any, void>({
            query: () => ({
                url: '/auth/userinfo',
                method: 'GET',
                credentials: 'include',
                withCredentials: true,
            }),
            providesTags: ['User'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    dispatch(setCredentials(data))
                    return data
                } catch (err) {
                    return
                }
            },
        })
    }),
})

export const {
    useSendLogoutMutation,
    useGoogleLoginMutation,
    useGetUserInfoQuery,
} = authApiSlice