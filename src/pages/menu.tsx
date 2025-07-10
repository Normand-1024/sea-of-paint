import React, { useState } from 'react';
import { PAGE_STATE } from '../constants';
import CustomModal from '../modals/modal';
import '../styles/menu.css';

type MenuProps = {
  pageState: number;
  setPageState: (s: number) => void;
};

const MainMenuPage: React.FC<MenuProps> = ({ setPageState }) => {
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [showBibliographyModal, setShowBibliographyModal] = useState(false);
  const [isFading, setIsFading] = useState(false);

  const nextPage = () => {
    setIsFading(true);

    setTimeout(() => {
      setPageState(PAGE_STATE.intro);
    }, 2000);
  };

  return (
    <div className={`menu-wrapper ${isFading ? 'fade-out' : ''}`}>
      <img src="./assets/images/title.png" />

      <div onClick={nextPage} className="butt">
        - Start Game -
      </div>

      <div onClick={() => setShowCreditModal(true)} className="butt">
        - Credits -
      </div>

      <div onClick={() => setShowBibliographyModal(true)} className="butt">
        - References -
      </div>

      {/** Modal */}
      <CustomModal open={showCreditModal} onClose={() => setShowCreditModal(false)} type="credits"
        setPageState={setPageState} />
      <CustomModal open={showBibliographyModal} onClose={() => setShowBibliographyModal(false)} type="bibliography" 
        setPageState={setPageState}/>
    </div>
  );
};

export default MainMenuPage;
