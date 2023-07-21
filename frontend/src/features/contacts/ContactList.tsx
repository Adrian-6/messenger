import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { IContact } from '../../../../index'
import { useAppSelector } from "../../app/hooks"
import { pusherClient } from "../../app/pusherClient"
import { Loading } from '../../assets/Loading'
import { useGetUserInfoQuery, useSendLogoutMutation } from "../auth/authApiSlice"
import { selectChatUrl, selectCurrentUser } from "../auth/authSlice"
import { useGetContactsQuery } from "../chat/chatApiSlice"
import AddContact from "../user/AddContact"
import Contact from "./Contact"
import ContactRequest from "./ContactRequest"


const ContactList = () => {

    const currentUser = useAppSelector(state => selectCurrentUser(state))
    const chats: string[] | null = currentUser.contacts
    const pusher = pusherClient
    const navigate = useNavigate()
    const [requests, setRequests] = useState<string[]>([])
    const [active, setActive] = useState(false)

    let chatUrl: string = useAppSelector(selectChatUrl)
    let currentUrl = chatUrl ? chatUrl.split('/').pop() : null

    const [logout] = useSendLogoutMutation()

    const handleLogout = async () => {
        await logout()
        navigate('/auth')
    }
    const { refetch: refetchCurrentUser } = useGetUserInfoQuery()

    const {
        data: contacts,
        isLoading,
        refetch
    } = useGetContactsQuery()

    useEffect(() => {
        try {
            if (chats && currentUser) {
                setRequests(currentUser.contactRequests!)
                let channels = chats.map(channelName => pusher.subscribe(channelName));

                for (let channel of channels) {
                    channel.bind('new-message', async () => {
                        //callback
                        refetch()
                    })
                }
                pusher.bind('new-channel', async () => {
                    //callback
                    refetch()
                })
            }
        } catch (e) {
            console.log(e)
        }
    }, [chats, requests, currentUser])

    useEffect(() => {
        pusher.signin()

        pusher.bind('contact-request', async () => {
            await refetchCurrentUser()
        })
    }, [])

    let menuActive = active ? 'menu-active' : 'menu-notActive'

    let contactsList: IContact[] = []

    const RequestsList = requests.length !== 0 ? (
        <>
            <div className="contact-requests">
                <div className="contact-requests_header">
                    Contact Requests
                </div>
                {
                    requests.map((contact, index) => (
                        <ContactRequest contact={contact} key={index} />
                    ))

                }
            </div>
        </>
    )
        : null

    if (contacts) {
        Object.values(contacts as IContact[]).forEach(function (chat: IContact, index) {
            contactsList.push(chat)
        })
    }

    const chatList = contactsList.length > 0 ?
        (
            contactsList.map((chat, index) => {
                if (chat.chatId === currentUrl) {
                    return <Contact chatId={chat.chatId} lastMessage={chat.lastMessage} targetUser={chat.targetUser} key={index} activeContact={true} />
                } else {
                    return <Contact chatId={chat.chatId} lastMessage={chat.lastMessage} targetUser={chat.targetUser} key={index} />
                }
            })
        ) : <p className="chat-info">Add a new contact using the button at the bottom</p>

    const isActiveMobile = (currentUrl === null || currentUrl === '' || currentUrl === '/') ? 'sidebar-active' : null
    if (!isLoading) {
        return (
            <div className={`sidebar ${isActiveMobile}`}>
                <div className="current-user-card">
                    <div className="current-user-left">
                        <img className="contact-img" alt="profile picture" src={currentUser.avatar || "https://cdn-icons-png.flaticon.com/512/166/166347.png?w=826&t=st=1679619593~exp=1679620193~hmac=f34a680fa3d7d06914e0740ef84f42370e0aa2e2b33c467a4a4d0392ec31250a"}></img>
                        <div className="contact-name">{currentUser.username}</div>
                    </div>
                    <button className={`open-menu-button`} aria-label="menu" onClick={() => setActive(prev => !prev)}><ExpandMoreIcon className={menuActive} /></button>
                </div>
                <div className={menuActive}>
                    <ul className="menu">
                        <li>
                            <button className="menu-button" onClick={handleLogout}>Log Out</button>
                        </li>
                    </ul>
                </div>
                <div className="contact-list">
                    {chatList}
                </div>
                {RequestsList}
                <AddContact />
            </div>
        )
    } else {
        return (
            <div className={`sidebar ${isActiveMobile}`}>
                <Loading />
            </div>
        )
    }
}

export default ContactList