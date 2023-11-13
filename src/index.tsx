import React from 'react';
import ReactDOM from 'react-dom/client';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './store';
import { ThemeProvider,createTheme } from '@mui/material/styles';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { Provider } from 'react-redux';
import theme from './themes/BMThemes'
import { msalConfig } from './authConfig';
import { AxiosInterceptor } from './api/AxiosInterceptor'
import './index.css';
import App from './App';

const msalInstance = new PublicClientApplication(msalConfig);

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <React.StrictMode>
        <MsalProvider instance={msalInstance}>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <ThemeProvider theme={theme}>
                        <AxiosInterceptor>
                            <App />
                        </AxiosInterceptor>
                    </ThemeProvider>
                </PersistGate>
            </Provider>
        </MsalProvider>
    </React.StrictMode>
);
