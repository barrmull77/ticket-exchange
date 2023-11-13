import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import theme from '../../themes/BMThemes';

const StyledDialogTitleTypography = styled(Typography)(({theme}) => ({
    fontSize: '1.5rem',
    [theme.breakpoints.up('sm')]: {
        fontSize: '2.2rem',
    },
}));

const StyledDialogContentTypography = styled(Typography)(({theme}) => ({
    fontSize: '1rem',
    [theme.breakpoints.up('sm')]: {
        fontSize: '1.2rem',
    },
}));

export default function LoginDialog({...props}) {
    const [open, setOpen] = useState<boolean>(true);

    const handleClose = () => {
        console.log("closed");
    };

    const handleChange = () => {
        props.handleLogin();
    }

    return (
        <Dialog
            onClose={handleClose}
            open={open}
            PaperProps={{
                sx: {
                    textAlign: 'center',
                    border: `solid 2px ${theme.palette.primary.main}`
                }
            }}
        >
            <DialogTitle
                color="primary.main"
                component="h5"
                sx={{
                    mb: 2,
                    mx: {
                        sm: '3'
                    }
                }}
            >
                <StyledDialogTitleTypography>
                    Welcome to TicketExchange 
                </StyledDialogTitleTypography>
            </DialogTitle>
            <DialogContent>
                <StyledDialogContentTypography variant="body1" >
                    Please login with your Microsoft account
                </StyledDialogContentTypography>
            </DialogContent>
            <DialogActions sx={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '1rem',
            }}>
                <Button
                    onClick={handleChange}
                    variant="contained"
                    color="secondary"
                    startIcon={<img src="/assets/ms-logo.svg"
                                    alt="ms-logo" />}>
                    Login with Microsoft account
                </Button>
            </DialogActions>
        </Dialog>
    )
}
