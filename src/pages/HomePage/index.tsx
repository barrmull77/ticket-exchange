import React from 'react';
import { Container } from '@mui/material';
import LandingNav from '../../components/LandingNav'

export const Homepage = () => {
    return (
        <Container sx={{ marginTop: '5rem'}}>
            <LandingNav />
        </Container>
    );
}

export default Homepage;
