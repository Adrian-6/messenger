import { useEffect, useState, useRef } from "react";
import Message from "./Message";
import { useGetChatMutation } from "./chatApiSlice";
import { useAppSelector } from "../../app/hooks";
import { useParams } from "react-router-dom";
import { pusherClient } from "../../app/pusherClient";
import { selectChatUrl } from "../auth/authSlice";
import ChatInput from "./ChatInput";
import ChatHeader from "./ChatHeader"
import { useAppDispatch } from "../../app/hooks";
import { setChattUrl } from "../auth/authSlice";
import { Loading } from "../../assets/Loading";
import { useGetContactsQuery } from "../chat/chatApiSlice"
import { IUser } from "../../../..";

const Chat = () => {
    interface Message {
        userId: string;
        body: string;
        timestamp: string;
    }

    interface IChat {
        data: {
            user: IUser,
            chat: {
                users: [string],
                messages: [
                    Message
                ]
            }
        }
    }

    const chatRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = (behavior: ScrollBehavior) => {
        const element = document.getElementById('chat-list');
        if (!element) {
            return
        }
        let chatHeight = element.scrollHeight
        element.scrollTo({
            top: chatHeight,
            behavior,
        });
    }
    const dispatch = useAppDispatch()
    const pusher = pusherClient
    const { chatId } = useParams()
    const [messages, setMessages] = useState<Message[] | undefined>([])
    const [contact, setContact] = useState<IUser | undefined>()
    const [scrollEffect, setScrollEffect] = useState<ScrollBehavior>('auto')
    const [effectRan, setEffectRan] = useState(false)
    const [getChat, {
        isLoading,
        error
    }] = useGetChatMutation()

    let chatUrl = useAppSelector(selectChatUrl)
    if (!chatUrl) {
        dispatch(setChattUrl())
    }
    let currentUrl = chatUrl ? chatUrl.split('/').pop() : chatId

    const {
        refetch
    } = useGetContactsQuery()

    const isGetChatType = (data: any): data is IChat => 'data' in data

    const getData = async () => {
        await getChat(currentUrl as string)
            .then((res) => {
                if (isGetChatType(res)) {
                    setMessages(res.data.chat.messages)
                    setContact(res.data.user)
                }
            }
            ).catch((e) => {
                console.log(e)
            })
    }

    useEffect(() => {
        setScrollEffect('auto')
        if (currentUrl) {
            let channel = pusher.subscribe(currentUrl) // channel = chat ID
            channel.unbind()
            channel.bind('new-message', async (data: any) => {
                //callback
                setScrollEffect('smooth')
                refetch()
                setMessages((prev) => [...prev!, data.newMessage])
            })
        }
        if (currentUrl && currentUrl !== "/chat" && currentUrl !== 'chat/' && currentUrl !== 'chat') {
            getData()
        }
    }, [chatUrl])

    useEffect(() => {
        scrollToBottom(scrollEffect)
    }, [messages])

    let chatHeader = (currentUrl && contact) ? (<ChatHeader username={contact.username} avatar={contact.avatar} />) : null

    let messagesList = messages ? (messages.map((message: Message, index) => {
        return (
            <Message userId={message.userId} timestamp={message.timestamp} body={message.body} key={index} />
        )
    })
    ) : null

    if (currentUrl === '' || null || undefined || currentUrl === 'chat') return <></>
    if (isLoading) return <Loading />
    if (error) {
        throw new Error('Chat not found')
    } else {
        return (
            <div className="chat-area">
                {chatHeader}
                <div className="chat" id="chat" ref={chatRef}>
                    <ul id="chat-list">
                        {messagesList}
                    </ul>
                </div>
                <ChatInput chatId={currentUrl} />
            </div>
        )
    }
}

export default Chat
