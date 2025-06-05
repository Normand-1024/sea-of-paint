import React from 'react';
import '../styles/modals.css';

const CreditsPage: React.FC = () => {
  return (
    <div className="content-wrapper">
      <h1>Credits</h1>
      <p>
        <b>Story</b><br/>
        Hongwei Zhou, Fandi Meng
        <br/>
        <br/>
        <b>Writing</b><br/>
        Hongwei Zhou
        <br/>
        <br/>
        <b>Art and Programming</b><br/>
        Hongwei Zhou, Katherine Kosolapova
        <br/>
        <br/>
        <b>Music and Sound Design</b><br/>
        Kyle Gonzalez
      </p>
    </div>
  );
};

export default CreditsPage;