import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"

/* username, contacts, avatar, email, id */

type authState = {
    id: string
    username: string | null
    contacts: string[] | null
    avatar: string | null
    email: string | null
    contactRequests: string[]
    url: string
}
export const authSlice = createSlice({
    name: 'auth',
    initialState: { id: '', username: null, contacts: [], avatar: null, email: null, contactRequests: [], url: '' } as authState,
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
        },
        pushNewContact: (state, action) => {
            state.contactRequests.push(action.payload.id)
        }
    }
})
export default authSlice.reducer

export const { setCredentials, logOut, setChattUrl, pushNewContact } = authSlice.actions
export const selectCurrentUser = (state: RootState) => state.authSlice
export const selectCurrentUserId = (state: RootState) => state.authSlice.id
export const selectChatUrl = (state: RootState) => state.authSlice.url;
