import React, { useState } from 'react';
import { Box, Typography, Slider, Stack, Button } from '@mui/material';
import { getVolume, setVolume, getSpeedMode, setSpeedMode, SpeedMode } from '../globals';
import '../styles/settings.css';
import '../styles/colors.css';

const speedOptions: { value: SpeedMode; label: string }[] = [
  { value: 'very-slow', label: 'Very Slow' },
  { value: 'slow',      label: 'Slow'      },
  { value: 'normal',    label: 'Normal'    },
  { value: 'fast',      label: 'Fast'      },
  { value: 'very-fast', label: 'Very Fast' },
];

const SettingsPage: React.FC = () => {
  const [vol, setVolState] = useState<number>(getVolume() * 100);
  // derive initial index from current speed mode
  const initialSpeedIndex = speedOptions.findIndex(
    opt => opt.value === getSpeedMode()
  );
  const [speedIndex, setSpeedIndex] = useState<number>(
    initialSpeedIndex >= 0 ? initialSpeedIndex : 2
  );

  const handleVolumeChange = (
    _event: Event,
    newValue: number | number[]
  ) => {
    const pct = Array.isArray(newValue) ? newValue[0] : newValue;
    setVolState(pct);
    setVolume(pct / 100);
  };

  const handleSpeedSlider = (
    _event: Event,
    newValue: number | number[]
  ) => {
    const idx = Array.isArray(newValue) ? newValue[0] : newValue;
    setSpeedIndex(idx);
    const mode = speedOptions[idx].value;
    setSpeedMode(mode);
  };

  return (
    <div className="settings-wrapper">
      <h1>Game Settings</h1>

      <div className = "slider-wrapper">
        <p>Volume: {vol}%</p>
        <Slider
          value={vol}
          onChange={handleVolumeChange}
          aria-labelledby="volume-slider"
          min={0}
          max={100}
          valueLabelDisplay="auto"
        />
      </div>

      <div className="slider-wrapper">
       <p>Animation Speed: {speedOptions[speedIndex].label}</p>
        <Slider
          value={speedIndex}
          onChange={handleSpeedSlider}
          aria-labelledby="speed-slider"
          min={0}
          max={speedOptions.length - 1}
          step={1}
          marks={speedOptions.map((opt, idx) => ({
            value: idx,
            label: opt.label,
          }))}
          valueLabelDisplay="off"
        />
      </div>

      <div className="button-wrapper">
        <Button className="shutdown-button" variant="outlined">
          Shutdown Machine
        </Button>
        <Button className="restart-button" variant="outlined">
          Restart Game
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
