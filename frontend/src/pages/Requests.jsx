import { useEffect, useState } from "react";
import "./Requests.css";

function Requests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        getRequests();
    }, []);

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
                <p>Manage your skill exchange requests.</p>
            </div>

            {requests.length === 0 ? (

                <div className="empty-requests">
                    <div className="empty-icon">
                        📭
                    </div>

                    <h3>No exchange requests</h3>
                    <p>You don't have any skill exchange requests yet.</p>

                </div>

            ) : (

                <div className="requests-container">

                    <div className="requests-top">
                        <h2>Your Requests</h2>
                        <span className="request-count">
                            {requests.length}{" "}
                            {requests.length === 1
                                ? "Request"
                                : "Requests"}
                        </span>
                    </div>


                    <div className="row g-4">

                        {requests.map((request) => (

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
                                        <p>🎓 Skill Wanted</p>
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
                                                } >
                                                ✕ Reject
                                            </button>

                                        </div>
                                    )}
                                </div>

                            </div>

                        ))}

                    </div>
                </div>

            )}

        </div>
    );
}

export default Requests;