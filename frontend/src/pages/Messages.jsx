import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Messages.css";

const API_URL = import.meta.env.VITE_API_URL;

function Messages() {
    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

    const getUnreadMessages = async () => {

        try {

            const response = await fetch(
                `${API_URL}/api/messages/unread`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (response.ok) {
                setMessages(data.messages || []);
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUnreadMessages();
    }, []);

    return (
        <div className="messages-page">

            <h1>💬 Messages</h1>

            {loading && (
                <p>Loading messages...</p>
            )}

            {!loading && messages.length === 0 && (
                <p>No new messages.</p>
            )}

            {!loading &&
                messages.map((msg) => (

                    <div
                        key={msg._id}
                        className="message-notification-card"
                        onClick={() =>
                            navigate(
                                `/chat/${msg.sender?._id}`,
                                {
                                    state: {
                                        name: msg.sender?.name
                                    }
                                })
                        }>

                        <h3>{msg.sender?.name}</h3>

                        <p>{msg.message}
                        </p>

                        <small>
                            {new Date(
                                msg.createdAt
                            ).toLocaleString()}
                        </small>

                    </div>

                ))}

        </div>
    );
}

export default Messages;