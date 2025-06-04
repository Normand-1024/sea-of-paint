/** App.tsx */

import React, { useState, useEffect, useCallback, useRef, MutableRefObject } from 'react';
import './App.css';

/** Icons */
import InfoIcon from '@mui/icons-material/Info';
import SettingsIcon from '@mui/icons-material/Settings';

/** Modals */
import CustomModal from './modals/modal';

/** Audio */
import { AudioManager } from './managers/audio';

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
  const [audioManager, setAM] = useState(new AudioManager());
  // const audioManager:React.MutableRefObject<AudioManager|null> = useRef<AudioManager|null>(null);

  const RESET_LIMIT = 60000 * 5; // 5 mins
  const WARNING_LIMIT = 60000 * 4; // 4 mins

  useEffect(() => {
    return () => {
      audioManager.dispose();
    };
  }, []);

  const resetToMenu = useCallback(() => {
    setPageState(PAGE_STATE.menu);
    audioManager.play(0, true);
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
        setShowWarningModal(false);
      }, RESET_LIMIT);

      warningTimer = setTimeout(() => {
        setShowWarningModal(true);
      }, WARNING_LIMIT);
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

  useEffect(() => {
    if(pageState == PAGE_STATE.menu){
      audioManager.play(0, true);
    }
  }, [pageState]);

  if (pageState === PAGE_STATE.menu) {
    return <MainMenuPage pageState={pageState} setPageState={setPageState}/>;
  }
  else if (pageState == PAGE_STATE.intro){
    return <IntroPage pageState={pageState} setPageState={setPageState} />;
  }
  else if (pageState == PAGE_STATE.end){
    return <EndPage pageState={pageState} setPageState={setPageState} memorabilia={memorabilia} />;
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
                        memorabilia={memorabilia} setMemorabilia={setMemorabilia}
                        audio={audioManager}></MachinePage>}

            {/** Modals */}
            <CustomModal open={showInfoModal} onClose={() => setShowInfoModal(false)} type="info"
              setPageState={setPageState} />
            <CustomModal open={showSettingsModal} onClose={() => setShowSettingsModal(false)} type="settings" 
              setPageState={setPageState} />
            <CustomModal open={showWarningModal} onClose={() => setShowWarningModal(false)} type="warning" 
              setPageState={setPageState} />
          </div>

        </div>
      );
  }
}

export default App;