import { useState, useEffect } from "react";
import { useNavigate } from "react-router"; 
import "./Header.css";

const Header = ({ currentUser, setCurrentUser, setUserTodos }) => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5500/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const user = await response.json();

      if (response.ok && user?.username) {
        setCurrentUser(user);
        setErrorMsg("");
        setUsername("");
        setPassword("");

        if (setUserTodos) {
          const todosRes = await fetch("http://localhost:5500/todos", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ userID: user.userID }),
});
          const todos = await todosRes.json();
          setUserTodos(todos);
        }

        navigate("/dashboard");
      } else {
        setErrorMsg("Benutzername oder Passwort falsch");
      }
    } catch (error) {
      console.error("Login-Fehler:", error);
      setErrorMsg("Serverfehler – bitte später erneut versuchen");
    }
  };

  // Logout-Handler
  const handleLogout = () => {
    console.log("🚪 Logging out...");
    setCurrentUser(null);
    navigate("/");
  };

  const goToDashboard = () => {
    navigate("/dashboard");
  };

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
      <h2 className="logo">Where is my data?</h2>

      {errorMsg && <div className="popup-error">{errorMsg}</div>}

      <div className="log-wrapper">
        {currentUser ? (
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