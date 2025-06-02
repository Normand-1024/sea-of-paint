import React, { useState } from 'react';
import { PAGE_STATE } from '../constants';
import CreditModal from '../modals/credit';
import BibliographyModal from '../modals/bibliography';
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
      <h1>Sea of Paint</h1>

      <button onClick={nextPage} className="button">
        Start Game
      </button>

      <button onClick={() => setShowCreditModal(true)} className="button">
        Credits
      </button>

      <button onClick={() => setShowBibliographyModal(true)} className="button">
        Bibliography
      </button>

      {/** Modal */}
      <CreditModal
        open={showCreditModal}
        onClose={() => setShowCreditModal(false)}
      />
      <BibliographyModal
        open={showBibliographyModal}
        onClose={() => setShowBibliographyModal(false)}
      />
    </div>
  );
};

export default MainMenuPage;
