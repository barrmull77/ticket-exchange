import React, { useState, useEffect } from 'react';
import { Container, CircularProgress, Box, Typography } from '@mui/material';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
import LoginDialog from '../../components/LoginDialog';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { useAppDispatch, RootState } from '../../store';
import { loginRequest } from "../../authConfig";
import { setAccessToken, fetchLoginToken, fetchDummyLoginToken } from '../../store/features/authSlice';

export const Loginpage = ({ ...props }) => {
    const { instance, accounts } = useMsal();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { state } = useLocation();
    const isAuthenticated = useIsAuthenticated();
    const authError = useSelector((state: RootState) => state.auth.error);
    const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [toggleMicrosoftLogin, setToggleMicrosoftLogin] = useState<boolean>(false);

    const handleMicrosoftLogin = () => {
        
        if (toggleMicrosoftLogin) {
            instance.loginPopup(loginRequest)
            .then(e => {
                setIsLoading(true);
                console.log(e);
            })
            .catch(error => {
                setError(true);
                console.error(error);
            });
        } else {
            setIsLoading(true);
        }
       
    }

    useEffect(() => {
        if (isLoggedIn) {
            setIsLoading(false);
            const redirectUrl =
                state && state.pathname && state.search
                    ? state.pathname + state.search
                    : state && state.pathname
                    ? state.pathname
                    : '/home';

            navigate(redirectUrl);
        }
    },[isLoggedIn]);

    useEffect(() => {
        if(authError.length > 0) {
            setError(true);
        }
    },[authError]);

    useEffect(() => {
    
        // In the original implementation a MSAL access token was retrieved first and was then used to access our backend API
        if (isAuthenticated) {

            const request = {
                ...loginRequest,
                account: accounts[0],
            };

            instance.acquireTokenSilent(request)
                .then(({ accessToken }) => {
                    dispatch(fetchLoginToken(accessToken));
                })
                .catch(function(error) {
                    setError(true);
                });
        }
    }, [accounts, instance, isAuthenticated]);

    // For demonstration the MSAL login is bypassed and the user is automatically logged in, comment out this useEffect to remove the bypass
    useEffect(()=> {
        dispatch(fetchDummyLoginToken());
    },[isLoading]);

    return (
        <Container sx={{ marginTop: '5rem'}}>
            {!isLoading && !error && <LoginDialog handleLogin={handleMicrosoftLogin} />}
            {isLoading && !error && <CircularProgress size='4rem' sx={{ marginTop: '12rem'}}/>}
            {error && (
                <Box sx={{marginTop: '4rem'}}>
                    <Typography variant='h2'>
                        Unfortunately there was an error when logging in
                    </Typography>
                    <Link to='/login' style={{ textDecoration: 'none'}}>
                        <Typography variant='h5' color='primary' onClick={() => {
                            setError(false)}}>
                            Please try again
                        </Typography>
                    </Link>
                </Box>
            )}
        </Container>
    );
}

export default Loginpage;
