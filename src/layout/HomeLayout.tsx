import React, { useEffect,useState } from 'react';
import {Helmet} from "react-helmet";
import { Box, styled } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import Header from '../components/Header';

const HomeLayout = () => {
    const user = useSelector((state: RootState) => state.auth.userProfile);
    const [appVersion, setAppVersion] = useState<string>('');

    useEffect(() => {
        if (user && user.appVersion) {
            setAppVersion(user.appVersion);
        }
    },[user])

    return (
        <Box sx={{ display: 'flex' }}>
            <Helmet>
                <title>{`TicketExchange, version: ${appVersion}`}</title>
            </Helmet>
            <Header />
            <Outlet />
        </Box>
    );
};

export default HomeLayout;
