import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Requests.css";

function Requests() {
    //used for states for storing requests and loading status
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    //to fetch incoming and send requests for log-in user
    const getRequests = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                alert("Please login first.");
                setLoading(false);
                return;
            }

            const response = await fetch(
                "http://localhost:5000/api/requests",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (response.ok) {
                setRequests(data.requests || []);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.log(error);
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const markRequestsAsRead = async () => {
    try {
        const token = localStorage.getItem("token");

        if (!token) return;

        await fetch(
            "http://localhost:5000/api/requests/read",
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
    } catch (error) {
        console.log("Mark requests as read error:", error);
    }
};

    useEffect(() => {
        getRequests();
        markRequestsAsRead();
    }, []);

    const incomingRequests = requests.filter(
        (request) => request.type === "received"
    );

    const sentRequests = requests.filter(
        (request) => request.type === "sent"
    );

    const updateRequest = async (requestId, status) => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:5000/api/requests/${requestId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },

                    body: JSON.stringify({
                        status: status,
                    }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                getRequests();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.log(error);
            alert("Something went wrong");
        }
    };

    if (loading) {
        return (
            <div className="requests-page">

                <div className="requests-loading">

                    <div
                        className="spinner-border"
                        role="status">
                        <span className="visually-hidden">
                            Loading...
                        </span>
                    </div>

                    <p>Loading requests...</p>

                </div>
            </div>
        );
    }

    return (
        <div className="requests-page">

            <div className="requests-header">
                <h1>Exchange Requests</h1>
                <p>
                    Manage your skill exchange requests.
                </p>

            </div>


            {requests.length === 0 ? (

                <div className="empty-requests">

                    <div className="empty-icon">
                        📭
                    </div>

                    <h3>No exchange requests</h3>
                    <p>
                        You don't have any skill exchange requests yet.
                    </p>

                </div>

            ) : (

                <div className="requests-container">

                    <div className="requests-top">

                        <h2>Incoming Requests</h2>

                        <span className="request-count">
                            {incomingRequests.length}{" "}
                            {incomingRequests.length === 1
                                ? "Request"
                                : "Requests"}
                        </span>

                    </div>


                    {incomingRequests.length === 0 ? (

                        <div className="no-request-section">
                            <p>No incoming requests.</p>
                        </div>

                    ) : (

                        <div className="row g-4">

                            {incomingRequests.map((request) => (

                                <div
                                    className="col-md-6 col-lg-4"
                                    key={request._id}>

                                    <div className="request-card">

                                        <div className="request-user">

                                            <div className="request-avatar">
                                                {request.sender?.name
                                                    ?.charAt(0)
                                                    .toUpperCase()}
                                            </div>

                                            <div>

                                                <h4>
                                                    {request.sender?.name ||
                                                        "Unknown User"}
                                                </h4>
                                                <p>{request.sender?.email}</p>

                                            </div>

                                        </div>

                                        <hr />


                                        <div className="request-skill">

                                            <p>🧑‍🏫 Skill Offered</p>

                                            <span className="skill-badge offered">
                                                {request.skillOffered}
                                            </span>

                                        </div>

                                        <div className="request-skill">
                                            <p>🎓 Skill Wanted </p>

                                            <span className="skill-badge wanted">
                                                {request.skillWanted}
                                            </span>
                                        </div>

                                        <div className="request-status">
                                            <p>Status</p>

                                            {request.status === "pending" && (
                                                <span className="status pending">
                                                    ● Pending
                                                </span>
                                            )}

                                            {request.status === "accepted" && (
                                                <span className="status accepted">
                                                    ● Accepted
                                                </span>
                                            )}

                                            {request.status === "rejected" && (
                                                <span className="status rejected">
                                                    ● Rejected
                                                </span>
                                            )}

                                        </div>

                                        {request.status === "pending" && (

                                            <div className="request-actions">

                                                <button
                                                    className="btn accept-button"
                                                    onClick={() =>
                                                        updateRequest(
                                                            request._id,
                                                            "accepted"
                                                        )
                                                    }>
                                                    ✓ Accept
                                                </button>

                                                <button
                                                    className="btn reject-button"
                                                    onClick={() =>
                                                        updateRequest(
                                                            request._id,
                                                            "rejected"
                                                        )
                                                    }
                                                >
                                                    ✕ Reject
                                                </button>

                                            </div>

                                        )}


                                        {request.status === "accepted" && (

                                            <div className="accepted-message">

                                                <div>
                                                    ✓ You accepted{" "}
                                                    {request.sender?.name}'s request
                                                </div>

                                    {/* allow user to start chatting after request is accepted */}
                                                <button
                                                    className="message-button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/chat/${request.sender?._id}`,{
                                                                state: {
                                                                    name: request.sender?.name
                                                                }
                                                            }
                                                        )
                                                    }
                                                >
                                                    💬 Message
                                                </button>

                                            </div>

                                        )}

                                        {request.status === "rejected" && (

                                            <div className="rejected-message">

                                                ✕ You rejected{" "}
                                                {request.sender?.name}'s request

                                            </div>

                                        )}

                                    </div>
                                </div>

                            ))}
                        </div>

                    )}


                    <div className="requests-top sent-title">
                        <h2>Sent Requests</h2>
                        <span className="request-count">
                            {sentRequests.length}{" "}
                            {sentRequests.length === 1
                                ? "Request"
                                : "Requests"}
                        </span>
                    </div>


                    {sentRequests.length === 0 ? (

                        <div className="no-request-section">
                            <p>
                                You haven't sent any requests.
                            </p>
                        </div>

                    ) : (

                        <div className="row g-4">

                            {sentRequests.map((request) => (

                                <div
                                    className="col-md-6 col-lg-4"
                                    key={request._id}>

                                    <div className="request-card">

                                        <div className="request-user">

                                            <div className="request-avatar">
                                                {request.receiver?.name
                                                    ?.charAt(0)
                                                    .toUpperCase()}
                                            </div>

                                            <div>

                                                <h4>
                                                    {request.receiver?.name ||
                                                        "Unknown User"}
                                                </h4>

                                                <p>{request.receiver?.email}</p>

                                            </div>

                                        </div>

                                        <hr />

                                        <div className="request-skill">
                                            <p> 🧑‍🏫 You Offered</p>

                                            <span className="skill-badge offered">
                                                {request.skillOffered}
                                            </span>

                                        </div>

                                        <div className="request-skill">

                                            <p>🎓 You Wanted</p>

                                            <span className="skill-badge wanted">
                                                {request.skillWanted}
                                            </span>

                                        </div>

                                        <div className="request-status">

                                            <p>Status</p>

                                            {request.status === "pending" && (
                                                <span className="status pending">
                                                    ● Pending
                                                </span>
                                            )}

                                            {request.status === "accepted" && (
                                                <span className="status accepted">
                                                    ● Accepted
                                                </span>
                                            )}

                                            {request.status === "rejected" && (
                                                <span className="status rejected">
                                                    ● Rejected
                                                </span>
                                            )}

                                        </div>

                                        {request.status === "pending" && (

                                            <div className="waiting-message">

                                                ⏳ Waiting for{" "}
                                                {request.receiver?.name}{" "}
                                                to respond

                                            </div>

                                        )}

                                        {request.status === "accepted" && (

                                            <div className="accepted-message">

                                                <div>
                                                    ✓ {request.receiver?.name}{" "}
                                                    accepted your request
                                                </div>


                                                <button
                                                    className="message-button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/chat/${request.receiver?._id}`,{
                                                                state:{
                                                                    name: request.receiver?.name
                                                                }
                                                            }
                                                        )
                                                    }
                                                >
                                                    💬 Message
                                                </button>

                                            </div>

                                        )}

                                        {request.status === "rejected" && (

                                            <div className="rejected-message">

                                                ✕ {request.receiver?.name}{" "}
                                                rejected your request

                                            </div>

                                        )}

                                    </div>
                                </div>

                            ))}

                        </div>
                    )}

                </div>

            )}

        </div>
    );
}

export default Requests;