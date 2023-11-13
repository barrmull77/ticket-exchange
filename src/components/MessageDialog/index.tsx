import React, { useEffect, useState } from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const MessageDialog =  ({...props}) => {

    return (
        <Dialog
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {props.message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                {props.confirmMessage !== 'Ok' && <Button onClick={props.handleClose}>Back</Button>}
                <Button onClick={props.handleOk} autoFocus>
                    {props.confirmMessage}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default MessageDialog;
