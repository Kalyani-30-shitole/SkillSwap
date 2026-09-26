import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const token = localStorage.getItem("token");

  const storedUser = localStorage.getItem("user");

  let userName = "";
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      userName = user.name || "";
    } catch (error) {
      userName = "";
    }
  }

  const handleExplore = () => {
    if (token) {
      navigate("/login");
    } else {
      setShowLogin(true);
    }
  };

  const handleProfile = () => {
    if (token) {
      navigate("/profile");
    } else {
      setShowLogin(true);
    }
  };
  return (
    <main className="home">

      <section className="hero-section">

        <div className="hero-content">
          {token && userName ? (
            <p className="welcome-text">
              Welcome back, {userName}
            </p>
          ) : (
            <p className="welcome-text">
              Welcome to SkillSwap
            </p>
          )}
          <h1>
            Exchange Skills.<br />
            <span>Grow Together.</span>
          </h1>
          <p className="hero-description">
            Learn new skills, share what you know,
            and connect with people who want to learn
            and grow together.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-button"
              onClick={handleExplore} >
              Explore Skills
            </button>
            
            <button
              className="secondary-button"
              onClick={handleProfile} >
              Share Your Skill
            </button>

          </div>
        </div>

        <div className="hero-visual">

          <div className="visual-card card-one">
            <span>React</span>
            <small>Teach</small>
          </div>

          <div className="visual-card card-two">
            <span>Python</span>
            <small>Learn</small>
          </div>

          <div className="visual-card card-three">
            <span>UI/UX</span>
            <small>Exchange</small>
          </div>

          <div className="circle-design">
            <img src="/skillswap img.png" />
          </div>

        </div>
      </section>

      <section className="about-section">
        <p className="section-label">
          ABOUT SKILLSWAP
        </p>
        <h2>
          Learn from people. <br />
          Share what you know.
        </h2>
        <p className="section-description">
          SkillSwap is a platform where people can exchange
          knowledge with each other. Find someone who can
          teach you a skill while sharing your own knowledge
          in return.
        </p>
      </section>

      <section className="how-section">
        <p className="section-label">
          HOW IT WORKS
        </p>
        <h2>Simple way to exchange Skills</h2>

        <div className="steps">

          <div className="step">
            <span>01</span>
            <h3>Create your profile</h3>
            <p>
              Add the skills you can teach and
              the skills you want to learn.
            </p>
          </div>

          <div className="step">
            <span>02</span>
            <h3>Find a skill</h3>
            <p>
              Explore people who can teach
              the skills you want to learn.
            </p>
          </div>

          <div className="step">
            <span>03</span>
            <h3>Send a Request</h3>
            <p>
              Send a skill exchange request
              to another user.
            </p>
          </div>

          <div className="step">
            <span>04</span>
            <h3>Learn together</h3>
            <p>
              Connect with each other and
              start exchanging knowledge.
            </p>
          </div>
        </div>

      </section>

      <section className="cta-section">
        <div>
          <p className="section-label">
            START YOUR JOURNEY
          </p>
          <h2>
            Have a skill to share?
          </h2>
          <p>
            Your knowledge could help someone
            learn something new.
          </p>
        </div>

        <button
          onClick={handleProfile}
          className="cta-button">
          {token ? "Go to Profile" : "Create Profile"}
        </button>
      </section>

      {showLogin && (
        <div
          className="login-overlay"
          onClick={() => setShowLogin(false)} >
          <div
            className="login-popup"
            onClick={(e) => e.stopPropagation()}>

            <button
              className="close-popup"
              onClick={() => setShowLogin(false)}>
              ×
            </button>

            <h2>Login Required</h2>
            <p>
              Please login to explore skills and
              connect with other users.
            </p>

            <button
              className="popup-login"
              onClick={() => navigate("/login")}>
              Login
            </button>

            <button
              className="popup-register"
              onClick={() => navigate("/register")} >
              New user? Register
            </button>
            
          </div>
        </div>
      )}
    </main>
  );
}
export default Home;