import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"

/* username, contacts, avatar, email, id */
export const authSlice = createSlice({
    name: 'auth',
    initialState: { id: '', username: null, contacts: [], avatar: null, email: null, contactRequests: [], url: '' },
    reducers: {
        setCredentials: (state, action) => {
            const { id, username, contacts, avatar, email, contactRequests } = action.payload
            state.id = id
            state.username = username
            state.contacts = contacts
            state.avatar = avatar
            state.email = email
            state.contactRequests = contactRequests
        },
        logOut: (state) => {
            state.id = ''
            state.username = null
            state.contacts = []
            state.avatar = null
            state.email = null
            state.contactRequests = []

        },
        setChattUrl: (state) => {
            state.url = document.location.href
        }
    }
})
export default authSlice.reducer

export const { setCredentials, logOut, setChattUrl } = authSlice.actions
export const selectCurrentUser = (state: RootState) => state.authSlice
export const selectCurrentUserId = (state: RootState) => state.authSlice.id
export const selectCurrentUserRequests = (state: RootState) => state.authSlice.contactRequests
export const selectChatUrl = (state: RootState) => state.authSlice.url;
