import React from 'react';
import { Modal, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SettingsPage from '../pages/settings';
import '../styles/modals.css';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ open, onClose }) => (
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
      <SettingsPage />
    </Box>
  </Modal>
);

export default SettingsModal;