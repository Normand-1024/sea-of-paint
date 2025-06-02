/** App.tsx */

import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

/** Icons */
import InfoIcon from '@mui/icons-material/Info';
import SettingsIcon from '@mui/icons-material/Settings';

/** Modals */
import CustomModal from './modals/modal';

/** App Pages */
import MainMenuPage from './pages/menu.tsx';
import IntroPage from './pages/intro';
import MachinePage from './pages/machine.tsx';
import PaintingPage from './pages/painting.tsx';
import EndPage from './pages/end.tsx';

import { PAGE_STATE } from './constants';


function App() {
  const [pageState, setPageState] = useState(PAGE_STATE.menu);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [memorabilia, setMemorabilia] = useState([["", "", -1, -1, ""], ["", "", -1, -1, ""], ["", "", -1, -1, ""]]);

  const RESET_LIMIT = 30000; // KK: 30 seconds

  const resetToMenu = useCallback(() => {
    setPageState(PAGE_STATE.menu);
  }, []);

  /** KK: reset timer manager */
  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout;
    let warningTimer: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      clearTimeout(warningTimer);
      setShowWarningModal(false);

      inactivityTimer = setTimeout(() => {
        resetToMenu();
      }, RESET_LIMIT);

      warningTimer = setTimeout(() => {
        setShowWarningModal(true);
      }, RESET_LIMIT - 10000); // KK: 10 seconds remaining before reset
    };

    const events = ['click', 'keydown', 'mousemove', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer));
      clearTimeout(inactivityTimer);
      clearTimeout(warningTimer);
    };
  }, [resetToMenu]);

  if (pageState === PAGE_STATE.menu) {
    return <MainMenuPage pageState={pageState} setPageState={setPageState} />;
  }
  else if (pageState == PAGE_STATE.intro){
    return <IntroPage pageState={pageState} setPageState={setPageState} />;
  }
  else if (pageState == PAGE_STATE.ending){
    return <EndPage pageState={pageState} setPageState={setPageState} />;
  }
  else {
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
            {pageState == PAGE_STATE['machine'] && 
              <MachinePage pageState={pageState} setPageState={setPageState}
                        memorabilia={memorabilia} setMemorabilia={setMemorabilia}></MachinePage>}

            {pageState == PAGE_STATE['painting'] && 
              <PaintingPage pageState={pageState} setPageState={setPageState}></PaintingPage>}

            {/** Modals */}
            <CustomModal open={showInfoModal} onClose={() => setShowInfoModal(false)} type="info" />
            <CustomModal open={showSettingsModal} onClose={() => setShowSettingsModal(false)} type="settings" />
            <CustomModal open={showWarningModal} onClose={() => setShowWarningModal(false)} type="warning" />
          </div>

        </div>
      );
  }
}

export default App;