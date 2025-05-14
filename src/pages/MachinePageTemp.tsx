import React, { useState } from 'react';
import '../styles/machine.css';
import IconButton from '@mui/material/IconButton';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

function MachinePageTemp() {
  const [mode, setMode] = useState<'machine' | 'control'>('machine');

  return (
    <div className={`machine-page ${mode}-mode`}>
      <div className="machine-display">
        <h2>Machine Dialogue</h2>
      </div>

      <div className="middle-toggle">
        <IconButton
          onClick={() => setMode(mode === 'machine' ? 'control' : 'machine')}
          sx={{
            color: 'var(--text)',
            backgroundColor: 'transparent',
            '&:hover': {
              backgroundColor: 'var(--background-primary)',
            },
          }}
        >
          <SwapHorizIcon />
        </IconButton>
      </div>

      <div className="control-display">
        <h2>Image Generator</h2>
      </div>
    </div>
  );
}

export default MachinePageTemp;
