import { useEffect, useState } from "react";
import {
    useParams,
    useNavigate,
    useLocation
} from "react-router-dom";

import "./Chat.css";

function Chat() {

    const { userId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    const storedUser = localStorage.getItem("user");

    const user = storedUser
        ? JSON.parse(storedUser)
        : null;

    // Person we are chatting with
    const otherUserName =
        location.state?.name || "SkillSwap User";


    // =========================
    // GET MESSAGES
    // =========================

    const getMessages = async () => {

        try {

            if (!token || !user) {
                navigate("/login");
                return;
            }

            const response = await fetch(
                `http://localhost:5000/api/messages/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();
if (response.ok) {

    setMessages(data.messages || []);
    setError("");

    // Mark messages from this user as read
    await fetch(
        `http://localhost:5000/api/messages/read/${userId}`,
        {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

            } else {

                setError(
                    data.message ||
                    "Unable to load messages."
                );
            }

        } catch (error) {

            console.log(error);

            setError(
                "Something went wrong while loading messages."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        getMessages();

    }, [userId]);


    // =========================
    // SEND MESSAGE
    // =========================

    const sendMessage = async (e) => {

        e.preventDefault();

        if (newMessage.trim() === "") {
            return;
        }

        try {

            setSending(true);

            const response = await fetch(
                "http://localhost:5000/api/messages",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        receiver: userId,
                        message: newMessage.trim()
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {

                setMessages((prev) => [
                    ...prev,
                    data.data
                ]);

                setNewMessage("");
                setError("");

            } else {

                setError(
                    data.message ||
                    "Message could not be sent."
                );
            }

        } catch (error) {

            console.log(error);

            setError(
                "Something went wrong while sending the message."
            );

        } finally {

            setSending(false);

        }
    };


    return (

        <div className="chat-page">

            {/* =========================
                WHATSAPP STYLE HEADER
            ========================= */}

            <div className="chat-header">

                <button
                    className="back-button"
                    onClick={() => navigate("/requests")}
                >
                    ←
                </button>

                <div className="chat-avatar">
                    {otherUserName.charAt(0).toUpperCase()}
                </div>

                <div className="chat-user-info">

                    <h2>
                        {otherUserName}
                    </h2>

                    <span>
                        SkillSwap conversation
                    </span>

                </div>

            </div>


            {/* =========================
                CHAT BOX
            ========================= */}

            <div className="chat-container">


                {/* MESSAGES */}

                <div className="messages-container">

                    {loading && (

                        <div className="chat-message-info">
                            Loading messages...
                        </div>

                    )}


                    {!loading && error && (

                        <div className="chat-error">
                            {error}
                        </div>

                    )}


                    {!loading &&
                        !error &&
                        messages.length === 0 && (

                            <div className="empty-chat">

                                <div className="empty-chat-icon">
                                    💬
                                </div>

                                <h3>
                                    No messages yet
                                </h3>

                                <p>
                                    Start a conversation with{" "}
                                    {otherUserName}
                                </p>

                            </div>

                        )}


                    {!loading &&
                        !error &&
                        messages.map((msg) => {

                           const currentUserId =
    user?._id || user?.id;

const messageSenderId =
    typeof msg.sender === "object"
        ? msg.sender?._id
        : msg.sender;

const isMine =
    String(messageSenderId) ===
    String(currentUserId);  

                            return (

                                <div
                                    key={msg._id}
                                    className={
                                        isMine
                                            ? "message-row my-message"
                                            : "message-row other-message"
                                    }
                                >

                                    <div className="message-bubble">

                                        {/* NAME */}

                                        <div className="message-sender">

                                            {isMine
                                                ? "You"
                                                : otherUserName}

                                        </div>


                                        {/* MESSAGE */}

                                        <div className="message-text">

                                            {msg.message}

                                        </div>


                                        {/* TIME */}

                                        <div className="message-time">

                                            {new Date(
                                                msg.createdAt
                                            ).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            })}

                                        </div>

                                    </div>

                                </div>

                            );

                        })}

                </div>


                {/* =========================
                    MESSAGE INPUT
                ========================= */}

                <form
                    className="chat-input-area"
                    onSubmit={sendMessage}
                >

                    <input
                        type="text"
                        placeholder={`Message ${otherUserName}...`}
                        value={newMessage}
                        onChange={(e) =>
                            setNewMessage(e.target.value)
                        }
                        disabled={sending}
                    />

                    <button
                        type="submit"
                        disabled={
                            sending ||
                            newMessage.trim() === ""
                        }
                    >
                        {sending ? "..." : "➤"}
                    </button>

                </form>

            </div>

        </div>
    );
}

export default Chat;