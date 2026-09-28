import { useState, useEffect } from "react";
import "./Explore.css";

function Explore() {
    const [skill, setSkill] = useState("");
    const [skillOffered, setSkillOffered] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [sentRequests, setSentRequests] = useState([]);

useEffect(() => {
    loadSentRequests();
}, []);

const loadSentRequests = async () => {
    try {
        const token = localStorage.getItem("token");

        if (!token) return;

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
            const pendingSentRequests = (data.requests || [])
                .filter(
                    (request) =>
                        request.type === "sent" &&
                        request.status === "pending"
                )
                .map((request) => request.receiver?._id);

            setSentRequests(pendingSentRequests);
        }
    } catch (error) {
        console.log("Unable to load sent requests:", error);
    }
};
    // Search users by skill
    const searchUsers = async () => {
        if (skill.trim() === "") {     //trim remove space 
            setMessage("Please enter a skill you want to learn.");
            setUsers([]);
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            await loadSentRequests();

            const response = await fetch(
                `http://localhost:5000/api/users/skill/${encodeURIComponent(
                    skill.trim()
                )}`
            );

            const data = await response.json();   //converts response to json

            if (response.ok) {
                setUsers(data.users || []);

                if (!data.users || data.users.length === 0) {
                    setMessage(
                        `No users found who can teach ${skill.trim()}.`
                    );
                }
            } else {
                setUsers([]);
                setMessage(data.message || "Unable to find users.");
            }
        } catch (error) {
            console.log(error);
            setUsers([]);
            setMessage("Something went wrong. Please try again.");
        } finally {    //runs whether request succeed or fails.
            setLoading(false);
        }
    };

    // Send exchange request
    const sendRequest = async (userId) => {
        if (skillOffered.trim() === "") {
            alert("Please enter the skill you can teach.");
            return;
        }

        try {
            const token = localStorage.getItem("token");  //to retrieve token
            if (!token) {
                alert("Please login first.");
                return;
            }

            const response = await fetch(
                "http://localhost:5000/api/requests",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({   //used to convert js object into JSON string before sending it to backend
                        receiver: userId,
                        skillOffered: skillOffered.trim(),
                        skillWanted: skill.trim(),
                    }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                setSentRequests((prev)=> [...prev, userId]);
            } else {
                alert(data.message || "Failed to send request.");
            }
        } catch (error) {
            console.log(error);
            alert("Something went wrong.");
        }
    };

    return (
        <div className="explore-page">

            <div className="explore-header">
                <h1>Explore Skills</h1>
                <p>Find people who can teach you and exchange your knowledge.</p>
            </div>

            <div className="explore-search">
                <div className="search-field">

                    <label className="form-label">
                        Skill you want to learn
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Example: Python"
                        value={skill}
                        onChange={(e) => setSkill(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                searchUsers();
                            }
                        }}/>
                </div>

                <div className="search-field">

                    <label className="form-label">
                        Skill you can teach
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Example: React"
                        value={skillOffered}
                        onChange={(e) => setSkillOffered(e.target.value)}/>
                </div>

                <button
                    className="btn btn-dark search-button"
                    onClick={searchUsers}
                    disabled={loading}>
                    {loading ? "Searching..." : "🔍 Search Skills"}
                </button>

            </div>

            {loading && (
                <div className="explore-message">

                    <div
                        className="spinner-border"
                        role="status">
                        <span className="visually-hidden">
                            Searching...
                        </span>
                    </div>

                    <p>Finding skill partners...</p>

                </div>
            )}


            {message && !loading && (
                <div className="explore-message">
                    {message}
                </div>
            )}

            {users.length > 0 && !loading && (

                <section className="explore-results">

                    <div className="results-header">
                        <div>
                            <h2>Skill Partners</h2>
                            <p>
                                People who can teach you{" "}
                                <strong>{skill}</strong>
                            </p>
                        </div>
                        <span className="results-count">
                            {users.length} Found
                        </span>

                    </div>

                    <div className="row g-4">
                        {users.map((user) => (

                            <div
                                className="col-md-6 col-lg-4"
                                key={user._id}>

                                <div className="card h-100 border-0 shadow-sm">
                                    <div className="card-body p-4">
                                        <div className="user-info">

                                            <div className="user-avatar">
                                                {user.name
                                                    ?.charAt(0)
                                                    .toUpperCase()}
                                            </div>

                                            <div>
                                                <h5>{user.name}</h5>
                                                <p>{user.email}</p>
                                            </div>
                                        </div>

                                        <hr />

                                        <div className="skill-section">
                                            <h6>🧑‍🏫 Can teach</h6>
                                            <div>
                                                {user.teachSkills?.map(
                                                    (teachSkill, index) => (
                                                        <span
                                                            className="skill-badge teach-badge"
                                                            key={index}>
                                                            {teachSkill}
                                                        </span>
                                                    )
                                                )}
                                            </div>

                                        </div>

                                        <div className="skill-section">
                                            <h6>🎓 Wants to learn</h6>
                                            <div>
                                                {user.learnSkills?.map(
                                                    (learnSkill, index) => (
                                                        <span
                                                            className="skill-badge learn-badge"
                                                            key={index}>
                                                            {learnSkill}
                                                        </span>
                                                    )
                                                )}
                                            </div>

                                        </div>

                                        <button
                                            className="btn btn-success request-button"
                                            onClick={() =>
                                                sendRequest(user._id)}
                                                disabled={sentRequests.includes(user._id)}>
                                                    {
                                                        sentRequests.includes(user._id)
                                                        ? "✓ Request Sent" : "🤝 Send Request"
                                                    }
                                        </button>

                                    </div>
                                </div>

                            </div>

                        ))}
                    </div>

                </section>
            )}

        </div>
    );
}

export default Explore;