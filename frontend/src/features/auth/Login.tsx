import queryString from 'query-string';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Loading } from '../../assets/Loading';
import { useGetUserInfoQuery, useGoogleLoginMutation, useSendLogoutMutation } from '../auth/authApiSlice';
function Login() {

    const location = useLocation();
    const [logout] = useSendLogoutMutation()
    let [googleLogin] = useGoogleLoginMutation()

    const socialLogin = async () => {
        try {
            const { search } = location
            const codeFromGoogle = search.slice(6) // to get the value of the code query param.
            await googleLogin(codeFromGoogle)
                .then(() => window.location.replace('/'))
        } catch (err) {
            console.error(err)
        }
    }

    const { pathname } = location;
    if (pathname === '/auth/google') {

        useEffect(() => {
            socialLogin()
        }, [])
        return (
            <Loading />
        )

    } else {
        // the app continues with its normal logic

        const { isError, isLoading } = useGetUserInfoQuery()
        if(isLoading) {
            return (
                <Loading />
            )
        }
        if (!isLoading && !isError) {
            const content = (
                <section className='login-section'>
                    <form className='login-form'>
                        <button type='button'
                            id="login"
                            className='login-form-button'
                            onClick={() => logout()}
                        >
                            <p>Click to Log Out</p>
                        </button>
                    </form>
                </section>
            )
            return content
        } else {
            const queryParams = queryString.stringify({
                client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID, // It must correspond to what we declared earlier in the backend
                scope: 'profile email', // This is the user data you have access to, in our case its just the mail.
                redirect_uri: `${import.meta.env.VITE_BASE_URL}/auth/google`, // This is the uri that will be redirected to if the user signs into his google account successfully
                auth_type: 'rerequest', // This tells the consent screen to reappear if the user initially entered wrong credentials into the google modal
                display: 'popup', //It pops up the consent screen when the anchor tag is clicked
                response_type: 'code', // This tells Google to append code to the response which will be sent to the backend which exchange the code for a token
                access_type: 'offline',
                prompt: 'consent'
            });
            const url = `https://accounts.google.com/o/oauth2/v2/auth?${queryParams}`
            const googleLogo = (
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="google-logo"><g><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></g></svg>
            )
            const content = (
                <section className='login-section'>
                    <form className='login-form'>
                        <label htmlFor="login">
                            Log In to Messenger with Google
                        </label>
                        <button type='button' id="login" className='login-form-button' onClick={() => window.location.href = url}>{googleLogo}<p>Continue with Google</p></button>
                    </form>
                </section>
            )
            return content
        }
    }
}

export default Login
