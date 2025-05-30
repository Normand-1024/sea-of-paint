import React from 'react';
import '../styles/modals.css';
import '../styles/colors.css';
import { Modal, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BibliographyPage from '../pages/bibliography';

interface BibliographyModalProps {
  open: boolean;
  onClose: () => void;
}

const BibliographyModal: React.FC<BibliographyModalProps> = ({ open, onClose }) => (
  <Modal
    className="modal-root"
    container={() => document.getElementById('main-screen')!}
    open={open}
    onClose={onClose}
    slotProps={{ backdrop: { sx: { backgroundColor: "var(--menu-background" }} }}
  >
    <Box className="modal-content" onClick={e => e.stopPropagation()}>
      <IconButton aria-label="close" className="modal-close" onClick={onClose}>
        <CloseIcon />
      </IconButton>
      <BibliographyPage />
    </Box>
  </Modal>
);

export default BibliographyModal;