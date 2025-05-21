import React from "react";
import "./Welcome.css";

const Welcome = () => {
  return (
    <div className="welcome-container">
      <h1>👋 Willkommen bei <span className="app-name">Where is my data?</span></h1>
      <p className="subtitle">Dein persönliches Todo-Dashboard</p>
      <p className="hint">Bitte melde dich an, um deine Todos zu sehen.</p>
    </div>
  );
};

export default Welcome;