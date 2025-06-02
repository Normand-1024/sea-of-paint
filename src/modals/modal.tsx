import React from 'react';
import { Modal, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import '../styles/modals.css';

/** Modal Pages */
import InfoPage from '../pages/info';
import SettingsPage from '../pages/settings';
import BibliographyPage from '../pages/bibliography';
import CreditsPage from '../pages/credits';
import WarningPage from '../pages/warning';

interface CustomModalProps {
  open: boolean;
  onClose: () => void;
  type: 'info' | 'settings' | 'bibliography' | 'credits' | 'warning';
}

const CustomModal: React.FC<CustomModalProps> = ({ open, onClose, type }) => {
  const content = () => {
    switch (type) {
      case 'info':
        return <InfoPage />;
      case 'settings':
        return <SettingsPage />;
      case 'bibliography':
        return <BibliographyPage />;
      case 'credits':
        return <CreditsPage />;
      case 'warning':
        return <WarningPage />;
      default:
        return null;
    }
  };

  const container = () => {
    if (type === 'info' || type === 'settings' || type === 'warning') {
      return document.getElementById('main-screen') ?? undefined;
    }
    return undefined;
  };

  return (
    <Modal
      className="modal-root"
      container={container()}
      open={open}
      onClose={onClose}
      slotProps={{ backdrop: { sx: { backgroundColor: "var(--menu-background" }} }}
    >
      <Box id={`${type}-modal`} className="modal-content" onClick={e => e.stopPropagation()} >
        <IconButton aria-label="close" className="modal-close" onClick={onClose}>
        <CloseIcon />
      </IconButton>
        {content()}
      </Box>
    </Modal>
  );
};

export default CustomModal;
