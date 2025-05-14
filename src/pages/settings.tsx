import React from 'react';
import '../styles/settings.css';

const SettingsPage: React.FC = () => {
  return (
    <div className="settings-wrapper">
      <h1>Settings Page</h1>
      <p>User can modify volume here?</p>
      <p>User can shut down machine here?</p>
      <p>User can restart game here?</p>
    </div>
  );
};

export default SettingsPage;