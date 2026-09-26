import { Link} from "react-router-dom";

function Navbar(){
    return(
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">

                <Link className="navbar-brand fw-bold" to="/">
                SkillSwap
                </Link>

                <button className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarMenu"
                aria-controls="navbarMenu"
                aria-expanded="false"
                aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarMenu">

                <div className="navbar-nav ms-auto">

                <Link className="nav-link" to="/">Home</Link>
                <Link className="nav-link" to="/explore">Explore Skills</Link>
                <Link className="nav-link" to="/requests">Requests</Link>
                <Link className="nav-link" to="/login">Login</Link>
                <Link className="nav-link" to="/register">Register</Link>
                <Link className="nav-link" to="/profile">My Profile</Link>

              </div>
            </div>
            </div>
        </nav>
    )
}
export default Navbar;