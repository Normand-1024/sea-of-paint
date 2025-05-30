import React, { useState } from 'react';
import '../styles/menu.css';
import { PAGE_STATE } from '../constants';
import CreditModal from '../modals/credit';
import BibliographyModal from '../modals/bibliography';

type MenuProps = {
  pageState: number;
  setPageState: (s: number) => void;
};

const MainMenuPage: React.FC<MenuProps> = ({ setPageState }) => {
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [showBibliographyModal, setShowBibliographyModal] = useState(false);

  const nextPage = () => {
    setPageState(PAGE_STATE.intro);
  };

  return (
    <div className="menu-wrapper">
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
