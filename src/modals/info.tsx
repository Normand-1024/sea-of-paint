import React from 'react';
import '../styles/modals.css';
import '../styles/colors.css';
import { Modal, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InfoPage from '../pages/info';

interface InfoModalProps {
  open: boolean;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ open, onClose }) => (
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
      <InfoPage />
    </Box>
  </Modal>
);

export default InfoModal;