import { useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router";

import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./components/Dashboard";
import Welcome from "./components/Welcome";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <>
      <Header currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute currentUser={currentUser}>
              <Dashboard currentUser={currentUser} />
            </PrivateRoute>
          }
        />
      </Routes>
     
    </>
  );
}

export default App;
