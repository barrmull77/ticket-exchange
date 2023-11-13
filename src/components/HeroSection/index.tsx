import React, { forwardRef } from 'react';
import { Box, Button, Typography} from '@mui/material';
import { Link, LinkProps } from "react-router-dom";
import { styled } from '@mui/material/styles';
import theme from '../../themes/BMThemes';

type Props = {}

const StyledHeroBox = styled(Box)(({theme}) =>({
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.grey[300],
    padding: '2rem 1.5rem',
    marginTop: '2.2rem',
    marginBottom: '1rem',
    [theme.breakpoints.up('md')]: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: '2rem 4.5rem',
    }
}));

const StyledTaskButton = styled(Button)(({theme}) =>({
    background: theme.palette.primary.main,
    color: '#fff',
    lineHeight: 1,
    borderRadius: '1.2rem',
    fontSize: '1.2rem',
    margin: '0 2rem',
    padding: '.4rem 1.8rem',
    [theme.breakpoints.up('laptop')]: {
        fontSize: '1.8rem'
    }
}));

const HeroSection = (props: Props) => {

    return (
        <StyledHeroBox>
            <Typography data-testid="herosection-text" variant="h1" sx={{ flex: 1, marginBottom: {xs: '.8rem', md: '0'}, textAlign: {xs: 'center', md: 'left'}}}>
                Need help on your project? <br /> Create a new Task
            </Typography>
            <StyledTaskButton href="/createtask" variant="contained" size="large">
                Create Task
            </StyledTaskButton>
        </StyledHeroBox>
    );
}

export default HeroSection;
