/** App.tsx */

import React, { useState } from 'react';
import './App.css';

/** Icons */
import InfoIcon from '@mui/icons-material/Info';
import SettingsIcon from '@mui/icons-material/Settings';

/** Modals */
import InfoModal from './modals/info';
import SettingsModal from './modals/settings';

/** App Pages */
import IntroPage from './pages/intro';
import ActivateMachine from './pages/activate';
import MachinePageTemp from './pages/MachinePageTemp';
import MachinePage from './pages/machine.tsx'
import PaintingPage from './pages/painting.tsx';

import { PAGE_STATE } from './constants';


function App() {
  const [pageState, setPageState] = useState(PAGE_STATE.intro);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  if (pageState === PAGE_STATE.intro) {
    return <IntroPage pageState={pageState} setPageState={() => setPageState(PAGE_STATE.activate)} />;
  }

  return (
    <div className="app-container">

      {/** Menu Sidebar */}
      <div className="menu">
        <div className="menu-buttons">
          <button onClick={() => setShowInfoModal(true)}>
            <InfoIcon />
          </button>
          <button onClick={() => setShowSettingsModal(true)}>
            <SettingsIcon />
          </button>
        </div>
      </div>

      {/** Main Screen */}
      <div id="main-screen" className="main-screen">
        {pageState === PAGE_STATE['activate'] && 
          <ActivateMachine onActivate={() => { setPageState(PAGE_STATE.machine); }} />}
        
        {pageState == PAGE_STATE['machine'] && <MachinePageTemp />}
        {/**  {pageState == PAGE_STATE['machine'] && 
          <MachinePage pageState={pageState} setPageState={setPageState}></MachinePage>}  */}

        {pageState == PAGE_STATE['painting'] && 
          <PaintingPage pageState={pageState} setPageState={setPageState}></PaintingPage>}

        {/** Modals */}
        <InfoModal open={showInfoModal} onClose={() => setShowInfoModal(false)} />
        <SettingsModal open={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
      </div>

    </div>
  );
}

export default App;