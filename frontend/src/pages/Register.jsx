import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name,
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful!");

        navigate("/login");
      } else {
        alert(data.message || "Registration failed");
      }

    } catch (error) {
      console.error(error);
      alert("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      <div className="register-card">
        <div className="register-brand">

          <div className="register-logo">
            S
          </div>

          <div>
            <h2>SkillSwap</h2>
            <p>Learn • Teach • Grow</p>
          </div>

        </div>


        <div className="register-heading">
          <h1>Create your account</h1>
          <p>
            Join SkillSwap and start exchanging skills.
          </p>
        </div>

        <form onSubmit={handleRegister}>

          <div className="register-group">
            <label>Full name</label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

          </div>

          <div className="register-group">

            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}/>

          </div>

          <div className="register-group">

            <label>Password</label>

            <div className="register-password">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }>
                {showPassword ? "Hide" : "Show"}
              </button>

            </div>
          </div>


          <div className="register-group">

            <label>Confirm password</label>

            <div className="register-password">
              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }>
                {showConfirmPassword
                  ? "Hide"
                  : "Show"}
              </button>
            </div>

          </div>

          <button
            type="submit"
            className="register-button"
            disabled={loading}>
            {loading
              ? "Creating account..."
              : "Create account"}
          </button>

        </form>

        <div className="login-text">

          Already have an account?

          <button
            onClick={() => navigate("/login")}>
            Login
          </button>

        </div>

      </div>

    </div>
  );
}

export default Register;