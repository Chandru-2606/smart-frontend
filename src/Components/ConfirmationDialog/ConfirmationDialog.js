import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography
} from '@mui/material';

const ConfirmationDialog = ({ open, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', type = 'delete' }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
    >
      <DialogTitle id="confirmation-dialog-title">
        {title || (type === 'delete' ? 'Confirm Delete' : 'Confirm Action')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="confirmation-dialog-description">
          {message || (type === 'delete' ? 'Are you sure you want to delete this item? This action cannot be undone.' : 'Are you sure you want to proceed?')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {cancelText}
        </Button>
        <Button onClick={onConfirm} color={type === 'delete' ? 'error' : 'primary'} variant="contained" autoFocus>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;

