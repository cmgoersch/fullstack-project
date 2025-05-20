import React from 'react';

const Dashboard = ({ currentUser }) => {
  return (
    <div className="dashboard">
      <h1>Willkommen, {currentUser?.username}!</h1>
    </div>
  );
};

export default Dashboard;