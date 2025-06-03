import React from 'react';
import '../styles/modals.css';

const WarningPage: React.FC = () => {
  return (
    <div className="content-wrapper">
      <h1>Warning</h1>
      <p>The Session will return to Main Menu in 1 minute due to inactivity</p>
    </div>
  );
};

export default WarningPage;