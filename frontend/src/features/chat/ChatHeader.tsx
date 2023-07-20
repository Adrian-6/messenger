import ArrowBackIcon from '@mui/icons-material/ArrowBack';

type headerProps = {
    avatar: string;
    username: string;
}
const ChatHeader = (props: headerProps
) => {
    return (
        <div className="chat-header">
            <a href="/" className="mobile"><ArrowBackIcon /></a>
            <img className="contact-img header-img" src={props.avatar} alt="profile picture"
                onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src = "https://cdn-icons-png.flaticon.com/512/166/166347.png?w=826&t=st=1679619593~exp=1679620193~hmac=f34a680fa3d7d06914e0740ef84f42370e0aa2e2b33c467a4a4d0392ec31250a";
                }}
            />
            <h3 className="chat-header_name">
                {props.username}
            </h3>
        </div>
    )
}

export default ChatHeader