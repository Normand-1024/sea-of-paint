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
import MainMenuPage from './pages/menu.tsx';
import IntroPage from './pages/intro';
import ActivateMachine from './pages/activate';
import MachinePage from './pages/machine.tsx'
import PaintingPage from './pages/painting.tsx';
import EndPage from './pages/end.tsx';

import { PAGE_STATE } from './constants';


function App() {
  const [pageState, setPageState] = useState(PAGE_STATE.menu);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [memorabilia, setMemorabilia] = useState([["", "", -1, -1, ""], ["", "", -1, -1, ""], ["", "", -1, -1, ""]]);

  if (pageState === PAGE_STATE.menu) {
    return <MainMenuPage pageState={pageState} setPageState={setPageState} />;
  }
  else if (pageState == PAGE_STATE.intro){
    return <IntroPage pageState={pageState} setPageState={setPageState} />;
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
            {pageState === PAGE_STATE['activate'] && 
              <ActivateMachine onActivate={() => { setPageState(PAGE_STATE.machine); }} />}

            {pageState == PAGE_STATE['machine'] && 
              <MachinePage pageState={pageState} setPageState={setPageState}
                        memorabilia={memorabilia} setMemorabilia={setMemorabilia}></MachinePage>}

            {pageState == PAGE_STATE['end'] && 
              <EndPage pageState={pageState} setPageState={setPageState}
                      memorabilia={memorabilia}></EndPage>}

            {/** Modals */}
            <InfoModal open={showInfoModal} onClose={() => setShowInfoModal(false)} />
            <SettingsModal open={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
          </div>

        </div>
      );
  }
}

export default App;