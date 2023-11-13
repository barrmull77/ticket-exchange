import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { Box, Button, Grid, Typography} from '@mui/material';
import { styled } from '@mui/material/styles';
import LaunchIcon from '@mui/icons-material/Launch';
import LaunchBooksIcon from '@mui/icons-material/LibraryBooks';

const StyledLandingButton = styled(Button)(({theme}) =>({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '140px',
    padding: '2rem',
    backgroundColor: theme.palette.grey[300],

    '&:hover': {
        backgroundColor: theme.palette.grey[400],
    },

    [theme.breakpoints.up('sm')]: {
        height: '320px',
        padding: '1.4rem',
    },

    [theme.breakpoints.up('laptop')]: {
        height: '470px',
        padding: '2rem',
    }
}));

const StyledIconContainer = styled(Box)(({ theme }) => ({
    marginTop: 'auto',

    [theme.breakpoints.up('sm')]: {
        marginBottom: '4rem'
    },
    [theme.breakpoints.up('laptop')]: {
        marginBottom: '8rem'
    }
}));

const LandingNav =  () => {
    const navigate = useNavigate();

    const handleLandingNavButton = (path: string) => {
        navigate(path);
    }

    return (
        <Box>
            <Typography variant="h1" sx={{ flex: 1, margin: {xs: '.8rem 0', md: '2rem 0'}, textAlign: 'left'}}>
                What would you like to do today?
            </Typography>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 4 }}>
                <Grid item xs={12} sm={6}>
                    <StyledLandingButton variant="contained" onClick={() => handleLandingNavButton('/mytasks')}>
                        <Typography variant="h2" sx={{textAlign: 'left'}} color="common.black">
                            View and create your own Tasks
                        </Typography>
                        <StyledIconContainer>
                            <LaunchIcon color='primary' sx={{fontSize: {xs: '4rem', sm: '6rem', md: '8rem'}}} />
                        </StyledIconContainer>
                    </StyledLandingButton>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StyledLandingButton variant="contained" onClick={() => {
                        handleLandingNavButton('/alltasks')
                    }
                    }>
                        <Typography variant="h2" sx={{textAlign: 'left'}} color="common.black">
                            Browse and apply for tasks
                        </Typography>
                        <StyledIconContainer>
                            <LaunchBooksIcon color='primary' sx={{fontSize: {xs: '4rem', sm: '6rem', md: '8rem'}}} />
                        </StyledIconContainer>
                    </StyledLandingButton>
                </Grid>
            </Grid>
        </Box>
    );
}

export default LandingNav;
