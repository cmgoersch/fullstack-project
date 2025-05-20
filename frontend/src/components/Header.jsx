import { useNavigate } from "react-router";
import "./Header.css";
import { useState, useEffect } from "react";

const Header = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(!!currentUser);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "1234") {
      const user = { username };
      setCurrentUser(user);
      setIsLoggedIn(true);
      setErrorMsg("");
      setUsername("");
      setPassword("");
    } else {
      setErrorMsg("Benutzername oder Passwort falsch");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    navigate("/");
  };

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  // Popup auto-clear after 3 seconds
  useEffect(() => {
    if (errorMsg) {
      const timeout = setTimeout(() => {
        setErrorMsg("");
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [errorMsg]);

  return (
    <header className="header-wrapper">
      <h2 className="logo">WHEREMYHEADAT?</h2>

      {errorMsg && <div className="popup-error">{errorMsg}</div>}

      <div className="log-wrapper">
        {isLoggedIn ? (
          <>
            <button className="dashboard-btn" onClick={goToDashboard}>
              Dashboard
            </button>
            <button className="login-btn" onClick={handleLogout}>
              LOGOUT
            </button>
          </>
        ) : (
          <form className="login-inline-form" onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Benutzername"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Passwort"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="login-btn">
              LOGIN
            </button>
          </form>
        )}
      </div>
    </header>
  );
};

export default Header;