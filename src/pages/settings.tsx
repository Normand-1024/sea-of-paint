import React, { useState } from 'react';
import { Slider, Button } from '@mui/material';
import { getMusicVolume, setMusicVolume, getSfxVolume, setSfxVolume, getSpeedMode, setSpeedMode, SpeedMode } from '../globals';
import '../styles/modals.css';

const speedOptions: { value: SpeedMode; label: string }[] = [
  { value: 'very-slow', label: 'Very Slow' },
  { value: 'slow',      label: 'Slow'      },
  { value: 'normal',    label: 'Normal'    },
  { value: 'fast',      label: 'Fast'      },
  { value: 'very-fast', label: 'Very Fast' },
];

const SettingsPage: React.FC = () => {
  const [mVol, setMusicVolState] = useState<number>(getMusicVolume() * 100);
  const [sfxVol, setSfxVolState] = useState<number>(getSfxVolume() * 100);
  const initialSpeedIndex = speedOptions.findIndex(
    opt => opt.value === getSpeedMode()
  );
  const [speedIndex, setSpeedIndex] = useState<number>(
    initialSpeedIndex >= 0 ? initialSpeedIndex : 2
  );

  const handleMusicVolumeChange = (
    _event: Event,
    newValue: number | number[]
  ) => {
    const pct = Array.isArray(newValue) ? newValue[0] : newValue;
    setMusicVolState(pct);
    setMusicVolume(pct / 100);
  };

  const handleSfxVolumeChange = (
    _event: Event,
    newValue: number | number[]
  ) => {
    const pct = Array.isArray(newValue) ? newValue[0] : newValue;
    setSfxVolState(pct);
    setSfxVolume(pct / 100);
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
    <div className="content-wrapper">
      <h1>Game Settings</h1>

      <div className = "slider-wrapper">
        <p>Music Volume: {mVol}%</p>
        <Slider
          value={mVol}
          onChange={handleMusicVolumeChange}
          aria-labelledby="volume-slider"
          min={0}
          max={100}
          valueLabelDisplay="auto"
        />
      </div>

      <div className = "slider-wrapper">
        <p>Sound Effect Volume: {sfxVol}%</p>
        <Slider
          value={sfxVol}
          onChange={handleSfxVolumeChange}
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
        <Button className="restart-button" variant="outlined">
          Back to Main Menu
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
