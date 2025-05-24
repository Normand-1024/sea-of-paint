import React from 'react';
import Button from '@mui/material/Button';
import '../styles/activate.css';

interface ActivateMachineProps {
  onActivate: () => void;
}

const ActivateMachine: React.FC<ActivateMachineProps> = ({ onActivate }) => {
  return (
    <div className="machine-activate-wrapper">
      <div className="machine-card-content">
        <img id="nameCard" src="./assets/images/namecard.png" alt="Name Card" />
        <Button className="activate-button" onClick={onActivate}>
          Activate Machine, bring back Mey
        </Button>
      </div>
    </div>
  );
};

export default ActivateMachine;
