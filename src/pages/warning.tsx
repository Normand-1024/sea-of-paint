import React from 'react';
import '../styles/modals.css';

const WarningPage: React.FC = () => {
  return (
    <div className="content-wrapper">
      <h1>Session Timeout Warning</h1>
      <p>You have 1 minute remaining before returning to the main menu! Please interact to contninue playing.</p>
    </div>
  );
};

export default WarningPage;