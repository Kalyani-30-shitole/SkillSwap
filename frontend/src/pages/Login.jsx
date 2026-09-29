import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Login.css";

const API_URL = import.meta.env.VITE_API_URL;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  //if user came from Explore, return to Explore after login
  const from = location.state?.from || "/";

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);

        if (data.user) {
          localStorage.setItem(
            "user",
            JSON.stringify(data.user)
          );
        }

        navigate(from, { replace: true });
      } else {
        alert(data.message || "Invalid email or password");
      }

    } catch (error) {
      console.error(error);
      alert("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">
        <div className="login-brand">
          <div className="login-logo">S</div>

          <div>
            <h2>SkillSwap</h2>
            <p>Learn • Teach • Grow</p>
          </div>
        </div>

        <div className="login-heading">
          <h1>Welcome back</h1>
          <p>
            Login to continue your skill exchange journey.
          </p>
        </div>

        <form onSubmit={handleLogin}>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <div className="password-label">
              <label>Password</label>
            </div>

            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <div className="register-text">
          Don't have an account?

          <button
            onClick={() => navigate("/register")}>
            Create an account
          </button>
        </div>

      </div>

    </div>
  );
}

export default Login;