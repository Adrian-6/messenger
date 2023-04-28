import Chat from "./Chat"
import ChatInput from "./ChatInput"
import ChatHeader from "./ChatHeader"
const ChatArea = () => {
    return (
        <div className="chat-area">
            <ChatHeader />
            <Chat />
        </div>
    )
}

export default ChatArea