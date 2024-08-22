// components/ConfirmationDialog/ConfirmationDialog.jsx
import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { styled } from '@mui/system';

const CustomDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        borderRadius: '20px',
        padding: theme.spacing(3),
        backgroundColor: theme.palette.background.default,
    },
}));

const CustomDialogTitle = styled(DialogTitle)(({ theme }) => ({
    textAlign: 'center',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: theme.palette.primary.main,
    paddingBottom: theme.spacing(2),
}));

const CustomDialogContent = styled(DialogContent)(({ theme }) => ({
    textAlign: 'center',
    fontSize: '1.2rem',
    color: theme.palette.text.primary,
}));

const CustomDialogActions = styled(DialogActions)(({ theme }) => ({
    justifyContent: 'center',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
}));

const CustomButton = styled(Button)(({ theme }) => ({
    borderRadius: '10px',
    padding: theme.spacing(1, 4),
    fontSize: '1rem',
    fontWeight: 'bold',
    textTransform: 'none',
}));

function ConfirmationDialog({ open, handleClose, handleConfirm, title, content }) {
    return (
        <CustomDialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <CustomDialogTitle id="alert-dialog-title">
                {title}
            </CustomDialogTitle>
            <CustomDialogContent>
                <DialogContentText id="alert-dialog-description">
                    {content}
                </DialogContentText>
            </CustomDialogContent>
            <CustomDialogActions>
                <CustomButton onClick={handleClose} color="secondary" variant="contained">
                    Cancelar
                </CustomButton>
                <CustomButton onClick={handleConfirm} color="primary" variant="contained">
                    Confirmar
                </CustomButton>
            </CustomDialogActions>
        </CustomDialog>
    );
}

export default ConfirmationDialog;
