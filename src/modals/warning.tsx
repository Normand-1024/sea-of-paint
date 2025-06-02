import React from 'react';
import { Modal, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WarningPage from '../pages/warning';
import '../styles/modals.css';

interface CreditModalProps {
  open: boolean;
  onClose: () => void;
}

const WarningModal: React.FC<CreditModalProps> = ({ open, onClose }) => (
  <Modal
    className="modal-root"
    open={open}
    onClose={onClose}
    slotProps={{ backdrop: { sx: { backgroundColor: "var(--menu-background" }} }}
  >
    <Box id="warning-modal" className="modal-content" onClick={e => e.stopPropagation()}>
      <IconButton aria-label="close" className="modal-close" onClick={onClose}>
        <CloseIcon />
      </IconButton>
      <WarningPage />
    </Box>
  </Modal>
);

export default WarningModal;